import { currencies } from "../data/storeConfig";
import { menuItems } from "../data/pages";
import Icon from "./Icon";
import Link from "./Link";

export default function Header({ navigate, menuOpen, setMenuOpen, cartQuantity, currency, setCurrency, openCart }) {
  return <>
    <a className="hotline" href="#newsletter">A note from our studio - Join the Memo community</a>
    <header className="header">
      <button className="menu-trigger" id="menuButton" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><i></i><i></i><span>Menu</span></button>
      <Link className="logo" to="/" navigate={navigate} aria-label="Memo home"><img src="/assets/memo-logo.png" alt="Memo" /></Link>
      <div className="tools">
        <label className="currency" aria-label="Currency">
          <select value={currency} onChange={(event) => setCurrency(event.target.value)}>
            {Object.entries(currencies).map(([code, config]) => <option key={code} value={code}>{config.name}</option>)}
          </select>
        </label>
        <button className="counter cart-counter" aria-label="Shopping bag" onClick={openCart}><Icon type="bag" /><sup>({cartQuantity})</sup></button>
      </div>
    </header>
    <div className={`menu-panel${menuOpen ? " open" : ""}`} id="menuPanel" aria-hidden={!menuOpen}>
      <button className="menu-close" id="menuClose" aria-label="Close menu" onClick={() => setMenuOpen(false)}>Close</button>
      <nav>{menuItems.map(([label, itemPath]) => <Link key={itemPath} to={itemPath} navigate={navigate}>{label}</Link>)}</nav>
    </div>
    <div className={`menu-backdrop${menuOpen ? " open" : ""}`} id="menuBackdrop" onClick={() => setMenuOpen(false)}></div>
  </>;
}