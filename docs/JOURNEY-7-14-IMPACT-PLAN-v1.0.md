# TOSOM — JOURNEY 7/14 IMPACT PLAN v1.0

> **PLAN MODE — kun analyse. Ingen implementering, ingen copy-endring, ingen commit/push/deploy.**
>
> - Dato: 25.10.2026 · PLAN J1
> - Basert på HEAD `2629f7f` (main, clean tree bortsett fra ucommittet ID1-planfil)
> - Spørsmålet: **Er 7/14 en bedre Tosom-modell enn 14/30 — og hva må faktisk endres dersom George velger den?**
> - Ingen beslutning er tatt. Alt er verifisert mot kode, ikke mot copy.

---

## A. Executive summary

1. **Dagens modell er verifisert i kode:** bilder låses opp **dag 15**, reisen slutter **dag 30**. Én kilde for totaltall (`JOURNEY_TOTAL_DAYS = 30`, `lib/journey/engine.ts:188`) og én kilde for bildelås (`isPhotosAllowed(day) = day >= 15`, `engine.ts:297`). I tillegg finnes `config/legal.ts:132` (`JOURNEY = { totalDays: 30, imageUnlockDay: 15 }`) som kilde for juridisk copy. **Men:** ~8 hardkodede duplikater (cron ×5, `journeySync.ts`, admin `journey-stats`, exit-melding) refererer 30/15 direkte.
2. **7/14 bevarer konseptet.** Alle syv søyler (ONE PERSON, NO SWIPING, NO PROFILE CATALOG, CONVERSATION FIRST, PHOTO LATER, GUIDED PROGRESSION, CLEAR ENDPOINT) står intakte. Strukturproposjonen er identisk: bildet kommer i **halvveien** (dag 8 av 14 = dag 15 av 30).
3. **Anbefaling: CHANGE TO 7/14 BEFORE BETA** (seksjon W). For en liten norsk beta veier pool-likviditet, lærehastighet og lavere mismatch-kost mer enn 16 ekstra dypdags. Dypden kan gjeninnføres senere som en valgfri «dyp reise» — å forlenge en reise er enklere enn å komprimere den.
4. **Teknisk scope: MEDIUM.** Ingen schema-endring, ingen ny tabell, ingen matching-endring, ingen ny sikkerhetsarbeid. Jobben er: én config-opprydding (fjerne duplikatene), fase/tema/innhold-kartlegging (30 dager → 14), og en bred men mekanisk copy-pass (ca. 15 publik sider + e-poster + notifikasjoner + 8 tester).
5. **Pris 349 kr: behold i dag.** P1A D5-setningen «349 kr = én faktisk startet 30-dagersreise» blir ugyldig → «én 14-dagersreise». Pris per dag stiger 349/14 = 24,9 kr/dag (fra 11,6) — copy må rammes rundt **resultatet** (én ekte kobling), ikke antall dager.
6. **Gratisbeta: null kodeendring.** Kvoten er person-basert (`claimFreeQuota` ved kø-inngang, atomisk `Quota`-rad, `lib/payment/freeQuota.ts`), ikke dag-basert.
7. **Sikkerhet/trygghet: null effekt.** Bildelåsen flytter fra dag 15 til dag 8; alle reglene (deltaker-sjekk, `endedAt`-sjekk, 423-lås, valgfri deling, GDPR-sletting, blokkering/report) er uendrede.
8. **Største risiko 7/14:** «veldig treg Tinder»-løkke (7 dager → bilde → nei → ny person). Vurdering: reell men MEDIUM — strukturelle anti-swipe-vakter (én person, ingen katalog, ukesvis matching, explicit sluttvalg dag 14) er sterke; avhenger av matchingkvalitet og styrke i dag 1–7-innholdet.
9. **Migrasjon:** pre-launch — testdata resettes (G-15), det finnes ingen ekte brukere i aktive reiser (per definisjon av pre-launch); contingency: lineær clamping `newDay = min(oldDay, 14)` + behold `imageShareAllowedAt` hvis satt.

---

## B. Current 14/30 truth (verifisert mot HEAD `2629f7f`)

### B.1 Kilder for tall (kildehierarki)

| Kilde | Fil:linje | Verdi | Rolle |
|---|---|---|---|
| `JOURNEY_TOTAL_DAYS` | `lib/journey/engine.ts:188` | `30` | **SOURCE OF TRUTH** (motor) |
| `isPhotosAllowed(day)` | `lib/journey/engine.ts:297-299` | `day >= 15` | **SOURCE OF TRUTH** (bildelås) |
| `PHASE_CONFIGS` | `lib/journey/engine.ts:191-221` | EARLY 1–14 · BUILDING_TRUST 15–21 · DEEPER 22–25 · CHECKIN 26–30 | SOURCE OF TRUTH (faser) |
| `THEME_RANGES` | `lib/journey/engine.ts:224-230` | intro 1–5 · trygghet 6–12 · fordypning 13–20 · modning 21–26 · integrasjon 27–30 | SOURCE OF TRUTH (tema) |
| `JOURNEY = { totalDays: 30, imageUnlockDay: 15 }` | `config/legal.ts:132-136` | 30 / 15 | **PARALLELL kilde** for juridisk copy (brukes av `/vilkar`) |
| `TOTAL_DAYS = 30` (lokal) | `lib/match/journeySync.ts:9` | `30` | DERIVED-duplikat (bor importere `JOURNEY_TOTAL_DAYS`) |
| cron: `journey.day >= 30` | `app/api/cron/journey/route.ts:165` | `30` | DERIVED-duplikat (fullføringsjekk) |
| cron: «ga hverandre 30 dager» | `app/api/cron/journey/route.ts:180` | 30 | UI COPY (fullføringsnotifikasjon) |
| cron: «Dag X av 30» | `app/api/cron/journey/route.ts:235` | 30 | UI COPY (milestone summary) |
| cron: `newDay >= 15` | `app/api/cron/journey/route.ts:210` | `15` | DERIVED-duplikat (setter `imageShareAllowedAt`; bruker ikke `isPhotosAllowed`) |
| cron: B9 «innen 14 dager» + `14 * 24 h` | `app/api/cron/journey/route.ts:264,304` | `14` | DERIVED (startvinduet — **en annen 14**, uavhengig av bildelås) |
| cron: `day: { gte: 30 }` (no_action) | `app/api/cron/journey/route.ts:337` | `30` | DERIVED-duplikat (auto-sletting) |
| exit: «dag X/30» + «av 30» | `app/api/journey/exit/route.ts:157,177` | 30 | LOG + UI COPY |
| admin: `daysCompleted >= 30` | `app/api/admin/journey-stats/route.ts:55` | `30` | DERIVED (fullføringsdefinisjon i statistikk) |

**Konklusjon:** motoren er nesten sentralisert (bra), men 30/15 forekommer hardkodet i 5 cron-steder + 3 ytterligere moduler. Et 7/14-bytte som kun endrer `engine.ts`-konstantene ville **ikke** hatt virkning i cron, journeySync, admin og exit-melding. Dette er J1-A i implementeringsrekkefølgen (seksjon Y).

### B.2 Reisens faktiske oppbygning

- **Start:** match natt til lørdag (cron 02:00–04:00 UTC, `vercel.json`). `JourneyProgress` opprettes (day 0/1, `bothSeenAt: null`). Reisen «starter» når **begge** har vært innom (`bothSeenAt` settes, B9).
- **Dagstall:** `journeyDayFor(bothSeenAt, now)` (`engine.ts:324-332`) — deterministisk Oslo-kalenderdag, `Math.round` av døgndifferanse, **DST-sikker** (begge tidspunkter snapes til Oslo-dato), klampes 1–30. Begge partnere deler `bothSeenAt` → samme dag alltid.
- **Daglig prosess:** cron `/api/cron/journey` (`vercel.json`: `5 0 * * *` = daglig 05:00; koden kommenterer «kjører timevis» — **kommentardrift**, se J). `nextDayAt`-lås (24 t) per reise, `JOURNEY_BATCH_SIZE=100`.
- **Dag 15 (bildeåpning):** cron setter `conversation.imageShareAllowedAt = now()` én gang (idempotent null-sjekk) + `recordEvent('journey.image_unlocked')` + fase-notifikasjon (EARLY→BUILDING_TRUST) + daglig milestone. UI: låsikon «🔒 Bildedeling låses opp dag 15» (`ChatContainer.tsx:490`).
- **Innhold per dag:** `dayData` med 30 poster (title/focus/reflectionPrompt/microInsight/progressionHint), `engine.ts:887-917`. Milestones dag 3, 7, 10, 14, 21, 28 (`MILESTONE_MESSAGES`, `engine.ts:345+`).
- **Fullføring (dag 30):** cron setter `endedAt` + notifikasjon «Reisen deres er fullført. Takk for at dere ga hverandre 30 dager.» ~24 t gransetid der begge kan handle: **«Vi fant hverandre»** (24 t grace for PDF-eksport, deretter slettes), **«Start ny reise»** (`new_journey`: samme partner, onboarding reset, dag 1 igjen) eller **ingenting** → `endJourney('no_action')` auto-sletter alt.
- **Tidlig utløp (B9):** match eldre enn **14 dager** med `bothSeenAt: null` → `expired` (begge IDLE, match `status='expired'`).
- **Stillhet:** 48 t uten meldinger → «varm impuls» (`STILLHET_HOURS = 48`).
- **Avslutning (`endJourney`, `lib/journey/endJourney.ts`):** verifisert sletting (invariant I-6): Messages → JourneyStateLog → ResonanceSession → Milestones → JourneyProgress → Conversation → Match → MatchHistory (outcome) → Notifications → begge `journeyState: IDLE` → AuditLog. **Anonym** `JourneyStat` skrives før sletting (outcome, daysCompleted, alders-/avstandsbånd, meldingsantall, BliKjent-bruk).

### B.3 Exit-utfall (alle via `POST /api/journey/exit`, CSRF+auth)

| reason → outcome | Effekt |
|---|---|
| (default) `early_exit` | Alt slettes, begge IDLE, partner får «reisen er avsluttet»-epost |
| `blocked` | Som ovenfor + bruker blokkeres permanent |
| `found_each_other` | 24 t grace (PDF-eksport), deretter cron-sletting |
| `ny_reise`/`new_journey` | Journey-data nullstilles, konto beholdes, initiativtaker tilbake til onboarding — **samme partner** |
| cron `no_action` | Auto-sletting etter dag 30 + 24 t uten handling |
| cron `expired` | B9 — aldri startet innen 14 dager |

**Ingen cooldown** etter avsluttet reise («Du kan starte en ny reise når du vil»). Ny **partner** = ny køplass → neste lørdag rundes.

---

## C. Candidate 7/14

- **Dag 1–7:** uten bilder (dagens EARLY-fase 1–14 komprimeres til 1–7)
- **Dag 8:** bildeåpning (partnerens profilbilde synlig + bildedeling i chat låst opp)
- **Dag 8–14:** med bilder — «helheten»
- **Dag 14:** avslutning (fullføringsvalg: fant hverandre / ny reise / avslutt)

