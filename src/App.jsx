
import { useEffect, useState } from "react";

const cartKey = "memo_cart";
const confirmationKey = "memo_last_order";
const currencyKey = "memo_currency";
const deliveryFee = 250;
const currencies = {
  PKR: { label: "PKR", name: "Pakistan (PKR)", pkrPerUnit: 1, locale: "en-PK", prefix: "PKR " },
  USD: { label: "USD", name: "USA (Dollar)", pkrPerUnit: 278, locale: "en-US", prefix: "$" },
  GBP: { label: "GBP", name: "UK (Pounds)", pkrPerUnit: 352, locale: "en-GB", prefix: "\u00a3" },
  AED: { label: "AED", name: "UAE (AED)", pkrPerUnit: 76, locale: "en-AE", prefix: "AED " },
  CAD: { label: "CAD", name: "Canada (CAD)", pkrPerUnit: 204, locale: "en-CA", prefix: "CAD " }
};
const paymentOptions = ["Cash on Delivery", "Bank Transfer", "EasyPaisa / JazzCash"];
const sizeOptions = ["Extra Small", "Small", "Medium", "Large", "Custom"];
const manualPaymentInstructions = {
  "Bank Transfer": "Transfer the final total to Memo by Miraal bank account and share your reference number. Account details: Memo by Miraal, IBAN PK00 MEMO 0000 0000 0000.",
  "EasyPaisa / JazzCash": "Send the final total to 0308 8844444, account title Memo by Miraal, and enter your transaction ID before submitting."
};
const navItems = [
  ["New Arrivals", "/new-arrivals"],
];
const menuItems = [
  ["Home", "/"],
  ["New Arrivals", "/new-arrivals"],
  ["Contact Us", "/contact-us"],
];

const seedProducts = [
  { id: 1, title: "Dove Purple", summary: "Silk shirt with embroidered details", description: "A graceful silk ensemble finished with delicate embroidery and an easy, flowing silhouette.", price: 25000, category: "the-silk-edit", stock: 14, image_url: "/assets/photos/img_7289.jpg", featured: true },
  { id: 2, title: "Celine", summary: "Pastel embroidered long shirt", description: "A fresh pastel shirt with intricate embroidery, designed for effortless day-to-evening dressing.", price: 16000, category: "everyday-memo", stock: 19, image_url: "/assets/photos/img_9828.jpg", featured: true },
  { id: 3, title: "Rose Garden", summary: "Embroidered occasion ensemble", description: "A refined occasion ensemble featuring floral embroidery and a softly structured drape.", price: 16000, category: "occasion-wear", stock: 8, image_url: "/assets/photos/img_4089.jpg", featured: true },
  { id: 4, title: "Passu", summary: "Botanical sage silk dress", description: "A botanical sage silk dress with tonal detailing and a relaxed, elegant finish.", price: 16000, category: "the-silk-edit", stock: 11, image_url: "/assets/photos/img_4140.jpg", featured: true },
  { id: 5, title: "Bloom", summary: "Easy elegance silk dress", description: "A soft floral silk dress with delicate movement and refined everyday polish.", price: 16000, category: "the-silk-edit", stock: 7, image_url: "/assets/photos/img_1524.jpg", featured: false },
  { id: 6, title: "Sapphire", summary: "Embroidered silk kaftan", description: "A pale yellow kaftan with luminous embroidery and an airy, occasion-ready cut.", price: 23000, category: "the-silk-edit", stock: 5, image_url: "/assets/photos/img_1355.jpg", featured: false },
  { id: 7, title: "Amaya", summary: "Quiet colour embroidered set", description: "A quiet pastel outfit made for warm days, garden lunches, and relaxed celebrations.", price: 16000, category: "everyday-memo", stock: 16, image_url: "/assets/photos/img_9820.jpg", featured: false },
  { id: 8, title: "Kaira", summary: "Fresh embroidered dress", description: "A polished daywear dress with fresh embroidery and a gently structured shape.", price: 16000, category: "everyday-memo", stock: 9, image_url: "/assets/photos/img_8818.jpg", featured: false },
  { id: 9, title: "Dusk", summary: "Soft festive dress", description: "A dusk-pink look balancing softness, festive detail, and everyday ease.", price: 16000, category: "everyday-memo", stock: 4, image_url: "/assets/photos/img_0445.jpg", featured: false },
  { id: 10, title: "Lira Greens", summary: "Embroidered evening notes", description: "An evening green ensemble with polished embroidery and a graceful drape.", price: 16000, category: "occasion-wear", stock: 6, image_url: "/assets/photos/img_7990.jpg", featured: false },
  { id: 11, title: "Lira Pink", summary: "Occasion embroidered dress", description: "A pink embroidered look with a celebratory silhouette and intricate detailing.", price: 16000, category: "occasion-wear", stock: 3, image_url: "/assets/photos/img_5142.jpg", featured: false },
  { id: 12, title: "Raya", summary: "Formal embroidered ensemble", description: "A formal Raya ensemble made with detailed embroidery and a graceful festive profile.", price: 16000, category: "occasion-wear", stock: 2, image_url: "/assets/photos/img_4715.jpg", featured: false }
];

const categoryPages = {
  "/new-arrivals": { title: "New Arrivals", category: null },
};

