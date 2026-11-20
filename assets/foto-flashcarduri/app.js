import {
  cameraSupported,
  fileToBitmap,
  makePage,
  renderPage,
  startCamera,
  stopCamera,
  takePhoto,
  thumbnail,
} from "./capture.js";
import { ocrWithTesseract, terminateTesseract } from "./ocr.js";
import { buildRows } from "./pairing.js";
import {
  CARDS_SYSTEM_PROMPT,
  OCR_SYSTEM_PROMPT,
  createSession,
  extractCards,
  ocrWithGemini,
  promptAvailability,
} from "./ai.js";
import { cleanRows, toHtml, toMarkdown } from "./export.js";

const $ = (id) => document.getElementById(id);
const state = {
  pages: [],
  selected: null,
  rows: [],
  exported: true,
  languages: new Map(),
};
const thumbs = new Map();

function setStatus(id, message, isError = false) {
  const el = $(id);
  el.textContent = message;
  el.classList.toggle("error", isError);
}
// Romanian plural: 1 pagină, 2 pagini, 20 de pagini.
const count = (n, one, many) =>
  n === 1
    ? `1 ${one}`
    : `${n}${n % 100 >= 20 || n % 100 === 0 ? " de" : ""} ${many}`;
const describeError = (error) =>
  error?.name === "AbortError"
    ? "Operațiunea a fost anulată."
    : `Eroare: ${error?.message ?? error}`;

// ---------------- Step 1: images ----------------

async function addBitmap(bitmap) {
  const page = makePage(bitmap);
  state.pages.push(page);
  thumbs.set(page.id, await thumbnail(page));
  select(page.id);
}

function select(id) {
  state.selected =
    state.pages.find((p) => p.id === id) ?? state.pages.at(-1) ?? null;
  renderPages();
}

function renderPages() {
  const panel = $("pages-panel");
  panel.hidden = state.pages.length === 0;
  $("ocr-run").disabled = Boolean(ocrAbort) || state.pages.length === 0;
  $("pages").replaceChildren(
    ...state.pages.map((page, index) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-current", String(page === state.selected));
      button.setAttribute("aria-label", `Pagina ${index + 1}`);
      const img = document.createElement("img");
      img.src = thumbs.get(page.id);
      img.alt = "";
      const label = document.createElement("span");
      label.textContent = String(index + 1);
      button.append(img, label);
      button.addEventListener("click", () => select(page.id));
      li.append(button);
      return li;
    }),
  );
  if (state.selected) {
    renderPage(state.selected, $("preview"));
    $("enhance").checked = state.selected.enhance;
  }
}

async function refreshSelected() {
  const page = state.selected;
  if (!page) return;
  URL.revokeObjectURL(thumbs.get(page.id));
  thumbs.set(page.id, await thumbnail(page));
  renderPages();
}

$("camera-start").addEventListener("click", async () => {
  if (!cameraSupported()) {
    setStatus(
      "capture-status",
      "Browserul nu oferă acces la cameră. Încarcă o fotografie.",
      true,
    );
    return;
  }
  $("camera-start").disabled = true;
  try {
    await startCamera($("video"));
    $("video").hidden = false;
    $("camera-shot").hidden = $("camera-stop").hidden = false;
    $("camera-start").hidden = true;
    $("camera-shot").focus();
    setStatus(
      "capture-status",
      "Camera e pornită. Ține pagina dreaptă și bine luminată.",
    );
  } catch (error) {
    setStatus(
      "capture-status",
      error.name === "NotAllowedError"
        ? "Accesul la cameră a fost refuzat. Îl poți permite din setările site-ului."
        : describeError(error),
      true,
    );
  } finally {
    $("camera-start").disabled = false;
  }
});

function closeCamera() {
  stopCamera($("video"));
  $("video").hidden = true;
  $("camera-shot").hidden = $("camera-stop").hidden = true;
  $("camera-start").hidden = false;
}
$("camera-stop").addEventListener("click", () => {
  closeCamera();
  $("camera-start").focus();
  setStatus("capture-status", "Camera e oprită.");
});
$("camera-shot").addEventListener("click", async () => {
  try {
    await addBitmap(await takePhoto($("video")));
    setStatus(
      "capture-status",
      `Fotografia a fost adăugată. Total: ${count(state.pages.length, "pagină", "pagini")}.`,
    );
  } catch (error) {
    setStatus("capture-status", describeError(error), true);
  }
});

