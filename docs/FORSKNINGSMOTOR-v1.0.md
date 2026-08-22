# TOSOM — FORSKNINGSMOTOR v1.0

**Dato:** 2026-08-22
**Commit:** `6041525`
**Status:** Gjennomføringsdokument. Klart for ACT.
**Kanonisk kilde:** `TOSOM-SUPER-MASTERPLAN-v1.0.md`
**Lukker:** A-6 i `JURIDISK-GRUNNLAG-v1.0.md`, M-13, og deler av `MATCHING-TUNING-PLAN-v1.0.md`
**Arbeidsmetode:** `ACT-PIPELINE-v1.0.md` — ett steg om gangen, patch-format, verifisering mellom hver.

---

## 0. Hva dette er

Tosom sier «forskningsbasert matching» fem steder. Koden teller ord.

Dette dokumentet lukker gapet — ikke ved å myke språket, men ved å **bygge det vi allerede sier**.

Tolv steg (F-1 … F-12) i fem faser. Beta er utsatt til dette er ferdig. Ingen er invitert ennå, så vi slipper å be noen gjøre onboarding to ganger.

**Én regel styrer rekkefølgen: kode først, tekst sist.** Publiserer vi forskningssiden før motoren er bygget, står vi verre enn i dag — da har vi en detaljert og dokumenterbar påstand som ikke stemmer.

---

# DEL I — HVOR VI STÅR

## 1. Hva motoren faktisk gjør

### 🔴 AVVIK

Verifisert i `lib/matching/unifiedScorer.ts`:

| Dimensjon | Vekt | Metode |
|---|---|---|
| Verdier | 0,25 | Ordoverlapp mellom fritekst |
| Personlighet | 0,20 | Ordoverlapp. Ingen Big Five-akser. |
| Relasjonsstil | 0,15 | Strengsammenligning + tre hardkodede par |
| Kommunikasjon | 0,15 | Ordoverlapp |
| Fremtidsvisjon | 0,10 | Ordoverlapp |
| Grenser | 0,05 | Ordoverlapp |
| Emosjonelle behov | 0,05 | Ordoverlapp |
| Livsrytme | 0,03 | Ordoverlapp |
| Modenhet | 0,02 | Ordoverlapp |

**Ingen validerte instrumenter finnes.** Søk på ECR, BFI, PVQ, IPIP, TIPI, ERQ, Bowlby, Ainsworth, Hazan, Shaver gir null treff i `app/`, `lib/` og `prisma/`. Ingen Likert-skalaer i onboarding.

### Hvorfor ordoverlapp er svakt

| Problem | Følge |
|---|---|
| Samme ord, ulik mening | To som skriver «trygghet» om helt ulike ting får full uttelling |
| Lengde belønnes | Den som skriver mye får høyere score enn den som skriver kort |
| Synonymer teller ikke | «Rolig» og «avslappet» gir null match |
| Ingen retning | Kan ikke skille «likhet er bra» fra «likhet er risiko» |

Det siste er det alvorligste. To sterkt engstelige personer som bruker samme ord om utrygghet får i dag høy score — mens forskningen sier det motsatte.

## 2. Onboarding i dag

75 felt fordelt på 13 steg. Mye brukes ikke til noe:

| Seksjon | Felt | Brukes i scoring? |
|---|---|---|
| `humor` | 5 | ❌ Nei |
| `preferanser` | 11 | Delvis |
| `kjærlighetsspråk` | 5 | ❌ Nei |
| Fritekst ellers | ~30 | Kun som ordoverlapp |

**Vi har rom.** Instrumentene krever ~44 items — mindre enn det som allerede spørres om.

## 3. Feil i eksisterende dokumentasjon

| Sted | Feil |
|---|---|
| `docs/archive/onboarding-system-overview.md` | Påstår «Big Five light» om steg 2a. Steget er fem fritekstfelt uten skala. |
| `lib/matching/weightConfig.ts` | Død kode. `getWeights()` har null kallsteder. |
| `config/matching.ts` | `MATCH_WEIGHTS` brukes ikke av `unifiedScore()` |

Ryddes i fase 5.

---

# DEL II — INSTRUMENTENE

## 4. Hva vi tar i bruk

