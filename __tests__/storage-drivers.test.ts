/**
 * ToSom — lib/storage: drivarar og nøkkelvalidering
 *
 * Dekker:
 *   - MemoryImageStorage (put/getSignedUrl/delete/exists/idempotens)
 *   - LocalImageStorage (put/exists/delete/exists — real disk)
 *   - assertSafeImageKey (path-traversal / absolutt sti / feil format)
 *   - buildImageKey (konstantt format)
 *   - Factory (STORAGE_DRIVER-resolusjon + R2-krever-nøklar)
 */

import fs from 'fs/promises';
import os from 'os';
import path from 'path';

import {
  MemoryImageStorage,
  LocalImageStorage,
  assertSafeImageKey,
  buildImageKey,
  _resetImageStorageForTesting,
  getImageStorage,
} from '@/lib/storage';

const KEY = 'conv-1/abc-123.jpg';
const BUF = Buffer.from('fake-image-bytes');

describe('assertSafeImageKey', () => {
  it('godtek gyldig format {conversationId}/{uuid}.{ext}', () => {
    expect(assertSafeImageKey(KEY)).toBe(KEY);
  });

  it('avviser absolutt sti', () => {
    expect(() => assertSafeImageKey('/etc/passwd.jpg')).toThrow();
  });

  it('avviser path-traversal (..)', () => {
    expect(() => assertSafeImageKey('conv-1/../secret.jpg')).toThrow();
  });

  it('avviser to skråstrekar (for djupt)', () => {
    expect(() => assertSafeImageKey('a/b/c.jpg')).toThrow();
  });

  it('avviser manglande utviding', () => {
    expect(() => assertSafeImageKey('conv-1/noext')).toThrow();
  });

  it('avviser tom nøkkel', () => {
    expect(() => assertSafeImageKey('')).toThrow();
  });
});

describe('buildImageKey', () => {
  it('produserer konstantt format', () => {
    expect(buildImageKey('conv-9', 'uuid-xyz', '.png')).toBe('conv-9/uuid-xyz.png');
  });
});

describe('MemoryImageStorage', () => {
  let s: MemoryImageStorage;
  beforeEach(() => {
    s = new MemoryImageStorage();
  });

  it('put + exists + buffer-hald', async () => {
    await s.putImage(KEY, BUF, { contentType: 'image/jpeg' });
    expect(await s.exists(KEY)).toBe(true);
    expect(s._getBuffer(KEY)).toEqual(BUF);
  });

  it('getSignedUrl returnerer ein distinkt memory:// URL per utsteding', async () => {
    await s.putImage(KEY, BUF, { contentType: 'image/jpeg' });
    const u1 = await s.getSignedUrl(KEY);
    const u2 = await s.getSignedUrl(KEY);
    expect(u1).toContain('memory://');
    expect(u2).toContain('memory://');
    expect(u1).not.toBe(u2);
  });

  it('getSignedUrl kaster for objekt som ikkje finst', async () => {
    await expect(s.getSignedUrl('conv-1/missing.jpg')).rejects.toThrow();
  });

  it('delete er idempotent og fjernar objektet', async () => {
    await s.putImage(KEY, BUF, { contentType: 'image/jpeg' });
    await s.deleteImage(KEY);
    expect(await s.exists(KEY)).toBe(false);
    await s.deleteImage(KEY); // ikkje feil
    expect(await s.exists(KEY)).toBe(false);
  });
});

describe('LocalImageStorage', () => {
  let dir: string;
  let s: LocalImageStorage;

  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), 'tosom-storage-test-'));
    s = new LocalImageStorage({ rootDir: dir });
  });

  afterEach(async () => {
    await fs.rm(dir, { recursive: true, force: true });
  });

  it('put + exists + buffer + getSignedUrl (file://)', async () => {
    await s.putImage(KEY, BUF, { contentType: 'image/jpeg' });
    expect(await s.exists(KEY)).toBe(true);
    expect(await s._getBuffer(KEY)).toEqual(BUF);
    const url = await s.getSignedUrl(KEY);
    expect(url).toContain('file://');
    expect(url).toContain('conv-1');
  });

  it('delete fjernar fila frå disken', async () => {
    await s.putImage(KEY, BUF, { contentType: 'image/jpeg' });
    const abs = path.resolve(dir, KEY);
    expect((await fs.stat(abs).catch(() => null)) != null).toBe(true);
    await s.deleteImage(KEY);
    expect(await s.exists(KEY)).toBe(false);
    expect((await fs.stat(abs).catch(() => null)) == null).toBe(true);
  });

  it('getSignedUrl kaster når fila ikkje finst', async () => {
    await expect(s.getSignedUrl(KEY)).rejects.toThrow();
  });
});

describe('factory (getImageStorage)', () => {
  const OLD = { ...process.env };

  beforeEach(() => {
    _resetImageStorageForTesting();
  });

  afterEach(() => {
    _resetImageStorageForTesting();
    process.env = { ...OLD };
  });

  it('auto utan R2-nøklar → local driver', () => {
    delete process.env.STORAGE_DRIVER;
    delete process.env.R2_ACCOUNT_ID;
    const s = getImageStorage();
    expect(s.driver).toBe('local');
  });

  it('STORAGE_DRIVER=memory → memory driver', () => {
    process.env.STORAGE_DRIVER = 'memory';
    const s = getImageStorage();
    expect(s.driver).toBe('memory');
  });

  it('STORAGE_DRIVER=r2 utan nøklar → kaster', () => {
    process.env.STORAGE_DRIVER = 'r2';
    delete process.env.R2_ACCOUNT_ID;
    expect(() => getImageStorage()).toThrow(/R2-nøkler mangler/);
  });

  it('auto med R2-nøklar → r2 driver', () => {
    delete process.env.STORAGE_DRIVER;
    process.env.R2_ACCOUNT_ID = 'acct';
    process.env.R2_ACCESS_KEY_ID = 'key';
    process.env.R2_SECRET_ACCESS_KEY = 'secret';
    process.env.R2_BUCKET = 'bucket';
    const s = getImageStorage();
    expect(s.driver).toBe('r2');
  });
});
