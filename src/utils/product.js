import { seedProducts } from "../data/products";

export function assetUrl(value) {
  const path = String(value || "");
  if (/^(https?:|data:|blob:)/.test(path) || path.startsWith("/")) return path;
  if (path.startsWith("../assets/")) return path.replace("..", "");
  return path.startsWith("assets/") ? `/${path}` : path;
}

export function productGallery(product) {
  const images = Array.isArray(product?.images) ? product.images : [];
  const cleanImages = images.map(assetUrl).filter(Boolean);
  const thumbnail = assetUrl(product?.image_url);
  return (cleanImages.length ? cleanImages : [thumbnail]).filter(Boolean).slice(0, 5);
}

export function productSlug(product) {
  if (product?.slug) return product.slug;
  return String(product?.title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function productPath(product) {
  return `/products/${productSlug(product)}`;
}

export function findProductBySlug(products, slug) {
  return [...products, ...seedProducts].find((product) => productSlug(product) === slug || String(product.id) === slug);
}