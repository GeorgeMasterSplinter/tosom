# BLI KJENT INVENTORY v2.0

> **Status:** CANONICAL INVENTORY for Bli Kjent Library V2 (180 spørsmål).
> **Dato:** 28.10.2026 · **Kilde (canonical):** `app/questions/data/questions.ts` · **Tidligere versjon:** `docs/BLI-KJENT-OG-OPPGAVER-INVENTORY-v1.0.md` (Q-001–Q-240, historisk).
> **Metode:** Alle 180 spørsmål er verifisert ved lesing mot datafilen. Q2-numre følger datafilrekkefølgen (kategori 1 = Q2-001…Q2-015 osv.).

---

## A. Struktur

- **12 kategorier × 15 spørsmål = 180** (tidligere 12 × 20 = 240).
- Kategorier (uendret rekkefølge, navn og ID-er): personlighet, forhold, kommunikasjon, nærhet, følelser, trygghet, lek, barndom, verdier, fremtid, hverdag, moden.
- `getRandomQuestion` / `getCategoriesWithCounts` er data-drevne — ingen avhengighet av faste tall.
- Testdeksning: `__tests__/bli-kjent-library.test.ts` (BQ-01 … BQ-15).

## B. Nytt bibliotek (Q2-001 … Q2-180)

| Q2-ID | Spørsmål | Kilde |
|---|---|---|
| **1. PERSONLIGHET & IDENTITET** | | |
| Q2-001 | Hva er den ene egenskapen ved deg som andre ofte overraskes over? | Q-001, ubrettet |
| Q2-002 | Hvordan ser en perfekt dag ut for deg? | Q-002, omvretta |
| Q2-003 | Hva er noe du har endret syn på de siste årene? | Q-003, ubrettet |
| Q2-004 | Når føler du deg mest som deg selv? | Q-004, omvretta |
| Q2-005 | Hva er en overbevisning du har som kanskje er litt uvanlig? | Q-005, ubrettet |
| Q2-006 | Er du mest du selv på morgenen eller om kvelden? | Q-006, omvretta |
| Q2-007 | Hva er du overraskende god til? | Q-011, omvretta |
| Q2-008 | Hva har du alltid hatt lyst til å lære deg? | Q-012, omvretta |
| Q2-009 | Hva er noe du er stolt av som kanskje få vet om? | Q-013, ubrettet |
| Q2-010 | Hva virker det som alle andre liker, men som du fint klarer deg uten? | Q-016, omvretta |
| Q2-011 | Hva kan du bruke altfor mye tid på uten å merke at tiden går? | Nytt |
| Q2-012 | Hva er en liten ting ved deg som vennene dine kjenner deg godt for? | Nytt |
| Q2-013 | Hva er en helt unødvendig ting du er overraskende kresen på? | Nytt |
| Q2-014 | Hva er noe du brenner for, men som du sjelden snakker om? | Q-017, omvretta |
| Q2-015 | Hvordan vet du at du har hatt en god dag? | Nytt |
| **2. FORHOLD & TILKNYTTING** | | |
| Q2-016 | Hva trenger du mest av for å føle deg trygg i et forhold? | Q-021, ubrettet |
| Q2-017 | Hvordan viser du kjærlighet mest naturlig? | Q-025, ubrettet |
| Q2-018 | Hva er noe du aldri vil kompromisse med i et forhold? | Q-026, ubrettet |
| Q2-019 | Hva betyr lojalitet for deg i praksis? | Q-029, ubrettet |
| Q2-020 | Hvordan vet du at noen virkelig bryr seg om deg? | Q-030, ubrettet |
| Q2-021 | Hva er noe du ønsker å gjøre annerledes enn det du vokste opp med? | Q-035, ubrettet |
| Q2-022 | Hva får et forhold til å føles godt for deg i hverdagen? | Nytt |
| Q2-023 | Hva gjør det lettere for deg å komme nær noen? | Nytt |
| Q2-024 | Hva faller mest naturlig for deg: å vise omtanke eller å ta imot den? | Nytt |
| Q2-025 | Hvor viktig er alenetid for deg når du er i et forhold? | Nytt |
| Q2-026 | Hva hjelper deg å komme deg videre etter en uenighet? | Q-022, omvretta |
| Q2-027 | Hva gjør du når noen du bryr deg om sårer deg? | Q-027, rewritten |
| Q2-028 | Hva setter du mest pris på i de små tingene man gjør for hverandre? | Q-032, rewritten |
| Q2-029 | Når føler du deg nærmest den du er sammen med? | Q-040, rewritten |
| Q2-030 | Hvordan tenker du om et forhold der man ikke kan sees så ofte? | Q-034, rewritten |

