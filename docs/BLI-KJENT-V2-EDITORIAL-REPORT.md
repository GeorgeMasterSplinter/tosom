# BLI KJENT V2 — EDITORIAL REPORT

> **Status:** Redaksjonell rapport for Library V2 (240 → 180 spørsmål).
> **Dato:** 28.10.2026 · **Utført av:** Cline, under ACT-PIPELINE §21–§33.
> **Grunnlag:** Fem George-review-runder (18.10–28.10.2026), `docs/BLI-KJENT-OG-OPPGAVER-INVENTORY-v1.0.md` (v1, Q-001–Q-240), verifisert mot `app/questions/data/questions.ts` før og etter.
> **Mapping:** `docs/BLI-KJENT-INVENTORY-v2.0.md` (Q2-001 … Q2-180, kilde per spørsmål).

---

## 1. Oppsummering

- Biblioteket redusert fra **240 (12×20)** til **180 (12×15)** spørsmål.
- **55** spørsmål beholdt ubrettet, **40** omvretta (same theme, ny ordlyd), **84** helt nye, **1** erstattet (Q-220 → Q2-165). **145** opprinnelige spørsmål fjernet.
- «Hva er noe du...»-mønstret redusert fra **56 %** (134/240) til **22 %** (40/180) — under 25 %-taket.
- Terapistemmen fjernet fra spørsmålene: ord og farger som «sårbar», «tillate deg selv», «kropp og sinn», «skyldfølelse», «grunnleggende» finnes ikke lenger i spørsmålene (kategori-etiketten «Følelser & sårbarhet» er fast per akt-inngrep og beholdes).
- De 20 «Hva er noe du lurer på om...»-spørsmålene i Moden (Q-221–Q-240) erstattet med 15 naturlige, konkrete relasjonsspørsmål (frihet, økonomi, husarbeid, uenighet, forventninger).
- Q-108 («Hvordan snakker du om noe som overgrep deg tidligere?») **fjernet** (se §4).
- Ingen Nynorsk, ingen AI-artefakter, ingen «2026/18+/2024»-referanser i biblioteket (verifisert med `npm run verify:lang` + grep).

## 2. Kriterier (fra George-review, 18.10–28.10)

1. **Naturalitet:** Spørsmålene skal lyde som noe en voksen person faktisk stiller på en hyggelig kveld — ikke som et skjema, ikke som en terapeut.
2. **Ingen mekanisk repetisjon:** Maks ~25 % kan åpne med «Hva er noe du...». Språklig variasjon: «Hvordan ser X ut...», «Er du...», «Hvilken...», «Hva pleier...», «Når...», «Hvor...».
3. **Ingen terapistemme:** Ingen klinisk eller selvhjelps-vokabular. Følelser skal navngis konkret og nøytralt (nervøs, irritert, sentimental), ikke abstrakt (sårbar, usikker som mønster).
4. **Near-duplikater fjernet:** «Hva er noe som gjør deg mest X?»-serien beholdt kun to eksempler (lykkelig, rolig) med hver sin vinkel, resten erstattet med konkrete situasjonsspørsmål.
5. **Ingen AI-artefakter:** Ingen «Nå er ærligheten...», ingen meta-spørsmål om AI, ingen 2024/2026-datoer, ingen «18+/20+/21+»-referanser.
6. **Bokmål:** Ren Bokmål. Nynorsk-ord er forbydde i koden — vakt av `scripts/verify-language.mjs` (CI) og BQ-testene.
7. **Ingen sensitive/traume-spørsmål i fritekst-biblioteket:** Spørsmål om overgrep hører til i fagmiljø, ikke i et kjennskapsspill (beslutning i 4. review-runde).
8. **Dypt nok:** Hver kategori må inneholde både lette og litt dypere spørsmål. Dybden skal komme fra konkrethet, ikke fra klinisk språk.

## 3. Prosess

| Steg | Hva | Verifisering |
|---|---|---|
| 1 | Full lesing av v1-inventaret (Q-001–Q-240) + datafil | Manuelt + Q-ID-kryssjekk |
| 2 | Klassifisering: ubrettet / omvrett / fjern / erstatt per kategori | Mapping-tabell i Inventory v2.0 §C |
| 3 | Rounding av 15 per kategori med kriteriene i §2 | Startmønster-statistikk (script) |
| 4 | Sensitive-spørsmåls-review (Q-108, Q-061, Q-114) | Beslutning §4 |
| 5 | Patch av canonical source + alle truth-claims | `git diff --stat` (rapport §6) |
| 6 | BQ-01…BQ-15-tester | `npx jest bli-kjent-library` → 15/15 |
| 7 | Full verifisering | `npm run verify` (lang + typecheck + full jest-satt) |
| 8 | Hærlig lesegjennomgang av alle 180 (menneskeøye) | Dette dokumentet |

