import type { Metadata } from "next";

// TC-11: reise-avslutning (personlig reiseinnhold) — skal ikke indexeres.
// Morsiden /reisen er offentlig og har egen index-metadata.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
