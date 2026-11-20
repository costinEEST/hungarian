// Rule-based pairing for when Chrome's built-in AI isn't available.
// Pure functions (no DOM), so they run under `node --test` too.

// Letters only one of the two languages uses. They don't overlap:
// Romanian has ă â î ș ț; Hungarian has á é í ó ö ő ú ü ű.
const RO_LETTERS = /[ăâîșşțţ]/giu;
const HU_LETTERS = /[áéíóöőúüű]/giu;
// Short function words that exist in only one of the languages ("a", "te", "el", "mi" exist in both).
const RO_WORDS = new Set(
  "și sau în la cu pe din pentru este sunt nu să ce care un o mai foarte eu tu ea noi voi ei ele mă îmi vă bună bun ziua seara".split(
    " ",
  ),
);
const HU_WORDS = new Set(
  "az és egy nem van vagy hogy is meg ez én ő ti ők vagyok jó napot kívánok köszönöm igen".split(
    " ",
  ),
);

export function scoreLanguage(text) {
  const lower = text.toLowerCase();
  let ro = (lower.match(RO_LETTERS) ?? []).length * 2;
  let hu = (lower.match(HU_LETTERS) ?? []).length * 2;
  for (const word of lower.split(/[^\p{L}]+/u)) {
    if (RO_WORDS.has(word)) ro += 1;
    if (HU_WORDS.has(word)) hu += 1;
  }
  // Hungarian-only digraphs and double consonants.
  hu += (lower.match(/sz|zs|gy|ny|cs/gu) ?? []).length * 0.5;
  // Romanian-only endings.
  ro +=
    (lower.match(/\p{L}(?:ului|lor|ește|ează|ție|ții)(?!\p{L})/gu) ?? [])
      .length * 0.5;
  return { ro, hu };
}

export function classify(text) {
  const { ro, hu } = scoreLanguage(text);
  if (ro === hu) return "?";
  return ro > hu ? "ro" : "hu";
}

const SEPARATOR = /\s+[-–—=:|]\s+|\t+|\s{3,}/u;

// "casă – ház" or "casă      ház" on one line.
export function splitPair(line, classifyFn = classify) {
  const parts = line
    .split(SEPARATOR)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length !== 2) return null;
  const [a, b] = parts.map(classifyFn);
  if (a === "ro" && b !== "ro")
    return { romanian: parts[0], hungarian: parts[1] };
  if (a === "hu" && b !== "hu")
    return { romanian: parts[1], hungarian: parts[0] };
  if (b === "ro" && a === "?")
    return { romanian: parts[1], hungarian: parts[0] };
  if (b === "hu" && a === "?")
    return { romanian: parts[0], hungarian: parts[1] };
  return null;
}

const isNoise = (line) => /^[\d\s.,;:()[\]\-–—|•·*]*$/u.test(line);
const isHeading = (line) =>
  line.length <= 60 &&
  (/:$/.test(line) ||
    (line === line.toUpperCase() && /\p{Lu}{3,}/u.test(line)));

/**
 * Turns OCR text into rows { group, romanian, hungarian, notes }.
 * - known: Map of text → "ro" | "hu" that the OCR step already decided (trusted first).
 * - detect(line): optional async detector (e.g. Chrome's Language Detector), used only
 *   for lines that neither `known` nor the letter heuristics can decide.
 */
export async function buildRows(
  text,
  { known = new Map(), detect = null } = {},
) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+$/u, ""))
    .filter((line) => line.trim() && !isNoise(line.trim()));

  const quick = (part) => known.get(part.trim()) ?? classify(part);
  const decide = async (line) => {
    const guess = quick(line);
    if (guess !== "?" || !detect) return guess;
    try {
      return (await detect(line)) ?? "?";
    } catch {
      return "?";
    }
  };

  const rows = [];
  let group = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const raw = lines[i];
    if (isHeading(line)) {
      group = line.replace(/:$/, "").trim();
      continue;
    }
    const pair = splitPair(raw.trim().replace(/ {3,}/g, "\t"), quick);
    if (pair) {
      rows.push({ group, ...pair, notes: "" });
      continue;
    }
    const here = await decide(line);
    const nextLine = lines[i + 1]?.trim();
    const next =
      nextLine && !isHeading(nextLine) && !splitPair(nextLine, quick)
        ? await decide(nextLine)
        : null;
    // Pair two consecutive lines only when both languages are known and differ.
    if (next && here !== "?" && next !== "?" && here !== next) {
      const romanianFirst = here === "ro";
      rows.push({
        group,
        romanian: romanianFirst ? line : nextLine,
        hungarian: romanianFirst ? nextLine : line,
        notes: "",
      });
      i++;
      continue;
    }
    // Unpaired line: keep it so nothing from the page is lost; the user fills the other side.
    rows.push({
      group,
      romanian: here === "hu" ? "" : line,
      hungarian: here === "hu" ? line : "",
      notes: "",
    });
  }
  return rows;
}
