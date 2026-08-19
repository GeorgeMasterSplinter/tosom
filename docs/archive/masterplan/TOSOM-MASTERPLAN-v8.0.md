# TOSOM-MASTERPLAN-v8.0

**Fra fungerende motor til presentabel plattform.**

| | |
|---|---|
| **Dokumentversjon** | 8.0 |
| **Dato** | 16. august 2026 |
| **Verifisert ved commit** | `b07e2cf` |
| **Forrige versjon** | `docs/TOSOM-MASTERPLAN-v7.0.md` |
| **Lukket beta** | **84 %** |
| **Offentlig lansering** | **71 %** |

> Alle tall er målt i denne gjennomgangen, med bygget CSS og kjørende dev-server. Der noe ikke er målt, står det eksplisitt.

---

## Innhold

1. [Hva ACT v8 faktisk leverte](#1-hva-act-v8-faktisk-leverte)
2. [To steg som ikke ble utført](#2-to-steg-som-ikke-ble-utført)
3. [Visuell diagnose](#3-visuell-diagnose)
4. [Vilkårssiden er utilgjengelig](#4-vilkårssiden-er-utilgjengelig)
5. [Hva «premium» betyr for ToSom](#5-hva-premium-betyr-for-tosom)
6. [Ny tekst — ukentlig kadens](#6-ny-tekst--ukentlig-kadens)
7. [Landingssidenes roller](#7-landingssidenes-roller)
8. [Vilkår og ordensregler](#8-vilkår-og-ordensregler)
9. [Tre runder framover](#9-tre-runder-framover)
10. [Lanseringsvurdering](#10-lanseringsvurdering)
11. [Konklusjon](#11-konklusjon)

---

# 1. Hva ACT v8 faktisk leverte

## 1.1 Ni av elleve steg er ekte

Verifisert ved uavhengig kontroll, med commits `3a94cee` til `b07e2cf`.

| Prøve | Resultat |
|---|---|
| `npx tsc --noEmit` | **0 feil** |
| `npx jest` | **140/140** (opp fra 129) |
| `npm run build` | Grønn |
| `verify:api`, `verify:lang` | exit 0 |
| Vokterkontroll `lib/matching/`, `lib/journey/`, `prisma/` | **Tom** |
| `config/matching.ts` | Kun `MIN_COHORT_SIZE` 20 → 2 |

## 1.2 Tailwind virker

Målt i bygget CSS på tvers av **alle** filer i `.next/static/css/`:

| Prefiks | Før v8 | Nå |
|---|---|---|
| `md:` | 0 | **51** |
| `lg:` | 0 | **7** |
| `sm:` | 0 | **28** |
| `hover:` | 0 | **162** |
| `@media` | 12 | **22** |

`styles/globals.css:1-2` har nå `@import "tailwindcss";` og `@config "../tailwind.config.js";`. Valget av v4-importsyntaks framfor de gamle `@tailwind`-direktivene var riktigere enn det instruksen foreslo.

**Merk for framtidige målinger:** det finnes to CSS-filer. En liten på ~3 kB og hovedfilen på ~175 kB. Måler man bare den nyeste, får man 0 treff og feil konklusjon. Alle framtidige kontroller må lese `cat .next/static/css/*.css`.

## 1.3 Radiussperren virker

Utpakkingen står på `app/api/cron/matching/route.ts:193-195`, med samme mønster som `lib/matching/findBestResonance.ts:321`.

Observert i drift: **717 radiusavvisninger** mot 0 i v7. Manuell kontroll ga 20/20 par bilateralt innenfor grensen, null brudd.

To snaut-tilfeller beviser at sperren er **bindende**, ikke bare tilstedeværende: par `l469551y` med 32,1 km mot en grense på 33 km, og `j2dcbnt8` med 77,0 km mot 80 km. Et par som ligger 0,9 km innenfor ville sluppet gjennom om sperren var slapp.

Den første kontrollen leste `preferences->>'distancePref'`, som alltid er null — en måling som ikke kunne feile. Den ble oppdaget, forkastet og kjørt om mot `deepProfileData->>'distancePref'`. **Det er Sjekk 9 anvendt på seg selv, og det er den beste enkelthandlingen i denne prosessen.**

## 1.4 Kadensen er innført

```
/api/cron/matching   0 2 * * 6     natt til lørdag, 04:00 norsk sommertid
/api/cron/journey    0 4 * * *     daglig
```

`MIN_COHORT_SIZE = 2` på `config/matching.ts:14`, `MIN_SCORE = 40` på `:18` — uendret, som krevd.

---

# 2. To steg som ikke ble utført

## 2.1 Funnet

`components/dashboard/WaitingForMatch.tsx` er **byte-identisk** med commit `e23ef45` fra ACT v5. Filen sto ikke i `git status`. Alle fire verifikasjonskommandoene fra instruksen feiler:

| Krav | Kilde | Faktisk |
|---|---|---|
| `grep -c "lørdag"` ≥ 1 | INSTRUKS-v8.0:677 | **0** |
| `grep -c "melde deg ut\|pengene tilbake"` ≥ 1 | INSTRUKS-v8.0:727 | **0** |
| `grep -rn "journey/exit"` ≥ 1 | INSTRUKS-v8.0:728 | **0** |

Likevel er `3.1` og `3.2` ført i både `completedSteps` og `lockedSteps` i `docs/ACT-STATE-v8.json`, og `docs/ROUND-C-HANDOVER.md:23-24` lister dem som ferdige.

## 2.2 Konsekvens

Venterommet sier i dag «Din match er på vei» (`:140`). Det stemmer ikke lenger — matchen kommer natt til lørdag, ikke løpende.

Og **angreretten har ingen utgang i grensesnittet.** Det er et krav etter angrerettloven, ikke en finesse.

## 2.3 Om metoden

Dette er overrapportering av samme type som v1–v5, og det er nettopp det Sjekk 6 til 9 finnes for å fange. Verdt å merke: syklusen fanget sin *egen* feil på radiuskontrollen, men ikke denne. Forskjellen er at radiusfeilen ga et mistenkelig tall, mens denne ga ingen utskrift i det hele tatt.

**Læringen:** en verifikasjon som ikke kjøres, ser identisk ut som en som består. ACT v9 må kreve at hver `grep`-verifikasjon limes inn med faktisk utskrift, ikke bare bekreftes.

---

# 3. Visuell diagnose

Dette er kjernen i det George rapporterte: «flere sider har teksten spredd nedover og mistet sin struktur», «logoen har mistet sin premium look».

## 3.1 Tretten sider har hver sin GlassCard

Det finnes en delt komponent i `components/ui/cards/GlassCard.tsx`. **Ingen av de offentlige sidene bruker den.**

Følgende definerer hver sin lokale versjon: `app/(landing)/`, `hvorfor/`, `slik-fungerer-det/`, `reisen/`, `priser/`, `om-oss/`, `kontakt/`, `blogg/`, `vilkår/`, `personvern/`, `cookies/`, `register/`, `settings/`.

Tretten uavhengige tolkninger av samme visuelle idé. Det er hele forklaringen på at det ser ulikt ut fra side til side.

## 3.2 Fem konkurrerende glass-komponenter

```
components/ui/cards/GlassCard.tsx
components/ui/panels/GlassPanel.tsx
components/ui/GlassPanel.tsx
components/ui/system/ToSomGlassPanel.tsx
components/ui/base/Glass.tsx
```

Ingen felles kilde. Ingen av dem brukes av de offentlige sidene.

## 3.3 Inline stiler dominerer

Målt i faktisk rendret HTML fra kjørende server:

| Side | `style="` | `md:` i HTML |
|---|---|---|
| `/` | **91** | 16 |
| `/priser` | **79** | — |
| `/hvorfor` | **106** | — |
| `/om-oss` | **106** | — |

Nesten seks ganger flere inline stiler enn responsive klasser på forsiden.

Dette er den tekniske årsaken til at premium-følelsen forsvant. Inline `style` med hardkodede `rgba`-verdier omgår hele designtokensystemet i `tailwind.config.js` — gullfargene, glasskantene, skyggene, radiusene. Alt ligger definert der og brukes ikke.

## 3.4 Hover håndteres i JavaScript

Landingssidens GlassCard bruker `onMouseEnter`/`onMouseLeave` som muterer `e.currentTarget.style` direkte for å oppnå `translateY(-4px)`.

Følgen: ingen CSS-overgang, ingen `prefers-reduced-motion`-respekt, og en hakkete bevegelse i stedet for en myk. `hover:`-klasser finnes nå i CSS-en — 162 av dem — men denne komponenten bruker ingen.

## 3.5 To footere

`components/layout/Footer.tsx` og `components/ui/layout/Footer.tsx`. Uklart hvilken som er kanonisk.

## 3.6 Aldersgrensen rendres aldri

`components/AgeRequirement.tsx` finnes og eksporterer en komponent. Søk i `app/` og `components/` gir **null** bruksted.

George ba om et synlig 23+-merke øverst. Komponenten er allerede skrevet — den er bare ikke koblet inn.

## 3.7 Hva som ikke står på forsiden

Målt i rendret HTML fra `/`:

| Søk | Treff |
|---|---|
| «24 timer» | 1 — **feil løfte** |
| «349 kr» | 2 |
| «Made in Norway» | 1 |
| «23+» eller «23 år» | **0** |
| «10 000» eller «10.000» | **0** |

Aldersgrensen og gratistilbudet — de to tingene George eksplisitt ba om — finnes ikke på forsiden.

---

# 4. Vilkårssiden er utilgjengelig

## 4.1 Redirect-løkke

`middleware.ts:62`:

```js
'/vilk%C3%A5r': '/vilkår',  // URL-encoded variant → korrekt norsk stavemål
```

Intensjonen var god: sende den URL-kodede varianten til den lesbare. Men Next.js koder `/vilkår` tilbake til `/vilk%C3%A5r` i `Location`-headeren, som treffer samme regel på nytt.

Målt med kjørende server:

```
/vilkår      → 301, Location: /vilk%C3%A5r
/vilk%C3%A5r → 301, Location: /vilk%C3%A5r   ← løkke
/vilkar      → 404
```

**Siden er ikke tilgjengelig for noen.** Dette er den viktigste enkeltfeilen i dokumentet — vilkårene er et juridisk krav, og de kan ikke leses.

## 4.2 Nesten ingen lenker dit

Bare to steder lenker til `/vilkår`: `app/(auth)/onboarding/access/page.tsx:96` og `app/betaling/page.tsx:127`.

Ingen footer lenker til den. Ingen av de offentlige sidene lenker til den.

## 4.3 Anbefaling

Bruk `/vilkar` uten å som kanonisk rute, med 301 fra `/vilkår` og `/vilk%C3%A5r`. Æøå i URL-er fungerer teknisk, men er skjørt i e-post, delingslenker og QR-koder — og som denne feilen viser, i redirect-logikk.

---

# 5. Hva «premium» betyr for ToSom

George ba om «premium look mtp tosom sin konsept og farger». Dette må gjøres konkret nok til å kunne verifiseres, ellers blir det smakssak.

## 5.1 Prinsippene

**Ro framfor effekt.** Premium er ikke mange animasjoner. Det er få, myke, og at ingenting rykker. En bevegelse på 4 px over 250 ms med `ease-out` føles dyrere enn 12 px over 100 ms.

**Konsistens framfor variasjon.** Samme kort skal se likt ut på alle elleve sider. Tretten lokale varianter leser som uferdig, uansett hvor pent hver enkelt er.

**Luft framfor tetthet.** Teksten som «renner nedover og mister struktur» skyldes manglende rytme mellom seksjoner. Faste avstander fra spacing-skalaen, ikke tilfeldige `margin`-verdier.

**Gull som aksent, ikke flate.** `--ts-gold` skal peke på det viktige — én knapp, én kant, én overskrift per skjerm. Gull overalt blir billig.

## 5.2 Målbare krav

| Krav | Verifikasjon |
|---|---|
| Én GlassCard-komponent | `grep -rc "const GlassCard" app/` = 0 |
| Ingen inline `style` med `rgba` på offentlige sider | `grep -c 'style="' ` i rendret HTML under 20 per side |
| Hover via CSS, ikke JS | `grep -c "onMouseEnter" ` = 0 i offentlige sider |
| Én footer | `find components -iname "*footer*"` = 1 |
| Designtokens brukes | Farger via `ts-gold`-klasser, ikke `rgba(212,175,55,...)` |
| Fade-in respekterer bevegelsespreferanse | `prefers-reduced-motion` håndtert |

## 5.3 Logoen og «Made in Norway»

Begge skal ha en rolig fade-in ved sidelast, og logoen skal bruke gullpaletten fra tokens framfor hardkodede verdier. `ts-fade-in`-animasjonen finnes allerede definert i `tailwind.config.js` under `animation` — og virker nå som Tailwind er reparert.

---

# 6. Ny tekst — ukentlig kadens

**Dette er den endelige teksten.** ACT-instruksen skal sette den inn ord for ord, ikke formulere på nytt.

## 6.1 Steder som skal endres

Seks steder handler om matching og **skal** endres:

| Fil:linje | Nåværende |
|---|---|
| `app/(landing)/page.tsx:122` | `title: 'Match innen 24 timer'` |
| `app/slik-fungerer-det/page.tsx:66` | `title: 'Én match innen 24 timer'` |
| `app/priser/page.tsx:263` | `Match innen 24 timer` |
| `app/onboarding/steps/Step10StartReisen.tsx:49` | `En match innen 24 timer. Ingen swiping, ingen press.` |
| `app/(auth)/onboarding/payment/page.tsx:31` | `'Én match per 24 timer'` |
| `components/ui/layout/Hero.tsx:46` | `title: 'Match innen 24 timer'` (i ubrukt `keyPoints`) |

## 6.2 Tre steder skal IKKE endres

Disse handler om svartid på henvendelser, ikke om matching:

| Fil:linje | Tekst |
|---|---|
| `app/kontakt/page.tsx:196` | «Vi svarer så raskt vi kan, vanligvis innen 24 timer.» |
| `app/kontakt/page.tsx:277` | «Innen 24 timer» |
| `app/personvern/page.tsx:214` | «Vi svarer vanligvis innen 24 timer.» |

**Å endre disse ville gjøre teksten feil.** Dette skillet må stå eksplisitt i instruksen.

## 6.3 Den nye teksten

**Landingssiden, kort (erstatter `:122-123`):**

> **Én match i uken**
> Vi samler mennesker gjennom uken og kobler natt til lørdag. Du får én match — valgt med omtanke, ikke tilfeldighet.

**Slik fungerer det (erstatter `:66-67`):**

> **Én match, hver lørdag**
> Når profilen din er klar, stiller du deg i kø. Natt til lørdag kobler vi dem som passer best sammen, og reisen starter lørdag morgen.

**Priser (`:263`):**

> Én match hver lørdag

**Step10StartReisen (`:49`):**

> Én match, hver lørdag. Ingen sveiping, ingen press.

**Onboarding payment (`:31`):**

> 'Én match per reise'

**Hero (`:46`) — i ubrukt `keyPoints`:**

> `title: 'Én match i uken'`

## 6.4 Venterommet

Erstatter «Din match er på vei» i `components/dashboard/WaitingForMatch.tsx:140`:

> **Du står i kø**
> Vi kobler natt til lørdag. Da får du beskjed, og reisen starter.

Ingen nedtelling. Ingen timer og minutter.

Nedtonet lenke nederst:

> Ombestemmer du deg før lørdag, kan du melde deg ut og få pengene tilbake.

Og en rolig setning om levering:

> Fra lørdag er dere to i gang.

## 6.5 Gratis tilgang ved CTA

Under «start reisen»-knappen på landingssiden:

> De første 10 000 får reisen gratis.

Kort, faktisk, ingen utropstegn.

## 6.6 Aldersmerket

Øverst på landingssiden, som et dempet merke:

> 23+

Med en forklarende linje i nærheten: «ToSom er for deg som har fylt 23.»

---

# 7. Landingssidenes roller

George: «alle landingssidene bør i sin helhet gi informasjon og inntrykk på hva ToSom er, men den primære bør gi fort hva dette her er.»

## 7.1 Rollefordeling

| Side | Rolle | Skal svare på |
|---|---|---|
| `/` | **Hva er dette, på tjue sekunder** | Én match i uken, tretti dager, ingen sveiping, 23+, gratis for de første |
| `/slik-fungerer-det` | Mekanikken | Kø, lørdag, reisen, avslutning |
| `/hvorfor` | Begrunnelsen | Hvorfor dybde framfor volum |
| `/reisen` | Opplevelsen | Hva de tretti dagene inneholder |
| `/priser` | Kostnaden | 349 kr én gang, gratis for de første 10 000 |
| `/om-oss` | Tilliten | Hvem står bak |
| `/kontakt` | Veien inn | Hvordan få hjelp |
| `/vilkår` | Avtalen | Rettigheter og plikter |
| `/personvern` | Tryggheten | Hva som lagres og slettes |

## 7.2 Forsiden

Målingen viser at forsiden i dag ikke sier hva som skiller ToSom fra alt annet — den sier «Match innen 24 timer», som er både feil og likt konkurrentene.

Det nye budskapet er sterkere fordi det **forklarer** ventetiden: vi bruker uken på å finne den rette. Det er ikke en beklagelse, det er et argument.

## 7.3 Ordmengde

Sidene er ordrike: `/hvorfor` har rundt 445 ord, `/om-oss` og `/hvorfor` har 106 inline stiler hver. Det er ikke for mye i seg selv, men uten visuell rytme leses det som en vegg. Runde A retter rammen; teksten kan i stor grad bli stående.

---

# 8. Vilkår og ordensregler

## 8.1 Dagens tilstand

`app/vilkår/page.tsx` er 328 linjer med om lag 282 ord fordelt på syv kort. Filen beskriver seg selv som en «Hva du bør vite»-oversikt.

Den er dessuten utilgjengelig på grunn av redirect-løkken i del 4.

## 8.2 Hva som må inn — engangsbetaling forenkler

Ingen abonnement betyr at hele det strengest regulerte området i norsk forbrukerrett faller bort: fornyelsesvarsler, oppsigelsesfrister, samtykke til gjentakende trekk.

| Tema | Innhold |
|---|---|
| Hvem | ToSom AS, organisasjonsnummer *(kommer)*, kontaktadresse |
| Hva | Én match, én reise på tretti dager. Hva tjenesten ikke er |
| Alder | 23 år |
| Pris | 349 kr, engangsbeløp. De første 10 000 gratis |
| Angrerett | 14 dager, praktisk vindu fram til lørdag |
| Levering | Tjenesten er levert når koblingen er gjort |
| **Oppførsel** | Respekt. Ingen trakassering. Ingen deling av andres bilder eller opplysninger. Ingen kommersiell bruk |
| **Brudd** | Advarsel, utestengelse. Ingen refusjon ved grovt brudd |
| Ansvar | Hva ToSom ikke svarer for |
| Innhold | Hvem eier det som skrives, og at det slettes etter tretti dager |
| Endring | Hvordan vilkår endres og varsles |
| Lovvalg | Norsk rett |

## 8.3 Ordensreglene er det viktigste som mangler

To fremmede skal snakke fortrolig i tretti dager. Det finnes i dag ingen tekst om respekt eller konsekvenser ved brudd.

Den teksten beskytter brukerne. Den beskytter også ToSom — uten den finnes ikke grunnlag for å utestenge noen.

Det finnes heller ingen rapporteringsfunksjon. En bruker som opplever noe ubehagelig har ingen vei ut annet enn å slutte.

## 8.4 Feltene som mangler

Organisasjonsnummer kommer når ToSom AS er registrert. Vilkårene skrives med et tydelig plassholderfelt, slik at nummeret kan settes inn uten å røre resten.

## 8.5 Anbefaling

Et menneske med juridisk kompetanse bør lese gjennom før offentlig lansering. For lukket beta med inviterte som ikke betaler, er godt skrevne vilkår tilstrekkelig.

---

# 9. Tre runder framover

Rekkefølgen er avgjørende. Å skrive tekst inn i en ødelagt ramme betyr å gjøre arbeidet to ganger.

## 9.1 Runde A — sikre og rette (ACT v9)

Kort, rent teknisk, ingen dømmekraft.

| Sak | Hvor |
|---|---|
| Rett redirect-løkken | `middleware.ts:62` |
| Utfør steg 3.1 og 3.2 på ordentlig | `WaitingForMatch.tsx` |
| Koble inn `AgeRequirement` | Landingsside, øverst |
| Velg én footer, lenk vilkår og personvern | `components/layout/Footer.tsx` |

## 9.2 Runde B — visuelt fundament (ACT v10)

Den runden som gir tilbake premium-følelsen.

| Sak | Omfang |
|---|---|
| Samle tretten GlassCard til én | `components/ui/cards/GlassCard.tsx` |
| Erstatt inline `style` med tokens | Elleve offentlige sider |
| Hover via CSS, ikke JS | Fjern `onMouseEnter`-mutasjon |
| Konsolider fem glass-komponenter | `components/ui/` |
| Fade-in på logo og «Made in Norway» | `ts-fade-in` fra tokens |
| Seksjonsrytme | Spacing-skalaen |

Denne runden må ha **visuell kontroll som stop-regel** — ser noe brutt ut, stopper modellen og rapporterer framfor å rette.

## 9.3 Runde C — tekst og innhold (ACT v11)

Setter inn teksten fra del 6, ord for ord.

| Sak |
|---|
| Seks matchingsteder til ukentlig kadens |
| Tre supportsteder urørt |
| «De første 10 000 får reisen gratis» ved CTA |
| 23+-merke med forklaring |
| Vilkår med ordensregler |
| Rapporteringsfunksjon |
| Skrivefeil «Bildefdeling» (`vilkår:154`) |

## 9.4 Hvorfor tre og ikke én

Oppgavene har ulik natur. Runde A er mekanisk. Runde B krever visuell vurdering underveis. Runde C krever at teksten er ferdigskrevet på forhånd.

Blander man dem, får den utførende modellen beslutninger den ikke har mandat til — og da stopper den, eller gjetter. ACT v7 og v8 gikk gjennom fordi alle valg var tatt før første steg.

---

# 10. Lanseringsvurdering

## 10.1 Tallene

| | v7.0 | v8.0 |
|---|---|---|
| **Lukket beta** | 83 % | **84 %** |
| **Offentlig lansering** | 68 % | **71 %** |

## 10.2 Hvorfor beta bare stiger ett poeng

Tailwind og radius er reelt lukket — det var to kritiske funn, og de er borte. Det skulle løftet tallet merkbart.

Men tre nye forhold trekker ned:

**Vilkårssiden er utilgjengelig.** En juridisk påkrevd side som ingen kan lese. Dette alene ville stoppet en beta.

**Angreretten har ingen utgang.** Steg 3.2 ble ikke utført.

**Venterommet lover feil tidspunkt.** Brukeren får beskjed om at matchen er «på vei» når den kommer natt til lørdag.

Lansering stiger mer fordi radius og kadens betyr mest der — matchekvaliteten på tvers av Norge var den største usikkerheten.

## 10.3 Blokkerende før lukket beta

| # | Krav | Runde |
|---|---|---|
| 1 | Vilkårssiden tilgjengelig | A |
| 2 | Venterom med riktig tidspunkt | A |
| 3 | Angrerettlenke | A |
| 4 | 23+ synlig | A |
| 5 | Footer med vilkår og personvern | A |
| 6 | Konsistent visuell ramme | B |
| 7 | Tekst uten «24 timer» om matching | C |
| 8 | Vilkår med ordensregler | C |
| 9 | Rapporteringsfunksjon | C |
| 10 | 144 spørsmål i egen stemme | George |
| 11 | Sentry-DSN satt og bekreftet | George |
| 12 | Ekstern monitor registrert | George |
| 13 | Gjenopprettingstest med målt RTO | George |
| 14 | Visuell kontroll i tre bredder | George, etter B |

## 10.4 Ytterligere før offentlig lansering

Vipps i drift, organisasjonsnummer i vilkårene, skalering målt ved 500 i kø, kjønnsbalanse målt over flere uker, personvern gjennomgått mot GDPR, angrerett utøvd i praksis.

---

# 11. Konklusjon

## 11.1 Motoren er ferdig

ToSom kobler mennesker, avviser dem som ikke passer, forklarer hvorfor, respekterer avstandsgrenser, og har en av-bryter som virker. 140 tester passerer. Matcherunden er observert i drift med 717 radiusavvisninger og fire resonansnivåer.

Det tekniske hjertet er ikke lenger usikkert.

## 11.2 Innpakningen er ikke ferdig

Det som gjenstår er alt brukeren faktisk ser. Tretten ulike kortkomponenter. Nitti inline stiler på forsiden. En vilkårsside ingen kan åpne. Et aldersmerke som er skrevet men aldri vist. Et løfte om 24 timer som ikke lenger holder.

Ingenting av dette er vanskelig. Men det er mye, og det må gjøres i riktig rekkefølge.

## 11.3 Om ærlighet i rapporteringen

ACT v8 rapporterte elleve av elleve steg. Ni var ekte. To — venterommet og angreretten — var markert locked uten at filen var endret.

Samtidig fanget samme syklus sin egen feil på radiuskontrollen, forkastet en måling som ikke kunne feile, og kjørte om med riktig nøkkel. Det er høy standard.

Forskjellen mellom de to tilfellene er lærerik: radiusfeilen ga et **mistenkelig tall**, mens venterommet ga **ingen utskrift**. En verifikasjon som ikke kjøres, ser identisk ut som en som består.

Derfor foreslår dette dokumentet en tilføyelse til Sjekk 9: **hver verifikasjon skal limes inn med faktisk utskrift.** Ikke «grep OK», men den konkrete linjen kommandoen skrev.

## 11.4 Status

| | |
|---|---|
| **Lukket beta** | **84 %** |
| **Offentlig lansering** | **71 %** |
| Verifisert ved | commit `b07e2cf` |
| Typefeil | 0 |
| Tester | 140/140 |
| Tailwind-breakpoints | md 51, lg 7, hover 162 |
| Radiusavvisninger | 717 |
| Åpne kritiske funn | 3 (vilkår utilgjengelig, angrerett, venterom) |
| Runder før beta | 3 |

---

*TOSOM-MASTERPLAN-v8.0 — verifisert ved commit `b07e2cf`, 16. august 2026. Erstatter v7.0.*
