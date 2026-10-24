/**
 * ACT E (P1-3, PD-7) — UploadThing-cleanup: UT-01–UT-05, UT-07
 * (UT-06: eksisterende bilde-/chat-tester kjører i full jest; UT-08: next build.)
 *
 * UploadThing var død kode: ingen [...uploadthing]-catchall-rute
 * (endepunktet svarte 404 i prod, verifisert 24.10), null imports av
 * ImageUpload, og den aktive chat-bildeveien er native fil-input →
 * /api/chat/image → R2. Denne testen er en guard slik at løsningen ikke
 * sneker seg tilbake: null referanser i kode, filer borte, ingen
 * pakkede i dependencies, og den aktive bildeveien intakt.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = join(__dirname, '..');

function src(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf-8');
}

/** Samler alle kildefiler (.ts/.tsx) under de oppgitte toppnivå-mappe. */
function sourceFiles(dirs: string[]): string[] {
  const found: string[] = [];
  for (const dir of dirs) {
    const base = join(ROOT, dir);
    if (!existsSync(base)) continue;
    const walk = (d: string): void => {
      for (const entry of readdirSync(d)) {
        const full = join(d, entry);
        const st = statSync(full);
        if (st.isDirectory()) walk(full);
        else if (/\.(ts|tsx)$/.test(entry)) found.push(full);
      }
    };
    walk(base);
  }
  return found;
}

describe('UT-01 — ingen aktive referanser til UploadThing i koden', () => {
  const codeDirs = ['app', 'components', 'utils', 'lib', 'config'];

  it('«uploadthing» i app/components/utils/lib/config = 0 treff', () => {
    const treff: string[] = [];
    for (const file of sourceFiles(codeDirs)) {
      if (/uploadthing/i.test(readFileSync(file, 'utf-8'))) treff.push(file);
    }
    expect(treff).toEqual([]);
  });

  it('ingen kildefil importerer uploadthing-pakker', () => {
    const treff: string[] = [];
    for (const file of sourceFiles(codeDirs)) {
      if (/from\s+["'](@uploadthing\/|uploadthing)/.test(readFileSync(file, 'utf-8'))) {
        treff.push(file);
      }
    }
    expect(treff).toEqual([]);
  });
});

describe('UT-02 — /api/uploadthing finnes ikke lenger', () => {
  it('rute-mappen og core.ts er fjernet', () => {
    expect(existsSync(join(ROOT, 'app/api/uploadthing'))).toBe(false);
    expect(existsSync(join(ROOT, 'app/api/uploadthing/core.ts'))).toBe(false);
  });
});

describe('UT-03 — døde komponent og utility er fjernet', () => {
  it('ImageUpload.tsx og utils/uploadthing.ts finnes ikke', () => {
    expect(existsSync(join(ROOT, 'components/ImageUpload.tsx'))).toBe(false);
    expect(existsSync(join(ROOT, 'utils/uploadthing.ts'))).toBe(false);
  });

  it('dynamic-wrapperen (DynamicImageUpload) er fjernet', () => {
    expect(src('components/dynamic/index.ts')).not.toContain('DynamicImageUpload');
  });
});

describe('UT-04 — aktive chat-bildeflyt er fortsatt tilkoblet', () => {
  it('opplastingsruten eksisterer og brukes fra ChatContainer', () => {
    expect(existsSync(join(ROOT, 'app/api/chat/image/route.ts'))).toBe(true);
    expect(src('app/chat/components/ChatContainer.tsx')).toContain('/api/chat/image');
  });
});

describe('UT-05 — dag-15-bilderegelen er intakt', () => {
  it('ruten håndhever isPhotosAllowed (dag >= 15) server-side', () => {
    const route = src('app/api/chat/image/route.ts');
    expect(route).toContain("from '@/lib/journey/engine'");
    expect(route).toContain('isPhotosAllowed(journey.day)');
  });

  it('den eksisterende M-6-testen for bilde-låsen er fortsatt til stede', () => {
    expect(existsSync(join(ROOT, '__tests__/chat-image-lock-m6.test.ts'))).toBe(true);
  });
});

describe('UT-07 — ingen UploadThing-pakkede i dependencies', () => {
  it('package.json inneholder verken uploadthing eller @uploadthing/*', () => {
    const pkg = JSON.parse(src('package.json'));
    const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
    for (const name of Object.keys(deps)) {
      expect(name).not.toMatch(/^(@uploadthing\/)?uploadthing$/);
    }
  });

  it('health-ruten rapporterer ikke lenger UploadThing', () => {
    expect(src('app/api/system/health/route.ts')).not.toMatch(/uploadthing/i);
  });
});
