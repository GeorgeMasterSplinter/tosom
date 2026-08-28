# TOSOM — MASTERPLAN v2.0

**Dato:** 2026-08-25
**Commit ved gjennomgang:** `2f0eb6a`
**Status:** Lanseringsvurdering. **Ikke kanonisk.**
**Kanonisk kilde er fortsatt** [`TOSOM-SUPER-MASTERPLAN-v2.0.md`](TOSOM-SUPER-MASTERPLAN-v2.0.md).

> Dette dokumentet beskriver ikke hva Tosom *skal* være — det måler hva Tosom
> **er**, mot koden, per 25.08.2026. Ved motstrid gjelder koden, deretter
> SUPER-MASTERPLAN. Vipps er utenfor omfanget (se `VIPPS-INTEGRATION-PLAN-v1.0.md`).

**Metode:** Alle påstander er verifisert mot kildekoden — ikke mot andre dokumenter.
116 API-ruter, 23 migrasjoner, 750 linjers schema, 40 testsuiter, samt lokal
simulering av samtlige seks CI-vakter.

---

## 0. Sammendrag

**Lanseringsscore: 78 / 100** (72 før bølge A, utført 25.08).

| Vurdering | Status |
|---|---|
| Åpen beta, 50 testere | 🟢 **GO** |
| Full offentlig lansering | 🔴 **NO-GO** — se §9 |

Tosom er arkitektonisk ferdig. Det som gjenstår før full lansering er ikke
struktur, men **dekning**: rate limiting på under 10 % av rutene, og et
juridisk løfte om aldersverifisering som ikke holdes i beta.

Under gjennomgangen ble det funnet og rettet en reell IDOR-sårbarhet, en
permanent kvotelekkasje, en CD-pipeline uten kvalitetsport, og en CI som
feilet på `main`.

---

# DEL I — SYSTEMFORSTÅELSE

## 1. Konseptet

Tosom er en **antitese til datingapper**, ikke en variant av dem. Hele
arkitekturen er bygget for å fjerne valg, ikke tilby dem: ingen feed, ingen
swipe, ingen profilbilder i matching, ingen gamification. Brukeren velger
kun én ting — *om* hun vil delta, aldri *hvem*.

> Én match. Én reise. Én relasjon.

Dette håndheves ikke bare i kode, men i CI: seks vakter feiler bygget hvis
noen gjeninnfører samtykkeflyt, en andre matchemotor, AI-ruter, nynorsk eller
driftsdetaljer i brukervendt tekst. Det er uvanlig disiplin.

## 2. Hovedløkken

```
Onboarding (13 steg) → onboardingComplete
   ↓
POST /api/journey/queue → claimFreeQuota() → journeyState: QUEUED
   ↓
cron/matching (lør 02,03,04) — advisory lock 123456789
   ├─ Les QUEUED (tak 5 000) → buildCheapFeatures  O(n)
   ├─ scoreRound: unifiedScore 6 dimensjoner + 11 dealbreakere
   ├─ Grådig kobling: høyest score først, hver bruker kun én gang
   └─ Batch 50/transaksjon: Match + Conversation + JourneyProgress×2
                            + Notification×2 + journeyState: MATCHED
   ↓
cron/journey (hver time) — advisory lock 987654321
   ├─ day+1 der nextDayAt er passert (batch 300)
   ├─ Faser: EARLY → BUILDING_TRUST → DEEPER → CHECKIN
   ├─ Dag 15: bildesperren løftes
   ├─ Dag 30: endJourney → JourneyStat (anonym) + R2-sletting
   └─ Terskelvarsling + runRetention
```

**Matchevektene** (`lib/matching/unifiedScorer.ts:59-66`) summerer til 1,00:

| Dimensjon | Vekt | Instrument |
|---|---|---|
| Verdier | 0,25 | PVQ-10 |
| Tilknytning | 0,25 | ECR |
| Personlighet | 0,15 | BFI-10 |
| Kommunikasjon | 0,15 | Gottman-prinsipper |
| Emosjonsregulering | 0,10 | ERQ-6 |
| Livssituasjon | 0,10 | Praktisk kompatibilitet |

