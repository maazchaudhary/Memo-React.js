
import { useEffect, useState } from "react";

const cartKey = "memo_cart";
const navItems = [
  ["New Arrivals", "/new-arrivals"],
  ["The Silk Edit", "/the-silk-edit"],
  ["Everyday Memo", "/everyday-memo"],
  ["Occasion Wear", "/occasion-wear"]
];

const seedProducts = [
  { id: 1, title: "Dove Purple", summary: "Silk shirt with embroidered details", description: "A graceful silk ensemble finished with delicate embroidery and an easy, flowing silhouette.", price: 18500, category: "the-silk-edit", stock: 14, image_url: "/assets/photos/img_7289.jpg", featured: true },
  { id: 2, title: "Celine", summary: "Pastel embroidered long shirt", description: "A fresh pastel shirt with intricate embroidery, designed for effortless day-to-evening dressing.", price: 16900, category: "everyday-memo", stock: 19, image_url: "/assets/photos/img_9828.jpg", featured: true },
  { id: 3, title: "Rose Garden", summary: "Embroidered occasion ensemble", description: "A refined occasion ensemble featuring floral embroidery and a softly structured drape.", price: 21500, category: "occasion-wear", stock: 8, image_url: "/assets/photos/img_4089.jpg", featured: true },
  { id: 4, title: "Willow", summary: "Botanical sage silk dress", description: "A botanical sage silk dress with tonal detailing and a relaxed, elegant finish.", price: 19800, category: "the-silk-edit", stock: 11, image_url: "/assets/photos/img_4140.jpg", featured: true },
  { id: 5, title: "Bloom", summary: "Easy elegance silk dress", description: "A soft floral silk dress with delicate movement and refined everyday polish.", price: 20500, category: "the-silk-edit", stock: 7, image_url: "/assets/photos/img_1524.jpg", featured: false },
  { id: 6, title: "Sunlit Memo", summary: "Embroidered silk kaftan", description: "A pale yellow kaftan with luminous embroidery and an airy, occasion-ready cut.", price: 23900, category: "the-silk-edit", stock: 5, image_url: "/assets/photos/img_1355.jpg", featured: false },
  { id: 7, title: "Amaya", summary: "Quiet colour embroidered set", description: "A quiet pastel outfit made for warm days, garden lunches, and relaxed celebrations.", price: 17500, category: "everyday-memo", stock: 16, image_url: "/assets/photos/img_9820.jpg", featured: false },
  { id: 8, title: "Kaira", summary: "Fresh embroidered dress", description: "A polished daywear dress with fresh embroidery and a gently structured shape.", price: 18900, category: "everyday-memo", stock: 9, image_url: "/assets/photos/img_8818.jpg", featured: false },
  { id: 9, title: "Dusk", summary: "Soft festive dress", description: "A dusk-pink look balancing softness, festive detail, and everyday ease.", price: 21900, category: "everyday-memo", stock: 4, image_url: "/assets/photos/img_0445.jpg", featured: false },
  { id: 10, title: "Lira Greens", summary: "Embroidered evening notes", description: "An evening green ensemble with polished embroidery and a graceful drape.", price: 22500, category: "occasion-wear", stock: 6, image_url: "/assets/photos/img_7990.jpg", featured: false },
  { id: 11, title: "Lira Pink", summary: "Occasion embroidered dress", description: "A pink embroidered look with a celebratory silhouette and intricate detailing.", price: 24500, category: "occasion-wear", stock: 3, image_url: "/assets/photos/img_5142.jpg", featured: false },
  { id: 12, title: "Raya", summary: "Formal embroidered ensemble", description: "A formal Raya ensemble made with detailed embroidery and a graceful festive profile.", price: 27500, category: "occasion-wear", stock: 2, image_url: "/assets/photos/img_4715.jpg", featured: false }
];

