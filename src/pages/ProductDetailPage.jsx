import { useEffect, useState } from "react";
import { seedProducts } from "../data/products";
import { sizeOptions } from "../data/storeConfig";
import Link from "../components/Link";
import Icon from "../components/Icon";
import ProductCard from "../components/ProductCard";
import { money } from "../utils/money";
import { productGallery } from "../utils/product";
import { addOnOptions, addOnsTotal, normalizeAddOns } from "../utils/cart";

export default function ProductDetailPage({ product, products, currency, navigate, onAdd, message, stockRequestOpen, setStockRequestOpen }) {
  const [requestMessage, setRequestMessage] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");

  const gallery = productGallery(product);
  const activeImageIndex = gallery[imageIndex] ? imageIndex : 0;
  const maxQuantity = 99;
  const isManuallyOutOfStock = Boolean(product?.out_of_stock);
  const latestArrivals = products.filter((item) => item.id !== product?.id).slice(0, 4);
  const CustomerFavorites = products
    .filter((item) => item.id !== product?.id && !item.out_of_stock)
    .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
    .slice(0, 4);
  const selectedAddOnsTotal = addOnsTotal(selectedAddOns);
  const displayPrice = Number(product?.price || 0) + selectedAddOnsTotal;

  useEffect(() => {
    setImageIndex(0);
    setSelectedSize("Medium");
    setQuantity(1);
    setSelectedAddOns([]);
    setZoomed(false);
  }, [product?.id]);

  useEffect(() => {
    setQuantity((current) => Math.min(Math.max(1, current), maxQuantity));
  }, [maxQuantity]);

  function updateQuantity(nextQuantity) {
    setQuantity(Math.min(maxQuantity, Math.max(1, nextQuantity)));
  }

  function moveZoom(event) {
    if (!zoomed) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    setZoomOrigin(`${x}% ${y}%`);
  }

  function toggleAddOn(addOnId) {
    setSelectedAddOns((current) => {
      const normalized = normalizeAddOns(current);
      return normalized.includes(addOnId)
        ? normalized.filter((item) => item !== addOnId)
        : normalizeAddOns([...normalized, addOnId]);
    });
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
          <p className="product-detail-price">{money(displayPrice, currency)}</p>
          <p className="product-detail-summary">{product.summary}</p>

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

          {!isManuallyOutOfStock && (
            <div className="product-quantity" aria-label="Select quantity">
              <span>Quantity</span>
              <div className="quantity-stepper">
                <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => updateQuantity(quantity - 1)}>
                  -
                </button>
                <strong aria-live="polite">{quantity}</strong>
                <button type="button" aria-label="Increase quantity" disabled={quantity >= maxQuantity} onClick={() => updateQuantity(quantity + 1)}>
                  +
                </button>
              </div>
            </div>
          )}

          <div className="product-add-ons">
            <span>You May Also Add</span>
            <div>
              {addOnOptions.map((option) => (
                <label key={option.id}>
                  <input
                    type="checkbox"
                    checked={selectedAddOns.includes(option.id)}
                    onChange={() => toggleAddOn(option.id)}
                  />
                  <span>{option.label} - {money(option.price, currency)}</span>
                </label>
              ))}
            </div>
          </div>

          {isManuallyOutOfStock && <small className="stock-note disabled">Out of Stock</small>}

          <button className="add-to-cart" type="button" onClick={() => onAdd(product, selectedSize, quantity, selectedAddOns)}>
            {isManuallyOutOfStock ? "Request Product" : "Add to cart"}
          </button>

          <p className="cart-message" aria-live="polite">{requestMessage || message}</p>

          <div className="product-info-accordions">
            <details>
              <summary>Product Details</summary>
              <p>{product.description}</p>
            </details>
            <details>
              <summary>Care Instructions</summary>
              <ul>
                <li>Each product of ours is designed with highest quality standards and delicacy.</li>
                <li>Handle with care.</li>
                <li>Dry clean only.</li>
              </ul>
            </details>
            <details>
              <summary>Disclaimer</summary>
              <p>The fabric pattern/laces may vary.</p>
              <p>Length will vary according to the design.</p>
              <p>Actual colors of the outfit may vary from the colors being displayed on your device.</p>
              <p>There may be a tolerance of +/- 1 inches, due to the handmade nature of our garments.</p>
            </details>
            <details>
              <summary>Custom Size</summary>
              <p>Message your custom measurements on Instagram page.</p>
            </details>
          </div>

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
