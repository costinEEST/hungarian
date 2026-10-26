#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error(`Usage: ${path.basename(process.argv[1])} <deck.json> [...]`);
  process.exit(2);
}

const normalize = (value) =>
  value.normalize("NFC").trim().toLocaleLowerCase("ro");
let failed = false;

for (const file of files) {
  let deck;
  try {
    deck = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    console.error(`${file}: invalid JSON (${error.message})`);
    failed = true;
    continue;
  }

  const errors = [];
  if (!Array.isArray(deck.categories) || deck.categories.length === 0)
    errors.push("categories must be a non-empty array");
  if (!Array.isArray(deck.cards) || deck.cards.length === 0)
    errors.push("cards must be a non-empty array");
  if (errors.length > 0) {
    console.error(`${file}: ${errors.join("; ")}`);
    failed = true;
    continue;
  }

  const categoryIds = new Set();
  for (const category of deck.categories) {
    if (!category?.id || !category?.label)
      errors.push("each category needs non-empty id and label");
    if (categoryIds.has(category.id))
      errors.push(`duplicate category id: ${category.id}`);
    categoryIds.add(category.id);
  }

  const cardIds = new Set();
  const counts = Object.fromEntries(
    deck.categories.map((category) => [category.id, 0]),
  );
  const fronts = new Map();
  const backs = new Map();
  const addOccurrence = (map, value, id) => {
    const key = normalize(value);
    map.set(key, [...(map.get(key) || []), id]);
  };

  for (const card of deck.cards) {
    if (!card?.id || !card?.category || !card?.front || !card?.back) {
      errors.push(
        `card ${card?.id || "(unknown)"} needs non-empty id, category, front and back`,
      );
      continue;
    }
    if (cardIds.has(card.id)) errors.push(`duplicate card id: ${card.id}`);
    cardIds.add(card.id);
    if (!categoryIds.has(card.category))
      errors.push(`card ${card.id} uses unknown category: ${card.category}`);
    else counts[card.category] += 1;
    addOccurrence(fronts, card.front, card.id);
    addOccurrence(backs, card.back, card.id);
  }

  const duplicates = (map) =>
    [...map.entries()]
      .filter(([, ids]) => ids.length > 1)
      .map(([text, ids]) => ({ text, ids }));
  const report = {
    file,
    cards: deck.cards.length,
    categories: deck.categories.length,
    counts,
    duplicateFronts: duplicates(fronts),
    duplicateBacks: duplicates(backs),
  };
  console.log(JSON.stringify(report, null, 2));

  if (errors.length > 0) {
    errors.forEach((error) => console.error(`${file}: ${error}`));
    failed = true;
  }
}

process.exitCode = failed ? 1 : 0;
