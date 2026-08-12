# MatchStatus-livssyklus

## Kanonisk status-definisjon (Prisma enum)

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

## Livssyklus-diagram

```
                          ┌──────────┐
                          │ pending   │
                          │ (default) │
                          └─────┬─────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
          accept:   │    timeout│     reject│
          "active"  ▼           │     "unmatched"
                   ┌──────┐     ▼          │
                   │active│  expired       │
                   └──┬───┘               ▼
                      │              ┌──────────┐
            both accept│             │unmatched  │
              "matched"▼             │(avvist)   │
                   ┌────────┐        └──────────┘
                   │matched │
                   └──┬─────┘
                      │
         journey completed│
           "ended" ▼
                 ┌───────┐
                 │ ended │
                 │(ferdig)│
                 └───────┘
```

## Status-overganger (verifisert mot koden)

| Fra | Til | Utløser | Fil |
|-----|-----|---------|-----|
| `pending` | `active` | Match opprettet | `app/api/match/route.ts:215` |
| `active` | `matched` | Begge aksepterer | `app/api/cron/journey/route.ts`, `alpha/alphaMonitor.ts` |
| `active` | `ended` | Reise fullført | `app/api/journey/reset/route.ts` |
| `active` | `expired` | Tidsutløp | (ikke implementert i dag) |
| `pending` | `unmatched` | Bruker avslår | (ikke implementert i dag) |

## Merknader

- `"matched"` brukes også som UI-status (uavhengig av DB-enums), f.eks. i `app/api/match/route.ts:54-57` der det beregnes fra `matches.some(m => m.status === "matched")`.
- `"pending"` har doble betydninger: både som initial DB-status og som derived UI-status (`"no_match" | "pending" | "matched"`).
- Default-verdi i Prisma er `active` (ikke `pending`) — se `schema.prisma:88`.

## Bruk per status (grep-verifisert)

| Status | Antall forekomster | Primær bruk |
|--------|-------------------|-------------|
| `active` | ~30 | DB-queries, admin-stats, journey-lås |
| `matched` | ~5 | UI-status i match-check, cron-journey |
| `pending` | ~2 | Validator, initial match |
| `ended` | ~3 | Journey-reset, admin-user-deactivate |
| `expired` | ~0 | Ikke brukt i dag |
| `unmatched` | ~0 | Ikke brukt i dag (kun i validator som `unmarked`) |

## Foreldede verdier

- `expired` — finnes i enum men brukes ikke i koden. Beholdes for fremtidig tidsutløps-løggikk.
- `unmatched` — finnes i enum men brukes ikke i koden. `app/api/admin/matches/route.ts` bruker `unmarked` (stavelsesfeil).

## MatchInsight-modellen

Etter Bølge 2 er `MatchInsight`-modellen foreldreløs (ingen ruter skriver til den lenger, men Prisma-schemaet og admin-data.ts refererer fortsatt til den). Ingen migrering utført per beslutning 4.