async function addFiles(files) {
  const images = [...files].filter((file) => file.type.startsWith("image/"));
  for (const file of images) {
    try {
      await addBitmap(await fileToBitmap(file));
    } catch {
      setStatus(
        "capture-status",
        `Imaginea „${file.name}” nu a putut fi citită.`,
        true,
      );
      return;
    }
  }
  if (images.length)
    setStatus(
      "capture-status",
      `${count(images.length, "imagine adăugată", "imagini adăugate")}. Total: ${count(state.pages.length, "pagină", "pagini")}.`,
    );
}
$("file-input").addEventListener("change", (event) => {
  addFiles(event.target.files);
  event.target.value = "";
});
document.addEventListener("paste", (event) => {
  if (event.target.closest?.("input, textarea")) return;
  if (event.clipboardData?.files.length) addFiles(event.clipboardData.files);
});
document.addEventListener("dragover", (event) => event.preventDefault());
document.addEventListener("drop", (event) => {
  event.preventDefault();
  if (event.dataTransfer?.files.length) addFiles(event.dataTransfer.files);
});

for (const [id, delta] of [
  ["rotate-left", 270],
  ["rotate-right", 90],
]) {
  $(id).addEventListener("click", () => {
    if (!state.selected) return;
    state.selected.rotation = (state.selected.rotation + delta) % 360;
    refreshSelected();
  });
}
$("enhance").addEventListener("change", (event) => {
  if (!state.selected) return;
  state.selected.enhance = event.target.checked;
  refreshSelected();
});
$("remove-page").addEventListener("click", () => {
  const page = state.selected;
  if (!page) return;
  const index = state.pages.indexOf(page);
  state.pages.splice(index, 1);
  URL.revokeObjectURL(thumbs.get(page.id));
  thumbs.delete(page.id);
  page.bitmap.close?.();
  select(state.pages[Math.min(index, state.pages.length - 1)]?.id);
  if (!state.pages.length) $("file-input").focus();
});

// ---------------- Step 2: OCR ----------------

let ocrAbort = null;

$("ocr-run").addEventListener("click", async () => {
  const engine = document.querySelector("input[name=engine]:checked").value;
  const progress = $("ocr-progress");
  ocrAbort = new AbortController();
  const { signal } = ocrAbort;
  $("ocr-run").disabled = true;
  for (const section of [document.querySelector("section")])
    section.inert = true;
  $("ocr-cancel").hidden = false;
  progress.hidden = false;
  progress.value = 0;
  $("ocr-text").setAttribute("aria-busy", "true");
  const texts = [];
  const languages = new Map();
  let session = null;
  try {
    if (engine === "gemini") {
      const { state: availability, options } = await promptAvailability({
        withImage: true,
      });
      if (!options)
        throw new Error("Gemini Nano nu acceptă imagini în acest browser.");
      if (availability !== "available")
        setStatus("ocr-status", "Se descarcă modelul Gemini Nano…");
      session = await createSession(
        options,
        OCR_SYSTEM_PROMPT,
        (loaded) => (progress.value = loaded),
      );
    }
    for (const [index, page] of state.pages.entries()) {
      signal.throwIfAborted();
      const label = `Pagina ${index + 1} din ${state.pages.length}`;
      setStatus("ocr-status", `${label}: se extrage textul…`);
      const canvas = renderPage(page);
      let text;
      if (engine === "gemini") {
        progress.removeAttribute("value"); // indeterminate while Nano works
        text = await ocrWithGemini(session, canvas, signal);
      } else {
        const result = await ocrWithTesseract(
          canvas,
          (fraction, message) => {
            if (signal.aborted) return;
            progress.value = (index + fraction) / state.pages.length;
            setStatus("ocr-status", `${label}: ${message}`);
          },
          signal,
        );
        text = result.text;
        result.languages.forEach((lang, segment) =>
          languages.set(segment, lang),
        );
      }
      texts.push(text.trim());
      progress.value = (index + 1) / state.pages.length;
    }
    signal.throwIfAborted();
    if (!texts.some((text) => text.trim()))
      throw new Error("Nu s-a găsit text. Încearcă o fotografie mai clară.");
    $("ocr-text").value = texts.join("\n\n");
    state.languages = languages;
    setStatus(
      "ocr-status",
      `Text extras din ${count(state.pages.length, "pagină", "pagini")}. Corectează-l, apoi generează fișele.`,
    );
    $("cards-build").disabled = false;
  } catch (error) {
    if (texts.length) $("ocr-text").value = texts.join("\n\n");
    setStatus("ocr-status", describeError(error), error?.name !== "AbortError");
  } finally {
    session?.destroy();
    ocrAbort = null;
    document.querySelector("section").inert = false;
    progress.hidden = true;
    $("ocr-text").setAttribute("aria-busy", "false");
    $("ocr-cancel").hidden = true;
    $("ocr-run").disabled = Boolean(ocrAbort) || state.pages.length === 0;
    $("ocr-run").focus();
  }
});
$("ocr-cancel").addEventListener("click", async () => {
  ocrAbort?.abort();
  // Tesseract has no abort signal; terminating the worker stops the current page.
  await terminateTesseract();
});
$("ocr-text").addEventListener("input", () => {
  $("cards-build").disabled = !$("ocr-text").value.trim();
});

