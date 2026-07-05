import { useState } from "react";
import Link from "../components/Link";
import OrderSummary from "../components/OrderSummary";
import { confirmationKey, manualPaymentInstructions, paymentOptions } from "../data/storeConfig";

export default function CheckoutPage({ cart, totals, currency, navigate, setCart, setOrderConfirmation }) {
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
    payload.items = cart.map(({ product_id, quantity, size, add_ons }) => ({ product_id, quantity, size: size || "M", add_ons: add_ons || [] }));

    setMessage("Placing your order...");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.detail || "Order could not be placed.");

      const confirmation = {
        ...result,
        currency,
        instructions: manualPaymentInstructions[result.payment_method] || ""
      };

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

  return (
    <main className="checkout-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/" navigate={navigate}>Home</Link>
        <span>/</span>
        <span>Checkout</span>
      </nav>

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
            <div className="payment-options">
              {paymentOptions.map((option) => (
                <label className="payment-option" key={option}>
                  <input
                    type="radio"
                    name="payment_method_choice"
                    checked={paymentMethod === option}
                    onChange={() => setPaymentMethod(option)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>

            {manualInstructions && (
              <div className="payment-instructions">
                <strong>Payment instructions</strong>
                <p>{manualInstructions}</p>
              </div>
            )}

            {manualInstructions && <input name="transaction_reference" placeholder="Transaction / reference number (optional)" />}
          </fieldset>

          <button type="submit" disabled={!cart.length}>Place order</button>
          <p className="checkout-message" aria-live="polite">{message}</p>
        </form>

        <OrderSummary cart={cart} totals={totals} currency={currency} />
      </section>
    </main>
  );
}
