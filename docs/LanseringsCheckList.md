# TOSOM — LANSERINGSSJEKKLISTE

**Dato:** 2026-10-05
**Commit:** `696c7ee`
**Utført av:** Cline (senior fullstack-utvikler og systemagent)
**Status:** Kvalitetssikring før offentlig lansering. **Ikke kanonisk.**
**Kanonisk kilde er fortsatt** [`TOSOM-SUPER-MASTERPLAN-v2.0.md`](TOSOM-SUPER-MASTERPLAN-v2.0.md)

> Koden vinner over dokumentasjonen. Alle funn er verifisert mot kildekoden
> eller mot det levende nettstedet — ikke mot andre dokumenter.

---

## 0. Samlet lanseringsstatus

| Mål | Vurdering |
|---|---|
| **Offentlig lansering** | 🔴 **NO-GO** — uavhengig av Vipps |
| **Fortsatt beta (dagens brukere)** | 🟠 **Krever umiddelbar retting av K-1 og K-2** |

Tosom har et sterkt fundament: tydelig konsept, gjennomtenkte invarianter,
ekte transaksjoner i matching og sletting, grønne tester og et nettsted med
gode sikkerhetshoder. Det som skiller produktet fra lansering er ikke
arkitektur. Det er **åtte konkrete feil** der systemet i dag lover noe det
ikke holder — overfor brukere som deler svært personlige opplysninger.

To av feilene rammer allerede dagens betabrukere:

- **K-1:** En bruker som sletter kontoen sin får beskjed om at det er gjort,
  men ingenting slettes.
- **K-2:** Ingen bruker har akseptert vilkår eller samtykket til behandling
  av særlige kategorier personopplysninger.

Matchingmotoren (K-3, V-1, V-2) gir i dag høy resonans til brukere som hopper
over spørsmålene, og flere av dealbreakerne er i praksis inaktive. Det betyr
at «Sterk resonans» ikke alltid betyr det brukeren tror.

**Vipps** er ikke regnet som lanseringsfeil, men står som eget kontrollpunkt (§5).

---

## 1. Metode — hva som faktisk er testet

### 1.1 Verifisert

| Område | Metode | Resultat |
|---|---|---|
| Typesjekk | `npx tsc --noEmit` | 0 feil |
| Enhetstester | `npx jest --ci --silent` | 450 bestått / 1 hoppet over (52 av 53 suiter) |
| Lint | `npx next lint --max-warnings 0` | 0 advarsler |
| Språkvakt | `npm run verify:lang` | Grønn (1026 filer) — men se V-13 |
| Matchingmotoren | Full lesning av `cron/matching`, `scoreRound`, `cheapFeatures`, `dealbreaker`, `unifiedScorer`, `dimensions`, `psychometrics/scoring`, `profile/setup` | Se §4 |
| Faktiske score | `npx tsx -e` mot `unifiedScore` + `scoreAll` med konstruerte profiler | Se K-3 |
| Brukerreiser | Kodelesning: login → onboarding → kø → match → reise → chat → avslutning/sletting/blokkering/rapport | Se §2–§3 |
| Live nettsted | HTTP-status for 45 stier, sikkerhetshoder, helse-endepunkt, `robots.txt`, `sitemap.xml`, `llms.txt`, forsideinnhold | Se V-10, V-14 |
| DNS | SPF, DKIM, MX, DMARC for `tosom.no` | Se V-6 |
| Selskap | Enhetsregisteret (API) for org.nr. 938 413 231 | Bekreftet aktivt AS — se V-9 |
| Avhengigheter | `npm audit --omit=dev` | 4 kritiske, 10 høye, 1 moderat — se K-5 |

### 1.2 Ikke verifisert — krever tilgang eller manuell test

| Område | Hvorfor ikke | Hva som trengs |
|---|---|---|
| Visuell test i ekte nettlesere og mobil | Ingen nettleser i agentmiljøet | Manuell test: Chrome, Safari (iOS), Firefox, Samsung Internet |
| Konsollfeil i nettleseren | Samme | DevTools på alle hovedsider, innlogget og utlogget |
| Skjermleser og tastaturnavigasjon | Samme | VoiceOver + NVDA, kun tastatur gjennom onboarding |
| Innlogget ende-til-ende i to nettlesere | Krever testkontoer i prod | Fullt løp: match → chat → dag 15 → avslutning |
| E2E (Playwright) | Skriver testartefakter; ikke kjørt | `npx playwright test` i CI |
| Produksjonsdatabasen | Ingen tilgang (korrekt) | `prisma migrate status`, telling av testbrukere, `journeyProgress`-dager per par |
| Vercel-miljø og plan | Ingen tilgang | Bekreft plan (Hobby/Pro), env-variabler, cron-historikk |
| Admin-panel, Sentry, logger | Ingen tilgang | Gjennomgang av `/admin`, Sentry-feil siste 30 dager |
| Faktisk e-postlevering | Krever sending | Test passord-reset og support@ inn/ut |
| Ytelse (INP/LCP) på nytt | Krever måling i nettleser | PageSpeed Insights / Teste.no |
| Juridisk holdbarhet | Krever advokat | Gjennomgang av vilkår, personvern, DPA, DPIA |

---

## Kontekst — hva Tosom er, og hvilket ansvar det gir

Tosom er en relasjonsplattform for voksne (21+) som vil finne én person — ikke
bla gjennom mange. Brukeren bygger en dyp, privat profil, blir koblet med én
person natt til lørdag, og går inn i en guidet 30-dagers reise uten bilder de
første 14 dagene.

Tjenesten er laget for mennesker som er slitne av sveiping, overflate og jag.
Den løser et reelt problem: å møte noen på en trygg, langsom og meningsfull måte.

Det gir et særlig ansvar:

- **Sårbarhet.** Brukerne beskriver tilknytning, usikkerhet, grenser,
  intimitet og hva som gjør dem utrygge. Lekker, misbrukes eller feiltolkes
  dette, rammer det mennesker der de er mest sårbare.
- **Tillit som produkt.** Hele konseptet hviler på løfter: én match, ingen
  bilder før dag 15, alt slettes. Et brutt løfte er ikke en bug — det er et
  brudd med produktets kjerne.
- **Matching er en beslutning på vegne av brukeren.** Brukeren velger aldri
  hvem (I-3). Da må motoren være riktig, og ordene den viser må være sanne.
- **Inkludering.** Kjønns- og legningsvalg må respekteres presist, ellers
  blir noen matchet med personer de ikke søker — eller usynlige.

Konsekvensene av feil her er ikke bare tekniske. De er menneskelige.

---

## 2. 🔴 KRITISKE FEIL — må rettes før lansering

### K-1 · Kontosletting fungerer ikke, men brukeren får beskjed om at den gjør det

**Funnet i:** `app/settings/page.tsx:500–508` og `:904–912`,
`app/api/settings/delete-account/route.ts`

**Hva:**
1. Frontenden kaller `csrfFetch('/api/settings/delete-account', { method: 'POST' })`
   **uten body**. Ruten krever `{ "confirmation": "DELETE" }` (Zod-literal) og
   returnerer **400**.
2. Frontenden sjekker aldri `res.ok` — den kaller `signOut()` uansett. Brukeren
   logges ut og tror kontoen er slettet.
3. Selv med riktig body: ruten kaller `/api/journey/exit` internt via `fetch`
   med bare cookie-headeren videresendt. `journey/exit` krever CSRF
   (`X-CSRF-Token` + `csrf_token`-cookie). Headeren videresendes ikke → **403**.
   Feilen ignoreres stille.
