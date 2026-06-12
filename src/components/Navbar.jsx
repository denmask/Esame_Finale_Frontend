// ============================================================
// COMPONENTE NAVBAR
// ============================================================

export default function Navbar({ sidebarAperta, setSidebarAperta, titolo }) {
  return (
    <header className="navbar">
      <button 
        className="toggle-sidebar" 
        onClick={() => setSidebarAperta(s => !s)}
        aria-label="Toggle sidebar"
      >
        {sidebarAperta ? "«" : "»"}
      </button>
      {/* ✏️ ESAME: cambia il titolo della navbar se necessario */}
      <h1 className="navbar-titolo">{titolo || "La tua dashboard"}</h1>
    </header>
  );
}