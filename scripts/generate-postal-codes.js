#!/usr/bin/env node
/**
 * ToSom — B1.1: generer lib/geo/postalCodes.json fra Postens åpne register
 * (via carestad/norwegian-geodata, opphav: Posten Norge/Kartverket).
 *
 * Format: { "0150": { "sted": "OSLO", "lat": 59.89038, "lon": 10.71793 }, … }
 * - Alle ~5000 postnummer i registeret (keys > 4000).
 * - lat/lon = sentrumspunkt (senterpunkt) der eksisterende; ellers null
 *   (postboks/postkontor-koder uten stedsgeometri — sjeldent for gateadresser).
 * - Ingen eksternt API, ingen avhengighet, offline.
 *
 * Kjør: node scripts/generate-postal-codes.js <kilde.json>
 */
const fs = require('fs');
const path = require('path');

const src = process.argv[2];
if (!src || !fs.existsSync(src)) {
  console.error('Bruk: node scripts/generate-postal-codes.js <kilde.json>');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(src, 'utf8'));
const out = {};
let withCoords = 0;

for (const code of Object.keys(data)) {
  const rec = data[code];
  const sted = (rec.poststed || rec.kommune || '').toString();
  let lat = null;
  let lon = null;
  const sp = rec.senterpunkt;
  if (sp && Array.isArray(sp.coordinates) && sp.coordinates.length >= 2) {
    // GeoJSON Point: [lon, lat]
    lon = round5(sp.coordinates[0]);
    lat = round5(sp.coordinates[1]);
    withCoords++;
  }
  out[code] = { sted, lat, lon };
}

// Sorter keys numerisk for deterministisk fil
const sorted = {};
for (const k of Object.keys(out).sort()) sorted[k] = out[k];

const dest = path.join(__dirname, '..', 'lib', 'geo', 'postalCodes.json');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, JSON.stringify(sorted), 'utf8');

console.log(`Skrev ${dest}`);
console.log(`  keys: ${Object.keys(sorted).length}`);
console.log(`  med koordinat: ${withCoords}`);

function round5(n) {
  return Math.round(n * 100000) / 100000;
}