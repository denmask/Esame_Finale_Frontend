import { useDati } from "../data";

// ============================================================
// DASHBOARD PAGE
// ============================================================
// ✏️ ESAME: questa pagina mostra overview + KPI principali
// Puoi toglierla, usarla come welcome, o arricchirla con grafici

export default function Dashboard() {
  const { elementi, transazioni } = useDati();

  const totaleTransazioni = transazioni.length;
  const totaleValore = transazioni.reduce((s, t) => s + t.totale, 0);
  const totaleElementi = elementi.length;

  return (
    <div>
      <div className="sezione-header">
        <div>
          {/* ✏️ ESAME: cambia titolo e sottotitolo della dashboard */}
          <h2 className="titolo-pagina">Dashboard</h2>
          <p className="sottotitolo">Benvenuto nella tua applicazione</p>
        </div>
      </div>

      {/* KPI PRINCIPALI */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Elementi totali</span>
          {/* ✏️ ESAME: cambia nome/etichetta */}
          <span className="kpi-valore">{totaleElementi}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Transazioni totali</span>
          {/* ✏️ ESAME: cambia nome/etichetta */}
          <span className="kpi-valore">{totaleTransazioni}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Valore totale</span>
          {/* ✏️ ESAME: cambia unità di misura (€, punti, etc) */}
          <span className="kpi-valore">€{totaleValore.toLocaleString("it-IT")}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Media per transazione</span>
          <span className="kpi-valore">
            €{transazioni.length > 0 ? (totaleValore / transazioni.length).toFixed(0) : 0}
          </span>
        </div>
      </div>

      {/* SEZIONE INFO */}
      <div className="card" style={{ marginTop: "2rem" }}>
        <h3 className="card-titolo">Informazioni</h3>
        {/* ✏️ ESAME: aggiungi informazioni, guide, o istruzioni per l'utente */}
        <p style={{ color: "var(--testo-soft)", fontSize: "14px", lineHeight: "1.6" }}>
          Usa il menu laterale per navigare tra le sezioni dell'applicazione.
        </p>
      </div>
    </div>
  );
}