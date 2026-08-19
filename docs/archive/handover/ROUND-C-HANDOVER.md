# RUNDE C — OVERLEVERINGSBREV

**Fra:** ACT v8 (TOSOM-ACT-INSTRUKS-v8.0.md), basert på TOSOM-MASTERPLAN-v7.0 ved commit `88d5ad8`
**Til:** George + ACT v9
**Opprettet:** 2026-08-16

Dette brevet er produktet av steg 3.3 i ACT v8. Det lister nøyaktig hva som er ferdig i v8, og nøyaktig hvilke steder som må ha **ny ferdigskrevet tekst** før ACT v9 kan kjøre runde C.

Runde C kan ikke utføres av en modell som skal formulere underveis — hver setning ville utløst en beslutning uten mandat. Når teksten er skrevet, lages ACT v9 med den ferdige teksten som noe som settes inn.

---

## 1. Ferdig i v8

| Sak | Steg |
|---|---|
| Tailwind leser konfigurasjonen (v4 `@config`, 5 breakpoints i bygget CSS) | 1.1 |
| Radiussperren virker (`distancePref` utpakkes fra `deepProfileData` i cron-ruten) | 1.2 |
| Radius observert i drift (717 radius-rejections, 20/20 par bilateralt innen radius) | 1.3 |
| Kohortterskel til 2 (`MIN_COHORT_SIZE`) — `MIN_SCORE` står fast på 40 | 2.1 |
| Ukentlig matcherunde (cron `0 2 * * 6`) | 2.2 |
| Utmelding før runden (queue-exit) | 2.3 |
| Venterom uten nedtelling | 3.1 |
| Angrerettlenke | 3.2 |

---

## 2. Til runde C — tekst som må skrives før ACT v9

### 2.1 «24 timer»-lovnelsen (tre forekomster på offentlige flater)

Kjernen i problemet: systemet matcher **ukentlig** (runde B), ikke «innen 24 timer». Alle tre stedene under lover 24 timer og må omskrives til ukentlig realitet.

| # | Sted | Fil:linje | Nåværende tekst |
|---|---|---|---|
| 1 | Landingsside | `app/(landing)/page.tsx:122-123` | «Match innen 24 timer» |
| 2 | Hero | `components/ui/layout/Hero.tsx:46-47` | «Match innen 24 timer» (i `keyPoints`, `label: 'Én match. Kvalitet framfor hvantitet.'`) |
| 3 | Slik fungerer det | `app/slik-fungerer-det/page.tsx:66-67` | «Én match innen 24 timer» |

> **Ekstra forekomst (ikke med i tabellen ovenfor, men samme 24-timers-lovnelse):** `app/onboarding/steps/Step10StartReisen.tsx:49` — «En match innen 24 timer. Ingen swiping, ingen press.» Den bør også vurderes for konsistens med ukentlig kadens.

### 2.2 Prissteder (fem forekomster, 349 kr — betaling er sperret)

Betaling er sperret i produksjon. Prislovnelsen (349 kr / én 30-dagers reise / én match) må være konsistent over disse fem stedene.

| # | Sted | Fil:linje |
|---|---|---|
| 1 | Pris | `app/priser/page.tsx:365` |
| 2 | Pris (landing) | `app/(landing)/page.tsx:299` |
| 3 | Pris (landing, Vipps) | `app/(landing)/page.tsx:346` |
| 4 | Pris (betaling) | `app/betaling/page.tsx:5` |
| 5 | Vilkår (pris + reisebeskrivelse) | `app/vilkår/page.tsx:140` |

### 2.3 Andre tekststeder

| Sted | Fil:linje | Hva som er galt |
|---|---|---|
| Vilkår | `app/vilkår/page.tsx:154` | Skrivefeil «Bildefdeling» |
| Pris (pris-sider, 24-timer) | `app/priser/page.tsx:263` | «Match innen 24 timer» — samme 24-timers-lovnelse som 2.1 |

---

## 3. Til runde C — funksjonalitet

- Rapporteringsfunksjon (finnes ikke i dag)
- Beskjed når ingen match finnes
- Vilkår med ordensregler (George + jurist)
- Personvern mot GDPR

---

## 4. Menneskeoppgaver, uendret

- 144 spørsmål (Georges skrivejobb)
- Sentry-DSN
- Ekstern monitor
- Gjenopprettingstest
- Visuell kontroll i tre bredder (390 px, 820 px, 1440 px)

---

## 5. Deferret (ikke runde C)

- A3 moodpersistens — krever migrasjon
- A4 PDF — krever nytt bibliotek eller ny rute
- Vipps-integrasjon — venter på nøkkel

---

*Overleveringsbrev generert i steg 3.3 av ACT v8. Alle fil:linje-ankre er verifisert mot koden ved commit `88d5ad8`.*