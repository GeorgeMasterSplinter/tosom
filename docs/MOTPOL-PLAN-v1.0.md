# MOTPOL-PLAN v1.0

**Status:** FERGIGSTILT (24.10.2026) — /motpol implementert i samsvar med BUILD WITH CHANGES (alle 10 punkter): rute, layout/metadata, ComparisonRows, sitemap, footer-lenke, kontekstuelle lenker fra /hvorfor og /slik-fungerer-det, testsuite (MOT-01–19). verify/lint/build/test grønn. Manuell pass (sks. 25, steg 8: 360px, keyboard, reduced motion, screen reader) gjenstår som go-live-prerequisitt. Ingen commit foreløpig.
**Sluttbetjening:** Denne filen er leveranse 23 («Lag: docs/MotpolResearchPlan.md eller tilsvarende») — prosjektets dokumentasjonsstruktur (UPPERCASE-PLAN-vX.Y.md) tilsier dette navnet. Research/Source-Plan er seksjon 15 i denne filen.

---

## 1. HVORFOR /MOTPOL SKAL EKSISTERE

Kartlegging av dagens sider (verifisert i koden 24.10.2026):

| Side | Roller den i dag | Svarer den på «HVORFOR er det slik?» |
|---|---|---|
| `/` (landing) | HVA: «Én match om gangen», «Gjennomtenkt matching», «Bilder etter 14 dager», privat profil, CTA | Delvis — påstår, forklarer lite |
| `/slik-fungerer-det` | HVORDAN: profil → kø → matcherunde natt til lørdag → 30-dagers reise | Nei — flyteforklaring |
| `/reisen` | Reasens struktur: 30 dager, faser, daglig innhold | Delvis |
| `/metoder` | Slik vi tenker: seks dimensjoner, modeller, avgrensninger (veiviser ikke fasit) | Delvis — «hvordan vi vurderer», ikke «hvorfor vi valgte denne veien» |
| `/trygghet` | Sikkerhetsrom: rapport/blokkering/avslutt, moderering, privat profil | Nei |
| `/hvorfor` | HVEM: hvem Tosom er for, «tosomhet», verdier | Delvis — målgruppe, ikke designvalg |
| `/priser`, `/faq`, `/personvern`, `/om-oss`, `/tips` | Priser, FAQ, data, merkevare, praksis | Nei |

**Gapet:** Ingen side systematisk forklarer *hvorfor designvalgene er tatt* — hvorfor én match, hvorfor ingen sveiping, hvorfor bilder kommer først på dag 15, hvorfor ingen feed. FAQ har enkelte «hvorfor»-svar («Hvorfor ingen bilder fra start? → Fordi vi tror at ord er dypere enn utseende»), men ingen side binder valgene sammen til én sammenhengende filosofi med ærlighet omtrade-offs.

**Konklusjon:** /motpol fyller et reelt gap. Den er merkevare- og tillitsskapende (forklarer stansene), differenserende uten å angripe andre aktører, og selgende gjennom ærlighet (trade-off-seksjonene). Den er ikke strengt nødvendig for produktets funksjon, men er høyverdi for konvertering av «moden» målgruppe og for merkevareposisjonering.

## 2. MÅLGRUPPE

- Voksne (21+) som har prøvet eller overveier digitale datingtjenester og opplever tempoet/valget/overflaten som uønsket.
- De som søker langvarig relasjon, ikke casual kontakt eller volum.
- Siden skal også tjene besøkende som er skeptiske til datingapper generelt: den møter skepsis med ro og konkretisme, ikke forsvar.
- Sekundært: potensielle partnere/meldinger («slik fungerer det hos dem») — siden må forsvare seg utenfor salgsramme.

## 3. HOVEDTESE (godkjent retning)

> Digitale datingtjenester har gjort det enklere enn noen gang å møte mennesker.
> Tosom stiller et annet spørsmål: Hva om vi ikke prøver å vise deg flest mulig mennesker, men i stedet gir deg ro til å bli kjent med én?

Positionering: **«Tosom er et alternativ.», ikke «Tosom har fasiten.»**
Ikke «løsningen på moderne dating», ikke «den eneste riktige måten».

## 4. HVA SIDEN IKKE SKAL VÆRE (anti-mål)

Ikke aggressiv, ikke moraliserende, ikke anti-Tinder-propaganda, ikke anti-casual-dating, ikke anti-kjønn, ikke bedrevitende, ikke pseudo-vitenskapelig. Kritikken rettes mot **mekanismer**, aldri mot mennesker som bruker dem. Ingen alarmisme («datingapper ødelegger dating» = FORBUDT). Ingen kjønnsstereotypier — problemet er atferd, ikke kjønn (se ordliste i seksjon 12).

## 5. ETABLERT SANNHETSGRUNNLAG (verifisert i koden 24.10.2026)

Kun disse fakta kan stå på siden uten ytterligere verifisering (kilde i parentes):