**Strukturproposjonen er identisk med dagens:** bildet i halvveien (8/14 ≈ 57 % ≈ 15/30 = 50 %).

Foreslått fase-kart (beholder de eksisterende 4 `JourneyPhase`-enumverdiene — ingen DB-enum-endring):

| Fase | Nå (14/30) | 7/14-forslag |
|---|---|---|
| EARLY «Bli kjent» | 1–14 | 1–7 |
| BUILDING_TRUST «Bygger tillit» | 15–21 | 8–10 |
| DEEPER «Dypere samvær» | 22–25 | 11–12 |
| CHECKIN «Refleksjon» | 26–30 | 13–14 |

Foreslått tema-komprimering (5 tema beholdes): intro 1–3 · trygghet 4–7 · fordypning 8–10 · modning 11–13 · integrasjon 14.

**Sub-decision (foldes inn i D1):** B9-startvinduet 14 dager → **7 dager**. Dagens 14-dagers «aldri startet»-vinduet er halve reiselengden; med 7/14 blir et 14-dagers ventevindu 100 % av reiselengden og båndsetter poolen lenger enn reisen selv. 7 dagers startvindu beholder poenget uten overbinding.

---

## D. Product goals

Målsetningen (ikke «skjul bilder lengst mulig»):

| Mål | 14/30 | 7/14 |
|---|---|---|
| Samtalen kommer før bildet | HIGH — 14 dager med daglig prompt, 135 oppgaver, stillhetsimpuls | MEDIUM-HIGH — 7 dager med samme mekanismer; innholdet i dag 1–7 er dagens lettere intro-uke (se F) |
| Én person får oppmerksomheten | HIGH — uendret | HIGH — uendret |
| Inntrykk før utseendet avgjør | HIGH — 2 uker tekst | MEDIUM-HIGH — 1 uke tekst; nok for en pre-beta, måles i beta (meldingsvolum dag 1–7) |
| Fysisk tiltrekning forblir legitim | HIGH — 16 dager med bilder (53 % av reisen) | MEDIUM-HIGH — 7 dager med bilder (50 %); **proporsjonalt likt** |
| Ikke holde bruker i dårlig/irrelevant forbindelse | **SVAKT — svakest her:** 30 dager låst i en død reise; ingen midtreise-utløp; zombie-reiser kjører til dag 30 + 24 t | **STERKT:** halverer den verste bindingen; en mislykket reise koster 14 dager, ikke 30 |

**Analyse:** 7/14 svekker «samtale før bilde»-målet litt (kortere forløp), men **forsterker** «ikke holde bruker i dårlig forbindelse»-målet vesentlig, og holder «én person» og «fysisk tiltrekning er legitim» på omtrent samme nivå. For en beta der den største produktriskoen er *feil matching som varer en måned*, er 7/14 den tryggere modellen.


---

## E. Direct comparison (14/30 vs 7/14)

Kvalitativt, ingen fabrikkerte tall.

| Dimensjon | 14/30 | 7/14 |
|---|---|---|
| CONCEPT STRENGTH | HIGH | HIGH (like) |
| DIFFERENTIATION | HIGH — «30 dager» er sterkt og uvanlig | MEDIUM-HIGH — «14 dager» er uvanlig, men kortere = mindre uventet |
| USER FRICTION (inngress) | MEDIUM — forplikter i 1 mnd | LOW — forplikter i 2 uker, lavere terskel |
| EMOTIONAL INVESTMENT | HIGH — dypere binding | MEDIUM — raskere, mindre investert |
| PHOTO-REVEAL RISK | MEDIUM — 14 d tekstmotivering før bildet | MEDIUM — 7 d er nok, men kortere buffer mot overidealiser |
| PHYSICAL ATTRACTION RISK | MEDIUM | MEDIUM (proporsjonalt likt) |
| DROPOUT RISK (tidlig) | MEDIUM | MEDIUM-HIGH — kortere = mindre «fast» i reisen, men også mindre å tape |
| INACTIVITY COST | HIGH — zombie-reise kjører til dag 30 | MEDIUM — zombie-reise til dag 14 |
| TIME TO NEXT OPPORTUNITY | LANG — opp til 30 d + venting | KORT — opp til 14 d + venting |
| QUEUE LIQUIDITY | LOW — holder paret lenge ute av poolen | HIGH — paret tilbake i sirkulasjon raskere |
| MATCH POOL TURNOVER | LOW | HIGH |
| BETA LEARNING SPEED | LOW — lang syklus til fullstendig signal | HIGH — syklus ~halvert, raskere iterasjon |
| USER COMMITMENT | HIGH — valget i 1 mnd signaliserer seriøsitet | MEDIUM — 2 uker signaliserer mindre, men lavere terskel |
| JOURNEY DEPTH | HIGH — rom for 4 faser + 30 tema | MEDIUM — 4 faser kompr. til 14, dypden tapperes |
| COMMERCIAL CLARITY | HIGH — 349/30 d = 11,6 kr/d | MEDIUM — 349/14 d = 24,9 kr/d, krever omramming |
| PRICE PERCEPTION | HIGH — «30 dager for 349» virker rimelig | MEDIUM — «14 dager for 349» virker dyrere per dag |
| SUPPORT COMPLEXITY | MEDIUM | MEDIUM — færre «stikker fast»-tilfeller, men mer «hvor er bildet?» |

**Vekting for en PRE-LAUNCH beta:** De dimensjonene som styrer beslutningen nå er QUEUE LIQUIDITY, BETA LEARNING SPEED, INACTIVITY COST og TIME TO NEXT OPPORTUNITY — fordi en liten beta lever av omsetning og rask læring, ikke av maks dype enkeltreiser. Der vinner 7/14 tydelig. JOURNEY DEPTH og PRICE PERCEPTION er vinnere for 14/30, men de kan gjenvinnes (seksjon Q, S og W).

---

## F. Current journey content (verifisert fra `dayData`, `engine.ts:887-917`)

### F.1 Dag 1–7 (blir den nye «person først»-fasen)

| Dag | Title | Theme (nå) | Focus | Refleksjonsprompt |
|---|---|---|---|---|
| 1 | Start | intro | Bli kjent med deg selv | Hvorfor valgte du å starte denne reisen? |
| 2 | Nysgjerrig | intro | La nysgjerrigheten føre deg | Hva er du mest nysgjerrig på om deg selv? |
| 3 | Rolig start | intro | Ta det rolig | Hva gir deg ro i hverdagen? |
| 4 | Åpen | intro | Hold dørene åpne | Hva er vanskeligst ved å åpne seg for nye ting? |
| 5 | Reflekter | intro | Tilbakeblikk på de første dagene | Hva har overrasket deg de første dagene? |
| 6 | Trygghet | trygghet | Utforsk trygghet | Hva gjør deg trygg i et møte med en annen? |
| 7 | Verdier | trygghet | Snakk om verdier | Hvilke verdier styrer valgene dine? |

**Milestone dag 7:** «En uke med selvoppdagelse. Hva har du forstått bedre om deg selv?» Milestone dag 3: «Du har kommet tre dager inn i reisen. Hva har overrasket deg så langt?»

**CHAT STATE dag 1–7:** kun tekst; kallenavn (`identityName`) + alder + avstand i header; partnerens profilbilde **undefined** (`imageShareAllowedAt = null`); bildedeling låst (HTTP 423). **SAFETY STATE:** full (CSRF, rate-limit, blokk/report aktive, ingen bilder = mindre overflatisk vurdering).

**Vurdering:** Dag 1–7 er en **god, men lett** intro-ark — de bygger trygghet og verdier, men går ikke dypere enn overflaten. De er tilstrekkelige til å utgjøre en meningsfull «person først»-fase for en beta, men de taper dypden fra dag 8–14 (grenser, mot, forventning, innsikt) som i dagens modell ligger FØR bildet. **Dette er det største innholdsmessige tapet med 7/14** — F.4 gir et komprimeringsforslag.


### F.2 Dag 8–14 i dagens modell (PRE-foto i dag — innholdet som flyttes/slettes)

| Dag | Title | Theme (nå) | Focus |
|---|---|---|---|
| 8 | Dypde | trygghet | Ta det neste steget inn i deg selv |
| 9 | Grenser | trygghet | Kjenne igjen egne grenser |
| 10 | Mot | trygghet | Kjenne til motet ditt |
| 11 | Forventning | trygghet | Hva du forventer av en trygg relasjon |
| 12 | Halvvegs | trygghet | Halvveis i trygghetsdelen |
| 13 | Fordypning | fordypning | Dykk dypere inn i deg selv |
| 14 | Sjørinnsikt | fordypning | Innsikt i egne mønster |

Milestone dag 10 («Nå har du kommet et stykke… usikkerhet…») og dag 14 («Du er nå djupt inne i reisen…»).

### F.3 Dag 15–30 i dagens modell (POST-foto — skal komprimeres til 7 dager)

| Dag | Title | Klassifisering for 7/14 |
|---|---|---|
| 15 | Følelser | ESSENTIAL — første dag med bildet, rom for følelser ved bildeåpning |
| 16 | Sårbarhet | GOOD — sentral for «bygger tillit» etter bildet |
| 17 | Tillit | GOOD — kan merges med Sårbarhet |
| 18 | Egne styrker | OPTIONAL |
| 19 | Aksept | OPTIONAL |
| 20 | Samling | REDUNDANT — overgangs-tema, unødvendig ved 14 d |
| 21 | Modning | TOO LATE — selvstendig 7-dagsbue (21–28) finnes ikke igjen i 14 d |
| 22 | Vokse | GOOD — kan beholges som ett slag |
| 23 | Redsel og mot | GOOD |
| 24 | Håp | ESSENTIAL — «Hva håper du å finne i en partner?» er relasjonsnøkkelen |
| 25 | Trygghet med andre | ESSENTIAL — relasjonsrett tema etter bildet |
| 26 | Giv og ta | GOOD |
| 27 | Balansen | OPTIONAL |
| 28 | Oppsummering modning | REDUNDANT — duplisert med Integrasjon |
| 29 | Integrasjon | ESSENTIAL — «Samle alt du har lært» = slutt-refleksjon |
| 30 | Framover | ESSENTIAL — avslutningsdagen |

Milestone dag 21 («Tre uker…») og dag 28 («Seks uker…») **faller bort** — den eneste direkte kopikonsekvensen for milestones.

### F.4 Foreslått 7/14-ark (konsept, ikke ferdig copy)

**Pre-foto (1–7):** bevar dagens 1–7 nesten som de er (de fungerer), men **trekk inn ett dypere slag fra dag 9 (Grenser)** slik at fasen ikke blir for lett.

