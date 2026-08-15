#!/usr/bin/env node
/**
 * verify-language.mjs — ST4.1
 *
 * Søk i app/ og components/, kun .tsx
 * Ordliste med ordgrenser (word boundaries)
 * exit 0 = ingen treff
 * exit 1 = treff funnet
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Nynorsk-ord med ordgrenser
const NYNORSK_WORDS = [
  "ikkje", "korleis", "sjølv", "sjølve", "kjem", "finst",
  "fjernar", "Samtalar", "djupare", "eine", "kjelda", "nokon",
];

// Bygg regex med ordgrenser (case-sensitive for alle)
const pattern = new RegExp(`\\b(${NYNORSK_WORDS.join("|")})\\b`, "g");

function walkDir(dir, results = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return results; }
  for (const entry of entries) {
    if (entry === "node_modules" || entry === ".next" || entry === "__tests__") continue;
    const full = join(dir, entry);
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) {
      walkDir(full, results);
    } else if (entry.endsWith(".tsx")) {
      results.push(full);
    }
  }
  return results;
}

const scanDirs = ["app", "components"].map(d => join(ROOT, d));
const files = scanDirs.flatMap(d => walkDir(d));

const hits = [];

for (const file of files) {
  let content;
  try { content = readFileSync(file, "utf-8"); } catch { continue; }
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    // Skip comment lines (start with // or *)
    const trimmed = lines[i].trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;

    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(lines[i])) !== null) {
      hits.push({
        file: relative(ROOT, file),
        line: i + 1,
        word: m[1],
      });
    }
  }
}

if (hits.length > 0) {
  console.error(`\n✗ ${hits.length} nynorsk-treff i .tsx-filer:\n`);
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}  →  "${h.word}"`);
  }
  console.error("");
  process.exit(1);
} else {
  console.log("✓ Ingen nynorsk-treff i .tsx-filer.");
  process.exit(0);
}
