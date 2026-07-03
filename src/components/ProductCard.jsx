import { useState } from "react";
import Icon from "./Icon";
import { money } from "../utils/money";
import { productGallery, productPath } from "../utils/product";

export default function ProductCard({ product, currency, navigate, showHeart = false }) {
  const [liked, setLiked] = useState(false);
  const [thumbnail] = productGallery(product);

  function openProduct() {
    navigate(productPath(product));
  }

  return (
    <article
      className="product-card-link"
      data-product-id={product.id}
      data-price={money(product.price, currency)}
      data-details={product.description}
      role="link"
      tabIndex="0"
      onClick={openProduct}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") openProduct();
      }}
    >
      <div className="product-photo">
        <img src={thumbnail} alt={product.title} />
        {showHeart && (
          <div className="card-tools">
            <button
              className="heart"
              type="button"
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={liked}
              onClick={(event) => {
                event.stopPropagation();
                setLiked(!liked);
              }}
            >
              <Icon type="heart" />
            </button>
          </div>
        )}
      </div>
      <h2>{product.title}</h2>
      <p>{product.summary}</p>
    </article>
  );
}