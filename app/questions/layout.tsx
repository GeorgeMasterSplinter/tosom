import { notFound } from 'next/navigation';

/**
 * Tosom — Spørsmålsiden (ikke offentlig)
 *
 * G-06b (beslutning 11.10): /questions skal ikke være offentlig — spørsmålene
 * er selve produktet, og siden er ikke lenket fra meny eller sitemap.
 * Datafilen beholdes: BliKjentPanel importerer spørsmålene fra den.
 * Sjekk kjører server-side i layouten.
 * I produksjon: 404 («Fant ikke siden»). I utvikling: siden fungerer som før.
 */
export default function QuestionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }
  return children;
}
