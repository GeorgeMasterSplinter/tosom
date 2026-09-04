# TOSOM — GJENNOMFØRING

**Dato:** 2026-09-04
**Commit:** `8655a4f`
**For:** Qwen3.8 27B Q8 i ACT-modus
**Skrevet av:** Claude (senior fullstack-utvikler og systemagent i ToSom)
**Arbeidsmetode:** [`ACT-PIPELINE-v1.0.md`](ACT-PIPELINE-v1.0.md) — gjelder uendret

> Dette er en utførelsesinstruks. Hver oppgave er én fil, ett steg, én verifisering.
> Du utfører kun det som står her. Ved usikkerhet: stopp og spør George.

---

## 0. Før du begynner

### Les dette først
1. `ai/system_prompt.md` — REGEL 0 (bokmål) og agent-rollen
2. `ACT-PIPELINE-v1.0.md` — arbeidssyklus, patch-regler, §16 Auditlogg
3. `docs/CLAUDE-MASTERPLAN.md` — hvor prosjektet står (beta 88/100)

### Grunnregler
- **Én fil per patch.** Aldri to.
- **`npm run verify` mellom hver patch.** Rødt → stopp og rett før du går videre.
- **Bokmål overalt.** Kodekommentarer, tekst, commit-meldinger.
- **Koden vinner** over dokumentasjonen. Finner du avvik: rapporter, ikke skjul.
- **Rør ikke** matchevekter, terskler eller journey-kadens (DI-2).
- **Ingen nye avhengigheter** uten godkjenning.

### Baseline (målt 04.09, må holde hele veien)
```
tsc --noEmit    0 feil
jest            433/434 (52 suiter, 1 skippet)
verify:lang     grønn
```

### Rapportformat etter hver oppgave
```
## Utført
[1–3 linjer]

## Filer
- sti/til/fil.ts — hva som skjedde

## Verifisert
- npm run verify: grønn (tsc 0, jest 433/434, lang grønn)

## Neste
[neste oppgave-ID, eller «avventer godkjenning»]
```

---

## 1. Statusbilde

**Ferdig siden auditen** (commit `52fbfc0` + `8655a4f`): alle ti auditfunn er
lukket, tre nye tester er skrevet, og CD kjører nå databasemigrering før deploy.
Ingenting fra auditen gjenstår.

**Dette dokumentet dekker to nye arbeidsstrømmer:**

| Strøm | Kilde | Oppgaver | Karakter |
|---|---|---|---|
| **A — Nettstedsfunn** | `NeedAttention.md` (21 funn fra Teste.no) | A1–A8 | Små, trygge, høy verdi |
| **B — Spill i chat** | `Games.md` | B1–B9 | Ny funksjon, større |

**Rekkefølge: hele A før B.** Strøm A er lavrisiko og løfter et produkt som
allerede er i produksjon. Strøm B er ny funksjonalitet som ikke haster.

---

## 2. STRØM A — Nettstedsfunn

21 funn, men mange er duplikater av samme sak. De grupperes til åtte oppgaver.

### A1 · Kanonisk URL og lengre beskrivelse
**Fil:** `app/layout.tsx`
**Løser:** «Missing canonical URL», «Description too short (81 chars)», «Meta description too short for AI snippets»

Legg til `metadataBase` og `alternates.canonical`. Utvid `description` til
140–160 tegn — rolig og moden tone, ikke nøkkelordstapling. Samme tekst i
`openGraph` og `twitter`.

**Verifiser:** `npm run verify` · `npm run build` · bekreft at `<link rel="canonical">` finnes i kildekoden på forsiden.

---

### A2 · Konsistent robots-policy
**Fil:** `app/robots.ts`
**Løser:** «Inconsistent AI crawler policy» (×2)

I dag er policyen implisitt og inkonsekvent. Velg **én** linje og gjør den
eksplisitt. Anbefaling: tillat alle crawlere, behold `disallow` på `/admin` og
`/api`. ToSom har ingenting å skjule for søk — men admin og API skal aldri
indekseres.

**Merk:** hvis George vil blokkere AI-crawlere, er det en produktbeslutning.
Spør før du velger blokkering.

**Verifiser:** `npm run verify` · besøk `/robots.txt` lokalt.

---

### A3 · Strukturerte data (JSON-LD)
**Fil:** `app/layout.tsx`
**Løser:** «No JSON-LD structured data», «Missing WebSite structured data», «Missing Organization structured data», «No sameAs knowledge graph links» (×2)

Legg inn to JSON-LD-blokker i `<head>`: `Organization` og `WebSite`.
Bruk `COMPANY` fra `config/legal.ts` som kilde — aldri hardkodede verdier.

`sameAs` utelates hvis ToSom ikke har offentlige profiler ennå. Et tomt felt er
bedre enn en lenke som ikke finnes.

**Verifiser:** `npm run verify` · valider JSON-LD manuelt i nettleseren.

---

