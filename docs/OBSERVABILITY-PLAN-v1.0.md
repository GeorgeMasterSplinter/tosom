# TOSOM — OBSERVABILITY-PLAN v1.0

**Dato:** 2026-08-21
**Commit:** `0d13e42`
**Status:** Gjennomføringsdokument. Klart for ACT.
**Kanonisk kilde:** `TOSOM-SUPER-MASTERPLAN-v2.0.md`
**Arbeidsmetode:** `ACT-PIPELINE-v1.0.md` — ett steg om gangen, patch-format, verifisering mellom hver.

---

## 0. Hva dette er

Tosom skal driftes av én person på ti minutter i uken. Da må plattformen kunne **fortelle hvordan den har det**, uten at noen graver i logger.

Dokumentet inneholder tolv steg (O-1 … O-12) med ferdig kode, fordelt på fire runder.

**Runde 1 er nok til beta.** Den svarer på det eneste spørsmålet som virkelig teller med ti brukere: gikk lørdagsrunden bra?

---

# DEL I — GRUNNLAGET

## 1. Det som allerede finnes

### 🟢 IMPLEMENTERT

| Ressurs | Status | Sted |
|---|---|---|
| `SystemLog` — `level`, `message`, `module`, `metadata` (Json), indeksert på alle tre | ✅ 20 kallsteder | `prisma/schema.prisma` |
| Sentry v10, PII-skrubbet, `tracesSampleRate: 0.1` | ✅ Node, Edge, klient | `instrumentation.ts` m.fl. |
| `sendAlert(severity, title, detail)` → webhook, e-post, Sentry | ✅ | `lib/observability/alert.ts` |
| PII-skrubbing som delt modul | ✅ | `lib/observability/pii.ts` |
| Matcherunden måler `durationMs`, `paired`, `remaining`, `deferred` | ✅ | `app/api/cron/matching/route.ts:440` |
| Åtte kanoniske terskler | ✅ | `components/admin/StatusBadge.tsx` |
| Helsesjekk og cron-helse | ✅ | `app/api/system/health`, `cron-health` |

**Grunnmuren står.** Det som mangler er ikke verktøy — det er **felles format**. De tjue loggpunktene bruker hver sin struktur, så ingenting kan aggregeres.

## 2. Vercel Custom Metrics

### 🔵 KONSEPT

Vercel tilbyr `metric()` fra `@vercel/functions` (v3.9.5). Signaturen er:

```ts
metric(name: string, value: number, attributes?: Record<string, string>)
```

Verdiene vises i Vercels Observability-fane med Query Builder og egne grafer. Inngår i Pro.

**Pakken er ikke installert hos oss ennå.** Den er eneste nye avhengighet i denne planen.

### Rettelse til tidligere vurdering
Et tidligere utkast antok at Vercel ikke kunne lagre egne forretningsmetrikker. Det var feil. `metric()` gjør nettopp det, og planen er justert deretter.

## 3. Valgt arkitektur — begge veier, ett kall

### 🔵 KONSEPT

Vercel og Postgres er gode til hver sitt:

| | Vercel `metric()` | `SystemLog` |
|---|---|---|
| Styrke | Grafer, Query Builder, null drift | Full historikk, SQL, egne visninger |
| Svakhet | Begrenset oppbevaring, kun i Vercels UI | Må bygges og vises selv |
| Passer til | Tekniske målinger og trender | Forretningshendelser og admin-panelet |

**Løsningen er én funksjon som skriver til begge.** Kallstedet forholder seg til én ting.

Det gir tre fordeler:

1. Ingen dobbeltarbeid i koden
2. Grafer i Vercel *og* spørringer i eget panel
3. **Vercel-avhengigheten isoleres til én fil** — migrerer vi bort, slås ett kall av, og all historikk ligger fortsatt i vår egen database

## 4. Reglene