| Rammeverk | Instrument | Items | Lisens |
|---|---|---|---|
| Big Five | **BFI-10** (Rammstedt & John, 2007) | 10 | Fritt tilgjengelig |
| Tilknytning | **ECR-S** kortform (Wei et al., 2007) | 12 | Fritt for ikke-kommersiell forskning |
| Verdier | **PVQ-10** etter Schwartz | 10 | Fritt, brukt i European Social Survey |
| Emosjonsregulering | **ERQ-6** (Gross & John, 2003), kortet | 6 | Fritt tilgjengelig |
| Kommunikasjon | Egne items på Gottman-**prinsipper** | 6 | Vi skriver dem selv |

**Til sammen 44 items.**

### 🔴 Om Gottman

Gottman Institute lisensierer sine skjemaer. **Vi kan ikke kopiere items.**

Vi kan bygge på *prinsippene* fra forskningen — reparasjonsforsøk, respons på invitasjoner til kontakt, konfliktstil — og skrive egne spørsmål. Forskningssiden må derfor si «prinsipper fra Gottmans forskning», aldri «vi bruker Gottman-testen».

### Om oversettelse

Alle fire instrumenter finnes i validerte norske versjoner. Jeg kan ikke garantere at formuleringene under er identiske med dem.

Items skrives derfor i rolig norsk i ToSom-tone, merket `[OVERSETTELSE — bør kvalitetssikres]` i koden. De fungerer fra dag én og kan justeres senere.

### Om BFI-10

To items per trekk gir lavere reliabilitet enn lengre skjemaer. Det er en kjent og dokumentert avveining.

**Vi sier derfor «kortform av Big Five» på forskningssiden, ikke «Big Five».**

## 5. Skalaen

Alle items bruker samme fempunktsskala:

| Verdi | Tekst |
|---|---|
| 1 | Passer ikke |
| 2 | Passer dårlig |
| 3 | Både og |
| 4 | Passer ganske godt |
| 5 | Passer helt |

Én skala gjennom hele onboardingen. Brukeren lærer den én gang.

---

# DEL III — BYTTET

## 6. Felt inn, felt ut

| I dag | Felt | Blir til | Items | Netto |
|---|---|---|---|---|
| `personlighet` fritekst | 5 | BFI-10 | 10 | +5 |
| `tilknytning` fritekst | 5 | ECR-S | 12 | +7 |
| `livsstil` + verdier | ~8 | PVQ-10 | 10 | −2 |
| `modenNysgjerrighet` | 5 | ERQ-6 | 6 | +1 |
| `kommunikasjon` | 5 | 6 egne items | 6 | +1 |
| `humor` | 5 | **Fjernes** | 0 | −5 |
| `preferanser` | 11 | Kuttes til det motoren bruker | 4 | −7 |
| Fritekst ellers | ~30 | 1–2 per steg | 12 | −18 |
| **Sum** | **75** | | **~60** | **−15** |

**Onboarding blir kortere,** og alt som gjenstår har en funksjon.

### Fritekst beholdes — men til noe annet

Fritekstsvarene forsvinner ikke. De gir varme, og de er det partneren faktisk leser i profilen.

De slutter bare å bære scoringen alene. Det er en bedre arbeidsdeling: **skalaer måler, fritekst forteller.**

## 7. Ny vekting

| Dimensjon | I dag | Ny | Begrunnelse |
|---|---|---|---|
| Verdier | 0,25 | **0,25** | Sterkeste prediktor for langsiktig samsvar |
| Tilknytning | — | **0,25** | Best dokumenterte funn i parforskning. Mangler helt i dag. |
| Personlighet | 0,20 | **0,15** | Reell effekt, men svakere enn ofte antatt |
| Kommunikasjon | 0,15 | **0,15** | Gottmans kjerneområde |
| Emosjonsregulering | — | **0,10** | Påvirker konflikthåndtering direkte |
| Livssituasjon | 0,05 | **0,10** | Praktisk kompatibilitet er undervurdert i dag |

Ni dimensjoner blir seks. Lettere å forklare, og hver har et instrument bak seg.

**Den viktigste endringen er tilknytning på 0,25.** Engstelig + unnvikende er blant de mest robuste negative funnene i parforskning, og motoren ser det ikke i dag.

## 8. Kompatibilitetsreglene

Dette er kjernen. Likhet er ikke alltid bra.

### Tilknytning (0,25)

| Kombinasjon | Score | Grunnlag |
|---|---|---|
| Trygg + trygg | 100 | Sterkeste kombinasjon |
| Trygg + engstelig | 75 | Trygg partner demper |
| Trygg + unnvikende | 75 | Samme mekanisme |
| Engstelig + engstelig | 45 | Gjensidig forsterkning |
| Unnvikende + unnvikende | 40 | Ingen søker nærhet |
| **Engstelig + unnvikende** | **25** | **Best dokumenterte negative mønster** |

