export default function Sidebar({ 
  pagina, 
  setPagina, 
  voci = [],
  brand = { acc: "App", brand: "Eventi Live" }
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-acc">{brand.acc}</span>
        <span className="logo-brand">{brand.brand}</span>
      </div>

      <nav className="sidebar-nav">
        {voci.map(v => (
          <button
            key={v.id}
            className={`nav-voce ${pagina === v.id ? "attiva" : ""}`}
            onClick={() => setPagina(v.id)}
            aria-current={pagina === v.id ? "page" : undefined}
          >
            <span className="nav-label">{v.etichetta}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer" />
    </aside>
  );
}