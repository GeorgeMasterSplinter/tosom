# TOSOM — RESTSJEKKLISTE FØR LANSERING

**Dato:** 2026-10-06
**Commit:** `1a450ed` (PL-20 committet 06.10)
**For:** Qwen3.8 27B Q8, Cline og George
**Skrevet av:** Cline (senior fullstack-utvikler og systemagent i ToSom)
**Bygger på:** [`LanseringsCheckList.md`](LanseringsCheckList.md) (fasit, §6) og [`ACT-InstruksPreLunch.md`](ACT-InstruksPreLunch.md) (oppgavene PL-xx)
**Arbeidsmetode:** [`ACT-PIPELINE-v1.0.md`](ACT-PIPELINE-v1.0.md) — gjelder uendret

> Dette er en oversikt over det som **gjenstår**. Den erstatter ingenting:
> sjekklisten (`LanseringsCheckList.md` §6) er fortsatt fasit, og instruksen
> (`ACT-InstruksPreLunch.md`) beskriver hvordan hver oppgave gjøres.
> Når et punkt er ferdig, krysses det av **der** — og her.

---

## 0. Slik leser du denne filen

### 0.1 Tegnforklaring

| Merke | Betyr | Hvem |
|---|---|---|
| 👤 **GEORGE** | Bare du kan gjøre dette: produksjon, Vercel, DNS, advokat, ekte testkontoer, beslutninger. Agentene kan ikke og skal ikke. | George |
| 🤖 **Q** | Qwen kan gjøre dette alene (avgrenset, én fil om gangen, tydelig mønster). | Qwen |
| 🤖 **C** | Cline gjør dette (bred kontekst, sletting, matching, reisen, sikkerhet). | Cline |
| 🔒 | Krever at George sier **«kjør»** før første patch. | Agent venter |
| ⏳ | Venter på noe annet først (står hva). | — |
| 🟥 | **Før lansering** — blokkerer offentlig lansering. | — |
| 🟨 | **Kan utsettes** — men bare med Georges eksplisitte godkjenning. | — |

### 0.2 For George — det korte svaret

**Du har 25 punkter.** De står samlet i **§2 «Georges liste»** med en
forklaring i klartekst for hvert punkt: *hva*, *hvorfor*, *hvordan* og
*hvordan du vet at du er ferdig*. Du trenger ikke lese resten av filen.

De fire viktigste først (de gjør at agentenes ferdige arbeid kan krysses av):

1. 👤 **G-01 — Push til GitHub** → migrasjonen for samtykke deployes automatisk.
2. 👤 **G-02 — Test «Glemt passord» i prod** → e-posten må komme fram.
3. 👤 **G-03 — Sjekk reisedagene i databasen** → før agentene retter K-4.
4. 👤 **G-04 — Roter `DATABASE_URL`** → den ble delt i chat 03.09.

### 0.3 For agentene
- Les §3 og §4. Ta oppgavene i rekkefølgen i §5.
- Alle regler i `ACT-InstruksPreLunch.md` §0 gjelder — **også §0.3: ingen
  adresse skrives noensinne inn noe sted.**
- Et punkt merket 👤 krysses **aldri** av av en agent. Agenten kan skrive
  «*(klar for George · PL-xx)*» når forarbeidet er gjort.

---

## 1. Status 06.10.2026

### 1.1 Helse (målt etter PL-19)
```
npm run verify   → språkvakt grønn (1047 filer) · tsc 0 feil · jest 528 bestått / 1 hoppet over (61/62 suiter)
npx next lint --max-warnings 0   → 0 advarsler
npm audit --omit=dev   → 0 kritiske · 5 høye · 1 moderat (målt etter PL-24)
```

### 1.2 Fremdrift i sjekklisten (§6 i `LanseringsCheckList.md`)

| | Antall |
|---|---|
| Punkter totalt | **70** (68 + 2 nye: religion og bonusfamilie) |
| ✅ Avkrysset | **27** |
| ⬜ Gjenstår | **43** — hvorav **4** er kodeferdige og bare venter på George |

### 1.3 Ferdig siden 05.10 (gjennom 06.10)

