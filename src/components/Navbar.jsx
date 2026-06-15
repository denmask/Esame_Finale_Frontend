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
      <h1 className="navbar-titolo">{titolo || "La mia dashboard"}</h1>
    </header>
  );
}