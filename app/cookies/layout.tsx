import type { Metadata } from "next";

// TC-08: per-route metadata — siden er 'use client' og kan ikke eksportere metadata selv.
export const metadata: Metadata = {
  title: "Cookies",
  description:
    "Hvilke cookies Tosom bruker, hvorfor, og hvordan du kan styre dem.",
  alternates: { canonical: "/cookies" },
  openGraph: {
    title: "Cookies",
    description:
      "Hvilke cookies Tosom bruker, hvorfor, og hvordan du kan styre dem.",
    url: "/cookies",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