| **3. KOMMUNIKASJON & KONFLIKTER** | | |
| Q2-031 | Hvordan snakker du med noen du bryr deg om når dere er uenige? | Q-041, ubrettet |
| Q2-032 | Hvordan forteller du noen at de har såret deg uten å angripe? | Q-043, ubrettet |
| Q2-033 | Hva er det som gjør at du stenger deg av i en samtale? | Q-044, ubrettet |
| Q2-034 | Hvordan liker du at noen gir deg tilbakemelding? | Q-045, ubrettet |
| Q2-035 | Hvordan snakker du om ting som gjør deg ubehagelig? | Q-051, ubrettet |
| Q2-036 | Hvordan snakker du om penger med noen du er sammen med? | Q-057, ubrettet |
| Q2-037 | Hva er noe du hører for ofte i samtaler som du helst ville unngå? | Q-058, ubrettet |
| Q2-038 | Hvordan forteller du noen at du trenger tid uten at de tar det personlig? | Q-059, ubrettet |
| Q2-039 | Hva gjør at du føler deg lyttet til? | Nytt |
| Q2-040 | Er det lett eller vanskelig for deg å si fra når noe plager deg? | Nytt |
| Q2-041 | Hva gjør du når du vet at du har tatt feil og må si unnskyld? | Q-047, omvretta |
| Q2-042 | Hva synes du er vanskeligst når en samtale blir personlig? | Q-048, omvretta |
| Q2-043 | Hvordan merker du at noen virkelig har forstått deg? | Q-053, omvretta |
| Q2-044 | Er du typen som vil snakke ferdig med en gang, eller trenger du gjerne litt tid først? | Nytt |
| Q2-045 | Er det noe du helst vil snakke om ansikt til ansikt fremfor på melding? | Nytt |
| **4. NÆRHET & INTIMITET** | | |
| Q2-046 | Hva betyr fysisk nærhet for deg i hverdagen? | Nytt |
| Q2-047 | Er du en person som liker mye nærhet, eller trenger du mer tid og plass? | Nytt |
| Q2-048 | Hvordan liker du at noen nærmer seg deg fysisk? | Q-078, ubrettet |
| Q2-049 | Hvilken type hverdagslig berøring liker du best — en klem, en hånd på skulderen eller noe annet? | Q-064, rewritten |
| Q2-050 | Hvilke små tegn på hengivenhet betyr mest for deg? | Nytt |
| Q2-051 | Hva er noe noen gjør som får deg til å føle deg sett? | Q-069, omvretta |
| Q2-052 | Hva gjør at nærhet føles naturlig og avslappet for deg? | Nytt |
| Q2-053 | Hvor viktig er det for deg at ting får utvikle seg i sitt eget tempo? | Nytt |
| Q2-054 | Hvordan merker du at du begynner å bli komfortabel med noen? | Nytt |
| Q2-055 | Er det lett for deg å si hva du liker og ikke liker når du blir nær noen? | Nytt |
| Q2-056 | Hva er en liten form for nærhet du setter overraskende stor pris på? | Nytt |
| Q2-057 | Hvordan er det for deg å savne noen du er glad i? | Q-080, rewritten |
| Q2-058 | Hva er noe du gjerne ville utforske sammen med noen? | Q-063, omvretta |
| Q2-059 | Hva gjør det lettere for deg å si fra om hva du er komfortabel med? | Q-073, rewritten |
| Q2-060 | Er det noe du synes er viktig å si fra om, før dere kommer nærmere hverandre? | Q-076, omvretta |
| **5. FØLELSER & SÅRBARHET** | | |
| Q2-061 | Hva er noe som gjør deg mest lykkelig? | Q-092, ubrettet |
| Q2-062 | Hvilken følelse er lettest å lese på deg? | Nytt |
| Q2-063 | Hva gleder du deg til akkurat nå? | Nytt |
| Q2-064 | Hva er noe du var stolt av å klare for nylig? | Q-087, omvretta |
| Q2-065 | Hva hjelper deg som regel etter en skikkelig dårlig dag? | Nytt |
| Q2-066 | Hvordan merker folk rundt deg at du har det bra? | Nytt |
| Q2-067 | Hva kan røre deg mer enn du egentlig forventer? | Nytt |
| Q2-068 | Hva liker du å høre når du har en dårlig dag? | Nytt |
| Q2-069 | Hva er noe som gjør deg mest rolig? | Q-093, ubrettet |
| Q2-070 | Hva gjør deg lettere nervøs enn det kanskje burde? | Nytt |
| Q2-071 | Hva kan irritere deg mye mer enn det egentlig fortjener? | Nytt |
| Q2-072 | Hva pleier å gjøre at du begynner å falle for noen? | Nytt |
| Q2-073 | Hva kan gjøre deg litt sentimental? | Nytt |
| Q2-074 | Hva er noe du er takknemlig for, selv om du knapt tenker på det? | Nytt |
| Q2-075 | Hva gjør du når du trenger å få tankene over på noe annet? | Nytt |

