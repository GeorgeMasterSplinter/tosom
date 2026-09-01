# ToSom Admin Verifikasjon

## Formål
Dokumentet beskriv ei fullstendig verifikasjonsrunde for admin-panelet i pre-prod før lansering. Målet er å stadfeste at alle admin-funksjonar fungerer som forventa før deploy til produksjon.

---

## 1. Admin Login

### Test
1. Logg inn som admin på pre-prod via `/api/admin/auth/login`
2. Mottok en `adminToken` (Bearer token)
3. Verifiser at token inneholder gyldig `sub` og `role: 'admin'`

### Sjekkliste
- [ ] Admin login returnerer 200 med gyldig token
- [ ] Token inneholder `role: 'admin'`
- [ ] Session fingerprinting fungerer:
  - `ipHash` blir generert og lagret
  - `userAgentHash` blir generert og lagret
  - Mismatch gir 401 Unauthorized
- [ ] Vanlege brukere ikke får admin token

---

## 2. System Dashboard

### Endepunkt som skal testast

| Endpoint | Forventa status | Mål |
|------|-------|---|
| `GET /api/admin/system/overview` | 200 | Oversikt over system |
| `GET /api/admin/system/logs` | 200 | System loggar |
| `GET /api/admin/system/errors` | 200 | Feil-samling |
| `GET /api/admin/system/rate-limits` | 200 | Rate-limit statistikk |

### Data som skal verifiserast

Fra `/api/admin/system/overview`:
- `totalRequests` — totalt antal API-kall
- `errorRate` — feilrate i prosent
- `dbLatency` — DB-latens i ms (skal være < 50ms)
- `recentErrors` — liste over de 10 siste feila

Fra `/api/admin/system/errors`:
- `errors` — array med feilobjekt
- hver feil har: `message`, `module`, `level`, `createdAt`

### Sjekkliste
- [ ] System overview returnerer 200
- [ ] totalRequests er > 0
- [ ] errorRate er < 10%
- [ ] dbLatency er < 50ms
- [ ] recentErrors viser data
- [ ] Logs-endepunkt returnerer data
- [ ] Rate-limits viser statistikk

---

## 3. Observability Dashboard

### Endepunkt som skal testast

| Endpoint | Forventa status | Mål |
|------|-------|---|
| `GET /api/admin/observability/metrics` | 200 | Performance metrics |
| `GET /api/admin/observability/heatmap` | 200 | Route heatmap |
| `GET /api/admin/observability/traces` | 200 | Request traces |

### Data som skal verifiserast

Fra `/api/admin/observability/metrics`:
- `metrics.perEndpoint` — latens per endpoint (p50/p90/p95/p99)
- `metrics.ai` — AI-statistikk (kall, latency, feilrate)
- `metrics.performance` — total system ytelse

Fra `/api/admin/observability/heatmap`:
- `routes` — array med route-slug og frekvens
- Top routes skal være: `/api/ai/*`, `/api/messages/*`, `/api/match/*`

Fra `/api/admin/observability/traces`:
- `traces` — array med trace-objekt
- hver trace har: `traceId`, `endpoint`, `latency`, `statusCode`, `createdAt`

### Sjekkliste
- [ ] Metrics returnerer data per endpoint
- [ ] traceId følger request (sammenlign med request headers)
- [ ] API heatmap viser trafikk på minste ett endpoint
- [ ] Latency metrics oppdaterer seg (ikke stale data)
- [ ] AI-statistikk blir vist
- [ ] Traces viser gyldige entry

---

## 4. Security Dashboard

### Endepunkt som skal testast

| Endpoint | Forventa status | Mål |
|------|-------|---|
| `GET /api/admin/security/overview` | 200 | Security oversikt |

### Data som skal verifiserast

Fra `/api/admin/security/overview`:
- `failedLogins` — { total, byIp, byEmail }
- `rateLimits` — { total, byRoute, byUser }
- `sessions` — { totalActive, recentLogins, suspiciousLogins }
- `audit` — { totalActions, byAction, topAdmins, suspiciousActions }

