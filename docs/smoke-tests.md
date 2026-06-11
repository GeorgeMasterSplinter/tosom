# ToSom Smoke Tests

## Formål
Smoke tests verifiserer at alle kritiske endepunkt i ToSom fungerer rett etter deploy. Dei køyrast automatisk eller manuelt for å oppdage feil tidleg.

## Korleis køyre scriptet

### Lokal (localhost)
```bash
npx tsx scripts/smoke/smokeTest.ts
```

### Mot pre-prod
```bash
SMOKE_BASE_URL=https://api-preprod.tosom.no \
SMOKE_ADMIN_TOKEN=<din-admin-token> \
npx tsx scripts/smoke/smokeTest.ts
```

### Mot produksjon (med forsiktighet!)
```bash
SMOKE_BASE_URL=https://api.tosom.no \
SMOKE_ADMIN_TOKEN=<din-admin-token> \
npx tsx scripts/smoke/smokeTest.ts
```

## Miljøvariablar

| Variabel | Verdi | Obligatorisk |
|------|-----|------|
| `SMOKE_BASE_URL` | Base-URL til serveren | Nei (default: localhost:3000) |
| `SMOKE_ADMIN_TOKEN` | Admin Bearer token | Nei (valfritt) |

## Testa endepunkt

| Endepunkt | Forventa status | Krev admin | Mål |
|------|-------|-------|------|
| `/api/system/health` | 200 | Nei | DB er tilkopla og appen svarar |
| `/api/system/latency` | 200 | Nei | Latensmåling fungerer |
| `/api/admin/system/overview` | 200 | Ja | Admin dashboard fungerer |
| `/api/admin/observability/metrics` | 200 | Ja | Observability-dashboard fungerer |
| `/api/admin/security/overview` | 200 | Ja | Security-dashboard fungerer |
| `/api/ai/match-insights` | 401 | Nei | AI-endepunkt krev autorisering |

## Kriterier for godkjent resultat

- **Alle endepunkt skal returnere forventa statuskode** (200 eller 401 som spesifisert)
- **Latens skal vere under 1000ms** for alle endepunkt
- **Ingen HTTP 500-feil**
- **Ingen timeout** (over 10 sekund)

## Vanlege feil og korleis løysa dei

| Feil | Årsak | Løysing |
|------|-------|------|
| `Connection refused` | Serveren køyrer ikkje | Start serveren først |
| `timeout` | Serveren svarar for seint | Sjekk DB-tilkopling og minne |
| `401 Unauthorized` | Manglande eller feil admin token | Sjekk at SMOKE_ADMIN_TOKEN er gyldig |
| `500 Internal Server Error` | Backend feil | Sjekk loggar med `logs/query` |
| `DNS resolution failed` | Ugyldig URL | Sjekk SMOKE_BASE_URL |
| `ERR_TLS_CERT_ALTNAME_INVALID` | Ugyldig SSL-sertifikat | Bruk `NODE_TLS_REJECT_UNAUTHORIZED=0` |

## Automatisk køyring i CI/CD

I pipeline etter deploy:
```bash
SMOKE_BASE_URL=https://api-preprod.tosom.no \
SMOKE_ADMIN_TOKEN=<token> \
npx tsx scripts/smoke/smokeTest.ts || exit 1
```

## Feilsøking

### Ingen resultat blir vist
Sjekk at serveren har starte ferdig. Vent 10 sekund etter deploy før køyring.

### Alle testar feil
Sjekk at:
- Serveren køyrer på rett port
- CORS er konfigurert korrekt
- Admin-token er gyldig og ikkje utgått

###个别 testar feil
Sjekk loggar for det spesifikke endepunktet med:
```bash
npx tsx lib/system/logQuery.ts --module system
```