| Oppgave | Funn | Hva |
|---|---|---|
| PL-01 | K-1 | Kontosletting virker, med feilmelding og integrasjonstest |
| PL-02 | K-2 | Samtykke + vilkårsaksept (kode ferdig — venter på deploy, G-01) |
| PL-03 | K-8 | Partnerens profilbilde skjult før dag 15 i alle API-svar |
| PL-04 | K-5 | `next` 15.5.27, `next-auth` 5.0.0-beta.32 — ingen kritiske sårbarheter |
| PL-05 | K-6, V-8, V-15 | Rate limit, passordkrav, eksplisitt registrering, labels, ny innloggingsside |
| PL-07 | K-6 | «Glemt passord» (kode ferdig — venter på e-posttest, G-02) |
| PL-08 | K-3 | Påkrevde skalasvar, tilknytning krever data, flat profil = nøytral |
| PL-09 | K-7 | Ærlige tekster (meta, llms.txt, metoder, FAQ, personvern) |
| PL-10 | V-1 | Syntetiske dealbreakere fjernet |
| PL-11 | V-2 | Barn som dealbreaker (kun «Ja» mot kun «Nei») |
| PL-12 | V-3 | Ukjent postnummer avvises, med forslag i nærheten |
| PL-13 | V-4 | «Ikke-binær» som søkevalg, «Kjemisk tiltrekning» forklart |
| **PL-15** | V-5 | Bevis ved rapport/blokkering (90 dager), rapport etter avsluttet match, `pgCheck`-rategrense |
| **PL-16** | V-7 | Google Fonts selvhostet via `next/font` (Inter lokalt) |
| **PL-17** | V-12 | Onboarding-utkast ut av `localStorage` (sessionStorage, per fane) |
| **PL-20** | V-10 | Døde sider: `/design-system` + `/register/vipps` 404 i prod, `onboarding/payment` + `onboarding/access` slettet, `phone/send` + `phone/verify` 404 i prod *(kode ferdig — venter på G-24 curl etter deploy)* |
| **PL-19** | V-9 | Vilkår → angrerettloven § 22 bokstav n + direkte lovdata-lenker; personopplysningsloven; versjonsbump 2026-10-06 |
| **PL-21** | V-10, V-13 | Bloggen avpublisert (404 i prod, innhold beholdes) + dag 30-varsel og milestone-tekst til bokmål |
| **PL-24** | K-5 | `nodemailer` 7 → 10 + skriftlig vurdering av gjenstående sårbarheter |
| **PL-25** | V-11 | API-prefikser i middleware + `api-route-coverage`-test |
| **PL-27** | ny | **Religion: opptil fire valg, ulik tro gir ingen trekk** (se §6) |
| **PL-28** | ny | **«Åpen for bonusfamilie»: pluss når partneren har barn** (se §6) |

### 1.4 Rettelser i sjekklisten 06.10
- «Glemt passord» var krysset av, men e-posten er ikke testet i prod. **Krysset er fjernet** → nå G-02.
- «Innloggingssiden skrevet for lansering» var gjort i PL-05d, men ikke krysset av. **Nå krysset av.**
- To nye punkter i §6.3 (PL-27, PL-28) — begge avkrysset.

---

## 2. 👤 GEORGES LISTE

> **George — dette er din del.** Hvert punkt forklarer hva du gjør, hvorfor,
> og hvordan du vet at du er ferdig. Agentene kan ikke gjøre disse, fordi de
> krever produksjon, kontoer, DNS, advokat eller en beslutning fra deg.
>
> Når et punkt er gjort: kryss av her, og si det til Cline — da krysses det
> også av i `LanseringsCheckList.md` §6.

### 2.1 Gjør først — låser opp agentenes ferdige arbeid

#### 👤 G-01 · Push til GitHub, slik at samtykke-migrasjonen deployes  🟥
- **Hva:** `git push origin main` (lokalt `main` er 10+ commits foran GitHub).
- **Hvorfor:** Samtykke (K-2) er kodeferdig, men databasekolonnen
  `sensitiveConsentAt` finnes ikke i prod før migrasjonen kjører. CD gjør det
  automatisk (`prisma migrate deploy` i `.github/workflows/cd.yml`).
- **⚠️ Viktig:** Bruk `git push origin main` — **ikke** `git push --all` eller
  `--mirror`. Et lokalt Cline-sjekkpunkt (`fb385c0` under `refs/cline/…`)
  inneholder adressen din og skal ikke ut.
- **Ferdig når:** GitHub Actions viser grønn `db-migrate` og `deploy`, og en
  ny testbruker blir sendt til `/samtykke` i prod.
- **Låser opp:** 3 punkter i §6.1 (K-2) og «`prisma migrate status` …» i §6.8.
- [ ] Gjort

#### 👤 G-02 · Test «Glemt passord» i produksjon  🟥
- **Hva:** På www.tosom.no → «Glemt passord?» → skriv inn en e-post du eier og
  har konto på → åpne e-posten → sett nytt passord → logg inn med det.
- **Hvorfor:** Koden er ferdig og testet (PL-07), men vi vet ikke om e-posten
  faktisk kommer fram via Resend.
- **Ferdig når:** E-posten kom (sjekk også søppelpost), lenken virket, og
  innlogging med nytt passord gikk.
- **Låser opp:** «Glemt passord»-punktet i §6.5.
- [ ] Gjort

#### 👤 G-03 · Sjekk reisedagene i prod-databasen (kun lesing)  🟥
- **Hva:** Kjør spørringen i Neon → SQL Editor. Den **leser** bare.
  ```sql
  SELECT "matchId",
         array_agg("day" ORDER BY "userId")            AS dager_per_partner,
         MIN("bothSeenAt")                             AS startet,
         (CURRENT_DATE - MIN("bothSeenAt")::date) + 1  AS forventet_dag
  FROM "JourneyProgress"
  WHERE "endedAt" IS NULL AND "bothSeenAt" IS NOT NULL
  GROUP BY "matchId";
  ```
