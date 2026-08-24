# TOSOM — DOCS RESTRUCTURE v1.0

**Dato:** 2026-08-19
**Commit:** `bc1ef13`
**Status:** **UTFØRT 2026-08-19** — §7 gjennomført commit-for-commit. §4.11 og §6 oppdatert for å reflektere faktisk behandling (verifisert mot filer, ikke bare mot planen).

---

## 1. Nåtilstand

| Sted | Filer |
|---|---|
| `docs/` toppnivå | 39 `.md` + 10 `.json` + 1 `.html` |
| `docs/archive/` | 158 |
| `docs/core/` | 10 |
| `docs/system/` | 10 |
| `docs/v2/` | 15 |
| `docs/audit-drafts/` | 7 |
| **Totalt** | **~250 filer** |

**Kjernetallet:** ACT-INSTRUKS v2–v11 utgjør **12 075 linjer**. MASTERPLAN v2–v8 utgjør **7 863 linjer**. Til sammen nesten **20 000 linjer historikk** på toppnivå, der kun de nyeste er relevante.

`repo-structure.md` alene er 3 086 linjer — generert innhold som blir feil ved første kodeendring.

### Konsekvensen
En ny agent som åpner `docs/` finner ti ACT-INSTRUKS-filer uten å vite hvilken som gjelder. `docs/README.md` peker på `tosom-masterplan-v4.md` og `docs/language-guidelines.md` — **ingen av dem finnes.**

Dokumentasjonen er ikke for lite. Den er for mye, uten hierarki.

---

## 2. Prinsipper

1. **Toppnivå = det som gjelder nå.** Maks 10 filer.
2. **Historikk bevares, men flyttes.** Vi sletter nesten ingenting — arkivering er nok.
3. **Én kanonisk kilde per emne.**
4. **Generert innhold hører ikke i dokumentasjon.**
5. **Ingen ødelagte lenker.**

---

## 3. Ny struktur

```
docs/
├── README.md                          ← inngangsport, oppdatert
│
├── TOSOM-SUPER-MASTERPLAN-v1.0.md     ← kanonisk systembeskrivelse
├── TOSOM-PLATTFORMDIAGNOSE-v2.0.md    ← as-is-tilstand
├── SECURITY-STABILITY-PLAN-v2.0.md
├── MATCHING-TUNING-PLAN-v1.0.md
├── BETA-ACCESS-PLAN-v1.0.md
├── ACT-PIPELINE-v1.0.md
├── DOCS-RESTRUCTURE-v1.0.md           ← dette dokumentet
├── ACT-STATE.json                     ← eneste levende tilstandsfil
│
├── reference/          ← levende oppslagsverk
│   ├── api-route-inventory.md
│   ├── match-status-lifecycle.md
│   └── design-token-migration-guide.md
│
├── core/               ← levende kernedokumentasjon (11 filer, verifisert mot SUPER-MASTERPLAN)
│
└── archive/
    ├── (158 eksisterende)
    ├── masterplan/     ← v2.0–v8.0
    ├── act-instruks/   ← v2.0–v11.0
    ├── act-state/      ← v3–v11
    ├── handover/       ← ROUND-B, ROUND-C ×2
    ├── system/         ← fra docs/system/
    ├── v2/             ← fra docs/v2/
    └── audit-drafts/   ← fra docs/audit-drafts/
```

**Resultat: 8 markdown-filer + 1 JSON på toppnivå.**

---

## 4. Disposisjon per fil

### 4.1 ✅ AKTIVE — bli på toppnivå

| Fil | Merknad |
|---|---|
| `TOSOM-SUPER-MASTERPLAN-v1.0.md` | Ny. Kanonisk. |
| `TOSOM-PLATTFORMDIAGNOSE-v2.0.md` | Ny. |
| `SECURITY-STABILITY-PLAN-v2.0.md` | Ny. |
| `MATCHING-TUNING-PLAN-v1.0.md` | Ny. |
| `BETA-ACCESS-PLAN-v1.0.md` | Ny. |
| `ACT-PIPELINE-v1.0.md` | Ny. |
| `DOCS-RESTRUCTURE-v1.0.md` | Ny. |
| `ACT-STATE.json` | 🔄 **Må oppdateres** — se §5. |

### 4.2 🔄 OPPDATER

