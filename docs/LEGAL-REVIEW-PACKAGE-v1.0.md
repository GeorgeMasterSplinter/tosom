# ToSom — Legal Review Package (v1.0) — Pre-Limited Free Beta

- **Dato:** 26.10.2026
- **Dataansvarlig (controller):** Tosom AS, org.nr 938 413 231, Henrik Ibsens gate 90, 0255 Oslo
- **Kontaktperson:** George · support@tosom.no · tlf 92 64 22 23
- **Mål:** Konsolidert sak til advokaten for LIMITED FREE BETA (invitasjonsbasert, betalinger AV).
- **Bestående juridiske docs (ikke duplisert her):** `docs/JURIDISK-GRUNNLAG-v1.0.md` (spørsmål A‑1…A‑7), `/vilkar` + `/personvern` (begge v2026‑10‑15), `/samtykke` (uttrykkelig art. 9-samtykke).

**Kontekst:** Beta er GRATIS; betalinger er AV (`PAYMENTS_ENABLED=false`). De betalingsrelaterte spørsmålene A‑1/A‑4/A‑5/A‑6/A‑7 i JURIDISK-GRUNNLAG er derfor **deferred** (må avklares før betaling aktiveres, ikke før beta). De to kritiske for beta er **A‑2 (art. 9 – særlige kategorier)** og **A‑3 (art. 22 – automatisert avgjørelse)** — disse tas opp igjen i §5.

---

## 1. Produktet (kort)

- ToSom er en app for 21+ som bygger en gradvis, **14-dagers «reise»** mellom to personer: matching natt til lørdag → 7-dagers startvindu → **dag 8 foto-avsløring** → **dag 14 fullføring**.
- **Ingen AI-scoring**; deterministisk matching med 10 hard dealbreakers + scoring (`MIN_SCORE 40`, `MIN_COHORT 2`).
- Gratis: 5 000 reiser (free quota), deretter betaling (IKKE aktivert).
- Beta nå: **kun inviterte brukere** (invite gate), ingen public, ingen betaling, ingen web-analytics.

## 2. Datastrømmer (hva + hvor + sensitivitet)

| Kategori | Samlet ved | Lagret | Sensitivitet (GDPR) |
|---|---|---|---|
| Identitet/auth | Registrering | DB (e-post, passord-hash) | Normal |
| Profil | Onboarding | DB (alder, kjønn, **GPS lat/lon**, livsstil, barn, dealbreakers) | **GPS = personvern** (minimering) |
| **Religion / livssyn** | Onboarding (select + slider + «åpen for») | DB | **SÆRLIG KATEGORI (art. 9)** |
| Personlighet v2 | Onboarding (`2026-10-24.v2`, DeepProfile) | DB | Normal (men dypt personlig) |
| Foto | Chat (fra dag 8) | **Cloudflare R2** (signert URL) | Normal (se Q3 om ansikt/biometri) |
| Chats | Chat (tekst + bilder) | DB + R2 | Normal (kan inneholde krenkelser) |
| Reise | Progress + match | DB (day, fase, score) | Normal |
| Samtykke | `/samtykke` | DB (`termsVersion`, art. 9-samtykke) | Dokumentasjon |
| Kvote | Bruk | DB (`Quota`) | Normal |
| Feler/logs | Server | **Sentry** (PII-scrubbed, `sendDefaultPii:false`) | Skrubbed |

**Hvor data flyter:** Browser → Vercel (Next.js API + cron) → Managed Postgres (DB) + Cloudflare R2 (bilder) + Pusher (realtime-chat) + Resend (e-post) + Sentry (feil). Alt via `DATABASE_URL`/env i Vercel.

## 3. Processors (subbehandlere)

| Processor | Tjeneste | Data | DPA? | SCC (EU→utland)? | Region |
|---|---|---|---|---|---|
| Vercel | Hosting/serverless (Next.js, cron) | Alt (flaten) | ? | ? | (avklare) |
| Managed Postgres (leverandør å bekrefte: Neon/Supabase/RDS/…) | DB | Alt PII | ? | ? | ? |
| Cloudflare R2 | Bilde-lagring | Foto (fra dag 8) | ? | ? | ? |
| Pusher | Realtime-chat | Chat (transient) | ? | ? | ? |
| Resend | E-post | E-postadresse + reise-emails | ? | ? | ? |
| Sentry | Feilmonitorering | Feil-events (PII scrubbed) | ? | ? | US (typisk) — SCC? |

