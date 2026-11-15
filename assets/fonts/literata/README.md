# Literata web fonts

Designed by TypeTogether / The Literata Project Authors. Distributed under the
SIL Open Font License 1.1; retain the adjacent `OFL.txt` when redistributing.

Retrieved from Google Fonts on 2026-11-15:

- [Upright source](https://github.com/google/fonts/blob/main/ofl/literata/Literata%5Bopsz%2Cwght%5D.ttf)
  SHA-256: `b41138c9373112f32abb589cc22e8674b06ed4048b0c513be922bdd26f274440`
- [Italic source](https://github.com/google/fonts/blob/main/ofl/literata/Literata-Italic%5Bopsz%2Cwght%5D.ttf)
  SHA-256: `d483dfaeba9cbf4ce71d32a52ee65df82f7e35b15fff8d1011cdb242d1fcd465`

## Local preparation

Prepared with FontTools 4.60.1 and Brotli 1.2.1. For each source, restrict the
weight axis and then subset (replace the example paths for the italic file):

```sh
fonttools varLib.instancer source.ttf wght=400:700 --output=reading.ttf
pyftsubset reading.ttf --output-file=reading.woff2 --flavor=woff2 \
  --unicodes=U+0000-024F,U+0300-036F,U+1E00-1EFF,U+2000-206F,U+20A0-20CF,U+2122,U+2190-2199,U+2212 \
  --layout-features='*' --name-IDs='*' --name-legacy --name-languages='*'
```

Both files retain variable weights 400–700 and optical sizes 7–72, including
kerning and shaping features. The subset includes Hungarian and Romanian
letters, combining accents, punctuation, currency symbols, and basic arrows.
Hungarian precomposed vowels and combining acute, diaeresis, and double acute
were checked in both output character maps. This is not a general IPA font.

Output filenames contain the first eight SHA-256 characters. After rebuilding,
recompute the hashes and update `assets/typography.css` and HTML preload links.
The upright file is 183,064 bytes; the italic file is 184,924 bytes.

## Loading and language scope

Every page links `assets/typography.css` directly and preloads only
the upright font with `crossorigin`.
Italic is loaded only when used. No visitor requests go to Google Fonts.

`font-display: swap` keeps text visible. `font-optical-sizing: auto` adapts the
design to the text size. `font-size-adjust: 0.507` uses the measured source
x-height (507 / 1000) to scale fallback fonts; it does not guarantee identical
line wrapping. Older browsers keep the serif fallback and unitless line height.

Literata is the root font for both Romanian and Hungarian, including dynamically
generated content. Specialized phonetic/monospace styles remain available.
Keep explicit language attributes for pronunciation. The Markdown guide
renderers support `<span lang="hu">…</span>` (also `ro` and `en`) as a restricted
inline syntax; they create DOM nodes rather than evaluating arbitrary HTML.
Do not use typography as a substitute for language markup.
