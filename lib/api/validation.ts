/**
 * ToSom — Zod-validation for API-ruter
 *
 * Gir felles validerings-hjelpere for API-ruter.
 *
 * MERK (F-111-02 / ACT 1.2, Fase 1): De konkrete, rute-spesifikke Zod-skjemaene
 * som tidligere stod her (MagicLinkSchema, PhoneSendSchema, ProfileSetupSchema,
 * JourneyReflectSchema, Admin*Schema, AI*Schema m.fl.) var DØD KODE — ingen rute
 * eller handler refererte dem, og flere var mismatched mot det rutene faktisk
 * sender (se funnregister F-111-01/F-111-02). De er fjernet for ikke å gi et
 * feilaktig inntrykk av Zod-dekning.
 *
 * De reelle, brukte rute-skjemaene bor i lib/validation/* (t.d. lib/validation/auth.ts,
 * lib/validation/api.ts). Når en rute migreres til createApiHandler (Fase 2/3),
 * defineres korrekt skjema der og kobles inn via validateBody.
 */

import { z } from 'zod'

// ─── Felles hjelpefunksjonar ───

/**
 * Valider body med et Zod-skjema.
 */
export function validateBody<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

/**
 * Valider query med et Zod-skjema.
 */
export function validateQuery<T extends z.ZodTypeAny>(
  schema: T,
  query: Record<string, string | string[] | undefined>
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } {
  // Konverter til plain object
  const plain: Record<string, string> = {}
  for (const [key, value] of Object.entries(query)) {
    plain[key] = Array.isArray(value) ? value[0] ?? '' : (value ?? '')
  }
  const result = schema.safeParse(plain)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

// ─── Trygt body-parse (F-111-01 core) ───

/**
 * tryParseJsonBody — trygt JSON-body parse for API-ruter.
 *
 * Returnerer det parserte objektet (samme `any` som `req.json()` gir), eller
 * `null` hvis body ikke er gyldig JSON eller ikke et flatt objekt
 * (array/primitive/NULL). Kaster aldri — ruten kan returnere 400 ved `null`
 * i stedet for at rå `req.json()` kaster og ender som 500 (malformed-JSON-holet
 * i F-111-01).
 *
 * Returtypen `any` er med vilje: rutene har tidligere fått `any` fra
 * `req.json()`, så dette holder den eksisterende typehåndteringen — ingen
 * endring av eksisterende kode, bare feilsikring mot ugyldig body.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function tryParseJsonBody(req: { json: () => Promise<unknown> }): Promise<any> {
  try {
    const data: unknown = await req.json()
    if (data === null || typeof data !== 'object' || Array.isArray(data)) return null
    return data
  } catch {
    return null
  }
}
