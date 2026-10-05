# TOSOM — ACT-INSTRUKS PRE-LAUNCH

**Dato:** 2026-10-05
**Commit:** `696c7ee`
**For:** Qwen3.8 27B Q8 og Cline i ACT-modus
**Skrevet av:** Cline (senior fullstack-utvikler og systemagent i ToSom)
**Grunnlag:** [`LanseringsCheckList.md`](LanseringsCheckList.md) — sjekklisten som skal krysses av
**Arbeidsmetode:** [`ACT-PIPELINE-v1.0.md`](ACT-PIPELINE-v1.0.md) — gjelder uendret

> Dette er en utførelsesinstruks. Hver oppgave er én fil, ett steg, én verifisering.
> Du utfører kun det som står her. Ved usikkerhet: stopp og spør George.
> Når en oppgave er ferdig og verifisert, krysser du av i sjekklisten — aldri før.

---

## 0. Før du begynner

### 0.1 Les dette først — i denne rekkefølgen
1. `ai/system_prompt.md` — REGEL 0 (bokmål) og agent-rollen
2. `docs/ACT-PIPELINE-v1.0.md` — arbeidssyklus, patch-regler, §6 invarianter, §11 usikkerhet
3. `docs/LanseringsCheckList.md` — **funnet** du skal rette (K-x / V-x / M-x)
4. Denne filen — **hvordan** og **i hvilken rekkefølge**

Les funnet i sjekklisten **før** du leser oppgaven her. Sjekklisten forklarer
hvorfor; denne filen forklarer hva.

### 0.2 Grunnregler
- **Én fil per patch.** Aldri to. Oppgaver med flere filer er delt i delsteg (a, b, c).
- **`npm run verify` mellom hver patch.** Rødt → stopp og rett før du går videre.
- **Les hele filen før du endrer den.** Ikke bare linjene du tror du skal endre.
- **Bokmål overalt.** Kodekommentarer, brukertekst, testnavn, commit-meldinger.
- **Koden vinner** over denne instruksen. Finner du avvik: rapporter, ikke skjul.
- **Ingen nye avhengigheter** uten godkjenning. Versjonsoppdatering er det samme.
- **Endre aldri en test for å få den grønn.** En rød test kan ha rett.
- **Rør aldri produksjonsdatabasen direkte.** Alltid repo → deploy.
- **Rør ikke** matchevekter (`DIMENSION_WEIGHTS`), `MIN_SCORE` eller `MIN_COHORT_SIZE` (DI-2).

### 0.3 Personvern i repoet — ufravikelig
- **Forretningsadressen publiseres aldri.** Den er også Georges private adresse.
  `COMPANY.address` i `config/legal.ts` skal **forbli `null`**. Skriv aldri inn
  en adresse i kode, tekst, dokumentasjon, testdata eller commit-melding —
  selv om Enhetsregisteret, en advokat eller en lov ser ut til å kreve det.
  Adressekravet (e-handelsloven § 8) avklares av George med advokat (PL-G6).
- **Ingen hemmeligheter** i kode eller dokumentasjon (`DATABASE_URL`, nøkler, passord).
- **Ingen ekte brukerdata** i tester, logger eller rapporter. Bruk konstruerte testdata.

### 0.4 Baseline (målt 05.10, må holde hele veien)
```
npm run verify   → språkvakt grønn (1028 filer) · tsc 0 feil · jest 450/451 (1 hoppet over)
npx next lint --max-warnings 0   → 0 advarsler
```
Antallet tester skal bare **øke**. Faller det, har noe gått tapt — stopp.

---

## 1. Hvem gjør hva

| Rolle | Ansvar | Kjennetegn på oppgaven |
|---|---|---|
| **Qwen** (lokal, 27B Q8) | Avgrensede patcher i én fil med tydelig mønster: tekst, frontend, små API-endringer, nye tester etter eksisterende mal | Merket **Q** |
| **Cline** | Oppgaver som krever bred kontekst eller tverrgående resonnering: sletting, samtykke, auth, matching, journey, avhengigheter | Merket **C** |
| **George** | Beslutninger, produksjon, Vercel, DNS, advokat, manuelle tester | Merket **G** — ingen agent utfører |

**Regler for fordelingen:**
- Qwen tar **aldri** en C-oppgave alene. Står Qwen fast på en Q-oppgave etter
  to forsøk: stopp, rapporter, overlat til Cline.
- Cline kan ta Q-oppgaver når Qwen ikke er tilgjengelig.
- G-oppgaver forberedes av agentene (sjekkliste, kommando, tekstutkast), men
  utføres og krysses av **kun av George**.
- Oppgaver merket 🔒 berører sletting, auth, betaling, matching, journey eller
  en invariant. De krever Georges eksplisitte «kjør» **før første patch**,
  uansett hvem som utfører.

---

## 2. Slik krysser du av i sjekklisten

Sjekklisten er `docs/LanseringsCheckList.md` §6. Den er den eneste lanseringsfasiten.

### 2.1 Når et punkt kan krysses av
Et punkt krysses av **først når alt dette er sant**:
1. Alle delsteg i oppgaven som eier punktet er utført
2. `npm run verify` er grønn etter siste patch
3. Testene oppgaven krever, finnes og er grønne
4. Punktet er verifisert på den måten oppgaven beskriver (test, curl, manuell sjekk)

Er ett av disse usant: **ikke kryss av.** Et feilaktig kryss er verre enn ingen kryss.

### 2.2 Hvordan
Bytt `[ ]` med `[x]` i første kolonne, og legg til dato og oppgave-ID i
**Punkt**-kolonnen. Ingenting annet på linjen endres.

```diff
- | [ ] | Kontosletting virker ende-til-ende, med feilmelding ved feil | K-1 | **Før lansering — og før flere testere** |
+ | [x] | Kontosletting virker ende-til-ende, med feilmelding ved feil *(✓ 2026-10-07 · PL-01)* | K-1 | **Før lansering — og før flere testere** |
```

**Finn riktig linje:** Hver oppgave siterer sjekklistepunktene i «…». Et sitat
som slutter på «…» er forkortet — finn linjen i §6 som begynner med teksten.
Tre punkter inneholder selv anførselstegn og er derfor beskrevet med ord i
stedet for sitert ordrett: «Glemt passord»-punktet (§6.5), «Én match innen 24
timer»-punktet (§6.6) og innloggingssiden «uten spøk» (§6.6). Søk på
nøkkelordene. Finner du ikke punktet: stopp og spør — ikke lag et nytt.

### 2.3 Hva som **ikke** krysses av av agenter
- Punkter som krever produksjon, Vercel, DNS, advokat eller manuell test i
  nettleser (G-oppgaver). Agenten kan skrive «*(klar for George · PL-xx)*»
  bak punktet når forarbeidet er ferdig, men ikke krysse.
- Punkter der testen krever en database som ikke er tilgjengelig lokalt.
  Skriv «*(test skrevet, ikke kjørt mot DB · PL-xx)*» og la George kjøre den.

### 2.4 Samme commit
Avkrysningen gjøres i **samme commit** som den siste koden i oppgaven —
sammen med oppdatering av `docs/ACT-STATE.json` (ACT-PIPELINE §7).
Avkrysning er en egen patch (én fil), men samme commit.

---

## 3. Beslutninger George må ta — før de berørte oppgavene starter

Agentene **starter ikke** en oppgave som venter på en beslutning. Spør George
med forslaget under, og noter svaret i `ACT-STATE.json` før første patch.

| ID | Spørsmål | Agentens forslag | Blokkerer |
|---|---|---|---|
| **D-1** | Hvordan skal ubesvarte skalaspørsmål håndteres? | **Påkrevd per steg** (enklest, ærligst). Alternativ: `null` + fallback til ordoverlapp under 80 % besvart | PL-08 |
| **D-2** | Hvilke dealbreakere skal være aktive? | **Fjern** modenhetsgap og sikkerhetsnivå (ingen ærlig datakilde). **Ikke** koble `neverCrossBoundary` til matching: verdiene (respekt, tid alene, ærlighet …) er egne behov, ikke egenskaper hos en partner, og kan ikke sammenlignes ærlig. Grensene brukes i stedet som samtalegrunnlag, og ingen tekst lover at de styrer matchingen. Livsrytme/preferanser forblir dokumentert inaktive | PL-10 |
| **D-3** | Skal ønske om barn være dealbreaker? | **Ja**, bidireksjonelt: «ja» ↔ «nei» blokkerer; «usikker»/«åpen» blokkerer aldri | PL-11 |
| **D-4** | Ukjent postnummer — avvise eller blokkere matching? | **Avvis i onboarding** med rolig melding | PL-12 |
| **D-5** | Kjønns- og søkevalg | Forklar «Kjemisk tiltrekning» («Kjønn er ikke avgjørende for meg»). Legg til «Ikke-binær» som søkevalg | PL-13 |
| **D-6** | Hvordan beregnes reisedagen? | **Fra `bothSeenAt`** (reisen starter når begge har vært innom, B9): hele døgn siden start + 1, norsk tid. Alltid lik for begge | PL-06 |
| **D-7** | Eksplisitt «Opprett konto» eller auto-registrering? | **Eksplisitt**: egen visning «Ny her?» med passord to ganger og samtykke. Innlogging oppretter aldri konto | PL-05 |
| **D-8** | Hvor lenge lagres bevis ved rapport? | **90 dager** etter at rapporten er lukket, deretter automatisk sletting. Beskrives i personvernerklæringen | PL-15 |
| **D-9** | Bloggen | **Avpubliser** nå (404). Skriv om etter lansering | PL-21 |

