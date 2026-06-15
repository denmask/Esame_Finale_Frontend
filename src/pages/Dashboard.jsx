import { useDati } from "../data";

export default function Dashboard() {
  const { eventi, prenotazioni } = useDati();

  const totaleEventi = eventi.length;
  const totalePrenotazioni = prenotazioni.length;
  const totaleValore = prenotazioni.reduce((s, p) => s + (p.totale || 0), 0);

  return (
    <div>
      <div className="sezione-header">
        <div>
          <h2 className="titolo-pagina">Dashboard</h2>
          <p className="sottotitolo">Benvenuto nella mia applicazione</p>
        </div>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Dati Eventi</span>
          <span className="kpi-valore">{totaleEventi}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Dati Prenotazioni </span>
          <span className="kpi-valore">{totalePrenotazioni}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Valore totale</span>
          <span className="kpi-valore">€{totaleValore.toLocaleString("it-IT")}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Media per prenotazioni </span>
          <span className="kpi-valore">
            €{prenotazioni.length > 0 ? (totaleValore / prenotazioni.length).toFixed(0) : 0}
          </span>
        </div>
      </div>

      <div className="card" style={{ marginTop: "2rem" }}>
        <h3 className="card-titolo">Informazioni</h3>
        <p style={{ color: "var(--testo-soft)", fontSize: "14px", lineHeight: "1.6" }}>
          Usa il menu laterale per navigare tra le sezioni dell'applicazione.
        </p>
      </div>
    </div>
  );
}