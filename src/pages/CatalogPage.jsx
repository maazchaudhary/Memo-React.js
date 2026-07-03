import { categoryPages, navItems } from "../data/pages";
import { seedProducts } from "../data/products";
import Link from "../components/Link";
import ProductCard from "../components/ProductCard";

export default function CatalogPage({ path, products, currency, navigate }) {
  const page = categoryPages[path] || categoryPages["/new-arrivals"];
  const filtered = page.category ? products.filter((product) => product.category === page.category) : products;
  const visible = filtered.length ? filtered : seedProducts.filter((product) => !page.category || product.category === page.category).slice(0, 4);

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

          <div className="tabs">
            {navItems.map(([label, itemPath]) => (
              <Link key={itemPath} to={itemPath} navigate={navigate} className={itemPath === path ? "active" : ""}>
                {label}
              </Link>
            ))}
          </div>

          <div className="product-grid">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} currency={currency} navigate={navigate} />
            ))}
          </div>

          {path === "/new-arrivals" && (
            <nav className="pagination" aria-label="Pagination">
              <a className="active" href="#">1</a>
              <a href="#">2</a>
              <a href="#">Next</a>
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}