---

## 4. Statusbilde og rekkefølge

| Fase | Mål | Oppgaver | Før man går videre |
|---|---|---|---|
| **1 — Beskytt dagens brukere** | Ingen skal miste kontroll over egne data | PL-01 … PL-04 | K-1, K-2, K-8 avkrysset |
| **2 — Gjør løftene sanne** | Det systemet sier, er sant | PL-05 … PL-14 | K-3 … K-7 avkrysset |
| **3 — Kvalitet og tillit** | Trygt, tilgjengelig, ryddig | PL-15 … PL-26 | V-punkter merket «Før lansering» avkrysset |
| **4 — George** | Produksjon, juridisk, manuell test | PL-G1 … PL-G12 | G-punkter avkrysset av George |
| **5 — Sluttkontroll** | Ny vurdering mot sjekklisten | PL-99 | §6 komplett, regresjon §7.3 utført |

**Hele fase 1 før fase 2.** Innen en fase: følg nummerrekkefølgen med mindre
oppgaven sier noe annet. G-oppgavene kan George gjøre parallelt når som helst.

---

## 5. FASE 1 — Beskytt dagens brukere

### PL-01 · Kontosletting som faktisk sletter  🔒 · **C**
**Funn:** K-1 · **Sjekkliste §6.1:** «Kontosletting virker ende-til-ende, med feilmelding ved feil» og «Integrasjonstest for kontosletting med aktiv reise»

**PL-01a · Backend** — `app/api/settings/delete-account/route.ts`
- Fjern det interne `fetch(.../api/journey/exit)`-kallet (det mangler CSRF-header og feiler stille).
- Kall `endJourney` direkte når brukeren har en aktiv match:
  ```ts
  import { endJourney } from '@/lib/journey/endJourney';
  // …
  const activeMatch = await prisma.match.findFirst({
    where: { status: 'active', OR: [{ userAId: userId }, { userBId: userId }] },
    select: { id: true },
  });
  if (activeMatch) {
    await endJourney(activeMatch.id, 'early_exit');
  }
  ```
- I transaksjonen: `Conversation` har ingen cascade fra `User`, og i dag settes
  bare `endedAt` — da feiler `user.delete()` på fremmednøkkelen. Slett i denne
  rekkefølgen for alle samtaler der brukeren er `userA`/`userB`:
  `message` (via `conversationId`) → `journeyStateLog` → `resonanceSession` →
  `conversation`. Deretter resten som i dag, og `user` til slutt.
- `MatchHistory`, `Report`, `UserBlock` og `AuditLog` skal overleve. Rør dem ikke.
- Oppdater kommentarene i fila slik at de stemmer med koden.

**Verifiser:** `npm run verify`

**PL-01b · Frontend** — `app/settings/page.tsx`, `handleDelete` i Trygghet-seksjonen (ca. linje 500)
```ts
const handleDelete = async () => {
  if (deleteText !== "SLETT") return;
  setDeleteError(null);
  try {
    const res = await csrfFetch("/api/settings/delete-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmation: "DELETE" }),
    });
    if (!res.ok) {
      setDeleteError("Vi fikk ikke slettet kontoen din. Ingenting er slettet. Prøv igjen, eller skriv til support@tosom.no.");
      return;
    }
    await signOut({ callbackUrl: "/" });
  } catch {
    setDeleteError("Vi fikk ikke kontakt. Ingenting er slettet. Prøv igjen.");
  }
};
```
Legg til `const [deleteError, setDeleteError] = useState<string | null>(null);`
og vis feilen i bekreftelsesdialogen med samme stil som `reportError`.
Rør **ikke** den døde `SlettKontoSection` — den slettes i PL-26.

**Verifiser:** `npm run verify`

**PL-01c · Test** — ny fil `__tests__/delete-account.test.ts`
Mønster: `__tests__/journey-queue-exit-b8.test.ts`. Mock `@/lib/auth/session`,
`@/lib/prisma`, `@/lib/journey/endJourney`, `@/lib/auth/csrf`, `@/lib/email`. Dekk:
1. Uten body → 400, ingen sletting
2. Feil `confirmation` → 400
3. Uten sesjon → 401
4. Aktiv match → `endJourney(matchId, 'early_exit')` kalles før transaksjonen
5. Uten aktiv match → `endJourney` kalles ikke, `user.delete` kalles
6. `matchHistory` røres ikke

**Verifiser:** `npm run verify` — testantallet øker.

**PL-01d · Integrasjonstest** — `__tests__/integration/delete-account.test.ts`
Mønster: `__tests__/integration/s9-deletion.test.ts`. To brukere med match,
samtale og meldinger fra begge → slett A → `User`, `Profile`, `Message`,
`Conversation`, `JourneyProgress` for A er borte; B er `IDLE`; `MatchHistory` finnes.
Uten lokal test-DB: skriv testen og merk «*(test skrevet, ikke kjørt mot DB · PL-01d)*».

**Kryss av når:** a–c er grønne og d er skrevet. Punktet «Brukere som har
forsøkt å slette seg …» tilhører **PL-G1** (George).

---

### PL-02 · Samtykke og vilkårsaksept  🔒 · **C**
**Funn:** K-2 · **Sjekkliste §6.1:** «Aktiv aksept av vilkår + uttrykkelig samtykke til særlige kategorier», «`termsAcceptedAt` / `termsVersion` lagres for alle nye brukere», «Eksisterende brukere bes om samtykke ved neste innlogging»
**Krever:** Georges «kjør» + godkjenning av schema-endring (ACT-PIPELINE §12)

`User` har allerede `termsAcceptedAt` og `termsVersion`. Samtykke til særlige
kategorier (art. 9) er et **eget** samtykke og må kunne trekkes tilbake separat.

**PL-02a · Schema** — `prisma/schema.prisma`
Legg til på `User`, rett under `termsVersion`:
```prisma
  // K-2 — Uttrykkelig samtykke til særlige kategorier (GDPR art. 9) for matching
  sensitiveConsentAt  DateTime?
```
Lag migrasjonen med `npx prisma migrate dev --name add_sensitive_consent --create-only`
og les SQL-en før du går videre. Kun `ADD COLUMN`, nullable. Ingen datamigrering.

**PL-02b · API** — ny fil `app/api/consent/route.ts`
- `POST` med `{ terms: true, sensitive: true }`. CSRF først (`csrfCheck`), så
  sesjon (`getServerSession`), så Zod (`z.literal(true)` på begge).
- Setter `termsAcceptedAt = now`, `termsVersion = TERMS_VERSION`,
  `sensitiveConsentAt = now`. Returnerer `{ ok: true }`.
- `GET` returnerer `{ needsConsent: boolean }`: `true` hvis `termsVersion !== TERMS_VERSION`
  eller `sensitiveConsentAt` er `null`.
- Legg `/api/consent` til `PROTECTED_API_PREFIXES` i `middleware.ts` (egen patch, **PL-02c**).

**PL-02d · Vern i lagringen** — `app/api/profile/setup/route.ts`
Etter sesjonssjekken: hent `sensitiveConsentAt` og `termsVersion`. Mangler
samtykke → `403 { error: 'Samtykke mangler', code: 'CONSENT_REQUIRED' }`.
Ingen profil lagres uten samtykke.

**PL-02e · Side** — ny fil `app/samtykke/page.tsx`
Rolig side i ToSom-stil (følg `app/login/page.tsx` for farger og typografi). Innhold:
- Kort forklaring: hvorfor vi spør, hva vi bruker opplysningene til
  (kun matching), at profilen aldri er offentlig, og at samtykket kan trekkes
  tilbake ved å slette kontoen.
- To **separate** avkrysninger, aldri forhåndsavkrysset, med `<label>`:
  1. «Jeg har lest og godtar [vilkårene](/vilkar) og [personvernerklæringen](/personvern).»
  2. «Jeg samtykker til at Tosom bruker svarene mine om religion, hvem jeg søker,
     nærhet og trygghet — kun for å finne én match til meg.»
