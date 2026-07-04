import Link from "../components/Link";
import CartItems from "../components/CartItems";
import OrderSummary from "../components/OrderSummary";

export default function CartPage({ cart, totals, currency, navigate, updateSize, removeItem, openCart }) {
  return (
    <main className="checkout-page cart-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/" navigate={navigate}>Home</Link>
        <span>/</span>
        <span>Cart</span>
      </nav>

      <section className="checkout-shell">
        <div className="checkout-card">
          <p className="eyebrow">Shopping bag</p>
          <h1>Your Cart</h1>
          <CartItems cart={cart} currency={currency} updateSize={updateSize} removeItem={removeItem} />
          {!cart.length && (
            <button className="checkout-button secondary" type="button" onClick={() => navigate("/new-arrivals")}>
              Continue shopping
            </button>
          )}
        </div>

        <div>
          <OrderSummary cart={cart} totals={totals} currency={currency} />
          <button className="checkout-button" type="button" disabled={!cart.length} onClick={() => cart.length ? navigate("/checkout") : openCart()}>
            Checkout
          </button>
        </div>
      </section>
    </main>
  );
}
