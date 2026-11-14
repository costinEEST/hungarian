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
- The `practical` deck fetches `vocabular-maghiar-practic.md` for
  `vocabular-maghiar-practic-flashcards.html`. `parseDeckSource()` in
  `assets/decks.js` parses every numbered section's Hungarian/pronunciation/meaning
  table, derives the group from its heading, and displays pronunciation as notes.
  Pronunciation notes are never spoken. Preserve this section-table schema and
  reject a malformed later table as well as a malformed first table.
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
  During `Redă toate`, smoothly align each newly active card's top below the
  sticky player's measured bottom, leaving the computed `#cards` row gap
  (currently 16px). Use `scrollPlayingCard()` in `assets/flashcards.js`; account
  for the mobile visual viewport and leave enough trailing scroll space for the
  final card to reach the same position. Do not add leading centering space.
  Respect reduced motion with instant scrolling; do not move keyboard focus or restart scrolling for
  the second language of the same card. Individual playback need not scroll.
  Opening the native modal dialog pauses playback; closing does not restart it.
  Preserve the close button, Escape dismissal, backdrop fallback, and focus
  return. Keep controls usable at 320 CSS pixels and 48px playback targets;
  account for the player's measured height when scrolling focused content.
