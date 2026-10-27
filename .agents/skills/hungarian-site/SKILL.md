---
name: hungarian-site
description: Maintain the Hungarian learning website's lesson pages, Markdown vocabulary sources, navigation, responsive layouts, Hungarian-only reading mode, accessibility, generated content, and index metadata. Use for vocabulary review or structural and behavioral changes to the site's Markdown, HTML, CSS, or JavaScript; use hungarian-audio as well when pronunciation recordings or playback are involved.
---

# Hungarian lesson-site maintenance

Run commands from the repository root. Preserve the established visual system
and Romanian-to-Hungarian learning flow unless the user requests a redesign.

## Preserve shared page behavior

- Keep the visible `← Toate resursele` link at the start of every lesson-page
  header with `href="./"`. A footer link may remain as secondary navigation;
  do not put the home link in the sticky section bar.
- Use the sticky section bar as the only section-navigation control. Keep its
  links on one horizontally scrollable row, prevent pills from shrinking or
  wrapping, and keep anchor offsets large enough to clear the bar.
- On small screens, stack table cells vertically and center each row. Remove
  scroll-container behavior from the stacked table, but let unusually long
  values wrap or scroll locally instead of widening the page.
- Respect reduced-motion preferences. Retain visible keyboard focus and touch
  targets appropriate for coarse pointers.

## Build a reliable Hungarian-only mode

- Build the mode as one dedicated, continuous `lang="hu"` reading surface
  containing ordinary text blocks. Hide source tables or lesson cards as whole
  units; do not simulate the mode by hiding individual cells, headers, or
  captions.
- Visually hidden Romanian captions remain part of cross-table selections and
  can make browser Read Aloud switch language or stop. Verify the selected text
  contains only Hungarian and does not cross table semantics.
- Keep the toggle's visible label and `aria-pressed` synchronized, give it
  `aria-controls`, clear stale text selections when switching modes, and expose
  only the active view to the accessibility tree.
- Test a whole-page selection, not only the main content. Global skip links,
  status text, navigation (including visually hidden headings), headers, and
  footers outside the main view can still leak Romanian into browser Read
  Aloud; hide them in Hungarian-only mode. If the visible toggle remains, use a
  Hungarian active-state label and `lang="hu"`.
- Build the reading surface from the maintained source data rather than
  duplicating lesson entries. For asynchronous content, keep the toggle
  disabled until parsing succeeds and preserve a visible error state on
  failure.
- When a page has mapped pronunciation audio, preserve its compact speaker
  controls and live status region. Use the `hungarian-audio` skill for changes
  to recordings, providers, audio mappings, or playback behavior.

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

## Validate changes

- For each new vocabulary Markdown source, retain evidence of the duplicate
  scan and Romanian-meaning review in the task report.
- For JSON-backed flashcards, run
  `node scripts/validate-flashcards.mjs <deck.json>`.
  Review every reported duplicate rather than deleting it automatically.
- Parse executable inline scripts with
  `node scripts/check-inline-scripts.mjs <page.html>`
  and run `git diff --check`.
- Exercise both toggle states in a browser. Check the phrase count, selected
  text, computed language, accessibility tree, console, and async failure path
  when applicable.
- Run a Lighthouse snapshot for accessibility and best-practices changes.
- Format-check this skill with:

```bash
npx --yes prettier --check .agents/skills/hungarian-site/SKILL.md
```

## Reuse source-extraction tools

- To inspect a PDF without retaining a local copy, run
  `scripts/extract-pdf-text.sh <path-or-URL> [page-number|all]`.
  The helper downloads into a unique temporary directory, installs `pypdf`
  there only when needed, emits extracted text to stdout, and cleans its PDF,
  dependency directory, bytecode, and pip cache on exit.
- Redirect the helper's stdout only when the extracted text is a maintained
  project artifact. Otherwise inspect it directly and let the helper clean up.
- Preview fetch-backed pages from the repository root with
  `python3 -m http.server <port> --bind 127.0.0.1`; stop the server after browser
  checks finish.

## Clean up task artifacts

- Put downloads, extracted text, generated script fragments, test reports, and
  one-off dependencies in a task-specific `mktemp` directory, never beside
  maintained sources.
- Register cleanup with a shell `trap` as soon as the temporary directory is
  created. Delete only the explicit task directory; never use an unresolved
  variable, broad glob, repository root, home directory, or shared `/tmp` as a
  removal target.
- Prefer helpers that stream results or parse in memory. The validation scripts
  above create no temporary files.
- Keep task-specific environment variables scoped to a single command or
  subprocess. Unset any variable exported into the interactive shell before
  handoff, stop local servers, and remove all task-owned temporary artifacts.
- Before finishing, inspect `git status` and the task's known temporary paths so
  generated files cannot be mistaken for maintained project sources.

Do not commit unless the user requests it.
