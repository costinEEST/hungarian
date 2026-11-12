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
- Present each Hungarian-only toggle and its icon-only help button as two
  adjoining segments in one outlined capsule. Put the toggle first, separate
  the help segment with a vertical border, and wrap both in a group named
  `Mod de citire` so their relationship is visually and semantically clear.
  Preserve a solid, high-contrast background and contrasting text on the
  toggle segment while `aria-pressed="true"`; group-level transparent
  backgrounds must not override the selected-state rule.
  Give the help button the accessible name
  `Instrucțiuni pentru citirea cu voce tare` and use a
  click/touch/keyboard-operated `popover="auto"`, not a hover-only tooltip or
  a long `aria-label`. Position the popover beside the group and explain that
  in Microsoft Edge the learner should enable `Doar maghiară`, select the
  desired text, right-click, and choose `Read aloud selection` /
  `Citiți cu voce tare selecția`.
- Close the Read Aloud help popover before changing modes and hide its trigger
  in Hungarian-only mode so Romanian instructions cannot leak into whole-page
  selection or the reading surface. Keep the trigger at least 40 by 40 CSS
  pixels, keyboard focus visible, and the popover light-dismissible with
  `Escape` or an outside click.
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

## Reuse the shared lesson and deck modules

- Both city and chapter lessons load `assets/lesson.css` and `assets/lesson.js`.
  Reuse `assets/lesson-markdown.js` for explanatory Markdown and the shared
  Hungarian-only reading controls; do not copy inline renderers or styles.
- Every lesson and flashcard page selects an explicit `data-deck` identifier.
  `assets/decks.js` defines its Markdown URL, table schema, lesson columns,
  grouping, and Hungarian reading text. Add content-specific differences there.
- `assets/markdown-source.js` validates the maintained plain-text pipe tables.
  Both datasets expose `group`, `romanian`, `hungarian`, and `notes`; city rows
  also expose locative forms. Reject malformed or empty tables consistently.
  Derive runtime counts from parsed entries. Keep expected totals in validation
  checks rather than rejecting valid source edits with runtime fixed counts.

## Maintain one shared flashcard interface

- Use only the interface in `orase-romanesti-cu-nume-maghiare-flashcards.html`:
  visible bilingual pairs, individual and paired speech buttons, a sticky player,
  and one left settings drawer. Reuse `assets/flashcards.css`,
  `assets/flashcards.js`, and `assets/flashcard-voices.js` for every deck.
  Do not add flip cards, self-grading, spaced repetition, session summaries,
  keyboard grading shortcuts, or a second flashcard engine.
- `magyarok-a1-capitolul-2.md` is the single maintained content source for
  `magyarok-a1-capitolul-2.html` and its flashcard page. Both fetch it at runtime
  and use the shared parser in `assets/markdown-source.js`; never duplicate
  vocabulary in HTML or restore the deleted JSON deck. The source table has category, Romanian,
  Hungarian, and notes columns. Notes are displayed but never spoken.
  Review all pairs, intentional repeats, and counts after content edits.
- For city flashcards, fetch `orase-romanesti-cu-nume-maghiare.md` directly;
  do not introduce a separate JSON deck or hand-maintained HTML copy.
  `assets/markdown-source.js` is the shared parser for both lessons and
  flashcard pages. Reject missing or malformed tables visibly rather than
  silently dropping entries. Derive card and county counts from the parsed rows.
- Render each language as ordinary text inside `span lang="ro"` and
  `span lang="hu"`, using native buttons for pair and individual playback.
  Use `textContent` for Markdown-derived card text. The initial deck teaches
  city-name pairs; sentence practice requires separate review of the source's
  reconstructed forms and regional variants.
- `assets/flashcard-voices.js` adapts voice ranking from `hear-and-read`.
  Match Romanian and Hungarian voices independently; never substitute another
  language. Refresh on `voiceschanged`, show missing-voice guidance, and
  preserve reading when speech is unavailable. Voice ranking is a heuristic.
- Preserve sequential bilingual playback, stale-event cancellation, shuffle,
  group filtering (counties or themes), and accent-insensitive search. Resume repeats the current
  word from its beginning. Filtering or changing settings stops playback.
- Keep the player sticky and all configuration in the left settings drawer.
  During `Redă toate`, smoothly scroll each newly active card to the vertical
  center between the sticky player's measured bottom and the viewport bottom,
  on both desktop and mobile. Account for the mobile visual viewport and leave
  enough trailing scroll space to center the final card. Respect reduced motion
  with instant scrolling; do not move keyboard focus or restart scrolling for
  the second language of the same card. Individual playback need not scroll.
  Opening the native modal dialog pauses playback; closing does not restart it.
  Preserve the close button, Escape dismissal, backdrop fallback, and focus
  return. Keep controls usable at 320 CSS pixels and 48px playback targets;
  account for the player's measured height when scrolling focused content.

## Maintain page SEO and sharing metadata

- Keep a unique title, description, document language, and absolute production
  canonical URL in the original HTML head, available without JavaScript.
  Flashcards have their own canonical URL; the related lesson is their source,
  not a canonical replacement. Follow the existing `index, follow,
max-image-preview:large` robots convention; `index, follow` is otherwise
  the default. Do not add `meta keywords`.
- Include Open Graph type, Romanian locale, site name, title, description,
  canonical URL, and an absolute HTTPS image URL. Supply the image's actual
  MIME type, width, height, and descriptive alt text. Include explicit
  Twitter/X title, description, image, and image alt with
  `summary_large_image` for the landscape preview.
