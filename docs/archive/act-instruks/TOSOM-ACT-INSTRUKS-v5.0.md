# TOSOM-ACT-INSTRUKS-v5.0 — KJERNELØFTET OG VEIEN TIL BETA

**Kilde:** `docs/TOSOM-MASTERPLAN-v4.0.md` (1088 linjer, verifisert mot commit `837c16f`)
**Underlag:** `ACT-STATE-v4.json` (korrigert), `TOSOM-ACT-INSTRUKS-v4.0.md`
**Tilstandsfil:** `docs/ACT-STATE-v5.json` (NY fil — ikke gjenbruk v4)
**Omfang:** 38 steg i 7 bølger
**Utgangspunkt:** Lanseringsscore **57 %** (matchekvalitet 35 %, drift 50 %)
**Mål:** Klar for lukket beta med 100–200 brukere

---

> ### Hvorfor v5.0 finnes
>
> ACT v4.0 utførte 35 av 49 steg og rapporterte **87 %**. Verifisering viste **57 %**.
>
> Årsaken er ikke slurv. Fire steg ble markert fullført fordi **koden var skrevet** — ikke fordi funksjonen var **koblet og observert**:
>
> | Steg | Skrevet | Virkelighet |
> |---|---|---|
> | C1 `Report` | Modell + API | **Ingen migrering.** Tabellen finnes ikke i databasen |
> | G1 `Order` | Modell + interface | **Ingen migrering** |
> | F5 Kill switches | 4 brytere definert | **0 treff utenfor definisjonsfilen** — dødkode |
> | B6 Matcherunde | Kohortalgoritme korrekt | **Feil scorer koblet inn** — `computeQuickScore` i stedet for `unifiedScore` |
>
> Derfor innfører v5.0 to nye sjekker:
>
> - **Sjekk 6 — migrering kjørt:** `prisma migrate` utført **og** tabellen bekreftet med `SELECT`
> - **Sjekk 7 — koblet, ikke bare skrevet:** ny kode må ha en verifisert kallende part
>
> Disse to ville fanget alle fire avvikene.

---

## INNHOLD

