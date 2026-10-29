# OPPGAVER INVENTORY v2.0

> **Status:** CANONICAL INVENTORY for Oppgaver Library V2 (135 oppgaver).
> **Dato:** 29.10.2026 · **Kilde (canonical):** `app/chat/data/tasks.ts` · **Tidligere versjon:** `docs/BLI-KJENT-OG-OPPGAVER-INVENTORY-v1.0.md` (TASK-001–TASK-135, historisk).
> **Metode:** Alle 135 oppgaver er verifisert ved lesing mot datafilen. T2-numre følger datafilrekkefølgen (kategori 1 = T2-001…T2-015 osv.).

---

## A. Editorial principles

Oppgaver er et verktøy for **LEK · NYSGJERRIGHET · SAMTALE · SMÅ HISTORIER · LAVTERSKEL KONTAKT** — ikke for analyse, kompatibilitetstest eller emosjonell utforskning. Hver oppgave skal:

1. Være noe en ekte bruker faktisk trykker på og sender i chatten.
2. Være lett å forstå, konkret og gjennomførbar med ren tekst.
3. Føles frivillig og lavterskel (ingen plikt, ingen konkurranse).
4. Være forskjellig fra de andre oppgavene (global dedup, mål 0 eksakte).
5. Være skrevet på naturlig bokmål (ingen AI-artefakter, ingen Nynorsk).
6. **Respekt PHOTO DAY 8:** ingen oppgave skal effektivt be brukeren beskrive hele utseendet.
7. **Sensitive-content guard:** ingen traumer, overgrep, eksplisitt seksuelt, sensitive helseopplysninger, selvskading, ulovlig, eller PII.

Ikke-krav: avsløre noe dypt, teste kompatibilitet, analysere personen, bli emosjonell, gi psykologisk innsikt.

## B. Runtime source

| Innhold | Canonical source | Konsument (runtime) |
|---|---|---|
| Oppgaver | `app/chat/data/tasks.ts` (`taskCategories`) | `app/chat/components/OppgaverPanel.tsx` (chat-panelet) |

Data er hardkodet TypeScript (`string[]` per kategori, ingen DB, ingen ID-metadata i runtime). Oppgaver sendes som chat-melding med `metadata.source = "oppgave"`. Panelet er fullt data-drevet — ingen hardkodet indeks/15-tall i logikk.

## C. Kategorier (9 × 15 = 135)

Uendret rekkefølge, navn og ID-er fra V1:

1. `kunne-vil-du-si` — Kunne-vil-du-si
2. `fortell-meg-om` — Fortell meg om
3. `hvis-du` — Hvis du...
4. `to-sannheter` — To sannheter, en løgn
5. `sang` — Sang som beskriver deg
6. `uventet` — Uventet om meg
7. `nordisk-kveld` — Nordisk kveld
8. `gjetter-du-meg` — Gjetter du meg?
9. `bygg-en-historie` — Bygg en historie

Testdeksning: `__tests__/oppgaver-library.test.ts` (OT-01 … OT-18).

## D. Finale 135 oppgaver (T2-001 … T2-135) + mapping

Kilde-typologi: **ubrettet** (identisk med V1) · **omvretta** (samme tema, ny ordlyd, spores til TASK-xxx) · **Nytt** (ingen V1-tilsvarer) · **Erstattet TASK-xxx** (eksplisitt sikker utgave av et flagget V1-problem).

