---
name: hungarian-audio
description: Maintain pronunciation recordings for the Hungarian alphabet page. Use when adding, replacing, comparing, finding, or validating audio URLs in alfabet-maghiar.html, or when troubleshooting its pronunciation buttons and audio-source attribution.
---

# Hungarian audio maintenance

Run commands from the repository root. Preserve the user's requested word,
phrase, and recording source unless they ask for alternatives.

## Choose the script

- Use `./scripts/inspect-audio.sh '<url>'` to inspect one candidate recording.
  Run it once per URL when comparing formats or quality. It reports the file
  type and, when `ffprobe` is installed, the codec, duration, sample rate,
  channels, size, and bitrate. It downloads only to a temporary file and does
  not edit the project.
- Use `node scripts/collect-dictzone-audio.mjs --word '<word-or-phrase>'` to
  look for a DictZone recording that is not yet mapped. This scrapes DictZone,
  can be rate-limited, and prints candidate JSON; it does not edit the HTML.
  Prefer the scoped `--word` form. Use an unscoped collection only when the
  user explicitly needs a broad refresh or audit. Optional flags are
  `--source`, `--output`, `--delay`, and `--retries`.
- Use `node scripts/upgrade-wiktionary-audio.mjs --word '<word-or-phrase>'`
  to look for Hungarian audio on English Wiktionary and resolve its Wikimedia
  Commons MP3 transcode. It previews changes by default; add `--write` only
  after reviewing the proposed URL. Without `--word`, it checks every
  DictZone-backed mapping while preserving manually selected external URLs.
  Use `--include-external` only when the user wants those curated URLs
  reconsidered too.
- Use `node scripts/verify-audio.mjs --word '<word-or-phrase>'` after
  adding or replacing one mapped recording. It resolves both relative
  DictZone paths and absolute external URLs, follows redirects, and requires
  a successful audio content type. Run it without `--word` after a broad map
  refactor or when the user requests a complete audit. Optional flags are
  `--source`, `--delay`, and `--retries`.

All four scripts access remote URLs and may require network approval. Do not
treat network denial or rate limiting as evidence that a recording is invalid.

## Edit the audio map

`DICTZONE_AUDIO` in `alfabet-maghiar.html` is the source of truth.

- Store DictZone recordings as paths relative to `DICTZONE_AUDIO_BASE`, such
  as `"1m/2jf.mp3"`.
- Store Forvo paths with the `forvo:` prefix, SZTAKI paths with the `sztaki:`
  prefix, and Wikimedia Commons paths with the `wikimedia:` prefix.
  `getAudioUrl()` resolves them against their provider base constants; the
  Wikimedia base already includes `transcoded/`. Keep an absolute HTTPS URL
  only for a provider without a declared base constant.
- Prefer an HTTPS MP3 transcode for short browser-played speech when the same
  recording is also offered as OGG or WAV. Compare candidates with
  `inspect-audio.sh` when quality is relevant; do not infer quality from the
  extension alone.
- Map a complete displayed phrase when one recording covers the whole phrase.
  This makes `speakable()` render one audio button. Remove word-level mappings
  only when they are obsolete and not used by another lesson entry.
- When introducing a new provider, update source detection for accessible
  button labels and add a linked attribution in the footer. Keep the visible
  Anki source summary consistent.
- Keep Wikimedia playback anonymous: set `audioPlayer.crossOrigin` to
  `"anonymous"` before assigning a URL whose host is `upload.wikimedia.org`.
  Wikimedia's CDN may otherwise attempt to set its third-party `WMF-Uniq`
  cookie, which produces browser privacy warnings. Remove the `crossorigin`
  attribute for non-Wikimedia sources rather than applying this globally,
  because DictZone or SZTAKI may not return compatible CORS headers.

## Preserve the approved lesson-page UX

Audio work must remain compatible with the shared behavior of the HTML lesson
pages linked from `index.html`:

- The sticky section bar is the only section-navigation control. Keep its
  links on one horizontally scrollable row, prevent pills from shrinking or
  wrapping, and do not add per-section “back to top” actions.
- Every lesson page linked from `index.html` has a visible
  `← Toate resursele` link at the start of its header using `href="./"`.
  Keep any footer link to the collection as secondary, redundant navigation;
  do not put the home link in the sticky section bar.
- The `mode-toggle` switches to a focused Hungarian-only view built from
  content marked with `lang="hu"`. Keep `aria-pressed` and the visible button
  label synchronized.
- In Hungarian-only mode, preserve a mapped recording as a compact circular
  speaker button beside its word or phrase. Reuse the existing `.speak-btn`
  element and delegated playback handler; never expose the raw audio URL.
- Do not render empty or disabled audio controls for content without a mapped
  recording. Keep those entries visually quiet.
- Keep `#audio-status` available to assistive technology while Hungarian-only
  mode hides the rest of the original lesson content.
- On small screens, stack table cells vertically and center each row. Remove
  scroll-container behavior from the stacked table, but allow an individual
  unusually long value to wrap or scroll locally rather than widening the
  page.
- Keep section anchor offsets large enough that the sticky bar does not cover
  the destination heading. Respect reduced-motion preferences when using
  smooth scrolling or playback animation.

After editing, format-check the skill with:

```bash
npx --yes prettier --check .agents/skills/hungarian-audio/SKILL.md
```

Prettier verifies that the Markdown and YAML frontmatter parse and follow the
repository's formatting convention; it does not enforce the full Codex skill
schema. Also parse the final inline JavaScript and run `git diff --check`. When
an audio mapping changed, run the scoped URL verifier and report which source
and format were selected. Do not commit unless the user requests it.