4. Deretter forsøker transaksjonen `tx.user.delete()` mens `Conversation` og
   partnerens `Message` fortsatt refererer brukeren (relasjonene har ikke
   `onDelete: Cascade`). Sannsynlig resultat: FK-feil → 500.
5. Det finnes **ingen test** for ruten (`__tests__` og `e2e` har null treff).

**Hvorfor det er viktig:** Retten til sletting (GDPR art. 17) brytes stille.
FAQ lover at «alt forsvinner med en gang». Brukeren har ingen måte å oppdage
at dataene — inkludert tilknytning, grenser og intimitetssvar — ligger igjen.

**Løsning:**
- Frontend: send `body: JSON.stringify({ confirmation: 'DELETE' })` med
  `Content-Type`, sjekk `res.ok`, vis feil til brukeren.
- Backend: erstatt det interne HTTP-kallet med direkte kall til
  `endJourney(matchId, 'early_exit')`.
- Integrasjonstest: aktiv reise + sletting → `User`, `Profile`, `Message`,
  `Conversation` borte; `MatchHistory` beholdt.
- **Kontroller i prod:** søk i Vercel-loggen etter `[delete-account]`. Brukere
  som har forsøkt å slette seg, må slettes manuelt og informeres.

**Berører:** sletting — krever Georges godkjenning (ACT-PIPELINE §11).

---

### K-2 · Ingen aksept av vilkår, ingen samtykke til særlige kategorier

**Funnet i:** `lib/auth/config.ts:59–80` (CredentialsProvider),
`app/login/page.tsx`, `prisma/schema.prisma:36–37`

**Hva:** Konto opprettes automatisk ved første innlogging uten avkrysning,
uten lenke til vilkår/personvern og uten at `termsAcceptedAt` eller
`termsVersion` settes. Feltene settes kun i den døde telefon- og Vipps-veien.
`config/legal.ts` sier at `TERMS_VERSION` skal lagres på bruker ved aksept —
det skjer aldri.

Onboarding samler deretter **særlige kategorier** (GDPR art. 9): religion,
seksuell legning (avledes av kjønn + hvem man søker), intimitet og
helsenære opplysninger (stress, usikkerhet).

**Hvorfor det er viktig:** Art. 9 krever uttrykkelig samtykke eller annet
gyldig unntak. Vi kan ikke dokumentere at noen bruker har samtykket til noe.
Det er det mest alvorlige personvernavviket i systemet.

**Løsning:**
- Innlogging eller første onboarding-steg: to separate, aktive avkrysninger —
  (1) vilkår og personvernerklæring med lenker, (2) uttrykkelig samtykke til
  behandling av særlige kategorier for matching.
- Lagre `termsAcceptedAt`, `termsVersion = TERMS_VERSION` og et
  samtykke-tidsstempel. Blokker onboarding uten samtykke.
- Eksisterende brukere: be om samtykke ved neste innlogging.
- Få behandlingsgrunnlaget bekreftet av advokat (JURIDISK-GRUNNLAG).

---

### K-3 · Matchingmotoren belønner ubesvarte skalaspørsmål og feilklassifiserer tilknytning

**Funnet i:** `lib/psychometrics/scoring.ts:73–124`,
`lib/matching/dimensions.ts:102–138`, `lib/validation/onboarding-steps.ts:118–121`

**Hva:**
1. Ubesvarte items behandles som **3** (nøytral).
2. Tilknytningsstil avledes med `>= 3.0`: en bruker som svarer «nøytralt» eller
   hopper over alt klassifiseres som **«fearful»** (fryktsom-unnvikende).
3. Verdidimensjonen (vekt 0,25): to flate profiler gir `denom === 0` →
   nærhet på snitt = **100**.
4. Skalaspørsmålene (BFI-10, tilknytning, PVQ-10, ERQ-6, kommunikasjon — 44 items)
   er **ikke påkrevd**. Sentral stegvalidering dekker kun steg 0 og 1;
   stegkomponentene validerer bare tekstfeltene.

**Målt med `unifiedScore` (05.10):**

| Par | Score | Nivå brukeren ser |
|---|---|---|
| Hoppet over alt × hoppet over alt | **77** | **Sterk resonans** |
| Alle svar «4» × alle svar «4» | 76 | Sterk resonans |
| Gjennomtenkt profil × lignende profil | 79 | Sterk resonans |
| Hoppet over alt × gjennomtenkt profil | 73 | Sterk resonans |
| Trygg × trygg | 94 | Dyp resonans |

To brukere som ikke har svart på ett eneste skalaspørsmål får nesten samme
resonans som to som har gjort det grundig.

**Hvorfor det er viktig:** Brukeren velger aldri hvem (I-3). «Sterk resonans»
er et løfte fra systemet. Når det bygger på manglende data, er ordet usant
(I-12: ord, aldri tall — men ordet må være riktig). En bruker kan også bli
klassifisert som «fryktsom» uten å ha svart.

**Løsning (krever Georges godkjenning):**
- Gjør skalaspørsmålene påkrevd per steg, eller
- la manglende items gi `null` (ikke 3), og fall tilbake til ordoverlapp når
  under f.eks. 80 % er besvart.
- Avled tilknytningsstil med `> 3.0` eller midtsone, og krev data.
- Verdier: flat profil skal gi nøytral 50, ikke 100.
- Tester: tom profil × tom profil skal ikke gi STRONG.

**Merk:** Dette er retting av en feil, ikke terskeljustering. DI-2 gjelder
vekter og MIN_SCORE, ikke datavalidering. Likevel: spør George før patch.

---

### K-4 · Reisedagene kan hoppe over, og partnerne kan havne på ulike dager

**Funnet i:** `vercel.json` (`"schedule": "5 0 * * *"`),
`app/api/cron/journey/route.ts:110, 119–133, 195`, commit `50a06ef`

**Hva:**
- Journey-cron kjører **én gang i døgnet** (endret 06.09, commit `50a06ef`).
  Commit-meldingen hevder at `nextDayAt` alltid settes til midnatt.
  **Koden gjør ikke det:** den setter `nextDayAt = Date.now() + 24 t`
  (linje 110 og 195), og matcherunden setter `matchtid + 24 t`.
- Daglig kjøring mot en frist på nøyaktig 24 timer: neste kjøring kommer
  typisk noen sekunder **før** fristen → dagen hoppes over → reisen tikker
  hver **andre** dag. Med Vercel Hobbys presisjon (±59 min) blir mønsteret
  uforutsigbart.
- Hver bruker har egen `JourneyProgress`-rad. Batchen (`take: 100`, uten
  `orderBy`) kan rykke fram én partner og ikke den andre. Kommentaren sier
  fortsatt «timevis» og «~7 200 samtidige reiser» — reell kapasitet er
  ~100 per døgn.

**Hvorfor det er viktig:** Reisen er 30 dager (I-5), bilder åpnes dag 15
(I-6). Tar reisen ~60 dager, eller ser partnerne ulike dager og spørsmål,
brytes kjerneopplevelsen.

**Løsning:**
- Verifiser først i prod-DB: sammenlign `day` med dager siden start, og
  `day` mellom partnere i samme match.
- Velg én: (a) `nextDayAt` = neste midnatt norsk tid, (b) beregn dag fra
  startdato i stedet for å inkrementere, eller (c) timevis kjøring (Vercel Pro).
- Rykk fram begge partnere i samme transaksjon (per `matchId`).
- Oppdater kommentarer og kapasitetstall.

**Berører:** journey-kadens (DI-2) — krever Georges godkjenning.

---

