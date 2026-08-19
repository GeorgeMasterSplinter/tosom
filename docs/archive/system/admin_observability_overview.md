# ToSom — Admin & Observability Overview (v2026)

> **DEL 5 av full system audit.**  
> Kartlegging av admin-sider, observability-signaler og feilhåndtering.

---

## 1. ADMIN-SIDER (18 sider)

### 1.1 Oversikt

| Side | Sti | Datakilde | Status |
|------|-----|-----------|--------|
| Admin Root | `/admin` | Redirect → `/admin/login` | ✅ OK |
| Admin Login | `/admin/login` | NextAuth signIn() | ✅ OK |
| Dashboard | `/admin/dashboard` | **STATIC/MOCK** (ingen API-kall) | ⚠️ Mock data |
| Users | `/admin/users` | `GET /api/admin/users` | ✅ OK |
| Matches | `/admin/matches` | `GET /api/admin/matches` | ✅ OK |
| Conversations | `/admin/conversations` | `GET /api/admin/conversations` | ✅ OK |
| Journeys | `/admin/journeys` | `GET /api/admin/journey` | ✅ OK |
| Journey Content | `/admin/journey-content` | `GET /api/admin/journey-content` | ✅ OK |
| Analytics | `/admin/analytics` | `GET /api/admin/stats` | ✅ OK |
| Chat | `/admin/chat` | `GET /api/admin/conversations` | ✅ OK |
| Resonance | `/admin/resonance` | `GET /api/admin/resonance` | ✅ OK |
| Logs | `/admin/logs` | `GET /api/admin/system-logs` | ✅ OK |
| System | `/admin/system` | **STATIC/MOCK** (ingen API-kall) | ⚠️ Mock data |
| System Status | `/admin/system/status` | `GET /api/system/health` + `/api/system/latency` | ✅ OK (polling 30s) |
| Tools | `/admin/tools` | Diverse admin-APIer | ✅ OK |

### 1.2 Kritisk Funn: Mock Data i Production-Sider

| Side | Problem | Påvirkning |
|------|---------|-----------|
| `/admin/dashboard` | Alle tall er hardcoded (12,847 brukere, 540 matcher, etc.) | Admin ser feil data |
| `/admin/system` | Mock services med simulerede latency-verdier | Ingen sanntids-overvåking |

**ANBEFALING:** Koble dashboard til sanne API-er eller fjern sidene. Mock-data er farlig i drift.

### 1.3 Felles Mønster for Admin-Sider

De fleste admin-sider følger dette mønsteret:

```tsx
export default async function AdminUsersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/users'); // ⚠️ Ingen auth-header!
      if (!res.ok) throw new Error('Fetch failed');
      const json = await res.json();
      setData(json.users);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []); // ⚠️ eslint warning

  if (loading) return <Skeleton />;
  if (error) return <ErrorDisplay message={error} />;
  return <Table data={data} />;
}
```

**⚠️ MERKE:** Admin-sider fetcher uten auth-header siden de er beskyttet av middleware. Fungerer, men betyr at:
- Ingen Bearer-token i requesten (kun cookie)
- Hvis en side brukes utenfor admin-middleware, vil den feile stille

---

## 2. OBSERVABILITY-SIGNALER

### 2.1 Feil-signaler (Errors)

| Signal | Kilde | Hentet via | Vises i |
|--------|-------|------------|---------|
| System-feil (ERROR nivå) | `SystemLog`-tabell | `GET /api/admin/system/errors` | `/admin/logs`, `/admin/system/status` |
| TrackError-events | `lib/errorTracker.ts` → `SystemLog` | Samme som over | Alle admin-sider med error-overvåking |

**Structur på error-data:**
```json
{
  "id": "cuid...",
  "level": "ERROR",
  "message": "PrismaClientKnownRequestError",
  "module": "matching",
  "metadata": { "userId": "...", "details": "..." },
  "createdAt": "2026-08-04T12:00:00Z"
}
```

### 2.2 Logg-signaler (Logs)

