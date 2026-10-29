# RUNTIME vs DOCUMENTATION TRUTH — PLAN v1.0

**TOSOM · 27.10.2026 · Track C (Cline) · PLAN/READ-ONLY**

Ingen kode, copy, pris, matching, journey, database eller legal-side er endret.
Ingen commit/push/deploy. Den eneste nye filen i denne oppgaven: dette dokumentet.

---

## A. Executive summary

**Pre-flight (alt grønt):**

| Check | Result |
|---|---|
| Branch | main |
| local main = origin/main | 0df1c7f = 0df1c7f ✓ |
| Production health | HTTP 200 {"status":"ok"} (27.10.2026 22:52) |
| Working tree | kun untracked: docs/IDENTITY-TRUST-PLAN-v1.0.md (separat, urørt) + dette dokumentet |
| Siste prod-deploy | tosom-evfrjl2jd (18 t, Ready, alias www.tosom.no). Repo-HEAD 0df1c7f antatt å være deployt commit (vercel inspect Build-seksjon ikke fanget). |
| Live vs repo | VERIFISERT: landing, /metoder, /motpol, /om-oss, /slik-fungerer-det, /llms.txt og /vilkar serverer identisk tekst som HEAD (grep: «datingside», «Nå er ærligheten», «vitrinasjestykke», «30-dagers», «dag 15», «PVQ-10», «ERQ-6», «begge må bekrefte», «349»). |

**Topp-funn:**

1. **P1 — «begge må bekrefte» (vilkar §16 + personvern §10, LIVE):** usant. Én bruker kan alene velge «Vi fant hverandre»; valget avslutter reisen for begge. Den andre bekrefter aldri noe (se G).
2. **P1 — public/llms.txt (LIVE):** utdatert — «30-dagers reise», «Bilder låst til dag 15», «PVQ-10, BFI-10, ERQ-6». Runtime: 14 dager, bilder fra dag 8, egne spørsmål (Big Five-rammeverk + forskningsinspirert). Leveres til crawlere/LLM-er.
3. **P1 — Invite-only-beta ikke nevnt i public copy:** registreringen er gjennomtvungen via BetaInvite-tabellen (ikke-invitert → 403). Vilkar:40 sier det; landing/FAQ/priser gjør ikke det. Offentlig CTA «Opprett en konto» er misvisende for ikke-inviterte.
4. **P1 — PDF-bildestreferanser:** hver bilde-melding vises i PDF-en som en tekstlinje med stien /api/chat/image/ (meldings-ID). Bildet selv renderes IKKE (ingen img-tag), men intern sti-lekkasje (se H).
5. **P2 — kategori-mismatch:** 4 public sider sier «datingside»; hero/metadata/llms/aria sier «plattform»/«relasjonsplattform»; legal (vilkar) sier «relasjonsplattform».
6. **P2 — copy-poster:** «vitrinasjestykke» (motpol:389, live), «Nå er ærligheten:» (metoder:331, live), «de daglige små oppgavene»/«daglige små oppgaver» (tips, slik-fungerer-det, priser ×2) — PARTLY ALIGNED mot runtime.
7. **P2 — logo:** to visuelle identiteter. Header = rent tekst-wordmark («Tosom» + «Made in Norway»); hero/footer/undersider = resonansmerket (to sirkler). Per kodekommentarer er to-sirkler-marken den dokumenterte standardlogoen; header er unntaket. Kravert: Georges merkebesluttning.
8. **P2 — /tips mangler first-date-seksjon** («Før dere møtes») — gap, ikke feil.
9. **Prising:** single-source (PRICING.journeyPrice=349, active=false, freeUserCap=5000). PAYMENTS_ENABLED=true krasjer (kill switch). **249 finnes IKKE noe sted** i kode/copy/config/tests (kun minifisert playwright-report-støy). Anbefaling: hold 349 som dokumentert plan; avgjør 249 vs 349 etter gratis beta (se L).
10. **P0: ingen.**

---

## B. Produktkategori

Alle omtaler (live-verifisert 27.10):

| Plass | Copy i dag |
|---|---|
| Landing hero (Hero.tsx:67) | «Tosom er en rolig, privat plattform for voksne (21+).» |
| Landing brødtekst (page.tsx:185) | «Tosom er en **datingside** der du blir kjent med én person om gangen.» |
| /om-oss:95 og :443 | «Tosom er en **datingside** …» / «Vi bygger en **datingside** …» |
| /hvorfor:449 | «Tosom er en **datingside**. Forskjellen er at …» |
| /slik-fungerer-det:178 | «Tosom er en **datingside** …» |
| /faq:13 | «Tosom er en 14-dagers samtale mellom to mennesker …» |
| Footer-tagline | «en rolig, moden måte å møtes på» |
| app/layout.tsx (metadata) | «rolig, privat plattform for voksne som søker ekte relasjoner» |
| public/llms.txt | «rolig, privat plattform for ekte relasjoner» |
| manifest.json | «Tosom — Én reise. Én match.» (ingen kategori) |
| /vilkar:49 (LEGAL) | «Tosom er en **relasjonsplattform** for voksne.» |
| aria-labels (Logo/ToSomLogo/LogoHorizontal/LogoWordmark) | «rolig, privat relasjonsplattform» |
| blogg / ads | «datingapper» som kontrast — OK (sammenlignende, ikke selvbeskrivelse) |

**Vurdering:**

- **A. Lettest å forstå:** «datingside» — konkret, umiddelbart forståelig.
- **B. Mest konsistent med produktet:** «relasjonsplattform» / «plattform for ekte relasjoner» — det er identiteten i system_prompt («relasjonsplattform, ikke en datingapp»), i metadata, llms.txt og aria-labels.
- **C. Juridisk brukt:** «relasjonsplattform» (vilkar:49) + generisk «tjenesten».
- **D. Mest brukt i live-copy i dag:** «datingside» (4 sider) vs «plattform» (hero + metadata + llms + manifest).

**Kandidat: «Tosom er en datingtjeneste bygget for ekte relasjoner.»**

- Ærlig kategori — produktet ER en datingtjeneste (og «datingside» er allerede i 4 sider; «datingtjeneste» er den mer voksne, ærlige varianten av samme ord).
- «bygget for» = intensjon/design — kolliderer IKKE med ingen-matchgaranti, ingen-kjemigaranti eller ingen-forholdsgaranti (metoder «Hva vi ikke lover»: «Vi lover ikke at du får en match, eller at den du får blir til et langsiktig parforhold»; landing: «Vi prøver å gi dere en god start. Resten finner dere ut av selv.»).
- Det motsatte — «bygger ekte relasjoner» — ville være et resultatløfte og kollidere med disse. Brukes ikke.
- Anbefales til **brødtekstene** (landing, om-oss, hvorfor, slik-fungerer-det). Hero beholder «rolig, privat plattform» + eksisterende subline «Bygget for ekte relasjoner» (allerede live). Legal beholder «relasjonsplattform» til advokatgjennomgangen er ferdig. Metadata/llms: «plattform for ekte relasjoner».
- Merk: internt identitetsdokument sier «relasjonsplattform, ikke en datingapp». Å si «datingtjeneste» offentlig er en bevisst merkebesluttning (ærlighet over posisjonering) som George bør signere — den kolliderer ikke med runtime.