### K-5 · Kjente kritiske sårbarheter i avhengigheter

**Funnet i:** `package.json`, `npm audit --omit=dev` (05.10): 4 kritiske, 10 høye, 1 moderat

| Pakke | Installert | Alvorlighet | Retting |
|---|---|---|---|
| `next` | 15.5.19 | Kritisk | `npm audit fix` (innen 15.x) |
| `next-auth` / `@auth/core` | 5.0.0-beta.25 | Kritisk | 5.0.0-beta.32 |
| `@auth/prisma-adapter` | ≤ 2.11.2 | Kritisk | `npm audit fix` |
| `nodemailer` | 7.x | Høy (mange) | 10.x (breaking) |
| `uploadthing` / `@uploadthing/react` | 6.x | Høy | Major-oppdatering |
| `postcss`, `sharp`, `nanoid`, `browserslist`, `brace-expansion` | — | Høy | `npm audit fix` |

**Hvorfor det er viktig:** Sårbarhetene ligger i rammeverket og innloggingen —
lagene alt annet står på.

**Løsning:** Én pakke per patch, med `npm run verify` og `npm run build`
mellom hver. Versjonsendringer krever Georges godkjenning (ACT-PIPELINE §1).

---

### K-6 · Svak innlogging: ingen forsøksgrense, ingen passordkrav, ingen «glemt passord»

**Funnet i:** `lib/auth/config.ts:44–97`, `app/login/page.tsx`,
`app/api/auth/request-reset/route.ts`

**Hva:**
- Ingen rate limiting på credentials-innlogging — ubegrenset passordgjetting.
- Ingen minstelengde: ett tegn godtas som passord ved registrering.
- Ingen «glemt passord»-side. `request-reset` lagrer et token, men sender
  **ingen e-post** (kun `console.log`), og ingen side tar imot tokenet.
- En skrivefeil i e-posten ved innlogging oppretter stille en ny konto.
- Kontoer fra magic link-tiden uten passord: den første som skriver inn
  e-posten med hvilket som helst passord, får kontoen (linje 83–89).

**Hvorfor det er viktig:** Så lenge e-post + passord er innloggingen, er dette
døren inn til de mest personlige opplysningene i systemet.

**Løsning:**
- `pgCheck` på innlogging (f.eks. 10 forsøk / 15 min per e-post og per IP).
- Minstelengde 10 tegn ved registrering.
- Eksplisitt «Opprett konto» (passord to ganger) i stedet for stille
  auto-registrering.
- Ferdigstill reset: e-post via Resend + side for nytt passord.
- Fjern grenen som setter passord på passordløse kontoer, eller krev
  e-postverifisering først.

**Berører:** auth — krever Georges godkjenning.

---

### K-7 · Villedende løfter til brukerne

| Påstand | Hvor | Virkelighet |
|---|---|---|
| «Én match innen 24 timer» | `app/layout.tsx:11` (meta, OG, JSON-LD), `public/llms.txt` | Ukentlig, natt til lørdag (I-10) |
| «Ingen bilder, ingen navn, ingen alder … anonymt» | `app/faq/page.tsx:12` | Navn og alder vises; bilder fra dag 15 |
| «Du får en e-post når det er klart» | `app/faq/page.tsx:16` | I-4: ingen e-post ved match |
| «Vi logger ikke IP-adresser. Ingen tredjeparts tracking» | `app/faq/page.tsx:36` | Vercel, Cloudflare, Sentry og Speed Insights behandler IP; Google Fonts (V-7) |
| «Du får en bekreftelse per e-post» ved sletting | `app/faq/page.tsx:40` | Slettingen virker ikke (K-1) |
| Abonnement 149/129/99 kr/mnd, nynorsk tekst | `/onboarding/payment` (live, HTTP 200) | Én reise 349 kr; de første 5 000 gratis |
| «ECR-12» som validert instrument | `app/metoder/page.tsx:159`, `public/llms.txt` | Tilknytningsspørsmålene er egenutviklede (`lib/psychometrics/instruments.ts:12–19`) |
| «Hvorfor Vipps: Alderskontroll» | `app/login/page.tsx:237` | Alder er selvrapportert i dag |

**Hvorfor det er viktig:** Villedende markedsføring (markedsføringsloven) og
direkte tillitsbrudd. Søkemotorer og AI-assistenter gjengir «innen 24 timer».

**Løsning:** Rett tekstene til å beskrive det som faktisk skjer. Fjern
`app/(auth)/onboarding/payment` eller redirect til `/priser`. Beskriv
tilknytningsspørsmålene som egne spørsmål inspirert av tilknytningsforskning.

---

### K-8 · Bildesperren kan omgås via profilbilde

**Funnet i:** `app/api/profile/route.ts:22–83` (PUT),
`lib/validation/profile.ts:13`, `app/api/chat/conversations/route.ts:157`,
`app/api/chat/messages/route.ts:63`, `app/api/match/status/route.ts:127`,
CSP `img-src … data:`

**Hva:** `PUT /api/profile` godtar `photos: string[]` uten URL-validering,
uten CSRF-sjekk og uten dagssjekk, og lagrer `photos[0]` som `photoUrl`.
Partnerens `photoUrl` sendes **fra dag 1** — i samtalelisten
(`partnerImageUrl`), som avatar på meldinger og i `match/status`.
CSP tillater `data:`-bilder, så et vilkårlig bilde kan bygges inn direkte.
*Verifisert i kode, ikke prøvd live.*

**Hvorfor det er viktig:** Ingen bilder før dag 15 (I-6) er et av produktets
sterkeste løfter og en trygghetsmekanisme. Uønskede bilder fra en fremmed er
nettopp det sperren skal forhindre.

**Løsning:**
- Server-side: returner ikke partnerens `photoUrl` før
  `conversation.imageShareAllowedAt` er passert (samme regel som chatbilder).
- `PUT /api/profile`: CSRF, URL-validering (kun egen lagring), eller fjern
  `photos` fra ruten.
- Test: partnerens `photoUrl` er `null` i alle tre rutene før dag 15.

**Berører:** invariant I-6 — krever Georges godkjenning.

---

## 3. 🟠 VESENTLIGE FORBEDRINGER — rettes før lansering eller godkjennes eksplisitt

Hvert punkt markeres i §6 som enten **Før lansering** eller **Kan utsettes
med Georges eksplisitte godkjenning**.

### V-1 · Fire dealbreakere er i praksis inaktive

**Funnet i:** `app/api/profile/setup/route.ts:189–190, 302–303, 171–180`,
`lib/matching/dealbreaker.ts`, `app/onboarding/data/questions.ts:231`

| Dealbreaker | Hvorfor den aldri slår inn |
|---|---|
| Sikkerhetsnivå | `securityLevel = preferanser.attachmentStyle \|\| 'secure'`. Feltet finnes bare i den døde `app/onboarding/data/questions.ts` (ikke importert) → alltid `'secure'` → gap alltid 0 |
| Modenhetsgap | `maturityLevel = intimacySafety ? 7 : 5`. Feltet er påkrevd → alltid 7 → gap alltid 0 |
| Grenser | Leser `boundaries.excludes` / `.includes`. Setup lagrer humor- og grensetekster under andre nøkler → aldri treff |
| Livsrytme / eksplisitte preferanser | Ingen datakilde i onboarding (dokumentert som inaktiv i `dealbreaker.ts:4–6`) |

Brukerens eget valg «Hva grense vil du aldri krysse?» (`neverCrossBoundary`,
påkrevd) brukes ikke i matchingen.

