/* ------ Global journey event bus ------ */

let listeners = new Set<() => void>();

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function emitJourneyUpdated(): void {
  listeners.forEach((fn) => fn());
}