«?» = å verifiseres i Vercel/provider-dashboard. **Ingen er bekreftet som underbehandlere med DPA/SCC på plass ut fra repo** (må bekreftes — se Q4).

## 4. Automatisering

- **Matching:** deterministisk, ingen AI; kjører via cron natt til lørdag (`0 2,3,4 * * 6`). Art. 22-spørsmål (automatisert avgjørelse) — se Q6.
- **Reise-progressjon:** cron daglig (`5 0 * * *`) — flytter `nextDayAt`, fullfører dag 14.
- **Samtykke:** uttrykkelig art. 9-samtykke via `/samtykke` (lagres på `User`).
- **Retensjon:** ved reiseslutt/kontosletting slettes ALT senest 24 timer (verifisert + irreversibelt); **2 anonyme ID-er beholdes for statistikk** (testet i `privacy-retention-s10` / `privacy-anonymize-s10`).
- **PII-scrubbing:** `scrubPiiEvent` fjerner deepProfile/e-post/telefon; `sendDefaultPii:false` (Sentry).

---

## 5. Ti nøkkelspørsmål til advokaten (beta-spesifikke)

> A‑1/A‑4/A‑5/A‑6/A‑7 i `JURIDISK-GRUNNLAG` (betalingsrelaterte) er deferred. Spørsmålene under er dem som gjelder **Limited Free Beta**.

1. **Art. 9 – er samtykket tilstrekkelig? (religion/livssyn)**
   Vi samler religion/livssyn (select + «åpen for» + viktighets-slider) som hard dealbreaker i matching. `/samtykke` innhenter uttrykkelig art. 9-samtykke. **Spørsmål:** Er det uttrykkelige samtykket (art. 9(2)(a)) tilstrekkelig, eller trengs tydeligere oppdeling slik at brukeren kan nekte kun livssyn-delen uten å miste resten av funksjonaliteten? Bør livssyn være valgfritt (nullstillbart) uten at kontoen faller helt ut av matching?

2. **DPIA (art. 35) – kreves før beta?**
   Systematisk overvåking + særlige kategorier (religion/livssyn) + GPS. **Spørsmål:** Kreves en formell DPIA før Limited Free Beta — også for en svært liten (6–10) invitasjonsbasert gruppe? Hvilke minimumsfelt må en ToSom-DPIA dekke?

3. **GPS (nøyaktig lat/lon) – dataminimering (art. 5(1)(c))**
   Vi lagrer nøyaktig GPS og bruker avstand som dealbreaker. **Spørsmål:** Er nøyaktig GPS nødvendig, eller bør vi kun lagre region/avrundet avstand for å redusere identifikasjonsrisiko? Hvem har rett til å se nøyaktig posisjon (kun matchet par)?

4. **Subbehandlere (DPA + SCC) – Sentry, R2, Pusher, Resend, Vercel, DB**
   **Spørsmål:** Hvilke av disse krever underbehandleravtale (DPA) og Standard Contractual Clauses (SCC) pga. overføring til USA/EU-utland (spesielt Sentry + Pusher + R2)? Hva er minimum Tosom AS må ha på plass **før** beta, og hva kan utsettes?

5. **Retensjon + «2 anonyme ID-er for statistikk»**
   Vi sletter ALT innen 24 timer ved reiseslutt/sletting, men beholder 2 anonyme ID-er for statistikk. **Spørsmål:** Er disse ID-ene virkelig ikke-re-identifiserbare (gitt at de kobles til en 14-dagers reisens tidslinje + matching)? Hvilket rettsgrunnlag (berettiget interesse, art. 6(1)(f)) er riktig for denne statistikkbehandlingen?

