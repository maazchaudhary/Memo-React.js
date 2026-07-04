import { useState } from "react";
import Link from "./Link";

export default function Footer({ navigate }) {
  const [openSections, setOpenSections] = useState({
    service: true,
    help: false,
    policies: false
  });

  function toggleSection(section) {
    setOpenSections((current) => ({ ...current, [section]: !current[section] }));
  }

  return (
    <footer>
      <div className={`footer-section footer-service${openSections.service ? " open" : ""}`}>
        <button type="button" aria-expanded={openSections.service} onClick={() => toggleSection("service")}>Memo Customer Service</button>
        <div className="footer-section-content">
          <h3>Memo Customer Service</h3>
          <p>Monday to Friday 10am - 9pm</p>
          <p>WhatsApp: +92 319 3746142</p>
          <p>Messages only</p>
          <p>Instagram: memobymiraal</p>
        </div>
      </div>
      <div className={`footer-section${openSections.help ? " open" : ""}`}>
        <button type="button" aria-expanded={openSections.help} onClick={() => toggleSection("help")}>Help and Information</button>
        <div className="footer-section-content">
          <h3>Help and Information</h3>
          <Link to="/payment" navigate={navigate}>Payment</Link>
          <Link to="/disclaimer" navigate={navigate}>Disclaimer</Link>
          <Link to="/contact-us" navigate={navigate}>Contact Us</Link>
        </div>
      </div>
      <div className={`footer-section${openSections.policies ? " open" : ""}`}>
        <button type="button" aria-expanded={openSections.policies} onClick={() => toggleSection("policies")}>Policies</button>
        <div className="footer-section-content">
          <h3>Policies</h3>
          <Link to="/faqs" navigate={navigate}>FAQ's</Link>
          <Link to="/terms-and-conditions" navigate={navigate}>Terms and conditions</Link>
          <Link to="/care-instructions" navigate={navigate}>Care instructions</Link>
          <Link to="/returns-and-exchanges" navigate={navigate}>Returns & Exchanges</Link>
        </div>
      </div>
      <p>{"\u00a9"} 2026 MEMO BY MIRAAL {"\u00b7"} @MEMOBYMIRAAL</p>
    </footer>
  );
}
