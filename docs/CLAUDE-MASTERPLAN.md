# TOSOM — CLAUDE-MASTERPLAN

**Dato:** 2026-09-03
**Commit:** `47e5d11`
**Status:** Lanseringsvurdering. **Ikke kanonisk.**
**Forgjenger:** [`TOSOM-MASTERPLAN-v3.0.md`](TOSOM-MASTERPLAN-v3.0.md) (28.08, score 86)
**Kanonisk kilde er fortsatt** [`TOSOM-SUPER-MASTERPLAN-v2.0.md`](TOSOM-SUPER-MASTERPLAN-v2.0.md)
**Følgedokumenter:** [`AUDIT-PLAN.md`](AUDIT-PLAN.md) · [`ACT-PIPELINE-v1.0.md`](ACT-PIPELINE-v1.0.md) §16

> Måler hva Tosom **er** per 03.09.2026, mot koden.
> Ved motstrid gjelder koden, deretter SUPER-MASTERPLAN.

**Metode:** Verifisert mot kildekoden — ikke mot andre dokumenter. 114 API-ruter,
120 lib-moduler, 52 sider, 351 komponenter, 49 testsuiter, middleware, cron og
CI/CD lest. Alle helsetall målt lokalt, ikke sitert.

---

## 0. Sammendrag

| Mål | Score | Vurdering |
|---|---|---|
| **Beta-klarhet** (50 testere) | **88 / 100** | 🟢 **GO** — etter tre rettinger |
| **Lanseringsklarhet** (offentlig) | **77 / 100** | 🔴 **NO-GO** — Vipps og juridisk signatur mangler |

**Utviklingslinje:** 72 → 78 → 86 → **88**

Bare to poeng siden 28.08 — men tallet skjuler to motsatte bevegelser.
Infrastrukturen tok et stort steg (R2 i drift, CSRF aktivert og verifisert,
Sentry koblet, uptime-overvåking, gated CD, privat chat-kanal, +49 tester).
Samtidig avdekket systemauditen 03.09 ti funn som ingen tidligere vurdering
hadde målt — tre av dem alvorlige.

**Ærlig note:** v3.0 målte 86 uten å måle sikkerhetsdybde eller testblindsoner.
Forskjellen mellom 86 og 88 er derfor ikke bare ny kode. Den er også ny innsikt
om hva som allerede lå der.

Det som gjenstår før beta er lite og konkret. Det som gjenstår før lansering er
i hovedsak utenfor vår kontroll.

---

# DEL I — SYSTEMET

## 1. Konseptet

Tosom fjerner valg framfor å tilby dem. Ingen feed, ingen swipe, ingen bilder i
matching, ingen gamification. Brukeren velger kun **om** hun vil delta — aldri
**hvem**.

> Én match. Én reise. Én relasjon.

Fjorten invarianter holder gjennom hele kodebasen, håndhevet av syv CI-vakter
som feiler bygget ved brudd. Det finnes ingen bryter i `config/features.ts` som
kan slå på noe av det forbudte.

Den sterkeste av dem er I-13: når et par sier «vi fant hverandre», slettes begge
kontoene. Produktet avslutter kundeforholdet ved suksess. Det er uvanlig, og det
er hele troverdigheten.

## 2. Hovedløkken

```
Onboarding (13 steg) → onboardingComplete
   ↓
Kø → claimFreeQuota() → journeyState: QUEUED
   ↓
Matcherunde (natt til lørdag) — advisory lock, kill switch, tidsbudsjett 50 s
   ├─ 6 dimensjoner + 11 dealbreakere, bidireksjonelle
   ├─ Grådig kobling: høyest score først, hver bruker kun én gang
   └─ Match + Conversation + JourneyProgress + Notification × 2
   ↓
Reise-cron (hver time) — advisory lock, batch 300
   ├─ Dag 1–14 Bli kjent · 15–21 Bygger tillit · 22–25 Dypere · 26–30 Refleksjon
   ├─ Dag 15: bildesperren løftes — håndhevet server-side
   └─ Dag 30: reisen avsluttes, bilder slettes, statistikk anonymiseres
```

**Matchevekter** (summerer til 1,00): verdier 0,25 · tilknytning 0,25 ·
personlighet 0,15 · kommunikasjon 0,15 · emosjonsregulering 0,10 ·
livssituasjon 0,10. Terskel 40, kohortminimum 2.

## 3. Endret siden v3.0 (28.08 → 03.09)

| Område | Endring |
|---|---|
| Lagring | R2 aktiv i produksjon — bilder overlever deploy |
| Sikkerhet | CSRF aktivert og verifisert live (403 uten token) |
| Sanntid | Chat flyttet til privat Pusher-kanal med deltakersjekk |
| Ruting | Matchede brukere sendes til dashbordet, ikke venterommet |
| Observability | Sentry koblet med PII-skrubbing; uptime-overvåking verifisert |
| Leveranse | CD verifisert grønn med team-scoped token |
| Test | 366 → 415 tester |

