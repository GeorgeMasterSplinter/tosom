import { notFound } from 'next/navigation';

/**
 * Tosom — Vipps-registrering (placeholder)
 *
 * PL-20: Vipps er ikke tilkoblet (sjekklisten §5, G-25) — siden skal ikke
 * være tilgjengelig i produksjon før da. Sjekk kjører server-side i layouten
 * siden sidefilen er 'use client'. I produksjon: 404. I utvikling:
 * placeholderen fungerer som før.
 */
export default function VippsRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }
  return children;
}