### Sjekkliste
- [ ] Security overview returnerer 200
- [ ] failedLogins viser data (eller null/0)
- [ ] rateLimits viser data (eller null/0)
- [ ] sessions viser totalActive > 0
- [ ] audit.totalActions > 0
- [ | Suspicious actions blir rapportert

---

## 5. AI Logs

### Endepunkt som skal testast

| Endpoint | Forventa status | Mål |
|------|-------|---|
| `GET /api/admin/ai/logs` | 200 | AI-request loggar |

### Data som skal verifiserast

- `totalLogs` — totalt antal AI-requestar
- `recentRequests` — array med AI-kall
- Hver request har:
  - `userId` — bruker ID
  - `endpoint` — AI-endepunkt (message-suggestions, profile-rewrite, etc.)
  - `status` — statuskode (200, 429, 400, etc.)
  - `latencyMs` — latens i ms
  - `tokensIn` — antal input tokens (om tilgjengeleg)
  - `tokensOut` — antal output tokens (om tilgjengeleg)
  - `model` — AI-modell som ble brukt
  - `success` — boolean
  - `createdAt` — timestamp

### Sjekkliste
- [ ] AI-logs returnerer 200
- [ ] totalLogs > 0 (etter aiQuotaTest)
- [ | Hver request har alle felta over
- [ | Data inneholder kall fra aiQuotaTest (userId: 'test')
- [ | Latency, tokens, model, success er korrekte

---

## 6. Admin Actions

### Testscenario

| Handling | Endpoint | Mål |
|------|-----|-|
| Freeze conversation | `POST /api/admin/conversations/:id/freeze` | Setj conversation status til 'frozen' |
| Unfreeze conversation | `POST /api/admin/conversations/:id/unfreeze` | Setj conversation status til 'active' |
| Delete message | `DELETE /api/admin/messages/:id` | Marker melding som sletta |
| Mark notification read | `POST /api/admin/notifications/:id/read` | Setj notification status til 'read' |
| System message dispatch | `POST /api/admin/system-messages` | Send systemmelding til bruker |

### Verifisering

Etter hver handling:
- [ ] Endpoint returnerer 200
- [ ] AuditLog får en ny entry med:
  - `adminId` — ID på admin som utførte handlinga
  - `action` — handlingstyp (e.g., 'CONVERSATION_FREEZE')
  - `targetId` — ID på målet (conversation/message/notification)
  - `createdAt` — timestamp
  - `metadata` — ekstra informasjon om handlinga

### Sjekkliste
- [ ] Freeze conversation fungerer
- [ ] Unfreeze conversation fungerer
- [ ] Delete message fungerer
- [ ] Mark notification read fungerer
- [ ] System message dispatch fungerer
- [ ] AuditLog får entry for hver handling

---

## 7. Sjekkliste for godkjenning

| Komponent | Status | Kommentar |
|------|-----|---|
| Admin login | OK / FAIL | |
| System dashboard | OK / FAIL | |
| Observability | OK / FAIL | |
| Security | OK / FAIL | |
| AI logs | OK / FAIL | |
| Admin actions | OK / FAIL | |

### Krav for godkjenning
Alle komponentar må være "OK" for at admin-verifikasjonen skal godkjennast.

---

## 8. Konklusjon

| Felt | Verdi |
|------|-----|
| `ADMIN_VERIFIED` | false |
| Verifisert av | |
| Dato | |
| Merknader | |

Set `ADMIN_VERIFIED` til `true` når:
- Alle komponentar over har status "OK"
- Ingen critical eller high-priority feil er rapportert
- Admin-actions blir korrekt logga i AuditLog

---

## Feilsøking

### Ingen data blir vist
- Sjekk at aiQuotaTest og smoke tests er køyrte først
- Sjekk at SystemLog og AIRequestLog er fylt med data
- Sjekk at DB-migrasjonar er køyrde

### 401 Unauthorized på admin-endepunkt
- Verifiser at admin-token er gyldig og ikke utgått
- Sjekk at admin-rolla er 'admin' (ikke 'user')

### 500 Internal Server Error
- Sjekk server-loggar
- Sjekk DB-tilkopling
- Verifiser at alle Prisma-modellar er oppretta
