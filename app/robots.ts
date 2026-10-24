/* ═══════════════════════════════════════════
   Tosom — Robots.txt
   ═══════════════════════════════════════════
   Policy: tillat alle crawlere (inkludert AI), blokkér bare /admin og /api.
   ToSom har ingenting å skjule for søk — men admin og API skal aldri
   indekseres. Hvis AI-crawlere skal blokkeres, er det en produktbeslutning
   som krever eksplisitte regler over * (GPTBot, Google-Extended, etc.).
   ═══════════════════════════════════════════ */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
    ],
    // TC-09 (prod-verifisert 26.10.2026): kanonisk host er www.tosom.no.
    sitemap: "https://www.tosom.no/sitemap.xml",
  };
}