import { useState } from "react";
import Link from "../components/Link";

export default function ContactPage({ navigate }) {
  const [message, setMessage] = useState("");

  function submitContact(event) {
    event.preventDefault();
    setMessage("Thank you. We will get back to you shortly.");
    event.currentTarget.reset();
  }

  return (
    <main className="contact-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/" navigate={navigate}>Home</Link>
        <span>/</span>
        <span>Contact Us</span>
      </nav>

      <section className="contact-shell">
        <div className="contact-copy">
          <p className="eyebrow">Memo care</p>
          <h1>Contact Us</h1>
          <p>Questions about a piece, sizing, availability, or an order? Leave us a note and the studio will reach out.</p>

          <div className="contact-details">
            <a
              href="https://wa.me/923193746142"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp: +92 319 3746142
            </a>
            <a href="mailto:hello@memobymiraal.com">
              Email: hello@memobymiraal.com
            </a>
          </div>
        </div>

        <form className="contact-form" onSubmit={submitContact}>
          <label>
            <span>Name</span>
            <input name="name" autoComplete="name" required minLength="2" />
          </label>

          <label>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>

          <label>
            <span>Phone Number</span>
            <input name="phone" type="tel" autoComplete="tel" required minLength="5" />
          </label>

          <label>
            <span>Comment</span>
            <textarea name="comment" required minLength="4"></textarea>
          </label>

          <button type="submit">Send Message</button>
          <p className="contact-message" aria-live="polite">{message}</p>
        </form>
      </section>
    </main>
  );
}
