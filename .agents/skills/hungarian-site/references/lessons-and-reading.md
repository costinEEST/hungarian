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
