// ============================================================
// COMPONENTE SIDEBAR
// ============================================================

export default function Sidebar({ 
  pagina, 
  setPagina, 
  voci = [],
  brand = { acc: "my", brand: "app" }
}) {
  return (
    <aside className="sidebar">
      {/* LOGO BRAND */}
      <div className="sidebar-logo">
        {/* ✏️ ESAME: cambia il nome del brand qui */}
        <span className="logo-acc">{brand.acc}</span>
        <span className="logo-brand">{brand.brand}</span>
      </div>

      {/* NAVIGAZIONE */}
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

      {/* FOOTER SIDEBAR */}
      <div className="sidebar-footer" />
    </aside>
  );
}