Beregnes fra ECR-S sine to akser: angst og unnvikelse. Under 3,0 på begge = trygg.

### Personlighet (0,15) — per trekk

| Trekk | Regel |
|---|---|
| Nevrotisisme | Lav hos begge. Høy hos begge er risiko. |
| Medmenneskelighet | Høy hos begge |
| Planmessighet | Likhet — stort avvik gir hverdagsfriksjon |
| Ekstroversjon | Moderat forskjell er greit |
| Åpenhet | Likhet, moderat vekt |

Dagens `dimensionPersonality` ville gitt to sterkt nevrotiske full uttelling for å bruke samme ord.

### Verdier (0,25)

Korrelasjon mellom to PVQ-profiler, ikke ordtelling. To personer kan bruke helt ulike ord om samme verdi — og motsatt.

### Emosjonsregulering (0,10)

| Mønster | Vurdering |
|---|---|
| Høy reappraisal hos begge | Positivt |
| Høy undertrykking hos begge | Risiko |
| Stor forskjell i undertrykking | Konfliktpotensial |

---

# DEL IV — STEGENE

## F-1 — Instrumentdefinisjoner

**Fil:** `lib/psychometrics/instruments.ts` (ny)
**Fase:** 1

Alle 44 items som data: id, tekst på norsk, hvilket trekk de måler, om de er reverserte.

```ts
export interface Item {
  id: string;
  text: string;
  trait: string;
  reversed: boolean;
}

/** BFI-10 — Rammstedt & John (2007). [OVERSETTELSE — bør kvalitetssikres] */
export const BFI10: Item[] = [
  { id: 'bfi1', text: 'Jeg er stille og reservert.', trait: 'extraversion', reversed: true },
  { id: 'bfi2', text: 'Jeg stoler lett på andre.', trait: 'agreeableness', reversed: false },
  // … åtte til
];
```

Tilsvarende for `ECR_S`, `PVQ10`, `ERQ6` og `COMMUNICATION` (våre egne).

### Verifisering
```bash
npx tsc --noEmit
```

---

## F-2 — Skåring

**Fil:** `lib/psychometrics/scoring.ts` (ny)
**Fase:** 1

Rå svar (1–5) inn, trekkskårer ut. Håndterer reverserte items.

```ts
export interface BigFiveScores {
  openness: number;          // 1–5
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface AttachmentScores {
  anxiety: number;    // 1–5
  avoidance: number;  // 1–5
  style: 'secure' | 'anxious' | 'avoidant' | 'fearful';
}

export function scoreBigFive(answers: Record<string, number>): BigFiveScores;
export function scoreAttachment(answers: Record<string, number>): AttachmentScores;
export function scoreValues(answers: Record<string, number>): ValueProfile;
export function scoreEmotionRegulation(answers: Record<string, number>): ERScores;
```