- Knappen er deaktivert til begge er krysset. `csrfFetch('/api/consent', { method: 'POST', … })`
  → ved suksess `window.location.href = '/onboarding'`.

**PL-02f · Ruting** — `app/onboarding/OnboardingFlow.tsx`
I første `useEffect` som laster data: `fetch('/api/consent')`. Er
`needsConsent === true` → `router.replace('/samtykke')`. Dette dekker både nye
og eksisterende brukere (de som allerede har fullført onboarding, treffes via
PL-02g).

**PL-02g · Eksisterende brukere** — `app/dashboard/page.tsx`
Samme sjekk som PL-02f øverst i komponenten. Brukere med aktiv reise sendes til
`/samtykke` og deretter tilbake til `/dashboard` (send `?next=/dashboard`,
valider at `next` starter med `/` og ikke `//`).

**PL-02h · Test** — ny fil `__tests__/consent-required.test.ts`
1. `POST /api/consent` uten CSRF → 403
2. `POST /api/consent` med `sensitive: false` → 400
3. Gyldig → `termsVersion === TERMS_VERSION`, `sensitiveConsentAt` satt
4. `POST /api/profile/setup` uten samtykke → 403 `CONSENT_REQUIRED`
5. `GET /api/consent` gir `needsConsent: true` når `termsVersion` er utdatert

**Kryss av når:** a–h er grønne og migrasjonen er deployet (George, PL-G2).
Før deploy: «*(klar for George · PL-02)*».

---

### PL-03 · Bildesperre for profilbilde  🔒 · **C**
**Funn:** K-8 · **Sjekkliste §6.2:** «Partnerens profilbilde skjult før dag 15 i alle API-svar» og «`PUT /api/profile` har CSRF og URL-validering (eller `photos` fjernet)»
**Invariant:** I-6

Ingen frontend kaller `PUT /api/profile` i dag (verifisert 05.10).

**PL-03a** — `app/api/profile/route.ts`: fjern `photos` fra `PUT`, og legg til
`csrfCheck` øverst i `PUT`. Fjern `photos` fra skjemaet i `lib/validation/profile.ts`
i egen patch (**PL-03b**).

**PL-03c** — `app/api/chat/conversations/route.ts`: hent
`imageShareAllowedAt` på samtalen og send `partnerImageUrl` **kun** når
`imageShareAllowedAt` finnes og er passert. Ellers `undefined`.

**PL-03d** — `app/api/chat/messages/route.ts`: samme regel for
`sender.profile.photoUrl` på partnerens meldinger (egne meldinger kan vise eget bilde).

**PL-03e** — `app/api/chat/send/route.ts`: samme regel i `include` / svaret.

**PL-03f** — `app/api/match/status/route.ts`: `candidate.photoUrl` kun når `inImagePhase === true`.

**PL-03g · Test** — ny fil `__tests__/photo-lock-before-day15.test.ts`
For hver av de fire rutene: `imageShareAllowedAt = null` → partnerens bilde er
`undefined`/`null`. `imageShareAllowedAt` i fortiden → bildet er med.

**Kryss av når:** a–g er grønne.

---

### PL-04 · Sikkerhetsoppdatering av rammeverk og innlogging  🔒 · **C**
**Funn:** K-5 · **Sjekkliste §6.7:** «Kritiske og høye sårbarheter i `next`, `next-auth`, `@auth/*` rettet»
**Krever:** Georges «kjør» (versjonsendring = ny avhengighet, ACT-PIPELINE §1)

Én pakke per patch. Etter hver: `npm run verify` **og** `npm run build`.
1. **PL-04a** `next` — siste 15.x (`npm install next@^15 eslint-config-next@^15`). Les endringsloggen.
2. **PL-04b** `next-auth` → `5.0.0-beta.32` (eller nyere 5.0.0). Les endringsloggen for v5-beta.
   Sjekk spesielt cookie-navn og `getToken` — test: `middleware-cookie-salt`.
3. **PL-04c** `@auth/prisma-adapter` → versjonen `npm audit fix` foreslår.
4. **PL-04d** `npm audit fix` (uten `--force`) for `postcss`, `sharp`, `nanoid`, `browserslist`, `brace-expansion`.

Etter alle fire: `npm audit --omit=dev`. Ingen **kritiske** skal gjenstå.
Lim inn resultatet i rapporten.

**Kryss av når:** ingen kritiske, build grønn, auth-testene grønne
(`admin-authorization`, `cron-auth`, `middleware-cookie-salt`, `pusher-auth-private-channel`).
Punktet om øvrige pakker (nodemailer, uploadthing) er **PL-24**.

---

## 6. FASE 2 — Gjør løftene sanne

### PL-05 · Innlogging og registrering  🔒 · **C**
**Funn:** K-6, V-8, V-15 · **Sjekkliste §6.5:** «Rate limiting på innlogging», «Minstekrav til passord», «Ingen stille kontoopprettelse ved skrivefeil», «Passordløse kontoer kan ikke overtas», «Innloggingsfelt har labels» · **§6.6:** «Innloggingssiden skrevet for lansering (uten spøk, uten «under oppbygging»)»
**Avhenger av:** D-7 · PL-02

**PL-05a** — `lib/auth/config.ts` (`authorize`)
- Rate limit før alt annet: `pgCheck(\`login:${email}\`, 10, 900)`. Ved `!ok` → `return null`.
- Fjern auto-registrering. Ukjent e-post → `return null`.
- Fjern grenen som setter passord på brukere uten passord (ca. linje 83–89).
  De må bruke «Glemt passord» (PL-07).
- Profilopprettelsen flyttes til registreringsruten (PL-05b). Fjern
  `events.createUser` hvis ingen provider lenger trenger den.

**PL-05b** — ny fil `app/api/auth/register/route.ts`
CSRF → Zod (`email`, `password` min 10, `passwordRepeat` lik) →
`pgCheck(\`register:${ip}\`, 5, 3600)` → finnes e-posten: svar **likt** som ved
suksess (avslør aldri registrerte e-poster) → ellers opprett `User` + minimal
`Profile` → `{ ok: true }`. Klienten logger så inn med `signIn('credentials')`.

**PL-05c** — `lib/validation/auth.ts`: legg til `registerSchema`; hev
`resetPasswordSchema.password` til `min(10)`.

**PL-05d** — `app/login/page.tsx`
- To visninger: «Logg inn» og «Ny her? Opprett konto» (passord to ganger).
- `<label>` på alle felt (`className="sr-only"` er greit).
- Riktig plassholder per visning.
- Lenke «Glemt passord?» → `/glemt-passord` (PL-07).
- Fjern «egget eller høna»-teksten og «Under oppbygging»-boksen (V-15).
- Fjern «Alderkontroll» fra Vipps-lista til Vipps gjør det sant (K-7).
- Fjern «Første gang? …»-teksten.

**PL-05e · Test** — ny fil `__tests__/login-rate-limit.test.ts`
1. 11. forsøk innen 15 min → `null` uten passordsjekk
2. Ukjent e-post → `null`, ingen `user.create`
3. Bruker uten passord → `null`, ingen `user.update`
4. `POST /api/auth/register` med passord på 9 tegn → 400
5. Eksisterende e-post → samme svar som suksess, ingen ny bruker

**Kryss av når:** a–e grønne.

---

### PL-06 · Reisedagen beregnes, ikke telles  🔒 · **C**
**Funn:** K-4 · **Sjekkliste §6.4:** «Dagframrykk deterministisk (midnatt eller beregnet fra start), begge partnere samtidig»
**Avhenger av:** D-6 · **PL-G3 bør være gjort først** (vi vil vite hvor ille det er i prod)
**Invarianter:** I-5, I-6

**PL-06a** — `lib/journey/engine.ts`: ny ren funksjon
```ts
/**
 * Reisedag beregnet fra start — én kilde, uavhengig av når cronen kjører.
 * Dag 1 er startdøgnet (norsk tid). Begrenset til 1–30.
 */
export function journeyDayFor(start: Date, now: Date = new Date()): number {
  const osloDato = (d: Date) => d.toLocaleDateString('sv-SE', { timeZone: 'Europe/Oslo' });
  const dager = Math.round(
    (Date.parse(osloDato(now)) - Date.parse(osloDato(start))) / 86_400_000
  );
  return Math.min(JOURNEY_TOTAL_DAYS, Math.max(1, dager + 1));
}
```
(`sv-SE` gir `ÅÅÅÅ-MM-DD`, som `Date.parse` tolker som UTC-midnatt — da blir
differansen alltid hele døgn, også over sommertid.) Startpunktet er `bothSeenAt`.

