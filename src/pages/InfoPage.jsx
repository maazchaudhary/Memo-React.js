import Link from "../components/Link";

export default function InfoPage({ page, navigate }) {
  return (
    <main className="info-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/" navigate={navigate}>Home</Link>
        <span>/</span>
        <span>{page.title}</span>
      </nav>

      <section className="info-shell">
        <p className="eyebrow"></p>
        <h1>{page.title}</h1>

        <div className="info-copy">
          {page.copy.map((block, index) => {
            if (block.list) {
              return (
                <ul key={`list-${index}`}>
                  {block.list.map((item) => <li key={item}>{item}</li>)}
                </ul>
              );
            }

            const text = typeof block === "string" ? block : block.text;
            return <p key={`${text}-${index}`}>{typeof block === "string" ? text : <strong>{text}</strong>}</p>;
          })}
        </div>
      </section>
    </main>
  );
}