const infoPages = {
  "/payment": {
    title: "Payment",
    copy: [
      "All orders are prepaid. Customers may pay the full amount in advance, or pay 50% to confirm the order.",
      "The remaining balance can be paid through cash on delivery for eligible local orders.",
      { text: "Payment Method", strong: true },
      { text: "For Local orders:", strong: true },
      { list: ["Bank Transfer", "Easy Paisa", "Jazz Cash"] },
      { text: "For International Orders:", strong: true },
      { list: ["Bank Transfer", "Western Union", "Remitly / Wise"] },
      "Payment details will be shared with customers through WhatsApp or email once the order has been received."
    ]
  },
  "/disclaimer": {
    title: "Disclaimer",
    copy: [
      { text: "Product Appearance:", strong: true },
       "We use high resolution images on our website to display actual colors of the product. However, the color/ texture you will see will depend on your device Therefore, the final item you receive mighty vary as seen on your screen.",
       "Laces/ embellishments will be of same quality as seen on the image, however, they may be different as seen on the picture, depending on the availability.",
      { text: "Product Care:", strong: true },
      "Please handle our products with care as they are delicate. They should be dry cleaned only."    
      ]
  },
  "/faqs": {
    title: "FAQ's",
    copy: [
      { text: "How to make a purchase?", strong: true },
       "You can purchase directly from our website or message us your order on our instagram/ facebook. Provide your complete details (Name, address, contact no. and email) so that we can place your order.",
       "We accept the following payment methods:",
      { list: ["Bank transfer for customers worldwide", "Easy Paisa/ Jazz Cash for Local customers"] },
      { text: "Which countries do we ship?", strong: true },
      "We ship worldwide.",
      { text: "What if courier delays or misplaces our parcel?", strong: true },
       "If unfortunately a parcel is delayed or misplaced by the courier and it’s evident, we will help you recover it by staying in contact with both parties but we cannot be held responsible for a third party action. But rest assured, we will do our best to recover it as soon as possible.",
      { text: "Do you offer cash on delivery?", strong: true },
      "We take 50% advance and remaining before we dispatch or COD.",    
      { text: "Do you have refunds?", strong: true },
       "No, we do not have refunds. Order cannot be cancelled once placed, even after an hour as it instantly goes into production.",
      { text: "Do you offer custom made outfits?", strong: true },
      "Yes we do. You can share your reference image and we will design the best outfit for you.",    
      { text: "What is the exchange time period?", strong: true },
       "You can let us know within 24hrs of receiving the parcel if there is any fault from our side we will happily exchange it. After that no exchange will be entertained.",
      { text: "What if order is delayed? Can we refund?", strong: true },
      "We try our best to avoid any delays but if there is any unforeseen delay after committing you a date of delivery especially during Eid of Festive season, we will offer compensatory discount of 10-20% but we do not have refunds. Please keep this in mind prior to ordering.",    
      { text: "Delivery time", strong: true },
       "Delivery time varies from 7 to 18 days depending on the article and season.",
      ]
  },
  "/terms-and-conditions": {
    title: "Terms and conditions",
    copy: [
      { text: "Delivery Charges", strong: true },
      "Charges for international orders are calculated based on the destination and weight of the shipment. Duties and taxes are not included in the goods' price, and customs duty and tax charges are payable to the courier company upon delivery.",
      { text: "Delivery Timelines", strong: true },
      "Memo by Miraal is responsible for dispatching your order, but we cannot control any delays caused by our courier partners. If concerns arise after dispatch, please contact the courier service directly. As each item is made to order, delays due to circumstances beyond our control may occur, and customers will be informed of any delays.",
      { text: "Custom/Duties/Taxes", strong: true },
      "When ordering from MemobyMiraal for delivery overseas, customers may be subject to import duties and taxes. Additional charges for Customs clearance are the customer's responsibility. Customs policies vary, and cross-border deliveries are subject to inspection by Customs Authorities.",
    ]
  },
  "/care-instructions": {
    title: "Care instructions",
    copy: [
      { list: ["All of our pieces are designed to be dry clean only. We strongly recommend that customers adhere to these care instructions to ensure the longevity and quality of the garment.", "Please note that any damage caused by handwashing, machine washing, or any cleaning methods other than dry cleaning will not be covered under our returns or exchange policy. We will not be held liable for any deterioration, shrinkage, or damage resulting from improper care.",] },
      { text: "Privacy", strong: true },
      "Your privacy is important to us. Any personal information provided through this site will be used in accordance with our privacy policy."
    ]
  },
  "/returns-and-exchanges": {
    title: "Returns & Exchanges",
    copy: [
      "Returns are only accepted if reported within 24 hours of receiving, with proof of purchase and photos sent via WhatsApp/Instagram.",
      "If there is an issue with the product from our side, we'll be happy to exchange it.",
      "Returns won’t be accepted if: reported after 24 hours, item isn’t returned properly, item is damaged by improper care, or if there’s no proof submitted.",
      { text: "Following points will not be catered:", strong: true },
      { list: ["No longer needed: If you decide the item is no longer necessary for your requirements.", "Changed my mind: If you have reconsidered your purchase decision.", "No technical reason, just canceling the order: If you wish to cancel the order for reasons unrelated to technical issues.", "No return/refund is possible for a custom size outfit."] },
    ]
  },
};

function normalizePath(pathname) {
  const clean = pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
  return clean === "/index" ? "/" : clean;
}

function assetUrl(value) {
  const path = String(value || "");
  if (/^(https?:|data:|blob:)/.test(path) || path.startsWith("/")) return path;
  if (path.startsWith("../assets/")) return path.replace("..", "");
  return path.startsWith("assets/") ? `/${path}` : path;
}

function productGallery(product) {
  const images = Array.isArray(product?.images) ? product.images : [];
  const cleanImages = images.map(assetUrl).filter(Boolean);
  const thumbnail = assetUrl(product?.image_url);
  return (cleanImages.length ? cleanImages : [thumbnail]).filter(Boolean).slice(0, 5);
}