**Hvorfor det er viktig:** `rejectReasons` i admin-panelet vil vise 0 for disse,
og det kan leses som «ingen konflikter» når sannheten er «ingen sjekk».
Brukere som har oppgitt grenser, tror de blir respektert.

**Løsning:** Avklar med George hvilke som skal være aktive. Enten koble dem
til faktiske data, eller fjern dem og si tydelig i dokumentasjonen at de er
inaktive. Ikke vis brukeren at grensene «brukes i matchingen» før de gjør det.

---

### V-2 · Barn og røyking har nesten ingen effekt på matchen

**Funnet i:** `lib/matching/dimensions.ts:230–256`, `unifiedScorer.ts:59–66`

**Hva:** Livssituasjon har vekt 0,10. Ønske om barn er 40 % av den → maks
**4 poeng** av 100 på totalscoren. En som absolutt vil ha barn og en som
absolutt ikke vil, kan få «Dyp resonans». Røyking: maks 2 poeng.
I tillegg leser `pickField` bare strengverdier — flervalg lagres som
kommaseparert streng, som fungerer, men verdiene sammenlignes på rå tekst.

**Hvorfor det er viktig:** For mange er barn det viktigste praktiske spørsmålet
i en relasjon. En match som ignorerer det, er ikke «gjennomtenkt».

**Løsning:** Vurder `wantChildren` som en bidireksjonell dealbreaker
(ja ↔ nei blokkerer; «usikker» blokkerer ikke). Krever Georges godkjenning
(endring i matchinglogikk, DI-2).

---

### V-3 · Ukjent postnummer slår av avstandssjekken

**Funnet i:** `lib/matching/dealbreaker.ts:159–165`, `cheapFeatures.ts:177–178`,
`app/api/profile/setup/route.ts:98`

**Hva:** Gir `lookupPostalCode` `null` (postboks, nytt nummer, skrivefeil),
blir `latitude/longitude` `null`, og radius blokkerer ikke. Brukeren kan bli
matchet med noen 1 500 km unna — tross valgt grense på 30 km.

**Løsning:** Avvis ukjent postnummer i onboarding med en rolig melding, eller
blokker matching for brukere uten koordinater. Logg antallet i matcherunden.

---

### V-4 · Kjønns- og legningsvalg er upresise

**Funnet i:** `app/onboarding/steps/Step1Profile.tsx:209–227`,
`lib/matching/dealbreaker.ts:196–219`

**Hva:**
- «Kjemisk tiltrekning» behandles som «alle kjønn» uten at brukeren får vite det.
- Ikke-binære og genderfluide kan velge sitt kjønn, men ingen kan søke
  ikke-binære spesifikt. De matches kun med de som velger «Alle kjønn»
  eller «Kjemisk tiltrekning».
- Ikonene ♂/♀/⚧/🌊 kan oppleves som stereotype.

**Hvorfor det er viktig:** Inkludering og presisjon. Feil her betyr at noen
matches med noen de ikke søker, eller blir usynlige.

**Løsning:** Avklar valgene med George (produktbeslutning). Forklar hva
«Kjemisk tiltrekning» betyr. Vurder «Ikke-binær» som søkevalg.

---

### V-5 · Trygghetsmekanismene har hull

**Funnet i:** `app/api/journey/exit/route.ts`, `lib/journey/endJourney.ts:145`,
`app/settings/page.tsx:518–536`, `app/api/report/route.ts:24–37`

**Hva:**
- **Bevis forsvinner:** «Blokker og avslutt» kaller `endJourney`, som sletter
  alle meldinger. Rapporten overlever, men innholdet den gjelder er borte.
  Moderator kan ikke vurdere en trakasseringsrapport.
- **Rapport kun under aktiv match:** API-et godtar tidligere matcher, men
  grensesnittet finner partner kun via aktiv samtale. Etter blokkering kan
  brukeren ikke rapportere.
- **Rapport-rate-limit i minnet:** `Map` per serverless-instans — virkningsløs
  på Vercel. Bruk `pgCheck`.
- **Ingen bekreftelse på at rapport er lest/behandlet** til brukeren.

**Hvorfor det er viktig:** Trygghet er produktets første prinsipp. En bruker
som opplever trakassering, må kunne rapportere — og rapporten må kunne følges opp.

**Løsning:** Ved rapport eller blokkering: kopier de siste N meldingene til en
bevis-snapshot knyttet til rapporten (tilgang kun for admin, slettes etter
fastsatt frist, beskrevet i personvernerklæringen). Tillat rapport etter
avsluttet match. Bytt til `pgCheck`.

---

### V-6 · E-post: SPF kan avvise support-post, DMARC mangler

**Funnet i:** DNS for `tosom.no` (05.10)

| Post | Verdi |
|---|---|
| SPF | `v=spf1 include:spf.resend.com -all` |
| DKIM (Resend) | Satt (`resend._domainkey`) |
| MX | one.com (`mx1/2/3-proisp-no…`) |
| DMARC | **Mangler** |

**Hva:** SPF godkjenner kun Resend, med `-all` (hard avvisning). Sendes e-post
fra `support@tosom.no` via one.com, vil mottakere avvise den. Uten DMARC er
domenet lettere å forfalske — relevant for en tjeneste der svindlere kan
utgi seg for Tosom.

**Merk:** GEORGE.md og ACT-STATE sier at SPF/DKIM mangler. Det er utdatert —
begge er nå satt.

**Løsning:** Utvid SPF med one.coms include hvis support-post sendes derfra.
Legg til `_dmarc` med `p=none` først, deretter `quarantine`. Test sending
fra support@ og passord-reset.

---

### V-7 · Google Fonts: blokkeres av CSP og sender IP til Google

**Funnet i:** `app/layout.tsx:86–90`, `next.config.js:114–116`

**Hva:** Inter lastes fra `fonts.googleapis.com`. CSP har
`style-src 'self' 'unsafe-inline'` (ikke `fonts.googleapis.com`), så
stilarket blokkeres sannsynligvis — og siden faller tilbake til systemfont.
Lastes det likevel, sendes brukerens IP til Google uten samtykke
(jf. tysk rettspraksis om Google Fonts og GDPR).

**Løsning:** Bruk `next/font/google` (selvhostet ved bygg, ingen ekstern
forespørsel). Fjern `<link>`-taggene. Verifiser i DevTools at Inter lastes.

---

### V-8 · Universell utforming — sannsynlige brudd på WCAG 2.1 AA

**Funnet i:** `app/login/page.tsx:167–186`, gjennomgående stiler

**Hva:**
- Innloggingsfeltene har kun `placeholder`, ingen `<label>` eller `aria-label`.
- Mye tekst med `rgba(255,255,255,0.2–0.35)` på `#0B1520` — kontrast ca.
  1,9–2,9:1 (krav 4,5:1). Eksempel: «Første gang? …» (0,35), juridisk tekst
  på betalingssiden (0,2).
- `outline: none` / `outline-none` på 68 steder — tastaturfokus kan bli usynlig.
- FAQ: `role="button"` på hele elementet, kun `Enter` (ikke mellomrom).
- Uendelig rotasjon av logoen uten sjekk av `prefers-reduced-motion`
  (ACT-STATE nevner det som åpent).

**Hvorfor det er viktig:** Likestillings- og diskrimineringsloven og
tilgjengelighetsforskriften gjelder. Tosom skal være for voksne i alle aldre.

**Løsning:** Legg til labels, hev kontrast på all lesbar tekst til minst
4,5:1, erstatt `outline: none` med synlig `:focus-visible`, respekter
`prefers-reduced-motion`. Kjør axe/Lighthouse og test med VoiceOver.

