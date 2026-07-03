import Link from "./Link";

export default function Footer({ navigate }) {
  return (
    <footer>
      <div className="footer-service">
        <h3>Memo Customer Service</h3>
        <p>Monday to Friday 10am - 9pm</p>
        <p>WhatsApp: +92 319 3746142</p>
        <p>Messages only</p>
        <p>Instagram: memobymiraal</p>
      </div>
      <div>
        <h3>Help and Information</h3>
        <Link to="/payment" navigate={navigate}>Payment</Link>
        <Link to="/disclaimer" navigate={navigate}>Disclaimer</Link>
        <Link to="/contact-us" navigate={navigate}>Contact Us</Link>
      </div>
      <div>
        <h3>Orders</h3>
        <Link to="/faqs" navigate={navigate}>FAQ's</Link>
        <Link to="/terms-and-conditions" navigate={navigate}>Terms and conditions</Link>
        <Link to="/care-instructions" navigate={navigate}>Care instructions</Link>
        <Link to="/returns-and-exchanges" navigate={navigate}>Returns & Exchanges</Link>
      </div>
      <p>{"\u00a9"} 2026 MEMO BY MIRAAL {"\u00b7"} @MEMOBYMIRAAL</p>
    </footer>
  );
}