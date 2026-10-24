import type { Metadata } from "next";

// TC-08: per-route metadata — siden er 'use client' og kan ikke eksportere metadata selv.
// /login er i sitemap (eksisterende index-intent); registreringen skjer her via
// e-post, passord eller Vipps med auto-registrering (/register 307-redirect-er hit).
export const metadata: Metadata = {
  title: "Logg inn",
  description:
    "Logg inn på Tosom og fortsett reisen din.",
  alternates: { canonical: "/login" },
  openGraph: {
    title: "Logg inn",
    description: "Logg inn på Tosom og fortsett reisen din.",
    url: "/login",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