**§4 — «Bygget for ekte relasjoner» (kontroll mot garantier):** ALREADY IN USE som hero-subline (LogoVariants.tsx:226, via LogoAnimated showWordmark=false). Ingen kollisjon med: «Vi lover ikke at du får en match …» (metoder:570), «Vi prøver å gi dere en god start. Resten finner dere ut av selv.» (landing:336), «Tosom lover ikke at du får en match» (tips:252), FAQ/landing-pris (ingen løfte). Konklusjon: sikker som **brand line** (intensjon), aldri som funksjonell påstand. Anbefalt plassering: hero (allerede), footer-tagline-område, metadata. Ikke i legal, ikke i feature-beskrivelser. Unngå overbruk: maks 2–3 steder.

---

## C. Journey content runtime (TRUTH)

**Konfig (single source, config/journey.ts):**

- JOURNEY_TOTAL_DAYS = 14, PHOTO_REVEAL_DAY = 8, JOURNEY_START_WINDOW_DAYS = 7
- 4 faser: EARLY 1–7, BUILDING_TRUST 8–10, DEEPER 11–12, CHECKIN 13–14
- 5 tema-ranger (intro 1–3, trygghet 4–7, fordypning 8–10, modning 11–13, integrasjon 14) — interne temaetiketter på dagkortet

**Hva brukeren faktisk får dag for dag:**

| Spørsmål | Svar (runtime) | Mekanisme |
|---|---|---|
| Får brukeren ett nytt spørsmål hver dag? | **Ja — som forslag, ikke plikt.** | JourneyDayContent (DB, én rad per dag): theme, reflectionQuestion, conversationPrompt, task (kan være null), resonanceGoal. Serveres av GET /api/journey/today + /api/journey/check og vises i dashboard-kortet (components/journey/TodayCard.tsx). Ingen completion-flagg, ingen gating, ingen konsekvens ved å ikke svare. |
| Får brukeren én obligatorisk oppgave hver dag? | **Nei.** | task-feltet er nullable; ingenting håndheves. Dagkortet kan inneholde en oppgave; brukeren kan ignorere den. |
| Finnes daglige tema? | **Ja** (tema-label + fokus-tekst per dag). | JOURNEY_THEME_RANGES + JourneyDayContent.theme. |
| Eller velger brukeren selv blant spørsmål? | **Ja — i tillegg til dagkortet.** | 180 BliKjent-spørsmål (12×15), fritt valgt, ingen daglig grense (se D). |
| Kan flere spørsmål brukes samme dag? | **Ja**, ingen grense. | — |
| Kan ingen spørsmål brukes? | **Ja** — alt er valgfritt; fri chat er alltid der. | — |
| Hvordan velges oppgaver? | Brukeren velger fra 9 kategorier × 15 («Gjør sammen») og sender dem som vanlige chat-meldinger (source 'oppgave'). | app/chat/data/tasks.ts + OppgaverPanel. |
| Kan flere oppgaver brukes? | **Ja**, ingen grense; «✓ brukt» markerer bare allerede sendte (avslappet — kan velges igjen). | — |
| Hvordan fungerer mood/stemningsfarge? | Privat per bruker, kun eget chat-rom (se F). | — |
| Er fri chat alltid tilgjengelig? | **Ja**, bortsett fra dag 14 der inndatafeltet erstattes av de to avslutningsknappene. | ChatContainer:669–692. |
| Hva er bundet til journey-day? | Dagstall (tidsbasert), bildefrigjøring dag 8, dag-14-valg, 48 t stillhetsimpuls, startvindu 7 dager. | — |

**Dagprogresjon:** tidsbasert via time-cron (nextDayAt) — avhenger av tid, ikke av brukernes aktivitet. «I eget tempo» gjelder innholdet (valgfritt), ikke dagtellingen (14 uansett).

**Kjøreobservasjoner (P3, ikke public claims):**

- Fallback i /api/journey/today (getFallbackTask) har fortsatt gamle 30-dagers fase-inkser (day-15/day-22/day-26); bare brukt hvis DB-rader mangler.
- scripts/seed-journey-content.ts seedr fortsatt 30 dager; dag 1–14 er det som brukes.
- G-sjekk (prod-DB): bekreft at JourneyDayContent har rader for dag 1–14 (ikke verifiserbart fra repo).

**Public claims om daglig innhold:**

| Claim | Plass | Status |
|---|---|---|
| «Hver dag får dere et nytt guidet spørsmål eller en samtale-impuls.» | FAQ:21 | **ALIGNED** (daglig kort med reflectionQuestion/conversationPrompt — forutsatt 14 DB-rader i prod) |
| «Hver dag gir dere ett fokus — et spørsmål, et tema eller en liten oppgave. Resten er opp til dere.» | reisen:180 | **ALIGNED** |
| «en reise som gir dere noe å ta fatt på hver dag» | reisen:201 | **ALIGNED** |
| «fire faser, daglige temaer og spørsmål for dere to — i eget tempo» (metadata) | reisen/layout:8 | **ALIGNED** (4 faser stemmer med sidens 4 fase-kort og konfigen) |
| «Reisen varer i 14 dager. Hver dag får dere et spørsmål eller et tema …» | landing:121 | **ALIGNED** |
| «daglige små oppgaver» | slik-fungerer-det:112 | **PARTLY ALIGNED** (oppgavefelt i dagkort kan være null; oppgavepuljen er selvvalgt) |
| «daglige spørsmål, samtaletema og små oppgaver» | priser:265, priser:292 | **PARTLY ALIGNED** (som over) |
| «Gjør de daglige små oppgavene med mening» | tips:107 | **PARTLY ALIGNED** (antyder en daglig oppgave; den er verken automatisk eller obligatorisk) |
| «Dere kan også velge fra 135 oppgaver i 9 kategorier» | FAQ:21 | **ALIGNED** (9×15 = 135 eksakt) |

---

## D. Questions (BliKjent)

- **Canonical source (aktiv):** app/questions/data/questions.ts — **180 spørsmål, 12 kategorier** (Personlighet & identitet, Forhold & tilknytning, Kommunikasjon & konflikter, …), 15 per kategori (Library V2, 28.10; tidl. 240/12×20). Hardkodet frontend-data, «samme for alle brukere».
- **Valgmodell:** MANUELL. Brukeren åpner «Bli kjent»-panelet i chatten → velger kategori → velger spørsmål → «Send til partner?». Ingen systemvalg.
- **Daglig grense:** ingen.
- **Repeat prevention:** myk — brukte spørsmål (metadata.source='bli_kjent') markeres «✓ brukt» og dempes, men kan likevel velges igjen.
- **Deltaker-synlighet:** begge ser det som en vanlig chat-melding fra avsenderen.
- **Påvirker matching etter at reisen starter?** Nei. Matching kjører i den ukentlige runden (natt til lørdag) FØR reisen, ut fra onboarding-svarene. Reiseinnhold (spørsmål/svar/oppgaver) fødes aldri tilbake til matchingen.
- **Tilfeldig-mekanisme:** én — cronen sender én stillhetsimpuls (💛) som konversasjonsmelding (type 'system') etter 48 timer med stillhet, maks én per 48 timer (STILLHET_HOURS=48). Impulsen plukker et forhåndsskrevet spørsmål fra en SEPARAT DB-pulje (GuidedQuestion, 12 kategorier × 12 = 144, seedet av scripts/seed-questions.ts; depthLevel ≤ 2) — ikke fra BliKjent-datafilen.
- **Dødkilde (for dokumentasjon):** DB-puljen + /api/questions-rutene brukes også av /questions-siden som er 404 i produksjon (G-06b, layout med notFound). BliKjent-datafilen beholdes bevisst som kilde for panelet.
- **User experience (nøyaktig):** Ingenting er obligatorisk. Brukeren kan hele reisen bare chatte fritt; spørsmålene er der som samtalestoff («Dette er ikke en test.» — reisen:212).