| # | Regel |
|---|---|
| M-1 | **Aldri kast.** En metrikk skal aldri velte en forespørsel. |
| M-2 | **Aldri PII.** Ingen person-ID, e-post eller navn i attributter. |
| M-3 | **Aldri vent.** Kall er `void`, aldri `await` i responsveien. |
| M-4 | **Punktnotasjon.** `område.hendelse.enhet` — f.eks. `match.round.duration_ms`. |
| M-5 | **Attributter framfor navn.** Skill varianter med attributter, ikke nye metrikknavn. |

M-2 er ikke en anbefaling. Personvernerklæringen (`/personvern` §4) lover at sensitive opplysninger kun brukes av matching-motoren. Metrikker skal aldri inneholde noe som kan spores til en person.

---

# DEL II — METRIKKENE

## 5. Runde 1 — drift

Uten disse er du blind på det som betyr mest.

| Metrikk | Enhet | Attributter | Hvorfor |
|---|---|---|---|
| `match.round.duration_ms` | ms | `round` (primary/continuation) | Ukens viktigste hendelse. Terskel finnes. |
| `match.round.paired` | antall | `round` | Ble det faktisk koblet noen? |
| `match.round.queue_before` | antall | — | Var det nok folk i kø? |
| `match.round.queue_after` | antall | — | Hvor mange ble stående igjen? |
| `match.round.rejected` | antall | `reason` | Hvorfor ble folk ikke koblet? |
| `cron.duration_ms` | ms | `job`, `outcome` | Kjørte jobben, og gjorde den jobben? |
| `api.latency_ms` | ms | `route`, `status` | Hvor er tregheten? |
| `error.5xx` | antall | `route` | Terskel finnes, tallet gjør ikke |

**Om cron:** Vercels cron-UI viser HTTP-status. Den sier at ruten svarte 200 — ikke at matcherunden faktisk koblet noen. Vi trenger begge.

## 6. Runde 2 — brukerflyt

| Metrikk | Enhet | Attributter | Hvorfor |
|---|---|---|---|
| `onboarding.step.completed` | 1 | `step` (0–12) | **Den mest verdifulle metrikken i planen.** |
| `onboarding.abandoned` | 1 | `last_step` | Trakten, konkret |
| `queue.entered` | 1 | — | Hvor mange stiller seg i kø |
| `queue.waited_days` | dager | — | Hvor lenge venter folk faktisk |
| `journey.day.reached` | dag | `phase` | Dør reisene på dag 3, 15 eller 22? |

**Om O-6:** Onboarding har 13 steg. Faller folk fra på steg 7 — «Intimitet og nærhet» — er det verdt å vite. Uten denne metrikken gjetter vi.

## 7. Runde 3 — kvalitet

| Metrikk | Attributter | Hvorfor |
|---|---|---|
| `journey.completed` | — | Suksesskriteriet i driftsplanen |
| `journey.ended_early` | `day`, `reason` | Når og hvorfor slutter par |
| `report.created` | `category` | Trygghet — terskel finnes |
| `image.shared` | `day` | Validerer at dag 15-sperren holder |
| `found_each_other` | — | Det egentlige målet |

## 8. Runde 4 — teknisk dybde

`db.query_ms` over 500 ms · `ratelimit.hit` · `auth.failed` · `storage.upload_ms`

Tas når det er behov, ikke før.

---

# DEL III — STEGENE

## O-1 — Metrikk-modulen

**Fil:** `lib/observability/metric.ts` (ny)
**Runde:** 1

### Hvorfor
Ett felles format. Uten dette blir metrikker like usammenlignbare som dagens tjue loggpunkter.

### Kode

