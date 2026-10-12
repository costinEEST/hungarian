#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import process from "node:process";

const args = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};
const sourcePath = valueAfter("--source") || "alfabet-maghiar.html";
const outputPath = valueAfter("--output");
const onlyWord = valueAfter("--word");
const delayMs = Number(valueAfter("--delay") || 2000);
const retries = Number(valueAfter("--retries") || 3);

if (!Number.isFinite(delayMs) || delayMs < 0 || !Number.isInteger(retries) || retries < 0) {
  console.error("--delay must be a positive number and --retries a positive integer.");
  process.exit(2);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const source = await readFile(sourcePath, "utf8");
const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error(`No inline <script> found in ${sourcePath}`);

const dataStart = script.indexOf("const ALPHABET");
const dataEnd = script.indexOf("const DICTZONE_AUDIO");
if (dataStart === -1 || dataEnd === -1) throw new Error("Could not locate lesson data arrays.");
const { ALPHABET, PAIRS, ANKI } = new Function(
  `${script.slice(dataStart, dataEnd)}; return { ALPHABET, PAIRS, ANKI };`,
)();

const words = new Set();
for (const row of ALPHABET) words.add(row[4]);
for (const row of PAIRS) {
  for (const word of row[0].split(/\s+[–/]\s+/)) words.add(word);
}
for (const row of ANKI) words.add(row[0]);
for (const match of source.matchAll(/data-hu="([^"]+)"/g)) words.add(match[1]);
if (onlyWord) {
  words.clear();
  words.add(onlyWord);
}

const findHungarianMp3 = (html, pageUrl) => {
  const anchors = [...html.matchAll(/<a\b[^>]*>/gi)].map((match) => match[0]);
  const audioAnchor = anchors.find(
    (tag) =>
      /class=["'][^"']*\bi[12]\b/i.test(tag) &&
      /title=["']hu["']/i.test(tag) &&
      /\.mp3/i.test(tag),
  );
  const href = audioAnchor?.match(/href=["']([^"']+\.mp3)["']/i)?.[1];
  return href ? new URL(href, pageUrl).href : null;
};

const fetchWithRetry = async (url) => {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (response.status !== 429 || attempt === retries) return response;
    await response.body?.cancel();
    await sleep(delayMs * (attempt + 2));
  }
};

const audio = {};
for (const word of words) {
  const pageUrl = `https://dictzone.com/dictionar-maghiar-roman/${encodeURIComponent(word)}`;
  try {
    const response = await fetchWithRetry(pageUrl);
    const html = await response.text();
    audio[word] = findHungarianMp3(html, pageUrl);
    console.error(`${audio[word] ? "OK" : "--"}\t${word}\t${audio[word] || ""}`);
    if (!audio[word]) {
      const phraseWords = word.match(/[\p{L}ŐőŰű]+/gu) || [];
      if (phraseWords.length > 1) {
        for (const phraseWord of phraseWords) words.add(phraseWord.toLocaleLowerCase("hu"));
      }
    }
  } catch (error) {
    audio[word] = null;
    console.error(`ERR\t${word}\t${error.message}`);
  }
  await sleep(delayMs);
}

const json = `${JSON.stringify(audio, null, 2)}\n`;
if (outputPath) {
  await writeFile(outputPath, json, "utf8");
  console.error(`Wrote ${Object.keys(audio).length} entries to ${outputPath}`);
} else {
  process.stdout.write(json);
}
