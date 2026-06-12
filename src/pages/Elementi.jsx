import { useState } from "react";
import { useDati, TIPI, STATI } from "../data";

// ============================================================
// PAGINA GESTIONE RISORSE (ELEMENTI)
// ✏️ ESAME: RINOMINA QUESTO FILE
// Esempi: Camere.jsx, Libri.jsx, Spazi.jsx, Prodotti.jsx
// ============================================================
// Contiene: griglia + filtri + form CRUD + cambio stato

export default function Elementi() {
  const { elementi, aggiungiElemento, aggiornaStatoElemento } = useDati();
  const [filtroTipo, setFiltroTipo] = useState("Tutti");
  const [filtroStato, setFiltroStato] = useState("Tutti");
  const [mostraForm, setMostraForm] = useState(false);
  const [errori, setErrori] = useState({});

  // ✏️ ESAME: modifica i campi del form in base al tuo dominio
  const [form, setForm] = useState({
    nome: "",
    tipo: TIPI[0],
    campo1: "",    // es. capienza, quantità, prezzo...
    campo2: "",    // es. tariffa, anno, durata...
    stato: STATI[0],
  });

  // FILTRO
  const visibili = elementi.filter(e => {
    if (filtroTipo !== "Tutti" && e.tipo !== filtroTipo) return false;
    if (filtroStato !== "Tutti" && e.stato !== filtroStato) return false;
    return true;
  });

  // VALIDAZIONE FORM
  function valida() {
    const e = {};
    if (!form.nome.trim()) e.nome = "Il nome è obbligatorio";
    if (!form.campo1 || Number(form.campo1) < 1) e.campo1 = "Inserisci un valore valido";
    if (!form.campo2 || Number(form.campo2) < 1) e.campo2 = "Inserisci un valore valido";
    return e;
  }

  // SALVA NUOVO ELEMENTO
  function salva(ev) {
    ev.preventDefault();
    const e = valida();
    if (Object.keys(e).length > 0) {
      setErrori(e);
      return;
    }
    aggiungiElemento({
      ...form,
      campo1: Number(form.campo1),
      campo2: Number(form.campo2),
    });
    setForm({ nome: "", tipo: TIPI[0], campo1: "", campo2: "", stato: STATI[0] });
    setErrori({});
    setMostraForm(false);
  }

  // ✏️ ESAME: cambia mapping colori se necessario
  const cssStato = { "StatoA": "stato-ok", "StatoB": "stato-busy", "StatoC": "stato-maint" };
  const cssTipo = { "CategoriaA": "tipo-a", "CategoriaB": "tipo-b", "CategoriaC": "tipo-c" };

  return (
    <div>
      {/* HEADER */}
      <div className="sezione-header">
        <div>
          {/* ✏️ ESAME: cambia titolo e descrizione */}
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
          <h3 className="card-titolo">Aggiungi un elemento</h3>
          <form onSubmit={salva} className="griglia-form">
            <CampoForm label="Nome" errore={errori.nome}>
              <input
                value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })}
                placeholder="es. Nome elemento"
              />
            </CampoForm>

            <CampoForm label="Tipologia">
              <select
                value={form.tipo}
                onChange={e => setForm({ ...form, tipo: e.target.value })}
              >
                {TIPI.map(t => <option key={t}>{t}</option>)}
              </select>
            </CampoForm>

            {/* ✏️ ESAME: cambia label "Campo 1" con il nome reale */}
            <CampoForm label="Campo 1" errore={errori.campo1}>
              <input
                type="number"
                min="1"
                value={form.campo1}
                onChange={e => setForm({ ...form, campo1: e.target.value })}
                placeholder="es. 10"
              />
            </CampoForm>

            {/* ✏️ ESAME: cambia label "Campo 2" con il nome reale */}
            <CampoForm label="Campo 2" errore={errori.campo2}>
              <input
                type="number"
                min="1"
                value={form.campo2}
                onChange={e => setForm({ ...form, campo2: e.target.value })}
                placeholder="es. 25"
              />
            </CampoForm>

            <CampoForm label="Stato iniziale">
              <select
                value={form.stato}
                onChange={e => setForm({ ...form, stato: e.target.value })}
              >
                {STATI.map(s => <option key={s}>{s}</option>)}
              </select>
            </CampoForm>

            <div className="form-azioni">
              <button type="submit" className="btn-primario">Salva</button>
              <button
                type="button"
                className="btn-secondario"
                onClick={() => setMostraForm(false)}
              >
                Annulla
              </button>
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
            <button
              key={t}
              className={`chip ${filtroTipo === t ? "chip-attivo" : ""}`}
              onClick={() => setFiltroTipo(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="filtri-gruppo">
          <span className="filtri-sublabel">Stato</span>
          {["Tutti", ...STATI].map(s => (
            <button
              key={s}
              className={`chip ${filtroStato === s ? "chip-attivo" : ""}`}
              onClick={() => setFiltroStato(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* GRIGLIA CARD */}
      <div className="griglia-elementi">
        {visibili.map(e => (
          <div key={e.id} className="card card-elemento">
            <div className="card-elemento-header">
              <span className={`badge-tipo ${cssTipo[e.tipo] || "tipo-a"}`}>
                {e.tipo}
              </span>
              <span className={`badge-stato ${cssStato[e.stato] || "stato-ok"}`}>
                {e.stato}
              </span>
            </div>

            <h3 className="nome-elemento">{e.nome}</h3>

            <div className="info-elemento">
              {/* ✏️ ESAME: cambia le label campo1 e campo2 */}
              <span>Campo1: {e.campo1}</span>
              <span>Campo2: {e.campo2}</span>
            </div>

            <div className="card-elemento-footer">
              <label className="label-cambio">Cambia stato:</label>
              <select
                value={e.stato}
                onChange={ev => aggiornaStatoElemento(e.id, ev.target.value)}
                className="select-stato"
              >
                {STATI.map(st => <option key={st}>{st}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>

      {visibili.length === 0 && (
        <div className="stato-vuoto">
          Nessun elemento corrisponde ai filtri selezionati.
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