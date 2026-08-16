# TOSOM-MASTERPLAN-v7.0

**Fra teknisk ferdig til lanseringsklar — nytt konsept, tre runder.**

| | |
|---|---|
| **Dokumentversjon** | 7.0 |
| **Dato** | 16. august 2026 |
| **Verifisert ved commit** | `88d5ad8` |
| **Forrige versjon** | `docs/TOSOM-MASTERPLAN-v6.0.md` (commit `c93b8cb`) |
| **Grunnlag** | `docs/ACT-STATE-v7.json`, `docs/matching-observation-v7.md` |
| **Lukket beta** | **83 %** |
| **Offentlig lansering** | **68 %** |

> Tallene går ned fra v6.0, ikke fordi noe ble ødelagt, men fordi to alvorlige forhold ble oppdaget som ikke var kjent da v6.0 ble skrevet. Del 3 forklarer begge.

---

## Innhold

1. [Utgangspunkt](#1-utgangspunkt)
2. [Verifisert tilstand etter ACT v7](#2-verifisert-tilstand-etter-act-v7)
3. [To funn som ikke sto i rapporten](#3-to-funn-som-ikke-sto-i-rapporten)
4. [Det nye konseptet — ukentlig kadens](#4-det-nye-konseptet--ukentlig-kadens)
5. [Runde A — Fundament](#5-runde-a--fundament)
6. [Runde B — Kadens og konsept](#6-runde-b--kadens-og-konsept)
7. [Runde C — Offentlige flater](#7-runde-c--offentlige-flater)
8. [Vilkår og ordensregler](#8-vilkår-og-ordensregler)
9. [Betaling og angrerett](#9-betaling-og-angrerett)
10. [Lanseringsvurdering](#10-lanseringsvurdering)
11. [Roadmap og konklusjon](#11-roadmap-og-konklusjon)

---

# 1. Utgangspunkt

## 1.1 Hva som er oppnådd

ACT v6 og v7 er de to første syklusene som leverte det de hevdet. Begge låste tolv av tolv steg med null feil, og begge tåler uavhengig etterprøving.

v6 ga systemet evnen til å se seg selv: Sentry koblet i byggetrinnet, alle klientkall mot ekte ruter, fasedefinisjonen samlet i én kilde.

v7 ga systemet evnen til å forklare seg. Avvisningsloggen teller reelt, og matcherunden er observert mot en populasjon med faktisk spredning. Det spørsmålet som hang igjen fra v6 — *kobler motoren riktig, eller kobler den bare?* — er nå besvart.

## 1.2 Hva dette dokumentet gjør

Tre ting.

**Det retter to feil som ingen visste om.** Radiussperren er inaktiv i produksjon, og Tailwind genererer ikke breakpoints i det hele tatt. Begge ble funnet under gjennomgangen av ACT v7, ikke av den.

**Det innfører et nytt konsept.** Fra «match innen 24 timer» til «kø gjennom uken, kobling natt til lørdag». Dette er ikke en teknisk justering — det endrer løftet, og dermed teksten på hver eneste offentlige side.

**Det gjør plattformen presentabel.** Landingsside, vilkår, personvern og ordensregler må stemme med det systemet faktisk gjør, og fungere på telefon.

## 1.3 Hva som ikke endres

Matchemotoren. Journey-motoren. Scoringen. Fasedefinisjonen. Databaseskjemaet, med ett mulig unntak beskrevet i del 5.

Disse er ferdige og verifiserte. Alt arbeid framover skjer rundt dem.

---

# 2. Verifisert tilstand etter ACT v7

## 2.1 Harde prøver ved commit `88d5ad8`

Kjørt på nytt under utarbeidelsen av dette dokumentet.

| Prøve | Resultat |
|---|---|
| `npx tsc --noEmit` | **0 feil** |
| `npx prisma format --check` | OK |
| `npx jest` | **129/129** (opp fra 116) |
| `npm run build` | Grønn |
| `npm run verify:api` | exit 0 |
| `npm run verify:lang` | exit 0 |
| Arbeidstre | Rent |

**Vokterkontrollen er tom:**

```
git diff --stat c93b8cb..HEAD -- lib/matching/ lib/journey/ prisma/ config/matching.ts
```

Ingen utskrift. Matchemotoren, journey-motoren, skjemaet og matchekonfigurasjonen er bit-for-bit urørt gjennom tolv steg. Det var instruksens viktigste regel, og den holdt.

## 2.2 Avvisningsloggen er reell

Avvik A13 er lukket. `grep -c 'rejectReasons\['` gir nå 4, mot 0 før.

Matcherunden i steg 4.2 ga:

| Måling | v6 | v7 |
|---|---|---|
| Avvisninger totalt | 0 | **1442** |
| Årsaker representert | 0 | **5** |
| Par vurdert | ikke talt | **1770** |
| Par opprettet | 19 | 27 |
| Resonansnivåer | 1 (alle DEEP) | **4** |
| Score MIN–MAX | 82–95 | 41–? |

Fordelingen: modenhetsgap 540, score under terskel 344, sikkerhetsnivå 240, livsrytme 179, preferanser 139.

Dette er svaret på det åpne spørsmålet fra v6. **Motoren diskriminerer.** Den avviser flest på modenhetsgap, som er rimelig, og den håndhever `MIN_SCORE` — 344 par ble stoppet der.

## 2.3 Resonansfordelingen

DEEP 1, STRONG 6, MODERATE 19, GENTLE 1.

Rapporten flagget MODERATE-dominansen som et åpent spørsmål. Min vurdering er at dette ikke er urovekkende: det er en klokkeformet fordeling rundt midten, med haler på begge sider. De fleste par ligner middels på hverandre; få er ekstreme i noen retning.

At DEEP kun ble 1 av 27 er et **sunnhetstegn**. I v6 var alle 19 DEEP, som var meningsløst. Nå er dyp resonans sjelden, som ordet tilsier.

Verdt å følge med på i beta med virkelige mennesker. Ikke blokkerende.

## 2.4 Øvrige lukkede avvik

| # | Avvik | Status |
|---|---|---|
| A13 | Avvisningsloggen talte ikke | **Lukket** — 1442 avvisninger målt |
| A14 | Spøkelsesfelter i profilen | **Lukket** — fjernet fra klienten |
| A15 | Betalingsveien var en blindvei | **Lukket** — sperret og dokumentert i `deploy/payments.md` |
| A10 | Cron i UTC | **Lukket** — flyttet, men endres igjen i runde B |
| A12 | Døde ruter | **Kartlagt** — `docs/api-route-inventory.md`, ingenting slettet |

Sjekk 9 ble innført og virket: `__tests__/sjekk9-reject-counters.test.ts` viser at tellerne beveger seg ved avvisning og står stille ellers.

---

# 3. To funn som ikke sto i rapporten

Begge ble funnet ved uavhengig gjennomgang etter at ACT v7 var låst. Ingen av dem er ACT v7s feil — den ene ble korrekt notert som en begrensning, den andre lå utenfor omfanget.

## 3.1 Radiussperren er inaktiv i produksjon

ACT v7 kalte dette en «data-mapping-mangel i cron-ruten». Det er for mildt.

```
distancePref i prisma/schema.prisma:            0 treff
distancePref i app/api/cron/matching/route.ts:  0 treff
prisma/schema.prisma:84                         deepProfileData  Json?
```

`distancePref` **finnes ikke som kolonne.** Den ligger inne i en JSON-blob.

Cron-ruten henter kandidatene med `include: { profile: true }` (`app/api/cron/matching/route.ts:146-148`), som gir hele Profile-raden. Derfor virker `maturityLevel`, `securityLevel` og `boundaries` uten videre — de *er* kolonner. `distancePref` er ikke der å hente.

`checkRadius` leser `a.distancePref` på `lib/matching/dealbreaker.ts:155`, får `undefined`, og `!= null`-sjekken hopper forbi. **Radiussperren gjør ingenting.**

Konsekvensen: én person i Tromsø kan i dag kobles med én i Kristiansand. Og de *har* oppgitt en grense — `app/onboarding/OnboardingFlow.tsx:352` sender feltet, `app/api/profile/setup/route.ts:128` lagrer det. Brukeren drar en slider fra 5 til 500 km, og systemet ser bort fra svaret.

**Løsningen finnes allerede i kodebasen.** `lib/matching/findBestResonance.ts:321` gjør nøyaktig den utpakkingen som mangler:

```ts
distancePref: typeof (profile.deepProfileData as Record<string,unknown>|null)?.distancePref === "number"
  ? (profile.deepProfileData as Record<string,unknown>).distancePref as number
  : null,
```

Cron-ruten trenger den samme linjen. `lib/matching/` forblir urørt.

I et langstrakt land er dette den dealbreakeren som betyr mest for om en match er brukbar i praksis. **Må lukkes før beta.**

## 3.2 Tailwind genererer ingen breakpoints

Verifisert i den faktisk bygde CSS-filen:

```
md:      0 forekomster
lg:      0
sm:      0
hover:   0
@media:  12  (alle fra håndskrevet CSS i globals.css)
```

Årsaken er en versjonskonflikt:

| Fil | Tilstand |
|---|---|
| `package.json` | `"tailwindcss": "^4.2.2"` |
| `postcss.config.js:3` | `'@tailwindcss/postcss': {}` — v4-plugin |
| `tailwind.config.js:2` | `module.exports = {…}` — v3-format |
| `styles/globals.css:1-3` | `@tailwind base/components/utilities` — v3-direktiver |
| `styles/globals.css` | **0 treff på `@config`** |

Tailwind 4 leser ikke en JS-konfigurasjon uten `@config`-direktivet. Konfigurasjonen er død — inkludert `screens`-definisjonen med `sm: 480px`, `ph: 820px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, og hele fargepaletten, spacing-skalaen og animasjonene under `extend`.

Følgen: **hver `md:grid-cols-3` i kodebasen gjør ingenting.** Alt rendres i én kolonne på alle skjermer. Selv `hover:`-effekter mangler.

Dette betyr at spørsmålet «er sidene mobiltilpasset?» ikke kan besvares før konfigurasjonen virker. Enhver mobil-QA gjort i dag måler feil ting.

**Må lukkes først av alt.** Alt annet visuelt arbeid er meningsløst før den er på plass.

## 3.3 Bonusfunn: en død konstant

`config/matching.ts:5` definerer `MATCH_DELAY_HOURS = 24`. Søk i `app/` og `lib/` gir **null treff** på bruk.

Konstanten som navngir dagens løfte brukes ingen steder. Det gjør overgangen til ukentlig kadens enklere enn ventet — det finnes ingen kode å endre, bare tekst.

---

# 4. Det nye konseptet — ukentlig kadens

## 4.1 Hva som endres

| | I dag | Nytt |
|---|---|---|
| Løfte | Match innen 24 timer | Match lørdag morgen |
| Kø | Løpende | Mandag–fredag |
| Matcherunde | Daglig kl. 04:00 | **Kun natt til lørdag** |
| Kohortterskel | 20 | 2 |
| Reisestart | Vilkårlig ukedag | Lørdag |

## 4.2 Hvorfor det er bedre

**Matematikken.** Antall mulige par vokser kvadratisk med kohorten. 100 i kø gir 4 950 kombinasjoner; 700 gir 244 650. Femti ganger flere å velge det beste fra.

**Geografien.** Norge er langstrakt. Med 100 i kø finnes kanskje tre passende personer i Trøndelag. Med 700 finnes tjue. Radiussperren — når den først virker — er den som stopper flest par i et land som vårt, og den løses kun av volum samlet i én pulje.

**Løftet.** «Vi bruker uken på å finne den rette» er noe annet enn «du får svar i morgen». En app som matcher på 24 timer sier implisitt at det ikke krevde omtanke. Ventetiden blir et argument, ikke en beklagelse.

**Tidspunktet.** Lørdag morgen har folk ro og overskudd. En match som lander tirsdag 07:00 midt i frokoststresset får dårligere vilkår.

**Angreretten.** Betaler hun onsdag og reisen starter lørdag, finnes et naturlig vindu der ingenting er levert. Angrer hun før lørdag, refunderes hun uten diskusjon. Det er renere enn tjenester som leverer umiddelbart og må be kunden frasi seg angreretten. Se del 9.

## 4.3 Kohortterskelen

`MIN_COHORT_SIZE` senkes fra 20 til 2. I starten er det bedre å koble fem gode par enn å utsette alt.

**Men `MIN_SCORE = 40` står fast.** To mennesker som scorer 22 skal ikke kobles fordi de er de eneste to i landet den uken. En dårlig match er verre enn ingen match — den koster tretti dager av to menneskers liv.

Løftet blir: *vi kobler når vi finner noe godt, uansett hvor få dere er.*

## 4.4 Venterommet

Når brukeren trykker «start reisen», havner hun i et venterom fram til lørdag.

Det skal si **når**, ikke **hvor lenge**. «Matchen din kommer lørdag morgen» er rolig. «3 dager og 14 timer igjen» skaper en nedtelling, og nedtellinger er nettopp den utålmodigheten ToSom motvirker.

`components/dashboard/WaitingForMatch.tsx` finnes allerede og er utgangspunktet.

## 4.5 Når ingen match finnes

Står hun i kø uten å bli koblet, må systemet si det ærlig. Ikke stillhet.

Beskjeden skal ikke gjøre det til hennes feil. «Vi fant ingen som passet godt nok denne uken» er riktig; noe som antyder at hun er vanskelig å matche er det ikke.

Og den skal gi **ett** konkret valg, ikke tre. Avstand er det riktige, fordi det er den vanligste årsaken i Norge.

Her blir avvisningsloggen fra v7 praktisk: når tellerne virker, kan systemet se om det var radius, modenhet eller score som stoppet henne — og beskjeden kan bli presis i stedet for generisk.

## 4.6 Volum

Dine anslag: 500–1 000 i uken, 20 000–40 000 i året.

Det tilsvarer 2–4 % markedspenetrasjon blant om lag én million voksne single i Norge. Ambisiøst, men innenfor for et tydelig differensiert produkt. Regn med at de første ukene ligger vesentlig lavere — kanskje 50–150 — og at det tar to–tre måneder å nå 500.

**Den reelle risikoen er ikke volumet, men balansen.** 700 i kø hjelper lite hvis 500 er menn og 200 er kvinner; da står 300 igjen hver uke. Dette bør måles fra første betauke.

---

# 5. Runde A — Fundament

**Formål:** Rette de to feilene fra del 3. Uten denne runden kan verken runde B eller C vurderes.

**Omfang:** Teknisk. Ingen tekstendringer, ingen konseptendringer.

## 5.1 Tailwind-konfigurasjonen

Få `tailwind.config.js` til å bli lest av Tailwind 4. To veier:

- Legge `@config "../tailwind.config.js";` øverst i `styles/globals.css`
- Eller flytte konfigurasjonen til v4-format med `@theme` i CSS

Den første er mindre inngripende og bevarer hele den eksisterende konfigurasjonen.

**Godkjent når:** bygget CSS inneholder `md:`, `lg:`, `sm:` og `hover:` i antall større enn null.

**Kritisk stop-regel:** denne endringen vekker døde klasser på **hver eneste side samtidig**. Det kan bli riktig med det samme — layoutene ble skrevet med breakpoints i tankene. Men det kan også avdekke sider som er justert for å se bra ut *uten* dem.

Derfor: bygg, se på tre sider i tre bredder, og **stopp og rapporter hvis noe ser brutt ut.** Ikke begynn å rette. Det er en vurdering for et menneske.

En detalj å merke seg: `screens` i konfigurasjonen har `sm: 480px`, `ph: 820px`, `md: 768px`. Rekkefølgen er ulogisk — `ph` ligger mellom `md` og `lg` i verdi, men før dem i objektet. Kontroller at Tailwind sorterer dem riktig når konfigurasjonen først leses.

## 5.2 Radius-mappingen

Pakk ut `deepProfileData.distancePref` i cron-ruten, med samme mønster som `lib/matching/findBestResonance.ts:321`.

**`lib/matching/` skal forbli urørt.** Vokterkontrollen fra v7 gjelder fortsatt.

**Godkjent når:** en ny matcherunde viser radius-telleren større enn null, med en populasjon der noen par ligger utenfor hverandres grense.

## 5.3 Ny observert runde

Kjør `scripts/seed-spread.ts` og matcherunden på nytt etter 5.2. Krav:

| # | Krav |
|---|---|
| 1 | `rejectReasons.radius` > 0 |
| 2 | Minst 6 årsaker representert (5 fra v7 + radius) |
| 3 | Ingen bruker i to matcher |
| 4 | Alle score ≥ 40 |
| 5 | Minst 3 resonansnivåer |

Dette er Sjekk 9 anvendt på radius: telleren må vises å kunne bevege seg.

## 5.4 Vurdering av skjemaendring

Det bør vurderes om `distancePref` skal bli en ekte kolonne framfor et JSON-felt. Argumentet for: det er en dealbreaker som må kunne indekseres og spørres på. Argumentet mot: det krever migrasjon, og JSON-utpakking løser problemet nå.

**Anbefaling: utsett.** Løs det med utpakking i runde A, og ta migrasjonen senere sammen med andre skjemaendringer — for eksempel moodpersistens (A3).

---

# 6. Runde B — Kadens og konsept

**Formål:** Innføre ukentlig matchekadens.

**Forutsetter:** Runde A ferdig. Uten fungerende radius vil den nye kadensen gi matcher på tvers av landet i større puljer enn før.

## 6.1 Konfigurasjon

| Endring | Fil |
|---|---|
| `MIN_COHORT_SIZE` 20 → 2 | `config/matching.ts:10` |
| `MATCH_DELAY_HOURS` — vurder fjerning | `config/matching.ts:5` (ubrukt) |
| `MAX_QUEUE_WAIT_HOURS` — vurderes på nytt | `config/matching.ts:11` |
| Cron kun lørdag | `vercel.json` |

Cron-uttrykket blir `0 2 * * 6` for matching — natt til lørdag, klokken 04:00 norsk sommertid.

**Merk:** dette bryter vokterkontrollen fra v7, som krevde at `config/matching.ts` var urørt. Det er tilsiktet i runde B og må stå eksplisitt i instruksen, ellers stopper modellen.

Journey-runden må fortsatt kjøre **daglig** — reisene løper hver dag uavhengig av når de startet.

## 6.2 Utmeldingsfristen

Melder hun seg ut fredag kveld, må hun ut av køen **før** runden kjører natt til lørdag. Ellers kan hun kobles til noen som lørdag morgen møter en partner som ikke er der.

To løsninger: steng utmelding fredag ved midnatt, eller la runden lese køen på nytt umiddelbart før den kjører. Den andre er mer robust.

Liten teknisk detalj, stor menneskelig konsekvens.

## 6.3 Venterommet

Bygg videre på `components/dashboard/WaitingForMatch.tsx`. Krav:

- Sier **når** matchen kommer, ikke hvor lenge det er igjen
- Ingen nedtelling i timer og minutter
- Nedtonet lenke om angrerett — se del 9
- Rolig, ikke tom

## 6.4 Beskjed når ingen match finnes

Bruk avvisningsloggen til å avgjøre hva som stoppet henne, og gi ett konkret valg. Se del 4.5.

## 6.5 Godkjenningskriterier

| # | Krav |
|---|---|
| 1 | Cron kjører kun lørdag for matching, daglig for journey |
| 2 | `MIN_COHORT_SIZE = 2`, `MIN_SCORE` uendret på 40 |
| 3 | Utmelding før runden fjerner brukeren fra køen |
| 4 | Venterommet viser tidspunkt, ikke nedtelling |
| 5 | Beskjed ved manglende match er implementert og ærlig |

---

# 7. Runde C — Offentlige flater

**Formål:** Gjøre plattformen presentabel og sannferdig.

**Forutsetter:** Runde A (ellers måles feil visuell tilstand) og runde B (ellers lover teksten noe systemet ikke gjør).

## 7.1 Tekst som ikke lenger stemmer

**«Match innen 24 timer» — tre steder:**

| Fil:linje | Tekst |
|---|---|
| `app/(landing)/page.tsx:122` | `title: 'Match innen 24 timer'` |
| `components/ui/layout/Hero.tsx:46` | `title: 'Match innen 24 timer'` (i `keyPoints`, rendres ikke) |
| `app/slik-fungerer-det/page.tsx:66` | `title: 'Én match innen 24 timer'` |

Med tilhørende brødtekst på `app/(landing)/page.tsx:123` og `app/slik-fungerer-det/page.tsx:67`.

**Pris — fem steder:**

| Fil:linje |
|---|
| `app/priser/page.tsx:365` |
| `app/vilkår/page.tsx:140` |
| `app/(landing)/page.tsx:299` |
| `app/(landing)/page.tsx:346` |
| `app/betaling/page.tsx:5` |

Prisen på 349 kr beholdes. Men teksten må stemme med at betaling er sperret inntil Vipps er på plass — se del 9.

## 7.2 Om språket

Tonen som finnes er god: rolig og voksen. Det som må endres er **påstander som ikke lenger er sanne**, ikke stilen.

Den nye formuleringen har en fordel. «Vi samler mennesker gjennom uken og kobler lørdag morgen» *forklarer* hvorfor det tar tid. Det gjør teksten sterkere, ikke svakere.

Prinsipp for runde C: **forbedre, ikke skrive om.** Hver endring skal kunne begrunnes med at den gamle teksten var feil, ikke bare annerledes.

## 7.3 Sider som må gjennomgås

`app/(landing)/`, `app/hvorfor/`, `app/slik-fungerer-det/`, `app/reisen/`, `app/priser/`, `app/om-oss/`, `app/kontakt/`, `app/blogg/`, `app/vilkår/`, `app/personvern/`, `app/cookies/`.

For hver: stemmer påstandene med hva systemet gjør, og fungerer siden på telefon, nettbrett og laptop?

## 7.4 Visuell kontroll

Etter runde A skal hver offentlig side kontrolleres i tre bredder: cirka 390 px (telefon), 820 px (nettbrett) og 1440 px (laptop).

Dette er en menneskeoppgave. En modell kan ikke vurdere om noe ser riktig ut.

## 7.5 Hvordan runde C bør utføres

**Dette er den farligste runden for en utførende modell.** «Rett teksten så den speiler nytt konsept» er en dømmekraftsoppgave, og modellen vil stoppe ved hver setning — med rette.

Derfor: den ferdige teksten skal stå i instruksen, ord for ord, som noe som settes inn. Ikke som noe som formuleres. Det betyr at teksten må skrives ferdig **før** ACT-instruksen for runde C lages.

---

# 8. Vilkår og ordensregler

## 8.1 Dagens tilstand

`app/vilkår/page.tsx` er 328 linjer, hvorav om lag 282 ord synlig tekst fordelt på syv kort. Filen beskriver seg selv som en «Hva du bør vite»-oversikt.

Det som finnes: aldersgrense 23 år (`:129`), reisens lengde (`:139`), kobling framfor valg (`:144`), avslutning og sletting (`:149`), bildedeling (`:154`), angrerett (`:159`), pris 349 kr (`:140`).

Det som mangler: selskapsnavn og organisasjonsnummer, dato og versjon, lovvalg og verneting, ansvarsbegrensning, immaterielle rettigheter, prosedyre for endring av vilkår, betalingsbetingelser utover prisen — og **ordensregler**.

En skrivefeil å merke seg: «Bildefdeling» på `:154`.

## 8.2 Hvorfor ordensregler er det viktigste som mangler

To fremmede skal snakke fortrolig i tretti dager. Det finnes i dag ingen tekst om respekt, misbruk, trakassering eller konsekvenser ved brudd.

Den teksten beskytter brukerne. Den beskytter også deg — uten den har du ikke noe grunnlag for å utestenge noen.

Det finnes heller ingen rapporteringsfunksjon. En bruker som opplever noe ubehagelig har i dag ingen vei ut annet enn å slutte. **Det bør bygges i runde C.**

## 8.3 Hva vilkårene må dekke

Engangsbetaling forenkler dette betydelig. Du slipper hele det strengest regulerte området i norsk forbrukerrett: abonnementsfeller, fornyelsesvarsler, oppsigelsesfrister og samtykke til gjentakende trekk.

Minimum:

| Tema | Innhold |
|---|---|
| Hvem | ToSom AS, organisasjonsnummer, kontaktadresse |
| Hva | Én match, én reise på tretti dager. Hva tjenesten *ikke* er |
| Alder | 23 år, og hvordan det håndheves |
| Pris | 349 kr, engangsbeløp, ingen abonnement, ingen fornyelse |
| Angrerett | 14 dager etter angrerettloven, med det praktiske vinduet før lørdag |
| Levering | Tjenesten er levert når koblingen er gjort |
| Oppførsel | Respekt, ingen trakassering, ingen deling av andres bilder eller opplysninger, ingen kommersiell bruk |
| Brudd | Advarsel, utestengelse, ingen refusjon ved grovt brudd |
| Ansvar | Hva ToSom ikke svarer for |
| Innhold | Hvem eier det som skrives, og at det slettes etter tretti dager |
| Endring | Hvordan vilkår endres og varsles |
| Lovvalg | Norsk rett, verneting |

## 8.4 En merknad om «binding»

Vilkår **binder** uansett — de er avtalen om hva kjøperen får for pengene. Det er nettopp det som beskytter deg. Uten dem er det uklart hva som er lovet, og da gjelder kjøperens forventning.

Enkle vilkår, men ekte.

## 8.5 Personvern

`app/personvern/` må dekke GDPR: behandlingsgrunnlag, hvilke data som samles, lagringstid, deling med tredjepart (Pusher, Sentry, Vercel, e-postleverandør, senere Vipps), brukerens rettigheter til innsyn, sletting og portabilitet, samt informasjonskapsler.

Særlig viktig for ToSom: at innholdet i en reise **slettes permanent** etter tretti dager er et personvernmessig fortrinn. Det bør stå tydelig.

## 8.6 Anbefaling

Et menneske med juridisk kompetanse bør lese gjennom før lansering. Et godt utkast kan skrives på forhånd, men vilkår som skal binde er ikke noe en modell bør ha siste ord om.

---

# 9. Betaling og angrerett

## 9.1 Modellen

Engangsbetaling via Vipps. 349 kr for én reise. Ingen abonnement, ingen nivåer, ingen tillegg. De første 10 000 brukerne gratis via `lib/payment/freeQuota.ts:11`.

Vipps blir både betalings- og innloggingsvei. Nøkkel kommer når organisasjonsnummer og bedriftskonto er på plass.

## 9.2 Dagens tilstand

Betaling er **sperret** etter ACT v7 steg 2.1. `PAYMENTS_ENABLED` kan ikke settes sann uten at systemet feiler ved oppstart. Stripe er forkastet og fjernet fra `.env.example`. Dokumentert i `deploy/payments.md`.

Gratiskvoten bærer funnelen. For beta med 100–200 inviterte er dette riktig tilstand.

## 9.3 Angreretten i praksis

Ikke en «angre»-knapp ved siden av «start reisen» — den ville trekke oppmerksomheten mot tvil i det øyeblikket brukeren nettopp har bestemt seg.

I stedet: **en nedtonet lenke i venterommet.** Ikke en knapp med ramme og farge. En lenke som er der for den som leter, og usynlig for den som ikke gjør det.

Formulering i retning av: *Ombestemmer du deg før lørdag, kan du melde deg ut og få pengene tilbake.*

Tre ting sies samtidig: du er ikke fanget, vi er ryddige med penger, og — implisitt — vi tror du kommer til å bli. Samme mekanisme som får hoteller til å skrive «gratis avbestilling» tydelig: det senker terskelen for å si ja.

## 9.4 Etter lørdag

Da er tjenesten levert. Reisen har startet, hun har fått et menneske, og den andre har fått henne.

Det må stå tydelig i vilkårene, og mildt i venterommet: *fra lørdag er dere to i gang.* Det viktige er at hun vet det **før** hun betaler.

## 9.5 Prisen

349 kr beholdes for nå. Det er riktig størrelsesorden for noe man kjøper én gang.

Spørsmålet er ikke om beløpet er for høyt, men om opplevelsen forsvarer det. Det svaret kommer fra de første hundre testerne, ikke fra en vurdering på forhånd.

---

# 10. Lanseringsvurdering

## 10.1 Tallene

| | v6.0 | v7.0 |
|---|---|---|
| **Lukket beta** | 86 % | **83 %** |
| **Offentlig lansering** | 70 % | **68 %** |

## 10.2 Hvorfor de går ned

Dette er ikke tilbakegang. ACT v7 leverte alt den skulle, og systemet er teknisk bedre enn før.

Men to forhold ble oppdaget som ikke var kjent da v6.0 ble skrevet:

**Radiussperren er inaktiv.** I en betagruppe spredt over Norge er det sannsynlig at noen kobles på tvers av halve landet. Det ødelegger opplevelsen for begge, og det er den typen feil som gjør at en tester ikke kommer tilbake.

**Tailwind virker ikke.** Alle offentlige sider rendres uten breakpoints. Vi vet ikke hvordan de ser ut på telefon, fordi vi ikke har målt riktig tilstand ennå.

Et ærlig tall må ta hensyn til det som er oppdaget, ikke bare det som er rettet.

## 10.3 Hva som løftet

Avvisningsloggen er reell — 1442 avvisninger over fem årsaker. Resonansnivåene fordeler seg over fire trinn. Testdekningen er 129/129. Vokterkontrollen holdt gjennom tolv steg.

Den største tekniske usikkerheten fra v6 — *diskriminerer motoren?* — er borte.

## 10.4 Blokkerende før lukket beta

| # | Krav | Runde | Ansvar |
|---|---|---|---|
| 1 | Tailwind genererer breakpoints | A | ACT |
| 2 | Radiussperren virker, målt i drift | A | ACT |
| 3 | Ukentlig kadens innført | B | ACT |
| 4 | Venterom og utmeldingsfrist | B | ACT |
| 5 | Tekst uten «24 timer» | C | ACT + tekst fra George |
| 6 | Vilkår med ordensregler | C | George + jurist |
| 7 | Rapporteringsfunksjon | C | ACT |
| 8 | 144 spørsmål i egen stemme | — | George |
| 9 | Sentry-DSN satt og bekreftet | — | George |
| 10 | Ekstern monitor registrert | — | George |
| 11 | Gjenopprettingstest med målt RTO | — | George |
| 12 | Visuell kontroll i tre bredder | C | George |

## 10.5 Ytterligere før offentlig lansering

| # | Krav |
|---|---|
| 13 | Vipps innlogging og betaling i drift |
| 14 | Organisasjonsnummer i vilkår og personvern |
| 15 | Skalering målt ved minst 500 i kø |
| 16 | Kjønnsbalanse i køen målt over flere uker |
| 17 | Personvern gjennomgått mot GDPR |
| 18 | Angrerett utøvd i praksis med refusjon |

---

# 11. Roadmap og konklusjon

## 11.1 Rekkefølge

**Runde A — fundament.** Tailwind, radius, ny observert runde. Kort og teknisk. Alt annet avhenger av den.

**Runde B — kadens.** Ukentlig matching, venterom, utmeldingsfrist, beskjed ved manglende match.

**Skrivearbeid, parallelt.** De 144 spørsmålene, den nye teksten til de offentlige sidene, vilkår og ordensregler. Dette kan George gjøre mens A og B pågår.

**Runde C — offentlige flater.** Setter inn ferdigskrevet tekst, bygger rapporteringsfunksjon, visuell kontroll.

**Beta.** 100–200 inviterte. Gratiskvote, ingen betaling.

## 11.2 Om dokumentene framover

To dokumenter per runde: denne masterplanen for begrunnelsene, og en ACT-instruks for utførelsen.

Skillet er ikke formelt. De to siste syklusene ga 12/12 med null feil nettopp fordi «hvorfor» og «hvordan» lå i hver sin fil. Når begrunnelsen står i ACT-dokumentet, begynner modellen å resonnere om den — og en modell som resonnerer om mål midt i utførelsen, improviserer.

Det som avgjør om en utførende modell stopper er ikke dokumentets lengde, men **antall beslutninger igjen i teksten.** I v7 var fire valg avklart på forhånd, og modellen gikk rolig gjennom tolv steg uten å stoppe én gang.

## 11.3 Hva som gjenstår

Systemet er teknisk solid. Motoren kobler, den avviser, den forklarer seg, og den har en av-bryter som virker. 129 tester passerer. Ingen klientkall peker i tomme luften.

Det som gjenstår er ikke motoren. Det er alt rundt: at radius faktisk brukes, at sidene ser ut som noe på en telefon, at teksten sier sant om hva som skjer, og at det finnes regler for hvordan folk skal oppføre seg mot hverandre.

Og det viktigste av alt, som ingen syklus kan gjøre: de 144 spørsmålene. Det er dem to mennesker møter hver dag i tretti dager. Maskinskrevne blir de generiske, og en generisk dybdesamtale er en selvmotsigelse.

## 11.4 Status

| | |
|---|---|
| **Lukket beta** | **83 %** |
| **Offentlig lansering** | **68 %** |
| Verifisert ved | commit `88d5ad8` |
| Typefeil | 0 |
| Tester | 129/129 |
| Avvisninger målt | 1442 over 5 årsaker |
| Resonansnivåer | 4 |
| Åpne kritiske funn | 2 (radius, Tailwind) |
| Runder før beta | 3 |

---

*TOSOM-MASTERPLAN-v7.0 — verifisert ved commit `88d5ad8`, 16. august 2026. Erstatter v6.0.*
