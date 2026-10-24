# PERSONALITY-V2-ITEM-DEVELOPMENT — v1.0 (ACT F2A, 24.10.2026)

**STATUS: BRUKT SOM RÅMATERIAL — V2 IMPLEMENTERT 2026-10-24 (ACT F2 SIMPLIFIED).**
Per ACT F2 (forenklet) ble F2A-analysen brukt som råmateriale, ikke som fasit:
15-items-settet er implementert i `lib/psychometrics/instruments.ts`
(`TOSOM_PERSONALITY`, p1–p15) med tre valgendringer fra primærsettet
(AG2→p5, CO3→p9, OP2→p15 — begrunnet i audit §V.2). G1-ekspertgjennomgangen
er dempet til valgfritt follow-up (ikke launch-gate), og G8 (legal) er
lavrisiko follow-up. Full implementeringsjournal:
`docs/METHODS-SCIENTIFIC-AUDIT-v1.0.md` §V.

---

## 1. KILDEVALG (source decision)

| ALTERNATIV | VURDERING |
|------------|-----------|
| **A: Fullt selvstendige Tosom-items fra konstruktdefinisjonene** | **VALGT.** Fullstendig provenans-kontroll, ingen avledningsrisiko (BFI), ingen krediteringsbyrde per item, fullt i tråd med F2-plan §T.2. Kostnad: all faglig kvalitetssikring hviler på G1-ekspertgjennomgangen |
| B: Public-domain IPIP-items (eller dokumenterte tilpasninger) | IPIP er public domain (kan brukes/oversettes/redigeres uten tillatelse) — juridisk lav risiko. Men: (1) Tosoms 15-items utvalg ville fortsatt vært en **egen** produktmodell — ingen validitet overføres automatisk; (2) IPIP-items er skrevet for generelle populationsskjemaer, ikke relasjonell kompatibilitet — tilpasning krever likevel egen utvikling; (3) kreditering av IPIP i public copy forsterker «instrument»-bilde som F1 bevisst fjernet |
| C: Kombinasjon | Blandet provenans uten dokumentasjon er akkurat det F1.5 fant i v1 — forkastet |

**Beslutning: A.** IPIP brukes **kun** som faglig benchmark for konstruktdekning
(hvilke fasetter store Big Five-skaler vanligvis dekker), aldri som tekstkilde.
Hvis et kandidat-item tilfeldigvis ligner et IPIP-item: dokumenteres i §8 og
holdes som selvstendig (IPIP er public domain — lav risiko) eller krediteres
hvis tekstlikheten er åpenbar.

**Kildeisolering (utført):** Kandidatpoolen (§5) ble skrevet utelukkende fra
de frosne konstruktdefinisjonene (§3) + facet-reglene (audit §T.4). BFI-10-
itemtekster var **ikke** referanse under skriving. Likhetskontroll mot BFI-10
ble gjennomført som **separat steg EFTER** at poolen var frosset (§7). Ingen
BFI-identifikatorer, ingen BFI-rekkefølge, ingen positive/negative item-par,
ingen synonymparfraser.

## 2. KONTEKST- OG TIDSRAMME-BESLUKTER (hele settet)

- **Kontekst: GENERAL, hverdagsnær personlighet med naturlig relasjonsrelevans**
  (F2-plan §T.12 / F2A §12). Items beskriver *hverdagsmønster* («når vi skal
  bestemme noe sammen», «etter en dag som har gått ske») — relasjonsrelevante
  uten å forutsette et forhold, og uten generelle «Jeg er X»-karakterpriser.
- **Tidsramme: «vanligvis»** (generelt nåværende mønster). Ikke «det siste
  året» (innebærer rekonstruksjon), ikke «ønsket selvbilde» (ønskeværdighet).
  Forslag til intro-tekst i steget (endres i F2C, ikke nå):
  «Svar ut fra hvordan du vanligvis er — ikke hvordan du ønsker å være.
  Det finnes ingen fasit.»

## 3. FROSENE KONSTRUKTDEFINISJONER (frosset 24.10.2026; endres kun ved G1-betingelser)

For hver: hva det betyr i Tosom / hva vi undersøker / relasjonell relevans / hva vi
**IKKE** utleder / overlapp som unngås. Skaleretning: høy respons = høy ende av
aksen — **unntatt ES** (se nedre).

**EXTRAVERSION (hverdagsenergi)** — Hverdagsmønster for sosial kontakt: hvor mye
sosial kontakt lader i steden for uttømmer. Undersøkes: recharging, sosialt
initiativ, foretrukket sosial rytme. Relevant: ulik sosial rytme (hjemme-base vs
sosial base) gir hverdagsfriksjon. IKKE: sosial verdi, popularitet, sosial angst,
ensomhet, evne til å få venner. Unngås-overlapp: COMMUNICATION (hvordan man
snakker), ATTACHMENT (trygghetsbehov).

**AGREEABLENESS (forhandlings-/kompromissmønster)** — Hvordan uenighet og
felles beslutninger håndteres: tendens mot avklaring/kompromiss i stedet for
egen linje. Relevant: beslutningsfordeling påvirker hvor ofte små uenigheter
blir store. IKKE: om noen er snill/et godt menneske, moralisk verdi,
konfliktskyhet, lydighet, selvoppofrelse. Unngås-overlapp: COMMUNICATION
(lytting/uttrykk/reparasjon), ATTACHMENT (angst/unnvikelse), ER (undertrykking).

**CONSCIENTIOUSNESS (struktur og oppfølging)** — Hverdagsorganisering: planlegging,
hold av avtaler, forutsigbarhet kontra spontanitet. Relevant: ulik struktur-
nivå gir friksjon i felles hverdag (avtaler, planer, rutiner). IKKE:
intelligens, arbeidsmoral som menneskeverd, økonomisk suksess, orden som
moralisk kvalitet. Unngås-overlapp: L2026-livsstil-felt (arbeidsrytme m.m. er
livsstil, ikke personlighet).