---

### V-9 · Juridiske tekster: feil lovhenvisning, adressespørsmål, uferdige lenker

**Funnet i:** `config/legal.ts:21–29, 137–166`, `app/vilkar/page.tsx:187–201`

**Hva:**
- Angrerett på digitale tjenester er henvist til **forbrukerkjøpsloven**.
  Riktig er **angrerettloven** (lov 20. juni 2014 nr. 27), særlig § 22 n.
  `config/legal.ts` sier selv at angrerettloven § 22 n er grunnlaget.
- `COMPANY.address = null` — og **skal forbli `null`**. Forretningsadressen er
  også Georges private adresse og skal ikke publiseres på nettstedet, i
  koden eller i dokumentasjonen (beslutning 05.10). E-handelsloven § 8
  stiller krav om geografisk adresse; advokaten må vurdere alternativ
  (f.eks. kontoradresse, postboks eller forretningsadressetjeneste).
- Fire av lovlenkene peker kun til `https://lovdata.no/` (forsiden).
- Årstall i etikettene stemmer ikke med ACT-STATE (personvernloven, forbrukerkjøpsloven).
- DPA og DPIA i `docs/legal/` er ikke signert eller gjennomgått av advokat.

**Løsning:** Rett lovhenvisning til angrerettloven, bruk direkte
lovdata-lenker, la `COMPANY.address` stå som `null`, og få advokatgjennomgang
før lansering — inkludert hvordan adressekravet oppfylles uten privat
adresse (JURIDISK-GRUNNLAG A-1/A-2/A-4).

---

### V-10 · Interne og døde sider er offentlig tilgjengelige

**Funnet i:** live-sjekk av tosom.no (05.10)

<!-- SPRAKREF-START (tabellen siterer bevisst nynorsk fra de berørte sidene) -->
| Sti | Status | Problem |
|---|---|---|
| `/design-system` | 200 | Intern komponentkatalog |
| `/onboarding/payment` | 200 | Gammel abonnementsmodell, nynorsk (se K-7) |
| `/onboarding/access` | 200 | Gammel samtykkeside som ikke lagrer noe; nynorsk («respektar andrar») |
| `/register/vipps` | 200 | Vipps-flyt som ikke er koblet |
| `/blogg`, `/blogg/[slug]` | 200 | Nynorsk, skrivefeil («glemtje»), udokumentert påstand om forskning, ikke lenket |
| `/questions` | 200 | Ikke lenket fra menyen |
| `POST /api/auth/phone/send` | Aktiv | Oppretter brukere med `temp_…@placeholder.local` og lagrer SMS-kode som aldri sendes |
<!-- SPRAKREF-END -->

**Løsning:** Fjern eller beskytt med `notFound()` i produksjon. Rett eller
avpubliser bloggen.

---

### V-11 · Middleware beskytter ikke alle sensitive API-prefikser

**Funnet i:** `middleware.ts:47–62`

**Hva:** `PROTECTED_API_PREFIXES` mangler blant annet `/api/settings`,
`/api/report`, `/api/onboarding`, `/api/dashboard`, `/api/pusher`,
`/api/presence`, `/api/questions`, `/api/analytics`. Rutene jeg leste
(`delete-account`, `report`, `profile/setup`) sjekker sesjon selv, men
forsvar i dybden (A2-prinsippet) mangler. Én glemt sjekk i en ny rute blir
en lekkasje.

**Løsning:** Legg prefiksene til. Legg til en test som krever at alle
`app/api/**/route.ts` enten er dekket av middleware eller eksplisitt
oppført som offentlig.

---

### V-12 · Sensitive onboarding-svar lagres i nettleserens localStorage

**Funnet i:** `app/onboarding/OnboardingFlow.tsx:385–392` (`saveDraft`)

**Hva:** Hele onboarding-utkastet — inkludert tilknytning, grenser og
intimitet — skrives til `localStorage` og blir liggende til «Start reisen»
lykkes. På en delt eller lånt maskin kan neste bruker lese det.

**Løsning:** Bruk kun server-utkastet (finnes allerede, WP2), eller
`sessionStorage`, og tøm ved utlogging. Nevn mellomlagringen i
personvernerklæringen.

---

### V-13 · Språkvakten slipper gjennom tydelig nynorsk

**Funnet i:** `scripts/verify-language.mjs`, live innhold

**Hva:** Vakten er en eksakt ordliste. Flere nynorske former på levende
sider står ikke på listen og passerer. Eksempler (se SPRAKREF-blokken):

<!-- SPRAKREF-START (bevisste nynorsk-eksempler fra levende sider) -->
- `/onboarding/payment`: «Ved å holde fram godtek du …», «rettleien»
- `/onboarding/access`: «Du respektar andrar grenser»
- `/blogg/kompatibilitet`: «sterkare prediktorar», «Tosom vel å fokusere», «to menneske»
- `/blogg/reisetemaer`: «Psykologar», «det tek omtrent», «handlar»
- `app/api/cron/journey/route.ts:178` (varsel til bruker): «Reisa di er fullført … gav 30 dager»
<!-- SPRAKREF-END -->

**Hvorfor det er viktig:** Grønn språkvakt gir falsk trygghet, og
brukervendt tekst er det som teller.

**Løsning:** Rett tekstene (eller fjern sidene, V-10). Utvid ordlisten med
treffene. Vurder en manuell språkgjennomgang av alle brukervendte strenger
før lansering.

---

### V-14 · SEO og metadata: døde lenker og manglende delingsbilde

**Funnet i:** `app/sitemap.ts`, `app/layout.tsx:58–75`, live-sjekk

**Hva:**
- `/og-image.png` gir **404** — deling på Facebook, LinkedIn og Slack viser
  ikke bilde.
- `sitemap.xml` lister `/match` og `/journey` (begge **404**) og private
  sider (`/dashboard`, `/profile`, `/onboarding`), men ikke de offentlige
  (`/hvorfor`, `/slik-fungerer-det`, `/reisen`, `/metoder`, `/priser`,
  `/trygghet`, `/faq`, `/om-oss`, `/kontakt`, `/vilkar`, `/personvern`).
- `verification.google = "google-site-verification"` er en plassholder.
- `keywords` inneholder «dating», men produktet sier eksplisitt at det ikke
  er en datingapp.

**Løsning:** Legg til `public/og-image.png` (1200×630). Skriv sitemap om til
offentlige sider. Fjern eller fyll inn verifiseringen.

---

### V-15 · Tone og troverdighet på innloggingssiden

**Funnet i:** `app/login/page.tsx:121–163, 237, 260`

**Hva:**
- «… prøver vi fortsatt å finne ut hva som kom først – egget eller høna! 😊»
  — bryter tonen (rolig, moden, trygg; ingen slang).
- «Under oppbygging … plattformen er ikke helt klar for bruk enda» — riktig
  for beta, feil ved lansering. «enda» bør være «ennå».
- «Alderkontroll» → «Alderskontroll» (og påstanden er usann i dag, K-7).
- «Velg et passord» som plassholder også for eksisterende brukere.
- «Kunne ikke logge inn. Prøv igjen.» skiller ikke mellom feil passord og
  andre feil — og hjelper ikke en som har glemt passordet (K-6).

**Løsning:** Skriv siden om for lanseringen i ToSom-tone, uten spøk og
uten forbehold som ikke lenger gjelder.

---

### V-16 · Vercel-plan og cron-tidsplaner må bekreftes

**Funnet i:** `vercel.json`, Vercel-dokumentasjonen om cron-grenser

