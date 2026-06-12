import { useState } from "react";

// ============================================================
// ✏️ ESAME — SEZIONE 1: CATEGORIE / TIPI
// Sostituisci con le categorie del tuo dominio.
// Esempi: ["Libro", "Rivista", "DVD"] oppure ["Corso", "Seminario"]
// ============================================================
export const TIPI = ["CategoriaA", "CategoriaB", "CategoriaC"];

// ============================================================
// ✏️ ESAME — SEZIONE 2: STATI
// Sostituisci con gli stati del tuo dominio.
// Esempi: ["Disponibile", "Prestato", "Riservato"]
// ============================================================
export const STATI = ["StatoA", "StatoB", "StatoC"];

// ============================================================
// ✏️ ESAME — SEZIONE 3: DATI INIZIALI DEGLI ELEMENTI
// Ogni oggetto rappresenta un "elemento" del tuo sistema.
// Cambia i nomi dei campi e i valori.
// I campi obbligatori sono: id, nome, tipo, stato
// Aggiungi altri campi secondo necessità (es. capienza, prezzo, autore...)
// ============================================================
const elementi_iniziali = [
  { id: 1, nome: "Elemento 1", tipo: "CategoriaA", campo1: 10, campo2: 5,  stato: "StatoA" },
  { id: 2, nome: "Elemento 2", tipo: "CategoriaA", campo1: 10, campo2: 5,  stato: "StatoA" },
  { id: 3, nome: "Elemento 3", tipo: "CategoriaB", campo1: 8,  campo2: 20, stato: "StatoA" },
  { id: 4, nome: "Elemento 4", tipo: "CategoriaB", campo1: 4,  campo2: 15, stato: "StatoB" },
  { id: 5, nome: "Elemento 5", tipo: "CategoriaC", campo1: 3,  campo2: 30, stato: "StatoA" },
  { id: 6, nome: "Elemento 6", tipo: "CategoriaC", campo1: 5,  campo2: 40, stato: "StatoC" },
  { id: 7, nome: "Elemento 7", tipo: "CategoriaA", campo1: 10, campo2: 5,  stato: "StatoA" },
  { id: 8, nome: "Elemento 8", tipo: "CategoriaB", campo1: 12, campo2: 35, stato: "StatoA" },
];

// ============================================================
// ✏️ ESAME — SEZIONE 4: DATI INIZIALI DELLE TRANSAZIONI/PRENOTAZIONI
// Ogni oggetto è un'azione (prenotazione, prestito, ordine...).
// Cambia nomi campi e valori. Mantieni sempre: id, tipo, data, valore numerico.
// ============================================================
const transazioni_iniziali = [
  { id: 1,  utente: "Mario Rossi",    elementoId: 3, elementoNome: "Elemento 3", tipo: "CategoriaB", data: "2025-05-10", inizio: "09:00", fine: "12:00", quantita: 3,  totale: 60  },
  { id: 2,  utente: "Sofia Bianchi",  elementoId: 1, elementoNome: "Elemento 1", tipo: "CategoriaA", data: "2025-05-12", inizio: "08:00", fine: "18:00", quantita: 10, totale: 50  },
  { id: 3,  utente: "Luca Verdi",     elementoId: 5, elementoNome: "Elemento 5", tipo: "CategoriaC", data: "2025-05-14", inizio: "10:00", fine: "16:00", quantita: 6,  totale: 180 },
  { id: 4,  utente: "Elena Neri",     elementoId: 4, elementoNome: "Elemento 4", tipo: "CategoriaB", data: "2025-05-15", inizio: "14:00", fine: "17:00", quantita: 3,  totale: 45  },
  { id: 5,  utente: "Andrea Galli",   elementoId: 2, elementoNome: "Elemento 2", tipo: "CategoriaA", data: "2025-05-16", inizio: "09:00", fine: "13:00", quantita: 4,  totale: 20  },
  { id: 6,  utente: "Chiara Russo",   elementoId: 8, elementoNome: "Elemento 8", tipo: "CategoriaB", data: "2025-05-17", inizio: "09:00", fine: "18:00", quantita: 9,  totale: 315 },
  { id: 7,  utente: "Matteo Bruno",   elementoId: 6, elementoNome: "Elemento 6", tipo: "CategoriaC", data: "2025-05-19", inizio: "08:00", fine: "20:00", quantita: 12, totale: 480 },
  { id: 8,  utente: "Valeria Serra",  elementoId: 3, elementoNome: "Elemento 3", tipo: "CategoriaB", data: "2025-05-20", inizio: "13:00", fine: "16:00", quantita: 3,  totale: 60  },
  { id: 9,  utente: "Giovanni Costa", elementoId: 7, elementoNome: "Elemento 7", tipo: "CategoriaA", data: "2025-05-21", inizio: "09:00", fine: "18:00", quantita: 9,  totale: 45  },
  { id: 10, utente: "Federica Sala",  elementoId: 5, elementoNome: "Elemento 5", tipo: "CategoriaC", data: "2025-05-22", inizio: "10:00", fine: "19:00", quantita: 9,  totale: 270 },
];

// ============================================================
// Contatori ID (non toccare, gestiti automaticamente)
// ============================================================
let nextElementoId   = elementi_iniziali.length + 1;
let nextTransazioneId = transazioni_iniziali.length + 1;

// ============================================================
// Hook principale — espone dati e funzioni alle pagine
// ============================================================
export function useDati() {
  const [elementi, setElementi]         = useState(elementi_iniziali);
  const [transazioni, setTransazioni]   = useState(transazioni_iniziali);

  // ✏️ Rinomina "aggiungiElemento" con il verbo del tuo dominio (es. aggiungiLibro)
  function aggiungiElemento(elem) {
    setElementi(prev => [...prev, { ...elem, id: nextElementoId++ }]);
  }

  // ✏️ Rinomina "aggiornaStato" se vuoi
  function aggiornaStatoElemento(id, nuovoStato) {
    setElementi(prev => prev.map(e => e.id === id ? { ...e, stato: nuovoStato } : e));
  }

  // ✏️ Rinomina "aggiungiTransazione" con il verbo del tuo dominio (es. aggiungiPrestito)
  function aggiungiTransazione(trans) {
    setTransazioni(prev => [...prev, { ...trans, id: nextTransazioneId++ }]);
  }

  return { elementi, transazioni, aggiungiElemento, aggiornaStatoElemento, aggiungiTransazione };
}

// ============================================================
// Utility: calcola differenza oraria tra "HH:MM" e "HH:MM"
// Usata nel form prenotazione per calcolare il costo totale
// ============================================================
export function calcolaQuantita(inizio, fine) {
  const [h1, m1] = inizio.split(":").map(Number);
  const [h2, m2] = fine.split(":").map(Number);
  return Math.max(0, (h2 * 60 + m2 - h1 * 60 - m1) / 60);
}