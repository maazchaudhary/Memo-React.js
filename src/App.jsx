import { useEffect, useMemo, useState } from "react";
import { seedProducts } from "./data/products";
import { categoryPages, infoPages } from "./data/pages";
import { cartKey, currencyKey, deliveryFee, sizeOptions } from "./data/storeConfig";
import { readCart, readConfirmation, readCurrency, cartItemKey, addOnsLabel, addOnsTotal, normalizeAddOns } from "./utils/cart";
import { normalizePath } from "./utils/routing";
import { assetUrl, findProductBySlug } from "./utils/product";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Newsletter from "./components/Newsletter";
import CartDrawer from "./components/CartDrawer";

import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import ContactPage from "./pages/ContactPage";
import InfoPage from "./pages/InfoPage";

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(readCart);
  const [products, setProducts] = useState(seedProducts);
  const [currency, setCurrency] = useState(readCurrency);
  const [message, setMessage] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [stockRequestOpen, setStockRequestOpen] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(readConfirmation);

  const cartQuantity = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  const totals = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
    return {
      subtotal,
      deliveryFee: subtotal > 0 ? deliveryFee : 0,
      finalTotal: subtotal > 0 ? subtotal + deliveryFee : 0
    };
  }, [cart]);

  useEffect(() => {
    const title = categoryPages[path]?.title;
    const pageTitle = title || infoPages[path]?.title || (path === "/contact-us" ? "Contact Us" : "");
    document.title = pageTitle ? `${pageTitle} | Memo by Miraal` : "Memo by Miraal";
  }, [path]);

  useEffect(() => {
    const page = categoryPages[path];
    const isProductPage = path.startsWith("/products/");
    const params = new URLSearchParams();

    if (page?.category) params.set("category", page.category);
    if (!page && !isProductPage) params.set("featured", "true");

    fetch(`/api/products?${params}`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Products failed to load")))
      .then((items) => setProducts(items.length ? items : seedProducts))
      .catch(() => setProducts(seedProducts));
  }, [path]);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(currencyKey, currency);
  }, [currency]);

  useEffect(() => {
    const onScroll = () => {
      document.body.classList.toggle("nav-scrolled", window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.classList.remove("nav-scrolled");
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    document.body.classList.toggle("modal-open", cartOpen);
    return () => document.body.classList.remove("modal-open");
  }, [cartOpen]);

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setCartOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function navigate(to) {
    const [targetPath, hash] = to.split("#");
    const nextPath = normalizePath(targetPath || "/");

    window.history.pushState({}, "", `${nextPath}${hash ? `#${hash}` : ""}`);
    setPath(nextPath);
    setMenuOpen(false);
    setCartOpen(false);
    setMessage("");
    setStockRequestOpen(false);

    window.setTimeout(() => {
      if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  }

  function addToCart(product, size = "Medium", quantity = 1, addOns = []) {
    if (!product) return;

    if (product.out_of_stock) {
      setMessage(`Tell us where to reach you about ${product.title}.`);
      setStockRequestOpen(true);
      return;
    }

    const selectedSize = sizeOptions.includes(size) ? size : "Medium";
    const selectedQuantity = Math.max(1, Math.floor(Number(quantity || 1)));
    const selectedAddOns = normalizeAddOns(addOns);
    const selectedAddOnsTotal = addOnsTotal(selectedAddOns);
    const key = cartItemKey(product.id, selectedSize, selectedAddOns);
    const existing = cart.find((item) => (item.key || cartItemKey(item.product_id, item.size, item.add_ons)) === key);

    setCart((items) =>
      existing
        ? items.map((item) =>
            (item.key || cartItemKey(item.product_id, item.size, item.add_ons)) === key
              ? { ...item, quantity: Number(item.quantity || 0) + selectedQuantity, size: selectedSize, add_ons: selectedAddOns, add_ons_total: selectedAddOnsTotal, key }
              : item
          )
        : [
            ...items,
            {
              key,
              product_id: product.id,
              quantity: selectedQuantity,
              size: selectedSize,
              title: product.title,
              base_price: product.price,
              price: Number(product.price || 0) + selectedAddOnsTotal,
              add_ons: selectedAddOns,
              add_ons_total: selectedAddOnsTotal,
              image_url: assetUrl(product.image_url),
              stock: product.stock
            }
          ]
    );

    setMessage(`${selectedQuantity} x ${product.title} (${selectedSize}${selectedAddOns.length ? `, ${addOnsLabel(selectedAddOns)}` : ""}) added to your bag.`);
    setStockRequestOpen(false);
    setCartOpen(true);
  }

  function updateSize(itemKey, nextSize) {
    if (!sizeOptions.includes(nextSize)) return;

    setCart((items) => {
      const selected = items.find((item) => (item.key || cartItemKey(item.product_id, item.size, item.add_ons)) === itemKey);
      if (!selected) return items;

      const nextKey = cartItemKey(selected.product_id, nextSize, selected.add_ons);
      const duplicate = items.find((item) => (item.key || cartItemKey(item.product_id, item.size, item.add_ons)) === nextKey);

      if (duplicate && duplicate !== selected) {
        const mergedQuantity = Number(duplicate.quantity || 0) + Number(selected.quantity || 0);

        return items
          .filter((item) => (item.key || cartItemKey(item.product_id, item.size, item.add_ons)) !== itemKey)
          .map((item) =>
            (item.key || cartItemKey(item.product_id, item.size, item.add_ons)) === nextKey
              ? { ...item, quantity: mergedQuantity, size: nextSize, key: nextKey }
              : item
          );
      }

      return items.map((item) =>
        (item.key || cartItemKey(item.product_id, item.size, item.add_ons)) === itemKey
          ? { ...item, key: nextKey, size: nextSize }
          : item
      );
    });
  }

  function removeItem(itemKey) {
    setCart((items) => items.filter((item) => (item.key || cartItemKey(item.product_id, item.size, item.add_ons)) !== itemKey));
  }

  const productSlugFromPath = path.startsWith("/products/") ? path.replace("/products/", "") : "";
  const selectedProduct = productSlugFromPath ? findProductBySlug(products, productSlugFromPath) : null;

  let pageContent;

  if (path === "/") {
    pageContent = <HomePage products={products} currency={currency} navigate={navigate} />;
  } else if (path === "/cart") {
    pageContent = (
      <CartPage
        cart={cart}
        totals={totals}
        currency={currency}
        navigate={navigate}
        updateSize={updateSize}
        removeItem={removeItem}
        openCart={() => setCartOpen(true)}
      />
    );
  } else if (path === "/checkout") {
    pageContent = (
      <CheckoutPage
        cart={cart}
        totals={totals}
        currency={currency}
        navigate={navigate}
        setCart={setCart}
        setOrderConfirmation={setOrderConfirmation}
      />
    );
  } else if (path === "/order-confirmation") {
    pageContent = <ConfirmationPage confirmation={orderConfirmation} currency={currency} navigate={navigate} />;
  } else if (path === "/contact-us") {
    pageContent = <ContactPage navigate={navigate} />;
  } else if (infoPages[path]) {
    pageContent = <InfoPage page={infoPages[path]} navigate={navigate} />;
  } else if (productSlugFromPath) {
    pageContent = (
      <ProductDetailPage
        product={selectedProduct}
        products={products}
        currency={currency}
        navigate={navigate}
        onAdd={addToCart}
        message={message}
        stockRequestOpen={stockRequestOpen}
        setStockRequestOpen={setStockRequestOpen}
      />
    );
  } else if (categoryPages[path]) {
    pageContent = <CatalogPage path={path} products={products} currency={currency} navigate={navigate} />;
  } else {
    pageContent = <HomePage products={products} currency={currency} navigate={navigate} />;
  }

  return (
    <>
      <Header
        navigate={navigate}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        cartQuantity={cartQuantity}
        currency={currency}
        setCurrency={setCurrency}
        openCart={() => setCartOpen(true)}
      />

      {pageContent}

      <Newsletter message={newsletterMessage} setMessage={setNewsletterMessage} />

      <Footer navigate={navigate} />

      <a className="whatsapp" href="https://api.whatsapp.com/send?phone=923193746142" aria-label="WhatsApp">{"◔"}</a>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        totals={totals}
        currency={currency}
        navigate={navigate}
        updateSize={updateSize}
        removeItem={removeItem}
      />
    </>
  );
}