- [0. Ikke-forhandlingsbare regler](#0-ikke-forhandlingsbare-regler)
- [1. Tilstandsfil](#1-tilstandsfil-docsact-state-v5json)
- [2. Steg-mal og commit-format](#2-steg-mal-og-commit-format)
- [3. Normativ referanse](#3-normativ-referanse)
- [BØLGE 0 — Baseline](#bølge-0--baseline-2-steg)
- [BØLGE B0 — Nødbremsen](#bølge-b0--nødbremsen-8-steg--sperre)
- [BØLGE B1 — Kjerneløftet](#bølge-b1--kjerneløftet-6-steg--sperre)
- [BØLGE B2 — Opplevelsen](#bølge-b2--opplevelsen-7-steg)
- [BØLGE B3 — Innhold](#bølge-b3--innhold-2-steg)
- [BØLGE B4 — Funnel og tillit](#bølge-b4--funnel-og-tillit-6-steg)
- [BØLGE B5 — Admin og drift](#bølge-b5--admin-og-drift-7-steg)
- [4. Ferdigkriterier per bølge](#4-ferdigkriterier-per-bølge)

---

## 0. IKKE-FORHANDLINGSBARE REGLER

**Les FØRST. Følg ALLTID.**

1. **ETT steg per ACT-kommando.** Ett steg = én atomisk endring.
2. **VENT på uttrykkelig bekreftelse fra bruker** før neste steg.
3. **Etter HVERT steg, kjør i denne rekkefølgen:**
   - Sjekk 1: `npx tsc --noEmit`
   - Sjekk 2: grep-kommandoen angitt i steget
   - Sjekk 3: `npm run build`
   - Sjekk 4: **FUNKSJONELT** — observert DB-tilstand eller HTTP-respons
   - Sjekk 5: **KONSEPTSAMSVAR** — mot kapittel 3
   - Sjekk 6: **MIGRERING** — hvis steget rører `schema.prisma`
   - Sjekk 7: **KOBLET** — hvis steget lager ny kode
   - Skriv `docs/ACT-STATE-v5.json`
4. **Sjekk 4 er obligatorisk.** Grønn på 1–3 uten observert 4 → `"functional": "fail"`, IKKE i `completedSteps`.
5. **Sjekk 5:** svar skriftlig på *bygger dette ToSom slik kapittel 3 beskriver?* Innfører endringen et valg mellom mennesker, en andre matchemotor, varsling ved match, eller data som overlever en avsluttet reise → **STOPP og meld til bruker.**
6. 🆕 **Sjekk 6 — MIGRERING KJØRT.** Endrer steget `prisma/schema.prisma`, er det **ikke ferdig** før:
   - `npx prisma migrate dev --name <navn>` er kjørt
   - Migreringsfilen finnes under `prisma/migrations/`
   - Tabellen/kolonnen er bekreftet med `SELECT` mot databasen
   - `npx prisma migrate status` viser ingen ventende migreringer

   **Et skjemasteg uten kjørt migrering er `"migration": "fail"`.** Dette er den viktigste nye regelen.
7. 🆕 **Sjekk 7 — KOBLET, IKKE BARE SKREVET.** Lager steget en ny funksjon, modul, rute eller konfigurasjonsverdi, må du vise **hvem som kaller den**:
   ```bash
   grep -rn "<nyttNavn>" app/ lib/ components/ --include=*.ts --include=*.tsx | grep -v "<filen der den er definert>"
   ```
   **Null treff = `"wired": "fail"`.** En fil som finnes men ikke kalles, er ikke levert.
8. **Patch-skissene er IKKE ferdig kode.** Du skriver koden selv.
9. **Siter fil:linje FØR endring.** Alle ankere gjelder commit `837c16f` — les filen på nytt ved tvil.
10. **ALDRI erstatt en sikkerhetsmekanisme med en svakere.**
11. **Konfigurasjon og kode i SAMME steg.** `TIME_BUDGET_MS` vs. `maxDuration` er tredje gang denne regelen brytes.
12. **ALDRI endringer utenfor steget.** Andre feil → noter i `deviations`.
13. **ETT steg = ETT commit.** Ingen batching.
14. **Avhengighetssperre.** Ikke start hvis avhengighet mangler i `completedSteps`.
15. **B0 er en hard sperre.** Ingen steg i B1+ før `waveGateB0 = true`.
16. **B1 er en hard sperre.** Ingen steg i B2+ før `waveGateB1 = true`.
17. **Migreringer: additivt først, brytende samlet, aldri fredag.** Verifisert backup før hver brytende.
18. **Rollback ved rødt.** Kan du ikke fikse innenfor samme steg → rollback, dokumenter, spør bruker.
19. **Ingen nye avhengigheter** uten at steget angir det.
20. **Ingen test som reimplementerer logikken den tester.**
21. **Alle brukervendte strenger på bokmål.** Ingen `ikke`, `hvordan`, `bruker`, `allerede`, `funnet`, `bur`, `no` for «nå».
22. **05:00 nevnes aldri i brukervendt tekst.**

---

## 1. TILSTANDSFIL: `docs/ACT-STATE-v5.json`

Finnes ikke → du er på steg 0.1. Finnes → les `nextStep`, fortsett derfra.

```json
{
  "instruks": "v5.0-kjerneloftet",
  "sourceDoc": "docs/TOSOM-MASTERPLAN-v4.0.md",
  "baseCommit": "837c16f",
  "currentWave": "0",
  "currentStep": "0.1",
  "completedSteps": [],
  "failedSteps": [],
  "nextStep": "0.1",
  "waveGateB0": false,
  "waveGateB1": false,
  "preflight": {
    "vercelPlan": "hobby",
    "maxDurationAllowed": 60,
    "dbAccessible": false,
    "sentryDsnSet": false
  },
  "status": {
    "tsc": "not-run",
    "grep": "not-run",
    "build": "not-run",
    "functional": "not-run",
    "concept": "not-run",
    "migration": "not-run",
    "wired": "not-run"
  },
  "scores": {
    "matchekvalitet": 35,
    "drift": 50,
    "lansering": 57
  },
  "deviations": [],
  "lastCommit": "",
  "updatedAt": ""
}
```

| Felt | Betydning |
|---|---|
| `waveGateB0` | `true` først når hele B0 er grønn. Regel 15 |
| `waveGateB1` | `true` først når hele B1 er grønn. Regel 16 |
| `status.migration` | Sjekk 6. `"pass"` \| `"fail"` \| `"n/a"` |
| `status.wired` | Sjekk 7. `"pass"` \| `"fail"` \| `"n/a"` |
| `preflight.dbAccessible` | Kan du kjøre `prisma migrate`? **Uten dette kan ikke B0 fullføres** |

---

## 2. STEG-MAL OG COMMIT-FORMAT

```
STEG <bølge>.<nr> — <tittel>
Formål · Avhengigheter · Risiko · Filanker · Søkeanker
Patch-skisse (IKKE ferdig kode)
Sjekk 1 (tsc) · Sjekk 2 (grep) · Sjekk 3 (build)
Sjekk 4 (FUNKSJONELT) · Sjekk 5 (KONSEPT)
Sjekk 6 (MIGRERING) · Sjekk 7 (KOBLET)
State · Rollback · Commit
```

**Commit-format:**

```
<type>(<scope>): <beskrivelse> [ACT5 <bølge>.<nr>]
```

Typer: `fix` · `feat` · `chore` · `test` · `ci` · `refactor` · `docs` · `perf`

**Rollback-snutter:**

```bash
git checkout -- <fil>                        # ukommitert
git revert --no-edit <lastCommit>            # committet

# Migrering IKKE deployet:
rm -rf prisma/migrations/<timestamp>_<navn>
npx prisma migrate resolve --rolled-back <navn>

# Migrering DEPLOYET — aldri slett. Skriv reverserende:
npx prisma migrate dev --name revert_<navn>
```

**Verifikasjonssett:**

```bash
npx tsc --noEmit                      # 0 feil fra og med B0.4
npx jest                              # 90+ grønne
npx prisma format --check; echo $?    # exit 0 fra og med B0.8
npx prisma validate
npx prisma migrate status             # ingen ventende
npm run build
```

**Baseline ved start (`837c16f`):**

| Kommando | Forventet |
|---|---|
| `npx tsc --noEmit` | **RØD** — 13 feil, alle i `__tests__/` |
| `npx jest` | 90/93 (3 krever Postgres på :5433) |
| `npx prisma format --check` | **RØD** |
| `npx prisma migrate status` | **3 modeller uten migrering** |
| `npm run build` | GRØNN |

---

## 3. NORMATIV REFERANSE

> Sjekk 5 måles mot dette kapittelet. Ved konflikt gjelder kapittelet — meld avvik.

### 3.1 Loopen

```
LANDING → VIPPS (BankID) → [BETALING 349 kr / gratis til 10 000]
   → VILKÅR SIGNERT → ONBOARDING (13 steg, by + postnummer + radius)
   → «START REISEN» → journeyState = QUEUED
   → «Du får din match i løpet av 24 timer»  (05:00 nevnes aldri)
   → ⏰ 05:00 ÉN RUNDE:
        kø ≥ 20 ELLER noen ventet > 72 t → kjør
        unifiedScore (9 dimensjoner) · dealbreakere · radius · sperreliste
        MIN_SCORE overstyres ALDRI
        grådig parvis kobling
        → Match(active) + Conversation + JourneyProgress(day 0)
          + Notification × 2 (in-app) + journeyState = MATCHED × 2
   → 🔕 INGEN VARSLING UT
   → DASHBOARD: to kort, resonansNIVÅ (ikke tall), navn, alder, avstand
   → CHAT: 5 temaer (huskes) · bli kjent (12 × 12) · bilder dag 15
   → begge innom → bothSeenAt → DAG 1
   → ⏰ 07:00 dag++ · dagsvarsel · stillhetsimpuls etter 48 t
   → DAG 30 → tre utganger:
        «Vi fant hverandre» → PDF → alt slettes + konto slettes
        «Ny reise»          → alt slettes → betal → bekreft profil → kø
        (tidlig avslutning) → alt slettes
   → JourneyStat (anonym) skrives ved hver utgang
```

### 3.2 Invarianter

| # | Invariant | Håndheves av |
|---|---|---|
| I-1 | Én bruker, én reise om gangen | `User.journeyState` |
| I-2 | Ingen ja/nei til en person | Samtykkeflyten fjernet (v4 B7) |
| I-3 | **Én** matchemotor: cron 05:00 med `unifiedScore` | B0.3 |
| I-4 | Ingen varsling ut ved match. In-app `Notification` skal finnes | v4 B6 |
| I-5 | Dag 1 starter når begge har vært innom | `bothSeenAt` |
| I-6 | Ved reiseslutt slettes alt innhold | `endJourney()` |
| I-7 | To som har vært koblet, kobles aldri igjen | `MatchHistory` |
| I-8 | Dagsvarsler beholdes | Journey-cron |
| I-9 | 05:00 nevnes aldri utad | B2.6 |
| I-10 | Én pris, ingen nivåer, ingen gating | B4 |
| I-11 | 🆕 **Radius er dealbreaker** — begges grense respekteres | B1.4 |
| I-12 | 🆕 **Resonans vises som nivå, aldri som tall** | B1.5 |
| I-13 | 🆕 **`MIN_SCORE` overstyres aldri** — heller ikke av 72-timers ventilen | B1.6 |
| I-14 | 🆕 **Statistikk er anonym** — ingen ID, navn, innhold eller posisjon | B4.6 |

### 3.3 Resonansnivåer

```prisma
enum ResonanceLevel { GENTLE  MODERATE  STRONG  DEEP }   // finnes allerede
```

| Nivå | Score (0–100) | Vises til bruker |
|---|---|---|
| `DEEP` | ≥ 80 | «Dyp resonans» |
| `STRONG` | 65–79 | «Sterk resonans» |
| `MODERATE` | 50–64 | «God resonans» |
| `GENTLE` | 40–49 | «Rolig resonans» |
| — | < 40 | Ingen match. Brukeren venter |

> ⚠️ **Skalaviktig:** `unifiedScore` returnerer **0–100** (`unifiedScorer.ts:53`). `computeQuickScore` returnerer **0–1** (`route.ts:165` sammenligner med `0.4`). Ved bytte i B0.3 **må terskelen bli 40, ikke 0.4** — ellers slipper alle par gjennom. Dette er den letteste feilen å gjøre i hele instruksen.

---

# BØLGE 0 — BASELINE (2 steg)

## STEG 0.1 — Opprett tilstandsfil

**Formål:** Fremdriftsminne for v5.0 uten å overskrive v4-historikk.
**Avhengigheter:** Ingen · **Risiko:** Lav
**Filanker:** `docs/ACT-STATE-v5.json` (ny)

**Patch-skisse:** Opprett med skjemaet i kapittel 1. Alle status-felt `"not-run"`, begge `waveGate*` `false`.

- **Sjekk 1:** `npx tsc --noEmit` *(forventet 13 feil — baseline)*
- **Sjekk 2:** `test -f docs/ACT-STATE-v5.json && echo OK`
- **Sjekk 3:** Hopp over
- **Sjekk 4:** `jq -r .instruks docs/ACT-STATE-v5.json` → `v5.0-kjerneloftet`
- **Sjekk 5–7:** `n/a`

**State:** `currentStep="0.1"`, `nextStep="0.2"`
**Rollback:** `rm docs/ACT-STATE-v5.json`
**Commit:** `chore(act): opprett ACT-STATE-v5.json [ACT5 0.1]`

---

## STEG 0.2 — Baseline og databasetilgang 🔴 SPERRE

**Formål:** Dokumentere utgangspunkt, og **bekrefte at du kan kjøre migreringer**. Uten databasetilgang kan B0 ikke fullføres — da er hele bølgen blokkert.
**Avhengigheter:** 0.1 · **Risiko:** Lav (blokkerende)

**Patch-skisse:** Kjør og skriv én `deviations`-linje:
`"BASELINE v5: tsc=<N>, jest=<X>/<Y>, prisma-format=exit<N>, migrate-status=<tekst>, db=<ja/nei>"`

```bash
npx tsc --noEmit 2>&1 | grep -c "error TS"
npx jest 2>&1 | tail -5
npx prisma format --check; echo "exit=$?"
npx prisma migrate status
npx prisma db execute --stdin <<< "SELECT 1;" && echo "DB OK" || echo "DB UTILGJENGELIG"
```

**Spør bruker om databasetilgang hvis siste kommando feiler.** B0.1 og B0.2 krever at migreringer kan kjøres — enten mot lokal Postgres eller mot dev-databasen.

- **Sjekk 4:** `preflight.dbAccessible = true` i tilstandsfilen. Er den `false` → **STOPP og meld til bruker.**
- **Sjekk 5–7:** `n/a`

**State:** `currentWave="B0"`, `nextStep="B0.1"`
**Commit:** `chore(act): baseline v5.0 og databasetilgang [ACT5 0.2]`

---

# BØLGE B0 — NØDBREMSEN (8 steg) 🔴 SPERRE

> Fem P0-blokkere pluss grønn CI. Etter B0 har du en plattform som **matcher folk på kompatibilitet**, ikke krasjer, og kan stanses med en env-variabel.
>
> **Regel 15:** `waveGateB0 = true` først når B0.1–B0.8 alle er grønne.
> **Ta backup før B0.1.**

## STEG B0.1 — Rett migreringsnavnet som sorterer feil 🔴

**Formål:** P0-2. `0008_b8_cleanup_match` sorterer alfabetisk **før** `20260628012032_init_postgres_dev`. På en fersk database kjøres den først og prøver å endre en `Match`-tabell som ikke finnes. **Produksjonsdatabasen kan ikke gjenskapes.**
**Avhengigheter:** 0.2, `preflight.dbAccessible = true` · **Risiko:** Høy
**Filanker:** `prisma/migrations/0008_b8_cleanup_match/`
**Søkeanker:** `ls prisma/migrations/ | sort | head -3`

Innholdet er datamigrering (verifisert):
```sql
UPDATE "Match" SET status = 'active'  WHERE status IN ('pending','matched');
UPDATE "Match" SET status = 'ended'   WHERE status = 'unmatched';
UPDATE "Match" SET type = 'standard'  WHERE type = 'pending';
```

**Patch-skisse:**

- Døp om mappen til tidsstempelformat **etter** den nyeste eksisterende (`20260813230417_b4_journey_match_scoped`):
  `20260814090000_b8_cleanup_match`
- Oppdater `_prisma_migrations`-tabellen så den peker på det nye navnet — ellers tror Prisma at migreringen mangler:
  ```sql
  UPDATE "_prisma_migrations"
  SET migration_name = '20260814090000_b8_cleanup_match'
  WHERE migration_name = '0008_b8_cleanup_match';
  ```
- Gjør `UPDATE`-setningene idempotente (de er det allerede — `WHERE`-klausulene treffer ingenting ved gjentatt kjøring).

**Verifiser sorteringen:** `ls prisma/migrations/ | sort` skal ha `init` først.

- **Sjekk 1:** `npx tsc --noEmit`
- **Sjekk 2:** `ls prisma/migrations/ | sort | head -1` → `20260628012032_init_postgres_dev`
- **Sjekk 3:** `npm run build`
- **Sjekk 4:** `npx prisma migrate status` → «Database schema is up to date», ingen ventende, ingen «failed»
- **Sjekk 5:** `n/a`
- **Sjekk 6 (MIGRERING):** **Kritisk** — bygg en fersk testdatabase fra bunnen:
  ```bash
  # mot en TOM testdatabase:
  npx prisma migrate deploy
  # → skal fullføre uten feil
  npx prisma db execute --stdin <<< 'SELECT count(*) FROM "Match";'
  # → skal returnere 0, ikke "relation does not exist"
  ```
  **Dette er beviset på at P0-2 er lukket.**
- **Sjekk 7:** `n/a`

**State:** `currentStep="B0.1"`, `nextStep="B0.2"`
**Rollback:** Døp mappen tilbake og reverser `_prisma_migrations`-oppdateringen.
**Commit:** `fix(prisma): rett migreringsnavn som sorterte før init [ACT5 B0.1]`

---

## STEG B0.2 — Migrering for `Order`, `WebhookEvent` og `Report` 🔴

**Formål:** P0-1. Tre modeller finnes i `schema.prisma`, ingen har migrering. `POST /api/report` og hele betalingsveien gir **500 i produksjon**.
**Avhengigheter:** B0.1 · **Risiko:** Høy
**Søkeanker:**
```bash
for m in Order WebhookEvent Report; do
  echo -n "$m: "; grep -rl "\"$m\"" prisma/migrations/ | wc -l
done
# alle tre skal være 0 FØR, minst 1 ETTER
```

**Patch-skisse:**

- **Ikke endre `schema.prisma`** — modellene er der og er riktige. Dette er kun en migrering.
- Kjør:
  ```bash
  npx prisma migrate dev --name add_order_webhook_report
  ```
- Prisma genererer `CREATE TABLE` for alle tre pluss enums `OrderStatus`, `ReportCategory`, `ReportStatus`.
- **Les den genererte SQL-en før du kjører den mot noe som ikke er en testdatabase.**
- Verifiser at `Report` **ikke** har `onDelete: Cascade` mot `Match` — en rapport skal overleve at samtalen slettes (I-6 gjelder innhold, ikke rapporter).

- **Sjekk 1:** `npx tsc --noEmit`
- **Sjekk 2:** `for m in Order WebhookEvent Report; do grep -rl "\"$m\"" prisma/migrations/ | wc -l; done` → alle **≥ 1**
- **Sjekk 3:** `npm run build`
- **Sjekk 4 (FUNKSJONELT):**
  ```bash
  curl -s -o /dev/null -w "%{http_code}" -X POST localhost:3000/api/report \
    -H "Content-Type: application/json" -d '{}'
  # → 400 eller 401 (validering/auth), IKKE 500
  ```
- **Sjekk 5:** `n/a`
- **Sjekk 6 (MIGRERING):**
  ```sql
  SELECT count(*) FROM "Order";         -- → 0, ikke feil
  SELECT count(*) FROM "WebhookEvent";  -- → 0
  SELECT count(*) FROM "Report";        -- → 0
  ```
  Alle tre må svare. `npx prisma migrate status` → ingen ventende.
- **Sjekk 7:** `n/a`

**State:** `nextStep="B0.3"`
**Rollback:** `rm -rf prisma/migrations/<ny>` + `npx prisma migrate resolve --rolled-back add_order_webhook_report`
**Commit:** `feat(prisma): migrering for Order, WebhookEvent og Report [ACT5 B0.2]`

---

## STEG B0.3 — Koble `unifiedScore` i matcherunden 🔴 VIKTIGST

**Formål:** ToSoms kjerneløfte. Cron bruker `computeQuickScore` — en midlertidig funksjon som vekter alder 20 % — med kommentaren *«erstattes av unifiedScore når den er tilgjengelig»*. Den **er** tilgjengelig, med 9 dimensjoner og 37 tester.
**Avhengigheter:** B0.2 · **Risiko:** Høy
**Filanker:** `app/api/cron/matching/route.ts:164` (kall), `:165` (terskel), `:326` (definisjon), `lib/matching/unifiedScorer.ts:56`
**Søkeanker:** `grep -n "computeQuickScore" app/api/cron/matching/route.ts`

Dagens kode:
```ts
// :164-167
const baseScore = computeQuickScore(a.profile, b.profile);
if (baseScore < 0.4) {
  continue; // MIN_SCORE terskel
}
```

Målsignatur:
```ts
// lib/matching/unifiedScorer.ts:56
export function unifiedScore(
  a: ProfileData | Record<string, unknown>,
  b: ProfileData | Record<string, unknown>
): UnifiedResult
```

**Patch-skisse:**

1. Importer `unifiedScore` fra `@/lib/matching/unifiedScorer`.
2. Erstatt kallet på `:164`.
3. ⚠️ **SKALA — den letteste feilen i hele instruksen:** `unifiedScore` returnerer **0–100**. `computeQuickScore` returnerte **0–1**. Terskelen på `:165` **må** bli `40`, ikke `0.4`. Med `0.4` slipper *alle* par gjennom.
4. Legg `MIN_SCORE = 40` i `config/matching.ts` ved siden av `MIN_COHORT_SIZE` — ikke som magisk tall i ruten.
5. Behold `pair.score` i samme enhet gjennom sorteringen (`:174`).
6. Verifiser at `Match.score` (Int) og `normalizedScore` (Float) skrives riktig: `score: Math.round(s)`, `normalizedScore: s / 100`.
7. **Slett `computeQuickScore`** (`:326` og utover).
8. Lagre `breakdown` fra `UnifiedResult` i `Match.scoringBreakdown` — den trengs til admin og til `MatchBreakdown`.

- **Sjekk 1:** `npx tsc --noEmit`
- **Sjekk 2:**
  ```bash
  grep -c "computeQuickScore" app/api/cron/matching/route.ts   # → 0
  grep -c "unifiedScore" app/api/cron/matching/route.ts        # → ≥ 2 (import + kall)
  grep -n "MIN_SCORE" config/matching.ts                       # → finnes, = 40
  ```
- **Sjekk 3:** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Sett 21 testbrukere med **fullstendige** profiler i `QUEUED`. Kjør cron.
  ```sql
  SELECT score, "normalizedScore", "scoringBreakdown" IS NOT NULL AS har_breakdown
  FROM "Match" WHERE "createdAt" > now() - interval '5 min';
  ```
  → `score` mellom 40 og 100, `normalizedScore` mellom 0,4 og 1,0, `har_breakdown` = true for alle.
  **Kritisk kontroll:** er *alle* scorene identiske eller mistenkelig like, er normaliseringen feil — meld avvik.
- **Sjekk 5 (KONSEPT):** I-3. Matching skjer nå på 9 dimensjoner. Ingen annen scorer finnes i produksjonsveien.
- **Sjekk 6:** `n/a`
- **Sjekk 7 (KOBLET):**
  ```bash
  grep -rn "unifiedScore" app/ lib/ --include=*.ts | grep -v "unifiedScorer.ts"
  # → må vise app/api/cron/matching/route.ts
  ```

**State:** `nextStep="B0.4"`, `scores.matchekvalitet=60`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `fix(match): koble unifiedScore i matcherunden [ACT5 B0.3]`

---

## STEG B0.4 — Rett de 13 `tsc`-feilene

**Formål:** CI-jobben `typecheck` feiler. Alle 13 er i `__tests__/`, null i produksjonskode.
**Avhengigheter:** B0.3 · **Risiko:** Lav
**Filanker:** `__tests__/unified-scorer.test.ts:15,16,54,55,59,60,144,145`, `__tests__/dealbreaker.test.ts:15,16,20,25`, `__tests__/admin-authorization.test.ts:59`

Diagnose: `lib/matching/types.ts:53-78` speiler Prisma `Json?`-kolonner. `personality`, `lifeSituation`, `boundaries` m.fl. er `Record<string, unknown> | null`. Testene sender `string[]`.

**Patch-skisse:**

- **Produksjonskoden er riktig. Rett testene.** Ikke løsne typene i `types.ts`.
- `personality: ['rolig', 'åpen']` → `personality: { traits: ['rolig', 'åpen'] }`
- `boundaries: undefined` → `boundaries: null` (feltet er `| null`, ikke `| undefined`)
- `admin-authorization.test.ts:59`: `readdirSync`-overload — legg til `{ withFileTypes: false }` eller cast korrekt.
- **Ikke bruk `as any`.** Ikke slett tester.
- Verifiser at testene fortsatt **tester noe reelt** etter endringen — endrer du fixturen til `{}` for å slippe unna, har du gjort testen verdiløs.

- **Sjekk 1:** `npx tsc --noEmit` → **0 feil**
- **Sjekk 2:** `npx tsc --noEmit 2>&1 | grep -c "error TS"` → `0`
- **Sjekk 3:** `npm run build`
- **Sjekk 4:** `npx jest` → 90+ grønne. **Muteringstest:** endre en vekt i `unifiedScorer.ts` → testen skal feile. Gjenopprett.
- **Sjekk 5–7:** `n/a`

**State:** `nextStep="B0.5"`
**Rollback:** `git checkout -- __tests__/`
**Commit:** `fix(types): rett Json-typer i testfixturer [ACT5 B0.4]`

---

## STEG B0.5 — `TIME_BUDGET_MS` i samsvar med plattformgrensen 🔴

**Formål:** P0-5. `TIME_BUDGET_MS = 240_000` (4 min) mot `maxDuration: 60` i `vercel.json`. Cron kuttes **utenfor prosessen** — ingen `catch`, ingen heartbeat, advisory lock slippes ikke pent. Tredje gang denne klassen feil oppstår.
**Avhengigheter:** B0.4 · **Risiko:** Høy
**Filanker:** `app/api/cron/matching/route.ts:23`, `:49`, `vercel.json`
**Søkeanker:** `grep -n "TIME_BUDGET_MS" app/api/cron/*/route.ts`

**Patch-skisse — regel 11: kode og konfigurasjon i samme steg.**

- `TIME_BUDGET_MS = 50_000` (50 s < 60 s, gir 10 s til heartbeat og lock-frigjøring)
- Legg `export const maxDuration = 60` i **begge** cron-rutefiler
- Bekreft at `vercel.json` har `maxDuration: 60` for `app/api/cron/*/route.ts`
- Legg til en `take` på køhentingen (`:88`) som sikkerhetsventil: `take: 3000`. Uten grense lastes hele køen i minnet.
- Ved deadline: skriv det som er koblet så langt, logg `partial: true` i heartbeat. **Ikke** kast.

**Regel:** tidsbudsjett skal alltid være **minst 15 % lavere** enn `maxDuration`.

- **Sjekk 1:** `npx tsc --noEmit`
- **Sjekk 2:**
  ```bash
  grep -n "TIME_BUDGET_MS = " app/api/cron/matching/route.ts   # → 50_000
  grep -n "maxDuration" app/api/cron/*/route.ts                # → begge
  jq -r '.functions | keys[]' vercel.json
  ```
- **Sjekk 3:** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Kjør cron med 21 i kø.
  ```sql
  SELECT metadata FROM "SystemLog" WHERE module = 'cron:matching'
  ORDER BY "createdAt" DESC LIMIT 1;
  ```
  → `durationMs` < 50 000, `partial` ikke satt eller `false`. Ingen `Task timed out` i loggen.
- **Sjekk 5 (KONSEPT):** Cron er fortsatt eneste kilde til matcher.
- **Sjekk 6–7:** `n/a`

**State:** `nextStep="B0.6"`
**Rollback:** `git checkout -- app/api/cron/matching/route.ts app/api/cron/journey/route.ts vercel.json`
**Commit:** `fix(cron): tidsbudsjett i samsvar med maxDuration [ACT5 B0.5]`

---

## STEG B0.6 — Koble kill switchene 🔴

**Formål:** P0-3. Fire brytere definert i `config/features.ts`, **null treff andre steder**. `MATCHING_ENABLED=false` gjør ingenting. Nødbremsen er malt på veggen.
**Avhengigheter:** B0.5 · **Risiko:** Middels
**Filanker:** `config/features.ts:13,18,25,30`
**Søkeanker:** `grep -rn "enableMatching\|enableRegistration\|enablePayments\|maintenanceMode" app/ lib/ middleware.ts`

**Patch-skisse — hver bryter skal ha minst én kallende part:**

| Bryter | Kobles i | Oppførsel når av |
|---|---|---|
| `enableMatching` | `app/api/cron/matching/route.ts` — **først i handleren**, før advisory lock | `200 { skipped: true, reason: 'matching_disabled' }`. Køen urørt |
| `enableRegistration` | Registreringsrute + Vipps-callback | `503` med rolig melding |
| `enablePayments` | Betalingsveien | Gratismodus |
| `maintenanceMode` | `middleware.ts` | Rewrite til `/maintenance` for alt utenom `/api/system/*` og `/admin/*` |

Loggfør hver gang en bryter stopper noe — ellers blir stillheten mystisk.

- **Sjekk 1:** `npx tsc --noEmit`
- **Sjekk 2:**
  ```bash
  grep -rn "enableMatching" app/api/cron/matching/route.ts     # → ≥ 1
  grep -rn "maintenanceMode" middleware.ts                     # → ≥ 1
  grep -rn "enableRegistration" app/api/ | wc -l               # → ≥ 1
  ```
- **Sjekk 3:** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Med `MATCHING_ENABLED=false`, 21 i kø, kjør cron:
  ```sql
  SELECT count(*) FROM "Match" WHERE "createdAt" > now() - interval '5 min';  -- → 0
  SELECT count(*) FROM "User" WHERE "journeyState" = 'QUEUED';                -- → 21 (urørt)
  ```
  Med `MAINTENANCE_MODE=true`: `curl -I localhost:3000/` → vedlikeholdsflaten.
- **Sjekk 5 (KONSEPT):** Å stanse matching stopper ikke produktet. Brukere i kø blir stående, som ved en utsatt runde.
- **Sjekk 6:** `n/a`
- **Sjekk 7 (KOBLET):** Alle fire bryternavn har treff utenfor `config/features.ts`. **Null treff for én av dem = fail.**

**State:** `nextStep="B0.7"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(ops): koble kill switches til kodeveiene [ACT5 B0.6]`

---

## STEG B0.7 — `/api/chat/conversations`

**Formål:** P0-4. `app/chat/page.tsx:164` henter `/api/chat/conversations`. Ruten finnes ikke — chat-oversikten viser **alltid** «Ingen aktive samtaler».
**Avhengigheter:** B0.6 · **Risiko:** Lav
**Filanker:** `app/chat/page.tsx:164`, `app/api/chat/conversations/route.ts` (ny)
**Søkeanker:** `ls app/api/chat/`

**Patch-skisse:**

- `GET /api/chat/conversations`, autentisert via `requireAuth`.
- Returner brukerens aktive samtaler: id, motpartens navn og alder, `lastMessagePreview`, `lastMessageAt`, uleste, journey-dag.
- Bruk `select` — ikke full henting. Ingen meldingsinnhold utover forhåndsvisningen.
- **Fjern samtidig dev-fallbacken** i `app/chat/[id]/page.tsx:14` (`dev-user-${id}`). Uten sesjon lager den en falsk bruker-ID slik at alle meldinger rendres som «meg» — forvirrende, og potensielt en tilgangsfeil.
- Verifiser at responsformen matcher det `page.tsx` forventer.

- **Sjekk 1:** `npx tsc --noEmit`
- **Sjekk 2:** `test -f app/api/chat/conversations/route.ts && echo OK` og `grep -c "dev-user" app/chat/[id]/page.tsx` → `0`
- **Sjekk 3:** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Med en matchet testbruker: `GET /api/chat/conversations` → `200` med ett element. Last `/chat` i nettleser → samtalen vises, **ikke** tomtilstanden. Uten sesjon → `401`.
- **Sjekk 5 (KONSEPT):** Chatten er der brukeren bor. Inngangsdøren skal virke.
- **Sjekk 6:** `n/a`
- **Sjekk 7 (KOBLET):** `grep -n "api/chat/conversations" app/chat/page.tsx` → treff.

**State:** `nextStep="B0.8"`
**Rollback:** `rm -rf app/api/chat/conversations`
**Commit:** `feat(chat): legg til conversations-rute for oversikten [ACT5 B0.7]`

---

## STEG B0.8 — Grønn CI og singleton Prisma

**Formål:** `prisma format --check` feiler. To ruter lager egen `PrismaClient` — hver serverless-instans åpner sin egen forbindelsespool.
**Avhengigheter:** B0.7 · **Risiko:** Lav
**Filanker:** `app/api/admin/stats/route.ts:13`, `app/api/admin/journeys/route.ts:13`, `lib/prisma.ts:9`

**Patch-skisse:**

- `npx prisma format`
- Erstatt `const prisma = new PrismaClient()` med `import { prisma } from '@/lib/prisma'` i begge ruter.
- Legg til CI-guard i `.github/workflows/ci.yml` som avviser `new PrismaClient` utenfor `lib/prisma.ts`:
  ```yaml
  - name: Ingen egen PrismaClient
    run: |
      if grep -rn "new PrismaClient" app/ lib/ --include=*.ts | grep -v "lib/prisma.ts"; then
        echo "::error::Bruk singleton fra lib/prisma.ts"
        exit 1
      fi
  ```
- Utvid `lang-guard` med: `allerede`, `funnet`, `bruker`, `ikke`, `hvordan`, `vær vennlig`, `bur du`.

- **Sjekk 1:** `npx tsc --noEmit` → 0
- **Sjekk 2:**
  ```bash
  npx prisma format --check; echo "exit=$?"                              # → 0
  grep -rn "new PrismaClient" app/ lib/ | grep -v "lib/prisma.ts" | wc -l  # → 0
  ```
- **Sjekk 3:** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** `GET /api/admin/stats` → `200` med ekte data. Kjør de nye guard-kommandoene lokalt → exit 0.
- **Sjekk 5–6:** `n/a`
- **Sjekk 7 (KOBLET):** Guarden er i `needs:` for `status`-jobben, ellers blokkerer den ikke.

**State:** `nextStep="B1.1"`, **`waveGateB0=true`**, `scores.drift=65`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `chore(ci): grønn CI, singleton Prisma og utvidet lang-guard [ACT5 B0.8]`

> ### 🔒 SPERRE — B0 ferdigkriterium
>
> `waveGateB0 = true` **kun** når alle er sanne:
> - Fersk database kan bygges fra migreringene (`prisma migrate deploy` mot tom DB)
> - `SELECT` mot `Order`, `WebhookEvent` og `Report` svarer
> - Matcher opprettes med `score` 40–100 og `scoringBreakdown` satt
> - Cron kjører < 50 s uten timeout
> - `MATCHING_ENABLED=false` gir 0 nye matcher og urørt kø
> - `/chat` viser samtaler
> - `npx tsc --noEmit` = 0, `prisma format --check` = 0, `npx jest` grønn
>
> Én rød → **ikke start B1.**

---

# BØLGE B1 — KJERNELØFTET (6 steg) 🔴 SPERRE

> Onboardingen spør om by og radius. Begge lagres. **Ingen leser dem.** En bruker kan velge «maks 30 km» og bli koblet til noen 800 km unna.
>
> **Rekkefølgen er kritisk:** dette må inn **før** beta. Legger du det til etterpå, har de første brukerne ingen postnummer, og koordinater kan ikke utledes retroaktivt uten å spørre dem på nytt.

## STEG B1.1 — Postnummerdatasett

**Formål:** Grunnlaget for avstand. Norsk postnummer → koordinater krever et datasett.
**Avhengigheter:** B0.8, `waveGateB0 = true` · **Risiko:** Lav
**Filanker:** `lib/geo/postalCodes.json` (ny), `lib/geo/lookup.ts` (ny)

**Patch-skisse:**

- Postens åpne postnummerregister (~5000 rader) som statisk JSON i repoet: `{ "0150": { "sted": "Oslo", "lat": 59.9127, "lon": 10.7461 }, … }`
- **Ingen eksternt API.** Virker offline, ingen kostnad, ingen personvernsspørsmål, ingen nettverksfeil i matcherunden.
- `lib/geo/lookup.ts`: `lookupPostalCode(code: string): { sted, lat, lon } | null`
- Valider format: fire siffer. Ukjent postnummer → `null`, ikke kast.
- **Ingen ny avhengighet** (regel 19).

- **Sjekk 1:** `npx tsc --noEmit`
- **Sjekk 2:** `jq 'keys | length' lib/geo/postalCodes.json` → **> 4000**
- **Sjekk 3:** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Enhetstest: `lookupPostalCode('0150')` → Oslo-koordinater. `lookupPostalCode('9999')` og `'abc'` → `null`. Sjekk mot kjente steder: Oslo ~59,91/10,75, Bergen ~60,39/5,32, Tromsø ~69,65/18,96.
- **Sjekk 5:** `n/a`
- **Sjekk 6:** `n/a`
- **Sjekk 7:** `n/a` — kobles i B1.3.

**State:** `nextStep="B1.2"`
**Rollback:** `rm -rf lib/geo`
**Commit:** `feat(geo): postnummerdatasett og oppslag [ACT5 B1.1]`

---

## STEG B1.2 — Postnummer i onboarding

**Formål:** Feltet må samles inn. `city` finnes (`lib/validation/onboarding-setup.ts:25`), postnummer gjør ikke.
**Avhengigheter:** B1.1 · **Risiko:** Middels
**Filanker:** `lib/validation/onboarding-setup.ts:25`, `app/onboarding/steps/` (steget med `city`), `app/api/profile/setup/route.ts:63`
**Søkeanker:** `grep -rn "city" lib/validation/onboarding-setup.ts app/onboarding/steps/`

**Patch-skisse:**

- Legg `postalCode: z.string().regex(/^\d{4}$/, 'Fire siffer')` i valideringsskjemaet.
- Legg feltet i samme steg som `city`. Bruk oppslaget til å **vise stedsnavnet** når brukeren skriver — det bekrefter at hun skrev riktig.
- Skriv til `Profile.postalCode` (nytt kolonnefelt, B1.3) — **ikke** ned i en Json-blob. Vi skal filtrere på det.
- Rett samtidig nynorsken i samme fil: «Hvor bur du?» → «Hvor bor du?»
- **Ikke bruk `sed` på `OnboardingFlow.tsx`** — ACT v3 korrupterte den gjentatte ganger. Les og rediger målrettet.

- **Sjekk 1:** `npx tsc --noEmit`
- **Sjekk 2:** `grep -n "postalCode" lib/validation/onboarding-setup.ts` og `grep -rn "bur du" app/ lib/` → `0`
- **Sjekk 3:** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Fullfør onboarding med postnummer `5003`:
  ```sql
  SELECT "postalCode" FROM "Profile" WHERE "userId" = :uid;   -- → '5003'
  ```
  Ugyldig postnummer (`12`, `abcd`) → valideringsfeil, ikke lagring.
- **Sjekk 5 (KONSEPT):** Postnummer brukes til avstand, ikke til å vise nøyaktig posisjon til motparten.
- **Sjekk 6:** Avhenger av B1.3 — kjøres der.
- **Sjekk 7 (KOBLET):** `grep -rn "lookupPostalCode" app/` → treff i onboardingsteget eller setup-ruten.

**State:** `nextStep="B1.3"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(onboarding): samle inn postnummer [ACT5 B1.2]`

---

## STEG B1.3 — Koordinater på `Profile`

**Formål:** Matchingen må kunne regne avstand uten oppslag per par.
**Avhengigheter:** B1.2 · **Risiko:** Middels
**Filanker:** `prisma/schema.prisma` (`Profile`), `app/api/profile/setup/route.ts`

**Patch-skisse:**

```prisma
model Profile {
  postalCode  String?
  latitude    Float?
  longitude   Float?

  @@index([latitude, longitude])
}
```

- Migrering: `npx prisma migrate dev --name add_profile_geo`
- Utled `latitude`/`longitude` fra `postalCode` **ved lagring** i `app/api/profile/setup/route.ts` — ikke ved lesing.
- Backfill: eksisterende profiler har ingen postnummer. Sett `null` og la dem være. De kan ikke matches på avstand før de oppdaterer profilen. **Noter i `deviations` hvor mange rader dette gjelder.**
- Ukjent postnummer → koordinater `null`. Håndteres i B1.4.

- **Sjekk 1:** `npx tsc --noEmit`
- **Sjekk 2:** `grep -n "latitude\|longitude\|postalCode" prisma/schema.prisma` og `npx prisma validate`
- **Sjekk 3:** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Ny onboarding med `5003`:
  ```sql
  SELECT "postalCode", latitude, longitude FROM "Profile" WHERE "userId" = :uid;
  -- → '5003', ~60.39, ~5.32
  ```
- **Sjekk 5:** `n/a`
- **Sjekk 6 (MIGRERING):**
  ```sql
  SELECT column_name FROM information_schema.columns
  WHERE table_name = 'Profile' AND column_name IN ('postalCode','latitude','longitude');
  -- → 3 rader
  ```
  `npx prisma migrate status` → ingen ventende.
- **Sjekk 7 (KOBLET):** `grep -rn "lookupPostalCode" app/api/profile/setup/route.ts` → treff.

**State:** `nextStep="B1.4"`
**Rollback:** Reverserende migrering.
**Commit:** `feat(schema): koordinater på Profile utledet fra postnummer [ACT5 B1.3]`

---

## STEG B1.4 — Radius som dealbreaker 🔴

**Formål:** I-11. `distancePref` (1–300 km) samles inn og lagres, men leses aldri. Radius er et løfte systemet ikke holder.
**Avhengigheter:** B1.3 · **Risiko:** Høy
**Filanker:** `lib/matching/distance.ts` (ny), `lib/matching/dealbreaker.ts:139` (`sjekkAlleDealbreakers`)
**Søkeanker:** `grep -rn "distancePref" app/ lib/`

**Patch-skisse:**

1. `lib/matching/distance.ts` — haversine:
   ```ts
   export function haversineKm(
     aLat: number, aLon: number, bLat: number, bLon: number
   ): number
   ```
2. Utvid `sjekkAlleDealbreakers` med radiussjekk:
   - Hent `distancePref` for begge (ligger i `Profile.deepProfileData`)
   - Beregn avstand fra koordinatene
   - **Tosidig:** blokkér hvis avstand > A sin grense **eller** > B sin grense
3. **Manglende data:** har én av dem ikke koordinater → **ikke blokkér** (ellers utestenges alle eksisterende brukere). Logg det i stedet, så du ser omfanget.
4. **Radius er ikke en scoringsdimensjon.** Ber brukeren om 30 km, er 800 km ikke «litt dårligere» — det er feil.
5. Skriv en teller i heartbeat: hvor mange par ble blokkert av radius.

- **Sjekk 1:** `npx tsc --noEmit`
- **Sjekk 2:** `grep -n "haversineKm" lib/matching/dealbreaker.ts` → treff
- **Sjekk 3:** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** To scenarier, begge må observeres:

  **(a) Blokkering:** bruker A i Oslo (`0150`) med `distancePref = 30`, bruker B i Tromsø (`9008`). Legg dem i kø med 19 andre. Kjør cron.
  ```sql
  SELECT count(*) FROM "Match"
  WHERE ("userAId" = :a AND "userBId" = :b) OR ("userAId" = :b AND "userBId" = :a);
  -- → 0
  ```

  **(b) Tillatelse:** A i Oslo (`0150`, 30 km) og C i Oslo (`0180`). → **skal** kunne kobles.

  Enhetstest på `haversineKm`: Oslo–Bergen ≈ 305 km (±10), Oslo–Tromsø ≈ 1150 km (±30), samme punkt = 0.
- **Sjekk 5 (KONSEPT):** I-11. En preferanse brukeren aktivt har satt, håndheves — ikke veies bort.
- **Sjekk 6:** `n/a`
- **Sjekk 7 (KOBLET):** `grep -rn "haversineKm" lib/ app/ | grep -v "distance.ts"` → treff i `dealbreaker.ts`.

**State:** `nextStep="B1.5"`, `scores.matchekvalitet=80`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(match): radius som dealbreaker med haversine [ACT5 B1.4]`

---

## STEG B1.5 — Resonansnivå i stedet for tall

**Formål:** I-12. `ResonanceLevel`-enumen finnes med `@default(GENTLE)` og **beregnes aldri** — alle matcher får GENTLE. «Resonans 64» er dessuten et tall som inviterer til sammenligning.
**Avhengigheter:** B1.4 · **Risiko:** Lav
**Filanker:** `app/api/cron/matching/route.ts` (match-opprettelsen), `components/MatchBreakdown.tsx:62-95`, `components/dashboard/PremiumResonanceMeter.tsx`

**Patch-skisse:**

1. `lib/matching/resonanceLevel.ts`:
   ```ts
   export function toResonanceLevel(score: number): ResonanceLevel
   // ≥80 DEEP · 65-79 STRONG · 50-64 MODERATE · 40-49 GENTLE
   ```
2. Sett `resonanceLevel` ved match-opprettelsen i cron.
3. **Brukerflaten viser ord, aldri tall.** Kanonisk kopi:
   - `DEEP` → «Dyp resonans»
   - `STRONG` → «Sterk resonans»
   - `MODERATE` → «God resonans»
   - `GENTLE` → «Rolig resonans»
4. `MatchBreakdown.tsx:88` viser i dag `{data.totalScore}%` med fargeskala 85/70/55. Erstatt med kvalitativ beskrivelse per dimensjon — *«Dere er nære på verdier, ulike på livsrytme»*. Mer interessant å lese, og mer sant.
5. **Tallene beholdes i admin.** Der trengs de for å justere vekter.

- **Sjekk 1:** `npx tsc --noEmit`
- **Sjekk 2:**
  ```bash
  grep -rn "totalScore}%" components/ | wc -l                          # → 0
  grep -rn "resonanceLevel" app/api/cron/matching/route.ts             # → treff
  grep -rn "%" components/MatchBreakdown.tsx | grep -v "width" | wc -l  # → 0
  ```
- **Sjekk 3:** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** Kjør en runde:
  ```sql
  SELECT score, "resonanceLevel" FROM "Match"
  WHERE "createdAt" > now() - interval '5 min';
  ```
  → nivået stemmer med tersklene for hver rad. Ingen rad har `GENTLE` med score 85.
  Last dashbordet → **«Sterk resonans»**, ingen prosenttall synlig noe sted.
- **Sjekk 5 (KONSEPT):** I-12. Ingen bruker kan sammenligne sin match numerisk med andres.
- **Sjekk 6:** `n/a`
- **Sjekk 7 (KOBLET):** `grep -rn "toResonanceLevel" app/ lib/ | grep -v "resonanceLevel.ts"` → treff.

**State:** `nextStep="B1.6"`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(ux): resonansnivå som ord i stedet for prosent [ACT5 B1.5]`

---

## STEG B1.6 — Avstand i UI og `MIN_SCORE` som ufravikelig

**Formål:** Fullføre kjerneløftet. Avstand på matchkortet, og sikre at 72-timers ventilen aldri tvinger en match under terskelen.
**Avhengigheter:** B1.5 · **Risiko:** Middels
**Filanker:** `components/MatchCard.tsx`, `app/api/dashboard/overview/route.ts`, `app/api/cron/matching/route.ts` (ventilen)

**Patch-skisse:**

1. **Avstand i UI:** beregn i dashboard-ruten, send som avrundet bånd — «ca. 12 km», «ca. 40 km». **Ikke** eksakt avstand, som kan avsløre posisjon. Mangler koordinater → skjul feltet, ikke vis «0 km».
2. **`MIN_SCORE` ufravikelig:** ventilen (`hasStaleEntries`) tvinger runden til å **kjøre**, aldri til å **koble** under terskelen. Verifiser at `if (score < MIN_SCORE) continue` ikke kan omgås.
3. **Kopi ved tynn kø:** når runden deferres, skal dashbordet si:
   > «Vi venter til vi har nok mennesker til å finne en god match til deg.»

   Ikke en unnskyldning — ToSoms filosofi anvendt på et reelt problem.

- **Sjekk 1:** `npx tsc --noEmit`
- **Sjekk 2:** `grep -rn "km" components/MatchCard.tsx` → treff. `grep -rn "MIN_SCORE" app/api/cron/matching/route.ts` → treff.
- **Sjekk 3:** `npm run build`
- **Sjekk 4 (FUNKSJONELT):** To scenarier:

  **(a)** Matchet par i Oslo og Bergen → kortet viser «ca. 305 km» (eller båndet det faller i).

  **(b) Ventil-test:** sett **2** brukere i kø med `matchQueuedAt` 80 timer tilbake, og gjør dem inkompatible (score < 40). Kjør cron.
  ```sql
  SELECT count(*) FROM "Match" WHERE "createdAt" > now() - interval '5 min';  -- → 0
  SELECT count(*) FROM "User" WHERE "journeyState" = 'QUEUED';                -- → 2
  ```
  **De skal fortsatt stå i kø.** Ventilen kjørte runden, men koblet ikke under terskelen.
- **Sjekk 5 (KONSEPT):** I-13. Bedre å vente enn å få en match systemet selv vet er svak.
- **Sjekk 6–7:** `n/a`

**State:** `nextStep="B2.1"`, **`waveGateB1=true`**, `scores.matchekvalitet=90`, `scores.lansering=72`
**Rollback:** `git revert --no-edit <lastCommit>`
**Commit:** `feat(match): avstand i UI og ufravikelig MIN_SCORE [ACT5 B1.6]`

> ### 🔒 SPERRE — B1 ferdigkriterium
>
> `waveGateB1 = true` **kun** når:
> - Postnummer samles inn og gir koordinater
> - Oslo–Tromsø med 30 km-preferanse blir **ikke** koblet (verifisert i DB)
> - Oslo–Oslo blir koblet
> - `resonanceLevel` beregnes riktig; ingen prosenttall i brukerflaten
> - Ventil-testen: 2 inkompatible brukere som ventet 80 t blir **ikke** koblet
> - Avstand vises på matchkortet

---

# BØLGE B2 — OPPLEVELSEN (7 steg)

## STEG B2.1 — Moodvalget huskes

**Formål:** 5 stemninger finnes (`ChatContainer.tsx:187-228`) med `MoodSelector` montert (`:626`). Valget nullstilles ved reload.
**Avhengigheter:** B1.6, `waveGateB1 = true` · **Risiko:** Lav
**Filanker:** `app/chat/components/ChatContainer.tsx:230`, `app/chat/context/ChatContext.tsx`

**Patch-skisse:** `localStorage` per samtale-ID: `tosom:mood:<conversationId>`. Les ved montering, skriv ved bytte. Ugyldig verdi → `calm`. Vurder `Conversation`-felt senere hvis det skal følge brukeren mellom enheter — `localStorage` er nok nå.

- **Sjekk 2:** `grep -n "localStorage" app/chat/components/ChatContainer.tsx` → treff
- **Sjekk 4:** Velg «Deep», last siden på nytt → fortsatt Deep. Åpne en annen samtale → egen verdi.
- **Sjekk 5:** Opplevelseskvalitet. Chatten er der brukeren bor.
- **Sjekk 7:** Lesing og skriving koblet til `MoodSelector`.

**Commit:** `feat(chat): husk moodvalg per samtale [ACT5 B2.1]`

---

## STEG B2.2 — Onboarding-autosave

**Formål:** `/api/onboarding/draft` finnes (GET + POST). `hooks/useAutoSave.ts` finnes. `OnboardingFlow.tsx` kaller **ingen av dem**. 13 steg og ~15 minutter kun i `localStorage`.
**Avhengigheter:** B2.1 · **Risiko:** Middels
**Filanker:** `app/onboarding/OnboardingFlow.tsx` (482 l.), `app/api/onboarding/draft/route.ts`

> ⚠️ **ACT v3 STEG 5.3 mislyktes her.** Deviation: *«sed korrupterer 485-linjers React-komponent gjentatt»*. **Bruk ikke `sed`.** Les hele filen, gjør målrettede redigeringer, kjør `npx tsc --noEmit` etter hver.

**Patch-skisse:** `POST` ved stegbytte (debounced, ikke-blokkerende — feiler lagringen skal brukeren likevel komme videre; logg til Sentry). `GET` ved oppstart → gjenopprett svar og posisjon. `localStorage` som hurtigbuffer, serveren er sannheten. Rett samtidig «Bruker» (`:399`) og «Vær vennlig å prøv igjen» (`:424`).

- **Sjekk 2:** `grep -c "onboarding/draft" app/onboarding/OnboardingFlow.tsx` → **≥ 2**
- **Sjekk 4:** Fyll steg 1–5. **Tøm localStorage.** Last på nytt → svar og posisjon gjenopprettet fra serveren. Verifiser utkastraden i DB.
- **Sjekk 7:** Både GET og POST har kallende part.

**Commit:** `feat(onboarding): koble serverside autosave [ACT5 B2.2]`

---

## STEG B2.3 — «Ut av køen»

**Formål:** Beslutning 6. «Start reisen» er et punkt uten retur, men står hun i kø i 72 timer uten mulighet til å trekke seg, er det urimelig. Å forlate køen er ikke det samme som å avvise et menneske.
**Avhengigheter:** B2.2 · **Risiko:** Lav
**Filanker:** `app/api/journey/queue/route.ts` (DELETE), `app/dashboard/`, `app/settings/`

**Patch-skisse:** `DELETE /api/journey/queue` → `journeyState: IDLE`, `matchQueuedAt: null`. Kun tillatt når `journeyState = QUEUED` — er hun `MATCHED`, er det for sent (`409`). Knapp i ventetilstanden, diskret. Bekreftelsesdialog: hun må trykke «Start reisen» på nytt for å komme tilbake i kø.

- **Sjekk 4:**
  ```sql
  SELECT "journeyState", "matchQueuedAt" FROM "User" WHERE id = :uid;  -- → IDLE, null
  ```
  Prøv som `MATCHED`-bruker → `409`.
- **Sjekk 5:** I-1. Køen er frivillig; koblingen er ikke.

**Commit:** `feat(journey): la brukeren forlate køen [ACT5 B2.3]`

---

## STEG B2.4 — Journey-kalender

**Formål:** `app/dashboard/journey/page.tsx` er 93 linjer og leser kun kontekst uten å hente data. Reisen er strukturen ToSom lover — den skal være synlig.
**Avhengigheter:** B2.3 · **Risiko:** Lav
**Filanker:** `app/dashboard/journey/page.tsx`, `components/journey/`

**Patch-skisse:** Dag N av 30 med fase (EARLY 1–14, BUILDING_TRUST 15–21, DEEPER 22–25, CHECKIN 26–30) og hva fasen betyr. Milepæler markert: dag 15 bilder, dag 30 avslutning. Dagens tema fremhevet. **Reise ikke startet → «Reisen deres begynner når dere begge har vært innom»**, ikke «dag 0».

- **Sjekk 4:** Reise på dag 16 → «Dag 16 av 30», BUILDING_TRUST, bilder åpnet. Reise med `bothSeenAt = null` → venter-tilstand.
- **Sjekk 5:** I-5.

**Commit:** `feat(ux): journey-kalender med fase og milepæler [ACT5 B2.4]`

---

## STEG B2.5 — Stillhetsdeteksjon

**Formål:** Beslutning 2. `lib/journey/engine.ts` har stillhetsdeteksjon skrevet — den er ikke koblet. Etter 200+ spørsmål kan samtalen gå tom, og da skal ToSom legge en hånd på skulderen.
**Avhengigheter:** B2.4 · **Risiko:** Middels
**Filanker:** `lib/journey/engine.ts` (stillhetslogikken), `app/api/cron/journey/route.ts`

**Patch-skisse:** Ingen meldinger i 48 timer **og** reisen er aktiv → journey-cron legger ett varmt spørsmål i samtalen fra ToSom selv. Maks én impuls per 48 timer — ikke mas. Bruk `GuidedQuestion` som kilde, gjerne matchet mot fasen. **Ikke en AI-partner** (bryter produktregelen) — systemet velger et forhåndsskrevet spørsmål.

Dette begrenser ikke hva folk gjør. Møtes de fysisk dag 3 og slutter å bruke chatten, har ToSom gjort jobben sin. Impulsen er for dem som *vil* fortsette men ikke vet hva de skal si.

- **Sjekk 4:** Sett `lastMessageAt` 50 timer tilbake. Kjør journey-cron.
  ```sql
  SELECT content, "createdAt" FROM "Message"
  WHERE "conversationId" = :cid ORDER BY "createdAt" DESC LIMIT 1;
  ```
  → ny systemmelding med et spørsmål. Kjør cron igjen umiddelbart → **ingen ny** impuls.
- **Sjekk 5:** Ingen AI mot bruker. Forhåndsskrevet innhold.
- **Sjekk 7:** Stillhetsfunksjonen har nå en kallende part.

**Commit:** `feat(journey): koble stillhetsdeteksjon til dagsimpuls [ACT5 B2.5]`

---

## STEG B2.6 — Kopi og språk

**Formål:** I-9 og regel 21.
**Avhengigheter:** B2.5 · **Risiko:** Lav
**Filanker:** `components/dashboard/WaitingForMatch.tsx`, `app/api/journey/exit/route.ts`, diverse

**Kanonisk kopi:**

| Tilstand | Tekst |
|---|---|
| I kø | «Du får din match i løpet av 24 timer.» |
| Tynn kø | «Vi venter til vi har nok mennesker til å finne en god match til deg.» |
| Matchet, ikke startet | «Reisen deres begynner når dere begge har vært innom.» |
| Før avslutning | «Dette sletter samtalen for dere begge. Det kan ikke angres.» |
| Bilder | «Fra dag 15 kan dere dele bilder.» *(koden er kanon)* |

Fjern all nynorsk: `allerede`, `funnet`, `bruker`, `ikke`, `hvordan`, `vær vennlig`, `bur`.

- **Sjekk 2:**
  ```bash
  grep -rn "05:00" app/ components/ --include=*.tsx | grep -v admin | wc -l   # → 0
  grep -rniE "allerede|funnet|bruker|ikke|hvordan|vær vennlig" app/ components/ lib/ | wc -l  # → 0
  ```
- **Sjekk 4:** Hver tilstand vises med riktig tekst. `lang-guard` grønn.
- **Sjekk 5:** I-9. Ingen driftsdetalj lekker.

**Commit:** `fix(copy): kanonisk kopi og bokmål overalt [ACT5 B2.6]`

---

## STEG B2.7 — Manuell QA på mobil

**Formål:** Mobil er hovedflaten for et produkt man sjekker om morgenen.
**Avhengigheter:** B2.6 · **Risiko:** Middels

**Sjekkliste — verifiseres på ekte enhet, iOS Safari og Android Chrome:**

| Krav |
|---|
| Full flyt: registrer → onboarding → dashboard → chat |
| Trykkflater ≥ 44×44 px |
| Ingen horisontal scroll ved 320 px |
| Tastatur skjuler ikke skrivefeltet i chat |
| Trygge soner (`env(safe-area-inset-*)`) |
| `prefers-reduced-motion` respektert |
| Moodbytte virker med tommel |
| Bli kjent-panelet er brukbart på liten skjerm |

- **Sjekk 4:** Alle åtte punkter observert. Enhet og OS-versjon i `deviations`. Skjermbilder av chat i to moods.
- **Sjekk 5:** Opplevelseskvalitet der folk faktisk er.

**State:** `nextStep="B3.1"`, `scores.lansering=78`
**Commit:** `docs(qa): manuell mobilverifisering [ACT5 B2.7]`

---

# BØLGE B3 — INNHOLD (2 steg)

## STEG B3.1 — Struktur for 144 spørsmål

**Formål:** Beslutning 7. Dagens innhold er 12 kategorier / **221 spørsmål** (filens egen kommentar hevder 240 — den lyver med 19). Tre kategorinavn er nynorske. Skal bli **12 × 12 = 144** på bokmål.
**Avhengigheter:** B2.7 · **Risiko:** Lav
**Filanker:** `scripts/seed-questions.ts`

**Kanoniske kategorier:**

```
1. Trygghet                      7. Relasjonsmønster
2. Verdier                       8. Emosjonell innsikt
3. Kommunikasjon                 9. Konflikt og grenser
4. Nærhet                       10. Samfunn og tilhørighet
5. Framtidsdrømmer              11. Personlighet og selvinnsikt
6. Livsstil                     12. Opplevelser og nysgjerrighet
```

**Patch-skisse:** Skriv om seed-skriptet til 12 × 12. Per kategori: **4 spørsmål med `depthLevel` 1** (lett inngang), **4 med 2** (middels), **4 med 3** (dyp). Behold fargekodene. Idempotent seeding — `upsert`, ikke `create`, så den kan kjøres på nytt.

**Dette steget lager strukturen og malen. Innholdet er Georges skrivejobb (B3.2)** — det er ToSoms stemme, og den kan ikke automatiseres.

- **Sjekk 2:** `grep -c "depthLevel" scripts/seed-questions.ts`
- **Sjekk 4:** Kjør seed:
  ```sql
  SELECT count(*) FROM "QuestionCategory";                    -- → 12
  SELECT count(*) FROM "GuidedQuestion";                      -- → 144
  SELECT "categoryId", count(*) FROM "GuidedQuestion" GROUP BY 1;  -- → 12 per kategori
  SELECT "depthLevel", count(*) FROM "GuidedQuestion" GROUP BY 1;  -- → 48 per nivå
  ```
  Kjør seed **to ganger** → fortsatt 144, ikke 288.
- **Sjekk 5:** Alle spørsmål tjener ToSoms konsept.
- **Sjekk 6:** `n/a` — kun data.

**Commit:** `feat(content): struktur for 12 x 12 spørsmål [ACT5 B3.1]`

---

## STEG B3.2 — Redaksjonell gjennomgang

**Formål:** Bli kjent er ToSoms beste strategi. Innholdet må holde.
**Avhengigheter:** B3.1 · **Risiko:** Lav

**Krav til hvert spørsmål:**

- Bokmål, ingen nynorskformer
- Åpent — kan ikke besvares med ja/nei
- Passer to voksne som ikke har møtt hverandre
- `depthLevel` 1 kan stilles dag 1 uten at det blir ubehagelig
- `depthLevel` 3 forutsetter noe tillit
- Noen skal være lette og morsomme — samtalen skal kunne skli når det blir stille
- Ingen spørsmål som forutsetter kjønn, legning, barn eller sivilstatus

- **Sjekk 4:** Les alle 144 i admin eller mot databasen. Ingen nynorsk, ingen ja/nei-spørsmål, jevn fordeling. Test 5 tilfeldige i chat → de leses naturlig i en samtale.
- **Sjekk 5:** ToSoms stemme, ikke en generisk spørsmålsliste.

**State:** `nextStep="B4.1"`
**Commit:** `feat(content): 144 spørsmål på bokmål [ACT5 B3.2]`

---

# BØLGE B4 — FUNNEL OG TILLIT (6 steg)

## STEG B4.1 — Vilkår lagres

**Formål:** «Man må signere vilkår» — men ingenting lagres. Du har ingen dokumentasjon på at brukeren godtok noe.
**Avhengigheter:** B3.2 · **Risiko:** Middels
**Filanker:** `prisma/schema.prisma` (`User`), registreringsvei

**Patch-skisse:**

```prisma
model User {
  termsAcceptedAt     DateTime?
  termsVersion        String?
  withdrawalWaiverAt  DateTime?
}
```

Migrering. Avkrysning ved registrering — **ikke** forhåndsavkrysset. `termsVersion` som dato-streng (`"2026-08-14"`) så du kan se hvem som godtok hva.

- **Sjekk 4:** Registrer → `SELECT "termsAcceptedAt", "termsVersion" FROM "User" WHERE id = :uid;` → satt. Uten avkrysning → registrering avvises.
- **Sjekk 6 (MIGRERING):** `information_schema` viser tre nye kolonner. `migrate status` rent.

**Commit:** `feat(legal): lagre vilkårssamtykke på User [ACT5 B4.1]`

---

## STEG B4.2 — Vilkår og angrerett

**Formål:** Norsk angrerettlov gir 14 dagers angrerett på digitale tjenester **med mindre** kunden uttrykkelig samtykker til at leveringen starter straks.
**Avhengigheter:** B4.1 · **Risiko:** Lav (høy hvis utelatt)
**Filanker:** `app/vilkår/page.tsx`, `app/personvern/page.tsx`, betalingssteget

**Vilkårene må dekke:**

1. Hva 349 kr gir: **én reise, 30 dager**
2. At man **kobles** til én person og ikke velger hvem
3. At motparten kan avslutte, og at samtalen da slettes for begge
4. At alt slettes ved reiseslutt
5. Aldersgrense **23 år**
6. Ingen refusjon etter påbegynt reise — **forutsetter punkt 7**
7. Avkrysning i betalingssteget, ordrett:
   > ☐ Jeg samtykker til at ToSom starter reisen min straks, og forstår at angreretten dermed bortfaller.

Uten punkt 7 har enhver bruker 14 dagers ubetinget krav på pengene tilbake.

- **Sjekk 2:** `grep -c "angrerett" app/vilkår/page.tsx` → **≥ 1**
- **Sjekk 4:** `/vilkår` og `/personvern` → `200`, alle syv punkter til stede. Avkrysningen lagres til `withdrawalWaiverAt`.
- **Sjekk 5:** Vilkårene beskriver koblingsmodellen, ikke en samtykkemodell.

> **Anbefaling til bruker:** la en jurist lese vilkår og personvern **før betaling slås på**. Ikke nødvendig før beta — den er gratis.

**Commit:** `docs(legal): vilkår med angrerett og koblingsmodell [ACT5 B4.2]`

---

## STEG B4.3 — Betaling som ærlig pass-through

**Formål:** Betalingssteget er dekorativt. Vipps-nøkler kommer om ~2 uker. Til da skal steget si ærlig at de første 10 000 er gratis — **ikke** vise en knapp som ikke virker.
**Avhengigheter:** B4.2 · **Risiko:** Middels
**Filanker:** `lib/payment/freeQuota.ts`, `app/api/journey/queue/route.ts`, `app/betaling/page.tsx`

**Patch-skisse:** `FreeQuotaProvider` oppretter `Order(freeQuota: true, status: PAID, amount: 0)`. Teller cachet 60 s. Under 10 000 → gratis, brukeren slippes gjennom. Over → betalingsflate (inaktiv til Vipps). Fjern den brutte Vipps-lenken fra `/login`. `PAYMENTS_ENABLED` styrer.

Forutsetter B0.2 (`Order`-tabellen).

- **Sjekk 4:** Ny bruker → `Order` med `freeQuota: true, status: PAID`, kø lykkes. Sett telleren kunstig til 10 000 → neste bruker havner **ikke** i kø.
- **Sjekk 5:** I-10. Ingen funksjonsforskjell mellom gratis og betalt — kun tilgang.
- **Sjekk 7:** `countFreeQuotaOrders` har kallende part i køruten.

**Commit:** `feat(payment): gratiskvote som ærlig pass-through [ACT5 B4.3]`

---

## STEG B4.4 — PDF-eksport ved «Vi fant hverandre»

**Formål:** Beslutning 3. To mennesker som har brukt 30 dager på å finne hverandre, får minnet med seg selv om ToSom sletter sitt. Løftet holdes, og de mister ingenting.
**Avhengigheter:** B4.3 · **Risiko:** Middels
**Filanker:** `app/reisen/avslutning/page.tsx`, `app/api/journey/export/route.ts` (ny)

**Patch-skisse:** Tilby nedlasting **før** slettekallet. Generer PDF fra meldingene — enkleste vei er klientside fra allerede lastede meldinger, eller et eksport-endepunkt som returnerer PDF. Begge parter kan laste ned hver sin. Etter nedlasting (eller avslag) → `endJourney('found_each_other')`.

Ingen ny tung avhengighet hvis du kan bruke nettleserens utskrift-til-PDF med en ren utskriftsstil. Vurder det først.

- **Sjekk 4:** Dag 30 → «Vi fant hverandre» → PDF lastes ned med hele samtalen, lesbar, med datoer. Deretter:
  ```sql
  SELECT count(*) FROM "Message" WHERE "conversationId" = :cid;   -- → 0
  SELECT count(*) FROM "User" WHERE id IN (:a, :b);               -- → 0 (konto slettet)
  ```
- **Sjekk 5:** I-6. Sletting er fullstendig; minnet er brukerens eget.

**Commit:** `feat(journey): PDF-eksport før sletting ved fullført reise [ACT5 B4.4]`

---

## STEG B4.5 — Kontosletting ved «Vi fant hverandre»

**Formål:** Beslutning: «takker og avslutter» sletter match, chat **og hele kontoen**. I dag slettes bare match og chat.
**Avhengigheter:** B4.4 · **Risiko:** Høy
**Filanker:** `lib/journey/endJourney.ts`, `app/api/settings/delete-account/route.ts`

**Patch-skisse:** `outcome: 'found_each_other'` → etter `endJourney()`, slett begge brukerkontoer fullstendig. Gjenbruk sletterekkefølgen fra `scripts/hardDeleteDeletedUsers.ts`. **Behold:** `MatchHistory` (to ID-er), `JourneyStat` (anonym), `Report` (må overleve), `AuditLog` med admin-handlinger.

⚠️ **«Ny reise» skal IKKE slette kontoen.** Verifiser at de to veiene er tydelig skilt — dette er den farligste feilen i bølgen.

- **Sjekk 4:** Begge veier på hver sin testreise:
  ```sql
  -- «Vi fant hverandre»:
  SELECT count(*) FROM "User" WHERE id IN (:a, :b);        -- → 0
  SELECT count(*) FROM "MatchHistory" WHERE "userAId" = :a; -- → 1
  -- «Ny reise»:
  SELECT "journeyState" FROM "User" WHERE id = :c;          -- → IDLE, kontoen lever
  ```
- **Sjekk 5:** I-6 og I-14.

**Commit:** `feat(gdpr): full kontosletting ved fullført reise [ACT5 B4.5]`

---

## STEG B4.6 — `JourneyStat` — anonym statistikk

**Formål:** Beslutning 8. Sletting fjerner all data om at reisen fant sted — inkludert tallet du trenger for en reportasje.
**Avhengigheter:** B4.5 · **Risiko:** Middels
**Filanker:** `prisma/schema.prisma`, `lib/journey/endJourney.ts`

```prisma
model JourneyStat {
  id             String   @id @default(cuid())
  endedAt        DateTime @default(now())
  outcome        String   // found_each_other | new_journey | early_exit | expired
  daysCompleted  Int
  messageCount   Int
  bothActive     Boolean
  resonanceLevel String
  ageBandA       String   // «23-29» — bånd, ikke alder
  ageBandB       String
  distanceBand   String   // «0-25km» — bånd, ikke posisjon
  usedBliKjent   Boolean

  @@index([endedAt])
  @@index([outcome])
}
```

**Patch-skisse:** Skriv én rad i `endJourney()` **før** slettingen (dataene trengs for å fylle den). Ingen ID-er, ingen navn, ingen innhold, ingen posisjon. Aldersbånd i femårsintervaller, avstandsbånd i 25 km-intervaller.

`resonanceLevel` + `outcome` er kombinasjonen som validerer hele matchemotoren.

- **Sjekk 4:** Kjør `endJourney()`:
  ```sql
  SELECT * FROM "JourneyStat" ORDER BY "endedAt" DESC LIMIT 1;
  ```
  → alle felt utfylt, `ageBandA` som «23-29», ingen kolonne inneholder ID eller navn.
- **Sjekk 5:** I-14. Statistikk uten personopplysninger.
- **Sjekk 6 (MIGRERING):** `SELECT count(*) FROM "JourneyStat";` svarer.
- **Sjekk 7:** Skrives fra `endJourney()`.

**State:** `nextStep="B5.1"`
**Commit:** `feat(analytics): anonym JourneyStat ved reiseslutt [ACT5 B4.6]`

---

# BØLGE B5 — ADMIN OG DRIFT (7 steg)

## STEG B5.1 — `StatusBadge` med terskler

**Formål:** «Farger basert på tilstand grønn, gul/orange og rødt.» 16 admin-sider finnes, ingen severity-logikk.
**Avhengigheter:** B4.6 · **Risiko:** Lav
**Filanker:** `components/admin/StatusBadge.tsx` (ny)

**Kanoniske terskler:**

| Indikator | 🟢 | 🟡 | 🔴 |
|---|---|---|---|
| Siste matcherunde | < 26 t | 26–48 t | > 48 t |
| Kø-størrelse | ≥ 20 | 1–19 | 0 |
| Runde-varighet | < 30 s | 30–50 s | > 50 s |
| 5xx siste time | 0 | 1–5 | > 5 |
| DB-forbindelser | < 50 % | 50–80 % | > 80 % |
| Åpne rapporter | 0 | 1–5 | > 5 |
| Sentry-feil 24 t | < 10 | 10–50 | > 50 |
| Gratiskvote | < 8000 | 8000–9500 | > 9500 |

- **Sjekk 4:** Komponenten rendrer alle tre nivåer. Terskeltest med grenseverdier.
- **Sjekk 7:** Brukes i B5.2.

**Commit:** `feat(admin): StatusBadge med kanoniske terskler [ACT5 B5.1]`

---

## STEG B5.2 — Admin-oversiktsside

**Formål:** Én side der alt er synlig samtidig. Er alt grønt, trenger du ikke klikke videre.
**Avhengigheter:** B5.1 · **Risiko:** Lav
**Filanker:** `app/admin/dashboard/page.tsx`, `app/api/admin/overview/route.ts`

**Patch-skisse:** Alle åtte indikatorer fra B5.1 med `StatusBadge`. Ett API-kall, ikke åtte. Lenker videre til detaljsidene. Bruk singleton Prisma.

- **Sjekk 4:** Last `/admin/dashboard` → alle åtte indikatorer med farge og ekte data. Sett siste matcherunde kunstig til 30 timer tilbake → indikatoren blir 🟡.
- **Sjekk 7:** `StatusBadge` har kallende part.

**Commit:** `feat(admin): oversiktsside med statusfarger [ACT5 B5.2]`

---

## STEG B5.3 — Rapportkø og statistikkflate

**Formål:** `Report`-tabellen finnes nå (B0.2). Rapporter må behandles, og `JourneyStat` må vises.
**Avhengigheter:** B5.2 · **Risiko:** Lav
**Filanker:** `app/admin/reports/page.tsx`, `app/admin/analytics/page.tsx`

**Patch-skisse:** Rapportkø: `status = OPEN` eldst først, med handlinger (se kontekst, marker gjennomgått, ban, avvis). Hvert samtaleinnsyn skriver `AuditLog` med begrunnelse.

Statistikk fra `JourneyStat`: fullførte reiser per utgang, **fullføringsgrad per resonansnivå** (den viktigste — validerer matchemotoren), gjennomsnittlig dager fullført, bli kjent-bruk, gratiskvote.

- **Sjekk 4:** Opprett en testrapport → vises i køen. Åpne samtale som admin → `AuditLog`-rad med begrunnelse. Statistikksiden viser ekte tall fra `JourneyStat`.
- **Sjekk 5:** ToSom lover at ingen ser samtalene. Der unntak er nødvendig, er de sporbare.

**Commit:** `feat(admin): rapportkø og reisestatistikk [ACT5 B5.3]`

---

## STEG B5.4 — Scorefordeling i admin

**Formål:** Eneste måte å justere matchevektene. Havner alle par i `GENTLE`, er vektene feil.
**Avhengigheter:** B5.3 · **Risiko:** Lav
**Filanker:** `app/admin/resonance/page.tsx`, `app/api/admin/matching-rounds/route.ts` (ny)

**Patch-skisse:** Per runde (fra `SystemLog` `cron:matching`): kø-størrelse, koblede par, varighet, deferred. Scorefordeling som histogram. Dealbreaker-avslag per regel — **én regel som blokkerer 80 % er sannsynligvis feil**. Radiusavslag. Andel i kø uten kvalifisert match.

- **Sjekk 4:** Etter en runde: siden viser fordeling, avslagsårsaker og varighet med ekte tall.
- **Sjekk 5:** Matchekvalitet skal måles, ikke antas.

**Commit:** `feat(admin): scorefordeling og runde-historikk [ACT5 B5.4]`

---

## STEG B5.5 — Connection pooling og cache

**Formål:** Connection-utmattelse er reell risiko på serverless. Journey-dagsinnhold er 30 datasett, identiske for alle, hentet fra DB ved hver forespørsel.
**Avhengigheter:** B5.4 · **Risiko:** Middels
**Filanker:** `lib/prisma.ts`, `lib/cache/` (ny)

**Patch-skisse:**

- **Pooling:** `?pgbouncer=true&connection_limit=1` i `DATABASE_URL` for serverless. `DIRECT_URL` for migreringer.
- **Cache** (Upstash Redis finnes allerede — ingen ny avhengighet):

  | Nøkkel | TTL |
  |---|---|
  | `journey:day:<N>` | 24 t |
  | `match:active:<userId>` | 5 min |
  | `quota:free:count` | 60 s |

- Cache-aside. **Cache nede → gå til DB, aldri feil mot bruker.**
- Invalider aktiv match ved `endJourney()`.

- **Sjekk 4:** `/api/journey/today` to ganger → andre kall treffer ikke DB (Prisma query-logg). p95 < 100 ms. Slå av Redis → ruten svarer fortsatt `200`. 100 samtidige forespørsler → ingen `too many connections`.

**Commit:** `perf(db): connection pooling og Redis-cache [ACT5 B5.5]`

---

## STEG B5.6 — Alarmer

**Formål:** `/api/system/cron-health` finnes, men **ingen leser den**. En helsesjekk ingen abonnerer på er en logg, ikke en alarm.
**Avhengigheter:** B5.5 · **Risiko:** Middels
**Filanker:** `lib/observability/alert.ts` (ny), `app/api/cron/journey/route.ts`

**Patch-skisse:**

`sendAlert(severity, title, detail)`. Kanal fra env i prioritert rekkefølge: `ALERT_WEBHOOK_URL` (Slack/Discord) → `ALERT_EMAIL_TO` (`nodemailer` finnes) → `Sentry.captureMessage` som fallback. **Ingen ny avhengighet.**

Utløsere:
- Matcherunde uteble (ingen `SystemLog` nyere enn 26 t)
- Runde feilet
- Kø > kohortterskel men 0 koblinger
- DB utilgjengelig

**Vercel Hobby tillater maks 2 cron-jobber.** Legg watchdog-sjekken på slutten av journey-cron (07:00), ikke som en tredje jobb.

- **Sjekk 4:** Sett `SystemLog` for `cron:matching` kunstig 30 timer tilbake. Kjør journey-cron → **varsel mottatt i valgt kanal.** Tilbakestill.
- **Sjekk 5:** Alarmen går til drift, ikke til brukere.
- **Sjekk 7:** `sendAlert` har kallende part.

**Commit:** `feat(ops): alarmer ved uteblitt runde og feil [ACT5 B5.6]`

---

## STEG B5.7 — Verifisert backup og gjenoppretting 🔴

**Formål:** `deploy/backup.md` beskriver backup. **Ingen har testet gjenoppretting.** En backup som ikke er gjenopprettet, er en antakelse.
**Avhengigheter:** B5.6 · **Risiko:** Høy hvis utelatt
**Filanker:** `deploy/backup.md`, `scripts/db/`

**Patch-skisse:**

- Bekreft at automatisk daglig backup er **på** hos databaseleverandøren.
- Skript for manuell backup før brytende migreringer.
- **Gjennomfør en faktisk gjenopprettingstest** til en ny database. Verifiser radantall i `User`, `Match`, `Message`, `JourneyProgress`, `JourneyStat`.
- Dokumenter prosedyren steg for steg med målt tidsbruk (RTO).

- **Sjekk 4:** Gjenoppretting **faktisk gjennomført**. Radantall før/etter notert i `deviations` sammen med tidsbruk. En annen person skal kunne følge `deploy/backup.md` uten forkunnskap.

**State:** `nextStep="BETA"`, `scores.drift=85`, `scores.lansering=90`
**Commit:** `docs(ops): verifisert backup- og gjenopprettingsprosedyre [ACT5 B5.7]`

---

# 4. FERDIGKRITERIER PER BØLGE

| Bølge | Steg | Ferdigkriterium | Score etter |
|---|---|---|---|
| **0** | 2 | Tilstandsfil finnes. Baseline dokumentert. **Databasetilgang bekreftet** | 57 % |
| **B0** 🔒 | 8 | Fersk DB kan bygges · 3 tabeller svarer på `SELECT` · matcher med 9-dimensjonal score · cron < 50 s · kill switches virker · `/chat` viser samtaler · CI grønn | 68 % |
| **B1** 🔒 | 6 | Oslo–Tromsø med 30 km blir **ikke** koblet · resonansnivå som ord · ventil kobler ikke under `MIN_SCORE` · avstand i UI | 72 % |
| **B2** | 7 | Moodvalg huskes · onboarding overlever tømt localStorage · ut av køen · stillhetsimpuls · bokmål · mobil-QA | 78 % |
| **B3** | 2 | 12 × 12 = 144 spørsmål på bokmål, idempotent seed | 80 % |
| **B4** | 6 | Vilkår lagres · angrerett · gratiskvote · PDF · kontosletting · `JourneyStat` | 85 % |
| **B5** | 7 | Statusfarger · rapportkø · scorefordeling · pooling · cache · alarm mottatt · **gjenoppretting gjennomført** | 90 % |

**Samlet: 38 steg.**

Estimat med ett steg om gangen og verifisering: B0 ~2 dager · B1 ~3 dager · B2 ~4 dager · B3 (Georges skrivejobb, parallelt) · B4 ~4 dager · B5 ~5 dager. **~3 uker, deretter beta i 5–6 uker.**

---

## SLUTTNOTAT TIL UTFØRENDE MODELL

De sju sjekkene finnes fordi hver av dem har fanget noe de andre slapp gjennom:

| Sjekk | Fanger | Slapp gjennom i v4 |
|---|---|---|
| 1 `tsc` | Typefeil | — |
| 2 grep | At noe finnes | — |
| 3 build | Byggfeil | — |
| 4 funksjonelt | At funksjonen virker | — |
| 5 konsept | At det er riktig produkt | — |
| **6 migrering** | At tabellen finnes i **databasen** | `Order`, `WebhookEvent`, `Report` |
| **7 koblet** | At koden **kalles** | `computeQuickScore`, 4 kill switches |

Du kommer til å bli fristet til å slå sammen steg. **Ikke gjør det.**

Og vær særlig oppmerksom på **B0.3**: `unifiedScore` returnerer 0–100, `computeQuickScore` returnerte 0–1. Bytter du funksjonen uten å endre terskelen fra `0.4` til `40`, slipper hvert eneste par gjennom, og ToSom kobler tilfeldige mennesker. Det vil se ut som suksess i loggen.

Husk hva ToSom er: et produkt som lover ro. Bygg det rolig.

---

*TOSOM-ACT-INSTRUKS v5.0 — 14. august 2026.*
*38 steg i 7 bølger. To sperrer. Sju sjekker per steg.*
*Alle filankere er verifisert mot commit `837c16f`.*
