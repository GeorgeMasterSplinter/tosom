# ToSom Observability & Security Sanity Check

## Formål
Dette dokumentet beskriv korleis ein verifiserer at observability- og sikkerheitslagene fungerer korrekt i pre-prod før lansering til produksjon. Det skal gje ein rask og strukturert oversikt over status for system-overvaking og sikkerheitsmekanismar.

---

## Observability-sjekk

### Endepunkt som skal testast

| Endepunkt | Forventa status | Mål |
|------|-------|---|
| `GET /api/admin/observability/metrics` | 200 | Performance metrics per endpoint |
| `GET /api/admin/observability/heatmap` | 200 | Route-frequency heatmap |
| `GET /api/admin/observability/traces` | 200 | Request trace-loggar |

### Verifisering av Metrics

Frå `/api/admin/observability/metrics` skal desse felta vere til stades:

| Felt | Krav | Merknad |
|------|----|-----|
| `metrics.perEndpoint` | Til stades, ikkje tom | Latens per endpoint (p50/p90/p95/p99) |
| `metrics.ai` | Til stades (kan vere null) | AI-statistikk (kall, latency, feilrate) |
| `metrics.performance` | Til stades | Total system-ytelse |
| `metrics.errorRate` | Til stades | Feilrate i prosent |
| `metrics.dbLatency` | Til stades | DB-latens i ms |

### Verifisering av Heatmap

Frå `/api/admin/observability/heatmap` skal desse felta vere til stades:

| Felt | Krav | Merknad |
|------|----|-----|
| `routes` | Til stades, ikkje tom | Array med route-slug og frekvens |
| Top routes | Minste eitt entry | Skall vere API-ruter som /api/ai/*, /api/messages/*, /api/match/* |

### Verifisering av Traces

Frå `/api/admin/observability/traces` skal desse felta vere til stades:

| Felt | Krav | Merknad |
|------|----|-----|
| `traces` | Til stades, ikkje tom | Array med trace-objekt |
| kvar trace.traceId | Til stades, unik | Skal følge heile request-kjeden |
| kvar trace.endpoint | Til stades | Endpoint som vart kalla |
| kvar trace.latency | Til stades | Latens i ms |
| kvar trace.statusCode | Til stades | HTTP-statuskode |
| kvar trace.createdAt | Til stades | Timestamp |

### Manuell test av observability

1. Gjør **5–10 kall** til ulike API-ruter:
   ```bash
   # Health
   curl https://api-preprod.tosom.no/api/system/health

   # AI
   curl -X POST https://api-preprod.tosom.no/api/ai/message-suggestions \
     -H "Authorization: Bearer <user-token>" \
     -H "Content-Type: application/json" \
     -d '{"userId":"manual-test","day":1,"type":"reflection"}'

   # Admin overview
   curl https://api-preprod.tosom.no/api/admin/system/overview \
     -H "Authorization: Bearer <admin-token>"

   # Latency
   curl https://api-preprod.tosom.no/api/system/latency
   ```

2. Sjekk at kallane dukkar opp i:
   - **Heatmap** — ruter skal ha auka frekvens
   - **Traces** — nye trace-objekt skal vere til stades med gyldige traceId
   - **Metrics** — latency og error-rate skal oppdaterast

### Spesifikke krav

- **traceId** skal følge heile request-kjeden — samanlikn traceId frå request headers med den i trace-loggen
- **API heatmap** skal vise trafikk frå smoke-tester, load-tester og AI-testar
- **Latency-metrics** skal oppdaterast (p50/p90/p95/p99) — data skal vere fersk (ikkje stale)
- **Error-rate** skal visast korrekt — feil frå load-testar skal synast her
- **DB-latency** skal visast korrekt — skal vere < 50ms i pre-prod
- **RouteHit-modellen** skal fyllast med data — kvar API-kall skal opprette ein RouteHit-entry

---

## Security-sjekk

### Endepunkt

| Endepunkt | Forventa status | Mål |
|------|-------|---|
| `GET /api/admin/security/overview` | 200 | Security oversikt |

### Verifisering av Security Overview

Frå `/api/admin/security/overview` skal desse felta vere til stades:

| Felt | Krav | Merknad |
|------|----|-----|
| `failedLogins.total` | Til stades | Totalt antal mislukka innloggingar |
| `failedLogins.byIp` | Til stades (kan vere tom) | Gruppering etter IP |
| `failedLogins.byEmail` | Til stades (kan vere tom) | Gruppering etter e-post |
| `rateLimits.total` | Til stades | Totalt antal rate-limit |
| `rateLimits.byRoute` | Til stades | Gruppering etter endpoint |
| `rateLimits.byUser` | Til stades | Gruppering etter brukar |
| `sessions.totalActive` | Til stades | Antal aktive session |
| `sessions.recentLogins` | Til stades | Nylege innloggingar |
| `sessions.suspiciousLogins` | Til stades | Miste eitt skal vere > 0 (simulert) |
| `audit.totalActions` | Til stades | Totalt antal admin-handlingar |
| `audit.byAction` | Til stades | Gruppering etter handlingstype |
| `audit.topAdmins` | Til stades | Top admin-brukarar |
| `audit.suspiciousActions` | Til stades | Miste eitt skal vere > 0 (simulert) |

### Sikkerheitsmekanismer som skal bekreftast

#### 1. Session Fingerprinting
- **ipHash** blir generert og lagret ved kvar innlogging
- **userAgentHash** blir generert og lagret ved kvar innlogging
- Mismatch mellom original og lagret hash gir **401 Unauthorized**
- Test: Bytt IP eller User-Agent → skal få 401

#### 2. Brute-force-beskyttelse
- Simuler **5 feil passord-kall** mot login-endepunktet
- Etter 5 feil skal brukaren bli blokkert i eit tidsrom
- Fjerde eller femte kall skal returnere **429 Too Many Requests**
- Sjekk at loggar blir oppretta med module `security/bruteforce`

#### 3. Sensitiv data-maskering
- E-postadresser blir maskerte i loggar: `j***n@example.com`
- Telefonnummer blir maskerte: `+47*** **** 1234`
- Tokens og nøklar blir maskerte: `[REDACTED]`
- Test: Kall login-endepunkt med e-post og sjekk at `SystemLog.metadata` ikkje inneheld sensitiv data

#### 4. Security headers
Verifiser at desse HTTP-response headerne er aktive:

| Header | Forventa verdi | Mål |
|------|-----------|-----|
| `X-Frame-Options` | `DENY` | Forhindre clickjacking |
| `X-Content-Type-Options` | `nosniff` | Forhindre MIME-type-sniffing |
| `Content-Security-Policy` | `default-src 'self'; ...` | Begrens kva ressursar som kan lastast |
| `X-XSS-Protection` | `1; mode=block` | XSS-beskyttelse |
| `Strict-Transport-Security` | `max-age=31536000; ...` | Tving HTTPS |
| `Permissions-Policy` | `camera=(), microphone=(), ...` | Begrens tilgang til device-funksjonar |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Begrens referrer-info |

Test:
```bash
curl -I https://api-preprod.tosom.no/api/system/health
```

---

## Sjekkliste

| Komponent | Status | Kommentar |
|------|-----|---|
| Metrics | OK / FAIL | |
| Heatmap | OK / FAIL | |
| Traces | OK / FAIL | |
| Security overview | OK / FAIL | |
| Rate limits | OK / FAIL | |
| Failed logins | OK / FAIL | |
| Audit log | OK / FAIL | |
| Session fingerprinting | OK / FAIL | |
| Brute-force-beskyttelse | OK / FAIL | |
| Sensitiv data-maskering | OK / FAIL | |
| Security headers | OK / FAIL | |

### Krav for godkjenning
Alle komponentar må vere "OK" for at sjekken skal godkjennast.

---

## Konklusjon

| Felt | Verdi |
|------|-----|
| `OBSERVABILITY_SECURITY_OK` | false |
| Verifisert av | |
| Dato | |
| Merknader | |

Set `OBSERVABILITY_SECURITY_OK` til `true` når:
- Alle komponentar over har status "OK"
- Ingen critical eller high-priority feil er rapportert
- Smoke-tester og load-testar er grøne

---

## Feilsøking

### Ingen data i observability-dashboard
- Sjekk at smoke-tester og load-testar er køyrde
- Verifiser at PerformanceMetric og RouteHit-modellar er oppretta
- Vent 2–3 minutt etter siste kall (kan vere oppsummerings-intervall)

### Ingen data i security-dashboard
- Sjekk at det har skjedd mislukka innloggingar eller rate-limit
- Verifiser at AuditLog og SystemLog-modellar er oppretta
- Simuler test-scenario (feil passord, mange kall)

### traceId manglar i traces
- Verifiser at trace-middleware er aktivert
- Sjekk at `traceId` blir sendt i request headers
- Verifiser at PerformanceMetric blir oppretta med gyldig traceId

### Security headers manglar
- Verifiser at `middleware/securityHeaders.ts` er lasta inn
- Sjekk at `NEXTAUTH_URL` og `NODE_ENV` er korrekte
- Test med `curl -I` for å sjå response headers