---

## E. Tasks / activities

- **Kilde:** app/chat/data/tasks.ts — «Gjør sammen», **9 kategorier × 15 oppgaver = 135**, tekstbaserte («Lett, morsomt, ingen konkurranse»):
  Kunne-vil-du-si, Fortell meg om, Hvis du…, To sannheter en løgn, Sang som beskriver deg, Uventet om meg, Nordisk kveld, Gjetter du meg?, Bygg en historie.
- **Hvordan bruker velger:** «Oppgaver»-panelet i chatten; bruker plukker kategori + oppgave og sender den som vanlig melding (source 'oppgave'). Ingen daglig tilordning, ingen «dagens oppgave».
- **Ser begge dem?** Ja — det er en vanlig chat-melding i det felles rommet.
- **Lagres completion?** Nei (ingen completion-felt; kun «✓ brukt»-markering i panelet basert på sendte meldinger).
- **Obligatoriske?** Nei. **Time/day-gated?** Nei (tilgjengelig fra dag 1).
- **Separat:** dagkortet (JourneyDayContent.task) kan inneholde en daglig oppgave — vist i dashboardet (ikke i chatten), ingen completion, kan være null.
- **Public claims:** ingen treff på «dagens oppgave» eller «obligatorisk». Mønsteret «daglig(e) … oppgav(e)(r)» finnes i slik-fungerer-det:112, priser:265/292, tips:107 → **PARTLY ALIGNED** (tabellen i C). Foreslått ordning: «små oppgaver dere kan velge til dere» + «hver dag ligger også et forslag i reisen» (per side).

---

## F. Mood / stemningsfarge

- **Hva brukeren velger:** 12 «stemnings»-temaer (calm, warm, deep, gentle, joyful, romantic, cozy, dreamy, playful, cotton, flammus, sage). Hver mood er et fullt fargetema for chat-rommet (container-bakgrunn, bobler, input, aksent, emoji) — app/chat/lib/mood.ts.
- **Er det farge?** Ja — mood = fargepalett + emoji. Panelet («Velg stemning») i chatten, live-preview ved valg.
- **Dagens mood eller permanent preference?** Fritt valg når som helst; lagres i BRUKERENS EGEN localStorage (ingen API-kall, ingen DB, ingen synk) — ChatContext: «Mood — PER-BRUKER … Lagres i localStorage — ingen API-kall, ingen synk».
- **Hvem ser det?** Kun vedkommende selv. Partneren ser IKKE mooden din (det finnes ingen synk-kanal). Visbar tekst i panelet er korrekt: «🎨 Din stemning — bare deg, din farge».
- **Hvor ofte kan det endres?** Når som helst, umiddelbart.
- **Påvirker matching?** Nei (alt er klient-lokal, ingen serverdata).
- **Kun journey/chat UX?** Ja — ren kosmetikk i eget chat-vindu (inkl. header-aksenter via moodTheme).
- **Feil/stale:** MoodsPanel.tsx:171 har en KOMMENTAR «C-5: delings-hint — stemninga er DELT for begge partar» som motstrider både visbar tekst og runtime → P3 (fiks kommentaren). Komponenten components/ui/moodTag.tsx (MoodTag/MoodGrid/MoodHistory) er eksportert men IKKE brukt i noen side (død kode, P3).
- **Public copy:** ingen public side eller e-post omtaler mood/stemningsfarge (grep: 0 treff i public copy). → Ingen mismatch i dag; men §9s foreslåtte setning «bruke stemningsfargen for å vise hvordan dagen kjennes» ville være MISLEADING (mood vises ikke for partneren). Korrekt alternativ: «…eller gi chatten din egen stemning med stemningsfargen».

**§9 — foreslått journey-wording (setning for setning mot runtime):**

| Setning | Runtime | Dom |
|---|---|---|
| «Dere bestemmer tempoet.» | Innholdet er valgfritt; dagtellingen er fast (14). Leses naturlig som engasjementstempo. | OK (med nyansen over) |
| «Dere kan chatte fritt,» | Fri chat alltid (utenom dag-14-valgknappene). | OK |
| «velge spørsmål fra ulike temaer,» | 12 temaer, fritt valg, ingen grense. | OK |
| «prøve en enkel oppgave» | 135 selgvalgte oppgaver + eventuell daglig forslag. | OK |
| «eller bruke stemningsfargen for å vise hvordan dagen kjennes.» | Mood er PRIVAT — partneren ser den ikke. | **MISLEADING — endre** til: «eller gi chatten din egen stemning med stemningsfargen.» |
| «Dere trenger ikke gjøre noe bestemt hver dag.» | Ingen completion, ingen plikt. | OK |
| «Bruk det som passer når det passer.» | Alt valgfritt. | OK |

Konklusjon: 6 av 7 setninger stemmer med runtime; mood-setningen må endres før denne teksten kan brukes.

---

## G. Completion — «Vi fant hverandre»

