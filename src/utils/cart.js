import { cartKey, confirmationKey, currencyKey, currencies } from "../data/storeConfig";

export function cartItemKey(id, size = "Medium") {
  return `${id}:${size || "Medium"}`;
}

export function readCart() {
  try { return JSON.parse(localStorage.getItem(cartKey)) || []; } catch { return []; }
}

export function readConfirmation() {
  try { return JSON.parse(sessionStorage.getItem(confirmationKey)) || null; } catch { return null; }
}

export function readCurrency() {
  try {
    const saved = localStorage.getItem(currencyKey);
    return currencies[saved] ? saved : "PKR";
  } catch {
    return "PKR";
  }
}
