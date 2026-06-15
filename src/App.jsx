import { useState } from "react";
import "./index.css";

import Dashboard from "./pages/Dashboard";
import Eventi from "./pages/Eventi";
import Prenotazioni from "./pages/Prenotazioni";
import Report from "./pages/Report";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";


export default function App() {
  const [pagina, setPagina] = useState("dashboard"); 
  const [sidebarAperta, setSidebarAperta] = useState(true);

  const voci = [
    { id: "dashboard", etichetta: "Dashboard" },
    { id: "eventi", etichetta: "Eventi" }, 
    { id: "prenotazioni", etichetta: "Prenotazioni" }, 
    { id: "report", etichetta: "Report" },
  ];

  return (
    <div
      className={`app ${sidebarAperta ? "sidebar-aperta" : "sidebar-chiusa"}`}
    >
      <Sidebar
        pagina={pagina}
        setPagina={setPagina}
        voci={voci}
        brand={{ acc: "App", brand: "Eventi Live" }} 
      />

      <div className="contenuto">
        <Navbar
          sidebarAperta={sidebarAperta}
          setSidebarAperta={setSidebarAperta}
          titolo="La mia dashboard"
        />
        <main className="pagina">
          {pagina === "dashboard" && <Dashboard />}
          {pagina === "eventi" && <Eventi />}
          {pagina === "prenotazioni" && <Prenotazioni />}
          {pagina === "report" && <Report />}
        </main>
      </div>
    </div>
  );
}