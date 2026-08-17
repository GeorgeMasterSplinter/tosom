/**
 * Tosom — StatusBadge (B5.1)
 * 
 * Admin-komponent for grønn/gul/rød statusfarging.
 * «Ting er delt opp i farger basert på tilstand grønn, gul/orange og rødt.»
 * 
 * Kanoniske terskler per indikator (fra MASTERPLAN v4.0 DEL 7.1).
 */

'use client';

export type Severity = 'ok' | 'warn' | 'critical';

interface StatusBadgeProps {
  severity: Severity;
  label: string;
  value?: string | number;
  className?: string;
}

const SEVERITY_STYLES: Record<Severity, { bg: string; border: string; text: string; dot: string; icon: string }> = {
  ok: {
    bg: 'rgba(52, 211, 153, 0.1)',
    border: 'rgba(52, 211, 153, 0.3)',
    text: '#34D399',
    dot: '#34D399',
    icon: '🟢',
  },
  warn: {
    bg: 'rgba(251, 191, 36, 0.1)',
    border: 'rgba(251, 191, 36, 0.3)',
    text: '#FBBF24',
    dot: '#FBBF24',
    icon: '🟡',
  },
  critical: {
    bg: 'rgba(255, 77, 77, 0.1)',
    border: 'rgba(255, 77, 77, 0.3)',
    text: '#FF4D4D',
    dot: '#FF4D4D',
    icon: '🔴',
  },
};

export function StatusBadge({ severity, label, value, className = '' }: StatusBadgeProps) {
  const styles = SEVERITY_STYLES[severity];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${className}`}
      style={{
        background: styles.bg,
        border: `1px solid ${styles.border}`,
        color: styles.text,
      }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: styles.dot }}
      />
      <span>{label}</span>
      {value !== undefined && (
        <span className="font-semibold">{value}</span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   KANONISKE TERSKLER (MASTERPLAN v4.0 DEL 7.1)
   ═══════════════════════════════════════════════════════════ */

/** Siste matcherunde: < 26 t = ok, 26–48 t = warn, > 48 t = critical */
export function thresholdLastMatchRound(hoursSinceLastRound: number | null): Severity {
  if (hoursSinceLastRound === null) return 'critical';
  if (hoursSinceLastRound < 26) return 'ok';
  if (hoursSinceLastRound <= 48) return 'warn';
  return 'critical';
}

/** Kø-størrelse: ≥ 20 = ok, 1–19 = warn, 0 = critical */
export function thresholdQueueSize(queueSize: number): Severity {
  if (queueSize >= 20) return 'ok';
  if (queueSize >= 1) return 'warn';
  return 'critical';
}

/** Runde-varighet: < 30 s = ok, 30–50 s = warn, > 50 s = critical */
export function thresholdRoundDuration(durationMs: number | null): Severity {
  if (durationMs === null) return 'warn';
  if (durationMs < 30_000) return 'ok';
  if (durationMs <= 50_000) return 'warn';
  return 'critical';
}

/** 5xx siste time: 0 = ok, 1–5 = warn, > 5 = critical */
export function threshold5xxRate(count: number): Severity {
  if (count === 0) return 'ok';
  if (count <= 5) return 'warn';
  return 'critical';
}

/** DB-forbindelser: < 50 % = ok, 50–80 % = warn, > 80 % = critical */
export function thresholdDbConnections(percentUsed: number): Severity {
  if (percentUsed < 50) return 'ok';
  if (percentUsed <= 80) return 'warn';
  return 'critical';
}

/** Åpne rapporter: 0 = ok, 1–5 = warn, > 5 = critical */
export function thresholdOpenReports(count: number): Severity {
  if (count === 0) return 'ok';
  if (count <= 5) return 'warn';
  return 'critical';
}

/** Sentry-feil 24 t: < 10 = ok, 10–50 = warn, > 50 = critical */
export function thresholdSentryErrors(count: number): Severity {
  if (count < 10) return 'ok';
  if (count <= 50) return 'warn';
  return 'critical';
}

/** Gratiskvote: < 8000 = ok, 8000–9500 = warn, > 9500 = critical */
export function thresholdFreeQuota(usedCount: number): Severity {
  if (usedCount < 8000) return 'ok';
  if (usedCount <= 9500) return 'warn';
  return 'critical';
}

export default StatusBadge;