```ts
/**
 * Tosom — Metrikker
 *
 * Skriver til to steder gjennom ett kall:
 *   1. Vercel Custom Metrics — grafer og Query Builder
 *   2. SystemLog — historikk, SQL, admin-panelet
 *
 * Regler:
 *   – Aldri kast. En metrikk skal ikke velte en forespørsel.
 *   – Aldri PII. Kun kategorier og tall i attributter.
 *   – Aldri vent. Kallene er void.
 */

import prisma from '@/lib/prisma';

/** Enheter vi måler i. */
export type MetricUnit = 'ms' | 'count' | 'days' | 'bytes' | 'percent';

export interface MetricTags {
  [key: string]: string | number;
}

/** Vercel-kallet isoleres her. Slås av ved migrasjon. */
async function sendToVercel(
  name: string,
  value: number,
  tags: MetricTags,
): Promise<void> {
  try {
    const { metric } = await import('@vercel/functions');
    const attrs: Record<string, string> = {};
    for (const [k, v] of Object.entries(tags)) {
      attrs[k] = String(v);
    }
    metric(name, value, attrs);
  } catch {
    // Utenfor Vercel, eller pakken mangler. Stille.
  }
}

/** Skriver til SystemLog med fast struktur, slik at alt kan aggregeres. */
async function sendToDatabase(
  name: string,
  value: number,
  unit: MetricUnit,
  tags: MetricTags,
): Promise<void> {
  try {
    await prisma.systemLog.create({
      data: {
        level: 'INFO',
        module: 'metric',
        message: name,
        metadata: { metric: name, value, unit, ...tags },
      },
    });
  } catch {
    // Databasen skal aldri stoppe en forespørsel på grunn av en metrikk.
  }
}

/**
 * Registrer en måling.
 * Kalles uten await — den skal aldri forsinke svaret til brukeren.
 */
export function recordMetric(
  name: string,
  value: number,
  unit: MetricUnit = 'count',
  tags: MetricTags = {},
): void {
  void sendToVercel(name, value, tags);
  void sendToDatabase(name, value, unit, tags);
}

/** Registrer en hendelse som har skjedd én gang. */
export function recordEvent(name: string, tags: MetricTags = {}): void {
  recordMetric(name, 1, 'count', tags);
}

/**
 * Mål hvor lang tid noe tar.
 * Måler også når funksjonen kaster, med outcome: 'error'.
 */
export async function recordTiming<T>(
  name: string,
  fn: () => Promise<T>,
  tags: MetricTags = {},
): Promise<T> {
  const started = Date.now();
  try {
    const result = await fn();
    recordMetric(name, Date.now() - started, 'ms', { ...tags, outcome: 'ok' });
    return result;
  } catch (err) {
    recordMetric(name, Date.now() - started, 'ms', { ...tags, outcome: 'error' });
    throw err;
  }
}
```

### Verifisering
```bash
npx tsc --noEmit
```

### Endres ikke
`lib/observability/alert.ts` og `pii.ts` røres ikke.

---

## O-2 — Matcherunden

**Fil:** `app/api/cron/matching/route.ts`
**Runde:** 1
**Avhenger av:** O-1

### Hvorfor
Ukens viktigste hendelse. Halvparten måles allerede — `durationMs` beregnes på linje 440, men havner bare i en loggmelding.

### Endring

Etter at `durationMs` er beregnet:

```ts
import { recordMetric } from '@/lib/observability/metric';

const roundType = isContinuation ? 'continuation' : 'primary';

recordMetric('match.round.duration_ms', durationMs, 'ms', { round: roundType });
recordMetric('match.round.paired', paired, 'count', { round: roundType });
recordMetric('match.round.queue_before', queueBefore, 'count', { round: roundType });
recordMetric('match.round.queue_after', remaining, 'count', { round: roundType });
```

Og der kandidater avvises:

```ts
recordMetric('match.round.rejected', 1, 'count', { reason: 'dealbreaker' });
```

