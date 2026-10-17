#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import process from "node:process";

const args = process.argv.slice(2);
const hasFlag = (flag) => args.includes(flag);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};

if (hasFlag("--help")) {
  console.log(`Usage: node scripts/upgrade-wiktionary-audio.mjs [options]

Find Hungarian pronunciation audio on English Wiktionary and resolve its
Wikimedia Commons MP3 transcode.

Options:
  --word <text>       Process one mapped word or phrase
  --source <path>     HTML source (default: alfabet-maghiar.html)
  --delay <ms>        Delay between API batches (default: 1000)
  --retries <count>   Retries for rate limits/server errors (default: 2)
  --include-external  Also replace existing SZTAKI/Wikimedia URLs
  --write             Update DICTZONE_AUDIO in the HTML
  --help              Show this help

Without --write, the script only reports proposed replacements.`);
  process.exit(0);
}

const sourcePath = valueAfter("--source") || "alfabet-maghiar.html";
const onlyWord = valueAfter("--word");
const delayMs = Number(valueAfter("--delay") || 1000);
const retries = Number(valueAfter("--retries") || 2);
const shouldWrite = hasFlag("--write");
const includeExternal = hasFlag("--include-external");
const wikimediaAudioBase =
  "https://upload.wikimedia.org/wikipedia/commons/transcoded/";

if (!Number.isFinite(delayMs) || delayMs < 0) {
  throw new Error("--delay must be a non-negative number.");
}
if (!Number.isInteger(retries) || retries < 0) {
  throw new Error("--retries must be a non-negative integer.");
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const userAgent = "hungarian-learning-audio-maintenance/1.0";

const fetchJson = async (url) => {
  let response;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    response = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": userAgent },
    });
    if ((response.status !== 429 && response.status < 500) || attempt === retries) break;
    const retryAfter = Number(response.headers.get("retry-after"));
    await response.body?.cancel();
    await sleep(Number.isFinite(retryAfter) ? retryAfter * 1000 : Math.max(delayMs, 1000) * 2 ** attempt);
  }
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.json();
};

const wiktionaryApiUrl = (words) => {
  const url = new URL("https://en.wiktionary.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    titles: words.join("|"),
    prop: "revisions",
    rvprop: "content",
    rvslots: "main",
    redirects: "1",
    format: "json",
    formatversion: "2",
  });
  return url;
};

const commonsApiUrl = (fileNames) => {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    titles: fileNames.map((fileName) => `File:${fileName}`).join("|"),
    prop: "videoinfo",
    viprop: "url|mime|mediatype|derivatives",
    format: "json",
    formatversion: "2",
  });
  return url;
};

const hungarianSection = (wikitext) => {
  const start = wikitext.search(/^==Hungarian==\s*$/m);
  if (start === -1) return null;
  const contentStart = wikitext.indexOf("\n", start) + 1;
  const rest = wikitext.slice(contentStart);
  const nextLanguage = rest.search(/^==[^=\n]+==\s*$/m);
  return nextLanguage === -1 ? rest : rest.slice(0, nextLanguage);
};

const hungarianAudioFile = (wikitext) => {
  const section = hungarianSection(wikitext);
  if (!section) return null;
  const match = section.match(/\{\{audio\s*\|\s*hu\s*\|\s*([^|}\n]+?)(?:\s*\||\s*}})/i);
  return match?.[1].trim() || null;
};

const findMp3 = (data) => {
  const info = data?.videoinfo?.[0];
  if (!info || info.mediatype !== "AUDIO") return null;
  return info.derivatives?.find(
    ({ transcodekey, type }) => transcodekey === "mp3" || type?.startsWith("audio/mpeg"),
  )?.src || null;
};

const source = await readFile(sourcePath, "utf8");
const mapDeclaration = "const DICTZONE_AUDIO = {";
const mapStart = source.indexOf(mapDeclaration);
const mapEnd = source.indexOf("\n    };", mapStart);
if (mapStart === -1 || mapEnd === -1) {
  throw new Error(`Could not locate DICTZONE_AUDIO in ${sourcePath}.`);
}