// ---------------- Step 3: cards ----------------

let cardsAbort = null;

$("cards-build").addEventListener("click", async () => {
  const text = $("ocr-text").value.trim();
  if (!text) return;
  const mode = document.querySelector("input[name=pairing]:checked").value;
  const progress = $("ai-progress");
  cardsAbort = new AbortController();
  $("cards-build").disabled = true;
  $("cards-cancel").hidden = mode !== "ai";
  let session = null;
  try {
    let rows;
    if (mode === "ai") {
      const { state: availability, options } = await promptAvailability();
      if (!options)
        throw new Error(
          "Gemini Nano nu este disponibil. Alege „Reguli simple”.",
        );
      if (availability !== "available") {
        progress.hidden = false;
        setStatus("cards-status", "Se descarcă modelul Gemini Nano…");
      }
      session = await createSession(
        options,
        CARDS_SYSTEM_PROMPT,
        (loaded) => (progress.value = loaded),
      );
      progress.hidden = true;
      rows = await extractCards(session, text, {
        signal: cardsAbort.signal,
        onChunk: (i, n) =>
          setStatus(
            "cards-status",
            `Gemini Nano citește fragmentul ${i + 1} din ${n}…`,
          ),
      });
    } else {
      rows = await buildRows(text, { known: state.languages });
    }
    state.rows = rows;
    state.exported = !rows.length;
    renderTable();
    const missing = rows.filter((r) => !r.romanian || !r.hungarian).length;
    setStatus(
      "cards-status",
      `${count(rows.length, "fișă generată", "fișe generate")}${missing ? `; ${count(missing, "are", "au")} nevoie de completare (marcate cu roșu)` : ""}. Verifică-le în tabel.`,
    );
  } catch (error) {
    setStatus(
      "cards-status",
      describeError(error),
      error?.name !== "AbortError",
    );
  } finally {
    session?.destroy();
    cardsAbort = null;
    progress.hidden = true;
    $("cards-cancel").hidden = true;
    $("cards-build").disabled = !$("ocr-text").value.trim();
  }
});
$("cards-cancel").addEventListener("click", () => {
  cardsAbort?.abort();
  $("cards-build").focus();
});

const FIELDS = [
  ["group", "Temă"],
  ["romanian", "Română"],
  ["hungarian", "Maghiară"],
  ["notes", "Observații"],
];

