/**
 * HEADER BRAND FIX — BRAND-01…BRAND-05
 *
 * Canonical public header (UniversalMenu, rendres fra root layout på alle
 * offentlige sider) viser to-sirkler-merket + synlig wordmark «Tosom» som
 * ÉN samlet link til /.
 *
 * Dashboard (DashboardNavBar/ToSomLogo, href="/dashboard") er bevisst
 * uendret — dokumentert destinasjon for innloggede brukere (holdes inne i
 * appen, ikke ut av en aktiv reise).
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');

function read(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

/**
 * Ekstraherer brand-lenken i UniversalMenu: fra det nærmeste <Link før
 * <ResonanceMark til den etterfølgende </Link>.
 */
function brandLinkBlock(): string {
  const src = read('components/layout/UniversalMenu.tsx');
  const markIdx = src.indexOf('<ResonanceMark');
  expect(markIdx).toBeGreaterThan(-1);
  const linkOpenIdx = src.lastIndexOf('<Link', markIdx);
  const linkCloseIdx = src.indexOf('</Link>', markIdx);
  expect(linkOpenIdx).toBeGreaterThan(-1);
  expect(linkCloseIdx).toBeGreaterThan(markIdx);
  return src.slice(linkOpenIdx, linkCloseIdx + '</Link>'.length);
}

describe('HEADER BRAND FIX (public header)', () => {
  test('BRAND-01: public header inneholder eksisterende canonical to-sirkler-merke', () => {
    const src = read('components/layout/UniversalMenu.tsx');
    expect(src).toMatch(/from '@\/components\/branding\/LogoVariants'/);
    expect(brandLinkBlock()).toMatch(/<ResonanceMark/);
  });

  test('BRAND-02: synlig wordmark «Tosom» ved siden av merket', () => {
    expect(brandLinkBlock()).toMatch(/<span[^>]*>\s*Tosom\s*<\/span>/);
  });

  test('BRAND-03: merke + wordmark tilhører én samlet link (ingen nestet Link)', () => {
    const block = brandLinkBlock();
    expect((block.match(/<Link/g) ?? []).length).toBe(1);
  });

  test('BRAND-04: linkmål er «/»', () => {
    expect(brandLinkBlock()).toMatch(/href="\/"/);
  });

  test('BRAND-05: tilgjengelig navn + native next/link (TAB/ENTER)', () => {
    expect(brandLinkBlock()).toMatch(/aria-label="Tosom/);
    const src = read('components/layout/UniversalMenu.tsx');
    expect(src).toMatch(/import Link from 'next\/link'/);
  });
});