Tilknytningsstil utledes: begge akser under 3,0 = `secure`. Angst over, unnvikelse under = `anxious`. Motsatt = `avoidant`. Begge over = `fearful`.

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
```

Ny testfil `__tests__/psychometrics-scoring.test.ts` med kjente inn- og utverdier, inkludert reverserte items.

---

## F-3 — Datamodell

**Fil:** `prisma/schema.prisma`
**Fase:** 1
**Type:** 🔶 **BACKEND — krever godkjenning**

```prisma
model Profile {
  // … eksisterende felt

  /// Rå svar fra alle instrumenter: { "bfi1": 4, "ecr3": 2, ... }
  psychometricAnswers Json?

  /// Utregnede skårer, lagret for å slippe ny beregning per matcherunde
  bigFive             Json?
  attachment          Json?
  valueProfile        Json?
  emotionRegulation   Json?

  /// Versjon av instrumentsettet, for framtidig migrering
  psychometricVersion String?
}
```

Additivt. Ingen eksisterende felt røres. Profiler uten skårer faller tilbake til dagens metode (F-8).

### Verifisering
```bash
npx prisma migrate dev --name add_psychometrics
npx tsc --noEmit
npx jest --ci --silent
```

---

## F-4 — Skala-komponenten

**Fil:** `components/onboarding/ScaleQuestion.tsx` (ny)
**Fase:** 2

Fempunktsskala i ToSom-stil: rolig, glass, gull på valgt. Ingen tall vises — kun ordene fra §5.

Tilgjengelighet: `role="radiogroup"`, piltaster, synlig fokusmarkering.

### Verifisering
```bash
npx tsc --noEmit
```

---

## F-5 — Onboarding bygges om

**Filer:** `app/onboarding/steps/*`
**Fase:** 2
**Avhenger av:** F-1, F-4

Byttet fra §6, steg for steg. `Step7Humor.tsx` fjernes helt.

**Ingen nye steg.** Items legges inn i de stegene som allerede finnes, slik at antall skjermbilder ikke øker.

### Tone
Skalaspørsmål skal føles som refleksjon, ikke test. Introduksjonen til hver bolk skriver vi i ToSom-språk: «Noen påstander. Svar det som kjennes riktigst — det finnes ingen fasit.»

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
npm run build
```

---

## F-6 — Lagring

**Filer:** `app/api/onboarding/save/route.ts`, `app/api/profile/setup/route.ts`
**Fase:** 2

Rå svar lagres i `psychometricAnswers`. Skårer beregnes ved fullført onboarding og lagres.

Valideringsskjemaene i `lib/validation/onboarding-setup.ts` oppdateres: fjernede felt ut, items inn.

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
```

---

## F-7 — Nye dimensjonsfunksjoner

**Fil:** `lib/matching/dimensions.ts` (ny)
**Fase:** 3
**Avhenger av:** F-2

Reglene fra §8 i kode. Én funksjon per dimensjon, alle returnerer 0–100.

```ts
export function scoreAttachmentCompat(a: AttachmentScores, b: AttachmentScores): number;
export function scorePersonalityCompat(a: BigFiveScores, b: BigFiveScores): number;
export function scoreValueCompat(a: ValueProfile, b: ValueProfile): number;
export function scoreEmotionRegCompat(a: ERScores, b: ERScores): number;
export function scoreCommunicationCompat(a: CommScores, b: CommScores): number;
export function scoreLifeSituationCompat(a: Profile, b: Profile): number;
```

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
```

Ny testfil `__tests__/dimensions-compat.test.ts`. **Må inneholde en test på at engstelig + unnvikende gir lav score** — det er hele poenget med endringen.

---

## F-8 — Motoren kobles om

**Fil:** `lib/matching/unifiedScorer.ts`
**Fase:** 3
**Avhenger av:** F-7

Ni dimensjoner blir seks, med vektene fra §7.

**Fallback beholdes:** har en profil ikke psykometriske skårer, brukes dagens ordoverlapp for den dimensjonen. Ingen bruker blir uten score.

```ts
const DIMENSION_WEIGHTS = {
  values:            0.25,
  attachment:        0.25,
  personality:       0.15,
  communication:     0.15,
  emotionRegulation: 0.10,
  lifeSituation:     0.10,
} as const;
```

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
```

`__tests__/unified-scorer.test.ts` må oppdateres — den tester dagens ni dimensjoner.

---

## F-9 — Resonansnivåer

**Fil:** `lib/matching/resonanceLevel.ts`
**Fase:** 3

Tersklene (80/65/50) er satt for ordoverlapp-fordelingen. Skårede instrumenter gir en annen fordeling.

**Kalibreres etter beta, ikke nå.** Steget er å legge inn en kommentar om at tersklene skal etterprøves, samt logge fordelingen via `recordMetric` fra observability-planen.

Invariant I-12 holder: brukeren ser ord, aldri tall.

---

## F-10 — Forskningsgrunnlaget

**Fil:** `app/forskningsgrunnlag/page.tsx` (ny)
**Fase:** 4
**Avhenger av:** F-8 — **skrives først når motoren faktisk gjør dette**

### Innhold

1. Vi driver ikke egen forskning — vi bygger på etablerte modeller
2. De seks dimensjonene, med vekt og begrunnelse
3. Instrumentene vi bruker, med kilde
4. Hva resonans er — og hva det ikke er
5. Kilder
6. Hva vi ikke lover

### Kildene

| Rammeverk | Kilde |
|---|---|
| Big Five | Rammstedt & John (2007), *Journal of Research in Personality* 41(1) |
| Tilknytning | Bowlby (1969) · Ainsworth et al. (1978) · Hazan & Shaver (1987) · Wei et al. (2007) |
| Verdier | Schwartz (1992), *Advances in Experimental Social Psychology* 25 |
| Emosjonsregulering | Gross & John (2003), *Journal of Personality and Social Psychology* 85(2) |
| Kommunikasjon | Gottman & Levenson (1992), *Journal of Personality and Social Psychology* 63(2) |

**Alle merkes `[LENKE VERIFISERES]`.** Forfatter, verk og år er korrekt; URL-er må bekreftes levende før publisering.

### Språket

| Skriv | Ikke skriv |
|---|---|
| «kortform av Big Five» | «Big Five» |
| «prinsipper fra Gottmans forskning» | «vi bruker Gottman» |
| «forskningsbaserte dimensjoner» | «vitenskapelig bevist» |
| «en veiviser» | «en fasit» |

---

## F-11 — Språkgjennomgang

**Filer:** `(landing)`, `slik-fungerer-det`, `priser`, `om-oss`, `blogg`
**Fase:** 4
**Lukker:** J-5 og M-13

De fem stedene der «forskningsbasert» står, får nå dekning — men presiseres og lenkes til `/forskningsgrunnlag`.

Kvalitetspåstandene fra `JURIDISK-GRUNNLAG` §4 mykes samtidig: «én god match» → «én match», «noen som faktisk passer deg» → «én person, valgt med omtanke».

Lenke legges i footer under «Om Tosom».

---

## F-12 — Opprydding

**Filer:** flere
**Fase:** 5

| # | Handling |
|---|---|
| 1 | Fjern `lib/matching/weightConfig.ts` — død kode |
| 2 | Fjern `MATCH_WEIGHTS` fra `config/matching.ts` |
| 3 | Rett «Big Five light»-påstanden i `docs/archive/onboarding-system-overview.md` |
| 4 | Fjern obsolete konstanter i `config/matching.ts` |
| 5 | Oppdater `docs/reference/` med de seks nye dimensjonene |

Per dokumentasjonsregel 4: ingenting slettes uten godkjenning, post for post.

---

# DEL V — GJENNOMFØRING

## 9. Rekkefølge

| Fase | Steg | Resultat |
|---|---|---|
| **1 — Grunnlag** | F-1, F-2, F-3 | Instrumenter og skåring finnes. Ingen UI-endring. |
| **2 — Onboarding** | F-4, F-5, F-6 | Brukeren svarer på items |
| **3 — Motoren** | F-7, F-8, F-9 | Matchingen bruker skårene |
| **4 — Tekst** | F-10, F-11 | Vi sier det vi gjør |
| **5 — Opprydding** | F-12 | Død kode ute |

**Fase 4 kan ikke tas før fase 3 er verifisert.** Det er hele poenget med rekkefølgen.

## 10. Verifisering per steg

Etter **hver** patch:

```bash
npx tsc --noEmit
npx jest --ci --silent
```

Etter F-3, F-5 og F-8 også `npm run build`.

**Etter F-8, manuell kontroll:** lag to testprofiler med engstelig og unnvikende tilknytning. Scoren skal være lav. Er den ikke det, er reglene feil implementert.

## 11. Hva som ikke endres

| Område | Hvorfor |
|---|---|
| Dealbreakere | Egen mekanisme, fungerer |
| Avstandsberegning | Uavhengig av psykometri |
| Kø og matcherunde | Vi endrer scoringen, ikke prosessen |
| Invariant I-12 | Brukeren ser fortsatt ord, aldri tall |
| Invariant I-2 | Fortsatt ingen bilder i matching |
| Reisen | Berøres ikke |

**Ingen av de 14 invariantene brytes.** Motoren blir mer presis, ikke annerledes i natur.

## 12. Risiko

| # | Risiko | Tiltak |
|---|---|---|
| 1 | Onboarding oppleves som en test | Rolig tone, ingen tall, ingen progresjonspress |
| 2 | 44 items er for mange | Målt mot 75 felt i dag — det blir kortere |
| 3 | BFI-10 har lav reliabilitet | Sies eksplisitt: «kortform» |
| 4 | Vektene er anslag | Kalibreres etter beta med ekte data |
| 5 | Oversettelser ikke validert | Merket i kode, kan kvalitetssikres senere |
| 6 | Tersklene passer ikke ny fordeling | F-9 logger fordelingen for kalibrering |

## 13. Sluttord

I dag sier vi «forskningsbasert» og teller ord. Etter dette gjør vi det vi sier.

Gevinsten er ikke bare juridisk. Motoren blir faktisk bedre: den vil kunne se at to engstelige mennesker ikke nødvendigvis passer sammen, at lav nevrotisisme hos begge er et godt tegn, og at to mennesker kan dele verdier uten å bruke de samme ordene.

Det er verdt å utsette beta for.

---

*Følgedokumenter: `JURIDISK-GRUNNLAG-v1.0.md` (A-6), `MATCHING-TUNING-PLAN-v1.0.md`, `OBSERVABILITY-PLAN-v1.0.md`*