Hver dimensjon bruker psykometriske skårer når begge profiler har dem, ellers
faller den tilbake til ordoverlapp. **Ingen bruker blir stående uten score.**

### 🔴 AVVIK — `ai/memory.json`

Fila lister fortsatt de **gamle ni vektene** (`values 0.25, personality 0.20,
relationshipStyle 0.15 …`) med kildehenvisning `unifiedScorer.ts:37-47`. Koden
har seks dimensjoner på linje 59-66. Enhver agent som laster memory-fila ved
oppstart får feil bilde av motoren. *Se §9, R-6.*

---

# DEL II — TEKNISK VURDERING

## 3. Arkitektur

**Sterkt:** Én scoringkilde delt av både API og cron. Én journey-motor (1 073
linjer som konsoliderer ti tidligere moduler). Advisory locks på begge
cron-jobber. Batch-transaksjoner. `normalizePair` gir deterministisk
pargenerering uavhengig av rekkefølge.

**Svakt:**

| Funn | Alvor |
|---|---|
| `components/MatchCard.tsx` er en **katalog**, og git sporer stien `"components/MatchCard.tsx\n</path"` — en LLM-respons skrevet til disk ved et shell-uhell | Lav (kosmetisk, men forvirrende) |
| Duplikatmoduler: `lib/analytics.ts` + `lib/analytics/`, `lib/matching.ts` + `lib/matching/`, `rate-limit.ts` + `rateLimit.ts` + `rate-limit-pg.ts` | Middels |
| To parallelle flaggsystemer: `utils/flags.ts` (20 flagg) og `config/features.ts` (11 kill switches) | Middels |
| Sporet i git: `test-results/`, `playwright-report/`, `prisma/dev.db` (458 KB), `prisma/schema` (utdatert duplikat) | Middels |

## 4. Database

**23 migrasjoner** (dokumentasjonen sa 21 — nå rettet). Schemaet er
gjennomtenkt: `@@unique([userAId, userBId])` på både Match og MatchHistory
hindrer duplikatkoblinger, `jp_user_match` sikrer én reise per bruker per
match, og `AuditLog.adminId` er `SetNull` slik at revisjonssporet overlever
kontosletting (S-9).

**Race conditions — status etter bølge A:**

| Sted | Mekanisme | Status |
|---|---|---|
| Gratiskvote | `UPDATE … WHERE used < cap` (F2-2) | ✅ Race-fri |
| Kvote ved feilet kø | `releaseFreeQuota` (A4) | ✅ **Rettet 25.08** |
| Cron-overlapp | `pg_try_advisory_lock` | ✅ |
| Rate limiting | `INSERT … ON CONFLICT` | ✅ Atomisk, fail-open |
| Kø-setting | `$transaction` + idempotens | ✅ |

### 🔴 Manglende indeks

`JourneyProgress` har indeks på `userId`, `matchId` og `bothSeenAt` — men
**ikke på `nextDayAt`**, som er nettopp kolonnen journey-cronen filtrerer på
hver time. Ved 100k brukere gir det full table scan hver time. *Se §9, R-4.*

## 5. Skalering

| Last | Vurdering |
|---|---|
| 50 testere | 🟢 Trivielt |
| 10k | 🟢 Journey-cron 300/time = 7 200 reiser. Matcherunde ~11 s (målt, F2-1) |
| 50k | 🟡 `JOURNEY_BATCH_SIZE` må heves. `nextDayAt`-indeks blir påkrevd |
| 100k | 🔴 Kø-tak 5 000 < forventet kø. Matcherunden trenger fortsettelses-cron |

**Største driftsrisiko — to databaser.** `GEORGE.md` dokumenterer selv at
`DATABASE_URL` i `.env.prod` peker på `db.prisma.io`, ikke Neon Frankfurt, og
at to migrasjoner manglet der (årsak til 500-feil i onboarding-lagring).
`lib/prisma.ts` dokumenterer `connection_limit=1`, men setter det ikke i
koden — det må ligge i URL-en. *Se §9, R-1.*

---

# DEL III — SIKKERHET

## 6. Vurdering

