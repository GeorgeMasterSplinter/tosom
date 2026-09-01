# ToSom API Responsstandard

**Versjon:** 1.0  
**Dato:** 2026-01-26  
**Status:** Standard for alle API-ruter

---

## STANDARDISERT RESPONSMANTY

### Success Response
```typescript
return NextResponse.json({ 
  success: true, 
  data: { ... } 
}, { status: 200 });
```

### Error Response
```typescript
return NextResponse.json({ 
  error: 'Feilmelding',
  code: 'ERROR_CODE'
}, { status: 400/401/403/404/500 });
```

---

## HTTP STATUSKODER

| Kode    | Brukes til                                           |
|---------|------------------------------------------------------|
| 200     | Suksess (alltid med `{ success: true, data: ... }`) |
| 400     | Ugyldig input/query parameters                       |
| 401     | Manglende/ugyldig autentisering                      |
| 403     | Autentisert men mangler autorisasjon                 |
| 404     | Ressurs ikke funnet                                 |
| 409     | Konflikt (t.d. duplicate, låst resurs)              |
| 410     | Ressurs utgått                                       |
| 500     | Intern serverfeil                                    |

---

## ERROR CODES

| Code                | Brukes til                                  |
|---------------------|---------------------------------------------|
| `INVALID_INPUT`    | Manglende eller feil format input           |
| `UNAUTHORIZED`     | Manglende session/Token                     |
| `FORBIDDEN`        | Mangler rolle/rettar                        |
| `NOT_FOUND`        | Ressurs ikke funnet                        |
| `CONFLICT`         | Duoplikat eller konflikt med eksisterande   |
| `GONE`             | Ressurs utgått                              |
| `INTERNAL_ERROR`   | Uventa serverfeil                           |
| `RATE_LIMITED`     | For mange førespurnader                     |

---

## EKSEMPLAR PER DOMENE

### Auth-ruter (app/api/auth/*)

```typescript
// Success — magic-link sendt
return NextResponse.json({
  success: true,
  data: { message: 'Sjekk e-posten din' },
}, { status: 200 });

// Error — ugyldig input
return NextResponse.json({
  error: 'Ugyldig e-postadresse',
  code: 'INVALID_INPUT',
}, { status: 400 });

// Error — manglende config
return NextResponse.json({
  error: 'Vipps er ikke konfigurert',
  code: 'INTERNAL_ERROR',
}, { status: 503 });
```

---

### Match-ruter (app/api/match/*)

```typescript
// Success — hent matcher
return NextResponse.json({
  success: true,
  data: {
    status: 'matched',
    matchId: 'xxx',
    conversationId: 'yyy',
  },
}, { status: 200 });

// Success — ny match oppretta
return NextResponse.json({
  success: true,
  data: {
    conversationId: 'yyy',
    match: { id: 'xxx', name: 'Anna', score: 0.85, tier: 'strongResonance' },
    nextEligibleAt: '2026-01-27T10:00:00Z',
  },
}, { status: 200 });

// Error — manglende userId
return NextResponse.json({
  error: 'Missing userId',
  code: 'INVALID_INPUT',
}, { status: 400 });

// Error — ikke autentisert
return NextResponse.json({
  error: 'Unauthorized',
  code: 'UNAUTHORIZED',
}, { status: 401 });

// Error — låst (24t-regel)
return NextResponse.json({
  error: 'Du er låst til en pågående reise.',
  code: 'CONFLICT',
  data: { nextEligibleAt: '2026-01-27T10:00:00Z' },
}, { status: 409 });
```

---

### Journey-ruter (app/api/journey/*)

```typescript
// Success — hent dagens oppgåve
return NextResponse.json({
  success: true,
  data: {
    day: 5,
    phase: 'EARLY',
    totalDays: 30,
    task: { title: 'Bryt isen', prompt: '...' },
  },
}, { status: 200 });

// Success — lagre refleksjon
return NextResponse.json({
  success: true,
  data: {
    milestone: { id: 'xxx', day: 5, title: 'Refleksjon dag 5' },
    completedDays: 3,
    message: 'Refleksjon lagra.',
  },
}, { status: 200 });

// Error — ingen reise funnet
return NextResponse.json({
  error: 'Ingen aktiv reise funnet',
  code: 'NOT_FOUND',
}, { status: 404 });
```

---

### Profile-ruter (app/api/profile/*)

```typescript
// Success — profil oppdatert
return NextResponse.json({
  success: true,
  data: { userId: 'xxx', message: 'Profil fullført!' },
}, { status: 200 });

// Error — identityName mangler
return NextResponse.json({
  error: 'identityName er påkrevd',
  code: 'INVALID_INPUT',
}, { status: 400 });
```

---

### Onboarding-ruter (app/api/onboarding/*)

```typescript
// Success — onboarding fullført
return NextResponse.json({
  success: true,
  data: { message: 'Onboarding fullført — du kan no få din fyrste match' },
}, { status: 200 });

// Error — ikke alle steg fylte
return NextResponse.json({
  error: 'Alle djup profil-steg må vera fylte før onboarding kan fullførast',
  code: 'INVALID_INPUT',
}, { status: 400 });
```

---

### Journey Resonance (app/api/journey/resonance)

