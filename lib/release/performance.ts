/** ToSom Performance Utilities
 *  RM1 / RM6 — Mål render-tid og log langsame komponentar */

const renderTimings: Map<string, number> = new Map();

/** Mål kor lang tid det tek å rendera ein komponent */
export function measureRenderTime(componentName: string, durationMs: number): void {
  renderTimings.set(componentName, durationMs);
}

/** Log langsame komponentar (>100ms) */
export function logSlowComponents(thresholdMs: number = 100): void {
  const slow: string[] = [];
  renderTimings.forEach((duration, name) => {
    if (duration > thresholdMs) {
      slow.push(`${name}: ${duration.toFixed(2)}ms`);
    }
  });
  if (slow.length > 0) {
    console.warn('[Performance] Slow components:', slow);
  }
}

/** Nullstill timingar */
export function clearRenderTimings(): void {
  renderTimings.clear();
}

/** Hent timing for ein komponent */
export function getRenderTime(name: string): number | undefined {
  return renderTimings.get(name);
}
