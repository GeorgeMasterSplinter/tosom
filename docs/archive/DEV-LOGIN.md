# Dev Login — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 2.0

---

## HVA ER DEV LOGIN?

Dev Login er en utviklingshjelp som lar deg logge inn som ulike testbrukere uten å gå gjennom vanlig autentisering. Dette er **kun for utvikling** og skal aldri brukes i produksjon.

---

## AKTIVERING

Sett følgende miljøvariabel i din `.env.local` eller `.env`:

```
DEV_LOGIN_ENABLED=true
```

Uten denne variablen er dev-login utilgjengelig (503-feil).

---

## API-REFERANSE

### GET /api/dev-login?userId=xxx

Innlogging med GET-forespørsel.

**Parametre:**
- `userId` (obligatorisk): Identifikator for testbruker

**Tilgjengelige brukere:**
| userId | Email | Rolle | Beskrivelse |
|--------|-------|-------|-------------|
| `test-user-1` | test1@tosom.no | USER | Standard testbruker – full onboarding |
| `test-user-2` | test2@tosom.no | USER | Standard testbruker – ufullstendig profil |
| `test-user-3` | test3@tosom.no | USER | Standard testbruker – med match og reise |
| `test-admin` | admin@tosom.no | ADMIN | Admin-testbruker med admin-panel-tilgang |

**Eksempel:**
```
GET /api/dev-login?userId=test-user-1
```

**Respons:**
- 302 redirect til `/dashboard` med session-cookie
- 400 med tilgjengelige brukere ved ugyldig userId
- 503 ved dev-login deaktivert

---

### POST /api/dev-login

Innlogging med POST-forespørsel (kan brukes fra frontend).

**Body:**
```json
{
  "userId": "test-user-1",
  "redirect": "/dashboard"
}
```

**Parametre:**
- `userId` (obligatorisk): Se over
- `redirect` (valgfritt): Hvor du vil redirectes (standard: `/dashboard`)

**Eksempel:**
```bash
curl -X POST http://localhost:3000/api/dev-login \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user-1", "redirect": "/dashboard"}'
```

**Respons:**
- 302 redirect med session-cookie
- 400 med feilmelding ved ugyldig input

---

### GET /api/dev-login/status

Sjekk om dev-login er aktivert og hvilke brukere som er tilgjengelige.

**Eksempel:**
```bash
curl http://localhost:3000/api/dev-login/status
```

**Respons:**
```json
{
  "enabled": true,
  "availableUsers": ["test-user-1", "test-user-2", "test-user-3", "test-admin"],
  "usage": "GET /api/dev-login?userId=xxx eller POST /api/dev-login { userId: \"xxx\" }"
}
```

---

### GET /api/dev-login/users

Hent liste over tilgjengelige testbrukere.

**Eksempel:**
```bash
curl http://localhost:3000/api/dev-login/users
```

**Respons:**
```json
{
  "users": [
    {
      "id": "test-user-1",
      "name": "Testbruker 1",
      "email": "test1@tosom.no",
      "role": "USER",
      "description": "Standard testbruker – full onboarding"
    },
    ...
  ]
}
```

---

## SJALVSTYRT INNSIDE

Siden `/dev-login` viser alle tilgjengelige testbrukere med dynamisk henting fra API.

**Bruk:**
1. Gå til `/dev-login`
2. Velg en testbruker
3. Du blir redirectet til `/dashboard` med aktiv session

---

## SIKKERHET

### ✅ Sikkerhetstiltak
- Kun aktiv når `DEV_LOGIN_ENABLED=true`
- Kun `httpOnly` cookies
- `sameSite: lax`
- Ingen produksjonsbruk
- Automatically creates users if they don't exist
- Brukere merkes med `verified: true`

### ❌ Hva som IKKE er trygt
- Ingen rate limiting
- Ingen IP-basert begrensning
- Ingen 2FA eller verifikasjon
- Ingen logging av innlogginger (kan legges til senere)

---

## FEILFINDING

### "Dev-login er ikke aktivert"
Sett `DEV_LOGIN_ENABLED=true` i miljøvariabelene.

### "Kan ikke koble til dev-login API"
Sjekk at serveren kjører og at API-ruten er korrekt.

### "Ingen testbrukere tilgjengelige"
Sjekk at `TEST_USERS`-objektet er riktig definert i API-koden.

---

## EKSTERN BRUK (CURL)

```bash
# Sjekk status
curl http://localhost:3000/api/dev-login/status

# Hent brukere
curl http://localhost:3000/api/dev-login/users

# Innlogging med GET
curl -L http://localhost:3000/api/dev-login?userId=test-user-1

# Innlogging med POST
curl -X POST http://localhost:3000/api/dev-login \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user-1"}' \
  -L
```

---

## MÅL

- Rask testavvikling uten vanlig login-flyt
- Mulighet til å teste ulike brukerroller (USER, ADMIN)
- Ingen manuelt opprettelse av testbrukere nødvendig
- Dynamisk brukervalg via API