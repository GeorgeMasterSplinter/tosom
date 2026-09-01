# ToSom — Tilgangsstyring (Hvordan det fungerer)

**Opprettet:** 2026-06-22  
**Status:** Første versjon

## Oversikt

ToSom har tre nivå av tilgang. Desse nivåa styrer hva sider en bruker kan nå.

---

## Nivå 0: Uinnlogget (Public)

Hvem som helst kan besøke:

- `/` — Landing page
- `/hvorfor` — Hvorfor velge ToSom
- `/slik` — Slik fungerer det
- `/reisen` — Guidet 30-dagers reise
- `/priser` — Priser (beta)
- `/betaling` — Betalings-side
- `/login` — Innlogging

Desse sidene krev ingen innlogging.

---

## Nivå 1: Innlogget

En bruker som har logga inn via magic link kan nå:

- `/dashboard` — Bruker-dashboard
- `/onboarding/*` — Profil-onboarding
- `/profile/*` — Profil-redigering
- `/questions` — Spørreskjema

**Krev:** Gyldig session cookie (next-auth eller tosom_session).

**Uten innlogging:** Redirect til `/login` med `callbackUrl`-parameter.

---

## Nivå 2: Betalt / Full profil (TODO: ikke implementert ennå)

En bruker med betalt abonnement kan også nå:

- `/matching` — Resonans-matching
- `/journey/*` — Guidet 30-dagers reise
- `/chat/*` — Samtale-rom

**Krev (framtidig):**

1. Gyldig session (nivå 1)
2. Betalt abonnement eller engangsbetaling
3. Profil markert som "fullført"

**TODO:**
```typescript
// I middleware.ts:
// if (!user.hasPaid || !user.profileComplete) {
//   return NextResponse.redirect(new URL('/betaling', req.url));
// }
```

---

## Admin

- `/admin/*` — Admin-panel
- **Krev:** ADMIN rolle i databasen

---

## Implementeringsdetaljar

### Middleware (nåverande)

- `middleware.ts` verifiserer session for nivå 1 og nivå 2
- Uinnloggede → redirect til `/login` med callbackUrl
- API-ruter → returnerer 401 når ingen session

### API-vern

- `lib/auth/requireAuth.ts` — Verifiser session/token for API-kall
- `lib/auth/adminAuthGuard.ts` — Admin-ber for API

---

## Test-scenario

### 1. Inkognito-test
Gå til `/dashboard` uten å være innlogga → bør redirect til `/login`

### 2. Innlogget-test
Logg inn → kan nå `/dashboard` men ikke `/matching`

### 3. Betalt-test (framtidig)
Når betaling er implementert → kan nå alle sider

---

## Nøkkeldokumentasjon

- [access-model.md](access-model.md) — Detaljert tilgangsmodell
- [account-flow.md](account-flow.md) — Konto + betalingsflyt
- [HOW-TO-PRODUCT.md](HOW-TO-PRODUCT.md) — Produkt-sider
- [tosom-core-definition.md](../tosom-core-definition.md) — Kjerne-definisjon