import { sizeOptions } from "../data/storeConfig";
import { cartItemKey } from "../utils/cart";
import { assetUrl } from "../utils/product";
import { money } from "../utils/money";

export default function CartItems({ cart, currency, updateQuantity, updateSize, removeItem }) {
  return (
    <div className="cart-items">
      {cart.length ? cart.map((item) => {
        const itemKey = item.key || cartItemKey(item.product_id, item.size);
        const selectedSize = item.size || "Medium";

        return (
          <div className="cart-row" data-id={item.product_id} key={itemKey}>
            <img src={assetUrl(item.image_url)} alt={item.title} />
            <div>
              <strong>{item.title}</strong>
              <span>{money(item.price, currency)}</span>
              <div className="cart-size-selector" aria-label={`Select size for ${item.title}`}>
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={selectedSize === size ? "active" : ""}
                    aria-pressed={selectedSize === size}
                    onClick={() => updateSize(itemKey, size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <label>
                Qty <input type="number" min="1" max={item.stock} value={item.quantity} onChange={(event) => updateQuantity(itemKey, event.target.value)} />
              </label>
            </div>
            <button type="button" aria-label={`Remove ${item.title}`} onClick={() => removeItem(itemKey)}>Remove</button>
          </div>
        );
      }) : <p className="empty-state">Your bag is empty.</p>}
    </div>
  );
}