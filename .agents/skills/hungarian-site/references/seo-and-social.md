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