| **6. TRYGGHET & GRENSER** | | |
| Q2-076 | Hva er dine viktigste grenser i et forhold? | Q-101, ubrettet |
| Q2-077 | Hvordan vet du at noen respekterer grensene dine? | Q-102, ubrettet |
| Q2-078 | Hva trenger du for å føle deg trygg nok til å være åpen? | Q-104, ubrettet |
| Q2-079 | Hva er noe som bryter din tillit umiddelbart? | Q-105, ubrettet |
| Q2-080 | Hva er noe du trenger for å føle deg hjemme i en relasjon? | Q-113, ubrettet |
| Q2-081 | Hvordan snakker du om noe som ikke er greit for deg? | Q-114, ubrettet |
| Q2-082 | Når synes du det er lett å si nei, og når er det vanskeligere? | Nytt |
| Q2-083 | Hvordan reagerer du når planer plutselig endrer seg? | Nytt |
| Q2-084 | Hva får deg til å merke at du kan stole på noen? | Nytt |
| Q2-085 | Hva må du kunne stole på at den andre gjør? | Nytt |
| Q2-086 | Hvor fort pleier du å bli komfortabel med nye mennesker? | Nytt |
| Q2-087 | Hvordan liker du at noen tar opp noe de er uenige med deg i? | Q-112, rewritten |
| Q2-088 | Hvordan tar du det når noen overrasker deg? | Q-106, omvretta |
| Q2-089 | Hvor god er du til å sette deg selv først? | Q-111, omvretta |
| Q2-090 | Hva gjør det lett for deg å slappe av i en samtale? | Q-116, rewritten |
| **7. LEK & HUMOR** | | |
| Q2-091 | Hva er den mest absurde tingen du har falt for? | Q-121, ubrettet |
| Q2-092 | Hva er noe ved deg selv du alltid må le litt av? | Q-122, omvretta |
| Q2-093 | Hva er en spøk du aldri blir lei av? | Q-123, ubrettet |
| Q2-094 | Hva har du alltid villet prøve, men aldri samlet mod til? | Q-124, omvretta |
| Q2-095 | Hva er noe litt rart du gjør som du tror flere gjør i smug? | Q-125, omvretta |
| Q2-096 | Hva er det rareste du har spist og faktisk likt? | Q-126, omvretta |
| Q2-097 | Hva er noe du alltid griner av, selv om det ikke er morsomt? | Q-127, ubrettet |
| Q2-098 | Hva tror du alle har tenkt på, men aldri snakket om? | Q-128, omvretta |
| Q2-099 | Hva er det morsomste du har opplevd på reise? | Q-132, omvretta |
| Q2-100 | Hva er et spørsmål du alltid har hatt lyst til å stille noen, men aldri gjort? | Q-134, omvretta |
| Q2-101 | Hva er noe du vil prøve selv om du vet du vil være dårlig i? | Q-136, ubrettet |
| Q2-102 | Hva er noe du alltid vil si nei til, selv om det er morsomt? | Q-138, ubrettet |
| Q2-103 | Hva gjør deg alltid glad, uansett hvor dårlig dagen er? | Q-139, omvretta |
| Q2-104 | Hva er noe du har lyst til å prøve minst én gang i livet? | Q-140, rewritten |
| Q2-105 | Hva er en helt vanlig ting du gjør unødvendig komplisert? | Nytt |
| **8. BARNDOM & RØTTER** | | |
| Q2-106 | Hva likte du aller best å holde på med som barn? | Q-142, rewritten |
| Q2-107 | Hva lærte foreldrene dine deg om verden, og hva tok de feil i? | Q-143, ubrettet |
| Q2-108 | Hva er noe du husker fra barndommen som kjentes enormt på den tiden? | Q-144, ubrettet |
| Q2-109 | Hvem var personen som ga deg mest trygghet som barn? | Q-147, ubrettet |
| Q2-110 | Hva fikk deg til å føle deg skikkelig voksen da du var liten? | Q-150, rewritten |
| Q2-111 | Hva er noe du aldri har glemt fra skoletiden? | Q-152, ubrettet |
| Q2-112 | Hva er noe du ble belønnet for som barn? | Q-157, ubrettet |
| Q2-113 | Hva pleide du og vennene dine å gjøre når dere hadde hele dagen fri? | Q-159, rewritten |
| Q2-114 | Hvilket sted føltes mest som ditt da du var liten? | Nytt |
| Q2-115 | Hva var favorittmaten din som barn, og liker du den fortsatt? | Nytt |
| Q2-116 | Hva ønsket du deg skikkelig mye da du var liten? | Nytt |
| Q2-117 | Hadde familien din en tradisjon du fortsatt er glad i? | Nytt |
| Q2-118 | Hva trodde du helt oppriktig på da du var liten, som virker ganske morsomt nå? | Nytt |
| Q2-119 | Hva er noe fra familien din som du gjerne vil ta med deg videre? | Q-146, omvretta |
| Q2-120 | Hva er noe du vil gi videre til dine barn, om noen? | Q-154, ubrettet |
| **9. VERDIER & PRIORITETER** | | |
| Q2-121 | Hva er noe du tror er viktigere enn det folk flest innrømmer? | Q-165, ubrettet |
| Q2-122 | Hva ville du prioritert foran jobb hvis du måtte velge? | Q-170, rewritten |
| Q2-123 | Hva er noe du bryr deg overraskende mye om? | Nytt |
| Q2-124 | Hva bruker du gjerne penger på uten å angre? | Nytt |
| Q2-125 | Hva synes du det er verdt å betale litt ekstra for? | Nytt |
| Q2-126 | Hva er viktigere for deg enn status? | Nytt |
| Q2-127 | Hvis du har en helt ledig kveld, hva prioriterer du? | Nytt |
| Q2-128 | Hva synes du folk tar altfor alvorlig? | Nytt |
| Q2-129 | Hva er noe du selv tar ganske alvorlig, selv om andre kanskje ikke gjør det? | Nytt |
| Q2-130 | Hva er et valg du tok som har betydd mer enn du regnet med? | Nytt |
| Q2-131 | Hvilken vane av deg er du mest glad i? | Nytt |
| Q2-132 | Hva bruker du gjerne tid på, selv når du egentlig har dårlig tid? | Nytt |
| Q2-133 | Hva er noe du alltid hjelper til med, selv om ingen ber deg om det? | Nytt |
| Q2-134 | Er det noe du ikke ville gjort bare for pengenes skyld? | Nytt |
| Q2-135 | Hva er det du er mest opptatt av i livet akkurat nå? | Nytt |