| # | Faktum | Kilde |
|---|---|---|
| F1 | Én aktiv match/reise om gangen | vilkar (app/vilkar/page.tsx) |
| F2 | Matcherunden kjører én gang i uken, natt til lørdag | vilkar + landing + cron (`app/api/cron/matching`) |
| F3 | Match er ikke garantert; blir ingen god nok kobling, forblir man i kø til neste lørdag | landing («Finner vi ingen god nok, lar vi deg vente til neste runde») |
| F4 | Motoren bruker aldri bilder eller utseende | vilkar |
| F5 | Bildedeling åpnes fra dag 15; til og med deling er frivillig | engine (M-6, testet) + FAQ + trygghet («Du bestemmer selv om du vil dele bilde i det hele tatt») |
| F6 | Reisen er 30 dager i fire faser; regelstyrt innhold | vilkar + /reisen |
| F7 | Matching beskriver seks dimensjoner: verdier, tilknytning, personlighet, kommunikasjon, emosjonsregulering, livssituasjon | FAQ + /metoder |
| F8 | Profilen er privat og vises aldri offentlig; personen du kobles med ser begrenset utvalg; fornavn + alder fra start | vilkar + FAQ + landing |
| F9 | Trygghetsfunksjoner: rapport (med kategori + beskrivelse, bevisfesting), blokkering, avslutt reise; moderering: varsel straks, ser saken, kan fryse samtale, advarsel/avslutte/stengge konto; «Vi leser aldri samtalen deres uten at det foreligger en rapport» | /trygghet + `app/api/report`, `userBlock` (PL-15) |
| F10 | «det finnes ingen AI som skriver meldinger, gir råd eller opptrer som samtalepartner» (regelstyrt innhold) | vilkar. `lib/ai/` er arkivert; ingen runtime-LLM i levende produktkode (verifisert: ingen imports) |
| F11 | Brukervilkår forbandler markedsføring/salg/innsamling, støtende/truende/ulovlig innhold, å omgå tekniske begrensninger; bevisst uriktige opplysninger er brudd | vilkar |
| F12 | Kanonisk merkenavn «Tosom»; kanonisk host https://www.tosom.no | ACT C/D, prod-verifisert (TC-09) |
| F13 | «Vi lover ikke at du får en match … vi lover ikke at scoringen er feilfri eller at den «beviser» at to personer passer sammen» — etablerte avgrensninger | /metoder (må ikke svekkes eller forsterkes) |

**Ikke å re-audite** (pkt. 21 i oppdraget): alle F1–F13 er låste. Ny motpol-copy i konflikt med disse dokumenteres, ikke overskrives.

## 6. PÅSTANDSKLASSIFIKASJON (system for hele siden)

Hver setning i copyen får én type (marker som kodekommentar i implementeringen):

| Type | Betegnelse | Krav |
|---|---|---|
| **PF** | TOSOM PRODUCT FACT | Må stemme med koden/vilkår (F1–F13) |
| **PH** | TOSOM PHILOSOPHY | Vårt valg/vårt håp. Ingen kilde nødvendig. Formuleres alltid som «vi har valgt / vi tror / vi forsøker» |
| **OB** | TOSOM OBSERVATION | Generelt om digitale rom: «mange datingtjenester byr på …», «i mange digitale rom møter man …». Må være så generelt at det ikke kan motbevises for en enkelt tjeneste |
| **EF** | EXTERNAL FACTUAL CLAIM | Faktum om verden (marked, atferd i tall). Krever kilde (sks. 15). **Ikke brukt i v1.** |
| **RC** | RESEARCH CLAIM | Forskningspåstand. Krever dokumentert, verifisert kilde (sks. 15). **Ikke brukt i v1.** |
| **MC** | MARKETING COPY | Tone/rytme-setninger («Ro, varme og én reise av gangen»). Må ikke innholde faktapåstand |

**v1-regel:** Siden bygges kun på PF + PH + OB + MC. EF/RC er forbeholdt en eventuell senere research-utvidelse (sks. 15) — siden må fungere helt uten.

## 7. INFORMASJONSARKITEKTUR (anbefalt)

Kandidatstrukturen (15 seksjoner) forkortes og slås sammen. Anbefaling: **14 seksjoner**, hvorav 3 er korte.

| # | Seksjon | Kandidat | Endring | Grunn |
|---|---|---|---|---|
| 1 | HERO | 1 | — | |
| 2 | Hvordan kom vi hit? | 2 | — | Nøysom ramme |
| 3 | Mer er ikke alltid mer | 3+7 | **SLÅS SAMMEN** | «Ingen sveiping» er mekanismen bak «mer er ikke mer» — én samlet tanke, ikke to kapitler |
| 4 | Derfor én match om gangen | 4 | — | Filosof + ærlighet (venting) |
| 5 | Derfor 14 dager uten bilder | 5 | — | |
| 6 | Men utseende betyr jo noe? | 6 | — | Trade-off, selvstendig |
| 7 | To mennesker, ikke to profiler | 8 | — | |
| 8 | Intensjon fremfor oppmerksomhet | 9 | — | |
| 9 | Teknologien hjelper — den snakker ikke for dere | 10 | — | Veiviser + AI-prinsipp |
| 10 | Tryggere betyr ikke risikofritt | 11 | — | Oppsummering + lenke |
| 11 | Et annet system har også en pris | 12 | **UTVIDET** | Samler alle trade-offs (inkl. de fra 4/6, referert ikke gjentatt) |
| 12 | Tosom passer ikke for alle | 13 | — | Selvseleksjon, to kolonner |
| 13 | De to modellene (sammenligning) | 14 | — | Kompakt tabell |
| 14 | CTA | 15 | — | |

Totalt: ~14 seksjoner, est. 1400–1800 ord (ekskl. tabell) — i øvre ende av «én lesning», ikke en roman. Mobil: kortere enn desktop-lesningen via naturlig kollaps (se sks. 18).

## 8. FORSLÅTT COPY PER SEKSJON (utkast v1 — til Georgs godkjenning)

> Konvensjon: `[PF]/[PH]/[OB]/[MC]` = påstandstype. «→ /lenke» = intern lenke. Utkaftet er forhandler, ikke sluttcopy.