**Hva:** Matcherunden har `0 2,3,4 * * 6` (tre kjøringer lørdag).
Vercel Hobby tillater kun cron som kjører **én gang per døgn**, og slike
uttrykk feiler ved deploy. Enten er prosjektet på Pro (da kunne journey-cron
kjørt timevis, jf. K-4), eller så deployes ikke denne konfigurasjonen.
Watchdog-meldingen sier «03:00 lørdag», `config/legal.ts` sier `hour: 3`,
cron sier 02 UTC (04 norsk sommertid).

**Løsning:** Bekreft plan i Vercel og at siste deploy er grønn. Samordne
tidspunktene i kode, tekst og dokumentasjon.

---

### V-17 · Ytelse er ikke målt på nytt

**Funnet i:** `docs/NeedAttention.md` (Teste.no 06.09: INP 384 ms, krav < 200 ms)

**Hva:** Landingssiden har siden fått roterende og pulserende logo
(`ResonanceMark` med `orbit`, `glow`, `resonate`) og `filter: blur(120px)`
på en fullskjerms bakgrunn — begge kjente kilder til dårlig INP og
batteribruk på mobil.

**Løsning:** Mål INP/LCP/CLS på mobil før lansering. Vurder å stoppe
animasjonen etter første syklus og respektere `prefers-reduced-motion`.

---

## 4. 🟡 MINDRE FORBEDRINGER — kan utsettes

| # | Funn | Hvor | Neste handling |
|---|---|---|---|
| M-1 | `MatchBreakdown` viser score i prosent med fargekoding. Ikke rendret noe sted i dag, men bryter I-12 hvis den tas i bruk | `components/MatchBreakdown.tsx:96–104` | Slett, eller bytt til `toDimensionLabel` |
| M-2 | Egen fasetabell i `journey/progress/advance` — ACT-PIPELINE §5.3 sier én kilde (`lib/journey/engine.ts`) | `app/api/journey/progress/advance/route.ts:81–86` | Importer `getPhaseForDay` fra engine |
| M-3 | `client_public.key` og `server_public.key` er sporet i git, men står i `.gitignore` | rotnivå | Avklar om de trengs; `git rm --cached` |
| M-4 | `access-control-allow-origin: *` på HTML-sider | live-hoder | Fjern for ikke-API-ruter |
| M-5 | Død kode i settings (`SlettKontoSection`, `GoldToggle`, `MatchSection`) inneholder samme slettefeil som K-1 | `app/settings/page.tsx:900+` | Slett når K-1 rettes |
| M-6 | Utdatert dokumentasjon: GEORGE.md (SPF/DKIM), STATUS-REPORT (magic link, 5 faser, AI-spørsmål), kapasitet «7 200» | `GEORGE.md`, `docs/STATUS-REPORT.md` | Oppdater eller arkiver |
| M-7 | ACT-STATE `verifiedFlow.ikkeLenket` sier at `/trygghet` og `/metoder` ikke er lenket. Begge står nå i hovedmenyen — tilstandsfilen er utdatert | `components/layout/UniversalMenu.tsx:23, 26` | Fjern `ikkeLenket` fra ACT-STATE |
| M-8 | Sentry: `onRouterTransitionStart` mangler i `instrumentation-client.ts`; `disableLogger` er utfaset | lint-utdata 05.10 | Følg Sentrys anvisning |
| M-9 | `next lint` er utfaset i Next.js 16 | lint-utdata | Migrer til ESLint CLI før oppgradering |
| M-10 | Admin-panelet viser fortsatt «Djupere (22-30)» (åpent i ACT-STATE) | `app/admin/(panel)/dashboard/page.tsx:180` | Avgjøres av George |
| M-11 | `untracked`: `agent/` (fra et annet arbeidsområde), `ads/`, `nohup.out` i rotnivå | rotnivå | Legg i `.gitignore` eller flytt |

---

## 5. 🔵 VIPPS — eget kontrollpunkt (ikke regnet som lanseringsfeil)

Vipps er ikke ferdig integrert. Det er en bevisst beslutning, ikke en feil.
Men når Vipps kobles på, må følgende være sant samtidig:

- [ ] Vipps Login fungerer i produksjon (`NEXT_PUBLIC_VIPPS_ENABLED=true`)
- [ ] Alder hentes fra Vipps og valideres mot `MIN_AGE` (21) — I-14 blir reell
- [ ] `age: 25` hardkodet i `lib/auth/config.ts:75, 138` fjernes
- [ ] `termsAcceptedAt` / `termsVersion` settes i Vipps-callback med `TERMS_VERSION` (i dag hardkodet `'2026-08-15'`)
- [ ] CredentialsProvider fjernes eller begrenses (avgjøres av George), og K-6 er løst i mellomtiden
- [ ] Vipps Betaling 349 kr fungerer; `PAYMENTS_ENABLED=true` kun etter verifisert betaling
- [ ] Angrerett-samtykke før betaling (angrerettloven § 22 n) — avklart av advokat (JURIDISK-GRUNNLAG A-1)
- [ ] Gratiskvoten (5 000) og overgangen til betaling er testet ende-til-ende
- [ ] Vilkår og personvern nevner Vipps som behandler; DPA med Vipps signert
- [ ] Teksten «Hvorfor Vipps: Alderskontroll» på innloggingssiden er sann
- [ ] `/register/vipps` og den døde callback-koden (`app/api/auth/vipps/callback`, kommentert som død i S-2) er erstattet av den reelle flyten

---

## 6. ✅ AVKRYSNINGSLISTE FØR LANSERING

**Før lansering** = blokkerer offentlig lansering.
**Kan utsettes** = krever Georges eksplisitte godkjenning for å utsettes.

### 6.1 Personvern og samtykke

| | Punkt | Ref | Prioritet |
|---|---|---|---|
| [x] | Kontosletting virker ende-til-ende, med feilmelding ved feil *(✓ 2026-10-05 · PL-01)* | K-1 | **Før lansering — og før flere testere** |
| [ ] | Brukere som har forsøkt å slette seg, er slettet manuelt og informert | K-1 | **Før lansering** |
| [x] | Integrasjonstest for kontosletting med aktiv reise *(✓ 2026-10-05 · PL-01d, kjørt mot test-DB)* | K-1 | **Før lansering** |
| [ ] *(klar for George · PL-02)* | Aktiv aksept av vilkår + uttrykkelig samtykke til særlige kategorier | K-2 | **Før lansering — og før flere testere** |
| [ ] *(klar for George · PL-02)* | `termsAcceptedAt` / `termsVersion` lagres for alle nye brukere | K-2 | **Før lansering** |
| [ ] *(klar for George · PL-02)* | Eksisterende brukere bes om samtykke ved neste innlogging | K-2 | **Før lansering** |
| [x] | FAQ og personvern beskriver faktisk databehandling (IP, tredjeparter) | K-7 | **Før lansering** (PL-09: FAQ IP/tredjeparter + personverntabell Vercel/Cloudflare/Neon/Resend; Upstash fjernet — ikke konfigurert i prod) |
| [ ] | Google Fonts selvhostet via `next/font` | V-7 | **Før lansering** |
| [ ] | Onboarding-utkast ikke lenger i `localStorage` | V-12 | Kan utsettes |
| [ ] | DPA og DPIA gjennomgått av advokat og signert | V-9 | **Før lansering** |

### 6.2 Trygghet

