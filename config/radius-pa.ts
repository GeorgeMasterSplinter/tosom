/*
 * ToSom Radius PA — Preset Alignments
 * 
 * Enkel radius-map for konvertering til Tailwind/styles.
 */

/* ========================
   COMPONENT RADIUS PRESETS
   ======================== */

export const componentRadius: Record<string, number> = {
  button: 12,
  input: 16,
  card: 20,
  modal: 24,
  glassPanel: 20,
  badge: 9999,
  avatar: 9999,
};

/* ========================
   CONVERSION HELPERS
   ======================== */

/**
 * Konverterer radius-verdi til React.CSSProperties.
 */
export function radiusToStyle(value: number | string): React.CSSProperties {
  const num = typeof value === 'string' ? (componentRadius[value] || parseInt(value, 10)) : value;
  return { borderRadius: `${num}px` };
}

/**
 * Konverterer radius-verdi til Tailwind-klass.
 */
export function radiusToTailwind(value: number | string): string {
  const num = typeof value === 'string' ? (componentRadius[value] || parseInt(value, 10)) : value;
  
  const map: Record<number, string> = {
    4: 'rounded-sm',
    8: 'rounded',
    12: 'rounded-lg',
    16: 'rounded-xl',
    20: 'rounded-[20px]',
    24: 'rounded-2xl',
    32: 'rounded-3xl',
    9999: 'rounded-full',
  };

  return map[num] || `rounded-[${num}px]`;
}

/* ========================
   DEFAULT EXPORT
   ======================== */

export default {
  componentRadius,
  radiusToStyle,
  radiusToTailwind,
};