const mapBodyStart = mapStart + mapDeclaration.length;
const mapBody = source.slice(mapBodyStart, mapEnd);
const propertyPattern = /((?:^|\n)\s*(?:"([^"]+)"|([\p{L}_$][\p{L}\p{N}_$]*)):\s*(?:\n\s*)?)"([^"]*)"/gu;
const entries = [...mapBody.matchAll(propertyPattern)].map((match) => ({
  key: match[2] || match[3],
  value: match[4],
  valueStart: match.index + match[1].length,
  valueEnd: match.index + match[0].length,
}));

if (!entries.length) throw new Error("DICTZONE_AUDIO contains no readable entries.");

const selectedEntries = entries.filter(({ key, value }) => {
  if (onlyWord && key.toLocaleLowerCase("hu") !== onlyWord.toLocaleLowerCase("hu")) return false;
  const isExternal =
    value.startsWith("https://") ||
    value.startsWith("forvo:") ||
    value.startsWith("sztaki:") ||
    value.startsWith("wikimedia:");
  return includeExternal || !isExternal;
});

if (!selectedEntries.length) {
  const reason = onlyWord
    ? `No eligible DictZone-backed mapping found for: ${onlyWord}`
    : "No eligible DictZone-backed mappings found.";
  throw new Error(`${reason}${includeExternal ? "" : " Use --include-external to replace external URLs."}`);
}

const replacements = new Map();
let missingPage = 0;
let missingAudio = 0;
let missingMp3 = 0;
let errors = 0;

const chunks = (items, size = 40) => {
  const result = [];
  for (let index = 0; index < items.length; index += size) result.push(items.slice(index, index + size));
  return result;
};
const normalizedTitle = (title) => title.normalize("NFC").replaceAll("_", " ").toLocaleLowerCase("hu");
const audioFiles = new Map();

for (const batch of chunks(selectedEntries)) {
  try {
    const data = await fetchJson(wiktionaryApiUrl(batch.map(({ key }) => key)));
    if (data.error) throw new Error(`${data.error.code}: ${data.error.info}`);

    const aliases = new Map(
      [...(data.query?.normalized || []), ...(data.query?.redirects || [])].map(({ from, to }) => [
        normalizedTitle(from),
        normalizedTitle(to),
      ]),
    );
    const pages = new Map(
      (data.query?.pages || []).map((page) => [normalizedTitle(page.title), page]),
    );

    for (const entry of batch) {
      let title = normalizedTitle(entry.key);
      const visited = new Set();
      while (aliases.has(title) && !visited.has(title)) {
        visited.add(title);
        title = aliases.get(title);
      }
      const page = pages.get(title);
      if (!page || page.missing) {
        missingPage += 1;
        console.error(`NO_PAGE\t${entry.key}`);
        continue;
      }
      const wikitext = page.revisions?.[0]?.slots?.main?.content || "";
      const fileName = hungarianAudioFile(wikitext);
      if (!fileName) {
        missingAudio += 1;
        console.error(`NO_AUDIO\t${entry.key}`);
        continue;
      }
      audioFiles.set(entry.key, fileName);
    }
  } catch (error) {
    errors += batch.length;
    for (const { key } of batch) console.error(`ERROR\t${key}\t${error.message}`);
  }
  await sleep(delayMs);
}

const entriesByFile = new Map();
for (const [key, fileName] of audioFiles) {
  const normalized = normalizedTitle(`File:${fileName}`);
  if (!entriesByFile.has(normalized)) entriesByFile.set(normalized, []);
  entriesByFile.get(normalized).push({ key, fileName });
}

for (const batch of chunks([...audioFiles.values()])) {
  try {
    const data = await fetchJson(commonsApiUrl(batch));
    if (data.error) throw new Error(`${data.error.code}: ${data.error.info}`);

    const returnedFiles = new Set();
    for (const page of data.query?.pages || []) {
      const normalized = normalizedTitle(page.title);
      const relatedEntries = entriesByFile.get(normalized) || [];
      returnedFiles.add(normalized);
      const mp3Url = findMp3(page);
      for (const { key, fileName } of relatedEntries) {
        if (!mp3Url) {
          missingMp3 += 1;
          console.error(`NO_MP3\t${key}\t${fileName}`);
          continue;
        }
        const storedUrl = mp3Url.startsWith(wikimediaAudioBase)
          ? `wikimedia:${mp3Url.slice(wikimediaAudioBase.length)}`
          : mp3Url;
        replacements.set(key, storedUrl);
        console.log(`FOUND\t${key}\t${fileName}\t${mp3Url}`);
      }
    }
    for (const [normalized, relatedEntries] of entriesByFile) {
      if (!batch.some((fileName) => normalizedTitle(`File:${fileName}`) === normalized)) continue;
      if (returnedFiles.has(normalized)) continue;
      for (const { key, fileName } of relatedEntries) {
        missingMp3 += 1;
        console.error(`NO_MP3\t${key}\t${fileName}`);
      }
    }
  } catch (error) {
    errors += batch.length;
    for (const fileName of batch) console.error(`ERROR\t${fileName}\t${error.message}`);
  }
  await sleep(delayMs);
}

if (shouldWrite && replacements.size) {
  const updatedMapBody = mapBody.replace(propertyPattern, (full, prefix, quotedKey, bareKey, value) => {
    const replacement = replacements.get(quotedKey || bareKey);
    return replacement ? `${prefix}${JSON.stringify(replacement)}` : full;
  });
  const updatedSource = `${source.slice(0, mapBodyStart)}${updatedMapBody}${source.slice(mapEnd)}`;
  await writeFile(sourcePath, updatedSource, "utf8");
}

const action = shouldWrite ? "updated" : "proposed";
console.error(
  `Summary: ${replacements.size} ${action}, ${missingPage} missing pages, ${missingAudio} without Hungarian audio, ${missingMp3} without MP3, ${errors} errors.`,
);
if (!shouldWrite && replacements.size) console.error("Run again with --write to apply these replacements.");
if (errors) process.exitCode = 1;
