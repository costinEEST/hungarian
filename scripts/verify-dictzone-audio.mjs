#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import process from "node:process";

const args = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};
const sourcePath = valueAfter("--source") || "alfabet-maghiar.html";
const onlyWord = valueAfter("--word");
const delayMs = Number(valueAfter("--delay") || 1500);
const retries = Number(valueAfter("--retries") || 2);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const source = await readFile(sourcePath, "utf8");
const script = source.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!script) throw new Error(`No inline <script> found in ${sourcePath}`);
const mapStart = script.indexOf("const DICTZONE_AUDIO");
const mapEnd = script.indexOf("const speakerIcon");
if (mapStart === -1 || mapEnd === -1) throw new Error("Could not locate DICTZONE_AUDIO.");
const audio = new Function(`${script.slice(mapStart, mapEnd)}; return DICTZONE_AUDIO;`)();
const entries = onlyWord
  ? Object.entries(audio).filter(([word]) => word.toLocaleLowerCase("hu") === onlyWord.toLocaleLowerCase("hu"))
  : Object.entries(audio);

if (!entries.length) {
  console.error(`No audio mapping found for: ${onlyWord}`);
  process.exit(2);
}

let failures = 0;
for (const [word, url] of entries) {
  let result;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const contentType = response.headers.get("content-type") || "";
    result = { response, contentType };
    await response.body?.cancel();
    if (response.status !== 429 || attempt === retries) break;
    await sleep(delayMs * (attempt + 2));
  }

  const valid = result.response.ok && result.contentType.toLowerCase().startsWith("audio/");
  if (!valid) failures += 1;
  console.log(
    `${valid ? "OK" : "BAD"}\t${word}\t${result.response.status}\t${result.contentType}\t${result.response.url}`,
  );
  await sleep(delayMs);
}

if (failures) {
  console.error(`${failures} of ${entries.length} audio URLs did not return audio.`);
  process.exitCode = 1;
} else {
  console.error(`Verified ${entries.length} audio URL${entries.length === 1 ? "" : "s"}.`);
}