| T2-ID | Oppgave | Kilde |
|---|---|---|
| **1. KUNNE-VIL-DU-SI** | | |
| T2-001 | Kunne du leve en uke uten musikk, eller en uke uten kaffe? | TASK-001, ubrettet |
| T2-002 | Kunne du bo midt i en storby for alltid, eller i en liten bygd uten én butikk i gangavstand? | Nytt |
| T2-003 | Kunne du ha alle reiser planlagt ned til minuttet, eller reise uten plan og se der det bærer? | Nytt |
| T2-004 | Kunne du få alle pengene du ønsket i en uke, eller en helt fri uke uten én eneste oppgave? | Nytt |
| T2-005 | Kunne du være helt frisk på morgenen hver dag, eller ha alle dine beste tanker om natten? | Nytt |
| T2-006 | Kunne du bo hvor som helst i verden, men bare ett sted resten av livet? | Nytt |
| T2-007 | Kunne du spise den samme maten hver dag i to uker, eller aldri få velge hva du spiser igjen? | TASK-003, ubrettet |
| T2-008 | Kunne du bo i et hus uten internett i ett år, eller ha internett overalt men bo på 20 kvadratmeter? | TASK-010, omvretta |
| T2-009 | Kunne du si nei til alle sosiale planer i en måned, eller være på en fest hver fredag i to år? | TASK-004, ubrettet |
| T2-010 | Kunne du reise hvor som helst i verden med én liten sekke i en måned, eller ha alt du trenger men aldri forlate huset? | Nytt |
| T2-011 | Kunne du ha en drømmejobb som betaler dårlig, eller en kjedelig jobb som betaler godt? | TASK-005, omvretta |
| T2-012 | Kunne du jobbe helt alene i en fjellhytte i en måned, eller bo midt i en storby uten én du kjenner? | TASK-002, omvretta |
| T2-013 | Kunne du alltid vite nøyaktig hva klokka er uten klokker, eller aldri vite hvilken dag i uken det er? | TASK-014, omvretta |
| T2-014 | Kunne du spise dessert til alle måltider i en måned, eller aldri få dessert igjen? | Nytt |
| T2-015 | Kunne du alltid treffe grønt lys, eller alltid finne en ledig parkeringsplass? | Nytt |
| **2. FORTELL MEG OM** | | |
| T2-016 | Fortell meg ditt beste minne fra en ukeend du aldri glemmer. | TASK-016, ubrettet |
| T2-017 | Fortell meg om en fremmed du møtte som du aldri glemte. | TASK-017, omvretta |
| T2-018 | Fortell meg om en gang du var helt alene og trivdes. | TASK-018, omvretta |
| T2-019 | Fortell meg om en matrett som alltid tar deg tilbake til noen. | TASK-019, ubrettet |
| T2-020 | Fortell meg om et sted i verden der du føler deg helt hjemme. | TASK-020, ubrettet |
| T2-021 | Fortell meg om en gang du sa ja, og det ble det beste valget. | TASK-021, omvretta |
| T2-022 | Fortell meg om en person som alltid visste hvordan de skulle få deg til å le. | TASK-022, ubrettet |
| T2-023 | Fortell meg om en kveld der du gledet deg så mye at du nesten gråt. | TASK-023, omvretta |
| T2-024 | Fortell meg om en gang du oppdaget noe om deg selv du ikke visste før. | TASK-024, ubrettet |
| T2-025 | Fortell meg om en sang som alltid tar deg tilbake til et øyeblikk. | TASK-025, ubrettet |
| T2-026 | Fortell meg om en gang du var redd, men gjorde det allikevel. | TASK-026, ubrettet |
| T2-027 | Fortell meg om en gave du mottok som betydde mer enn du sa det betydde. | TASK-027, ubrettet |
| T2-028 | Fortell meg om en kveld da alt var helt greit uten noen særlig grunn. | TASK-028, omvretta |
| T2-029 | Fortell meg om en gang du hjalp noen og husket det lenge etter. | TASK-029, omvretta |
| T2-030 | Fortell meg om et lite ritual du har som ingen andre vet om. | TASK-030, omvretta |
| **3. HVIS DU** | | |
| T2-031 | Hvis du kunne teleportere til et sted i verden akkurat nå — hvor, og hvorfor? | TASK-031, ubrettet |
| T2-032 | Hvis du kunne ha en superkraft bare i dag, hvilken ville du velge? | TASK-032, ubrettet |
| T2-033 | Hvis du kunne spise lunsj med én person fra fortiden, hvem, og hva ville dere snakke om? | TASK-033, omvretta |
| T2-034 | Hvis du kunne starte på nytt i et annet yrke i morgen, hva ville det være? | TASK-034, ubrettet |
| T2-035 | Hvis du fikk en time der ingen kunne ringe deg — hva ville du gjøre med den? | TASK-035, ubrettet |
| T2-036 | Hvis du kunne skrive et brev til deg selv for ti år siden, hva ville du skrive? | TASK-036, ubrettet |
| T2-037 | Hvis du kunne lage en perfekt fredagskveld, hvordan ville den se ut? Klokke for klokke. | TASK-037, omvretta |
| T2-038 | Hvis du kunne ha et hus hvor som helst i verden, hvilken stil og hvor? | TASK-038, omvretta |
| T2-039 | Hvis du plutselig fikk en uke helt fri til å gjøre hva du ville, hva ville du gjøre? | Erstattet TASK-039 |
| T2-040 | Hvis du hadde ubegrenset tid, men begrenset penger — hva ville du gjøre i neste uke? | TASK-040, ubrettet |
| T2-041 | Hvis du kunne endre én ting ved måten folk hilsner på hverandre, hva ville det være? | TASK-041, ubrettet |
| T2-042 | Hvis du kunne ha et rom til deg selv ingen andre gikk inn i — hvilket rom, og hvorfor? | TASK-042, omvretta |
| T2-043 | Hvis du kunne lage én regel for hele verden som alle måtte følge i en uke, hvilken regel? | TASK-043, ubrettet |
| T2-044 | Hvis du kunne ha en uke der ingen visste hva du gjorde, hva ville du gjøre? | TASK-044, omvretta |
| T2-045 | Hvis du var garantert at ingenting galt kunne skje i en hel dag, hva ville du gjøre? | Erstattet TASK-045 |
| **4. TO SANNHETER, EN LØGNN** | | |
| T2-046 | Del to sannheter om deg selv og én du har funnet på. Jeg gjetter hvilken som er løgna. | TASK-046, omvretta |
| T2-047 | Fortell meg tre ting fra barndommen din — men én av dem er helt oppfunnet. Hvilken er den? | TASK-047, omvretta |
| T2-048 | Gi meg to ekte reiseminner og én du fant på. Kan du lure meg? | TASK-048, ubrettet |
| T2-049 | Fortell meg tre ting om maten du liker. Én er feil. Kan du spotte den? | TASK-052, omvretta |
| T2-050 | Del tre fakta om jobben din. Én er oppfunnet. Hvor er løgna? | TASK-051, omvretta |
| T2-051 | Fortell meg tre hobbyer du driver med. Én har du aldri drevet med. Gjetter du? | TASK-054, omvretta |
| T2-052 | Gi meg tre ting fra skoletiden din. Én er oppfunnet. Hvilken er den? | Nytt |
| T2-053 | Nevn tre ting du er overraskende god på. Én er du ikke god på. Gjetter du? | TASK-060, omvretta |
| T2-054 | Fortell meg tre steder du har bodd. Én er ikke ekte. Kan du finne den? | TASK-055, omvretta |
| T2-055 | Del tre rare ting du faktisk liker. Én liker du ikke. Hvilken? | Nytt |
| T2-056 | Gi meg tre filmer du har sett. Én har du ikke sett. Hvilken? | Erstattet TASK-056 |
| T2-057 | Fortell meg tre ting du gjør på en lørdag. Én gjør du aldri. Hvilken? | TASK-053, omvretta |
| T2-058 | Del tre ting om hvordan du sover. Én er ikke sant. Hvilken? | TASK-059, ubrettet |
| T2-059 | Nevn tre ting du alltid gjør om morgenen. Én gjør du aldri. Gjetter du? | Nytt |
| T2-060 | Gi meg tre ting om folkene i livet ditt. Én er oppfunnet. Kan du lure meg? | TASK-058, omvretta |
| **5. SANG SOM BESKRIVER DEG** | | |
| T2-061 | Velg én sang som beskriver deg i dag. Hvilken, og hvorfor nettopp den? | TASK-061, omvretta |
| T2-062 | Send meg tittelen på en sang du aldri ville gitt innrømme at du liker. | Nytt |
| T2-063 | Hvilken sang synger du med på høyt da du er alene i bilen? | TASK-064, omvretta |
| T2-064 | Hva er en sang du hørte som barn som du fortsatt syns er god? | TASK-074, omvretta |
| T2-065 | Hvis noen skulle filme en dag i livet ditt, hvilken sang ville spilt i bakgrunnen? | TASK-062, omvretta |
| T2-066 | Hvilken sang får deg alltid til å grine? Si fra om du har hørt den for mange ganger. | TASK-065, omvretta |
| T2-067 | Hvis livet ditt var et album, hva ville tittelen være — og hvilken låt er du akkurat nå? | TASK-066, omvretta |
| T2-068 | Hvilken sang hører du når du har det dårlig, og hva gjør den med deg? | TASK-067, omvretta |
| T2-069 | Lag en spilleliste med bare tre låter som beskriver deg. Hvilke tre? | TASK-068, omvretta |
| T2-070 | Hvilken artist burde alle bli kjent med, men som de fleste har gått glipp av? | TASK-073, omvretta |
| T2-071 | Hva er en sang du har danset til alene i kjøkkenet? (Vi gjør alle det.) | TASK-070, omvretta |
| T2-072 | Hvis du skulle anbefale én sang til meg for å forstå deg, hvilken ville det bli? | TASK-072, omvretta |
| T2-073 | Gi meg to artister. Én har du faktisk hørt mye, én har du ikke. Gjetter du hvilken? | Nytt |
| T2-074 | Hvilken artist ville du invitert inn på en fest bare for dere to? | TASK-063, omvretta |
| T2-075 | Hvis du kunne ha en sang som spilte hver gang du kom inn i et rom, hvilken ville det være? | TASK-075, omvretta |
| **6. UVENTET OM MEG** | | |
| T2-076 | Hva er noe du er overraskende bra til som du aldri vil bryste deg av? | TASK-079, omvretta |
| T2-077 | Hva er noe du er overraskende dårlig på, men som folk antar du kan? | TASK-080, omvretta |
| T2-078 | Hva er en liten vane du har som kanskje virker litt rar? | Erstattet TASK-078 |
| T2-079 | Hva er noe alle andre synes er bra, men som du egentlig hater? | Nytt |
| T2-080 | Hva er en guilty pleasure du er helt ærlig glad i? | Nytt |
| T2-081 | Hva er noe vennene dine vet om deg som jeg ikke vet ennå? | TASK-076, omvretta |
| T2-082 | Samler du på noe? Hvilket — og hvorfor nettopp det? | Nytt |
| T2-083 | Hva er noe du alltid tar med deg uansett hvor du går? | Nytt |
| T2-084 | Hva er en helt liten ting du gjør litt annerledes enn alle andre? | Nytt |
| T2-085 | Hva er et lite ritual du har som nesten ingen andre vet om? | Nytt |
| T2-086 | Hva er en mening du har som alle andre synes er helt absurd? | TASK-086, omvretta |
| T2-087 | Hva er noe du kan prate time om uten å bli slutt? | Nytt |
| T2-088 | Hva er den merkeligeste tingen du liker? | Nytt |
| T2-089 | Hva er en overraskende reaksjon du har hatt i en helt vanlig situasjon? | TASK-081, omvretta |
| T2-090 | Hva er en mat du elsker som de fleste ryster på hodet av? | Nytt |
| **7. NORDISK KVELD** | | |
| T2-091 | Velg deg en ting for å bli koselig varm: lue med øre, tykke sokker, eller en god genser. Hvorfor den? | Erstattet TASK-091 |
| T2-092 | Hvem lager kaffen og hvem lager maten til fredagskos? (Svar: meg, deg, eller skift) | TASK-092, omvretta |
| T2-093 | Lag den perfekte norske ukeenden for oss to — i akkurat fem ord. Gå. | TASK-093, omvretta |
| T2-094 | Regnet slår i ruten, det er onsdag kveld. Hva gjør vi? Du starter, jeg tar over. | TASK-094, ubrettet |
| T2-095 | Velg én drikke: varm kaffe, te med honning, eller kakao. Hva serverer du meg, og hvorfor? | TASK-095, omvretta |
| T2-096 | Vi har én time på oss. Ingen telefoner. Hva gjør vi? Beskriv i to setninger. | TASK-096, ubrettet |
| T2-097 | Kjøler det til utenfor. Velg: dunjakke, regntett frakk, eller ullgenser med hette. Og — går vi i skogen, langs elven, eller i byen? | Erstattet TASK-097 |
| T2-098 | Du lager maten, jeg vasker opp. (Eller omvendt.) Hva lager du — og hva er tilbehøret? | Erstattet TASK-098 |
| T2-099 | Velg lyset: fullt slukket, halvt, eller fullt på. Og — er det rolig, eller har vi planer om litt liv i huset? | Erstattet TASK-099 |
| T2-100 | Vi sitter på balkongen med to krus. Det er stille. Hva sier du først? | TASK-100, ubrettet |
| T2-101 | Velg kveldens plan: film, brettspill, eller bare å snakke. Og — hvem velger den, hvis det blir film? | TASK-101, omvretta |
| T2-102 | Vi tar med oss én natt på hytta. Hva tar vi med — og hva gjør vi? | TASK-102, omvretta |
| T2-103 | Velg én matrett vi lager sammen. Du starter med hovedretten, jeg tar desserten. | TASK-103, ubrettet |
| T2-104 | Det er torsdag. Klokka 19. Du har kontroll. Hva skjer de neste tre timene? | TASK-104, omvretta |
| T2-105 | Velg: vi lager mat sammen, bestiller, eller prøver noe rart og nytt. Du starter, jeg følger. | TASK-105, omvretta |
| **8. GJETTER DU MEG?** | | |
| T2-106 | Jeg tenker på et ord som beskriver dagen min. Du gjetter, og jeg gir deg en ledetråd etter hvert forsøk. | TASK-106, omvretta |
| T2-107 | Gjetter du hvor mange krus kaffe jeg har hatt i dag? Jeg svarer bare 'høyere' eller 'lavere'. | TASK-112, omvretta |
| T2-108 | Jeg tenker på en matrett. Du får tre ledetråder fra meg. Hvilken er den? | TASK-109, omvretta |
| T2-109 | Gjetter du hvilken dag i uken jeg er mest meg selv? Du får to forsøk. | TASK-110, omvretta |
| T2-110 | Jeg tenker på tre ord som beskriver meg i dag. Gjetter du hvilket av dem jeg liker minst? | TASK-111, omvretta |
| T2-111 | Jeg tenker på et sted i Norge. Gjetter du hvilket — bare ja/nei-spørsmål. | TASK-113, omvretta |
| T2-112 | Jeg tenker på noe jeg gjorde i går. Du gjetter hva det var. Bare ja/nei-spørsmål. | TASK-117, omvretta |
| T2-113 | Gjetter du hva jeg spiste til lunsj i dag? Du får én ledetråd før hvert forsøk. | TASK-119, omvretta |
| T2-114 | Jeg tenker på et sted. Gjetter du om det er i Norge eller i utlandet? Så: nord, sør, øst eller vest. | TASK-120, omvretta |
| T2-115 | Ranger mine tre favorittsesonger — fra den jeg liker minst til den jeg liker mest. | TASK-118, omvretta |
| T2-116 | Gjetter du hva jeg gjør akkurat nå? Du får en ledetråd etter hvert forsøk. | Erstattet TASK-116 |
| T2-117 | Ranger fra 1 til 10: min kaffestyrke i dag, og hvor høyt mitt humør er nå. | TASK-107, omvretta |
| T2-118 | Gjetter du omtrent hvor mange steg jeg har gått i dag? Jeg sier bare 'flere' eller 'færre'. | Nytt |
| T2-119 | Gjetter du hva jeg drikker i dag — kaffe, te, vann, eller noe helt annet? Du får én ledetråd. | Nytt |
| T2-120 | Velg den fargen som best passer mitt humør i dag: blå, grønn, gul, rød eller lilla. Riktig? | Erstattet TASK-108 |
| **9. BYGG EN HISTORIE** | | |
| T2-121 | Vi bygger en historie. Du starter med én setning, jeg tar neste. Siste som blir seriøs har tapt. | TASK-121, omvretta |
| T2-122 | Lag en norsk film i fem setninger sammen. Du starter med tittelen, jeg tar neste. | TASK-123, omvretta |
| T2-123 | Skap en helt vanlig person med én uforutsigbar vaner. Du starter, jeg fortsetter. | TASK-124, omvretta |
| T2-124 | Ta en helt vanlig mandag og gjør den absurd. Du starter, jeg tar over. | Nytt |
| T2-125 | Lag en oppskrift på vår perfekte kveld. Du starter med hovedingrediensen, jeg tar neste. | TASK-127, omvretta |
| T2-126 | Finn på en ny norsk tradisjon i tre setninger. Du starter med navnet, jeg tar beskrivelsen. | TASK-133, omvretta |
| T2-127 | Bygg en helg som bare går galt. Du starter med fredag, jeg tar lørdag, du tar søndag. | TASK-131, omvretta |
| T2-128 | Du starter med én setning som begynner på 'Og så...'. Jeg fortsetter. Vi skriver i seks setninger. | TASK-129, omvretta |
| T2-129 | Lag et kort eventyr der vi to er hovedpersonene. Du starter. Fem setninger hver. | TASK-130, omvretta |
| T2-130 | Finn på et sted som ikke finnes. Hva heter det, og hva skjer der? Du starter. | Nytt |
| T2-131 | Vi skriver en dialog, annenhver replikk. Du starter med min første linje. | Nytt |
| T2-132 | Bygg et sted vi begge ville flytte til i morgen. Du starter med én ting, jeg tar neste. | Nytt |
| T2-133 | Lag en helt uskyldig falsk nyhet om noe hverdagslig. Du starter, jeg tar over. | Nytt |
| T2-134 | Vi lager en bok sammen. Du velger tittelen, jeg skriver første setning. | Nytt |
| T2-135 | Du starter med én setning. Vi bygger videre — og den som sier 'det var det', avslutter. | TASK-135, omvretta |

