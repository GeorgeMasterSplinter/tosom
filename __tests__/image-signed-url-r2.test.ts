/**
 * ToSom — R2 presigning
 *
 * Verifiserer at R2ImageStorage utsteder presigned URL-er via
 * @aws-sdk/s3-request-presigner (ikke ein rå/gjettbar URL). S3-clienten
 * blir mocka slik at ingen nettverk blir rørt.
 */

import { S3Client } from '@aws-sdk/client-s3';
import { R2ImageStorage } from '@/lib/storage';
import { resolveR2Region } from '@/lib/storage/r2';

// Bygg ein S3Client som ikke snakkar med nettverket. Presigning er ein
// rein lokal berekning (HMAC), så send() blir aldri kalla her.
function makeR2(bucket = 'tosom-images', ttl = 900): R2ImageStorage {
  const client = new S3Client({
    region: 'auto',
    endpoint: 'https://acct.r2.cloudflarestorage.com',
    forcePathStyle: true,
    credentials: {
      accessKeyId: 'test-access-key',
      secretAccessKey: 'test-secret-key',
    },
  });
  return new R2ImageStorage({
    accountId: 'acct',
    accessKeyId: 'test-access-key',
    secretAccessKey: 'test-secret-key',
    bucket,
    endpoint: 'https://acct.r2.cloudflarestorage.com',
    ttlSeconds: ttl,
    client,
  });
}

const KEY = 'conv-1/abc-123.jpg';

describe('R2ImageStorage presigning', () => {
  it('utsteder ein https:// presigned URL med nøkkelen og ein signatur', async () => {
    const s = makeR2();
    const url = await s.getSignedUrl(KEY);

    expect(url).toContain('https://');
    expect(url).toContain('/tosom-images/conv-1/abc-123.jpg'); // forcePathStyle: nøkkelen i path
    // AWS SigV4 presigned URL-er inneholder ein signatur.
    expect(url.toLowerCase()).toMatch(/(x-amz-signature|x-amz-security-token|signature=)/);
  });

  it('respekterer custom TTL', async () => {
    const s = makeR2();
    const url = await s.getSignedUrl(KEY, 60);
    // SigV4 presigned URL-er har X-Amz-Expires=60
    expect(url).toContain('X-Amz-Expires=60');
  });

  it('avviser ulovleg nøkkel (path-traversal) før presigning', async () => {
    const s = makeR2();
    await expect(s.getSignedUrl('../escape.jpg')).rejects.toThrow();
  });
});

describe('resolveR2Region', () => {
  it('returnerer "auto" når region mangler', () => {
    expect(resolveR2Region(undefined)).toBe('auto');
  });

  it('returnerer uendra en gyldig R2-region', () => {
    expect(resolveR2Region('auto')).toBe('auto');
    expect(resolveR2Region('weur')).toBe('weur');
    expect(resolveR2Region('apac')).toBe('apac');
  });

  it('returnerer uendra "us-east-1" (alias til auto)', () => {
    expect(resolveR2Region('us-east-1')).toBe('us-east-1');
  });

  it('normaliserer AWS-region "eu-central-1" til "auto"', () => {
    expect(resolveR2Region('eu-central-1')).toBe('auto');
  });
});
