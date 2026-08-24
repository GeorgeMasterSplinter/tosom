# TOSOM — JURIDISK GRUNNLAG v1.0

**Dato:** 2026-08-21
**Commit:** `0cd8007`
**Status:** Internt arbeidsdokument. Ikke brukervendt.
**Formål:** Grunnlag for vilkår, personvernerklæring og trygghetsside — og brief til advokat.
**Kanonisk kilde:** `TOSOM-SUPER-MASTERPLAN-v2.0.md`

---

## 0. Om dokumentet

Dette er ikke juridisk rådgivning. Det er en **kartlegging av hva plattformen faktisk gjør**, hvilke løfter som gis, og hvor det er avvik mellom de to.

Formålet er todelt:

1. Sikre at vilkår og personvernerklæring beskriver virkeligheten — ikke en idé om den
2. Gi advokaten et presist utgangspunkt, slik at honoraret går til vurdering og ikke til kartlegging

Alle funn er verifisert mot kode med fil og linjenummer.

⚠️ **Alt i del III må vurderes av jurist før lansering.**

---

# DEL I — FUNN OG RETTINGER

## 1. Motsigelser funnet 2026-08-21

### 🔴 Rettet i denne runden

| ID | Funn | Sted | Retting |
|---|---|---|---|
| M-1 | **Aldersgrense i to versjoner.** Vilkår sa 21, kode avviste under 23. | `lib/validation/onboarding-setup.ts:17,30,31` · `lib/validation/api.ts:113` · `lib/validation/profile.ts:9,24` · `lib/api/validation.ts:73` · `Step9Oppsummering.tsx:53` | Alle satt til **21** |
| M-2 | **Gratistilbud i to versjoner.** Landing sa 5 000, betaling sa 10 000. | `app/(landing)/page.tsx:288` · `app/betaling/page.tsx:5,77,202` | «10 000» fjernet. Kun **5 000**, og kun på `/priser` som framtidig modell |
| M-3 | **Pris markedsført uten betalingsvei.** `PAYMENTS_ENABLED=true` kaster fatal feil. | `config/features.ts:38` | Pris fjernet fra landing, betaling og register mens beta pågår |
| M-4 | **«Betal med Vipps»-knapp som ikke betaler.** Pekte på `/api/payment/vipps` — død kode. | `app/register/page.tsx:182,186` | Endret til `/api/auth/vipps` og «Logg inn med Vipps» |
| M-5 | **Tre e-postadresser for samme formål.** | `vilkar`, `personvern`, `cookies` | Kun **support@tosom.no** |

**Verifisert:** `npx tsc --noEmit` rent · `npx jest --ci` 231/231 grønne.

### 🟠 Rettes i J-2 … J-4

| ID | Funn | Sted |
|---|---|---|
| M-6 | Vilkår oppgir fortsatt 349 kr uten forbehold om beta | `app/vilkar/page.tsx:92` |
| M-7 | Angrerett beskrevet ulikt tre steder | `vilkar:122` · `onboarding/payment:221` · `betaling` |
| M-8 | Ingen organisasjonsnummer eller forretningsadresse | Alle juridiske sider |
| M-9 | Personvernerklæring nevner ikke særlige kategorier (GDPR art. 9) | `app/personvern/page.tsx` |
| M-10 | Ingen liste over databehandlere | `app/personvern/page.tsx` |
| M-11 | Datatilsynet ikke nevnt som klageinstans | `app/personvern/page.tsx` |
| M-12 | Ingen trygghetsside finnes | — |
| M-13 | «Forskningsbasert» brukt fem steder uten dokumentasjon | Se §4 |
| M-14 | `termsVersion` hardkodet `'2026-08-15'` to steder | `api/auth/phone/send` · `api/auth/vipps/callback` |

---

## 2. Hva plattformen faktisk behandler

### Verifisert mot `prisma/schema.prisma` (32 modeller)

**Identifiserende — `User`**
`email`, `name`, `password` (bcrypt), `phone`, `phoneVerified`, `role`, `journeyState`, `bannedAt`, `deletedAt`, `termsAcceptedAt`, `termsVersion`, `withdrawalWaiverAt`, `lastMatchAt`, `lockedUntil`

