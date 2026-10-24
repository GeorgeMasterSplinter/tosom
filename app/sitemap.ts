/* ═══════════════════════════════════════════
   Tosom — Sitemap
   ═══════════════════════════════════════════

   Kun offentlige sider (V-14). Private sider (dashboard, profile,
   onboarding, chat m.m.) skal IKKE indexeres av søkemotorer. */

// TC-09 (prod-verifisert 26.10.2026): kanonisk host er www — https://tosom.no
// 307-redirect-er til https://www.tosom.no (som leverer appen, 200).
const BASE_URL = "https://www.tosom.no";

/** Offentlige sider — den eneste listen som får stå i sitemap. */
const OFFENTLIGE_SIDER = [
  { path: "/", priority: 1.0 },
  { path: "/hvorfor", priority: 0.8 },
  // ACT MOTPOL (D3): offentlig, indexable — filosofi-siden «hvorfor er det slik?»
  { path: "/motpol", priority: 0.7 },
  { path: "/slik-fungerer-det", priority: 0.8 },
  { path: "/reisen", priority: 0.8 },
  { path: "/metoder", priority: 0.8 },
  { path: "/tips", priority: 0.8 },
  { path: "/priser", priority: 0.8 },
  { path: "/trygghet", priority: 0.8 },
  { path: "/faq", priority: 0.8 },
  { path: "/om-oss", priority: 0.8 },
  { path: "/kontakt", priority: 0.5 },
  { path: "/tilgjengelighet", priority: 0.5 },
  { path: "/vilkar", priority: 0.5 },
  { path: "/personvern", priority: 0.5 },
  { path: "/cookies", priority: 0.5 },
  { path: "/login", priority: 0.3 },
];

// TC-10: kanonisk sti er /vilkar (/vilkår 301-redirect-er hit via middleware).
// Ingen lastModified: ingen faktisk «sist endret»-dato finnes i systemet —
// new Date() ved hvert build ville vært misvisende.
export default function sitemap() {
  return OFFENTLIGE_SIDER.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority,
  }));
}