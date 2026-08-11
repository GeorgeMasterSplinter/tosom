# ToSom v2 — Dokumentasjonssenter

**Versjon:** 2.0 · **Dato:** 11. august 2026  
**Status:** Produsert av Cline i PLAN-sesjon, godkjent av George  
**Formål:** Permanent referanse for ToSom-plattformen v1.5 → v2.0 evolusjon

---

## Om denne mappa

Alle dokumenter i `docs/v2/` er skrevet som **evolusjon**, ikke revolusjon.  
Ingen dokument foreslår rewrite av fungerende systemer. Alle forslag er modulære, inkrementelle og kompatible med Qwen 3.6 27B i ACT-mode.

---

## Dokumentoversikt

| # | Fil | Formål |
|---|-----|--------|
| 0 | `00-README.md` | Dette dokumentet — innpass og navigasjon |
| 1 | `01-ADMIN-V2-DESIGN-SPEC.md` | Admin v2 design-specifikasjon (layout, navigasjon, UI-system) |
| 2 | `02-ADMIN-V2-FEATURES-SPEC.md` | Admin v2 funksjonsspesifikasjon (analytics, observability, moderation, match/journey insights) |
| 3 | `03-UI-SYSTEM-MANUAL.md` | ToSom UI-system manual v2 (tokens, spacing, typografi, farger) |
| 4 | `04-BRAND-MANUAL.md` | ToSom brand manual v2 (identitet, filosofi, visuell språkbruk) |
| 5 | `05-COMPONENT-LIBRARY-SPEC.md` | Komponentbibliotek-spec v2 (knapper, kort, inputs, modaler, etc.) |
| 6 | `06-LAYOUT-SYSTEM-SPEC.md` | Layout-system-spec v2 (grid, responsivitet, sider) |
| 7 | `07-MATCHING-V2-REFINEMENT.md` | Matching v2 forbedringsplan (vekter, resonans, admin-insights) |
| 8 | `08-JOURNEY-V2-REFINEMENT.md` | Journey v2 forbedringsplan (tekst, faser, opplevelse) |
| 9 | `09-PAGE-IMPROVEMENTS.md` | Forbedringsliste for eksisterende bruker-sider |
| 10 | `10-ARCHITECTURE.md` | Arkitekturoversikt v2 (systemmap, fløater, avhengigheter) |
| 11 | `11-DEPLOY-V2.md` | Deploy-dokumentasjon v2 (produksjon, backup, monitorering) |
| 12 | `12-ROADMAP-V2.md` | Full roadmap v2 med faser, prioritering og ACT-instruks |

---

## Arbeidsmetode

Hvert dokument følger samme struktur:
1. **Nåtilstand** — hva som eksisterer i dag (basert på kodeanalyse)
2. **Måltilstand** — hvordan det skal se ut etter v2-evolusjon
3. **Endringsplan** — konkrete, inkrementelle steg
4. **Filer involvert** — nøyaktige filstier
5. **Qwen-AKT-instruks** — klare instruksjoner for ACT-utførelse

---

## Viktige prinsipper

- **Evolusjon, ikke revolusjon** — alt som fungerer beholdes
- **Modulære endringer** — hvert steg er uavhengig og reversibelt
- **ToSom-filosofi** — ro, varme, modenhet, trygghet, enkelhet, konsistens
- **Ingen AI-chat/feed/swipe** — aldri
- **Bokmål** — all brukertilrettet tekst
- **Qwen 3.6 27B kompatibel** — alle forslag er realistiske å implementere

---

## Forutsetninger

Før lesing av v2-dokumentene, les følgende eksisterende dokumenter:
- `ai/system_prompt.md` — systemidentitet og regler
- `ai/memory.json` — systemstate og konfigurasjon
- `ai/system_skisse.md` — platformskisse (masterdokument)
- `docs/tosom-masterplan-v4.md` — masterplan (alle 7 faser fullført)

---

*Slutt på README. Begynn med dokument 01.*