**Solid:** HMAC-SHA256 admin-JWT via Web Crypto (Edge-kompatibel),
`timingSafeEqual` på cron-secrets, secure-cookie-salt-fiksen (B-7), bcrypt,
Sentry PII-skrubbing (S-16), server-side bildesperre som svarer `423` **før**
opplasting, R2-nøkler aldri eksponert, dev-ruter fail-closed med `404` i
produksjon.

### ✅ RETTET 25.08 — IDOR i `/api/notifications`

```ts
// Slik var det:
const userId = url.searchParams.get('userId')
const notifications = await prisma.notification.findMany({ where: { userId } })
```

`userId` ble lest fra query-parameteren **uten sesjonssjekk**, og ruten var
heller ikke i `PROTECTED_API_PREFIXES`. Enhver kunne lese en annens varsler —
inkludert match-meldinger og retention-varsler — ved å gjette en cuid. `POST`
lot hvem som helst markere andres varsler som lest.

Ruten viste seg å være **død kode**: null kallere i frontend, null tester,
null dokumentasjonsreferanser. `NotificationCenter.tsx` bruker de korrekt
autentiserte `/api/system/messages` og `/api/system/mark-read`. Ruten ble
derfor slettet (A1), og prefiksene lagt inn i middleware (A2) slik at den ikke
kan gjenoppstå ubeskyttet.

### Gjenstående funn

| # | Funn | Alvor |
|---|---|---|
| S-1 | **Rate limiting på 10 av 116 ruter.** `/api/chat/send` er dekket (A5), men `/api/journey/*` og `/api/onboarding/*` er udekket | 🟠 Høy |
| S-2 | `ADMIN_PASSWORD` sammenlignes med `!==` (`admin/auth/route.ts:23`) — ikke timing-safe, i motsetning til cron-rutene. Passordet lagres i klartekst i env | 🟠 Høy |
| S-3 | `lib/auth/csrf.ts` finnes, men importeres ingen steder. Cookies er `sameSite: 'lax'`, som dekker det meste | 🟡 Middels |
| S-4 | `/api/analytics/track` og `/api/system/latency` er uautentiserte. `latency` lekker rutenavn og ytelsesdata | 🟡 Middels |
| S-5 | `.env` inneholder ekte produksjons-admin-passord, kun beskyttet av `.gitignore` (F-6 fortsatt åpen) | 🟠 Høy |

---

# DEL IV — UX, DRIFT OG LANSERING

## 7. UX

Flytene er gjennomarbeidede. Venterommet leser sanne DB-tilstander etter
Bug 3/4-fiksen, og «Meld deg ut» treffer nå `DELETE /api/journey/queue`
korrekt. Onboarding bruker prioriteringen server-draft > prefill >
localStorage, og rydder draften først **etter** vellykket innsending (WP2).

**Rettet 25.08:** brukervendte feilmeldinger i `/api/onboarding/complete` var
skrevet i nynorsk («Umagalet», «Profil finst ikke», «må vera fylte»), og
`requireAdmin` svarte «Aðgang nei — admin bare». Begge er nå bokmål (A6, A7).

### 🔴 Aldersverifisering — juridisk avvik

`app/vilkar/page.tsx:83` lover brukeren:

> «Alderen verifiseres gjennom Vipps, som bruker BankID.»

Det skjer ikke i beta. Auto-registreringen i `lib/auth/config.ts:54` oppretter
profilen med **`age: 25` hardkodet**, og Zod-validering (`min(21)`) gjelder
først når brukeren selv fyller ut skjemaet. Vilkårene lover altså en kontroll
som ikke finnes. *Se §9, R-2 — krever Georges beslutning, ikke en kodefiks.*

## 8. Drift og observability

Dette er systemets **sterkeste side**: Sentry med PII-skrubbing,
`PerformanceMetric`, `SystemLog`, `AuditLog`, terskelvarsling med
24-timers dedupe, `sendAlert` med webhook → e-post → Sentry-kjede, og
heartbeat i `finally` som aldri kan svelges.

**Rettet 25.08:**

