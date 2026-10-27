# PLAIN NORWEGIAN COPY FINAL — v1.0 (27.10.2026)

Redaksjonell gjennomgang av offentlig copy: menneskelig norsk, ingen
overclaim, ingen stald produktfakta. Kun copy — ingen produktendringer.

## A. Verdict

- 1 REAL stald/falsk produkt-claim-klasse funnet og fikset:
  «kjenner dere hverandre som mennesker» ved dag 8 (landing, FAQ,
  slik-fungerer-det) — PLAIN-08.
- 0 aktive 30-dagers-/dag-15-claim (verifisert mot HEAD + prod;
  tidligere funn var cache/false positive).
- 1 PLAIN-09-manifestsetning funnet i /hvorfor (REAL BUG) og fjernet.
- Matching-overclaim («svinger sammen», «riktig takt», resonans-som-sannhet)
  funnet i landing + metoder — fjernet/snakket ned.
- Manifest-tone i /hvorfor og /om-oss erstattet med konkrete
  produktbeskrivelser. Tone: ENKEL / ROLIG / VOKSEN / KONKRET / ÆRLIG.
- Legal-sider (/vilkar /personvern /cookies /samtykke) UENDRET.

## B. Editorial rules (brukt i denne rundingen)

1. Hver setning må fortelle noe konkret — ellers slettes.
2. Ingen følelsespreskripter («kjenner dere hverandre», «åpne deg»,
   «bekreftelsen»).
3. «Ikke X. Ikke Y. Bare Z.» kun der X/Y/Z er faktiske produktvalg.
4. Overclaim-ord: «passer deg» kun i «forsøker å finne / passer godt nok»-kontekst.
5. Terminologi: KOBLING (to personer), MATCHING (prosessen), REISE (14 dager).
6. CTA-standard: «Lag profilen din. Neste matcherunde er natt til lørdag.»

## C. Truth bugs found (REAL vs false positive)

| # | Finding | STATUS |
|---|---------|--------|
| 1 | «kjenner dere hverandre som mennesker» (landing, FAQ, slik-fungerer-det) | REAL BUG → fikset (PLAIN-08) |
| 2 | «Fordi mennesker ikke er skapt for å gå gjennom livet alene» (/hvorfor) | REAL BUG → fjernet (PLAIN-09) |
| 3 | «de to som svinger sammen» (landing) | REAL BUG → fjernet (PLAIN-10) |
| 4 | Resonans som rytmer/riktig takt/forsterker (metoder) | REAL (AI-like) → forenklet |
| 5 | 30-dagers reise / dag 15-bilde | ALREADY FIXED (0 treff i HEAD) |
| 6 | «Gammelt tre, nye grener» / BFI-10 / PVQ-10 / ERQ-6 claims | ALREADY FIXED (ef85a91) |
| 7 | «30 dager» i /cookies | CORRECT FACT (sesjonstokkens levetid, ikke reise) |
| 8 | 240 spørsmål/12 kat. + 135 oppgaver/9 kat. (reisen/FAQ) | VERIFIED TRUE mot questions.ts/tasks.ts |

## D. /hvorfor (hovedjobb)

BEFORE: Hero = ensomhets-manifest. Kjerneverdier = «Modenhet / Trygghet /
Tilstedeværelse». «Hva tosomhet betyr» = 4 poetiske avsnitt. Kort med
«Bare deg — og én person som passer deg» (match-promise) og
«kjemi kommer fra dybde ikke overflate».

AFTER: Hero = godkjent kjernetekst (én person / bilder fra dag 8 /
god start). Tre kort = faktiske produktvalg (én person om gangen /
samtalen før bildet / reise på to uker). «Tosomhet» holdt som begrep men
beskrevet konkret. Listene inneholder nå produktfakta
(kobling natt til lørdag, bilde fra dag 8, 14 dager). Match-promise
erstattet med «Vi vil heller la deg vente enn å koble deg tilfeldig.»
CTA: «Klar til å starte? / Lag profilen din. Neste matcherunde er natt til lørdag.»


## E. /motpol

Verifisert: 7/14-modell korrekt i alle sammenligningsrader
(«Samtalen først, bildet på dag 8», «Guidet 14-dagers reise»).
Tone allerede i mål fra MOTPOL-ACT («Ikke fordi det andre gjør er feil»,
«Ja, utseende betyr noe. Derfor kommer bildet. Bare ikke først.»).
Ingen endringer. comparisonRows- og tone-guardene (motpol.test.tsx) intakte.

## F. /metoder

