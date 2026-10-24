# TOSOM — FAGLIG INTEGRITETSAUDIT: /METODER + /MOTPOL
**Versjon:** v1.0 · **Dato:** 24.10.2026 · **Modus:** PLAN ONLY (ingen produktendringer)
**Commit-tilstand ved audit:** `da29210` (ren tre) · **Dokumentstatus:** UNTRACKED — intern, ikke offentliggjør
**Omfatt:** `app/metoder/page.tsx`, `app/motpol/page.tsx`, `lib/psychometrics/`, `lib/matching/`, onboarding-steg, kildeliste på /metoder.

> **Konfidensialitetsnotat:** Rapporten sitater enkelte itemtekster og skåringslogikk som kreves for audit.
> Dokumentet må ikke deles eksternt før lisensspørsmålene (G, §15) er avklart.

**Metode:** (1) Implementasjonsaudit av faktisk kode (ikke copy/kommentarer). (2) Kildeverifisering
via Crossref DOI-resolving og OpenAlex der mulig; ting som ikke kunne verifiseres online er
eksplicit merket IKKE-VERIFISERT. Google Scholar-søke-URL-er er IKKE godkjent som kilder.

---

## A. EXECUTIVE SUMMARY

Tosoms faglige kjerne (44 skalaspørsmål + 6 dimensjoner + vekter + dealbreakers) er **riktig bygd,
konsistent testet og ærlig grenset på flere punkter** («vi har ikke selv gjennomført studier»,
«veiviser, ikke fasit», terskler erklært ukalibrert, ingen tall vises til brukeren). Men
**/metoder-stasjonen kan ikke stå offentlig uendret**. Åtte funn krever handling før launch:

1. **«Seks dimensjoner, hver med et etablert instrument bak seg» — usant.** Faktisk implementasjon:
   6 dimensjoner, hvor kun 1 (personlighet/BFI-10-struktur) samsvarer med et publisert instrument
   i struktur — og selv det med tilpassede tekster og endret svarskala. Tilknytning, kommunikasjon
   og emosjonsregulering er **egne spørsmål**. Verdier er egne spørsmål inspirert av Schwartz-teori.
   Livssituasjon er **praktiske produktspørsmål uten instrument** (og har ikke engang et
   instrument-kort på siden).
2. **«Vi bruker dem som de er ment å brukes» — direkte motstridende implementasjonen.** Svarskalaen
   er endret fra BFI-10s uenig–enig-skala til «Passer ikke … Passer helt»; manglende svar telles som
   nøytralt; kommunikasjonstrekken er single-item-skårer; tilknytning kategoriseres ved et fast terskel
   (strengt over 3,0) som ikke er validert.
3. **Instrumentnavn som sannsynligvis er feil:** «PVQ-10» (verifisert IKKE-eksisterende standardnavn)
   og «ERQ-6, Gross & John (2003)» (den etablerte ERQ-6-kortformen er Preece, Petrova, Mehta & Gross
   2023 — og Tosoms items er i så fall likevel ikke deres). Begge navnene må fjernes/omskrivs.
4. **To kilder kunne ikke verifiseres og er sannsynligvis ikke-reelle:** «Roberts et al. (2016), JPSP
   109(3)» (år/volum inkonsistent; finnes ikke i noen indeks; nærmeste virkelige tilsvarende:
   Rammstedt & Roberts 2013, JPSP 104(2), DOI 10.1037/a0024950) og «Fraley (2018). The Adult
   Attachment Inventory. In: Adult Attachment: Concepts, Adult Development, and Assessment»
   (findes ikke i noen indeks). Begge: REMOVE/REPLACE.
5. **Schwartz (1992)-sitasen har feil tittel:** AESP vol. 25 (1992) inneholder «Universals in the
   Content and Structure of Values» (pp. 1–65, DOI 10.1016/s0065-2601(08)60281-6 — verifisert).
   «Domains of human values: Application and extension to four new countries» er et separat
   1994-kapittel (AESP vol. 27) — IKKE-VERIFISERT online denne runden (manual verifisering før publish).
6. **«Alle kildene er publiserte, fagfellevurderte studier og bøker» — usant:** Kildelisten inneholder
   Gottman Institute-organisasjonssiden (Level E, ikke fagfellevurdert) og fire Google Scholar-søke-URLer.
7. **«Livsvalg er en av de sterkeste prediktorene for relasjonsstabilitet i nyere parstudier
   (2015–2024)» — kildefri påstand.** Ingen spesifikk publisert kilde funnet. REMOVE eller bytt til
   kildetone ned.
8. **Lisensrisiko på BFI-10:** GESIS-opplysningen (ifølge oppdrag; offisiell side er nå 404 —
   re-verifisér) er at BFI/BFI-10 er for **ikke-kommersiell forskning**, ikke for individuell
   diagnostikk, og ikke for kommersiell bruk. Tosom er kommersiell → **tillatelse kreves** (eller
   omkoding til frittstående Big Five-inspirerte spørsmål).

**/motpol** er **SAFE AS IS**: null eksterne fakta- eller research-claim (EF/RC = 0, verifisert setning
for setning); alle påstander er typet PF/PH/OB/MC i kodekommentarer og PF-setningene stemmer med
implementasjon (dag-15-bilde låst i `app/api/chat/image/route.ts`, én aktiv reise, lørdags-cron).
Én valgfri, balansert forskningsblokk om valgmengde kan legges til (L), men er ikke nødvendig.

---

## B. RØD/GUL/GRØNN — /METODER