| **10. FREMTID & DRØM** | | |
| Q2-136 | Hva er noe du vil bygge sammen med noen du er glad i? | Q-188, ubrettet |
| Q2-137 | Hvordan ser en vanlig tirsdag ut for deg om et par år? | Nytt |
| Q2-138 | Er det et sted du kunne sett for deg å bo en gang? | Nytt |
| Q2-139 | Er det noe ved livet ditt i dag du håper ser helt annerledes ut om ti år? | Nytt |
| Q2-140 | Hva gleder du deg til det neste året? | Nytt |
| Q2-141 | Er det noe nytt du har lyst til å prøve de neste årene? | Nytt |
| Q2-142 | Hvordan håper du at en vanlig helg ser ut noen år fra nå? | Nytt |
| Q2-143 | Hva er noe du har lagt på isen, men fortsatt har lyst til å gjøre? | Nytt |
| Q2-144 | Hva er en reise du drømmer om, alene eller sammen? | Nytt |
| Q2-145 | Hvor går tankene dine når du trenger noe å glede seg til? | Nytt |
| Q2-146 | Er det noe du håper å ha mer tid til noen år fra nå? | Nytt |
| Q2-147 | Hva er noe du gjerne vil ha mer av i hverdagen din? | Nytt |
| Q2-148 | Hva håper du at du fortsatt tar deg tid til om ti år? | Nytt |
| Q2-149 | Hva er du ganske sikker på at du fortsatt vil elske, om mange år? | Nytt |
| Q2-150 | Hva er det ved fremtiden du er mest nysgjerrig på? | Nytt |
| **11. HVERDAG & RUTINE** | | |
| Q2-151 | Hvordan starter du dagen din? | Q-201, ubrettet |
| Q2-152 | Hva er noe du ikke kan tenke deg å våke opp uten? | Q-202, ubrettet |
| Q2-153 | Hvordan lader du når du er helt tom for energi? | Q-203, ubrettet |
| Q2-154 | Hvordan slapper du av når dagen har vært tung? | Q-204, omvretta |
| Q2-155 | Hva er noe du gjør hver uke som du ikke ville gi fra deg? | Q-205, ubrettet |
| Q2-156 | Hva gjør du når dagen har gått helt galt? | Q-206, omvretta |
| Q2-157 | Hva er noe du alltid gjør for å komme deg i gang når du er lat? | Q-209, ubrettet |
| Q2-158 | Hva er noe du glemmer å gjøre for deg selv, selv om du vet du burde? | Q-210, omvretta |
| Q2-159 | Hva er noe du gjør på en tirsdag kveld når ingen ser? | Q-211, ubrettet |
| Q2-160 | Hva er noe i hverdagen som tar mest av deg? | Q-212, omvretta |
| Q2-161 | Hva er noe du ikke tåler i et hjem? | Q-213, omvretta |
| Q2-162 | Hva er noe du alltid tar med deg på reise? | Q-215, ubrettet |
| Q2-163 | Hva er noe du alltid sier at du skal prøve, men som aldri skjer? | Q-218, omvretta |
| Q2-164 | Hvordan liker du å feire en liten seier i hverdagen? | Q-219, ubrettet |
| Q2-165 | Er du mer den ryddige eller den rotete — og når gir du opp? | Q-220, erstattet |
| **12. MODEN NYSGJERRIGHET** | | |
| Q2-166 | Hva er noe du lurer på om meg, som du ikke har turt å spørre om? | Q-221, omvretta |
| Q2-167 | Hva betyr frihet for deg, når du er sammen med noen? | Nytt |
| Q2-168 | Hva er økonomisk trygghet for deg — og hvordan ser den ut? | Nytt |
| Q2-169 | Hvordan liker du at ansvar hjemme fordeles? | Nytt |
| Q2-170 | Hva synes du det er helt greit å være uenig om i et forhold? | Nytt |
| Q2-171 | Hva legger du merke til hos par som ser ut til å ha det godt sammen? | Nytt |
| Q2-172 | Hva synes du det er viktig å være åpen om tidlig? | Nytt |
| Q2-173 | Hva håper du et godt forhold gir mer plass til i livet ditt? | Nytt |
| Q2-174 | Hva tror du mange gjør mer komplisert i forhold enn det trenger å være? | Nytt |
| Q2-175 | Hva synes du er viktig å vite om noen, før dere kommer nærmere hverandre? | Nytt |
| Q2-176 | Hva liker du tanken på å kunne gjøre sammen med noen, uten at det må planlegges? | Nytt |
| Q2-177 | Hva liker du at det tar litt tid å oppdage om et menneske? | Nytt |
| Q2-178 | Hva vil du helst ikke gi slipp på i ditt eget liv når du blir sammen med noen? | Nytt |
| Q2-179 | Hva synes du et par bør passe på å sette av tid til? | Nytt |
| Q2-180 | Hvor viktig er humor for deg når et forhold varer over tid? | Nytt |