## E. Mapping — oppsummering (old TASK → new T2)

Fordeling per kategori (kilde-type for hver av de 15 nye):

| Kategori | Ubrettet | Omvretta | Nytt | Erstattet |
|---|---|---|---|---|
| 1. Kunne-vil-du-si | 3 | 4 | 8 | 0 |
| 2. Fortell meg om | 8 | 7 | 0 | 0 |
| 3. Hvis du... | 8 | 5 | 0 | 2 |
| 4. To sannheter, en løgn | 2 | 9 | 3 | 1 |
| 5. Sang som beskriver deg | 0 | 13 | 2 | 0 |
| 6. Uventet om meg | 0 | 5 | 9 | 1 |
| 7. Nordisk kveld | 4 | 7 | 0 | 4 |
| 8. Gjetter du meg? | 0 | 11 | 2 | 2 |
| 9. Bygg en historie | 0 | 9 | 6 | 0 |
| **Total** | **25** | **70** | **30** | **10** |

Full per-oppgave-mapping ligger i tabellen i §D (kolonne «Kilde»).

## F. Unchanged (25)

Identiske med V1 (ingen endring):
- Kunne-vil-du-si: T2-001, T2-007, T2-009
- Fortell meg om: T2-016, T2-019, T2-020, T2-022, T2-024, T2-025, T2-026, T2-027
- Hvis du...: T2-031, T2-032, T2-034, T2-035, T2-036, T2-040, T2-041, T2-043
- To sannheter: T2-048, T2-058
- Nordisk kveld: T2-094, T2-096, T2-100, T2-103

