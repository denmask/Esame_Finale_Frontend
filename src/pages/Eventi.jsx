import { useState } from "react";
import { useDati, TIPI, STATI } from "../data";

export default function Eventi() {
  const { eventi, aggiungiEvento, aggiornaStatoEvento } = useDati();
  const [filtroTipo, setFiltroTipo] = useState("Tutti");
  const [filtroStato, setFiltroStato] = useState("Tutti");
  const [mostraForm, setMostraForm] = useState(false);
  const [errori, setErrori] = useState({});

  const [form, setForm] = useState({
    nome: "",
    tipo: TIPI[0],
    Data: "",    
    Capienza: "",    
    stato: STATI[0],
  });

  const visibili = eventi.filter(e => {
    if (filtroTipo !== "Tutti" && e.tipo !== filtroTipo) return false;
    if (filtroStato !== "Tutti" && e.stato !== filtroStato) return false;
    return true;
  });

  function valida() {
    const e = {};
    if (!form.nome.trim()) e.nome = "Il nome è obbligatorio";
    if (!form.Data) e.Data = "La data è obbligatoria";
    if (!form.Capienza || Number(form.Capienza) < 1) e.Capienza = "Inserisci un valore valido";
    return e;
  }

  function salva(ev) {
    ev.preventDefault();
    const e = valida();
    if (Object.keys(e).length > 0) {
      setErrori(e);
      return;
    }
    aggiungiEvento({
      ...form,
      Capienza: Number(form.Capienza),
    });
    setForm({ nome: "", tipo: TIPI[0], Data: "", Capienza: "", stato: STATI[0] });
    setErrori({});
    setMostraForm(false);
  }

  const cssStato = { [STATI[0]]: "Aperto tutto l'anno", [STATI[1]]: "Da Ottobre a Maggio", [STATI[2]]: "Dal 01/06 al 15/09" };
  const cssTipo = { [TIPI[0]]: "Rock Arena", [TIPI[1]]: "TechCon Center", [TIPI[2]]: "Summer Beat Pavilion" };

  return (
    <div>
      <div className="sezione-header">
        <div>
          <h2 className="titolo-pagina">Eventi disponibili</h2>
          <p className="sottotitolo">{visibili.length} eventi trovati</p>
        </div>
        <button className="btn-primario" onClick={() => setMostraForm(m => !m)}>
          {mostraForm ? "Chiudi" : "+ Nuovo evento"}
        </button>
      </div>

      {mostraForm && (
        <div className="card form-card">
          <h3 className="card-titolo">Aggiungi un evento</h3>
          <form onSubmit={salva} className="griglia-form">
            <CampoForm label="Nome" errore={errori.nome}>
              <input
                value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })}
                placeholder="es. Nome Evento"
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

            <CampoForm label="Data" errore={errori.Data}>
              <input
                type="text"
                value={form.Data}
                onChange={e => setForm({ ...form, Data: e.target.value })}
                placeholder="es. 15/06"
              />
            </CampoForm>
            <CampoForm label="Capienza" errore={errori.Capienza}>
              <input
                type="number"
                min="1"
                value={form.Capienza}
                onChange={e => setForm({ ...form, Capienza: e.target.value })}
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

      <div className="griglia-eventi">
        {visibili.map(e => (
          <div key={e.id} className="card card-evento">
            <div className="card-evento-header">
              <span className={`badge-tipo ${cssTipo[e.tipo] || "tipo-a"}`}>
                {e.tipo}
              </span>
              <span className={`badge-stato ${cssStato[e.stato] || "stato-ok"}`}>
                {e.stato}
              </span>
            </div>

            <h3 className="nome-eventi">{e.nome}</h3>

            <div className="info-evento">
              <span>Data: {e.Data}</span>
              <span>Capienza: {e.Capienza}</span>
            </div>

            <div className="card-evento-footer">
              <label className="label-cambio">Cambia stato:</label>
              <select
                value={e.stato}
                onChange={ev => aggiornaStatoEvento(e.id, ev.target.value)}
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
          Nessun evento corrisponde ai filtri selezionati.
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