const categoryPages = {
  "/new-arrivals": { title: "New Arrivals", category: null, sortOptions: ["New Arrivals", "Name: A to Z", "Price: Low to High", "Price: High to Low"] },
  "/the-silk-edit": { title: "The Silk Edit", category: "the-silk-edit", sortOptions: ["New Arrivals", "Name: A to Z", "Price: Low to High"] },
  "/everyday-memo": { title: "Everyday Memo", category: "everyday-memo", sortOptions: ["New Arrivals", "Name: A to Z", "Price: Low to High"] },
  "/occasion-wear": { title: "Occasion Wear", category: "occasion-wear", sortOptions: ["New Arrivals", "Name: A to Z", "Price: High to Low"] }
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

function money(amount) {
  return `PKR ${Number(amount || 0).toLocaleString("en-PK")}`;
}

function readCart() {
  try { return JSON.parse(localStorage.getItem(cartKey)) || []; } catch { return []; }
}

function Icon({ type }) {
  if (type === "search") return <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>;
  if (type === "account") return <svg viewBox="0 0 24 24"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 21c.5-5 3-7 7-7s6.5 2 7 7"/></svg>;
  if (type === "heart") return <svg viewBox="0 0 24 24"><path d="m12 20-1.4-1.3C5.4 14.1 2 11 2 7.3 2 4.3 4.4 2 7.4 2c1.7 0 3.3.8 4.6 2.1C13.3 2.8 14.9 2 16.6 2 19.6 2 22 4.3 22 7.3c0 3.7-3.4 6.8-8.6 11.4L12 20Z"/></svg>;
  if (type === "bag") return <svg viewBox="0 0 24 24"><path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>;
  if (type === "eye") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.4 12s3.5-6 9.6-6 9.6 6 9.6 6-3.5 6-9.6 6-9.6-6-9.6-6Z"/><circle cx="12" cy="12" r="3.2"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>;
}
export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [menuOpen, setMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [products, setProducts] = useState(seedProducts);
  const [quickView, setQuickView] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(readCart);
  const [cartMessage, setCartMessage] = useState("");
  const [stockRequestOpen, setStockRequestOpen] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState("");

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const title = categoryPages[path]?.title;
    document.title = title ? `${title} | Memo by Miraal` : "Memo by Miraal";
    const onScroll = () => setNavScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [path]);

  useEffect(() => {
    document.body.classList.toggle("nav-scrolled", navScrolled);
    document.body.classList.toggle("menu-open", menuOpen);
    document.body.classList.toggle("modal-open", Boolean(quickView) || cartOpen);
  }, [navScrolled, menuOpen, quickView, cartOpen]);

  useEffect(() => localStorage.setItem(cartKey, JSON.stringify(cart)), [cart]);

  useEffect(() => {
    const page = categoryPages[path];
    const params = new URLSearchParams();
    if (page?.category) params.set("category", page.category);
    if (!page) params.set("featured", "true");

    fetch(`/api/products?${params}`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Products failed to load")))
      .then((items) => setProducts(items.length ? items : seedProducts))
      .catch(() => setProducts(seedProducts));
  }, [path]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setQuickView(null);
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
    window.setTimeout(() => {
      if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
  }

  function addToCart(product) {
    if (!product) return;
    if (product.stock <= 0) {
      setCartMessage(`Tell us where to reach you when ${product.title} is back.`);
      setStockRequestOpen(true);
      return;
    }
    const existing = cart.find((item) => item.product_id === product.id);
    if ((existing?.quantity || 0) >= product.stock) {
      setCartMessage(`Only ${product.stock} available for ${product.title}.`);
      return;
    }
    setCart((items) => existing
      ? items.map((item) => item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...items, { product_id: product.id, quantity: 1, title: product.title, price: product.price, image_url: assetUrl(product.image_url), stock: product.stock }]
    );
    setCartMessage(`${product.title} has been added to your bag.`);
  }

  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  const isCatalog = Boolean(categoryPages[path]);

  return <>
    <Header navigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} cartQuantity={cartQuantity} openCart={() => setCartOpen(true)} />
    {isCatalog
      ? <CatalogPage path={path} products={products} navigate={navigate} openQuickView={(product) => { setQuickView(product); setCartMessage(""); setStockRequestOpen(false); }} />
      : <HomePage products={products} navigate={navigate} openQuickView={(product) => { setQuickView(product); setCartMessage(""); setStockRequestOpen(false); }} />}
    <Newsletter message={newsletterMessage} setMessage={setNewsletterMessage} />
    <Footer navigate={navigate} />
    <a className="whatsapp" href="https://api.whatsapp.com/send?phone=923088844444" aria-label="WhatsApp">{"\u25d4"}</a>
    <QuickViewModal product={quickView} onClose={() => setQuickView(null)} onAdd={addToCart} message={cartMessage} stockRequestOpen={stockRequestOpen} setStockRequestOpen={setStockRequestOpen} />
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setCart={setCart} />
  </>;
}

function Link({ to, navigate, children, className, ...props }) {
  return <a href={to} className={className} onClick={(event) => { event.preventDefault(); navigate(to); }} {...props}>{children}</a>;
}

function Header({ navigate, menuOpen, setMenuOpen, cartQuantity, openCart }) {
  return <>
    <a className="hotline" href="#newsletter">A note from our studio - Join the Memo community</a>
    <header className="header">
      <button className="menu-trigger" id="menuButton" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><i></i><i></i><span>Menu</span></button>
      <Link className="logo" to="/" navigate={navigate} aria-label="Memo home"><img src="/assets/memo-logo.png" alt="Memo" /></Link>
      <div className="tools">
        <button className="currency">PKR</button>
        <button aria-label="Search"><Icon type="search" /></button>
        <button className="desktop-icon" aria-label="Account"><Icon type="account" /></button>
        <button className="desktop-icon counter" aria-label="Wishlist"><Icon type="heart" /><sup>(0)</sup></button>
        <button className="counter cart-counter" aria-label="Shopping bag" onClick={openCart}><Icon type="bag" /><sup>({cartQuantity})</sup></button>
      </div>
    </header>
    <div className={`menu-panel${menuOpen ? " open" : ""}`} id="menuPanel" aria-hidden={!menuOpen}>
      <button className="menu-close" id="menuClose" aria-label="Close menu" onClick={() => setMenuOpen(false)}>Close</button>
      <nav>{navItems.map(([label, itemPath]) => <Link key={itemPath} to={itemPath} navigate={navigate}>{label}</Link>)}<Link to="/#social" navigate={navigate}>@memobymiraal</Link></nav>
    </div>
    <div className={`menu-backdrop${menuOpen ? " open" : ""}`} id="menuBackdrop" onClick={() => setMenuOpen(false)}></div>
  </>;
}
function HomePage({ products, navigate, openQuickView }) {
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const homeProducts = featured.length ? featured : seedProducts.slice(0, 4);
  return <main>
    <Hero navigate={navigate} />
    <section className="products" id="new"><div className="tabs"><button className="active">New In</button><button>Soft Pastels</button><button>Evening Notes</button><button>Everyday Silks</button></div><div className="product-grid">{homeProducts.map((product) => <ProductCard key={product.id} product={product} openQuickView={openQuickView} showHeart />)}</div></section>
    <TopPicks />
    <section className="wedding-feature" id="story"><div className="story-image"><img src="/assets/photos/img_1355.jpg" alt="Woman wearing a pale yellow embroidered kaftan" /></div><div className="story-copy"><p className="eyebrow">The story behind the clothes</p><h2>A little memory,<br />made wearable.</h2><p>Memo by Miraal is a love letter to colour, comfort and the women who make every room feel warmer. Each piece is designed to live beyond an occasion and become part of your own story.</p><a href="#story">Read our story</a></div></section>
    <section className="occasions">{[["img_8818.jpg", "Kaira embroidered dress", "Kaira"], ["img_5142.jpg", "Lira Pink embroidered dress", "Lira Pink"], ["img_4715.jpg", "Raya embroidered dress", "Raya"], ["img_0445.jpg", "Dusk embroidered dress", "Dusk"]].map(([image, alt, label]) => <a href="#" key={label}><img src={`/assets/photos/${image}`} alt={alt} /><span>{label}</span></a>)}</section>
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

function ProductCard({ product, openQuickView, showHeart = false }) {
  const [liked, setLiked] = useState(false);
  return <article data-product-id={product.id} data-price={money(product.price)} data-details={product.description}><div className="product-photo"><img src={assetUrl(product.image_url)} alt={product.title} /><div className="card-tools"><button className="quick-view" type="button" aria-label="Quick view" onClick={() => openQuickView(product)}><Icon type="eye" /></button>{showHeart && <button className="heart" type="button" aria-label={liked ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={liked} onClick={() => setLiked(!liked)}><Icon type="heart" /></button>}</div></div><h2>{product.title}</h2><p>{product.summary}</p>{product.stock <= 0 && <small className="stock-note disabled">Out of stock</small>}</article>;
}

function CatalogPage({ path, products, navigate, openQuickView }) {
  const page = categoryPages[path] || categoryPages["/new-arrivals"];
  const filtered = page.category ? products.filter((product) => product.category === page.category) : products;
  const visible = filtered.length ? filtered : seedProducts.filter((product) => !page.category || product.category === page.category).slice(0, 4);
  return <main className="catalog-page"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/" navigate={navigate}>Home</Link><span>/</span><span>{page.title}</span></nav><div className="catalog-shell"><section className="products" aria-label={page.title}><div className="collection-header"><p className="eyebrow">Memo collection</p><h1>{page.title}</h1></div><div className="catalog-toolbar"><div className="view-tools"><label><span>Sort by</span><select>{page.sortOptions.map((option) => <option key={option}>{option}</option>)}</select></label></div></div><div className="tabs">{navItems.map(([label, itemPath]) => <Link key={itemPath} to={itemPath} navigate={navigate} className={itemPath === path ? "active" : ""}>{label}</Link>)}</div><div className="product-grid">{visible.map((product) => <ProductCard key={product.id} product={product} openQuickView={openQuickView} />)}</div>{path === "/new-arrivals" && <nav className="pagination" aria-label="Pagination"><a className="active" href="#">1</a><a href="#">2</a><a href="#">Next</a></nav>}</section></div></main>;
}

function TopPicks() {
  return <section className="top-picks" id="top-picks"><p className="eyebrow">A wardrobe in bloom</p><h2>Notes for the Season</h2><div className="pick-grid">{[["img_7990.jpg", "Lira green evening outfit", "Evening notes", "Lira Greens"], ["img_9820.jpg", "Amaya embroidered outfit", "Quiet colour", "Amaya"], ["img_1524.jpg", "Bloom silk dress", "Easy elegance", "Bloom"]].map(([image, alt, small, label]) => <a href="#" key={label}><img src={`/assets/photos/${image}`} alt={alt} /><span><small>{small}</small>{label}</span></a>)}</div></section>;
}
function QuickViewModal({ product, onClose, onAdd, message, stockRequestOpen, setStockRequestOpen }) {
  const [requestMessage, setRequestMessage] = useState("");
  if (!product) return <div className="quick-view-modal" id="quickViewModal" aria-hidden="true" />;
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
  }  return <div className="quick-view-modal open" id="quickViewModal" aria-hidden="false"><div className="quick-view-backdrop" onClick={onClose}></div><section className="quick-view-dialog" role="dialog" aria-modal="true" aria-labelledby="quickViewTitle"><button className="quick-view-close" type="button" aria-label="Close quick view" onClick={onClose}><Icon type="close" /></button><div className="quick-view-image"><img src={assetUrl(product.image_url)} alt={product.title} /></div><div className="quick-view-details"><p className="eyebrow">Memo collection</p><h2 id="quickViewTitle">{product.title}</h2><p className="quick-view-price">{money(product.price)}</p><p className="quick-view-summary">{product.summary}</p><p className="quick-view-description">{product.description}</p><div className="quick-view-notes"><span>Embroidered finish</span><span>Made in Pakistan</span><span>Dry clean only</span></div><button className="add-to-cart" type="button" onClick={() => onAdd(product)}>{product.stock <= 0 ? "Out of stock" : "Add to cart"}</button><p className="cart-message" aria-live="polite">{requestMessage || message}</p>{stockRequestOpen && <form className="stock-request-form" id="stockRequestForm" onSubmit={submitStockRequest}><input name="customer_name" placeholder="Full name" required minLength="2" /><input name="phone" placeholder="Phone" required minLength="5" /><input name="email" type="email" placeholder="Email" required /><textarea name="notes" placeholder="Notes"></textarea><button type="submit">Send request</button></form>}</div></section></div>;
}

function CartDrawer({ open, onClose, cart, setCart }) {
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  function updateQuantity(id, quantity) {
    setCart((items) => items.map((item) => item.product_id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) } : item));
  }
  async function submitCheckout(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    if (!cart.length) {
      setCheckoutMessage("Add at least one product to checkout.");
      return;
    }
    const payload = Object.fromEntries(new FormData(formElement).entries());
    payload.items = cart.map(({ product_id, quantity }) => ({ product_id, quantity }));
    setCheckoutMessage("Placing your order...");
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Order could not be placed.");
      const orderNumber = result.order_number || `MEMO-${String(result.id).padStart(5, "0")}`;
      formElement.reset();
      setConfirmation(orderNumber);
      setCart([]);
      setCheckoutMessage("");
    } catch (error) {
      setCheckoutMessage(error.message);
    }
  }  return <aside className={`cart-drawer${open ? " open" : ""}`} id="cartDrawer" aria-hidden={!open}><div className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cartTitle"><button className="cart-close" type="button" aria-label="Close cart" onClick={onClose}>x</button>{confirmation ? <div className="order-success" id="orderConfirmation" aria-live="polite"><span className="order-success-tick" aria-hidden="true"></span><h2 id="cartTitle">Order placed</h2></div> : <><h2 id="cartTitle">Shopping Bag</h2><div className="cart-items">{cart.length ? cart.map((item) => <div className="cart-row" data-id={item.product_id} key={item.product_id}><img src={assetUrl(item.image_url)} alt={item.title} /><div><strong>{item.title}</strong><span>{money(item.price)}</span><label>Qty <input type="number" min="1" max={item.stock} value={item.quantity} onChange={(event) => updateQuantity(item.product_id, Number(event.target.value))} /></label></div><button type="button" aria-label={`Remove ${item.title}`} onClick={() => setCart((items) => items.filter((entry) => entry.product_id !== item.product_id))}>Remove</button></div>) : <p className="empty-state">Your bag is empty.</p>}{cart.length > 0 && <p className="cart-total">Total <strong>{money(total)}</strong></p>}</div><form className="checkout-form" id="checkoutForm" onSubmit={submitCheckout}><h3>Checkout</h3><input name="customer_name" placeholder="Full name" required minLength="2" /><input name="phone" placeholder="Phone" required minLength="5" /><input name="email" type="email" placeholder="Email" required /><input name="address" placeholder="Address" required minLength="5" /><input name="city" placeholder="City" required minLength="2" /><textarea name="notes" placeholder="Order notes"></textarea><button type="submit">Place order</button><p className="checkout-message" aria-live="polite">{checkoutMessage}</p></form></>}</div><button className="cart-backdrop" type="button" aria-label="Close cart" onClick={onClose}></button></aside>;
}

