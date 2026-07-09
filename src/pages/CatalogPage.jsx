import { useEffect, useState } from "react";
import { categoryPages, navItems } from "../data/pages";
import { seedProducts } from "../data/products";
import Link from "../components/Link";
import ProductCard from "../components/ProductCard";

export default function CatalogPage({ path, products, currency, navigate }) {
  const [visibleCount, setVisibleCount] = useState(6);
  const [mobileColumns, setMobileColumns] = useState(2);
  const page = categoryPages[path] || categoryPages["/new-arrivals"];
  const filtered = page.category ? products.filter((product) => product.category === page.category) : products;
  const sortProducts = (items) =>
    [...items].sort((a, b) => {
      const aId = Number(a.id || 0);
      const bId = Number(b.id || 0);
      const aCreatedAt = Number(a.created_at || 0);
      const bCreatedAt = Number(b.created_at || 0);

      if (aCreatedAt !== bCreatedAt) return bCreatedAt - aCreatedAt;
      return aId - bId;
    });
  const sortedProducts = sortProducts(
    filtered.length ? filtered : seedProducts.filter((product) => !page.category || product.category === page.category)
  );
  const isNewArrivals = path === "/new-arrivals";
  const visible = isNewArrivals ? sortedProducts.slice(0, visibleCount) : sortedProducts;

  useEffect(() => {
    setVisibleCount(6);
  }, [path]);

  return (
    <main className="catalog-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/" navigate={navigate}>Home</Link>
        <span>/</span>
        <span>{page.title}</span>
      </nav>

      <div className="catalog-shell">
        <section className="products" aria-label={page.title}>
          <div className="collection-header">
            <p className="eyebrow">Memo collection</p>
            <h1>{page.title}</h1>
          </div>

          <div className="catalog-tabs-row">
            <div className="tabs">
              {navItems.map(([label, itemPath]) => (
                <Link key={itemPath} to={itemPath} navigate={navigate} className={itemPath === path ? "active" : ""}>
                  {label}
                </Link>
              ))}
            </div>
            <div className="mobile-view-options" role="group" aria-label="Products per row">
              {[1, 2, 4].map((columns) => (
                <button
                  key={columns}
                  type="button"
                  className={mobileColumns === columns ? "active" : ""}
                  aria-label={`${columns} ${columns === 1 ? "product" : "products"} per row`}
                  aria-pressed={mobileColumns === columns}
                  onClick={() => setMobileColumns(columns)}
                >
                  <span className={`view-option-icon columns-${columns}`} aria-hidden="true">
                    {Array.from({ length: columns }, (_, index) => <i key={index} />)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className={`product-grid mobile-columns-${mobileColumns}`}>
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} currency={currency} navigate={navigate} />
            ))}
          </div>

          {isNewArrivals && visibleCount < sortedProducts.length && (
            <div className="load-more-wrap">
              <button type="button" className="load-more-button" onClick={() => setVisibleCount((count) => count + 6)}>
                Load more
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