## 4. Sensitive spørsmål

| Spørsmål | V1 | Beslutning V2 | Rationale |
|---|---|---|---|
| Q-108 «Hvordan snakker du om noe som overgrep deg tidligere?» (Trygghet) | Fjernet | **Fjernet** | Bli kjent er et kjennskapsspill, ikke en terapiramme. Å stille et overgrepsspørsmål av en tilfeldig partner er ubehagelig og uklokt. Ingen erstatning i biblioteket. |
| Q-061 «Hva er noe som får deg til å åpne deg for noen?» (Nærhet) | Fjernet | Fjernet; temaet dekket av Q2-047/Q2-054 | Abstract terapiformulering. |
| Q-114 «Hvordan snakker du om noe som ikke er greit for deg?» (Trygghet) | Beholdt | **Beholdt** (Q2-081) | Generelt grensespørsmål, ikke traume. Nøytralt og trygt. |
| Q-073 «Hva er noe du trenger å si for å slappe av i et intimt øyeblikk?» (Nærhet) | Beholdt | **Beholdt** (Q2-059) | Intimt, men konsentrert på komfort — ikke sensasjon, ikke klinisk. |
| Q-064/Q-069 (berøring/øye-kontakt) | Beholdt | Omvrett (Q2-049/Q2-051) | Fysisk nærhet er naturlig i «bli kjent»-konteksten; formuleringene er konkrete og lette. |

## 5. Før/etter — representative eksempler

### 1. Personlighet & identitet
- **Før (Q-008):** «Hva er noe du alltid har lurt på om deg selv?» → **Etter (Q2-006):** «Er du mest du selv på morgenen eller om kvelden?»
- **Før (Q-018):** «Hva er noe du ønsker å bli bedre i, i forhold til deg selv?» → **Fjernet** (selvoptimering-tonen). Erstattet med **Q2-015:** «Hvordan vet du at du har hatt en god dag?»
- **Før (Q-007):** «Hva er noe du aldri vil slutte med, uansett hva?» → **Etter (Q2-014):** «Hva er noe du brenner for, men som du sjelden snakker om?»

### 2. Forhold & tilknytning
- **Før (Q-022):** «Hva er noe du ønsker å lære av en partner om relasjoner?» → **Etter (Q2-026):** «Hva hjelper deg å komme deg videre etter en uenighet?»
- **Før (Q-034):** «Hvordan påvirker avstand en relasjon for deg?» → **Etter (Q2-030):** «Hvordan er avstand for deg i et forhold — et pluss eller et minus?»
- **Nytt (Q2-024):** «Hva faller mest naturlig for deg: å vise omtanke eller å ta imot den?»

### 3. Kommunikasjon & konflikter
- **Før (Q-047):** «Hvordan håndterer du det å be om unnskyldning?» → **Etter (Q2-041):** «Hva gjør du når du vet at du har tatt feil og må si unnskyld?»
- **Før (Q-053):** «Hvordan liker du at noen bekrefter at de har forstått deg?» → **Etter (Q2-043):** «Hvordan merker du at noen virkelig har forstått deg?»
- **Fjernet:** Q-042, Q-046, Q-049, Q-050, Q-052, Q-054, Q-055, Q-056, Q-060 (alle «hva du ønsker at partneren skal si»/«hva du har lært om»-mekanikker)

### 4. Nærhet & intimitet
- **Før (Q-061):** «Hva er noe som får deg til å åpne deg for noen?» → **Fjernet** (terapi)
- **Før (Q-064):** «Hvordan liker du at noen berører deg når du ikke er i et intimt øyeblikk?» → **Etter (Q2-049):** «Hvilken type berøring liker du best — et klem, et knuff eller en hånd på skulderen?»
- **Før (Q-079):** «Hva er noe du har lært om kropp og sinn som overrasket deg?» → **Fjernet** (klinisk). **Etter (Q2-060):** «Er det noe du synes er viktig å si fra om, før dere kommer nærmere hverandre?»

### 5. Følelser & sårbarhet
- **Før (serien Q-092–Q-099):** «Hva er noe som gjør deg mest lykkelig/rolig/sint/trist/engstelig/forelsket?» → **Etter:** «lykkelig» og «rolig» beholdt med hver sin vinkel (Q2-061/Q2-069); resten erstattet med konkrete situasjoner: «Hva gjør deg lettere nervøs enn det kanskje burde?» (Q2-070), «Hva kan irritere deg mye mer enn det egentlig fortjener?» (Q2-071), «Hva kan gjøre deg litt sentimental?» (Q2-073)
- **Før (Q-081):** «Hva er noe du trenger å tillate deg selv å føle, men ikke alltid gjør?» → **Fjernet** (therapistone)

