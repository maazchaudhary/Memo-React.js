import { useEffect, useState } from "react";
import Link from "../components/Link";

export default function Hero({ navigate }) {
  const slides = [
    { desktop: "/assets/photos/hero-composite-collection-headroom.png", mobile: "/assets/photos/hero-composite-collection.png", alt: "Four models wearing pastel embroidered Memo by Miraal outfits" },
    { desktop: "/assets/photos/hero-composite-evening-collection-headroom.png", mobile: "/assets/photos/hero-composite-evening-collection.png", alt: "Four models wearing evening embroidered Memo by Miraal outfits" }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="hero" aria-label="Memo by Miraal featured collection">
      <div className="hero-copy">
        <p className="eyebrow">The summer memo {"\u00b7"} 2026</p>
        <h1>Made for your<br /><em>softest moments.</em></h1>
        <p>Easy silhouettes, delicate details, and colours borrowed from the garden.</p>
        <Link to="/#new" navigate={navigate}>Explore the collection</Link>
      </div>

      <div className="hero-image" id="heroCarousel" aria-roledescription="carousel" aria-label="Featured Memo looks">
        <div className="hero-slides" aria-live="polite">
          {slides.map((slide, slideIndex) => (
            <picture key={slide.alt} className={`hero-slide hero-slide-composite${slideIndex === index ? " active" : ""}`}>
              <source media="(max-width: 1024px)" srcSet={slide.mobile} />
              <img src={slide.desktop} alt={slide.alt} />
            </picture>
          ))}
        </div>
      </div>
    </section>
  );
}