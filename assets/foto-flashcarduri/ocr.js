// Tesseract.js 7 from jsDelivr. The "ron" and "hun" models (~4 MB together) download
// on first use and the browser caches them in IndexedDB.
//
// Why three workers: with "ron+hun" loaded together, Tesseract mixes the alphabets
// ("kivânok", "numár"). So the combined model only finds the lines, then each line
// segment is read twice, once as Romanian and once as Hungarian, and the reading
// with the higher confidence wins. That also tells us the segment's language.
import { classify } from "./pairing.js";

const TESSERACT_URL =
  "https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/tesseract.esm.min.js";

let workersPromise = null;

function getWorkers() {
  if (!workersPromise) {
    workersPromise = (async () => {
      const { default: Tesseract } = await import(TESSERACT_URL);
      const results = await Promise.allSettled(
        [["ron", "hun"], "ron", "hun"].map((langs) =>
          Tesseract.createWorker(langs, Tesseract.OEM.LSTM_ONLY),
        ),
      );
      if (results.some((result) => result.status === "rejected")) {
        await Promise.allSettled(
          results
            .filter((result) => result.status === "fulfilled")
            .map((result) => result.value.terminate()),
        );
        throw results.find((result) => result.status === "rejected").reason;
      }
      const [layout, ro, hu] = results.map((result) => result.value);
      await layout.setParameters({ preserve_interword_spaces: "1" });
      const singleLine = { tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE };
      await Promise.all([
        ro.setParameters(singleLine),
        hu.setParameters(singleLine),
      ]);
      return { layout, ro, hu };
    })().catch((error) => {
      workersPromise = null;
      throw error;
    });
  }
  return workersPromise;
}

export async function terminateTesseract() {
  if (!workersPromise) return;
  const pending = workersPromise;
  workersPromise = null;
  const workers = await pending.catch(() => null);
  if (workers)
    await Promise.all(Object.values(workers).map((w) => w.terminate()));
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
};

// Splits a line's words at wide gaps (two columns) and at a standalone dash ("casă – ház").
export function splitSegments(words) {
  const height = median(words.map((w) => w.bbox.y1 - w.bbox.y0)) || 10;
  const segments = [];
  let current = [];
  for (const word of words) {
    const text = word.text.trim();
    if (!text) continue;
    const previous = current.at(-1);
    const gap = previous ? word.bbox.x0 - previous.bbox.x1 : 0;
    if (/^[-–—=:|]$/.test(text)) {
      if (current.length) segments.push(current);
      current = [];
      continue;
    }
    if (previous && gap > height * 1.5) {
      segments.push(current);
      current = [];
    }
    current.push(word);
  }
  if (current.length) segments.push(current);
  return segments.map((ws) => ({
    x0: Math.min(...ws.map((w) => w.bbox.x0)),
    y0: Math.min(...ws.map((w) => w.bbox.y0)),
    x1: Math.max(...ws.map((w) => w.bbox.x1)),
    y1: Math.max(...ws.map((w) => w.bbox.y1)),
    height,
  }));
}

function crop(canvas, box) {
  const padX = Math.round(box.height * 0.4);
  const padY = Math.round(box.height * 0.3);
  const x = Math.max(0, box.x0 - padX);
  const y = Math.max(0, box.y0 - padY);
  const w = Math.min(canvas.width, box.x1 + padX) - x;
  const h = Math.min(canvas.height, box.y1 + padY) - y;
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  out.getContext("2d").drawImage(canvas, x, y, w, h, 0, 0, w, h);
  return out;
}

// Confidence decides; when the two are close, the language's own letters break the tie.
// Dashes and bars at the edges of a segment are separators or page-edge noise.
const trimSegment = (text) =>
  cleanText(text).replace(/^[\s\-–—=|_~.,:;]+|[\s\-–—=|_~,:;]+$/gu, "");

