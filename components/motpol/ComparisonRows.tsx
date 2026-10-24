/**
 * Tosom — ComparisonRows (ACT MOTPOL)
 *
 * Én liten presentasjonskomponent for motpol-sidens sammenligningsseksjon
 * (plan §8.13): to kolonner — «En vanlig modell» ↔ «Tosom».
 *
 * Tilgjengelighet (plan §19):
 * - Semantisk <dl>/<dt>/<dd>: hvert element leser som «Etikett: tekst».
 * - Ingen informasjon kun via farge: etiketten er alltid til stede
 *   (synlig på mobil, sr-kun på desktop der kolonnehode bærer konteksten).
 * - Ingen hover-avhengighet, ingen JS, ingen animasjon.
 * - Mobil først: én kolonne (grid-cols-1), desktop: to (md:grid-cols-2).
 *
 * Ingen dependencies. Ingen 'use client' (ren server-renderbar komponent).
 */

import React from 'react';

export interface ComparisonRow {
  /** Venstre kolonne: den generiske modellen (aldri en tjenestes navn). */
  standard: string;
  /** Høyre kolonne: Tosom (PF påstander, plan §5). */
  tosom: string;
}

interface ComparisonRowsProps {
  rows: ComparisonRow[];
  /** Venstre kolonnens navn. Standard: «En vanlig modell». */
  standardLabel?: string;
  /** Høyre kolonnens navn. Standard: «Tosom». */
  tosomLabel?: string;
}

export function ComparisonRows({
  rows,
  standardLabel = 'En vanlig modell',
  tosomLabel = 'Tosom',
}: ComparisonRowsProps) {
  return (
    <dl
      aria-label={`Sammenligning: ${standardLabel} og ${tosomLabel}`}
      className="mx-auto max-w-4xl"
    >
      {/* Kolonnehoder — kun synlige på desktop (mobil bruker synlige etiketter per rad) */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-x-12">
        <h3
          className="text-xs uppercase tracking-[0.18em] font-semibold pb-4"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          {standardLabel}
        </h3>
        <h3
          className="text-xs uppercase tracking-[0.18em] font-semibold pb-4"
          style={{ color: 'rgba(212,175,55,0.8)' }}
        >
          {tosomLabel}
        </h3>
      </div>

      {rows.map((row) => (
        <div
          key={row.standard}
          className="grid grid-cols-1 gap-2 border-t border-white/[0.06] py-5 md:grid-cols-2 md:gap-x-12 md:py-6"
        >
          <div className="space-y-1">
            {/* Synlig etikett på mobil; sr-kun på desktop (kolonnehodet bærer konteksten) */}
            <dt
              className="text-[11px] uppercase tracking-[0.16em] font-medium md:sr-only"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              {standardLabel}
            </dt>
            <dd className="text-base leading-[1.6]" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {row.standard}
            </dd>
          </div>
          <div className="space-y-1">
            <dt
              className="text-[11px] uppercase tracking-[0.16em] font-medium md:sr-only"
              style={{ color: 'rgba(212,175,55,0.7)' }}
            >
              {tosomLabel}
            </dt>
            <dd
              className="text-base leading-[1.6] font-medium"
              style={{ color: 'rgba(255,255,255,0.92)' }}
            >
              {row.tosom}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

ComparisonRows.displayName = 'ComparisonRows';
export default ComparisonRows;
