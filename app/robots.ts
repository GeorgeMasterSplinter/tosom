/* ═══════════════════════════════════════════
   ToSom — Robots.txt
   ═══════════════════════════════════════════ */

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: "https://tosom.no/sitemap.xml",
  };
}