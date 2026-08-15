import "@/styles/globals.css";
import "@/styles/animated.css";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { UniversalMenu } from '@/components/layout/UniversalMenu';
import { SentryErrorBoundary } from "@/components/system/SentryErrorBoundary";

export const metadata = {
  title: "ToSom — En rolig plass for ekte møter",
  description: "ToSom er en rolig, moden plattform for ekte relasjoner og guidede reiser for par.",
  keywords: ["dating", "par", "relasjoner", "norsk", "premium"],
  authors: [{ name: "ToSom Team" }],
  creator: "ToSom",
  publisher: "ToSom",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "ToSom — En rolig plass for ekte møter",
    description: "ToSom er en rolig, moden plattform for ekte relasjoner og guidede reiser for par.",
    type: "website",
    url: "https://tosom.no",
    siteName: "ToSom",
    locale: "no_NO",
    images: [
      {
        url: "https://tosom.no/og-image.png",
        width: 1200,
        height: 630,
        alt: "ToSom — Ekte møter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToSom — En rolig plass for ekte møter",
    description: "ToSom er en rolig, moden plattform for ekte relasjoner og guidede reiser for par.",
    images: ["https://tosom.no/og-image.png"],
  },
  verification: {
    google: "google-site-verification",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#0A0F1F" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
          <div className="pt-[64px]">
            {children}
          </div>
        </SentryErrorBoundary>
      </body>
    </html>
  );
}