/** ToSom Preload Registry
 *  RM5 — Sporar kva som er preloada
 *
 *  Preload:
 *    - OnboardingFlow
 *    - Dashboard
 *    - ChatPanel
 *    - PartnerProfileView
 *    - UserProfileView */

type Preloadable =
  | 'OnboardingFlow'
  | 'Dashboard'
  | 'ChatPanel'
  | 'PartnerProfileView'
  | 'UserProfileView';

const registered = new Set<Preloadable>();

/** Marker ein komponent som preloada */
export function markPreloaded(name: Preloadable): void {
  registered.add(name);
}

/** Sjekk om ein komponent er preloada */
export function isPreloaded(name: Preloadable): boolean {
  return registered.has(name);
}

/** Hent alle preloada namn */
export function getPreloaded(): readonly Preloadable[] {
  return Array.from(registered);
}

/** Nullstill alle */
export function clearPreloaded(): void {
  registered.clear();
}

/** Preload alle standard-komponentar */
export function preloadAll(): void {
  const all: Preloadable[] = [
    'OnboardingFlow',
    'Dashboard',
    'ChatPanel',
    'PartnerProfileView',
    'UserProfileView',
  ];
  all.forEach((name) => markPreloaded(name));
}