### A4 · Tap targets på mobil
**Filer:** `components/ui/layout/AppHeader.tsx`, `components/ui/layout/Footer.tsx`
**Løser:** «14 tap targets too small (< 48px)» (×2)
**Merk:** dette er **to** patcher — én per fil.

Fjorten lenker er under 48×48 px. Øk klikkflaten med padding, ikke med større
skrift — designet skal ikke endres visuelt. Berørte mønstre: `flex-shrink-0`
(logoen i `AppHeader`) og `text-base transition-all` (tre lenker i `Footer`).

**Dette er den eneste oppgaven i strøm A som berører design.** Endre kun
klikkflate. Ser noe annerledes ut etterpå, har du gått for langt.

**Verifiser:** `npm run verify` · mål elementene i nettleserens utviklerverktøy.

---

### A5 · Overskriftsrekkefølge
**Fil:** landingssiden (finn den med `grep -rn "<h2" app/\(landing\)/`)
**Løser:** «Heading hierarchy has issues», «Accessibility: Ensure the order of headings is semantically correct»

Overskriftsnivåene hopper over trinn. Rett rekkefølgen slik at nivåene følger
hverandre. Endre kun nivået, aldri teksten.

**Verifiser:** `npm run verify` · les gjennom overskriftene i rekkefølge.

---

### A6 · Permissions-Policy og Vary-header
**Fil:** `next.config.js`
**Løser:** «Missing Permissions-Policy header», «Compressed responses missing Vary: Accept-Encoding» (×2)

Legg til `Permissions-Policy` som slår av kamera, mikrofon og geolokasjon —
ToSom bruker ingen av dem. Legg til `Vary: Accept-Encoding`.

**Verifiser:** `npm run verify` · sjekk svarhodene med `curl -I` lokalt.

---

### A7 · llms.txt
**Fil:** ny, `app/llms.txt/route.ts` (eller `public/llms.txt`)
**Løser:** «No llms.txt file found», «No llms-full.txt file found»

Kort fil som beskriver hva ToSom er, på ToSom-språk. Ingen markedsføring.
`llms-full.txt` er valgfri — hopp over den hvis `llms.txt` dekker behovet.

**Verifiser:** `npm run verify` · hent `/llms.txt` lokalt.

---

### A8 · Organisasjonsnummer og tilgjengelighetserklæring 🔴 KREVER GEORGE
**Løser:** «Organisasjonsnummer not found on the site», «No accessibility statement found»

`config/legal.ts` har `orgNumber: null` — selskapet er ikke registrert ennå.
**Du kan ikke fikse dette.** Når George gir organisasjonsnummeret, settes det
i `config/legal.ts`, og resten følger automatisk (`companyFooterLine` leser det
allerede).

Tilgjengelighetserklæring er lovpålagt i Norge og må skrives av et menneske.

**Handling nå:** ingen. Rapporter som blokkert av George.

---

## 3. Verifisering av strøm A

Etter A1–A7:

```bash
npm run verify          # må være grønn
npm run build           # må være grønn
```

Deretter, når endringene er i produksjon: be George kjøre Teste.no-skannene på
nytt og bekrefte at funnene lukkes.

---

## 4. STRØM B — Spill i chat

Fra `Games.md`: Tic-Tac-Toe og Stein–Saks–Papir som chat-bobler.

### Konseptsjekk før du begynner

Spill i en plattform som forbyr gamification krever at grensen holdes presist.
Disse fire reglene er ufravikelige:

| Regel | Hvorfor |
|---|---|
| Ingen poeng, ingen serier, ingen statistikk over tid | Det er gamification (I-8) |
| Spillet kan aldri påvirke journey, matching eller kvote | Reisen er ikke et spill |
| Ingen varsler når partneren gjør et trekk | Ingen stressmekanikk |
| Resultat vises rolig i chatten, uten feiring | ToSom-tonen |

Et spill er et **valg to voksne tar sammen for å bryte isen**. Ikke en
belønningssløyfe. Bryter en patch dette: stopp og spør.

**Godkjenning:** George må bekrefte konseptet før B1 starter. Spillene er ikke
nevnt i SUPER-MASTERPLAN, og de berører I-8.

---

### B1 · Datamodell
**Fil:** `prisma/schema.prisma` + ny migrasjon

Én modell, `GameSession`, knyttet til `Conversation`. Felter: type, tilstand
(Json), hvem sin tur, vinner, tidsstempler. `Games.md` nevner Redis som
alternativ — **bruk Postgres**, prosjektet har ingen Redis, og en ny
avhengighet krever egen godkjenning.

Én aktiv økt per samtale per spilltype.

**Verifiser:** `npx prisma validate` · `npm run verify`
**Merk:** migrasjonen må også kjøres mot produksjon. CD gjør dette automatisk siden `52fbfc0`.

---

### B2 · Spillmotorer (ren logikk)
**Filer:** `lib/games/ticTacToe.ts`, `lib/games/rps.ts`
**Merk:** to patcher — én per fil.