```typescript
// Success — berekna resonans
return NextResponse.json({
  success: true,
  data: { scores, snapshot, resonance: 0.82 },
}, { status: 200 });

// Success — hent resonans (ingen data)
return NextResponse.json({
  success: true,
  data: { scores: null, message: 'Ingen resonans-data funnet.' },
}, { status: 200 });

// Error — mangler conversationId
return NextResponse.json({
  error: 'Mangler conversationId',
  code: 'INVALID_INPUT',
}, { status: 400 });
```

---

### Admin-ruter (app/api/admin/*)

```typescript
// Success — admin handling
return NextResponse.json({
  success: true,
  data: { ok: true },
}, { status: 200 });

// Error — ikke admin
return NextResponse.json({
  error: 'Forbidden',
  code: 'FORBIDDEN',
}, { status: 403 });

// Error — user ikke funnet
return NextResponse.json({
  error: 'User not found',
  code: 'NOT_FOUND',
}, { status: 404 });
```

---

### Payment-ruter (app/api/payment/*)

```typescript
// Success — checkout oppretta
return NextResponse.json({
  success: true,
  data: { sessionId: 'cs_xxx', url: 'https://...' },
}, { status: 200 });

// Error — webhook feil
return NextResponse.json({
  error: 'Kunne ikke opprette betalingssesjon',
  code: 'INTERNAL_ERROR',
}, { status: 500 });
```

---

### System-ruter (app/api/system/*)

```typescript
// Success — health check
return NextResponse.json({
  status: 'ok',
  timestamp: '2026-01-26T15:00:00Z',
  system: { uptime: '5d 3h 2m 14s', memory: {...}, database: {...} },
}, { status: 200 });

// Error — health degraded
return NextResponse.json({
  status: 'degraded',
  timestamp: '2026-01-26T15:00:00Z',
  database: { status: 'error', error: 'Connection timeout' },
}, { status: 503 });
```

---

## REGELAR FOR RESPONSMANTY

### ✅ GJER ALLTID

1. Bruk `NextResponse.json()` — ikke `new Response(JSON.stringify(...))`
2. Success-responsar har alltid `{ success: true, data: { ... } }`
3. Error-responsar har alltid `{ error: '...', code: '...' }`
4. Status-koder er semantisk korrekte (401 for auth, 403 for autorisasjon, etc.)
5. Bruk standard error codes: `INVALID_INPUT`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `GONE`, `INTERNAL_ERROR`

### ✗ GJER IKKE

1. Ikke bland `{ ok: true }` med `{ success: true, data: ... }`
2. Ikke returner flat JSON uten `data`-wrap ved suksess
3. Ikke manglende `code` på error-responsar
4. Ikke bruk ulike format for same type av respons
5. Ikke nytt `new Response(JSON.stringify(...))` når `NextResponse.json()` er tilgjengeleg

---

## MIGRERINGSGUIDE

### Fase 1 — CORE-domene (match, journey, profile, auth)
- Oppdater success-responsar fra `{ ok: true }` eller `{ success: true, ... }` til `{ success: true, data: { ... } }`
- Legg til `code` på alle error-responsar
- Konverter `new Response(JSON.stringify(...))` til `NextResponse.json()`

### Fase 2 — Onboarding & Profile
- Same standardisering som ovanfor
- Spesifikt: `onboarding/complete`, `profile/setup`, `onboarding/save`

### Fase 3 — Admin-ruter
- Standardiser alle admin-admin responsar
- Sikre at alle har `{ success: true, data: { ... } }` eller `{ error: '...', code: '...' }`

### Fase 4 — System & Analytics
- Oppdater system/health, analytics/track, cron-ruter
- Sikre einheitlig format over heile plattformen

---

## STANDARD SJABLONN FOR NYE POST-RUTER

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { csrfCheck } from '@/lib/auth/csrf';
import { mySchema, validateWithZod } from '@/lib/validation/api';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth-sjekk (vanlege brukere)
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;
    
    // 2. CSRF-beskyttelse
    const csrf = await csrfCheck(req);
    if (csrf instanceof NextResponse) return csrf;

    // 3. Input-validering
    const validated = validateWithZod(mySchema, await req.json());
    if ('error' in validated) {
      return NextResponse.json({ error: validated.error, code: 'INVALID_INPUT' }, { status: 400 });
    }
    const body = validated.data;

    // ... business logic ...

    return NextResponse.json({
      success: true,
      data: { resultData },
    }, { status: 200 });
  } catch (err) {
    console.error('RouteName POST-feil:', err);
    return NextResponse.json({
      error: 'Kunne ikke utføre operasjonen',
      code: 'INTERNAL_ERROR',
    }, { status: 500 });
  }
}
```

---

## CSRF-BESKYTTELSE

**Fil:** `lib/auth/csrf.ts` — tilbyr `csrfCheck()`, `verifyCsrfToken()`, `generateCsrfToken()`, `setCsrfCookie()`

### Aktivering
CSRF-beskyttelse er kontrollert av `ENABLE_CSRF_PROTECTION=true` i `.env`.

| Miljø        | csrfCheck() oppfører seg                            |
|--------------|-----------------------------------------------------|
| Development  | Alltid { ok: true } — ingen validering             |
| Production   | Krev gyldig X-CSRF-Token header + cookie-sammenligning |

### Client-side bruk
```javascript
// Hent CSRF-token (gjer en gong per session)
const response = await fetch('/api/csrf/token');
const token = response.headers.get('x-csrf-token');

// Bruk i POST-request
fetch('/api/some-action', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': token,
  },
  body: JSON.stringify({ data: '...' }),
});
```

---

# SLUTT PÅ API-RESPONSE-STANDARD