### 8.1 HERO
**Overskrift (H1):** Motpol
**Under:** Et annet svar på moderne dating.
**Lead [PH]:** Digitale datingtjenester har gjort det enklere enn noen gang å møte mennesker. Vi stiller et annet spørsmål: hva om du ikke vises flest mulig mennesker — men i stedet får ro til å bli kjent med én?
**MC-linje (valgfri):** Ikke mer dating. Mindre støy rundt det å bli kjent.
**Knapper:** «Start reisen» (primær, → /register) · «Se hvorfor» (sekundær, anker til seksjon 2)
*Bakgrunn: standard hero-mønster (components/ui/layout/Hero), ingen ny hero-animasjon.*

### 8.2 HVORDAN KOM VI HIT?
[OB] Mange digitale tjenester byr på det samme: store utvalg av profiler, rask vurdering, mange parallelle samtaler. For mange fungerer det fint. For andre blir det støy.
[PH] Vi opplever at høyt tempo, mange valg og raske vurderinger ikke passer måten noen ønsker å bli kjent på. Derfor bygger vi motsatt.
[MC] Ikke fordi det andre gjør er feil. Fordi vi tror at én annen vei kan passe deg bedre.

### 8.3 MER ER IKKE ALLTID MER (inkl. hvorfor ingen sveiping)
[OB] I mange datingtjenester er målet å vise deg så mange profiler som mulig. Målet vårt er det stikk motsatte: å gi én mulighet en faktisk sjanse.
[PF] Hos oss sveiper du ikke. Du kan ikke «se nærmere» på hundredvis av profiler. Du kan kun ha én aktiv reise om gangen.
[PH] Hver gang du vurderer én person mens ti andre venter på likningen, deler du oppmerksomheten. Vi har valgt bort sveiping fordi produktet vårt optimaliseres ikke for hvor mange profiler du rekker å se — men for om én samtale faktisk blir til noe.

### 8.4 DERFOR ÉN MATCH OM GANGEN
[PF] Natt til lørdag forsøker vi å finne én person som passer deg. Én person — ikke ti.
[PH] Én person om gangen betyr mindre sammenligning, ingen matchsamling, og én samtale du kan legge energi i.
[PF] Vi forsikrer ikke om at du får en match hver uke. Finner vi ingen god nok, venter du til neste runde.
**MC (sits, ramme-gods):** «Vi vil heller la deg vente enn å koble deg tilfeldig.»
[PH] For oss er en dårlig kobling verdt mindre enn ingen kobling.

### 8.5 DERFOR 14 DAGER UTEN BILDER
[PH] Fysisk tiltrekning betyr noe. Vi forsøker ikke å late som noe annet. Forskjellen er rekkefølgen.
[OB] I mange digitale tjenester begynner vurderingen med bildet: bilde → vurdering → kanskje samtale → kanskje menneske.
[PF] Hos oss åpnes bildene først på dag 15. De første 14 dagene handler dere med ord. → /reisen
[PH] Når bildet kommer, kommer det ikke til to fremmede — men til to som allerede har noe.

### 8.6 MEN UTSEENDE BETYR JO NOE?
**H2:** Ja.
[PH] To mennesker kan bruke to uker på å bli kjent, og deretter oppdage at den fysiske tiltrekningen ikke er der. Det er en reell pris ved måten vi gjør det — og vi skjuler den ikke.
[PH] Likevel velger vi rekkefølgen. Grunnen: vi tror at et inntrykk bygget på ord er lettere å forstå enn et inntrykk bygget på et bilde. Og at det er lettere å si nei til noe som mangler enn å forklare hvorfor ansiktet ikke var rett.
**MC:** «Ja, utseende betyr noe. Derfor kommer bildet. Bare ikke først.»

### 8.7 TO MENNESKER, IKKE TO PROFILER
[OB] I store, åpne tjenester er profilen utgangspunktet: den optimale teksten, det beste bildet, filterene som fanger flest øyne. Noen profiler er også misvisende, manipulerte eller fullstendig oppdiktede — og noen av bildene er laget av maskiner.
[PF] Hos oss er profilen privat. Den vises aldri offentlig, og den andre ser bare et begrenset utvalg — fornavn og alder fra start, mer når dere velger. → /slik-fungerer-det
[PH] Vi kan ikke love at alle profiler er like sanne — ingen plattform kan det. Men vi kan si hva vi har valgt: her er ingen profil et vitrinasjestykke. Den er utgangspunkt for en samtale mellom to som allerede har snakket.
[PF] Vilkårene våre forventer at opplysningene er riktige, og at innholdet er respektfullt. (Lenke: /vilkar)

### 8.8 INTENSJON FREMFOR OPPMERKSOMHET
[OB] I mange digitale rom blandes mange intensjoner: seriøse relasjoner, casual kontakt, bare samtale, bekreftelse, oppmerksomhet, markedsføring. Ingen av dem er per seg feil — men de føles ulikt når man ikke vet hva man møter.
[PH] Vi har ikke en knapp som filtrerer intensjon — ingen plattform har det. Men vi bygger rommet slik at én intensjon blir tydeligst: å undersøke om noe finnes mellom to bestemte mennesker. Her kommer du ikke for å bygge et publikum. Du kommer for å se én person.
[MC] «Er du her for å bli sett — eller for å se noen?»
[PF] Markedsføring, salg og innsamling er uttrykkelig forbudt i vilkårene våre.

### 8.9 TEKNOLOGIEN HjELPER — DEN SNAKKER IKKE FOR DERE
[PF] Matchingmotoren vår ser på seks dimensjoner — verdier, tilknytning, personlighet, kommunikasjon, emosjonsregulering og livssituasjon — og de praktiske grensene dere har satt. Motoren bruker aldri bilder eller utseende. → /metoder
[PH] Motoren er en veiviser, ikke en kjærlighetsmaskin. Den reduserer åpenbare konflikter og prøver å finne én person det kan være verdt å bli kjent med. Den kan ikke forutsi om dere vil forelske dere — det lover vi ikke.
[PF] Det som skrives i chatten er av dere. Reisen er regelstyrt og lik for alle; det finnes ingen AI som skriver meldinger, gir råd eller opptar som samtalepartner.
[MC] «Teknologien kan hjelpe dere å møtes. Den skal ikke snakke for dere.»