**Profil — `Profile`**
`firstName`, `lastName`, `age`, `identityName`, `photoUrl`, `bio`, `interests`, `lifeSituation`, `lifestyle`, `personality`, `relationshipStyle`, `communication`, `futureVision`, `lifeRhythm`, `maturityLevel`

**🔴 Særlige kategorier — GDPR artikkel 9**

| Felt | Hvorfor art. 9 |
|---|---|
| `intimacy` (Json) | Opplysninger om seksualliv og seksuell orientering |
| `emotionalNeeds` (Json) | Kan avdekke psykisk helse |
| `boundaries` (Json) | Kan avdekke tidligere overgrep eller traumer |
| `securityLevel` | Kan avdekke psykisk helse |
| Onboarding steg 7 «Intimitet & nærhet» | Uttrykkelig om seksualliv |
| Onboarding «helse (frivillig)» | Helseopplysninger |
| `religion` | Religiøs overbevisning |
| `seekingGender` + `gender` | Kan utlede seksuell orientering |

**Dette er det viktigste funnet i hele kartleggingen.** Art. 9 krever *uttrykkelig* samtykke etter art. 9(2)(a) — ikke aksept av vilkår. Det må innhentes særskilt, med egen avkryssing og egen forklaring, før onboarding steg 7.

**Kommunikasjon**
`Message` (`content`, `imageKey`, `createdAt`), `Conversation` (`lastMessagePreview`, `mood`, `imageShared`)

**Geodata**
Postnummer, by, `distancePref`. Ingen presis GPS-posisjon.

**Sikkerhet og moderering**
`Report`, `UserBlock`, `SystemLog`, `AuditLog`

### Databehandlere — verifisert i `package.json` og `config/env.ts`

| Tjeneste | Mottar | Lokasjon |
|---|---|---|
| Sentry | Feilmeldinger, teknisk kontekst. PII skrubbes (`sentry-pii-scrub-s16.test.ts`) | Må avklares |
| Vipps | Identitet, alder ved innlogging | Norge |
| Pusher | Sanntidsmeldinger i chat | Må avklares |
| Cloudflare R2 / S3 | Bilder | Må avklares |
| Upstash Redis | Rate limiting, IP | Må avklares |
| Nodemailer + leverandør | E-postadresse, innhold i magic link | Må avklares |
| Hosting (Vercel eller egen) | All data | Må avklares |

**Databehandleravtale kreves med hver av disse.** Lokasjon må fastslås før erklæringen skrives — det avgjør om art. 44–49 om overføring utenfor EØS kommer til anvendelse.

### Sletting — implementert

Verifisert i `__tests__/privacy-anonymize-s10.test.ts` og `privacy-retention-s10.test.ts`.

`Report` har bevisst ingen fremmednøkkel til `User` — rapporter overlever sletting av bruker. Dette er riktig for dokumentasjonsplikt, men **må nevnes i personvernerklæringen**.

---

## 3. Trygghetsrutiner — hva som finnes

### Verifisert i kode

| Rutine | Status | Sted |
|---|---|---|
| Rapportering | ✅ Implementert | `POST /api/report` |
| Kategorier | ✅ HARASSMENT, INAPPROPRIATE, SPAM, FAKE_PROFILE, OTHER | `enum ReportCategory` |
| Rate limit på rapport | ⚠️ 3/min, **in-memory** — kommentert som «bør erstattes med Upstash i prod» | `app/api/report` |
| Krav om relasjon | ✅ Må ha match eller matchhistorikk med den rapporterte | `app/api/report` |
| Varsling av drift | ✅ `sendAlert()` → webhook eller e-post | `lib/observability/alert.ts` |
| Blokkering | ✅ `UserBlock` | `prisma/schema.prisma` |
| Utestengelse | ✅ `User.bannedAt` | `prisma/schema.prisma` |
| Frysing av samtale | ✅ `Conversation.frozenAt`, `frozenBy` | `prisma/schema.prisma` |
| Aldersverifisering | ✅ Vipps/BankID + validering | Nå 21 overalt |
| Bildesperre til dag 15 | ✅ Håndhevet og testet | `chat-image-lock-m6.test.ts` |

