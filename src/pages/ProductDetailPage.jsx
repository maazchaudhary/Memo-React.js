import { useEffect, useState } from "react";
import { seedProducts } from "../data/products";
import { sizeOptions } from "../data/storeConfig";
import Link from "../components/Link";
import Icon from "../components/Icon";
import ProductCard from "../components/ProductCard";
import { money } from "../utils/money";
import { productGallery } from "../utils/product";

export default function ProductDetailPage({ product, products, currency, navigate, onAdd, message, stockRequestOpen, setStockRequestOpen }) {
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

  if (!product) {
    return (
      <main className="product-detail-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/" navigate={navigate}>Home</Link>
          <span>/</span>
          <span>Product</span>
        </nav>
        <section className="product-not-found">
          <p className="eyebrow">Memo collection</p>
          <h1>Product not found</h1>
          <p>This piece is not available right now.</p>
          <button className="checkout-button" type="button" onClick={() => navigate("/new-arrivals")}>View new arrivals</button>
        </section>
      </main>
    );
  }

  async function submitStockRequest(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const payload = Object.fromEntries(new FormData(formElement).entries());
    payload.product_id = product.id;
    setRequestMessage("Sending your request...");

    try {
      const response = await fetch("/api/stock-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Request could not be sent.");
      formElement.reset();
      setStockRequestOpen(false);
      setRequestMessage(`We will contact you when ${product.title} is back in stock.`);
    } catch (error) {
      setRequestMessage(error.message);
    }
  }

  return (
    <main className="product-detail-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/" navigate={navigate}>Home</Link>
        <span>/</span>
        <Link to="/new-arrivals" navigate={navigate}>New Arrivals</Link>
        <span>/</span>
        <span>{product.title}</span>
      </nav>

      <section className="product-detail-shell">
        <div className={`product-gallery${gallery.length > 1 ? "" : " single-image"}`} aria-label={`${product.title} images`}>
          <div className={`product-gallery-main${zoomed ? " zoomed" : ""}`} onMouseMove={moveZoom}>
            <img src={gallery[activeImageIndex]} alt={`${product.title} ${activeImageIndex + 1}`} style={{ transformOrigin: zoomOrigin }} />
            <button className="product-zoom-button" type="button" aria-label={zoomed ? `Zoom out ${product.title} image` : `Zoom in ${product.title} image`} aria-pressed={zoomed} onClick={() => setZoomed((current) => !current)}>
              <Icon type="zoom" />
            </button>
          </div>

          {gallery.length > 1 && (
            <div className="product-thumbnails">
              {gallery.map((image, index) => (
                <button key={image} type="button" className={index === activeImageIndex ? "active" : ""} aria-label={`View ${product.title} image ${index + 1}`} onClick={() => { setImageIndex(index); setZoomed(false); }}>
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-copy">
          <p className="eyebrow">Memo collection</p>
          <h1>{product.title}</h1>
          <p className="product-detail-price">{money(product.price, currency)}</p>
          <p className="product-detail-summary">{product.summary}</p>
          <p className="product-detail-description">{product.description}</p>

          <div className="size-selector" aria-label="Select size">
            <span>Size</span>
            <div>
              {sizeOptions.map((size) => (
                <button key={size} type="button" className={selectedSize === size ? "active" : ""} aria-pressed={selectedSize === size} onClick={() => setSelectedSize(size)}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="quick-view-notes">
            <span>Embroidered finish</span>
            <span>Made in Pakistan</span>
            <span>Dry clean only</span>
          </div>

          {product.stock <= 0 && <small className="stock-note disabled">Currently out of stock</small>}

          <button className="add-to-cart" type="button" onClick={() => onAdd(product, selectedSize)}>
            {product.stock <= 0 ? "Request availability" : "Add to cart"}
          </button>

          <p className="cart-message" aria-live="polite">{requestMessage || message}</p>

          {stockRequestOpen && (
            <form className="stock-request-form" id="stockRequestForm" onSubmit={submitStockRequest}>
              <input name="customer_name" placeholder="Full name" required minLength="2" />
              <input name="phone" placeholder="Phone" required minLength="5" />
              <input name="email" type="email" placeholder="Email" required />
              <textarea name="notes" placeholder="Notes"></textarea>
              <button type="submit">Send request</button>
            </form>
          )}
        </div>
      </section>

      <section className="you-may-like">
        <p className="eyebrow">You may also like</p>
        <h2>Latest arrivals</h2>
        <div className="recommendation-grid">
          {(latestArrivals.length ? latestArrivals : seedProducts.filter((item) => item.id !== product.id).slice(0, 4)).map((item) => (
            <ProductCard key={`latest-${item.id}`} product={item} currency={currency} navigate={navigate} />
          ))}
        </div>

        <h2>Customer Favorites</h2>
        <div className="recommendation-grid">
          {(CustomerFavorites.length ? CustomerFavorites : seedProducts.filter((item) => item.id !== product.id).slice(4, 8)).map((item) => (
            <ProductCard key={`sale-${item.id}`} product={item} currency={currency} navigate={navigate} />
          ))}
        </div>
      </section>
    </main>
  );
}