### 8.10 TRYGGERE BETYR IKKE RISIKOFRITT
[PH] Ingen digital tjeneste kan garantere at alle mennesker er like gode som de fremstår. Vi lover ikke det.
[PF] Det vi kan: en privat profilmodell, rapportering, blokkering, muligheten til å avslutte reisen, og gradvis bildedeling. En rapport går rett til oss. → /trygghet (der står hele prosessen)
[PH] Trygghet er hos oss et utgangspunkt for designet — ikke et merke på pakken.

### 8.11 ET ANNET SYSTEM HAR OGSÅ EN PRIS
[PH] Vi er ærlige om hva prisene er, fordi vi tror du fortjener å vite hva du bytter:
- Du kan måtte vente. Match er ikke garantert hver lørdag.
- Du får ikke hundredvis av profiler å velge mellom. Du får én — eller ingen.
- Du ser ikke bildet med en gang. Bildet kommer på dag 15.
- Den første matchen trenger ikke å bli noe. Og da starter du på nytt.
- Fysisk tiltrekning kan utebli. Det skjer, og vi skjuler det ikke.
- Noen opplever tempoet som for langsomt. Det er en bevisst avgjørelse — og en pris.
[MC] Vi presenterer dette ikke som svakheter. Det er konsekvenser av valgene — de samme valgene som gir deg ro.

### 8.12 TOSOM PASSER IKKE FOR ALLE
**Venstre kolonne — «Tosom passer sannsynligvis ikke for deg hvis du vil ha:»**
- Store utvalg av profiler å velge mellom
- Raske valg og rask respons
- Mange parallelle samtaler
- Bilder med en gang
- Primært casual kontakt
**Høyre kolonne — «Tosom kan passe bedre hvis du vil ha:»**
- Et roligere tempo
- Én relasjon om gangen
- Vekt på samtalen fremfor bildet
- Tid til å bli kjent før dere møtes
- Et mer privat rom
[MC] Ingen av sidene er bedre enn den andre. De er bare ulike. Velg den som matcher hva du egentlig søker.

### 8.13 DE TO MODELLERNE (sammenligning)
**H2:** To måter å gjøre det på.
To kolonner: «En vanlig modell» ↔ «Tosom». Bruk venstresiden generisk («en vanlig modell» / «mange tjenester») — aldri «X-tjenesten gjør Y» uten dokumentasjon.

| En vanlig modell | Tosom |
|---|---|
| Mange profiler å vurdere | Én match om gangen [PF] |
| Utseende før innhold | Samtalen først, bildet på dag 15 [PF] |
| Sveiping og øyeblikksvalg | Guidet 30-dagers reise [PF] |
| Flere parallelle samtaler | Én aktiv reise [PF] |
| Profilen er vitrine | Profilen er privat [PF] |
| (betalingsrad) | **PENDING — fjernes i v1, settes inn kun når betalingsmodellen er ferdig og verifisert (TC-03/TC-35/Vipps)** |

*Tabellen er den eneste «nye» visuelle byggesteinen på siden (se sks. 17).*

### 8.14 CTA
[MC] Vil du prøve en annen måte?
**Primær knapp:** «Start reisen» → /register (etablert CTA-flyt; /register auto-registrerer via /login — TC-21, endres ikke)
**Sekundær:** «Lær mer om metoden» → /metoder
*(Ingen ny CTA-destinasjon. Ingen matchgaranti i CTA-omgivelser.)*

## 9. AI — PRESIS HÅNDTERING (sks. 15 i oppdraget)

**Faktisk stand (verifisert):** `lib/ai/` er arkivert; ingen levende produktkode importerer AI-provider. Matching er deterministisk scoring (dealbreakers + seks dimensjoner). Vilkarene sier: «det finnes ingen AI som skriver meldinger, gir råd eller opptar som samtalepartner.»

| Begrep | Stands på Tosom | Må vi love det? |
|---|---|---|
| Matchingalgoritme | Deterministisk, regelbasert | Beskrives som «motor»/«veiviser» — ikke «AI» |
| Automatisering (cron, kø) | Eksisterer | PF, kan nevnes nøkternt |
| AI/LLM i runtime | **Finnes ikke i dag** | Kan si «det finnes ingen AI som …» (dokumentert i vilkår) — men IKKE «plattformer kan aldri…» |
| AI-generert brukerkommunikasjon | Forbudt som prinsipp (masterplan I-7) | Formuleres som prinsipp: «Samtalen skal være deres.» |
| AI-genererte bilder | Ingen teknisk deteksjon | **Ikke påstå at vi oppdager/forhindrer.** Bare: vilkårene forventer riktige opplysninger |
| Brukerregler | Eksisterer (vilkår) | PF — kan lenkes |
| Teknisk AI-deteksjon | **Eksisterer ikke** | FORBUDT: «vi oppdager AI-bruk» / «vi forhindrer AI-bilder» |

**Formuleringsskjell:** «Samtalen skal være deres» + «det finnes ingen AI som skriver for dere» (PF) + «vi kan ikke teknisk oppdage all AI-bruk — derfor bygger vi tillit på regelverk og atferd, ikke på deteksjon» (valgfri ærlighetslinje, PH). **Ikke** den absolute «INGEN AI»-banneret uten definisjon.

