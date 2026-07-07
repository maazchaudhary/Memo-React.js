import { useEffect, useMemo, useState } from "react";
import Link from "../components/Link";
import OrderSummary from "../components/OrderSummary";
import { confirmationKey, manualPaymentInstructions, paymentOptions } from "../data/storeConfig";

export default function CheckoutPage({ cart, totals, currency, navigate, setCart, setOrderConfirmation }) {
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [message, setMessage] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const manualInstructions = manualPaymentInstructions[paymentMethod];
  const summaryTotals = useMemo(() => ({
    ...totals,
    couponDiscount: appliedCoupon?.coupon_discount || 0,
    shippingDiscount: appliedCoupon?.shipping_discount || 0,
    deliveryFee: appliedCoupon ? appliedCoupon.delivery_fee : totals.deliveryFee,
    finalTotal: appliedCoupon ? appliedCoupon.total : totals.finalTotal
  }), [appliedCoupon, totals]);

  useEffect(() => {
    if (!appliedCoupon) return;
    setAppliedCoupon(null);
    setCouponMessage("Cart changed. Apply the coupon again.");
  }, [cart.length, totals.subtotal]);

  async function applyCoupon() {
    const code = couponCode.trim();
    if (!code) {
      setAppliedCoupon(null);
      setCouponMessage("Enter a coupon code.");
      return;
    }
    if (!cart.length) {
      setAppliedCoupon(null);
      setCouponMessage("Add products before applying a coupon.");
      return;
    }

    setCouponMessage("Checking coupon...");
    try {
      const params = new URLSearchParams({ code, subtotal: String(totals.subtotal) });
      const response = await fetch(`/api/coupons/validate?${params}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || "Coupon could not be applied.");
      setAppliedCoupon(result);
      setCouponCode(result.code);
      setCouponMessage(`${result.code} applied.`);
    } catch (error) {
      setAppliedCoupon(null);
      setCouponMessage(error.message);
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponMessage("");
  }

  async function submitCheckout(event) {
    event.preventDefault();

    if (!cart.length) {
      setMessage("Your cart is empty. Add at least one product before checkout.");
      return;
    }

    const formElement = event.currentTarget;
    const payload = Object.fromEntries(new FormData(formElement).entries());
    payload.payment_method = paymentMethod;
    payload.coupon_code = appliedCoupon?.code || couponCode.trim();
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
            <legend>Coupon</legend>
            <div className="coupon-entry">
              <input
                name="coupon_code_input"
                value={couponCode}
                onChange={(event) => {
                  setCouponCode(event.target.value);
                  if (appliedCoupon) setAppliedCoupon(null);
                }}
                placeholder="Coupon code"
              />
              <button type="button" onClick={applyCoupon} disabled={!cart.length}>Apply</button>
              {appliedCoupon && <button type="button" className="checkout-button secondary" onClick={removeCoupon}>Remove</button>}
            </div>
            <p className="coupon-message" aria-live="polite">{couponMessage}</p>
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

        <OrderSummary cart={cart} totals={summaryTotals} currency={currency} coupon={appliedCoupon} />
      </section>
    </main>
  );
}
