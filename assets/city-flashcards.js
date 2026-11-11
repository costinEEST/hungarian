import { parseSource } from "./city-source.js";
import { rankVoices } from "./flashcard-voices.js";

const $ = (id) => document.getElementById(id);
const synth = globalThis.speechSynthesis;
const supported = Boolean(synth && globalThis.SpeechSynthesisUtterance);
const locales = { ro: "ro-RO", hu: "hu-HU" };
let rows = [],
  order = [],
  visible = [],
  voices = { ro: [], hu: [] };
let queue = [],
  cursor = 0,
  generation = 0,
  timer,
  utterance,
  active = false,
  paused = false;
const nodes = new Map();
const normalize = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const drawer = $("settings-drawer");
const settingsButton = $("settings-open");
let resultAnnouncement;

settingsButton.addEventListener("click", () => {
  if (active && !paused) $("pause").click();
  drawer.showModal();
  settingsButton.setAttribute("aria-expanded", "true");
});
drawer.addEventListener("close", () =>
  settingsButton.setAttribute("aria-expanded", "false"),
);
// Safari fallback: dismiss only when both ends of a pointer gesture are outside.
if (!("closedBy" in HTMLDialogElement.prototype)) {
  const outside = (event) => {
    const rect = drawer.getBoundingClientRect();
    return (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    );
  };
  let pressedOutside = false;
  drawer.addEventListener("pointerdown", (event) => {
    pressedOutside = outside(event);
  });
  drawer.addEventListener("pointerup", (event) => {
    if (pressedOutside && outside(event)) drawer.close();
    pressedOutside = false;
  });
  drawer.addEventListener("pointercancel", () => {
    pressedOutside = false;
  });
}
// The bar can wrap with zoom, translations, or a long city name.
// Keep browser focus scrolling clear of its actual height instead of assuming one row.
const playerObserver = new ResizeObserver(([entry]) => {
  document.documentElement.style.setProperty(
    "--player-height",
    `${entry.target.getBoundingClientRect().height}px`,
  );
});
playerObserver.observe(document.querySelector(".player"));