6. **Art. 22 – automatisert avgjørelse (matching)**
   Matching er fullt automatisert (deterministisk, ingen AI). **Spørsmål:** Regnes en match som en «automatisert avgjørelse» med rettslig eller lignende vesentlig effekt (art. 22)? Trengs «mann i loop» eller motforetellingsrett? Bør matching beskrives som tjeneste vs avgjørelse?

7. **Aldersverifisering (21+) uten dokumentasjon**
   Appen krever 21+ men verifierer ikke alder (ingen ID/BankID — Vipps-identity deferred). **Spørsmål:** Er dette akseptabelt for en privat, invitasjonsbasert beta (George kjenner brukerne), og hva bør tillegges personvernerklæringen (ansvaret for alder ligger hos brukeren)?

8. **Umyndige / aldersmisvisning**
   **Spørsmål:** Hva er Tosoms plikt ved at en umyndig/under-21 har registrert seg med feil alder? Bør vi ha en eksplisitt slette-/varslingsrutine (se safety-runbook C)?

9. **Data subjects rettigheter (art. 15/17/20) – tilgang/sletting/eksport**
   **Spørsmål:** Er slettermekanismen (kontosletting + 24t + 2 anon ID-er) tilstrekkelig for art. 15 (tilgang) og art. 20 (dataportabilitet)? Mangler vi en eksplisitt «eksporter dine data»-funksjon?

10. **Bruksvarsling (art. 33/34) – 72 timer**
    **Spørsmål:** Er prosessen beskrevet i safety-runbook (D: datalekk) tilstrekkelig for 72-timers-varselplikt til Datatilsynet + varsling til berørte? Hvem (George? advokat?) har ansvaret for varselet, og hva bør skrives i personvernerklæringen?

## 6. Hva er ALLEREDE på plass (ikke re-spør)

- `/samtykke` — uttrykkelig art. 9-samtykke (religion/livssyn) innhentes og lagres.
- `/personvern` + `/vilkar` — publisert, versjon v2026-10-15, lagres per bruker (`termsVersion`).
- PII-scrubbing i Sentry + `sendDefaultPii:false`.
- Retensjon: auto-slette 24t + 2 anon ID-er (testet i `privacy-retention-s10`).
- Slettermekanisme (GDPR) + journey-end cleanup.
- `JURIDISK-GRUNNLAG-v1.0.md` — bakgrunn + A-1…A-7 (betalingsrelaterte deferred).
- Aldersgrense 21+ i valideringsskjema + invariant I-14.

## 7. Åpne punkter / alvorlighetsgrad (beta vs utvidelse)

| Punkt | Blokkerer LIMITED beta? | Blokkerer WIDER/paid? |
|---|---|---|
| Q1 Art. 9 samtykke | **Ja (bekrefte)** | Ja |
| Q2 DPIA | Bekrefte (kanskje) | **Ja** |
| Q3 GPS-minimering | Nei (lav, få brukere) | Ja |
| Q4 DPA/SCC subbehandlere | **Ja (Sentry/R2/Pusher)** | Ja |
| Q5 Retensjon/anon ID | Nei (verifisert) | Bekrefte |
| Q6 Art. 22 | Bekrefte | Ja |
| Q7 Aldersverifisering | Nei (kjent beta) | Ja (Vipps ID) |
| Q8 Umyndige | Nei (rutine finnes) | Bekrefte |
| Q9 Data rights/eksport | Bekrefte | Ja |
| Q10 Bruksvarsling 72t | **Ja (rutine + ansvar)** | Ja |

**Samlet:** For LIMITED FREE BETA (6–10 kjente brukere, gratis, ingen public) er de mest kritiske **Q1 (art. 9), Q4 (DPA/SCC), Q10 (bruksvarsling)**. Q2 (DPIA) bør avklares men kan sannsynligvis dokumenteres enkelt for en så liten skala. Resten kan dokumenteres før WIDER/paid.

**Neste steg:** George sender §5 (ti spørsmål) til advokaten med referanse til `JURIDISK-GRUNNLAG-v1.0.md`. Advokaten svarer → oppdater dette dokumentet + personvernerklæringen om nødvendig.