#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error(`Usage: ${path.basename(process.argv[1])} <page.html> [...]`);
  process.exit(2);
}

let failed = false;
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const scripts = [
    ...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi),
  ].filter(
    (match) =>
      !/\bsrc\s*=/i.test(match[1]) &&
      !/\btype\s*=\s*["']application\/ld\+json["']/i.test(match[1]),
  );

  if (scripts.length === 0) {
    console.log(`${file}: no executable inline scripts`);
    continue;
  }

  scripts.forEach((match, index) => {
    const isModule = /\btype\s*=\s*["']module["']/i.test(match[1]);
    const result = spawnSync(
      process.execPath,
      ["--check", `--input-type=${isModule ? "module" : "commonjs"}`],
      {
        input: match[2],
        encoding: "utf8",
      },
    );
    if (result.status === 0)
      console.log(`${file}: inline script ${index + 1} is valid`);
    else {
      failed = true;
      console.error(`${file}: inline script ${index + 1} is invalid`);
      process.stderr.write(result.stderr);
    }
  });
}

process.exitCode = failed ? 1 : 0;
