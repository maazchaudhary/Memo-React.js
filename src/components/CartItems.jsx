import { sizeOptions } from "../data/storeConfig";
import { addOnsLabel, cartItemKey } from "../utils/cart";
import { assetUrl } from "../utils/product";
import { money } from "../utils/money";

export default function CartItems({ cart, currency, updateSize, updateQuantity, removeItem }) {
  return (
    <div className="cart-items">
      {cart.length ? cart.map((item) => {
        const itemKey = item.key || cartItemKey(item.product_id, item.size, item.add_ons);
        const selectedSize = item.size || "M";
        const addOnsText = addOnsLabel(item.add_ons);

        return (
          <div className="cart-row" data-id={item.product_id} key={itemKey}>
            <img src={assetUrl(item.image_url)} alt={item.title} />
            <div>
              <strong>{item.title}</strong>
              <span>Size: {selectedSize}</span>
              <span>Add-ons: {addOnsText}</span>
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
              <div className="cart-quantity-stepper" aria-label={`Adjust quantity for ${item.title}`}>
                <button
                  type="button"
                  aria-label={`Decrease ${item.title} quantity`}
                  disabled={Number(item.quantity || 1) <= 1}
                  onClick={() => updateQuantity(itemKey, Number(item.quantity || 1) - 1)}
                >
                  -
                </button>
                <strong aria-live="polite">Qty {item.quantity}</strong>
                <button
                  type="button"
                  aria-label={`Increase ${item.title} quantity`}
                  disabled={Number(item.quantity || 1) >= 99}
                  onClick={() => updateQuantity(itemKey, Number(item.quantity || 1) + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <button type="button" aria-label={`Remove ${item.title}`} onClick={() => removeItem(itemKey)}>Remove</button>
          </div>
        );
      }) : <p className="empty-state">Your bag is empty.</p>}
    </div>
  );
}