## G. Rewritten (70)

Samme tema, ny/strammet ordlyd (sporer til en old TASK — se §D). Per kategori: 4 / 7 / 5 / 9 / 13 / 5 / 7 / 11 / 9.

## H. Replaced (10)

Eksplisitt sikker utgave av et flagget V1-problem:

| Ny | Erstattet | V1-problem | V2-løsning |
|---|---|---|---|
| T2-039 | TASK-039 | Be om å kontakte en person som «ikke kan møte deg tilbake» (fortid) | Fri uke til å gjøre hva du vil |
| T2-045 | TASK-045 | «Melding til alle som har såret deg» (+ stavemisl "noengang") | Garantert at ingenting galt skjer i en dag |
| T2-056 | TASK-056 | Utseende (klokketrikk/tilbehør/tatovering) — bryter PHOTO DAY 8 | Tre filmer du har sett |
| T2-078 | TASK-078 | «fetish» | En liten vane som kanskje virker litt rar |
| T2-091 | TASK-091 | «Motiver på ett ord» (stivt) | Koselig-velg: lue/sokker/genser |
| T2-097 | TASK-097 | «tynn pels» | Dunjakke/regntett frakk/ullgenser med hette |
| T2-098 | TASK-098 | «enrett eller toretter» | Hva lager du + tilbehør |
| T2-099 | TASK-099 | «festet stemning» | Rolig eller litt liv i huset |
| T2-116 | TASK-116 | Gjett fødselsår (alder ligger allerede i profilen) | Gjett hva jeg gjør akkurat nå |
| T2-120 | TASK-108 | 'Landsby / Stum di / Dance Monkey' (sangtitler som humør) | Velg farge som passer humøret |

