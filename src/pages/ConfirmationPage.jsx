import { money } from "../utils/money";

export default function ConfirmationPage({ confirmation, currency, navigate }) {
  const confirmationCurrency = confirmation?.currency || currency;

  return (
    <main className="checkout-page">
      <section className="confirmation-panel">
        <span className="order-success-tick" aria-hidden="true"></span>
        <p className="eyebrow">Order received</p>
        <h1>Thank you</h1>

        {confirmation ? (
          <>
            <p>Your order number is <strong>{confirmation.order_number}</strong>.</p>
            <p>Total: <strong>{money(confirmation.total, confirmationCurrency)}</strong></p>
            <p>Payment: <strong>{confirmation.payment_method}</strong> - {confirmation.payment_status}</p>

            {confirmation.instructions && (
              <div className="payment-instructions">
                <strong>Payment instructions</strong>
                <p>{confirmation.instructions}</p>
              </div>
            )}
          </>
        ) : (
          <p>Your most recent order details are not available in this browser session.</p>
        )}

        <button className="checkout-button" type="button" onClick={() => navigate("/new-arrivals")}>
          Continue shopping
        </button>
      </section>
    </main>
  );
}