- The city preview is `assets/social/city-flashcards-social.png` (1200 × 630).
  Treat it and `assets/social/city-flashcards-social.svg` as one synchronized asset:
  edit the SVG source first and regenerate the PNG in the same change. Never
  edit or replace the PNG alone; if a new raster preview is supplied, update
  the SVG to match it and regenerate the PNG from that source. When the actual
  card's visible labels, controls, or styling change, review and update both
  previews together. Preserve the social layout's heading, branding, and
  1200 × 630 dimensions rather than copying a screenshot's aspect ratio.
  Verify the rendered PNG visually and check its dimensions before finishing.
  Use the PNG in metadata, not a data URL or SVG. Do not preload this
  sharing-only image into the learning page.
  From the repository root, regenerate it with the pinned `npx` command below.
  It requires Node.js/npm and network access on the first run; npm caches the
  CLI without adding a project dependency. Do not resolve tools or packages
  from sibling repositories or other project checkouts. All input and output
  paths stay inside this repository. This renders the SVG, rather than
  attempting to reconstruct an editable SVG from the PNG.

  ```bash
  npx --yes --package=sharp-cli@5.2.0 sharp \
    --input assets/social/city-flashcards-social.svg \
    --output assets/social/city-flashcards-social.png \
    --format png
  ```

- Other pages use their own `assets/social/<HTML filename without .html>.svg`
  and `.png` preview pair, including `assets/social/index.*` for the collection.
  Apply the same SVG-first synchronization rule and pinned conversion command
  with those paths. Keep preview titles and descriptions aligned with the page
  metadata; do not reuse the city playback illustration for lessons without
  those controls. These are sharing-only assets, not page screenshots.
- Keep `sitemap.xml` synchronized with the canonical URLs of all root HTML
  pages. Use the trailing-slash site URL for `index.html`, and do not invent
  `lastmod` dates. On GitHub Pages project hosting, a repository-level
  `robots.txt` under `/hungarian/` cannot set host-root crawler policy; submit
  the sitemap through Search Console instead of relying on that file.

- Add JSON-LD describing the actual resource. The city exercise combines
  `WebPage` and `LearningResource`, identifies its author, both languages,
  flashcard practice, free access, preview image, and related lesson through
  `isBasedOn`. Keep URLs and descriptions consistent with the head metadata;
  do not invent ratings, dates, or claim guaranteed rich results.
- `hreflang` describes separate localized URLs, not the languages of individual
  words. Do not invent a Hungarian alternate URL for a bilingual Romanian page.
- Cards remain runtime-rendered from Markdown. Metadata alone does not make
  them available to crawlers that do not execute JavaScript. Keep source links
  and visible fetch-failure feedback; do not duplicate vocabulary for crawlers.
  A future prerender should derive from the same Markdown and be explicitly
  scoped rather than adding a second maintained source.
- For metadata changes, parse JSON-LD, check canonical/Open Graph URL agreement,
  and verify that sharing-image URLs map to existing assets with matching
  dimensions. Follow the [Google metadata guidance](https://developers.google.com/search/docs/crawling-indexing/special-tags),
  [Open Graph specification](https://ogp.me/), and
  [LearningResource definition](https://schema.org/LearningResource).
  Run `node scripts/validate-seo.mjs` from the repository root to check all
  pages, sharing-image dimensions and source assets, and sitemap coverage.
  This is a local consistency check, not proof of indexing or rich-result
  eligibility. After deployment, verify the public URLs and request a new
  scrape on sharing platforms when cached previews remain stale.

### Verify social previews with browser MCP

- Before marking a new or changed SVG/PNG preview pair verified, use browser
  MCP to capture its corresponding HTML page, the rendered SVG, and the served
  PNG. For a batch update, cover every pair. Wait for fonts and asynchronous
  lesson content to load; capture the relevant content or controls as well as
  the heading when the preview depicts them.
- Compare the three captures side by side: topic, wording, counts, language
  labels, represented controls, colors, and text clipping must agree with the
  actual page. A branded social banner may keep its own 1200 × 630 composition;
  it need not duplicate the page layout or screenshot aspect ratio. A preview
  that depicts a card or other interface must use its current labels and
  controls, not invented or outdated UI. Record environment-dependent disabled
  controls separately from real preview mismatches.
- Check SVG against PNG separately so an up-to-date source cannot hide a stale
  raster export. Minor browser-versus-Sharp font rasterization differences are
  acceptable; missing glyphs, changed text, clipped content, or geometry drift
  require correction. Edit the SVG first, regenerate the PNG, and repeat the
  affected captures before finishing.
- Use a consistent viewport and light color scheme for the comparison (for
  example, 1200 × 900 for the page and 1200 × 630 for the assets). Record the
  pages, viewports, and findings in the task report and keep captures in a
  task-specific temporary directory. If a shared MCP profile is busy, use an
  isolated MCP session without closing another active browser. If MCP remains
  unavailable, report that limitation rather than claiming screenshot
  verification from metadata checks or a different capture tool.

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
- For flashcards, validate every source entry, section total, and language pair.
  Review every duplicate rather than deleting it automatically; verify both
  the Markdown-backed city and chapter decks with the shared player. Run
  `node scripts/validate-flashcards.mjs` for counts and duplicate reports, and
  `node --test scripts/test-decks.mjs` for source and parser regression checks.
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
