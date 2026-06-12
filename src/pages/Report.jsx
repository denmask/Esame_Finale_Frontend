import { useRef, useEffect } from "react";
import { useDati, TIPI, STATI } from "../data";

// ============================================================
// PAGINA REPORT
// Contiene: KPI, 3 grafici (Chart.js), tabella cronologica
// ============================================================

export default function Report() {
  const { transazioni, elementi } = useDati();

  // CALCOLI KPI
  const totaleValore = transazioni.reduce((s, t) => s + t.totale, 0);
  const totaleQuantita = transazioni.reduce((s, t) => s + t.quantita, 0);

  // CONTEGGIO PER TIPO
  const conteggioTipi = TIPI.reduce((acc, t) => {
    acc[t] = transazioni.filter(t2 => t2.tipo === t).length;
    return acc;
  }, {});

  // DATI PER LINEA (andamento nel tempo)
  const perGiorno = {};
  transazioni.forEach(t => {
    perGiorno[t.data] = (perGiorno[t.data] || 0) + t.totale;
  });
  const giorniOrdinati = Object.keys(perGiorno).sort();

  // TASSO PER TIPO
  const tassoTipi = TIPI.map(t => {
    const tot = elementi.filter(e => e.tipo === t).length;
    const pren = transazioni.filter(t2 => t2.tipo === t).length;
    return { tipo: t, tasso: tot > 0 ? Math.round((pren / (tot * 10)) * 100) : 0 };
  });

  // REFS PER GRAFICI CHART.JS
  const refTorta = useRef(null);
  const refBarre = useRef(null);
  const refLinee = useRef(null);
  const chartsRef = useRef({});

  // CARICA E RENDERIZZA GRAFICI
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    script.onload = () => {
      const Chart = window.Chart;
      const palette = ["#1a1a1a", "#666666", "#b0b0b0"];

      // GRAFICO TORTA
      if (refTorta.current && !chartsRef.current.torta) {
        chartsRef.current.torta = new Chart(refTorta.current, {
          type: "doughnut",
          data: {
            labels: TIPI,
            datasets: [
              {
                data: TIPI.map(t => conteggioTipi[t]),
                backgroundColor: palette,
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            cutout: "60%",
          },
        });
      }

      // GRAFICO BARRE
      if (refBarre.current && !chartsRef.current.barre) {
        chartsRef.current.barre = new Chart(refBarre.current, {
          type: "bar",
          data: {
            labels: tassoTipi.map(t => t.tipo),
            datasets: [
              {
                label: "Tasso %",
                data: tassoTipi.map(t => t.tasso),
                backgroundColor: palette,
                borderRadius: 4,
                borderSkipped: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: { callback: v => v + "%" },
                grid: { color: "#f0f0f0" },
              },
              x: { grid: { display: false } },
            },
          },
        });
      }

      // GRAFICO LINEA
      if (refLinee.current && !chartsRef.current.linee) {
        chartsRef.current.linee = new Chart(refLinee.current, {
          type: "line",
          data: {
            labels: giorniOrdinati.map(d =>
              new Date(d).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "short",
              })
            ),
            datasets: [
              {
                label: "Valore",
                data: giorniOrdinati.map(d => perGiorno[d]),
                borderColor: "#1a1a1a",
                backgroundColor: "rgba(26,26,26,0.06)",
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: "#1a1a1a",
                fill: true,
                tension: 0.3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: "#f0f0f0" } },
              x: { grid: { display: false }, ticks: { autoSkip: false, maxRotation: 30 } },
            },
          },
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      Object.values(chartsRef.current).forEach(c => c.destroy());
      chartsRef.current = {};
    };
  }, []);

  // TABELLA ORDINATA
  const ordinate = [...transazioni].sort((a, b) =>
    b.data.localeCompare(a.data)
  );

  return (
    <div>
      {/* HEADER */}
      <div className="sezione-header">
        <div>
          {/* ✏️ ESAME: cambia titolo report se necessario */}
          <h2 className="titolo-pagina">Reportistica</h2>
          <p className="sottotitolo">Analisi delle transazioni</p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Transazioni totali</span>
          <span className="kpi-valore">{transazioni.length}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Valore totale</span>
          {/* ✏️ ESAME: cambia "€" con l'unità di misura corretta */}
          <span className="kpi-valore">
            €{totaleValore.toLocaleString("it-IT")}
          </span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Quantità totale</span>
          <span className="kpi-valore">{totaleQuantita}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Media per transazione</span>
          <span className="kpi-valore">
            €
            {transazioni.length > 0
              ? (totaleValore / transazioni.length).toFixed(0)
              : 0}
          </span>
        </div>
      </div>

      {/* GRAFICI RIGA 1 */}
      <div className="grafici-griglia">
        {/* TORTA */}
        <div className="grafico-card">
          <h3 className="grafico-titolo">Distribuzione per tipo</h3>
          {/* ✏️ ESAME: cambia titolo grafico se necessario */}
          <div className="legenda-torta">
            {TIPI.map((t, i) => (
              <span key={t} className="legenda-voce">
                <span
                  className="legenda-quadrato"
                  style={{
                    background: ["#1a1a1a", "#666", "#b0b0b0"][i],
                  }}
                ></span>
                {t} ({conteggioTipi[t]})
              </span>
            ))}
          </div>
          <div style={{ position: "relative", height: "200px" }}>
            <canvas
              ref={refTorta}
              role="img"
              aria-label="Grafico distribuzione"
            ></canvas>
          </div>
        </div>

        {/* BARRE */}
        <div className="grafico-card">
          <h3 className="grafico-titolo">Tasso per tipo</h3>
          {/* ✏️ ESAME: cambia titolo grafico se necessario */}
          <div style={{ position: "relative", height: "240px" }}>
            <canvas
              ref={refBarre}
              role="img"
              aria-label="Grafico tasso"
            ></canvas>
          </div>
        </div>
      </div>

      {/* GRAFICO RIGA 2 */}
      <div className="grafico-card grafico-largo">
        <h3 className="grafico-titolo">Andamento nel tempo</h3>
        {/* ✏️ ESAME: cambia titolo grafico se necessario */}
        <div style={{ position: "relative", height: "240px" }}>
          <canvas
            ref={refLinee}
            role="img"
            aria-label="Grafico andamento"
          ></canvas>
        </div>
      </div>

      {/* TABELLA CRONOLOGIA */}
      <div className="card">
        <h3 className="card-titolo">Cronologia transazioni</h3>
        {/* ✏️ ESAME: cambia titolo tabella se necessario */}
        <div className="tabella-wrapper">
          <table className="tabella">
            <thead>
              <tr>
                {/* ✏️ ESAME: cambia le intestazioni delle colonne */}
                <th>Data</th>
                <th>Utente</th>
                <th>Elemento</th>
                <th>Tipo</th>
                <th>Orario</th>
                <th>Quantità</th>
                <th>Totale</th>
              </tr>
            </thead>
            <tbody>
              {ordinate.map(t => (
                <tr key={t.id}>
                  <td>{new Date(t.data).toLocaleDateString("it-IT")}</td>
                  <td>{t.utente}</td>
                  <td>{t.elementoNome}</td>
                  <td>
                    <span className="badge-tipo-mini">{t.tipo}</span>
                  </td>
                  <td>
                    {t.inizio}–{t.fine}
                  </td>
                  <td>{t.quantita}</td>
                  <td className="cella-totale">{t.totale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}