function clearHighlight() {
  for (const node of nodes.values()) {
    node.removeAttribute("data-active");
    node.querySelector(".speaking").textContent = "";
    const button = node.querySelector(".pair-play");
    button.textContent = "Ascultă perechea";
    button.setAttribute(
      "aria-label",
      `Ascultă perechea: ${node.querySelector("[lang=ro]").textContent}`,
    );
  }
}
function controls() {
  $("pause").textContent = paused ? "Continuă" : "Pauză";
  $("pause").setAttribute("aria-disabled", String(!active));
  $("stop").setAttribute("aria-disabled", String(!active));
}
function stop(message = "Redarea a fost oprită.") {
  generation++;
  clearTimeout(timer);
  utterance = null;
  active = paused = false;
  synth?.cancel();
  clearHighlight();
  controls();
  $("progress").textContent = message;
}
function updateAvailability() {
  document.querySelectorAll("[data-play]").forEach((button) => {
    const code = button.dataset.play;
    button.disabled =
      code === "pair"
        ? !voices.ro.length || !voices.hu.length
        : !voices[code].length;
  });
  $("play-all").disabled =
    !visible.length || !voices.ro.length || !voices.hu.length;
}
function loadVoices() {
  const available = supported ? synth.getVoices() : [];
  for (const code of ["ro", "hu"]) {
    const select = $(`voice-${code}`),
      previous = select.value;
    voices[code] = rankVoices(available, code).map(({ voice }) => voice);
    select.replaceChildren(
      ...voices[code].map((voice) => new Option(voice.name, voice.voiceURI)),
    );
    if (voices[code].some((voice) => voice.voiceURI === previous))
      select.value = previous;
    if (!voices[code].length)
      select.add(new Option("Nicio voce disponibilă", ""));
    select.disabled = !voices[code].length;
  }
  const missing = ["ro", "hu"]
    .filter((code) => !voices[code].length)
    .map((code) => (code === "ro" ? "română" : "maghiară"));
  $("voice-status").textContent = !supported
    ? "Browserul nu oferă redare vocală. Poți citi toate fișele."
    : missing.length
      ? `Nu există voce pentru ${missing.join(" și ")}. Instalează o voce pentru limba respectivă în setările dispozitivului; apoi reîncarcă pagina.`
      : "Vocile pentru ambele limbi sunt disponibile.";
  $("voice-warning").hidden = supported && !missing.length;
  updateAvailability();
}
function next(token) {
  if (token !== generation || !active || paused) return;
  if (cursor >= queue.length) {
    stop("Ai ascultat toate fișele selectate.");
    $("notice").textContent = "Redarea s-a încheiat.";
    return;
  }
  const item = queue[cursor],
    node = nodes.get(item.row);
  clearHighlight();
  node.setAttribute("data-active", "");
  const pairButton = node.querySelector(".pair-play");
  pairButton.textContent = "Oprește";
  pairButton.setAttribute("aria-label", `Oprește: ${item.row.romanian}`);
  node.querySelector(".speaking").textContent =
    item.code === "ro" ? "Se citește în română" : "Se citește în maghiară";
  $("progress").textContent =
    `Fișa ${item.position} din ${item.total}: ${item.row.romanian} — ${item.code === "ro" ? "română" : "maghiară"}.`;
  const voice = voices[item.code].find(
    (voice) => voice.voiceURI === $(`voice-${item.code}`).value,
  );
  if (!voice) {
    stop("Vocea nu mai este disponibilă. Alege altă voce.");
    return;
  }
  // Keep a strong reference and reject events from cancelled playback (hear-and-read pattern).
  utterance = new SpeechSynthesisUtterance(
    item.code === "ro" ? item.row.romanian : item.row.hungarian,
  );
  utterance.lang = locales[item.code];
  utterance.voice = voice;
  utterance.rate = Number($("rate").value);
  utterance.onend = () => {
    if (token !== generation) return;
    utterance = null;
    cursor++;
    if (!paused)
      timer = setTimeout(() => next(token), item.code === "ro" ? 500 : 1200);
  };
  utterance.onerror = () => {
    if (token !== generation) return;
    stop("Redarea nu a reușit. Încearcă din nou sau alege altă voce.");
    $("notice").textContent =
      "Redarea nu a reușit. Încearcă din nou sau alege altă voce.";
  };
  try {
    synth.resume();
    synth.speak(utterance);
  } catch {
    stop("Redarea nu a putut începe.");
    $("notice").textContent = "Redarea nu a putut începe.";
  }
}
function play(selection, codes) {
  if (!supported || codes.some((code) => !voices[code].length)) return;
  stop("");
  $("notice").textContent = "";
  queue = selection.flatMap((row, index) =>
    codes.map((code) => ({
      row,
      code,
      position: index + 1,
      total: selection.length,
    })),
  );
  cursor = 0;
  active = true;
  controls();
  next(generation);
}
function makeCard(row) {
  const li = document.createElement("li");
  const county = document.createElement("p");
  county.className = "county";
  county.textContent = row.county;
  const pair = document.createElement("p");
  pair.className = "pair";
  for (const [code, text] of [
    ["ro", row.romanian],
    ["hu", row.hungarian],
  ]) {
    const span = document.createElement("span");
    span.lang = code;
    span.textContent = text;
    pair.append(span);
  }
  const speaking = document.createElement("span");
  speaking.className = "speaking";
  li.append(county, pair, speaking);
  for (const [code, label] of [
    ["pair", "Ascultă perechea"],
    ["ro", "Română"],
    ["hu", "Maghiară"],
  ]) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.play = code;
    button.textContent = label;
    button.setAttribute("aria-label", `${label}: ${row.romanian}`);
    button.addEventListener("click", () => {
      if (code === "pair" && active && queue[cursor]?.row === row) stop();
      else play([row], code === "pair" ? ["ro", "hu"] : [code]);
    });
    if (code === "pair") {
      button.className = "pair-play";
      li.append(button);
    } else {
      if (code === "ro") {
        const actions = document.createElement("div");
        actions.className = "actions";
        li.append(actions);
      }
      li.lastElementChild.append(button);
    }
  }
  return li;
}
function render() {
  stop("Alege o fișă pentru a asculta.");
  const query = normalize($("search").value.trim());
  visible = order.filter(
    (row) =>
      (!$("county").value || row.county === $("county").value) &&
      normalize(`${row.romanian} ${row.hungarian}`).includes(query),
  );
  $("cards").replaceChildren(...visible.map((row) => nodes.get(row)));
  $("count").textContent = `${visible.length} de fișe`;
  clearTimeout(resultAnnouncement);
  resultAnnouncement = setTimeout(() => {
    $("settings-results").textContent =
      `${visible.length} de fișe în selecție.`;
  }, 250);
  $("empty").hidden = visible.length > 0;
  updateAvailability();
}
$("play-all").addEventListener("click", () => play(visible, ["ro", "hu"]));
$("stop").addEventListener("click", () => {
  if (active) stop();
});
$("pause").addEventListener("click", () => {
  if (!active) return;
  // Resume at the beginning of the current short word, avoiding unreliable native pause on mobile.
  if (!paused) {
    generation++;
    clearTimeout(timer);
    synth.cancel();
    utterance = null;
    paused = true;
    $("progress").textContent += " În pauză.";
  } else {
    paused = false;
    next(generation);
  }
  controls();
});
$("county").addEventListener("change", render);
$("search").addEventListener("input", render);
$("shuffle").addEventListener("click", () => {
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  render();
  $("notice").textContent = "Fișele au fost amestecate.";
});
$("reset").addEventListener("click", () => {
  order = [...rows];
  render();
  $("notice").textContent = "Ordinea inițială a fost restabilită.";
});
for (const id of ["voice-ro", "voice-hu", "rate"])
  $(id).addEventListener("change", () => {
    if (active) stop();
  });
addEventListener("pagehide", () => stop());
synth?.addEventListener("voiceschanged", loadVoices);
loadVoices();
fetch("./orase-romanesti-cu-nume-maghiare.md")
  .then((response) => {
    if (!response.ok) throw new Error("Sursa nu a putut fi încărcată");
    return response.text();
  })
  .then((markdown) => {
    rows = parseSource(markdown).rows;
    order = [...rows];
    for (const county of new Set(rows.map((row) => row.county)))
      $("county").add(new Option(county, county));
    rows.forEach((row) => nodes.set(row, makeCard(row)));
    render();
    $("exercise").hidden = false;
    $("load-status").textContent = `${rows.length} de fișe încărcate.`;
  })
  .catch(() => {
    $("load-status").textContent =
      "Fișele nu au putut fi încărcate. Reîncarcă pagina pentru a încerca din nou.";
  });
