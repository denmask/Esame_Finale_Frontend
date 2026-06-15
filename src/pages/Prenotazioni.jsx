import { useState } from "react";
import { useDati, TIPI, STATI, calcolaQuantita } from "../data";

export default function Prenotazioni () {
  const { eventi, prenotazioni, aggiungiPrenotazione } = useDati();
  const eventiDisponibili = eventi.filter(e => e.stato === STATI[0]); 
  
  const [step, setStep] = useState(1);
  const [selezionato, setSelezionato] = useState(null);
  const [form, setForm] = useState({
    utente: "Nome Cognome",
    data: "24/05/2026",
    inizio: "09:00",
    fine: "17:00",
  });
  const [errori, setErrori] = useState({});
  const [confermata, setConfermata] = useState(null);

  const quantita = selezionato ? calcolaQuantita(form.inizio, form.fine) : 0;
  const totale = selezionato ? quantita * selezionato.Capienza : 0;

  function valida() {
    const e = {};
    if (!form.utente.trim()) e.utente = "Inserisci il nome";
    if (!form.data) e.data = "Seleziona una data";
    if (quantita <= 0) e.orario = "L'orario di fine deve essere dopo quello di inizio";
    return e;
  }

  function conferma(ev) {
    ev.preventDefault();
    const e = valida();
    if (Object.keys(e).length > 0) {
      setErrori(e);
      return;
    }
    const nuova = {      
      utente: form.utente,
      eventoId: selezionato.id,
      tipo: selezionato.tipo,
      data: form.data,
      inizio: form.inizio,
      fine: form.fine,
      quantita,
      totale: Number(totale)
    };
    aggiungiPrenotazione(nuova);
    setConfermata(nuova);
    setStep(3);
  }
  function reset() {
    setStep(1);
    setSelezionato(null);
    setForm({ utente: "", data: "", inizio: "09:00", fine: "17:00" });
    setErrori({});
    setConfermata(null);
  }

  const cssTipo = { [TIPI[0]]: "tipo-a", [TIPI[1]]: "tipo-b", [TIPI[2]]: "tipo-c" };

  return (
    <div>
      <div className="sezione-header">
        <div>
          <h2 className="titolo-pagina">Nuova prenotazione</h2>
          <p className="sottotitolo">Scegli un evento e completa la prenotazione</p>
        </div>
      </div>

      <div className="step-indicatori">
        {[
          "Scegli evento", 
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

      {step === 1 && (
        <div>
          <p className="istruzione">Seleziona l'elemento da utilizzare:</p>
          <div className="griglia-elementi">
            {eventiDisponibili.map(e => (
              <div
                key={e.id}
                className={`card card-elemento card-selezionabile ${
                  selezionato?.id === e.id ? "card-selezionata" : ""
                }`}
                onClick={() => setSelezionato(e)}
              >
                <div className="card-elemento-header">
                  <span className={`badge-tipo ${cssTipo[e.tipo] || "ArenaA"}`}>
                    {e.tipo}
                  </span>
                </div>
                <h3 className="nome-elemento">{e.nome}</h3>
                <div className="info-elemento">
                  <span>Data: {e.Data}</span>
                  <span>Capienza: {e.Capienza}</span>
                </div>
              </div>
            ))}
          </div>
          {eventiDisponibili.length === 0 && (
            <div className="stato-vuoto">Nessun evento disponibile.</div>
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
      {step === 2 && (
        <div>
          <div className="riepilogo-evento">
            <span className={`badge-tipo ${cssTipo[selezionato.tipo] || "ArenaA"}`}>
              {selezionato.tipo}
            </span>
            <strong>{selezionato.nome}</strong>
            <button className="link-cambio" onClick={() => setStep(1)}>
              Cambia
            </button>
          </div>
          <form onSubmit={conferma} className="form-prenotazione">
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
                  {quantita}h × {selezionato.Capienza}
                </span>
                <span className="costo-totale">
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
      {step === 3 && confermata && (
        <div className="card conferma-card">
          <div className="conferma-icona">✓</div>
          <h3 className="conferma-titolo">Operazione confermata!</h3>
          <div className="riepilogo-grid">
            <span className="riep-label">Utente</span>
            <span className="riep-valore">{confermata.utente}</span>

            <span className="riep-label">Evento</span>
            <span className="riep-valore">{confermata.eventoId}</span>

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

function CampoForm({ label, errore, children }) {
  return (
    <div className="campo">
      <label className="campo-label">{label}</label>
      {children}
      {errore && <span className="campo-errore">{errore}</span>}
    </div>
  );
}