## 10. GHOSTING/SPAM/UØNSKET INNHOLD — ORDLISTE OG TONE

**Tillatt ordvalg (atferd, ikke kjønn):** uønskede seksuelle bilder, ghosting, masseutsendte meldinger, falske eller misvisende profiler, kommersiell promotering, markedsføring, «oppmerksomhet fremfor relasjon», forskjellige intensjoner, svindel/miskreft (lenke til rapportering), manipulerte bilder, AI-genererte bilder.

**Forbudt:** «menn sender …», «kvinner søker …», «fuckboys», kjønnsklisjéer, «datingapper er giftige», generelle kjønnsdømmende uttalelser.

**Tone-prinsipp (sks. 3):** Vi skulder ikke noen. Vi forklarer hvorfor rommet er bygd som det er. Ghosting omtales i seksjon 8.8/8.10 som én av konsekvensene av lave investeringsrom — ikke som en sykdom i samfunnet. Svindel/utnyttelse: kort, seriøst, med peker til rapportering — ingen sjokk-statistikk (EF-forbud).

## 11. RISIKO/TRYGGHET — HVA SOM MÅ STÅ (sks. 16 i oppdraget)

- Ikke «trygt» som absolutt. Bruk «tryggere»/«et tryggere rom» (i samsvar med /trygghet).
- PF-funksjoner som kan oppsummeres (alle allerede dokumentert på /trygghet): privat profilmodell, rapportering, blokkering, avslutt reise, gradvis bildedeling, «vi leser aldri samtalen uten at det foreligger en rapport».
- **Ikke** på /motpol: responstidsløfter (TC-23 = OPERATIONS DECISION, ikke VERIFIED), bakgrunnssjekk (eksisterer ikke), «risikofritt», «alle er verifisert» (Vipps/identitet PENDING, sks. 22 i oppdraget).
- Alt detaljnivå → lenke /trygghet. Motpol gjentar maks én setning per funksjon.

## 12. KJØNN/PRIVAT-HOLD — KARTLEGGING AV KJØNNSPUNKTER

Se sks. 10. I tillegg: ingen statistikk om kjønnsforhold i køen, ingen «flere kvinner enn menn»-type påstand (EF + operasjonelt sensitivt). Null kjønnsreferanser utover «to mennesker».

## 13. OVERLAPP MOT EKSISTERENDE SIDER (sks. 30)

| Tema | Hjem | Motpol-handling |
|---|---|---|
| HVA er Tosom | `/` | **SUMMARIZE** (2 setninger i hero/lead) + lenke |
| HVORDAN flyten | `/slik-fungerer-det` | **SUMMARIZE** (1–2 setninger i 8.9) + lenke. **DO NOT DUPLICATE** detaljflyt |
| Reasens 30 dager | `/reisen` | **REFERENCE/LINK** (dag 15 nevnes én gang i 8.5) |
| Seks dimensjoner/metode | `/metoder` | **SUMMARIZE** (dimensjonene lister i 8.9) + lenke. **DO NOT DUPLICATE** forskningsdelen |
| Trygghet (prosess) | `/trygghet` | **SUMMARIZE** (kort, 8.10) + lenke |
| Målgrupper/«tosomhet» | `/hvorfor` | **DO NOT DUPLICATE** «who it's for»-listen. 8.12 er negativt formulert (komplementært), lenke til /hvorfor |
| Priser | `/priser` | **DO NOT DUPLICATE** — ingen pris-påstand i v1 (PENDING) |
| FAQ-svar | `/faq` | **DO NOT DUPLICATE**. Motpol kan senere få 1–2 FAQ-punkter om motpol-spørsmål blir vanlige (ikke nå) |
| Merkevare/verdier | `/om-oss` | **REFERENCE/LINK** (valgfri lenke i 8.2) |

Prinsipp: Motpol tilfører *forklaring* (why), aldri *informasjon* (what/how) som allerede har en side.

## 14. INTERN LINKING (sks. 31)

**Fra /motpol til:** /register (CTA), /metoder (8.9, CTA-sek), /slik-fungerer-det (8.7), /reisen (8.5), /trygghet (8.10), /vilkar (8.7, 8.8), /hvorfor (8.12). Kun der de naturlig utdyper — maks 7 ulike destinasjoner, hver maks 2 forekomster.

**Til /motpol fra (anbefaling, implementeres i eget ACT):**
1. **Footer (offentlig-seksjonen):** «Motpol» — lav risiko, høy synlighet. *Anbefales.*
2. **Bakside av /hvorfor:** lenkekort «Lurer du på hvorfor vi har valgt akkurat denne veien?» → /motpol. Høy verdi: /hvorfor-lesem er nett målgruppens nysgjerrighetsnivå. *Anbefales.*
3. **/slik-fungerer-det, bakside:** liten lenke «Hvorfor er det slik? → Motpol». *Anbefales.*
4. **Landing:** ikke i v1 (hero er allerede full). Vurder etter beta.
5. **AppHeader-prinipalmeny:** ikke i v1 (unngå navbloat). Vurder etter at siden har betadatra.

## 15. RESEARCH/SOURCE PLAN (sks. 23–24 i oppdraget)

**v1-avgjørelse: ZERO EF/RC-kilder.** Siden skal fungere uten. Grunn: (a) filosofi trenger ingen vitenskapelig stempling (sks. 7 i oppdraget), (b) ACT A1 viste prisen på uverifiserte referanser, (c) OB-formuleringer dekker «problem»-rammen uten påståelig statistikk.

**Hvis** en senere utvidelse faktisk skal legge til EF/RC (kun hvis George beslutter at siden trenger ekstra troverdighet på ett spesifikt poeng), gjelder:

| Kandidat-påstand (tema) | TYPE | SOURCE REQUIRED | SOURCE QUALITY | SAFE WORDING | RISK | BESLUTNING v1 |
|---|---|---|---|---|---|---|
| «Mange valg kan oppleves som overveldende» («choice overload»-tema) | EF/RC | Systematisk review/større fagfellevurdert studie, verifisert primærkilde | ≥ systematisk review eller meta-analyse | «Noen opplever mange valg som overveldende» (uten tall) | Medium — lett å overdrive | **REMOVE i v1** — dekkes av OB («For andre blir det støy») |
| «Fysisk utseende veier tyngst i første vurdering» | RC | Større fagfellevurdert studie (first-impression-litteratur) | Fagfellevurdert, original | «Fysisk tiltrekning betyr noe» (uten «viser forskning») | Medium | **REMOVE i v1** — dekkes av PH (8.5/8.6) |
| «Datingapper X-øker ulykkelighet/singelisme» | EF/RC | — | — | — | **Høy** — kausale overtolkninger | **REMOVE permanent** — ikke forsøk |
| «Sveiping reduserer evnen til å knytte seg» | RC | — | — | — | **Høy** | **REMOVE permanent** |
| Spesifikke brukertall («millarder i sveiper i uken») | EF | Markedsrapport med kilde | Anerkjent analysehus | — | Medium — aldrer raskt | **REMOVE i v1** |

**Prosesskrav (binding for alle fremtidige kilder):** (1) Kun primærkilder, systematiske reviews, fagfellevurderte studier, anerkjente store undersøkelser, offentlige myndigheter. (2) Ingen «én studie» som bærer en setning. (3) Ingen korrelasjon framstilt som kausalitet. (4) **Ingen genererte/plausible kilder, ingen oppfunne DOI-er** — hver kilde skal ha URL/DOI som kan åpnes og verifiseres før copy skrives. (5) Uverifiserbar kilde → påstanden skrives ikke som faktagrunnlag (OB/PH i stedet). (6) Kilde registreres i denne filen med CLAIM/TYPE/SOURCE/QUALITY/SAFE WORDING/RISK/USE-REMOVE-REWRITE før implementering.

## 16. VISUELL RETNING (sks. 27)

Prinsipp: **STØY → RO · MANGE → ÉN · OVERFLATE → DYBDE · HØYT TEMPO → TID.**
- Siden bruker eksisterende designsystem (dark navy + gull, GlassCard, Reveal, hero-mønster) — **ingen nytt designsystem, ingen gimmick**.
- Subtil narrativ: seksjon 2–3 kan være visuelt «tetteste» (lite, tettere typografi, eventuelt en diskret kolonne med «mange stemmer» som avtoner), og siden blir gradvis roligere mot CTA (mer luft, større avstander, én element i gangen). Realiseres med spacing/tett gradvis endring — **ingen tung animasjon**, ingen scroll-hacking, ingen parallax.
- Motpol-ordet kan få én diskret visuell signatur (f.eks. ett gull-accentert ord per seksjon), men dette er dekorasjon ikke bærersystem.

## 17. KOMPONENTER (sks. 34)

| Komponent | Status | Notat |
|---|---|---|
| `PageShell`, `Container`, `Section`, `Hero`, `Grid`, `Stack` (components/ui/layout) | **REUSE** | Som de andre offentlige sidene |
| `GlassCard` (components/ui/cards) | **REUSE** | Tekst-kort |
| `ToSomSection`/`ToSomButton` (components/ui/system) | **REUSE** | Knapper/sections |
| `Reveal` (components/motion) | **REUSE** | Respekterer prefers-reduced-motion (verifisere i ACT) |
| `AppHeader`/`Footer` (components/ui/layout) | **REUSE** | Navigasjon/fot |
| Sammenligningstabell (8.13) | **NEW COMPONENT REQUIRED** | Én liten presentasjonskomponent, f.eks. `components/motpol/ComparisonRows.tsx`: tilgjengeliggjort to-kolonne-paar med semantiske `<div>`/`<dl>`, ingen hover-avhengighet, stables til én kolonne på mobil. Ingen ny dependency |

## 18. MOBILSTRATEGI (sks. 28)

Teksttung side → mobil er primær: avsnitt ≤ 3 linjer, H2 med tydelig puste, vertikal rytme via eksisterende spacing-skala, ingen fast bredde/horisontal overflow (test: 360px), sammenligningstabellen stables til én kolonne med «↔» som vertikal skillelinje, CTA-knapper fullbredde, touch-target ≥ 44px, ingen hover-kun-interaksjon (Reveal må ha reduced-motion + no-JS fallback i samsvar med MessageBubble LIVE-FIX-læring), god kontrast (eksisterende fargeskala er AA-sjekket på /tilgjengelighet).

## 19. ACCESSIBILITY (sks. 29)

Semantisk heading-hierarki (én H1 «Motpol», H2 per seksjon, H3 i kolonner i 8.12/8.13), full keyboard-navigasjon + synlig focus (eksisterende pattern), prefers-reduced-motion respekt, ingen informasjon kun via farge (sammenligningsradene må fungere som tekst), lesbar tekstbredde (~65–75 ch), aria-label kun der semantikk ikke rår. Verifiseres manuelt i ACT (screen reader pass) + MOT-tester.

## 20. SEO (sks. 32 — PLAN)