### 6. Trygghet & grenser
- **Før (Q-111):** «Hva er noe du har lært om å sette deg selv først?» → **Etter (Q2-089):** «Hvor god er du til å sette deg selv først?»
- **Før (Q-106):** «Hvordan håndterer du det å bli satt overrasket i en relasjon?» → **Etter (Q2-088):** «Hvordan tar du det når noen overrasker deg?»
- **Fjernet:** Q-108 (overgrep, se §4), Q-103, Q-107, Q-109, Q-110, Q-115, Q-117–Q-120 («lært om»-mekanikker)

### 7. Lek & humor
- **Før (Q-122):** «Hva er noe du alltid latterliggjør hos deg selv?» → **Etter (Q2-092):** «Hva er noe ved deg selv du alltid må le litt av?»
- **Før (Q-134):** «Hva er noe du alltid har tenkt på, men aldri spurt noen om?» → **Etter (Q2-100):** «Hva er et spørsmål du alltid har hatt lyst til å stille noen, men aldri gjort?»
- **Fjernet:** Q-129 (blitt lei deg for), Q-130 (håper aldri skjer), Q-131 (villet prøve med en venn), Q-133, Q-135, Q-137 — alle skjemamessige «noe du alltid...»-linjer

### 8. Barndom & røtter
- **Før (Q-146):** «Hva er noe fra familien din som du vil beholde, og noe du vil slippe?» → **Etter (Q2-119):** «Hva er noe fra familien din som du gjerne vil ta med deg videre?»
- **Fjernet:** Q-141 (fortsatt preger deg — terapeutisk), Q-145 (ønsket at noen skulle fortalt deg — litt sårende), Q-155 (noe du mistet for tidlig — tungt), Q-156 (straffet som barn), Q-158 (ville ønsket du hadde fått lov til — tungt)
- **Nytt:** Q2-115 «Hva var favorittmaten din som barn, og liker du den fortsatt?» — lett, varm, konkret

### 9. Verdier & prioriteringer
- **Før (Q-171):** «Hva er noe du vil prioritere over karriere?» → **Etter (Q2-122):** «Hva er noe du velger framfor karriere — uten å tenke lenge?»
- **Fjernet:** Q-173–Q-180 (alle «du vil at verdenen skal lære av deg»/«bygge i denne verdenen»-linjene — store, abstrakte løfter)
- **Nytt:** 13 konkrete, hverdagslige verdier-spørsmål (Q2-123 … Q2-135), bl.a. «Hva bruker du gjerne penger på uten å angre?» og «Hva er det du reiser deg for — bokstavelig talt eller ikke?»

### 10. Fremtid & drøm
- **Før (Q-186):** «Hva er en drøm du har latt ligge, men som ennå lever?» → **Etter (Q2-143):** «Hva er noe du har lagt på isen, men fortsatt har lyst til å gjøre?»
- **Fjernet:** Q-181–Q-187, Q-189–Q-200 (19 av 20) — alle store livsdrømmer («bli husket for», «skape som varer lenger enn deg», «endre på måten verden fungerer») erstattet med nøyale, konkrete fremtidsscenarier (en vanlig tirsdag om to år, en reise du drømmer om, en ting du gjerne vil vite)
- **Ubrettet:** Q-188 «Hva er noe du vil bygge sammen med noen du er glad i?» — den eneste som allerede var konkret og varm

### 11. Hverdag & rutine
- **Før (Q-210):** «Hva er din største svakhet når det gjelder å ta deg selv?» → **Etter (Q2-158):** «Hva er noe du glemmer å gjøre for deg selv, selv om du vet du burde?»
- **Før (Q-220):** «Hva er noe du ikke lenger tål i en relasjon som du tidlig tålte?» → **Etter (Q2-165):** «Er du mer den ryddige eller den rotete — og når gir du opp?»
- **Fjernet:** Q-207 (gjør alene som gir energi), Q-208 (kveld i parforhold), Q-214 (å si at du trenger tid alene), Q-216 (morgen sammen), Q-217 (takke kroppen)

### 12. Moden nysgjerrighet
- **Før (Q-221):** «Hva er noe du lurer på om meg som du ikke har turte å spørre?» → **Etter (Q2-166):** «Hva er noe du lurer på om meg, som du ikke har turt å spørre om?» (grammatikkreparasjon)
- **Fjernet:** Q-222–Q-240 (alle 19 «Hva er noe du lurer på om...»-linjene) — mekanisk og repetitivt
- **Nytt:** 14 konkrete, voksne relasjonsspørsmål (frihet, økonomisk trygghet, husarbeid, uenighet, langvarige forhold), bl.a. «Hva betyr frihet for deg, når du er sammen med noen?» (Q2-167) og «Hva er noe du håper at dere alltid kan le av sammen, også etter mange år?» (Q2-180)

## 6. Verifisering og endret fil-liste

