export default function Newsletter({ message, setMessage }) {
  return (
    <section className="newsletter" id="newsletter">
      <p className="eyebrow">Keep a little Memo</p>
      <h2>Letters from Miraal</h2>
      <p>New pieces, thoughtful stories and first access, sent gently to your inbox.</p>
      <form id="newsletterForm" onSubmit={(event) => {
        event.preventDefault();
        setMessage("Thank you for subscribing.");
        event.currentTarget.reset();
      }}>
        <label className="sr-only" htmlFor="email">Email address</label>
        <input id="email" type="email" placeholder="Enter your email here..." required />
        <button>Subscribe</button>
      </form>
      <small id="formMessage" aria-live="polite">{message}</small>
    </section>
  );
}