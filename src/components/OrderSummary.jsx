import { money } from "../utils/money";
import { addOnsLabel, cartItemKey } from "../utils/cart";

export default function OrderSummary({ cart, totals, currency, compact = false }) {
  return (
    <section className={`order-summary${compact ? " compact" : ""}`} aria-label="Order summary">
      <h2>Order summary</h2>
      <div className="summary-items">
        {cart.length ? cart.map((item) => (
          <div className="summary-row" key={item.key || cartItemKey(item.product_id, item.size, item.add_ons)}>
            <span>{item.title} ({item.size || "M"}) x {item.quantity}<small>Add-ons: {addOnsLabel(item.add_ons)}</small></span>
            <strong>{money(item.price * item.quantity, currency)}</strong>
          </div>
        )) : <p className="empty-state">Your bag is empty.</p>}
      </div>
      <div className="summary-totals">
        <p><span>Subtotal</span><strong>{money(totals.subtotal, currency)}</strong></p>
        <p><span>Delivery fee</span><strong>{money(totals.deliveryFee, currency)}</strong></p>
        <p className="summary-final"><span>Total</span><strong>{money(totals.finalTotal, currency)}</strong></p>
      </div>
    </section>
  );
}
