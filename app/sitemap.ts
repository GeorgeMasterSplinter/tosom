/* ═══════════════════════════════════════════
   Tosom — Sitemap
   ═══════════════════════════════════════════

   Kun offentlige sider (V-14). Private sider (dashboard, profile,
   onboarding, chat m.m.) skal IKKE indexeres av søkemotorer. */

const BASE_URL = "https://tosom.no";

/** Offentlige sider — den eneste listen som får stå i sitemap. */
const OFFENTLIGE_SIDER = [
  { path: "/", priority: 1.0 },
  { path: "/hvorfor", priority: 0.8 },
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
  { path: "/vilkår", priority: 0.5 },
  { path: "/personvern", priority: 0.5 },
  { path: "/cookies", priority: 0.5 },
  { path: "/login", priority: 0.3 },
];

export default function sitemap() {
  const lastModified = new Date();
  return OFFENTLIGE_SIDER.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority,
  }));
}