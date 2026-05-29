import { useState, useRef, useEffect } from "react";
import { useDati, TIPI, STATI, calcolaQuantita } from "./data";
import "./index.css";

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [pagina, setPagina] = useState("elementi");
  const [sidebarAperta, setSidebarAperta] = useState(true);
  const dati = useDati();

  // ✏️ ESAME: cambia le etichette e gli id delle voci di menu
  const voci = [
    { id: "elementi",    etichetta: "Elementi" },     // es. "Libri", "Prodotti"
    { id: "transazioni", etichetta: "Transazioni" },  // es. "Prestiti", "Ordini"
    { id: "report",      etichetta: "Report" },
  ];

  return (
    <div className={`app ${sidebarAperta ? "sidebar-aperta" : "sidebar-chiusa"}`}>

      {/* ---- SIDEBAR ---- */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          {/* ✏️ ESAME: cambia il nome del brand */}
          <span className="logo-acc">my</span>
          <span className="logo-brand">app</span>
        </div>
        <nav className="sidebar-nav">
          {voci.map(v => (
            <button
              key={v.id}
              className={`nav-voce ${pagina === v.id ? "attiva" : ""}`}
              onClick={() => setPagina(v.id)}
            >
              <span className="nav-label">{v.etichetta}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer" />
      </aside>

      {/* ---- AREA PRINCIPALE ---- */}
      <div className="contenuto">
        <header className="navbar">
          <button className="toggle-sidebar" onClick={() => setSidebarAperta(s => !s)}>
            {sidebarAperta ? "«" : "»"}
          </button>
          {/* 🖊 ESAME: cambia il titolo navbar */}
          <h1 className="navbar-titolo">La tua dashboard</h1>
        </header>

        <main className="pagina">
          {pagina === "elementi"    && <PaginaElementi    {...dati} />}
          {pagina === "transazioni" && <PaginaTransazioni {...dati} />}
          {pagina === "report"      && <PaginaReport      {...dati} />}
        </main>
      </div>
    </div>
  );
}

// ============================================================
// PAGINA 1 — ELEMENTI (ex "Spazi")
// ✏️ ESAME: rinomina la funzione e tutti i label con il tuo dominio
// ============================================================
function PaginaElementi({ elementi, aggiungiElemento, aggiornaStatoElemento }) {
  const [filtroTipo,  setFiltroTipo]  = useState("Tutti");
  const [filtroStato, setFiltroStato] = useState("Tutti");
  const [mostraForm,  setMostraForm]  = useState(false);
  const [errori,      setErrori]      = useState({});

  // ✏️ ESAME: aggiungi/rimuovi campi del form secondo il tuo dominio
  const [form, setForm] = useState({
    nome:   "",
    tipo:   TIPI[0],
    campo1: "",   // es. capienza, quantità, prezzo...
    campo2: "",   // es. tariffa, anno, durata...
    stato:  STATI[0],
  });

  const visibili = elementi.filter(e => {
    if (filtroTipo  !== "Tutti" && e.tipo  !== filtroTipo)  return false;
    if (filtroStato !== "Tutti" && e.stato !== filtroStato) return false;
    return true;
  });

  function valida() {
    const e = {};
    if (!form.nome.trim()) e.nome = "Il nome è obbligatorio";
    if (!form.campo1 || Number(form.campo1) < 1) e.campo1 = "Inserisci un valore valido";
    if (!form.campo2 || Number(form.campo2) < 1) e.campo2 = "Inserisci un valore valido";
    return e;
  }

  function salva(ev) {
    ev.preventDefault();
    const e = valida();
    if (Object.keys(e).length > 0) { setErrori(e); return; }
    aggiungiElemento({ ...form, campo1: Number(form.campo1), campo2: Number(form.campo2) });
    setForm({ nome: "", tipo: TIPI[0], campo1: "", campo2: "", stato: STATI[0] });
    setErrori({});
    setMostraForm(false);
  }

  // ✏️ ESAME: cambia le classi CSS se vuoi colori diversi per tipo/stato
  const cssStato = { "StatoA": "stato-ok", "StatoB": "stato-busy", "StatoC": "stato-maint" };
  const cssTipo  = { "CategoriaA": "tipo-a", "CategoriaB": "tipo-b", "CategoriaC": "tipo-c" };

  return (
    <div>
      <div className="sezione-header">
        <div>
          {/* ✏️ ESAME: cambia titolo e sottotitolo */}
          <h2 className="titolo-pagina">Elementi disponibili</h2>
          <p className="sottotitolo">{visibili.length} elementi trovati</p>
        </div>
        <button className="btn-primario" onClick={() => setMostraForm(m => !m)}>
          {mostraForm ? "Chiudi" : "+ Nuovo elemento"}
        </button>
      </div>

      {/* FORM AGGIUNTA */}
      {mostraForm && (
        <div className="card form-card">
          {/* ✏️ ESAME: cambia il titolo del form */}
          <h3 className="card-titolo">Aggiungi un elemento</h3>
          <form onSubmit={salva} className="griglia-form">
            <CampoForm label="Nome" errore={errori.nome}>
              <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="es. Nome elemento" />
            </CampoForm>
            <CampoForm label="Tipologia">
              <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                {TIPI.map(t => <option key={t}>{t}</option>)}
              </select>
            </CampoForm>
            {/* ✏️ ESAME: cambia label "Campo 1" con il nome reale (es. "Capienza") */}
            <CampoForm label="Campo 1" errore={errori.campo1}>
              <input type="number" min="1" value={form.campo1} onChange={e => setForm({ ...form, campo1: e.target.value })} placeholder="es. 10" />
            </CampoForm>
            {/* ✏️ ESAME: cambia label "Campo 2" con il nome reale (es. "Tariffa oraria €") */}
            <CampoForm label="Campo 2" errore={errori.campo2}>
              <input type="number" min="1" value={form.campo2} onChange={e => setForm({ ...form, campo2: e.target.value })} placeholder="es. 25" />
            </CampoForm>
            <CampoForm label="Stato iniziale">
              <select value={form.stato} onChange={e => setForm({ ...form, stato: e.target.value })}>
                {STATI.map(s => <option key={s}>{s}</option>)}
              </select>
            </CampoForm>
            <div className="form-azioni">
              <button type="submit" className="btn-primario">Salva</button>
              <button type="button" className="btn-secondario" onClick={() => setMostraForm(false)}>Annulla</button>
            </div>
          </form>
        </div>
      )}

      {/* FILTRI */}
      <div className="filtri-barra">
        <span className="filtri-label">Filtra per:</span>
        <div className="filtri-gruppo">
          <span className="filtri-sublabel">Tipo</span>
          {["Tutti", ...TIPI].map(t => (
            <button key={t} className={`chip ${filtroTipo === t ? "chip-attivo" : ""}`} onClick={() => setFiltroTipo(t)}>{t}</button>
          ))}
        </div>
        <div className="filtri-gruppo">
          <span className="filtri-sublabel">Stato</span>
          {["Tutti", ...STATI].map(s => (
            <button key={s} className={`chip ${filtroStato === s ? "chip-attivo" : ""}`} onClick={() => setFiltroStato(s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* GRIGLIA CARD */}
      <div className="griglia-elementi">
        {visibili.map(e => (
          <div key={e.id} className="card card-elemento">
            <div className="card-elemento-header">
              <span className={`badge-tipo ${cssTipo[e.tipo] || "tipo-a"}`}>{e.tipo}</span>
              <span className={`badge-stato ${cssStato[e.stato] || "stato-ok"}`}>{e.stato}</span>
            </div>
            <h3 className="nome-elemento">{e.nome}</h3>
            <div className="info-elemento">
              {/* ✏️ ESAME: cambia le label campo1 e campo2 */}
              <span>Campo1: {e.campo1}</span>
              <span>Campo2: {e.campo2}</span>
            </div>
            <div className="card-elemento-footer">
              <label className="label-cambio">Cambia stato:</label>
              <select value={e.stato} onChange={ev => aggiornaStatoElemento(e.id, ev.target.value)} className="select-stato">
                {STATI.map(st => <option key={st}>{st}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>

      {visibili.length === 0 && (
        <div className="stato-vuoto">Nessun elemento corrisponde ai filtri selezionati.</div>
      )}
    </div>
  );
}

// ============================================================
// PAGINA 2 — TRANSAZIONI (ex "Prenotazioni")
// ✏️ ESAME: rinomina tutto con il tuo dominio (es. PaginaPrestiti)
// ============================================================
function PaginaTransazioni({ elementi, transazioni, aggiungiTransazione }) {
  const elementiDisponibili = elementi.filter(e => e.stato === STATI[0]); // primo stato = disponibile
  const [step, setStep]               = useState(1);
  const [selezionato, setSelezionato] = useState(null);
  const [form, setForm]               = useState({ utente: "", data: "", inizio: "09:00", fine: "17:00" });
  const [errori, setErrori]           = useState({});
  const [confermata, setConfermata]   = useState(null);

  const quantita = selezionato ? calcolaQuantita(form.inizio, form.fine) : 0;
  // ✏️ ESAME: cambia la formula del totale se serve (es. campo2 = tariffa)
  const totale   = selezionato ? quantita * selezionato.campo2 : 0;

  function valida() {
    const e = {};
    if (!form.utente.trim()) e.utente = "Inserisci il nome";
    if (!form.data)          e.data   = "Seleziona una data";
    if (quantita <= 0)       e.orario = "L'orario di fine deve essere dopo quello di inizio";
    return e;
  }

  function conferma(ev) {
    ev.preventDefault();
    const e = valida();
    if (Object.keys(e).length > 0) { setErrori(e); return; }
    const nuova = {
      utente:        form.utente,
      elementoId:    selezionato.id,
      elementoNome:  selezionato.nome,
      tipo:          selezionato.tipo,
      data:          form.data,
      inizio:        form.inizio,
      fine:          form.fine,
      quantita,
      totale,
    };
    aggiungiTransazione(nuova);
    setConfermata(nuova);
    setStep(3);
  }

  function reset() {
    setStep(1); setSelezionato(null);
    setForm({ utente: "", data: "", inizio: "09:00", fine: "17:00" });
    setErrori({}); setConfermata(null);
  }

  const cssTipo = { "CategoriaA": "tipo-a", "CategoriaB": "tipo-b", "CategoriaC": "tipo-c" };

  return (
    <div>
      <div className="sezione-header">
        <div>
          {/* ✏️ ESAME: cambia titolo */}
          <h2 className="titolo-pagina">Nuova transazione</h2>
          <p className="sottotitolo">Scegli un elemento e completa i dettagli</p>
        </div>
      </div>

      {/* STEP INDICATOR */}
      <div className="step-indicatori">
        {[
          "Scegli elemento",   // ✏️ ESAME: rinomina gli step
          "Dettagli",
          "Conferma"
        ].map((s, i) => (
          <div key={i} className={`step-item ${step === i+1 ? "step-attivo" : step > i+1 ? "step-fatto" : ""}`}>
            <span className="step-numero">{step > i+1 ? "✓" : i+1}</span>
            <span className="step-testo">{s}</span>
          </div>
        ))}
      </div>

      {/* STEP 1 — selezione elemento */}
      {step === 1 && (
        <div>
          <p className="istruzione">Seleziona l'elemento da utilizzare:</p>
          <div className="griglia-elementi">
            {elementiDisponibili.map(e => (
              <div
                key={e.id}
                className={`card card-elemento card-selezionabile ${selezionato?.id === e.id ? "card-selezionata" : ""}`}
                onClick={() => setSelezionato(e)}
              >
                <div className="card-elemento-header">
                  <span className={`badge-tipo ${cssTipo[e.tipo] || "tipo-a"}`}>{e.tipo}</span>
                </div>
                <h3 className="nome-elemento">{e.nome}</h3>
                <div className="info-elemento">
                  <span>Campo1: {e.campo1}</span>
                  <span>Campo2: {e.campo2}</span>
                </div>
              </div>
            ))}
          </div>
          {elementiDisponibili.length === 0 && <div className="stato-vuoto">Nessun elemento disponibile.</div>}
          {selezionato && (
            <div className="azioni-step">
              <button className="btn-primario" onClick={() => setStep(2)}>Continua →</button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2 — form dettagli */}
      {step === 2 && (
        <div>
          <div className="riepilogo-elemento">
            <span className={`badge-tipo ${cssTipo[selezionato.tipo] || "tipo-a"}`}>{selezionato.tipo}</span>
            <strong>{selezionato.nome}</strong>
            <button className="link-cambio" onClick={() => setStep(1)}>Cambia</button>
          </div>
          <form onSubmit={conferma} className="form-transazione">
            {/* ✏️ ESAME: cambia "Nome utente" con il campo appropriato (es. "Cliente", "Studente") */}
            <CampoForm label="Nome utente" errore={errori.utente}>
              <input value={form.utente} onChange={e => setForm({ ...form, utente: e.target.value })} placeholder="es. Mario Rossi" />
            </CampoForm>
            <CampoForm label="Data" errore={errori.data}>
              <input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} min={new Date().toISOString().split("T")[0]} />
            </CampoForm>
            <div className="griglia-orari">
              <CampoForm label="Inizio" errore={errori.orario}>
                <input type="time" value={form.inizio} onChange={e => setForm({ ...form, inizio: e.target.value })} />
              </CampoForm>
              <CampoForm label="Fine">
                <input type="time" value={form.fine} onChange={e => setForm({ ...form, fine: e.target.value })} />
              </CampoForm>
            </div>
            {quantita > 0 && (
              <div className="anteprima-costo">
                <span className="costo-dettaglio">{quantita}h × {selezionato.campo2}</span>
                <span className="costo-totale">Totale: {totale.toFixed(0)}</span>
              </div>
            )}
            <div className="form-azioni">
              <button type="button" className="btn-secondario" onClick={() => setStep(1)}>← Indietro</button>
              <button type="submit" className="btn-primario">Conferma</button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 3 — conferma */}
      {step === 3 && confermata && (
        <div className="card conferma-card">
          <div className="conferma-icona">✓</div>
          <h3 className="conferma-titolo">Operazione confermata!</h3>
          <div className="riepilogo-grid">
            <span className="riep-label">Utente</span>      <span className="riep-valore">{confermata.utente}</span>
            <span className="riep-label">Elemento</span>    <span className="riep-valore">{confermata.elementoNome}</span>
            <span className="riep-label">Data</span>        <span className="riep-valore">{new Date(confermata.data).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
            <span className="riep-label">Orario</span>      <span className="riep-valore">{confermata.inizio} – {confermata.fine}</span>
            <span className="riep-label">Quantità</span>    <span className="riep-valore">{confermata.quantita}</span>
            <span className="riep-label totale-label">Totale</span> <span className="riep-valore totale-valore">{confermata.totale}</span>
          </div>
          <button className="btn-primario" onClick={reset} style={{ marginTop: "1.5rem" }}>Nuova operazione</button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PAGINA 3 — REPORT
// ✏️ ESAME: i grafici sono già configurati, cambia solo le label
// ============================================================
function PaginaReport({ transazioni, elementi }) {
  const totaleValore   = transazioni.reduce((s, t) => s + t.totale, 0);
  const totaleQuantita = transazioni.reduce((s, t) => s + t.quantita, 0);

  const conteggioTipi = TIPI.reduce((acc, t) => {
    acc[t] = transazioni.filter(t2 => t2.tipo === t).length;
    return acc;
  }, {});

  const perGiorno = {};
  transazioni.forEach(t => {
    perGiorno[t.data] = (perGiorno[t.data] || 0) + t.totale;
  });
  const giorniOrdinati = Object.keys(perGiorno).sort();

  const tassoTipi = TIPI.map(t => {
    const tot  = elementi.filter(e => e.tipo === t).length;
    const pren = transazioni.filter(t2 => t2.tipo === t).length;
    return { tipo: t, tasso: tot > 0 ? Math.round((pren / (tot * 10)) * 100) : 0 };
  });

  const refTorta  = useRef(null);
  const refBarre  = useRef(null);
  const refLinee  = useRef(null);
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
            datasets: [{ data: TIPI.map(t => conteggioTipi[t]), backgroundColor: palette, borderWidth: 0 }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            cutout: "60%",
          }
        });
      }

      if (refBarre.current && !chartsRef.current.barre) {
        chartsRef.current.barre = new Chart(refBarre.current, {
          type: "bar",
          data: {
            labels: tassoTipi.map(t => t.tipo),
            datasets: [{
              label: "Tasso %",
              data: tassoTipi.map(t => t.tasso),
              backgroundColor: palette,
              borderRadius: 4, borderSkipped: false,
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, max: 100, ticks: { callback: v => v + "%" }, grid: { color: "#f0f0f0" } },
              x: { grid: { display: false } }
            }
          }
        });
      }

      if (refLinee.current && !chartsRef.current.linee) {
        chartsRef.current.linee = new Chart(refLinee.current, {
          type: "line",
          data: {
            labels: giorniOrdinati.map(d => new Date(d).toLocaleDateString("it-IT", { day: "numeric", month: "short" })),
            datasets: [{
              label: "Valore",
              data: giorniOrdinati.map(d => perGiorno[d]),
              borderColor: "#1a1a1a",
              backgroundColor: "rgba(26,26,26,0.06)",
              borderWidth: 2, pointRadius: 4,
              pointBackgroundColor: "#1a1a1a",
              fill: true, tension: 0.3,
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: "#f0f0f0" } },
              x: { grid: { display: false }, ticks: { autoSkip: false, maxRotation: 30 } }
            }
          }
        });
      }
    };
    document.head.appendChild(script);
    return () => {
      Object.values(chartsRef.current).forEach(c => c.destroy());
      chartsRef.current = {};
    };
  }, []);

  const ordinate = [...transazioni].sort((a, b) => b.data.localeCompare(a.data));

  return (
    <div>
      <div className="sezione-header">
        <div>
          {/* ✏️ ESAME: cambia titolo report */}
          <h2 className="titolo-pagina">Reportistica</h2>
          <p className="sottotitolo">Analisi delle transazioni</p>
        </div>
      </div>

      {/* KPI */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Transazioni totali</span>
          <span className="kpi-valore">{transazioni.length}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Valore totale</span>
          {/* ✏️ ESAME: cambia "€" con l'unità corretta */}
          <span className="kpi-valore">€{totaleValore.toLocaleString("it-IT")}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Quantità totale</span>
          <span className="kpi-valore">{totaleQuantita}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Media per transazione</span>
          <span className="kpi-valore">€{transazioni.length > 0 ? (totaleValore / transazioni.length).toFixed(0) : 0}</span>
        </div>
      </div>

      {/* GRAFICI RIGA 1 */}
      <div className="grafici-griglia">
        <div className="grafico-card">
          {/* ✏️ ESAME: cambia titolo grafico */}
          <h3 className="grafico-titolo">Distribuzione per tipo</h3>
          <div className="legenda-torta">
            {TIPI.map((t, i) => (
              <span key={t} className="legenda-voce">
                <span className="legenda-quadrato" style={{ background: ["#1a1a1a", "#666", "#b0b0b0"][i] }}></span>
                {t} ({conteggioTipi[t]})
              </span>
            ))}
          </div>
          <div style={{ position: "relative", height: "200px" }}>
            <canvas ref={refTorta} role="img" aria-label="Grafico distribuzione"></canvas>
          </div>
        </div>
        <div className="grafico-card">
          <h3 className="grafico-titolo">Tasso per tipo</h3>
          <div style={{ position: "relative", height: "240px" }}>
            <canvas ref={refBarre} role="img" aria-label="Grafico tasso"></canvas>
          </div>
        </div>
      </div>

      {/* GRAFICO RIGA 2 */}
      <div className="grafico-card grafico-largo">
        <h3 className="grafico-titolo">Andamento nel tempo</h3>
        <div style={{ position: "relative", height: "240px" }}>
          <canvas ref={refLinee} role="img" aria-label="Grafico andamento"></canvas>
        </div>
      </div>

      {/* TABELLA STORICO */}
      <div className="card">
        <h3 className="card-titolo">Cronologia</h3>
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
                  <td><span className="badge-tipo-mini">{t.tipo}</span></td>
                  <td>{t.inizio}–{t.fine}</td>
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

// ============================================================
// COMPONENTE UTILITY — campo form con label ed errore
// ============================================================
function CampoForm({ label, errore, children }) {
  return (
    <div className="campo">
      <label className="campo-label">{label}</label>
      {children}
      {errore && <span className="campo-errore">{errore}</span>}
    </div>
  );
}