function renderTable() {
  const body = $("cards-body");
  body.replaceChildren(
    ...state.rows.map((row, index) => {
      const tr = document.createElement("tr");
      const markEmpty = () =>
        tr.toggleAttribute("data-empty", !row.romanian || !row.hungarian);
      for (const [field, label] of FIELDS) {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        input.value = row[field];
        input.placeholder =
          field === "romanian" || field === "hungarian" ? "lipsește" : "";
        if (field === "romanian") input.lang = "ro";
        if (field === "hungarian") input.lang = "hu";
        input.setAttribute("aria-label", `${label}, fișa ${index + 1}`);
        input.addEventListener("input", () => {
          row[field] = input.value;
          state.exported = false;
          markEmpty();
          updateExportButtons();
        });
        td.append(input);
        tr.append(td);
      }
      const td = document.createElement("td");
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Șterge";
      remove.setAttribute("aria-label", `Șterge fișa ${index + 1}`);
      remove.addEventListener("click", () => {
        state.rows.splice(index, 1);
        state.exported = false;
        renderTable();
        const focusRow =
          $("cards-body").rows[Math.min(index, state.rows.length - 1)];
        (focusRow?.querySelector("input") ?? $("cards-add")).focus();
      });
      td.append(remove);
      tr.append(td);
      markEmpty();
      return tr;
    }),
  );
  $("cards-table").hidden = state.rows.length === 0;

  updateExportButtons();
}

$("cards-add").addEventListener("click", () => {
  const last = state.rows.at(-1);
  state.rows.push({
    group: last?.group ?? "",
    romanian: "",
    hungarian: "",
    notes: "",
  });
  state.exported = false;
  renderTable();
  $("cards-body").lastElementChild.querySelectorAll("input")[1].focus();
});

function updateExportButtons() {
  const usable = cleanRows(state.rows).length;
  const missing = state.rows.length - usable;
  for (const id of ["export-preview", "export-html", "export-md"])
    $(id).disabled = usable === 0;
  setStatus(
    "export-status",
    usable
      ? `Se includ ${count(usable, "fișă completă", "fișe complete")}.${missing ? ` ${missing} fișe incomplete nu se exportă.` : ""}`
      : "",
  );
}

// ---------------- Step 4: export ----------------

const slug = (text) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "fise";

function download(content, type, filename) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const title = () => $("deck-title").value.trim() || "Fișe română–maghiară";

$("export-preview").addEventListener("click", async () => {
  const preview = window.open("about:blank", "_blank");
  if (!preview) {
    setStatus(
      "export-status",
      "Permite deschiderea unei file noi sau descarcă HTML-ul.",
      true,
    );
    return;
  }
  preview.opener = null;
  try {
    const url = URL.createObjectURL(
      new Blob([await toHtml(title(), state.rows)], { type: "text/html" }),
    );
    preview.location.replace(url);
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (error) {
    preview.close();
    setStatus("export-status", describeError(error), true);
  }
});
$("export-html").addEventListener("click", async () => {
  try {
    download(
      await toHtml(title(), state.rows),
      "text/html",
      `${slug(title())}-flashcarduri.html`,
    );
    state.exported = true;
    setStatus("export-status", "Pagina HTML a fost descărcată.");
  } catch (error) {
    setStatus("export-status", describeError(error), true);
  }
});
$("export-md").addEventListener("click", () => {
  download(
    toMarkdown(title(), state.rows),
    "text/markdown",
    `${slug(title())}.md`,
  );
  state.exported = true;
  setStatus("export-status", "Fișierul Markdown a fost descărcat.");
});

addEventListener("beforeunload", (event) => {
  if (!state.exported && state.rows.length) event.preventDefault();
});

// ---------------- Built-in AI availability ----------------

const AVAILABILITY_TEXT = {
  missing:
    "Indisponibil în acest browser (necesită un Chrome desktop compatibil).",
  unavailable: "Indisponibil pe acest dispozitiv.",
  downloadable:
    "Disponibil; modelul (câțiva GB) se descarcă la prima folosire.",
  downloading: "Modelul se descarcă…",
  available: "Disponibil.",
};

async function checkAi() {
  const [image, text] = await Promise.all([
    promptAvailability({ withImage: true }),
    promptAvailability(),
  ]);
  setStatus("gemini-ocr-status", AVAILABILITY_TEXT[image.state]);
  setStatus("ai-status", AVAILABILITY_TEXT[text.state]);
  const noImage = image.state === "missing" || image.state === "unavailable";
  const noText = text.state === "missing" || text.state === "unavailable";
  $("engine-gemini").disabled = noImage;
  $("pairing-ai").disabled = noText;
  // Keep rules as default; AI is an explicit experimental choice.
}
checkAi();

addEventListener("pagehide", () => {
  closeCamera();
  terminateTesseract();
  for (const url of thumbs.values()) URL.revokeObjectURL(url);
});