**PL-06b** — `app/api/cron/journey/route.ts`
- `newDay = journeyDayFor(journey.bothSeenAt!)`; oppdater bare hvis `newDay > journey.day`.
- `nextDayAt` = neste midnatt norsk tid (beholdes for filter og admin-panel).
- Behandle **per match**: begge `JourneyProgress`-radene for `matchId` i samme `$transaction`.
- `orderBy: { nextDayAt: 'asc' }` på batch-spørringen.
- Fasevarselet bruker norsk tekst, aldri enum-navnet (`BUILDING_TRUST`).
  Forslag: «Dere har gått inn i en ny del av reisen.»
- Rett kommentarene om «timevis» og «~7 200 samtidige reiser».

**PL-06c** — `app/api/journey/progress/advance/route.ts` er `@deprecated` og har
egen fasetabell (M-2). Spør George om ruten kan slettes. Ja → slett. Nei →
bruk `getPhaseForDay` og `journeyDayFor` fra engine.

**PL-06d · Test** — ny fil `__tests__/journey-day-advance.test.ts`
1. Start 10.10 kl. 23:30 → 11.10 kl. 00:05 = dag 2
2. Start 10.10 kl. 00:10 → 11.10 kl. 00:05 = dag 2 (ikke 1 — det var feilen)
3. 40 døgn etter start = 30
4. Overgang sommertid → vintertid gir verken hoppet eller doble dager
5. Cron: begge partnere i samme match får lik `day`

**Kryss av når:** a–d grønne. «Verifisert i prod-DB …» er **PL-G3**;
«Bildesperren løftes dag 15 … testet med ekte par» er **PL-G10**.

---

### PL-07 · «Glemt passord» ende-til-ende  🔒 · **C**
**Funn:** K-6 · **Sjekkliste §6.5:** punktet som begynner med «Glemt passord» og slutter med «virker ende-til-ende (e-post leveres, nytt passord settes)»
**Avhenger av:** PL-05

- **PL-07a** `lib/email/index.ts` — ny `sendPasswordResetEmail(to, link)` i samme
  stil som `sendDeletionConfirmationEmail`. Rolig tekst; lenken gyldig i 1 time.
- **PL-07b** `app/api/auth/request-reset/route.ts` — etter `storeResetToken`:
  send lenken `${baseUrl}/nytt-passord?email=…&token=…` (URL-kodet). Logg aldri
  tokenet. Svaret er uendret (avslører ikke om e-posten finnes).
- **PL-07c** ny `app/api/auth/reset-password/route.ts` — CSRF → `resetPasswordSchema`
  → `verifyResetToken` → `hashPassword` → `consumeResetToken` → slett brukerens
  `Session`-rader → `{ ok: true }`. `pgCheck` per e-post (5 per time).
- **PL-07d** ny `app/glemt-passord/page.tsx` — e-postfelt og rolig bekreftelse.
- **PL-07e** ny `app/nytt-passord/page.tsx` — passord to ganger, minst 10 tegn.
- **PL-07f** ny `__tests__/password-reset.test.ts` — ukjent e-post gir samme svar;
  utløpt token → 400; gyldig token setter passord og kan ikke brukes to ganger.

**Kryss av når:** a–f grønne **og** George har mottatt e-posten i prod (PL-G7).
Før det: «*(klar for George · PL-07)*».

---

### PL-08 · Skalaspørsmål og tilknytning  🔒 · **C**
**Funn:** K-3 · **Sjekkliste §6.3:** «Ubesvarte skalaspørsmål gir ikke høy resonans; tilknytningsstil krever data» og «Skalaspørsmål påkrevd per steg (eller tydelig fallback)»
**Avhenger av:** D-1 · **Rør ikke** vekter eller `MIN_SCORE` (DI-2)

Med D-1 = påkrevd per steg (forslaget):

- **PL-08a** `lib/validation/onboarding-steps.ts` — ny hjelper
  `missingScaleItems(data, items)` som returnerer item-ID-er uten tall 1–5.
  Utvid `validateOnboardingStep` til stegene med skala. Stegindeksene står i
  `renderStep()` i `OnboardingFlow.tsx` — **les dem der, ikke gjett**.
  Instrumentene: `BFI10` (Step2Personlighet), `ATTACHMENT` (Step3Tilknytning),
  `PVQ10` (Step5LivsstilVerdier), `COMMUNICATION` (Step7HumorPersonlighet),
  `ERQ6` (Step8ModenNysgjerrighet). `validateAllOnboardingSteps` må løpe over
  alle stegene, ikke bare `[0, 1]`.
- **PL-08b … PL-08f** — én patch per stegkomponent: legg `missingScaleItems`
  inn i stegets egen `validate`, med meldingen
  «Svar på alle påstandene — det finnes ingen fasit.»
- **PL-08g** `lib/validation/onboarding-setup.ts` — `psychometricsSchema`
  krever alle 44 item-ID-er (bygg skjemaet fra `ALL_ITEMS`). Serveren er fasit.
- **PL-08h** `lib/psychometrics/scoring.ts` — forsvar i dybden, uavhengig av D-1:
  nøytral midtsone (begge akser = 3,0) skal ikke gi `'fearful'`. Foreslå `> 3.0`
  i stedet for `>= 3.0`, og spør George før patch (påvirker eksisterende
  brukeres stil ved neste lagring).
- **PL-08i** `lib/matching/dimensions.ts` — `scoreValueCompat`: flat profil
  (`denom === 0`) gir **50**, ikke nærhet på snitt.
- **PL-08j · Test** — utvid `__tests__/unified-scorer.test.ts` og
  `__tests__/psychometrics-scoring.test.ts`:
  1. `scoreAll({})` gir ikke stil `'fearful'`
  2. Tom × tom gir **ikke** `STRONG` eller `DEEP`
  3. Flat × flat verdiprofil gir verdier = 50
  4. `validateOnboardingStep` avviser steg med manglende skalasvar
  5. `onboardingSetupSchema` avviser payload med 43 av 44 items

**Merk:** Eksisterende profiler beholder skårene til brukeren lagrer på nytt.
Spør George om de skal bes om å fullføre skalaspørsmålene (samme mekanisme som PL-02g).

**Kryss av når:** a–j grønne.

---

### PL-09 · Ærlige tekster  · **Q**
**Funn:** K-7 · **Sjekkliste §6.6:** punktet om «Én match innen 24 timer» som skal fjernes overalt (meta, OG, JSON-LD, llms.txt), «FAQ stemmer med produktet (anonymitet, e-post, IP, sletting)», «`/metoder` og llms.txt beskriver tilknytningsspørsmålene ærlig» · **§6.1:** «FAQ og personvern beskriver faktisk databehandling (IP, tredjeparter)»

Én fil per patch. Bruk bare fakta fra koden og `TOSOM-SUPER-MASTERPLAN-v2.0.md`.

- **PL-09a** `app/layout.tsx` — `BESKRIVELSE`: «Én match innen 24 timer» →
  «Én gjennomtenkt match i uken». Fjern `"dating"` fra `keywords`. Fjern
  `verification.google` (plassholder).
- **PL-09b** `public/llms.txt` — samme rettelse. Tilknytning: «egne spørsmål
  inspirert av tilknytningsforskning». Ikke skriv «ECR».
- **PL-09c** `app/metoder/page.tsx` — `name: 'Tilknytning (ECR-12)'` →
  `name: 'Tilknytning (egne spørsmål)'`. Kildelisten beholdes.
- **PL-09d** `app/faq/page.tsx` — alle svar i én patch:
  - «Hva er ToSom»: fjern «Ingen bilder, ingen navn, ingen alder … anonymt».
    Skriv at dere ser fornavn og alder, og at bilder kan deles fra dag 15.
  - «Hvordan fungerer matching»: fjern «du får en e-post» (I-4). Skriv at
    matchen venter når du logger inn.
  - «Hvor er dataene mine»: fjern «Vi logger ikke IP-adresser» og «ingen
    tredjeparts tracking». Skriv at data lagres i EU, og at driftsleverandører
    (Vercel, Cloudflare, Sentry) behandler teknisk informasjon som IP-adresse
    for å levere og sikre tjenesten — med lenke til personvernerklæringen.
  - «Kan jeg slette kontoen»: behold — **men først når PL-01 er ferdig.**
- **PL-09e** `app/personvern/page.tsx` — tabellen «Hvem vi deler med» (ca. linje 150):
  - Legg til **Vercel** (drift av nettsiden og serverfunksjoner; IP-adresse og tekniske logger).
  - Legg til **Cloudflare** (nettverk og sikkerhet foran nettsiden; IP-adresse).
  - «Databaseleverandør» → **Neon** (EU, Frankfurt).
  - «E-postleverandør» → **Resend**; formål «Sende innloggingslenker og varsler»
    → «Sende passordlenker og nødvendige varsler».
  - Vercel Speed Insights (`@vercel/speed-insights` i `app/layout.tsx`) nevnes
    under Vercel. Sjekk at Upstash faktisk brukes i prod — hvis ikke, fjern raden.
  - Vipps-raden blir stående (gjelder ved lansering), men merk den «(ved lansering)».
  - **Ingen adresse** (§0.3).

