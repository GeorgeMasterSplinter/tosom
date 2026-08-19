# BETA — GO/NO-GO (v11)

**Dato:** 17. august 2026
**Commit:** 4431749
**Runder:** v9 (A) → v10 (B) → v11 (C)

## Ferdig gjennom v9, v10 og v11

| Sak | Runde |
|---|---|
| Vilkårssiden tilgjengelig | v9 |
| Venterom med riktig tidspunkt | v9 |
| Angrerettlenke | v9 |
| Aldersgrense synlig | v9 |
| Én footer med juridiske lenker | v9 |
| Én kortkomponent, tokens, hover i CSS | v10 |
| Fade-in på logo og signatur | v10 |
| Syv matchingsteder rettet | v11 |
| Pris og gratis tilgang | v11 |
| Ordensregler i vilkårene | v11 |
| Angrerett tilpasset ukeskadens | v11 |
| Rapportvarsling | v11 |

## Gjenstår før beta — kun menneskeoppgaver

| # | Oppgave | Ferdig når |
|---|---|---|
| 1 | 144 spørsmål i egen stemme | `scripts/seed-questions.ts` oppdatert |
| 2 | Sentry-DSN | Testfeil synlig i Sentry |
| 3 | Ekstern monitor | Alarm utløst ved 503 |
| 4 | Gjenopprettingstest | RTO målt og dokumentert |
| 5 | Mobil-QA | Alle flater kontrollert på telefon |
| 6 | Juridisk gjennomgang av vilkårene | Jurist har lest |
| 7 | Organisasjonsnummer | ToSom AS registrert, nummer satt inn |

## Senere runder

- Vipps innlogging og betaling
- Rapporter i admin-panelet
- A3 moodpersistens, A4 PDF
- Skalering målt ved 500 i kø

## Verifikasjon (17. aug 2026)

```
npx tsc --noEmit                    → exit 0
npx prisma format --check           → All files formatted correctly
npx jest                            → 157 passed, 157 total (16 suites)
npm run build                       → exit 0
npm run verify:api                  → ✓ Alle API-kall matcher
npm run verify:lang                 → ✓ Ingen nynorsk-treff
git diff a8c70b7..HEAD -- lib/matching/ lib/journey/ prisma/ config/matching.ts → tom
grep "Match innen 24 timer"         → 0
grep "én gang i døgnet"             → 0
grep "innen 24 timer" kontakt       → 2 (svartid)
grep "innen 24 timer" personvern    → 1 (svartid)
curl landing: lørdag/uken           → 3
curl landing: 10 000                → 1
curl landing: 23+                   → 1
curl /vilk%C3%A5r (follow)          → 200 (1 redirect)