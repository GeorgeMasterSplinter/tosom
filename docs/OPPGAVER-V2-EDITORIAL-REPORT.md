# OPPGAVER V2 — EDITORIAL REPORT

> **Status:** Redaksjonell rapport for Oppgaver Library V2 (135 oppgaver holdt, innhold gjennomsyret).
> **Dato:** 29.10.2026 · **Utført av:** Cline, under ACT-PIPELINE §1–§30.
> **Grunnlag:** `docs/BLI-KJENT-OG-OPPGAVER-INVENTORY-v1.0.md` (V1, TASK-001–TASK-135) verifisert mot `app/chat/data/tasks.ts` før og etter.
> **Mapping:** `docs/OPPGAVER-INVENTORY-v2.0.md` (T2-001 … T2-135, kilde per oppgave).

---

## 1. Oppsummering

- Struktur uendret: **9 kategorier × 15 = 135** oppgaver. Category IDs, navn, ikon og farger beholdt.
- **OLD TOTAL: 135 · NEW TOTAL: 135 · CATEGORIES: 9 · PER CATEGORY: 15.**
- Kilde-type (per ny oppgave): **UNCHANGED 25 · REWRITTEN 70 · NEW 30 · REPLACED 10.**
- **40** opprinnelige formuleringer fjernet (10 erstattet + 30 fjernet). 95 gamle oppgaver videreført.
- Tone vasket fra «terapeutisk / AI-generert / konstruert» til **LEK · NYSGJERRIGHET · SAMTALE · SMÅ HISTORIER · LAVTERSKEL KONTAKT**.
- Foto-reveal (PHOTO DAY 8) intakt: TASK-056 (utseende) fjernet; ingen oppgave ber om å beskrive egen fysisk utforming.
- Sensitive-content: «fetish», «verste …», «døde de/sov de», «kontakt fortid», «død eller levende» fjernet.
- Ingen copyrighted lyrics (kun sang/artist/tittel som konsept).

## 2. Kriterier (fra brief)

1. **Sendbart:** Hver oppgave skal være noe en ekte bruker faktisk sender i chatten.
2. **Lavterskel:** Frivillig, lett å forstå, konkret, gjennomførbar med ren tekst; ingen konkurranse, ingen plikt.
3. **Ikke-terapi:** Ingen bekjennelser, traumer, skam/skyld, «dypeste/verste», selvutviklingsspråk, forholdsterapi, eller spørsmål som krever at deltakerne allerede er et par.
4. **Variasjon:** Ikke 15 like varianter av én ramme (spesielt Bygg en historie → 15 ulike aktiviteter; To sannheter → 15 ulike innholdsvinkler).
5. **Foto-reveal guard:** Oppgavene skal ikke omgå FIRST WEEK WITHOUT PHOTOS ved å få brukeren til å beskrive hele utseendet.
6. **Sensitive-content guard:** Ingen traumer/overgrep/eksplicit seksuelt/sensitive helse/hemmeligheter/selvskading/ulovlig/PII.
7. **Bokmål:** Naturlig bokmål, ingen AI-artefakter, ingen Nynorsk.

## 3. Prosess

| Steg | Hva | Verifisering |
|---|---|---|
| 1 | Full lesing av V1-inventar (TASK-001…135) + datafil | Manuelt + TASK-ID-kryssjekk |
| 2 | Klassifisering per oppgave: ubrettet / omvretta / nytt / erstatt | Mapping i Inventory v2.0 §D/§E |
| 3 | Skrive 135 V2-oppgaver med kriteriene i §2 | Startmønster- + dedup-gjennomgang |
| 4 | Sensitive + foto-reveal review (008, 013, 045, 056, 078, 108, 116, 125, 128, nordisk) | §K/§L i Inventory |
| 5 | Patch av `app/chat/data/tasks.ts` (9 arrays + 2 kommentarer) | `git diff --stat` |
| 6 | OT-01…OT-18-tester | `npx jest oppgaver-library` → 18/18 |
| 7 | Bli Kjent-fryse + full verifisering | BQ-01…15 (uendret) + hash-kontroll |
| 8 | Hærlig lesegjennomgang av alle 135 (menneskeøye) | Dette dokumentet |

## 4. Sensitive / flagget oppgaver

| V1 | Problem | V2 |
|---|---|---|
| TASK-008 | «en uke der alt du ønsket ble nektet» (dystre, ingen payoff) | Fjernet; nytt lett dilemma |
| TASK-013 | «ta bort alle vanene … dobbelt så ofte» (konstruert) | Fjernet; nytt lett dilemma |
| TASK-045 | «melding til alle som har såret deg» (+ "noengang") | T2-045: garantert en trygg dag |
| TASK-056 | Utseende (bryter PHOTO DAY 8) | T2-056: tre filmer |
| TASK-078 | «fetish» | T2-078: liten vane som kanskje virker rar |
| TASK-091/097/098/099 | «Motiver på ett ord» / «tynn pels» / «enrett-toretter» / «festet stemning» | T2-091/097/098/099 (språkvasket) |
| TASK-108 | 'Landsby / Stum di / Dance Monkey' | T2-120: farge som passer humøret |
| TASK-116 | Gjett fødselsår (alder i profilen) | T2-116: gjett hva jeg gjør nå |
| TASK-125 | ukeend mandag/tirsdag + «og så døde de» | T2-127: bygg en helg som går galt |
| TASK-128 | «Refrengets» + krevde sangtekst | T2-128: fortsett «Og så…» i seks setninger |

