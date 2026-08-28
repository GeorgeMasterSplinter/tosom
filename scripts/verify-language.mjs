#!/usr/bin/env node
/**
 * verify-language.mjs — språkvakt (bokmål)
 *
 * SPEILER CI-jobben `lang-guard` i .github/workflows/ci.yml EKSAKT.
 *
 * Bakgrunn: den gamle versjonen brukte en kortere ordliste (12 ord), skannet
 * kun .tsx i app/ + components/, og hoppet over kommentarlinjer. Den var
 * derfor grønn samtidig som CI var rød — nynorsk rakk to ganger å nå main
 * (A8 25.08, og igjen med CHAT-POLISH 28.08, denne gangen i brukervendt
 * tekst som «meldinga er ikkje send»).
 *
 * Regelen er bokmål OVERALT: brukerflate, dokumentasjon, kodekommentarer og
 * commit-meldinger (README §Språkprofil, ACT-PIPELINE §5.5). Kommentarer
 * unntas derfor IKKE.
 *
 * Kjør: npm run verify:lang
 * exit 0 = ingen treff · exit 1 = treff funnet
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ── Ordlisten ───────────────────────────────────────────────
// CI kaller dette skriptet (ci.yml → lang-guard), så dette er ÉN kilde.
// Matchingen er case-insensitiv: «Brukar»/«Berre»/«Ikkje» med stor forbokstav
// slapp gjennom den gamle case-sensitive CI-regexen i månedsvis.
const NYNORSK_WORDS = [
  // Opprinnelig CI-liste
  "ikkje", "berre", "kva", "kvarandre", "avslutta", "sjå",
  "nokon", "korleis", "påverka", "mykje", "allereie", "funnen",
  "brukar", "brukarar", "brukarane",
  // Lagt til 2026-08-28: en bredere liste avdekket 322 treff som den
  // opprinnelige listen ikke fanget — flere i brukervendt tekst.
  "frå", "vere", "verta", "kjem", "finst", "sjølv", "sjølve",
  "nokre", "noko", "difor", "medan", "utan", "innan", "gjev",
  "eigen", "eiga", "eigne", "kjelde", "kjelda",
  "meldinga", "samtalar", "samtalane", "djupare", "djupne",
  "dukkar", "aukar", "mognar", "teikn", "heilt", "meir",
  "fleire", "enno", "gjekk", "vart", "gonger",
  "framleis", "attende", "manglande", "påkrava",
  "setjast", "seinare", "innhald", "fløya", "lagast", "skapar",
];
const EXTRA_PATTERNS = ["ver vennleg"];

// Unntak: lagrede dataverdier som ikke kan endres uten datamigrering
// (verdien ligger allerede i profiler i databasen).
const ALLOWED_LINE = [
  /value:\s*'roleg'/,
];

// Samme kataloger som CI
const SCAN_DIRS = ["app", "lib", "components", "hooks", "providers"];
// Samme filtyper som grep i CI (som leser alt) — vi begrenser til kildefiler
const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs"];
const SKIP_DIRS = new Set(["node_modules", ".next", "dist", "build"]);

const pattern = new RegExp(
  `(\\b(${NYNORSK_WORDS.join("|")})\\b|${EXTRA_PATTERNS.join("|")})`,
  "gi"
);

function walkDir(dir, results = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return results; }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) {
      walkDir(full, results);
    } else if (EXTENSIONS.some((e) => entry.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

const files = SCAN_DIRS.map((d) => join(ROOT, d)).flatMap((d) => walkDir(d));
const hits = [];

for (const file of files) {
  let content;
  try { content = readFileSync(file, "utf-8"); } catch { continue; }
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    // MERK: kommentarlinjer skannes med vilje — bokmål gjelder overalt.
    if (ALLOWED_LINE.some((re) => re.test(lines[i]))) continue;

    pattern.lastIndex = 0;
    let m;
    while ((m = pattern.exec(lines[i])) !== null) {
      hits.push({
        file: relative(ROOT, file),
        line: i + 1,
        word: m[0],
        text: lines[i].trim().slice(0, 90),
      });
    }
  }
}

if (hits.length > 0) {
  console.error(`\n✗ Språkvakt: ${hits.length} nynorsk-treff (bokmål kreves overalt)\n`);
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}  →  "${h.word}"`);
    console.error(`      ${h.text}`);
  }
  console.error(`\n  CI-jobben lang-guard vil feile på dette, og siden CD er`);
  console.error(`  gated på grønn CI blokkerer det deploy. Rett før du pusher.\n`);
  process.exit(1);
}

console.log(`✓ Språkvakt: ingen nynorsk-treff (${files.length} filer skannet).`);
process.exit(0);
