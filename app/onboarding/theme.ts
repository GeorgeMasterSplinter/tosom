/**
 * Tosom — Onboarding Theme Tokens
 *
 * Dempet nordisk palett som speiler dashboard-tokenene.
 * Gull brukes kun som CTA/brand-aksent.
 * Hver seksjon får en subtil fargeidentitet (lav mætningsgrad).
 */

export const OB = {
  /* ── Glass (speiler --ts-glass-*) ── */
  glassBg: 'rgba(255,255,255,0.03)',
  glassBgHover: 'rgba(255,255,255,0.05)',
  glassBorder: 'rgba(255,255,255,0.08)',
  glassBorderHover: 'rgba(255,255,255,0.12)',

  /* ── Tekst ── */
  textPrimary: 'rgba(255,255,255,0.92)',
  textSecondary: 'rgba(255,255,255,0.6)',
  textMuted: 'rgba(255,255,255,0.4)',
  textSubtle: 'rgba(255,255,255,0.3)',

  /* ── Gull — kun CTA + brand-aksent ── */
  gold: '#D4AF37',
  goldSoft: 'rgba(212,175,55,0.25)',
  goldGlow: 'rgba(212,175,55,0.1)',
  goldBg: 'rgba(212,175,55,0.06)',

  /* ── Nøytrale divider ── */
  divider: 'rgba(255,255,255,0.06)',
  dividerLight: 'rgba(255,255,255,0.04)',

  /* ── Nordisk fargeskala pr. seksjon ── */
  section: {
    identity:    '#5B9BD5',  // myk blå      → Identitet og søk
    location:    '#4ECDC4',  // myk teal     → Bosted og avstand
    lifestyle:   '#34D399',  // myk grønn    → Livsstil
    personality: '#60A5FA',  // dempet blå   → Personlighet / Relasjon
    values:      '#9B59B6',  // myk lilla    → Verdier / Framtid
    humor:       '#E8875B',  // dempet oransje → Humor
    boundaries:  '#F472B6',  // myk rosa     → Grenser
    summary:     '#D4AF37',  // gull         → Oppsummering (brand)
  },
} as const;

export type SectionKey = keyof typeof OB.section;

/**
 * Hjelpefunksjon: returnerer rgba-varianter av en seksjonsfarge.
 * `alpha` er 0–100 (prosent).
 */
export function sectionColor(hex: string, alpha: number): string {
  const a = Math.round((alpha / 100) * 255).toString(16).padStart(2, '0');
  return `${hex}${a}`;
}