#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { getDeck, parseDeckSource } from "../assets/decks.js";

const requested = process.argv.slice(2);
const identifiers = requested.length ? requested : ["cities", "chapter-2", "practical"];
const normalize = (text) =>
  text.normalize("NFC").trim().toLocaleLowerCase("ro");
let failed = false;
for (const id of identifiers) {
  try {
    const deck = getDeck(id);
    const markdown = readFileSync(
      new URL(`../${deck.source}`, import.meta.url),
      "utf8",
    );
    const { rows } = parseDeckSource(markdown, deck);
    const counts = {};
    const duplicates = (key) => {
      const occurrences = new Map();
      rows.forEach((row, index) => {
        const text = normalize(row[key]);
        if (!occurrences.has(text)) occurrences.set(text, []);
        occurrences.get(text).push({ entry: index + 1, group: row.group });
      });
      return [...occurrences]
        .filter(([, entries]) => entries.length > 1)
        .map(([text, entries]) => ({ text, entries }));
    };
    rows.forEach((row) => {
      counts[row.group] = (counts[row.group] || 0) + 1;
    });
    console.log(
      JSON.stringify(
        {
          deck: id,
          source: deck.source,
          cards: rows.length,
          groups: Object.keys(counts).length,
          counts,
          duplicateRomanian: duplicates("romanian"),
          duplicateHungarian: duplicates("hungarian"),
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error(`${id}: ${error.message}`);
    failed = true;
  }
}
process.exitCode = failed ? 1 : 0;