| | Punkt | Ref | Prioritet |
|---|---|---|---|
| [x] | Partnerens profilbilde skjult før dag 15 i alle API-svar | K-8 | **Før lansering** |
| [x] | `PUT /api/profile` har CSRF og URL-validering (eller `photos` fjernet) | K-8 | **Før lansering** |
| [ ] | Bevis bevares ved rapport/blokkering | V-5 | **Før lansering** |
| [ ] | Rapport mulig også etter avsluttet match | V-5 | **Før lansering** |
| [ ] | Rapport-rate-limit flyttet til `pgCheck` | V-5 | Kan utsettes |
| [ ] | Rutine for behandling av rapporter (hvem, hvor raskt, hva skjer) er skriftlig | V-5 | **Før lansering** |

### 6.3 Matchingmotoren

| | Punkt | Ref | Prioritet |
|---|---|---|---|
| [x] | Ubesvarte skalaspørsmål gir ikke høy resonans; tilknytningsstil krever data | K-3 | **Før lansering** (PL-08: scoreAll({}) ikke «fearful» — terskler > 3.0; flat×flat verdier = 50; tom×tom klampes til MODERATE) |
| [x] | Skalaspørsmål påkrevd per steg (eller tydelig fallback) | K-3 | **Før lansering** (PL-08: påkrevde svar i alle 5 skalasteg + server krever alle 44 items; fallback: profiler uten skalasvar max MODERATE) |
| [ ] | Avklart hvilke dealbreakere som skal være aktive; inaktive fjernet eller koblet til data | V-1 | **Før lansering** |
| [ ] | Brukerens valgte grenser (`neverCrossBoundary`) brukes, eller teksten lover ikke at de gjør det | V-1 | **Før lansering** |
| [ ] | Beslutning om barn som dealbreaker | V-2 | Kan utsettes (beslutning kreves) |
| [ ] | Ukjent postnummer avvises eller blokkerer matching | V-3 | **Før lansering** |
| [ ] | Kjønns- og søkevalg avklart og forklart | V-4 | **Før lansering** |
| [ ] | Score- og nivåfordeling fra siste matcherunde gjennomgått i admin | — | **Før lansering** |

### 6.4 Reisen

| | Punkt | Ref | Prioritet |
|---|---|---|---|
| [ ] | Verifisert i prod-DB at `day` følger kalenderen og er lik for begge partnere | K-4 | **Før lansering** |
| [ ] | Dagframrykk deterministisk (midnatt eller beregnet fra start), begge partnere samtidig | K-4 | **Før lansering** |
| [ ] | Bildesperren løftes dag 15 for begge, testet med ekte par | K-4, K-8 | **Før lansering** |
| [ ] | Brukervarselet ved dag 30 skrevet på bokmål | V-13 | **Før lansering** |

### 6.5 Innlogging og konto

| | Punkt | Ref | Prioritet |
|---|---|---|---|
| [x] | Rate limiting på innlogging | K-6 | **Før lansering** |
| [x] | Minstekrav til passord | K-6 | **Før lansering** |
| [x] | «Glemt passord» virker ende-til-ende (e-post leveres, nytt passord settes) — *(klar for George · PL-07)* | K-6, V-6 | **Før lansering** |
| [x] | Ingen stille kontoopprettelse ved skrivefeil | K-6 | **Før lansering** |
| [x] | Passordløse kontoer kan ikke overtas | K-6 | **Før lansering** |
| [x] | Innloggingsfelt har labels | V-8 | **Før lansering** |

### 6.6 Innhold og språk

| | Punkt | Ref | Prioritet |
|---|---|---|---|
| [x] | «Én match innen 24 timer» fjernet overalt (meta, OG, JSON-LD, llms.txt) | K-7 | **Før lansering** (PL-09: «én gjennomtenkt match i uken»; grep viser kun kontakt-svar) |
| [x] | FAQ stemmer med produktet (anonymitet, e-post, IP, sletting) | K-7 | **Før lansering** (PL-09: fornavn+alder synlig, bilder dag 15, matchen venter ved innlogging, ingen match-e-post, IP/tredjeparter ærlig, sletting beholdt per PL-01) |
| [x] | `/metoder` og llms.txt beskriver tilknytningsspørsmålene ærlig | K-7 | **Før lansering** (PL-09: «Tilknytning (egne spørsmål)», ingen «ECR», kilde-liste beholdt) |
| [ ] | Innloggingssiden skrevet for lansering (uten spøk, uten «under oppbygging») | V-15 | **Før lansering** |
| [ ] | Bloggen rettet eller avpublisert | V-10, V-13 | **Før lansering** |
| [ ] | Manuell språkgjennomgang av alle brukervendte sider | V-13 | **Før lansering** |
| [ ] | Vilkår: angrerettloven og direkte lovlenker | V-9 | **Før lansering** |
| [ ] | Adressekravet avklart med advokat — privat adresse publiseres ikke | V-9 | **Før lansering** |
| [ ] | Juridiske tekster gjennomgått av advokat | V-9 | **Før lansering** |

### 6.7 Teknisk kvalitet og sikkerhet

| | Punkt | Ref | Prioritet |
|---|---|---|---|
| [x] | Kritiske og høye sårbarheter i `next`, `next-auth`, `@auth/*` rettet | K-5 | **Før lansering** |
| [ ] | Øvrige høye sårbarheter (nodemailer, uploadthing, sharp, postcss) rettet eller vurdert | K-5 | **Før lansering** |
| [ ] | Interne og døde sider fjernet eller 404 i prod | V-10 | **Før lansering** |
| [ ] | `POST /api/auth/phone/send` deaktivert | V-10 | **Før lansering** |
| [ ] | Manglende API-prefikser i middleware | V-11 | Kan utsettes |
| [ ] | `og-image.png` finnes; sitemap viser offentlige sider | V-14 | **Før lansering** |
| [ ] | WCAG 2.1 AA: kontrast, fokus, labels, redusert bevegelse | V-8 | **Før lansering** |
| [ ] | Manuell test på iOS Safari, Android Chrome, desktop Chrome/Firefox/Safari | §1.2 | **Før lansering** |
| [ ] | Ingen konsollfeil på hovedsidene (innlogget og utlogget) | §1.2 | **Før lansering** |
| [ ] | INP < 200 ms på mobil | V-17 | Kan utsettes |
| [ ] | E2E (Playwright) grønn i CI | §1.2 | **Før lansering** |
| [ ] | `npm run build` grønn | — | **Før lansering** |

### 6.8 Drift

| | Punkt | Ref | Prioritet |
|---|---|---|---|
| [ ] | Vercel-plan bekreftet; cron-tidsplaner gyldige for planen | V-16 | **Før lansering** |
| [ ] | `prisma migrate status` mot prod-URL viser alle migrasjoner applied | GEORGE.md | **Før lansering** |
| [ ] | Testbrukere (test1/test2) slettet fra prod | GEORGE.md | **Før lansering** |
| [ ] | `ADMIN_PASSWORD_HASH`, `ADMIN_JWT_SECRET`, `ADMIN_EMAIL` satt | GEORGE.md | **Før lansering** |
| [ ] | `DEV_LOGIN_ENABLED` ikke `true` i prod; `/dev-login` redirecter (bekreftet 05.10) | — | **Før lansering** |
| [ ] | `PAYMENTS_ENABLED` ikke `true` før Vipps er verifisert | §5 | **Før lansering** |
| [ ] | `ENABLE_CSRF_PROTECTION=true` i prod | GEORGE.md | **Før lansering** |
| [ ] | DMARC lagt til; SPF dekker alle avsendere | V-6 | **Før lansering** |
| [ ] | support@ mottar og kan svare (testet) | V-6 | **Før lansering** |
| [ ] | Backup gjenopprettet minst én gang (ACT-PIPELINE §10) | — | **Før lansering** |
| [ ] | Sentry uten uløste kritiske feil siste 14 dager | §1.2 | **Før lansering** |
| [ ] | `DATABASE_URL` rotert (ble delt i chat 03.09, jf. ACT-STATE) | ACT-STATE | **Før lansering** |

