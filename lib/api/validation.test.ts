/**
 * F-111-01 (input-validering): tryParseJsonBody — trygt JSON-body parse.
 *
 * Dekker kjernen i at write-ruter ikke får malformed JSON til å bli 500:
 * funksjonen kaster aldri, men returnerer null ved ugyldig/ikke-objekt, slik
 * at ruten kan svare 400. Mock-en simulerer NextRequest sin .json() (kaster
 * ved ugyldig JSON, returnerer verdien ellers).
 */
import { tryParseJsonBody } from '@/lib/api/validation'

type MockReq = { json: () => Promise<unknown> }

const reqReturning = (value: unknown): MockReq => ({ json: async () => value })
const reqThrowing = (err: Error): MockReq => ({
  json: async () => {
    throw err
  },
})

describe('lib/api/validation — tryParseJsonBody (F-111-01)', () => {
  it('returnerer objektet ved gyldig JSON-objekt', async () => {
    const result = await tryParseJsonBody(reqReturning({ matchId: 'abc' }))
    expect(result).toEqual({ matchId: 'abc' })
  })

  it('returnerer tomt objekt (ikke null) ved tomt JSON-objekt', async () => {
    const result = await tryParseJsonBody(reqReturning({}))
    expect(result).toEqual({})
  })

  it('returnerer null ved ugylidig JSON (kaster ikke)', async () => {
    await expect(
      tryParseJsonBody(reqThrowing(new SyntaxError('Unexpected token in JSON')))
    ).resolves.toBeNull()
  })

  it('returnerer null ved JSON-array', async () => {
    await expect(tryParseJsonBody(reqReturning(['a', 'b']))).resolves.toBeNull()
  })

  it('returnerer null ved JSON-primitive (streng)', async () => {
    await expect(tryParseJsonBody(reqReturning('heisann'))).resolves.toBeNull()
  })

  it('returnerer null ved JSON-tall', async () => {
    await expect(tryParseJsonBody(reqReturning(42))).resolves.toBeNull()
  })

  it('returnerer null ved JSON-null', async () => {
    await expect(tryParseJsonBody(reqReturning(null))).resolves.toBeNull()
  })
})