- **Valg på dag 14:** to — «Vi fant hverandre 💛» og «Start ny reise 🔄». Chat-innmaten erstattes av disse to knappene når journeyDay ≥ 14 (ChatContainer:669–692); samme valg på /reisen/avslutning.
- **Kan ÉN bruker velge «Vi fant hverandre»?** JA. POST /api/journey/exit {reason:'found_each_other'} kan sendes av HVERKEN hvem som helst av de to (initiator). Valget er ENSIDIG for begge.
- **Lagres valget separat per deltaker?** Nei. Én reisetilstand (Match + JourneyProgress per match); initiativtakers valg avgjør alt.
- **Hva skjer hvis kun én velger?** Det er nok. Den andre får e-post («Gratulerer — dere fant hverandre») og 24-timers PDF-vindu. Ingen bekreftelse fra den andre kreves.
- **Hva skjer når begge velger?** Det første valget gjelder; det andre får 409 (idempotent — matchen er ikke lenger 'active').
- **Når anses resultatet gjensidig?** Det blir aldri «gjensidig» — første valg finaliserer.
- **Når blir PDF tilgjengelig?** Under aktiv reise (API tillater; UI tilbyr ved avslutning) og i 24-timers grace (begge). Se H.
- **Timeout?** Ja — ca. 24 timer etter at dag 14 er nådd: har verken av de to handlet (match fortsatt 'active'), kjører cron endJourney('no_action') → BEGGE KONTOENE slettes umiddelbart og permanent (ingen PDF, ingen grace).
- **Kan valget endres?** Nei (409/idempotent). I grace-perioden kan hver part fortsatt slette SIN konto (partneren resettes da til IDLE).
- **Journey state:** found_each_other → match.status='ended', expiresAt=+24 t, conversation.endedAt satt, begge brukere journeyState='COMPLETED', kontoer + innhold + R2-bildeobjekter BEHOLDES til grace slutter; deretter slettes alt av cron (meldinger, samtale, journey, R2-objekter, kontoer om de finnes).
- **«Start ny reise»:** samtalen slettes umiddelbart for begge; initiativtaker sendes tilbake til onboarding (prefylt profil); begge resettes til IDLE; profilen beholdes.
- **LIVE-LEGAL-FEIL:** vilkar:202 og personvern:247 sier «Dette kan ikke angres, og begge må bekrefte.» — **USANT**: én bekreftelse fra én bruker er nok, og den andre blir aldri bedt om å bekrefte. → **P1** (send retting i advokat-remisspakken).
- FAQ («Hva skjer etter dag 14?») nevner ikke no-action-slettingen (ingen valg → kontoene slettes) — ærlighetsgap, **P2** (tilføy én setning).

---

## H. PDF-eksport

- **Hvem kan laste ned?** Hver deltaker selv (requireAuth; brukeren må være userA/userB på match med status 'active' eller 'ended'-grace).
- **Kreves begge «Vi fant hverandre»?** Nei — API er tilgjengelig under aktiv reise OG i 24-timers grace.
- **Når genereres den?** On-demand: GET /api/journey/export-pdf renderer print-vennlig HTML (window.print → «Lagre som PDF»). Genereres IKKE og lagres IKKE server-side.
- **Er nedlasting valgfri?** Ja — brukeren kan avbryte/hoppe over; partneren kan laste ned separat innen 24 t.
- **Hva inneholder PDF-en (hvert element):**

| Element | Med? |
|---|---|
| Tekst-chat | **YES** (bobler, avsendernavn + tidsstempel per melding) |
| System-meldinger (f.eks. 48 t 💛-impuls) | **YES** (sentrert, kursiv, med dato) |
| Spørsmål (BliKjent) | **YES** — som vanlige meldinger fra den som sendte (type 'user', source 'bli_kjent') |
| Svar | **YES** |
| Oppgaver (oppgave) | **YES** — som vanlige meldinger fra den som sendte |
| Mood/stemning | **NO** (lagres aldri server-side) |
| Bilder | **NO som bilde** (ingen img-tag, ingen R2-URL) — MEN: hver bilde-melding vises som tekstlinje med stien /api/chat/image/ + meldings-ID (content-feltet er nettopp denne stien, se app/api/chat/image/route.ts:202) → **P1**: filtrer bort type='image'-rader eller erstat med «📷 Bilde» uten sti |
| Profildata | KUN navn (firstName/identityName, fallback «Partner») — ingen alder, ingen øvrige felt |
| Datoer | **YES** (per melding + eksportdato i footer) |
| Navn | **YES** (fornavn/identityName) |

- **Privacy:** kun eier (auth per request); ikke lagret (ingen server-side PDF); Cache-Control: no-store; filnavn = browser-default fra title «Reisen min — minnet»; ingen signerte URL-er; ingen imageKey-lekkasje (imageKey ligger ikke i HTML) — bortsett fra content-stien over. Etter grace slettes innhold + R2-objekter + kontoer av cron.
- **Brukerens antakelse «PDF inneholder tekst fra chatten og ingen bilder»:** RIKTIG som bilde — MEN absolutt-setningen er ikke helt korrekt i dag pga. URL-strengen per bilde-melding. Etter RT1d (filtring) blir den helt sann.
- **Public PDF-claims (live):** FAQ:29 («24 timer … så slettes alt») ALIGNED · personvern:227 (24 t) ALIGNED · personvern:247 + vilkar:202 («begge må bekrefte») **FALSE** · avslutning-modaler («av begge i 24 timer», valgfri nedlasting) ALIGNED · reiseslutt-e-post (24 t) ALIGNED · personvern:147 («PDF-eksport i enden») ALIGNED.

**§15 — foreslått PDF-wording:** Runtime bekrefter IKKE «Hvis begge velger det» (én er nok). Korrekt forslag:

> «Når dere når siste dag, kan én av dere velge «Vi fant hverandre» — da avsluttes reisen for dere begge. Dere får 24 timer på dere til å laste ned samtalen som PDF, begge to. PDF-en inneholder teksten fra chatten — bilder blir ikke med. Dere velger selv om dere vil laste den ned.»

(Betingelse: «bilder blir ikke med» blir fullt sant når RT1d er levert.)

---

## I. Logo

| ASSET | KOMPONENT | PLESS | CURRENT/LEGACY | BRUK |
|---|---|---|---|---|
| Tekst-wordmark «Tosom» (gull) + «Made in Norway» | ToSomLogo (bygger på components/ui/branding/Logo.tsx — REN TEKST, ingen ikon) | Public header (GlobalHeader), dashboard-navbar | CURRENT i header | 2 |
| To-sirkler resonansmerke (104 px, glow, resonate, orbit) | ResonanceMark / ResonanceLogo (LogoVariants.tsx) | Landing-hero (Hero.tsx:165), footer (Footer.tsx:211), /samtykke (72 px), /nytt-passord (80 px), tips + metoder hero (104 px) | **Canonical per kodekommentar** (LogoVariants:378: «STANDARD ToSom-logo — den samme som toppen av landing-siden») | 6 |
| Sublines «Utviklet i Norge» / «Bygget for ekte relasjoner» | LogoAnimated (showWordmark=false i hero) | Landing-hero | CURRENT | 1 |
| Favicon/app-ikoner | public/icons/icon-192/512/512-maskable.png, favicon.ico | Browser/app | SEPARAT | — |

- Den rapporterte «to sirkler» på landing = ResonanceMark i heroen. Den er IKKE legacy i seg selv — den er den dokumenterte standardlogoen.
- **Den faktiske uenheten:** header (wordmark) mot hero/footer/undersider (to sirkler). Premisset i §17 («header/footer bruker samme nyere canonical asset») holder IKKE: footer bruker også to sirkler (samme som landing). UNNTAKET er header.
- ToSomLogo.tsx sin kommentar («Identisk logo som brukes på landing-siden») er STALE (siden 04.10, showWordmark=false) → P3.
- **Besluttning kreves (George):**
  - To sirkler = canonical → SIMPLE CONSISTENCY FIX: Bytt ToSomLogo (GlobalHeader + DashboardNavBar) til ResonanceMark/ResonanceLogo. 2 komponenter, 1 asset. Cline-anbefaling (ut fra dagens kode): dette.
  - Wordmark = canonical → bytt hero + footer + 4 undersider (mer inngripende, bryter LANDING-SIGNATUR «resonans-motivet som signatur»). Anbefales IKKE.

---

