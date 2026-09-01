/** ToSom-ikonsett
 *  BR4 — Definer ikonstil
 *
 *  Outline-stil, 1.75px stroke, runde hjørner, rolig geometri.
 *  SVG-ikon som eksporterer viewBox-baserte symbol. */

export type IconName = 'heart' | 'chat' | 'leaf' | 'user' | 'search' | 'bell' | 'settings' | 'check' | 'x' | 'arrow-right' | 'arrow-left' | 'star' | 'shield' | 'camera' | 'map' | 'calendar';

export const iconNames: IconName[] = ['heart', 'chat', 'leaf', 'user', 'search', 'bell', 'settings', 'check', 'x', 'arrow-right', 'arrow-left', 'star', 'shield', 'camera', 'map', 'calendar'];

/** Ikon-proppar som blir bruka i BrandIcon */
export interface BrandIconProps {
  name: IconName;
  size?: number;
  className?: string;
}

/** Teikne innhold for hvart ikon — outline, 1.75px stroke, runde hjørner */
export function iconPath(name: IconName): string {
  switch (name) {
    case 'heart':
      return `<path d="M12 21s-7-4.5-9.5-8A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 3c-2.5 3.5-9.5 8-9.5 8z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'chat':
      return `<path d="M21 12a9 9 0 0 1-9 9 7 7 0 0 1-3.5-.7L9 21l.7-3.5A9 9 0 1 1 21 12z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'leaf':
      return `<path d="M11 20a7 7 0 0 1-6.4-4.2C6 10 14 6 21 3a7 7 0 0 1-10 17z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'user':
      return `<circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M4 21a8 8 0 0 1 16 0" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>`;
    case 'search':
      return `<circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="1.75"/><path d="M16 16l-3.5-3.5" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>`;
    case 'bell':
      return `<path d="M18 8a6 6 0 0 0-12 0c0 5-2 7-2 7h16s-2-2-2-7" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><path d="M13.7 19a1.7 1.7 0 0 1-3.4 0" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>`;
    case 'settings':
      return `<circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.75"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>`;
    case 'check':
      return `<path d="M5 12l5 5L19 7" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'x':
      return `<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>`;
    case 'arrow-right':
      return `<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'arrow-left':
      return `<path d="M19 12H5M11 18l-6-6 6-6" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'star':
      return `<path d="M12 2l3 6 6 1-4.5 4.5L18 21l-6-3-6 3 1.5-7.5L3 9l6-1z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'shield':
      return `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'camera':
      return `<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/><circle cx="12" cy="13" r="4" fill="none" stroke="currentColor" stroke-width="1.75"/>`;
    case 'map':
      return `<path d="M1 6v16l7-3 8 3 8-3V2l-8 3-7-3-7 3z" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 2v16M16 6v16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>`;
    case 'calendar':
      return `<path d="M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.75"/><path d="M16 2v4M8 2v4M3 10h18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>`;
    default:
      return '';
  }
}