| Signal | Kilde | Hentet via | Vises i |
|--------|-------|------------|---------|
| System-logger | `SystemLog`-tabell | `GET /api/admin/system-logs` | `/admin/logs` |
| Audit-logger | `AuditLog`-tabell | Ikke direkte API ennå | Fremtidig: `/admin/audit` |

**Loggnivåer:**
| Nivå | Bruk | Lagres i DB? |
|------|------|-------------|
| ERROR | Kritiske feil, uncaught exceptions | ✅ Ja (via `trackError`) |
| WARN | Advarsler, deprecated calls, rate limits | ✅ Ja (via `trackWarn`) |
| INFO | Informasjon, brukerevents, normale operasjoner | ❌ Nei (kun console) |
| DEBUG | Utviklings-info | ❌ Nei (kun console) |

### 2.3 Metrikker (Metrics)

| Signal | Kilde | Hentet via | Vises i |
|--------|-------|------------|---------|
| System health | `GET /api/system/health` | Node.js `process.memoryUsage()`, `os.cpus()` | `/admin/system/status` |
| API-latency | `PerformanceMetric`-tabell | `GET /api/admin/observability/metrics` | `/admin/system/status` |
| DB-latency | PING-test + metrics | Samme som over | `/admin/system/status` |

**HealthResponse-struktur:**
```json
{
  "uptime": 123456,
  "memory": { "used": 256, "total": 512, "percent": 50 },
  "cpu": { "load1": 0.5, "load5": 0.3, "load15": 0.2 },
  "version": { "node": "20.x", "next": "15.x" },
  "services": { "db": "ok", "pusher": "ok", "matching": "ok" },
  "cron": { "lastMatch": "2026-08-04T00:00:00Z", "lastJourney": "2026-08-04T08:00:00Z" }
}
```

### 2.4 Realtime-signaler

| Signal | Kilde | Hentet via | Beskrivelse |
|--------|-------|------------|-------------|
| System realtime | `GET /api/admin/system/realtime` | Manuell polling | Sanntids-systemstatus |
| Observability traces | `GET /api/admin/observability/traces` | Manuell polling | Request-tracing |
| Observability heatmap | `GET /api/admin/observability/heatmap` | Manuell polling | Feil-heatmap over tid |
| Security overview | `GET /api/admin/security/overview` | Manuell polling | Sikkerhetsstatus |

### 2.5 Signal-oppsummering

| Type | Tilgjengelig | Kvalitet | Oppdatert |
|------|-------------|----------|-----------|
| Feil-logg | ✅ SystemLog | God | Real-time (skriver ved feil) |
| Audit-logg | ✅ AuditLog | Manglende API-endepunkt | Manuell DB-query |
| System-metrikker | ✅ /api/system/health | God | Polling 30s på status-side |
| API-latency | ⚠️ PerformanceMetric (sparsomt brukt) | svak | Ingen automatisk samling funnet |
| Heatmap | ⚠️ Finnes men uklar datakilde | Uklar | - |
| Traces | ⚠️ Finnes men ingen trace-innsamling | Mangler | - |

---

## 3. FEILHÅNDTERING (errorTracker + logging)

### 3.1 lib/errorTracker.ts

**Eksporerte funksjoner:**

| Funksjon | Destinasjon | Parametere |
|----------|-------------|------------|
| `trackError(error, meta)` | Console + SystemLog DB | Error/unknown, {moduleName, route, userId}, metadata? |
| `trackWarn(message, meta)` | Console + SystemLog DB | string, ErrorMeta, metadata? |
| `trackInfo(message, meta)` | Console ALLENE | string, ErrorMeta |

**Hvordan det fungerer:**
1. Normaliserer `meta` (string eller `ErrorMeta`-objekt)
2. Kaller `logger.error()` / `logger.warn()` for console-utdata
3. For error/warn: skriver til SystemLog-tabellen via Prisma
4. DB-skriv feil swallowes stille (ikke critical)

### 3.2 lib/logging.ts

**Logger bruker konsollet som primær utdata:**
- `logger.error()` → `console.error()` med timestamp og format
- `logger.warn()` → `console.warn()`
- `logger.info()` → `console.info()`
- `logger.debug()` → `console.debug()` (kun i dev)

