---
name: hungarian-audio
description: "Maintain alphabet pronunciation audio: use for recording discovery, URL validation, playback, and attribution in alfabet-maghiar.html."
metadata:
  author: "Constantin Câmpean <mail.la.costi@gmail.com>"
  version: "1.0.0"
  tags: "hungarian, pronunciation, audio"
---

# Hungarian audio maintenance

## Purpose

Maintain mapped alphabet recordings and their accessible playback. Flashcard
speech synthesis is maintained by `hungarian-site`, not the recording map.

## Prerequisites

Use Node.js for audio-map helpers and inline-script checks, and Bash plus `curl`
for `inspect-audio.sh`. `ffprobe` is optional for codec measurements. Discovery
and URL checks need network access; npm runs the pinned formatting command.

## Instructions

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

## Preserve the audio experience

- In Hungarian-only mode, preserve a mapped recording as a compact circular
  speaker button beside its word or phrase. Reuse the existing `.speak-btn`
  element and delegated playback handler; never expose the raw audio URL.
- Do not render empty or disabled audio controls for content without a mapped
  recording. Keep those entries visually quiet.
- Keep `#audio-status` available to assistive technology while Hungarian-only
  mode hides the rest of the original lesson content.
- Preserve reduced-motion handling for playback animation. Keep buttons at
  least 44 by 44 CSS pixels on coarse pointers and retain visible focus.

After editing, format-check the skill with:

```bash
npx --yes prettier@3.6.2 --check .agents/skills/hungarian-audio/SKILL.md
```

Prettier checks Markdown formatting; validate YAML frontmatter separately with
a skill-schema validator. Also parse changed inline JavaScript and run `git diff --check`. When
an audio mapping changed, run the scoped URL verifier and report which source
and format were selected. Do not commit unless the user requests it.

## Examples

- To replace one recording, inspect the candidate URL, review the map change,
  and run `node scripts/verify-audio.mjs --word '<word-or-phrase>'`. Report the
  selected provider and format, and test its pronunciation button.
- To compare formats, run `inspect-audio.sh` on each candidate URL and compare
  codec measurements and audible quality before selecting one.

## Limitations

Provider availability, rate limits, and browser CORS policies affect playback.
A successful URL check proves an audio response, not correct pronunciation or
recording quality; listen when those are part of the task. Codec measurements
are unavailable when optional `ffprobe` is absent.

## Troubleshooting

- On network denial or rate limiting, report the verification gap and retry only
  within the authorized network scope; do not delete the mapping as invalid.
- If a URL verifies but browser playback fails, inspect the response and console
  for CORS errors, especially provider-specific `crossOrigin` handling.
- If a phrase renders several buttons, check its complete displayed text has a
  map entry before removing word mappings used elsewhere.