function productSlug(product) {
  if (product?.slug) return product.slug;
  return String(product?.title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function productPath(product) {
  return `/products/${productSlug(product)}`;
}

function findProductBySlug(products, slug) {
  return [...products, ...seedProducts].find((product) => productSlug(product) === slug || String(product.id) === slug);
}

function cartItemKey(id, size = "Medium") {
  return `${id}:${size || "Medium"}`;
}

function convertPrice(amount, currency = "PKR") {
  const config = currencies[currency] || currencies.PKR;
  const pkrAmount = Number(amount || 0);
  if (currency === "PKR") return Math.round(pkrAmount);
  return Math.ceil(pkrAmount / config.pkrPerUnit);
}

function money(amount, currency = "PKR") {
  const config = currencies[currency] || currencies.PKR;
  return `${config.prefix}${convertPrice(amount, currency).toLocaleString(config.locale)}`;
}

function readCart() {
  try { return JSON.parse(localStorage.getItem(cartKey)) || []; } catch { return []; }
}

function readConfirmation() {
  try { return JSON.parse(sessionStorage.getItem(confirmationKey)) || null; } catch { return null; }
}

function readCurrency() {
  try {
    const saved = localStorage.getItem(currencyKey);
    return currencies[saved] ? saved : "PKR";
  } catch {
    return "PKR";
  }
}

function Icon({ type }) {
  if (type === "search") return <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>;
  if (type === "zoom") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/><path d="M10.5 7.5v6M7.5 10.5h6"/></svg>;
  if (type === "account") return <svg viewBox="0 0 24 24"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 21c.5-5 3-7 7-7s6.5 2 7 7"/></svg>;
  if (type === "heart") return <svg viewBox="0 0 24 24"><path d="m12 20-1.4-1.3C5.4 14.1 2 11 2 7.3 2 4.3 4.4 2 7.4 2c1.7 0 3.3.8 4.6 2.1C13.3 2.8 14.9 2 16.6 2 19.6 2 22 4.3 22 7.3c0 3.7-3.4 6.8-8.6 11.4L12 20Z"/></svg>;
  if (type === "bag") return <svg viewBox="0 0 24 24"><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>;
  if (type === "eye") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.4 12s3.5-6 9.6-6 9.6 6 9.6 6-3.5 6-9.6 6-9.6-6-9.6-6Z"/><circle cx="12" cy="12" r="3.2"/></svg>;
  if (type === "chevron-left") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>;
  if (type === "chevron-right") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>;
}
export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [products, setProducts] = useState(seedProducts);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(readCart);
  const [cartMessage, setCartMessage] = useState("");
  const [orderConfirmation, setOrderConfirmation] = useState(readConfirmation);
  const [currency, setCurrency] = useState(readCurrency);
  const [stockRequestOpen, setStockRequestOpen] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState("");

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const title = categoryPages[path]?.title;
    const pageTitle = title || infoPages[path]?.title || (path === "/contact-us" ? "Contact Us" : "");
    document.title = pageTitle ? `${pageTitle} | Memo by Miraal` : "Memo by Miraal";
    const onScroll = () => setNavScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [path]);

  useEffect(() => {
    document.body.classList.toggle("nav-scrolled", navScrolled);
    document.body.classList.toggle("menu-open", menuOpen);
    document.body.classList.toggle("modal-open", cartOpen);
  }, [navScrolled, menuOpen, cartOpen]);

  useEffect(() => localStorage.setItem(cartKey, JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem(currencyKey, currency), [currency]);

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
    const [pathname, hash] = to.split("#");
    const nextPath = normalizePath(pathname || window.location.pathname);
    window.history.pushState({}, "", `${nextPath}${hash ? `#${hash}` : ""}`);
    setPath(nextPath);
    setMenuOpen(false);
    setCartMessage("");
    setStockRequestOpen(false);
    window.setTimeout(() => {
      if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  }

  function updateCartQuantity(key, quantity) {
    setCart((items) => items.map((item) => {
      if ((item.key || cartItemKey(item.product_id, item.size)) !== key) return item;
      return { ...item, quantity: Math.max(1, Math.min(Number(quantity) || 1, item.stock)) };
    }));
  }

  function updateCartSize(key, size) {
    if (!sizeOptions.includes(size)) return;
    setCart((items) => {
      const current = items.find((item) => (item.key || cartItemKey(item.product_id, item.size)) === key);
      if (!current) return items;
      const nextKey = cartItemKey(current.product_id, size);
      const existing = items.find((item) => (item.key || cartItemKey(item.product_id, item.size)) === nextKey);
      if (existing && existing !== current) {
        const mergedQuantity = Math.min(Number(existing.quantity || 0) + Number(current.quantity || 0), Number(existing.stock || current.stock || 1));
        return items
          .filter((item) => (item.key || cartItemKey(item.product_id, item.size)) !== key)
          .map((item) => (item.key || cartItemKey(item.product_id, item.size)) === nextKey ? { ...item, quantity: mergedQuantity, size, key: nextKey } : item);
      }
      return items.map((item) => (item.key || cartItemKey(item.product_id, item.size)) === key ? { ...item, size, key: nextKey } : item);
    });
  }

  function removeCartItem(key) {
    setCart((items) => items.filter((entry) => (entry.key || cartItemKey(entry.product_id, entry.size)) !== key));
  }

  function addToCart(product, size = "Medium") {
    if (!product) return;
    if (product.stock <= 0) {
      setCartMessage(`Tell us where to reach you when ${product.title} is back.`);
      setStockRequestOpen(true);
      return;
    }
    const selectedSize = sizeOptions.includes(size) ? size : "Medium";
    const key = cartItemKey(product.id, selectedSize);
    const productQuantity = cart.filter((item) => item.product_id === product.id).reduce((sum, item) => sum + item.quantity, 0);
    const existing = cart.find((item) => (item.key || cartItemKey(item.product_id, item.size)) === key);
    if ((existing?.quantity || 0) >= product.stock) {
      setCartMessage(`Only limited stock is available for ${product.title}.`);
      return;
    }
    if (productQuantity >= product.stock) {
      setCartMessage(`Only limited stock is available for ${product.title}.`);
      return;
    }
    setCart((items) => existing
      ? items.map((item) => (item.key || cartItemKey(item.product_id, item.size)) === key ? { ...item, quantity: item.quantity + 1, size: selectedSize, key } : item)
      : [...items, { key, product_id: product.id, quantity: 1, size: selectedSize, title: product.title, price: product.price, image_url: assetUrl(product.image_url), stock: product.stock }]
    );
    setCartMessage(`${product.title} (${selectedSize}) has been added to your bag.`);
  }

  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const isCatalog = Boolean(categoryPages[path]);
  const productSlugFromPath = path.startsWith("/products/") ? path.replace("/products/", "") : "";
  const selectedProduct = productSlugFromPath ? findProductBySlug(products, productSlugFromPath) : null;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = subtotal > 0 ? subtotal + deliveryFee : 0;
  const cartTotals = { subtotal, deliveryFee: subtotal > 0 ? deliveryFee : 0, finalTotal };

  function renderMain() {
    if (path === "/cart") return <CartPage cart={cart} totals={cartTotals} currency={currency} navigate={navigate} updateQuantity={updateCartQuantity} updateSize={updateCartSize} removeItem={removeCartItem} openCart={() => setCartOpen(true)} />;
    if (path === "/checkout") return <CheckoutPage cart={cart} totals={cartTotals} currency={currency} navigate={navigate} setCart={setCart} setOrderConfirmation={setOrderConfirmation} />;
    if (path === "/order-confirmation") return <ConfirmationPage confirmation={orderConfirmation} currency={currency} navigate={navigate} />;
    if (path === "/contact-us") return <ContactPage navigate={navigate} />;
    if (infoPages[path]) return <InfoPage page={infoPages[path]} navigate={navigate} />;
    if (productSlugFromPath) return <ProductDetailPage product={selectedProduct} products={products} currency={currency} navigate={navigate} onAdd={addToCart} message={cartMessage} stockRequestOpen={stockRequestOpen} setStockRequestOpen={setStockRequestOpen} />;
    if (isCatalog) return <CatalogPage path={path} products={products} currency={currency} navigate={navigate} />;
    return <HomePage products={products} currency={currency} navigate={navigate} />;
  }

  return <>
    <Header navigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} cartQuantity={cartQuantity} currency={currency} setCurrency={setCurrency} openCart={() => setCartOpen(true)} />
    {renderMain()}
    <Newsletter message={newsletterMessage} setMessage={setNewsletterMessage} />
    <Footer navigate={navigate} />
    <a className="whatsapp" href="https://api.whatsapp.com/send?phone=923088844444" aria-label="WhatsApp">{"\u25d4"}</a>
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} totals={cartTotals} currency={currency} navigate={navigate} updateQuantity={updateCartQuantity} updateSize={updateCartSize} removeItem={removeCartItem} />
  </>;
}

function Link({ to, navigate, children, className, ...props }) {
  return <a href={to} className={className} onClick={(event) => { event.preventDefault(); navigate(to); }} {...props}>{children}</a>;
}

function Header({ navigate, menuOpen, setMenuOpen, cartQuantity, currency, setCurrency, openCart }) {
  return <>
    <a className="hotline" href="#newsletter">A note from our studio - Join the Memo community</a>
    <header className="header">
      <button className="menu-trigger" id="menuButton" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><i></i><i></i><span>Menu</span></button>
      <Link className="logo" to="/" navigate={navigate} aria-label="Memo home"><img src="/assets/memo-logo.png" alt="Memo" /></Link>
      <div className="tools">
        <label className="currency" aria-label="Currency">
          <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
            {Object.entries(currencies).map(([code, config]) => <option key={code} value={code}>{config.name}</option>)}
          </select>
        </label>
        <button className="counter cart-counter" aria-label="Shopping bag" onClick={openCart}><Icon type="bag" /><sup>({cartQuantity})</sup></button>
      </div>
    </header>
    <div className={`menu-panel${menuOpen ? " open" : ""}`} id="menuPanel" aria-hidden={!menuOpen}>
      <button className="menu-close" id="menuClose" aria-label="Close menu" onClick={() => setMenuOpen(false)}>Close</button>
      <nav>{menuItems.map(([label, itemPath]) => <Link key={itemPath} to={itemPath} navigate={navigate}>{label}</Link>)}</nav>
    </div>
    <div className={`menu-backdrop${menuOpen ? " open" : ""}`} id="menuBackdrop" onClick={() => setMenuOpen(false)}></div>
  </>;
}
function HomePage({ products, currency, navigate }) {
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const homeProducts = featured.length ? featured : seedProducts.slice(0, 4);
  const findProduct = (title, image) => products.find((product) => product.title === title) || seedProducts.find((product) => product.title === title) || seedProducts.find((product) => product.image_url.includes(image));
  const storyProduct = findProduct("Sunlit Memo", "img_1355.jpg");
  return <main>
    <Hero navigate={navigate} />
    <section className="products" id="new"><h2 className="home-section-heading">Luxury in Every Thread</h2><div className="product-grid">{homeProducts.map((product) => <ProductCard key={product.id} product={product} currency={currency} navigate={navigate} />)}</div></section>
    <TopPicks products={products} navigate={navigate} />
    <section className="wedding-feature" id="story"><div className="story-image story-image-clickable" onClick={() => storyProduct && navigate(productPath(storyProduct))} role={storyProduct ? "link" : undefined} tabIndex={storyProduct ? 0 : undefined} onKeyDown={(event) => { if (storyProduct && (event.key === "Enter" || event.key === " ")) navigate(productPath(storyProduct)); }}><img src="/assets/photos/img_1355.jpg" alt="Woman wearing a pale yellow embroidered kaftan" /></div><div className="story-copy"><p className="eyebrow">The story behind the clothes</p><h2>A little memory,<br />made wearable.</h2><p>Memo by Miraal is a love letter to colour, comfort and the women who make every room feel warmer. Each piece is designed to live beyond an occasion and become part of your own story.</p><a href="#story">Read our story</a></div></section>
    <section className="occasions">{[["img_8818.jpg", "Kaira embroidered dress", "Kaira"], ["img_5142.jpg", "Lira Pink embroidered dress", "Lira Pink"], ["img_4715.jpg", "Raya embroidered dress", "Raya"], ["img_0445.jpg", "Dusk embroidered dress", "Dusk"]].map(([image, alt, label]) => <ImageFeatureCard key={label} image={image} alt={alt} label={label} product={findProduct(label, image)} navigate={navigate} />)}</section>
    <section className="social" id="social"><p className="eyebrow">Seen and loved</p><h2>@memobymiraal</h2><div>{["img_9828.jpg", "img_4089.jpg", "img_7990.jpg", "img_0445.jpg", "img_1355.jpg"].map((image) => <img key={image} src={`/assets/photos/${image}`} alt="Memo by Miraal look" />)}</div></section>
  </main>;
}

function Hero({ navigate }) {
  const slides = [
    { desktop: "/assets/photos/hero-composite-collection-headroom.png", mobile: "/assets/photos/hero-composite-collection.png", alt: "Four models wearing pastel embroidered Memo by Miraal outfits" },
    { desktop: "/assets/photos/hero-composite-evening-collection-headroom.png", mobile: "/assets/photos/hero-composite-evening-collection.png", alt: "Four models wearing evening embroidered Memo by Miraal outfits" }
  ];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);
  return <section className="hero" aria-label="Memo by Miraal featured collection"><div className="hero-copy"><p className="eyebrow">The summer memo {"\u00b7"} 2026</p><h1>Made for your<br /><em>softest moments.</em></h1><p>Easy silhouettes, delicate details, and colours borrowed from the garden.</p><Link to="/#new" navigate={navigate}>Explore the collection</Link></div><div className="hero-image" id="heroCarousel" aria-roledescription="carousel" aria-label="Featured Memo looks"><div className="hero-slides" aria-live="polite">{slides.map((slide, slideIndex) => <picture key={slide.alt} className={`hero-slide hero-slide-composite${slideIndex === index ? " active" : ""}`}><source media="(max-width: 1024px)" srcSet={slide.mobile} /><img src={slide.desktop} alt={slide.alt} /></picture>)}</div></div></section>;
}