## J. Methods wording (/metoder)

- **«Nå er ærligheten:» er AKTIVT** (metoder:331, live). Klassifiseres som **copy issue (P2)**: selvreferensiell unnskyldningston. Innholdet under er allerede ærlig og korrekt — det er formuleringen, ikke stoffet, som er problemet.
- **§27 foreslått copy mot runtime:**
  - «Tosom har laget egne spørsmål om blant annet personlighet, verdier, kommunikasjon, relasjoner og livssituasjon.» → **ALIGNED**, men presisér de seks faktiske områdene: **verdier, tilknytning, personlighet, kommunikasjon, emosjonsregulering, livssituasjon** («relasjoner» er ikke dimensjonsnavnet — dimensjonen heter tilknytning).
  - «Noen av områdene er inspirert av etablert psykologi, men dette er ikke psykologiske tester eller kliniske skjemaer.» → **ALIGNED** (metoder i dag: «egne spørsmål inspirert av brede personlighetstrekk fra Big Five-rammeverket … ikke et standardisert eller klinisk skjema» + «egne spørsmål inspirert av forskningen» for tilknytning/verdier/emosjonsregulering/kommunikasjon + «praktiske preferanser» for livssituasjon).
  - «Svarene brukes som en del av matchingen, sammen med grensene og preferansene du har oppgitt.» → **ALIGNED** (matching = seks dimensjoner + dealbreakere/praktiske preferanser).
- **Anbefaling:** Erstatt «Nå er ærligheten: …»-avsnittet med §27-teksten (med seksområdelisten), behold resten av siden (inkl. «Hva vi ikke lover» og «Hva resonans er»). Forslag på flat overskrift: **«Spørsmålene vi bruker»**.
- **Samme sak i llms.txt:** «PVQ-10, BFI-10, ERQ-6» må bort (de brukes ikke lenger — se L).

---

## K. Dating-terminologi (per route)

| Route/flate | Term i dag | Klassifisering |
|---|---|---|
| / (hero) | «plattform» | OK — identitet |
| / (brødtekst) | «datingside» | **P2** — uenhet med hero/legal |
| /om-oss (×2) | «datingside» | **P2** |
| /hvorfor | «datingside» | **P2** |
| /slik-fungerer-det | «datingside» | **P2** |
| /faq | «en 14-dagers samtale» | OK — nøytral |
| footer | «en rolig, moden måte å møtes på» | OK |
| metadata (app/layout.tsx) | «plattform … ekte relasjoner» | OK |
| public/llms.txt | «plattform for ekte relasjoner» | OK (fakta ellers utdatert — se L) |
| public/manifest.json | ingen kategori | OK |
| /vilkar (legal) | «relasjonsplattform» | **LEGAL** — behold til advokaten er ferdig |
| aria-labels (4 komponenter) | «relasjonsplattform» | OK |

**Anbefaling (kan være forskjellig per plass):**

- **HERO/TAGLINE:** behold «rolig, privat plattform» + subline «Bygget for ekte relasjoner» (ingen endring).
- **BODY (landing, om-oss, hvorfor, slik-fungerer-det):** «Tosom er en datingtjeneste bygget for ekte relasjoner. Du blir kjent med én person om gangen.» (beholder dagens andre setning; erstatter «datingside»-delmønsteret).
- **LEGAL:** «relasjonsplattform» — behold til advokatgjennomgangen; deretter evt. harmoniser (avgjørelse i LEGAL-PACKAGE, ikke denne ACT-en).
- **SEO/METADATA:** «plattform for ekte relasjoner» (layout.tsx, llms.txt, manifest) — behold; fikser kun llms.txt-fakta.
- Krav: samme brukerreise (landing → slik-fungerer-det → metoder → vilkar) må ikke motsette seg selv. «datingside» (4 sider) mot «relasjonsplattform» (legal) i dag = uenhet.

---

## L. Pricing — current truth

**Alle treff klassifisert:**

| Plass | Innhold | Klasse |
|---|---|---|
| config/legal.ts:99–107 | PRICING: active=false, journeyPrice=349, freeUserCap=5000, currency NOK | **CONFIG — single source** |
| app/(landing)/page.tsx:283 | «Senere er planen 349 kr for én 14-dagersreise — betalt én gang med Vipps.» | **CURRENT PUBLIC** (plan-merket ✓, vakt av FB-04) |
| app/faq/page.tsx:33 | «De 5 000 første personene får bruke Tosom gratis. Senere er planen … 349 kr …» | **CURRENT PUBLIC** (plan-merket ✓) |
| app/priser/page.tsx:348 | «Senere er planen 349 kr … Ingen abonnement …» | **CURRENT PUBLIC** (plan-merket ✓) |
| app/betaling/page.tsx | ingen pris i det hele (gratisbeta) | CURRENT PUBLIC (FK-04) |
| app/vilkar:185–186, 193–194 | «gratis i dag for de 5 000 … Når betaling innføres …» | **LEGAL** (ingen 349 ✓, vakt) |
| app/personvern:120–123, 204–206 | «Gratis-beta … ingen betalings- eller Vipps-vei aktiv i dag» | **LEGAL** |
| docs/VIPPS-INTEGRATION-PLAN-v1.0.md, TOSOM-SUPER-MASTERPLAN-v2.0.md, ACT-STATE.json | 349 per reise, 5 000 gratis, ingen abonnement | **DOC** |
| __tests__ (free-beta-truth, legal-pages-truth) | 349 må være plan-merket / må IKKE stå i vilkar/betaling | **TEST** |
| «249» | 0 treff i produkt (kun minifisert playwright-report/index.html — støy) | **IKKE EKISTERENDE** |

**Bekreftet:** betaling deaktivert (config/features.ts: PAYMENTS_ENABLED=true kaster FATAL-melding — kill switch) · gratis for de første 5 000 (atomisk teller i lib/payment/freeQuota.ts, per PERSON — «én atomisk claim ved kø-inngang, beholdes gjennom new_journey») · fremtidpris 349 per reise (én gang, Vipps) · ingen abonnement · prisen gjelder per reise.

**NYTT FUNN (P1):** Invite-gate. app/api/auth/register: kun e-poster i BetaInvite-tabellen kan opprette ny konto (ikke-invitert → 403 med generell melding). Vilkar:40 er ærlig («Tosom er i dag en invitert beta: du trenger en invitasjon for å komme inn»), men landing/FAQ/priser nevner det IKKE — landingens CTA «Opprett kontoen din og bygg profilen» og FAQ:33 («De 5 000 første personene får bruke Tosom gratis») er misvisende for ikke-inviterte besøkende.

**249 vs 349 — produktanalyse (ingen oppdiktet markeddata):**

