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

## Maintain Markdown-backed flashcards

- For city flashcards, fetch `orase-romanesti-cu-nume-maghiare.md` directly;
  do not introduce a separate JSON deck or hand-maintained HTML copy.
  `assets/city-source.js` is the shared parser for the lesson and flashcard
  page. Reject missing or malformed tables visibly rather than silently
  dropping entries. Derive card and county counts from the parsed rows.
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
  county filtering, and accent-insensitive search. Resume repeats the current
  word from its beginning. Filtering or changing settings stops playback.
- Keep the player sticky and all configuration in the left settings drawer.
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
- The city preview is `assets/city-flashcards-social.png` (1200 × 630).
  Treat it and `assets/city-flashcards-social.svg` as one synchronized asset:
  edit the SVG source first and regenerate the PNG in the same change. Never
  edit or replace the PNG alone; if a new raster preview is supplied, update
  the SVG to match it and regenerate the PNG from that source. When the actual
  card's visible labels, controls, or styling change, review and update both
  previews together. Preserve the social layout's heading, branding, and
  1200 × 630 dimensions rather than copying a screenshot's aspect ratio.
  Verify the rendered PNG visually and check its dimensions before finishing.
  Use the PNG in metadata, not a data URL or SVG. Do not preload this
  sharing-only image into the learning page.
  From the repository root, regenerate it with the command below. It requires
  Node.js and `sharp` installed in the sibling `../hear-and-read` checkout;
  this repository does not declare that dependency. Adjust the `createRequire`
  path if that checkout is elsewhere. This renders the SVG, rather than
  attempting to reconstruct an editable SVG from the PNG.

  ```bash
  node --input-type=module <<'JS'
  import { createRequire } from 'node:module';
  import { resolve } from 'node:path';
  import assert from 'node:assert/strict';

  const require = createRequire(resolve('../hear-and-read/package.json'));
  const sharp = require('sharp');
  const image = await sharp('assets/city-flashcards-social.svg').png().toBuffer();
  const { width, height } = await sharp(image).metadata();
  assert.equal(width, 1200);
  assert.equal(height, 630);
  await sharp(image).toFile('assets/city-flashcards-social.png');
  JS
  ```

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