**Verifiser:** `npm run verify` · `grep -rn "innen 24 timer" app public` gir
bare treff i `app/kontakt/page.tsx` (svartid for support — det er riktig).

**Kryss av når:** a–e grønne og grep-sjekken stemmer.

---

### PL-10 · Ærlige dealbreakere  🔒 · **C**
**Funn:** V-1 · **Sjekkliste §6.3:** «Avklart hvilke dealbreakere som skal være aktive; inaktive fjernet eller koblet til data» og «Brukerens valgte grenser (`neverCrossBoundary`) brukes, eller teksten lover ikke at de gjør det»
**Avhenger av:** D-2

Med D-2 slik forslaget lyder:
- **PL-10a** `app/api/profile/setup/route.ts` — slutt å skrive syntetiske
  `maturityLevel` (7/5) og `securityLevel` (`'secure'`). Sett `null` både i
  `update` og `create`.
- **PL-10b** `lib/matching/cheapFeatures.ts` — fjern `maturityGap` og
  `securityGap` fra `cheapSjekkAll`, og oppdater rekkefølgekommentaren.
- **PL-10c** `lib/matching/dealbreaker.ts` — fjern de samme fra
  `sjekkAlleDealbreakers`, slik at ekvivalenstesten i `matching-score-round` holder.
- **PL-10d** Tester — oppdater `dealbreaker.test.ts` og
  `matching-score-round.test.ts` **kun** for de to fjernede sjekkene. Alle
  andre forventninger står uendret. Spør George før du endrer en eksisterende
  test (ACT-PIPELINE §11).
- **PL-10e** `app/onboarding/steps/Step8Grenser.tsx` — sjekk at ingen tekst
  lover at grensene styrer matchingen (05.10: ingen slik tekst funnet). Står
  det noe slikt i `/slik-fungerer-det` eller `/metoder`: rett det.
- **PL-10f** `lib/matching/scoreRound.ts` — nøklene `modenhetsgap` og
  `sikkerhetsniva` blir stående i `REJECT_REASON_KEYS` (historikk i admin), med
  kommentaren «inaktiv siden PL-10».

**Kryss av når:** a–f grønne.

---

### PL-11 · Barn som dealbreaker  🔒 · **C**
**Funn:** V-2 · **Sjekkliste §6.3:** «Beslutning om barn som dealbreaker»
**Avhenger av:** D-3 · **Ikke start uten Georges beslutning.** Sier George nei:
noter beslutningen i ACT-STATE og kryss av med «*(beslutning: nei · D-3)*».

Med D-3 = ja (forslaget). Onboarding-verdiene for «Ønsker du barn?» er
`'Ja'`, `'Usikker'`, `'Nei'` (flervalg, kommaseparert, `Step1Profile.tsx`).
- **PL-11a** `lib/matching/cheapFeatures.ts` — nytt felt `wantChildren: Set<string> | null`
  i `CheapFeatures` (fra `profile.lifestyle.wantChildren`, delt på komma, trimmet,
  små bokstaver). Ny `childrenConflict(a, b)`: blokker **kun** når én har bare
  `ja` og den andre har bare `nei`. `usikker` eller begge valg → aldri blokkering.
  Grunn: «Ønske om barn: ja vs nei». Legg sjekken etter alder i `cheapSjekkAll`.
- **PL-11b** `lib/matching/dealbreaker.ts` — samme sjekk i `sjekkAlleDealbreakers`
  (ekvivalens med cheapFeatures må holde).
- **PL-11c** `lib/matching/rejectReason.ts` + `scoreRound.ts` — ny nøkkel `barn`.
  Legg den sist i `REJECT_REASON_KEYS` (ikke endre rekkefølgen på de andre).
- **PL-11d · Test** — utvid `dealbreaker.test.ts` og `matching-score-round.test.ts`:
  ja×nei blokkerer, ja×usikker og ja,usikker×nei blokkerer ikke, mangler data blokkerer ikke.

**Kryss av når:** a–d grønne.

---

### PL-12 · Ukjent postnummer  · **Q**
**Funn:** V-3 · **Sjekkliste §6.3:** «Ukjent postnummer avvises eller blokkerer matching»
**Avhenger av:** D-4

Med D-4 = avvis i onboarding:
- **PL-12a** `lib/validation/onboarding-setup.ts` — i `basicProfileSchema.superRefine`:
  `lookupPostalCode(val.postalCode)` gir `null` → feil på `postalCode`:
  «Vi finner ikke dette postnummeret. Sjekk at det stemmer.»
- **PL-12b** `app/onboarding/steps/Step1Profile.tsx` — samme sjekk klient-side,
  slik at brukeren får beskjed før steget forlates.
- **PL-12c** `app/api/cron/matching/route.ts` — tell kandidater uten koordinater
  og legg tallet i metadata for `SystemLog` (`utenKoordinater`). Ingen blokkering i motoren.
- **PL-12d · Test** — utvid `profile-setup-geo-b12.test.ts`: ukjent postnummer → 400.

**Kryss av når:** a–d grønne.

---

### PL-13 · Kjønns- og søkevalg  · **C**
**Funn:** V-4 · **Sjekkliste §6.3:** «Kjønns- og søkevalg avklart og forklart»
**Avhenger av:** D-5

- **PL-13a** `app/onboarding/steps/Step1Profile.tsx` — under «Hvem søker du?»:
  «Kjemisk tiltrekning» får forklaringen «Kjønn er ikke avgjørende for meg».
  Legg til `{ value: 'Ikke-binær', label: 'Ikke-binær' }` som søkevalg.
  Vurder å fjerne ♂/♀-ikonene (spør George — produktbeslutning).
- **PL-13b** `lib/matching/dealbreaker.ts` — `normalizeSeeking`: `'ikke-binær'`
  må normaliseres til `'annen'` (allerede i `GENDER_ALIASES`, verifiser).
- **PL-13c** `app/onboarding/steps/Step9Oppsummering.tsx` — oppsummeringen
  viser riktig etikett for den nye verdien.
- **PL-13d · Test** — utvid `dealbreaker-gender-age.test.ts`: søker «Ikke-binær»
  matcher «Ikke-binær» og «Genderfluid», blokkerer «Mann» og «Kvinne».

**Kryss av når:** a–d grønne og George har godkjent ordlyden.

---

### PL-14 · Tidsplaner og kommentarer  · **Q**
**Funn:** V-16 · **Sjekkliste §6.8:** «Vercel-plan bekreftet; cron-tidsplaner gyldige for planen»
**Avhenger av:** PL-G4 (George bekrefter planen)

- **PL-14a** `config/legal.ts` — `MATCH_ROUND.hour` skal stemme med `vercel.json`.
  Cron kjører kl. 02 UTC = 04 norsk sommertid / 03 vintertid. Skriv en kommentar
  som sier dette; endre ikke selve tidspunktet uten George.
- **PL-14b** `app/api/cron/matching/route.ts` — watchdog-kommentaren
  («innen 03:00 lørdag») skal stemme med det samme.
- **PL-14c** Er planen Hobby: `vercel.json` `0 2,3,4 * * 6` → `0 2 * * 6`
  (kun etter Georges «kjør» — dette er I-10-kadensen).

**Kryss av når:** George har bekreftet planen og a–c samsvarer.

---

## 7. FASE 3 — Kvalitet og tillit

### PL-15 · Bevis ved rapport og blokkering  🔒 · **C**
**Funn:** V-5 · **Sjekkliste §6.2:** «Bevis bevares ved rapport/blokkering», «Rapport mulig også etter avsluttet match», «Rapport-rate-limit flyttet til `pgCheck`»
**Avhenger av:** D-8 · Krever schema-endring (godkjenning)

- **PL-15a** `prisma/schema.prisma` — nye felt på `Report`:
  `evidence Json?` (øyeblikksbilde av de siste meldingene, kun for moderering) og
  `evidenceExpiresAt DateTime?`. Migrasjon `--create-only`; les SQL-en.
- **PL-15b** `app/api/report/route.ts` — ved ny rapport med aktiv samtale:
  kopier de siste 50 meldingene (`senderId`, `content`, `createdAt`, `type`;
  **ikke** bilder) til `evidence`. Bytt den lokale `Map`-rate-limiten med
  `pgCheck(\`report:${user.id}\`, 3, 60)`.
- **PL-15c** `app/api/journey/exit/route.ts` — ved `reason === 'blocked'`:
  opprett en `Report` (kategori `OTHER`, beskrivelse «Blokkert av brukeren»,
  samme `evidence`) **før** `endJourney` sletter meldingene.
- **PL-15d** `app/api/report/route.ts` (`PATCH`) — når admin lukker saken
  (`REVIEWED`/`ACTIONED`/`DISMISSED`): `evidenceExpiresAt = nå + 90 dager`.
