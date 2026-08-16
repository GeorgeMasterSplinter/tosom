# ToSom — Beta-klargjøring (v7)

**Dato:** 2026-08-16
**Commit:** `9300ea2` (utgangspunkt `c93b8cb`)
**V7-resultat:** 12/12 steg fullført, 0 uoppløste stopp, vokterkontroll tom.

---

## Ferdig i v7

| Sak | Steg |
|---|---|
| A13 avvisningslogg teller (ren instrumentering i cron-ruten) | 1.1 |
| Sjekk 9 bevist (teller 0→N ved avvisning, står stille uten) | 1.2 |
| A14 spøkelsesfelter fjernet (warmScore, phaseOrder) | 1.3 |
| A15 betaling sperret, tomt webhook-skall fjernet, deploy/payments.md skrevet | 2.1 |
| A10 cron matching → `0 2` UTC (04:00 norsk sommertid), journey → `0 4` UTC | 2.2 |
| A12 alle 109 ruter kartlagt i docs/api-route-inventory.md (uten sletting) | 3.1 |
| Spredt testpopulasjon (60 brukere, individuell variasjon) og observert runde | 4.1–4.3 |

---

## Gjenstår — menneskeoppgaver med presise kriterier

| # | Oppgave | Ferdig når |
|---|---|---|
| 1 | 144 spørsmål i egen stemme | `scripts/seed-questions.ts` oppdatert, ingen maskinformuleringer igjen |
| 2 | Sentry-DSN | Variabel satt i Vercel, testfeil synlig i Sentry |
| 3 | Ekstern monitor | Registrert etter `deploy/monitoring.md`, alarm utløst ved 503 |
| 4 | Gjenopprettingstest | Kopi gjenopprettet til tom database, RTO målt og skrevet i `deploy/backup.md` |
| 5 | Mobil-QA | Onboarding, chat, dashbord og reise kontrollert på fysisk telefon |

---

## Utsatt med begrunnelse

| Sak | Begrunnelse |
|---|---|
| A3 moodpersistens | Krever database-migrasjon (ny kolonne i `User`). Migrasjon rett før beta er ikke verdt det for en kosmetisk gevinst (mood er en valgfri del av onboarding, ikke en blocker for matching eller betaling). Utsatt til etter beta. |
| A4 PDF-eksport | Krever enten nytt bibliotek (`pdfkit` eller lignende) eller ny API-rute — begge er absolutte stop-regler i v7 (stop-regler #9 og #10). Må planlegges som egen aktivitet. |

---

## V6-funn som v7 bekreftet eller rettet

| V6-funn | V7-tilstand |
|---|---|
| A13: `rejectReasons` kastes bort (cron leser bare `hasDealbreaker`) | **Rettet** — instrumentering i 1.1, 1442 avvisninger synlige i runde 4.2 |
| A14: spøkelsesfelter (warmScore, phaseOrder) i klient | **Rettet** — fjernet fra profile/page.tsx |
| A15: Stripe-variabler uten Stripe-integrasjon | **Rettet** — PAYMENTS_ENABLED sperret, tomt webhook-skall fjernet |
| A10: cron matching 05:00, journey 07:00 (ikke dokumentert) | **Rettet** — `0 2` / `0 4` UTC, dokumentert i monitoring.md |
| A12: 109 ruter ukartlagt | **Rettet** — full inventar, ingen sletting |
| Radius: `distancePref` i deepProfileData, ikke toppnivå | **Dokumentert** — data-mapping-mangel i cron-ruten, ikke motorsjekk. Radius-telleren står strukturelt på 0 i levende runde. |
| MODERATE dominerer (19/27 = 70 %) | **Åpent spørsmål** — se §6 i `docs/matching-observation-v7.md` |