| Vinkel | 349 NOK | 249 NOK |
|---|---|---|
| 14-dagers journey | Sterkere commitmentsignal — samsvarer med «ekte relasjoner», premium og rolig posisjonering | Litt svakere signal; risikoen for «for billig/litt seriøst» er liten fordi alltidværende metode (ikke pris) bærer alvorligheten |
| Vilje til å prøve igjen etter mismatch | Pris ligger nøyaktig på friksjonspunktet: dag-8-bilde kan avdekke attraksjonsmismatch, og produktets kjerne-loop (én person om gangen) kan kreve flere reiser. 349 × n reiser kan dempe gjentaksloopen | Lavere terskel for «prøver en gang til» — støtter reiseløkken |
| Opplevd alvorlighet | Høyere | Litt lavere |
| Betalbarhet (norsk marked, nisje) | OK (engangsbeløp, ikke abonnement) | OK |
| Repeat-journey friksjon | Høyere | Lavere |
| Enkelhet | Lik (per reise, ingen abonnement) | Lik |
| Omsetning per kjøp | +100 NOK per kjøp | — |
| Risiko etter dag-8-avslutning | «349 for en ny» kan føles dyrt etter en skuffende uke | Mindre smertefullt å starte på nytt |

**Nøkkelinnsikt:** De første 5 000 er gratis — første-kjøpsfriskjonen er i dag null for alle testere. Prisens virkelige funksjon i beta-fasen er kun et dokumentert signal. Gratis-betaen (limited, invite-only) er nettopp bevisfasen: vi kan måle hvor mange som velger «Start ny reise», hvor mange som vil prøve igjen, og hva testere sier om pris.

**§20 Anbefaling: TEST AFTER FREE BETA.** Hold 349 som dokumentert plan nå (config + copy er korrekt merket «senere er planen»; endring koster i dag nesten ingenting pga. single source). Samle bevis i betaen (gjentaks-etterspørsel, «Start ny reise»-valg, prisoppfatning, dag-8-NPS), og avgjør 249 vs 349 FØR betaling aktiveres. Bevis på gjentaksfriskjon → 249; produktet bærer seg som premium/alvorlig → 349. Prisendring = egen ACT (config + 3 public-plasser + docs; ingen legal-bump nødvendig i dag da vilkårene ikke nevner pris).

---

## M. First-date tips (/tips)

- **Dagens struktur:** 4 GlassCard-seksjoner (Slik matcher vi deg / En ærlig, konkret profil / Tosom er for alle / Bruk reisen — rolig og kreativt) + gull-linjen «Veiviser, ikke fasit» + CTA. Tone: rolig, ikke-dømmende, «veiviser, ikke fasit — vi lover ikke resultat» (tips:252).
- **«Før dere møtes»-seksjon:** PASSER tonen og produktet. Ingen pickup/seduction/terapi/«how to make them like you»/hacks i forslaget.
- **§22 foreslått copy — tone og truth:**
  - «En første date trenger ikke være imponerende …» → ALIGNED med tonen (avlastning, ro).
  - «Avtal gjerne omtrent hvor lenge dere skal møtes …» → god, trygg, passende for 21+-nisjen; ingen runtime-konflikt.
  - «Dere har allerede snakket sammen i Tosom. Dere trenger ikke gjenta hele reisen …» → **SANNT** (reise = 14 dagers chat før møte; ingen løgn i å anta at de har chattet).
  - Safety: «Møt hverandre på et offentlig sted første gang, og fortell gjerne noen du stoler på hvor du skal.» → ALIGNED; vilkar:214 anbefaler allerede at brukeren leser trygghetssiden → krysslenk til /trygghet anbefales.
- **Anbefaling:** **LETT** (P2, høy verdi) — ny 5. GlassCard «Før dere møtes» med §22-teksten + safety-linjen + lenke til /trygghet. Ingen endring av de eksisterende 4 kortene.

---

## N. Claim matrix (konsentrert)

| Kategori | CURRENT COPY (eksempel) | RUNTIME TRUTH | STATUS | NEW COPY (forslag) | FILES | SEV |
|---|---|---|---|---|---|---|
| PRODUCT CATEGORY | «datingside» (4 sider) | datingtjeneste, én person om gangen, 14-dagers reise | PARTLY ALIGNED (uenhet) | «Tosom er en datingtjeneste bygget for ekte relasjoner.» | app/(landing)/page.tsx, app/om-oss, app/hvorfor, app/slik-fungerer-det | P2 (besluttning) |
| JOURNEY CONTENT | «Hver dag får dere et nytt guidet spørsmål eller en samtale-impuls.» | ett fokus-kort per dag, valgfritt; fri chat alltid | ALIGNED | behold | FAQ, landing, reisen | — |
| DAILY TASKS | «daglige små oppgaver» / «Gjør de daglige små oppgavene» | selvvalgt pulj (135); dagkort-oppave kan være null; ingenting er plikt | PARTLY ALIGNED | «små oppgaver dere kan velge til dere — hver dag ligger også et forslag i reisen» (tilpasset per side) | slik-fungerer-det:112, priser:265/292, tips:107 | P2 |
| QUESTIONS | «135 oppgaver i 9 kategorier» / BliKjent-panelet | 180 spørsmål 12×15 (Library V2, 28.10; tidl. 12×20), manuelt valg, ingen grense, myk «brukt» | ALIGNED | — | FAQ | — |
| MOOD | (ingen public claim) | privat per bruker, localStorage, kun eget rom | N/A (ingen claim) | evt. «din egen stemning i chatten» (ALDRI «å vise» — vises ikke for partner) | — | — |
| COMPLETION | «begge må bekrefte» (vilkar, personvern) | ENSIDIG valg er nok; 24 t grace; deretter sletting | **FALSE** | «Velger én av dere «Vi fant hverandre», avsluttes reisen for dere begge. Begge kan laste ned samtalen som PDF i 24 timer. Deretter slettes alt permanent.» | vilkar §16 (linje 202), personvern §10 (linje 247) | **P1** |
| PDF | «24 timer … slettes alt» (FAQ) | korrekt + URL-linjer for bilde-meldinger | PARTLY ALIGNED (URL) | copy behold; generator fikses (ingen image-sti) | FAQ, personvern, vilkar + app/api/journey/export-pdf | **P1** |
| LLM/SEÖ-FAKTA | «30-dagers reise», «Bilder låst til dag 15», «PVQ-10, BFI-10, ERQ-6» | 14 dager, dag 8, egne spørsmål | **OUTDATED** | rewrite: 14 dager / bilder fra dag 8 / egne spørsmål (Big Five-rammeverk + forskningsinspirert) / seks dimensjoner / limited beta | public/llms.txt | **P1** |
| BETA/INVITE | «Opprett en konto» (CTA), «De 5 000 første personene …» | invite-only GJENNOMTVUNGET (403 uten invitasjon); vilkar:40 sier det | **MISLEADING** | «Tosom er i limited beta — du trenger en invitasjon for å komme inn.» | landing (CTA-område), FAQ (evt. priser) | **P1** |
| LOGO | header wordmark vs hero/footer to sirkler | to identiteter | **MISALIGNED** | canonical = to sirkler (anbefalt): header følger | GlobalHeader, DashboardNavBar, ToSomLogo | P2 (besluttning) |
| METHODS | «Nå er ærligheten: …» | egne spørsmål, forskningsinspirert, ikke test | ALIGNED (innhold) / copy issue | «Spørsmålene vi bruker» + §27-brødtekst (seks områder) | metoder:328–339 | P2 |
| VITRIN | «her er ingen profil et vitrinasjestykke» | privat profil, kun matching + samtale | ALIGNED (fakta) / copy issue | «her ligger ingen profil ute i en katalog. Den er utgangspunkt for en samtale mellom to som allerede har snakket.» | motpol:389 | P2 |
| PRICING | «Senere er planen 349 kr» | 349 = dokumentert plan; betaling av; 5 000 gratis; ingen abonnement | ALIGNED | behold (avgjørelse 249/349 etter beta) | — | — |
| FIRST DATE | (mangler) | — | gap | ny seksjon «Før dere møtes» + safety + /trygghet-lenke | tips | P2 |
| FAQ-HØYD | (mangler no-action-variant) | ingen valg etter dag 14 → begge kontoer slettes | OUTDATED (uhelhetlig) | tilføy: «Velger ingen av dere noe innen 24 timer, slettes kontoene automatisk.» | FAQ:29 | P2 |