- **PL-15e** `app/api/cron/journey/route.ts` — i oppryddingsdelen: sett
  `evidence = null` der `evidenceExpiresAt < nå`.
- **PL-15f** ny `app/api/report/candidates/route.ts` — `GET` gir ID og fornavn
  for brukerens tidligere matcher (fra `MatchHistory`). Ingen andre felt.
- **PL-15g** `app/settings/page.tsx` — «Rapporter» virker også uten aktiv match
  (bruker PL-15f når det ikke finnes noen aktiv samtale).
- **PL-15h** `app/personvern/page.tsx` — ny seksjon: ved rapport eller blokkering
  lagres de siste meldingene i inntil 90 dager etter at saken er avsluttet,
  kun tilgjengelig for den som behandler rapporten.
- **PL-15i · Test** — ny `__tests__/report-evidence.test.ts`: rapport lagrer
  evidence; blokkering lager rapport før sletting; rapport etter avsluttet match
  godtas; fjerde rapport innen ett minutt → 429.

**Kryss av når:** a–i grønne. «Rutine for behandling av rapporter …» er **PL-G9**.

---

### PL-16 · Google Fonts selvhostet  · **Q**
**Funn:** V-7 · **Sjekkliste §6.1:** «Google Fonts selvhostet via `next/font`»

- **PL-16a** `app/layout.tsx` — fjern de to `<link>`-taggene til
  `fonts.googleapis.com`. Bruk `next/font/google` (del av `next`, ingen ny avhengighet):
  ```ts
  import { Inter } from 'next/font/google';
  const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });
  // <html lang="no" dir="ltr" className={inter.className}>
  ```
- **PL-16b** `next.config.js` — fjern `fonts.gstatic.com` fra `font-src` når
  `grep -rn "fonts.g" app styles components` er tom.

**Verifiser:** `npm run verify` · `npm run build`. George ser i DevTools at Inter
lastes fra `/_next/static/media` (PL-G11).

**Kryss av når:** a–b grønne og build grønn.

---

### PL-17 · Onboarding-utkast ut av localStorage  · **Q**
**Funn:** V-12 · **Sjekkliste §6.1:** «Onboarding-utkast ikke lenger i `localStorage`» · *Kan utsettes*

- **PL-17a** `app/onboarding/OnboardingFlow.tsx` — `loadDraft`/`saveDraft`
  bruker `sessionStorage` i stedet for `localStorage` (forsvinner med fanen).
  Server-utkastet (WP2) er fortsatt hovedkilden.
- **PL-17b** — tøm nøkkelen ved utlogging. Finn stedene med
  `grep -rn "signOut(" app components`. Én patch per fil.

**Kryss av når:** a–b grønne.

---

### PL-18 · Universell utforming  · **Q**
**Funn:** V-8 · **Sjekkliste §6.7:** «WCAG 2.1 AA: kontrast, fokus, labels, redusert bevegelse»

