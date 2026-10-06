import { notFound } from 'next/navigation';

/**
 * Tosom — Bloggen (avpublisert, D-9)
 *
 * PL-21: bloggen skal ikke være tilgjengelig i produksjon før innholdet er
 * omskrevet etter lansering. Artikkelfilene beholdes — kun tilgangen stenges.
 * Sjekk kjører server-side i layouten siden sidefilene er 'use client', og
 * dekker både bloggforsiden og artikkelssidene ([slug]).
 * I produksjon: 404 («Fant ikke siden»). I utvikling: bloggen fungerer som før.
 */
export default function BloggLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }
  return children;
}