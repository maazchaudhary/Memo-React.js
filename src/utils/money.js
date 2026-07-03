import { currencies } from "../data/storeConfig";

export function convertPrice(amount, currency = "PKR") {
  const config = currencies[currency] || currencies.PKR;
  const pkrAmount = Number(amount || 0);
  if (currency === "PKR") return Math.round(pkrAmount);
  return Math.ceil(pkrAmount / config.pkrPerUnit);
}

export function money(amount, currency = "PKR") {
  const config = currencies[currency] || currencies.PKR;
  return `${config.prefix}${convertPrice(amount, currency).toLocaleString(config.locale)}`;
}