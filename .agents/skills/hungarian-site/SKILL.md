---
name: hungarian-site
description: "Maintain Hungarian lessons and flashcards: use for vocabulary, layouts, reading mode, shared playback, and SEO changes."
metadata:
  author: "Constantin Câmpean <mail.la.costi@gmail.com>"
  version: "1.1.0"
  tags: "hungarian, lessons, flashcards"
---

# Hungarian lesson-site maintenance

Maintain the Romanian-to-Hungarian site using its shared modules and Markdown
sources. Preserve the established visual system and learning flow unless the
user requests a redesign. Use the sibling `hungarian-audio` skill for alphabet
recordings, providers, audio mappings, and mapped recording playback; flashcard
speech synthesis belongs here.

## Prerequisites

- Run commands from the repository root. Use Node.js for local validators and
  npm for pinned formatting and image tools.
- Python 3 serves fetch-backed pages locally. Browser MCP verifies interactions
  and social previews. First-time tool downloads and remote checks need network access.

## Instructions

1. Identify the affected maintained source, shared modules, and pages. Read only
   the relevant references below before editing.
2. Edit the source and shared implementation; preserve the constraints below.
3. Choose checks from [validation and tools](references/validation-and-tools.md)
   for the changed behavior. Shared player/parser changes require all three
   decks; deck-only edits require that deck. Skill documentation edits need
   formatting, reference, and diff checks rather than application browser tests.
4. Report source corrections, validation results, and remaining verification gaps.
   Keep task artifacts temporary and do not commit unless requested.

## Task references

| Task                                                                         | Read before editing                                                                                |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Lesson navigation, responsive tables, Hungarian-only mode, Read Aloud help   | [Lessons and reading](references/lessons-and-reading.md)                                           |
| Markdown sources, deck registration, schemas, new vocabulary, page inventory | [Data and vocabulary](references/data-and-vocabulary.md)                                           |
| Flashcard interface, voices, playback, scrolling, settings                   | [Flashcards](references/flashcards.md) and [data relationships](references/data-and-vocabulary.md) |
| Metadata, canonical URLs, sitemap, sharing previews                          | [SEO and social](references/seo-and-social.md)                                                     |
| Validation commands, local previews, PDF extraction, cleanup                 | [Validation and tools](references/validation-and-tools.md)                                         |

For new pages, combine data, relevant interface, and SEO guidance. For UI changes
shown in a sharing preview, also read the social-preview procedure. Resolve
reference paths relative to this skill directory; command paths are relative
to the repository root.

## Shared constraints

- Keep Markdown as the single maintained content source. Derive runtime totals
  from parsed entries; expected fixed totals belong in validation checks.
- Register shared Markdown-backed pages with explicit `data-deck` values.
  `assets/decks.js` owns source URLs, schemas, grouping, lesson columns, and
  Hungarian reading text. `assets/markdown-source.js` validates shared pipe
  tables. Reject malformed or empty sources visibly.
- Reuse `assets/lesson.css`, `assets/lesson.js`, and `assets/lesson-markdown.js`
  for shared lessons. Reuse `assets/flashcards.css`, `assets/flashcards.js`, and
  `assets/flashcard-voices.js` for every deck; do not create parallel renderers.
- Preserve the single flashcard interface: visible bilingual pairs, individual
  and paired speech buttons, sticky player, and left settings drawer. Do not
  introduce another engine or learning model as an incidental change.
- Build Hungarian-only mode as a continuous `lang="hu"` text surface from the
  same data. Hide inactive source units and Romanian page chrome. Whole-page
  selection must contain only Hungarian, including outside the main content.
- Display notes without speaking them. Match Romanian and Hungarian voices
  independently; never substitute another language.
- Keep `Constantin Câmpean` as the metadata and structured-data author. Adding
  or removing pages also updates collection cards/counts, JSON-LD, and sitemap.
- Edit sharing SVG sources first and regenerate PNG counterparts in the same
  change. Compare the page, SVG, and PNG with browser MCP before claiming a
  changed preview is visually verified.

## Examples

- For play-all scrolling, read the flashcard reference and check first, middle,
  and final cards on desktop and mobile. Include reduced motion and verify
  the second language of a card does not trigger another scroll.
- For practical-vocabulary additions, read the data reference, edit maintained
  section tables, review meanings and duplicates, and recompute totals. Do not
  paste entries into flashcard HTML.

## Limitations

Dictionary verification remains pending until an approved dictionary is recorded
in the data reference. Voice availability depends on the browser and installed
voices; static checks cannot prove playback or Read Aloud behavior. SEO checks
verify local consistency, not indexing or cached sharing previews.

## Troubleshooting

- Missing voices: inspect `voice-status` and installed Romanian and Hungarian
  voices; keep cards readable and never substitute another language.
- Markdown fetch failure: serve over local HTTP and inspect the request and
  parser error before changing data or duplicating it in HTML.
- Busy browser MCP: try an isolated session without closing another active
  browser; report any remaining verification gap.