## I. Removed original formulations

**Erstattet (original ordlyd fjernet, sikker ny oppgave plassert — se §H):** TASK-039, 045, 056, 078, 091, 097, 098, 099, 108, 116 (10).

**Fjernet uten direkte erstatter (30):**
- Kunne-vil-du-si: TASK-006, 007, **008** (dystre "alt ble nektet"), 009, 011, 012, **013** ("ta bort alle vanene / dobbelt så ofte"), 015 — kategorien oppfrisket med 8 nye lette dilemmaer.
- To sannheter: TASK-049, 050, 057.
- Sang: TASK-069 ("partneren din hører" — antok et par), 071 ("kjenne noe dypt i kroppen" — AI-poetikk).
- Uventet: TASK-077, 082, 083, 084, 085, 087, 088, 089, 090 — kategoriene bygget om til «små overraskelser» (9 nye).
- Gjetter: TASK-114, 115 (kliniske rangerings-ord).
- Bygg en historie: TASK-122, **125** (ukeend mandag/tirsdag + "og så døde de"), 126, **128** ("Refrengets" + krevde sangtekst), 132 ("og så sov de"), 134 — kategoriene bygget om til 6 ulike nye aktiviteter.

Til sammen: 40 opprinnelige formuleringer er ikke lenger til stede (10 erstattet + 30 fjernet). 95 av 135 gamle oppgaver er videreført (25 ubrettet + 70 omvretta).