- **Hvorfor:** Vi mistenker at reisedagen hopper over dager (K-4). Svaret
  forteller hvor alvorlig det er før agentene retter (PL-06).
- **Se etter:** (1) Er begge tallene i `dager_per_partner` like? (2) Er de
  omtrent lik `forventet_dag`? Del resultatet (det inneholder ingen navn) med Cline.
- **Ferdig når:** Resultatet er delt. Ingen aktive reiser? Si det.
- **Låser opp:** «Verifisert i prod-DB at `day` …» i §6.4, og PL-06.
- [ ] Gjort

#### 👤 G-04 · Roter `DATABASE_URL`  🟥
- **Hva:** I Neon: nytt passord for databasebrukeren. Oppdater `DATABASE_URL` i
  **Vercel → Settings → Environment Variables** (Production) **og** i
  **GitHub → Settings → Secrets and variables → Actions**. Redeploy.
- **Hvorfor:** Adressen med passord ble delt i en chat 03.09 — regn den som eksponert.
- **Ferdig når:** `https://www.tosom.no/api/system/health` gir `"status":"ok"`,
  og neste CD-kjøring er grønn.
- [ ] Gjort

### 2.2 Beslutninger agentene venter på

#### 👤 G-05 · Si «kjør» for de låste oppgavene  🟥
| Oppgave | Hva | Hvorfor låst |
|---|---|---|
| PL-06 | Reisedagen beregnes fra start i stedet for å telles | Endrer reisens tempo (DI-2) — **gjør G-03 først** |
- [ ] «kjør» PL-06 · [x] «kjør» PL-15 (gitt 06.10 — FERDIG) · [x] «kjør» PL-24 (gitt 06.10 — FERDIG)

#### 👤 G-06 · Svar på tre små spørsmål  🟨
| # | Spørsmål | Agentens forslag |
|---|---|---|
| a | Kan den gamle ruten `journey/progress/advance` (merket «utgått») slettes? | Ja — ingen bruker den, og den har egen fasetabell |
| b | Skal `/questions` være offentlig? | Nei — 404 i prod |
| c | Admin-panelet viser «Djupere (22-30)». Hva skal stå? | «Dypere (22–25)» og «Refleksjon (26–30)» |
- [ ] Svart

---

### 2.3 Juridisk

#### 👤 G-07 · Advokatgjennomgang  🟥
- **Hva:** Send advokaten vilkår, personvernerklæring, DPA og DPIA (`docs/legal/`),
  og spør spesielt om:
  1. **Angrerett:** holder «ingen refusjon etter koblingen»? (angrerettloven § 22 n)
  2. **Adressekravet** (e-handelsloven § 8): hvordan oppfylles det **uten** din
     private adresse? (kontoradresse, postboks, forretningsadressetjeneste)
  3. **Særlige kategorier** (religion, legning): holder samtykkeløsningen i `/samtykke`?
- **Agentene har klart:** `docs/JURIDISK-GRUNNLAG-v1.0.md` som brief.
- **Ferdig når:** Advokaten har godkjent eller gitt rettelser, og DPA/DPIA er signert.
- **Låser opp:** 3 punkter i §6.6 og «DPA og DPIA …» i §6.1.
- [ ] Gjort

### 2.4 E-post og DNS

#### 👤 G-08 · DMARC og SPF  🟥
- **Hva:** I Cloudflare DNS for `tosom.no`:
  1. **Ny TXT-post** — navn `_dmarc`, verdi
     `v=DMARC1; p=none; rua=mailto:support@tosom.no`
     (start med `p=none` i 2–4 uker, deretter `p=quarantine`).
  2. **Sender du fra support@ via one.com?** Bytt da SPF-posten (`tosom.no`, TXT) til
     `v=spf1 include:spf.resend.com include:_spf.one.com -all`
     (i dag står bare Resend — svar fra support@ kan bli avvist).
- **Ferdig når:** `dig +short TXT _dmarc.tosom.no` viser posten.
- [ ] Gjort

#### 👤 G-09 · Test support@ begge veier  🟥
- **Hva:** Send fra en privat adresse til `support@tosom.no`, og svar tilbake.
- **Ferdig når:** Begge kom fram, og svaret havnet ikke i søppelpost.
- [ ] Gjort

### 2.5 Produksjon og drift

#### 👤 G-10 · Vercel-plan  🟥
- **Hva:** Se i Vercel → Settings → Billing om prosjektet er **Hobby** eller **Pro**.
- **Hvorfor:** `vercel.json` kjører matching tre ganger lørdag natt
  (`0 2,3,4 * * 6`). Hobby tillater bare én gang i døgnet.
- **Ferdig når:** Du har sagt «Hobby» eller «Pro» til Cline (PL-14 følger av svaret).
- [ ] Gjort

#### 👤 G-11 · Slett testbrukerne test1/test2  🟥
- **Hva:** Først prøvekjøring — den sletter ingenting:
  `DATABASE_URL="<prod>" node scripts/launch-1-delete-test-users.mjs`
  Ser listen riktig ut → kjør samme kommando med `--apply` på slutten.