### 🔴 Mangler

| # | Mangel | Konsekvens |
|---|---|---|
| T-1 | Enkeltmeldinger og bilder kan **ikke** rapporteres — kun personer | Ved upassende bilde må hele brukeren rapporteres |
| T-2 | Ingen automatisk innholdskontroll av bilder | Alt beror på rapportering i etterkant |
| T-3 | Rate limit på rapportering er in-memory | Nullstilles ved omstart, virker ikke på tvers av instanser |
| T-4 | Ingen definert svartid på rapporter | Bør stå i trygghetsrutinen |
| T-5 | Ingen trygghetsside for brukere | Rutinene finnes, men er usynlige |

T-1 og T-2 bør vurderes før åpen lansering. Under lukket beta med ti inviterte er risikoen lav og håndterbar.

---

## 4. Markedsføringspåstander — risiko

Markedsføringsloven § 3 andre ledd krever at påstander kan dokumenteres.

### 🔴 «Forskningsbasert» — fem steder, null kilder

| Fil | Linje | Tekst |
|---|---|---|
| `app/(landing)/page.tsx` | 79 | «Forskningsbasert matching» |
| `app/(landing)/page.tsx` | 80 | «Vi matcher på livssituasjon, verdier, relasjonsstil og emosjonell kompatibilitet» |
| `app/slik-fungerer-det/page.tsx` | 63 | «forskningsbasert og guidet profil» |
| `app/slik-fungerer-det/page.tsx` | 65 | «basert på relasjonspsykologi» |
| `app/priser/page.tsx` | — | «forskningsbasert prosess» |

**Oppdatert 2026-08-22.** Kartleggingen viste at motoren beregner alt med ordoverlapp mellom fritekstsvar — ingen validerte instrumenter var i bruk.

**Valgt løsning: bygge det vi sier.** Beta er utsatt, og motoren bygges om med BFI-10, ECR-S, PVQ-10 og ERQ-6. Se `FORSKNINGSMOTOR-v1.0.md`.

Språket presiseres samtidig, men beholdes: «kortform av Big Five», «prinsipper fra Gottmans forskning». Tekstene skrives **etter** at koden er verifisert — aldri før.


### 🟠 Kvalitetspåstander om utfall

| Påstand | Problem | Forslag |
|---|---|---|
| «én **god** match» | Kvalitetsgaranti | «én match» |
| «noen som **faktisk passer deg**» | Resultatgaranti | «én person, valgt med omtanke» |
| «emosjonell **kompatibilitet**» | Antyder målbar treffsikkerhet | «verdier, livssituasjon og relasjonsstil» |
| «**trygt** rom» | Absolutt sikkerhetsgaranti | «et rom bygget for trygghet» |

### Om ordet «match»

Ordet i seg selv er nøytralt og innarbeidet. Risikoen ligger i **adjektivene rundt det**.

**Prinsippet som skal gjelde gjennomgående:**

> Tosom leverer en kobling og et rom. Tosom lover ikke et resultat.

I vilkårene brukes «kobling» som det juridisk presise begrepet. I markedsføringen kan «match» bli stående — uten kvalitetsord.

---

# DEL II — BESLUTNINGER

## 5. Låst av George 2026-08-21

| # | Beslutning |
|---|---|
| B-1 | Aldersgrense **21 år**. Gjelder alt: vilkår, kode, markedsføring. |
| B-2 | **Beta er gratis for alle inviterte.** Ingen pris vises noe sted mens beta pågår. |
| B-3 | Fra lansering: **første 5 000 gratis**, deretter **349 kr** per reise, betalt én gang. |
| B-4 | Vipps og betaling omtales som **under arbeid** til det virker. |
| B-5 | Kun **support@tosom.no** som kontaktadresse. |
| B-6 | Samtykke skal **versjoneres** via `config/legal.ts`. |
| B-7 | Organisasjonsnummer settes inn når Altinn svarer. Til da: `[ORGNR]` som synlig plassholder. |
| B-8 | Angrerett: **fullt beløp før kobling, ingen etter.** Grensen er koblingen, ikke en dato. Se §6 og A-1. |