**EMOTIONAL STABILITY (tilbakemelding fra hverdagsfrustrasjon)** — Reaksjons-
intensitet og tid til ro etter vanlig hverdagsstress; behov for tid/støtte etter
belastning; toleranse for uforutsigbarhet. **Skaleretning (viktig):** items
nøkles slik at **høy respons = mer intensiv/tar lenger tid til ro** (lav
stabilitet) — dette mappes direkte til dagens `neuroticism`-felt **uten
scoring-endring** (dagens `scorePersonalityCompat` forventer høy = mer
nevrotisk). Relevant: par der én fortsetter å bære en opplevd situasjon
skaper lavintensitetskunflikt. IKKE (hard grense, ingen antydning):
angstlidelse, depresjon, traume, psykisk sykdom, personlighetsforstyrrelse,
emosjonell «modenhet», om noen er stabil/ustabil *som menneske*.
Unngås-overlapp: ER-dimensjonen (der måles **strategi**: omtydning/
undertrykking; her måles **intensitet/hastighet**). Dersom en kandidat måler
strategi: **REJECT** (F2A §8).

**OPENNESS (nysgjerrighet på nye erfaringer og perspektiver)** — Tempo og
toleranse for nyhet, variasjon og perspektivforskjeller: nye erfaringer, nye
tanker, variasjon kontra kjente rammer. Relevant: par med lik lekenivå for
nytt deler opplevelsesrom. IKKE redusert til: kunstinteresse, utdanningsnivå,
intelligens, politisk orientering, kulturell status. Unngås-overlapp:
BFI-fantasi-fasett (eksplisitt ute), L2026-reiser (praktisk).

## 4. ITEM-BLUEPRINT (mål: 3 finale items per trekk; pool: 9 kandidater per trekk)

| TREKK | FACET A | FACET B | FACET C | RELATIONSHIP CONTEXT | FORBIDDEN OVERLAP | POLARITET | NIVÅ | SD-RISK |
|-------|---------|---------|---------|----------------------|-------------------|-----------|------|---------|
| EXTRAVERSION | Recharging fra sosial kontakt | Sosialt initiativ | Foretrukket sosial rytme | «når vi», kveldsplan, arrangement | COMM, ATT | nøytral | 8.–9. k | MEDIUM (ekstrovert pol kan framstå som norm) |
| AGREEABLENESS | Kompromiss i beslutninger | Vekting av den andres behov | Felles løsning ved uenighet | «når vi skal bestemme noe sammen» | COMM (reparasjon), ATT, ER (suppression) | nøytral (trade-off: egen linje vs avklaring) | 9. k | **HØY** — størst risiko i settet |
| CONSCIENTIOUSNESS | Planlegging/struktur | Oppfølging/hold av avtaler | Struktur kontra spontanitet (trade-off) | «avtaler», «planen», kveldsplan | L2026-livsstil, OPENNESS | nøytral (planlegging vs spontanitet) | 8.–9. k | MEDIUM-HØY (strukturert pol belønnes lett) |
| EMOTIONAL STABILITY | Hverdagsintensitet | Tid til ro | Etterarbeid/uforutsigbarhet | «en dag som har gått ske», «en vanskelig samtale» | **ER (strategi)**, klinisk screening | nøytral (intensitet er ikke «dårlig») | 9. k | MEDIUM — helsestigma er den alvorlige risikoen |
| OPENNESS | Nye erfaringer | Nye perspektiver/ideer | Variasjon kontra kjente rammer | «nye ting å prøve sammen» | BFI-fantasi, INT, L2026-reiser | nøytral (nytt vs kjent) | 8.–9. k | LAV |

**Itemformat-regler (gjennomgått for alle 45 kandidater):** ett hovedinnhold
per item; kort (max ~14 ord); vanlig bokmål; ingen psykologisk fagspråk;
mobil-lesbart; beskriver *tendens* (gjerne/oftest/litt), ikke identitet
(«Jeg er X» unngått der det blir karakterpris); ingen doble spørsmål; ingen
absolutte ord (altid/aldri); ingen moraliserende eller diagnoselignende
språk; ingen åpenbart ønskelig svar.

## 5. KANDIDATPOOL (45 kandidater — frosset før likhetskontrollene)

Skalerekjøring: høy respons = høy ende av trekken, bortsett fra ES
(høy = mer intensiv; mapper til `neuroticism` uten endring, se §3).

### 5.1 EXTRAVERSION (EX) — høy = mer sosialt ladd
| ID | FACET | KANDIDATTEKST |
|----|-------|---------------|
| EX1 | A | Jeg lader på å være sammen med andre. |
| EX2 | B | Jeg starter gjerne en prat med noen jeg ikke har møtt. |
| EX3 | C | En kveld uten sosialt plan blir ofte litt for stille for meg. |
| EX4 | C | Jeg liker at det er mange folk rundt meg. |
| EX5 | B | Jeg søker gjerne opp folk i stedet for å vente. |
| EX6 | A | Jeg har mest energi etter en dag med sosial kontakt. |
| EX7 | C | Jeg trives best i rom der noe skjer. |
| EX8 | B | Jeg kan prate med folk jeg knapt kjenner, uten at det blir rart. |
| EX9 | C | Jeg ser gjerne frem til et sosialt arrangement. |

### 5.2 AGREEABLENESS (AG) — høy = mer kompromissrettet
| ID | FACET | KANDIDATTEKST |
|----|-------|---------------|
| AG1 | A | Når vi skal bestemme noe sammen, legger jeg ofte vekt på hva den andre mener. |
| AG2 | A | Jeg gir gjerne litt, for at vi skal komme til enighet. |
| AG3 | B | Jeg prøver å se ting fra den andres side, også når jeg ikke er enig. |
| AG4 | C | Det er viktig for meg at vi unngår å bli sinte på hverandre. |
| AG5 | B | Jeg tenker på hva den andre trenger, når vi planlegger noe sammen. |
| AG6 | A | Jeg lar ofte den andre få sin vilje. |
| AG7 | C | Jeg holder igjen med kritikken, selv når jeg mener noe. |
| AG8 | B | Jeg setter ofte den andres behov foran mitt eget. |
| AG9 | C | Jeg prøver å finne en løsning hvor begge to slipper best unna. |

