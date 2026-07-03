import { useEffect, useMemo, useState } from "react";
import { seedProducts } from "./data/products";
import { categoryPages, infoPages } from "./data/pages";
import { cartKey, currencyKey, deliveryFee, sizeOptions } from "./data/storeConfig";
import { readCart, readConfirmation, readCurrency, cartItemKey } from "./utils/cart";
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

  function addToCart(product, size = "Medium") {
    if (!product) return;

    if (Number(product.stock || 0) <= 0) {
      setMessage(`Tell us where to reach you when ${product.title} is back.`);
      setStockRequestOpen(true);
      return;
    }

    const selectedSize = sizeOptions.includes(size) ? size : "Medium";
    const key = cartItemKey(product.id, selectedSize);
    const productQuantity = cart
      .filter((item) => item.product_id === product.id)
      .reduce((sum, item) => sum + Number(item.quantity || 0), 0);

    const existing = cart.find((item) => (item.key || cartItemKey(item.product_id, item.size)) === key);

    if ((existing?.quantity || 0) >= product.stock || productQuantity >= product.stock) {
      setMessage(`Only limited stock is available for ${product.title}.`);
      return;
    }

    setCart((items) =>
      existing
        ? items.map((item) =>
            (item.key || cartItemKey(item.product_id, item.size)) === key
              ? { ...item, quantity: Number(item.quantity || 0) + 1, size: selectedSize, key }
              : item
          )
        : [
            ...items,
            {
              key,
              product_id: product.id,
              quantity: 1,
              size: selectedSize,
              title: product.title,
              price: product.price,
              image_url: assetUrl(product.image_url),
              stock: product.stock
            }
          ]
    );

    setMessage(`${product.title} (${selectedSize}) has been added to your bag.`);
    setStockRequestOpen(false);
    setCartOpen(true);
  }

  function updateQuantity(itemKey, value) {
    const quantity = Math.max(1, Number(value || 1));

    setCart((items) =>
      items.map((item) => {
        const key = item.key || cartItemKey(item.product_id, item.size);
        if (key !== itemKey) return item;
        return { ...item, quantity: Math.min(Number(item.stock || quantity), quantity) };
      })
    );
  }

  function updateSize(itemKey, nextSize) {
    if (!sizeOptions.includes(nextSize)) return;

    setCart((items) => {
      const selected = items.find((item) => (item.key || cartItemKey(item.product_id, item.size)) === itemKey);
      if (!selected) return items;

      const nextKey = cartItemKey(selected.product_id, nextSize);
      const duplicate = items.find((item) => (item.key || cartItemKey(item.product_id, item.size)) === nextKey);

      if (duplicate && duplicate !== selected) {
        const mergedQuantity = Math.min(
          Number(duplicate.quantity || 0) + Number(selected.quantity || 0),
          Number(duplicate.stock || selected.stock || 1)
        );

        return items
          .filter((item) => (item.key || cartItemKey(item.product_id, item.size)) !== itemKey)
          .map((item) =>
            (item.key || cartItemKey(item.product_id, item.size)) === nextKey
              ? { ...item, quantity: mergedQuantity, size: nextSize, key: nextKey }
              : item
          );
      }

      return items.map((item) =>
        (item.key || cartItemKey(item.product_id, item.size)) === itemKey
          ? { ...item, key: nextKey, size: nextSize }
          : item
      );
    });
  }

  function removeItem(itemKey) {
    setCart((items) => items.filter((item) => (item.key || cartItemKey(item.product_id, item.size)) !== itemKey));
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
        updateQuantity={updateQuantity}
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
        updateQuantity={updateQuantity}
        updateSize={updateSize}
        removeItem={removeItem}
      />
    </>
  );
}