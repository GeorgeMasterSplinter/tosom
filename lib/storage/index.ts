/**
 * lib/storage/index.ts — Factory for ImageStorage
 *
 * Velger implementasjon ut fra miljø:
 *   - `STORAGE_DRIVER=r2`    → R2 (produksjon)
 *   - `STORAGE_DRIVER=local` → lokal fil (utvikling/CI)
 *   - `STORAGE_DRIVER=auto` (standard) → R2 hvis R2-nøkler finnes, ellers local
 *   - `STORAGE_DRIVER=memory` → kun for testing (eksponeres også som export)
 *
 * Singleton per prosess: driveren opprettes én gang og gjenbrukes. I serverless
 * (Vercel) er prosessen kortlevd, så ingen cache-utgangstid er nødvendig.
 */

import { ImageStorage } from './types';
import { R2ImageStorage } from './r2';
import { LocalImageStorage } from './local';

let instance: ImageStorage | null = null;

function hasR2Config(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET
  );
}

function resolveDriver(): 'r2' | 'local' | 'memory' {
  const raw = (process.env.STORAGE_DRIVER ?? 'auto').toLowerCase();
  if (raw === 'r2' || raw === 'local' || raw === 'memory') {
    return raw;
  }
  // auto: foretrekk R2 hvis nøkler er satt, ellers local.
  return hasR2Config() ? 'r2' : 'local';
}

/** Returnerer den konfigurerte ImageStorage-innstansen (singleton). */
export function getImageStorage(): ImageStorage {
  if (instance) return instance;

  const driver = resolveDriver();

  if (driver === 'r2') {
    if (!hasR2Config()) {
      throw new Error(
        '[storage] STORAGE_DRIVER=r2, men R2-nøkler mangler ' +
          '(R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET)'
      );
    }
    const ttl = parseTtl(process.env.IMAGE_URL_TTL_SECONDS);
    instance = new R2ImageStorage({
      accountId: process.env.R2_ACCOUNT_ID!,
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      bucket: process.env.R2_BUCKET!,
      region: process.env.R2_REGION ?? 'eu-central-1',
      endpoint: process.env.R2_ENDPOINT,
      ttlSeconds: ttl,
    });
  } else if (driver === 'local') {
    instance = new LocalImageStorage({
      rootDir: process.env.STORAGE_LOCAL_DIR,
    });
  } else {
    // memory — kun for testing.
    // Lazy import for å unngå økt bundle i prod.
    const { MemoryImageStorage } = require('./memory') as typeof import('./memory');
    instance = new MemoryImageStorage();
  }

  return instance;
}

/** Test-hjelp: nullstill singleton mellom tester. */
export function _resetImageStorageForTesting(): void {
  instance = null;
}

/** Eksponer typer og drivere for konsumenter. */
export type { ImageStorage, PutImageOptions } from './types';
export { assertSafeImageKey, buildImageKey } from './types';
export { R2ImageStorage } from './r2';
export { LocalImageStorage } from './local';
export { MemoryImageStorage } from './memory';

function parseTtl(value: string | undefined): number {
  if (!value) return 900;
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error(`[storage] IMAGE_URL_TTL_SECONDS må være et positivt tall (fikk: ${value})`);
  }
  return Math.floor(n);
}