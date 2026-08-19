# MatchStatus-livssyklus & JourneyPhase-mapping

## 1. Kanonisk MatchStatus (Prisma enum)

```prisma
enum MatchStatus {
  pending    // Opprettet, ikke akseptert
  active     // Aktivt i journey/reise
  matched    // Begge har akseptert → chat åpnet
  expired    // Tidlig utløpt (ikke brukt i dag)
  ended      // Reise fullført
  unmatched  // Avvist/opphevet
}
```

### Status-overganger (verifisert mot koden)

| Fra | Til | Utløser | Fil |
|-----|-----|---------|-----|
| `pending` | `active` | Match opprettet | `app/api/match/route.ts:215` |
| `active` | `matched` | Begge aksepterer | `app/api/cron/journey/route.ts`, `alpha/alphaMonitor.ts` |
| `active` | `ended` | Reise fullført | `app/api/journey/reset/route.ts` |
| `active` | `expired` | Tidsutløp | (ikke implementert i dag) |
| `pending` | `unmatched` | Bruker avslår | (ikke implementert i dag) |

### Merknader

- `"matched"` brukes også som UI-status (uavhengig av DB-enum), f.eks. i `app/api/match/route.ts:54-57`.
- `"pending"` har doble betydninger: både som initial DB-status og som derived UI-status.
- Default-verdi i Prisma er `active` (ikke `pending`) — se `schema.prisma:88`.

### Foreldede verdier

- `expired` — finnes i enum men brukes ikke i koden. Beholdes for fremtidig tidsutløps-logikk.
- `unmatched` — finnes i enum men brukes ikke i koden. `app/api/admin/matches/route.ts` bruker `unmarked` (stavelsesfeil).

---

## 2. JourneyPhase-mapping (konsolidering av 3 kodestier)

### Inkonsistensfunn

Tre steder definerer fase-dager ulikt:

| Kodested | Fil | EARLY | BUILDING_TRUST | DEEPER | CHECKIN |
|----------|-----|-------|----------------|--------|---------|
| **PHASE_CONFIGS** (engine.ts) | `lib/journey/engine.ts:196-215` | 1–14 | 15–21 | **22–30** | *Mangler* |
| **FALLBACK-idx** (today/route) | `app/api/journey/today/route.ts:73-76` | — | — | — | **dag−26** (dvs 26–30) |
| **system_prompt.md** | `ai/system_prompt.md:466-470` | 1–14 | 15–21 | **22–30** | *Reservert* |

**Problem:** `PHASE_CONFIGS` dekker dag 22–30 som DEEPER, men CHECKIN har labels/descriptions og brukes i `getPhaseForDay()` fallback — uten egne dager. Dette gir at CHECKIN **aldri** aktiveres via `PHASE_CONFIGS.find()`.

### Onsdag kanonisk mapping (forslag)

| Fase | Dager | Beskrivelse |
|------|-------|-------------|
| EARLY | 1–14 | Uten bilder, bli kjent |
| BUILDING_TRUST | 15–21 | Bilder tillatt, bygger tillit |
| DEEPER | 22–25 | Dypere samtaler, verdier |
| CHECKIN | 26–30 | Refleksjon og oppsummering |

### DeepProfileStep (enum → UI-mapping)

```prisma
enum DeepProfileStep {
  IDENTITY         // 1 av 9 UI-steg
  LIFE_SITUATION   // 2
  LIFESTYLE        // 3
  PERSONALITY      // 4
  RELATIONSHIP_STYLE // 5
  COMMUNICATION    // 6
  INTIMACY         // 7
  FUTURE_VISION    // 8
  BOUNDARIES       // 9
  SUMMARY          // — (kun i enum, ikke brukt i UI)
}
```

`SUMMARY` finnes kun i Prisma-enum. UI har 9 steg (1–9), `SUMMARY` er verdiløs uten tilknytning til onboarding.

---

## 3. MatchInsight-modellen (foreldreløs)

Etter Bølge 2 er `MatchInsight`-modellen foreldreløs:
- Ingen ruter skriver til den lenger
- Prisma-schemaet og `admin/data.ts` refererer fortsatt til den
- **Ingen migrering utført** per beslutning 4
- Forslag: Slett ved neste DB-migrering

---

## 4. Åpne spørsmål før kodeendring

1. Skal CHECKIN aktiveres som reell 4. fase (dag 26–30)? Krever endring i `PHASE_CONFIGS` + `today/route.ts`.
2. Skal `SUMMARY` fjernes fra DeepProfileStep-enum? Kun doc-endring, ingen migrering.
3. Skal `unmarked` rettes til `unmatched` i `app/api/admin/matches/route.ts`? Enkelt fix, lav risiko.