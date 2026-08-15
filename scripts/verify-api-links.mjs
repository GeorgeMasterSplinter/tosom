#!/usr/bin/env node
/**
 * verify-api-links.mjs — ST2.3
 *
 * Finn alle fetch('/api/…') i app/, components/ og hooks/.
 * Kryss dem mot faktiske route.ts-filer under app/api/.
 * Håndter dynamiske segmenter ([id], [...catch-all]).
 * Ignorer NextAuth-stier (/api/auth/).
 *
 * exit 0 = ingen brutte kall
 * exit 1 = ett eller flere brutte kall
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ─── 1. Samle alle route.ts-filer og deres URL-stier ────────────────────────

function collectRouteFiles(dir, prefix = "") {
  const results = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return results;
  }
  for (const entry of entries) {
    if (entry === "route.ts") {
      results.push(prefix); // prefix is the URL path (e.g. /api/chat/conversation/[conversationId])
      continue;
    }
    const full = join(dir, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      results.push(...collectRouteFiles(full, prefix + "/" + entry));
    }
  }
  return results;
}

const apiDir = join(ROOT, "app", "api");
const routePaths = collectRouteFiles(apiDir, "/api");

// ─── 2. Finn alle fetch-kall i app/, components/, hooks/ ───────────────────

function walkDir(dir, exts = [".ts", ".tsx"]) {
  const results = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return results;
  }
  for (const entry of entries) {
    if (entry === "node_modules" || entry === ".next" || entry === "__tests__") continue;
    const full = join(dir, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      results.push(...walkDir(full, exts));
    } else if (exts.some((e) => entry.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

const scanDirs = ["app", "components", "hooks"].map((d) => join(ROOT, d));
const files = scanDirs.flatMap((d) => walkDir(d));

// Regex to find fetch('/api/...'), fetch("/api/..."), fetch(`/api/...`)
const fetchRegex = /fetch\(\s*(["'`])(\/api\/[^"'`?]*)(?:[?${][^"'`]*)?\1/g;

const brokenCalls = [];

for (const file of files) {
  let content;
  try {
    content = readFileSync(file, "utf-8");
  } catch {
    continue;
  }
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    let m;
    const line = lines[i];
    fetchRegex.lastIndex = 0;
    while ((m = fetchRegex.exec(line)) !== null) {
      const fetchPath = m[2]; // e.g. /api/chat/conversation/abc or /api/match/breakdown

      // Ignore NextAuth routes
      if (fetchPath.startsWith("/api/auth/")) continue;

      // Check if this path matches any route
      if (!matchesRoute(fetchPath, routePaths)) {
        brokenCalls.push({
          file: relative(ROOT, file),
          line: i + 1,
          path: fetchPath,
        });
      }
    }
  }
}

// ─── 3. Matching logikk ────────────────────────────────────────────────────

function matchesRoute(urlPath, routePaths) {
  const urlSegments = urlPath.split("/").filter(Boolean);

  for (const routePath of routePaths) {
    const routeSegments = routePath.split("/").filter(Boolean);

    if (urlSegments.length !== routeSegments.length) continue;

    let allMatch = true;
    for (let i = 0; i < urlSegments.length; i++) {
      const rSeg = routeSegments[i];
      const uSeg = urlSegments[i];

      // Catch-all: [...rest] matches any segment at this position
      if (rSeg.startsWith("[...")) {
        return true; // rest matches anything
      }
      // Dynamic segment: [id], [conversationId] — matches any value
      if (rSeg.startsWith("[") && rSeg.endsWith("]")) {
        continue; // any value matches
      }
      // Template literal variable in URL: ${...} — matches any segment
      if (uSeg.startsWith("${")) {
        continue;
      }
      // Static match
      if (rSeg !== uSeg) {
        allMatch = false;
        break;
      }
    }
    if (allMatch) return true;
  }
  return false;
}

// ─── 4. Rapport ────────────────────────────────────────────────────────────

if (brokenCalls.length > 0) {
  console.error(`\n✗ ${brokenCalls.length} brutt(e) API-kall funnet:\n`);
  for (const call of brokenCalls) {
    console.error(`  ${call.file}:${call.line}  →  ${call.path}`);
  }
  console.error("");
  process.exit(1);
} else {
  console.log("✓ Alle API-kall matcher eksisterende ruter.");
  process.exit(0);
}