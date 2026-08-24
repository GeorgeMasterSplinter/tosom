# TOSOM — BETA-VURDERING v1.0

**Dato:** 2026-08-24
**Commit:** `433003e`
**Status:** Vurdering + utført konsolideringsplan. Referanse for beta-perioden.
**Kanonisk kilde:** `TOSOM-SUPER-MASTERPLAN-v2.0.md`

---

## 1. Formål

Før beta-testere ser over produktet skal dokumentasjonen være **én sannhet**. Dette dokumentet:
(a) kartlegger hva `docs/` inneholdt og hvorfor det var farlig, (b) fastslår lanseringsklarhet mot koden, og (c) dokumenterer konsolideringen som ble utført 2026-08-24.

## 2. Metode

Alle påstander er verifisert mot kildekoden 2026-08-24 — ikke mot andre dokumenter: `find app/api` (116 ruter), `vercel.json` (2 crons), `lib/matching/unifiedScorer.ts` (6 dimensjoner), `lib/matching/dealbreaker.ts` (8 sjekker), `config/legal.ts` (21+), `prisma/schema.prisma` (onboardingDraft), git-log og testkjøring (35 suiter, 311 tester, 0 typefeil).

## 3. Funnet: tre sannheter fra tre uker

`docs/` inneholdt ~215 filer (4,2 MB) der aktive og utdattede dokumenter lå like til. De viktigste konfliktene:

| # | Konflikt | Alvor |
|---|---|---|
| 1 | **To mesterdokumenter.** `core/TOSOM_MASTER_OVERVIEW` (08-02) sa «les denne først», mens README + ACT-STATE pekte på SUPER-MASTERPLAN (08-19). Den gamle mesteren inneholdt faktiske feil: «legacy `pages/` med ~80 filer» (slettet), API-ruter som ikke finnes, «130 dokumenter». | Kritisk for nye agenter |
| 2 | **Kanonisk kilde selv utdatert.** SUPER-MASTERPLAN v1.0 listet B-1…B-4 som åpne (alle lukket), 109 ruter (116 faktisk), og invitasjonsmodellen (byttet til åpen beta 08-23). | Kritisk |
| 3 | **Tre beta-dokumenter, to modeller.** BETA-ACCESS (lukket/invitasjoner), BETA-TEST (åpen, gjelder), BETA-DRIFTSPLAN (blandet). | Høy |
| 4 | **`core/` var uverifisert.** 11 engelskspråklige overviews fra 08-02. DOCS-RESTRUCTURE utsa «full verifisering i Runde 4» — Runde 4 var ferdig, verifiseringen ikke gjort. | Høy |
| 5 | **Ferdige planer på toppnivået.** DOCS-RESTRUCTURE (utført 08-19), ADMIN-KOMMANDOPANEL (lukket 08-21). | Middels |
| 6 | **Point-in-time-diagnose som levende sannhet.** PLATTFORMDIAGNOSE v2.0 (🔴 NO-GO, 08-19) lå ved siden av BETA-TEST (GO, 08-23). | Høy |
| 7 | **ACT-STATE.json 5+ commits bak** (264 vs 311 tester, ingen WP1/WP2). | Høy |
| 8 | **`reference/` forfall.** Rute-inventar basert på 109 ruter; matching-dimensjoner uten WP1-dealbreakere. | Middels |
| 9 | **Ubegjengt konsept blandet med normative planer** (KONSEPT-DAGENS-TANKE: ingen `app/community`, ingen feature-flag, 5 åpne spørsmål). | Lav |
| 10 | **Restfinner:** `prisma/schema` (duplikat uten ekst.), `deploy/docker*` + `systemd` (Vercel er eneste mål), ucommitted docs-arbeid. | Lav |

## 4. Lanseringsklarhet (beta-syn)

| Område | Status |
|---|---|
| Produkt (kode) | 🟢 311/311 tester, tsc rent. WP1 (kjønn/alder-dealbreakere, sikkerhetsnivå-normalisering) og WP2 (onboarding-draft-isolasjon + prefill) levert 2026-08-24 — rett før ekte data kommer inn. |
| Blokkere | 🟢 B-1…B-7 alle lukket. A-1…A-4 rettet (M-1…M-6). G-1…G-5 ryddet. |
| Sanntingskjernen | 🟢 SUPER-MASTERPLAN v2.0 er nå kanonisk og verifisert mot koden. `core/` og ferdige planer er arkivert. |
| **Gate til første tester** | 🟡 **Manuell, ingen kode:** `BETA-TEST` §10 — AUTH_SECRET, DATABASE_URL, CRON_SECRET, `EMAIL_SERVER_*`, `BETA_MATCH_EMAIL` av, `MAINTENANCE_MODE` av, `DEV_LOGIN` av, admin-passord, support@-videresending, noreplay@-autosvar. |
| Neste trinn | Deploy middleware-fiksen → første testere → lenk `/trygghet` + `/metoder` i menyen → hosting-migrering (Vercel/Neon/R2) → geo 100 %. |

**Konklusjon:** Produktet er ferdig nok til å møte mennesker. Dokumentasjonen er nå én sannhet. Det eneste som står mellom oss og de første testerne er sjekklisten i BETA-TEST §10.

## 5. Konsolideringen — utført 2026-08-24

Én commit per steg, alltid `git mv` (historikken følger filen):