### 5.3 CONSCIENTIOUSNESS (CO) — høy = mer planmessig
| ID | FACET | KANDIDATTEKST |
|----|-------|---------------|
| CO1 | A | Jeg liker at ting er planlagt på forhånd. |
| CO2 | C | Jeg holder meg til en plan, selv når noe annet dukker opp. |
| CO3 | B | Jeg følger opp det jeg sier at jeg skal gjøre. |
| CO4 | A | Jeg lager gjerne en plan før jeg begynner på noe. |
| CO5 | A | Jeg liker at avtalene er klarte på forhånd. |
| CO6 | C | Jeg holder fast i det som er avtalt, selv om noe nytt frister. |
| CO7 | A | Jeg opplever det trygt når det er en plan for kvelden. |
| CO8 | B | Jeg setter gjerne opp avtaler før, i stedet for å ta dem som de kommer. |
| CO9 | A | Jeg gjør gjerne dagens ting i samme faste rekkefølge. |

### 5.4 EMOTIONAL STABILITY (ES) — høy = mer intensiv/tar lenger tid til ro (→ `neuroticism`)
| ID | FACET | KANDIDATTEKST |
|----|-------|---------------|
| ES1 | A | Småting som går ske i hverdagen, blir lettere til å merke på meg. |
| ES2 | B | Etter en dag som har gått ske, tar det litt tid før jeg finner roen. |
| ES3 | C | Jeg tenker gjerne på en vanskelig samtale litt lenger enn nødvendig. |
| ES4 | C | Plutselige endringer i planene får meg til å tenke ekstra på det. |
| ES5 | A | Jeg merker lett når stemningen i et rom endrer seg. |
| ES6 | A | Jeg lar meg få med meg en kritisk kommentar, selv når den er mild. |
| ES7 | B | Jeg holder gjerne på med en vanskelig uenighet, i stedet for å la den gå. |
| ES8 | B | Jeg trenger litt tid for meg selv etter en tøff dag. |
| ES9 | A | Jeg blir lett oppgitt av småting som går galt. |

### 5.5 OPENNESS (OP) — høy = mer åpen for nytt
| ID | FACET | KANDIDATTEKST |
|----|-------|---------------|
| OP1 | A | Jeg prøver gjerne noe nytt, som en ny matrett eller en ny vei. |
| OP2 | B | Jeg liker å prate om tanker jeg ikke har tenkt på før. |
| OP3 | B | Jeg er nysgjerrig på hvordan andre ser på ting. |
| OP4 | C | Jeg liker endring i hverdagen. |
| OP5 | A | Jeg leter gjerne etter en ny måte å gjøre ting på. |
| OP6 | B | Jeg åpner meg lett for meninger som er annerledes enn mine. |
| OP7 | A | Jeg liker at vi bytter på å prøve nye ting. |
| OP8 | B | Jeg finner det spennende å høre hvordan andre lever. |
| OP9 | C | Kjente rammer trygger meg mest. |


## 6. SVARSKALA OG REVERSE-ITEM-POLICY (anbefalinger — ikke implementert)

### 6.1 Kandidat til svarskala (bekrefter dagens ankre)
Dagens produksjonsankre (les read-only fra `components/onboarding/ScaleQuestion.tsx`, §5 FORSKNINGSMOTOR):

| POLE | 1 | 2 | 3 | 4 | 5 |
|------|---|---|---|---|---|
| ANKER | Passer ikke | Passer dårlig | Både og | Passer ganske godt | Passer helt |

Kontroll mot F2A §14:
- **Semantisk balansert:** ja — endene speiler hverandre («Passer ikke»/«Passer helt»), midtpunktet er et eget, nøytralt «Både og».
- **Tydelig midtpunkt:** ja — «Både og» er verken «litt» eller «helt»-nøytral; det er et eget svar med egen betydning (begge sider passer noe). Dette fungerer for trade-off-items (CO2, EX-items), men se §12/§14-vurdering: for items der «Både og» er *naturlig rett svar for de fleste* (f.eks. ES2), kan midtpunktet bli default — akseptert risiko, dekkes av G1.
- **Ikke blander enighet og passform:** ja — hele skalaen er i «passform»-semantikk, aldri «enig/uenig».
- **Kan brukes på alle items:** ja — alle 45 kandidater er formulert som påstander om eget mønster, slik at «passer» fungerer.
- **Negasjoner:** ingen i v2-kandidatsettet (se 6.2) — ingenting som gjør skalaen vanskelig.
**Anbefaling: behold 5-punkts «Passer»-skalaen uendret for v2.** (Implementering: F2B/F2C.)

### 6.2 Reverse-item policy
**Anbefaling: A — ingen reverse-keyed items i v2-kandidatsettet** (bekrefter F2-plan §T.7).
Begrunnelser:
- **Acquiescence:** uten negative items kan ikke en blindt «ja»-svarende produsere kunstig variasjon — men med kun 15 items og produktbruken (ikke forskning) veier dette mot den store poenget: feil.
- **Mobilforståelse:** grammatisk negative items («Jeg lar meg *ikke* raskt oppgitt av…») øker misforståelsesrisiko på mobil, der man svarer raskt.
- **Feilscoring:** reverse keying i scoring-motoren er en permanent feilkilde i fremtidige endringer; null reverse items fjerner denne helt (0 revers i dagens kode — beholdes slik).
- **Brukeropplevelse:** en konsistent «passform»-logikk uten logiske vendinger.
**Polaritetsbalanse uten negasjon:** oppnås ved *innhold* — hvert trekk har items der begge poler er like forsvarlige (trade-off-formuleringer: planlegging vs spontanitet, sosial aktivitet vs alenetid, nytt vs kjent). OBS: items med motsatt *skalerekjøring* (f.eks. «Kjente rammer trygger meg mest» for OP) kan IKKE blandes i samme trait-gjennomsnitt — det ødelegger skalekohersensen. Derfor er slik polaritetsbalanse implementert som **faktisk motsatte innhold** (OP9 avvist, se §11).

## 7. BFI-10 LIKHETSKONTROLL (separat steg EFTER poolfrysing)