export function scoreReadings(ro, hu) {
  const roText = trimSegment(ro.text);
  const huText = trimSegment(hu.text);
  let roScore = ro.confidence;
  let huScore = hu.confidence;
  if (Math.abs(roScore - huScore) < 5) {
    if (classify(roText) === "ro") roScore += 5;
    if (classify(huText) === "hu") huScore += 5;
  }
  return {
    ro: { text: roText, score: roScore },
    hu: { text: huText, score: huScore },
  };
}

const other = (lang) => (lang === "ro" ? "hu" : "ro");
const best = (s) => (s.ro.score >= s.hu.score ? "ro" : "hu");
const margin = (s, lang) => s[lang].score - s[other(lang)].score;

// Baseline slope of the page (rise per pixel), from Tesseract's line baselines.
export function estimateSlope(lines) {
  const slopes = lines
    .map((l) => l.baseline)
    .filter((b) => b && b.x1 - b.x0 > 40)
    .map((b) => (b.y1 - b.y0) / (b.x1 - b.x0))
    .sort((a, b) => a - b);
  return slopes.length ? slopes[Math.floor(slopes.length / 2)] : 0;
}

export function rotateCanvas(canvas, radians) {
  const out = document.createElement("canvas");
  out.width = canvas.width;
  out.height = canvas.height;
  const ctx = out.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.translate(out.width / 2, out.height / 2);
  ctx.rotate(radians);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  return out;
}

// Groups segments into visual rows. Tesseract may return the two columns of a vocabulary
// list as separate blocks, so its line order can't be trusted. Rows are formed along the
// page's baseline slope, so a slightly tilted photo still lines up left and right columns.
export function groupRows(segments, slope = 0) {
  const height =
    segments.map((s) => s.y1 - s.y0).sort((a, b) => a - b)[
      Math.floor(segments.length / 2)
    ] ?? 10;
  const level = (s) => (s.y0 + s.y1) / 2 - ((s.x0 + s.x1) / 2) * slope;
  const sorted = [...segments].sort((a, b) => level(a) - level(b));
  const rows = [];
  for (const segment of sorted) {
    const row = rows.at(-1);
    if (row && Math.abs(level(segment) - row.level) < height * 0.5) {
      row.items.push(segment);
      row.y0 = Math.min(row.y0, segment.y0);
      row.y1 = Math.max(row.y1, segment.y1);
    } else
      rows.push({
        level: level(segment),
        y0: segment.y0,
        y1: segment.y1,
        items: [segment],
      });
  }
  for (const row of rows) row.items.sort((a, b) => a.x0 - b.x0);
  return rows;
}

/**
 * Picks a language per segment. A bilingual page puts one Romanian and one Hungarian item
 * side by side, always in the same column order, so for two-item rows the page's own
 * confident rows decide which column is which.
 */
export function assignLanguages(rows) {
  let leftRo = 0;
  let leftHu = 0;
  for (const { items } of rows) {
    if (items.length !== 2) continue;
    const [a, b] = items.map((i) => i.scored);
    const la = best(a);
    const lb = best(b);
    if (la !== lb && margin(a, la) > 8 && margin(b, lb) > 8)
      la === "ro" ? leftRo++ : leftHu++;
  }
  const leftLang = leftRo === leftHu ? null : leftRo > leftHu ? "ro" : "hu";
  return rows.map(({ items }) => {
    const scored = items.map((i) => i.scored);
    let picks = scored.map(best);
    if (scored.length === 2) {
      const sure =
        picks[0] !== picks[1] &&
        margin(scored[0], picks[0]) > 15 &&
        margin(scored[1], picks[1]) > 15;
      if (!sure && leftLang) picks = [leftLang, other(leftLang)];
      else if (picks[0] === picks[1]) {
        const weaker =
          margin(scored[0], picks[0]) <= margin(scored[1], picks[1]) ? 0 : 1;
        picks[weaker] = other(picks[weaker]);
      }
    }
    return scored.map((s, i) => ({ text: s[picks[i]].text, lang: picks[i] }));
  });
}

/**
 * Returns { text, languages } where languages maps each recognised segment to "ro" | "hu".
 * onProgress(fraction, message) reports progress within this page.
 */
