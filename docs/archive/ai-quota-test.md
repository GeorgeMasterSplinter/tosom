# ToSom AI Quota Test

## Formål
AI Quota-testen verifiserer at:
- Alle AI-endepunkt fungerer i pre-prod
- Rate-limit fungerer korrekt
- Feilhandtering gir retts feilkodar
- AIRequestLog blir fylt med data
- Observability viser AI-kall

## Hva som blir testa

### 1. Normal-kall
- `/api/ai/message-suggestions` — 200 OK
- `/api/ai/profile-rewrite` — 200 OK
- `/api/ai/match-insights` — 200 OK
- `/api/ai/journey-guidance` — 200 OK

### 2. Rate-limit test
- 20 raske kall til `/api/ai/message-suggestions`
- Minst éin skal returnere **429 Too Many Requests**

### 3. Feilhandtering
- Ugyldig payload (tom tekst) → **400 Bad Request**
- Ingen token → **401 Unauthorized**
- Ugyldig admin token → **401/403 Unauthorized**

### 4. Verifisering
- `/api/admin/ai/logs` → 200 med AIRequestLog-data

## Hvordan køyre scriptet

### Lokal (med AI_API_KEY)
```bash
AI_API_KEY=din-nøkkel AI_TEST_BASE_URL=http://localhost:3000 npx tsx scripts/ai/aiQuotaTest.ts
```

### Mot pre-prod
```bash
AI_API_KEY=din-nøkkel \
AI_TEST_BASE_URL=https://api-preprod.tosom.no \
AI_USER_TOKEN=bruker-token \
AI_ADMIN_TOKEN=admin-token \
npx tsx scripts/ai/aiQuotaTest.ts
```

### Uten AI-key (bare feilhandtering)
```bash
AI_TEST_BASE_URL=https://api-preprod.tosom.no npx tsx scripts/ai/aiQuotaTest.ts
```

## Forventa resultat

### Grønt lys — ALT PASS
```
Alle AI-tester bestått! ✓
```
- Alle normal-kall returnerer 200
- Rate-limit triggar
- Feilhandtering gir retts feilkodar
- Admin AI-logs fungerer

### Gult lys — WARN
```
rate-limit ikke trigga — kan være ok dersom kvoten er høg
```
- Rate-limit er konfigurert med høg kvote
- Test OK, men sjekk rate-limit-konfigurasjon

### Raudt lys — FAIL
```
Failed tests:
  - profileRewrite: Expected 200, got 500
```
- Critical problem med AI-kalla
- Sjekk server-loggar

## Vanlege feil og hvordan løyse de

| Feil | Årsak | Løysing |
|------|-----|---|
| `Expected 200, got 500` | Backend-feil | Sjekk server-loggar |
| `Expected 200, got 401` | Manglende API-key | Sett AI_API_KEY |
| `Connection refused` | Server køyrer ikke | Start serveren |
| `timeout` | AI-provider seint | Sjekk AI-key og kvote |
| `Rate-limit ikke trigga` | Høg kvote | OK — sjekk rate-limit-konfig |
| `DNS resolution failed` | Ugyldig URL | Sjekk AI_TEST_BASE_URL |

## Hvordan se AIRequestLog i admin

Gå til `/admin/ai/logs` i browseren. Eller kall API-et direkte:

```bash
curl https://api-preprod.tosom.no/api/admin/ai/logs \
  -H "Authorization: Bearer <admin-token>"
```

Svar:
```json
{
  "totalLogs": 150,
  "recentRequests": [
    {
      "userId": "test",
      "endpoint": "message-suggestions",
      "status": 200,
      "latency": 320,
      "createdAt": "2026-06-08T06:30:00Z"
    }
  ]
}
```

## Hvordan se AI-kall i observability

Gå til `/admin/observability/metrics` og sjekke:

1. **AI-kall-statistikk** — Totalt antal kall per endpoint
2. **AI-latens** — p50/p90/p95 per endpoint
3. **AI-feilrate** — Feil per 100 kall
4. **AI-kvote** — Brukt/total kvote

### Via API
```bash
curl https://api-preprod.tosom.no/api/admin/observability/metrics \
  -H "Authorization: Bearer <admin-token>"
```

Svaret skal innehalde AI-statistikk under `metrics.ai` eller `metrics.perEndpoint`.

## Sjekkliste før AI-deploy

- [ ] Alle normal-kall returnerer 200
- [ ] Rate-limit triggar etter forvent antal kall
- [ ] Feilhandling gir retts feilkodar (400/401/403)
- [ ] Admin AI-logs viser data
- [ ] Observability viser AI-statistikk
- [ ] Ingen 500-feil i loggar
