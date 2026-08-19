# ToSom — Full Analysis Report (2026-08-02)

Denne rapporten genereres automatisk etter full repo-analyse og dokumentasjons-opprydding.

---

## SAMMENFATTNING

| Kategori | Antall |
|----------|--------|
| **Master-dokumenter opprettet** | 9 |
| **Gamle dokumenter arkivert** | ~145 |
| **Database-modeller** | 26 |
| **API-endepunkter** | ~80 |
| **Komponent-mapper** | 43+ |

---

## OPPRETTETE DOKUMENTER

### /docs/core/ (offisiell dokumentasjon)
1. `TOSOM_MASTER_OVERVIEW.md` — Komplett prosjektoversikt
2. `TOSOM_ARCHITECTURE_MAP.md` — Database, API, komponenter, dataflyt
3. `TOSOM_ROADMAP.md` — Prioriterede oppgaver (Pakke 0-6)
4. `TOSOM_DEVELOPMENT_PROTOCOL.md` — Regler, språk, design, kodekrav
5. `TOSOM_SUBSYSTEMS_OVERVIEW.md` — Alle 9 subsystemer detaljert
6. `TOSOM_API_OVERVIEW.md` — Alle API-endepunkter med request/response
7. `TOSOM_JOURNEY_OVERVIEW.md` — 30-dagers reise systematisk beskrevet
8. `TOSOM_MATCHING_OVERVIEW.md` — Resonans-algoritme, cron-jobb, match-flow
9. `TOSOM_SECURITY_OVERVIEW.md` — Auth, autorisasjon, 2FA, audit-logg

---

## FULLFØRT I DAG (2026-08-02)

### ✅ Deprecated modeller fjerna
| Modell | Status | Referanser i kode |
|--------|--------|-------------------|
| `MatchFeedback` | Fjerna fra schema og User-relasjon | Ingen |
| `MatchHistory` | Fjerna fra schema og Match-relasjon | Ingen |
| `MatchQueue` | Fjerna fra schema og User-relasjon | Ingen |
| `QueueStatus` enum | Fjerna (kun brukt av MatchQueue) | Ingen |

- `prisma generate` suksessfull ✅
- Dokumentasjon oppdatert ✅

---

## IDENTIFISERTE PROBLEMER (prioritert)

### Kritisk 🔴
1. **Legacy `pages/` mappe** — ~80 filer med både App Router og Pages Router samtidig
2. **Blueprint vs Schema-mismatch** — `tosom-blueprint.md` definerer annen Journey-struktur enn schema

### Viktig 🟡
4. **Dobbelte API-ruter** — Flere endepunkter håndterer samme logikk
5. **Journey-validering mangler** — Ingen CHECK constraint på `day` felt (1-30)
6. **Config-filer spredt** — Matching config i både `config/matching.ts` og `lib/config/matching.ts`

### Mindre 🟢
7. **Onboarding step numbering** — Noen referanser til steg 9-10 mens spec sier 9
8. **Manglende Subscription-model** — Payment-system uten dedikert database-modell

---

## NESTE FASE (Pakke 1: Kritisk rydding)

Se `docs/core/TOSOM_ROADMAP.md` for detaljert plan.

Anbefalte første skritt:
1. Rense `pages/` mappen (fjern eller flyt til App Router)
2. Fjerne deprecated database-modeller
3. Oppdatere `tosom-blueprint.md` mot faktisk schema

---

*Generert 2026-08-02 — Versjon 1.0*