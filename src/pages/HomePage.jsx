import { seedProducts } from "../data/products";
import ProductCard from "../components/ProductCard";
import ImageFeatureCard from "../components/ImageFeatureCard";
import Hero from "./Hero";

export default function HomePage({ products, currency, navigate }) {
  const featured = products.filter((product) => product.featured).slice(0, 4);
  const homeProducts = featured.length ? featured : seedProducts.slice(0, 4);

  const findProduct = (title, image) =>
    products.find((product) => product.title === title) ||
    seedProducts.find((product) => product.title === title) ||
    seedProducts.find((product) => String(product.image_url || "").includes(image));
  const storyProduct = findProduct("Sunlit Memo", "IMG_1355.jpg");
  const socialImages = ["IMG_8446.jpg", "IMG_1090.jpg", "IMG_7990.jpg", "IMG_1924.jpg", "IMG_0814.jpg"];

  return (
    <main>
      <Hero navigate={navigate} />

      <section className="products" id="new">
        <h2 className="home-section-heading">Luxury in Every Thread</h2>
        <div className="product-grid">
          {homeProducts.map((product) => (
            <ProductCard key={product.id} product={product} currency={currency} navigate={navigate} />
          ))}
        </div>
      </section>

      <TopPicks products={products} navigate={navigate} />

      <section className="wedding-feature" id="story">
        <div
          className="story-image story-image-clickable"
          onClick={() => storyProduct && navigate(`/products/${storyProduct.slug || "sapphire"}`)}
          role={storyProduct ? "link" : undefined}
          tabIndex={storyProduct ? 0 : undefined}
          onKeyDown={(event) => {
            if (storyProduct && (event.key === "Enter" || event.key === " ")) {
              navigate(`/products/${storyProduct.slug || "sapphire"}`);
            }
          }}
        >
          <img src="/assets/photos/IMG_1355.jpg" alt="Woman wearing a pale yellow embroidered kaftan" />
        </div>

        <div className="story-copy">
          <p className="eyebrow">The story behind the clothes</p>
          <h2>A little memory,<br />made wearable.</h2>
          <p>Memo by Miraal is a love letter to colour, comfort and the women who make every room feel warmer. Each piece is designed to live beyond an occasion and become part of your own story.</p>
        </div>
      </section>

      <section className="occasions">
        {[
          ["IMG_8821.jpg", "Kaira embroidered dress", "Kaira"],
          ["IMG_5142.jpg", "Lira Pink embroidered dress", "Lira Pink"],
          ["IMG_4715.jpg", "Raya embroidered dress", "Raya"],
          ["IMG_0445.jpg", "Dusk embroidered dress", "Dusk"]
        ].map(([image, alt, label]) => (
          <ImageFeatureCard key={label} image={image} alt={alt} label={label} product={findProduct(label, image)} navigate={navigate} />
        ))}
      </section>

      <section className="social" id="social">
        <p className="eyebrow">Seen and loved</p>
        <h2>@memobymiraal</h2>
        <div className="social-track">
          <div className="social-set">
            {socialImages.map((image) => (
              <img key={image} src={`/assets/photos/${image}`} alt="Memo by Miraal look" />
            ))}
          </div>
          <div className="social-set social-set-duplicate" aria-hidden="true">
            {socialImages.map((image) => (
              <img key={`duplicate-${image}`} src={`/assets/photos/${image}`} alt="" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function TopPicks({ products, navigate }) {
  const findProduct = (title, image) =>
    products.find((product) => product.title === title) ||
    seedProducts.find((product) => product.title === title) ||
    seedProducts.find((product) => String(product.image_url || "").includes(image));
  return (
    <section className="top-picks" id="top-picks">
      <p className="eyebrow">A wardrobe in bloom</p>
      <h2>SEASON'S TOP PICKS</h2>
      <div className="pick-grid">
        {[
          ["IMG_2453.jpg", "Kaira Pink evening outfit", "Evening notes", "Kaira Pink"],
          ["IMG_9820.jpg", "Amaya embroidered outfit", "Quiet colour", "Amaya"],
          ["IMG_1524.jpg", "Bloom silk dress", "Easy elegance", "Bloom"]
        ].map(([image, alt, small, label]) => (
          <ImageFeatureCard key={label} image={image} alt={alt} small={small} label={label} product={findProduct(label, image)} navigate={navigate} />
        ))}
      </div>
    </section>
  );
}