Ren logikk uten database og uten nettverk: gyldig trekk, neste tilstand,
vinner, uavgjort. Rene funksjoner er trivielle å teste, og reglene bor ett sted.

**Verifiser:** `npm run verify` etter hver fil.

---

### B3 · Tester for motorene
**Fil:** `__tests__/games-engine.test.ts`

Skriv testene **før** API-rutene. Dekk: gyldige og ugyldige trekk, alle
vinnerlinjer, uavgjort, trekk utenfor tur, trekk etter at spillet er ferdig.

**Verifiser:** `npm run verify`

---

### B4 · API — start spill
**Fil:** `app/api/game/start/route.ts`

Følg mønsteret fra `app/api/chat/mood/route.ts` nøyaktig: `csrfCheck` først,
deretter sesjon, deretter deltakersjekk mot `userAId`/`userBId`, så
`pgCheck`-ratebegrensning. Ikke-deltaker skal få 403.

**Verifiser:** `npm run verify`

---

### B5 · API — gjør trekk
**Fil:** `app/api/game/move/route.ts`

Samme vern som B4. I tillegg: valider at det faktisk er spillerens tur, og at
trekket er gyldig ifølge motoren. **Serveren er fasit** — klienten skal aldri
kunne sende en tilstand.

Send Pusher-hendelse til `private-conversation-{id}`. Feil i Pusher må aldri
blokkere trekket; det er allerede lagret.

**Verifiser:** `npm run verify`

---

### B6 · Tester for rutene
**Fil:** `__tests__/games-routes.test.ts`

Dekk: ikke-deltaker får 403, trekk utenfor tur avvises, manglende CSRF avvises,
avsluttet spill tar ikke flere trekk.

**Verifiser:** `npm run verify`

---

### B7 · UI-komponenter
**Filer:** `app/chat/components/TicTacToeBoard.tsx`, `app/chat/components/RockPaperScissors.tsx`
**Merk:** to patcher — én per fil.

Følg mønsteret i `MoodsPanel.tsx` og `BliKjentPanel.tsx`. Bruk
`config/design-tokens.ts` — ingen hardkodede farger. Minimum 48 px klikkflate
(samme krav som A4). Tydelig turindikator, rolig og dempet.

Ingen animasjoner som feirer. En vinner vises, ikke hylles.

**Verifiser:** `npm run verify`

---

### B8 · Integrasjon i chatten
**Fil:** `app/chat/components/ChatContainer.tsx`

Legg til startknapper i samme panelrad som «Bli kjent» og «Oppgaver». Bind
Pusher-lytteren i `ChatContext.tsx` hvis det trengs — **det er i så fall en
egen patch.**

**Verifiser:** `npm run verify` · manuell test i to nettlesere.

---

### B9 · Dokumentasjon
**Filer:** `docs/ACT-STATE.json`, `docs/README.md`

Ny leveranse i `ACT-STATE.json`, og `Games.md` registreres i `README.md`.
Oppdater `Games.md` med hva som faktisk ble bygget — Redis-nevningen er nå feil.

**Verifiser:** `npm run verify` · valider at JSON-filen er gyldig.

---

## 5. Oppsummert rekkefølge

| # | Oppgave | Filer | Blokkert av |
|---|---|---|---|
| A1 | Kanonisk URL og beskrivelse | 1 | — |
| A2 | Robots-policy | 1 | — |
| A3 | Strukturerte data | 1 | — |
| A4 | Tap targets | 2 | — |
| A5 | Overskriftsrekkefølge | 1 | — |
| A6 | Sikkerhets- og Vary-header | 1 | — |
| A7 | llms.txt | 1 | — |
| A8 | Orgnummer, tilgjengelighet | — | 🔴 George |
| B1 | Datamodell | 1 + migrasjon | 🔴 Georges godkjenning |
| B2 | Spillmotorer | 2 | B1 |
| B3 | Motortester | 1 | B2 |
| B4 | API start | 1 | B3 |
| B5 | API trekk | 1 | B4 |
| B6 | Rutetester | 1 | B5 |
| B7 | UI-komponenter | 2 | B6 |
| B8 | Chat-integrasjon | 1 | B7 |
| B9 | Dokumentasjon | 2 | B8 |

**Sum:** 20 patcher. Strøm A kan gjøres i dag. Strøm B venter på godkjenning.

---

## 6. Når du skal stoppe og spørre

- En patch vil berøre en invariant
- To kilder er uenige om hva som er riktig
- Du vurderer å endre en test for å få den grønn
- Løsningen krever en ny avhengighet
- Endringen berører sletting, betaling eller innlogging
- Et spill vil kunne påvirke journey, matching eller kvote
- Du er i tvil om noe er gamification

**Spør med et konkret forslag:** «Jeg foreslår X fordi Y. Alternativet er Z.»

---

*Hver patch berører noe som betyr noe for noen. Jobb rolig. Jobb presist.*