| Fil | Handling |
|---|---|
| `README.md` | **Skriv om.** Peker i dag på to filer som ikke finnes. Skal bli en kort inngangsport med lenker til de syv aktive. |

### 4.3 📁 FLYTT til `reference/`

Levende oppslagsverk som fortsatt har verdi:

| Fil | Begrunnelse |
|---|---|
| `api-route-inventory.md` | 138 linjer, nyttig oversikt. Bør verifiseres mot 109 faktiske ruter. |
| `match-status-lifecycle.md` | 96 linjer, presis tilstandsmaskin. |
| `design-token-migration-guide.md` | Aktiv designreferanse. |

### 4.4 📦 ARKIVER — `archive/masterplan/`

`TOSOM-MASTERPLAN-v2.0` · `v3.0` · `v4.0` · `v5.0` · `v6.0` · `v7.0` · `v8.0`

7 filer, 7 863 linjer. Innholdet er absorbert i SUPER-MASTERPLAN. Bevares for sporbarhet.

### 4.5 📦 ARKIVER — `archive/act-instruks/`

`TOSOM-ACT-INSTRUKS-v2.0` … `v11.0` (10 filer, 12 075 linjer)
`TOSOM-ACT-FINAL-REPORT.md` · `TOSOM-ACT-v3-FINAL-REPORT.md`

Erstattes av ACT-PIPELINE-v1.0.

### 4.6 📦 ARKIVER — `archive/act-state/`

`ACT-STATE-v3.json` … `ACT-STATE-v11.json` (9 filer)

Kun `ACT-STATE.json` beholdes som levende.

### 4.7 📦 ARKIVER — `archive/handover/`

`ROUND-B-HANDOVER.md` · `ROUND-C-HANDOVER.md` · `ROUND-C-TEXT-HANDOVER.md`

Overleveringer fra fullførte runder.

### 4.8 📦 ARKIVER — enkeltfiler

| Fil | Begrunnelse |
|---|---|
| `TOSOM-PLATTFORMDIAGNOSE-v1.0.md` | Erstattet av v2.0 |
| `SECURITY-STABILITY-PLAN-v1.md` | Erstattet av v2.0 |
| `BETA-GO-NOGO.md` | Erstattet av BETA-ACCESS-PLAN |
| `BETA-READINESS.md` | Samme |
| `matching-observation-v7.md` | Absorbert i MATCHING-TUNING |
| `journey-engine-refactor-plan.md` | Absorbert i MATCHING-TUNING M-5 |
| `tosom-concept-v2-skisse.md` | Absorbert i SUPER-MASTERPLAN |
| `tosom-platform-map.html` | Generert artefakt |

### 4.9 📦 FLYTT hele mapper til `archive/`

| Mappe | Filer | Begrunnelse |
|---|---|---|
| `docs/system/` | 10 | Analyserapporter fra tidligere runder |
| `docs/v2/` | 15 | Admin v2-spesifikasjoner, ikke i aktiv utvikling |
| `docs/audit-drafts/` | 7 | Utkast; konklusjonene er i diagnosen |

### 4.10 🗑️ SLETT — kun én fil

| Fil | Begrunnelse |
|---|---|
| `repo-structure.md` | 3 086 linjer autogenerert filtre. Utdatert i samme øyeblikk som en fil flyttes. `find` gir bedre svar. |

Dette er den **eneste** foreslåtte slettingen. Alt annet arkiveres.

Hvis du vil beholde den også: arkiver i stedet. Ingen innvending.

### 4.11 ✅ URØRT

| Sted | Begrunnelse |
|---|---|
| `docs/core/` (11 filer) | ✅ Verifisert mot SUPER-MASTERPLAN (Q3=a): «9 steg»-feil rettet i 3 filer (DEVELOPMENT_PROTOCOL, MATCHING_OVERVIEW, SUBSYSTEMS_OVERVIEW); 2 avklarte oppgaver lukket (ROADMAP 2.3, MASTER_OVERVIEW p.7). `TOSOM_BLUEPRINT.md` konsolidert med nyere 13-stegs-kopi fra rot. |
| `docs/archive/` | Allerede arkivert. Ikke rør. (Tilføyet: `masterplan/`, `act-instruks/`, `act-state/`, `handover/`, `generated/`, `system/`, `v2/`, `audit-drafts/`.) |

---

## 5. `ACT-STATE.json`