- **Ferdig når:** En ny prøvekjøring finner 0 brukere.
- [ ] Gjort

#### 👤 G-12 · Admin-hemmeligheter og brytere i Vercel  🟥
I Vercel → Settings → Environment Variables (**Production**):

| Variabel | Skal være |
|---|---|
| `ADMIN_PASSWORD_HASH`, `ADMIN_JWT_SECRET`, `ADMIN_EMAIL` | Satt (ikke tomme) |
| `DEV_LOGIN_ENABLED` | Ikke satt, eller `false` |
| `PAYMENTS_ENABLED` | Ikke satt, eller `false` (til Vipps er verifisert) |
| `ENABLE_CSRF_PROTECTION` | `true` |
- **Ferdig når:** Alle radene stemmer.
- **Låser opp:** 4 punkter i §6.8.
- [ ] Gjort

#### 👤 G-13 · Gjenopprett en backup én gang  🟥
- **Hva:** Følg `deploy/backup.md`: ta backup (`scripts/db-backup.sh`) og
  gjenopprett den til en **egen testdatabase** — aldri over prod.
- **Hvorfor:** En backup som aldri er prøvd gjenopprettet, er ikke en backup.
- **Ferdig når:** Testdatabasen har tabellene og omtrent samme antall brukere.
- [ ] Gjort

#### 👤 G-14 · Gå gjennom Sentry  🟥
- **Hva:** Se på feil de siste 14 dagene.
- **Ferdig når:** Ingen uløste kritiske feil — eller de er sendt til Cline som oppgaver.
- [ ] Gjort

#### 👤 G-15 · Brukere som prøvde å slette seg før K-1 ble rettet  🟥
- **Hva:** I Vercel → Logs: søk etter `[delete-account]` fra beta-start til 05.10.
  Del listen over bruker-ID-er (ikke e-poster i chat) med Cline. Cline lager et
  slette-skript med prøvekjøring, på samme måte som for testbrukerne (G-11).
  Send hver berørt bruker en kort, ærlig e-post med beklagelse.
- **Hvorfor:** De trodde kontoen var slettet. GDPR art. 17.
- **Ferdig når:** Skriptets prøvekjøring finner 0, og e-postene er sendt.
- **Låser opp:** «Brukere som har forsøkt å slette seg …» i §6.1.
- [ ] Gjort

---

### 2.6 Manuell testing (krever ekte nettleser og telefon)

#### 👤 G-16 · Ende-til-ende med to testkontoer  🟥
To nettlesere (vanlig + privat vindu), to kontoer som søker hverandre:
registrer → samtykke → onboarding → kø → **«Kjør matching manuelt»** i
`/admin/tools` → chat → dag 15 → bilder → avslutning → sletting.
- **Ferdig når:** Alt virket, og ingen bilder var synlige før dag 15.
- **Låser opp:** «Bildesperren løftes dag 15 …» i §6.4.
- [ ] Gjort

#### 👤 G-17 · Telefoner og nettlesere  🟥
iPhone (Safari), Android (Chrome), PC/Mac (Chrome, Firefox, Safari): forsiden,
innlogging, onboarding (særlig steg 1 med religion og barn), chat, innstillinger.
- **Ferdig når:** Ingenting var ødelagt eller uleselig.
- [ ] Gjort

#### 👤 G-18 · Konsollfeil og Lighthouse  🟥
I Chrome: høyreklikk → «Inspiser» → fanen «Console» på forsiden, `/login`,
`/onboarding` og `/dashboard`. Kjør «Lighthouse» på `/` og `/login`.
- **Ferdig når:** Ingen røde feil i konsollen, og «Tilgjengelighet» ≥ 95.
- [ ] Gjort

#### 👤 G-19 · Score- og nivåfordeling etter en ekte matcherunde  🟥
Etter første lørdag med ekte brukere: åpne `/admin/logs` og finn siste
«Matching-runde»-linje: antall par, avvisningsgrunner, og fordelingen på nivåene
(dyp / sterk / god / rolig resonans).
- **Se etter:** Ingen avvisningsgrunn som er unormalt høy (f.eks. `kjonn` eller
  `barn`), og ikke alle par på samme nivå. **Juster ingenting** (DI-2) — del tallene.
- **Ferdig når:** Du har sett tallene og delt dem med Cline.
- [ ] Gjort

#### 👤 G-20 · Manuell språkgjennomgang  🟥
Les alle sidene brukerne ser (Cline lager listen i PL-22). Merk alt som ikke er
godt, varmt bokmål.
- [ ] Gjort

#### 👤 G-21 · Delingsbilde `og-image.png`  🟥
Lag eller godkjenn et bilde på **1200 × 630** piksler (logo + «Én match. Én reise.
Én relasjon.»). Legg det i `public/og-image.png`, eller send det til Cline.
- **Hvorfor:** Når noen deler tosom.no i Messenger, Facebook eller Slack, vises i dag ikke noe bilde.
- [ ] Gjort

