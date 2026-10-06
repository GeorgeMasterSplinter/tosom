import { notFound } from 'next/navigation';

/**
 * Tosom — Design-system-siden (internt)
 *
 * PL-20: internt audit-verktøy som ikke skal være tilgjengelig for brukere.
 * Sjekk kjører server-side i layouten siden sidefilen er 'use client'.
 * I produksjon: 404 («Fant ikke siden»). I utvikling: verktøyet fungerer som før.
 */
export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }
  return children;
}