> **Final human surgical review (28.10.2026):** George + Copilot har lest alle 180
> spørsmål, og 34 ble korrigert: Q2-027, Q2-028, Q2-029, Q2-030, Q2-036, Q2-049,
> Q2-057, Q2-059, Q2-087, Q2-090, Q2-104, Q2-106, Q2-107, Q2-110, Q2-113, Q2-122, Q2-132,
> Q2-134, Q2-139, Q2-145, Q2-146, Q2-148, Q2-150, Q2-169, Q2-170, Q2-171, Q2-172, Q2-173,
> Q2-174, Q2-176, Q2-177, Q2-178, Q2-179, Q2-180 (alt annet, inkl. Q2-175, låst).
> Tekstene over er identiske med canonical source. Kilder merket «rewritten» ble
> ytterligere omskrevet i denne runden. Detaljer:
> `docs/BLI-KJENT-V2-EDITORIAL-REPORT.md` → *Final human surgical review*.
> Micro cleanup (28.10.2026, etterpå): Q2-087 og Q2-139 korrigert ytterligere — biblioteket er naå FROZEN (LIBRARY STATUS: FROZEN).

## C. Mapping Q-001 … Q-240 → Q2-001 … Q2-180

Merk (final human surgical review, 28.10.2026): 14 av spørsmålene klassifisert
«ubrettet/omvrettet» ble ytterligere omskrevet («rewritten», merket i seksjon B).
Tallene i tabellen nedenfor gjelder den opprinnelige V1→V2-konverteringen.

