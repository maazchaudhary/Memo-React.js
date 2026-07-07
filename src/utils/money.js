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

export function discountedPrice(product) {
  const price = Number(product?.price || 0);
  const discountPrice = Number(product?.discount_price || 0);
  return price > 0 && discountPrice > 0 && discountPrice < price ? discountPrice : null;
}

export function productPrice(product) {
  return discountedPrice(product) || Number(product?.price || 0);
}

export function discountPercent(product) {
  const price = Number(product?.price || 0);
  const discountPrice = discountedPrice(product);
  if (!discountPrice || price <= 0) return null;
  return Math.max(1, Math.min(99, Math.round(((price - discountPrice) / price) * 100)));
}
