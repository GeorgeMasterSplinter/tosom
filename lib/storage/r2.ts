/**
 * lib/storage/r2.ts — Cloudflare R2 ImageStorage (produksjon)
 *
 * R2 er S3-kompatibel. Vi bruker @aws-sdk/client-s3 med en `forcePathStyle`-
 * konfigurasjon som peker mot R2-endepunktet, og @aws-sdk/s3-request-presigner
 * for kortlevd, presigned URL-er.
 *
 * Miljøvariabler (alt i Vercel, aldri i repo):
 *   R2_ACCOUNT_ID
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *   R2_BUCKET
 *   R2_REGION            (standard: eu-central-1 — EU/EØS, masterplan §7)
 *   R2_ENDPOINT          (valgfritt override; standard: https://{accountId}.r2.cloudflarestorage.com)
 *   IMAGE_URL_TTL_SECONDS (standard: 900 = 15 min)
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  NoSuchKey,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ImageStorage, PutImageOptions, assertSafeImageKey } from './types';

export interface R2ImageStorageOptions {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  region?: string;
  /** Fullt endepunkt. Standard: https://{accountId}.r2.cloudflarestorage.com */
  endpoint?: string;
  /** Default TTL i sekunder for presigned URL-er. Standard: 900. */
  ttlSeconds?: number;
  /** For testing: injiser en client (f.eks. mot et mock). */
  client?: S3Client;
}

export class R2ImageStorage implements ImageStorage {
  readonly driver = 'r2' as const;
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly ttlSeconds: number;

  constructor(options: R2ImageStorageOptions) {
    this.bucket = options.bucket;
    this.ttlSeconds = options.ttlSeconds ?? 900;

    if (options.client) {
      this.client = options.client;
      return;
    }

    const region = options.region ?? 'eu-central-1';
    const endpoint =
      options.endpoint ?? `https://${options.accountId}.r2.cloudflarestorage.com`;

    this.client = new S3Client({
      region,
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
      },
    });
  }

  async putImage(key: string, buffer: Buffer, options: PutImageOptions): Promise<void> {
    const safeKey = assertSafeImageKey(key);
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: safeKey,
        Body: buffer,
        ContentType: options.contentType,
      })
    );
  }

  async getSignedUrl(key: string, ttlSeconds?: number): Promise<string> {
    const safeKey = assertSafeImageKey(key);
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: safeKey,
    });
    return getSignedUrl(this.client, command, { expiresIn: ttlSeconds ?? this.ttlSeconds });
  }

  async deleteImage(key: string): Promise<void> {
    const safeKey = assertSafeImageKey(key);
    // Idempotent: DeleteObject på R2 feiler ikke hvis objektet ikke finnes.
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: safeKey,
      })
    );
  }

  async exists(key: string): Promise<boolean> {
    const safeKey = assertSafeImageKey(key);
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: safeKey,
        })
      );
      return true;
    } catch (err) {
      if (err instanceof NoSuchKey) return false;
      // 404 fra R2 kommer også som NoSuchKey; andre feil gjennombrytes.
      const status = (err as { statusCode?: number })?.statusCode;
      if (status === 404 || status === 403) return false;
      throw err;
    }
  }
}

export default R2ImageStorage;