---

## O. Severity

**P0 (farlig / materielt usant):** INGEN.

**P1 (user-facing produkt-truth mismatch):**
1. «begge må bekrefte» — vilkar:202 + personvern:247 (live). Ensidig valg er nok. (Advokat skal se rettingen som P1; rettes i RT1a.)
2. public/llms.txt — «30-dagers», «dag 15», «PVQ-10/BFI-10/ERQ-6» (live). Materielt feil produktfakta, serveres til crawlere.
3. Invite-only beta gjennomtvungen men ikke nevnt i landing/FAQ/priser (live). CTA lover noe systemet avviser.
4. PDF: bilde-meldinger renderes som sti-streng (/api/chat/image/<id>) i PDF-en. «Ingen bilder» er sant som bilde, men intern sti lekkert.

**P2 (klart/merke):**
5. Produktkategori: «datingside» (4 sider) vs «relasjonsplattform» (legal) vs «plattform» (hero/meta) — uenhet.
6. Logo: header wordmark vs hero/footer to sirkler (besluttning + fix).
7. «vitrinasjestykke» (motpol:389, live).
8. «Nå er ærligheten:» (metoder:331, live).
9. «daglig(e) … oppgav(e)(r)» i 4 plasser (slik-fungerer-det, priser ×2, tips).
10. FAQ nevner ikke no-action-slettingen (uhelhetlig, men ikke motstridende).
11. /tips mangler «Før dere møtes» (mulighet, ikke feil).

**P3 (preferanse/slipping — implementeres IKKE bare fordi funnet):**
- MoodsPanel.tsx:171 stale-kommentar «stemninga er DELT for begge partar» (motstrider visbar tekst + runtime).
- ToSomLogo.tsx stale-kommentar «Identisk logo som brukes på landing-siden» (hero wordmark borte siden 04.10).
- getFallbackTask 30-dagers fase-inkser (dead fallback).
- scripts/seed-journey-content.ts seedr 30 dager (dager 15–30 ukjente).
- export-pdf-kommentar «(BliKjent-spørsmål)» ved system-greinen (BliKjent-spørsmål er i praksis user-meldinger).
- PRICING-kommentar «Antall reiser som er gratis» (faktisk per person).
- components/ui/moodTag.tsx + GuidedQuestion-/questions-rutene: døde/parallelle kilder (dokumentert i D/E).

---

## P. Proposed ACT scope (minimal)

**ACT RT1 — P1 (anbefales FØR nye tester inviteres; legal-sannhet + faktasider):**
- RT1a: vilkar §16 + personvern §10: fjern «begge må bekrefte» → ensidig-formulering (N-tabellen). Send retting i LEGAL-PACKAGE.
- RT1b: public/llms.txt: 14 dager / bilder fra dag 8 / egne spørsmål / seks dimensjoner / limited beta-invitasjon.
- RT1c: landing + FAQ: invitasjonsnotis («Tosom er i limited beta — du trenger en invitasjon»).
- RT1d: export-pdf: ekskluder type='image'-rader (eller «📷 Bilde»-placeholder uten sti).

**ACT RT2 — P2 (valgt høy-verdi, ETTER Georges besluttning i N/K/I):**
- RT2a: kanonisk terminologi: 4 brødtekstsider → «datingtjeneste bygget for ekte relasjoner» (besluttning først).
- RT2b: metoder: «Spørsmålene vi bruker» + ny brødtekst (seks områder).
- RT2c: motpol: vitrinasjestykke-erstatning.
- RT2d: daglig-oppgave-ordstilling (4 plasser) → «kan velge»-formulering.
- RT2e: logo (hvis to sirkler = canonical): header følger (ToSomLogo → ResonanceMark/Logo) (besluttning først).
- RT2f: tips: «Før dere møtes»-kort + safety + /trygghet-lenke.
- RT2g: FAQ: tilføy no-action-setningen (24 t → automatisk sletting).

**UTENFOR:** pris (egen avgjørelse etter gratis beta; RT-anbefaling i L), legal-sidene ellers (advokat-avhengig), P3-poster (kun med eksplisitt ordre).

**Avhengigheter/sekvens:** RT1 kan kjøre umiddelbart (ingen besluttning nødvendig). RT2a/RT2e krever Georges besluttning først. RT1a bør leveres til advokaten som retting, ikke som ny spørsmål.

---

## Q. Test-strategi (guards for senere ACT)

- **RT-01 — ingen daglig-spørsmål-claim med plikt:** public «hver dag»-claims må ligge i allowlist (FAQ:21, landing:121, reisen:180/201, reisen/layout:8) og må IKKE inneholde «må»/«obligatorisk»/«krav» i spørsmålskontekst. Dagstall må alltid renderes fra JOURNEY_TOTAL_DAYS (ingen hardkodet 14 i copy utover allowlist).
- **RT-02 — ingen daglig-oppgave-plikt:** grep «daglig(e)?.{0,20}oppgav» i app/ → hver treff må ha «kan»/«velge» i setningskontekst; de 4 flagg-plasser må matche RT2d-teksten.
- **RT-03 — bilateral requirement:** «begge må (bekrefte|velge|gi samtykke)» forbydtes i vilkar/personvern/FAQ (case-insensitive). Completion-copy må inneholde «én av dere» + «for dere begge» + «24 timer».
- **RT-04 — PDF-image-truth:** render export-pdf-HTML mot fikstur-samtale (tekst + system + bilde-melding): ingen `<img>`, ingen «/api/chat/image/», ingen R2-sti; navn + datoer TILSTEDE; bilde-meldinger fraværende eller «📷 Bilde».
- **RT-05 — journey 14/8-truth:** «30 dager»/«30-dagers»/«dag 15»/«15 dager» = 0 treff i aktiv copy (app/ + public/, unntatt docs/archive). «dag 8» kun i bilde-kontekst.
- **RT-06 — kanonisk logo:** Hero + Footer + GlobalHeader importerer det valgte kanoniske komponentet (assert import-streng).
- **RT-07 — methods own-question-truth:** metoder inneholder 0 treff på «BFI-10|PVQ-10|ERQ-6|ECR-» som aktive instrumenter; «klinisk»/«standardisert» kun i fornektelseskontekst.
- **RT-08:** «nå er ærligheten» = 0 treff (app/, case-insensitive).
- **RT-09:** «vitrinasjestykke» = 0 treff (app/).
- **RT-10 — pris single-source:** hardkodet «349|249» kun tillatt i config/legal.ts, __tests__/, docs/ (ikke app/ + public/); alle public priser via PRICING.journeyPrice; «Senere er planen»-markering beholdes (utvidelse av eksisterende FB-04; dekk også llms.txt).

