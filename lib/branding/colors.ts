/** ToSom-brandfargar
 *  BR2 — Definer fargepalett */

export const brandColors = {
  primary: {
    value: '#3A7CA5',
    hover: '#2E6B91',
    active: '#255A7A',
    light: 'rgba(58,124,165,0.08)',
    lightMid: 'rgba(58,124,165,0.15)',
    text: '#FFFFFF',
  },
  secondary: {
    value: '#4C9A6A',
    hover: '#3F8A5C',
    active: '#34784D',
    light: 'rgba(76,154,106,0.08)',
    lightMid: 'rgba(76,154,106,0.15)',
    text: '#FFFFFF',
  },
  accent: '#F4EFE7',
  accentDark: '#EDEAE6',
  text: '#374151',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  subtle: '#E5E7EB',
  white: '#FFFFFF',
  background: '#FAFAF9',
  overlay: 'rgba(0,0,0,0.4)',
} as const;

export const brandColorNames = Object.keys(brandColors) as (keyof typeof brandColors)[];