## 5. Per kategori — før/etter

1. **Kunne-vil-du-si** — beholdt dilemma-identiteten; de to negative/eksistensielle (008, 013) ut med 8 lette hverdags-dilemmaer (by/bygd, plan/spontant, tid/penger, morgen/kveld, komfort/eventyr, dessert, grønt lys).
2. **Fortell meg om** — sterkest i V1; 8 beholdt ubrettet, 7 strammet. «Varme små historier» med variasjon (minne, fremmed, mat, sted, person, sang, gave, ritual).
3. **Hvis du** — leken hypoteter beholdt; «kontakt fortid» og «såret deg» ut, erstattet med fri uke + trygg dag.
4. **To sannheter** — kjernen beholdt; 15 ulike innholdsvinkler (barndom, reise, mat, jobb, hobby, skole, talenter, steder, rare ting, filmer, lørdag, sov, morgen, folk). Utseende byttet til filmer.
5. **Sang** — beholdt mest; format-variéret (velg / send tittel / mini-playlist / gjett / forklar / velg mellom to). «kjenne noe dypt i kroppen» og «partneren din» fjernet.
6. **Uventet om meg** — full ombygging til «små overraskelser» (overraskende bra/dårlig på, vane, upopulær preferanse, guilty pleasure uten skam, venner vet, samler på, liten særhet, ritual, mat-overraskelse). «fetish» borte.
7. **Nordisk kveld** — særpreg beholdt, kraftig språkvask (Design/Motiver/tynn pels/enrett-toretter/festet stemning borte). Tone: norsk, varm, litt leken — ikke Hyttenorge-reklame.
8. **Gjetter du meg?** — ekte små chatspill med klar A/B/svaramåte; TASK-108 og fødselsår borte; «Maks 5/7/4»-regelhefte strammet til enkle regler.
9. **Bygg en historie** — fra 15 varianter av én ramme til 15 ulike aktiviteter (historie, film, karakter, absurd dag, oppskrift, tradisjon, helg, fortsett-setning, eventyr, sted, dialog, drømmested, falsk nyhet, bok, avslutt). 125/128 omskrevet.

## 6. Verifisering og endret fil-liste

### Testresultater
- `npx jest oppgaver-library` → **18/18 PASS** (OT-01 … OT-18).
- `npx jest bli-kjent-library` → **15/15 PASS** (BQ-01 … BQ-15, uendret).
- `npm run verify` / `npm run lint` / `npm run build` → se leveranse-melding.

### Statistikk
| Mål | V1 (135) | V2 (135) |
|---|---|---|
| Eksakte duplikater | 0 | 0 |
| Sensitive/flagget oppgaver | 12+ | 0 |
| Foto-reveal (utseende) | 1 (TASK-056) | 0 |
| Kilde-type | — | 25 ubrettet / 70 omvretta / 30 nye / 10 erstattet |

### Endrete filer
1. `app/chat/data/tasks.ts` — hele biblioteket (9×15) + 2 kategori-kommentarer.

### Nye filer
1. `__tests__/oppgaver-library.test.ts` — OT-01 … OT-18.
2. `docs/OPPGAVER-INVENTORY-v2.0.md` — kanonisk inventory T2-001 … T2-135 + mapping.
3. `docs/OPPGAVER-V2-EDITORIAL-REPORT.md` — dette dokumentet.

### Uendret (bevisst)
- `app/chat/components/OppgaverPanel.tsx` — fullt data-drevet; ingen hardkodet antallsavhengighet; ingen endring nødvendig.
- `app/questions/data/questions.ts`, `app/chat/components/BliKjentPanel.tsx`, `app/questions/page.tsx` — **BLI KJENT V2 FROZEN** (SHA-256 uendret).
- Truth-claims om «135 oppgaver i 9 kategorier» (FAQ, Reisen, RUNTIME-DOCUMENTATION-TRUTH-PLAN) — forblir sanne; ingen endring nødvendig.
- `docs/BLI-KJENT-OG-OPPGAVER-INVENTORY-v1.0.md` — beholdes som historisk V1-baseline (referert fra V2-inventaret).

### Gjenstående for mennesker (ACT §30)
- Commit: Avventer godkjenning. Ingen commit/push/deploy utført i denne sesjonen.