#### 👤 G-22 · Skriftlig rutine for rapporter  🟥
En halv side: hvem leser rapporter, hvor raskt (f.eks. innen 24 timer), og hva
som skjer (advarsel, utestengelse, politi ved trusler). Cline kan lage utkast.
- [ ] Gjort

#### 👤 G-23 · CI grønn etter push  🟥
Etter G-01: siste kjøring i GitHub Actions er grønn (lint, tsc, språkvakt,
jest, build — og Playwright hvis den kjører i CI).
- **Låser opp:** «E2E (Playwright) grønn i CI» og «`npm run build` grønn» i §6.7.
- [ ] Gjort

#### 👤 G-24 · Bekreft at sidene som fjernes, gir 404  🟥
Etter at PL-20/PL-21 er deployet: åpne `/design-system`, `/blogg`,
`/onboarding/payment` og `/register/vipps` i prod. Alle skal vise «Fant ikke siden».
- [ ] Gjort

#### 👤 G-25 · Vipps (eget løp — ikke lanseringsfeil)  🟨
Når Vipps-avtalen er på plass: si fra, så lager Cline en egen instruks
(sjekklisten §5). Til da står `PAYMENTS_ENABLED` av (G-12).
- [ ] Startet

---

## 3. 🤖 AGENTENES LISTE — Qwen (Q) og Cline (C)

Fremgangsmåten for hver oppgave står i `ACT-InstruksPreLunch.md` under samme
PL-nummer. Her står bare **hva som gjenstår** og **hva som venter på hva**.

### 3.1 Kan startes nå (ingen ventetid)

| ID | Hvem | Oppgave | Sjekklistepunkt (§6) | Prioritet |
|---|---|---|---|---|
| **PL-19** | 🤖 Q | Vilkår: angrerettloven § 22 n + direkte lovdata-lenker (`config/legal.ts`, `app/vilkar/page.tsx`). **Ingen adresse.** | §6.6 «Vilkår: angrerettloven og direkte lovlenker» | 🟥 |
| **PL-20** | 🤖 Q | Interne/døde sider 404 i prod: `/design-system`, `/onboarding/payment` (slett), `/onboarding/access` (slett), `/register/vipps`, `phone/send` og `phone/verify` | §6.7 «Interne og døde sider …» og «`POST /api/auth/phone/send` deaktivert» | 🟥 |
| **PL-21** | 🤖 Q | Blogg 404 i prod (D-9) + dag 30-varselet og milepælteksten i `cron/journey` til bokmål | §6.6 «Bloggen …» · §6.4 «Brukervarselet ved dag 30 …» | 🟥 |
| **PL-22** | 🤖 Q | Utvid språkvakten med nynorsk-ordene fra V-13 + lag sidelisten til George (G-20) | Forarbeid for §6.6 (George krysser) | 🟥 |
| **PL-23a** | 🤖 Q | Sitemap: kun offentlige sider (fjern `/match`, `/journey`, `/dashboard`, `/profile`, `/onboarding`) | §6.7 «`og-image.png` finnes; sitemap …» (bildet = G-21) | 🟥 |
| **PL-18** | 🤖 Q | Universell utforming: `:focus-visible`, `prefers-reduced-motion`, kontrast ≥ 4,5:1, FAQ-knapper | §6.7 «WCAG 2.1 AA …» (George bekrefter med Lighthouse, G-18) | 🟥 |

### 3.2 Venter på George

| ID | Hvem | Oppgave | Venter på | Sjekklistepunkt (§6) |
|---|---|---|---|---|
| **PL-06** | 🤖 C 🔒 | Reisedagen beregnes fra `bothSeenAt` (`journeyDayFor`), begge partnere i samme transaksjon | ⏳ **G-03** (tall fra prod) + **G-05** («kjør») | §6.4 «Dagframrykk deterministisk …» |
| **PL-15** | 🤖 C 🔒 | Bevis ved rapport/blokkering (`Report.evidence`, 90 dager), rapport etter avsluttet match, `pgCheck` i stedet for minnebasert grense | ⏳ **G-05** («kjør») — ny migrasjon | §6.2 «Bevis bevares …», «Rapport mulig også …», «Rapport-rate-limit …» |
| **PL-24** | 🤖 C 🔒 | `nodemailer` 7 → 10; avklare om `uploadthing` brukes (R2 er lagring i prod) — fjern hvis ikke | ⏳ **G-05** («kjør») | §6.7 «Øvrige høye sårbarheter …» |
| **PL-14** | 🤖 Q | Samordne tidspunktet for matcherunden i `config/legal.ts`, watchdog-kommentaren og `vercel.json` | ⏳ **G-10** (Hobby eller Pro) | §6.8 «Vercel-plan bekreftet …» |
| **PL-26** | 🤖 Q | Opprydding (død kode, «Djupere», gamle dokumenter) | ⏳ **G-06** (svar a–c) | — (mindre forbedringer) |
| **PL-G15-skript** | 🤖 C | Slette-skript (prøvekjøring + `--apply`) for brukere som prøvde å slette seg | ⏳ **G-15** (liste over ID-er) | §6.1 «Brukere som har forsøkt å slette seg …» |

