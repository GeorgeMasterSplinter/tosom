/**
 * lib/storage/memory.ts — Memory-basert ImageStorage (kun for testing)
 *
 * Ingen disk, ingen nettverk. Hver forekomst har sin egen in-memory-mappe,
 * så tester kan kjøre isolert. `getSignedUrl` returnerer en `memory://`-URL
 * som er unavhengig av filsystem — testene verifiserer kun at URL-en blir
 * utstedt og at den er distinct per key, ikke at den peker på en ekte fil.
 */

import { ImageStorage, PutImageOptions, assertSafeImageKey } from './types';

interface StoredObject {
  buffer: Buffer;
  contentType: string;
}

export class MemoryImageStorage implements ImageStorage {
  readonly driver = 'memory' as const;
  private readonly store = new Map<string, StoredObject>();
  private counter = 0;

  async putImage(key: string, buffer: Buffer, options: PutImageOptions): Promise<void> {
    const safeKey = assertSafeImageKey(key);
    this.store.set(safeKey, { buffer, contentType: options.contentType });
  }

  async getSignedUrl(key: string, _ttlSeconds?: number): Promise<string> {
    const safeKey = assertSafeImageKey(key);
    if (!this.store.has(safeKey)) {
      throw new Error(`[memory] Objekt finnes ikke: ${safeKey}`);
    }
    // Distinkt, deterministisk URL per key. Eksplosivt: inneholder ikke nøkkelen i klartekst
    // utover en base64-encoding for å simulere en presignert URL.
    const encoded = Buffer.from(safeKey).toString('base64url');
    const token = `sig${(this.counter++).toString(36)}`;
    return `memory://${encoded}?token=${token}`;
  }

  async deleteImage(key: string): Promise<void> {
    const safeKey = assertSafeImageKey(key);
    // Idempotent: fjern uansett om den finnes.
    this.store.delete(safeKey);
  }

  async exists(key: string): Promise<boolean> {
    const safeKey = assertSafeImageKey(key);
    return this.store.has(safeKey);
  }

  /** Test-hjelp: henta den lagrede bufferen direkte. */
  _getBuffer(key: string): Buffer | undefined {
    return this.store.get(key)?.buffer;
  }
}

export default MemoryImageStorage;