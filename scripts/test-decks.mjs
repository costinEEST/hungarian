import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { getDeck, parseDeckSource } from "../assets/decks.js";

for (const [id, total, groups] of [
  ["cities", 143, 17],
  ["chapter-2", 165, 10],
]) {
  const deck = getDeck(id);
  const markdown = readFileSync(
    new URL(`../${deck.source}`, import.meta.url),
    "utf8",
  );
  test(`${id}: maintained source retains all entries, groups, and language fields`, () => {
    const { rows, guideMarkdown } = parseDeckSource(markdown, deck);
    assert.equal(rows.length, total);
    assert.equal(new Set(rows.map((row) => row.group)).size, groups);
    assert.ok(
      rows.every(
        (row) => row.group && row.romanian && row.hungarian && row.notes,
      ),
    );
    assert.ok(
      !guideMarkdown.includes("| Județ") &&
        !guideMarkdown.includes("| Categorie"),
    );
    assert.ok(guideMarkdown.includes("## "));
    assert.ok(rows.every((row) => deck.reading(row).includes(row.hungarian)));
  });
  test(`${id}: rejects incomplete, empty, and incompatible tables`, () => {
    const lines = markdown.split(/\r?\n/);
    const start = lines.findIndex((line) => deck.header.test(line));
    const header = lines[start];
    const divider = lines[start + 1];
    const firstRow = lines[start + 2];
    assert.throws(() => parseDeckSource("Missing source table", deck));
    assert.throws(() => parseDeckSource(`${header}\n${divider}`, deck));
    assert.throws(() =>
      parseDeckSource(`${header}\n| --- |\n${firstRow}`, deck),
    );
    assert.throws(() =>
      parseDeckSource(
        `${header}\n${divider}\n${firstRow.replace(/\|[^|]+\|/, "| |")}`,
        deck,
      ),
    );
    assert.throws(() =>
      parseDeckSource(
        `${header}\n${divider}\n${firstRow.trim().slice(0, -1)}`,
        deck,
      ),
    );
    const other = getDeck(id === "cities" ? "chapter-2" : "cities");
    assert.throws(() => parseDeckSource(markdown, other));
  });
  test(`${id}: accepts a valid smaller selection without a fixed runtime total`, () => {
    const lines = markdown.split(/\r?\n/);
    const start = lines.findIndex((line) => deck.header.test(line));
    assert.equal(
      parseDeckSource(lines.slice(start, start + 3).join("\r\n"), deck).rows
        .length,
      1,
    );
  });
}
test("unknown deck identifiers are rejected rather than silently selecting cities", () => {
  assert.throws(() => getDeck("unknown"));
  assert.throws(() => getDeck("toString"));
});