---

# DEL II — TEKNISK TILSTAND

## 4. Helse (målt 03.09)

```
verify:lang     grønn (1014 filer)
tsc --noEmit    0 feil
jest            415/416 (49 suiter, 1 skippet)
CI-vakter       7/7 grønne
```

Alle tall er kjørt, ikke sitert fra tidligere dokumenter.

## 5. Det som er solid

| Område | Hvorfor det holder |
|---|---|
| Én scoring-motor | Både API og cron bruker samme kilde — ingen drift mellom dem |
| Én fasekilde | Dashbord, chat og cron leser samme motor; egne grenser ble fjernet |
| Samtidighet | Advisory locks, atomisk kvote-claim, delt rate limiting i databasen |
| Kvote | Race-fri grense med tilbakeføring når noe feiler etter claim |
| Bildesperre | Håndhevet server-side før opplasting, ikke bare skjult i grensesnittet |
| Sletting | Rydder også objektlagring — ikke bare databaserader |
| Kill switches | Vedlikehold, matching, registrering styres uten deploy |
| Personvern | Sentry mottar aldri profil-, meldings- eller kontaktdata |


---

# DEL III — SCORE-OPPBYGGING

## 6. Beta-klarhet: 88 / 100

| Område | Maks | Score | Begrunnelse |
|---|---|---|---|
| Produkt og konsept | 15 | **15** | Fjorten invarianter holder, håndhevet av CI. Konseptet er uten etterslep |
| Arkitektur | 15 | **13** | Én motor per domene, ryddig lagdeling. −2: standardwrapperen brukes av null ruter |
| Sikkerhet | 20 | **15** | Solid grunnmur. −5: tre høye funn åpne (admin-signatur, PII i logg, villedende invitasjonsflagg) |
| Drift | 15 | **13** | Overvåking, varsling, kill switches, gated CD. −2: migrasjoner mot produksjon er manuelle |
| UX | 15 | **14** | Flyten er logisk, friksjonen bevisst. −1: 13 onboarding-steg er reell frafallsrisiko |
| Test | 10 | **8** | 415 tester, E2E i CI. −2: blindsonene auditen fant er ikke dekket |
| Juridisk | 10 | **10** | Vilkår og trygghetsside er ærlige om beta. DPA og DPIA er klare |
| **Sum** | **100** | **88** | |

## 7. Lanseringsklarhet: 77 / 100

Samme grunnlag, men målt mot en offentlig lansering med betaling.

| Område | Maks | Score | Begrunnelse |
|---|---|---|---|
| Produkt og konsept | 15 | **15** | Uendret — konseptet er lanseringsklart |
| Arkitektur | 15 | **12** | −3: kø-tak og fortsettelses-cron er ikke prøvd over ~50 000 brukere |
| Sikkerhet | 20 | **15** | Samme tre funn. Vekten er lik, men innsatsen er høyere |
| Drift | 15 | **11** | −4: ingen kostnadsplan for betalte tjenestenivåer, manuelle migrasjoner |
| UX | 15 | **14** | Uendret |
| Test | 10 | **8** | Uendret |
| Betaling og identitet | 10 | **2** | −8: Vipps mangler. Aldersverifisering er selvrapportert |
| **Sum** | **100** | **77** | |

**Merk:** juridisk er byttet ut med betaling og identitet i lanseringsmålingen —
DPA og DPIA må være signert, ikke bare skrevet, og signaturen er ikke vår å gi.

## 8. Korreksjoner til auditrapporten 03.09

Videre lesing endret to funn. Koden vinner — også over min egen rapport.

| Funn | Opprinnelig | Korrigert | Hvorfor |
|---|---|---|---|
| 3 — fri auto-registrering | Høy | **Lav** | Den åpne døren er en dokumentert beslutning i `BETA-TEST-v1.0.md` §3, ikke et hull. Det reelle problemet er at invitasjonsflagget antyder en port som ikke håndheves — villedende kode, ikke åpen dør |
| 3b — aldersløftet | Uinnfridd | **Delvis lukket** | Aldersgrensen valideres reelt i onboarding, og både vilkår og trygghetsside er allerede rettet til ærlig tekst om selvrapportering |

**Nytt funn (11):** vilkårene §6 sier «Du oppretter konto med Vipps», mens beta
bruker e-post og passord. Trygghetssiden er korrekt oppdatert; vilkårene henger
etter. Lav risiko, men det er en løftefeil i et juridisk dokument.


---

# DEL IV — DET VI KAN FIKSE NÅ

Alt her er innenfor vår kontroll. Ingenting venter på leverandører.

## 9. Prioritert — med poengeffekt

