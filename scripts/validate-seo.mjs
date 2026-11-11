#!/usr/bin/env node
// Validate the repository's static metadata and sharing assets without network access.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const base = "https://costineest.github.io/hungarian/";
const pages = fs
  .readdirSync(root)
  .filter((name) => name.endsWith(".html"))
  .sort();
const decode = (value) =>
  value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (_, entity) => {
    if (entity.startsWith("#"))
      return String.fromCodePoint(
        entity[1].toLowerCase() === "x"
          ? parseInt(entity.slice(2), 16)
          : Number(entity.slice(1)),
      );
    return { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" }[
      entity.toLowerCase()
    ];
  });
const attributes = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs)].map((match) => [
      match[1].toLowerCase(),
      decode(match[3]),
    ]),
  );
const titles = new Set(),
  descriptions = new Set(),
  canonicals = new Set();
let failures = 0;

for (const name of pages) {
  try {
    const html = fs.readFileSync(path.join(root, name), "utf8");
    const head = html.split("</head>")[0];
    assert.equal(
      attributes(html.match(/<html\b[^>]*>/i)?.[0] || "").lang,
      "ro",
      "document language",
    );
    const titleMatches = [...head.matchAll(/<title>(.*?)<\/title>/gs)];
    assert.equal(titleMatches.length, 1, "exactly one title");
    const title = decode(titleMatches[0][1]).trim();
    assert(title && !titles.has(title), "nonempty, unique title");
    titles.add(title);
    const meta = new Map();
    let charset = 0;
    for (const match of head.matchAll(/<meta\b[^>]*>/gi)) {
      const a = attributes(match[0]);
      if (a.charset) {
        assert.equal(a.charset.toLowerCase(), "utf-8");
        charset++;
      }
      const key = a.property || a.name;
      if (!key) continue;
      const identity = key === "theme-color" ? `${key}:${a.media}` : key;
      assert(!meta.has(identity), `duplicate tag: ${identity}`);
      meta.set(identity, a.content);
    }
    assert.equal(charset, 1, "exactly one UTF-8 charset");
    const required = [
      "description",
      "viewport",
      "author",
      "robots",
      "og:type",
      "og:locale",
      "og:site_name",
      "og:title",
      "og:description",
      "og:url",
      "og:image",
      "og:image:type",
      "og:image:width",
      "og:image:height",
      "og:image:alt",
      "twitter:card",
      "twitter:title",
      "twitter:description",
      "twitter:image",
      "twitter:image:alt",
    ];
    required.forEach((key) => assert(meta.get(key)?.trim(), `missing ${key}`));
    const description = meta.get("description");
    assert(!descriptions.has(description), "unique description");
    descriptions.add(description);
    assert.match(meta.get("viewport"), /width=device-width/);
    assert.equal(meta.get("author"), "Constantin Câmpean");
    assert(
      !/noindex|nofollow/i.test(meta.get("robots")),
      "indexable robots policy",
    );
    assert.match(meta.get("robots"), /max-image-preview:large/);
    assert(
      meta.has("theme-color:(prefers-color-scheme: light)"),
      "light theme color",
    );
    assert(
      meta.has("theme-color:(prefers-color-scheme: dark)"),
      "dark theme color",
    );
    const links = [...head.matchAll(/<link\b[^>]*>/gi)].map((match) =>
      attributes(match[0]),
    );
    const canonical = links.filter((a) => a.rel === "canonical");
    const expected = base + (name === "index.html" ? "" : name);
    assert.equal(canonical.length, 1, "exactly one canonical");
    assert.equal(canonical[0].href, expected, "production canonical URL");
    assert.equal(meta.get("og:url"), expected);
    canonicals.add(expected);
    for (const key of ["og:title", "twitter:title"])
      assert.equal(meta.get(key), title, key);
    for (const key of ["og:description", "twitter:description"])
      assert.equal(meta.get(key), description, key);
    assert.equal(meta.get("og:locale"), "ro_RO");
    assert.equal(meta.get("twitter:card"), "summary_large_image");
    assert.equal(meta.get("og:image"), meta.get("twitter:image"));
    assert.equal(meta.get("og:image:alt"), meta.get("twitter:image:alt"));
    assert.equal(meta.get("og:image:type"), "image/png");
    const imageURL = meta.get("og:image");
    assert(imageURL.startsWith(base), "local production sharing image");
    const image = path.resolve(root, imageURL.slice(base.length));
    assert(image.startsWith(root), "image stays within repository");
    const png = fs.readFileSync(image);
    assert(
      png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
      "PNG signature",
    );
    const width = png.readUInt32BE(16),
      height = png.readUInt32BE(20);
    assert.deepEqual([width, height], [1200, 630], "social preview dimensions");
    assert.equal(Number(meta.get("og:image:width")), width);
    assert.equal(Number(meta.get("og:image:height")), height);
    assert(png.length < 5_000_000, "sharing image under 5 MB");
    const svg = fs.readFileSync(image.replace(/\.png$/, ".svg"), "utf8");
    const dimensions = attributes(svg.match(/<svg\b[^>]*>/i)?.[0] || "");
    assert.deepEqual(
      [Number(dimensions.width), Number(dimensions.height)],
      [width, height],
      "editable SVG dimensions",
    );
    const ld = [
      ...head.matchAll(
        /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gs,
      ),
    ].map((match) => JSON.parse(match[1]));
    assert.equal(ld.length, 1, "one primary JSON-LD resource");
    const resource = ld[0];
    assert.equal(resource["@context"], "https://schema.org");
    assert.equal(resource["@id"], expected);
    assert.equal(resource.url, expected);
    assert.equal(resource.name, title);
    assert.equal(resource.description, description);
    assert.equal(resource.author.name, meta.get("author"));
    assert.equal(resource.image.url, imageURL);
    assert.deepEqual(
      [resource.image.width, resource.image.height],
      [width, height],
    );
    if (name === "index.html") {
      assert.equal(resource["@type"], "CollectionPage");
      const items = resource.mainEntity.itemListElement;
      assert.equal(items.length, resource.mainEntity.numberOfItems);
      assert.equal(new Set(items.map((item) => item.url)).size, items.length);
      assert.deepEqual(
        items.map((item) => item.position),
        items.map((_, i) => i + 1),
      );
    } else {
      assert(resource["@type"].includes("LearningResource"));
      assert(resource["@type"].includes("WebPage"));
      assert.equal(resource.isAccessibleForFree, true);
      assert.deepEqual(resource.inLanguage, ["ro", "hu"]);
    }
    console.log(`${name}: metadata, JSON-LD, and sharing assets valid`);
  } catch (error) {
    failures++;
    console.error(`${name}: ${error.message}`);
  }
}
try {
  const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
  assert.match(
    sitemap,
    /xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/,
  );
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gs)].map((match) =>
    decode(match[1]),
  );
  assert.equal(
    new Set(locations).size,
    locations.length,
    "no duplicate sitemap URLs",
  );
  assert.deepEqual(
    [...locations].sort(),
    [...canonicals].sort(),
    "sitemap matches canonical HTML pages",
  );
  console.log(`sitemap.xml: ${locations.length} canonical pages`);
} catch (error) {
  failures++;
  console.error(`sitemap.xml: ${error.message}`);
}
process.exitCode = failures ? 1 : 0;