- **URL:** `/motpol` (enkelt, søkbart, ingen understi)
- **TITLE:** `Motpol – et annet svar på moderne dating | Tosom` (54 tegn)
- **META DESCRIPTION:** `Tosom forsøker en annen vei: én match om gangen, samtalen før bildet, et mer privat rom. Ikke mer dating — mindre støy.` (119 tegn)
- **OG TITLE:** `Motpol – et annet svar på moderne dating`
- **OG DESCRIPTION:** samme som meta
- **OG IMAGE:** PENDING (seksjon 22.I i oppdraget — separat P2-oppgave; metadata refererer kun når bildet eksisterer)
- **CANONICAL:** `https://www.tosom.no/motpol` (følger ACT C-mønster; per-side metadata-export som de andre offentlige sidene)
- **Sitemap:** legges til i `OFFENTLIGE_SIDER` i implementerings-ACT (priority 0.7, monthly) — **endres ikke nå**
- **Robots:** ingen endring (alt tillatt utenom /admin /api)
- **Ingen clickbait, ingen research-claims, ingen matchgaranti i metadata** (MOT-02/03/04/09)

## 21. CTA-STRATEGI (sks. 33)

Primær: «Start reisen» → `/register` (redirect → /login auto-registrering — etablert TC-21-flyt, brukes nøyaktig som på /priser og landing). Ingen ny destinasjon. Sekundær: «Lær mer om metoden» → /metoder. I implementerings-ACT: verifisere at /register-redirect fortsatt er slik (MOT-16).

## 22. TESTPLAN (MOT-01–19)

| ID | Test | Metode |
|---|---|---|
| MOT-01 | /motpol renderes (200, H1 «Motpol» tilstede) | jest route-test eller e2e |
| MOT-02 | canonical = https://www.tosom.no/motpol | grep/jest på metadata-export |
| MOT-03 | index/follow (ikke noindex) | grep i metadata + robots |
| MOT-04 | Ingen matchgaranti | grep: «garanti», «lovet», «hver uke» (negasjon-sjekk) |
| MOT-05 | 14-dagerscopy samsvarer med dag-15-implementasjon | grep «dag 15» + krysse med engine (M-6) |
| MOT-06 | Ingen udokumentert «ingen AI»-garanti (ingen deteksjons-påstand) | grep: «oppdager», «forhindrer», «detekterer» |
| MOT-07 | Ingen falsk-profil-garanti | grep: «alle profiler er sanne», «ingen falske» (negasjon-sjekk) |
| MOT-08 | Ingen betaling/Vipps-copy | grep: «Vipps», «abonnement», «pris» (skal kun treffe i lenke-tekst til /priser hvis overhode) |
| MOT-09 | Ingen uverifiserte forskningsreferanser | grep: «studie», «forskning», «beviser», «viser at», DOI-mønster |
| MOT-10 | Tosom-brand korrekt | grep «ToSom»/«TOSOM» = 0 i siden |
| MOT-11 | Bokmål | `npm run verify:lang` (språkvakten) |
| MOT-12 | Mobil layout | Manuell (360px) + ingen horisontal overflow |
| MOT-13 | Keyboard/focus | Manuell pass |
| MOT-14 | Reduced motion | Manuell (prefers-reduced-motion) |
| MOT-15 | Internlinker gyldige | `npm run verify:api`-analog / grep mot eksisterende ruter |
| MOT-16 | CTA peker til etablert flyt (/register) | grep/jest |
| MOT-17 | `npm run verify` grønn | CI |
| MOT-18 | `npm run lint` grønn | CI |
| MOT-19 | `npm run build` grønn | CI |

## 23. PENDING-OMRÅDER (MOTPOL MÅ IKKE FOREGRIPE — sks. 22 i oppdraget)

| # | Område | Konsekvens for /motpol |
|---|---|---|
| A | Vipps/betaling | Ingen betalingseksjon, ingen pris, ingen «abonnement ↔»-rad |
| B | Refusjonsmodell | Ingen refusjonspåstand |
| C | TC-15 samtykketrekk (PARTIALLY FIXED / LEGAL VERIFICATION) | Ikke nevnt på siden (personvern-hjem) |
| D | Support-responstid (TC-23, OPERATIONS DECISION) | Ingen responstidsløfte på /motpol |
| E | Ventetid | Ingen «forventet ventetid»-tall |
| F | Geografi | Ingen «Oslo-only»- eller andre geografiske påstander |
| G | Falske profiler | Ingen «de finnes ikke»-påstand |
| H | AI-deteksjon | Ingen deteksjons-/forhindre-påstand |
| I | OG-image + P2 followups | Separat oppgave, blokkerer ikke siden (kun OG-image-metadata) |

## 24. PRODUKTAVGJØRELSE SOM GEORGE MÅ TA

| # | Avgjørelse | Anbefaling |
|---|---|---|
| D1 | Navigasjon: hvor lenkes det til /motpol? (footer? footer + /hvorfor + /slik-fungerer-det?) | **Footer + /hvorfor + /slik-fungerer-det** (sks. 14) |
| D2 | Sammenligningsrad «Abonnement ↔ ?»: fjerne eller beholde tom? | **Fjerne helt** til betalingsmodellen er verifisert (A/B) |
| D3 | Sitemap-prioritet | 0.7 |
| D4 | Landing-teaser (lenkeknapp på forsiden)? | **Nei i v1** — vurder etter beta |
| D5 | Arbeidstittelen «Motpol – et annet svar på moderne dating» som sluttform? | Bekrefte (nyt merkevareord) |
| D6 | Endelig copy-godkjenning (sks. 8 er forhandler) | **Må ges før implementerings-ACT** — copy er kjernen i siden |
| D7 | OG-image (seksjon 22.I) | Separat P2, kan komme etter live |

## 25. IMPLEMENTERINGSREKKERØLDE (neste ACT, ikke nå)