---

## R. Final recommendation

1. **Neste steg (George):**
   - Beslutt terminologi (anbefaling: brødtekster «Tosom er en datingtjeneste bygget for ekte relasjoner»; hero + legal uendret for nå).
   - Beslutt kanonisk logo (anbefaling: to sirkler; header følger — SIMPLE CONSISTENCY FIX).
   - **«kjør» ACT RT1** (P1) — anbefales FØR flere tester inviteres: live-legal sier usant («begge må bekrefte») og llms.txt er materielt utdatert.
   - Deretter ACT RT2 (P2) med besluttningene innbakt.
   - RT1a rettes INN I advokat-remisspakken (LEGAL-PAGES-PRELAWYER-REVIEW), ikke som ny avtaleendring.
2. **Pris:** hold 349 som dokumentert plan; avgjør 249/349 etter gratis beta (bevis: gjentaks-etterspørsel, «Start ny reise»-valg, prisoppfatning).
3. **Ikke-aktør:** IDENTITY-TRUST-planen holdes separat (ikke en del av RT1/RT2).

**Filstatus:** Eneste ny fil: docs/RUNTIME-DOCUMENTATION-TRUTH-PLAN-v1.0.md (dette). Ingen andre filer rørt. Ingen commit/push/deploy.

---

## S. ACT RESULT — RT1 (10.27.2026)

**Status: IMPLEMENTERT — STOPPED FOR COMMIT (kjørt kontrollert ACT per Georges direktiv).**

Beslutninger (D1–D7) innarbeidet. Full ACT-logg: `docs/RT1-RUNTIME-TRUTH-ACT-v1.0.md`.

Kortversjon:

1. **Completion er nå bilateralt (D4).** Ny `JourneyDecision`-enum + per-deltaker felt på
   `Match` (`completionA/B`, `completionADecidedAt/BDecidedAt`) — normal Prisma-migrasjon
   (`20261027000000_bilateral_completion`). `POST /api/journey/exit` på dag 14 registrerer
   hvert valg; avgjørelsestabell: FOUND+FOUND → mutual (grace 24 t + PDF),
   FOUND+NEW / NEW+NEW → `endJourney('new_journey')` (ingen PDF), part + PENDING →
   WAITING (reisen fortsetter, ingen sletting).
2. **PDF (D5/D6):** krev mutual FOUND + grace-state + ikke-bannlyst deltaker; inneholder
   KUN tekst — `type: 'image'`-meldinger utelatt i query (ingen image-stier, ingen R2-URL).
   On-demand, ikke persistert, no-store — arkitektur uendret.
3. **no_action:** UENDRET semantikk. Verifisert runtime: dag 14 → ~24 t → ingen handling →
   **begge User-kontoene slettes** (A–G: alt slettes — journey, chat, bilder, match,
   kontoer, profiler; MatchHistory/Report/AuditLog beholdes; Order slettes → free quota
   brennes). Klassifisert **PRODUCT DECISION REQUIRED** (se ACT-dokument §3).
4. **Copy/brand:** datingtjeneste-terminologi (5 sider), methods-tekst, vitrinasjestykke borte,
   «Før dere møtes» på /tips, journey-tool-wording på /reisen, invite-beta-notis
   (landing CTA + FAQ + /login), llms.txt skrevet til current truth (14/dag 8/egne
   spørsmål/invite-beta/ingen instrumenter), logo: UniversalMenu (global header) + ToSomLogo
   (header/dashboard) bruker nå canonical to-sirkler-merket.
5. **Legal (D10):** UENDRET — «begge må bekrefte» er nå sann mot runtime. Lawyer review
   fortsatt PENDING.
6. **Pris (D7):** UENDRET — 349 fremtidig plan (PRICING single-source), 249 utsatt.
7. **DB-sjekk (read-only):** prod JourneyDayContent 1–14 = **UNKNOWN** (ingen prod-tilgang
   fra repo). Dev-DB: **0 rader** i JourneyDayContent → runtime kjører på fallback-innhold
   (valgfritt daglig fokuskort — konsistent med D11).
8. **Tests:** RT-01…RT-12 implementert (`__tests__/rt1-runtime-truth.test.ts`, 741 asserts).
   `npm run verify` (lang + tsc + full jest): 2238 passed. `npm run lint`: 0 errors.
   `npm run build`: OK. Playwright: chat/match/matching-journey (se ACT-dokument).
9. **Commit: NEI. Push: NEI. Deploy: NEI. Real users invitert: NEI.**


### S.1 — RT1 FINAL: PRODUCT DECISION IMPLEMENTATION (27.10.2026, erstatter S.3 og S.5)

George tok den utfersatte beslutningen: **D8 — ACCOUNT != JOURNEY** +
**D9 — DECISION WINDOW 72 HOURS** (produkregel, ikke forskningsbasert).

1. **no_action (endret):** reise lukkes uten gjensidig resultat —
   journey/chat/bilder/match slettes; **User, Account, Profile, Onboarding
   og gratisorden beholdes**; begge resettes til IDLE. Destruktiv
   User-sletting fjernet fra hele journey-stien (også crons grace-cleanup
   for mutual-found — den slettet før begge kontoer etter 24 t).
   Eksplisitte GDPR/admin/blokkering/aldersgrense-fløyer uforsvakket.
2. **72-timers-vindu (nytt):** sentralisert i `config/journey.ts`
   (`COMPLETION_DECISION_WINDOW_HOURS/MS`); delt deterministisk statmaskin
   i `lib/journey/completion.ts` (exit-route + cron). Ved utløpt vindu:
   PENDING+PENDING → NO_ACTION; FOUND+PENDING → NOT MUTUAL (no_action-
   ekvivalent). Exit-ruten: valg etter vinduet → 410.
3. **Free quota (uendret):** person-basert, refunderes ikke ved reiseslutt;
   Order + Quota-teller beholdes ved no_action (ingen journey-basert
   recycling).
4. **Legal (faktisk samsvar kun):** /vilkar + /personvern: «slettes begge
   kontoer» → «slettes samtalen, bildene og reisen permanent — kontoen
   deres beholdes». Lawyer-package oppdatert med produktfaktum (reise-
   inaktivitet sletter aldri konto). Lawyer review fortsatt PENDING.
5. **Tests:** RT-C01…RT-C18 (`__tests__/rt1-final-decisions.test.ts` +
   rewrite av `integration/s9-deletion.test.ts` mot test-DB; RT-C12 via
   eksisterende `integration/delete-account.test.ts`). verify: 2266 passed.
   Detail: `docs/RT1-RUNTIME-TRUTH-ACT-v1.0.md` §17–22.
6. **Commit: NEI. Push: NEI. Deploy: NEI. Real users invitert: NEI.**
