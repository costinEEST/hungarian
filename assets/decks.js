import { parseTableSource } from "./markdown-source.js";

const column = (key, label, lang) => ({ key, label, lang });
const decks = {
  cities: {
    source: "./orase-romanesti-cu-nume-maghiare.md",
    header:
      /^\|\s*Județ\s*\|\s*Oraș \(română\)\s*\|\s*(?:Denumire|Nume) maghiară?\s*\|/,
    fields: [
      "group",
      "romanian",
      "hungarian",
      "where",
      "toward",
      "from",
      "notes",
    ],
    groupPrefix: "judet",
    tableClass: "city-table",
    scrollTable: true,
    columns: [
      column("romanian", "Oraș (română)", "ro"),
      column("hungarian", "Denumire maghiară", "hu"),
      column("where", "Hol?", "hu"),
      column("toward", "Hová?", "hu"),
      column("from", "Honnan?", "hu"),
      column("notes", "Variante / observații", "ro"),
    ],
    groupCount: (count) => `${count} ${count === 1 ? "oraș" : "orașe"}`,
    caption: (group) => `Nume și forme locative pentru județul ${group}`,
    reading: (row) =>
      `${row.hungarian}. ${row.where}. ${row.toward}. ${row.from}.`,
  },
  "chapter-2": {
    source: "./magyarok-a1-capitolul-2.md",
    header:
      /^\|\s*Categorie\s*\|\s*Română\s*\|\s*Maghiară\s*\|\s*Observații\s*\|\s*$/,
    fields: ["group", "romanian", "hungarian", "notes"],
    omitHeading: /^## Fișe\s*$/,
    groupPrefix: "tema",
    tableClass: "chapter-table",
    showNotes: true,
    columns: [
      column("romanian", "Română", "ro"),
      column("hungarian", "Maghiară", "hu"),
      column("notes", "Observații", "ro"),
    ],
    groupCount: (count) => `${count} fișe`,
    caption: (group) => group,
    reading: (row) => row.hungarian,
  },
};

export function getDeck(id) {
  if (!Object.hasOwn(decks, id)) throw new Error(`Sursă necunoscută: ${id}`);
  return decks[id];
}
export function parseDeckSource(markdown, deck) {
  return parseTableSource(markdown, deck);
}
export async function loadLesson(deck) {
  const response = await fetch(deck.source);
  if (!response.ok)
    throw new Error(`Sursa nu a putut fi încărcată: ${response.status}`);
  return parseDeckSource(await response.text(), deck);
}
export async function loadDeck(deck) {
  return (await loadLesson(deck)).rows;
}