1. D1–D6 besluttet + sluttcopy godkjent (D6).
2. Route `app/motpol/page.tsx` + metadata (canonical/title/meta/OG, ACT C-mønster).
3. Innholdsseksjoner 1–14 med sluttcopy + påstandstyper som kodekommentarer (PF/PH/OB/MC).
4. `components/motpol/ComparisonRows.tsx` (én ny komponent, ingen dependencies).
5. Inngående lenker (D1) + utgående lenker (sks. 14).
6. Sitemap: `OFFENTLIGE_SIDER` + /motpol (D3).
7. Tester MOT-01–19; `npm run verify` → `npm run lint` → `npm run build` (sekvensiell).
8. Manuell pass: mobil (360px), keyboard/focus, reduced motion, screen reader.
9. Commit (én ACT-commit), deploy = separat avgjørelse.

## 26. RISKOMRÅDER (estimerte)

| Risiko | Sandsynlighet | Skade | Mitrering |
|---|---|---|---|
| Tone-drift mot bitter/anti-dating | Medium | Høy (merkevare) | Tone-checklist i copy-review (sks. 4/10) + D6-godkjenning |
| ubevisste research-påstander sneker seg inn | Medium | Høy (ACT A1-historikk) | Påstandstyper i koden + MOT-09 grep + review |
| Duplisering av andre sider | Medium | Medium (vedlikehold, forvirring) | Overlap-tabell (sks. 13): lenke, ikke kopiér |
| Mobil-overflow i sammenligning | Lav | Medium | MOT-12 + 1-kolonne-stack |
| «Tryggere»-overtrekk | Lav | Høy (tillit) | Skjs. 11: kun oppsummering + lenke |
| CTA-destinasjon endret i mellomtiden | Lav | Lav | MOT-16 verifiserer i ACT |
| Sitemap/canonical-inkonsekvens mot ACT C | Lav | Medium | Følg eksisterende pattern nøyaktig |

## 27. GO-LIVE PREREQUISITES

1. D1–D6 besluttet; D6 (sluttcopy) godkjent.
2. MOT-01–19 grønne (inkl. verify/lint/build).
3. Manuell mobil/a11y-pass godkjent.
4. Sitemap oppdatert (D3).
5. Deploy-avgjørelse (separat — ikke del av siden).
*Side er IKKE avhengig av Vipps/betaling/TC-15/support-avgjørelser — disse berører kun PENDING-rader som er fjernet i v1.*

## 28. KILDEGRUNNLAG FOR DENNE PLANEN (verifisert 24.10.2026)

- `app/vilkar/page.tsx` — F1, F2, F4, F6, F8, F10, F11 (privat profil, matcherunde, motoren bruker aldri bilder, regelstyrt reise, ingen-AI-linje, brukervilkår)
- `app/(landing)/page.tsx` — F3 (venting), hero-claims
- `app/faq/page.tsx` — F5, F7 (svarene på «Hvorfor ingen bilder fra start?», «Hvordan fungerer matching?»)
- `app/trygghet/page.tsx` — F9 (rapport/blokkering/avslutt, moderering, «vi leser aldri…»)
- `app/metoder/page.tsx` — F13 (etablerte avgrensninger)
- `app/api/cron/matching/` + `.github/workflows/ci.yml` (cron-guard) — F2
- `lib/matching/` (cheapFeatures, dealbreaker, scoreRound, dimensions) — F7/F4
- `app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx` — ACT C-struktur (F12)
- `app/register/page.tsx` — TC-21-flyt (redirect /login)
- `docs/LanseringsCheckList.md` — TC-03/09/15/21/23, P1-4, ACT A1/C/D-resultater

## 29. BESLUTNING: **BUILD WITH CHANGES**

**Hvorfor:** Siden fyller et reelt dokumentert gap (hvordans-siden finnes ikke), har høy merkevareverdi, kan bygges 100 % på verifiserte fakta + filosofi (null research-avhengighet), og koster lite (én side + én liten komponent, null dependencies, null logikk).

**Endringer som MÅ gjøres før ACT (BUILD WITH CHANGES-listen):**
1. **Slå sammen seksjon 3+7** («mer er ikke mer» + «hvorfor ingen sveiping») — én tanke, ett kapittel.
2. **Null EF/RC-kilder i v1** — alle «problem»-rammer skrives som OB/PH. Research-plan (sks. 15) er forbeholdt en senere, bevisst utvidelse.
3. **Betalingsrad fjernes** fra sammenligningen (ikke «PENDING»-grårad — borte) til TC-03/TC-35/Vipps er lukket.
4. **Ingen absolutt «INGEN AI»** — prinsipp («Samtalen skal være deres») + dokumentert PF-linje fra vilkårene. Ingen deteksjons-påstand.
5. **Ingen evne-påstander** mot falske profiler/AI-bilder — kun vilkår + ærlig «ingen plattform kan love sannhet».
6. **Trygghetseksjon = oppsummering + lenke** — ingen nye claims, ingen responstidsløfte.
7. **«Men utseende betyr jo noe?»-seksjon er obligatorisk** med ærlig trade-off (fysisk tiltrekning kan utebli) — tillitsbygging, ikke dekorasjon.
8. **Sannhetsmodellen i én-match-seksjonen**: natt til lørdag, ikke garantert, kø, «Vi vil heller la deg vente enn å koble deg tilfeldig.»
9. **CTA = etablert flyt** (/register), ingen ny destinasjon.
10. **Design = gjenbruk**; maks én ny komponent (sammenligning); ingen tung animasjon.

**Neste steg (etter godkjenning):** D1–D6 avgjørelser + copy-godkjenning (D6) → implementerings-ACT (sks. 25).
