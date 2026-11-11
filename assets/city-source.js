export const parseSource = (markdown) => {
  const lines = markdown.split(/\r?\n/);
  const tableStart = lines.findIndex((line) =>
    /^\|\s*Județ\s*\|\s*Oraș \(română\)\s*\|\s*(?:Denumire|Nume) maghiară?\s*\|/.test(
      line,
    ),
  );
  if (
    tableStart < 0 ||
    !/^\|(?:\s*:?-+:?\s*\|)+$/.test(lines[tableStart + 1] || "")
  )
    throw new Error("Tabelul principal lipsește");
  let tableEnd = tableStart + 2;
  while (tableEnd < lines.length && lines[tableEnd].startsWith("|"))
    tableEnd += 1;
  const rows = lines
    .slice(tableStart + 2, tableEnd)
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim()),
    )
    .map((cells) => {
      if (cells.length !== 7 || cells.some((value) => !value))
        throw new Error("Rând de oraș invalid");
      return cells;
    })
    .map(([county, romanian, hungarian, where, toward, from, notes]) => ({
      county,
      romanian,
      hungarian,
      where,
      toward,
      from,
      notes,
    }));
  if (!rows.length) throw new Error("Lista de orașe este goală");
  const guideMarkdown = [
    ...lines.slice(0, tableStart),
    ...lines.slice(tableEnd),
  ].join("\n");
  return { rows, guideMarkdown };
};