function ProductCard({ product, currency, navigate, showHeart = false }) {
  const [liked, setLiked] = useState(false);
  const [thumbnail] = productGallery(product);
  function openProduct() {
    navigate(productPath(product));
  }
  return <article className="product-card-link" data-product-id={product.id} data-price={money(product.price, currency)} data-details={product.description} role="link" tabIndex="0" onClick={openProduct} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") openProduct(); }}><div className="product-photo"><img src={thumbnail} alt={product.title} />{showHeart && <div className="card-tools"><button className="heart" type="button" aria-label={liked ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={liked} onClick={(event) => { event.stopPropagation(); setLiked(!liked); }}><Icon type="heart" /></button></div>}</div><h2>{product.title}</h2><p>{product.summary}</p></article>;
}

function ImageFeatureCard({ image, alt, label, small, product, navigate }) {
  return <a href={product ? productPath(product) : "#"} className="image-feature-card" onClick={(event) => { event.preventDefault(); if (product) navigate(productPath(product)); }}><img src={`/assets/photos/${image}`} alt={alt} /><span>{small && <small>{small}</small>}{label}</span></a>;
}

function CatalogPage({ path, products, currency, navigate }) {
  const page = categoryPages[path] || categoryPages["/new-arrivals"];
  const filtered = page.category ? products.filter((product) => product.category === page.category) : products;
  const visible = filtered.length ? filtered : seedProducts.filter((product) => !page.category || product.category === page.category).slice(0, 4);
  return <main className="catalog-page"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/" navigate={navigate}>Home</Link><span>/</span><span>{page.title}</span></nav><div className="catalog-shell"><section className="products" aria-label={page.title}><div className="collection-header"><p className="eyebrow">Memo collection</p><h1>{page.title}</h1></div><div className="tabs">{navItems.map(([label, itemPath]) => <Link key={itemPath} to={itemPath} navigate={navigate} className={itemPath === path ? "active" : ""}>{label}</Link>)}</div><div className="product-grid">{visible.map((product) => <ProductCard key={product.id} product={product} currency={currency} navigate={navigate} />)}</div>{path === "/new-arrivals" && <nav className="pagination" aria-label="Pagination"><a className="active" href="#">1</a><a href="#">2</a><a href="#">Next</a></nav>}</section></div></main>;
}