### Merk
Matching kjører **tre ganger** natt til lørdag: 02:00, 02:15 og 02:30. Attributtet `round` skiller dem, slik at Query Builder kan vise dem hver for seg uten tre ulike metrikknavn.

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
```

---

## O-3 — Cron-overvåking

**Filer:** `app/api/cron/matching/route.ts`, `app/api/cron/journey/route.ts`
**Runde:** 1

### Hvorfor
Vercels cron-UI viser at ruten svarte 200. Den sier ingenting om jobben faktisk gjorde noe.

### Endring

Rundt hele kroppen i hver cron-rute:

```ts
export async function GET(req: NextRequest) {
  // ... autentisering som før ...

  return recordTiming('cron.duration_ms', async () => {
    // eksisterende kropp uendret
  }, { job: 'matching' });
}
```

`recordTiming` merker automatisk `outcome: 'error'` hvis noe kaster.

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
```

---

## O-4 — API-latency

**Fil:** `lib/observability/withMetrics.ts` (ny)
**Runde:** 1

### Hvorfor
Vercel måler latency per rute automatisk. Denne wrapperen gir oss det samme i *vår* database, koblet til brukerflyt og status.

### Kode

```ts
/**
 * Tosom — Latency-wrapper for API-ruter
 *
 * Legger måling rundt en route handler uten å endre logikken.
 */

import { NextRequest, NextResponse } from 'next/server';
import { recordMetric } from './metric';

type Handler = (req: NextRequest, ctx?: unknown) => Promise<NextResponse>;

export function withMetrics(routeName: string, handler: Handler): Handler {
  return async (req, ctx) => {
    const started = Date.now();
    try {
      const res = await handler(req, ctx);
      recordMetric('api.latency_ms', Date.now() - started, 'ms', {
        route: routeName,
        status: res.status,
      });
      if (res.status >= 500) {
        recordMetric('error.5xx', 1, 'count', { route: routeName });
      }
      return res;
    } catch (err) {
      recordMetric('api.latency_ms', Date.now() - started, 'ms', {
        route: routeName,
        status: 500,
      });
      recordMetric('error.5xx', 1, 'count', { route: routeName });
      throw err;
    }
  };
}
```

### De ti første rutene

| Rute | Hvorfor |
|---|---|
| `/api/profile/setup` | Tyngste skrivingen i onboarding |
| `/api/onboarding/save` | Kalles ved hvert steg |
| `/api/journey/queue` | Inngangen til matcherunden |
| `/api/chat/send` | Mest brukte handling i reisen |
| `/api/chat/messages` | Mest leste rute |
| `/api/match/status` | Kalles ved hver dashboard-visning |
| `/api/journey/today` | Kalles daglig av alle aktive par |
| `/api/auth/vipps/callback` | Inngangsporten |
| `/api/chat/image` | Tyngste opplastingen |
| `/api/admin/overview` | Kommandopanelets datakilde |

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
```

---

## O-5 — Vercel-pakker

**Fil:** `package.json`, `app/layout.tsx`
**Runde:** 1

### Pakker

```bash
npm install @vercel/functions @vercel/speed-insights
```

| Pakke | Størrelse | Formål |
|---|---|---|
| `@vercel/functions` | Server | `metric()` — brukes av O-1 |
| `@vercel/speed-insights` | ~2 kB klient | Core Web Vitals fra ekte brukere |

### Speed Insights i layout

```tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

// i <body>, etter children:
<SpeedInsights />
```

### Aktiveres i Vercel-panelet
- **Observability** → på (inngår i Pro)
- **Speed Insights** → på
- **Cron Jobs** → verifiser at alle tre oppføringer er aktive

`@vercel/analytics` er **ikke** med. Den måler sidevisninger, som vi kan lese ut av `SystemLog` selv, og den koster klientvekt på landingssiden.

### Verifisering
```bash
npx tsc --noEmit
npm run build
```

---

## O-6 — Onboarding-steg

**Fil:** `app/api/onboarding/save/route.ts`
**Runde:** 2
**Prioritet:** 🟢 Høyest verdi i hele planen

### Hvorfor
Onboarding har 13 steg og er den lengste strekningen i produktet. I dag vet vi ikke hvor folk faller fra — vi gjetter.

Faller mange fra på steg 7 («Intimitet og nærhet»), er det en produktinnsikt som er verdt mer enn resten av denne planen til sammen.

### Endring

```ts
import { recordEvent } from '@/lib/observability/metric';

