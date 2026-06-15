import { useState } from "react";

export const TIPI = ["Rock Arena", "Tech con Center", "Summer Beat Pavilion"];

export const STATI = ["Aperto tutto l'anno", "Da ottobre a maggio", "Dal 01/06 al 15/09"];

const datiInizialiEventi = [
  { id: 1, nome: "Rock Arena", tipo: TIPI[0], Data: "15/06", Capienza: 15000, stato: STATI[0] },
  { id: 2, nome: "Tech Con Center", tipo: TIPI[1], Data: "10/11", Capienza: 4500, stato: STATI[1] },
  { id: 3, nome: "Summer Beat Pavilion", tipo: TIPI[2], Data: "01/08", Capienza: 22000, stato: STATI[2] },
];

const datiInizialiPrenotazioni = [
  { id: 1,  utente: "Mario Rossi",    eventoId: 3, tipo: TIPI[1], data: "2025-05-10", inizio: "09:00", fine: "12:00", quantita: 3,  totale: 60  },
  { id: 2,  utente: "Sofia Bianchi",  eventoId: 1, tipo: TIPI[0], data: "2025-05-12", inizio: "17:00", fine: "20:00", quantita: 3, totale: 50  },
  { id: 3,  utente: "Luca Verdi",     eventoId: 3, tipo: TIPI[2], data: "2025-05-14", inizio: "10:00", fine: "13:00", quantita: 3,  totale: 100 },
  { id: 4,  utente: "Elena Neri",     eventoId: 2, tipo: TIPI[1], data: "2025-05-15", inizio: "14:00", fine: "17:00", quantita: 3,  totale: 45  },
  { id: 5,  utente: "Andrea Galli",   eventoId: 1, tipo: TIPI[0], data: "2025-05-16", inizio: "09:00", fine: "13:00", quantita: 4,  totale: 20  },
  { id: 6,  utente: "Chiara Russo",   eventoId: 2, tipo: TIPI[1], data: "2025-05-17", inizio: "09:00", fine: "12:00", quantita: 3,  totale: 30 },
  { id: 7,  utente: "Matteo Bruno",   eventoId: 3, tipo: TIPI[2], data: "2025-05-19", inizio: "08:00", fine: "20:00", quantita: 12, totale: 50 },
  { id: 8,  utente: "Valeria Serra",  eventoId: 2, tipo: TIPI[1], data: "2025-05-20", inizio: "13:00", fine: "16:00", quantita: 3,  totale: 60  },
  { id: 9,  utente: "Giovanni Costa", eventoId: 1, tipo: TIPI[0], data: "2025-05-21", inizio: "09:00", fine: "18:00", quantita: 9,  totale: 45  },
  { id: 10, utente: "Federica Sala",  eventoId: 3, tipo: TIPI[2], data: "2025-05-22", inizio: "12:00", fine: "19:00", quantita: 7,  totale: 70 },
];

let nextEventoId   = datiInizialiEventi.length + 1;
let nextPrenotazioneId = datiInizialiPrenotazioni.length + 1;

export function useDati() {
  const [eventi, setEventi]         = useState(datiInizialiEventi);
  const [prenotazioni, setPrenotazioni]   = useState(datiInizialiPrenotazioni);

  function aggiungiEvento(evento) {
    setEventi(prev => [...prev, { ...evento, id: nextEventoId++ }]);
  }

  function aggiornaStatoEvento(id, nuovoStato) {
    setEventi(prev => prev.map(e => e.id === id ? { ...e, stato: nuovoStato } : e));
  }

  function aggiungiPrenotazione(pren) {
    setPrenotazioni(prev => [...prev, { ...pren, id: nextPrenotazioneId++ }]);
  }

  return { eventi, prenotazioni, aggiungiEvento, aggiornaStatoEvento, aggiungiPrenotazione };
}

export function calcolaQuantita(inizio, fine) {
  const [h1, m1] = inizio.split(":").map(Number);
  const [h2, m2] = fine.split(":").map(Number);
  return Math.max(0, (h2 * 60 + m2 - h1 * 60 - m1) / 60);
}