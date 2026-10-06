import "@/styles/globals.css";
import "@/styles/animated.css";
import { Inter } from "next/font/google";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { UniversalMenu } from '@/components/layout/UniversalMenu';
import { ContentWrapper } from '@/components/layout/ContentWrapper';
import { SentryErrorBoundary } from "@/components/system/SentryErrorBoundary";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { COMPANY } from "@/config/legal";

const BESKRIVELSE =
  "Tosom er en rolig, privat plattform for ekte relasjoner. Én gjennomtenkt match i uken, én guidet 30-dagers reise, og et trygt sted å bli kjent. For voksne 21+.";

const JSONLD_ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.name,
  url: "https://tosom.no",
  email: COMPANY.email,
  ...(COMPANY.orgNumber ? { identifier: COMPANY.orgNumber } : {}),
  address: {
    "@type": "PostalAddress",
    addressCountry: "NO",
    ...(COMPANY.address ? { streetAddress: COMPANY.address } : {}),
  },
};

const JSONLD_WEBSITE = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Tosom",
  url: "https://tosom.no",
  description: BESKRIVELSE,
  inLanguage: "no",
};

// PL-16 (V-7): Inter selvhostet via next/font — lastes ved build og serveres
// fra /_next/static/media (CSP: font-src 'self'). Erstattet de eksterne
// fonts.googleapis.com/fonts.gstatic.com-lenkene. display: swap — samme
// oppførsel som den gamle Google Fonts CSS-en.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  metadataBase: new URL("https://tosom.no"),
  title: "Tosom — En rolig plass for ekte møter",
  description: BESKRIVELSE,
  alternates: {
    canonical: "/",
  },
  keywords: ["par", "relasjoner", "norsk", "premium"],
  authors: [{ name: "Tosom Team" }],
  creator: "Tosom",
  publisher: "Tosom",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Tosom — En rolig plass for ekte møter",
    description: BESKRIVELSE,
    type: "website",
    url: "/",
    siteName: "Tosom",
    locale: "no_NO",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tosom — Ekte møter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tosom — En rolig plass for ekte møter",
    description: BESKRIVELSE,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" dir="ltr" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Tosom" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0A0F1F" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_ORGANIZATION) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_WEBSITE) }}
        />
      </head>
      <body className="bg-[linear-gradient(180deg,#0B1520,#121E2E,#0B1520)] text-[var(--ts-text-primary)] antialiased relative">
        {/* Global ambient glow — Deep Blue */}
        <div
          className="fixed inset-0 pointer-events-none z-[1]"
          style={{
            background: 'radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(80,120,255,0.04),transparent_70%)',
            filter: 'blur(120px)',
          }}
        />
        <SentryErrorBoundary>
          <AnalyticsProvider />
          <UniversalMenu />
          <ContentWrapper>{children}</ContentWrapper>
        </SentryErrorBoundary>
        <SpeedInsights />
      </body>
    </html>
  );
}