## 6. Angreretten — begrunnelse for B-8

### Modellen

| Når | Refusjon |
|---|---|
| Fra betaling til koblingen natt til lørdag | Fullt beløp, uten spørsmål |
| Etter koblingen | Ingen |

Grensen er en **hendelse**, ikke en dato. Registrerer du deg lørdag ettermiddag, har du refusjonsrett hele uken. Registrerer du deg fredag kveld, har du den i noen timer. Samme regel for alle.

### Hvorfor forholdsmessig refusjon ble forkastet

Første utkast foreslo forholdsmessig refusjon innen 14 dager etter kobling. **Det ble forkastet av George, med rette.**

Verdien i Tosom er ikke fordelt jevnt over 30 dager. Den er **front-lastet i koblingen**:

- Det brukeren kjøper er tilgang til én bestemt person
- I det koblingen skjer, er hele produktet levert
- Møtes de dag 1, har de fått alt de betalte for på ett døgn
- Reisen er formatet verdien leveres i, ikke verdien i seg selv

Forholdsmessig refusjon åpner dermed et fullt utnyttbart smutthull: profil torsdag, kobling lørdag, møtes søndag, refusjon dag ti. Brukeren betaler ~116 kr for hele verdien og kan gjenta det ukentlig.

Tosom kan ikke hindre at to voksne møtes dag 1 — og skal heller ikke prøve. Men da kan ikke refusjonsordningen forutsette at verdien leveres gradvis.

### Argumentene for at retten faller bort ved kobling

| # | Argument |
|---|---|
| 1 | **Leveransen er ett øyeblikk.** Koblingen er produktet. Reisen er innpakningen. |
| 2 | **Den er ugjenkallelig.** En annen bruker er tildelt og fjernet fra køen den uken. |
| 3 | **Den berører en tredjeperson.** Motparten har innrettet seg og kan ikke omkobles. |
| 4 | **Full verdi kan realiseres umiddelbart.** Møtes de dag 1, er produktet konsumert. |
| 5 | **Samtykket er uttrykkelig.** Egen avkryssing, egen tekst, lagret som `withdrawalWaiverAt`. |

### Risikoen

Modellen hviler på at reisen regnes som **digitalt innhold** etter § 22 n, der retten faller bort når leveringen *begynner*.

Regnes den som **tjeneste** etter § 22 c, kreves «fullstendig levert» — og en 30-dagers reise er ikke det på dag 1. Da ville fraskrivelsen være ugyldig uansett hvor godt vilkårene er formulert, og § 26 om forholdsmessig betaling ved oppsigelse ville komme inn.

**Dette er den viktigste uavklarte risikoen i hele dokumentet.**

Beta er gratis, så ingenting haster. Men det må være avklart før betaling aktiveres — se A-1.


---

# DEL III — ADVOKAT-BRIEF

## 7. Sju spørsmål

Formulert for å kunne besvares raskt. Bakgrunnen står over, så spørsmålene kan leses alene.

---

### A-1 — Angrerett ved ukentlig kobling 🔴 Viktigst

**Situasjonen:** Brukeren betaler 349 kr for én kobling til én person. Koblingen skjer natt til lørdag. Den andre brukeren tildeles og fjernes fra køen den uken. Sammen med koblingen følger et privat samtalerom og en guidet reise over 30 dager.

**Vår posisjon:** Leveransen er koblingen, ikke de 30 dagene. Reisen er formatet den leveres i. Verdien er front-lastet: velger partene å møtes fysisk dag 1, er hele produktet konsumert på ett døgn.

**Vår modell:** Full refusjon fram til koblingen. Ingen etter. Uttrykkelig samtykke innhentes med egen avkryssing og lagres som `withdrawalWaiverAt`.

**Hvorfor vi forkastet forholdsmessig refusjon:** Den åpner et fullt utnyttbart smutthull. Profil torsdag, kobling lørdag, møtes søndag, refusjon dag ti — full verdi for en tredjedel av prisen, gjentakbart ukentlig. Vi kan ikke hindre at to voksne møtes dag 1, og ønsker heller ikke å prøve.