function TopPicks({ products, navigate }) {
  const findProduct = (title, image) => products.find((product) => product.title === title) || seedProducts.find((product) => product.title === title) || seedProducts.find((product) => product.image_url.includes(image));
  return <section className="top-picks" id="top-picks"><p className="eyebrow">A wardrobe in bloom</p><h2>Notes for the Season</h2><div className="pick-grid">{[["img_7990.jpg", "Lira green evening outfit", "Evening notes", "Lira Greens"], ["img_9820.jpg", "Amaya embroidered outfit", "Quiet colour", "Amaya"], ["img_1524.jpg", "Bloom silk dress", "Easy elegance", "Bloom"]].map(([image, alt, small, label]) => <ImageFeatureCard key={label} image={image} alt={alt} small={small} label={label} product={findProduct(label, image)} navigate={navigate} />)}</div></section>;
}
function ProductDetailPage({ product, products, currency, navigate, onAdd, message, stockRequestOpen, setStockRequestOpen }) {
  const [requestMessage, setRequestMessage] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");
  const gallery = productGallery(product);
  const activeImageIndex = gallery[imageIndex] ? imageIndex : 0;
  const latestArrivals = products.filter((item) => item.id !== product?.id).slice(0, 4);
  const CustomerFavorites = products
    .filter((item) => item.id !== product?.id && Number(item.stock) > 0)
    .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
    .slice(0, 4);
  useEffect(() => {
    setImageIndex(0);
    setSelectedSize("Medium");
    setZoomed(false);
  }, [product?.id]);
  function moveZoom(event) {
    if (!zoomed) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    setZoomOrigin(`${x}% ${y}%`);
  }
  if (!product) return <main className="product-detail-page"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/" navigate={navigate}>Home</Link><span>/</span><span>Product</span></nav><section className="product-not-found"><p className="eyebrow">Memo collection</p><h1>Product not found</h1><p>This piece is not available right now.</p><button className="checkout-button" type="button" onClick={() => navigate("/new-arrivals")}>View new arrivals</button></section></main>;
  async function submitStockRequest(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const payload = Object.fromEntries(new FormData(formElement).entries());
    payload.product_id = product.id;
    setRequestMessage("Sending your request...");
    try {
      const response = await fetch("/api/stock-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error("Request could not be sent.");
      formElement.reset();
      setStockRequestOpen(false);
      setRequestMessage(`We will contact you when ${product.title} is back in stock.`);
    } catch (error) {
      setRequestMessage(error.message);
    }
  }
  return <main className="product-detail-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/" navigate={navigate}>Home</Link><span>/</span><Link to="/new-arrivals" navigate={navigate}>New Arrivals</Link><span>/</span><span>{product.title}</span></nav>
    <section className="product-detail-shell">
      <div className={`product-gallery${gallery.length > 1 ? "" : " single-image"}`} aria-label={`${product.title} images`}>
        <div className={`product-gallery-main${zoomed ? " zoomed" : ""}`} onMouseMove={moveZoom}>
          <img src={gallery[activeImageIndex]} alt={`${product.title} ${activeImageIndex + 1}`} style={{ transformOrigin: zoomOrigin }} />
          <button className="product-zoom-button" type="button" aria-label={zoomed ? `Zoom out ${product.title} image` : `Zoom in ${product.title} image`} aria-pressed={zoomed} onClick={() => setZoomed((current) => !current)}><Icon type="zoom" /></button>
        </div>
        {gallery.length > 1 && <div className="product-thumbnails">{gallery.map((image, index) => <button key={image} type="button" className={index === activeImageIndex ? "active" : ""} aria-label={`View ${product.title} image ${index + 1}`} onClick={() => { setImageIndex(index); setZoomed(false); }}><img src={image} alt="" /></button>)}</div>}
      </div>
      <div className="product-detail-copy">
        <p className="eyebrow">Memo collection</p>
        <h1>{product.title}</h1>
        <p className="product-detail-price">{money(product.price, currency)}</p>
        <p className="product-detail-summary">{product.summary}</p>
        <p className="product-detail-description">{product.description}</p>
        <div className="size-selector" aria-label="Select size">
          <span>Size</span>
          <div>{sizeOptions.map((size) => <button key={size} type="button" className={selectedSize === size ? "active" : ""} aria-pressed={selectedSize === size} onClick={() => setSelectedSize(size)}>{size}</button>)}</div>
        </div>
        <div className="quick-view-notes"><span>Embroidered finish</span><span>Made in Pakistan</span><span>Dry clean only</span></div>
        {product.stock <= 0 && <small className="stock-note disabled">Currently out of stock</small>}
        <button className="add-to-cart" type="button" onClick={() => onAdd(product, selectedSize)}>{product.stock <= 0 ? "Request availability" : "Add to cart"}</button>
        <p className="cart-message" aria-live="polite">{requestMessage || message}</p>
        {stockRequestOpen && <form className="stock-request-form" id="stockRequestForm" onSubmit={submitStockRequest}><input name="customer_name" placeholder="Full name" required minLength="2" /><input name="phone" placeholder="Phone" required minLength="5" /><input name="email" type="email" placeholder="Email" required /><textarea name="notes" placeholder="Notes"></textarea><button type="submit">Send request</button></form>}
      </div>
    </section>
    <section className="you-may-like">
      <p className="eyebrow">You may also like</p>
      <h2>Latest arrivals</h2>
      <div className="recommendation-grid">{(latestArrivals.length ? latestArrivals : seedProducts.filter((item) => item.id !== product.id).slice(0, 4)).map((item) => <ProductCard key={`latest-${item.id}`} product={item} currency={currency} navigate={navigate} />)}</div>
      <h2>Customer Favorites</h2>
      <div className="recommendation-grid">{(CustomerFavorites.length ? CustomerFavorites : seedProducts.filter((item) => item.id !== product.id).slice(4, 8)).map((item) => <ProductCard key={`sale-${item.id}`} product={item} currency={currency} navigate={navigate} />)}</div>
    </section>
  </main>;
}

function OrderSummary({ cart, totals, currency, compact = false }) {
  return <section className={`order-summary${compact ? " compact" : ""}`} aria-label="Order summary">
    <h2>Order summary</h2>
    <div className="summary-items">
      {cart.length ? cart.map((item) => <div className="summary-row" key={item.key || cartItemKey(item.product_id, item.size)}>
        <span>{item.title} ({item.size || "Medium"}) x {item.quantity}</span>
        <strong>{money(item.price * item.quantity, currency)}</strong>
      </div>) : <p className="empty-state">Your bag is empty.</p>}
    </div>
    <div className="summary-totals">
      <p><span>Subtotal</span><strong>{money(totals.subtotal, currency)}</strong></p>
      <p><span>Delivery fee</span><strong>{money(totals.deliveryFee, currency)}</strong></p>
      <p className="summary-final"><span>Total</span><strong>{money(totals.finalTotal, currency)}</strong></p>
    </div>
  </section>;
}

function CartItems({ cart, currency, updateQuantity, updateSize, removeItem }) {
  return <div className="cart-items">
    {cart.length ? cart.map((item) => {
      const itemKey = item.key || cartItemKey(item.product_id, item.size);
      const selectedSize = item.size || "Medium";
      return <div className="cart-row" data-id={item.product_id} key={itemKey}>
      <img src={assetUrl(item.image_url)} alt={item.title} />
      <div>
        <strong>{item.title}</strong>
        <span>{money(item.price, currency)}</span>
        <div className="cart-size-selector" aria-label={`Select size for ${item.title}`}>
          {sizeOptions.map((size) => <button key={size} type="button" className={selectedSize === size ? "active" : ""} aria-pressed={selectedSize === size} onClick={() => updateSize(itemKey, size)}>{size}</button>)}
        </div>
        <label>Qty <input type="number" min="1" max={item.stock} value={item.quantity} onChange={(event) => updateQuantity(itemKey, event.target.value)} /></label>
      </div>
      <button type="button" aria-label={`Remove ${item.title}`} onClick={() => removeItem(itemKey)}>Remove</button>
    </div>;
    }) : <p className="empty-state">Your bag is empty.</p>}
  </div>;
}

function CartDrawer({ open, onClose, cart, totals, currency, navigate, updateQuantity, updateSize, removeItem }) {
  function goCheckout() {
    if (!cart.length) return;
    onClose();
    navigate("/checkout");
  }

  return <aside className={`cart-drawer${open ? " open" : ""}`} id="cartDrawer" aria-hidden={!open}>
    <div className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
      <button className="cart-close" type="button" aria-label="Close cart" onClick={onClose}>x</button>
      <h2 id="cartTitle">Shopping Bag</h2>
      <CartItems cart={cart} currency={currency} updateQuantity={updateQuantity} updateSize={updateSize} removeItem={removeItem} />
      <OrderSummary cart={cart} totals={totals} currency={currency} compact />
      <button className="checkout-button" type="button" disabled={!cart.length} onClick={goCheckout}>Checkout</button>
    </div>
    <button className="cart-backdrop" type="button" aria-label="Close cart" onClick={onClose}></button>
  </aside>;
}

function CartPage({ cart, totals, currency, navigate, updateQuantity, updateSize, removeItem, openCart }) {
  return <main className="checkout-page cart-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/" navigate={navigate}>Home</Link><span>/</span><span>Cart</span></nav>
    <section className="checkout-shell">
      <div className="checkout-card">
        <p className="eyebrow">Shopping bag</p>
        <h1>Your Cart</h1>
        <CartItems cart={cart} currency={currency} updateQuantity={updateQuantity} updateSize={updateSize} removeItem={removeItem} />
        {!cart.length && <button className="checkout-button secondary" type="button" onClick={() => navigate("/new-arrivals")}>Continue shopping</button>}
      </div>
      <div>
        <OrderSummary cart={cart} totals={totals} currency={currency} />
        <button className="checkout-button" type="button" disabled={!cart.length} onClick={() => cart.length ? navigate("/checkout") : openCart()}>Checkout</button>
      </div>
    </section>
  </main>;
}

function CheckoutPage({ cart, totals, currency, navigate, setCart, setOrderConfirmation }) {
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [message, setMessage] = useState("");
  const manualInstructions = manualPaymentInstructions[paymentMethod];

  async function submitCheckout(event) {
    event.preventDefault();
    if (!cart.length) {
      setMessage("Your cart is empty. Add at least one product before checkout.");
      return;
    }
    const formElement = event.currentTarget;
    const payload = Object.fromEntries(new FormData(formElement).entries());
    payload.payment_method = paymentMethod;
    payload.currency = currency;
    payload.items = cart.map(({ product_id, quantity, size }) => ({ product_id, quantity, size: size || "Medium" }));
    setMessage("Placing your order...");
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Order could not be placed.");
      const confirmation = { ...result, currency, instructions: manualPaymentInstructions[result.payment_method] || "" };
      sessionStorage.setItem(confirmationKey, JSON.stringify(confirmation));
      setOrderConfirmation(confirmation);
      setCart([]);
      formElement.reset();
      setMessage("");
      navigate("/order-confirmation");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return <main className="checkout-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/" navigate={navigate}>Home</Link><span>/</span><span>Checkout</span></nav>
    <section className="checkout-shell">
      <form className="checkout-card checkout-form" onSubmit={submitCheckout}>
        <p className="eyebrow">Secure checkout</p>
        <h1>Checkout</h1>
        <fieldset>
          <legend>Customer details</legend>
          <input name="customer_name" placeholder="Customer name" required minLength="2" />
          <input name="phone" placeholder="Phone number" required minLength="5" />
          <input name="email" type="email" placeholder="Email" required />
          <input name="address" placeholder="Full address" required minLength="5" />
          <input name="city" placeholder="City" required minLength="2" />
          <textarea name="notes" placeholder="Notes"></textarea>
        </fieldset>
        <fieldset>
          <legend>Payment method</legend>
          <div className="payment-options">{paymentOptions.map((option) => <label className="payment-option" key={option}>
            <input type="radio" name="payment_method_choice" checked={paymentMethod === option} onChange={() => setPaymentMethod(option)} />
            <span>{option}</span>
          </label>)}</div>
          {manualInstructions && <div className="payment-instructions"><strong>Payment instructions</strong><p>{manualInstructions}</p></div>}
          {manualInstructions && <input name="transaction_reference" placeholder="Transaction / reference number (optional)" />}
        </fieldset>
        <button type="submit" disabled={!cart.length}>Place order</button>
        <p className="checkout-message" aria-live="polite">{message}</p>
      </form>
      <OrderSummary cart={cart} totals={totals} currency={currency} />
    </section>
  </main>;
}

function ConfirmationPage({ confirmation, currency, navigate }) {
  const confirmationCurrency = confirmation?.currency || currency;
  return <main className="checkout-page">
    <section className="confirmation-panel">
      <span className="order-success-tick" aria-hidden="true"></span>
      <p className="eyebrow">Order received</p>
      <h1>Thank you</h1>
      {confirmation ? <>
        <p>Your order number is <strong>{confirmation.order_number}</strong>.</p>
        <p>Total: <strong>{money(confirmation.total, confirmationCurrency)}</strong></p>
        <p>Payment: <strong>{confirmation.payment_method}</strong> - {confirmation.payment_status}</p>
        {confirmation.instructions && <div className="payment-instructions"><strong>Payment instructions</strong><p>{confirmation.instructions}</p></div>}
      </> : <p>Your most recent order details are not available in this browser session.</p>}
      <button className="checkout-button" type="button" onClick={() => navigate("/new-arrivals")}>Continue shopping</button>
    </section>
  </main>;
}

function ContactPage({ navigate }) {
  const [message, setMessage] = useState("");

  function submitContact(event) {
    event.preventDefault();
    setMessage("Thank you. We will get back to you shortly.");
    event.currentTarget.reset();
  }

  return <main className="contact-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/" navigate={navigate}>Home</Link><span>/</span><span>Contact Us</span></nav>
    <section className="contact-shell">
      <div className="contact-copy">
        <p className="eyebrow">Memo care</p>
        <h1>Contact Us</h1>
        <p>Questions about a piece, sizing, availability, or an order? Leave us a note and the studio will reach out.</p>
        <div className="contact-details">
          <span>WhatsApp: +92 319 3746142</span>
          <span>Email: hello@memobymiraal.com</span>
        </div>
      </div>
      <form className="contact-form" onSubmit={submitContact}>
        <label><span>Name</span><input name="name" autoComplete="name" required minLength="2" /></label>
        <label><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
        <label><span>Phone Number</span><input name="phone" type="tel" autoComplete="tel" required minLength="5" /></label>
        <label><span>Comment</span><textarea name="comment" required minLength="4"></textarea></label>
        <button type="submit">Send Message</button>
        <p className="contact-message" aria-live="polite">{message}</p>
      </form>
    </section>
  </main>;
}

function InfoPage({ page, navigate }) {
  return <main className="info-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/" navigate={navigate}>Home</Link><span>/</span><span>{page.title}</span></nav>
    <section className="info-shell">
      <p className="eyebrow"></p>
      <h1>{page.title}</h1>
      <div className="info-copy">
        {page.copy.map((block, index) => {
          if (block.list) return <ul key={`list-${index}`}>{block.list.map((item) => <li key={item}>{item}</li>)}</ul>;
          const text = typeof block === "string" ? block : block.text;
          return <p key={text}>{typeof block === "string" ? text : <strong>{text}</strong>}</p>;
        })}
      </div>
    </section>
  </main>;
}

function Newsletter({ message, setMessage }) {
  return <section className="newsletter" id="newsletter"><p className="eyebrow">Keep a little Memo</p><h2>Letters from Miraal</h2><p>New pieces, thoughtful stories and first access, sent gently to your inbox.</p><form id="newsletterForm" onSubmit={(event) => { event.preventDefault(); setMessage("Thank you for subscribing."); event.currentTarget.reset(); }}><label className="sr-only" htmlFor="email">Email address</label><input id="email" type="email" placeholder="Enter your email here..." required /><button>Subscribe</button></form><small id="formMessage" aria-live="polite">{message}</small></section>;
}

function Footer({ navigate }) {
  return <footer><div className="footer-service"><h3>Memo Customer Service</h3><p>Monday to Friday 10am - 9pm</p><p>WhatsApp: +923193746142</p><p>Messages only</p><p>Instagram: memobymiraal</p></div><div><h3>Help and Information</h3><Link to="/payment" navigate={navigate}>Payment</Link><Link to="/disclaimer" navigate={navigate}>Disclaimer</Link><Link to="/contact-us" navigate={navigate}>Contact Us</Link></div><div><h3>Orders</h3><Link to="/faqs" navigate={navigate}>FAQ's</Link><Link to="/terms-and-conditions" navigate={navigate}>Terms and conditions</Link><Link to="/care-instructions" navigate={navigate}>Care instructions</Link><Link to="/returns-and-exchanges" navigate={navigate}>Returns & Exchanges</Link></div><p>{"\u00a9"} 2026 MEMO BY MIRAAL {"\u00b7"} @MEMOBYMIRAAL</p></footer>;
}

