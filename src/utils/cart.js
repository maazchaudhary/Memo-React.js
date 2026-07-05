import { cartKey, confirmationKey, currencyKey, currencies } from "../data/storeConfig";

export const addOnOptions = [
  { id: "pants", label: "Pants", price: 4500 },
  { id: "dupatta", label: "Dupatta", price: 3500 }
];

export function normalizeAddOns(addOns = []) {
  const selected = Array.isArray(addOns) ? addOns : [];
  const selectedIds = new Set(selected.map((item) => String(item || "").toLowerCase()));
  return addOnOptions.filter((option) => selectedIds.has(option.id)).map((option) => option.id);
}

export function addOnsTotal(addOns = []) {
  const selected = new Set(normalizeAddOns(addOns));
  return addOnOptions.reduce((sum, option) => sum + (selected.has(option.id) ? option.price : 0), 0);
}

export function addOnsLabel(addOns = []) {
  const selected = new Set(normalizeAddOns(addOns));
  const labels = addOnOptions.filter((option) => selected.has(option.id)).map((option) => option.label);
  return labels.length ? labels.join(", ") : "None";
}

export function cartItemKey(id, size = "M", addOns = []) {
  const addOnKey = normalizeAddOns(addOns).join("+") || "none";
  return `${id}:${size || "M"}:${addOnKey}`;
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