Metode: alle 45 kandidater ble sammenlignet mot (a) BFI-10 engelske original-items (bfi1–bfi10) og (b) dagens v1-norske tekst i `instruments.ts`, etter at poolen var frosset. Ingen BFI-referanse under skriving (se §1).

| KLASSE | ANTALL | ITEMS |
|--------|--------|-------|
| INDEPENDENT | 31 | EX1, EX2, EX4, EX5, EX7, EX9, AG2, AG5, AG6, AG9, CO1, CO4, CO5, CO6, CO7, CO8, CO9, ES1, ES2, ES3, ES4, ES5, ES6, ES8, OP1, OP2, OP4, OP5, OP7, OP8, OP9 |
| CONCEPTUALLY SIMILAR | 14 | EX3, EX6, EX8, AG1, AG3, AG4, AG7, AG8, CO2, CO3, ES7, ES9, OP3, OP6 |
| CLOSE ADAPTATION | **0** | — |
| NEAR-VERBATIM | **0** | — |

**Resultat: 0 CLOSE ADAPTATION / 0 NEAR-VERBATIM.**
CONCEPTUALLY SIMILAR er forventet og akseptert: samme konstrukt måles
(f.eks. CO3 «følger opp det jeg sier» og bfi3s «fikk oppgaver utført i god
ro» beskriver begge konsekvens; EX6 og bfi7+ beskriver begge sosial energi).
Likheten er *konstruktlevel*, ikke tekstlevel: ingen delt syntaks, ingen
delt formulering, ingen delt itempar, ingen identisk kontekst.
Dette er en kvalt endring fra v1 (som per F1.5 var CLOSE ADAPTATION på 6 av
10 items) til INDEPENDENT/CONCEPTUALLY SIMILAR på alle 45.
**Gjenstående BFI-gate:** juridisk bekreftelse (G8) at konseptlikhet for samme
konstrukt uten delt tekst er god nok for kommersiell/privat bruk — dette er
et advokatspørsmål, ikke et utviklingsspørsmål.


## 8. IPIP-PROVENANSEKONTROLL

IPIP-itemtekst er **ikke** brukt som kilde (kildevalg A, §1). Likevel ble
poolen sjekket mot velkjente IPIP-items for tilfeldig likhet:

| KANDIDAT | TILFELDIG LIKHET | BESLUTNING |
|----------|------------------|------------|
| EX1, EX4 | Konseptuelt nær IPIP extraversion (f.eks. «I like to be around other people») | **Holdes som selvstendig.** Ingen tekstdeling; IPIP er public domain — lav risiko selv ved likhet |
| EX2, EX8 | Konseptuelt nær IPIP «I am outgoing» | Holdes som selvstendig |
| AG1, AG5 | Konseptuelt nær IPIP agreeableness (f.eks. «I sympathize with others' feelings») | Holdes som selvstendig |
| CO3 | Konseptuelt nær IPIP «I am dependable» | Holdes som selvstendig |
| OP3 | Konseptuelt nær IPIP «I am curious about ideas» | Holdes som selvstendig |
| ES-alle | Konseptuelt nær IPIP neuroticism-domene | Holdes som selvstendig |
| Alle andre | Ingen betydelig likhet | — |

**Ingen items krediteres som IPIP-derived** (ingen tekstdeling). Tosom
publiserer **ikke** at det bruker et validert IPIP-instrument — v2 er en
egen, uvalidert produktmodell (se §17).

## 9. OVERLAPP-MATRISE MOT AKTIVE TOSOM-SPØRSMÅL

Domener: **COMM** (6 items: reparasjon, signaler, konflikt, lytting,
uttrykk, oppfølging), **ATT** (12 items: angst 6, unnvikelse 6), **ER**
(6 items: omtydning 3, undertrykking 3), **LIFE** (dealbreakers), **VAL**
(10 PVQ-verdier), **LIV** (livssituasjonsfelt i onboarding).

Klassifisering per kandidat (verste treff tvers gjennom domener):

| ID | STATUS | BEMERKNING |
|----|--------|------------|
| EX1–EX9 (alle) | NO OVERLAP | Komm/att spør *hvorfor/hvordan* man snakker og binder seg; EX-spør om energikilde. Separat |
| AG1, AG2, AG5, AG6, AG9 | ACCEPTABLE RELATEDNESS | Nær COMM «oppfølging/avklaring», men måler *forhandlingsstil* ikke *kommunikasjonsevne* |
| AG3 | ACCEPTABLE RELATEDNESS | Nær COMM uttrykk («prøver å se fra den andres side») — akseptert: perspektivtaking vs utsagn |
| **AG4** | **MATERIAL OVERLAP** | «Unngår å bli sinte» = konfliktunngåelse → overlapper ATT-unngivelses-pol + COMM-konflikt. **AVVIST** |
| **AG7** | **DUPLICATE** | «Holder igjen med kritikken» = undertrykking → dupliserer ERQ suppression (er2/er3). **AVVIST** (F2A §8: REJECT dersom kandidat måler strategi) |
| **AG8** | **MATERIAL OVERLAP** | «Setter den andres behov foran mitt» = selvoppofrelse/angst-drevet tilpasning → overlapper ATT-angst (an3/an4) + forbudt «selvoppofrelse»-måling. **AVVIST** |
| CO1, CO4, CO5, CO7, CO9 | NO OVERLAP | Struktur/planlegging måles ikke i LIFE/VAL; arbeidsrytme i onboarding er *livsstil* (faktisk status), ikke disposisjon |
| CO2, CO3, CO6, CO8 | ACCEPTABLE RELATEDNESS | «Oppfølging av avtaler» nær COMM oppfølging-item — akseptert: CO måler *disposisjon*, COMM oppfølging måler *kommunikasjonskompetanse* |
| ES1, ES2, ES4, ES6, ES7 | NO OVERLAP | ERQ måler *valg av strategi* (omtydning/undertrykking); ES måler *intensitet og tid til ro*. Ortogonalt innhold |
| **ES5** | ACCEPTABLE RELATEDNESS (avvist av annen grunn) | «Merket stemningsendring» leses som sosial intelligens (positiv) — polaritetsforvirring. **AVVIST** (se §11) |
| **ES8** | MATERIAL OVERLAP | «Tid for meg selv etter en tøff dag» = behov for distansering → overlapper ATT-unngivelse (av4/av5). **AVVIST** |
| **ES9** | DUPLICATE (internt) | Redundant med ES1 (samme innhold, samme fasett). **AVVIST** |
| OP1, OP4, OP5, OP7, OP8 | NO OVERLAP | Reiser i LIV er praktisk; OP måler disposisjon |
| OP2, OP3 | ACCEPTABLE RELATEDNESS | «Prate om tanker» nær COMM uttrykk — akseptert: OP2/OP3 handler om *nyhet*, ikke uttrykksmønster |
| **OP6** | **MATERIAL OVERLAP** | «Åpner meg for annerledes meninger» = avklaring/medlidelse → dupliserer AG3. **AVVIST** |
| **OP9** | — (internt feil) | Motsatt skalerekjøring kan ikke i samme trait-gjennomsnitt (se §6.2). **AVVIST** |
| **EX3** | — (innholdsfeil) | «For stille» = negativ vurdering av introverte polen (SD-skjevhet). **AVVIST** |

**Resultat:** 9 kandidater avvist pga MATERIAL OVERLAP / DUPLICATE /
internt feil; ingen overlevende kandidat har MATERIAL OVERLAP eller
DUPLICATE mot aktive Tosom-spørsmål.


## 10. SOSIAL ØNSKELIGHET + KLINISK RISIKO (alle 45)

SD: LOW / MEDIUM / HIGH — hvor lett ser det ut for en respondent å vite
hvilket svar som «ser best ut». KR: klinisk/stigmatiserende lesbarhet.

| TREKK | LOW | MEDIUM | HIGH | KR-LESEBARHET |
|-------|-----|--------|------|---------------|
| EX | EX1, EX2, EX4, EX5, EX7, EX8, EX9 | EX3, EX6 | — | LAV overalt (avvist EX3: skjev pol, ikke klinisk) |
| AG | AG6 | AG1, AG3, AG5, AG9 | **AG2, AG8** (AG8 avvist; AG2: «gir gjerne litt» = selvoppofrings-antydning → holdes med G1-merknad) | AG4/AG8 avvises (angst-/self-sacrifice-lesbarhet); de øvrige LAVE |
| CO | CO1, CO4, CO7, CO9 | CO2, CO5, CO6, CO8 | **CO3** («følger opp det jeg sier» = pålitelighetsnorm; holdes — B-fasett krever et oppfølging-item, G1-merknad) | LAV overalt |
| ES | ES1, ES2, ES4, ES6, ES9 | ES3, ES7 | — | **MEDIUM, overvåkes**: ingen av itemene bruker klinisk språk («oppgitt», «ske», «ro» er hverdagsord); ingen antyder lidelse. ES8/ES5 avvises (distansering/stigma-antydning). Krav: intro-tekst må si at intensitet ikke er en defekt (F2C) |
| OP | OP1, OP2, OP3, OP4, OP5, OP7, OP8, OP9 | — | — | LAV overalt |

**Mønster:** SD-høyeste konsentreres i AG og CO (som forventet — disse
polene er kulturelt belønnet). Mitigering i selve teksten: trade-off-
formuleringer (CO2/CO6 «selv om noe nytt frister», AG2 «for at vi skal
komme til enighet» = begge deler vinner). Ingen pol er moraliserende.
CO3 og AG2 holdes med **G1-merknad** (spørsmålene til eksperten i §16).

**Klinisk risiko (hard grense F2A §8):** Ingen av de overlevende 36
kandidatene måler, antyder eller bruker språk fra: angst, depresjon,
traume, personlighetsforstyrrelse eller «emosjonell modenhet». ES-items
beskriver *hverdagsreaksjonsintensitet* («småting som går ske», «en dag som
har gått ske» — ikke «krise», «angst», «panikk»). Funksjon i matching
(§12 av audit) beholder modellen som produkt-heuristikk, aldri som
diagnostikk.


## 11. INTERNT REVIEWRUNG (to separate perspektiver)

### 11.1 REVIEWER A — konstrukt og faglig dekning
Per trekk: dekker finalistene (3 items) tre fasetter?

| TREKK | FINALISTER (facet) | VURDERING A |
|-------|--------------------|-------------|
| EX | EX1(A), EX2(B), EX4(C) | OK — alle tre fasetter dekket. Mangel: C-fasetten dekkes av kun et item (EX4); EX9/EX7 som reserve. |
| AG | AG1(A), AG2(A), AG9(C) | **MANGEL:** A-fasett dobbeltdekket, B-fasett (vekting av den andres behov) *ikke* dekket i finalister — AG3/AG5 er reserver. Mottatt: B-fasetten er den mest SD-belastede i settet; å bytte AG2↔AG3 er en G1-beslutning (se §16) |
| CO | CO1(A), CO2(C), CO3(B) | OK — alle tre fasetter dekket |
| ES | ES1(A), ES2(B), ES3(C) | OK — intensitet, tid-til-ro, etterarbeid. Mangel: «uforutsigbarhet» (C-sub) er kun ES4 (reserve) |
| OP | OP1(A), OP2(B), OP3(B) | **MANGEL:** C-fasett (variasjon kontra kjente rammer) *ikke* dekket i finalister — OP4/OP5 er reserver. Mottatt: OP9 (motpol) er avsatt, så C må dekkes av OP4/OP5 ved G1 |

Review A: 3/5 trekk har full fasettdekning i primærsettet; AG og OP er avhengige av reserver. Dette er **G1s viktigste strukturelle spørsmål** (spørsmål 2/3 i §15.2).

### 11.2 REVIEWER B — språk, brukerforståelse, bias, produktrelevans
Per item (kun funn; øvrige items: OK):

| ID | FINN B | BESLUTNING |
|----|--------|------------|
| AG2 | «gir gjerne litt» — lettest SD-item i settet; kan leses som selvoppofrelse | Holdes, G1-merknad (SD-HIGH) |
| CO3 | «følger opp det jeg sier» — pålitelighetsnorm, lett ønskelighet | Holdes, G1-merknad (SD-HIGH) |
| CO8 | Langsetning, to handlinger («sett opp før» + «i stedet for») | Ikke valgt (reservere for CO5/CO6) |
| ES1 | «Småting som går ske… lettere til å merke på meg» — noe tvetydig (merke *hva*?) | Holdes; kognitiv test skal sjekke (plan §13) |
| ES3 | «lenger enn nødvendig» — innbyr til å sammenligne seg med en norm | Holdes; kognitiv test skal sjekke |
| EX1 | «lader på» — idiomatisk, men allmenn forståelse på mobil | Holdes |
| OP2 | «prate om tanker jeg ikke har tenkt på før» — dobbelt «tenke», litt tungt | Holdes; eventuelle omformuleringer G1 |
| ES-alle | Krev innledende ramme: «intensitet er ikke en defekt» | Overlevert F2C (intro-tekst, §2) |

Review B: ingen item er uforståelig eller klinisk; 2 items (AG2, CO3) bæres av SD-risiko og krever G1-dom; ES-rammen krever eksplisitt intro-tekst.

### 11.3 Dokumentert uenighet
- **ES5** («Merket lett når stemningen i et rom endrer seg»): A ville beholde den som C-fasett-reserve (rik konstruktinnhold); B avviste — «stemningssans» leses som *sosial intelligens* (positiv egenskap), dvs. high-respondent = «flink», low-respondent = «uforstående» — polaritetsforvirring + SD-skjevhet i en ES-akse der begge poler skal være nøytrale. **Enighet: avvist.**
- **AG2 vs AG3 i finalisten:** A vil ha AG3 (B-fasett) inn; B vil ha AG2 (SD-avslørende trade-off) inn. **Løst:** begge holdes (AG2 primær, AG3 reserve); avgjøres ved G1 (spørsmål 2/3 i §15.2).

### 11.4 Avviste items (full liste, 9)
| ID | TEKST | AVVISNINGSGRUNN |
|----|-------|------------------|
| EX3 | En kveld uten sosialt plan blir ofte litt for stille for meg. | SD-skjevhet: negativ vurdering («for stille») av introverte polen (Review B) |
| AG4 | Det er viktig for meg at vi unngår å bli sinte på hverandre. | MATERIAL OVERLAP: konfliktunngåelse ↔ ATT-unngivelse + COMM-konflikt (F2A §8: REJECT) |
| AG7 | Jeg holder igjen med kritikken, selv når jeg mener noe. | DUPLICATE: undertrykking ↔ ERQ suppression (F2A §8: REJECT) |
| AG8 | Jeg setter ofte den andres behov foran mitt eget. | Forbudt måling (selvoppofrelse) + MATERIAL OVERLAP ATT-angst + SD-HIGH |
| ES5 | Jeg merker lett når stemningen i et rom endrer seg. | Polarity/SD-forvirring (social intelligens-lesbarhet) — Review A/B uenighet, avgjort mot |
| ES8 | Jeg trenger litt tid for meg selv etter en tøff dag. | MATERIAL OVERLAP: distansering ↔ ATT-unngivelse (av4/av5) |
| ES9 | Jeg blir lett oppgitt av småting som går galt. | Internt DUPLICATE med ES1 (samme fasett, samme innhold) |
| OP6 | Jeg åpner meg lett for meninger som er annerledes enn mine. | MATERIAL OVERLAP med AG3 (avklaring) |
| OP9 | Kjente rammer trygger meg mest. | Motsatt skalerekjøring — ugyldig i samme-retning trait-gjennomsnitt (§6.2) |

Ingen avvisne items er skjult — alle 45 kandidater er listet i §5 med status.


## 12. FORELØPIG FINALISTSETT

**DRAFT – REQUIRES EXTERNAL EXPERT REVIEW.** Ikke endelig godkjent.

### 12.1 15 primærkandidater
| TREKK | ID | FAS | TEKST | SD | G1-MERKNAD |
|-------|----|-----|-------|----|------------|
| EXTRAVERSION | EX1 | A | Jeg lader på å være sammen med andre. | LOW | — |
| EXTRAVERSION | EX2 | B | Jeg starter gjerne en prat med noen jeg ikke har møtt. | LOW | — |
| EXTRAVERSION | EX4 | C | Jeg liker at det er mange folk rundt meg. | LOW | — |
| AGREEABLENESS | AG1 | A | Når vi skal bestemme noe sammen, legger jeg ofte vekt på hva den andre mener. | MEDIUM | — |
| AGREEABLENESS | AG2 | A | Jeg gir gjerne litt, for at vi skal komme til enighet. | **HIGH** | SD-risiko + B-fasett ikke dekket (AG3-reserve) |
| AGREEABLENESS | AG9 | C | Jeg prøver å finne en løsning hvor begge to slipper best unna. | MEDIUM | — |
| CONSCIENTIOUSNESS | CO1 | A | Jeg liker at ting er planlagt på forhånd. | LOW | — |
| CONSCIENTIOUSNESS | CO2 | C | Jeg holder meg til en plan, selv når noe annet dukker opp. | MEDIUM | — |
| CONSCIENTIOUSNESS | CO3 | B | Jeg følger opp det jeg sier at jeg skal gjøre. | **HIGH** | SD-risiko (pålitelighetsnorm) |
| EMOTIONAL STABILITY | ES1 | A | Småting som går ske i hverdagen, blir lettere til å merke på meg. | LOW | Kognitiv test: «merke på meg»-tvetydighet |
| EMOTIONAL STABILITY | ES2 | B | Etter en dag som har gått ske, tar det litt tid før jeg finner roen. | LOW | Midtpunktet («Både og») kan bli default |
| EMOTIONAL STABILITY | ES3 | C | Jeg tenker gjerne på en vanskelig samtale litt lenger enn nødvendig. | MEDIUM | Norm-sammenligning («enn nødvendig») |
| OPENNESS | OP1 | A | Jeg prøver gjerne noe nytt, som en ny matrett eller en ny vei. | LOW | — |
| OPENNESS | OP2 | B | Jeg liker å prate om tanker jeg ikke har tenkt på før. | LOW | Kognitiv test: dobbel «tenke» |
| OPENNESS | OP3 | B | Jeg er nysgjerrig på hvordan andre ser på ting. | LOW | B-fasett dobbeltdekket; C-fasett via reserve (OP4/OP5) |

### 12.2 10 reservekandidater
| TREKK | ID | FAS | TEKST | HVA DEN LØSER |
|-------|----|-----|-------|----------------|
| EXTRAVERSION | EX5 | B | Jeg søker gjerne opp folk i stedet for å vente. | Bytte for EX2 |
| EXTRAVERSION | EX8 | B | Jeg kan prate med folk jeg knapt kjenner, uten at det blir rart. | Bytte for EX2; B-fasett trade-off |
| AGREEABLENESS | AG3 | B | Jeg prøver å se ting fra den andres side, også når jeg ikke er enig. | **Dekker B-fasett** (G1-strukturelt valg) |
| AGREEABLENESS | AG5 | B | Jeg tenker på hva den andre trenger, når vi planlegger noe sammen. | B-fasett, relasjonsforankret |
| CONSCIENTIOUSNESS | CO5 | A | Jeg liker at avtalene er klarte på forhånd. | Bytte for CO1, relasjonsforankret |
| CONSCIENTIOUSNESS | CO6 | C | Jeg holder fast i det som er avtalt, selv om noe nytt frister. | C-fasett trade-off, bytte for CO2 |
| EMOTIONAL STABILITY | ES4 | C | Plutselige endringer i planene får meg til å tenke ekstra på det. | Uforutsigbarhets-fasett |
| EMOTIONAL STABILITY | ES6 | A | Jeg lar meg få med meg en kritisk kommentar, selv når den er mild. | A-fasett, SD-sjekk (avkjenning er «lavt»-pol) |
| OPENNESS | OP4 | C | Jeg liker endring i hverdagen. | **Dekker C-fasett** (G1-strukturelt valg) |
| OPENNESS | OP5 | A | Jeg leter gjerne etter en ny måte å gjøre ting på. | A-fasett, bytte for OP1 |

Ikke-valgte kandidater (14, beholdes i §5 for gjenbruk ved G1-omvalg):
EX6, EX7, EX9, AG6, CO4, CO7, CO8, CO9, ES7, OP7 + avviste 9 (se §11.4).

## 13. KOGNITIV TESTPLAN (for senere fase — ikke utført, ingen data innsamlet)

Tidspunkt: etter G1-godkjenning, før F2C-onboarding. Metode: 6–10 semi-
strukturerte kognitive interviews (think-aloud), mobile, 15–20 min, ingen
personopplysninger utover det nødvendig for oppfølging (G8-vilkår).
Per item testes:
1. Hva tror brukeren at spørsmålet spør om? (konstrukt-lesbarhet)
2. Hvordan velger man svaret? (ankre-betydning, «Både og»-bruk)
3. Ser man én pol som «bedre»? (SD-kontroll i levende svar)
4. Vanlige/tvetydige ord: «lader», «merke på meg», «enighet», «frister».
5. Oppfattes itemet som invaderende eller klinisk? (spesielt ES-items)
6. Fanger intro-teksten (§2) «vanligvis, ikke ønsket»?
Stans-kriterium: >30 % av testpersoner misforstår ett eller flere items,
eller ES-items får kliniske assosiasjoner hos >2 respondenter → item
sendes tilbake til G1-revisjon.


## 14. VEKTTURDERING 0.15 (F2A §26 — ingen endring her)

Kandidatsettet vurderes som et **uvalidert produktmål** (se §16).

| PERSPEKTIV | VURDERING |
|------------|-----------|
| Grunn til å beholde 0.15 | F2-plan §T.9: bevisst valg for å gi personlighet synlighet uten å dominere (livsstil 0.55). Endring av vekter er en ny normaliserings- og re-testaktivitet — separer den fra item-utskiftning |
| Grunn til å redusere (f.eks. 0.10) | V2-items er uvaliderte og tynnere (3 items/trekk vs 2/trekk — men ukjent reliabilitet). En lav vekt begrenser skaden dersom et trekk-systematisk feilskårer. Eksisterende fallback (v1↔v2-par → overlap/0.5) tilsier allerede at personligheten «svikter» for en stor del av populasjonen i overgangsfasen |
| Risiko ved å overvekte | Ved 0.15 og 5 dimensjoner med heuristisk matching (ikke validering), kan ett feilinterprettert item forskyve matchrang for tusenvis av par uoppdaget — uten empirisk validitet (T.16) finnes ingen automatisk varslingsmekanisme |
| Effekt av eksisterende fallback | F2-plan §T.9: v1/v2-blanding gir 0.5/overlap — dvs. under overgang er 0.15-vekten *faktisk* mindre virkningen enn 0.15, fordi en stor del av parene faller ned til nøytralt. Dette taler mot å senke den ytterligere nå |
| Hvilken ekspertbeslutning som kreves | **G1, spørsmål 8** (§15.2): «Er 0.15 for høy for et uvalidert 15-item signal?» — eksperten anbefaler beholde/senk; endringen, dersom noen, gjøres i egen akt med egen testing, **ikke** i F2B |

**Anbefaling: beholde 0.15 frem til G1, og la G1-beslutningen være bindende
for F2B.** Ingen faktisk vektendring i F2A.

## 15. EKSTERN EKSPERT-REVIEWPAKKE (G1)

Dette avsnittet + §3 (konstrukt), §4 (blueprint), §12 (finalister), §11.4
(avviste) + denne pakken er **hele** eksterne leveringen. Eksperten er en
ekstern psykometriker/relasjonsforsker; oppdragsform: faglig review av
uvalidert produktmodell for kommersiell/individbruk — ikke research-samarbeid.

### 15.1 Innhold i pakken (leveres som ett dokument til eksterne)
1. Formålet med personlighetssignalet (kompatibilitetsskår i matching, vekt 0.15; IKKE klinisk, IKKE kjemi, §16)
2. Konstruktdefinisjonene (§3, frosset)
3. Blueprint (§4)
4. Alle 15 primære + 10 reserve-items (§12)
5. Avviste items + begrunnelse (§11.4, 9 items)
6. Svarskala: 5-punkts «Passer ikke…Passer helt», midtpunkt «Både og» (§6.1) + intro-tekst (§2)
7. Scoringplan: gjennomsnitt per trekk, 1–5 kontinuerlig, ingen reverse-keying, `neuroticism`-felteretning ubehandlet (ES-items nøkkles høy = mer intensiv, §3/§6.2)
8. Foreslått vekt: 0.15 (uendret; §14)
9. Matchingbruk: `scorePersonalityCompat` (heuristisk, uvalidert) kun for par med samme `personalityModelVersion`; ellers nøytral fallback (F2-plan §T.9)
10. Missing policy: manglende/partial → null (fallback), aldri default 3 (F2-plan §T.10, T.16)
11. Modellversjonering: `personalityModelVersion` nullable Int, V1=null/1, V2=2; v1-data beholdes for GDPR/audit, tas ut av aktiv UI
12. Overlappmatrisen (§9)
13. Corporate/commercial use: ja — kommersiell datingplattform, individbruk; ingen forskning
14. Offentlig Metoder-copy (dagens, rett opp i F1: `components/methods/methods-content.ts` «Personlighet»-avsnitt)
15. Spørsmålene eksterne skal besvare (§15.2)

### 15.2 Spørsmålene til eksterne (bindende G1-kriterier)
1. Representerer itemene konstruktene (§3) — per trekk, ja/nei + hvorfor?
2. Dører tre items konstruktet tilstrekkelig for produktets **begrensede formål** (matching-heuristikk)? Spesifikt: AG B-fasett og OP C-fasett er ikke dekket i primærsettet — bør AG3/OP4 oppgraderes til primær?
3. Gilder itemene over i andre dimensjoner (spesielt AG↔COMM/ATT, ES↔ER)?
4. Er noe klinisk eller stigmatiserende — spesielt ES-items og intro-rammen?
5. Er noen formuleringer sosialt ønskelige (AG2, CO3 er flagget)?
6. Gir svarskalaen (inkl. «Både og» som midtpunkt) mening for alle 15 items?
7. Er scoring og matchingbruk faglig forsvarlig som produktheuristikk — inkl. ES-items nøklet mot `neuroticism`-felteretning?
8. Er 0.15 for høy for et uvalidert 15-item signal? (bindende for F2B)
9. Må noen dimensjon fjernes?
10. Hvilke påstander kan Tosom legitimt publisere om dette signalet (for Metoder/Motpol) — konkret formulering?


## 16. VALIDITETSGRENSE, MODELLGRENSE, GATE-STATUS, F2B-REDSKAP

### 16.1 Ingen arvet validitet (eksplicit, F2A §27)
- Big Five-forskning validerer **ikke** automatisk Tosoms items.
- Ekspertreview (G1) er **ikke** det samme som empirisk validitet.
- Tre items per trekk kan gi begrenset presisjon.
- Matchvekten (0.15) er en produktheuristikk.
- Tosom har ennå ikke dokumentert prediktiv validitet.
- Resultatet skal ikke tolkes klinisk eller diagnostisk.

### 16.2 Personlighet er ikke kjemi (F2A §28)
Personlighetssignalet undersøker enkelte selvrapporterte tendenser. Det
beregner **ikke**: fysisk tiltrekning, romantisk kjemi, forelskelse,
forholdets varighet, menneskelig verdi.

### 16.3 Gjenstående launch gates (per F2-plan §T.14)
| GATE | STATUS |
|------|--------|
| G1 Ekspertgjennomgang | **ÅPEN** — pakke klar (§15); F2A-leveransen er inngangen |
| G2 Skala-sjekkk | Delvis ferdig: ankre bekreftet (§6.1); G1-spørsmål 6 skal lukke |
| G3 Overlapp mot aktive spørsmål | Ferdig for v2-poolen (§9) |
| G4 Kognitiv test | Plan klar (§13); utføres etter G1, før F2C |
| G5 Vektbeslutning | Åpen — G1-spørsmål 8 (bindende for F2B) |
| G6 Missing-data policy | Beslutning ferdig i F2-plan (null, aldri 3); implementeres i F2B |
| G7 GDPR/export | `personalityModelVersion` må med i eksport + slettingssikring; verifiseres i F2B |
| G8 Juridisk/privat | **ÅPEN** — (a) v1-data-hold, (b) privacy-merknad, (c) bekreftelse på at INDEPENDENT/CONCEPTUALLY SIMILAR (0 CLOSE/NEAR-VERBATIM, §7) er tilstrekkelig for kommersiell/individbruk |

### 16.4 F2B-REDSKAP
**F2A-leveransen er fullført.** F2B (scoring/versjonering) kan **forberedes**
nå, men skal **ikke** starte implementering før G1 er godkjent (itemvalget er
inngangen til scoring) og G8 er avklart. F2B-fakta (fra F2-plan §T): ny
nullable-kolonne `personalityModelVersion`, v1↔v2-par → nøytral fallback,
manglende → null, vekt 0.15 (med mindre G1 sier noe annet), ingen endring
i `scorePersonalityCompat`-heuristikken.

---

*F2A-leveranse (22 punkter, F2A §29): 1 kildelag §1 · 2 frosne definisjoner §3 ·
3 blueprint §4 · 4 svarskala §6.1 · 5 reverse-policy §6.2 · 6 45 kandidater §5 ·
7 provenansregister §1+§7+§8 (alle items: konstrukt-skrevet, ingen IPIP-tekst,
ingen annen kilde, BFI-sjekket, Tosom-sjekket, ingen opphavsrettsrisiko —
status per item i §5/§9/§11.4/§12) · 8 BFI-sjekk §7 · 9 IPIP-sjekk §8 ·
10 overlappmatrise §9 · 11 SD-vurdering §10 · 12 klinisk risiko §10 ·
13 Reviewer A §11.1 · 14 Reviewer B §11.2 · 15 avviste items §11.4 ·
16 15 primære §12.1 · 17 10 reserver §12.2 · 18 ekspertpakke §15 ·
19 kognitiv testplan §13 · 20 vektrutning §14 · 21 gjenstående gates §16.3 ·
22 F2B-redskap §16.4.*

