# ToSom — Dokumentasjon

Dette er dokumentasjonsindeksen for ToSom-plattformen. Alle referanser peker på filer som finnes i repoet per 2026-08-13.

---

## Hoveddokumenter

| Dokument | Stikkord |
|----------|----------|
| **[TOSOM-MASTERPLAN-v2.0.md](TOSOM-MASTERPLAN-v2.0.md)** | **KANONISK masterplan** — systemforklaring, tilstand, skalering, sikkerhet, roadmap |
| **[TOSOM-ACT-INSTRUKS-v3.0.md](TOSOM-ACT-INSTRUKS-v3.0.md)** | **AKTIV ACT-instruks** — 30 steg i 7 bølger, Launch Edition |
| [TOSOM-PLATTFORMDIAGNOSE-v1.0.md](TOSOM-PLATTFORMDIAGNOSE-v1.0.md) | Full plattformdiagnose (underlag for v2.0) |
| [TOSOM-ACT-FINAL-REPORT.md](TOSOM-ACT-FINAL-REPORT.md) | Sluttrapport ACT v2.0 — se v2.0 §2 for korrigert tilstandsvurdering |
| [TOSOM-ACT-INSTRUKS-v2.0.md](TOSOM-ACT-INSTRUKS-v2.0.md) | ⬇️ Fullført — erstattet av v3.0 |
| [repo-structure.md](repo-structure.md) | Komplett filstruktur med beskrivelser |
| [SECURITY-STABILITY-PLAN-v1.md](SECURITY-STABILITY-PLAN-v1.md) | Sikkerhets- og stabilitetsplan (v1.0, delvis foreldet) |
| [match-status-lifecycle.md](match-status-lifecycle.md) | MatchStatus-livssyklus + CHECKIN-fase |
| [design-token-migration-guide.md](design-token-migration-guide.md) | Design-token-system og migreringsveiledning |
| [journey-engine-refactor-plan.md](journey-engine-refactor-plan.md) | Journey Engine refaktorering |
| [tosom-concept-v2-skisse.md](tosom-concept-v2-skisse.md) | Platform-konsept og Vipps-betaling |
| [tosom-masterplan-v4.md](tosom-masterplan-v4.md) | ⬇️ Erstattet av v2.0 — historisk referanse |
| [tosom-platform-map.html](tosom-platform-map.html) | Visuell plattformkartlegging |

---

## Gjeldende beslutninger (13.08.2026)

| Område | Beslutning |
|--------|------------|
| Betaling | **Vipps only** — Stripe fjernes. `PAYMENT-STRATEGY-DECISION.md` er opphevet |
| Lansering | **Gratis** — premium utsettes til v2.1/v3.0 |
| Skalering | **300k = 12–24 mnd mål** — arkitektur forberedes nå |

---

## Aktivt arbeid

**Instruks:** `TOSOM-ACT-INSTRUKS-v3.0.md` — 30 steg i 7 bølger.
**Tilstandsfil:** `docs/ACT-STATE-v3.json` (opprettes i steg 0.1).
**Sperre:** Bølge 1 (gjenoppliv cron) må fullføres og verifiseres før bølge 2 startes.

Nytt i v3.0: hvert steg krever et **funksjonelt ferdigkriterium** (verifisert DB-tilstand eller HTTP-respons) i tillegg til tsc/grep/build. Grønn kompilering alene er ikke bevis på at noe virker.

---

## Undermapper

| Mappe | Innhold |
|-------|---------|
| [`archive/`](archive/) | Arkiverte og utdaterte dokumenter |
| [`core/`](core/) | Kernedokumentasjon (master overview, architecture) |
| [`system/`](system/) | Systemrapporter og auto-genererte filer |
| [`v2/`](v2/) | Versjon 2 planer |

---

## Arkiv

Utdaterte rapporter som er flyttet hit:

| Fil | Original dato | Årsak |
|-----|---------------|-------|
| [MOTION_21_REPORT.md](archive/MOTION_21_REPORT.md) | 2026-06-20 | Pre-launch analyse |
| [TOSOM_DUPLICATE_ANALYSIS_REPORT.md](archive/TOSOM_DUPLICATE_ANALYSIS_REPORT.md) | 2026-06-24 | Superseded av ny analyse |
| [TOSOM_READINESS_REPORT.md](archive/TOSOM_READINESS_REPORT.md) | august 2026 | Utdatert etter roadmap-arbeid |
| [security-stability-plan-v1.md](archive/security-stability-plan-v1.md) | 2026-08-05 | Case-kollisjon løst (kortere versjon) |

**Til arkivering i steg 5.1:** `PAYMENT-STRATEGY-DECISION.md` (opphevet — Vipps only), `tosom-masterplan-v4.md` (erstattet av v2.0).

---

## Dokumentasjonsregler

1. **Alltid oppdater** når en subsystem endres vesentlig
2. **Aldri slett** uten godkjenning — flytt til `archive/` i stedet
3. **Skriv i bokmål** — aldri nynorsk eller svensk
4. **Én kilde for sannhet** — ingen duplikater av samme dokument
5. **Verifiser mot kode** — dokumentasjon som motsier kildekoden er en feil

---

*Sist oppdatert: 2026-08-13 (TOSOM-ACT-INSTRUKS-v3.0)*
