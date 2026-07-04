import { sizeOptions } from "../data/storeConfig";
import { addOnsLabel, cartItemKey } from "../utils/cart";
import { assetUrl } from "../utils/product";
import { money } from "../utils/money";

export default function CartItems({ cart, currency, updateSize, removeItem }) {
  return (
    <div className="cart-items">
      {cart.length ? cart.map((item) => {
        const itemKey = item.key || cartItemKey(item.product_id, item.size, item.add_ons);
        const selectedSize = item.size || "Medium";
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
              <span className="cart-quantity">Qty {item.quantity}</span>
            </div>
            <button type="button" aria-label={`Remove ${item.title}`} onClick={() => removeItem(itemKey)}>Remove</button>
          </div>
        );
      }) : <p className="empty-state">Your bag is empty.</p>}
    </div>
  );
}