## J. Duplicate scan

Metode: alle 135 normaliseres (trim + lowercase). 
- **Eksakte duplikater: 0** (vakt av OT-04; `new Set(normalized).size === 135`).
- **Near-duplikater (manuell vurdering):** 0 som krever handling. Delte ord/rammer er påtatt der rammen er selve kategoriideen (f.eks. «Kunne du … eller …» i Kunne-vil-du-si, «Én er oppfunnet. Hvilken?» i To sannheter, «Du starter, jeg tar neste» i Bygg en historie, «ledetråd» i Gjetter du meg?). Ingen to oppgaver deler både format og innholdsvinkel.

## K. Photo-reveal guard

Audit av alle 135 mot visuelle kjennetegn (utseende / hår / klær / tatoveringer / kropp / andre visuelle kjennetegn):
- TASK-056 (utseende) **fjernet** → T2-056 (filmer).
- Nordisk kveld T2-091 og T2-097 handler om **å velge** en ting å ha på/ha med (kos-velg, ikke å beskrive hvordan man ser ut) — ikke utseende-avsløring.
- Ingen oppgave ber om å beskrive egen fysisk utforming. FOTO DAY 8 er intakt.
- Vakt: OT-12 (smal regex for eksplisitt utseende-avsløring).

## L. Sensitive-content guard

