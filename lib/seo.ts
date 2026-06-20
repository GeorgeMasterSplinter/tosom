/* ═══════════════════════════════════════════
   ToSom — SEO Metadata Configuration
   Sentraliser metadata for alle sider
   ═══════════════════════════════════════════ */

import { Metadata } from "next";

const BASE_URL = "https://tosom.no";
const OG_IMAGE = `${BASE_URL}/og-image.png`;

/* ---------------------------------------------------------- */
/*  Base metadata (del for alle sider)                          */
/* ---------------------------------------------------------- */

export const baseMetadata: Metadata = {
  title: {
    default: "ToSom — En rolig plass for ekte møter",
    template: "%s | ToSom",
  },
  description:
    "ToSom er bygd for deg som ønsker dypere forbindelse — en trygg, moden og rolig vei mot ekte relasjoner.",
  keywords: ["dating", "par", "relasjoner", "norsk", "premium", "match", "kjærlighet"],
  authors: [{ name: "ToSom Team" }],
  creator: "ToSom",
  publisher: "ToSom",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "no_NO",
    siteName: "ToSom",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "ToSom — Ekte møter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tosom_no",
    creator: "@tosom_no",
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

/* ---------------------------------------------------------- */
/*  Page-specific metadata                                      */
/* ---------------------------------------------------------- */

export const landingMetadata: Metadata = {
  title: "ToSom — En rolig plass for ekte møter",
  description:
    "Oppdag mennesker som matcher din resonans. ToSom bruker dyp matchning for ekte forbindelser.",
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "ToSom — En rolig plass for ekte møter",
    url: BASE_URL,
  },
};

export const onboardingMetadata: Metadata = {
  title: "Kom i gang — ToSom",
  description:
    "Fyll ut profilen din og finn mennesker som matcher dine verdier og interesser.",
  alternates: { canonical: `${BASE_URL}/onboarding` },
  openGraph: {
    title: "Kom i gang | ToSom",
    url: `${BASE_URL}/onboarding`,
  },
};

export const loginMetadata: Metadata = {
  title: "Logg inn — ToSom",
  description: "Logg inn på ToSom og fortsett reisen din mot ekte relasjoner.",
  alternates: { canonical: `${BASE_URL}/login` },
  openGraph: {
    title: "Logg inn | ToSom",
    url: `${BASE_URL}/login`,
  },
};

export const dashboardMetadata: Metadata = {
  title: "Dashboard — ToSom",
  description: "Oversikt over dine matcher, samtaler og fremgang på ToSom.",
  alternates: { canonical: `${BASE_URL}/dashboard` },
  openGraph: {
    title: "Dashboard | ToSom",
    url: `${BASE_URL}/dashboard`,
  },
};

export const matchMetadata: Metadata = {
  title: "Finn din match — ToSom",
  description:
    "Oppdag mennesker som matcher din resonans. ToSom bruker dyp matchning for ekte forbindelser.",
  alternates: { canonical: `${BASE_URL}/match` },
  openGraph: {
    title: "Finn din match | ToSom",
    url: `${BASE_URL}/match`,
  },
};

export const chatMetadata: Metadata = {
  title: "Samtaler — ToSom",
  description: "Håndter dine samtaler og møter med dine matches.",
  alternates: { canonical: `${BASE_URL}/chat` },
  openGraph: {
    title: "Samtaler | ToSom",
    url: `${BASE_URL}/chat`,
  },
};

export const journeyMetadata: Metadata = {
  title: "Din reise — ToSom",
  description:
    "Følg fremgangen din og oppdaga nye måter å komme dypere inn i relasjoner på.",
  alternates: { canonical: `${BASE_URL}/journey` },
  openGraph: {
    title: "Din reise | ToSom",
    url: `${BASE_URL}/journey`,
  },
};