| # | Sak | Innsats | Effekt | Blokkerer beta? |
|---|---|---|---|---|
| 1 | Admin-signatur verifiseres i de to rutene som mangler det | Liten | +3 | 🔴 Ja |
| 2 | Fjern token, kode og kontaktdata fra logglinjer | Liten | +2 | 🔴 Ja |
| 3 | Rett vilkårenes §6 om innlogging | Liten | +1 | 🟠 Bør |
| 4 | Tre nye tester: admin-signatur, CSRF-dekning, helse-overflate | Middels | +2 | 🟠 Bør |
| 5 | Reduser helse-endepunktets offentlige svar | Liten | +1 | 🟠 Bør |
| 6 | Gjør varselkanalen privat | Middels | +1 | Nei |
| 7 | Automatiser migrasjoner mot produksjon | Middels | +2 | Nei |
| 8 | Avklar invitasjonsflagget — håndhev eller fjern | Liten | +1 | Nei |
| 9 | Lukk deploy-porten for manuell kjøring | Liten | +1 | Nei |
| 10 | Stram sikkerhetspolicyen, fjern dev-domener | Liten | +1 | Nei |
| 11 | Fjern død chat-komponent og foreldet refleksjonsrute | Liten | +1 | Nei |

**Sum tilgjengelig: +16.** Alt utført gir beta-klarhet omkring 96 og
lanseringsklarhet omkring 87. Resten krever Vipps, aldersverifisering og
signaturer.

## 10. Rekkefølge

**Først, før testere:** 1 → 2 → 3. Tre små patcher, én fil hver.

**Deretter, under beta:** 4 → 5 → 7. Testene lukker blindsonene. Migrasjonene er
den mest sannsynlige kilden til neste produksjonsutfall.

**Etter beta:** 6 → 8 → 9 → 10 → 11. Ingen av dem haster, alle er billige.

---

# DEL V — FØR 50 TESTERE

| # | Sak | Ansvar | Blokkerer? |
|---|---|---|---|
| 1 | Admin-signatur og logglekkasje rettet | Qwen | 🔴 Ja |
| 2 | SPF og DKIM verifisert for domenet | George | 🔴 Ja |
| 3 | Testbrukerne slettet fra produksjon | George | 🔴 Ja |
| 4 | Admin-hemmeligheter satt i miljøet | George | 🔴 Ja |
| 5 | Vilkårenes §6 rettet | Qwen | 🟠 Bør |
| 6 | Live chat-test i to nettlesere etter siste deploy | George | 🟠 Bør |

Punkt 2–4 sto allerede i `GEORGE.md`. Auditen la til punkt 1 og 5.

---

# DEL VI — FØR LANSERING

| # | Sak | Utenfor vår kontroll? |
|---|---|---|
| 1 | Vipps Login og betaling | Delvis — krever avtale |
| 2 | Reell aldersverifisering | Ja — følger Vipps |
| 3 | DPA og DPIA signert | Ja — krever advokat |
| 4 | Fortsettelses-cron og hevet kø-tak | Nei |
| 5 | Tetthetsbasert radius | Nei |
| 6 | Kostnadsplan for betalte tjenestenivåer | Nei |

---

# DEL VII — OBSERVASJON UNDER BETA

| Hva | Hvorfor |
|---|---|
| Avvisningsgrunner for kjønn og alder | Høye tall betyr filterfeil, ikke normalt |
| Køalder | Over 14 dager: noen venter for lenge |
| Reiser som venter på fremrykk | Null er friskt, hundre betyr at cron står |
| Frafall i onboarding | Mister vi folk i de 13 stegene? |
| Matcherundens varighet | Under 30 sekunder er grønt |
| Andel som oppdager matchen selv | Dette er I-4-dataen. Den kan ikke hentes inn igjen senere |

**Juster ingenting** (DI-2). Et tall som ser rart ut er data, ikke en hendelse.

---

# DEL VIII — KONKLUSJON

Tosom er teknisk klar for mennesker. Kjernen — matching, reise, chat, sletting —
er bygget med en presisjon som er uvanlig før første beta. Race conditions er
ekte transaksjoner. Bildesperren er håndhevet, ikke lovt. Invariantene er vaktet
av CI, ikke av god vilje.

Det som skiller 88 fra 96 er ikke arkitektur. Det er elleve små saker, hvorav
tre bør gjøres denne uken.

Det som skiller 77 fra lansering er Vipps, en signatur og en aldersverifisering
vi ikke kan skrive selv.

Og det som skiller alt dette fra et ferdig produkt, kan ingen kode fremskynde:
to mennesker som venter, matches, og snakker sammen i tretti dager.

---

*Ikke kanonisk. Ved motstrid: koden først, deretter `TOSOM-SUPER-MASTERPLAN-v2.0.md`.*
