import type { Metadata } from "next";

// TC-11: betalings-state-rute — skal ikke indexeres.
// Siden er 'use client' og kan ikke eksportere metadata selv.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
