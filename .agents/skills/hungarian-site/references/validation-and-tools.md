## Validate changed behavior

- For each new vocabulary Markdown source, retain evidence of the duplicate
  scan and Romanian-meaning review in the task report.
- For flashcard content or shared player/parser changes, validate every affected
  source entry, section total, and language pair.
  Review every duplicate rather than deleting it automatically; verify
  all three Markdown-backed decks (cities, chapter-2, practical) for shared
  player/parser changes; for deck-only edits, exercise that deck. Run `node scripts/validate-flashcards.mjs` for counts and duplicate reports, and
  `node --test scripts/test-decks.mjs` for source and parser regression checks.
- Parse executable inline scripts with
  `node scripts/check-inline-scripts.mjs <page.html>`
  and run `git diff --check`.
- For reading-mode changes, exercise both toggle states in a browser. Check the phrase count, selected
  text, computed language, accessibility tree, console, and async failure path
  when applicable.
- Run a Lighthouse snapshot for accessibility and best-practices changes.
- Format-check this skill with:

```bash
npx --yes prettier@3.6.2 --check ".agents/skills/hungarian-site/**/*.md"
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

## Examples

- For play-all scrolling changes, check first, middle, and final cards on desktop
  and mobile. The space below the player must equal the grid row gap; the second
  language of the same card must not scroll again. Include reduced motion.
- For practical-vocabulary additions, edit the maintained Markdown table,
  validate every section with `parseDeckSource()`, and recompute totals;
  do not paste entries into the flashcard HTML.

## Limitations

Dictionary verification remains pending until an approved dictionary is recorded.
Voice availability depends on the browser and installed system voices; static
checks cannot prove speech playback or browser Read Aloud behavior. SEO checks
verify local consistency, not indexing or cached sharing previews.

## Troubleshooting

- If voices are missing, inspect `voice-status` and installed Romanian and
  Hungarian voices; keep cards readable and never substitute another language.
- If Markdown fetching fails, serve the repo over local HTTP and inspect the
  request and parser error before changing data or duplicating it in HTML.
- If browser MCP is busy, try an isolated session and report any remaining
  verification gap; do not close someone else's browser.
