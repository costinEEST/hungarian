## Preserve repository data relationships

- `cuvinte-maghiare-cu-mai-multe-sensuri.md` is the maintained source for its
  HTML viewer. Keep its parser, displayed total, alphabetical groups, reading
  view, and error state synchronized; do not duplicate its vocabulary rows in
  HTML.
- `orase-romanesti-cu-nume-maghiare.md` is the single maintained source for its
  HTML viewer. Keep its narrative, explanatory tables, 143-row city table,
  county groups, and Hungarian reading view synchronized; do not restore a
  separate guide source or duplicate those sections in HTML.
- When adding or removing a lesson page, update its `index.html` card and
  section count plus the JSON-LD `numberOfItems`, positions, names, and
  canonical URLs.
- Keep `Constantin Câmpean` as the author in HTML metadata and structured data.

## Reuse the shared lesson and deck modules

- Both city and chapter lessons load `assets/lesson.css` and `assets/lesson.js`.
  Reuse `assets/lesson-markdown.js` for explanatory Markdown and the shared
  Hungarian-only reading controls; do not copy inline renderers or styles.
- Every shared Markdown-backed lesson and flashcard page selects an explicit
  `data-deck` identifier.
  `assets/decks.js` defines its Markdown URL, table schema, lesson columns,
  grouping, and Hungarian reading text. Add content-specific differences there.
- `assets/markdown-source.js` validates the maintained plain-text pipe tables.
  All three decks expose `group`, `romanian`, `hungarian`, and `notes`; city rows
  also expose locative forms. Reject malformed or empty tables consistently.
  Derive runtime counts from parsed entries. Keep expected totals in validation
  checks rather than rejecting valid source edits with runtime fixed counts.

## Review new vocabulary sources

Before publishing or generating a page from a newly added Markdown vocabulary
or phrase source:

- Parse every maintained entry and report the exact entry and section totals.
- Check for exact duplicates and likely duplicates after normalizing case,
  surrounding whitespace, punctuation, and Unicode composition. Review matches
  across sections as well as within one table. Do not remove repeated Hungarian
  forms automatically when they intentionally teach different meanings or
  contexts; identify them and explain why they are retained.
- Review every Hungarian-to-Romanian meaning for correctness, natural Romanian,
  and alignment with the specific Hungarian form or phrase. Also flag misleading
  omissions, ambiguous translations presented as universal, and obvious
  spelling or grammatical errors. Pronunciation review is separate unless the
  task includes it.
- Say clearly what is wrong before or while correcting it. Distinguish definite
  errors from context-dependent or stylistic suggestions, and summarize every
  source correction in the handoff.
- Recompute visible totals and metadata after corrections rather than trusting
  approximate counts in a heading.

Use dictionaries approved for this repository when verifying meanings. Record
newly approved dictionaries in the list below with their role or limitations;
do not silently treat an unapproved source as the repository standard. If no
approved dictionary covers an entry, still perform the linguistic review and
state that dictionary verification remains pending rather than claiming it was
completed.

Approved dictionaries: none recorded yet.