Verify-first: §15-kjerneteksten («Bakgrunn for spørsmålene») allerede
implementert (ef85a91) — ikke gjenåpnet. Poetisk resonanscopy
(«to rytmer», «riktig takt», «forsterker hverandre», «små, jevne steg i
rett takt») var fortsatt AKTIV → erstattet med konkret definisjon
(«Tosoms navn på den samlede matchvurderingen … brukes bare som
støtte»). Alle seks guard-stringene i metoder.test.tsx bevart.
Kilder: uendret («Kilder og bakgrunn»-framing eksisterer allerede).
Defensiv copy: to dedikerte seksjoner («Hva modellen kan … ikke kan vite»
og «Hva vi ikke lover») — begge test-guards, ikke kuttet ytterligere.

## G. Other pages

- LANDING: 6 steps-kort + intro + CTA-område konkretisert.
  «Velvære først»→«Ditt tempo», «Bygget for dybde»→«En guidet reise»,
  matching-kort: «Vi bruker det du har svart om …» (ingen resonans-måling).
  Bildekort: ingen følelsesclaim.
- REISEN: fakta intakte (240/12, 135/9, dag 8, dag 14). Fjernet
  «Bare dere to, i et rom med tid og struktur», «Først trygghet, så
  ansikt. Først samtalen, så bekreftelsen», «Uansett valg, har dere fått
  tiden og rommet til å vite». CTA-standardisert.
- SLIK FUNGERER DET: rekkefølgen (profil → kø → matching → reise →
  uke 1 → dag 8 → uke 2 → dag 14) er intakt; marketing-språk
  («Bare ro», «gjør det lettere å åpne seg», «da har dere lært å kjenne
  hverandre») erstattet med beskrivelse av neste steg.
- TRYGGHET: uendret — allerede konkret (blokkering, rapportering,
  samsedagsvurdering, nøttall, tekniske tiltak). Ingen absolutte
  «trygt»-claim funnet.
- PRISER: «ser lik deg ut»-sats fikset; CTA-standardisert. Prisfakta
  (5 000 gratis, 349 fremtidig, Vipps, ingen abonnement) intakte.
- FAQ: «lære hverandre å kjenne som mennesker», «Bare en følelse
  gjenstår», «Ingen hard landing» fjernet; svarene er nå ren prosedyre.
- TIPS: CTA-standardisert. Resten var konkret bruksrådgivning (holdt).
- OM-OSS: manifest erstattet: hva Tosom er / hvordan vi matcher /
  hva tosomhet er (konkret) / hvorfor (støy vs vår vei vs kunnskapsgrunnlag)
  / verdier (konkrete) / team (lite norsk team, ærlighet).
- KONTAKT / BLOGG: kun CTA-standardisering + én «meningsfulle
  forbindelser»-setning i blogg-intro. Blogginnleggene (publisert
  innhold) ikke endret.

## H. AI-like patterns removed

«de to som svinger sammen», «to rytmer … i riktig takt», «forsterker
hverandre», «små, jevne steg i rett takt», «Først trygghet, så ansikt»,
«Bare en følelse gjenstår», «Ingen hard landing. Bare videre.»,
«meningsfulle forbindelser», «Tosom er ikke en app. Det er en prosess.
En reise. Et rom…», «Vi bygger ikke en app. Vi bygger et rom.»,
«Noe rolig. Noe ekte. Noe som kan vokse.», «møt noen som passer deg —
på ordentlig» (9 CTA-er), «møt én person, valgt med omtanke» (4 CTA-er).
KEEP: «Fysisk tiltrekning betyr noe» (motpol) — konkret og sann.

## I. Grammar

Enkelte setninger ble kortere/korrekte i prosessen (f.eks. «det går i
eget tempo» i FAQ). Ingen systematiske en/én eller de/dem-feil funnet
bortsett fra de som ble fjernet sammen med kopien. Em-dash brukes
konsekvent i de endrede setningene.

## J. Terminology

Kartlagt: kobling (to personer), matching/matcherunde (prosess), reise
(14 dager). «Match» beholdes der produktet selv bruker ordet
(matchrunde, matchskår, «én match om gangen»-kort). Ingen nye
synonymer innført.

## K. Tests

- NY: `__tests__/plain-copy-truth.test.ts` — PLAIN-01…PLAIN-10
  (pattern-guards på 22 offentlige mappe-sett; ingen stil-politi).
- Kjørt: grand-finale-copy-truth, metoder, motpol, free-beta-truth,
  legal-pages-truth.
- Metodikke: source-guards (stripComments) — AI-tone vurderes manuelt.

## L. Remaining legal-only issues

- Ingen nye. /personvern + /vilkar er lawyer-baseline (de05680).
- Videre open items (fra forrige ACT): Art. 9-scope-spørsmål (Q11) og
  PRELAWYER-13 spørsmål ligger til jurist — uendret.

## M. Final freeze decision

Rekommenderer COPY FREEZE: YES — all offentlig copy er nå i trakk med
frozen produkt-modellen og godkjent stemme. Videre copy-justeringer
kraver ACT, ikke «polish». Ingen produktendringer i denne rundingen.
STOPP før commit (per ACT-bruk).