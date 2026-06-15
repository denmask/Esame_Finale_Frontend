import { useRef, useEffect } from "react";
import { useDati, TIPI, STATI } from "../data";

export default function Report() {
  const { prenotazioni, eventi } = useDati();

  const totaleValore = prenotazioni.reduce((s, p) => s + (p.totale || 0), 0);
  const totaleQuantita = prenotazioni.reduce((s, p) => s + (p.quantita || 0), 0);

  const conteggioTipi = TIPI.reduce((acc, t) => {
    acc[t] = prenotazioni.filter(p => p.tipo === t).length;
    return acc;
  }, {});

  const perGiorno = {};
  prenotazioni.forEach(p => {
    perGiorno[p.data] = (perGiorno[p.data] || 0) + p.totale;
  });
  const giorniOrdinati = Object.keys(perGiorno).sort();

  const tassoTipi = TIPI.map(t => {
    const tot = eventi.filter(e => e.tipo === t).length;
    const pren = prenotazioni.filter(p => p.tipo === t).length;
    return { tipo: t, tasso: tot > 0 ? Math.round((pren / (tot * 10)) * 100) : 0 };
  });

  const refTorta = useRef(null);
  const refBarre = useRef(null);
  const refLinee = useRef(null);
  const chartsRef = useRef({});

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
    script.onload = () => {
      const Chart = window.Chart;
      const palette = ["#1a1a1a", "#666666", "#b0b0b0"];

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

  const ordinate = [...prenotazioni].sort((a, b) =>
    b.data.localeCompare(a.data)
  );

  return (
    <div>
      <div className="sezione-header">
        <div>
          <h2 className="titolo-pagina">Reportistica</h2>
          <p className="sottotitolo">Analisi delle prenotazioni</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Prenotazioni totali</span>
          <span className="kpi-valore">{prenotazioni.length}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Valore totale</span>
          <span className="kpi-valore">
            €{totaleValore.toLocaleString("it-IT")}
          </span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Ore totali</span>
          <span className="kpi-valore">{totaleQuantita}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Media prenotazione</span>
          <span className="kpi-valore">
            €
            {prenotazioni.length > 0
              ? (totaleValore / prenotazioni.length).toFixed(0)
              : 0}
          </span>
        </div>
      </div>

      <div className="grafici-griglia">
        <div className="grafico-card">
          <h3 className="grafico-titolo">Distribuzione per tipo</h3>
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

        <div className="grafico-card">
          <h3 className="grafico-titolo">Tasso per tipo</h3>
          <div style={{ position: "relative", height: "240px" }}>
            <canvas
              ref={refBarre}
              role="img"
              aria-label="Grafico tasso"
            ></canvas>
          </div>
        </div>
      </div>

      <div className="grafico-card grafico-largo">
        <h3 className="grafico-titolo">Andamento nel tempo</h3>
        <div style={{ position: "relative", height: "240px" }}>
          <canvas
            ref={refLinee}
            role="img"
            aria-label="Grafico andamento"
          ></canvas>
        </div>
      </div>

      <div className="card">
        <h3 className="card-titolo">Cronologia prenotazioni</h3>
        <div className="tabella-wrapper">
          <table className="tabella">
            <thead>
              <tr>
                <th>Data</th>
                <th>Utente</th>
                <th>Evento</th>
                <th>Tipo</th>
                <th>Orario</th>
                <th>Ore</th>
                <th>Totale</th>
              </tr>
            </thead>
            <tbody>
              {ordinate.map(p => (
                <tr key={p.id}>
                  <td>{new Date(p.data).toLocaleDateString("it-IT")}</td>
                  <td>{p.utente}</td>
                  <td>{eventi.find(e => e.id === p.eventoId)?.nome || "N/A"}</td>
                  <td>
                    <span className="badge-tipo-mini">{p.tipo}</span>
                  </td>
                  <td>
                    {p.inizio}–{p.fine}
                  </td>
                  <td>{p.quantita}</td>
                  <td className="cella-totale">{p.totale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}