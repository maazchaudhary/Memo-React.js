import { productPath } from "../utils/product";

export default function ImageFeatureCard({ image, alt, label, small, product, navigate }) {
  return (
    <a
      href={product ? productPath(product) : "#"}
      className="image-feature-card"
      onClick={(event) => {
        event.preventDefault();
        if (product) navigate(productPath(product));
      }}
    >
      <img src={`/assets/photos/${image}`} alt={alt} />
      <span>{small && <small>{small}</small>}{label}</span>
    </a>
  );
}