| Steg | Handling | Commit |
|---|---|---|
| B0 | Sikre basen: WP1/WP2 + 21+-rett + språkregel commitet | `cd0b7e5` |
| B1 | SUPER-MASTERPLAN v1.0 → **v2.0** (blokkere lukket, WP1/WP2, 116 ruter, åpen beta, 6 dimensjoner); v1.0 → `archive/snapshots/` | `5047167` |
| B2 | `core/` (11 filer) → `archive/core-2026-08-02/` | `6045deb` |
| B3 | PLATTFORMDIAGNOSE → `snapshots/`, DOCS-RESTRUCTURE + ADMIN-KOMMANDOPANEL → `ferdig/`, BETA-ACCESS → `erstattet/` | `0a0e47c` |
| B4 | BETA-DRIFTSPLAN v1.0 → **v1.1** (åpen beta-modell, B-5…B-7, 311 tester); v1.0 → `erstattet/` | `c0b67d6` |
| B5 | KONSEPT-DAGENS-TANKE → `concepts/` (+ README med regler) | `1c454d5` |
| B6 | `reference/` regenerert: 116 API-ruter fra faktisk kode; WP1-dealbreakere i matching-dimensions; SUPER-MASTERPLAN §5 rettet (6 dimensjoner, ikke 9) | `7173735` |
| B7 | README: ny inngangsport i fire grupper, 7 regler (inkl. «24 timer» og «diagnoser er snapshots») | `26c0b66` |
| B8 | ACT-STATE.json: 311/311, `leveranser` (WP1/WP2/DOKS), ny nextAction | `433003e` |
| B9 | Verifisering: 0 døde lenker (19 aktive filer), 13 filer på toppnivået, alle tverrreferanser rettet | (denne) |

**Før/etter:** 20 filer på toppnivået → **13** (12 `.md` + `ACT-STATE.json`). 1 kanonisk kilde. 0 døde lenker.

## 6. Anbefalinger

1. **Disiplinen til «toppnivået = det som gjelder nå» er selve dokumentasjonen.** Regelen «maks 10 filer» ble brutt innen fire dager sist gang. Den er erstattet av noe realistisk: *ingen ferdige eller erstatte dokumenter på toppnivået — de flyttes til `archive/` innen 24 timer* (README-regel 4).
2. **ACT-STATE.json er hjertepulsen.** Ny regel (README 7 + ACT-PIPELINE): den oppdateres i **samme commit** som den siste koden i en oppgave. Den var 5+ commits bak ved vurderingen.
3. **Diagnoser er snapshots, aldri levende sannhet.** Framtidige plattformdiagnoser fødes med dato+commit i tittelen og direkte i `archive/snapshots/` (README-regel 6).
4. **Ikke skriv nye store planer under beta.** Anden DI-2: terskeler og planer røres ikke mens vi måler. Under beta: patch → test → deploy → ACT-STATE + `reference/`. Store planer venter til beta-avslutningen.
5. **KONSEPT-DAGENS-TANKE avgjøres etter beta.** Det er det siste konseptet som kan bryte en invariant (I-7, AI). La de 5 åpne spørsmålene ligge i `concepts/` til vi har ekte data.
6. **Se på `rejectReasons` i de første rundene.** WP1-avbryterne (`kjonn`, `alder`) er nye. Hvis de avviser alt i små kohorter, er det data til tuning — ikke en feil. Men det må **ses**.

## 7. Åpne poster (krever Georges godkjenning — utført ikke)

| ID | Sak | Anbefaling |
|---|---|---|
| A | `prisma/schema` (uten ekst., 08-11) er et utdatert duplikat av `schema.prisma` (mangler bl.a. `onboardingDraft`) | `git rm` etter å ha bekreftet at ingen skript refererer til den |
| B | `deploy/` har fortsatt `docker-compose.prod.yml`, `docker/`, `systemd.service` — Vercel er eneste mål (var planlagt i DOCS-RESTRUCTURE §6) | Flytt til `deploy/archive/` |
| C | `ai/system_skisse.md` (16 KB) — DOCS-RESTRUCTURE sa «vurder arkivering hvis overlappende» | Sammenlign mot `ai/system_prompt.md`; arkiver hvis skisse |
| D | `LANDING-SIGNATUR-v1.0.md` — landingssiden bærer resonans-motivet i dag; S-stegene ser ferdige ut | Verifiser S-1…S-10 punktpresist; arkiver til `ferdig/` hvis ja |

## 8. Observasjon under beta (fra denne vurderingen)

| Hva | Hvor | Hvorfor |
|---|---|---|
| `rejectReasons`: `kjonn`, `alder` | `/admin/logs`, `SystemLog` | WP1: nye filtre skal observeres, ikke overraske |
| Draft-avbrudd i onboarding | `/admin/users` + onboarding-frafall | WP2: forsvinner folk som tidligere mistet data? |
| Match-e-post (fra `BETA_MATCH_EMAIL` på) | Støtte-postmottak | I-4-avviket: oppdager folk matchen innen 24 t uten e-post? |
| `SystemLog`-feil | `/admin/logs` | Ekte bruk er et annet lasteprofil enn tester |

---

*Denne vurderingen erstatter ingenting — den peker på SUPER-MASTERPLAN v2.0 som kanonisk kilde. Koden vinner alltid.*