### 3.3 Kodeferdige — venter bare på at George bekrefter i prod

| Punkt i §6 | Ferdig i | George-oppgave |
|---|---|---|
| Aktiv aksept av vilkår + uttrykkelig samtykke … | PL-02 | **G-01** (deploy) |
| `termsAcceptedAt` / `termsVersion` lagres … | PL-02 | **G-01** |
| Eksisterende brukere bes om samtykke … | PL-02 | **G-01** |
| «Glemt passord» virker ende-til-ende … | PL-07 | **G-02** (e-posttest) |

### 3.4 Én ting agentene skal følge med på
- **`next` har én moderat sårbarhet** som bare rettes i Next 16 (større
  oppgradering). Den er **ikke** kritisk og blokkerer ikke lansering, men skal
  vurderes skriftlig i PL-24c («berører den oss, hvorfor, hva er planen»).

---

## 4. Regler for denne runden (kort)

- **Én fil per patch.** `npm run verify` mellom hver. Rødt → stopp og rett.
- **Les hele filen før du endrer den.** Linjenumre er veiledende.
- **Bokmål overalt** — språkvakten fanget nynorsk i nye kommentarer i forrige
  runde. Kjør `npm run verify:lang` før du sier deg ferdig.
- **Endre aldri en eksisterende test for å få den grønn** uten å si hvorfor
  i rapporten. (PL-27 endret to religionstester bevisst — Georges beslutning — det står i testene.)
- **Ingen adresse** noe sted (`ACT-InstruksPreLunch.md` §0.3). `COMPANY.address` forblir `null`.
- **Push alltid med `git push origin main`** — aldri `--all` eller `--mirror`
  (lokale Cline-sjekkpunkter skal ikke ut).
- **Kryss av i `LanseringsCheckList.md` §6** etter reglene i instruksens §2 —
  og oppdater tabellen i denne filen i samme commit.

---

## 5. Anbefalt rekkefølge

| Steg | 👤 George | 🤖 Agentene (parallelt) |
|---|---|---|
| **1 — nå** | G-01 push · G-02 glemt passord · G-03 reisedager · G-04 roter `DATABASE_URL` | PL-19 vilkår · PL-20 døde sider · PL-21 blogg/dag 30 |
| **2** | G-05 «kjør» PL-06/15/24 · G-06 tre svar · G-10 Vercel-plan | PL-06 reisedag (etter G-03) · PL-22 språkvakt · PL-23a sitemap |
| **3** | G-07 advokat · G-08 DMARC/SPF · G-09 support@ · G-11 testbrukere · G-12 brytere | PL-18 universell utforming · PL-14 tidsplan |
| **4** | G-13 backup · G-14 Sentry · G-15 slettinger · G-21 delingsbilde · G-22 rapportrutine | PL-26 opprydding · slette-skript til G-15 |
| **5 — sluttest** | G-16 ende-til-ende · G-17 telefoner · G-18 konsoll/Lighthouse · G-20 språk · G-23 CI · G-24 404-sider | PL-99 sluttkontroll (instruksen §9) |
| **6 — etter første lørdag** | G-19 score- og nivåfordeling | Analyse — **ingen justering** (DI-2) |

---

## 6. Nytt 06.10 — religion og bonusfamilie (PL-27, PL-28)

Begge er **utført, testet og avkrysset** i `LanseringsCheckList.md` §6.3.

### 6.1 PL-27 · Religion / livssyn

**Georges beslutning:** Mange har foreldre med to ulike religioner og bor i et
tredje land. Mange bryr seg ikke om religion og dater på tvers. Det er lov, og
det gjør ikke en match mindre kompatibel.

| Hva | Før | Nå |
|---|---|---|
| Antall valg i onboarding | Opptil 2 | **Opptil 4** |
| Hjelpetekst | «Velg det som passer best» | «Velg opptil fire som beskriver deg. Mange har røtter i flere tradisjoner — det er helt naturlig. Ulik tro gjør ikke en match mindre aktuell.» |
| Ulik tro (kristen × muslim), ellers like | Livssituasjon **89** (trekk) | **100** (ingen trekk) |
| Fire valg mot ett felles | Religion **25** | Inngår ikke |
| Server | Ingen grense | Avviser mer enn fire valg med rolig melding |

Religion er fjernet fra `scoreLifeSituationCompat` (`lib/matching/dimensions.ts`).
Den er fortsatt en del av profilen og vises i oppsummeringen, men er ikke et
samsvarskrav og ingen dealbreaker. Matchvektene (DI-2) er uendret.

### 6.2 PL-28 · «Åpen for bonusfamilie»

**Georges beslutning:** Man kan svare «nei» til egne barn og likevel være åpen
for en partner som har barn fra før — og for samarbeidet med tidligere
partnere, besteforeldre og søsken som følger med.

