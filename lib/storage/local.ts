/**
 * lib/storage/local.ts — Lokal filbasert ImageStorage (utvikling)
 *
 * Skriver til `STORAGE_LOCAL_DIR` (standard: `os.tmpdir()/tosom-images`).
 * Deliberat IKKE `public/` — lokal driver er kun for utvikling/CI, og bilder
 * skal aldri ligge i den offentlig serverte mappen (tilgangskontroll).
 *
 * `getSignedUrl` returnerer en `file://`-URL. I utvikling er dette tilstrekkelig
 * fordi tilgangskontrollen håndheves i API-ruten (deltaker-sjekk) før URL-en
 * utstedes. I produksjon brukes R2-driveren i stedet.
 */

import { mkdir, writeFile, readFile, rm, stat } from 'fs/promises';
import path from 'path';
import os from 'os';
import { ImageStorage, PutImageOptions, assertSafeImageKey } from './types';

export interface LocalImageStorageOptions {
  /** Røtmappen for lagring. Standard: `${os.tmpdir()}/tosom-images`. */
  rootDir?: string;
}

export class LocalImageStorage implements ImageStorage {
  readonly driver = 'local' as const;
  private readonly rootDir: string;

  constructor(options: LocalImageStorageOptions = {}) {
    this.rootDir = options.rootDir ?? path.join(os.tmpdir(), 'tosom-images');
  }

  /** Absolutt filsti for en key, validert for path-traversal. */
  private resolvePath(key: string): string {
    const safeKey = assertSafeImageKey(key);
    const fullPath = path.resolve(this.rootDir, safeKey);
    // Forsikre oss om at stien forblir under rotmappen.
    if (!fullPath.startsWith(path.resolve(this.rootDir) + path.sep)) {
      throw new Error(`[local] Key peker utenfor rotmappe: ${safeKey}`);
    }
    return fullPath;
  }

  async putImage(key: string, buffer: Buffer, options: PutImageOptions): Promise<void> {
    const filePath = this.resolvePath(key);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, buffer);
  }

  async getSignedUrl(key: string, _ttlSeconds?: number): Promise<string> {
    const filePath = this.resolvePath(key);
    const s = await stat(filePath).catch(() => null);
    if (!s) {
      throw new Error(`[local] Fil finnes ikke: ${key}`);
    }
    return pathToFileUrl(filePath);
  }

  async deleteImage(key: string): Promise<void> {
    const filePath = this.resolvePath(key);
    // Idempotent: fjern uansett om filen finnes.
    await rm(filePath, { force: true });
  }

  async exists(key: string): Promise<boolean> {
    const filePath = this.resolvePath(key);
    const s = await stat(filePath).catch(() => null);
    return !!s;
  }

  /** Test-hjelp: henta den lagrede bufferen direkte. */
  async _getBuffer(key: string): Promise<Buffer | null> {
    const filePath = this.resolvePath(key);
    return readFile(filePath).catch(() => null);
  }
}

function pathToFileUrl(filePath: string): string {
  return new URL(`file://${filePath}`).toString();
}

export default LocalImageStorage;