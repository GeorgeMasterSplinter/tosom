#!/usr/bin/env node
/**
 * ToSom lansering — Steg 3: Verifiser R2-lagring i PRODUKSJON.
 *
 * Bruk:
 *   R2_ACCOUNT_ID=... R2_ACCESS_KEY_ID=... R2_SECRET_ACCESS_KEY=... \
 *   R2_BUCKET=... R2_REGION=... node scripts/launch-3-verify-r2.mjs
 *
 * Gjer fire ting:
 *   1. Lister eksisterande objekt i bucketen (prod-chat-bilde bør være her)
 *   2. Last opp et 1x1 test-PNG
 *   3. Hentar det att via presignert URL (samme mekanisme som prod-bruken)
 *   4. Sletter test-objektet
 *
 * Dersom 1–3 lykkes, er R2 live og bilder overlever Vercel-deploy
 * (data ligg i R2, ikke i det flyktige Vercel-filsystemet).
 */

import { S3Client, ListObjectsV2Command, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const env = process.env;
const required = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET', 'R2_REGION'];
const missing = required.filter((k) => !env[k]);
if (missing.length) {
  console.error('FEIL: mangler miljøvariablar:', missing.join(', '));
  console.error('Hent de fra Vercel (Settings → Environment Variables → Production) og kjør på nytt.');
  process.exit(1);
}

const client = new S3Client({
  region: env.R2_REGION,
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
});

const BUCKET = env.R2_BUCKET;
const KEY = 'launch-verify/tosom-r2-test.png';
// 1x1 raudt PNG
const PNG = Buffer.from(
  '89504e470d0a1a0a0000000d494844520000000100000001080200000090012e0000000c4944415408d763f8cfc0f01c06002901000004ed35dbb40000000049454e44ae426082',
  'hex'
);

console.log(`Bucket: ${BUCKET} (region ${env.R2_REGION})\n`);

// 1. List
console.log('--- 1) List objekt ---');
const list = await client.send(new ListObjectsV2Command({ Bucket: BUCKET, MaxKeys: 20 }));
const keys = list.Contents?.map((o) => `${o.Key} (${o.Size} B, ${o.LastModified?.toISOString().slice(0, 10)})`) ?? [];
if (keys.length === 0) console.log('(bucketen er tom)');
else keys.forEach((k) => console.log('  ' + k));
console.log(`  Totalt synleg: ${keys.length}\n`);

// 2. Put
console.log('--- 2) Last opp test-PNG ---');
await client.send(new PutObjectCommand({ Bucket: BUCKET, Key: KEY, Body: PNG, ContentType: 'image/png' }));
console.log(`  Opplasta: ${KEY} (${PNG.length} B)\n`);

// 3. Get via presignert URL
console.log('--- 3) Hent att via presignert URL ---');
const signed = await getSignedUrl(client, new GetObjectCommand({ Bucket: BUCKET, Key: KEY }), { expiresIn: 300 });
const res = await fetch(signed);
const bytes = res.ok ? Buffer.from(await res.arrayBuffer()) : null;
if (!res.ok || !bytes || !bytes.equals(PNG)) {
  console.error(`  FEIL: HTTP ${res.status} eller byte-mismatch`);
  process.exit(1);
}
console.log(`  HTTP ${res.status}, ${bytes.length} B — byte-for-byte identisk ✅\n`);

// 4. Opprydding
await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: KEY }));
console.log('--- 4) Sletta test-objektet ✅ ---');
console.log('\nKONKLUSJON: R2 er LIVE. Chat-bilder i prod ligg i R2 og overlever deploy.');