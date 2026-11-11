// The maintained sources use plain-text pipe tables (no escaped pipes).
export function parseTableSource(markdown, { header, fields, omitHeading }) {
  const lines = markdown.split(/\r?\n/);
  const cells = (line) =>
    line
      .trim()
      .split("|")
      .slice(1, -1)
      .map((value) => value.trim());
  const start = lines.findIndex((line) => header.test(line));
  const divider = start >= 0 ? cells(lines[start + 1] || "") : [];
  if (
    start < 0 ||
    divider.length !== fields.length ||
    divider.some((value) => !/^:?-+:?$/.test(value))
  ) {
    throw new Error("Tabelul principal lipsește sau este invalid");
  }
  let end = start + 2;
  const rows = [];
  while (end < lines.length && lines[end].trim().startsWith("|")) {
    const values = cells(lines[end]);
    if (
      !lines[end].trim().endsWith("|") ||
      values.length !== fields.length ||
      values.some((value) => !value)
    ) {
      throw new Error(`Rând invalid: ${end + 1}`);
    }
    rows.push(
      Object.fromEntries(fields.map((field, index) => [field, values[index]])),
    );
    end++;
  }
  if (!rows.length) throw new Error("Tabelul principal este gol");
  const guide = [...lines.slice(0, start), ...lines.slice(end)];
  return {
    rows,
    guideMarkdown: guide
      .filter((line) => !omitHeading || !omitHeading.test(line))
      .join("\n"),
  };
}
