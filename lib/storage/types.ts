/**
 * lib/storage/types.ts — Lagringsgrensesnitt for bilder
 *
 * Abstraherer objektlagringen slik at:
 *   - R2 (produksjon) og lokal fil (utvikling) byttes med én env.
 *   - Tester kjører uten nettverk (memory-driver).
 *   - Leverandørbytter senere blir trivielle.
 *
 * Kontrakt:
 *   - `putImage` lager et objekt under `key` med MIME-type.
 *   - `getSignedUrl` utsteder en kortlevd URL som gir tilgang til objektet.
 *     ALDRI en offentlig/permanent URL — et bilde delt i fortrolighet skal
 *     ikke ligge på en gjettbar lenke (masterplan §8, GDPR).
 *   - `deleteImage` sletter objektet permanent (GDPR art. 17 ved reiseslutt).
 *   - `exists` rapporterer om objektet er til stede.
 *
 * `key` er alltid i formatet `{conversationId}/{uuid}.{ext}` — aldri en
 * absolutt sti, aldri med `..`. Se `assertSafeImageKey`.
 */

export interface PutImageOptions {
  /** MIME-type, f.eks. `image/jpeg`. Lagres som Content-Type på objektet. */
  contentType: string;
}

export interface ImageStorage {
  /** Hvilken driver dette er — `r2` | `local` | `memory`. */
  readonly driver: 'r2' | 'local' | 'memory';

  /** Lagrer et bilde under `key`. Overskriver eksisterende objekt med samme nøkkel. */
  putImage(key: string, buffer: Buffer, options: PutImageOptions): Promise<void>;

  /**
   * Utsteder en signert URL med kort levetid for `key`.
   * Returnerer en absolutt URL:
   *   - r2: presigned `https://`-URL
   *   - local: `file://`-URL til lokal fil
   *   - memory: `memory://`-URL (kun for testing)
   */
  getSignedUrl(key: string, ttlSeconds?: number): Promise<string>;

  /** Sletter objektet. Idempotent — feiler ikke hvis objektet ikke finnes. */
  deleteImage(key: string): Promise<void>;

  /** Rapporterer om objektet eksisterer. */
  exists(key: string): Promise<boolean>;
}

/**
 * Validerer at en imageKey er i et trygt format før den brukes.
 * Format: `{conversationId}/{uuid}.{ext}` — én skråstrek, ingen `..`, ingen
 * absolutt sti. Kaster `Error` ved ulovlig key for å forhindre path-traversal
 * og at en manglende validering i en rute blir en lekkasjevei.
 */
export function assertSafeImageKey(key: string): string {
  if (typeof key !== 'string' || key.length === 0) {
    throw new Error('imageKey: tom nøkkel');
  }
  // Ingen absolutte stier eller Windows-stier
  if (key.startsWith('/') || key.startsWith('\\') || /^[a-zA-Z]:/.test(key)) {
    throw new Error('imageKey: absolutt sti er ikke tillatt');
  }
  // Ingen path-traversal
  if (key.split('/').some((seg) => seg === '..' || seg === '.')) {
    throw new Error('imageKey: path-traversal er ikke tillatt');
  }
  // Må ha nøyaktig én skråstrek: {conversationId}/{fileName}
  const slashCount = (key.match(/\//g) ?? []).length;
  if (slashCount !== 1) {
    throw new Error('imageKey: forventer format {conversationId}/{fileName}');
  }
  // Filnavnet må ha en utvidelse
  const fileName = key.split('/')[1];
  if (!/\.[a-z0-9]{1,8}$/.test(fileName)) {
    throw new Error('imageKey: filnavnet mangler gyldig utvidelse');
  }
  return key;
}

/** Bygger en imageKey fra delene. Konstant format for alle drivere. */
export function buildImageKey(conversationId: string, uuid: string, ext: string): string {
  return `${conversationId}/${uuid}${ext}`;
}