| Hva | Nå |
|---|---|
| Nytt valg i «Ønsker du barn?» | **«Åpen for bonusfamilie»** — «Åpen for en partner som har barn fra før — og for å bli kjent med familien rundt.» |
| Pluss i matchingen | **+10** i livssituasjonen når den ene er åpen for bonusfamilie og den andre har barn fra før. Begge veier, én gang, aldri over 100 |
| Barneønsket | Bonusfamilie telles **ikke** som barneønske. «Nei, bonusfamilie» mot «Nei» = like ønsker |
| Dealbreaker D-3 | **Uendret.** «Nei, bonusfamilie» mot «Ja» blokkeres fortsatt |
| Ny dealbreaker? | **Nei** (Georges valg) |

**Målt:** «Nei + bonusfamilie» mot en som har barn → **85**. «Nei» uten
bonusfamilie mot samme person → **75**.

### 6.3 Verifisert
- `npm run verify`: språkvakt grønn · tsc 0 · jest **521 bestått** (+17) / 1 hoppet over
- `npx next lint --max-warnings 0`: 0 advarsler
- Ekvivalens `cheapSjekkAll ≡ sjekkAlleDealbreakers` holder med bonusfamilie (fast matrise + 4000 tilfeldige par)
- **Ikke testet i nettleser:** hvordan det nye kortet ser ut på mobil → del av **G-17**

---

## 7. Regresjon etter denne runden

```bash
npm run verify
npx next lint --max-warnings 0
npm run build          # før deploy
```
**Matching:** `dealbreaker` · `dimensions-compat` · `matching-score-round` · `unified-scorer` · `radius-dealbreaker-b14`
**Reisen (PL-06):** `journey-engine` · `journey-day-advance` (ny) · `photo-lock-before-day15`
**Innlogging:** `login-rate-limit` · `password-reset` · `consent-required` · `middleware-cookie-salt`

Fullstendig regresjonsliste: `LanseringsCheckList.md` §7.

---

## 8. Avkrysningsliste — alle 46 åpne punkter

Speiler `LanseringsCheckList.md` §6. **Kryss av begge steder.**

### 6.1 Personvern og samtykke
- [ ] 👤 G-15 · Brukere som har forsøkt å slette seg, er slettet og informert 🟥
- [ ] 👤 G-01 · Aktiv aksept av vilkår + uttrykkelig samtykke *(kode ferdig, PL-02)* 🟥
- [ ] 👤 G-01 · `termsAcceptedAt` / `termsVersion` lagres for nye brukere *(kode ferdig, PL-02)* 🟥
- [ ] 👤 G-01 · Eksisterende brukere bes om samtykke *(kode ferdig, PL-02)* 🟥
- [x] 🤖 Q PL-16 · Google Fonts selvhostet 🟥 *(PL-16: Inter via next/font/google (400–700, swap, --font-inter), eksterne lenker fjernet, CSP font-src 'self' (fonts.gstatic.com borte), build-verifisert — kun /_next/static/media i HTML/CSS)*
- [x] 🤖 Q PL-17 · Onboarding-utkast ikke i `localStorage` 🟨 *(PL-17: sessionStorage i loadDraft/saveDraft (per fane), gammelt localStorage-utkast slettes, clearOnboardingDraft() i alle 4 signOut-punkter (lib/onboarding-draft.ts), personvern-tabellrad lagt til)*
- [ ] 👤 G-07 · DPA og DPIA gjennomgått og signert 🟥

### 6.2 Trygghet
- [x] 🤖 C PL-15 · Bevis bevares ved rapport/blokkering 🟥 *(PL-15: `Report.evidence` + `evidenceExpiresAt` (migrasjon 20261006120000, deployt til dev/test), evidence = siste 50 tekstmeldinger ved rapport og ved blokkering (før sletting), 90 dager etter lukking (PATCH + cron), personvern §17)*
- [x] 🤖 C PL-15 · Rapport mulig etter avsluttet match 🟥 *(PL-15f+g: `GET /api/report/candidates` + «Rapporter» i innstillinger fungerer uten aktiv match — tidligere matcher fra MatchHistory)*
- [x] 🤖 C PL-15 · Rapport-grense via `pgCheck` 🟨 *(PL-15b: `pgCheck('report:<id>', 3, 60)` i stedet for in-memory Map; 4. rapport → 429. Test: `__tests__/report-evidence.test.ts` (4 nye))*
- [ ] 👤 G-22 · Skriftlig rutine for rapporter 🟥

### 6.3 Matchingmotoren
- [ ] 👤 G-19 · Score- og nivåfordeling gjennomgått etter ekte runde 🟥

### 6.4 Reisen
- [ ] 👤 G-03 · Reisedager verifisert i prod-DB 🟥
- [ ] 🤖 C PL-06 🔒 · Dagframrykk deterministisk, begge partnere samtidig 🟥
- [ ] 👤 G-16 · Bildesperren løftes dag 15, testet med ekte par 🟥
- [x] 🤖 Q PL-21 · Dag 30-varselet på bokmål 🟥 *(PL-21c+d: avslutningsvarselet «Reisen deres er fullført. Takk for at dere ga hverandre 30 dager.» + milestone «Ny dag i reisen» i cron/journey og progress/advance)*