**⚠️ Strukturerte logger er ikke fullt implementert.** Logging går direkte til console uten fil, ELK-stack eller eksternt logging-system.

### 3.3 Dekning av Error Tracking

| Flow | Bruker errorTracker? | Status |
|------|---------------------|--------|
| Matching (cron) | ✅ `trackError` i findBestResonance | ✅ God dekning |
| Journey (cron) | ✅ `trackError` i journeySync | ✅ God dekning |
| Chat send | ⚠️ Partial (try/catch men ingen trackError) | ⚠️ Mangler |
| Auth/NextAuth | ❌ Nei | ⚠️ Mangler |
| Profile-ruter | ❌ Nei | ⚠️ Mangler |
| Admin-ruter | ⚠️ Varyer (noen har trackError, andre ikke) | ⚠️ Ujevn |

### 3.4 Coverage Gaps

| Gap | Påvirkning | Anbefaling |
|-----|-----------|------------|
| `trackInfo()` skriver IKKE til DB | Ingen historisk logg av info-events | Implementer info→DB for driftslogg |
| Chat-ruter mangler errorTracker | Utløste feil i chat havner kun i console | Legg til `trackError` i try/catch-blokker |
| Ingen strukturert logging (ELK/Datadog) | Kun console-logs, ikke skalérbart | Vurder pino/winston + fildestinasjon |
| AuditLog har ingen API-endepunkt | Kan kun leses via direkte DB-query | Legg til `GET /api/admin/audit` route |

---

## 4. DRIFTSHÅNDTERING — HVORDAN ADMIN LESE AV SYSTEMHELSE

### 4.1 Anbefalt Leserekkefølge

```
TRINN 1: /admin/system/status
         ├─ Sjekk health banner (OK/DEGRADERT/NED)
         ├─ Sjekk service-grid (DB, Pusher, Matching, etc.)
         └─ Sjekk latency-metrikker (P95 > 2s =告警)

TRINN 2: /admin/logs
         ├─ Sorter på ERROR-nivå
         ├─ Filtrer etter modul (matching, journey, chat)
         └─ Sjekk mønster (samme feil = systematisk problem?)

TRINN 3: /admin/dashboard (VARSLET: MOCK DATA!)
         └─ Brukes IKKE ennå for sanntids-overvåking

TRINN 4: /api/admin/security/overview (via API-kall)
         ├─ Sjekk feilrate, rate-limit triggers
         └─ Aktivitetslogg
```

### 4.2 Alarm-trerskaler (Anbefalt)

| Mål | Advarsel | Kritisk |
|------|----------|---------|
| DB-latency | > 100ms | > 500ms |
| API P95-latency | > 2s | > 5s |
| CPU-load | > 80% | > 95% |
| Memory-usage | > 75% | > 90% |
| Feil-rate (per time) | > 10 | > 50 |
| Uleste system-alerts | > 5 | > 20 |

---

## 5. REKOMMANDASJONER

### Prioritet 1 (Høy)
1. **Fjern mock-data fra `/admin/dashboard` og `/admin/system`** — koble til sanne API-er eller fjern sidene
2. **Legg til `trackError` i chat-ruter** — send, messages, conversation
3. **Implementer API-endepunkt for AuditLog** — `GET /api/admin/audit/logs`

### Prioritet 2 (Mellom)
4. **Gjør `trackInfo()` persistent** — skriv til SystemLog for historisk oversikt
5. **Legg til strukturert logging** — pino/winston med fildestinasjon
6. **Implementer automatisk API-latency-innsamling** — ikke manuelt, men automatisk via middleware

### Prioritet 3 (Lav)
7. **Fjern eslint warnings i admin-sider** — memoiser fetch-funksjoner
8. **Legg til auth-header på admin fetches** — selv om middleware beskytter, bør API-et få kontekst
9. **Opprett en driftshåndbok** (`operations_playbook.md`) med konkrete prosedyrer

---

*Dokument generert som del av full system audit & hardening plan (DEL 5).*