| Kategori | Ubrettet | Omvrett | Nytt | Erstattet | Fjernet |
|---|---|---|---|---|---|
| 1. Personlighet | 4 | 7 | 4 | 0 | 9 |
| 2. Forhold | 8 | 3 | 4 | 0 | 9 |
| 3. Kommunikasjon | 8 | 3 | 4 | 0 | 9 |
| 4. Nærhet | 2 | 5 | 8 | 0 | 13 |
| 5. Følelser | 2 | 1 | 12 | 0 | 17 |
| 6. Trygghet | 7 | 3 | 5 | 0 | 10 |
| 7. Lek | 5 | 9 | 1 | 0 | 6 |
| 8. Barndom | 9 | 1 | 5 | 0 | 10 |
| 9. Verdier | 1 | 1 | 13 | 0 | 18 |
| 10. Fremtid | 1 | 0 | 14 | 0 | 19 |
| 11. Hverdag | 8 | 6 | 0 | 1 | 6 |
| 12. Moden | 0 | 1 | 14 | 0 | 19 |
| **Totalt** | **55** | **40** | **84** | **1** | **145** |

Merk: «Erstattet» (Q-220 → Q2-165) betyr at den opprinnelige Q-220
(«Hva er noe du ikke lenger tål i en relasjon som du tidlig tålte?»)
ikke finnes lenger i biblioteket, og er med i fjerningstellingen.

