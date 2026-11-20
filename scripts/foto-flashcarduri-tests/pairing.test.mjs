import fs from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildRows,
  classify,
  splitPair,
} from "../../assets/foto-flashcarduri/pairing.js";
import { toHtml, toMarkdown } from "../../assets/foto-flashcarduri/export.js";
import { chunkLines } from "../../assets/foto-flashcarduri/ai.js";

test("classify recognises each language", () => {
  assert.equal(classify("Bună dimineața!"), "ro");
  assert.equal(classify("Jó reggelt kívánok!"), "hu");
  assert.equal(classify("Mă numesc Anna."), "ro");
  assert.equal(classify("Köszönöm szépen."), "hu");
  assert.equal(classify("Îmi pare bine."), "ro");
  assert.equal(classify("Örülök."), "hu");
});

test("splitPair handles dash, tab and wide gaps in either order", () => {
  assert.deepEqual(splitPair("casă – ház"), {
    romanian: "casă",
    hungarian: "ház",
  });
  assert.equal(splitPair("casa - haz"), null); // no language signal on either side
  assert.deepEqual(splitPair("Bună ziua! – Jó napot kívánok!"), {
    romanian: "Bună ziua!",
    hungarian: "Jó napot kívánok!",
  });
  assert.deepEqual(splitPair("Köszönöm.\tMulțumesc."), {
    romanian: "Mulțumesc.",
    hungarian: "Köszönöm.",
  });
  assert.deepEqual(splitPair("Mă numesc Anna.      Annának hívnak."), {
    romanian: "Mă numesc Anna.",
    hungarian: "Annának hívnak.",
  });
});

test("buildRows pairs same-line and consecutive-line layouts, keeps headings as groups", async () => {
  const text = [
    "SALUTURI:",
    "Bună dimineața! – Jó reggelt kívánok!",
    "12",
    "Mulțumesc.",
    "Köszönöm.",
    "Prezentare:",
    "Mă numesc Anna.",
    "Annának hívnak.",
    "Îmi pare bine.",
  ].join("\n");
  const rows = await buildRows(text);
  assert.deepEqual(rows, [
    {
      group: "SALUTURI",
      romanian: "Bună dimineața!",
      hungarian: "Jó reggelt kívánok!",
      notes: "",
    },
    {
      group: "SALUTURI",
      romanian: "Mulțumesc.",
      hungarian: "Köszönöm.",
      notes: "",
    },
    {
      group: "Prezentare",
      romanian: "Mă numesc Anna.",
      hungarian: "Annának hívnak.",
      notes: "",
    },
    {
      group: "Prezentare",
      romanian: "Îmi pare bine.",
      hungarian: "",
      notes: "",
    },
  ]);
});

test("buildRows asks the detector only for undecided lines", async () => {
  const asked = [];
  const rows = await buildRows("casa\nhaz", {
    detect: async (line) => {
      asked.push(line);
      return line === "casa" ? "ro" : "hu";
    },
  });
  assert.deepEqual(asked, ["casa", "haz"]);
  assert.deepEqual(rows, [
    { group: "", romanian: "casa", hungarian: "haz", notes: "" },
  ]);
});

test("markdown matches the hungarian repo table format", () => {
  const md = toMarkdown("Test", [
    { group: "", romanian: "Da | nu", hungarian: "Igen", notes: "" },
    { group: "X", romanian: "incomplet", hungarian: "", notes: "" },
  ]);
  assert.match(md, /^\| Categorie \| Română \| Maghiară \| Observații \|$/m);
  assert.match(md, /^\| General \| Da \\\| nu \| Igen \| — \|$/m);
  assert.doesNotMatch(md, /incomplet/);
});

test("HTML export escapes the title and cannot be broken out of by card text", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => ({
    ok: true,
    text: () => fs.readFile(url, "utf8"),
  });
  try {
    const html = await toHtml("<b>T</b>", [
      {
        group: "g",
        romanian: "</script><img src=x>",
        hungarian: "ház",
        notes: "",
      },
    ]);
    assert.match(html, /<title>&lt;b&gt;T&lt;\/b&gt;<\/title>/);
    assert.equal(html.split("</script>").length - 1, 2); // only the two real closing tags
    const json = html.match(
      /<script type="application\/json" id="embedded-deck">(.*?)<\/script>/s,
    )[1];
    assert.equal(JSON.parse(json)[0].romanian, "</script><img src=x>");
    const script = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
    const parsed = spawnSync(
      process.execPath,
      ["--input-type=module", "--check"],
      { input: script, encoding: "utf8" },
    );
    assert.equal(parsed.status, 0, parsed.stderr);
    assert.doesNotMatch(script, /^import /m);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("chunkLines keeps lines whole", () => {
  const text = Array.from(
    { length: 100 },
    (_, i) => `rând ${i} — sor ${i}`,
  ).join("\n");
  const chunks = chunkLines(text, 200);
  assert.ok(chunks.length > 1);
  assert.equal(chunks.join("\n"), text);
});

test("languages known from OCR win over the letter heuristics", async () => {
  // "numár" would look Hungarian; OCR already said it's Romanian.
  const known = new Map([
    ["numár de telefon", "ro"],
    ["telefonszám", "hu"],
  ]);
  const rows = await buildRows("numár de telefon – telefonszám", { known });
  assert.deepEqual(rows, [
    {
      group: "",
      romanian: "numár de telefon",
      hungarian: "telefonszám",
      notes: "",
    },
  ]);
});

test("a lone undecided line is not paired with its neighbour", async () => {
  const rows = await buildRows("Annának hívnak.\nImi pare bine");
  assert.equal(rows.length, 2);
});
