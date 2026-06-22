/*
 * ToSom Radius System
 * 
 * Alle rundinger i applikasjonen benytter denne fila.
 * Ingen hardkodede radius-verdier utover denne fila.
 */

/* ========================
   RADIUS TOKENS (i px)
   ======================== */

export const radius = {
  xs:  4,   /* Tiny: badges, toggles, pills       */
  sm:  8,   /* Small: tags, chips, small inputs    */
  md:  12,  /* Medium: buttons, small cards         */
  lg:  16,  /* Large: medium cards, panels          */
  xl:  20,  /* XL: glass panels, dialog overlays    */
  '2xl': 24, /* 2XL: modals, feature cards          */
  '3xl': 32, /* 3XL: full overlays, hero panels      */
  full: 9999, /* Pill / circle                        */
} as const;

/* ========================
   COMPONENT MAPPINGS
   ======================== */

/**
 * Hvilken radius skal brukes for hver komponent-type?
 */
export const componentRadius = {
  button:       radius.md,
  buttonSm:     radius.sm,
  buttonLg:     radius.lg,
  input:        radius.lg,
  card:         radius.xl,
  cardSm:       radius.lg,
  cardLg:       radius['2xl'],
  glassPanel:   radius.xl,
  modal:        radius['2xl'],
  dialog:       radius['2xl'],
  tooltip:      radius.sm,
  badge:        radius.full,
  avatar:       radius.full,
  skeleton:     radius.md,
  dropdown:     radius.lg,
  tab:          radius.md,
  slider:       radius.full,
  checkbox:     radius.sm,
  radio:        radius.full,
  switch:       radius.full,
} as const;

/* ========================
   HELPER FUNCTIONS
   ======================== */

/**
 * Konverterer radius-token til CSS-stil
 */
export function radiusToStyle(r: keyof typeof radius | number): React.CSSProperties {
  const value = typeof r === 'number' ? r : radius[r];
  return { borderRadius: `${value}px` };
}

/**
 * Konverterer radius-token til Tailwind-klasse
 */
export function radiusToTailwind(r: keyof typeof radius | number): string {
  const value = typeof r === 'number' ? r : radius[r];
  
  const map: Record<number, string> = {
    0:  'rounded-none',
    4:  'rounded-xs',
    8:  'rounded-sm',
    12: 'rounded-md',
    16: 'rounded-lg',
    20: 'rounded-xl',
    24: 'rounded-2xl',
    32: 'rounded-3xl',
  };
  
  return map[value] || `rounded-[${value}px]`;
}

/* ========================
   EXPORTS
   ======================== */

export default {
  radius,
  componentRadius,
  radiusToStyle,
  radiusToTailwind,
};