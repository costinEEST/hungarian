import { getDeck, loadLesson } from "./decks.js";
import { renderGuide, slugify } from "./lesson-markdown.js";

const $ = (id) => document.getElementById(id);
const sourceView = $("source-view");
const readingView = $("text-maghiar");
const toggle = document.querySelector(".mode-toggle");
const status = $("status");
const help = $("read-aloud-help");
const helpButton = document.querySelector(".read-help");
const nav = document.querySelector(".study-nav");

function positionReadHelp() {
  const rect = document.querySelector(".reading-tools").getBoundingClientRect();
  help.style.setProperty("--help-top", `${rect.bottom + 8}px`);
  help.style.setProperty(
    "--help-right",
    `${Math.max(12, innerWidth - rect.right)}px`,
  );
}
helpButton.addEventListener("click", positionReadHelp);
addEventListener("resize", () => {
  if (help.matches(":popover-open")) positionReadHelp();
});
// Keep anchors clear of the sticky navigation at larger text sizes too.
new ResizeObserver(() => {
  document.documentElement.style.setProperty(
    "--lesson-nav-height",
    `${nav.getBoundingClientRect().height}px`,
  );
}).observe(nav);

toggle.addEventListener("click", () => {
  const enabled = !document.body.classList.contains("hu-only");
  help.hidePopover();
  getSelection()?.removeAllRanges();
  document.body.classList.toggle("hu-only", enabled);
  sourceView.hidden = enabled;
  readingView.hidden = !enabled;
  toggle.setAttribute("aria-pressed", String(enabled));
  toggle.textContent = enabled ? "Teljes nézet" : "Doar maghiară";
  toggle.lang = enabled ? "hu" : "ro";
  if (enabled) readingView.scrollIntoView({ block: "start" });
});

function render({ rows, guideMarkdown }, deck) {
  renderGuide($("guide-content"), guideMarkdown);
  const groups = new Map();
  for (const row of rows) {
    if (!groups.has(row.group)) groups.set(row.group, []);
    groups.get(row.group).push(row);
  }
  const links = document.createDocumentFragment();
  const sections = document.createDocumentFragment();
  groups.forEach((entries, group) => {
    const id = `${deck.groupPrefix}-${slugify(group)}`;
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = `#${id}`;
    link.textContent = group;
    item.append(link);
    links.append(item);
    const section = document.createElement("section");
    section.className = "lesson-group";
    section.id = id;
    section.setAttribute("aria-labelledby", `${id}-title`);
    const heading = document.createElement("div");
    heading.className = "section-head";
    const title = document.createElement("h2");
    title.id = `${id}-title`;
    title.textContent = group;
    const count = document.createElement("span");
    count.className = "count";
    count.textContent = deck.groupCount(entries.length);
    heading.append(title, count);
    const wrap = document.createElement("div");
    wrap.className = `table-wrap ${deck.tableClass}`;
    // Wide city tables scroll on desktop; stacked mobile tables need no extra tab stop.
    if (deck.scrollTable) {
      const media = matchMedia("(max-width: 680px)");
      const configureScroll = () => {
        if (media.matches) {
          wrap.removeAttribute("tabindex");
          wrap.removeAttribute("role");
          wrap.removeAttribute("aria-labelledby");
        } else {
          wrap.tabIndex = 0;
          wrap.role = "region";
          wrap.setAttribute("aria-labelledby", `${id}-title`);
        }
      };
      configureScroll();
      media.addEventListener("change", configureScroll);
    }
    const table = document.createElement("table");
    const caption = document.createElement("caption");
    caption.textContent = deck.caption(group);
    const thead = document.createElement("thead");
    const header = document.createElement("tr");
    for (const { label } of deck.columns) {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = label;
      header.append(th);
    }
    thead.append(header);
    const tbody = document.createElement("tbody");
    for (const entry of entries) {
      const row = document.createElement("tr");
      deck.columns.forEach(({ key, lang }, index) => {
        const cell = document.createElement(index === 0 ? "th" : "td");
        if (index === 0) cell.scope = "row";
        cell.lang = lang;
        cell.textContent = entry[key] === "—" ? "" : entry[key];
        row.append(cell);
      });
      tbody.append(row);
    }
    table.append(caption, thead, tbody);
    wrap.append(table);
    section.append(heading, wrap);
    sections.append(section);
  });
  $("group-links").replaceChildren(links);
  $("lesson-groups").replaceChildren(sections);
  readingView.querySelector(".reading-text").replaceChildren(
    ...rows.map((entry) => {
      const line = document.createElement("p");
      line.className = "reading-line";
      line.textContent = deck.reading(entry);
      return line;
    }),
  );
  status.hidden = true;
  sourceView.hidden = false;
  toggle.disabled = false;
}

try {
  const deck = getDeck(document.body.dataset.deck);
  render(await loadLesson(deck), deck);
} catch {
  status.hidden = false;
  status.textContent =
    "Conținutul nu a putut fi încărcat. Reîncarcă pagina pentru a încerca din nou.";
}