## D. Fjernede Q-IDs (145)

- **1. Personlighet:** Q-007, Q-008, Q-009, Q-010, Q-014, Q-015, Q-018, Q-019, Q-020
- **2. Forhold:** Q-023, Q-024, Q-028, Q-031, Q-033, Q-036, Q-037, Q-038, Q-039
- **3. Kommunikasjon:** Q-042, Q-046, Q-049, Q-050, Q-052, Q-054, Q-055, Q-056, Q-060
- **4. Nærhet:** Q-061, Q-062, Q-065, Q-066, Q-067, Q-068, Q-070, Q-071, Q-072, Q-074, Q-075, Q-077, Q-079
- **5. Følelser:** Q-081, Q-082, Q-083, Q-084, Q-085, Q-086, Q-088, Q-089, Q-090, Q-091, Q-094, Q-095, Q-096, Q-097, Q-098, Q-099, Q-100
- **6. Trygghet:** Q-103, Q-107, Q-108, Q-109, Q-110, Q-115, Q-117, Q-118, Q-119, Q-120 — hvorav Q-108 («Hvordan snakker du om noe som overgrep deg tidligere?») er det sensitive spørsmålet som ble fjernet, se Editorial Report §4
- **7. Lek:** Q-129, Q-130, Q-131, Q-133, Q-135, Q-137
- **8. Barndom:** Q-141, Q-145, Q-148, Q-149, Q-151, Q-153, Q-155, Q-156, Q-158, Q-160
- **9. Verdier:** Q-161, Q-162, Q-163, Q-164, Q-166, Q-167, Q-168, Q-169, Q-171, Q-172, Q-173, Q-174, Q-175, Q-176, Q-177, Q-178, Q-179, Q-180
- **10. Fremtid:** Q-181, Q-182, Q-183, Q-184, Q-185, Q-186, Q-187, Q-189, Q-190, Q-191, Q-192, Q-193, Q-194, Q-195, Q-196, Q-197, Q-198, Q-199, Q-200
- **11. Hverdag:** Q-207, Q-208, Q-214, Q-216, Q-217, Q-220
- **12. Moden:** Q-222, Q-223, Q-224, Q-225, Q-226, Q-227, Q-228, Q-229, Q-230, Q-231, Q-232, Q-233, Q-234, Q-235, Q-236, Q-237, Q-238, Q-239, Q-240

## E. Endrede truth-claims (240 → 180)

| Fil | Endring |
|---|---|
| `app/questions/data/questions.ts` | Header: 12×15 = 180 + V2-merknad |
| `app/questions/page.tsx` | Header: «8 kategorier» → «12 kategorier og 15 spørsmål per kategori» |
| `app/chat/components/BliKjentPanel.tsx` | Header: 12×15 = 180 |
| `app/reisen/page.tsx` | Copy: «12 kategorier med 180 spørsmål» |
| `ai/system_prompt.md` §3.3 | «12 kategorier / 15 spørsmål per kategori» |
| `docs/RUNTIME-DOCUMENTATION-TRUTH-PLAN-v1.0.md` | 3 linjer (B, D, status-tabell) oppdatert med V2-merknad |
| `public/llms.txt` | Ingen endring (inneholdt ingen tellingsclaim) |