Én fil per patch. Ingen visuell omlegging — kun det AA krever.
- **PL-18a** `styles/globals.css` — legg til nederst:
  ```css
  /* V-8: synlig tastaturfokus og respekt for redusert bevegelse (WCAG 2.1 AA) */
  :focus-visible { outline: 2px solid #D4AF37; outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- **PL-18b** Kontrast — all **lesbar** tekst med `rgba(255,255,255,a)` der
  `a < 0.6` på mørk bakgrunn → minst `0.6`. Finn med
  `grep -rn -E "rgba\(255, ?255, ?255, ?0\.[1-5]" app components`. Rammer og
  dekor røres ikke. Én fil per patch: `app/login/page.tsx`,
  `app/onboarding/**`, `app/settings/page.tsx`, `app/faq/page.tsx`,
  `components/ui/layout/Footer.tsx` først.
- **PL-18c** Fjern `outline: "none"` / `outline-none` på `input`, `button`, `a`
  slik at `:focus-visible` (18a) virker. Fokusrammen med gull på innloggingsfeltene beholdes.
- **PL-18d** `app/faq/page.tsx` — hvert spørsmål blir en ekte `<button>` inne i
  `<h3>` (mellomrom og Enter virker da av seg selv). Behold `aria-expanded`.
- **PL-18e** `components/branding/LogoVariants.tsx` — `ResonanceMark`
  (`orbit`, `resonate`, ca. linje 250–320): stopp animasjonene ved
  `prefers-reduced-motion` dersom de er JS-/SVG-drevne og ikke dekkes av 18a.

**Verifiser:** `npm run verify`. Lighthouse-tilgjengelighet ≥ 95 på `/`,
`/login` og `/onboarding` (George, PL-G11).

**Kryss av når:** a–e grønne og George har bekreftet Lighthouse.

---

### PL-19 · Vilkår og lovhenvisninger  · **Q**
**Funn:** V-9 · **Sjekkliste §6.6:** «Vilkår: angrerettloven og direkte lovlenker»

**§0.3 gjelder:** `COMPANY.address` forblir `null`. Ingen adresse noe sted.

- **PL-19a** `config/legal.ts` — `LEGISLATION`. Lenkene under er kontrollert
  mot lovdata.no 05.10:

  | Nøkkel | Etikett | URL |
  |---|---|---|
  | `angrerett` (ny) | Angrerettloven (lov 20. juni 2014 nr. 27) | `https://lovdata.no/dokument/NL/lov/2014-06-20-27` |
  | `personvernlov` | Personopplysningsloven (lov 15. juni 2018 nr. 38) | `https://lovdata.no/dokument/NL/lov/2018-06-15-38` |
  | `forbrukerkjop` | Forbrukerkjøpsloven (lov 21. juni 2002 nr. 34) | `https://lovdata.no/dokument/NL/lov/2002-06-21-34` |
  | `avtalelov` | Avtaleloven (lov 31. mai 1918 nr. 4) | `https://lovdata.no/dokument/NL/lov/1918-05-31-4` |
  | `bokforing` | Bokføringsloven (lov 19. november 2004 nr. 73) | `https://lovdata.no/dokument/NL/lov/2004-11-19-73` |

  Lovens offisielle korttittel er **personopplysningsloven**, ikke «personvernloven».
- **PL-19b** `app/vilkar/page.tsx` — «Angrerett og refusjon» (ca. linje 187–201):
  henvis til `LEGISLATION.angrerett` (§ 22 bokstav n), ikke forbrukerkjøpsloven.
  Teksten: retten bortfaller når leveringen har begynt med ditt uttrykkelige
  samtykke og din bekreftelse på at angreretten da går tapt.
- **PL-19c** `app/personvern/page.tsx` — samme navn på personopplysningsloven der den nevnes.
- **PL-19d** `docs/ACT-STATE.json` — rett «Forbrukerkjøpsloven 2009 §22 angrerett»
  i `nextAction`. Egen patch.

**Kryss av når:** a–d grønne. Advokatgjennomgangen er **PL-G6**.

---

### PL-20 · Interne og døde sider  · **Q**
**Funn:** V-10 · **Sjekkliste §6.7:** «Interne og døde sider fjernet eller 404 i prod» og «`POST /api/auth/phone/send` deaktivert»

Én fil per patch. Mønster for «404 i prod» i serverkomponent eller rute:
`if (process.env.NODE_ENV === 'production') notFound();`
(`import { notFound } from 'next/navigation'`). Er siden `'use client'`: legg en
`layout.tsx` i mappen som gjør sjekken server-side.

| Patch | Fil | Tiltak |
|---|---|---|
| PL-20a | `app/design-system/page.tsx` | 404 i prod |
| PL-20b | `app/(auth)/onboarding/payment/page.tsx` | **Slett** (gammel abonnementsmodell, nynorsk) |
| PL-20c | `app/api/auth/phone/verify/route.ts` | Returner 404 i prod (den redirecter til siden i 20b) |
| PL-20d | `app/api/auth/phone/send/route.ts` | Returner 404 i prod øverst i `POST` |
| PL-20e | `app/(auth)/onboarding/access/page.tsx` | **Slett** (ikke lenket, lagrer ingenting) |
| PL-20f | `app/register/vipps/page.tsx` | 404 til Vipps er klart (sjekklisten §5) |
| PL-20g | `app/questions/page.tsx` | Spør George om siden skal være offentlig. Nei → 404 i prod |

Før sletting: `grep -rn "<sti>" app components lib middleware.ts` skal være tom
(bortsett fra filen selv). Er den ikke tom: stopp og rapporter.

**Verifiser:** `npm run verify` · `npm run build`. Etter deploy kjører George
`curl -s -o /dev/null -w '%{http_code}' https://www.tosom.no/<sti>` → 404 (PL-G11).

**Kryss av når:** a–g grønne og curl-sjekken er gjort.

---

### PL-21 · Blogg og brukertekster på bokmål  · **Q**
**Funn:** V-10, V-13 · **Sjekkliste §6.6:** «Bloggen rettet eller avpublisert» · **§6.4:** «Brukervarselet ved dag 30 skrevet på bokmål»
**Avhenger av:** D-9

- **PL-21a** `app/blogg/page.tsx` — med D-9 = avpubliser: 404 i prod (mønster fra PL-20).
- **PL-21b** `app/blogg/[slug]/page.tsx` — samme. Innholdet beholdes til omskriving etter lansering.
<!-- SPRAKREF-START (sitater av dagens nynorsk-tekst som skal rettes) -->
- **PL-21c** `app/api/cron/journey/route.ts` — varselet ved dag 30: «Reisa di er
  fullført. Takk for at du gav 30 dager.» → «Reisen deres er fullført. Takk for
  at dere ga hverandre 30 dager.» Milestone-teksten «Ny dag i reisa di» →
  «Ny dag i reisen». (Gjøres sammen med PL-06b hvis den kjøres samtidig — da i samme patch.)
<!-- SPRAKREF-END -->
- **PL-21d** `app/api/journey/progress/advance/route.ts` — samme rettelser,
  **kun** hvis ruten ikke slettes i PL-06c.

**Kryss av når:** a–d grønne.

---

### PL-22 · Språkvakten fanger mer  · **Q**
**Funn:** V-13 · **Sjekkliste §6.6:** «Manuell språkgjennomgang av alle brukervendte sider» (forarbeid)

<!-- SPRAKREF-START (ordliste med bevisste nynorsk-eksempler) -->
- **PL-22a** `scripts/verify-language.mjs` — legg til i `NYNORSK_WORDS`:
  `"reisa"`, `"godtek"`, `"rettleien"`, `"respektar"`, `"andrar"`, `"handlar"`,
  `"psykologar"`, `"prediktorar"`, `"sterkare"`, `"verktrueleg"`.
  **Ikke** legg til ord som også er gyldig bokmål (`"tek"`, `"vel"`, `"gav"`,
  `"menneske"`). Les kommentaren øverst i fila før du endrer listen.
<!-- SPRAKREF-END -->
- Kjør `npm run verify:lang`. Nye treff i kode som ikke er rettet ennå:
  rett dem i egne patcher (én fil per patch) **før** listen committes, ellers blir CI rød.
- `docs/LanseringsCheckList.md` og denne instruksen siterer nynorsk innenfor
  `SPRAKREF`-blokker og skal ikke gi treff.

Den manuelle gjennomgangen er **PL-G8** (George). Agenten lager en liste over
alle brukervendte sider (`find app -name page.tsx`, unntatt `admin` og `api`)
som George kan krysse av.

**Kryss av:** ikke av agent. George krysser av etter PL-G8.

---

### PL-23 · SEO, delingsbilde og sitemap  · **Q**
**Funn:** V-14 · **Sjekkliste §6.7:** «`og-image.png` finnes; sitemap viser offentlige sider»

- **PL-23a** `app/sitemap.ts` — kun offentlige sider: `/`, `/hvorfor`,
  `/slik-fungerer-det`, `/reisen`, `/metoder`, `/tips`, `/priser`, `/trygghet`,
  `/faq`, `/om-oss`, `/kontakt`, `/tilgjengelighet`, `/vilkar`, `/personvern`,
  `/cookies`, `/login`. **Ikke** `/dashboard`, `/profile`, `/onboarding`,
  `/match`, `/journey` (de to siste finnes ikke).
- **PL-23b** `public/og-image.png` (1200×630) — **G**: George lager eller
  godkjenner bildet. Agenten kan ikke lage bilder. Til det finnes: endre ikke
  `app/layout.tsx`.

**Verifiser:** `npm run verify` · `npm run build` · `curl https://www.tosom.no/sitemap.xml` etter deploy.

**Kryss av når:** a er grønn **og** bildet finnes (PL-23b).

---

### PL-24 · Øvrige sårbarheter  🔒 · **C**
**Funn:** K-5 · **Sjekkliste §6.7:** «Øvrige høye sårbarheter (nodemailer, uploadthing, sharp, postcss) rettet eller vurdert»
**Krever:** Georges «kjør» (major-versjoner = breaking)

- **PL-24a** `nodemailer` 7 → 10: les endringsloggen, oppdater `lib/email/index.ts`
  ved behov. Test: send til maildev lokalt (`maildev` finnes i devDependencies).
- **PL-24b** `uploadthing` / `@uploadthing/react`: avklar først om de brukes i
  prod (`STORAGE_DRIVER=r2` betyr at bildene går via R2). Brukes de ikke:
  foreslå å fjerne pakkene og den døde koden (krever godkjenning).
- **PL-24c** Det som gjenstår etter a–b: dokumenter hver sårbarhet med
  vurdering (berører den oss, hvorfor, hva er planen) i rapporten.

**Kryss av når:** `npm audit --omit=dev` har ingen kritiske og ingen høye som
ikke er vurdert skriftlig.

---

### PL-25 · Middleware og API-dekning  · **C**
**Funn:** V-11 · **Sjekkliste §6.7:** «Manglende API-prefikser i middleware» · *Kan utsettes*

- **PL-25a** `middleware.ts` — legg til i `PROTECTED_API_PREFIXES`:
  `/api/settings`, `/api/report`, `/api/onboarding`, `/api/dashboard`,
  `/api/pusher`, `/api/presence`, `/api/consent` (hvis ikke gjort i PL-02c).
  **Ikke** `/api/auth`, `/api/cron`, `/api/system/health`, `/api/system/cron-health`.
- **PL-25b · Test** — ny `__tests__/api-route-coverage.test.ts`: les alle
  `app/api/**/route.ts`, og krev at hver sti enten er dekket av et prefiks i
  `PROTECTED_API_PREFIXES` eller står i en eksplisitt `OFFENTLIGE_RUTER`-liste i testen.
  Ny rute uten dekning → rød test.

**Kryss av når:** a–b grønne.

---

### PL-26 · Opprydding  · **Q**
**Funn:** M-1 … M-11 · Ingen sjekklistepunkter (mindre forbedringer). Gjøres sist.

| Patch | Fil | Tiltak |
|---|---|---|
| PL-26a | `app/settings/page.tsx` | Slett døde `GoldToggle` (ca. l. 189), `MatchSection` (ca. l. 791), `SlettKontoSection` (ca. l. 900) — bekreft med grep at de ikke brukes (M-5) |
| PL-26b | `components/MatchBreakdown.tsx` | Slett hvis grep viser null bruk (M-1). Ellers: bytt prosent mot `toDimensionLabel` |
| PL-26c | `instrumentation-client.ts` | `export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;` (M-8) |
| PL-26d | `app/admin/(panel)/dashboard/page.tsx:180` | «Djupere (22-30)» — **kun etter Georges valg** (M-10). Forslag: «Dypere (22–25)» og «Refleksjon (26–30)» som egen fase, i tråd med `PHASE_CONFIGS` |
| PL-26e | `docs/ACT-STATE.json` | Fjern `verifiedFlow.ikkeLenket` (M-7, utdatert) |
| PL-26f | `GEORGE.md` | SPF/DKIM er satt (V-6 i sjekklisten) — oppdater status. **Ingen adresse** |
| PL-26g | `docs/STATUS-REPORT.md` | Flytt til `docs/archive/snapshots/` (spør George — dokumentasjonsregel 4) |
| PL-26h | `.gitignore` | Legg til `agent/`, `ads/`, `nohup.out` (M-11) — spør George først |

`client_public.key` / `server_public.key` (M-3) og `access-control-allow-origin` (M-4)
krever avklaring med George før noe gjøres.

**Kryss av:** ingen sjekklistepunkter — rapporter i ACT-STATE.

---

## 8. FASE 4 — George (utføres og krysses av kun av George)

Agentene forbereder kommandoer, tekstutkast og sjekklister. George utfører.
Agenten skriver «*(klar for George · PL-Gx)*» bak punktet når forarbeidet er gjort.

| ID | Oppgave | Sjekkliste §6 | Forarbeid fra agent |
|---|---|---|---|
| **PL-G1** | Søk i Vercel-loggen etter `[delete-account]` siden beta-start. Slett berørte brukere (etter PL-01, via ny kode — ikke direkte i DB) og send en rolig e-post | §6.1 «Brukere som har forsøkt å slette seg …» | Utkast til e-post |
| **PL-G2** | `prisma migrate deploy` mot prod (eller verifiser at CD gjør det) etter PL-02a og PL-15a | §6.8 «`prisma migrate status` …» | Liste over nye migrasjoner |
| **PL-G3** | Kontroller reisedager i prod-DB (kun lesing): sammenlign `day` for begge partnere, og med dager siden `bothSeenAt`. **Før PL-06** | §6.4 «Verifisert i prod-DB at `day` …» | Ferdig `SELECT` |
| **PL-G4** | Bekreft Vercel-plan og at siste deploy er grønn med gjeldende `vercel.json` | §6.8 «Vercel-plan bekreftet …» | — |
| **PL-G5** | Roter `DATABASE_URL` (delt i chat 03.09). Oppdater Vercel og GitHub-secrets | §6.8 «`DATABASE_URL` rotert …» | Steg fra Neon-dokumentasjonen |
| **PL-G6** | Advokat: vilkår, personvern, angrerett, DPA, DPIA — og **hvordan adressekravet oppfylles uten privat adresse** | §6.1 «DPA og DPIA …» · §6.6 «Adressekravet avklart …» og «Juridiske tekster gjennomgått …» | Brief fra `JURIDISK-GRUNNLAG-v1.0.md` + V-9 |
| **PL-G7** | E-post: DMARC (`_dmarc.tosom.no`, start `p=none`), utvid SPF hvis support@ sender via one.com, test passord-reset og support@ | §6.8 «DMARC lagt til …» og «support@ mottar …» · §6.5 punktet om «Glemt passord» (sammen med PL-07) | Ferdige DNS-verdier |
| **PL-G8** | Manuell språkgjennomgang av alle brukervendte sider | §6.6 «Manuell språkgjennomgang …» | Sideliste fra PL-22 |
| **PL-G9** | Skriftlig rutine for rapporter: hvem leser, innen hvor lang tid, hva som skjer | §6.2 «Rutine for behandling av rapporter …» | Utkast |
| **PL-G10** | Ende-til-ende med to testkontoer i to nettlesere: match → chat → dag 15 → avslutning → sletting (sjekklisten §7.3) | §6.4 «Bildesperren løftes dag 15 …» | — |
| **PL-G11** | iOS Safari, Android Chrome, desktop Chrome/Firefox/Safari; konsollfeil; Lighthouse; Inter fra `/_next/static`; curl mot fjernede sider | §6.7 «Manuell test …», «Ingen konsollfeil …», «INP < 200 ms …» | Testskjema |
| **PL-G12** | Drift og kontroll i prod (se punktlisten under tabellen) | §6.8 «Testbrukere (test1/test2) slettet fra prod», «`ADMIN_PASSWORD_HASH`, `ADMIN_JWT_SECRET`, `ADMIN_EMAIL` satt», «`DEV_LOGIN_ENABLED` ikke `true` i prod; `/dev-login` redirecter (bekreftet 05.10)», «`PAYMENTS_ENABLED` ikke `true` før Vipps er verifisert», «`ENABLE_CSRF_PROTECTION=true` i prod», «Backup gjenopprettet minst én gang (ACT-PIPELINE §10)», «Sentry uten uløste kritiske feil siste 14 dager» · §6.3 «Score- og nivåfordeling …» · §6.7 «E2E …», «`npm run build` grønn» | — |

**PL-G12 i detalj:**
- test1/test2: `scripts/launch-1-delete-test-users.mjs` — dry run først, deretter `--apply`
- Admin-hemmeligheter satt i Vercel (Production)
- `DEV_LOGIN_ENABLED` og `PAYMENTS_ENABLED` er ikke `true`; `ENABLE_CSRF_PROTECTION=true`
- Backup gjenopprettet til en testdatabase minst én gang (`scripts/db-backup.sh`, `deploy/backup.md`)
- Sentry: ingen uløste kritiske feil de siste 14 dagene
- `/admin`: score- og nivåfordelingen fra siste matcherunde er gjennomgått
- CI: E2E (Playwright) og `npm run build` grønne på siste commit

**Personvern (§0.3):** Ingen G-oppgave skal føre til at forretningsadressen
skrives inn noe sted. Anbefaler advokaten adresse på nettstedet, velger George
en adresse som ikke er hans private.

---

## 9. FASE 5 — Sluttkontroll

### PL-99 · Ny vurdering  · **C**
Når alle punkter merket **Før lansering** i sjekklisten §6 er avkrysset:
1. `npm run verify` · `npx next lint --max-warnings 0` · `npm run build` · `npm audit --omit=dev`
2. Les hver K- og V-seksjon i sjekklisten og bekreft i koden at funnet er borte.
3. Gå gjennom regresjonslisten §7.3 med George.
4. Legg til «§10 Sluttkontroll ÅÅÅÅ-MM-DD» nederst i `LanseringsCheckList.md`:
   GO/NO-GO, commit, og det som er utsatt med Georges godkjenning.
5. Oppdater `ACT-STATE.json`.

---

## 10. Når du skal stoppe og spørre

- Oppgaven er merket 🔒 og George har ikke sagt «kjør»
- En beslutning D-x er ikke tatt
- En patch vil berøre en invariant (I-1 … I-14)
- Koden ser annerledes ut enn instruksen beskriver — linjenummer er veiledende, innholdet er fasit
- Du vurderer å endre en eksisterende test for å få den grønn
- Løsningen krever en ny avhengighet eller en ny versjon av en avhengighet
- Endringen krever en schema-endring som ikke er beskrevet her
- Noen ber deg skrive inn en adresse (§0.3) — svaret er alltid nei
- Du har prøvd to ganger og testen er fortsatt rød
- Du er i tvil om et sjekklistepunkt faktisk er oppfylt — da er det ikke det

**Spør med et konkret forslag:** «Jeg foreslår X fordi Y. Alternativet er Z. Hva velger du?»

---

## 11. Rapportformat etter hver oppgave

```
## Utført
PL-xx[a–z] — [1–3 linjer]