**Post-foto (8–14) — «helheten»:**
- **DAY 8 — Bildeåpning / Følelser:** «Nå kan dere se hverandre. Hva kjenner du?» (fra dag 15)
- **DAY 9 — Sårbarhet & Tillit:** merge 16+17 — «Nå som dere kan se hverandre, hva gjør at dere åpner dere opp?»
- **DAY 10 — Håp:** (fra dag 24) «Hva håper du denne koblingen kan bli?»
- **DAY 11 — Trygghet med andre:** (fra dag 25) «Hva får deg til å kjenne trygghet med akkurat denne personen?»
- **DAY 12 — Giv og ta / Balanse:** merge 26+27 — «Hva trenger du å gi, og hva trenger du å motta, for at dette skal fungere?»
- **DAY 13 — Vokse & Redsel:** merge 22+23 — «Hva krever dette av deg, og hva er du redd for?»
- **DAY 14 — Integrasjon & Framover (sluttvalg):** merge 29+30 — «Hva tar dere med dere? Fortsetter dere, eller avslutter dere?» → leder inn i fullføringsvalget (fant hverandre / ny reise / avslutt).

Dette bevarer alle ESSENTIAL-temaene, merges GOOD-temaene, og sløyfer REDUNDANT/TOO LATE. Ingen nytt konsept — kun komprimering av eksisterende innhold.


---

## G. Engine dependencies (audit — alle treff klassifisert)

Søkt etter: `30`, `30 days/dager`, `day 30/day30`, `journeyDuration/journeyDays/MAX_DAY`, `14`, `14 days/dager`, `day 14/day14`, `reveal/photoReveal/imageReveal`, `15`, `day15/day 15`, `7`, `day7`, `8`, `day8`, `unlock/photo/image/journey day/phase/cron`.