Skal være **eneste** levende tilstandsfil. Etter godkjenning oppdateres den til å reflektere:

- Commit `bc1ef13`
- Testtilstand: 157/157 grønne, 0 typefeil
- Blokkere B-1 … B-4 med status
- Aktiv fase: «Runde 1 — blokkere»
- Peker til SUPER-MASTERPLAN som kanonisk kilde

Format defineres i ACT-PIPELINE §7.

---

## 6. Filer utenfor `docs/`

| Fil | Handling |
|---|---|
| `ai/system_prompt.md` | Behold. Kanonisk for agentatferd. |
| `ai/memory.json` | ✅ **Rettet** (M-8): 9 reelle dimensjoner fra `unifiedScorer.ts:37-47` + `ui_steps: 13`. |
| `ai/init.cline` | Behold. |
| `ai/system_skisse.md` | Vurder arkivering hvis overlappende. |
| `Splinter.md` | Behold. Kanonisk for arbeidsmetode. |
| `tosom-blueprint.md` | ✅ Konsolidert: utdatert `docs/core/TOSOM_BLUEPRINT.md` (9 steg) `git rm`-et; nyere rot-kopi (13 steg, korrigert 08-05) `git mv`-et inn på plassen. Én korrekt blueprint. |
| `tosom-core-definition.md` | ✅ Flyttet → `docs/core/TOSOM_CORE_DEFINITION.md`. |
| `tosom-structure.md` | ✅ Arkivert → `docs/archive/generated/` (autogenerert filtre med urendret `${file_path}`-placeholder — ikke levende referanse). |
| `LAUNCH-CHECKLIST.md`, `POST-LAUNCH-HARDENING.md` | Flytt til `docs/` og samkjør med BETA-ACCESS. |
| `deploy/docker*`, `deploy/systemd.service` | Flytt til `deploy/archive/` — Vercel er eneste mål. |

**`ai/memory.json` er den mest presserende.** Den er feil, og den leses av hver agent ved oppstart.

---

## 7. Gjennomføring

**Gjennomført 2026-08-19**, i denne rekkefølgen (én commit per steg):

| Steg | Handling |
|---|---|
| 1 | Opprett `archive/`-undermapper og `reference/` |
| 2 | `git mv` MASTERPLAN v2–v8 |
| 3 | `git mv` ACT-INSTRUKS v2–v11 + to sluttrapporter |
| 4 | `git mv` ACT-STATE v3–v11 |
| 5 | `git mv` handover-filer |
| 6 | `git mv` enkeltfiler (§4.8) |
| 7 | `git mv` mappene `system/`, `v2/`, `audit-drafts/` |
| 8 | `git mv` de tre til `reference/` |
| 9 | Slett `repo-structure.md` (eller arkiver) |
| 10 | Skriv om `README.md` |
| 11 | Oppdater `ACT-STATE.json` |
| 12 | Rett `ai/memory.json` |
| 13 | Søk etter ødelagte interne lenker |

**Alltid `git mv`, aldri `mv`** — historikken skal følge filen.

Hvert steg er én commit. Lett å reversere.

### Verifisering
```bash
ls docs/*.md | wc -l          # forventet: 8
grep -rn "](.*\.md)" docs/*.md # ingen døde lenker
```

---

## 8. Forventet resultat

| Måling | Før | Etter |
|---|---|---|
| Filer på toppnivå | 50 | **9** |
| Linjer på toppnivå | ~27 000 | ~2 500 |
| Kanoniske systemkilder | uklart | **1** |
| Levende tilstandsfiler | 10 | **1** |
| Ødelagte lenker i README | 2 | **0** |
| Filer slettet | — | **1** |

Alt av verdi bevares. Kun hierarkiet endres.

---

## 9. Beslutninger (avgjort 2026-08-19)

1. **`repo-structure.md`:** SLETT (regenererbart, 3 086 linjer).
2. **Rot-konseptfiler:** tredelt — `tosom-core-definition.md` flyttet → `core/`; `tosom-blueprint.md` konsolidert (nyere 13-stegs-kopi vinner, utdatert core-kopi fjernet); `tosom-structure.md` arkivert → `archive/generated/`.
3. **`docs/core/` verifisering:** Alternativ (a) — kjente «9 steg»-feil rettet nå; full verifisering kan gjøres i Runde 4.

Utført commit-for-commit; se git-log 2026-08-19.