function Newsletter({ message, setMessage }) {
  return <section className="newsletter" id="newsletter"><p className="eyebrow">Keep a little Memo</p><h2>Letters from Miraal</h2><p>New pieces, thoughtful stories and first access, sent gently to your inbox.</p><form id="newsletterForm" onSubmit={(event) => { event.preventDefault(); setMessage("Thank you for subscribing."); event.currentTarget.reset(); }}><label className="sr-only" htmlFor="email">Email address</label><input id="email" type="email" placeholder="Enter your email here..." required /><button>Subscribe</button></form><small id="formMessage" aria-live="polite">{message}</small></section>;
}

function Footer({ navigate }) {
  return <footer><div><h3>Memo by Miraal</h3><Link to="/#story" navigate={navigate}>Our Story</Link><a href="#">The Journal</a><a href="#">Contact Us</a></div><div><h3>Customer Care</h3><a href="#">FAQ's</a><a href="#">Returns & Exchanges</a><a href="#">Privacy Policy</a></div><div><h3>Online Information</h3><a href="#">My Account</a><a href="#">Order History</a><a href="#">Terms & Conditions</a></div><p>{"\u00a9"} 2026 MEMO BY MIRAAL {"\u00b7"} @MEMOBYMIRAAL</p></footer>;
}
