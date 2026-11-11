export const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
const appendInline = (parent, text) => {
  const pattern =
    /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let start = 0;
  let match;
  while ((match = pattern.exec(text))) {
    parent.append(document.createTextNode(text.slice(start, match.index)));
    if (match[2] && /^(https?:|\.\.?\/|#)/i.test(match[3])) {
      const anchor = document.createElement("a");
      anchor.href = match[3];
      appendInline(anchor, match[2]);
      if (/^https?:/.test(match[3])) {
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
      }
      parent.append(anchor);
    } else if (match[2]) {
      parent.append(document.createTextNode(match[2]));
    } else if (match[4]) {
      const strong = document.createElement("strong");
      strong.textContent = match[4];
      parent.append(strong);
    } else if (match[5]) {
      const emphasis = document.createElement("em");
      emphasis.textContent = match[5];
      parent.append(emphasis);
    } else {
      const code = document.createElement("code");
      code.textContent = match[6];
      parent.append(code);
    }
    start = pattern.lastIndex;
  }
  parent.append(document.createTextNode(text.slice(start)));
};
export const renderGuide = (guide, markdown) => {
  const lines = markdown.replace(/\r?\n[ \t]+(?=\S)/g, " ").split(/\r?\n/);
  let index = 0;
  let list = null;
  let currentHeading = "Explicații";
  const tableCells = (line) =>
    line
      .split("|")
      .slice(1, -1)
      .map((value) => value.trim());
  const isTableDivider = (line) => /^\|(?:\s*:?-+:?\s*\|)+$/.test(line);
  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim() || line.startsWith("# ")) {
      index += 1;
      continue;
    }
    const heading = line.match(/^(##|###)\s+(.+)/);
    if (heading) {
      const element = document.createElement(heading[1] === "##" ? "h2" : "h3");
      element.id = `ghid-${slugify(heading[2])}`;
      element.textContent = heading[2];
      guide.append(element);
      currentHeading = heading[2];
      list = null;
      index += 1;
      continue;
    }
    if (line.startsWith("|") && isTableDivider(lines[index + 1] || "")) {
      const headers = tableCells(line);
      const wrap = document.createElement("div");
      wrap.className = "guide-table-wrap";
      wrap.tabIndex = 0;
      wrap.role = "region";
      wrap.setAttribute("aria-label", `Tabel explicativ: ${currentHeading}`);
      const table = document.createElement("table");
      const caption = document.createElement("caption");
      caption.textContent = `Tabel explicativ pentru ${currentHeading}`;
      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");
      headers.forEach((value) => {
        const cell = document.createElement("th");
        cell.scope = "col";
        appendInline(cell, value);
        headRow.append(cell);
      });
      thead.append(headRow);
      const tbody = document.createElement("tbody");
      index += 2;
      while (index < lines.length && lines[index].startsWith("|")) {
        const row = document.createElement("tr");
        tableCells(lines[index]).forEach((value, cellIndex) => {
          const cell = document.createElement(cellIndex === 0 ? "th" : "td");
          if (cellIndex === 0) cell.scope = "row";
          appendInline(cell, value);
          row.append(cell);
        });
        tbody.append(row);
        index += 1;
      }
      table.append(caption, thead, tbody);
      wrap.append(table);
      guide.append(wrap);
      list = null;
      continue;
    }
    const item = line.match(/^[-]\s+(.+)/);
    const numbered = line.match(/^(\d+)\.\s+(.+)/);
    if (item || numbered) {
      const type = numbered ? "OL" : "UL";
      if (!list || list.tagName !== type) {
        list = document.createElement(type.toLowerCase());
        if (numbered && numbered[1] !== "1") list.start = Number(numbered[1]);
        guide.append(list);
      }
      const element = document.createElement("li");
      appendInline(element, item ? item[1] : numbered[2]);
      list.append(element);
      index += 1;
      continue;
    }
    const paragraphLines = [line];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,3}\s|[-]\s|\d+\.\s|\|)/.test(lines[index])
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    const paragraph = document.createElement("p");
    appendInline(paragraph, paragraphLines.join(" "));
    guide.append(paragraph);
    list = null;
  }
};