### 6.9 Vipps

| | Punkt | Ref | Prioritet |
|---|---|---|---|
| [ ] | Alle punkter i §5 oppfylt | §5 | **Før aktivering av Vipps** (ikke lanseringsfeil) |

---

## 7. 🔁 REGRESJONSTESTING ETTER RETTING

### 7.1 Alltid — etter hver patch (ACT-PIPELINE §10)

```bash
npm run verify                      # språkvakt + tsc --noEmit + jest --ci --silent
npx next lint --max-warnings 0
npm run build                       # før deploy
```

**Ved matching-endring:** `unified-scorer` · `dealbreaker` · `radius-dealbreaker-b14` ·
`sjekk9-reject-counters` · `matching-score-round`
**Ved journey-endring:** `journey-engine` · `journey-queue-exit-b8`
**Ved auth-endring:** `admin-authorization` · `cron-auth` · `middleware-cookie-salt` ·
`pusher-auth-private-channel` · `csrf-client-coverage`

### 7.2 Nye tester som skal skrives (én per funn)

| Funn | Test | Forventet |
|---|---|---|
| K-1 | `__tests__/delete-account.test.ts` (integrasjon) | Med aktiv reise: `User`, `Profile`, `Message`, `Conversation`, `JourneyProgress` borte; `MatchHistory` beholdt; partner tilbake til IDLE. Uten body → 400 og ingenting slettet |
| K-1 | Frontend-test eller e2e | Feil fra API → feilmelding vises, ingen `signOut` |
| K-2 | `__tests__/consent-required.test.ts` | Ny bruker uten samtykke kan ikke lagre onboarding; med samtykke settes `termsVersion === TERMS_VERSION` |
| K-3 | Utvid `unified-scorer.test.ts` | Tom × tom gir ikke `STRONG`/`DEEP`; tom profil gir ikke stil `fearful`; flat verdiprofil gir ikke 100 |
| K-4 | `__tests__/journey-day-advance.test.ts` | Kjøring kl. 00:05 to dager på rad → `day` øker med 1 hver gang; begge partnere har lik `day` |
| K-6 | `__tests__/login-rate-limit.test.ts` | 11. feilforsøk innen 15 min → avvist; passord < 10 tegn → avvist ved registrering |
| K-8 | `__tests__/photo-lock-before-day15.test.ts` | Partnerens `photoUrl` er `null` i `chat/conversations`, `chat/messages` og `match/status` før `imageShareAllowedAt` |
| V-1 | Utvid `dealbreaker.test.ts` | Aktive dealbreakere treffer med data fra faktisk `profile/setup`-format (ikke bare fixtures) |
| V-3 | Utvid `radius-dealbreaker-b14.test.ts` | Ukjent postnummer håndteres etter valgt regel |
| V-5 | `__tests__/report-evidence.test.ts` | Rapport + blokkering → bevis-snapshot finnes for admin; meldinger slettet for brukerne |
| V-11 | `__tests__/api-route-coverage.test.ts` | Alle `app/api/**/route.ts` er beskyttet av middleware eller oppført som offentlig |

### 7.3 Manuell regresjon før lansering (to nettlesere, to testkontoer)

| # | Steg | Forventet |
|---|---|---|
| 1 | Ny konto | Samtykke kreves; vilkår og personvern kan åpnes |
| 2 | Feil passord 11 ganger | Midlertidig sperret, med rolig melding |
| 3 | «Glemt passord» | E-post kommer fram; nytt passord virker |
| 4 | Onboarding, hopp over skalaspørsmål | Hindres, eller tydelig at det påvirker matchingen |
| 5 | Ukjent postnummer | Rolig melding; profilen lagres ikke med `null`-koordinater |
| 6 | Fullfør onboarding, still i kø | `/matching` viser ventetekst med «natt til lørdag» |
| 7 | Kjør matching manuelt (`/admin/tools`) | Paret kobles; nivå gir mening ut fra profilene |
| 8 | Chat dag 1–14 | Ingen profilbilde av partneren noe sted |
| 9 | Kjør journey-cron to påfølgende døgn | Dag øker med 1 hver gang, lik for begge |
| 10 | Dag 15 | Bildedeling åpnes for begge |
| 11 | Rapporter, deretter blokker | Rapport lagres med bevis; blokkering avslutter; ny rapport fortsatt mulig |
| 12 | Slett konto med aktiv reise | Bekreftelse; data borte i DB; partner informeres rolig og går tilbake til kø |
| 13 | Tastatur-only gjennom login og onboarding | Synlig fokus hele veien; alt nåbart |
| 14 | VoiceOver på iPhone | Felt og knapper har meningsfulle navn |
| 15 | Del forsiden i Slack/Facebook | Forhåndsvisning med bilde og riktig beskrivelse |
| 16 | `curl` interne stier (`/design-system`, `/onboarding/payment`, `/blogg`) | 404 |
| 17 | `npm audit --omit=dev` | Ingen kritiske; høye vurdert og dokumentert |

---

## 8. Anbefalt rekkefølge

Hver retting følger ACT-PIPELINE: plan → godkjenning → én fil per patch →
`npm run verify` mellom hver. Funn som berører sletting, auth, matching,
journey-kadens eller en invariant krever Georges godkjenning før patch.

**Uke 1 — beskytt dagens brukere**
1. K-1 Kontosletting (frontend → backend → test)
2. K-2 Samtykke og vilkårsaksept
3. K-8 Bildesperre for profilbilde
4. K-5 Sikkerhetsoppdatering av `next` og `next-auth`
5. Rotér `DATABASE_URL`

**Uke 2 — gjør løftene sanne**
6. K-4 Verifiser reisedagene i prod, deretter rett framrykket
7. K-3 + V-1 Matchingdata (krever beslutning fra George)
8. K-6 Innlogging (rate limit, passordkrav, reset-e-post)
9. K-7 + V-15 + V-13 Tekster, FAQ, innloggingsside, blogg

**Uke 3 — kvalitet og tillit**
10. V-5 Trygghet (bevis, rapport etter match)
11. V-8 Universell utforming
12. V-9 Juridisk + advokat
13. V-6, V-7, V-10, V-14, V-16 Drift og opprydding
14. Full manuell regresjon (§7.3)

**Deretter:** Vipps (§5), så ny lanseringsvurdering mot denne sjekklisten.

---

## 9. Til slutt

Tosom er bygget med mer omhu enn de fleste produkter på dette stadiet.
Konseptet er tydelig, invariantene er gjennomtenkte, og mye av koden er solid.

Men et produkt som ber mennesker beskrive hva som gjør dem utrygge, må selv
være trygt. Det må slette når det sier at det sletter. Det må spørre før det
behandler det mest personlige. Og når det sier «Sterk resonans», må det være sant.

Ingenting av dette er uoverkommelig. Det er konkrete, avgrensede rettinger.
Når de er gjort og sjekklisten er krysset av, er Tosom klar til å møte mennesker
på den måten det er ment.

---

*Ikke kanonisk. Ved motstrid: koden først, deretter `TOSOM-SUPER-MASTERPLAN-v2.0.md`.
Neste vurdering: etter at alle «Før lansering»-punkter i §6 er krysset av.*