### Testresultater
- `npx jest bli-kjent-library` → **15/15 PASS** (BQ-01 … BQ-15).
- `npm run verify` (language-guard + typecheck + full jest-satt) → se testkjøring i leveranse-meldingen.
- `npm run lint`, `npm run build` → se testkjøring i leveranse-meldingen.

### Statistikk (målt med script mot datafilen)
| Mål | V1 (240) | V2 (180) |
|---|---|---|
| «Hva er noe du...»-start | 134 (56 %) | 40 (22 %) |
| Eksakte duplikater | 0 | 0 |
| Near-duplikater (normalisert) | mange | 0 |
| Terapiord (sårbar, tillate deg selv, kropp og sinn, ...) i spørsmålene | 20+ treff | 0 treff |

### Endrede filer
1. `app/questions/data/questions.ts` — hele biblioteket (12×15) + header
2. `app/questions/page.tsx` — header-kommentar (8 → 12 kategorier, 15 per kategori)
3. `app/chat/components/BliKjentPanel.tsx` — header-kommentar (12×15 = 180)
4. `app/reisen/page.tsx` — copy (240 → 180)
5. `ai/system_prompt.md` — §3.3 (12 kategorier / 15 spørsmål per kategori)
6. `docs/RUNTIME-DOCUMENTATION-TRUTH-PLAN-v1.0.md` — 3 linjer oppdatert (B, D, status-tabell)
7. `docs/ACT-STATE.json` — leveranse + updatedAt

### Nye filer
1. `__tests__/bli-kjent-library.test.ts` — BQ-01 … BQ-15
2. `docs/BLI-KJENT-INVENTORY-v2.0.md` — kanonisk inventory Q2-001 … Q2-180 + mapping
3. `docs/BLI-KJENT-V2-EDITORIAL-REPORT.md` — dette dokumentet

### Utendrevet (ikke endret)
- `public/llms.txt` — inneholdt ingen tellingsclaim; ingen endring nødvendig.
- `app/questions/layout.tsx`, `app/questions/components/CategoryButton.tsx` — data-drevne; ingen tellingsclaim.
- `docs/BLI-KJENT-OG-OPPGAVER-INVENTORY-v1.0.md` — beholdes som historisk v1 (referert fra v2-inventaret).
- `docs/GRAND-FINALE-v1.0.md` — datert leveranse-dokument (24.10) med status per dagens leveranse; arkiveres historisk ved neste dok-konsolidering.

### Gjenstående for mennesker (ACT §33)
- **Hærlig lesegjennomgang:** George skal lese alle 180 spørsmål høyt/med menneskeøye og godkjenne tone. Testene vakter struktur og sanitet, ikke smak.
- **Commit:** Avventer Godkjenning. Ingen commit/push/deploy utført i denne sesjonen.

## 7. Final human surgical review (28.10.2026)

George + Copilot har gjennomført siste manuelle lesing av alle 180 spørsmål.
Denne runden endrer KUN de eksplisitt listede spørsmålene — biblioteket er ikke
regenerert, og ingen andre spørsmål, kategorier, IDs eller antall er endret.

- **Spørsmål endret: 34** — Q2-027, Q2-028, Q2-029, Q2-030, Q2-036, Q2-049, Q2-057,
  Q2-059, Q2-087, Q2-090, Q2-104, Q2-106, Q2-107, Q2-110, Q2-113, Q2-122, Q2-132, Q2-134, Q2-139,
  Q2-145, Q2-146, Q2-148, Q2-150, Q2-169–Q2-174, Q2-176–Q2-180.
- **Ingen kategorier endret:** fortsatt 12 kategorier × 15 spørsmål = **180** totalt.
- **Fordeling:** Forhold 4 · Kommunikasjon 1 · Nærhet 3 · Trygghet 2 · Lek 1 ·
  Barndom 4 · Verdier 3 · Fremtid 5 · Moden 11.
- **Human review status:** FULLFØRT — alle 180 lest og godkjent; de øvrige 146
  spørsmålene (inkl. Q2-175) er låst og uendret.
- Inventory v2.0 synket: 14 korreksjoner merket «rewritten», 2 triviale
  (Q2-036, Q2-107) beholdt kilde-type, 17 «Nytt» uendret i type.
- Mål for runden: fjerne grammatikkfeil («et klem», «mest trygt», «hva var de feil i»),
  formalitet/terapipreg («krenket i en relasjon», «intimt øyeblikk»,
  «favorittbeskjeftigelse»), AI-poetikk («reiser deg for», «vil overraske deg med
  deg selv») og fantompar-antagelser i Moden («hvis dere bor sammen», «ta dere tid til»).
- **Micro cleanup (28.10.2026, etterpå):** Q2-087 og Q2-139 korrigert ytterligere — totalt 34 endret. Biblioteket er naå FROZEN (LIBRARY STATUS: FROZEN).