| # | Treff | Fil:linje | Klassifisering |
|---|---|---|---|
| 1 | `JOURNEY_TOTAL_DAYS = 30` | `lib/journey/engine.ts:188` | **SOURCE OF TRUTH** |
| 2 | `isPhotosAllowed: day >= 15` | `lib/journey/engine.ts:297-299` | **SOURCE OF TRUTH** |
| 3 | `PHASE_CONFIGS` (1–14/15–21/22–25/26–30) | `lib/journey/engine.ts:191-221` | **SOURCE OF TRUTH** |
| 4 | `THEME_RANGES` (1–5/6–12/13–20/21–26/27–30) | `lib/journey/engine.ts:224-230` | **SOURCE OF TRUTH** |
| 5 | `dayData` (30 poster) | `lib/journey/engine.ts:887-917` | **SOURCE OF TRUTH** (innhold) |
| 6 | `MILESTONE_MESSAGES` (3/7/10/14/21/28) | `lib/journey/engine.ts:345+` | **SOURCE OF TRUTH** (milestones) |
| 7 | `journeyDayFor` (klamp 1–30) | `lib/journey/engine.ts:324-332` | **SOURCE OF TRUTH** (bruker #1) |
| 8 | `JOURNEY = { totalDays: 30, imageUnlockDay: 15 }` | `config/legal.ts:132-136` | **PARALLELL SOURCE OF TRUTH** (juridisk) |
| 9 | `TOTAL_DAYS = 30` (lokal) | `lib/match/journeySync.ts:9` | **DERIVED** (duplikat) |
| 10 | `journey.day >= 30` (fullføring) | `app/api/cron/journey/route.ts:165` | **DERIVED** (duplikat) |
| 11 | «ga hverandre 30 dager» | `app/api/cron/journey/route.ts:180` | **UI COPY** |
| 12 | «Dag X av 30» (milestone summary) | `app/api/cron/journey/route.ts:235` | **UI COPY** |
| 13 | `newDay >= 15` (imageShareAllowedAt) | `app/api/cron/journey/route.ts:210` | **DERIVED** (duplikat, bruker IKKE isPhotosAllowed) |
| 14 | B9 `14 * 24 h` + «innen 14 dager» | `app/api/cron/journey/route.ts:264,304` | **DERIVED** (startvindu, annen 14) |
| 15 | `day: { gte: 30 }` (no_action) | `app/api/cron/journey/route.ts:337` | **DERIVED** (duplikat) |
| 16 | «dag X/30» + «av 30» | `app/api/journey/exit/route.ts:157,177` | **LOG + UI COPY** |
| 17 | `daysCompleted >= 30` | `app/api/admin/journey-stats/route.ts:55` | **DERIVED** (fullføringsdef) |
| 18 | «🔒 … låses opp dag 15» | `app/chat/components/ChatContainer.tsx:490` | **UI COPY** |
| 19 | «Reisen er fullført. 30 dager sammen.» | `app/chat/components/ChatContainer.tsx:672` | **UI COPY** |
| 20 | «Bilder blir låst opp på dag 15 (nå: dag X)» | `app/api/chat/image/route.ts:142` | **UI COPY** (feilemelding) |
| 21 | `imageShareAllowed`-lesing (dag 15) | `app/api/chat/conversations/route.ts:153`, `messages/route.ts:73` | **DERIVED** (leser flagget, ikke tallet) |
| 22 | «Dag 15 – Bilder åpnes» | `app/dashboard/page.tsx:312` | **UI COPY** |
| 23 | «30-dagersreise» (metadata) | `app/layout.tsx:12`, `app/priser/layout.tsx:10,15` | **UI COPY** (metadata) |
| 24 | «dag 15»/«30 dager» (offentlige sider) | `app/(landing)/page.tsx:126`, `faq`, `priser`, `vilkar`, `slik-fungerer-det`, `motpol`, `betaling`, `trygghet`, `tilgjengelighet`, `tips` | **UI COPY** (offentlig) |
| 25 | «30 dager»/«dag 15» (e-poster) | `lib/email/*` (welcome ~179, journey-end ~247) | **EMAIL** |
| 26 | faseoverganger 14→15, 21→22, 25→26 | `__tests__/journey-engine.test.ts` | **TEST** |
| 27 | klamp 30, dag 15 DST | `__tests__/journey-day-advance.test.ts` | **TEST** |
| 28 | «før dag 15» (4 bildesvar) | `__tests__/photo-lock-before-day15.test.ts` | **TEST** |
| 29 | «423 før dag 15» | `__tests__/chat-image-lock-m6.test.ts` | **TEST** |
| 30 | «30 dager» (admin panel) | `app/admin/(panel)/journeys|analytics|tools/page.tsx` | **UI COPY** (intern) |
| 31 | «bilde-lås (dag 15)» | `docs/LanseringsCheckList.md:23,50,56,271,272` | **DOC** (rapporteres, endres IKKE i PLAN) |
| 32 | personvern «senest innen 30 dager» | `app/personvern/page.tsx:55` | **UNRELATED** (GDPR-svarfrist — røres IKKE) |
| 33 | `JOURNEY.totalDays`-bruk (vilkar) | `app/vilkar/page.tsx:54,60,61,119,120,171,210` | **DERIVED** (leser config — korrekt) |

**Oppsummering:** 7 ekte kilder (engine + legal config), ~7 hardkodede duplikater som MÅ byttes til konstanter (r. 9–10, 13–15, 17), resten er copy/tester/doc. Ingen LEGACY-verdier. Alle «30»-treff i personvern (GDPR-svarfrist) er UNRELATED og røres ikke.

---

### G.1 Én config — kan vi ha én kilde for dagstall? (J1-A)

Dagens tilstand: **motsatt av «dag 8 i én fil, dag 15 i en annen, 30 dager et tredje sted»** — men nærmere enn det: 2 kilder (engine + legal) + 7 hardkodede duplikater. Målet for 7/14:

**Foreslått mål-tilstand (implementeres i J1-A, IKKE nå):**

```
config/journey.ts (NY — eller utvide config/legal.ts)
  JOURNEY = {
    totalDays: 14,        // JOURNEY_TOTAL_DAYS
    imageUnlockDay: 8,    // PHOTO_REVEAL_DAY
    startWindowDays: 7,   // B9: hvor lenge matchen kan ventes å startes
  }
```

- `lib/journey/engine.ts` **exporterer** `JOURNEY_TOTAL_DAYS` og en ny `PHOTO_REVEAL_DAY = 8` (eller importerer fra config). `isPhotosAllowed` blir `day >= PHOTO_REVEAL_DAY`.
- `lib/match/journeySync.ts:9` → importerer `JOURNEY_TOTAL_DAYS` (sletter lokale `TOTAL_DAYS = 30`).
- `app/api/cron/journey/route.ts` → alle 30/15/14-treff (r. 10, 13–15) byttes til importerte konstanter; copy-tekster (r. 11–12) interpoleres fra konstanten («…ga hverandre ${JOURNEY_TOTAL_DAYS} dager»).
- `app/api/journey/exit/route.ts:157,177` → interpolerer `${journey.day}/${JOURNEY_TOTAL_DAYS}`.
- `app/api/admin/journey-stats/route.ts:55` → `daysCompleted >= JOURNEY_TOTAL_DAYS`.
- `config/legal.ts:132` → **fjernes** eller peker på samme kilde (unngå to parallell-kilder). `/vilkar` importerer da fra én kilde.

**Kriterium:** etter J1-A finnes tallet 30/15/30 **ingen** steder som literal utenom (a) dagens `dayData`/milestone-innhold (som er innhold, ikke logikk) og (b) tester (som skal pinses). Alt logikk refererer én konstant.

> **Obs:** Dette er renselse, IKKE ny arkitektur. Ingen env-var, ingen DB-innspilling, ingen runtime-toggle. Konstantene er hardkodede i én fil — samme mønster som dagens `JOURNEY_TOTAL_DAYS`.

---

## H. Photo reveal (mekanikk + sikkerhet)

### H.1 Hva som faktisk skjer ved bildeåpning (dagens, verifisert)

Bildeåpning er **én flagg-basert hendelse**, ikke en datobasert regel i hvert lag:

1. **Cron (kilde):** ved dag ≥ 15 setter `conversation.imageShareAllowedAt = now()` **én gang** (idempotent null-sjekk), `recordEvent('journey.image_unlocked')` + fase-notif. (`app/api/cron/journey/route.ts:205-218`)
2. **Partnerens profilbilde vises** når `imageShareAllowedAt` er satt OG i fortiden:
   - `GET /api/chat/conversations` → `partnerImageUrl` (ellers undefined)
   - `GET /api/chat/messages` → `sender.profile.photoUrl` (kun partnerens meldinger; egne viser eget)
   - `POST /api/chat/send` → sender aldri partnerens bilde i svaret
   - `GET /api/match/status` → `candidate.photoUrl` (kun ved `inImagePhase`)
   (dekket av K-8, `__tests__/photo-lock-before-day15.test.ts`)
3. **Egen bildedeling låst** server-side i `POST /api/chat/image` via `isPhotosAllowed(journey.day)` (dag ≥ 15) → **HTTP 423** før det, `app/api/chat/image/route.ts:131-144`.
4. **UI:** låsikon «🔒 Bildedeling låses opp dag 15» (`ChatContainer.tsx:490`), «Dag 15 – Bilder åpnes» (dashboard).

### H.2 Bilaterale vilkår — kontroller

| Krav | Status i dag | Effekt 7/14 |
|---|---|---|
| Begge må ha bilde? | **NEI** — `photoUrl` er `String?` (valgfri); deling er valgfri per melding | Uendret |
| Begge må samtykke? | **NEI** — ingen consent-modal; «om dere vil». Bildelåsen er en **alder/dag-lås**, ikke en samtykkels | Uendret |
| Begge ser samtidig? | **JA** — `imageShareAllowedAt` er per **conversation** (deler), begge leser samme tidsstempel | Uendret (flytter til dag 8) |
| Moderator-state påvirker? | Indirekte: blokk/report → `endedAt` → samtalen lukket (403). Ingen separat moderator-port for bilder | Uendret |
| Blokkering påvirker? | **JA** — blokk → reise avsluttet → `endedAt` → ingen bilder | Uendret |
| Exit påvirker? | **JA** — exit → `endJourney` sletter samtalen + `endedAt` → ingen bilder | Uendret |
| «Dag unlock alene er nok»? | **JA** — én flagg + én dagstest. Ingen andre porte | Uendret (dag 8) |

**Konklusjon:** Endring 15→8 er **én konstant** (`PHOTO_REVEAL_DAY`) + kopien. **Ingen** privat-/safety-regel svekkes — låsen er fortsatt server-side, fortsatt idempotent, fortsatt `endedAt`-respekterende, fortsatt 423-basert. Bildet blir bare tilgjengelig 7 dager tidligere.

### H.3 Hva som må flyttes fra dag 15 til dag 8 (eksakt)

| Lag | Dagens referanse | Ny referanse | Type |
|---|---|---|---|
| `isPhotosAllowed` (engine) | `day >= 15` | `day >= 8` (PHOTO_REVEAL_DAY) | LOGIKK |
| cron `imageShareAllowedAt` | `newDay >= 15` | `newDay >= PHOTO_REVEAL_DAY` | LOGIKK |
| `config/legal.ts` `imageUnlockDay` | `15` | `8` | CONFIG |
| Feilemelding (image route) | «…dag 15 av reisen» | «…dag 8 av reisen» | COPY |
| ChatContainer tooltip | «…dag 15» | «…dag 8» | COPY |
| Dashboard milestone | «Dag 15 – Bilder åpnes» | «Dag 8 – Bilder åpnes» | COPY |
| Alle «14 dager uten bilder» / «åpnes ved dag 15» (offentlig) | se O | se O | COPY |
| Tester (photo-lock, m6, engine) | 14/15 | 7/8 | TEST |
| E-post (welcome «fra dag 15») | «dag 15» | «dag 8» | EMAIL |


---

## I. Ending/completion — Dag 14 (dagens dag-30 fullføring kartlagt)

### I.1 Dagens dag-30 fullføring (verifisert)

| Element | Hva som skjer i dag | Fil |
|---|---|---|
| Fullføringslogikk | `journey.day >= 30` → cron setter `endedAt` | `cron/journey/route.ts:165` |
| Journey status | `endedAt` satt; match holder `status='active'` i ~24 t | samme |
| Notification | «Reisen deres er fullført. Takk for at dere ga hverandre 30 dager.» | `route.ts:180` |
| CTAs (UI) | «Vi fant hverandre» / «Start ny reise» | `app/reisen/avslutning/page.tsx` |
| Continued contact | `found_each_other` → 24 t grace, PDF-eksport mulig, deretter sletting | `endJourney.ts` + cron grace ~line 371–455 |
| Exit / queue return | Begge → `journeyState: IDLE`; ny partner = ny kø → neste lørdag | `endJourney.ts` trinn 11 |
| Feedback | Anonym `JourneyStat` (outcome, daysCompleted, bånd) skrives FØR sletting | `endJourney.ts` B4.6 |
| Email | `sendJourneyEndEmail` / `sendJourneyEndedEmail` («De 30 dagene sammen er fullført») | `lib/email` ~233–247 |
| Admin state | `endJourney('no_action')` auto-sletter aktiv match uten handling ~24 t etter dag 30 | `route.ts:330–360` |
| Cleanup | Verifisert sletting i FK-rekkefølge (I-6) + bildeobjekter (GDPR) | `endJourney.ts` |

### I.2 Hvordan dette teknisk blir dag 14

**Alt er dagstall-kontrollert via én kilde** — ingen endring i logikk, kun konstanter:

| Logikk | Dagens kilde | 7/14-kilde |
|---|---|---|
| Fullføringsjekk (cron) | `journey.day >= 30` (hardkodet) | `journey.day >= JOURNEY_TOTAL_DAYS` |
| `no_action`-spørring | `day: { gte: 30 }` | `day: { gte: JOURNEY_TOTAL_DAYS }` |
| Fullførings-notif | «…ga hverandre 30 dager» | `…ga hverandre ${JOURNEY_TOTAL_DAYS} dager` |
| Admin fullføringsdef | `daysCompleted >= 30` | `daysCompleted >= JOURNEY_TOTAL_DAYS` |
| Milestone summary | «Dag X av 30» | `Dag X av ${JOURNEY_TOTAL_DAYS}` |
| Exit-log/melding | «dag X/30», «av 30» | interpolert |
| `isJourneyCompleted` (engine) | `day > JOURNEY_TOTAL_DAYS` | uendret (bruker allerede konstanten) |
| `found_each_other`-grace | 24 t (uavhengig av dagstall) | uendret |
| `endJourney`-rekkefølge | FK-basert (uavhengig av dagstall) | uendret |
| `JourneyStat`/cleanup | dagstall-uavhengig | uendret |

**Poenget:** Fullføringsmekanikken er allerede 100 % dagstall-parameterisert via `endedAt` + `JOURNEY_TOTAL_DAYS`. Å «flytte slutten til dag 14» er å endre én konstant + interpolere 5 copy-tekster. Ingen ny fullføringslogikk, ingen ny cron, ingen ny grace-periode.

**Én design-bemerkning:** Med 14 dager er gransetiden (~24 t) = ~1,7 % av reisen (vs ~0,8 % i dag). Følelsesmessig likt; teknisk uendret. Holdes.

---

## J. Cron/time (kritisk — kartlagt)

| Mekanisme | Dagens atferd | 7/14-effekt |
|---|---|---|
| **Dagprogresjon** | `journeyDayFor(bothSeenAt, now)` — deterministisk Oslo-kalenderdag, `Math.round` av døgndiff | **Uendret** — fungerer for vilkårlig starttidspunkt; klampes 1–14 i stedet for 1–30 |
| **Timezone** | `Europe/Oslo` via `toLocaleDateString('sv-SE', {timeZone})` | Uendret |
| **Cron-skedule** | `5 0 * * *` (daglig 05:00), matching `0 2,3,4 * * 6` | **Uendret** (ingen ny frekvens trengs) |
| **Scheduled unlocks** | `imageShareAllowedAt` settes av journey-cron når dag ≥ 15 | Flytter til dag ≥ 8 (samme mekanisme) |
| **Midnight logic** | Ingen — dagen er Oslo-kalenderdag, ikke UTC-midnatt | Uendret |
| **Journey start timestamp** | `bothSeenAt` (når begge har vært innom) | Uendret |
| **Date arithmetic** | `MS_PER_DAG = 86 400 000` på snappede Oslo-datoer | Uendret |
| **DST** | Sikker — begge tidspunkter snapes til dato før subtraksjon (verifisert i `journeyDayFor` + DST-test) | Uendret |
| **Retries** | `nextDayAt`-lås (24 t) per reise; `JOURNEY_BATCH_SIZE=100` | Uendret |
| **Missed cron** | `journeyDayFor` er **stateless/deterministisk** — fanger opp utilsatte døgn ved neste kjøring (PL-06/K-4) | Uendret — faktisk enda mer robust ved kortere reise |
| **Idempotency** | `imageShareAllowedAt` null-sjekk (én gang); milestone unique constraint (STEG 5.4); advisory lock (987654321) | Uendret |

**Analyse — hvilken effekt får 7/14 på cron?**

1. **Ingen ny cron, ingen endret skedule.** Den daglige journey-cronen gjør nøyaktig det samme: beregner dag fra `bothSeenAt`, avanserer fremover, setter `imageShareAllowedAt` ved reveal-dagen, avslutter ved siste dag.
2. **Klampetallet** endres 30→14 (én konstant i `journeyDayFor`).
3. **Reveal-trinnets** dag endres 15→8 (én konstant).
4. **Fullførings- og no_action-trinnenes** dag endres 30→14 (konstanter).
5. **B9-startvinduet** 14→7 dager (sub-decision, én konstant `startWindowDays`).
6. **Kapacitet:** `JOURNEY_BATCH_SIZE=100`/time er overdimensjonert for en beta uansett; kortere reiser betyr FEWER samtidige aktive reiser, ikke mer belastning pr kjøring.
7. **DST/missed-cron:** fullstendig uavhengig av reiselengde — den deterministiske Oslo-dagberegningen gjør at reisen alltid lander på riktig uansett hvor mange dager som går. **Dette er motorens sterkeste egenskap, og den er uendret.**

**Konklusjon:** Cron/tid-logikken er den minst berørte delen av 7/14. Alt er allerede parameterisert; kun konstanter + copy.

---

## K. Exit/rematch (både CURRENT og CANDIDATE)

### K.1 Exit FØR bilde (7/14: dag 1, 3, 6, 7)

| Dag | Begge brukere | Queue / next match | Journey status | Free beta / paid credit |
|---|---|---|---|---|
| 1, 3, 6, 7 | `POST /api/journey/exit` (default → `early_exit`): begge → `IDLE`, samtale + alt slettes (I-6), partner får «reisen er avsluttet»-epost | Begge kan re-queue → neste lørdag. **Ingen cooldown** | `endedAt` satt; outcome=`early_exit` i `MatchHistory` + anonym `JourneyStat` | Kvoten er **person-basert** (claim ved queue-inngang, `lib/payment/freeQuota.ts`). `releaseFreeQuota` finnes (queue-rute line 204) men er koblet til queue-flow, ikke exit. **Vurdering:** i paid-fase bør «avbrutt tidlig» ha en credit-politik — se Q. I gratisbeta: uten praktisk effekt. |

**Poengen:** Exit før bilde er mekanisk identisk uavhengig av dag — `endJourney('early_exit')` er dagstall-uavhengig. Den eneste forskjellen 7/14 gir er **hvor mye som er investert** ved exit (mindre). Ingen ny exit-logikk trengs.

### K.2 Exit ETTER bilde (7/14: dag 8, 9, 10, 14)

| Dag | Hva skjer | Høydepunkt |
|---|---|---|
| 8–10 | `early_exit` — men **bildet har blitt vist** | Begge har sett utseendet. Exit her er en «nei» til en person de har møtt, ikke en blind avbrytelse. Emosjonelt tyngre enn dag 1–7, men tapet er mindre (kortere reise). |
| 11–13 | Som 8–10 | Reiser mot avslutningen. |
| 14 | Siste dag → fullføringsvalg (fant hverandre / ny reise / avslutt) | `found_each_other` = suksess (24 t grace + sletting); `ny_reise` = same partner, onboarding reset, dag 1; default = `early_exit`. |

**Hvor raskt kan brukeren komme tilbake i systemet?** Øyeblikkelig til `IDLE` (ingen cooldown, «Du kan starte en ny reise når du vil»). **Samme partner:** via `ny_reise` (umiddelbart). **Ny partner:** ny køplass → neste lørdag rundes (opptil ~7 dager). **Registreres:** `MatchHistory` (pair + outcome), anonym `JourneyStat` (outcome, daysCompleted), `AuditLog` (JOURNEY_ENDED).

### K.3 Den kritiske løkken: «veldig treg Tinder»?

**Spørsmålet:** Kan 7/14 bli «7 dager → bilde → nei → ny person → 7 dager → bilde → nei …»?

**Strukturelle vakter som allerede forhindrer rask looping:**

1. **Én person, ingen katalog** — ingen swiping, ingen valg av «neste». Én partner om gangen.
2. **Ukesvis matching** — ny PARTNER krever ny køplass → neste **lørdag**. Selv i beste tilfelle: 7 d reise + opp til ~7 d kø = ~2 uker til ny person; i verstetilfelle: 14 d (full reise) + kø. **Dette er den sterkeste anti-swipe-vakten.** 7/14 gjør løkken kortere enn 14/30, men den forblir ukebasert, ikke dagbasert.
3. **Ingen «neste»-knapp** — brukeren må aktivt re-queue; en bevisst handling, ikke et swipe.
4. **Guided progression + daglige prompts** — hver dag har tema; «nei» midt i reisen tas i et refleksjonsøye, ikke i et swipe-flow.
5. **Refleksjon før bilde** — milestone dag 3/7 + dag 7-temaet gir et naturlig «stopp og vurder» før dag 8.
6. **Matchingkvalitet** — resonansbasert matching (ikke tilfeldig) reduserer antall mis-match-løkker («hellere ingen match enn en dårlig»).

**Vurdering:** «Veldig treg Tinder»-risikoen er **MEDIUM, ikke HIGH**. Ukebasert matching + én-person-regel + bevisst re-queue gjør at 7/14 ikke kan bli en dagbasert swipe-løkke. Den virkelige risikoen er heller at reisen blir **for kort til å bygge noe** (seksjon T, «shallow journey»), ikke at den blir for rask.

**Forsterking (til J1-D/copy-ACT, ikke nå):** en bevisst «sluttvalg»-skjerm dag 14 som krever et aktivt valg (fant hverandre / ny reise / avslutt) i stedet for passiv «reisen er over» — bryter eventuell automatisk «nei → neste»-mentalitet.

---

## L. Pool/liquidity (kvalitativt — liten norsk beta)

**Oppsett:** Samme brukerpool, to reiselengder. Matching er ukebasert (lørdag), én partner om gangen.

| Målepunkt | 14/30 | 7/14 |
|---|---|---|
| **Personer bundet i aktive reiser (samtidig)** | Høyt — et par binder 2 personer i opptil 30 d + kø | Lavt — opptil 14 d + kø |
| **Hvor raskt poolen endres** | Sakte — de fleste sitter fast i 30 d-reiser | Raskt — par løyser og returnerer i ~halve tida |
| **Hvor ofte en bruker kan bli aktuell igjen** | Sjelden — opptil ~4–5 uker (reise + kø) mellom hver mulighet | Ofte — opptil ~2–3 uker |
| **Ventetid (kø)** | Lengre — færre frie plasser fordi de fleste er bundet | Kortere — flere «frie» brukere tilgjengelige for matching |
| **Behov for stor samtidighet** | Høyt — trenger mange samtidige brukere for nok frie i lørdags-runden | Lavt — fungerer med mindre samtidighet |

**Arkitekturell vurdering (ingen syntetiske tall):**

I en liten beta (f.eks. 50–200 registrerte) er **bundethet den dominerende faktoren**. Med 30-dagersreiser ender en stor andel av alle registrerte brukere opp med å sitte «låst» i en pågående reise i uker om gangen — og dermed **utilgjengelige** for ny matching. Det betyr:

1. **Lørdags-runden har færre kandidater å matche med** (de som faktisk er IDLE), ikke de som er registrerte.
2. **Køen beveger seg saktere** (færre som returnerer), men **kvaliteten på hver runde** kan bli lavere (få frie = tynnere matching).
3. **En mis-match** koster 30 dager før personen er tilgjengelig igjen.

7/14 **halverer bindingstiden**, som i en liten pool betyr:
- **Dobbel så rask omsetning** — poolen «vasker» seg raskere, flere får prøvd.
- **Tynnere, men hyppigere** matching-runder.
- **Mindre sårbar overfor mis-match** — en dårlig kobling koster 2 uker, ikke 4.

**Konklusjon:** For en liten norsk beta er **7/14 arkitekturelt sterkere på likviditet**. Dette er det sterkeste argumentet for endringen — og et argument som forsvinner hvis vi beholder 14/30.

> **Kaveri:** En kortere reise betyr også at **flere reiser starter** over tid (samme pool, raskere omsetning). Hvis matching-kvaliteten er lav, kan det gi FLERE mis-match-løkker. Derfor er **matchingkvalitet** og **re-queue-bevisstheten** (K.3) de to tingene som må holdes høye når vi går 7/14.

---

## M. Beta learning speed (eksisterende data — ingen ny analytics)

**Ingen ny infrastruktur.** Alle kildene finnes i produksjon (verifisert):

| Signal | Kilde (eksisterende) | 14/30 | 7/14 |
|---|---|---|---|
| **Retention** (kommer tilbake) | `User.journeyState` over tid + `MatchHistory` | Lang syklus | Halv syklus |
| **Pre-photo continuation** | Meldingsaktivitet dag 1–14 (vs 1–7) — `Message` + `JourneyStat.messageCount` | 14 d data | 7 d data |
| **Photo-reveal continuation** | Aktivitet etter dag 15 (vs 8) — før/etter `imageShareAllowedAt` | Fra dag 15 | Fra dag 8 |
| **Journey completion** | `JourneyStat.outcome` (`completed`/`found_each_other`) + `daysCompleted` | Opptil 30 d | Opptil 14 d |
| **Rematch** | `MatchHistory` — same/ny par etter `new_journey` | Langt mellom | Kortere mellom |
| **Exit points** | `JourneyStat` + `recordEvent('journey.ended_early', {day, reason})` | Fordeling over 30 d | Fordeling over 14 d |
| **Image unlock event** | `recordEvent('journey.image_unlocked', {day})` | Dag 15 | Dag 8 |
| **No-action auto-delete** | `recordEvent('journey.no_action_deleted')` | ~dag 31 | ~dag 15 |
| **Stillhet** | `STILLHET_HOURS`-impuls + `SilentMoment` | Uendret | Uendret |

**Hva 7/14 gir for læring:**
- **Halvering av syklustiden** til et fullt signal sett (matching → reise → slutt → rematch).
- **Flere fullførte reiser pr. måned** fra samme pool → flere `JourneyStat`-punkter.
- **Tidligere photo-reveal-signal** — «bilde → fortsetter/dropper»-mønsteret vises etter 1–2 uker i stedet for 3–4.

**Én observasjon:** `JourneyStat.daysCompleted`-fordelingen topper på 14 ikke 30; admin-grafene må ikke hardkode «30» som maksimum (se G.30, I.2).

---

## N. Research boundary

### N.1 Hard regel — «7 er bedre vitenskap» er IKKE tillatt

- Ingen offentlig copy (eller intern copy) skal si «Forskning viser at 7 dager er optimalt» eller «Du trenger 7 dager for å bli kjent».
- Det finnes **ingen dokumentert forskning** som støtter en spesifikk timing — hverken 7 dager, 14 dager, eller 30 dager.
- 7/14 (og 14/30) er **Tosoms produktdesign**, ikke et vitenskapelig funn. Copy skal selge **prinsippene** (samtale før bilde, én person), aldri et dagstall som «bevist optimalt».

### N.2 Forskning som faktisk hjelper (bruk kun for prinsippene)

Kun der den faktisk støtter et prinsipp — aldri for å bevise et tall:

| Prinsipp | Støtte fra forskning | Bruk |
|---|---|---|
| **Samtale før bilde bygger nærhet** | Online/tekstbaseret kommunikasjon kan bygge tillit og rapport over tid (CMC-litteratur) | Støtter «ordene først, bildet etter» |
| **Tekst kan skape idealisering** | Skjermet kommunikasjon kan øke forventninger/idealisering som bildet deretter må leve opp til | Støtter at bildelåsen eksisterer, og at dag 7-refleksjon er en vakt |
| **Utseende er relevant i romantisk vurdering** | Fysisk tiltrekning er en dokumentert, legitim del av partnervalg | Støtter at bildet kommer (dag 8) og at tiltrekning er legitim — vi nekker det ikke |
| **Én person vs. mange alternativer** | Flere alternativer kan forringe vurderingsatferd (choice-overload) | Støtter ONE PERSON / NO SWIPING |

### N.3 Grensen

- **Ingen** av ovenstående forskning brukes til å hevise en **eksakt** reiselengde eller bildeåpningdag.
- Forskning (hvis den nevnes) brukes **kun** for å understøtte **prinsippene** — samtale før bilde, én person, langsommere møte.
- Konsekvens for J1-E/J1-F (copy): alle dagstalls-tekster skrives som **produktpåstander** («7 dager uten bilder», «bildet åpnes dag 8», «14-dagers reise»), aldri som **vitenskapelige påstander**.

---

## O. Public copy impact (kartlagt — IKKE endret)

Offentlige sider med dagstall/periode-avhengigheter (verifisert mot `2629f7f`):

| Side | Referanse | Linje | Endring 7/14 |
|---|---|---|---|
| `/` (landing) | «…åpnes først etter 14 dager» | `app/(landing)/page.tsx:126` | → «etter 7 dager» |
| `/reisen` | «30 dager som kan endre alt» | `app/reisen/page.tsx:143` | → «14 dager…» |
| `/reisen` | «Fase 1 — Uten bilder (dag 1–14)» | `:248` | → «(dag 1–7)» |
| `/reisen` | «Fase 2 — Med bilder (dag 15–21)» | `:295` | → «(dag 8–10)» |
| `/reisen` | «Fase 3 — Felles reise (dag 22–30)» | `:342` | → «(dag 11–14)» |
| `/reisen` | «ETTER 30 DAGER» / «Hva skjer etter 30 dager?» | `:452,465` | → «ETTER 14 DAGER» |
| `/slik-fungerer-det` | «Muligheten for bilder åpnes etter 14 dager» | `:260` | → «etter 7 dager» |
| `/slik-fungerer-det` | «14 dager uten bilder» / «åpnes ved dag 15» | `:273` | → «7 dager… ved dag 8» |
| `/motpol` | «Samtalen først, bildet på dag 15» | `:115` | → «på dag 8» |
| `/motpol` | «Bildet kommer på dag 15.» | `:140` | → «på dag 8» |
| `/faq` | «en 30-dagers samtale… fra dag 15 kan dere dele bilder» | `app/faq/page.tsx:13` | → «14-dagers samtale… fra dag 8» |
| `/faq` | «Ved dag 15 låses bildedeling opp» | `:21` | → «Ved dag 8» |
| `/faq` | «I 14 dager… Da bildene åpner seg ved dag 15» | `:25` | → «I 7 dager… ved dag 8» |
| `/faq` | «én engangsbetaling per 30-dagersreise» | `:33` | → «per 14-dagersreise» |
| `/priser` | «30 dagers guidet reise» / «30-dagers reise» / «én 30-dagersreise» | `app/priser/page.tsx:283,292,348` | → «14…» |
| `/priser` (metadata) | «…én 30-dagersreise…» | `app/priser/layout.tsx:10,15` | → «14-dagersreise» |
| `/betaling` | «Bilder fra dag 15» | `app/betaling/page.tsx:114` | → «Bilder fra dag 8» |
| `/vilkar` | «en guidet reise over 30 dager» (hardkodet!) | `app/vilkar/page.tsx:45` | → 14 (eller `JOURNEY.totalDays` som resten av siden) |
| `/vilkar` | «30-dagersreise» (hardkodet i pris-setning) | `:181` | → 14 (eller `JOURNEY.totalDays`) |
| `/trygghet` | «bildesperre til dag 15» (kommentar) | `app/trygghet/page.tsx:9` | → dag 8 |
| `/tilgjengelighet` | «Billedeling (fra dag 15)» | `app/tilgjengelighet/page.tsx:103` | → «fra dag 8» |
| `/tips` | «De 30 dagene er en struktur…» | `app/tips/page.tsx:105` | → «De 14 dagene…» |
| Root metadata | «én guidet 30-dagers reise» | `app/layout.tsx:12` | → «14-dagers reise» |

**Metadata (SEO):** `app/layout.tsx:12` (root description) og `app/priser/layout.tsx:10,15` (priser description) inneholder «30-dagersreise» — offentlig søkbar copy som viser opp i SERP; må med i copy-passet.

**Kritisk poeng:** `/vilkar` bruker **både** `JOURNEY.totalDays` (r. 54, 60, 61, 119, 120, 171, 210) **og** hardkodede «30» (r. 45, 181). Når J1-A endrer `JOURNEY.totalDays` til 14, viser r. 54 osv. automatisk 14 — men r. 45 og 181 **fortsetter å vise 30**. En konsistensfeil som allerede eksisterer, og som må rettes i samme pass.

**Hvordan unngå «7 er bedre vitenskap» (seksjon N.1):** Ingen av teksten over får et «forskning viser at 7 dager er optimalt»-preg. Endringen er ren produktdesign-copy («7 dager uten bilder», «bildet åpnes dag 8», «14-dagers reise»), ikke en vitenskapelig påstand.

---

## P. Internal copy impact (kartlagt — IKKE endret)

| Overflate | Referanse | Kilde | Endring 7/14 |
|---|---|---|---|
| **Onboarding** | Ingen dagstall i onboarding-steps (0 treff) | `app/onboarding/steps/*` | Ingen |
| **Waiting room** | «Natt til lørdag…» — ukebasert, ingen dagstall | `app/matching/page.tsx` | Ingen |
| **Journey UI (milestone summary)** | «Dag X av 30» | `cron/journey/route.ts:235` | → «Dag X av 14» |
| **Journey UI (milestone-liste)** | «Dag 15 – Bilder åpnes» | `app/dashboard/page.tsx:312` | → «Dag 8 – Bilder åpnes» |
| **Chat (tooltip)** | «🔒 Bildedeling låses opp dag 15» | `ChatContainer.tsx:490` | → «dag 8» |
| **Chat (fullført)** | «Reisen er fullført. 30 dager sammen.» | `ChatContainer.tsx:672` | → «14 dager sammen» |
| **Chat (feilemelding)** | «Bilder blir låst opp på dag 15 (nå: dag X)» | `app/api/chat/image/route.ts:142` | → «dag 8» |
| **System message (fullføring)** | «…Takk for at dere ga hverandre 30 dager.» | `cron/journey/route.ts:180` | → «14 dager» |
| **System message (fase)** | «Fase-endring: Du er nå i fase X.» | `cron/journey/route.ts:247` | Uendret (fasenavn, ikke dagstall) |
| **System message (utløp)** | «Reisen har utløpt… innen 14 dager.» | `cron/journey/route.ts:304` | → «innen 7 dager» (startvindu, sub-decision) |
| **Milestone-tekster** | Dag 3/7/10/14/21/28 | `engine.ts:345+` | Dag 21/28 **slettes**; dag 14-teksten «djupt inne i reisen» må skrives om til slutt-preg (den blir siste dag) |
| **E-post (welcome)** | «…én reise av gangen — 30 dager. Bildene åpnes først fra dag 15.» | `lib/email` ~179 | → «14 dager… fra dag 8» |
| **E-post (reisen slutt)** | «De 30 dagene sammen er fullført.» | `lib/email` ~247 | → «De 14 dagene…» |
| **E-post (guard-test)** | `email-welcome-no-absolute-claims` krever «dag 15» i teksten | `__tests__` + `LanseringsCheckList.md:867` | → må oppdateres til «dag 8» (test + checklist) |
| **Admin** | «30 dager» i journeys/analytics/tools | `app/admin/(panel)/*` | → 14 (inkl. `daysCompleted >= 30` → `JOURNEY_TOTAL_DAYS`) |
| **Support/tips** | «De 30 dagene er en struktur…» | `app/tips/page.tsx:105` | → «De 14 dagene…» |
| **Feedback** | `JourneyStat`-felt er dagstall-uavhengige | `endJourney.ts` | Ingen |

**Kritisk poeng — guard-test:** `LanseringsCheckList.md:867` registrerer en guard-test som krever at velkomst-e-posten inneholder «dag 15». Når copy endres til «dag 8», må **både** e-postteksten **og** guard-testen oppdateres, ellers blir testen rød. En lett-oversett avhengighet.

**Konsistens — dag 14:** I 7/14 blir dag 14 både «milestone-dag» og **siste dag**. Milestone-teksten for dag 14 («Du er nå djupt inne i reisen. La deg ikke skremme av følelser…») passer ikke som siste dag — den må skrives om til en avslutnings-/oppsummerings-tekst. Milestone dag 21 og 28 slettes helt.

---

## Q. Payment impact (P1A låset — 349 kr)

P1A har låst fremtidig produktretning: **349 kr = én faktisk startet 30-dagersreise** (D1–D7). Hvis 7/14 velges blir den setningen **ugyldig**.

| Spørsmål | Analyse |
|---|---|
| **Skal 349 fortsatt være planlagt pris?** | **JA i dag** — endre pris MIDT i en planering er en ny beslutning som kresver på P1A. Anbefaling: behold 349 kr som planlagt pris, men **om-definér** den fra «30-dagersreise» til «14-dagersreise». Pris-tallet røres ikke; bare perioden i setningen. |
| **Opplever 349 annerledes for 14 dager enn 30?** | **JA — tydelig.** 349/30 = 11,6 kr/dag (føles som en rimelig «månedspris»). 349/14 = 24,9 kr/dag (føles som en dyr uke). Prissynet vil skifte fra «billig per måned» til «dyrt per uke». Dette er det **eneste reelle kommersielle tapet** med 7/14. |
| **Må fremtidig pris-definisjon bli «én 14-dagersreise»?** | **JA** — uunngåelig. Setningen «349 kr for én 30-dagersreise» må bli «349 kr for én 14-dagersreise». |
| **Påvirker det perceived value?** | **JA — nedover, men håndterbart.** Verdien i Tosom er **koblingen**, ikke antall dager. `/vilkar` r. 210 sier allerede: «Det du betaler for er koblingen til én bestemt person… uavhengig av hva som skjer videre i de X dagene.» **Den setningen er dagstall-nøytral og er nøkkelen** — den rammer prisen rundt resultatet, ikke lengden. Copy-passet (O) bør sikre at «kobling»-rammen er sterkere enn «antall dager»-rammen. |
| **Påvirker det D1–D7?** | **JA — D5 (pris-definisjon) endres** fra «30-dagersreise» til «14-dagersreise». D1–D4 og D6–D7 (pristak, betalingsmetode, refusjon, kvote) er uavhengige av dagstall og uendret. **Én P1A-beslutning (D5) røres; resten står.** |

**Anbefaling (betalt, ikke endret):**
- **Behold 349 kr** som planlagt pris i betafasen.
- **Om-definér** P1A D5-setningen til «349 kr = én faktisk startet 14-dagersreise».
- **Styrk «kobling»-rammen** i all public copy (bruk `/vilkar` r. 210 som forelegg) så prisen selges som **én ekte kobling**, ikke 14 dager.
- **Ikke** innfør «30-dagersreise» som et premium-tillegg nå — det kompliserer betafasen. Vurder en «dyp reise» (30 d) som en **senere** premium-variant hvis betadatasene viser at brukere vil ha mer tid (se seksjon S/W).

---

## R. Free beta impact

Gratisbeta-logikken er **person-basert, ikke dag-basert** (verifisert):

| Mekanisme | Kilde | Dagstall-avhengig? |
|---|---|---|
| **Kvote gjelder person** | `claimFreeQuota(userId)` — én `Order` pr. person, `Quota`-rad `used` (atomisk, F2-2) | **NEI** |
| **Kvote-tak** | `FREE_QUOTA_LIMIT` / `PRICING.freeUserCap` | NEI |
| **New journey behavior** | `new_journey` → onboarding reset, same partner, dag 1 | Dagstall-uavhengig (start på dag 1) |
| **Free order** | `createFreeOrder(userId)` — `amount: 0`, `status: PAID`, `provider: free_quota` | NEI |
| **User eligibility** | `requireNotBanned` + `onboardingComplete` + `journeyState` | NEI |

**Konklusjon: 7/14 krever INGEN kodeendring i gratisbeta-logikken.** Kvoten er «X personer får prøve gratis» — uavhengig av hvor lang reisen er. `PRICING.freeUserCap` og `FREE_QUOTA_LIMIT` røres ikke.

**Én observasjon (betalingspolitikk, ikke beta):** I dag claimes gratisquota **ved queue-inngang** (`queue/route.ts:144`) og `releaseFreeQuota` (line 204) er koblet til queue-flow. Hvis en bruker starter en reise og **avbryter tidlig** (exit), frites quota-plassen IKKE automatisk — personen har «brukt» gratisplassen selv om reisen var 2 dager. I gratisbeta er det uten praktisk betydning (alla får all likevel). Men i **paid-fase** (349 kr/reise) vil dette bli en refusjonspolitikk-spørsmål: «refunderes 349 hvis jeg avbryter dag 3?» — det er en **ny P1A-beslutning** (ikke i D1–D7 i dag) som 7/14 **skaper behov for**, fordi mer av prisen faller på kortere reiser. Rapporteres som åpen, ikke løst.

---

## S. Brand impact

**Spørsmålet:** Hva er egentlig Tosoms merkevare?

- **A.** 30 dager (tallet som kjennetegner)
- **B.** én person + samtale før bilde + langsommere møte (prinsippene)

**Vurdering: Tosoms merkevare er B, ikke A.**

Bevis fra eksisterende copy og design:
- «Ordene først, bildet etter» (landing) — et **prinsipp**, ikke et tall.
- «Én gjennomtenkt match om gangen» (metadata) — **én-person**, ikke 30 dager.
- «Trygghet før utseende» (landing) — **sekvens**, ikke lengde.
- «Heller ingen match enn en dårlig» — **kvalitet**, ikke varighet.
- Vilkares betalingsramme: «Det du betaler for er koblingen… uavhengig av hva som skjer videre i de X dagene» — **resultat**, ikke dager.

Tallet «30» er en **spesifisering** av prinsippene, ikke selve merkevaren. Det er minnelig og uvanlig (ingenting annet i markedet sier «30 dager»), men hvis produktet fungerer uten tallet 30, **forblir merkevaren intakt**.

**Vurderer 7/14 Tosoms posisjonering:**

| | Vurdering | Begrunnelse |
|---|---|---|
| **WEAKENS** | NEI | Ingen av B-prinsippene svekkes. Én person, samtale før bilde, langsommere møte — alle står. |
| **PRESERVES** | **JA** | Konseptet er bevart (seksjon D, alle 7 søyler). «14 dager» er fortsatt uvanlig og spesifikt — det beholder «dette er ikke en vanlig app»-følelsen. |
| **STRENGTHENS** | DELVIS | 7/14 **forsterker** to sider: (1) **lavere terskel** — «2 uker» er lettere å si ja til enn «1 måned», noe som hjelper adopsjon i en liten beta. (2) **kortere binding** — «langsommere møte» uten «låst i en måned», noe som reduserer den negative siden av langsommheten. |

**Én merkevare-tap som skal påpekes ærlig:** «30-dagers samtale» (FAQ) er en **sterk, minnelig frase**. «14-dagers samtale» er like spesifikt men **kortere**, og mister litt av «det her er en ekte, lang prosess»-tyngden. Dette kompenseres (a) av lavere terskel, (b) av «kobling»-rammen i prissalget, (c) av muligheten til en senere «dyp reise» (30 d)-variant.

**Konklusjon:** 7/14 **bevarer** merkevaren og **forsterker** den på adopsjon og binding. Tallet 30 er ikke merkevaren — prinsippene er. Hvis vi går 7/14 skal all public copy fortsette å selge **prinsippene** (én person, ord først, langsommere møte), ikke bare tallene.

---

## T. Failure modes (sammenligning)

### T.1 14/30 failure modes

| Failure | SEVERITY | LIKELIHOOD (kvalitativ) | MITIGATION |
|---|---|---|---|
| **Long wait** (bruker ventet i måneder på en reise som ikke fungerer) | HIGH | MEDIUM — 30 d binding + kø | B9-utløp (14 d); men ingen midtreise-utløp. 7/14 reduserer dette. |
| **High investment** (to personer investerer 2 uker tekst, bildet «nei») | HIGH | MEDIUM — den klassiske «attraction mismatch»-risikoen | Ingen full.mitigering; 7/14 halverer investeringen. |
| **Inactivity** (zombie-reise, ingen skriver) | MEDIUM | MEDIUM-HIGH i en beta | 48 t stillhetsimpuls; men reisen kjører til dag 30. 7/14: kjører til dag 14. |
| **Photo disappointment** (bildet skuffet forventningen) | HIGH | MEDIUM | 14 d motivering hjelper; men investeringen er stor. |
| **Journey fatigue** (brukeren er «ferdig» på dag 20) | MEDIUM | MEDIUM | Ingen «hopp av til dag 25»-mulighet. 7/14: reisen er kortere, mindre fatigue. |

### T.2 7/14 failure modes

| Failure | SEVERITY | LIKELIHOOD (kvalitativ) | MITIGATION |
|---|---|---|---|
| **Shallow journey** (7 d er for kort til å bli kjent) | MEDIUM | MEDIUM — største risikoen med 7/14 | Dag 1–7-innholdet må være sterkt (F.4); daglige prompts + 135 oppgaver; «dyp reise»-variant senere. |
| **Insufficient connection before photo** (bildet kommer før kjemi er bygget) | MEDIUM | MEDIUM | Milestone dag 7 (refleksjon før bilde); matchingkvalitet; stillhetsimpuls. |
| **Slow-swiping loop** (7 d → bilde → nei → ny person → …) | MEDIUM | LOW-MEDIUM — ukebasert matching + én-person forhindrer dagbasert looping | Bevisst re-queue; sluttvalg-skjerm dag 14; matchingkvalitet (K.3). |
| **Rushed content** (14 d tapper dypden fra dag 8–14 og 21–28) | MEDIUM | HIGH — det er en real komprimering | F.4-arket bevarer ESSENTIAL-temaene; merges GOOD-ene. Må ha en bevisst innholdspass. |
| **Lower perceived value** (349/14 d = 24,9 kr/dag) | MEDIUM | MEDIUM — prissyn endres | «Kobling»-ramme i copy (Q); hold 349; «dyp reise»-variant senere. |

**Nettovurdering:** 7/14s verste failure («shallow journey») er **håndterbar og målbart i betadatasene** (pre-/post-photo continuation). 14/30s verste failure («high investment + long wait» ved mis-match) er **dyr og lang** i en liten beta. For betafasen er 7/14s failure-profil den sikreste.

---

## U. Migration (pre-launch)

**Kontekst:** Pre-launch — den «ekte» brukerbasen er testdata (G-15 sier test-kontoer slettes). Ingen ekte brukere er i aktive reiser per definisjon.

| Datatype | Status pre-launch | Strategi |
|---|---|---|
| **Existing active journeys** | Test-reiser (eventuelt) | **Reset** (se under). Ekte: finnes ikke. |
| **Test journeys** | `JourneyProgress`-rader fra dev/test | **Slettes/resettes** — testdata kan slettes fritt (G-15). |
| **Waiting users** | `journeyState: QUEUED` / IDLE | **Utvirret** — kø-state er uavhengig av reiselengde. |
| **Completed journeys** | `MatchHistory` + `JourneyStat` | **Beholdes** — historisk anonym data; en «30-dagers» `daysCompleted` i historikken er et faktum, ikke en bugg. Ingen backfill. |
| **Stored `journeyDay`** | `JourneyProgress.day` + `bothSeenAt` | Se contingency under. |
| **Image unlock state** | `Conversation.imageShareAllowedAt` | Beholdes hvis satt (en reise som allerede har åpnet bilder, har åpnet bilder). |

**Enkleste strategi (anbefalt):**

Siden pre-launch-basen er testdata:
1. **Slett/resett test-reiser** (G-15 sletter test-kontoer allikevel). Ingen migrasjon av aktive reiser trengs fordi det ikke finnes noen ekte.
2. **Bytt konstantene** (J1-A): `JOURNEY_TOTAL_DAYS` 30→14, `PHOTO_REVEAL_DAY` 15→8, `startWindowDays` 14→7, `config/legal.ts` `totalDays`/`imageUnlockDay` 30/15→14/8.
3. **Ingen backfill** av historisk `JourneyStat`/`MatchHistory` — de representerer faktiske (test)reiser som ble fullført under gamle regler.

**Contingency (hvis det ALLERDIKKE finnes en ekte reise på gang ved byttetiden):**

Lineær clamping, ingen komplisert migrasjon:
```
newDay = min(oldDay, 14)
phase  = dayToPhase(newDay)          -- eksisterende funksjon
imageShareAllowedAt: beholdes hvis satt (oldDay >= 15 → er allerede åpnet)
bothSeenAt: uendret (journeyDayFor regner ut riktig dag automatisk)
```
- En reise på dag 20 (bilder åpnet) → dag 14 (bilder fortsatt åpne) → fullfører.
- En reise på dag 5 → dag 5 (uendret).
- **Ikke** slette ekte brukerdata uten eksplisitt beslutning — clamping bevarer all data.

**Poeng:** Fordi `journeyDayFor` er **deterministisk fra `bothSeenAt`**, og `phase`/`photosAllowed` er **avledet av `day`**, er clamping fullstendig reversibelt-sikkert: ingen sletting, ingen tap. Testdata kan i tillegg bare slettes.

---

## V. Test impact (kartlagt)

Tester som refererer 14/15/30 (verifisert):

| Test-fil | Referanse | Klasse | Scope |
|---|---|---|---|
| `__tests__/journey-engine.test.ts` | faseoverganger 14→15, 21→22, 25→26; bilde-lås dag 14/15; CHECKIN 26–30; `getPhaseForDay(30)` | **JOURNEY CORE** | MEDIUM — fasegrenser endres (1–7/8–10/11–12/13–14); bilde-lås 14/15→7/8 |
| `__tests__/journey-day-advance.test.ts` | «den siste dagen er dag 30», klamp til 30, DST-tilfelle «14 døgn etter start = dag 15» | **JOURNEY CORE** | SMALL-MEDIUM — klamp 30→14; DST-testen må bytte referansedag (dag 15→dag 8) |
| `__tests__/photo-lock-before-day15.test.ts` | K-8: 4 bildesvar, `imageShareAllowedAt` null vs fortid; «før dag 15» | **PHOTO** | MEDIUM — tittel/ramme «dag 15»→«dag 8»; logikken er flaggbasert så kjernen kan stå, men `inImagePhase`/dagstest må tilpasses |
| `__tests__/chat-image-lock-m6.test.ts` | «423 før dag 15» | **PHOTO** | SMALL — 15→8 |
| `__tests__/email-journey-end.test.ts` | «De 30 dagene» i reiseslutt-e-post | **EMAIL** | SMALL — 30→14 |
| `__tests__/email-journey-ended.test.ts` | «reisen er avsluttet»-e-post (partner) | **EMAIL** | SMALL — sjekk dagstall |
| `__tests__/email-welcome-no-absolute-claims.test.ts` | krever «dag 15» i velkomst-e-post (per checklist r.867) | **EMAIL / COPY** | SMALL — 15→8 (kjempegjeld: copy + test i samme pass) |
| `__tests__/journey-queue-exit-b8.test.ts` | queue/exit (B8) | **JOURNEY CORE** | SMALL — sjekk 14/30-referanser |
| `__tests__/chat-image-get-route.test.ts` | image GET (signert URL) | **PHOTO** | SMALL — sjekk dag-referanser |
| E2E | — | **E2E** | INGEN E2E-tester funnet for journey dagstall (kun unit/mock-stil) |
| Admin | `journey-stats` `daysCompleted >= 30` | **ADMIN** | SMALL — konstantbytte; admin-graf-akse (maks 30→14) |

**Total scope:** **MEDIUM**. Ingen syntetiske timer. De fleste er SMALL (tallbytte); `journey-engine` + `photo-lock` er MEDIUM (fasegrenser + bilde-låsdag). Ingen nye tester kreves utover å oppdatere eksisterende referanser — men **én ny assertion bør legges til**: at `isPhotosAllowed(7) === false` og `isPhotosAllowed(8) === true` (ny grense), og at `getPhaseForDay(14).phase === CHECKIN` (siste dag).

**Språkvakt:** Alle nye copy-endringer (14/8) må gå gjennom `npm run verify:lang` — kun bokmål (ikke nynorsk-variantene av «dager»/«åpnes»).

---

## W. Recommendation

**Endrer vi til 7/14, eller beholder vi 14/30, før beta?**

### Vurdering av de tre alternativene

| Alternativ | Fordel | Ulempe | Vurdering |
|---|---|---|---|
| **KEEP 14/30** | Dypere reise, «30 dager» er sterk markedsføring, lavest terskel for endring (ingenting) | Lav likviditet i liten beta, lang læresyklus, høy mis-match-kost, «long wait»/«high investment»-failure modes | Sikker, men gir fra hånd på de dimensjonene som styrer en **beta** (likviditet, lærehastighet) |
| **BETA TEST BOTH** | Data på begge | **FOR STORE KOSTER for liten base:** to varianter = ulik opplevelse, vanskelig support, splittet copy, færre klare signaler per variant, dobbelt innhold å vedlikeholde | **Avvises** — med liten norsk base gir to varianter svake signaler og operativ forvirring |
| **CHANGE TO 7/14 BEFORE BETA** | Høy likviditet, rask læring, lav mis-match-kost, lav terskel for deltakelse, kortere binding | «Shallow journey»-risiko, «rushed content», lavere perceived value (349/14 d), mister «30-dagers»-frasen | Beste beta-modell; risikoen er håndterbar og målbart i betadatasene |

### Anbefaling

> **CHANGE TO 7/14 BEFORE BETA** — én modell for første beta (ikke begge).

**Grunnlag:**
1. **Likviditet er den dominerende faktoren i en liten beta** (seksjon L). 7/14 halverer bindingstiden og gir dobbelt omsetning — det er forskjellen mellom et system som «vasker seg» og et der alle sitter låst i en måned.
2. **Lærehastighet:** halvering av syklustiden (seksjon M) gir fullt signal etter 1–2 uker i stedet for 3–4. I en beta er dette verdt mer enn 16 dypdager.
3. **Mis-match-kost halveres** (seksjon T) — den verste 14/30-opplevelsen (2 uker tekst → bilde → nei, 30 d binding) blir 1 uke tekst → bilde → nei, 14 d binding.
4. **Konseptet er bevart** (seksjon D/S) — alle 7 søyler står; «14 dager» er fortsatt uvanlig og spesifikt.
5. **Teknisk scope er MEDIUM** (seksjon Y) — ingen arkitektur-endring, kun konstanter + innholdskomprimering + copy. Lav risiko å gjøre feil.
6. **Dypden kan gjenvinnes** — en senere «dyp reise» (30 d)-variant er en **forlengelse** (lett), mens å gå fra 7/14 til å beholde 14/30 ville ha krevd å bygge om alt nå (dyrt). Å starte 7/14 og kanskje forlenge senere, er den sikrere sekvensen.

**Vilkår for at 7/14 fungerer (å handle i/etter beta):**
- **Matchingkvalitet** må holdes høye (resonans, «hellere ingen enn dårlig») — ellers forsterkes slow-swipe-løkken.
- **Dag 1–7-innholdet** må være sterkt nok (F.4) — dette er den «person først»-fasen.
- **Sluttvalg dag 14** må være et bevisst valg (fant hverandre / ny reise / avslutt), ikke en passiv avslutning.
- **Pris-ramming** (349) må selges som **én kobling**, ikke 14 dager (seksjon Q).

**Hvis George er uenig:** KEEP 14/30 er et fullt legitimt valg — det er den sikreste, lavest-innvendings-veien. Den pris vi da betaler er likviditet og lærehastighet i betafasen. Begge modellene er implementerbare med den samme J1-A (én config) — derfor er beslutningen **reversibel** så lenge den treffes **før** beta.

> **HARD REGEL (seksjon N.1):** Uansett valg skal offentlig copy IKKE si «Forskning viser at 7 dager er optimalt» eller «Du trenger 7 dager for å bli kjent». Det finnes ingen dokumentert grunnlag for eksakt timing. 7/14 er Tosoms produktdesign.

---

## X. George decisions (maks 4)

| # | Beslutning | Anbefalt |
|---|---|---|
| **D1** | **Change to 7/14?** (inkl. sub-decision: B9-startvindu 14→7 dager) | **JA** — gå 7/14 før beta |
| **D2** | **Photo opens exactly day 8?** | **JA** — `PHOTO_REVEAL_DAY = 8` (bildet i halvveien, som dagens dag 15 av 30) |
| **D3** | **Total journey ends exactly day 14?** | **JA** — `JOURNEY_TOTAL_DAYS = 14` (sluttvalg dag 14) |
| **D4** | **Keep planned 349 price for future paid journey pending beta evidence?** | **JA** — behold 349 kr, men **om-definér** P1A D5 til «349 kr = én faktisk startet 14-dagersreise»; selg som **én kobling**, ikke 14 dager; vurder «dyp reise» (30 d) som senere premium-variant hvis betadatasene viser etterspørsel |

**Ikke-decisioner (holdes fast uansett):**
- Én modell for beta (ikke «test both») — seksjon W.
- Ingen «7 er bedre vitenskap»-copy — seksjon N.1 (hard regel).
- Ingen endring i matching, cron-skedule, sikkerhet, GDPR, identity-plan (ID1) — uavhengige av dagstall.

---

## Y. Implementation sequence (hvis 7/14 — IKKE startet nå)

Sekvensen er ordnet slik at **én kilde** legges først, så alt avledes fra den. Hver steg er uavhengig testbart.

| # | Steg | Scope | Innhold | Avhenger av |
|---|---|---|---|---|
| **J1-A** | **Source-of-truth config** | SMALL | Ny/utvidet `JOURNEY`-config (eller konstanter i `engine.ts`): `totalDays=14`, `photoRevealDay=8`, `startWindowDays=7`. `config/legal.ts` peker på samme kilde. Alle DERIVED-duplikater (G.9–G.17) byttes til importerte konstanter. **Verifiser: ingen 30/15/30-literal i logikk-kode.** | — |
| **J1-B** | **Journey engine** | MEDIUM | `PHASE_CONFIGS` → 1–7/8–10/11–12/13–14; `THEME_RANGES` → 1–3/4–7/8–10/11–13/14; `journeyDayFor` klamp 1–14. Ingen enum-endring. | J1-A |
| **J1-C** | **Photo reveal** | SMALL | `isPhotosAllowed` = `day >= photoRevealDay`; cron `imageShareAllowedAt` ved dag ≥ 8; feilemelding/tooltip copy. | J1-A |
| **J1-D** | **Content mapping** | MEDIUM | `dayData` 30→14 (F.4-arket); `MILESTONE_MESSAGES`: slett 21/28, skriv om 14 til slutt-preg; dashboard milestone-liste; sluttvalg-skjerm dag 14. | J1-B |
| **J1-E** | **Public copy** | MEDIUM | Alle O-rader (landing, reisen, slik-fungerer-det, motpol, faq, priser, betaling, vilkar (inkl. hardkodede r.45/181), trygghet, tilgjengelighet, tips, layout-metadata). Språkvakt-grønn. | J1-A (tall) |
| **J1-F** | **Emails / notifications** | SMALL | Welcome (30/dag15→14/dag8), reiseslutt (30→14), cron-notif (fullføring/utløp), guard-test `email-welcome-no-absolute-claims` (dag15→dag8) **i samme pass som copy**. | J1-A |
| **J1-G** | **Tests** | SMALL-MEDIUM | Oppdater journey-engine, journey-day-advance (klamp 14 + DST-referanse), photo-lock-before-day15 (→dag8), chat-image-lock-m6, email-* (copy), journey-queue-exit-b8, chat-image-get-route. Ny assertion: `isPhotosAllowed(7)===false`, `isPhotosAllowed(8)===true`, `getPhaseForDay(14)===CHECKIN`. | J1-B/C/D |
| **J1-H** | **Migration / test-data** | SMALL | Slett/resett test-reiser (G-15). Contingency-clamp for eventuelle ekte reiser (`min(oldDay,14)`, behold `imageShareAllowedAt`). Ingen backfill av historikk. | J1-A |
| **J1-I** | **Production smoke** | SMALL | Deploy til staging: fullfør en 14-dagers reise med tidsmanipulert `bothSeenAt`; verifiser bildeåpning dag 8, faseoverganger, fullføring dag 14, no_action ~dag 15, `JourneyStat`-skriving, e-poster, metadata. | Alt |

**Ikke-i-sekvensen (holdes utenfor 7/14):** matching-endring, cron-skedule-endring, ny pris-aktivering, identity-plan (ID1), ny «dyp reise»-variant. Alle er **separat** arbeid som kan komme etter beta.

**Total implementation scope: MEDIUM** (J1-A SMALL, J1-B MEDIUM, J1-C SMALL, J1-D MEDIUM, J1-E MEDIUM, J1-F SMALL, J1-G SMALL-MEDIUM, J1-H SMALL, J1-I SMALL).

---

## Z. Checklist impact (rapporteres — IKKE endret i PLAN)

`docs/LanseringsCheckList.md` refererer dagstall på flere steder som **blir ugyldige** ved 7/14 (rapporteres her, endres IKKE nå per seksjon 38):

| Checklist-linje | Referanse | Påvirket av 7/14 |
|---|---|---|
| r. 23 | «bildelås (dag 15)» | JA → dag 8 |
| r. 50 | «Bilder i chat åpnes dag 15 (M-6, isPhotosAllowed…)» | JA → dag 8 |
| r. 51 | «ord først, bilder fra dag 15» | JA → dag 8 |
| r. 56 | copy «Bildene åpnes først fra dag 15» + guard-test | JA → dag 8 |
| r. 221 | «bilder fra dag 15» | JA → dag 8 |
| r. 225 | «dere kjenner hverandre gjennom de 30 dagene» | JA → 14 |
| r. 271 | «Reise (30 dager, daglig innhold)» + «bilde-lås dag 1–14» | JA → 14 dager / bilde-lås dag 1–7 |
| r. 272 | «bilde 423 før dag 15» | JA → før dag 8 |
| r. 867 | guard-test «dag 15»/faktisk lovnader | JA → dag 8 (NOT DONE-item) |

**Lanseeringskriterier som er uavhengige av dagstall** (uendret): kontosletting, samtykke, deterministisk reisedag, rate limiting, passordkrav, eksplisitt registrering, matching-motor, Vipps-test (P1A), identity-plan (ID1).

> Disse checklist-radene skal oppdateres i **J1-E/J1-F** (copy/e-post-passet), ikke nå. PLAN endrer ikke `LanseringsCheckList.md`.

---

## SLUTT

Dette dokumentet er en **PLAN** — det endrer ingen kode, ingen copy, ingen konstanter, ingen cron, ingen DB. Det kartlegger nøyaktig hva 7/14 kresver, hva som må endres, og anbefaler en retning. Beslutningen ligger hos George (D1–D4). Implementering starter først etter godkjent beslutning, via sekvensen J1-A…J1-I.