**Spørsmål:**
1. Er dette «tjeneste» (§ 22 c) eller «digitalt innhold» (§ 22 n)?
2. Holder argumentet om at koblingen utgjør fullstendig levering, gitt at den er ugjenkallelig og båndlegger en tredjeperson?
3. Er modellen i B-8 forsvarlig, eller må vi tilby 14 dagers ubetinget angrerett?
4. Regnes reisen som «tjeneste», kommer § 26 om forholdsmessig betaling inn — hvordan bør det i så fall håndteres uten at ordningen kan utnyttes systematisk?
5. Er samtykketeksten i `app/betaling/page.tsx` tilstrekkelig som «uttrykkelig forhåndssamtykke og erkjennelse»?


---

### A-2 — Særlige kategorier, artikkel 9 🔴 Viktigst

**Situasjonen:** Onboarding samler opplysninger om seksualliv (`intimacy`), mulig psykisk helse (`emotionalNeeds`, `securityLevel`), mulige traumer (`boundaries`), religion og seksuell orientering. Opplysningene brukes kun av matching-motoren og vises aldri til andre brukere.

**Spørsmål:**
1. Bekrefter dere at dette er art. 9-opplysninger?
2. Er uttrykkelig samtykke etter art. 9(2)(a) riktig grunnlag, eller finnes bedre?
3. Hvordan skal samtykket utformes — egen avkryssing før steg 7, eller ved oppstart av onboarding?
4. Kreves personvernkonsekvensvurdering (DPIA) etter art. 35?
5. Kreves personvernombud etter art. 37?

---

### A-3 — Automatisert avgjørelse, artikkel 22

**Situasjonen:** Matching-motoren velger automatisk hvem brukeren kobles med. Ingen manuell vurdering. Brukeren kan ikke velge, og får kun én kobling per runde. Resultatet vises som ord, aldri som tallskår (invariant I-12).

**Spørsmål:**
1. Er dette «automatisert avgjørelse» med rettsvirkning eller tilsvarende betydelig virkning?
2. Hvis ja: hvilke rettigheter må tilbys, og hvordan skal de beskrives?
3. Er det tilstrekkelig at brukeren kan avslutte reisen og stille seg i kø på nytt?

---

### A-4 — Ansvarsbegrensning

**Situasjonen:** Tosom kobler to voksne og tilbyr et digitalt rom. Brukere kan avtale å møtes fysisk. Tosom har ingen bakgrunnssjekk utover Vipps/BankID-verifisert identitet og alder.

**Spørsmål:**
1. Hvordan bør ansvarsbegrensningen formuleres for å beskytte Tosom AS mot krav etter hendelser mellom brukere?
2. Hvilke begrensninger er ugyldige mot forbruker etter norsk rett?
3. Bør vilkårene uttrykkelig fraskrive ansvar for fysiske møter?
4. Er det tilstrekkelig å ikke love bakgrunnssjekk, eller må fraværet uttrykkes eksplisitt?

---

### A-5 — Sletting versus dokumentasjonsplikt

**Situasjonen:** Ved «vi fant hverandre» slettes begge kontoer fullstendig (invariant I-13). `Report` har bevisst ingen fremmednøkkel til `User`, slik at rapporter overlever sletting.

**Spørsmål:**
1. Er det lovlig å beholde rapportdata etter at bruker er slettet?
2. Hvilket grunnlag — berettiget interesse etter art. 6(1)(f), eller rettslig forpliktelse?
3. Hvor lenge kan rapporter oppbevares?
4. Må den slettede brukeren informeres om at rapporten består?

---

### A-6 — «Forskningsbasert»

**Oppdatert 2026-08-22.** Kartleggingen avdekket at motoren i dag beregner alle dimensjoner med **ordoverlapp mellom fritekstsvar**. Ingen validerte instrumenter var i bruk, og påstanden hadde derfor ikke dekning.

**Valgt løsning:** bygge det vi sier, ikke myke språket. Se `FORSKNINGSMOTOR-v1.0.md`.

