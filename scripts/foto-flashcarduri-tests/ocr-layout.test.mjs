import { test } from "node:test";
import assert from "node:assert/strict";
import {
  assignLanguages,
  estimateSlope,
  groupRows,
  splitSegments,
} from "../../assets/foto-flashcarduri/ocr.js";

const word = (text, x0, y0, x1, y1) => ({ text, bbox: { x0, y0, x1, y1 } });
const seg = (x0, y0, x1, y1, ro, hu) => ({
  x0,
  y0,
  x1,
  y1,
  scored: { ro, hu },
});

test("splitSegments cuts at wide gaps and standalone dashes", () => {
  const line = [
    word("număr", 0, 0, 60, 20),
    word("de", 70, 0, 90, 20),
    word("telefon", 100, 0, 170, 20),
    word("telefonszám", 400, 0, 520, 20),
  ];
  assert.equal(splitSegments(line).length, 2);
  const dashed = [
    word("casă", 0, 0, 50, 20),
    word("–", 60, 0, 70, 20),
    word("ház", 80, 0, 120, 20),
  ];
  assert.deepEqual(
    splitSegments(dashed).map((s) => [s.x0, s.x1]),
    [
      [0, 50],
      [80, 120],
    ],
  );
});

test("estimateSlope reads the tilt from baselines", () => {
  const lines = [0, 1, 2].map((i) => ({
    baseline: { x0: 0, y0: 100 + i * 30, x1: 500, y1: 115 + i * 30 },
  }));
  assert.equal(estimateSlope(lines), 15 / 500);
});

test("groupRows pairs columns of a tilted page along the slope", () => {
  // Right column drifts 15px lower over 500px, half a row.
  const slope = 15 / 500;
  const segments = [0, 1, 2].flatMap((i) => [
    { x0: 0, y0: 100 + i * 30, x1: 80, y1: 120 + i * 30, id: `L${i}` },
    { x0: 450, y0: 113 + i * 30, x1: 520, y1: 133 + i * 30, id: `R${i}` },
  ]);
  const rows = groupRows(segments, slope);
  assert.deepEqual(
    rows.map((r) => r.items.map((s) => s.id)),
    [
      ["L0", "R0"],
      ["L1", "R1"],
      ["L2", "R2"],
    ],
  );
  assert.equal(groupRows(segments, 0).length > 3, true); // without the slope they don't line up
});

test("assignLanguages uses the page's column order for unsure rows", () => {
  const sure = (roText, huText) => [
    seg(0, 0, 50, 20, { text: roText, score: 90 }, { text: "x", score: 50 }),
    seg(300, 0, 350, 20, { text: "y", score: 50 }, { text: huText, score: 90 }),
  ];
  const unsure = [
    seg(0, 0, 50, 20, { text: "baie", score: 80 }, { text: "baie", score: 81 }),
    seg(
      300,
      0,
      350,
      20,
      { text: "fal", score: 79 },
      { text: "fal", score: 80 },
    ),
  ];
  const rows = [
    { items: sure("casă", "ház") },
    { items: sure("ușă", "ajtó") },
    { items: unsure },
  ];
  const out = assignLanguages(rows);
  assert.deepEqual(
    out[2].map((r) => r.lang),
    ["ro", "hu"],
  );
  assert.deepEqual(
    out[0].map((r) => r.text),
    ["casă", "ház"],
  );
});