### 6.5 Innlogging og konto
- [ ] 👤 G-02 · «Glemt passord» ende-til-ende i prod *(kode ferdig, PL-07)* 🟥

### 6.6 Innhold og språk
- [x] 🤖 Q PL-21 · Bloggen avpublisert (404) 🟥 *(PL-21a+b: app/blogg/layout.tsx (server-side notFound) dekker forsiden og [slug]; artikkelfilene beholdes for omskriving; live-verifisert med next start: /blogg 404, /blogg/[slug] 404, øvrige sider 200)*
- [ ] 👤 G-20 · Manuell språkgjennomgang *(sideliste fra PL-22)* 🟥
- [x] 🤖 Q PL-19 · Vilkår: angrerettloven og direkte lovlenker 🟥 *(PL-19a–d: §15 «Angrerett og refusjon» henviser til angrerettloven § 22 bokstav n; alle 5 norske lover i `LEGISLATION` med direkte lovdata-lenke (verifisert 200 OK); personvern-siden bruker «personopplysningsloven»; TERMS/PRIVACY_VERSION → 2026-10-06)*
- [ ] 👤 G-07 · Adressekravet avklart — privat adresse publiseres ikke 🟥
- [ ] 👤 G-07 · Juridiske tekster gjennomgått av advokat 🟥

### 6.7 Teknisk kvalitet og sikkerhet
- [x] 🤖 C PL-24 · Øvrige høye sårbarheter rettet eller vurdert 🟥 *(PL-24a: nodemailer 7.0.13 → 10.0.15, levetestet mot maildev (250 OK + accepted); PL-24b: uploadthing avklart — IKKE brukt i prod (ingen endepunkt, bildene går via R2), beholdes etter Georges beslutning; PL-24c: effect/uploadthing + postcss×4/next + next-moderat dokumentert i LanseringsCheckList K-5. Audit: 0 kritiske, alle høye vurdert skriftlig)*
- [ ] 🤖 Q PL-20 · Interne og døde sider 404 i prod *(George bekrefter, G-24)* 🟥 *(kode ferdig · PL-20a–f: `/design-system` + `/register/vipps` 404 via layout, `onboarding/payment` + `onboarding/access` slettet (grep rene), `phone/send` + `phone/verify` 404 i prod — verifisert med lokal prod-kjøring `next start`, alle 404)*
- [ ] 🤖 Q PL-20 · `POST /api/auth/phone/send` deaktivert 🟥 *(kode ferdig · PL-20d — 404 i prod, bekreft med curl etter deploy)*
- [x] 🤖 C PL-25 · Manglende API-prefikser i middleware 🟨 *(PL-25a+b: 6 nye prefikser i `PROTECTED_API_PREFIXES` + `__tests__/api-route-coverage.test.ts` (119 ruter verifisert, 21 eksplisitt offentlig med begrunnelse). Ny rute uten dekning → rød test.)*
- [ ] 🤖 Q PL-23a + 👤 G-21 · Sitemap + `og-image.png` 🟥
- [ ] 🤖 Q PL-18 + 👤 G-18 · WCAG 2.1 AA 🟥
- [ ] 👤 G-17 · Manuell test på telefoner og nettlesere 🟥
- [ ] 👤 G-18 · Ingen konsollfeil 🟥
- [ ] 👤 G-18 · INP < 200 ms på mobil 🟨
- [ ] 👤 G-23 · E2E grønn i CI 🟥
- [ ] 👤 G-23 · `npm run build` grønn 🟥

### 6.8 Drift
- [ ] 👤 G-10 + 🤖 Q PL-14 · Vercel-plan og tidsplaner 🟥
- [ ] 👤 G-01 · `prisma migrate status` viser alle migrasjoner 🟥
- [ ] 👤 G-11 · Testbrukere slettet 🟥
- [ ] 👤 G-12 · Admin-hemmeligheter satt 🟥
- [ ] 👤 G-12 · `DEV_LOGIN_ENABLED` ikke `true` 🟥
- [ ] 👤 G-12 · `PAYMENTS_ENABLED` ikke `true` 🟥
- [ ] 👤 G-12 · `ENABLE_CSRF_PROTECTION=true` 🟥
- [ ] 👤 G-08 · DMARC + SPF 🟥
- [ ] 👤 G-09 · support@ testet 🟥
- [ ] 👤 G-13 · Backup gjenopprettet én gang 🟥
- [ ] 👤 G-14 · Sentry gjennomgått 🟥
- [ ] 👤 G-04 · `DATABASE_URL` rotert 🟥

### 6.9 Vipps
- [ ] 👤 G-25 · Alle punkter i sjekklisten §5 *(ikke lanseringsfeil)* 🟨

---

*Hver patch berører noe som betyr noe for noen. Jobb rolig. Jobb presist.
Kryss av bare det som er sant.*

