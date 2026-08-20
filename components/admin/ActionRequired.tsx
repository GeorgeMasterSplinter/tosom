'use client';

/**
 * Tosom — Krever handling
 *
 * Samler alt som er gult eller rødt øverst på kommandopanelet.
 * Er alt grønt, vises én linje som bekrefter det.
 */

import Link from 'next/link';
import type { Severity } from './StatusBadge';

export interface ActionItem {
  key: string;
  label: string;
  value: string;
  severity: Severity;
  action: string | null;
  href?: string;
}

const TONE: Record<Exclude<Severity, 'ok'>, { text: string; bg: string; border: string }> = {
  critical: { text: '#FF4D4D', bg: 'rgba(255,77,77,0.06)', border: 'rgba(255,77,77,0.25)' },
  warn: { text: '#FBBF24', bg: 'rgba(251,191,36,0.06)', border: 'rgba(251,191,36,0.22)' },
};

export function ActionRequired({ items }: { items: ActionItem[] }) {
  const needsAttention = items
    .filter((i) => i.severity !== 'ok' && i.action)
    .sort((a, b) => (a.severity === 'critical' ? -1 : b.severity === 'critical' ? 1 : 0));

  if (needsAttention.length === 0) {
    return (
      <div
        className="flex items-center gap-3 rounded-2xl px-5 py-4"
        style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.18)' }}
      >
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ background: '#34D399', animation: 'ts-pulse 2s ease-in-out infinite' }}
          />
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: '#34D399' }} />
        </span>
        <div>
          <p className="text-sm font-medium" style={{ color: '#34D399' }}>
            Ingen tiltak nødvendig
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Alle indikatorer er innenfor normalen.
          </p>
        </div>
      </div>
    );
  }

  const worst = needsAttention[0].severity as Exclude<Severity, 'ok'>;
  const tone = TONE[worst];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: tone.bg, border: `1px solid ${tone.border}` }}>
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${tone.border}` }}
      >
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: tone.text }}>
          Krever handling
        </h2>
        <span className="text-xs font-mono" style={{ color: tone.text }}>
          {needsAttention.length}
        </span>
      </div>

      <ul>
        {needsAttention.map((item) => {
          const itemTone = TONE[item.severity as Exclude<Severity, 'ok'>];
          const row = (
            <div className="flex items-start gap-3 px-5 py-3">
              <span
                className="mt-1.5 h-2 w-2 rounded-full flex-shrink-0"
                style={{ background: itemTone.text }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {item.label}
                  </span>
                  <span className="text-sm font-mono" style={{ color: itemTone.text }}>
                    {item.value}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {item.action}
                </p>
              </div>
              {item.href && (
                <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  →
                </span>
              )}
            </div>
          );

          return (
            <li key={item.key} style={{ borderTop: `1px solid ${tone.border}` }}>
              {item.href ? (
                <Link href={item.href} className="block transition-colors hover:bg-white/[0.02]">
                  {row}
                </Link>
              ) : (
                row
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ActionRequired;