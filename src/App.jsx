import { useState } from "react";
import "./index.css";

// ✏️ ESAME: importa le tue pagine dalla cartella pages/
// Rinomina i file importati in base alla tua consegna
import Dashboard from "./pages/Dashboard";
import Elementi from "./pages/Elementi";         // Rinomina in base al dominio
import Transazioni from "./pages/Transazioni";   // Rinomina in base al dominio
import Report from "./pages/Report";

// ✏️ ESAME: importa i componenti wrapper
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [pagina, setPagina] = useState("dashboard"); // pagina iniziale
  const [sidebarAperta, setSidebarAperta] = useState(true);

  // ✏️ ESAME: cambia le voci del menu in base al tuo dominio
  // Esempi:
  // { id: "camere", etichetta: "Camere" }
  // { id: "libri", etichetta: "Libri" }
  // { id: "spazi", etichetta: "Spazi" }
  const voci = [
    { id: "dashboard", etichetta: "Dashboard" },
    { id: "elementi", etichetta: "Elementi" },      // Rinomina questa voce
    { id: "transazioni", etichetta: "Transazioni" }, // Rinomina questa voce
    { id: "report", etichetta: "Report" },
  ];

  return (
    <div
      className={`app ${sidebarAperta ? "sidebar-aperta" : "sidebar-chiusa"}`}
    >
      {/* SIDEBAR */}
      <Sidebar
        pagina={pagina}
        setPagina={setPagina}
        voci={voci}
        brand={{ acc: "my", brand: "app" }} // ✏️ ESAME: cambia il brand
      />

      {/* AREA PRINCIPALE */}
      <div className="contenuto">
        {/* NAVBAR */}
        <Navbar
          sidebarAperta={sidebarAperta}
          setSidebarAperta={setSidebarAperta}
          titolo="La tua dashboard" // ✏️ ESAME: cambia il titolo navbar
        />

        {/* PAGINE */}
        <main className="pagina">
          {pagina === "dashboard" && <Dashboard />}
          {pagina === "elementi" && <Elementi />}        {/* Rinomina se necessario */}
          {pagina === "transazioni" && <Transazioni />}  {/* Rinomina se necessario */}
          {pagina === "report" && <Report />}
        </main>
      </div>
    </div>
  );
}