// Exports: a Markdown table in the same format as costinEEST/hungarian decks,
// and a self-contained HTML flashcard page (inline CSS + JS, works offline).

const cell = (text) =>
  String(text ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\s*\n\s*/g, " ")
    .trim() || "—";

export function cleanRows(rows) {
  return rows
    .map((row) => ({
      group: String(row.group ?? "").trim(),
      romanian: String(row.romanian ?? "").trim(),
      hungarian: String(row.hungarian ?? "").trim(),
      notes: String(row.notes ?? "").trim(),
    }))
    .filter((row) => row.romanian && row.hungarian);
}

export function toMarkdown(title, rows) {
  const clean = cleanRows(rows).map((row) => ({
    ...row,
    group: row.group || "General",
  }));
  const lines = [
    `# ${title}`,
    "",
    `${countRo(clean.length, "pereche", "perechi")} română–maghiară.`,
    "",
    "## Fișe",
    "",
    "| Categorie | Română | Maghiară | Observații |",
    "| --- | --- | --- | --- |",
    ...clean.map(
      (r) =>
        `| ${cell(r.group)} | ${cell(r.romanian)} | ${cell(r.hungarian)} | ${cell(r.notes)} |`,
    ),
    "",
  ];
  return lines.join("\n");
}

// Romanian plural: 1 fișă, 7 fișe, 20 de fișe.
export const countRo = (n, one, many) =>
  n === 1
    ? `1 ${one}`
    : `${n}${n % 100 >= 20 || n % 100 === 0 ? " de" : ""} ${many}`;

export const escapeHtml = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

// JSON inside <script type="application/json">: escaping "<" prevents "</script>" from ending the block.
const embedJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c");

let exportAssets;
async function assets() {
  if (!exportAssets)
    exportAssets = Promise.all(
      [
        "../flashcards.css",
        "../flashcard-voices.js",
        "../flashcards.js",
        "../../magyarok-a1-capitolul-2-flashcarduri.html",
      ].map(async (path) => {
        const response = await fetch(new URL(path, import.meta.url));
        if (!response.ok)
          throw new Error("Resursele pentru export nu s-au încărcat.");
        return response.text();
      }),
    ).catch((error) => {
      exportAssets = null;
      throw error;
    });
  return exportAssets;
}

export async function toHtml(title, rows) {
  const cards = cleanRows(rows);
  if (!cards.length) throw new Error("Completează cel puțin o pereche.");
  const [css, voices, player, template] = await assets();
  const main = template.match(/<main class="wrap">([\s\S]*?)<\/main>/)[0];
  const script =
    "const rankVoices = (() => {\n" +
    voices.replace(/export /g, "") +
    "\nreturn rankVoices;\n})();\n" +
    player.replace(/^import .*?;\n/gm, "");
  return `<!doctype html><html lang="ro"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>${escapeHtml(title)}</title>
<style>${css}</style></head><body>
<header class="wrap"><h1>${escapeHtml(title)}</h1>
<p>${countRo(cards.length, "fișă", "fișe")}. Ascultă mai întâi în română, apoi în maghiară.</p>
<p>Fișe din fotografii, revizuite de utilizator.</p></header>
${main}
<footer class="wrap"><p>Generat cu Fișe din fotografii. Vocile depind de browser și dispozitiv.</p></footer>
<script type="application/json" id="embedded-deck">${embedJson(cards)}</script>
<script type="module">${script.replace(/<\/script/gi, "<\\/script")}</script></body></html>`;
}