Audit av alle 135 mot: traumer, overgrep, eksplisitt seksuelt, sensitive helseopplysninger, hemmeligheter, selvskading, ulovlig, PII.
- **fetish** fjernet (T2-078); «verste …», «ting du frykter er rare», «grinet over som du aldri har fortalt noen», «hemmeligheter» — alle fjernet fra Uventet og erstattet med «små overraskelser».
- «død eller levende» og «kontakt en person som ikke kan møte deg tilbake» fjernet fra Hvis du.
- «døde de» / «sov de»-payoffs fjernet fra Bygg en historie.
- Tilbakeværende følelsesord er milde og frivillige («redd, men gjorde det», «har det dårlig»). Ingen terapi/santet/traume-ramme.
- Vakt: OT-06 (fetish) + manuell gjennomgang.

## M. Verification

| Sjekk | Resultat |
|---|---|
| `npx jest oppgaver-library` (OT-01 … OT-18) | 18/18 PASS |
| `npx jest bli-kjent-library` (BQ-01 … BQ-15, uendret) | 15/15 PASS |
| Eksakte oppgave-duplikater | 0 |
| Foto-reveal (utseende) | 0 treff (OT-12) |
| Sensitive-content | Reviewet, 0 overtrinn |
| `app/questions/data/questions.ts` SHA-256 (freeze) | uendret vs. baseline |
| `app/chat/components/BliKjentPanel.tsx` SHA-256 (freeze) | uendret vs. baseline |
| `app/questions/page.tsx` SHA-256 (freeze) | uendret vs. baseline |
| Struktur | 9 kategorier × 15 = 135 |

Hærlig lesegjennomgang (menneskeøye) av alle 135: FULLFØRT 29.10.2026 — kun grammatikk/tydelighet/duplikat/sensitive-korrigert; ingen subjektiv om-polering.