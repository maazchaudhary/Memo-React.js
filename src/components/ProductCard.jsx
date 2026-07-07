import { useState } from "react";
import Icon from "./Icon";
import { discountPercent, discountedPrice, money, productPrice } from "../utils/money";
import { productGallery, productPath } from "../utils/product";

export default function ProductCard({ product, currency, navigate, showHeart = false }) {
  const [liked, setLiked] = useState(false);
  const [thumbnail] = productGallery(product);
  const salePrice = discountedPrice(product);
  const percentOff = discountPercent(product);

  function openProduct() {
    navigate(productPath(product));
  }

  return (
    <article
      className="product-card-link"
      data-product-id={product.id}
      data-price={money(productPrice(product), currency)}
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
      <div className="product-card-price">
        {salePrice ? (
          <>
            <span className="old-price">{money(product.price, currency)}</span>
            <strong>{money(salePrice, currency)}</strong>
            <span className="discount-badge">{percentOff}% off</span>
          </>
        ) : (
          <strong>{money(product.price, currency)}</strong>
        )}
      </div>
    </article>
  );
}
