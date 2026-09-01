# ToSom Load Testing

## Formål
Load-tester simulera moderat trykk mot ToSom for å oppdage:
- Latensproblem før de påverkar brukere
- Høge feilrate under last
- Stabilitetsproblem i pre-prod eller produksjon

## Hvordan køyre scriptet

### Lokal (localhost)
```bash
npx tsx scripts/load/basicLoadTest.ts
```

### Mot pre-prod med custom parametrar
```bash
LOAD_BASE_URL=https://api-preprod.tosom.no \
LOAD_CONCURRENCY=30 \
LOAD_REQUESTS=100 \
LOAD_USER_TOKEN=<bruker-token> \
LOAD_ADMIN_TOKEN=<admin-token> \
npx tsx scripts/load/basicLoadTest.ts
```

### Enkel test (færre request)
```bash
LOAD_CONCURRENCY=5 LOAD_REQUESTS=20 npx tsx scripts/load/basicLoadTest.ts
```

## Miljøvariablar

| Variabel | Verdi | Default | Obligatorisk |
|------|-----|-----|------|
| `LOAD_BASE_URL` | Base URL til server | `http://localhost:3000` | Nei |
| `LOAD_CONCURRENCY` | Samtidige worker | `20` | Nei |
| `LOAD_REQUESTS` | Request per worker | `50` | Nei |
| `LOAD_USER_TOKEN` | Dummy bruker-token | `dummy-user-token` | Nei |
| `LOAD_ADMIN_TOKEN` | Dummy admin-token | `dummy-admin-token` | Nei |

## Totalt tal på request
Total = CONCURRENCY × REQUESTS (t.d. 20 × 50 = **1000 request**)

## Testa endepunkt

| Endepunkt | Krev token | Type | Mål |
|------|------|--|--|
| `/api/system/health` | Nei | Infrastruktur | Systemet køyr |
| `/api/system/latency` | Nei | Infrastruktur | Latensmåling |
| `/api/messages/list` | Bruker-token | Messaging | Meldingslaster |
| `/api/ai/message-suggestions` | Bruker-token | AI | AI-last |
| `/api/admin/system/overview` | Admin-token | Admin | Admin-dashboard |

## Anbefalte tersklar

| Komponent | p95-grense | error-rate-grense |
|--|------|------|
| Messaging (messages/list) | **< 500ms** | **< 5%** |
| AI (message-suggestions) | **< 800ms** | **< 5%** |
| Admin dashboard | **< 2000ms** | **< 5%** |
| Health/Latency | **< 200ms** | **< 5%** |

### Generelle tersklar
- **error-rate < 5%** — akseptabelt for alle endpoint
- **p95 < 5000ms** — absolutt øvre grense
- **Ingen HTTP 500-feil** — alltid feil

## Vanlege feil og årsaker

| Feil | Mogleg årsak | Hvordan løysa |
|------|--|---|
| `Connection refused` | Server køyrer ikke | Start serveren først |
| `timeout` | DB seint, minne fullt, CPU-mangel | Sjekk serverressursar og DB |
| `401 Unauthorized` | Feil eller utgått token | Oppdater LOAD_USER_TOKEN/LOAD_ADMIN_TOKEN |
| `403 Forbidden` | Admin ikke autorisert | Sjekk admin-rolla |
| `429 Too Many Requests` | Rate-limit trigga | Senk LOAD_CONCURRENCY |
| `500 Internal Server Error` | Backend-bug | Sjekk server-loggar |
| `DNS resolution failed` | Ugyldig URL | Sjekk LOAD_BASE_URL |
| `ERR_TLS_CERT_ALTNAME_INVALID` | SSL-problem | Test med localhost først |

## Hvordan tolke resultatene

### Grønt lys — ALT PASS
```
  RESULT: ALL PASSED (error-rate < 5%)
```
- Systemet tål lasten
- Klar for vidare test eller deploy

### Gult lys — noen p95 over 2000ms men error-rate < 5%
```
  endpoint              p50   p90   p95   p99 worst errors  result
------------------------------------------------------------
  Admin System Overview 120ms  800ms 3500ms 4200ms 4800ms      0    WARN
```
- Akseptabelt men ikke optimalt
- Sjekk DB-spørringar og AI-respons

### Raudt lys — FAIL
```
  RESULT: 1 endpoint(s) FAILED, error-rate 12.3%
```
- Critical problem — ikke klar for deploy
- Sjekk loggar: `npx tsx lib/system/logQuery.ts --module <module>`
- Senk LOAD_CONCURRENCY for å isolere problemet

## Tolking av percentiles

| Percentile | Tyding |
|--|-----|
| p50 | Halvparten av alle response er under denne verdien |
| p90 | 90% av alle response er under denne verdien |
| p95 | **Top 5% verste response** — viktigaste metrikk |
| p99 | Top 1% verste response |
| worst | Verste einsele response i testen |

**Merk:** p95 er den viktigaste metrikk. Hvis p95 er godkjent men p99 er høg, betyr det at noen få request var tregere enn normalt — sjekk om det er timeout eller nettverksproblem.

## Automatisk køyring i CI/CD

I pipeline etter deploy til pre-prod:
```bash
LOAD_BASE_URL=https://api-preprod.tosom.no \
LOAD_CONCURRENCY=20 \
LOAD_REQUESTS=50 \
LOAD_USER_TOKEN=$PREPROD_USER_TOKEN \
LOAD_ADMIN_TOKEN=$PREPROD_ADMIN_TOKEN \
npx tsx scripts/load/basicLoadTest.ts || exit 1
```

## Tips for feilsøking

1. **Start med låg last:** `LOAD_CONCURRENCY=5 LOAD_REQUESTS=10`
2. **Auka gradvis:** 10, 20, 30, 50
3. **Isoler endpoint:** Test kvart endpoint einzelt ved å kommentere ut de andre
4. **Sammenlign med baseline:** Lagre resultat og sammenlign etter endringer
