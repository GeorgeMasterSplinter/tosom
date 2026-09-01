#!/usr/bin/env node
/**
 * verify-language.mjs — språkvakt (bokmål)
 *
 * ÉN KILDE for CI: jobben `lang-guard` i .github/workflows/ci.yml kaller
 * `npm run verify:lang`, som kjører dette skriptet.
 *
 * Regelen er bokmål OVERALT: brukerflate, dokumentasjon, kodekommentarer,
 * commit-meldinger — og agentenes svar i chatten (se ai/system_prompt.md §2,
 * README §Språkprofil, GEORGE.md §12).
 *
 * Historikk:
 * - 2026-08-27: opprinnelig liste (12 ord, bare .tsx i app/+components/).
 * - 2026-08-28: bredere liste; nynorsk hadde rakk to ganger å nå main.
 * - 2026-09-01: BOKMÅL-KAMPANJEN. Full inventar avdekket 515 nynorsk-treff
 *   som den gamle listen ikke fanget. Listen ble utvidet med ~50 ord,
 *   scan-området utvidet til scripts/, e2e/, docs/ og rotnivåets .md-filer,
 *   og bugen der «gikk» (korrekt bokmål!) ble flagget ble fjernet.
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
// Matchingen er case-insensitiv: «Bruker»/«Bare»/«Ikke» med stor forbokstav
// slapp gjennom den gamle case-sensitive CI-regexen i månedsvis.
// NB: listen inneholder kun uniktive nynorsk-ord. Bokmål-ord som «gikk»,
// «måte», «tilbakemelding», «de», «finn», «får», «no», «over» og
// «kriterium/kriteria» må IKKE på listen — de er gyldig bokmål
// (eventuelt for risikable pga. .no-adresser). «tilbakemeldingar» (flertall)
// derimot er nynorsk — bokmål er «tilbakemeldinger».
const NYNORSK_WORDS = [
  // Opprinnelig CI-liste (2026-08-27)
  "ikkje", "berre", "kva", "kvarandre", "avslutta", "sjå",
  "nokon", "korleis", "påverka", "mykje", "allereie", "funnen",
  "brukar", "brukarar", "brukarane",
  // Utvidet 2026-08-28
  "frå", "vere", "verta", "kjem", "finst", "sjølv", "sjølve",
  "nokre", "noko", "difor", "medan", "utan", "innan", "gjev",
  "eigen", "eiga", "eigne", "kjelde", "kjelda",
  "meldinga", "samtalar", "samtalane", "djupare", "djupne",
  "dukkar", "aukar", "mognar", "teikn", "heilt", "meir",
  "fleire", "enno", "vart", "gonger",
  "framleis", "attende", "manglande", "påkrava",
  "setjast", "seinare", "innhald", "fløya", "lagast", "skapar",
  // BOKMÅL-KAMPANJEN 2026-09-01: ord den gamle listen slapp gjennom
  // (kilden: inventar over 515 treff i hele repoet).
  "manglar", "funne", "slettar", "gjere", "heldt", "held", "halde",
  "lykkast", "dekkjer", "tillating", "deim", "deira", "deires",
  "kvifor", "kann", "røyst", "røystene", "røstar", "røsta",
  "ønskje", "ønskja", "ønskjer", "sørgjer", "sørgje", "visar",
  "planar", "prisar", "moglegheit", "mogelege", "velje", "rettleia",
  "dagar", "dypare", "meldingar", "aldrig", "nærare",
  "tilbakemeldingar", "gjeld", "eitt",
  "prata", "trivst", "heim", "bilet", "saman",
  "samanlikn", "samanlikning", "samanlikna", "samanliknar",
  "samanlikne", "verknad", "søkje", "setje",
  "velkomne", "velkomen", "gjøremål", "djupe",
  // Runde 3 (2026-09-01): ord avdekket under manuelle språksjekker
  "påverknad", "høgre", "inneheld", "bilete", "sjåast", "sterkast",
  "forståing", "oppgåver", "refleksjonar", "svakeleik", "kven",
  "røter", "gje", "tidleg", "endringar", "knappar",
  "éin", "typar", "spørrsmål", "nærheit", "roleg", "verdiar",
  "kjærleik", "detaljar", "bustad", "hovud", "kvardag", "kvardags",
  "personlegdom", "begrensingar", "opplevast",
  // Runde 4 (2026-09-02): fullt omkrav av journey-seed + testfiler
  // NB: «fortelle» er gyldig bokmål (infinitiv) — IKKE på listen.
  "fortel", "kjensler", "kjensle", "kjenslar",
  "stjela", "stundane", "tinga",
];
// NB: «gikk» (fra 08-28-listen) er fjernet — det er korrekt bokmål.
const EXTRA_PATTERNS = ["ver vennleg", "ver glad"];

// Unntak: lagrede dataverdier som ikke kan endres uten datamigrering
// (verdien ligger allerede i profiler i databasen).
const ALLOWED_LINE = [
  /value:\s*'roleg'/,
];

// Skanningsområde: bokmål gjelder overalt — kode, scripts, e2e og docs.
const SCAN_DIRS = ["app", "lib", "components", "hooks", "providers", "scripts", "e2e", "__tests__", "ai", "docs"];
const ROOT_FILES = ["GEORGE.md", "README.md"];
const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".md"];
const SKIP_DIRS = new Set(["node_modules", ".next", "dist", "build"]);
// Vakten selv inneholder nynorsk-ord i ordlisten — den skal ikke skannes.
const SKIP_FILES = new Set(["scripts/verify-language.mjs"]);
// Referanseblokker (f.eks. forbudte-ord-tabellen i ai/system_prompt.md)
// inneholder med vilje nynorsk-ord som EKSEMPLER. Linjer mellom
// SPRAKREF-START og SPRAKREF-END skannes ikke.
const REF_START = "SPRAKREF-START";
const REF_END = "SPRAKREF-END";

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
    const rel = relative(ROOT, full).split("\\").join("/");
    if (st.isDirectory()) {
      walkDir(full, results);
    } else if (EXTENSIONS.some((e) => entry.endsWith(e)) && !SKIP_FILES.has(rel)) {
      results.push(full);
    }
  }
  return results;
}

const files = [
  ...SCAN_DIRS.map((d) => join(ROOT, d)).flatMap((d) => walkDir(d)),
  ...ROOT_FILES.map((f) => join(ROOT, f)).filter((f) => {
    try { return statSync(f).isFile(); } catch { return false; }
  }),
];
const hits = [];

for (const file of files) {
  let content;
  try { content = readFileSync(file, "utf-8"); } catch { continue; }
  const lines = content.split("\n");

  let inRefBlock = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(REF_START)) { inRefBlock = true; continue; }
    if (lines[i].includes(REF_END)) { inRefBlock = false; continue; }
    if (inRefBlock) continue;
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
