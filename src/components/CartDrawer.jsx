import CartItems from "./CartItems";
import OrderSummary from "./OrderSummary";

export default function CartDrawer({ open, onClose, cart, totals, currency, navigate, updateSize, updateQuantity, removeItem }) {
  function goCheckout() {
    if (!cart.length) return;
    onClose();
    navigate("/checkout");
  }

  return (
    <aside className={`cart-drawer${open ? " open" : ""}`} id="cartDrawer" aria-hidden={!open}>
      <div className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
        <button className="cart-close" type="button" aria-label="Close cart" onClick={onClose}>x</button>
        <h2 id="cartTitle">Shopping Bag</h2>
        <CartItems cart={cart} currency={currency} updateSize={updateSize} updateQuantity={updateQuantity} removeItem={removeItem} />
        <OrderSummary cart={cart} totals={totals} currency={currency} compact />
        <button className="checkout-button" type="button" disabled={!cart.length} onClick={goCheckout}>Checkout</button>
      </div>
      <button className="cart-backdrop" type="button" aria-label="Close cart" onClick={onClose}></button>
    </aside>
  );
}