| # | Element | Vurdering | Grunnlag |
|---|---------|-----------|----------|
| 1 | «Seks dimensjoner, hver med et etablert instrument bak seg» | 🔴 | 4 av 6 dimensjoner = egne spørsmål; livssituasjon har ingen instrument (A.1, D). |
| 2 | «Hver dimensjon støttes av et etablert instrument. Vi har ikke utviklet dem selv — vi bruker dem som de er ment å brukes» | 🔴 | Motsies koden: egne items, endret svarskala, single-item-skårer, uvalidert terskel. |
| 3 | «Verdier (PVQ-10)» + note «Vår egen oversettelse» | 🔴 | «PVQ-10» ikke verifisert som publisert instrument; items er egne, ikke oversettelse. |
| 4 | «Emosjonsregulering (ERQ-6), Gross & John (2003), kortform» | 🔴 | Etablert ERQ-6 = Preece et al. 2023; Tosoms 6 items er egne parafraser. (Sitasen Gross & John 2003 selv er korrekt: JPSP 85(2), 348–362, verifisert.) |
| 5 | Kilde «Roberts et al. (2016), JPSP 109(3)» | 🔴 | IKKE-VERIFISERBAR; år/volum inkonsistent; finnes ikke i Crossref/OpenAlex. |
| 6 | Kilde «Fraley (2018). The Adult Attachment Inventory. In: Adult Attachment: …» | 🔴 | IKKE-VERIFISERBAR; finnes ikke i noen indeks. |
| 7 | Kilde «Schwartz (1992). Domains of human values … AESP 25» | 🔴 | Feil tittel for vol. 25 (verifisert: «Universals in the Content and Structure of Values», pp. 1–65, DOI 10.1016/s0065-2601(08)60281-6). «Domains …» er et separat 1994-kapittel (AESP 27) — IKKE-VERIFISERT online denne runden. |
| 8 | «Alle kildene er publiserte, fagfellevurderte studier og bøker» | 🔴 | Kildelisten inneholder Gottman Institute-organisasjonsside (Level E) + 4 Scholar-søke-URLer. |
| 9 | «Livsvalg er en av de sterkeste prediktorene for relasjonsstabilitet … (2015–2024)» | 🔴 | Kildefri superlativ-påstand; ingen publisert kilde funnet. |
| 10 | «Gottman observerte tusenvis av par over 40 år. Det han fant, holder.» | 🟡 | Stemmer med Instituttets egne siffer (Level E, ikke uavhengig verifisert); «holder» er generalisering. 1992-studien (verifisert) støtter at par-interaksjon forutsier utfall — ikke «bids/reparasjon» som navngitte konstrukt. |
| 11 | «Forskningen er tydelig: personlighet alene sier mindre … enn verdier og tilknytning» | 🟡 | Sammenligningspåstand uten kilde. |
| 12 | «moderne forskning (Fraley 2018 og nyere) fortsetter å bekrefte» | 🟡 | Referansen står ikke (#6); vag metapåstand. |
| 13 | «Emosjonsregulering er ett av de mest aktive feltene … (Gross 2015, Aldao 2010)» | 🟡 | Kildene reelle/verifiserte; «mest aktive» er mildt overdrevet — tåles, bør toner ned. |
| 14 | Notat «Vår egen oversettelse — ikke den offisielle norske versjonen» (BFI-10/PVQ/ERQ) | 🟡 | Misvisende: ingen kjent offisiell norsk BFI-10 (artikkel eng./tysk); for PVQ/ERQ er items ikke oversettelser men egne spørsmål. |
| 15 | «Schwartz la grunnlaget i 1992, og det holder fremdeles. Verditester er fortsatt i bruk» | 🟡 | Bredt forsvarbart (PVQ-RR/ESS/WVS aktiv bruk) — krever korrigert sitat (#7). |
| 16 | «Schwartz et al. (2012), AESP 47» | 🟡 | Sannsynlig reell (ikke indeksert denne runden — IKKE-VERIFISERT); lenke = Scholar-søk. Må ha forlengelsesside eller fjernes. |
| 17 | «Mikulincer & Shaver (2007), Guilford Press» | 🟡 | Reell, anerkjent bok (IKKE-VERIFISERT online denne runden); lenke = Scholar-søk. |
| 18 | Hero: «modeller som har vært gjennom tiår av testing og fortsatt brukes» | 🟢 | Forsvarbart for Big Five, tilknytning, Schwartz-verdier. |
| 19 | «Vi har ikke selv gjennomført studier — vi bygger på modeller…» | 🟢 | Ærlig og korrekt. |
| 20 | «Resonansmålingen er en veiviser, ikke en fasit» + «ikke en kjærlighetsdiagnose … ikke en bedømmelse av verdi» | 🟢 | Korrekt grensespråk. Mangle: «resonans er et merkebegrep, ikke et validert instrument» (K.7). |
| 21 | «Vi lover ikke at tersklene våre er ferdig kalibrert» | 🟢 | Ærlig; samsvarer med koden (resonanceLevel.ts: terskler MÅ ETTERPRØVES). |
| 22 | «Tilknytning (egne spørsmål)» + kilder Bowlby/Ainsworth/Hazan & Shaver/Fraley & Shaver | 🟢 | Ærlig label; alle fire kildene reelle (tre DOI-verifisert). |
| 23 | «Våre egne items bygget på prinsippene — vi bruker ikke Gottman Institute sine skjemaer» | 🟢 | Korrekt; lisensgrense respektert. |
| 24 | Verifiserte sitater: Rammstedt & John 2007 (JRP 41(1), 203–212) · Gross & John 2003 (JPSP 85(2), 348–362) · Gottman & Levenson 1992 (JPSP 63(2), 221–233) · Hazan & Shaver 1987 (JPSP 52(3), 511–524) · Fraley & Shaver 2000 (RGP 4(2), 132–154) · Aldao et al. 2010 (CPR 30(2), 217–237) · Gross 2015 (Psych Inquiry 26(1), 1–26) | 🟢 | Alle DOI-verifisert via Crossref denne runden. |

**Oppsummering /metoder: RØD — kan ikke stå offentlig uendret.** Copy-endringer (E/K) +
lisensgjennomgang (G) + ekspertgjennomgang (O) kreves før launch.

---

## C. RØD/GUL/GRØNN — /MOTPOL

Verifisert setning for setning (hele `app/motpol/page.tsx`, inkl. `comparisonRows`, `ikkeForDeg`,
`kanPasse`, `prisene`). Siden følger MOTPOL-PLAN-v1.0 §6: **PF/PH/OB/MC kun; EF = 0, RC = 0.**

| # | Element | Vurdering |
|---|---------|-----------|
| 1 | Ingen eksterne fakta- eller research-claim (EF/RC = 0) | 🟢 |
| 2 | PF-setninger stemmer med implementasjon: én aktiv reise (F1), lørdags-matchrunde (F2; cron S-17 «lørdagskjøring» verifisert), ingen match-garanti (F3), bildet på dag 15 (F5; `app/api/chat/image/route.ts` verifisert), privat profil (F8), ingen AI i chatten (F10) | 🟢 |
| 3 | 14 dager: fremstilles som rekkefølge/produktdesign (PH/OB), **ikke** som psykologisk optimal tid | 🟢 |
| 4 | «Hver gang du vurderer én person mens ti andre venter …, deler du oppmerksomheten» (PH) | 🟢 som filosofi; kan (valgfritt) styrkes med L-blokk |
| 5 | Balanse: «For mange fungerer det fint. For andre blir det støy.» + ærlige priser (utseende, tempo, ingen garanti) | 🟢 |
| 6 | Ingen navngitte konkurrenter; generisk «en vanlig modell» | 🟢 |
| 7 | Fremtidig risiko: om L-blokk legges til, må EF-claim holdes nøyaktig per L/M | 🟡 (forventningsbevisst) |

**Oppsummering /motpol: GRØNN — SAFE AS IS.** L-blokk er valgfri oppgradering, ikke retting.

---

## D. FULL IMPLEMENTASJONSAUDIT PER DIMENSJON

### D.0 Felles infrastruktur (alle dimensjoner)

| Feltnavn | Faktisk implementasjon |
|---|---|
| Item-definisjoner | `lib/psychometrics/instruments.ts` (F-1): 44 items — BFI10(10) + ATTACHMENT(12) + PVQ10(10) + ERQ6(6) + COMMUNICATION(6). `INSTRUMENT_SET_VERSION = '2026-08-22.v1'`. |
| Presentasjon | Onboarding-steg: `Step2Personlighet` (BFI10), `Step3Tilknytning` (ATTACHMENT), `Step5LivsstilVerdier` (PVQ10), `Step7HumorPersonlighet` (COMMUNICATION), `Step8ModenNysgjerrighet` (ERQ6). Livssituasjon/praktiske felt: `Step2Livssituasjon`, `Step4Kjærlighetsspråk`, livsstil2026-felt. |
| Svarskala | Én 5-punktskala for alle 44 items (`components/onboarding/ScaleQuestion.tsx`, F-4): 1=«Passer ikke», 2=«Passer dårlig», 3=«Både og», 4=«Passer ganske godt», 5=«Passer helt». **Ikke** BFI-10s uenig–enig-skala → endret administrasjon. |
| Skåring | `lib/psychometrics/scoring.ts` (F-2): reversering 6−s; **manglende svar → 3 (nøytral)**; gjennomsnitt per trekk avrundet til 2 des. Ingen normalisering mot populasjon; ingen normer; ingen CFA/validitet. |
| Lagring | `/api/profile/setup` (stamper `psychometricVersion`). |
| Matching | `lib/matching/unifiedScorer.ts` (F-8): vektet sum av 6 dimensjoner, hver 0–100. **Vekter:** values 0.25, attachment 0.25, personality 0.15, communication 0.15, emotionRegulation 0.10, lifeSituation 0.10 (summer til 1.0). Fallback til ordoverlapp (`overlapScore`) når en profil mangler psykometriske skårer. |
| Resonans | `lib/matching/resonanceLevel.ts`: terskler ≥80 DEEP / 65–79 STRONG / 50–64 MODERATE / <50 GENTLE. Kodekommentar: «TERSKLERNE MÅ ETTERPRØVES ETTER BETA». |
| Brukervisible resultat | **Ord, aldri tall** (invariant I-12): resonansnivå-ord (Dyp/Sterk/God/Rolig resonans) i QuickMatchCard/ChatHeader/dashboard; dimensjonsord via `toDimensionLabel` (Svært sterk/Sterk/God/Moderat/Svak). Ingen tilknytningskategori (trygg/engstelig/unnvikende/fearful) vises til brukeren — verifisert: ingen treff i app/-komponenter. |
| Admin-visible resultat | `app/admin/(panel)/matches`, `analytics`, `resonance` (numeriske skårer); metrics `match.round.score_median` / `.level` logges. |
| Dealbreakers | `lib/matching/dealbreaker.ts`: kjønnspreferanse, alderspreferanse, barn (blokkerer kun ja-vs-nei, PL-11), høyderegel (mann ≥5 cm kortere → avvis, LIVSSTIL-2026 D-1), livsstil-2026 «må stemme»-konflikt (D-4), livsrytme, eksplisitte preferanser, grenser, radius (B1.4, tosidig), religion (brukerdefinert akseptliste, tosidig, PL-27: religion er FJERNET fra scoring). PL-10: modenhets-/sikkerhetsgap fjernet (syntetiske data). |
| Kildekommentarer | `docs/FORSKNINGSMOTOR-v1.0.md` (intern; 577 linjer). **Avvik:** §4-tabellen kaller tilknytningssettet «ECR-S kortform (Wei et al., 2007)» mens koden sier «EGEN TEKST — ikke ECR-S» → intern dokumentasjonsfeil som må rettes. |
| Testdekning | `__tests__/psychometrics-scoring.test.ts` (257 linjer), `dimensions-compat.test.ts` (257), `dimensions-livsstil2026.test.ts`, `unified-scorer.test.ts` (226), `matching-score-round.test.ts`, `dealbreaker.test.ts`, `religion-compat-dealbreaker.test.ts`, `radius-dealbreaker-b14.test.ts`, `livsstil2026-dealbreaker.test.ts`, `cron-scoring-m3.test.ts`, `matching-watchdog.test.ts`, `dealbreaker-gender-age.test.ts`. Alle passerte i forrige fase (732 tester totalt). |


### D.1 PERSONLIGHET (BFI-10) — vekt 0.15

| Felt | Faktisk implementasjon |
|---|---|
| Question files | `instruments.ts` `BFI10[]` (10 items, bfi1–bfi10); steg `Step2Personlighet.tsx` |
| Antall items | 10 (2 per Big Five-trekk) |
| Svarskala | 1–5 «Passer ikke … Passer helt» (endret fra BFI-10s uenig–enig) |
| Reverse scoring | Kun bfi1 (reversert) — samsvarer med BFI-10s nykkering |
| Subskalaer | 5 akser: openness, conscientiousness, extraversion, agreeableness, neuroticism |
| Normalisering | Ingen; rå gjennomsnitt 1–5, 2 des. |
| Vekting | 0.15 totalt; likevektet gjennomsnitt av 5 trekk-tilpasninger (`scorePersonalityCompat`): nevrotisisme (lav hos begge = bra; begge >3.5 → −20), medmenneskelighet (høy hos begge), planmessighet (likhet, −25/poeng avvik), ekstroversjon (gap >1 straffes), åpenhet (likhet, −20/poeng) |
| Dealbreakers | Ingen |
| Matching use | `dimensions.ts:scorePersonalityCompat` → 0–100 |
| Brukervisible | Dimensjonsord (Svært sterk … Svak) i match-oppslag |
| Admin-visible | Numerisk dimensjonsscore i admin-panel |
| Source comments | Kode: «Rammstedt & John (2007) — fritt tilgjengelig» (**feilaktig optimistisk**, se G); `[OVERSETTELSE — bør kvalitetssikres]`. FORSKNINGSMOTOR §4: «Fritt tilgjengelig» (feil). |
| Test coverage | `psychometrics-scoring.test.ts`, `dimensions-compat.test.ts`, `unified-scorer.test.ts` |

**Item-klassifisering (BFI10), sammenlignet med engelsk BFI-10 (Rammstedt & John 2007):**

| id | Norsk tekst (kort) | Engelsk original | Klassifisering |
|---|---|---|---|
| bfi1 | «Jeg er stille og reservert» (rev.) | «I am reserved» (E−) | OWN TRANSLATION (tillegg «stille») |
| bfi2 | «Jeg stoler lett på andre» | «I trust others readily» (A+) | OWN TRANSLATION |
| bfi3 | «Jeg er nysgjerrig på mange ting» | «I am curious about many things» (O+) | OWN TRANSLATION |
| bfi4 | «Jeg har et aktivt fantasi-liv» | «I have an active imagination» (O+) | ADAPTED ITEM |
| bfi5 | «Jeg fullfører alltid det jeg starter» | «I always finish what I start» (C+) | OWN TRANSLATION |
| bfi6 | «Jeg er grundig og systematisk i det jeg gjør» | «I am thorough in my work» (C+) | ADAPTED ITEM (tillegg «systematisk») |
| bfi7 | «Jeg er den som får folk til å le på en fest» | «I am the life of the party» (E+) | ADAPTED ITEM (idiom erstattet) |
| bfi8 | «Jeg har en tilgivende natur» | «I have a forgiving nature» (A+) | OWN TRANSLATION |
| bfi9 | «Jeg blir lett oppbrakt» | «I get upset easily» (N+) | OWN TRANSLATION |
| bfi10 | «Jeg tenner lett på ting» | «I get nervous easily» (N+) | **ADAPTED — konstruktet skiftet** (nervøsitet → irritabilitet/reaktivitet) |

Rekkefølge og reverseringsmønster samsvarer med BFI-10. **Konklusjon:** strukturelt BFI-10,
tekstlig egen tilpasning + endret svarskala → **ikke BFI-10 som administrert instrument**.
Publikumskortet «Kortform av Big Five» er den korrekte toningen (FORSKNINGSMOTOR §4 krever nettopp
dette); navnet «BFI-10» bør ikke brukes uten tillatelse (G). bfi10 er det svakeste itemet.

### D.2 TILKNYTNING — vekt 0.25

| Felt | Faktisk implementasjon |
|---|---|
| Question files | `instruments.ts` `ATTACHMENT[]` (12 items: att_a1–a6 angst, att_v1–v6 unnvikelse); steg `Step3Tilknytning.tsx` |
| Antall items | 12 (6 + 6) |
| Svarskala | 1–5 «Passer …» |
| Reverse scoring | Ingen |
| Subskalaer | 2 akser: attachment_anxiety, attachment_avoidance + **utledet stil**: secure / anxious / avoidant / fearful |
| Normalisering | Ingen; terskel: strengt >3.0 (PL-08h, godkjent 06.10). **Manglende items → 3 → ufullstendig profil kategoriseres som «secure»** (biaseffekt verdt å dokumentere/fjerne) |
| Vekting | 0.25 totalt |
| Dealbreakers | Ingen (PL-10 fjernet sikkerhetsnivå-gap) |
| Matching use | `ATTACHMENT_MATRIX` stil-par → 0–100: trygg+trygg 100; trygg+engstelig/unnvikende 75; engstelig+engstelig 45; **engstelig+unnvikende 25 (laveste)**; fearful-parer 25–50; fallback 50 |
| Brukervisible | **Ingen stil-label vises** (verifisert); kun dimensjonsord |
| Admin-visible | Numerisk; stil-kategori ligger i profilen |
| Source comments | Kode: «EGEN TEKST — ikke ECR-S … Inspirert av Bowlby (1969), Ainsworth et al. (1978), Hazan & Shaver (1987)». FORSKNINGSMOTOR §4: «**ECR-S kortform (Wei et al., 2007)**» — **feil** (dokumentasjonsfeil). |
| Test coverage | `psychometrics-scoring.test.ts` (inkl. PL-08h terskel), `dimensions-compat.test.ts` |

**Klassifisering: OWN ITEMS INSPIRED BY FRAMEWORK** (egne spørsmål over angst/unnvikelse-aksene).
**IKKE ECR / ECR-R / ECR-S / ECR-12.** Det etablerte 12-item kortskjemaet (Wei, Russell, Mallinckrodt
& Vogel 2007, J Couns Psychol 51(3), 368–379, DOI 10.1080/00223890701268041 — verifisert) har andre
items. 4-kategorisk utledning (inkl. «fearful» = desorganisert) fra 2 akser × uvalidert terskel er
**ikke en diagnostisk klassifikasjon** — den må aldri fremstilles som en tilknytningsdiagnose
(§12). Siden sier korrekt «Det er ikke om du 'er trygg' eller ikke» — beholde.

### D.3 VERDIER («PVQ-10») — vekt 0.25

| Felt | Faktisk implementasjon |
|---|---|
| Question files | `instruments.ts` `PVQ10[]` (10 items, pvq1–pvq10); steg `Step5LivsstilVerdier.tsx` |
| Antall items | 10 |
| Svarskala | 1–5 «Passer …» (betydning: hvor viktig verdien er) |
| Reverse scoring | Ingen |
| Subskalaer | 8 Schwartz-verdier: benevolence(2), security(2), conformity(2), self_direction(1), stimulation(1), hedonism(1), power(1) |
| Normalisering | Ingen; gjennomsnitt 1–5 per verdi |
| Vekting | 0.25 totalt |
| Dealbreakers | Ingen |
| Matching use | `scoreValueCompat`: **Pearson-korrelasjon** mellom de to verdiprofilene (midtnormalisert om 3), r∈[−1,1] → 0–100; flat profil → 50 (PL-08i); <2 felles akser → nærleik/50 |
| Brukervisible | Dimensjonsord |
| Admin-visible | Numerisk |
| Source comments | Kode: «PVQ-10 … Schwartz (1992) — fritt, brukt i European Social Survey» (IKKE-VERIFISERT, F.11); `[OVERSETTELSE]`-label feilaktig (se under) |
| Test coverage | `psychometrics-scoring.test.ts`, `dimensions-compat.test.ts` |

**Klassifisering: OWN ITEMS INSPIRED BY FRAMEWORK** (egen formulering per Schwartz-verdi; ikke
PVQ-items eller SVS-items). «PVQ-10» er **ikke et verifisert publisert instrumentnavn**:
Schwartz-repositoryet lister SVS, PVQ40, PVQ21, PVQ-RR (siden utilgjengelig denne runden —
IKKE-VERIFISERT); verken Crossref eller OpenAlex inneholder et «PVQ-10». Påstanden «brukt i
European Social Survey» (intern kodemerking) kunne ikke verifiseres denne runden. →
**DO NOT USE THE NAME «PVQ-10» UNTIL RESOLVED.** Notatet «Vår egen oversettelse» er i tillegg
feilaktig: items er ikke oversettelser av eksisterende PVQ-items — de er egne spørsmål inspirert
av teorien om grunnleggende verdier.

### D.4 EMOSJONSREGULERING («ERQ-6») — vekt 0.10

| Felt | Faktisk implementasjon |
|---|---|
| Question files | `instruments.ts` `ERQ6[]` (6 items: erq_r1–r3 reappraisal, erq_s1–s3 suppression); steg `Step8ModenNysgjerrighet.tsx` |
| Antall items | 6 (3 + 3) |
| Svarskala | 1–5 «Passer …» |
| Reverse scoring | Ingen |
| Subskalaer | 2 akser: reappraisal (kognitiv omtydning), suppression (ekspressiv undertrykking) |
| Normalisering | Ingen; gjennomsnitt 1–5 per akse |
| Vekting | 0.10 totalt |
| Dealbreakers | Ingen |
| Matching use | `scoreEmotionRegCompat`: base 40 + (gj.snitt reappraisal − 1)·15; gj.snitt suppression >3.5 → −(overskudd)·30; suppression-avvik >2 → −15 |
| Brukervisible | Dimensjonsord |
| Admin-visible | Numerisk |
| Source comments | Kode: «ERQ-6 — Gross & John (2003), kortform» (feilaktig attribusjon, se under) |
| Test coverage | `psychometrics-scoring.test.ts`, `dimensions-compat.test.ts` |

**Klassifisering: OWN 6-ITEM VARIANT** (egne parafraser over konstruktene — verken original-ERQ
eller etablert kortform). Original-ERQ (Gross & John 2003, verifisert: JPSP 85(2), 348–362) har
**10 items (6 reappraisal, 4 suppression)**. Den etablerte seksitems-kortformen er **Preece,
Petrova, Mehta & Gross (2023), «Emotion Regulation Questionnaire—Short Form»** (PsycTESTS 2023,
DOI 10.1037/t90478-000 — verifisert; tilhørende artikkel ikke verifisert denne runden) — og
Tosoms items samsvarer ikke med denne heller. → Navnet «ERQ-6» hører til Preece et al.;
**«ERQ-6, Gross & John 2003» må ikke brukes.** Kandidat-retning (ikke implementert): «Egne
spørsmål som måler selvrapportert bruk av kognitiv revurdering og ekspressiv undertrykking,
inspirert av emosjonsreguleringsforskningen (Gross & John 2003)».

### D.5 KOMMUNIKASJON — vekt 0.15

| Felt | Faktisk implementasjon |
|---|---|
| Question files | `instruments.ts` `COMMUNICATION[]` (6 items: comm1–comm6); steg `Step7HumorPersonlighet.tsx` |
| Antall items | 6 (**1 per trekk — single-item «skalaer»**) |
| Svarskala | 1–5 «Passer …» |
| Reverse scoring | Ingen |
| Subskalaer | 6 trekk: repair, bids, conflict, listening, expressing, requesting |
| Normalisering | Ingen |
| Vekting | 0.15 totalt; likevektet |
| Dealbreakers | Ingen |
| Matching use | `scoreCommunicationCompat`: gjennomsnittlig nærleik (100 − |avvik|/4·100) per trekk |
| Brukervisible | Dimensjonsord |
| Admin-visible | Numerisk |
| Source comments | Kode: «Egne items på Gottman-prinsipper … vi kan kun bygge på prinsippene. Bygget på prinsipper fra Gottman & Levenson (1992)» |
| Test coverage | `psychometrics-scoring.test.ts`, `dimensions-compat.test.ts` |

**Klassifisering: OWN ITEMS INSPIRED BY FRAMEWORK.** «bids» og «reparasjonsforsøk» er navngitte
konstrukt i Gottmans forskningsprogram (bl.a. *The Seven Principles*, 2015 — bok, Level D), ikke i
selve Gottman & Levenson (1992). Den verifiserte 1992-studien (*Marital processes predictive of
later dissolution: Behavior, physiology, and health*, JPSP 63(2), 221–233) dokumenterer at
par-interaksjonsmønster forutsier senere oppbrytelse — den støtter **det generelle prinsippet**,
men er ikke primærkilde for bids/reparasjons-konstruktene. Single-item-skårer har lav
reliabilitet av seg selv — avveien må nevnes i metodeteksten (K.9).

### D.6 LIVSSITUASJON — vekt 0.10

| Felt | Faktisk implementasjon |
|---|---|
| Question files | **Ingen instrument-fil** — praktiske profilfelt: `wantChildren`, `children`, `smoking`, `lifestyle` (basic) + `preferences.livsstil2026` (bil, kosthold, klima, alkohol, aktivitet, arbeidsrytme, bosted, reiser, dyr, skjerm); religion = kun dealbreaker (PL-27: fjernet fra scoren) |
| Antall items | 4 + 10 livsstil-2026-felt (kategori-/velg-svar, ikke skala) |
| Svarskala | Kategorier (multi-valg); klima: 3-trinns ordinal |
| Reverse scoring | Ingen |
| Subskalaer | Ingen |
| Normalisering | Ingen |
| Vekting | 0.10 totalt: wantChildren 0.4, children 0.2, smoking 0.2, lifestyle 0.1 + livsstil-2026-itemvekt 0.04–0.06 (D-4: utelates hvis én part velger «ikke-viktig»); bonusfamilie +10 (PL-28); manglende data → hoppes over |
| Dealbreakers | Ja: barn ja-vs-nei (PL-11), livsstil-2026 «må stemme»-konflikt (D-4), radius (B1.4) |
| Matching use | `scoreLifeSituationCompat`: vektet Jaccard-overlapp (`categoryMatch`) + ordinal klima-skår; ingen data → 50 |
| Brukervisible | Dimensjonsord |
| Admin-visible | Numerisk + rejectReason-historikk |
| Source comments | PL-27 (religion), PL-28 (bonusfamilie), D-2/D-4 (LIVSSTIL-2026) |
| Test coverage | `dimensions-livsstil2026.test.ts`, `livsstil2026-dealbreaker.test.ts`, `religion-compat-dealbreaker.test.ts`, `radius-dealbreaker-b14.test.ts` |

**Klassifisering: PRACTICAL FILTER / PRODUCT COMPATIBILITY QUESTION — IKKE psykometrisk dimensjon.**
Påstanden «Livsvalg er en av de sterkeste prediktorene for relasjonsstabilitet i nyere parstudier
(2015–2024)» (B.9) har ingen funnet kilde → REMOVE eller toner ned med reell kilde. «(2015–2024)»
er en pseudopresis referanse som ikke peker på noe.


---

## E. CLAIM-BY-CLAIM AUDIT — /METODER

Statuslegender: KEEP · TONE DOWN · REWRITE · REMOVE · SOURCE REQUIRED · LEGAL/LICENS REVIEW ·
IMPLEMENTATION MISMATCH. «L» = linjeområde i `app/metoder/page.tsx`.

| ID | Eksakt påstand | L | Type | Kilde | Kilde-støtte | Implementasjons-støtte | Lisensrisiko | Wording-risiko | Status |
|----|----------------|---|------|-------|--------------|------------------------|--------------|----------------|--------|
| M-01 | «Tosom matcher på seks dimensjoner bygget på etablerte psykologiske modeller» | hero | Faglig | Big Five / tilknytning / Schwartz / ER-felt | PARTLY (4 av 6 har etablert teori; livssituasjon er produkt) | JA (6 dimensjoner i unifiedScorer) | – | Middels (livssituasjon er ikke «modell») | TONE DOWN («...psykologiske rammeverk og egne spørsmål») |
| M-02 | «Vi har ikke selv gjennomført studier — vi bygger på modeller som har vært gjennom tiår av testing og fortsatt brukes i moderne psykologi» | hero | Faglig | De tre rammeverkene | SUPPORTED for Big Five/tilknytning/Schwartz | JA | – | Lav | KEEP |
| M-03 | «Vi påstår ikke å 'vitenskapelig bevise' at to mennesker passer sammen. Det kan ingen plattform gjøre.» | §1 | Grense | – | – | – | – | – | KEEP (godt) |
| M-04 | «Det vi gjør, er å la etablerte, publiserte og moderne psykologiske modeller veilede hva vi spør om og hvordan vi vekter det» | §1 | Faglig | – | PARTLY (spørsmål er egne; vekting er ikke empirisk validert — «veilede» er forsvarlig) | DELVIS | – | Middels (antyder empirisk vekting) | TONE DOWN (tilføy: vektingene er en faglig vurdering, ikke en empirisk funn) |
| M-05 | «Resonansmålingen er en veiviser, ikke en fasit» | §1 | Grense | – | – | JA (I-12) | – | – | KEEP |
| M-06 | «Seks dimensjoner, hver med et etablert instrument bak seg» | §2 | Faglig | – | **UNSUPPORTED** (D.2–D.6: 4 av 6 = egne spørsmål; livssituasjon = ingen) | IMPLEMENTATION MISMATCH | – | Høy | **REWRITE** (K.3) |
| M-07 | «Schwartz la grunnlaget i 1992, og det holder fremdeles. Verditester er fortsatt i bruk i moderne forskning over hele verden» | §2 verdier | Faglig | Schwartz 1992 (verifisert DOI) + aktiv bruk av PVQ/SVS | SUPPORTED (med korrigert sitat, F.7) | DELVIS (egne items) | – | Lav | KEEP med korrigert kilde |
| M-08 | «Bowlby la til grunn det vi vet i dag, og moderne forskning (Fraley 2018 og nyere) fortsetter å bekrefte: hvordan vi knytter oss, former hvordan vi elsker» | §2 tilknytning | Faglig | Fraley 2018 (IKKE-VERIFISERBAR) | UNSUPPORTED som referert | DELVIS | – | Høy (død referanse + «fortsetter å bekrefte») | **REWRITE** (fjern Fraley 2018; bruk verifisert kilde eller fjern) |
| M-09 | «Big Five er i bruk i moderne parstudier» | §2 personlighet | Faglig | Big Five-litteraturen | SUPPORTED | DELVIS (tilpassede items) | – | Lav | KEEP |
| M-10 | «Forskningen er tydelig: personlighet alene sier mindre om et forhold enn verdier og tilknytning» | §2 personlighet | Faglig | Ingen spesifikk kilde | UNSUPPORTED (sammenligningsclaim) | – | – | Høy | **SOURCE REQUIRED / TONE DOWN** |
| M-11 | «Gottman observerte tusenvis av par over 40 år. Det han fant, holder» | §2 kommunikasjon | Faglig | Gottman Institute (Level E) + 1992-studie (verifisert) | PARTLY (tall = Instituttets egne siffer; «holder» = generalisering) | – | Varemerke (Instituttet) | Middels | TONE DOWN (f.eks. «over 40 års forskning på par — blant annet studien om hvordan par-interaksjon forutsier utfall (Gottman & Levenson 1992)») |
| M-12 | «Emosjonsregulering er ett av de mest aktive feltene i psykologien i dag (Gross 2015, Aldao 2010). Det sier litt om hvor viktig dette er» | §2 ER | Faglig | Gross 2015, Aldao 2010 (begge verifisert) | SUPPORTED (rankning mildt overdrevet) | – | – | Lav | KEEP/TONE DOWN (fjern «mest») |
| M-13 | «Livsvalg er en av de sterkeste prediktorene for relasjonsstabilitet i nyere parstudier (2015–2024)» | §2 livssituasjon | Faglig | Ingen kilde funnet | **UNSUPPORTED** | – | – | Høy (superlativ + pseudoreferanse) | **REMOVE** (eller SOURCE REQUIRED) |
| M-14 | «Modellene vi bygger på er ikke fra forrige lekegård… Et tre plantet riktig bærer i tiår» | §3 | Filosofi/ton | – | – | – | – | – | KEEP (metodisk ufarlig) |
| M-15 | «Vi har bare vasket støvet av, og lagt moderne referanser under hver dimensjon» | §3 | Ton | – | – | DELVIS (referansene er delvis feil — M-08, M-13) | – | Lav | KEEP (etter kilderetteringer) |
| M-16 | «Hver dimensjon støttes av et etablert instrument. Vi har ikke utviklet dem selv — vi bruker dem som de er ment å brukes, og er ærlige om der vi har gjort egne tilpasninger» | §4 innledning | Faglig | – | **UNSUPPORTED** (4 av 5 instrumentkort = egne items; livssituasjon har ingen kort) | IMPLEMENTATION MISMATCH | Høy (BFI-10/ERQ: kommersiell bruk) | Høy | **REWRITE + LEGAL REVIEW** (K.4) |

| ID | Eksakt påstand | L | Type | Kilde | Kilde-støtte | Implementasjons-støtte | Lisensrisiko | Wording-risiko | Status |
|----|----------------|---|------|-------|--------------|------------------------|--------------|----------------|--------|
| M-17 | «Kortform av Big Five — Rammstedt & John (2007), JRP 41(1)» + «I bruk i moderne studier (2010–2024)» | §4 | Instrument | Rammstedt & John 2007 (verifisert) | SUPPORTED (sitasen) | DELVIS (tilpassede items + endret skala, D.1) | **HØY** (kommerciell bruk krever tillatelse) | Middels | KEEP-sitasen + **LEGAL REVIEW** + presisér at items er tilpasset |
| M-18 | Notat: «Vår egen oversettelse — ikke den offisielle norske versjonen» (BFI-10) | §4 | Presisjon | – | Ingen kjent offisiell norsk BFI-10 (eng./tysk) | – | – | Middels | REWRITE («Våre egne tilpasninger til den engelske 10-items-kortformen») |
| M-19 | «Tilknytning (egne spørsmål) — Inspirert av Bowlby (1969), Ainsworth et al. (1978), Hazan & Shaver (1987), Fraley & Shaver (2000)» + «Våre egne items som strekker seg over aksene angst og unnvikelse» | §4 | Instrument | Alle fire reelle (tre verifisert) | SUPPORTED | JA (D.2) | Lav (egen tekst) | Lav (ærlig) | KEEP |
| M-20 | «Tilknytning — Fraley (2018) — tilknytning hos voksne, meta-analyser» | §4 | Kilde | Fraley 2018 (IKKE-VERIFISERBAR) | UNSUPPORTED | – | – | Høy | **REMOVE/REPLACE** |
| M-21 | «Verdier (PVQ-10) — Schwartz (1992), AESP 25» + «PVQ i bruk i moderne tverrkulturelle studier (2010–2024)» | §4 | Instrument | Schwartz 1992 AESP 25 (feil tittel, F.7) | PARTLY (feil sitat) | DELVIS (egne items, D.3) | **HØY** (navn «PVQ-10» + Schwartz-items) | Høy | **REWRITE + LEGAL REVIEW** |
| M-22 | «Emosjonsregulering (ERQ-6) — Gross & John (2003), JPSP 85(2)» + «Vår egen oversettelse» | §4 | Instrument | Gross & John 2003 (verifisert) | PARTLY (sitasen OK; «ERQ-6 … kortform» og «oversettelse» feil) | DELVIS (egne items, D.4) | **HØY** («ERQ-6» = Preece et al. 2023) | Høy | **REWRITE + LEGAL REVIEW** |
| M-23 | «Kommunikasjon — Prinsipper fra Gottman & Levenson (1992), JPSP 63(2)» + «Gottman Institute publisering 2000–2024» + «Våre egne items … vi bruker ikke Gottman Institute sine skjemaer» | §4 | Instrument | 1992 verifisert; Institutt = Level E | PARTLY (1992 er ikke primærkilde for bids/reparasjon) | JA (D.5) | Varemerke | Middels | TONE DOWN (presiser hva 1992 faktisk støtter; ikke presentere Instituttet som fagfellevurdert kilde) |
| M-24 | Kilder: Rammstedt & John 2007 (DOI) | §6 | Kilde | verifisert | SUPPORTED | – | – | – | KEEP |
| M-25 | Kilder: Bowlby 1969 (Scholar-søk-lenke) | §6 | Kilde | reell bok | SUPPORTED | – | – | – | KEEP; bytt lenke til forlengelse |
| M-26 | Kilder: Ainsworth et al. 1978 (Scholar-søk-lenke) | §6 | Kilde | reell bok | SUPPORTED | – | – | – | KEEP; bytt lenke |
| M-27 | Kilder: Hazan & Shaver 1987 (DOI) | §6 | Kilde | verifisert | SUPPORTED | – | – | – | KEEP |
| M-28 | Kilder: Fraley & Shaver 2000 (DOI) | §6 | Kilde | verifisert | SUPPORTED | – | – | – | KEEP |

| ID | Eksakt påstand | L | Type | Kilde | Kilde-støtte | Implementasjons-støtte | Lisensrisiko | Wording-risiko | Status |
|----|----------------|---|------|-------|--------------|------------------------|--------------|----------------|--------|
| M-29 | «Schwartz (1992). Domains of human values: Application and extension to four new countries. AESP 25» (Scholar-søk-lenke) | §6 | Kilde | **feil tittel/volum** (F.7) | UNSUPPORTED som referert | – | – | Høy | **REPLACE** (F.7) |
| M-30 | Kilder: Gross & John 2003 (DOI) | §6 | Kilde | verifisert | SUPPORTED | – | – | – | KEEP |
| M-31 | Kilder: Gottman & Levenson 1992 (DOI) | §6 | Kilde | verifisert | SUPPORTED | – | – | – | KEEP |
| M-32 | «Fraley (2018). The Adult Attachment Inventory. In: Adult Attachment: …» (Scholar-søk-lenke) | §6 | Kilde | **IKKE-VERIFISERBAR** | UNSUPPORTED | – | – | Høy | **REMOVE** (verifisert kandidat: Hudson & Fraley 2017, Personal Relationships 24(1), 17–26, DOI 10.1111/pere.12166 — verifisert denne runden; teamet velger) |
| M-33 | «Schwartz, Cieciuch, Vecchione, et al. (2012). Structure and levels of human values … AESP 47» (Scholar-søk-lenke) | §6 | Kilde | sannsynlig reell, **IKKE-VERIFISERT denne runden** (ikke indeksert i Crossref/OpenAlex) | PARTLY | – | – | Middels | SOURCE REQUIRED (forlengelsesside/DOI) eller fjern |
| M-34 | «Roberts, Neale, Roberts & Roberts (2016). Stability and change in personality across the life course. JPSP 109(3)» (Scholar-søk-lenke) | §6 | Kilde | **IKKE-VERIFISERBAR**; JPSP vol. 109 = 2015 (år/volum inkonsistent) | UNSUPPORTED | – | – | Høy | **REMOVE** (verifisert kandidat: Rammstedt & Roberts 2013, JPSP 104(2), 370–388, DOI 10.1037/a0024950 — verifisert via OpenAlex; teamet velger) |
| M-35 | Kilder: Aldao et al. 2010 (DOI) | §6 | Kilde | verifisert | SUPPORTED | – | – | – | KEEP |
| M-36 | Kilder: Gross 2015 (DOI) | §6 | Kilde | verifisert | SUPPORTED | – | – | – | KEEP |
| M-37 | «Gottman, Gottman & Levenson (2000–2024). The Gottman Institute — ongoing publications» (gottman.com) | §6 | Kilde | Organisasjonsside (Level E) | IKKE fagfellevurdert | – | Varemerke | Høy (motsier M-39) | **REWRITE** (fjern fra «fagfellevurdete»-listen) |
| M-38 | Kilder: Mikulincer & Shaver 2007, Guilford (Scholar-søk-lenke) | §6 | Kilde | reell bok (IKKE-VERIFISERT denne runden) | PARTLY | – | – | Lav | KEEP; bytt lenke til forlengelse |
| M-39 | «Alle kildene er publiserte, fagfellevurderte studier og bøker. Klikk på en kilde for å åpne den» | §6 | Metaklaim | – | **UNSANT** (M-37 + fire Scholar-søke-URLer) | – | – | Høy | **REWRITE** |
| M-40 | «Resonans er det som skjer når to rytmer møter hverandre i riktig takt …» (§5) | §5 | Merkevare | – | – | DELVIS (resonans = vekted komposittscore) | – | Middels | KEEP + merkebegreps-avklaring (K.7) |
| M-41 | «Vår resonansmåling er ikke en kjærlighetsdiagnose. Den er ikke en bedømmelse av verdi …» | §5 | Grense | – | – | JA | – | – | KEEP |
| M-42 | «Vi lover ikke at du får en match, eller at den du får blir til et langsiktig parforhold» | §7 | Grense | – | – | JA (F3) | – | – | KEEP |
| M-43 | «Vi lover ikke at scoringen er feilfri eller at den 'beviser' at to personer passer sammen» | §7 | Grense | – | – | JA | – | – | KEEP |
| M-44 | «Vi lover ikke at tersklene våre er ferdig kalibrert — de er fortsatt under etterprøving» | §7 | Grense | – | – | JA (resonanceLevel.ts) | – | – | KEEP |
| M-45 | «Vi lover at vi er ærlige om metoden, kildene og grensene for hva den kan» | §7 | Grense | – | – | DELVIS (gjelder ikke i dag; se røde poster) | – | – | KEEP (etter rettingene) |
| M-46 | CTA: «Svarene dine veileder matchingen — du bestemmer alltid selv hvem du går videre med» | CTA | Produkt | – | – | JA | – | Lav | KEEP |


---

## F. KILDEVERIFISERINGSTABELL

Nivå: A=original fagfellevurdert · B=offisiell instrument-/forskerside · C=review/meta · D=fagbok ·
E=sekundær formidling. **VERIF** = verifisert denne runden (Crossref/OpenAlex) eller IKKE-VERIF.

| # | Full sitatering (korrigert) | Nivå | Fagfellevurdert | Verifikasjon | Hva den STØTTER | Hva den IKKE støtter | Lisens/bruk |
|---|------------------------------|------|-----------------|--------------|-----------------|----------------------|-------------|
| F.1 | Rammstedt, T., & John, O. P. (2007). Measuring personality in one minute or less: A 10-item short version of the Big Five Inventory in English and German. *Journal of Research in Personality, 41*(1), 203–212. DOI 10.1016/j.jrp.2006.02.001 | A | Ja | **VERIF** | BFI-10 eksisterer; 10 items; engelsk+tysk; kortform for tidbegrensede studier | Kommersiell bruk av BFI-10; at norsk tilpasning er validert | BFI-10 = ikke-kommersiell forskning (F.12) |
| F.2 | Bowlby, J. (1969). *Attachment and Loss, Vol. 1: Attachment.* Basic Books. | D | Ja (bok) | Reell standardreferanse | Tilknytningsteori som rammeverk | Spesifikk måleskala | Fri (teori) |
| F.3 | Ainsworth, M. D. S., Blehar, M. C., Waters, E., & Wall, S. (1978). *Patterns of Attachment.* Lawrence Erlbaum. | A/D | Ja | Reell standardreferanse | Tilknytningsklassifikasjoner i barnehage | At 4-kategorisk voksenutledning (inkl. «fearful») er validert på Tosoms items | Fri (teori) |
| F.4 | Hazan, C., & Shaver, P. (1987). Romantic love conceptualized as an attachment process. *JPSP, 52*(3), 511–524. DOI 10.1037/0022-3514.52.3.511 | A | Ja | **VERIF** | Voksentransport av tilknytningsteori | Noen spesifikk måleskala | – |
| F.5 | Fraley, R. C., & Shaver, P. R. (2000). Adult romantic attachment: Theoretical developments, emerging controversies, and unanswered questions. *Review of General Psychology, 4*(2), 132–154. DOI 10.1037/1089-2680.4.2.132 | A/C | Ja | **VERIF** | Teoretisk rammeverk for voksenromantisk tilknytning | – | – |
| F.6 | Schwartz, S. H. (1992). Universals in the content and structure of values: Theoretical advances and empirical tests in 20 countries. I L. M. Berkowitz (red.), *Advances in Experimental Social Psychology, Vol. 25*, 1–65. DOI 10.1016/s0065-2601(08)60281-6 | A | Ja | **VERIF** | Schwartz' teori om grunnleggende verdier; 20-lands empiri | At «PVQ-10» eksisterer; at Tosoms items er validert | Teorien: fri; items: se F.11 |
| F.7 | Schwartz, S. H. (1994). Domains of human values: Application and extension to four new countries. *Advances in Experimental Social Psychology, Vol. 27*, 1–59. | A | Ja | **IKKE-VERIF online denne runden** (høy fagkonfidens; AESP-kapitler mangler i Crossref/OpenAlex) | 4-lands-extension av verditesten | – | Manual verifisering KREVES før publish |
| F.8 | Schwartz, S. H., Cieciuch, J., Vecchione, M., Caprara, G. V., Morosini, P. L., & Ronchi, V. (2012). Structure and levels of human values: Theory and applications across 20 countries. *Advances in Experimental Social Psychology, Vol. 47*, 59–98. | A | Ja | **IKKE-VERIF denne runden** (ikke indeksert; høy fagkonfidens) | Hierarkisk struktur av verdier; moderne bruk | – | Manual verifisering KREVES |
| F.9 | Wei, M., Russell, D. W., Mallinckrodt, B., & Vogel, D. L. (2007). The ECR-Short Form: Reliability, Validity, and Factor Structure. *Journal of Counseling Psychology, 51*(3), 368–379. DOI 10.1080/00223890701268041 | A | Ja | **VERIF** | At ECR-12 (12-item kortform) eksisterer og måler angst/unnvikelse | At Tosoms items er ECR-12 (de er ikke) | ECR-familien: gratis for ikke-kommersiell forskning — dokumentasjonsfeilen i FORSKNINGSMOTOR §4 må rettes |
| F.10 | Gross, J. J., & John, O. P. (2003). Individual differences in two emotion regulation processes. *JPSP, 85*(2), 348–362. DOI 10.1037/0022-3514.85.2.348 | A | Ja | **VERIF** | ERQ (10 items: 6R+4S); konstruktene kognitiv revurdering/ekspressiv undertrykking | At Tosoms 6 items er ERQ; kommersiell bruk | ERQ: forskning fri; kommersiell = usikker/tillatelse |
| F.11 | Preece, D. A., Petrova, K., Mehta, A., & Gross, J. J. (2023). Emotion Regulation Questionnaire—Short Form (PsycTESTS). DOI 10.1037/t90478-000 | A | (registrering) | **VERIF** | At «ERQ-6» som navn hører til Preece et al. 2023 | At Tosoms items = Preece et al. (de er ikke) | – |

| F.12 | GESIS Leibniz Institut, BFI/BFI-10-veiledning (offisiell side 404 ved innhenting) | B | – | **IKKE VERIF denne runden** — siteres etter oppdrag: laget for forskningssituasjoner med svært begrenset tid; ikke for individuell diagnostikk; ikke kommersielt | (ifølge GESIS) som venstre | – | **TILLATELSE KREVES for kommersiell bruk** — kontakt Rammstedt/John/GESIS |
| F.13 | Gottman, J. M., & Levenson, R. W. (1992). Marital processes predictive of later dissolution: Behavior, physiology, and health. *JPSP, 63*(2), 221–233. DOI 10.1037/0022-3514.63.2.221 | A | Ja | **VERIF** | Par-interaksjonsmønster forutsier senere oppbrytelse | «Bids»/«reparasjon» som navngitte konstrukt (senere i programmet/delene) | – |
| F.14 | Gottman Institute (2000–2024), gottman.com | E | Nei | Tilgjengelig denne runden (innhold trassert) | Instituttets beskrivelse av eget forskningsprogram | Noen fagfellevurdert påstand | Varemerke: Gottman Method® m.m. |
| F.15 | Aldao, A., Nolen-Hoeksema, S., & Schweizer, S. (2010). Emotion-regulation strategies across psychopathology: A meta-analytic review. *Clinical Psychology Review, 30*(2), 217–237. DOI 10.1016/j.cpr.2009.11.004 | C | Ja | **VERIF** | Meta-analyse av reguleringsstrategier og psykopatologi | At reappraisal alltid er bedre enn suppression i par | – |
| F.16 | Gross, J. J. (2015). Emotion regulation: Current status and future prospects. *Psychological Inquiry, 26*(1), 1–26. DOI 10.1080/1047840X.2014.940781 | C | Ja | **VERIF** | Feltets status; prosessmodellen | Rankning som «mest aktive felt» | – |
| F.17 | Finkel, E. J., Eastwick, P. W., Karney, B. R., Reis, H. T., & Sprecher, S. (2012). Online dating: A critical analysis from the perspective of psychological science. *Psychological Science in the Public Interest, 13*(1), 3–66. DOI 10.1177/1529100612436522 | C | Ja | **VERIF** | Oversikt digital dating: fordeler (tilgang/valg) og usikkerheter (selvpresentasjon, bedrag, overskudd) | «Færre valg = bedre forhold» som kausalt funn | – |
| F.18 | Pronk, T. M., & Denissen, J. J. A. (2020). A Rejection Mind-Set: Choice Overload in Online Dating. *Social Psychological and Personality Science, 11*(3), 388–396. DOI 10.1177/1948550619866189 | A | Ja | **VERIF** (inkl. abstract) | 3 studier: kontinuerlig tilgang til mange partnere → avvisningsmønstre; ~27 % lavere aksept fra første til siste alternativ | At funn gjelder alle kontekster/relasjonskvalitet | – |
| F.19 | Mikulincer, M., & Shaver, P. R. (Eds.). (2007). *Attachment in Adulthood: Structure, Dynamics, and Change.* Guilford Press. | D | Ja | Reell (IKKE online-verifisert denne runden) | Voksentilknytning som felt | – | – |
| F.20 | «Roberts et al. (2016), JPSP 109(3)» | – | – | **IKKE-VERIFISERBAR — sannsynligvis ikke-reell** | Ingen | – | REMOVE |
| F.21 | «Fraley (2018), The Adult Attachment Inventory, In: Adult Attachment: …» | – | – | **IKKE-VERIFISERBAR — sannsynligvis ikke-reell** | Ingen | – | REMOVE |
| F.22 | Rammstedt, T., & Roberts, B. W. (2013). Stability and change of personality across the life course. *JPSP, 104*(2), 370–388. DOI 10.1037/a0024950 | A | Ja | **VERIF** (OpenAlex) | (Kandidat-erstatning for F.20) personlighetsstabilitet over livsløpet | – | – |
| F.23 | Hudson, N. W., & Fraley, R. C. (2017). Adult attachment and perceptions of closeness. *Personal Relationships, 24*(1), 17–26. DOI 10.1111/pere.12166 | A | Ja | **VERIF** (Crossref) | (Kandidat-erstatning for F.21) voksenromantisk tilknytning | – | – |


---

## G. INSTRUMENT-/LISENSMATRISE

Klasser: CLEAR FOR COMMERCIAL USE · PERMISSION REQUIRED · NON-COMMERCIAL ONLY · UNCLEAR ·
DO NOT USE NAME/ITEMS UNTIL RESOLVED.

| Navn/ressurs | Opphavsrett | Faktisk bruk i Tosom | Kommersiell bruk | Modifisering/oversettelse | Tilskrivning | Skåring/item-reproduksjon | Klassifisering |
|--------------|-------------|----------------------|------------------|---------------------------|--------------|---------------------------|----------------|
| BFI-10 (Rammstedt & John 2007; GESIS) | Rammstedt/John (via GESIS) | Struktur + 10 tilpassede items (D.1), endret svarskala | **Ikke tillatt uten tillatelse** (GESIS: ikke-kommersielt) | Items er tilpasset — likevel avledet av verket | Kreves ved bruk | Skåring (gjennomsnitt 2/trekk) følger original | **PERMISSION REQUIRED** — eller omdøp til frittstående «Big Five-inspirerte spørsmål» (da: kun rammeverket er i bruk) |
| Big Five-rammeverket (teori) | Fritt (fagfellevurdert teori) | 5 akser som dimensjon | Tillaatt som teori | – | Anbefales | – | CLEAR (som teori, ikke som «BFI-10») |
| PVQ-10 (navnet) | – | **Navnet brukt offentlig** | – | – | – | – | **DO NOT USE THE NAME UNTIL RESOLVED** (ikke verifisert som instrument) |
| Schwartz' verdi-teori (10 grunnverdier) | Fritt (teori) | 8 verdier som kategorier | Tillaatt som teori | – | Anbefales (Schwartz 1992/2012) | – | CLEAR (som teori) |
| PVQ/SVS-items (Schwartz) | Schwartz | **Ikke brukt** (egne items) | n/a | n/a | – | – | UKJENT — verifiser hos Schwartz-repositoryet om det er ment å refereres til PVQ-items |
| ERQ (Gross & John 2003) | Gross/John | Konstruktene (R/S) via 6 egne parafraser; **navnet «ERQ-6» brukt offentlig** | Ikke verifisert — antas tillatelse | Parafraser — avledet | Anbefales | – | **PERMISSION REQUIRED / UNCLEAR** — navnet «ERQ-6» skal i så fall tilskrives Preece et al. (2023); Tosoms variant må omdøpes |
| ERQ-6 (Preece, Petrova, Mehta & Gross 2023) | Preece et al. | **Ikke brukt** (items samsvarer ikke) | n/a | n/a | – | – | **DO NOT USE THE NAME** (Tosom bruker ikke dette instrumentet) |
| ECR / ECR-S / ECR-12 (Hazan & Shaver 1987; Fraley m.fl.; Wei et al. 2007) | Forfatterne | **Ikke brukt** (egne items) — men omtalt feilaktig som «ECR-S» i intern dok | n/a | n/a | – | – | **DO NOT USE THE NAME** (ikke Tosoms items); rett FORSKNINGSMOTOR §4 |
| Gottman & Levenson (1992)-artikkelen | APA (copyright på artikkelen) | Sitert som kilde (fair use) | Sitat = ok | – | Ja | – | CLEAR (sitering) |
| Gottman-konstrukt (bids, reparasjon) | Forskningsprogram | Egne items inspirert av prinsippene | Ok som prinsipp | – | «Prinsipper fra Gottmans forskning» | – | CLEAR (ingen instrument-bruk) |
| Gottman Institute / Gottman Method® | Gottman Institute | **Ikke brukt** (Instituttet er kun siteret som kilde) | – | – | Instituttet skal ikke fremstilles som fagfellevurdert kilde | – | **LEGAL REVIEW** (varemerke + kildehierarki) |
| Chapek (Chapman) kjærlighetsspråk | – | (Step4Kjærlighetsspråk — produktspørsmål, utenfor /metoder-scope) | – | – | – | – | Ikke vurdert denne runden (scope: /metoder, /motpol) |
| «Resonans» | Tosom (eget begrep) | Merkebegrep for komposittscore | Eget | – | – | – | CLEAR som merke — men **må ikke** presenteres som et etablert psykologisk måleinstrument |


---

## H. PÅSTANDER SOM MÅ FJERNES UMMIDELBART (før launch)

1. «Seks dimensjoner, hver med et etablert instrument bak seg» (M-06) — usant.
2. «Vi har ikke utviklet dem selv — vi bruker dem som de er ment å brukes» (M-16) — usant og lisenskritisk.
3. Kilde «Roberts et al. (2016), JPSP 109(3)» (M-34) — ikke-reell referanse.
4. Kilde «Fraley (2018). The Adult Attachment Inventory …» (M-32) — ikke-reell referanse.
5. «Livsvalg er en av de sterkeste prediktorene for relasjonsstabilitet i nyere parstudier (2015–2024)» (M-13) — kildefri.
6. «Alle kildene er publiserte, fagfellevurderte studier og bøker» (M-39) — usant (Gottman Institute + Scholar-søk-lenker i samme liste).
7. Instrumentnavnet «PVQ-10» (M-21) — ikke verifisert instrument; erstatt med «egne verdispørsmål basert på Schwartz' teori om grunnleggende verdier».
8. Instrumentnavnet «ERQ-6, Gross & John (2003) … kortform» (M-22) — feil attribusjon; erstatt med «egne spørsmål inspirert av emosjonsreguleringsforskningen (Gross & John 2003)».
9. «Fraley (2018) — tilknytning hos voksne, meta-analyser» som «modern»-linje i tilknytning-kortet (M-20).
10. Gottman Institute-posten i «Kilder»-listen som fagfellevurdert kilde (M-37).

## I. PÅSTANDER SOM KAN BEHOLES (KEEP)

- «Vi har ikke selv gjennomført studier — vi bygger på etablerte psykologiske modeller» (M-02/M-19).
- «Vi påstår ikke å 'vitenskapelig bevise' at to mennesker passer sammen» (M-03).
- «Resonansmålingen er en veiviser, ikke en fasit» (M-05).
- «Resonans er ikke en kjærlighetsdiagnose … ikke en bedømmelse av verdi» (M-41).
- Hele «Hva vi ikke lover»-seksjonen (M-42–M-45), inkl. terskel-erkjennelsen.
- «Tilknytning (egne spørsmål)» med de fire rammeverksreferansene (M-19).
- «Våre egne items bygget på prinsippene — vi bruker ikke Gottman Institute sine skjemaer» (M-23).
- Alle verifiserte DOI-sitater: Rammstedt & John 2007, Gross & John 2003, Gottman & Levenson 1992,
  Hazan & Shaver 1987, Fraley & Shaver 2000, Aldao 2010, Gross 2015 (M-24–M-31, M-35, M-36).
- «Big Five er i bruk i moderne parstudier» (M-09).
- CTA: «Svarene dine veileder matchingen — du bestemmer alltid selv» (M-46).
- Alt på /motpol (se C — SAFE AS IS).

## J. PÅSTANDER SOM TRENGER MILDERE SPRÅK (TONE DOWN / REWRITE)

| ID | Fra | Til (retning, ikke ferdig copy) |
|----|-----|--------------------------------|
| J-1 (M-01) | «seks dimensjoner bygget på etablerte psykologiske modeller» | «seks områder — noen bygger på etablerte psykologiske rammeverk, andre på egne spørsmål og praktiske preferanser utviklet for Tosoms matching» |
| J-2 (M-04) | «…veilede hva vi spør om og hvordan vi vekter det» | tilføy: «vektene er en faglig vurdering av hva vi vet, ikke et empirisk funn fra våre egne data» |
| J-3 (M-11) | «Gottman observerte tusenvis av par over 40 år. Det han fant, holder» | «Gottmans forskningsprogram har i over 40 år studert par i stor skala (Instituttets egen omtale). Blant de verifiserte funnene: at hvordan par snakker med hverandre forutsier om forholdet holder (Gottman & Levenson, 1992)» |
| J-4 (M-12) | «ett av de mest aktive feltene i psykologien i dag» | «et aktivt forskningsfelt (Gross 2015; Aldao et al. 2010)» |
| J-5 (M-10) | «Forskningen er tydelig: personlighet alene sier mindre … enn verdier og tilknytning» | finn spesifikk kilde eller: «Forskningen antyder at tilknytning og verdier henger tettere sammen med relasjonskvalitet enn personlighet alene — vi vekter derfor dem tyngst» |
| J-6 (M-08) | «moderne forskning (Fraley 2018 og nyere) fortsetter å bekrefte» | «hva vi vet om voksenromantisk tilknytning bygger på 40+ års forskning (Bowlby; Hazan & Shaver 1987; Fraley & Shaver 2000)» |
| J-7 (M-13) | «Livsvalg er en av de sterkeste prediktorene … (2015–2024)» | «praktiske livsvalg — barn, avstand, hverdagsrytme — setter rammen for om et forhold fungerer daglig; derfor stiller vi dem som egne spørsmål, ikke som psykologisk test» (evt. + reell kilde hvis funnet) |
| J-8 (M-18/21/22) | «Vår egen oversettelse — ikke den offisielle norske versjonen» | per område: BFI → «våre egne tilpasninger til den engelske 10-items-kortformen»; verdier → «egne spørsmål inspirert av Schwartz-verdiene»; ER → «egne spørsmål inspirert av ERQ-konstruktene» |
| J-9 (M-39) | «Alle kildene er publiserte, fagfellevurderte studier og bøker» | «Kildene er fagfellevurderte studier og fagbøker; for Gottman refererer vi i tillegg til Instituttets egen omtale av forskningsprogrammet» |
| J-10 (K.7) | resonans-seksjonen | tilføy: «Resonans er Tosoms eget navn på den samlede matchvurderingen — et merkebegrep, ikke et etablert psykologisk instrument eller en klinisk skår» |


---

## K. FORSLAG TIL NY /METODER-ARKITEKTUR (ikke implementert)

Mål: faglig, lesbar, ærlig, presis, ikke defensiv, ikke pseudo-akademisk. Beholde eksisterende
designsystem, GlassCard-oppsett og «Hva vi ikke lover»-seksjonen.

1. **Hva Tosom faktisk gjør** — én avsnitts intro: vi spør om selvrapporterte svar, regner ut
   skårer per område, og kombinerer dem i én matchvurdering. Vi har ikke gjennomført egne studier;
   vi bygger på etablerte rammeverk og egne spørsmål. (Fjerner «instrument per dimensjon»-rammen.)
2. **Seks områder, ikke seks instrumenter** — tittelendring; innledningen J-1. Hvert kort
   beholder «why», men «modern»-linjene erstatte med presise, kildeførte én-linjsere (se E).
3. **Rammeverk vi er inspirert av** (teori ≠ instrument): Big Five (personlighet), tilknytningsteori
   (Bowlby/Ainsworth/Hazan & Shaver), Schwartz' teori om grunnleggende verdier,
   emosjonsreguleringsforskning (Gross), Gottmans forskning på par (prinsipper: reparasjon,
   invitasjoner til kontakt, konfliktstil — med konkret kilde per prinsipp, ikke «Instituttet»).
4. **Spørsmålene Tosom faktisk stiller** — transparent per område: «10 spørsmål i stil med
   BFI-10-kortformen (Rammstedt & John 2007), tilpasset til norsk av oss», «12 egne spørsmål over
   tilknytningsangst og -unnvikelse», «10 egne verdispørsmål basert på Schwartz-verdiene»,
   «6 egne spørsmål inspirert av Gottmans prinsipper», «6 egne spørsmål om kognitiv revurdering og
   ekspressiv undertrykking (Gross & John 2003)», «praktiske preferanser (barn, røyking,
   hverdagsvalg) — ingen test her».
5. **Hvordan svarene brukes** — svarskalaen («Passer ikke … Passer helt»), gjennomsnittskåring,
   at manglende svar behandles nøytralt, vektene (0.25/0.25/0.15/0.15/0.10/0.10) presentert som
   «en faglig vurdering, ikke et empirisk funn», og at dealbreakers alltid overstyrer score.
6. **Dealbreakers vs skåring** — kort egen seksjon: hva som automatisk utelukker (barn ja/nei,
   avstand, religion-akseptliste m.m.) vs hva som gir en score.
7. **Hva «resonans» er** — merkebegreps-avklaring (J-10) + behold eksisterende grensespråk
   (ikke diagnose, ikke bedømmelse, veiviser).
8. **Hva som er egenutviklet** — eksplicit liste: alle spørsmålsformuleringene, vektingen,
   kompatibilitetsreglene, tersklene, resonansbegrepet. (Dette er stolt, ikke defensivt.)
9. **Psykometriske begrensninger** — kort, i vanlig norsk: vi har ikke målt reliabilitet,
   validitet eller faktorstruktur på våre spørsmål i vår brukergruppe; BFI-10-tilpasningen og
   endret svarskala har ikke blitt validert; single-item-skårer for kommunikasjon er en avveining;
   tersklene er ikke kalibrert. «Vi er ærlige om dette fordi det er det faglige grunnlaget for å
   stole på resten.»
10. **Ingen diagnose** — selvrapporterte mønstre/preferanser/tendenser, ikke klinisk vurdering,
    ikke tilknytningskategori, ikke personlighetsdom (Tosom viser aldri brukeren en
    tilknytningskategori — presiser dette).
11. **Ingen kjærlighetsprediksjon** — behold/utdyp eksisterende «Hva vi ikke lover».
12. **Kilder** — kun verifiserte primærkilder med DOI/forlengelsesside + evt. separat, klart
    merket linje for «Instituttets egen omtale». Ingen Scholar-søke-lenker.
13. **Versjon og endringsdato** — metodeversjon (f.eks. `INSTRUMENT_SET_VERSION`) + dato for
    sist faglig gjennomgang.
14. **Kontakt for faglige spørsmål** — e-postadresse for faglig feedback.


---

## L. FORSLAG TIL ÉN VALGFRI FORSKNINGSBLOKK PÅ /MOTPOL (kandidat-copy, ikke implementert)

Plassering: seksjon 3 «Mer er ikke alltid mer», som siste paragraf. Struktur:
BENEFITS → LIMITATIONS → TOSOM PRODUCT CHOICE (krav §22: balansert, ikke selektiv).

> Flere muligheter kan være en reell fordel: digital dating gir tilgang til potensielle
> partnere som ellers ville vært utilgjengelige (Finkel et al., 2012). Samtidig tyder enkelte
> studier på at omfattende parallell sammenligning kan gjøre oss mer avvisende, og mindre
> villige til å investere i én kandidat — i én undersøkelse falt villigheten til å akseptere
> stadig nye partneralternativer gjennom valgsekvensen (Pronk & Denissen, 2020). Tosom har
> derfor valgt å begrense antallet parallelle valg. Det er et produktvalg — ikke en påstand
> om at én modell passer alle.

**Kildedetaljer (verifisert denne runden):**
- Finkel, Eastwick, Karney, Reis & Sprecher (2012), PSPPI 13(1), 3–66, DOI 10.1177/1529100612436522 —
  review/oversikt (C): beskriver **både** fordeler (økende tilgang og valgmuligheter — sentralt
  i artikkelen) og begrensninger (selvpresentasjon, inntrykkstyring, bedragsrisiko, valglaster).
  Brukes her til BENEFITS-sidens balanse.
- Pronk & Denissen (2020), SPPS 11(3), 388–396, DOI 10.1177/1948550619866189 — 3 studier
  (hypotetiske og reelle partner-urderinger i online-kontekst): avvisningsmønster med kontinuerlig
  tilgang til mange alternativer; ~27 % reduksjon i aksept fra første til siste partneralternativ;
  forklart via lavere tilfredshet med bilder og opplevd dating-suksess; for kvinner også lavere
  match-sjans. **Kan generaliseres:** at kontinuerlig tilgang til mange alternativer øker
  avvisningsatferd i online-kontekst. **Kan IKKE generaliseres:** at færre valg gir bedre
  forhold, eller at effekten gjelder andre kontekster eller relasjonskvalitet.
- **Må aldri skrives:** «Forskning viser at færre valg gir bedre forhold» (uforsvarlig — se §21).

## M. ARGUMENTER FOR OG MOT FORSKNING PÅ /MOTPOL

**For:**
1. Styrker tillit og faglig troverdighet — spesielt når /metoder-ets kildeseksjon er korrekt.
2. Differensierer fra andre tjenester med en konkret, balansert begrunnelse for «én match».
3. Dever to verifiserte, fagfellevurderte kildene (Finkel 2012; Pronk & Denissen 2020) er til stede.
4. Et kort, nøyaktig block er lavt risiko hvis EF-disiplinen (PF/PH/OB/MC/EF/RC) opprettholdes.

**Mot:**
1. /motpol er en filosofi-/merkeside — forskning kan forvrenge tonen (MOT-09-kjøringen ga bevisst
   zero EF/RC; å bryte det er et bevisst valg, ikke en retting).
2. Risikoen for feilaktig sitat/miskjennet generalisering er høyere på en side uten faglig
   struktur (ingen kildeliste, ingen metodetilleggsdel).
3. Forskning hører hjemme på /metoder — en dedikert side med kildehierarki og begrensninger.
4. «Selektiv forskningsmarkedsføring»-risikoen: å velge forskning som bare støtter én
   produktbeslutning (én match) uten å vise fordeler med mange valg, undergraver tilliten.

**Anbefaling:** LA DET VÆRE VALGFRI. Hvis det legges til: bruk L-blokk nøyaktig (balansert
BENEFITS/LIMITATIONS/PRODUCT CHOICE), med de to kildene i full form i /metoder-kilder.
Uten L-blokk: /motpol kan lanseres uendret (C: SAFE AS IS).


---

## N. EGEN VALIDASJONSROADMAP (kun plan — ingen forskning nå, ingen nye personopplysninger)

**Fase 0 — Straks (ingen datainnsamling):**
1. Item-provenans-register: per item (id, tekst, kilde, klassifisering, tillatelsesstatus,
   oversettelse/adaptasjon, versjon). Grunnlag: denne rapportens D.1–D.6 + G.
2. Versjonering: `INSTRUMENT_SET_VERSION` finnes allerede («2026-08-22.v1») — viderefør;
   dokumenter endringshistorikk per itemssett.
3. Ekspertgjennomgang av items + metodetekst (O) før launch.
4. Dokumenter beslutningsgrunnlag for vekter og terskler (FORSKNINGSMOTOR §7/§8) — faglig,
   ikke «magiske tall».

**Fase 1 — Etter launch, kun på eksisterende samtykkede data (de-identifisert/ aggregert):**
5. Fordelingsanalyse av de 44 items og 6 dimensjonsscorene (mangelfrekvens, variasjon,
   midtnormalisering).
6. Intern konsistens (Cronbach's α) per subskala (BFI 2 items/trekk; angst/unnvikelse 6 items;
   verdier 1–3 items; ER 3 items; kommunikasjon single-item — forventet lav, dokumenter).
7. Terskelkalibrering: resonansnivå (80/65/50 — allerede logget via `match.round.score_median`)
   og tilknytningsterskelen 3.0 (sensitivitet: hvordan endres stil-fordelingen).
8. Sensitivitetsanalyse for vekter (0.25/0.25/0.15/0.15/0.10/0.10).
9. Fairness/subgroup-oversikt: score-fordeling per kjønn/aldersgruppe (profildata finnes
   allerede); dokumenter om matchfordelingen er urimelig skjev.
10. Evaluering av «manglende svar → 3 → secure»-biaseffekten for tilknytning (D.2).

**Fase 2 — Prospektivt (krever nytt samtykke/etikk, planlegges først):**
11. Test-retest-reliabilitet (stabilitet over uker) for itemssettet.
12. Faktorstruktur (CFA/EFA) for de 44 items i Tosoms brukergruppe; måleinvarians per
    kjønn/aldersgruppe.
13. Diskriminantvaliditet (forskjell mellom akser) og konstruktvaliditet (korrelasjon med
    kjente kriterier, f.eks. etablerte kortsjema ved samtykket).
14. Kognitiv brukertesting: forstår brukerne «Passer ikke … Passer helt»-skalaen like
    (særlig for BFI-tilpasningene, se D.1 bfi10).
15. Prediktiv validitet: brukeropplevd match-relevans → reell relasjonsdanning →
    oppbrytelse; kalibrering av resonansnivå mot opplevd kvalitet.

**Fase 3 — Langsiktig:**
16. Langtidsstudie av matchutfall (med samtykke), safety outcomes (rapportering/blokkering
    korrelat med matchkvalitet), dropout-analyse.
17. Publikasjons-/registreringsplan (pre-registration, open science) for å bygge uavhengig
    faglig legitimitet.

**Prinsipp:** Ingen nye personopplysninger i fase 0–1; all analyse innen eksisterende
samtykkescop; personvern-jurist (O) godkjenner hver fase før start.

## O. FAGLIG REVIEWER-PROFIL ( før offentlig launch )

| Rolle | Hvorfor | Fokus |
|-------|---------|-------|
| Psykolog (PhD) med psykometrisk kompetanse | Skalae-endring, single-item-skårer, terskler, begrensningstekst | D.1–D.6, K.9, J-8 |
| Forsker innen personlighet-/relasjonsforskning | Teoretisk rammeverk, kildekorrekthet, what-the-literature-actually-supports | E, F, J-3/J-5/J-6 |
| Personvern-jurist | Profiling under GDPR, rett til forklaring (Art. 22/14/15), data-minimalisering i matchscoring | N, dealbreaker-logging |
| Ekspert på test-/instrumentlisensiering | BFI-10 (GESIS/Rammstedt/John), ERQ (Gross), Schwartz-items/teori, Gottman-varemerke | G, H.7/H.8 |

(Ingen konkrete personer oppgitt — rekruttering via universitetsmiljøer og fagforeninger.)


---

## P. ANBEFALT IMPLEMENTERINGSREKKERØLDE (neste ACT)

1. **P2-A — Copy-retting /metoder (H-listen, uavhengig av lisens):** fjern/erstatt M-06, M-16,
   M-13, M-20, M-29, M-32, M-34, M-37, M-39; omdøp «PVQ-10»→«egne verdispørsmål (Schwartz)»,
   «ERQ-6»→«egne spørsmål (Gross & John 2003-konstruktene)»; presiser BFI-kortet («egen
   tilpasning til 10-items-kortformen»); merk «resonans» som merkebegrep.
2. **P2-B — Manuell kildeverifisering (F.7, F.8, F.19, GESIS F.12):** få forlengelsesside/DOI
   for Schwartz 1994 (AESP 27) og Schwartz et al. 2012 (AESP 47); verifiser GESIS BFI-side på
   nytt; beslutt endelig kildeliste (kun A/B/C/D-nivå + klart merket E for Gottman Institute).
3. **P2-C — Lisensgjennomgang (G):** kontakt/forespørsel: BFI-10 kommerciell tillatelse
   (GESIS/Rammstedt/John) — alternativt omdøp til frittstående Big Five-inspirerte spørsmål;
   Schwartz-repository for verdi-items/teori-navn; ERQ-navn (unngå «ERQ-6»); Gottman-varemerke
   (bekreft ingen metode-navn brukes). Dokumentér svar i repo (untracked).
4. **P2-D — Retter intern dokumentasjon:** FORSKNINGSMOTOR §4 (ECR-S→egne items; «PVQ-10»-navn;
   ERQ-6-kommentar; «fritt tilgjengelig»-lisenscellene).
5. **P2-E — Ekspertgjennomgang (O):** to runder (psykometri + relasjonsforskning) av den
   omskrevne /metoder; personvern-jurist på N/profilering; lisens-ekspert på P2-C.
6. **P2-F — (Valgfri) L-blokk på /motpol** med balansert struktur (M-anbefaling).
7. **P2-G — Launch-gate (Q):** /metoder må være SAFE WITH COPY CHANGES + LICENSE RESOLVED +
   EXPERT REVIEW DONE. /motpol: SAFE AS IS (uavhengig).
8. **P2-H — Post-launch:** N-fase 1 (kun eksisterende data); oppdater
   `docs/LanseringsCheckList.md` først NÅR audit-resultatet er godkjent (per oppdrag §30).

## Q. KLASIFISERING (SAFE AS IS / SAFE WITH COPY CHANGES / …)

| Enhet | Klassifisering |
|-------|----------------|
| /metoder (i dag) | **REMOVE-before-launch-poster (10, H) + REQUIRES LICENSE REVIEW + REQUIRES EXPERT REVIEW** → ikke SAFE AS IS |
| /metoder (etter P2-A+B+E) | **SAFE WITH COPY CHANGES** (mottatt) |
| BFI-10-bruk (items + navn) | **REQUIRES LICENSE REVIEW** (kommerciell bruk); navn «BFI-10»: DO NOT USE UNTIL RESOLVED |
| «PVQ-10»-navn | **DO NOT USE UNTIL RESOLVED** (H.7) |
| «ERQ-6, Gross & John 2003»-navn | **DO NOT USE UNTIL RESOLVED** (H.8) |
| «ECR-S»-navn (intern dok) | **DO NOT USE** (feilaktig; rett i FORSKNINGSMOTOR §4) |
| Roberts 2016 / Fraley 2018-sitater | **REMOVE BEFORE LAUNCH** (H.3, H.4) |
| «Alle kildene er fagfellevurdete» | **REMOVE/REWRITE BEFORE LAUNCH** (H.6) |
| «Livsvalg … (2015–2024)» | **REMOVE BEFORE LAUNCH** (H.5) |
| /motpol | **SAFE AS IS** (L-blokk = SAFE WITH COPY CHANGES, valgfri) |
| Tilknytningskategorisering (intern) | **REQUIRES EXPERT REVIEW** (uvalidert terskel + missing→secure-bias; ikke brukervist i dag) |
| Livssituasjon-dimensjon | SAFE (produktdata) — men **ikke** presentere som psykologisk instrument (H.5, J-7) |
| Resonansbegrep | SAFE WITH COPY CHANGES (merkebegreps-avklaring, J-10) |

---

## VERDIFISERINGS-APPENDIX (metode og begrensninger)

**Verifisert via Crossref (DOI-resolving) denne runden:** F.1, F.4, F.5, F.6, F.9, F.10, F.11,
F.13, F.15, F.16, F.17, F.18, F.22, F.23.
**Verifisert via OpenAlex:** F.22 (Rammstedt & Roberts 2013).
**IKKE-VERIFISERBAR (REMOVE/REPLACE):** F.20 (Roberts 2016), F.21 (Fraley 2018).
**IKKE-VERIFISERT denne runden (manual verifisering KREVES før publish):** F.7 (Schwartz 1994
AESP 27), F.8 (Schwartz et al. 2012 AESP 47), F.19 (Mikulincer & Shaver 2007), F.12 (GESIS BFI-side,
404 ved innhenting — siteres etter oppdrag), F.2/F.3 (Bowlby 1969/Ainsworth 1978 — standard
referanser, ikke online-verifisert).
**Begrensninger:** GESIS, swartzvalues.com og OSF var ikke tilgjengelig under denne runden
(403/404/fetch-feil); søkemotorer blokkerte bot (CAPTCHA). Alle «IKKE-VERIF»-poster i F må
manuelt bekreftes (browser/forlengelsesside) før de brukes i offentlig copy — unntatt F.20/F.21
som skal fjernes uavhengig av dette.

**Kodeendringer ved denne audit:** Ingen. **Commit/push/deploy:** Ingen.

---

## R. ACT F1 — OPPDATERING 24.10.2026 (PUBLISERT COPY RETTING, /METODER KUN)

**Scope:** `app/metoder/page.tsx` + ny `__tests__/metoder.test.tsx`. IKKE endret: onboarding-items,
BFI-items, matchingmotor, score, weights, dealbreakers, religion, høyde, /motpol, Vipps/betaling,
samtykke, database/Prisma, dependencies.

### F1.1 — Hva som faktisk ble rettet (copy)
1. **Overordnet feilpåstand fjernet (H.1/M-06):** «Seks dimensjoner, hver med et etablert
   instrument bak seg» → «Seks områder. Noen bygger på etablerte psykologiske rammeverk,
   andre består av egne spørsmål og praktiske preferanser.» Hero-copy omskrevet i samme retning.
2. **«Vi bruker dem som de er ment å brukes» fjernet (H.2/M-16):** introen til
   «Spørsmålene vi stiller»-seksjonen omskrevet med eksplisite overganger
   («Nå er ærligheten: ikke alle delene er publiserte instrumenter …»).
3. **Ny seksjon «Hva modellen kan hjelpe med — og hva den ikke kan vite»**
   (tvelyttet KAN/KAN IKKE VITE + eksplisitte paragrafer om fysisk tiltrekning,
   ikke-klinisk tjeneste og psykometrisk avgrensning).
4. **«Resonans» presisert som merkebegrep** («Tosoms navn på den samlede matchvurderingen —
   et merkebegrep, ikke et etablert psykologisk instrument eller en klinisk skår»).
   Eksisterende grensespråk (ikke kjærlighetsdiagnose/bedømmelse, veiviser) beholdt.
5. **«Hva vi ikke lover» styrket:** + «ikke en diagnostisk tjeneste» + «legger ikke kropp,
   utseende eller livsstil til grunn for å vurdere attraktivitet».
6. **Alle seks «modern»-linjene i DIMENSIONS-kortene** omskrevet mot verifiserte kilder
   (Fraley 2018, «Gottman observerte tusenvis av par», «Forskningen er tydelig»,
   «strekkeste prediktor (2015–2024)» og «mest aktive feltene» er alle fjernet).

### F1.2 — Instrumentnavn fjernet/endret
- **«PVQ-10» → fjernet** (området: «Egne spørsmål inspirert av forskningen til Schwartz … (1992)»
  + «Ikke et publisert standardisert verdisjema»).
- **«ERQ-6 (Gross & John 2003)» → fjernet** («Egne spørsmål inspirert av
  emosjonsreguleringsforskningen (Gross & John 2003)» + «Ikke et publisert regulerings-skjema»).
- **«Kortform av Big Five / vår egen oversettelse» →** «10 spørsmål i stil med BFI-10-kortformen
  (Rammstedt & John 2007), tilpasset til norsk av oss» + eksplisitte overganger (tilpassede
  tekster, endret svarskala, ikke selvstendig validert).
- **«Tilknytning … inspirert av Bowlby/Ainsworth» →** «Egne spørsmål inspirert av forskning på
  voksen tilknytning — dimensjonene tilknytningsangst og tilknytningsunnvikelse» + «Ikke et
  publisert tilknytnings-skjema … ikke en diagnose eller en klinisk tilknytningskategori».
- **«Gottman Institute publisering 2000–2024» → fjernet** (Gottman refereres kun via
  Gottman & Levenson 1992, verifisert primærpublikasjon).
- **NY kort for «Livssituasjon»:** praktiske preferanser (barn, avstand, røyking, livsrytme);
  noen svar = harde grenser (dealbreakers); ikke et psykologisk instrument.
### F1.3 — Claims fjernet (implementert i copy)
M-06, M-16 (H.1/H.2) · M-13 «Livsvalg er en av de sterkeste prediktorene … (2015–2024)» (H.5) ·
M-20 «Fraley (2018)»-linjer · «PVQ i bruk i moderne tverrkulturelle studier (2010–2024)» ·
«I bruk i moderne studier (2010–2024)» · «Gottman observerte tusenvis av par over 40 år. Det han
fant, holder» (J-3) · «Forskningen er tydelig: personlighet alene sier mindre …» (J-5) ·
«Ett av de mest aktive feltene i psykologien i dag» (J-4) · «Alle kildene er publiserte,
fagfellevurderte studier og bøker» (H.6/M-39) · «Gottman Institute — ongoing publications 2000–2024» (H.10).

### F1.4 — Kilder fjernet
Fraley 2018 (F.21 — ikke-reell) · Roberts et al. 2016 (F.20 — ikke-reell) · Schwartz et al. 2012
AESP 47 (F.8 — IKKE-VERIFisert) · Mikulincer & Shaver 2007 (F.19 — IKKE-VERIFisert) ·
Bowlby 1969 + Ainsworth 1978 (F.2/F.3 — ingen primærlenke; beholdes kun som teorinævn) ·
Gottman Institute-forside (Level E, F.14) · alle Google Scholar-søke-URLer.

### F1.5 — Kilder beholdt (alle 8 verifisert via Crossref/DOI)
| # | Kilde | DOI | Verifisert |
|---|-------|-----|------------|
| 1 | Hazan & Shaver 1987, JPSP 52(3), 511–519 | 10.1037/0022-3514.52.3.511 | audit F.9 (Crossref) |
| 2 | Gottman & Levenson 1992, JPSP 63(2), 221–233 | 10.1037/0022-3514.63.2.221 | audit F.13 (Crossref) |
| 3 | Schwartz 1992, AESP 25, 1–65 («Universals in the content and structure of values …») | 10.1016/S0065-2601(08)60281-6 | **re-verifisert ACT F1 (Crossref, 24.10.2026)** — erstatter feilsiterte «Domains of human values … AESP 25» (det er et 1994-kapittel i AESP 27; F.7) |
| 4 | Fraley & Shaver 2000, RGP 4(2), 132–158 | 10.1037/1089-2680.4.2.132 | audit F.10 (Crossref) |
| 5 | Gross & John 2003, JPSP 85(2), 348–362 | 10.1037/0022-3514.85.2.348 | audit F.5 (Crossref) |
| 6 | Rammstedt & John 2007, JRP 41(1), 203–212 | 10.1016/j.jrp.2006.02.001 | audit F.1 + **re-verifisert ACT F1 (s. 203–212)** |
| 7 | Aldao et al. 2010, CPR 30(2), 217–237 | 10.1016/j.cpr.2009.11.004 | audit F.15 (Crossref) |
| 8 | Gross 2015, Psych Inquiry 26(1), 1–26 | 10.1080/1047840X.2014.940781 | audit F.16 (Crossref) |

### F1.6 — Tester (ny: `__tests__/metoder.test.tsx`, 35 tester, renderToStaticMarkup)
SCI-01 ingen «seks dimensjoner, hver med etablert instrument» · SCI-02 ingen «som de er ment å
brukes» · SCI-03 ingen PVQ/PVQ-10 som navn på egne items · SCI-04 ingen ERQ/ERQ-6 (Gross & John
kun som inspirasjon) · SCI-05 ingen ECR/ECR-12; tilknytning = egne spørsmål, ingen klinisk
kategori · SCI-06 ingen gottman.com / Institute som fagfellevurdert kilde · SCI-07 ingen
«livsvalg sterkeste prediktor (2015–2024)» · SCI-08 eksplisitt «ikke klinisk diagnostikk» ·
SCI-09 fysisk tiltrekning eksplisitt IKKE beregnet/inngår ikke i matchskåren · SCI-10 resonans =
merkebegrep, ikke etablert instrument · SCI-11 alle eksterne hrefs ∈ {8 DOIs over}; ingen
scholar.google.com · SCI-12 ingen ny research claim uten godkjent kilde (Fraley 2018, Roberts
2016, tidsvindu-claims 2010–2024/2000–2024, «alle kilder fagfellevurdete», autoritets-claims).
+ F1-tests: BFI-10 som tilpasning (ikke validert instrument), psykometrisk avgrensning,
kropp/livsstil-avgrensning (F1 §12), kilder-intro («dokumenterer teoriene … ikke Tosoms egen
matchingmodell»), ærlighetsprinsipper beholdt.

### F1.7 — Gjenværende risiko (IKKE løst av ACT F1)
- **BFI-10 COMMERCIAL USE: UNRESOLVED — LAUNCH GATE.** Items er tilpasninger av BFI-10; GESIS-
  informasjon = ikke-kommersielt forskning kun (offisiell side 404 under audit — F.12, re-
  verifisering kreves). ACT F1 løser IKKE lisensen ved omdøping/toning ned (F1 §22:
  «Renaming ≠ licensing resolution»). Krever skriftlig tillatelse fra Rammstedt/John/GESIS som
  dekker Tosoms faktiske (kommersielle) bruk, eller en dokumentert beslutning om å behandle
  spørsmålene som et fullstendig uavhengig itemssett med BFI-10 nevnt kun som stil — separat ACT.
- **EXPERT REVIEW: OPEN** (profiler i audit O).
- **F.7 (Schwartz 1994, AESP 27, «Domains … four new countries»)** forblir IKKE-VERIFisert — men
  brukes ikke lenger i offentlig copy (1992-kapitlet er nå korrekt sitert og re-verifisert).
- **FORSKNINGSMOTOR §4** (interne ECR-S/PVQ-10/ERQ-6-navn) er IKKE rettet i ACT F1 — P2-D står.
- **L-blokk (Finkel/Pronk) på /motpol:** IKKE lagt til (F1 §21 — OPTIONAL LATER IMPROVEMENT).
- **/motpol:** URØRT (SAFE AS IS, audit C).

---

## S. F1.5 — PERSONALITY / BFI RESOLUTION (PLAN, 24.10.2026)

**Status:** PLAN MODE — read-only analyse. Ingen kode endret. F1-copy ligger urørt i
arbeidsområdet (ikke committet). Denne seksjonen er beslutningsgrunnlaget for
BFI-10 launch-gate.

### S.1 — Konklusjon (kort)
Tosom bruker **ikke** BFI-10 uendret, men en **CLOSE ADAPTATION**: identisk struktur
(10 items, 2/trekk, samme reverserte item på samme posisjon), 6 av 10 items
near-verbatim oversettelser, 3 close adaptations, 1 konstruktendring. Svarskala,
anvendelse (kommeriell, individuell matching) og minst én formulering avviker fra det
dokumenterte bruksområdet (ikke-kommersiell forskning, ikke individuell bruk).
**Anbefaling: B — REPLACE med genuint selvstendig Big Five-inspirert itemssett før
launch** (implementasjonsplan S.7.4). **C** (fjerne personlighet) er dokumentert
contingency (S.8). **A** (søke tillatelse) er usikkert og tidkrevende — ikke
launch-kritisk pålitelig alene. **GO/NO-GO: dagens personlighetssystem = NO-GO for
offentlig lansering inntil B (eller C) er levert.** (S.14)

### S.2 — ITEM-PROVENANCE-MATRISE (alle 10 aktive personlighetsspørsmål)

Aktive items: `lib/psychometrics/instruments.ts` (BFI10, bfi1–bfi10) → presentert i
`app/onboarding/steps/Step2Personlighet.tsx` via `ScaleQuestion` (påkrevd svar, PL-08b).
Originaltekstene er Rammstedt & John (2007), engelsk original BFI-10. Likhet er
vurdert mot den publiserte engelske versjonen; norske itemtekstene er ikke offisielle
oversettelser.

| ID | TRAIT | ORIG. PURPOSE (BFI-10) | REVERSED? | SVARSKALA (dagens) | SCORING | LIKNETT MOT BFI-10 | SEMANTISK DIFFERANSE | LIKELIG PROVENANCE | RISIKO |
|----|-------|------------------------|-----------|--------------------|---------|--------------------|----------------------|--------------------|--------|
| bfi1 | extraversion | «I am reserved» (E-) | **JA** (6−s) | 1–5 «Passer ikke→Passer helt» | gjennomsnitt (2 items/trekk) | **NEAR-VERBATIM** | «stille og» tilføyet; ellers direkte oversettelse | R&J 2007, eng→no | **HØY** (beskyttet itemtekst, nærmest identisk) |
| bfi2 | agreeableness | «I trust people readily» (A+) | nei | 1–5 passerskala | gjennomsnitt | **NEAR-VERBATIM** | direkte oversettelse | R&J 2007 | **HØY** |
| bfi3 | openness | «I am curious about many different things» (O+) | nei | 1–5 | gjennomsnitt | **NEAR-VERBATIM** | «different» droppet | R&J 2007 | **HØY** |
| bfi4 | openness | «I have an active imagination» (O+) | nei | 1–5 | gjennomsnitt | **NEAR-VERBATIM** | «fantasi-liv» i st for «imagination» | R&J 2007 | **HØY** |
| bfi5 | conscientiousness | «I am reliable and responsible» (C+) | nei | 1–5 | gjennomsnitt | **CLOSE ADAPTATION** | «fullfører alltid det jeg starter» — pålitelighets-fasett, ikke «ansvarlighet» per se | R&J 2007 (parafrasert) | **MED** |
| bfi6 | conscientiousness | «I am thorough in my work» (C+) | nei | 1–5 | gjennomsnitt | **CLOSE ADAPTATION** | «systematisk» tilføyet; «arbeid»→«det jeg gjør» (mellomliggende) | R&J 2007 | **MED** |
| bfi7 | extraversion | «I am the life of the party» (E+) | nei | 1–5 | gjennomsnitt | **NEAR-VERBATIM** | «den som får folk til å le på en fest» — vanlig no.-oversettelse, men litt annen billedverden (humor vs sentrum) | R&J 2007 | **HØY** |
| bfi8 | agreeableness | «I am considerate and kind to almost everyone» (A+) | nei | 1–5 | gjennomsnitt | **CONCEPTUALLY SIMILAR** | «tilgivende natur» — fasett-skift (omtanke/vennlighet → tilgivelse), samme akse | R&J 2007 (konstruktet) | **MED-LOW** |
| bfi9 | neuroticism | «I get upset easily» (N+) | nei | 1–5 | gjennomsnitt | **NEAR-VERBATIM** | direkte oversettelse («oppbrakt» ≈ upset) | R&J 2007 | **HØY** |
| bfi10 | neuroticism | «I worry quite a bit» (N+) | nei | 1–5 | gjennomsnitt | **CONCEPTUALLY SIMILAR** | «tenner lett på ting» = irritabilitet/reaktivitet, **ikke** bekymring — konstruktendring (audit D.1) | R&J 2007 (akselaget) | **MED-LOW** |

**Strukturell likhet: IDENTISK** (samme 10 items, samme 2+2+2+2+2-fordeling, samme
trekktilordning, samme eneste reversed item bfi1 på samme posisjon).
**Oppsummert:** CLOSE ADAPTATION av BFI-10-itemsettet (ikke IDENTISK/ikke
NEAR-VERBATIM samlet, men 6/10 near-verbatim + identisk struktur). Dermed:
avledet verk i opphavsrettslig forstand + bruk utenfor dokumentert formål.

### S.3 — IMPLEMENTASJONSKJEDE (spørsmål → finale match-score)

Hver steg merket **[PUBL]** (stammer fra BFI-10 / R&J 2007) eller **[TOSOM]**
(eget produktlogikk).

| # | STED | FUNKSJON | KILDE |
|---|------|----------|-------|
| 1 | `lib/psychometrics/instruments.ts` → BFI10 | 10 itemtekster, trekk, `reversed`-flagg | **[PUBL]** (tekst + struktur; no.-tekstene er egne oversettelser/adaptasjoner) |
| 2 | `Step2Personlighet.tsx` + `ScaleQuestion.tsx` | Presenterer items; skala 1–5 «Passer ikke → Passer helt»; svar påkrevd (PL-08b via `missingScaleItems`) | **[TOSOM]** (skala er egen — avviker fra BFI-10s agree/disagree) |
| 3 | svarlagring | Rått 1–5 per item-id → Profil | **[TOSOM]** (ingen normalisering; skalaområde bevart) |
| 4 | `scoring.ts` → `reverse(s) = 6−s` | Reversering av bfi1 (1 av 10 items) | **[TOSOM]** funksjon; instrumentets reversed-flagg bestemmer hvem |
| 5 | `scoring.ts` → `effectiveValue` / `averageForTrait` | Trekk = gjennomsnitt 2 items, avrunder 2 des; **manglende svar → default 3** (S.10) | **[TOSOM]** (default-3 er ikke en del av det publiserte instrumentet) |
| 6 | `Profile.bigFive` (Prisma `Json?`) | 5 akser 1–5 persistert | **[TOSOM]** |
| 7 | `dimensions.ts` → `scorePersonalityCompat` | Par-heuristikker: neuro straff ved høy-høy; agree gjennomsnitt; consc \|Δ\|·25; ext max(0,Δ−1)·20; open Δ·20 → vektet snitt | **[TOSOM]** — underbygges av ingen publisert BFI-10-data |
| 8 | `unifiedScorer.ts` → `DIMENSION_WEIGHTS.personality = 0.15` | Vekt i 6-dimensjonssystem | **[TOSOM]** |
| 9 | `unifiedScore` → clamp → `toResonanceLevel` | Vektet sum, legacy-klamp 64 uten psyko-data | **[TOSOM]** |

**Konsekvens:** Kun steg 1 (items/struktur) kommer fra det publiserte instrumentet.
Steg 4–9 — matching-heuristikker, vekt, resonansnivå — er Tosom-eget. BFI-10s
publiserte validitetsdata gjelder **verken** steg 2 (andre skala), 5 (default-verdi)
eller 7–9 (egen matching-logikk). «Samme fem dimensjoner» ≠ «implementasjonen er
BFI-10» — kun itemsettet (og dens struktur) er BFI-10-avledet.

### S.4 — BIG FIVE-RAMMEVERK vs BFI-10-INSTRUMENT

- **Big Five / five-factor model** (Goldberg 1990-93; Costa & McCrae 1992; John et
  al. 2008; Saucier 2003) er en konstrukt-familie — fagterminologi, fri bruk.
- **BFI-10** (Rammstedt & John 2007) er et konkret itemssett med publisert tekst,
  struktur, normer og dokumenterte bruksbetingelser (GESIS).

Tosom **kan** bruke begrepene ekstroversjon, medmenneskelighet, planmessighet,
emosjonell stabilitet (nevrotisismespekter), åpenhet — og skal det i Metoder.
Tosom **kan ikke** bruke BFI-10-items, navnet «BFI-10» som instrumentreferanse for
egen variant, eller BFI-10s validitetsdata (α, faktorlast, korrelasjoner) som
dokumentasjon for egen variant uten tillatelse/egen forskning. F1-copyens
«i stil med BFI-10-kortformen» er ærlig, men medfører at itemsettet enten må ut av
BFI-10s skygge (alternativ B) eller inn i tillatt ramme (alternativ A).

### S.5 — JURIDISK / LISENSSMESSIG RISKOVURDERING

**Dokumenterte vilkår** (R&J 2007-artikkel + GESIS BFI-10-side, verifisert i F1):
(a) fritt til **ikke-kommersiell forskning**; (b) ikke kommersiell bruk uten videre;
(c) bruk til andre formål eller i annen form enn dokumentert krever **samtykke fra
rettighetshaverne**; (d) ikke for individuell diagnostikk.

**Tosoms faktiske bruk mot vilkårene:**

| Vilkår | Tosom i dag | Vurdering |
|--------|-------------|-----------|
| Ikke-kommersiell | Kommersiell datingprodukt | **UTENFOR** (medmindre tillatelse) |
| Dokumentert form | Individuelle 1–5-svar persistert + parmatching | **UTENFOR** (ikke gruppeforskning) |
| Uendret form | Endret skala, tilpassede tekster, egen scoring | **ENDRET FORM** |
| Ikke individuell bruk | Resultat brukt individuelt i matching | **UTENFOR** |

**Risiko:** itemtekster er tekstverk (opphavsrettslig beskyttet, 70 år). Norske
near-verbatim-oversettelser av 6 items + identisk 10-item-struktur med samme
trekktilordning utgjør sannsynligvis et **avledet verk**; utgivelse i kommersiell
kontekst uten lisens = opphavsrettsspørsmål. Risiko for erstatning ved småskalig
bruk er lav, men **dokumentert risiko for høy ved offentlig lansering** — og det
spørsmålet bør ikke stå åpent ved launch.

**Rettighetshaver/kontaktpunkt (fra autoritativ dokumentasjon, ikke gjetting):**
item-lisenst administreres av **forfatterne** i R&J 2007: **Tobias Rammstedt**
(Leibniz Institute for Personality Research and Education, Leipzig; vedlikeholder
GESIS-ressursen) og **Oliver P. John** (UC Berkeley). Artiklen er publisert i
*Journal of Research in Personality* (Elsevier) — forlagets rett gjelder selve
publikasjonen, ikke item-tillatelsene. GESIS publiserer instrumentet, men gir ikke
selv tillatelse til kommersiell bruk. **Ikke kontaktet i denne fasen** (PLAN MODE).

### S.6 — ALTERNATIV A: BEHOLDE + SØKE TILLATELSE

| Aspekt | Vurdering |
|--------|-----------|
| ADVANTAGES | Ingen endring av items/onboarding/scoring; ingen legacy-migrasjon; F1-copy holdes helt |
| DISADVANTAGES | (1) Ingen garanti for svar — forfatterne kan avslå, sette pris eller kreve betingelser (f.eks. uendret instrument, spesifikk kreditering). (2) Tid: e-postrunde + forfatterrespons = ukener–måneder, uforutsigbar og utenfor vår kontroll. (3) Tillatelse må dekke hvert avvik: kommersiell bruk, endret skala, modifiserte items, norsk, individuell parmatching. (4) Ved avslag står vi like før launch og trenger B likevel — sunk time. (5) To aktører (forfattere; muligens forligger) kan være involvert i dokumentasjonen |
| WHO MUST AUTHORIZE | Rammstedt og John (forfatterne); praktisk kontakt via GESIS-ressursen / forfatterens institusjon |
| WHAT MUST BE DISCLOSED | Kommersiell dating-anvendelse; individuell bruk av resultater; parmatching; norsk tilpasning; endret svarskala; endrede itemtekster (bfi5, bfi6, bfi10); forventet antall profiler |
| COMMERCIAL USE | Sentralt spørsmål — må dekket eksplisitt i skrift |
| MODIFICATION/TRANSLATION | Må dekket som «derivert form» |
| MATCHING USE | Må dekket (hever «ikke individuell bruk»-vilkåret) |
| RESPONSE-SCALE MODIFICATION | Må nevnes i søknaden |
| TIME/RISK | 2–8+ uker, avgjørelse uavhengig av oss; avslag = full B-arbeid likevel |
| LAUNCH IMPACT | Kan **ikke** være launch-gate alene; fungerer kun som parallellspor mens B forberedes |

### S.7 — ALTERNATIV B: EGET, SELVSTENDIG BIG FIVE-INSPIRERT ITEMSETT

**Prinsipp:** Nye items utvikles fra **konstruktdefinisjonene** (hvad vil Tosom forstå,
og hvorfor er det relasjonelt relevant), **ikke** ved parafrasering av BFI-10-items.
Ingen av de 10 nåværende itemtekstene skal beholdes, ikke engang som utgangspunkt for
omskriving. Itemskrivning skjer i implementasjonsfasen, ikke her.

**Konstruktdefinisjoner per dimensjon (hvad Tosom faktisk ønsker å forstå):**

- **EXTRAVERSION** — hverdags-/sosial energi: hvor mye sosial kontakt gir/taer energi,
  behov for å være midt i bilder. Relevant for matching fordi sosial rytme
  (hemme-base vs sosial base) er en konkret hverdagsfriction, uten at vi
  rangerer introverterte som «mindre».
- **CONSCIENTIOUSNESS** — struktur og gjennomføring i hverdagen: planmessighet,
  avklaring, «starter-fullfører». Relevant fordi ulik struktur-nivå skaper
  hverdagsfriction (budsjettering, avtaler, rydding) — uten moralsk vurdering av
  «slapser vs seriøs».
- **OPENNESS** — nysgjerrighet og åpenhet for nytt: ny kultur, tanker, rutiner.
  Relevant relasjonelt: par som begge vil utforske (mat, reiser, tanker) deler
  opplevelsesrom. Måles som interessenivå, ikke som intellekt.
- **AGREEABLENESS** — konflikthåndtering og avklaring: tendens mot samordning vs
  sin egen linje. **Unngår «snillhet»/ønskeværdighet:** items formuleres som
  relasjonsmønster («når vi uenig, går jeg først mot avklaring»), ikke som
  karakterprais («jeg er en snill person»), slik at sosialt ønskverdig svar ikke
  belønnes.
- **EMOTIONAL STABILITY** — emosjonsregulatorisk robusthet i hverdagsstress: hvor
  fort man kommer til ro etter en oppgirket situasjon. **Grense mot klinikk:**
  items spør om *hverdagsmønster* («etter en dag som gikk galt, kommer jeg
  relativt raskt til ro»), aldri om symptomer, hyppighet av panikk/angstanfall,
  depresjon eller andre diagnosekriterier. Høy nevrotisismescore skal aldri
  framstilles som en helsevurdering av brukeren eller kandidaten.

**Vurdering av B:**

| Aspekt | Vurdering |
|--------|-----------|
| ADVANTAGES | (1) Juridisk risiko → **null** for personlighetsdelen (konstruktet/fagterminologien er fri; items er egne, som allerede 34 av 44 items er). (2) Faglig ærlighet: F1-copyens «egne spørsmål inspirert av» blir fullstendig sann; «i stil med BFI-10» kan byttes til «inspirert av Big Five-rammeverket». (3) Ingen endring i scoring/matching-kode: samme 10 slots, 2/trekk, 1–5, samme trait-nøkkler, samme `scorePersonalityCompat`. (4) Vedlikehold: full egen eierskap, ingen ekstern avhengighet. (5) Produktverdi beholdt (vekt 0.15). |
| DISADVANTAGES | (1) Arbeidsmengde: konstruktbasert itemskriving + ekspertgjen gjennomgang + testing (ca. 1–2 uker med fokusert arbeid; items er kun tekstbytte i `instruments.ts`). (2) Eksisterende bigFive-scorer er v1 — krever versjonering/re-onboarding (S.11). (3) Nye items har ikke valideringsdata — men copy er allerede ærlig om dette (F1). (4) Itemkvalitet avhenger av faglig fagperson, ikke av oss selv. |
| LISENSE | Ingen — eget materiale. Big Five-begreper er fagterminologi (Saucier 2003 m.fl.). |
| LAUNCH IMPACT | Må leveres **før** launch (launch-gate). Teknisk risiko lav (tekstbytte + versjonering). |

**S.7.4 — IMPLEMENTASJONSPPLAN (B) — 18 punkt, gjennomføres i egen ACT etter godkjennelse:**
1. **Konstruktdefinisjon per dimensjon** — frosne definisjoner fra S.7 (5 dim.), godkjent av fagperson før itemskriving.
2. **Antall spørsmål per dimensjon** — beholde 2/trekk (10 totalt) for å unngå endring av onboarding-struktur/scoring; minste mulige fotavtrykk. (3/trekk = bedre stabilitet, men øker onboarding-lengde; beslutning i ACT.)
3. **Uavhengig itemskriving** — prosess: (a) per dimensjon, skriv 6–8 kandidatitems fra konstruktdefinisjonen; (b) **blind review**: én person som har BFI-10 som referanse sjekker at INGEN kandidat er parafrasering; (c) hold 2 som best dekker ulike fasetter av dimensjonen; (d) norsk språk, ToSom-tone (rolig, ikke-termer, ikke-moraliserende).
4. **Språkprinsipper** — første person, hverdagsmønster (ikke karakterprais), relasjonelt kontekst der naturlig, ingen kliniske ord, ingen verdilading («snill», «slapp», «mystisk»).
5. **Response scale** — beholde Tosoms 1–5 passerskala («Passer ikke → Passer helt», `ScaleQuestion`) — konsistent med de andre 34 items; BFI-10s agree/disagree-skala og dens validitetsdata gjelder **ikke** for Tosoms skala (F1-copy er allerede ærlig om dette).
6. **Scoring** — uendret mekanisme: gjennomsnitt per trekk, 6−s for reversed (dersom brukt), 1–5. Ingen ny matematikk.
7. **Missing-data policy** — onboarding forblir påkrevd per item (PL-08b); `effectiveValue` default-3 beholdes kun som defensiv fallback for legacy, **dokumentert** som nøytral, ikke psykologisk (S.10).
8. **Reverse-item policy** — se S.9; beslutning: maks 1 reversed item, eller 0 (foretrekkes for UX).
9. **Tests** — oppdater `__tests__/psychometrics-scoring.test.ts`, `dimensions-compat.test.ts`, `unified-scorer.test.ts`, `toOnboardingData.test.ts`, `profile-setup-save.test.ts`, `prod-smoke-profile-save.test.ts` + onboarding-e2e (item-id bytte); ny guard-test: ingen BFI-10-originaltekst (engelsk eller norsk near-verbatim) må finnes i items (mirrors F1 metoder-guard).
10. **Migrering av eksisterende brukerdata** — ingen data-migrasjon av rå svar (gamle item-svar beholdes i historikk); ny onboarding bruker nye id'er (f.eks. `bf2_e1` … eller `p1`–`p10`).
11. **Legacy-profiler** — profiler med v1 bigFive: (a) foretrukket: inviteres til å besvare de 10 nye items ved neste pålogging/onboarding-oppgjør (pre-launch brukerbasis er liten); (b) fallback: v1-score beholdes og brukes i matching med v1-merke (samme 1–5-skala per trekk, sammenlignbart innen tolkningens grenser).
12. **Re-onboarding** — minimal: kun personlighets-steget vises på nytt for v1-brukere; øvrige 5 dimensjoner urørt.
13. **Gamle scores** — beholde i DB; nye matches beregnes fra nyeste versjon per profil; v1-score beholdes for historikk/analysing.
14. **Matching-regresjon** — `scorePersonalityCompat` og vekt 0.15 urørt; kjør eksisterende unified-scorer-tester som regresjon + 2–3 dokumenterte manuelle parsjekker før/etter for å bekrefte at skalaatferd er lik.
15. **Metoder-copy** — bytte «i stil med BFI-10-kortformen» → «våre egne spørsmål, inspirert av Big Five-rammeverket»; kilde: beholde R&J 2007 **kun** som rammeverksreferanse dersom fagperson godkjenner formuleringen, ellers Goldberg/Costa & McCrae/Saucier; oppdater SCI-guard-test (`__tests__/metoder.test.tsx`) dersom copy endres.
16. **Dokumentasjon** — ny seksjon i FORSKNINGSMOTOR (F1.5.1) med itemprovenance v2 (alle 10 = INDEPENDENT, konstrukt-basert); oppdater lanseringschecklist.
17. **Versjonering** — `personalityModelVersion: 2` lagret med bigFive (envelope `{ v: 2, openness… }` eller separat felt); `INSTRUMENT_SET_VERSION` bumpes.
18. **Ekspert-review** — se S.13; gate før launch: godkjent konstruktdefinisjon + item-wording + scoring + public claims.

### S.8 — ALTERNATIV C: FJERNE PERSONLIGHET FRA MATCHING (CONTINGENCY)

Kun hvis B ikke rekker før launch (f.eks. ekspertreview ute av rekkevidde).

| Aspekt | Analyse |
|--------|---------|
| Vekt | `personality = 0.15` — den 3.-største av 6 dimensjoner. Fjernes den: (a) renormere de 5 gjenværende vektene til sum 1.0 (values .294, attachment .294, comm .176, ER .118, life .118), eller (b) beholde vektene og ta en systematisk score-senking (~15 poeng på alle par). (a) er rett; endres `DIMENSION_WEIGHTS` = matching-endring. |
| Tester påvirket | `unified-scorer.test.ts` (19), `dimensions-compat.test.ts` (31, del), `psychometrics-scoring.test.ts` (15), `profile-setup-save.test.ts` (4), `toOnboardingData.test.ts` (19), `prod-smoke-profile-save.test.ts` (1) + e2e onboarding (BFI-steget) — betydelig testarbeid. |
| Tilstrekkelighet av de 5 andre | Ja — values (0.25) + attachment (0.25) + communication (0.15) + ER (0.10) + life (0.10) dekker kjernen; personlighet er den svakeste dokumenterte predikturen i parforskningen og gir minst «product feel» per innsats. |
| Teknisk tålelighet | Ja — motoren har allerede ord-overlap fallback for `personality`-feltet og `MAX_LEGACY_FALLBACK`-klamp; dimensjonen kan slås av uten strukturell ombygging. Onboarding: `Step2Personlighet` beholder selfDesc/valgfelt, fjerner kun BFI-skalaspørsmålene. |
| Publisert copy | F1-copy må endres: «sese områder» → «fem områder», BFI-kort, KAN-liste, kilde (R&J 2007) — motvirker «IKKE RØR F1-COPYEN ENNÅ» og tvinger ny F1-revurdering + nye guard-tests. |
| Risiko | Målingstap av 15 % av matching-signalet; mindre rik profil; «why is this a match?»-erfaring fattigere. |
| Fordel | BFI-problemet forsvinner helt (ingen items, ingen referanse), ingen versjonering/migrasjon av personlighetsdata. |

**Vurdering:** C er teknisk gjennomførbar, men koster produktverdi og tvinger copy-work
som B unngår. Anbefales **kun som contingency** med avgjøringspunkt: B ikke leveringsdyktig
T-5 dager før planlagt launch.

### S.9 — REVERSE SCORING (vurdering, ingen endring)

- **Hvorfor de finnes i etablerte instrumenter** (f.eks. BFI-10s ene reversed item):
  (1) redusere acquiescence-bias (rykk for å stemme «ja»/helt på alt),
  (2) holde respondenten våken (variasjon i item-retning).
- **Problemer/misforståelser:** reversed items er den hyppigste kilde til
  lesefeil — respondenten kan tenke «passer helt» = positivt, selv om itemet
  beskriver et lavt trekk. I agree/disagree-skaler er feilen subtil; i en
  «passer»-skala er den mindre (itemet er et selv-beskrivende mønster, og
  «passer helt» = mønsteret passer, uavhengig av retning) — men den eksisterer.
- **Brukeropplevelse i Tosom:** 1 av 10 items (bfi1, «Jeg er stille og reservert»)
  har motsatt poengretning; brukeren ser ingen hint om dette.
- **Trenger Tosom dem?** For 10 items på «passer»-skala: **nei, ikke strengt**.
  Acquiescence risikoen er lavere på passerskala, og UX-tjenesten er tydelig.
  **Anbefaling for B:** 0 reversed items (forenklet, mindre feil). Dagens bfi1
  forsvinner med itemsbyttet. Ingen kodeendring nødvendig — `reversed`-flagget er
  per item.

### S.10 — MISSING / DEFAULT VALUES — **MATCHING INTEGRITY ISSUE**

Skill mellom begrepene:

| Terminologi | Må bety | Dagens tilstand |
|-------------|---------|-----------------|
| MISSING (ikke besvart) | Ingen data | `effectiveValue`: `raw == null → 3` — **gir nøytral score som om brukeren svarte 3** |
| NEUTRAL | Bevisst midtpunktsvalg | Ingen egen representasjon — identisk med 3 |
| MIDPOINT RESPONSE | Svar = 3 | 3 |
| NOT ANSWERED (skreddet steg) | Blokkert | PL-08b: `missingScaleItems` blokkerer Next — påkrevd per item i dagens onboarding |

**Funnet:** I dagens onboarding kan BFI-items **ikke** skje ubesvarte
(PL-08b, `Step2Personlighet` + `validateStep`). Default-3-veien i
`scoring.ts`/`averageForTrait` (og `overlapScore` → 50 ved tomt array i
`unifiedScorer`) aktiveres kun for: (a) **legacy-profiler** fra før PL-08b /
API-opprettede profiler uten full skala, (b) defensive fallback i `unifiedScore`
(mangler `bigFive` → ord-overlap → 50). En bruker som **aldri har gitt**
personlighetsdata får da likevel en «nøytral personlighetsscore» som
deltar i 15 % av matchingen — en psykologisk betydning (midtpunkt på 5 akser)
som brukeren aldri har gitt.

**Klassifisering: MATCHING INTEGRITY ISSUE** (latent; ikke aktiv i ny onboarding).
Retting (plan, ikke implementert): skille «ingen bigFive-data» (fallback: 50,
utelagt fra psyko-signal — som i dag via `readBigFive === null`) fra «partial
data» (i dag default-3 — bør i stedet behandles som mangle → 50-fallback).
Dokumenteres i B-aktens §7 (missing-data policy) og i Metoder.

### S.11 — EKSISTERENDE BRUKERDATA OG MODELLVERSJONERING

- **Dagens versjon:** `INSTRUMENT_SET_VERSION = '2026-08-22.v1'` finnes
  (`instruments.ts`) men er **ikke** lagret per profil — profilen har kun
  `bigFive Json?` uten versjonsmerke. `Profile`-skjema har ingen
  `personalityModelVersion`.
- **Kreves versjonering?** **JA** hvis B (eller C) gjennomføres. Gamle v1-scores
  (BFI-avledte items) er **ikke sammenlignbare med nye v2-scores** som måles
  instrumenter — samme 1–5-skala per trekk gir sammenlignbar skala, men iteminnhold
  er annle, og mean/standarddeviasjon vil skje.
- **Konseptuelt** (ikke implementert): `personalityModelVersion: 1 | 2` per profil
  (separat felt, ikke inne i `bigFive`-JSON for enkel querying). V1-profiler:
  re-onboarding (foretrukket, S.7.4 #11a) eller beholdes v1 i matching med
  dokumentert begrensning (fallback #11b).
- **Konssekvens uten versjonering:** stille blanding av v1/v2 i parmatching →
  ikke-forsvarlig faglig (likestill to ulike instrumenter).

### S.12 — SVARSKALA OG SCORING-PRESISJON

**Svarskala (dagens: «Passer ikke» → «Passer helt», 1–5):**
- Fordel: egnet til selv-beskrivende «passer»-items; konsistent over alle 44
  items; myk ToSom-tone; unngår agree/disagree-bias.
- Ulempe: «passer» er vagt for trekk-items (hvad passer — meg? meg som
  person? meg i relasjoner?) — mindre presist enn frekvensskala
  («aldri–altid») eller overenskomst («helt uenig–helt enig»).
- **BFI-10-validitetsdata gjelder ikke** denne skalaen (annle skala + annle
  items + annle anvendelse) — copy må aldri implisere det (F1 holder dette).
- **Anbefaling for B:** beholde passerskala (produktkonsistens, 44 items), men
  presisere intro-teksten i steget («Hvorpassende er dette som beskrivelse av
  deg?») i item-design-fasen. Bytte av skala for alle 44 items er **ikke**
  anbefalt (migrasjon/reaksjon av hele onboarding).

**Scoring-presisjon — funn (ingen endring i PLAN):**
- Skalaområde: 1–5 per item; trekk = gjennomsnitt av **2** items → kun 10
  mulige gjennomsnitt-verdier (1.00, 1.25, … 5.00) — lav oppløsning.
- Normalisering: ingen (ingen z-score/percentil) — matching bruker rå 1–5.
  Forsvarlig for likhetsberegning, men `scorePersonalityCompat`s heuristikker
  (f.eks. «neuro begge > 3.5 → −20») er **ikke kalibrerte terskler** (F1-copy
  innrømmer dette).
- Missing/default: se S.10 (MATCHING INTEGRITY ISSUE).
- Reverse coding: 1 item, korrekt (6−s).
- Trait aggregation: enkelt-gjennomsnitt uten vekt — OK for 2 items, men
  med 2 items/trekk gir én utelatt/ekstrem respons 50 % av trekkscorer —
  lav responsstabilitet; godkjent for produktets behov, men skal ikke
  fremstilles som pålitelig måling.
- Pair comparison: heuristikker uten empirisk kalibrering — TOSOM PRODUCT
  LOGIC (S.3 steg 7), ikke BFI-10-validering.
- Matching weight: 0.15 — faglig forsvarlig som «reell men svakare effekt»
  (personlighet er svakt prediktor i parforskning, f.eks. Furlong et al. 2019
  metaanalys; men denne metaanalysen dokumenterer **ikke** Tosoms konkrete
  heuristikker).

### S.13 — INDIVIDUELLE INFERENSER, FRAMTIDS-COPY OG EKSPERTREVIEW

**Individuelle inferenser:** Tosom lager individnivåsscores og bruker dem i
parmatching — ikke klinisk diagnostikk, men likevel: BFI-10s valideringsdata
(gruppe-nivå, opprinnelig form) må **aldri** sitater som underlag for at
Tosoms individuelle matching er validert. Framtidig Metoder-formulering
(utkast, endres kun når F1.5-avsluttes): «Vi beregner en enkel selvrapportert
profil per bruker og sammenlikner profiler. Dette er et heuristisk
produktverktøy, ikke en psykologisk testing, og resultatet er ikke
individvalidert som diagnose eller personlighetsprofil i faglig forstand.»

**Ekstern fagperson (psykometrisk + relasjonsfaglig) — minimumsskontroll:**
1. Konstruktdefinisjon per dimensjon (dekker det items mener å måle?)
2. Item-wording (tydelig, entydig, ikke-moraliserende, ikke-klinisk)
3. Content validity (2 items/trekk — akseptabelt? fasettekke?)
4. Response scale (passerskala — egnet? intro-tekst?)
5. Scoring (gjennomsnitt, reversed policy, default-verdier)
6. Missing-data (PL-08b + legacy-fallback; S.10-retting)
7. Matching-use (er `scorePersonalityCompat`-heuristikker forsvarlig
   som heuristikk, og er copy ærlig om at de ikke er kalibrerte?)
8. Personvern/ethics-grense (ingen klinisk screene; ingen helse-inferanse i
   match-text; GDPR-minimalisering)
9. Public claims (Metoder: hva må sies / ikke sies; ingen BFI-10-navn, ingen
   valideringspåstand, R&J 2007 kun som rammeverksreferanse)

### S.14 — LAUNCH STRATEGI OG GO/NO-GO

**PRE-LAUNCH MUST FIX (launch-gate):**
1. **Lisens** — bytte til selvstendig itemssett (B) **før** launch. Lisens må
   ikke skyves post-launch: dagens bruk (kommeriell, individuell, endret form) er
   utenfor de dokumenterte vilkårene (S.5).
2. **Versjonering** — `personalityModelVersion` per profil + håndtering av
   v1-brukere (S.11, S.7.4 #11/#17).
3. **Metoder-copy** — «i stil med BFI-10-kortformen» → «inspirert av Big
   Five-rammeverket» (kun når nye items er aktive, ellers usant).
4. **Ekspertgodsending** (S.13) — konstruktdefinisjon + items + public claims.

**SAFE POST-LAUNCH VALIDATION (forskning-roadmap, ikke gate):**
- Empirisk validering av det selvstendige itemssettet (Cronbach α, faktoranalyse,
  test-retest, sammenligning med matchkvalitet i produktdata) — godkjent som
  langsiktig forskningsroadmap, forutsetning: offentlig copy er ærlig om at
  validering mangler (F1 er det).
- Kalibrering av `scorePersonalityCompat`-terskler mot ekte matchdata.
- S.10-retting (missing-data skill) — teknisk, kan også kjøre som eget lite ACT.

**GO/NO-GO for dagens personlighetssystem (BFI-avledte items):**
**NO-GO** for offentlig lansering i dagens form.
**GO** (med gate): alternativ B levert — selvstendig itemssett + versjonering +
oppdattert copy + ekspertgodsending. Fallback: alternativ C ved T-5 dager.
S.10 (MATCHING INTEGRITY ISSUE, latent) er ikke i seg selv launch-gate men skal
rettes i B-aktens missing-data policy.

**Endring i denne seksjonen:** kun dokumentasjon. F1-copy, kode, tests, onboarding,
scoring, matching, Prisma — alt urørt (PLAN MODE).

---

## T. ACT F2 — PERSONALITY MODEL V2 PLAN (24.10.2026, PLAN MODE)

**Status:** PLAN KUN. Ingen items skrevet, ingen kode/DB/onboarding/matching/copy
endret. Dagens BFI-avledede items (v1) forblir teknisk aktive inntil F2-implemen-
tasjon — men **må ikke utsettes lenger i nye brukertilfeller** etter at V2 er
godkjent (launch-gate G3, T.22).

**Mål:** Erstatte v1 (CLOSE ADAPTATION av BFI-10, §S.2) med et selvstendig
Tosom-itemssett basert på Big Five som **rammeverk** (§T.2). Må være: selvstendig,
transparent, ikke-klinisk, forståelig, respektfull, relasjonelt relevant, teknisk
kompatibel med `unifiedScore`, versjonert, ærlig om manglende validering.

### T.2 — RAMMEVERK vs INSTRUMENT (regler for F2)

1. Big Five/five-factor (Goldberg 1990-93; Costa & McCrae 1992; John et al. 2008)
   = fri fagterminologi. BFI-10 (R&J 2007) = beskyttet itemssett — **null** av
   dennes setninger, parafraser eller «Jeg vil si at jeg er X»-diktature må
   inngå. Item utvikles kun fra §T.3-«T.4 konstruktdefinisjoner».
2. «Ingen parafrasering» verifiseres med blind review (T.18) og guard-test PV2-01/12.
3. Tosoms scoring, vekt og heuristikker er **TOSOM PRODUCT LOGIC** (§S.3) —
   BFI-10s validitetsdata brukes aldri som underlag (slik har det vært siden F1).

### T.3 — PRODUKTBEHOV PER TREKK (hvorfor trenger Tosom signalet?)

| TREKK | CONSTRUCT | RELATIONSHIP/MATCHING RELEVANCE | VIL FORSTÅ | MÅ IKKE UTLEDA | POTENSIELL SKADE | STATUS |
|-------|-----------|--------------------------------|------------|----------------|------------------|--------|
| EXTRAVERSION | Hverdags-/sosial energi- og rytmebalanse | Par med svært ulik sosial rytme (sosial base vs hjemmabase) får hverdagsfriksjon som ikke er konflikt i seg selv | Hvor mye tid i sosial setting vs alenetid som lader uttørrer | at introverte er mindre, at ekstroverte er «bedre», intelligens, mental helse | Stigmatisering; press til å prestere sosialt | **NECESSARY** |
| AGREEABLENESS | Forhandlings-/kompromissmønster i uenighet | Komplementaritet i beslutningsfordeling (hvem gir, hvem holder) påvirker hvor ofte små uenigheter blir store | Om mønsteret er mot avklaring eller mot sin egen linje — og om det er stabilt | «snillhet», moralisk verdi, bittelighet | Sosial ønskverdighet: «riktige» svar belønnes; maskering av reelle preferanser | **NECESSARY** (men overlapp med COMMUNICATION/ATTACHMENT håndteres med fasett-regler, T.4) |
| CONSCIENTIOUSNESS | Struktur- og oppfølgningsnivå i hverdagen | Ulighet i planmessighet/avtaler/økonomi-rutiner er konkret kilde til friksjon | Om livet er planlagt eller flytende, og om avtaler oppfølges | at strukturert=bedre, moral («slapser»), kompetanse | Dømmende tone; «slapsers»-stigma | **NECESSARY** |
| EMOTIONAL STABILITY | Tilbakehasting fra hverdagsfrustrasjon | Par der én fortsetter å bære en oppgik situasjon i timevis/vøker skaper konstant lav intensitet uenighet | Hvor fort roen kommer tilbake **etter** en hverdagsfrustrasjon, og om det er håndterbart i par | klinisk screening, diagnose-indikasjoner, helsestatus — alt | Helsestigmatisering; «syk»-label i en datingkontekst; GDPR-sensitivitet | **NECESSARY** (høyest forsiktighet, T.4) |
| OPENNESS | Åpne for nye erfaringer og perspektiver | Par med lik lekenivå for nye ting (mat, reiser, tanker, rutiner) deler opplevelsesrom; ulikhet gir «ennå en»-friksjon | Om nyheter frister eller kjente rammer trygger | intellekt, kunstinteresse som status, «kultivert» vs «ordinær» | Elitistisk tone; kunstinteresse ≠ åpenhet | **NECESSARY** (lavest risikoprofil av de fem) |

**Alle fem beholdes** (motoren, vekta og copy er bygd for 5 akser; å kutte ett
trekk koster mer enn det gir — §S.8). Overlappshåndtering (T.4) sikrer at Tosom
ikke spør det samme seks ganger.

### T.4 — KONSTRUKTDEFINISJONER + OVERLAP-REGLER (grunnlag for F2A-itemskriving)

**Fasett-regler** (hvad HVERT v2-item må mål, og hvad det må UNNGÅ):

- **EXTRAVERSION** — fasett: *hverdagsenergi*. Item skal omhandle rytme (alene/tid,
  sosial kontakt, tempo). FORBUDT-overlapp: ingen items om «sympatisk/fest» som
  måler likhet; ingen items som belønner ekstrevert svar.
- **AGREEABLENESS** — fasett: *kompromiss i beslutninger*. Item skal omhandle
  konkrete beslutningssituasjoner (hvem bestemmer, hvem gir, hvem tar ut). FORBUDT:
  karakterpriser («snill», «god», «hensynsfull» som stand-alone); overlapp med
  COMMUNICATION (der måler **hvordan** man snakker; her måler **hvem som** gir)
  og ATTACHMENT (der måler trygghetsbehov/unnvikelse, ikke forhandlingsmønster).
- **CONSCIENTIOUSNESS** — fasett: *struktur og oppfølging*. Item om konkrete
  hverdagsmønstre (avtaler, planer, «starter-fullfører» vs «flyter på»). FORBUDT:
  moralsk ord («ansvarlig», «slaps»), jobb-prestasjon; overlapp med livsstil-felt
  (arbeidsrytme er livsstil, ikke personlighet).
- **EMOTIONAL STABILITY** — fasett: *tilbakehastingstid etter hverdagsfrustrasjon*.
  Item skal omhandle **mønster** etter en konkret hverdagssituasjon (kø, feil,
  kritikk av maten), aldri symptomer. FORBUDT: ord som angrep/panikk/depresjon/
  «mange ganger», «ofte», «aldri kan jeg slappe av» (symptom-språk); kliniske
  skala-referanser. Overlapp med ERQ-dimensjonen: ER måler **strategi** (omtydning
  vs undertrykking), her måler **intensitet/hastighet** (hvor fort roen kommer
  tilbake). Hvis F2A-reviewer finner at itemene likevel måler strategi → items
  skrives om, ikke dimensjonen.
- **OPENNESS** — fasett: *nysgjerrighet på nye erfaringer*. Item om konkrete
  utforskningsmønstre (ny mat/ny rute/ny samtale). FORBUDT: kunst/bøker som
  status; «intelligent»-tone; BFI-fantasi-fasetten («aktivt fantasiliv») er
  eksplisitt ute — den måler noe annet enn relasjonell nytte.

**Ekspertgodsending av disse konstruktdefinisjonene er gate G1 (T.22) — items
skrives IKKE før definasjonene er godkjent.**

### T.5 — ANTALL ITEMS

| Struktur | Onboarding-burden | Coverage | Scoring-stabilitet | Redundans | Fatigue | Matching-verdi |
|----------|-------------------|----------|--------------------|-----------|---------|----------------|
| **A: 10 items (2/trekk)** — BFI-form | Minst (+0 vs v1) | 2 fasetter per trekk umulig å dekke fullt | Lav (1 ekstremt svar = 50 % av trekket) | Lav | Lav | OK |
| **B: 15 items (3/trekk)** — anbefalt | +5 items ≈ 30–45 s i steg 2 | 3 fasetter per trekk dekker T.4-reglene (inkl. «ikke kun én fasett») | Middel-høy (minste kvotient ved 3 punkter; 1 feil-svar = 33 %) | Middel (må styres av blind review) | Middel (innerste steg, men 15 items er OK i mobil om de er kort) | Høyere signalpervekt (15 % av matchingen bygger på mer pålitelig input) |
| **C: annen struktur** (f.eks. 12–20 med ulik fordeling) | Variabel | Maksimal fleksibilitet | Maksimal | Maksimal | Høyere risiko | Høyest, men kostbar |

**Anbefaling: B — 15 items, 3 per trekk.** Begrunnelse: (1) T.4 krever minst
3 distinkte fasetter for at EMOTIONAL STABILITY kan unngå symptom-språk og
AGREEABLENESS kan unngå karakterprais med 3 ulike situasjoner; (2) 2/trekk gir
for lav stabilitet til at 15 % av matchingen skal hvile der uten at vi måler
re-test; (3) +5 items er akseptabel burden i ett steg (44 items i dag, 49 i V2);
(4) C gir lite nytt over B ved høyere kompleksitet. 3/trekk er også det
psykometrisk vanlige minimum for kortformer.

### T.6 — RESPONSE SCALE

**Anbefaling: beholde Tosoms eksisterende 5-punkt passerskala** («Passer ikke /
Passer dårlig / — / Passer ganske godt / Passer helt», `ScaleQuestion`), felles
med de andre 34 skalaspørsmålene.

- **Forståelighet:** «passer» er selv-beskrivende og naturlig for norsk; 5 punkter
  med ord-labeler er tilgjengelig (aria-labeler finnes i dag).
- **Midpoint:** eksisterer (3) — akseptabelt; scoring T.8 sikrer at *manglende*
  svar ikke blir 3.
- **Sosial ønskverdighet:** passerskala er mildt mer resistent enn agree-skala
  (brukeren vurderer «passer på meg», ikke «er jeg enig i en generell påstand») —
  men karakterprais-items (T.4 forbud) ville likevel skru ønskeværdighet opp.
- **Måler trait eller selvbilde?** Begge — selvrapportert personlighet er
  per definisjon selvbilde; dette er ikke en feil i målet (matching sammenligner
  selv-bilder, ikke «ekte» trekk), men copy skal aldri si annet (F1 holder).
- **Ikke bytte skala** for hele onboarding (44 items) — migrasjon/reaksjon
  for stor; V2-personlighetsitem kan eventuelt få presisert intro-tekst
  («Hvor passende er dette som beskrivelse av deg i hverdagen?»).

### T.7 — REVERSE ITEMS

**Anbefaling: 0 reverse items i V2.** (FOR: acquiesence-kontroll, våkenhet.
MOT: lesefeil, UX i mobil-onboarding, scoring-kompleksitet.) Passerskala reduserer
acquiesence-risikoen (se §S.9); 15 items med 0 reversering er enklere for både
bruker og scoring. `Item.reversed`-feltet beholdes (defensivt), alle V2-items
får `reversed: false`. Dagens bfi1-reversering forsvinner med v1.

### T.8 — MISSING-DATA-POLICY (retter §S.10 MATCHING INTEGRITY ISSUE)

**Prinsipp: MISSING ≠ NEUTRAL ≠ MIDPOINT ANSWER. Aldri gi en psykologisk
betydning en bruker aldri har uttrykt.**

| Tilstand | Definisjon | V2-håndtering |
|----------|------------|---------------|
| NOT ANSWERED (ny onboarding) | Bruker hoppet skritt | Umulig — skalaspørsmål forblir påkrevd per item (PL-08b-mønsteret; PV2-07) |
| MIDPOINT RESPONSE | Bevisst 3 | Tell som 3 (det brukeren ga) |
| MISSING (legacy/partial i DB) | `bigFive`-felt null/ukomplett | **Ikke default 3.** `scoreAll`/`averageForTrait` endres: hvis et item mangler → trekket = null → `bigFive` = null → `readBigFive`-fallback i `unifiedScore` (ord-overlap/50) for akkurat den dimensjonen. Ingen falsk nøytralitet i 15 % av matchen |
| LEGACY v1 (fullt besvart, men feil versjon) | v1-score eksisterer | Håndteres av T.11 versjonsregel — ikke av missing-logikk |

Konsekvensanalyse: (1) Ny brukere påvirket: ingen (pålagt svar). (2) Legacy-profiler
uten fullt data: de får i dag en «nøytral personlighet» som driver 15 % av
matchingen — etter retting faller personlighetsdimensjonen tilbake til eksisterende
fallback (deterministisk, testet). (3) Ingen endring i vekt eller terskler.
(4) Retting kreves som en del av V2 (ikke separat), fordi V2 bytter item-id —
gamle rå svar kan ikke scoring på nye trekk likevel.

### T.9 — SCORING + VEKT

**Scoring (mekanisme):** uendret fra dagens — gjennomsnitt per trekk (3 items),
1–5, ingen normalisering. `scorePersonalityCompat`-heuristikker beholdes i V2
(samme funksjonsform, samme skala). Dette er en bevisst beslutning: å bytte både
items og scoring-form i én ACT fordobler regressjonsrisikoet uten faglig gevinst.
Formen (T.10) er likevel **UNVERIFIED HEURISTIC** til videre — se merkelappene.

**Vekt — tre alternativer:**

| Alt | Vekt | Fordel | Ulempe |
|-----|------|--------|--------|
| A: Behold 0.15 midlertidlig | 0.15 | Ingen scoring-drift for eksisterende par; copy er allerede ærlig om heuristikker; V2 måler samme 5 akser på samme skala — signalkvaliteten *forbedres* (3 items/trekk) | 15 % på uvalidert sett (men: gate G1 eksperti­vurdering before launch; validering er post-launch roadmap, F1.5 §S.14) |
| B: Reduser (f.eks. 0.08–0.10) | <0.15 | Mindre eksponering mot uvalidert signal | Krever renormalisering av de øvrige 5 vekter = matching-endring for **alle** par; terskler (80/65/50/40) må rekalibreres; copy må endres igjen; ingen validitetsgrunnlag tilsier at 0.15 er for høyt |
| C: Kun svak sekundær komponent | ~0.03–0.05 | Minst risiko | Personlighet som signal blir nesten inert — produktverdi-tap; likevel et uvalidert sett med ny kode |

**Anbefaling: A — beholde 0.15 midlertidlig**, med (1) gate G1 (ekspertgodsending
av items + scoring-form) som forsikring før launch, (2) post-launch kalibrering
mot ekte matchdata (F1.5 §S.14 roadmap), (3) copy fortsetter å si «heuristisk,
ikke kalibrert». Risiko-vurdering: mest sannsynlige feilmodus (dårlige items)
er fanget av G1 + blind review + PV2-06; systematisk feil (feil faglig form)
er fanget av post-launch validering — og 0.15 er den *laveste* av de tre
store vektingene i motivet (values/attachment er 0.25).

### T.10 — LIKHET VS KOMPLEMENTARITET (per trekk, dagens form klassifisert)

Dagens `scorePersonalityCompat`-form per trekk (kode, §S.3 steg 7):

| TREKK | DAGENS FORM | LIKHET ØNSKELIG? (forskning) | KOMPLEMENTARITET ØNSKELIG? | MERKELAPP |
|-------|-------------|------------------------------|-----------------------------|-----------|
| Neuroticism | «Lav hos begge = bra» + straff ved høy-høy (absolutt-nivåregel, ikke ren likhet) | Ja — par-gjennomsnitt av nevrotisism er dokumentert negativt prediktor for relasjonskvalitet (f.eks. via metaanalytisk litteratur; **ikke** spesifikt verifisert i denne audit) | Nei | **THEORETICALLY SUPPORTED (retning)** / **UNVERIFIED (terskel 3.5, −20)** — tersklene er produktvalg |
| Agreeableness | Gjennomsnitt/5 → «høy hos begge = bra» (absoluttregel) | Delvis — lik høyt agreeabelhetsnivå assosieres med mindre konflikt | Nei (lav agreeabelhet er ikke «komplementær til høy») | **PRODUCT HEURISTIC** |
| Conscientiousness | Likhetsstraff \|Δ\|·25 | Usikkert/mikst i litteraturen (noen funn for likhet, noen for komplementaritet i rollefordeling) | Mulig, ikke dokumentert for Tosoms kontekst | **UNVERIFIED HEURISTIC** |
| Extraversion | Gap-straff kun utover 1 poeng (tolerer litt forskjell) | Delvis — ulik sosial rytme gir friksjon | Nei | **PRODUCT HEURISTIC** |
| Openness | Likhetsstraff Δ·20 | Ja — åpenhetslikhet er av de mest dokumenterte Big Five-knyttene til par-tilfredshet | Nei | **THEORETICALLY SUPPORTED (retning)** / **UNVERIFIED (koefisient 20)** |

**V2-regel:** Ingen av disse reglene endres i V2 (T.9). Men: (1) alle merkelapper
dokumenteres i F2-dokumentasjon og i Metoder («heuristikk, ikke validering»);
(2) populærpsykologisk «motsetninger tiltrekker hverandre» brukes **ikke** som
modellregel — den finnes ikke i koden og skal ikke lages; (3) post-launch
validering (F1.5 roadmap) kan bytte ut UNVERIFIED-deler med data-drevne former
— da som egen ACT med egen testing.

### T.11 — MODELLVERSJONING (arkitektur)

**Minimum:** `personalityModelVersion`: v1 = dagens BFI-avledede sett, v2 = nytt
selvstendig sett.

| Aspekt | Plan |
|--------|------|
| Lagringssted | Ny **additiv, nullable** Prisma-kolonne `personalityModelVersion Int?` på `Profile` (bakoverkompatibel: eksisterende rader = null = tolkes som v1). Alternativer vurdert: envelope i `bigFive`-JSON (`{v, scores}`) — null migrasjon, men verre til querying/testing; forkastet |
| Type/standard | `Int?`, 1 \| 2. Null → legacy → håndteres av T.12 |
| Prefill | Ny onboarding (etter V2-live) skriver alltid 2. Ingen backfill-kjøring: null er ærligere enn «vi antar at de gamle er v1» — men null og v1 er **identisk** i matching-bet (begge = v1-verden), så ingen logikk endres |
| API | `profile/setup` (der `bigFive` skrives, linjer 229/348 i dag) mottar versjon fra itemsettet; `match/breakdown` (linje 99) utstiller versjon i utdata (transparens) |
| Onboarding | `instruments.ts`: V2-items får nye id'er (`tp1`–`tp15`, «tosom personality»), v1-id'er beholdes kun for v1-lesing; `INSTRUMENT_SET_VERSION` bumpes (f.eks. `2026-XX-XX.v2`) |
| Matching | `readBigFive` utvides til å returnere `{scores, version} \| null`; `dimPersonality` bruker T.12-regel. `scorePersonalityCompat` uendret (mottar scores uavhengig av versjon) |
| Tests | PV2-02, 04, 07, 09, 10, 11 (T.20) |
| Export | `app/api/settings/export/route.ts`: **funn i denne audit: `bigFive` er i dag IKKE inkludert i eksporten** (kun `personality` og `deepProfileData`). V2 legger inn `Personlighet: {version, scores}` — også et GDPR-tilsyn (brukere kan eksportere det vi har om dem) |
| Prisma/DDL | Én trivial additiv migrasjon (`ALTER TABLE ... ADD COLUMN personalityModelVersion INT NULL`) — kjører i eksisterende CI «Apply DB Migrations (prod)». Ingen DDL før F2-implementasjon (PLAN MODE) |

### T.12 — V1/V2-PAIRING (deterministisk regel)

**Anbefaling: Strategi A+ — personlighetsdimensjonen brukes KUN når begge
profiler har samme modellversjon; ellers eksisterende fallback.**

| PAR | HENDELSE | HVGORDOM |
|-----|----------|----------|
| V2 ↔ V2 | `scorePersonalityCompat(v2scores)` | Normalt |
| V1 ↔ V1 (eller null ↔ null) | `scorePersonalityCompat(v1scores)` | Normalt — v1-profiler kan fortsatt matches mot hverandre med v1-data (de har ikke blitt «borte») |
| V1 ↔ V2 / null ↔ V2 / V1 ↔ null | **Ikke sammenlign personlighet** → `dimPersonality` faller tilbake til eksisterende ord-overlap-fallback (personality-tag eller 50) | Deterministisk; ingen falsk presisjon; ingen crosswalk |
| MISSING (ingen bigFive) | Samme fallback som i dag (`readBigFive = null`) | Uendret |

**Hvorfor ikke C (normalisert bridge)?** Ingen faglig forsvarlig kalibrering
eksisterer for å oversette v1-score (BFI-avledte items) til v2-skala (eget sett)
— en «bridge» ville være en ukalibrert transformasjon presentert som likhet.
**Hvorfor ikke B (rematch/re-onboarding før bruk)?** Re-onboarding er likevel
anbefalt (T.13) — men som *kampanje*, ikke som *blocking gate*: brukere som
ikke har re-svart skal ikke straffes med dårligere matching, de skal få den
eksisterende fallback.
**Testbarhet:** regelen er en 2×3-sannhetstabell — PV2-04 dekker den fullt.

### T.13 — LEGACY-BRUKERE + AKTIV REISE + KØ

**Kontekst (faktiske state-maskiner i skjemaet):**
`Profile.journeyState`: NOT_STARTED \| IN_PROGRESS \| COMPLETED \| PAUSED.
`MatchStatus` (per match): active \| ended \| expired (14 dager).
`onboardingComplete`: Boolean. Kø-berettigelse krever `onboardingComplete`.
Matching-runden (`app/api/cron/matching`) scorer par; `scoreRound`/cheapFeatures
er dealbreaker-prekalkulasjon (uavhengig av personlighet).

**Strategi per state:**

| STATE | HANDLING | BEGRENNING |
|-------|----------|------------|
| IDLE (NOT_STARTED / PAUSED / ingen aktiv match) | Re-onboarding-personalighet vises ved neste pålogging/session: «Vi har forbedret noen av spørsmålene våre. Før neste matchingrunde ber vi deg svare på personlighetsspørsmålene på nytt.» (15 items) | Ingen endring av ellers fullførte profiler |
| QUEUED (onboardingComplete, venter på matching, ingen aktiv match) | Samme som IDLE — prompt **før** neste matchingrunde. Inntil da: V1-fallback (T.12) sikrer at de ikke mister matching-kvalitet dramatisk (v1↔v1 eller v1↔null er intakt; kun v1↔v2-par går til fallback) | Ingen tvinging; prompt er inviterende, ingen deadline |
| IN_JOURNEY (MatchStatus=active) | **IKKE avbryt reisen.** Prompt utsettes til reisen er slutt (ended/expired/COMPLETED) eller naturlig sjekkpunkt (neste pålogging etter at samtalen er avsluttet) | PV2-08 garanterer dette |
| COMPLETED (reise fullført, `journeyState=COMPLETED`) | Prompt ved neste pålogging | — |

**Hvorfor re-onboarding fremfor «behold v1» som permanent løsning?**
(1) Pre-launch brukerbasis er liten — absolutt antall å be er lite. (2) V1-items
er lisensproblematisk tekst; å beholde dem som *aktivt* onboarding for nye
sessioner er uaktuelt, og å la v1-profiler for evig ha «mismatch-privilegium»
(skaper en permanent v1-klynge) er verkningsmessig dårlig. (3) Re-svar gir
v2-kvalitet til alle — da blir T.12s fallback-regel kun overgangslogikk.
**Data retention ved re-onboarding:** se T.14.

### T.14 — DATA RETENTION (v1)

- **Ikke slett v1-data** (rå svar + v1-score) automatisk: auditability
  (reproduksjon av historisk matching) + GDPR rett til tilgang krever at vi
  kan vise/eksportere det vi har. `personalityModelVersion` holder dem adskilt.
- **Aktiv bruk i brukertilfeller stopper:** v1-itemtekster skal ikke lenger
  vises i onboarding/eller andre aktive flater når V2 er live (gate G3). DB
  lagring av gammel item-teks (som svarhistorikk) er ikke «aktiv bruk», men
  dette punktet markeres **LEGAL REVIEW REQUIRED**: om v1-rå svar + v1-item-
  tekst skal beholdes i DB på sikt, eller anonymiseres etter en periode, skal
  avgjøres av lisens/privacy-ekspert (audit §O-profiler) — spesielt fordi
  v1-itemteksten er BFI-avledet.
- **Eksport:** V2-export inkluderer `Personlighet: { version, scores }` (T.11);
  v1-profiler eksporterer `{ version: 1, scores }`.
- **Sletting:** eksisterende GDPR-sletting-flow skal også slette
  `personalityModelVersion` (kolonne på samme rad — automatisk).

### T.15 — PRIVACY / CONSENT

- **Data som allerede lagres:** `bigFive` (5×1–5), rå svar (44 item-id),
  `deepProfileData` (attachment/values/ER/communication scores), `personality`
  (legacy tag). V2 legger til: `personalityModelVersion` + 15 nye rå svar
  (v2-id) + v2 `bigFive`-score.
- **Datakategori:** Selvrapportert personlighet er personopplysning, men
  **ikke** sensitiv data (art. 9) — så lenge items ikke screener for helse
  (T.4 forbud). V2-beholder denne egenskapen; PV2-06 (ingen kliniske labels)
  er en kontinuerlig guard. Hvis ekspert-review (G1) likevel finner helse-
  antydning i et item → itemet forkastes, ikke kategorien.
- **Consent:** Onboarding-samtykket dekker allerede profilsanking for matching.
  V2 endrer ikke formålet (matching) — **LEGAL REVIEW REQUIRED**: om endret
  items + ny kolonne krever oppdatert informasjonskapittel (høy sannsynlighet:
  ja for informasjonsplikt, nei for nytt samtykkegrunnlag) — avgjøres av
  GDPR-jurist (audit §O), ikke her.
- **Profiling (art. 22):** V2 forsterker ikke automatisert beslutning —
  matching-resultat er veiviser (F1-copy), menneske avgjør. Uendret fra v1.
- **Export/sletting:** T.11/T.14.

### T.16 — MODELLGRENSE: HVA TOSOM MÅLER, OG HVA DEN IKKE KAN KJENNE

**Fire nivå (høy → lav kontroll):**

1. **HARD COMPATIBILITY** — dealbreakers (kjønn/søker, alder, avstand, barn,
   høydegate, religion, livsstil «må stemme»): overstyrer matchskår. Faktiske
   felt i koden (L2026): `arbeidsrytme, bosted, reiser, dyr, skjerm, bil,
   kosthold, klima, alkohol, aktivitet` (+ `Viktig`-varianter), `height`,
   `religion`, `wantChildren`, `lifeRhythm`, eksplisitte preferanser/grenser.
   (Disse er valgbare — tom felt blokkerer aldri.)
2. **PRACTICAL / LIFESTYLE COMPATIBILITY** — livssituasjon-dimensjon (vekt 0.10):
   praktisk kompatibilitet av nivå 1s felt.
3. **RELATIONAL PATTERNS** — values (0.25), attachment (0.25), personality (0.15),
   communication (0.15), emotionRegulation (0.10): selvrapporterte mønstre.
4. **PHYSICAL ATTRACTION / CHEMISTRY** — **beregnes IKKE av Tosom.** Ingen input,
   ingen proxy, ingen «livsstil → kropp»-inferanse.

**Hard regler for V2 (PV2-14/15):**
- `aktivitet ≠ kroppsform`, `kosthold ≠ kroppsform`, `livsstil ≠ fysisk
  attraktivitet`. `bodyType` skal **ikke** gjeninnføres (slettet i et tidligere
  ACT; ingen felt i dagens skjema — verifisert).
- Ingen V2-personlighetsitem må antyde fysisk attraktivitet/utseende.
- Copy (F1 holder, T.17): «Fysisk tiltrekning inngår ikke i matchskåren — Tosom
  forsøker ikke å beregne den… Om fysisk tiltrekning og kjemi oppstår, må dere
  finne det ut selv.»

**Hvorfor grensa er ærlig, ikke svak:** matching skjer ikke «uten informasjon» —
før bildet har Tosom uttrykte preferanser, praktiske grenser, selvrapporterte
mønstre og livsstil (når brukeren selv gjør det relevant). Det kan redusere
åpenbare konflikter (nivå 1–3). Det kan **ikke** predikere kjemi (nivå 4).

### T.17 — PRODUKTPARADOKSET (faglig/public copy)

| Situasjon | Hva algoritmen kan | Hva den ikke kan |
|-----------|--------------------|------------------|
| A: Sterk fysisk tiltrekning + svak kompatibilitet | Intet — Tosom ser ikke tiltrekningen | Si at «matchskår lav = ikke start samtalen» |
| B: Sterk kompatibilitet + ingen fysisk tiltrekning | Intet — Tosom ser ikke tiltrekningen | Løfte scoren høyere fordi «alle feller stemmer» |

**Formulering for Metoder/om matching (utkast, endres i F2C med copy-ACT):**
«Matching velger hvem det kan være meningsfullt å undersøke — den bygger på det
dere forteller om dere selv, og den kan redusere noen åpenbare konflikter. Den
kan ikke vite om det blir kjemi. Menneskene avgjør om relasjonen faktisk
eksisterer.» — Ingen endring av dagens F1-copy kreves for dette; utkastet
reserveres til F2C der personlighets-copyen (V2) skjøres inn.

### T.18 — DAG 15 / 14-DAGERSREGEL: MÅLINGSPLAN (PROPOSAL, endres IKKE)

Regelen (bilde låses opp dag 15; match `expired` etter 14 dager uten at begge
har vært innom) endres **ikke**; ingen dag 7 innføres. Målinger som repositoryet
**i dag støtter** (eksisterende mekanismer):

| METRIC | STØTTE I DAG | KILDE |
|--------|--------------|-------|
| Image reveal (unlock) | **JA** | `journey.image_unlocked` event (recordEvent) + `imageShareAllowedAt` på Conversation (cron/journey, dag 15) |
| Image share etter unlock | **JA** (avledet) | `Message.imageKey` i conversation (består i cron/journey) — deling kan telles per match |
| Fortsettelse etter dag 15 | **JA** (avledet) | `JourneyStateLog` (from/to) + messages etter `imageShareAllowedAt` |
| Tidlig avslutning før/etter reveal | **JA** (avledet) | `MatchStatus.ended` + tid mot `imageShareAllowedAt` |
| Reise-fullføring | **JA** | `journeyState=COMPLETED` + JourneyStateLog |
| Avslutningsårsak | **IKKE** (ingen felt i dag) | **PROPOSAL** — krever eget ACT + juridisk/etisk vurdering (sensitivitet); ikke implementert i F2 |

Ingen ny innsamling av sensitive data i F2; alle F2-relevente metrics er
avledet fra eksisterende events/logg.

### T.19 — JOEL / FINKEL: FAGLIG YDMYKHET (bruk av forskning)

| KILDE | WHAT SOURCE SUPPORTS | WHAT IT DOES NOT SUPPORT | SAFE WORDING |
|-------|---------------------|--------------------------|--------------|
| Joel et al. 2020 (relationship-quality prediction fra tidlig pardata) | At tidlige parvariabler kan predikere **noen** aspekter av relasjonskvalitet — dvs. at personlighet/mønstre har reel (men beskjeden) prediktkraft | At ethvert spesifikt sett (Tosoms) kan predikere relasjonsutfall; at prediktkraft overføres til kommersiell matching uten egen validering; «bevis for Tosom» | «Forskning viser at visse personlighetsmønstre henger sammen med hvordan par forholder seg til hverandre. Vi bruker dette som veiviser — ikke som fasit. Vi har ikke egne data som viser at vår modell forutsier om dere blir et par.» |
| Finkel et al. 2012 (online dating: access, communication, matching) | At matching i online-dating bygger på **tilgang og kommunikasjon**, og at selve «match» er et lite signal av endelig utfall; at plattformens matching er et av flere nivå | At Tosoms matching er «det som regjerer»; at høy matchskår forutser relasjonslykke | «Matching velger hvem det kan være meningsfullt å undersøke. Det er dere — ikke algoritmen — som avgjør om noe er der.» |

Begge studiene brukes **kun** til å understøtte grensene (før-relasjon matching ≠
hvordan relationship quality faktisk utvikler seg), aldri som validering av
Tosoms modell. Ingen av dem er i F1s 8-kilde-sett; de kan nevnes i Metoder
**kun** dersom de Crossref-verifiseres i F2C (ellers utelatt fra public copy —
intet nytt kildesett uten verifisering).

### T.20 — ITEM WRITING BRIEF (for F2A — de ferdige items leveres IKKE i denne fasen)

Felles for alle dimensjoner: 15 items (3/trekk); **8–12 kandidat-items per trekk**
skrives i F2A (blind-review-redundans); leksenivå: 9.–10. klasse; korte setninger
(under 12 ord der mulig); første person; hverdagsmønster; ingen kliniske ord;
ingen verdilading; relasjonell kontekst der naturlig; sosial ønskeværdighet
risikovurdert per item.

| TREKK | DESIRED BEHAVIORAL DOMAIN | FORBIDDEN OVERLAP | FORBIDDEN WORDING | BALANCE | SOCIAL DESIRABILITY RISK |
|-------|---------------------------|-------------------|-------------------|---------|--------------------------|
| EXTRAVERSION | Hverdagsenergi: alenetid vs sosial kontakt; tempo; initiativ i sosiale situasjoner | COMMUNICATION (hvordan man snakker), ATTACHMENT (trygghetsbehov) | «fest», «midtpunktet», «får folk til å le» (BFI-nabolag), «sympatisk» | 1 alenetid, 1 sosial energi, 1 initiativ/tempo | Middel — ekstrovert svar kan fremstå som «norm»; items må like mye framstå som «riktige» for begge poler |
| AGREEABLENESS | Kompromiss i konkrete beslutninger: hvem gir, hvem holder, hvordan uenighet løses | COMMUNICATION (lytting/uttrykk), ATTACHMENT (angst/unnvikelse) | «snill», «god», «hensynsfull», «tilgivende» (BFI bfi8-nabolag), «mor» | 1 beslutningsmønster, 1 avklaring-tilt, 1 egen-linje | **Høy** — største risikodimensjon; blind review må spesifikt sjekke ønskeværdighet |
| CONSCIENTIOUSNESS | Struktur og oppfølging: planer, avtaler, «starter-fullfører» vs flytende | L2026-livsstil-felt (arbeidsrytme er livsstil), OPENNESS (nytt) | «ansvarlig», «grundig», «systematisk» (BFI-nabolag), «slaps» | 1 planlegging, 1 oppfølging, 1 fleksibilitet/orden | Middel-høy — strukturert svar belønnes lett; 1 item må være like «riktig» for den flytende polen |
| EMOTIONAL STABILITY | Tilbakehasting etter hverdagsfrustrasjon: intensitet og tid, håndterbarhet | **ER-dimensjonen (strategi: omtydning/undertrykking)**, klinisk screening | «angst», «panikk», «depresjon», «ofte», «mange ganger», «aldri kan jeg», «oppbrakt»/«tenner på ting» (BFI bfi9/10-nabolag) | 1 intensitet, 1 tid-for-ro, 1 håndterbarhet i par-kontekst | Middel — men **helse-stigma**-risikoen er den alvorligste; ekspertreview vurderer hvert item mot art. 9-grensa |
| OPENNESS | Nysgjerrighet på nye erfaringer: ny mat, ny rute, ny samtale, ny rutine | BFI-fantasi-fasett, INT-referanse, L2026-reiser (praktisk) | «fantasi»/«imagination» (BFI bfi4-nabolag), «nysgjerrig på mange ting» (bfi3-nabolag), «kunst» som status | 1 ny-erfaring, 1 perspektiv/ideer, 1 kjente-rammer-nytt | Lav — ingen åpen «riktig» pol, men «kultivert»-tone unngås |

**Blind review (obligatorisk i F2A):** én person som har BFI-10-engelsk som
referanse leser de 15 kandidatene og flagger enhver parafrasering/struktur-ekko.
Terskel: 0 items som er near-verbatim/close adaptation av BFI. V2s 3+3+3+3+3-
fordeling er strukturmessig forskjellig fra BFI 2+2+2+2+2, men trekktilordning
og posisjon (f.eks. «introvert-first») skal ikke kopieres 1:1.

### T.21 — EKSPERTREVIEW GATE (G1)

**Reviewpakke (fagpersonen må se svarenes bruk, ikke kun teksten):**
1. Konstruktbeskrivelser (T.3/T.4, frosne).
2. Kandidat-items (15 + alternativer) med provenance: «skrevet fra T.4, blind-
   reviewet, null BFI-parafraser».
3. Svarskala (T.6: 5-punkt passerskala, labels, intro-tekst).
4. Scoring (T.9: gjennomsnitt 3/trekk, ingen reversering, ingen normalisering,
   missing → null → fallback).
5. Vekting (0.15, T.9) + `scorePersonalityCompat`-former med T.10s merkelapper.
6. Missing-håndtering (T.8) + legacy-fallback.
7. Matching-applikasjon: `unifiedScore`-kjede, T.12 versjonsregel,
   resonansnivå.
8. Public copy (Metoder-utkast for V2, T.17, fysisk tiltrekning, heuristik-
   ærlighet).
9. Privacy/ethics (T.15, T.4 EMOTIONAL STABILITY-grensa).

**Gate-kriterium:** skriftlig godkjennelse av 1–9, eller godkjennelse med
betingelser som er implementert før G3. Ekspert = psykometriker + relasjons-
forsker-profilen fra audit §O (ikke samme person som skrev items).

### T.22 — TESTPLAN (PV2, implementeres i F2B/F2C)

| TEST | INNHOLD | FIL (plan) |
|------|---------|------------|
| PV2-01 | Ingen BFI-10-derived user-facing items: ingen av de 10 v1-engelske tekstene, ingen norske near-verbatim-oversettelser, ingen bfi1–bfi10-id i onboarding-flaten | Ny: `__tests__/personality-v2.test.ts` |
| PV2-02 | `personalityModelVersion` persisteres (1/2/null) og overlever API-roundtrip | `profile-setup-save.test.ts` + ny |
| PV2-03 | Missing ≠ neutral: tomt/partialt svar → `bigFive=null`; trekket får aldri 3 fra `effectiveValue` | `psychometrics-scoring.test.ts` (oppdatert) |
| PV2-04 | V1/V2-par-håndtering: full T.12-sannhetstabell, deterministisk, samme input → samme output | `unified-scorer.test.ts` (oppdatert) |
| PV2-05 | Scoring begrenset: alle items 1/5 → alle trekk 1/5; blandede → 1–5; ingen NaN | `psychometrics-scoring.test.ts` |
| PV2-06 | Ingen kliniske labels: items + scoring-utdata + copy inneholder ingen angrep/panikk/depresjon/forstyrrelse-terminologi (guard-grep) | Ny i `personality-v2.test.ts` |
| PV2-07 | Onboarding krever korrekt versjon: V2-steget krever alle 15 items besvart før Next; v1-id vises ikke | E2E: `onboarding.spec.ts` (oppdatert) |
| PV2-08 | Aktiv reise avbrytes ikke: profil med `MatchStatus=active` + v1-data → reise-flow uendret; v2-prompt utsettes | Ny i `personality-v2.test.ts` (state-mock) |
| PV2-09 | Legacy sikker: null-version profil → v1-fallback i matching, ingen crash, ingen 3-default | `unified-scorer.test.ts` |
| PV2-10 | Export inkluderer versjon+data korrekt (v1 og v2-tilfeller) | Export-route-test |
| PV2-11 | Full/cheap matching-ekvivalens opprettholdes: `scoreRound`-equivalence-test (dealbreaker-kjeden) grønn uendret | Eksisterende: `matching-score-round.test.ts` |
| PV2-12 | Ingen BFI-10-terminologi i public produkt (metoder, motpol, e-post, llms.txt): grep-guard | `metoder.test.tsx` (oppdatert) + grep-guard |
| PV2-13 | Metoder beskriver V2 korrekt: «egne spørsmål inspirert av Big Five-rammeverket» (ikke «i stil med BFI-10» når V2 er live), ærlig om heuristik + manglende validering | `metoder.test.tsx` (F2C) |
| PV2-14 | Ingen bodyType-inferanse: ingen bodyType-felt/labels i skjema, API, onboarding, matching (guard) | Ny i `personality-v2.test.ts` + grep |
| PV2-15 | Fysisk tiltrekning beregnes ikke: ingen attraktivt/utseende/chemistry-input i scoring; matchskår invariant mot slike input | `unified-scorer.test.ts` (invariant-test) |

### T.23 — IMPLEMENTASJONSVARIANTER

**MINIMAL SAFE (MS):**
- SCOPE: 10 nye items (2/trekk), versjonskolonne, T.12-regel, T.8 missing-retting,
  re-onboarding-prompt, Metoder-copy, PV2-01/02/03/04/07/09/12/13.
- FILES: `instruments.ts`, `scoring.ts` (missing), `unifiedScorer.ts` (version),
  `profile/setup`, `Step2Personlighet`, `metoder/page.tsx`, tests.
- DB: 1 additiv nullable-kolonne. USER: v1-brukere får prompt; nye bruker V2.
- MATCHING: uendret utover T.12/T.8. LEGACY: som T.13/T.14.
- EXPERT REVIEW: G1 på 10 items. TIME/RISK: minst (~1 uke implementasjon + G1).
  FAKE: 2/trekk gir lavere stabilite (T.5) — 15 %-signalet er svakere enn det
  burde være; sosial ønskverdighet i AGREEABLENESS er vanskeligere å balansere
  med bare 2 items.
- LAUNCH FITNESS: god nok, men gir svakere faglig fundament enn MODERATE for
  omtrent samme innsats.

**MODERATE (M) — anbefalt:**
- SCOPE: MS + **15 items (3/trekk)** med full T.20-brief + blind review +
  export-versjon (T.11) + dag 15-metrikknivå (T.18, kun avledet — ingen ny
  innsamling) + full PV2-suite (01–15) + T.10 merkelapp-dokumentasjon.
- FILES: MS + export-route, `match/breakdown` (version i utdata),
  `personality-v2.test.ts`, `metoder.test.tsx`-oppdateringer.
- DB: samme 1 kolonne. USER/MATCHING/LEGACY: som MS, men med 3/trekk-signalkvalitet.
- EXPERT REVIEW: G1 på 15 items + scoring-form. TIME/RISK: ~1,5–2 uker
  implementasjon + G1 (G1 er paralleliserbar med itemskriving).
- LAUNCH FITNESS: beste balanse — løser lisens-gaten fullt, gir best signal,
  uten å endre vekt/terskler/14-dagersregel.

**RIGOROUS (R):**
- SCOPE: M + empirisk pilot (test-retest på beta-brukere, α-beregning),
  eventuel vektrekalkulering, eventuell skala-endring, 2. runde ekspertiterasjon.
- DB/USER/MATCHING: M + mulig vektendring (renormalisering, terskelrekalibrering).
- EXPERT REVIEW: G1 + G1b etter pilot. TIME/RISK: uker→måneder; launch-bet;
  test-retest krever tid som pre-launch ofte ikke har.
- LAUNCH FITNESS: feil timing — pilot-ene hører hjemme post-launch
  (F1.5 §S.14 roadmap: «SAFE POST-LAUNCH VALIDATION»).

**Anbefaling: MODERATE.** Grunn: løser launch-gaten fullt (BFI-basert items
ute av alle aktive flater), faglig best grunnlag av de to launch-feasible
variantene (3/trekk), og bevisst uendret vekt/terskler holder regressjonsflaten
liten. RIGOROUS deler flyttes til post-launch roadmap.

### T.24 — LAUNCH GATES (F2, eksakte)

| GATE | KRAV | BLOKKERER |
|------|------|-----------|
| G1 | Ekspertgodsending (T.21, 1–9) skriftlig | F2A-items finalisering |
| G2 | PV2-01–15 grønn + full `npm run verify` grønn | F2B-merge |
| G3 | **BFI-10 tekst ute av alle aktive brukertilfeller** (grep-guard + e2e): v1-itemtekster vises ikke lenger i onboarding/eller andre flater; nye profiler skaper kun V2 | Launch |
| G4 | T.12-versjonsregel deterministisk (PV2-04) + missing-retting (PV2-03) i prod-kode | Launch |
| G5 | Metoder-copy oppdatert for V2 (PV2-12/13): «egne spørsmål inspirert av Big Five-rammeverket», ingen «i stil med BFI-10», heuristik-ærlighet | Launch |
| G6 | Re-onboarding-kampanje aktivert for v1-brukere (T.13) — eller dokumentert beslutning om at fallback alene er akseptabelt pre-launch | Launch (anbefalt) |
| G7 | Export inkluderer `personalityModelVersion` + scores (PV2-10) | Launch (GDPR-tilsyn) |
| G8 | LEGAL REVIEW REQUIRED-punktene (T.14 v1-retention, T.15 consent/informasjon) avklart av §O-ekspertene | Launch (juridisk) |

Post-launch (IKKE gates): empirisk validering, vektkalibrering, eventuel
UNVERIFIED-heuristikk-erstatning (T.10), dag 15-metrikkanalyse (T.18).

### T.25 — IMPLEMENTERINGSREKKEFØLDE (neste ACT-er, etter plan-godkjenning)

1. **F2A — ITEM DEVELOPMENT:** frosne konstruktdefinisjoner (T.3/4) → 8–12
   kandidater/trekk → blind review → 15 finale items → G1-reviewpakke (T.21).
   Leverer: items + godkjent review. Endrer IKKE kode.
2. **F2B — SCORING/VERSIONING/MATCHING:** `instruments.ts` V2 (+v1 arvervet),
   `scoring.ts` missing-retting, `unifiedScorer` versjonslogikk,
   `profile/setup` + `match/breakdown` versjonsfelt, Prisma-migrasjon,
   PV2-01–11 + 14/15. G2-grønn før merge.
3. **F2C — ONBOARDING/LEGACY/COPY:** `Step2Personlighet` → V2-steget, re-
   onboarding-prompt (T.13 state-logikk), Metoder-copy V2 (PV2-12/13),
   e2e-oppdateringer, G3/G5/G6.
4. **F2D — DOCS/GATES/DEPLOY-SIGT:** checklist-oppdateringer, G7/G8,
   lanseringsberedskapsbeslutning, deretter deploy-runde (egen fase).

**Leveransemapping (§32 → seksjon):** 1=T.3 · 2=T.3 · 3=T.20 · 4=T.5 ·
5=T.6 · 6=T.7 · 7=T.8 · 8=T.9 · 9=T.9 · 10=T.10 · 11=T.11 · 12=T.14 ·
13=T.13 · 14=T.13 · 15=T.12 · 16=T.13 · 17=T.14 · 18=T.15 · 19=T.16/T.22 ·
20=T.18 · 21=T.19 · 22=T.21 · 23=T.22 · 24=T.23(MS) · 25=T.23(M) ·
26=T.23(R) · 27=T.23 (anbefaling) · 28=T.24 · 29=T.25.

**Endring i denne seksjonen:** kun dokumentasjon (PLAN MODE). Ingen items,
kode, DB, onboarding, matching, copy, tests, commit, push, deploy.


## U. ACT F2A — ITEM DEVELOPMENT SUMMARY (24.10.2026, DOKUMENTASJON KUN)

Full leveranse: **`docs/PERSONALITY-V2-ITEM-DEVELOPMENT-v1.0.md`**
(STATUS: DRAFT – REQUIRES EXTERNAL EXPERT REVIEW).

| PUNKT | RESULTAT |
|-------|----------|
| Kildevalg | **A — fullstendig selvstendige Tosom-items** fra frosne konstruktdefinisjoner; IPIP kun som faglig benchmark (public domain), aldri som tekstkilde. BFI-referanse ikke brukt under skriving; likhetskontroll utført som separat post-frysing-steg |
| Konstrukt | 5 frosne definisjoner (EX/AG/CO/ES/OP) med forbud-områder; ES-items nøkkles høy = mer intensiv (mapper til dagens `neuroticism` uten scoring-endring) |
| Kandidater | **45** (9 per trekk), skrevet til formatreglene (ett innhold, kort, tendens, ingen alltid/aldri, ingen moralkode, ingen klinisk språk) |
| Avviste | **9**: AG4 (ATT-overlap), AG7 (ERQ-duplikat), AG8 (selvoppofrelse+ATT), ES5 (polaritetsforvirring), ES8 (ATT-overlap), ES9 (internt duplikat), OP6 (AG3-overlap), OP9 (motsatt skalerekjøring), EX3 (SD-skjevhet) |
| Finalister | **15 primære + 10 reserver** (se leveranse §12). G1-strukturelt valg: AG B-fasett (AG3) og OP C-fasett (OP4) ligger i reserve-sett |
| BFI-sjekk | **0 CLOSE ADAPTATION / 0 NEAR-VERBATIM** — 31 INDEPENDENT, 14 CONCEPTUALLY SIMILAR (forventet ved samme konstrukt; ingen delt syntaks/formulering). Markant endring fra v1 (CLOSE ADAPTATION på 6/10) |
| IPIP-provenans | Ingen IPIP-tekst brukt; konseptuelt nærhetsflagg på ~12 items dokumentert, alle beholdes som selvstendig; ingen kreditering nødvendig |
| Overlap mot aktive Tosom-spørsmål | Ingen overlevende kandidat med MATERIAL OVERLAP/DUPLICATE; AG/CO-items ACCEPTABLE RELATEDNESS (forholdingsstil ≠ kommunikasjonskompetanse) |
| Reverse-items | **Ingen** (bekrefter §T.7); polaritetsbalanse via nøytralt trade-off-innhold, ikke via motpoles-items (ugyldig i samme-retning gjennomsnitt) |
| Svarskala | Dagens 5-punkts «Passer ikke / Passer dårlig / Både og / Passer ganske godt / Passer helt» **bekreftet uendret**; ankre balanserte, ingen negasjonsproblem (0 reverse) |
| Vekt 0.15 | **Behold frem til G1**; G1-spørsmål 8 bindende for F2B; ingen vektendring i F2A (leveranse §14) |
| Ekspertpakke | Klar (leveranse §15): 15 innholdspunkt + 10 bindende G1-spørsmål (bl.a. fasettdekning AG/OP, ES-nøkkling, 0.15, tillatte påstander) |
| Kognitiv test | Plan klar (leveranse §13); utføres etter G1, før F2C; ingen data innsamlet i F2A |
| Gate-status | **G1 ÅPEN** (pakke klar), G4/G5/G8 ÅPENE; G2 delvis, G3/G6 ferdige på papir |
| F2B | Kan **forberedes**; implementering starter **først etter G1 + G8** |

**Ingen applikasjonskode er endret i F2A.** Ingen commit/push/deploy.
BFI-10-gate: **ULØST** juridisk (krever G8-advokatsvar), men F2A har
fjernet den faktiske avledningsrisikoen (0 CLOSE/NEAR-VERBATIM).

## V. ACT F2 (SIMPLIFIED) — PERSONALITY V2 IMPLEMENTATION SUMMARY (2026-10-24)

**Beslutning:** F2A brukes som råmateriale, ikke som fasit. Stort
psykometrisk forskningsprosjekt (G1-ekspertgjennomgang, kognitiv testing,
G8-advokatsvar som gate) gjennomføres **IKKE** før launch. Personlighetsdelen
er et **produktinstrument**: egne, hverdagslige spørsmål som gir et begrenset
personlighetssignal til matching. Ikke et psykologisk testinstrument; ingen
kliniske labels; ingen påstand om validitet.

### V.1 Det som ble implementert

| PUNKT | LØSNING |
|-------|---------|
| 15 items | `TOSOM_PERSONALITY` (p1–p15) i `lib/psychometrics/instruments.ts` — 3 per bredt område (sosial energi, samarbeid, struktur, hverdagsstress, nysgjerrighet). Ingen reversed items. Eksisterende 5-punkts «Passer ikke…Passer helt»-skala uendret |
| BFI-10 ut | V1-settet (10 near-adapterte items) fjernet fra aktiv flyt OG fra koden: ingen `bfi*`-items, ingen BFI-tekster i produktflater, ingen BFI-navn i aktiv copy (metoder, onboarding, instrument). Gammle rå-svar beholdes i `psychometricAnswers` (historikk), men skåres og vises ikke lenger |
| Missing-data | **FIXED:** `scorePersonality()` returnerer `null` ved ett eller flere manglende/ugyldige V2-svar — MISSING ≠ 3 ≠ «Både og». `bigFive` skrives ikke i DB uten fullt sett; matching faller da til deterministisk ordoverlapp-fallback |
| Versjonering | Additiv nullable `Profile.personalityModelVersion Int?` (2 = V2; null/1 = legacy). Migration `20261024000000_add_personality_model_version` (additiv, kun `ALTER TABLE … ADD COLUMN`). Applied mot lokal dev- og test-DB. **IKKE kjørt mot produksjon** — skjer med neste deploy-runde |
| Legacy brukere | Ingen crosswalk, ingen matematisk konvertering. Gammle (v1) svar kan ikke prefylle nye items (ulike IDs) → brukeren svarer de 15 nye på neste onboarding-omgang (profilredigering eller «start ny reise»). Frem til da er V2-komponenten stengt for vedkommende (safe fallback) |
| Aktiv reise | Uendret. Scoring er ren (ingen sideeffekter, ingen journey-referanser i motoren). V2 gjelder neste gang brukeren skal tilbake til matching; ingen journey-redesign |
| V1/V2 | `readBigFive()` krever `personalityModelVersion === 2` på **begge** profiler — v1↔v1, v1↔v2 og null↔V2 bruker alle den eksisterende trygge fallback (ordoverlapp / 50). Ingen sammenligning av ulike modeller |
| Vekt | **0.15 — PRODUCT HEURISTIC, NOT EMPIRICALLY CALIBRATED** (ikke presentert som forskningsbasert) — beholdt i F2; ingen terskel/andre vekt endret. Kartlegging: vektene summerer til 1.0 og totalen er vektet sum over [0,100]. Redusjon til 0.10 uten re-normalisering senker alle scores med opptil 5 poeng mot MIN_SCORE=40 (terskel-rekalibrering); re-normalisering endrer de andre 5 vektene (DI-2). Begge veier = «stor rekalibrering» → STOPP og rapporter, som krevd i ACT F2 §17. Vektredusjon blir et post-launch-dataavgjørelse |
| Metoder | Oppdatert: «Tosoms egne spørsmål inspirert av brede personlighetstrekk fra Big Five-rammeverket», «ikke et standardisert eller klinisk personlighetsskjema», «begrenset kompatibilitetssignal, ikke en vurdering av hvem du er». BFI-10-kilden (Rammstedt & John) fjernet fra kildelista (7 gjenværende verifiserte DOI-kilder). Ingen validitetspåstander; research-tonen senket |
| Eksport | `personalityModelVersion` eksportert i `/api/settings/export` (Profil-seksjonen) |
| Tester | Ny `__tests__/personality-v2.test.ts` (SIMP-01…SIMP-15) + DB-assertjon i `profile-setup-save.test.ts` (versjon lagres). Eksisterende suites oppdatert for nytt itemssett |

### V.2 Itemvalg: avvik fra F2A-primærsettet (3 endringer)

| F2A-primær | erstattet av | Grunn (ACT F2 §9) |
|------------|--------------|-------------------|
| AG2 «Jeg gir gjerne litt, for at vi skal komme til enighet.» | **p5** «Jeg prøver å se ting fra den andres side, også når jeg ikke er enig.» | AG2 flagget SD-HIGH («jeg skjønner åpenbart hvilket svar som gjør meg til et bedre menneske») → nøytralere B-fasett-kandidat fra reserve; fyller samtidig AG B-fasett-gapet fra F2A Review A |
| CO3 «Jeg følger opp det jeg sier at jeg skal gjøre.» | **p9** «Jeg holder fast i det som er avtalt, selv om noe nytt frister.» | CO3 flagget SD-HIGH → nøytral trade-off-kopi fra reserve (avtale vs. fristelse) |
| OP2 (nye erfaringer) | **p15** «Jeg liker endring i hverdagen.» | Fyller OP C-fasett (variasjon vs. kjente rammer) som F2A Review A krevde; OP2 var svakt differensiert fra OP1 |

ES1–ES3 beholdes (SD LOW/LOW/MEDIUM; kognitiv testing dempet til
etterlaunch-observasjon per forenklingen).

### V.3 Forenklet status (ACT F2 §29)

```
PERSONALITY V2:        IMPLEMENTED
BFI-10 ACTIVE USE:     REMOVED
MISSING-DATA BUG:      FIXED
MODEL VERSIONING:      IMPLEMENTED
LEGACY USERS:          HANDLED
METODER COPY:          CORRECT
LEGAL/IP REVIEW:       LOW-RISK FOLLOW-UP (ikke blocker)
```

### V.4 LEGAL FOLLOW-UP (lav risiko, ikke launch-blocker)

BFI-10-problemet er praktisk løst: ingen BFI-10-items i aktiv flyt, ingen
BFI-navn i aktiv produktmodell, fullstendig eget itemssett med dokumentert
provenance (F2A §7: 0 close adaptation / 0 near-verbatim), ingen påstand om
at Tosom bruker eller har validert BFI-10. Gjenstående: skriftlig
bekreftelse (G8) på at «conceptually similar» status er tilstrekkelig for
kommersiell lisenssikkerhet — lavrisiko follow-up, ikke en gate. IPIP
(public domain) er tilgjengelig som sikkerhetsreferanse hvis likhetsvurdering
noensinne kreves.

**Verifisering (utført før commit-stopp):** `npm run verify` (lang + tsc +
jest), `npm run lint`, `npm run build` — resultater i ACT-rapport. Ingen
commit, ingen push, ingen deploy. Produksjons-DB (Prisma) får
`personalityModelVersion` med neste ordinære deploy-runde (additiv,
nullable, ingen dataendring).