## Filer
- sti/til/fil.ts — hva som skjedde

## Verifisert
- npm run verify: grønn (lang grønn, tsc 0, jest NNN/NNN)
- [ev. lint, build, curl, manuell sjekk]

## Sjekkliste
- [x] §6.x «punktets tekst» (PL-xx)   ← eller «ikke avkrysset: grunn»

## Neste
PL-yy, eller «avventer godkjenning / beslutning D-x»
```

Ingen overforklaring. Ingen selvros. Er noe uklart eller ikke verifisert: si det.

---

## 12. Oversikt

| ID | Oppgave | Hvem | 🔒 | Avhenger av | Sjekkliste |
|---|---|---|---|---|---|
| PL-01 | Kontosletting | C | 🔒 | — | §6.1 |
| PL-02 | Samtykke | C | 🔒 | schema-godkjenning | §6.1 |
| PL-03 | Bildesperre profilbilde | C | 🔒 | — | §6.2 |
| PL-04 | next / next-auth | C | 🔒 | godkjenning | §6.7 |
| PL-05 | Innlogging og registrering | C | 🔒 | D-7, PL-02 | §6.5 |
| PL-06 | Reisedag | C | 🔒 | D-6, PL-G3 | §6.4 |
| PL-07 | Glemt passord | C | 🔒 | PL-05 | §6.5 |
| PL-08 | Skalaspørsmål | C | 🔒 | D-1 | §6.3 |
| PL-09 | Ærlige tekster | Q | | PL-01 (FAQ om sletting) | §6.1, §6.6 |
| PL-10 | Ærlige dealbreakere | C | 🔒 | D-2 | §6.3 |
| PL-11 | Barn | C | 🔒 | D-3 | §6.3 |
| PL-12 | Ukjent postnummer | Q | | D-4 | §6.3 |
| PL-13 | Kjønn og søk | C | | D-5 | §6.3 |
| PL-14 | Tidsplaner | Q | (14c) | PL-G4 | §6.8 |
| PL-15 | Bevis ved rapport | C | 🔒 | D-8, schema | §6.2 |
| PL-16 | Fonter | Q | | — | §6.1 |
| PL-17 | localStorage | Q | | — | §6.1 |
| PL-18 | Universell utforming | Q | | — | §6.7 |
| PL-19 | Vilkår og lover | Q | | — | §6.6 |
| PL-20 | Døde sider | Q | | — | §6.7 |
| PL-21 | Blogg og varsler | Q | | D-9 | §6.4, §6.6 |
| PL-22 | Språkvakt | Q | | — | §6.6 (G) |
| PL-23 | SEO | Q | | bilde fra George | §6.7 |
| PL-24 | Øvrige sårbarheter | C | 🔒 | godkjenning | §6.7 |
| PL-25 | Middleware | C | | — | §6.7 |
| PL-26 | Opprydding | Q | | — | — |
| PL-G1 … G12 | George | G | | — | §6.1–§6.8 |
| PL-99 | Sluttkontroll | C | | alt over | — |

**Vipps** (sjekklisten §5 og §6.9, punktet «Alle punkter i §5 oppfylt») er ikke
en del av denne instruksen. Den får egen instruks når integrasjonen starter.

---

*Hver patch berører noe som betyr noe for noen. Jobb rolig. Jobb presist.
Kryss av bare det som er sant.*