Motoren bygges om til seks dimensjoner basert på:

| Rammeverk | Instrument | Lisens |
|---|---|---|
| Big Five (kortform) | BFI-10, Rammstedt & John (2007) | Fritt |
| Tilknytning | ECR-S, Wei et al. (2007) | Fritt for ikke-kommersiell bruk |
| Verdier | PVQ-10 etter Schwartz (1992) | Fritt |
| Emosjonsregulering | ERQ-6, Gross & John (2003) | Fritt |
| Kommunikasjon | Egne items på Gottman-*prinsipper* | Vi skriver dem selv |

Beta er utsatt til dette er ferdig. Tekstene skrives **etter** at koden er verifisert.

**Spørsmål:**
1. Med validerte instrumenter faktisk i bruk — er «forskningsbasert matching» da forsvarlig etter markedsføringsloven § 3 andre ledd?
2. Vi bruker **ikke** Gottmans lisensierte skjemaer, kun egne spørsmål bygget på publiserte prinsipper. Er formuleringen «prinsipper fra Gottmans forskning» dekkende, eller bør Gottman-navnet utelates helt?
3. BFI-10 har lavere reliabilitet enn fullversjonen. Er «kortform av Big Five» en tilstrekkelig presisering?
4. ECR-S er «fritt for ikke-kommersiell forskning». Tosom er kommersielt. Kreves lisens, og gjelder det tilsvarende for PVQ og ERQ?
5. Må kildene oppgis på den brukervendte siden, eller holder det at de er dokumentert internt?
6. Kan «resonans» brukes som eget begrep uten at det oppfattes som en påstand om en validert modell?


---

### A-7 — Aldersverifisering og ansvar

**Situasjonen:** Aldersgrensen er 21. Verifisering skjer via Vipps/BankID ved innlogging, samt egenerklæring i onboarding.

**Spørsmål:**
1. Er Vipps/BankID tilstrekkelig for å oppfylle aktsomhetsplikten?
2. Hva er Tosoms ansvar hvis noen under 21 kommer inn ved omgåelse?
3. Bør vilkårene ha en uttrykkelig bestemmelse om dette?

---

## 8. Hva advokaten får

| Dokument | Status når oversendt |
|---|---|
| Dette dokumentet | Ferdig — bakgrunn og spørsmål |
| `/vilkar` | Fullt utkast, klart til gjennomgang |
| `/personvern` | Fullt utkast basert på faktisk datamodell |
| `/trygghet` | Fullt utkast basert på faktiske rutiner |
| `prisma/schema.prisma` | Kan oversendes ved behov for feltnivå |

Målet er at advokaten **retter og bekrefter**, ikke skriver fra bunnen.

---

## 9. Åpne punkter

| # | Punkt | Ansvar |
|---|---|---|
| Å-1 | Organisasjonsnummer fra Altinn | George |
| Å-2 | Forretningsadresse | George |
| Å-3 | Lokasjon for hver databehandler | George / gjennomgang |
| Å-4 | Databehandleravtaler | George |
| Å-5 | Vipps-avtale og betalingsvei | George |
| Å-6 | Vurdering av DPIA-plikt | Advokat (A-2) |
| Å-7 | Rate limit på rapportering til Upstash | Kode (T-3) |
| Å-8 | Rapportering av enkeltmeldinger og bilder | Kode (T-1) — før åpen lansering |

---

## 10. Sluttord

Kartleggingen viser at Tosom **behandler mer sensitive opplysninger enn dokumentene beskriver**, og **lover mer presist enn koden leverer** på noen punkter.

Begge deler er rettbare, og de mest akutte motsigelsene er allerede ute av koden.

Det som gjenstår er å skrive dokumenter som sier sannheten om en plattform som faktisk er bygget for trygghet — og så la en jurist bekrefte at sannheten er godt nok formulert.

---

*Følgedokumenter: `TOSOM-BETA-DRIFTSPLAN-v1.1.md`, `archive/ferdig/ADMIN-KOMMANDOPANEL-v1.0.md`, `LANDING-SIGNATUR-v1.0.md`*
