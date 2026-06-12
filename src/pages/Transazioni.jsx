import { useState } from "react";
import { useDati, TIPI, STATI, calcolaQuantita } from "../data";

// ============================================================
// PAGINA TRANSAZIONI/PRENOTAZIONI
// ✏️ ESAME: RINOMINA QUESTO FILE
// Esempi: Prenotazioni.jsx, Prestiti.jsx, Ordini.jsx, Prenotazioni.jsx
// ============================================================
// Contiene: form 3-step (selezione, dettagli, conferma)

export default function Transazioni() {
  const { elementi, transazioni, aggiungiTransazione } = useDati();
  const elementiDisponibili = elementi.filter(e => e.stato === STATI[0]); // primo stato = disponibile
  
  const [step, setStep] = useState(1);
  const [selezionato, setSelezionato] = useState(null);
  const [form, setForm] = useState({
    utente: "",
    data: "",
    inizio: "09:00",
    fine: "17:00",
  });
  const [errori, setErrori] = useState({});
  const [confermata, setConfermata] = useState(null);

  // CALCOLI
  const quantita = selezionato ? calcolaQuantita(form.inizio, form.fine) : 0;
  // ✏️ ESAME: cambia la formula del totale se necessario
  const totale = selezionato ? quantita * selezionato.campo2 : 0;

  // VALIDAZIONE
  function valida() {
    const e = {};
    if (!form.utente.trim()) e.utente = "Inserisci il nome";
    if (!form.data) e.data = "Seleziona una data";
    if (quantita <= 0) e.orario = "L'orario di fine deve essere dopo quello di inizio";
    return e;
  }

  // CONFERMA TRANSAZIONE
  function conferma(ev) {
    ev.preventDefault();
    const e = valida();
    if (Object.keys(e).length > 0) {
      setErrori(e);
      return;
    }
    const nuova = {
      utente: form.utente,
      elementoId: selezionato.id,
      elementoNome: selezionato.nome,
      tipo: selezionato.tipo,
      data: form.data,
      inizio: form.inizio,
      fine: form.fine,
      quantita,
      totale,
    };
    aggiungiTransazione(nuova);
    setConfermata(nuova);
    setStep(3);
  }

  // RESET FORM
  function reset() {
    setStep(1);
    setSelezionato(null);
    setForm({ utente: "", data: "", inizio: "09:00", fine: "17:00" });
    setErrori({});
    setConfermata(null);
  }

  const cssTipo = { "CategoriaA": "tipo-a", "CategoriaB": "tipo-b", "CategoriaC": "tipo-c" };

  return (
    <div>
      {/* HEADER */}
      <div className="sezione-header">
        <div>
          {/* ✏️ ESAME: cambia titolo e sottotitolo */}
          <h2 className="titolo-pagina">Nuova transazione</h2>
          <p className="sottotitolo">Scegli un elemento e completa i dettagli</p>
        </div>
      </div>

      {/* STEP INDICATOR */}
      <div className="step-indicatori">
        {[
          "Scegli elemento",    // ✏️ ESAME: rinomina gli step se necessario
          "Dettagli",
          "Conferma",
        ].map((s, i) => (
          <div
            key={i}
            className={`step-item ${step === i + 1 ? "step-attivo" : step > i + 1 ? "step-fatto" : ""}`}
          >
            <span className="step-numero">{step > i + 1 ? "✓" : i + 1}</span>
            <span className="step-testo">{s}</span>
          </div>
        ))}
      </div>

      {/* ============ STEP 1 — SELEZIONE ELEMENTO ============ */}
      {step === 1 && (
        <div>
          <p className="istruzione">Seleziona l'elemento da utilizzare:</p>
          <div className="griglia-elementi">
            {elementiDisponibili.map(e => (
              <div
                key={e.id}
                className={`card card-elemento card-selezionabile ${
                  selezionato?.id === e.id ? "card-selezionata" : ""
                }`}
                onClick={() => setSelezionato(e)}
              >
                <div className="card-elemento-header">
                  <span className={`badge-tipo ${cssTipo[e.tipo] || "tipo-a"}`}>
                    {e.tipo}
                  </span>
                </div>
                <h3 className="nome-elemento">{e.nome}</h3>
                <div className="info-elemento">
                  {/* ✏️ ESAME: cambia label campo1 e campo2 */}
                  <span>Campo1: {e.campo1}</span>
                  <span>Campo2: {e.campo2}</span>
                </div>
              </div>
            ))}
          </div>
          {elementiDisponibili.length === 0 && (
            <div className="stato-vuoto">Nessun elemento disponibile.</div>
          )}
          {selezionato && (
            <div className="azioni-step">
              <button className="btn-primario" onClick={() => setStep(2)}>
                Continua →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ============ STEP 2 — DETTAGLI TRANSAZIONE ============ */}
      {step === 2 && (
        <div>
          <div className="riepilogo-elemento">
            <span className={`badge-tipo ${cssTipo[selezionato.tipo] || "tipo-a"}`}>
              {selezionato.tipo}
            </span>
            <strong>{selezionato.nome}</strong>
            <button className="link-cambio" onClick={() => setStep(1)}>
              Cambia
            </button>
          </div>
          <form onSubmit={conferma} className="form-transazione">
            {/* ✏️ ESAME: cambia "Nome utente" con il campo appropriato */}
            <CampoForm label="Nome utente" errore={errori.utente}>
              <input
                value={form.utente}
                onChange={e => setForm({ ...form, utente: e.target.value })}
                placeholder="es. Mario Rossi"
              />
            </CampoForm>

            <CampoForm label="Data" errore={errori.data}>
              <input
                type="date"
                value={form.data}
                onChange={e => setForm({ ...form, data: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
              />
            </CampoForm>

            <div className="griglia-orari">
              <CampoForm label="Inizio" errore={errori.orario}>
                <input
                  type="time"
                  value={form.inizio}
                  onChange={e => setForm({ ...form, inizio: e.target.value })}
                />
              </CampoForm>
              <CampoForm label="Fine">
                <input
                  type="time"
                  value={form.fine}
                  onChange={e => setForm({ ...form, fine: e.target.value })}
                />
              </CampoForm>
            </div>

            {quantita > 0 && (
              <div className="anteprima-costo">
                <span className="costo-dettaglio">
                  {quantita}h × {selezionato.campo2}
                </span>
                <span className="costo-totale">
                  {/* ✏️ ESAME: cambia "€" con la moneta/unità corretta */}
                  Totale: {totale.toFixed(0)}
                </span>
              </div>
            )}

            <div className="form-azioni">
              <button
                type="button"
                className="btn-secondario"
                onClick={() => setStep(1)}
              >
                ← Indietro
              </button>
              <button type="submit" className="btn-primario">
                Conferma
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============ STEP 3 — CONFERMA ============ */}
      {step === 3 && confermata && (
        <div className="card conferma-card">
          <div className="conferma-icona">✓</div>
          <h3 className="conferma-titolo">Operazione confermata!</h3>
          <div className="riepilogo-grid">
            {/* ✏️ ESAME: cambia le label del riepilogo se necessario */}
            <span className="riep-label">Utente</span>
            <span className="riep-valore">{confermata.utente}</span>

            <span className="riep-label">Elemento</span>
            <span className="riep-valore">{confermata.elementoNome}</span>

            <span className="riep-label">Data</span>
            <span className="riep-valore">
              {new Date(confermata.data).toLocaleDateString("it-IT", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>

            <span className="riep-label">Orario</span>
            <span className="riep-valore">
              {confermata.inizio} – {confermata.fine}
            </span>

            <span className="riep-label">Quantità</span>
            <span className="riep-valore">{confermata.quantita}</span>

            <span className="riep-label totale-label">Totale</span>
            <span className="riep-valore totale-valore">{confermata.totale}</span>
          </div>
          <button
            className="btn-primario"
            onClick={reset}
            style={{ marginTop: "1.5rem" }}
          >
            Nuova operazione
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// COMPONENTE UTILITY — CAMPO FORM
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