recordEvent('onboarding.step.completed', { step: String(stepNumber) });
```

**Ingen bruker-ID.** Kun stegnummeret. Aggregatet forteller alt vi trenger.

### Frafall

Egen jobb i `cron/journey` som finner brukere med `onboardingStep > 0`, `onboardingComplete = false` og ingen aktivitet på 7 dager:

```ts
recordEvent('onboarding.abandoned', { last_step: String(user.onboardingStep) });
```

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
```

---

## O-7 — Kø og ventetid

**Fil:** `app/api/journey/queue/route.ts`
**Runde:** 2

### Endring

Ved inngang i kø:

```ts
recordEvent('queue.entered');
```

Ved kobling, i matcherunden:

```ts
const waitedDays = Math.floor((Date.now() - user.matchQueuedAt.getTime()) / 86_400_000);
recordMetric('queue.waited_days', waitedDays, 'days');
```

### Hvorfor
Terskelen for køstørrelse finnes allerede. Dette gir det andre halve bildet: hvor lenge folk faktisk venter.

---

## O-8 — Reisens framdrift

**Fil:** `lib/journey/` (der dagen økes)
**Runde:** 2

### Endring

```ts
recordMetric('journey.day.reached', day, 'count', { phase });
```

Ved avslutning:

```ts
recordEvent('journey.ended_early', { day: String(day), reason });
```

### Hvorfor
Fire faser, tretti dager. Dette viser om par mister tempoet før dag 15 (bildesperren) eller etter.

---

## O-9 — Spørrings-API

**Fil:** `app/api/admin/metrics/query/route.ts` (ny)
**Runde:** 3

### Hvorfor
Uten dette ligger metrikkene i databasen uten å bli lest.

### Skisse

```ts
// GET /api/admin/metrics/query?metric=match.round.duration_ms&days=30&agg=avg
// Returnerer: { points: [{ date, value, count }], summary: { avg, min, max, p95 } }
```