export const profileMetadata: Metadata = {
  title: "Profil — ToSom",
  description: "Rediger profilen din og oppdater dine preferanser.",
  alternates: { canonical: `${BASE_URL}/profile/edit` },
  openGraph: {
    title: "Profil | ToSom",
    url: `${BASE_URL}/profile/edit`,
  },
};

/* ---------------------------------------------------------- */
/*  AI-specific metadata                                        */
/* ---------------------------------------------------------- */

export const aiMatchInsightsMetadata: Metadata = {
  title: "AI Match Insights — ToSom",
  description:
    "Få AI-genererte innsikter om dine matcher. Styrker, utfordringer og samtaletema basert på dybdeanalyse.",
  alternates: { canonical: `${BASE_URL}/match/insights` },
  openGraph: {
    title: "AI Match Insights | ToSom",
    url: `${BASE_URL}/match/insights`,
  },
};

export const aiProfileRewriteMetadata: Metadata = {
  title: "AI Profilforbedring — ToSom",
  description:
    "La AI forbedre profilen din med tre ulike toner: rolig, lekende og moden.",
  alternates: { canonical: `${BASE_URL}/profile/ai-rewrite` },
  openGraph: {
    title: "AI Profilforbedring | ToSom",
    url: `${BASE_URL}/profile/ai-rewrite`,
  },
};

export const aiJourneyMetadata: Metadata = {
  title: "AI Journey Guide — ToSom",
  description:
    "Få personlige anbefalinger for din relasjonsreise basert på AI-analyse.",
  alternates: { canonical: `${BASE_URL}/journey/ai-guide` },
  openGraph: {
    title: "AI Journey Guide | ToSom",
    url: `${BASE_URL}/journey/ai-guide`,
  },
};

/* ---------------------------------------------------------- */
/*  Relationship page metadata                                  */
/* ---------------------------------------------------------- */

export const relationshipTimelineMetadata: Metadata = {
  title: "Relasjonsreise — ToSom",
  description:
    "Se relasjonens utvikling over tid med timeline, milepæler og felles minner.",
  alternates: { canonical: `${BASE_URL}/journey/timeline` },
  openGraph: {
    title: "Relasjonsreise | ToSom",
    url: `${BASE_URL}/journey/timeline`,
  },
};

export const relationshipMemoriesMetadata: Metadata = {
  title: "Felles Minner — ToSom",
  description:
    "Del og lagre deres felles øyeblikk med bilder og notater.",
  alternates: { canonical: `${BASE_URL}/journey/memories` },
  openGraph: {
    title: "Felles Minner | ToSom",
    url: `${BASE_URL}/journey/memories`,
  },
};

export const relationshipGraphMetadata: Metadata = {
  title: "Relasjonskart — ToSom",
  description:
    "Visualiser deres relasjonsdynamikk med interaktivt nettverk av matcher, minner og meldinger.",
  alternates: { canonical: `${BASE_URL}/journey/graph` },
  openGraph: {
    title: "Relasjonskart | ToSom",
    url: `${BASE_URL}/journey/graph`,
  },
};

/* ---------------------------------------------------------- */
/*  Admin metadata                                              */
/* ---------------------------------------------------------- */

export const adminMetadata: Metadata = {
  title: "Admin — ToSom",
  description: "Administrasjonspanel for ToSom.",
  alternates: { canonical: `${BASE_URL}/admin` },
  robots: {
    index: false,
    follow: false,
  },
};

export const adminAnalyticsMetadata: Metadata = {
  title: "Analytics — ToSom Admin",
  description: "Se nøkkelmetrikker og AI-analyse.",
  alternates: { canonical: `${BASE_URL}/admin/analytics` },
  robots: {
    index: false,
    follow: false,
  },
};

export const adminExperimentsMetadata: Metadata = {
  title: "Eksperimenter — ToSom Admin",
  description: "Administrer feature flags og eksperimentelle funksjoner.",
  alternates: { canonical: `${BASE_URL}/admin/experiments` },
  robots: {
    index: false,
    follow: false,
  },
};