export async function ocrWithTesseract(canvas, onProgress, signal) {
  signal?.throwIfAborted();
  let aborted;
  const cancellation = new Promise((_, reject) => {
    aborted = () =>
      reject(signal.reason ?? new DOMException("Anulat", "AbortError"));
    signal?.addEventListener("abort", aborted, { once: true });
  });
  try {
    return await Promise.race([
      recognizePage(canvas, onProgress, signal),
      cancellation,
    ]);
  } finally {
    signal?.removeEventListener("abort", aborted);
  }
}

async function recognizePage(canvas, onProgress, signal) {
  onProgress?.(0, "se încarcă modelele română și maghiară…");
  const { layout, ro, hu } = await getWorkers();
  signal?.throwIfAborted();
  onProgress?.(0.03, "se caută rândurile…");
  const linesOf = async (image) => {
    const { data } = await layout.recognize(
      image,
      {},
      { text: true, blocks: true },
    );
    return (data.blocks ?? []).flatMap((b) =>
      b.paragraphs.flatMap((p) => p.lines),
    );
  };
  let lines = await linesOf(canvas);
  let slope = estimateSlope(lines);
  // Straighten photos tilted by more than ~0.4°; each crop then holds one clean line.
  if (Math.abs(slope) > 0.007) {
    onProgress?.(0.05, "se îndreaptă pagina…");
    canvas = rotateCanvas(canvas, -Math.atan(slope));
    lines = await linesOf(canvas);
    slope = estimateSlope(lines);
  }
  const segments = lines
    .flatMap((line) => splitSegments(line.words))
    .filter((box) => box.x1 - box.x0 >= 4 && box.y1 - box.y0 >= 4);
  for (const [index, segment] of segments.entries()) {
    signal?.throwIfAborted();
    const image = crop(canvas, segment);
    const [r, h] = await Promise.all([
      ro.recognize(image),
      hu.recognize(image),
    ]);
    segment.scored = scoreReadings(r.data, h.data);
    onProgress?.(
      0.05 + (0.95 * (index + 1)) / segments.length,
      `fragmentul ${index + 1} din ${segments.length}…`,
    );
  }
  // Page edges, shadows and fingers produce low-confidence fragments with no real word.
  const isWordy = (t) => /\p{L}{2,}/u.test(t);
  const kept = segments.filter(({ scored: { ro: r, hu: h } }) => {
    const top = r.score >= h.score ? r : h;
    return (
      isWordy(top.text) &&
      (top.score >= 60 || (top.score >= 40 && /\p{Ll}{2,}/u.test(top.text)))
    );
  });
  const rows = groupRows(kept, slope);
  const readings = assignLanguages(rows);
  const languages = new Map();
  const heights = rows.map((r) => r.y1 - r.y0).sort((a, b) => a - b);
  const lineHeight = heights[Math.floor(heights.length / 2)] ?? 0;
  const pitch = rows
    .slice(1)
    .map((r, i) => r.level - rows[i].level)
    .sort((a, b) => a - b);
  const usualPitch = pitch[Math.floor(pitch.length / 2)] ?? lineHeight;
  let text = "";
  readings.forEach((parts, i) => {
    const kept = parts.filter((reading) => reading.text);
    if (!kept.length) return;
    for (const reading of kept) languages.set(reading.text, reading.lang);
    // A blank line where the page has a visible vertical gap (paragraphs, headings).
    if (text)
      text +=
        rows[i].level - rows[i - 1].level > usualPitch * 1.6 ? "\n\n" : "\n";
    text += kept.map((reading) => reading.text).join(" – ");
  });
  return { text, languages };
}

// Tesseract's Romanian model sometimes returns the legacy cedilla forms; use comma-below.
// Hungarian never uses ş/ţ, so this is safe for both languages.
export function cleanText(text) {
  return String(text ?? "")
    .replace(/ş/g, "ș")
    .replace(/Ş/g, "Ș")
    .replace(/ţ/g, "ț")
    .replace(/Ţ/g, "Ț")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