Bruker `SystemLog` med `module = 'metric'` og filtrerer på `metadata->>'metric'`. Admin-autorisasjon som alle andre admin-ruter.

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
```

---

## O-10 — Analysesiden

**Fil:** `app/admin/analytics/page.tsx`
**Runde:** 3
**Avhenger av:** O-9, og `archive/ferdig/ADMIN-KOMMANDOPANEL-v1.0.md` K-2

### Innhold

| Panel | Viser |
|---|---|
| Onboarding-trakt | 13 stolper, ett per steg, med frafall mellom hver |
| Matcherunde-historikk | Varighet og antall par per uke |
| Latency | p50 og p95 for de ti rutene |
| Reisefaser | Hvor par befinner seg nå |
| Kø | Størrelse over tid, og ventetid |

Siden finnes allerede og er lenket i sidebaren etter K-2. `chart.js` og `react-chartjs-2` ligger i `package.json` fra før.

### Merk
Vercels egne grafer lenkes fra `/admin/system/status` — vi bygger ikke om det Vercel gjør bedre.

---

## O-11 — Terskelvarsling

**Fil:** `app/api/cron/journey/route.ts`
**Runde:** 3

### Hvorfor
`sendAlert()` finnes og brukes ved rapporter. Den skal knyttes til de eksisterende tersklene.

### Utløsere

| Tilstand | Nivå |
|---|---|
| Matcherunden kjørte ikke innen lørdag 06:00 | 🔴 critical |
| Runde over 50 s | 🟡 warning |
| Kø = 0 før runde | 🔴 critical |
| Åpne rapporter > 0 | 🟡 warning |
| 5xx > 5 siste time | 🔴 critical |
| Cron feilet | 🔴 critical |

Tersklene hentes fra `components/admin/StatusBadge.tsx`. **De skal ikke dupliseres** — funksjonene importeres.

### Regel
Ett varsel per tilstand per døgn. Et varslingssystem som maser blir slått av, og da varsler det ingenting.

---

## O-12 — Oppbevaring

**Fil:** `lib/privacy/retention.ts`
**Runde:** 4

### Regler

| Data | Beholdes |
|---|---|
| Metrikker med detaljer | 90 dager |
| Dagsaggregater | 2 år |
| Øvrige systemlogger | Som i dag |

Etter 90 dager aggregeres metrikker til ett tall per dag per metrikk, og radene slettes. Da vokser ikke tabellen ubegrenset, og trendene består.

### Personvern
Metrikker inneholder ingen PII, så personvernerklæringen trenger ingen endring. **Dette skal likevel verifiseres** — søk etter `userId`, `email` og `name` i alle `recordMetric`-kall før runde 4 lukkes.

---

# DEL IV — GJENNOMFØRING

## 9. Rekkefølge

| Runde | Steg | Gir | Nødvendig for |
|---|---|---|---|
| **1 — Drift** | O-1 … O-5 | «Gikk lørdagsrunden bra?» | Beta |
| **2 — Brukerflyt** | O-6 … O-8 | «Hvor forsvinner folk?» | Bør før beta |
| **3 — Visning** | O-9 … O-11 | Panel og varsling | Under beta |
| **4 — Vedlikehold** | O-12 | Kontrollert vekst | Før lansering |

**Runde 1 er minimum.** Med ti brukere er resten interessant, ikke kritisk.

## 10. Verifisering per steg

Etter **hver** patch:

```bash
npx tsc --noEmit
npx jest --ci --silent
```

Etter O-5 og O-10 også `npm run build`.

Etter O-1, verifiser i praksis:

```sql
SELECT metadata->>'metric' AS metric,
       COUNT(*),
       AVG((metadata->>'value')::numeric)
FROM "SystemLog"
WHERE module = 'metric'
GROUP BY 1;
```

Og i Vercel: Observability → Custom Metrics → verifiser at navnene dukker opp.

## 11. Hva som ikke endres

| Område | Hvorfor |
|---|---|
| `lib/observability/alert.ts` | Fungerer, gjenbrukes |
| `lib/observability/pii.ts` | Sikkerhetskritisk, testet (S-16) |
| Sentry-konfigurasjonen | Riktig satt opp |
| `StatusBadge.tsx` | Tersklene er kanoniske |
| Matcheralgoritmen | Vi måler, vi endrer ikke |
| Brukervendte flater | Observability er usynlig for brukeren |

**Ingen invarianter berøres.** Ingen metrikk endrer produktets oppførsel, og ingen inneholder personopplysninger.

## 12. Nye avhengigheter

| Pakke | Hvorfor |
|---|---|
| `@vercel/functions` | `metric()` — kjernen i planen |
| `@vercel/speed-insights` | Core Web Vitals, ~2 kB |

Begge er førsteparts fra Vercel. Alt annet bruker det som allerede finnes.

## 13. Sluttord

Observability handler ikke om å samle mest mulig data. Det handler om å kunne svare på tre spørsmål uten å gjette:

**Virker det?** — runde 1
**Hvor faller folk fra?** — runde 2
**Blir det bedre?** — runde 3

Er alt grønt på kommandopanelet, skal du kunne lukke fanen og gå videre. Det er hele poenget.

---

*Følgedokumenter: `TOSOM-BETA-DRIFTSPLAN-v1.1.md`, `archive/ferdig/ADMIN-KOMMANDOPANEL-v1.0.md`, `SECURITY-STABILITY-PLAN-v2.0.md`*