- **CI var rød på `main`** — 39 nynorsk-treff fikk `lang-guard` til å feile,
  og siden `status`-jobben krever alle vakter grønne, feilet hele kjeden.
  Alle 15 filene er ryddet (A8). Kun kommentarer og feilmeldinger — ingen
  logikk berørt.
- **CD deployet uten å vente på CI.** `cd.yml` trigget på push til `main` uten
  `needs`. En rød CI stanset ingen deploy. Nå gated på
  `workflow_run` + `conclusion == 'success'` (A3).

## 9. Risikoanalyse

| ID | Risiko | Alvor | Tiltak |
|---|---|---|---|
| R-1 | **To databaser.** Uklart om Vercel bruker Neon eller `db.prisma.io`. Migrasjoner kan treffe feil base | 🔴 Kritisk | Bekreft `DATABASE_URL` i Vercel før neste `migrate deploy`. Krever dashbord-tilgang |
| R-2 | **Aldersløfte uten dekning.** Vilkårene lover BankID-verifisering som ikke finnes i beta | 🔴 Kritisk | Endre vilkårsteksten, ELLER krev alder ved registrering. Juridisk beslutning |
| R-3 | **Rate limiting på under 10 % av rutene.** Onboarding/journey kan flommes | 🟠 Høy | Bølge B: `pgCheck` på skrivende ruter |
| R-4 | **Manglende `nextDayAt`-indeks.** Full scan hver time ved skala | 🟠 Høy | Migrasjon i bølge B |
| R-5 | **Marketplace-problemet.** For få i kø → «ingen match denne uken» gjentatte ganger → opplevelsen kollapser | 🟠 Høy | Geografisk tetthet før bredde. Overvåk `rejectReasons` og kø-alder |
| R-6 | `ai/memory.json` lyver om matchevektene | 🟡 Middels | Oppdater til seks dimensjoner |
| R-7 | Hemmeligheter i `.env` (F-6) | 🟠 Høy | Passordhåndterer før produksjonsdata finnes |

## 10. Roadmap

### Bølge A — sikkerhet og kvalitetsport ✅ UTFØRT 25.08

Slettet IDOR-rute · middleware-prefikser · CD-gate · kvotelekkasje ·
rate limiting på chat · bokmål i feilmeldinger · CI grønn.
**Resultat:** 344/345 tester, tsc rent, ESLint rent, alle seks CI-vakter grønne.

### Bølge B — dag 1–30

1. R-1: bekreft én database, verifiser alle 23 migrasjoner
2. R-2: rett aldersløftet i vilkårene
3. R-4: `nextDayAt`-indeks
4. R-3: rate limiting på journey- og onboarding-ruter
5. S-2: timing-safe + hashet admin-passord
6. R-7: hemmeligheter til passordhåndterer
7. Slipp inn 10 → 50 testere. Observer `rejectReasons`, kø-alder, draft-frafall
8. **Ingen terskeljustering** (DI-2) — tall er data, ikke hendelser

### Bølge C — dag 31–60

Hygiene (`MatchCard`-katalogen, duplikatmoduler, sporede artefakter) ·
flaggkonsolidering · `JOURNEY_BATCH_SIZE`-tuning mot ekte data ·
fortsettelses-cron for matcherunden · E2E grønn i CI · CSRF aktivert ·
DPA + DPIA · tetthetsbasert radius.

---

## 11. Konklusjon

Tosom har noe de fleste prosjekter mangler: **en tydelig idé som er håndhevet
hele veien ned i koden.** Invariantene er ikke fromme ønsker i et dokument —
de er CI-jobber som feiler bygget.

Det som gjensto ved denne gjennomgangen var ikke arkitektur, men de siste
lagene av forsvar: en glemt rute uten auth, en teller som kunne lekke, en
kvalitetsport som ikke var koblet til. Alt dette er nå rettet.

Igjen står to ting som ikke kan løses fra koden: **hvilken database
produksjon faktisk bruker**, og **et løfte i vilkårene om aldersverifisering
som beta ikke innfrir**. Begge krever din beslutning.

Beta kan starte. Full lansering venter på de to.

---

*Ikke kanonisk. Ved motstrid: koden først, deretter `TOSOM-SUPER-MASTERPLAN-v2.0.md`.*
