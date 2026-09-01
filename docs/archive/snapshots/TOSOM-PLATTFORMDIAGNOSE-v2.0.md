# TOSOM — PLATTFORMDIAGNOSE v2.0

**Dato:** 2026-08-19
**Commit:** `bc1ef13` (main, rent arbeidstre)
**Forgjenger:** `TOSOM-PLATTFORMDIAGNOSE-v1.0.md`
**Metode:** Full lesing av kodebasen. Hver påstand har fil:linje-referanse og er verifisert direkte mot kilden — ikke mot dokumentasjon.

> **Prinsipp for dette dokumentet:** Konseptet er ikke til vurdering. Kun avstanden mellom konsept og kode.

---

## 0. Sammendrag

Tosom er **teknisk solid og konseptuelt konsistent**, men har **fire blokkere** som gjør lukket beta med ekte brukere umulig i dag.

| Måling | Status |
|---|---|
| Enhetstester | **157/157 grønne** (16 suiter, 0,7 s) |
| Typesjekk (`tsc --noEmit`) | **0 feil** |
| API-flate | 109 ruter |
| Produksjonsbuild | **Ikke verifisert** — `.next/` er dev-artefakt uten `BUILD_ID` |
| Arbeidstre | Rent @ `bc1ef13` |

**Klarhetsvurdering:**

| Område | Vurdering | Begrunnelse |
|---|---|---|
| Beta med ekte brukere | 🔴 **NO-GO** | B-1: ingen kan logge inn |
| Drift (produksjon) | 🟠 **BETINGET** | Rate limiting overlever ikke flere instanser |
| Lansering (åpen) | 🔴 **NO-GO** | Betaling finnes ikke; B-1..B-4 uløst |
| Konseptuell integritet | 🟢 **STERK** | Ingen feed, ingen swipe, ingen AI-chat. Invariantene holder. |
| Kodekvalitet | 🟢 **GOD** | Grønne tester, ren typing, gjennomtenkt cron |

---

## 1. Blokkere (må løses før beta)

### 🔴 B-1 — Ingen ekte bruker kan logge inn
**`lib/auth/config.ts:32-37`**

```ts
async sendVerificationRequest(params) {
  const { identifier, url, provider } = params
  const host = provider.server.host
  console.log(`[Tosom Magic Link] ${identifier} → https://${host}${url}`)
  // We redirect to our premium login page — no default Magic Link UI is rendered
}
```

EmailProvider er **eneste** provider (`config.ts:20-39`). `sendVerificationRequest` er overstyrt til en `console.log`. **Ingen e-post sendes noensinne.** Innloggingslenken eksisterer kun i serverloggen.

Konsekvens: de 50–100 inviterte brukerne kan ikke komme inn. Alt annet i beta-planen er blokkert av denne ene funksjonen.

### 🔴 B-2 — Vipps-innlogging er død kode
**`app/api/auth/vipps/callback/route.ts:229`**

Kaller `signIn('credentials', …)`. CredentialsProvider er eksplisitt fjernet — `lib/auth/config.ts:7-8`:
> `SIKKERHET: CredentialsProvider er FJERNET fra hovedkonfig.`

Kallet kaster alltid. Samme mønster i `app/api/auth/test-login/route.ts:55`, der feilen svelges av en `try/catch`.

### 🔴 B-3 — «Vi fant hverandre» sletter alt, og lover en eksport som ikke finnes
**`lib/journey/endJourney.ts:211-213`**

```ts
// - found_each_other: SLETT begge kontoer permanent (behold MatchHistory + Report + AuditLog)
if (outcome === 'found_each_other') {
```

Bekreftet i vilkårene, `app/vilkar/page.tsx:112`:
> «Velger du «Vi fant hverandre», slettes hele kontoen din.»

UI lover eksport før slettingen — `app/reisen/avslutning/page.tsx:240`:
```ts
// B4.4: Ved "Vi fant hverandre" — tilby PDF-eksport FØR sletting
if (selected === 1 && !showPdfOffer) {
```

**Det finnes ingen PDF-generator i kodebasen.** `grep -rli "pdf" app/api lib` gir null treff. Eneste eksport er JSON via `app/api/settings/export/route.ts`.

Konsekvens: To mennesker som lykkes — produktets *beste* utfall — mister 30 dager med samtaler permanent, etter å ha fått løfte om det motsatte. Dette er den alvorligste tillitssvikten i systemet.

### 🔴 B-4 — Privilegie-eskalering på admin-endepunkter
**`app/api/admin/stats/route.ts:13-19`**

```ts
function isAdmin(req: NextRequest): boolean {
  const adminToken = req.cookies.get('admin_token')?.value;
  const sessionToken = req.cookies.get('authjs.session-token')?.value
    ?? req.cookies.get('next-auth.session-token')?.value;
  return !!(adminToken || sessionToken);
}
```

Sjekker kun at en cookie **finnes** — verken signatur, gyldighet eller rolle. **Enhver innlogget bruker er admin** på dette endepunktet. Identisk mønster i `app/api/admin/journeys/route.ts:16-17`.

Dette er spesielt unødvendig, fordi korrekt guard allerede finnes og brukes andre steder:
- `lib/auth/adminAuthGuard.ts:10-27` — sjekker session **og** `isAdminRole(role)`
- `lib/auth/admin-jwt.ts:103` `verifyAdminCookie()` — brukt riktig i `app/api/admin/analytics/route.ts:8` og `app/api/admin/session/route.ts`

Feilen er inkonsistent bruk, ikke manglende verktøy.

---

## 2. Alvorlige avvik (bryter konseptet)

### 🟠 A-1 — Bildesperren håndheves ikke
Kjerneløftet er «Fase 1 (dag 1–14) er uten bilder» (`ai/system_prompt.md` §3.4).

Tre uenige kilder:
| Sted | Regel |
|---|---|
| `lib/journey/engine.ts:297` | `isPhotosAllowed(day) → day >= 15` |
| `lib/match/journeySync.ts:31,80` | `photosEnabled: jp.day >= 13` |
| `app/api/chat/image/route.ts` | **ingen dagsjekk i det hele tatt** |

Opplastingsruten har ingen fase-kontroll. Bilder kan deles fra dag 0. Løftet er kosmetisk, ikke håndhevet.

### 🟠 A-2 — CHECKIN-fasen er uoppnåelig
**`lib/match/journeySync.ts:9-14`**

```ts
function phaseForDay(day: number): JourneyPhase {
  if (day <= 14) return "EARLY";
  if (day <= 21) return "BUILDING_TRUST";
  if (day <= 30) return "DEEPER";
  return "CHECKIN";   // ← uoppnåelig: day > 30
}
```

Mot kanonisk definisjon i `lib/journey/engine.ts:191-221` (DEEPER 22–25, CHECKIN 26–30). Dag 26–30 får feil fase. Den avsluttende refleksjonsfasen — reisens emosjonelle landing — inntreffer aldri for brukere som følger denne kodebanen.

Seed-innholdet er en **tredje** variant: `scripts/seed-journey-content.ts` bruker 1–10 / 11–20 / 21–30.

### 🟠 A-3 — To motstridende terskelsett for resonans
Filen dokumenterer sin egen konflikt — `lib/matching/resonanceLevel.ts:7-9`:

```
TERSKLER (B1.5): >=80 DEEP · 65-79 STRONG · 50-64 MODERATE · 40-49 GENTLE
OBS: disse skiller fra unifiedScorer.getMatchLevel (>=80/>=60/>=40).
```

En score på 62 er `MODERATE` i én funksjon og `STRONG` i den andre. Begge er i bruk.

### 🟠 A-4 — Permanent sperreliste, ingen gjenbruk av kandidater
**`app/api/cron/matching/route.ts:179-182`**

```ts
const history = await prisma.matchHistory.findMany({
  select: { userAId: true, userBId: true },
});
const blockSet = new Set(history.map((h) => normalizePair(h.userAId, h.userBId).join(':')));
```

Alle historiske par sperres **for alltid**. Ingen tidsvindu. I en liten beta-kohort (50–100) tømmes kandidatrommet raskt: etter få runder har aktive brukere uttømt alle mulige partnere og kan aldri matches igjen. Hele tabellen lastes også inn i minnet uten paginering.

---

## 3. Teknisk gjelder

### 🟡 G-1 — Fire døde motorer
Ingen kaller disse. De gir falsk trygghet ved lesing:

| Fil | Status |
|---|---|
| `lib/matching/engine.ts` | Kun referert av `scripts/verify-matching.ts:84,92` |
| `lib/matching/findBestResonance.ts` | Null kallsteder |
| `lib/matchingWorker.ts` | Inneholder `generateFakeMatchId()` (`:18`) |
| `lib/matchHistory.ts` | `getMatchHistory()` har ingen importører |
| `lib/resonance.ts`, `lib/semantic.ts` | Null importører |

**Eneste levende scoringsvei:** `app/api/cron/matching/route.ts:232` og `/api/match/breakdown:147`, begge via `unifiedScore()`.

### 🟡 G-2 — `MAX_QUEUE_WAIT_HOURS = 72` er død logikk
**`app/api/cron/matching/route.ts:153-176`**

```ts
if (cohortSize < MIN_COHORT_SIZE && !hasStaleEntries) → defer
```

Med `MIN_COHORT_SIZE = 2` kan porten kun utløses ved 0 eller 1 i kø — der et par uansett er matematisk umulig. Ventilen kan aldri produsere en match.

Verre under ukentlig kadens: kjøringene ligger **168 timer** fra hverandre, så enhver som har ventet én runde er automatisk >72 t. `hasStaleEntries` er sann som standard. Konstanten er et levn fra daglig kadens med `MIN_COHORT_SIZE = 20`.

Riktig modell er den enkle: *den som ikke får match, venter til neste lørdag.*

### 🟡 G-3 — `ai/memory.json` oppgir feil vekter
`ai/memory.json:52-59` lister `base .35 / resonance .25 / semantic .20 / intimacy .10 / future .10`.

Dette er det **obsolete** settet fra `config/matching.ts:24-30`, som selv er merket:
> `// OBSOLETT: brukes ingen steder i app/lib/components/hooks (verifisert v8 steg 2.1)`

De reelle vektene ligger i `lib/matching/unifiedScorer.ts:37-47` og er ni-dimensjonale. Agentens eget minne peker på feil sannhet — enhver agent som leser `memory.json` får et galt bilde av motoren.

### 🟡 G-4 — Rate limiting overlever ikke produksjon
`app/api/settings/export/route.ts:18` bruker en modul-lokal `Map`:

```ts
const exportRateLimit = new Map<string, number[]>();
```

In-memory state nullstilles ved hver kaldstart og deles ikke mellom instanser. På Vercel er grensen i praksis virkningsløs. Fire parallelle implementasjoner eksisterer: `lib/rate-limit.ts`, `lib/rateLimit.ts`, `lib/api/rateLimit.ts`, `lib/security/phoneRateLimit.ts`.

### 🟡 G-5 — Dokumentasjonen er 2 dager bak koden
Siste docs-commit `0cf57dc` (2026-08-17). Commitene `7dc9411`, `ad65172`, `72964bf`, `c0d4791`, `bc1ef13` — inkludert merkevareendringen ToSom→Tosom og omskriving av onboarding — er udokumentert.

`docs/README.md` peker på `tosom-masterplan-v4.md` og `docs/language-guidelines.md`. **Ingen av dem finnes.**

---

## 4. Det som er bygget godt

Diagnosen skal være ærlig begge veier.

- **Cron-runden er robust.** Postgres advisory lock (`route.ts:122-133`) hindrer overlapp; 50 s tidsbudsjett mot Vercels 60 s-grense; `timingSafeEqual` (`:34-37`) mot tidsangrep; strukturert `SystemLog` ved defer.
- **`unifiedScore()` er ærlig konstruert.** Ni dimensjoner, vekter summerer eksakt til 1,00, dekket av `__tests__/unified-scorer.test.ts`.
- **Brukeren ser ord, aldri tall.** `RESONANCE_LABELS` (`resonanceLevel.ts:28-33`) gir «Dyp / Sterk / God / Rolig resonans». Invariant I-12 er reelt implementert — dette er filosofien uttrykt i kode.
- **Betalings-flagget verner mot seg selv.** `config/features.ts:29-38` kaster ved oppstart hvis `PAYMENTS_ENABLED=true`, siden ingen betalingsvei finnes. Forbilledlig defensivt.
- **Kø-filteret er korrekt.** `route.ts:137-149` ekskluderer `bannedAt` og `deletedAt`, sorterer FIFO på `matchQueuedAt`.
- **GDPR-grunnmuren finnes.** Art. 17 (`/api/settings/delete-account`) og art. 20 (`/api/settings/export`) er implementert.

---

## 5. Prioritert tiltaksliste

| ID | Tiltak | Alvor | Innsats | Fase |
|---|---|---|---|---|
| B-1 | Aktiver reell e-postsending | Kritisk | S | Før beta |
| B-4 | Erstatt `isAdmin()` med `adminAuthGuard()` | Kritisk | S | Før beta |
| B-3 | Bygg PDF-eksport før sletting | Kritisk | M | Før beta |
| A-1 | Håndhev bildesperre server-side | Høy | S | Før beta |
| A-2 | Én kilde for fasegrenser | Høy | S | Før beta |
| B-2 | Vipps: fullfør eller deaktiver synlig | Kritisk | M | Før beta |
| A-3 | Samle resonansterskler | Middels | S | Før beta |
| A-4 | Tidsvindu på sperrelisten | Høy | M | Beta-uke 1 |
| G-4 | Delt rate-limit-lager | Middels | M | Før produksjon |
| G-2 | Fjern død kø-ventil | Lav | S | Opprydding |
| G-1 | Slett døde motorer | Lav | S | Opprydding |
| G-3 | Rett `ai/memory.json` | Middels | S | Umiddelbart |
| G-5 | Rydd `/docs` | Middels | M | Se DOCS-RESTRUCTURE |

**Estimat til beta-klar:** B-1, B-4, A-1, A-2, A-3 er alle små. Realistisk 2–3 dagers fokusert arbeid. B-3 (PDF) er den eneste med reell størrelse.

---

## 6. Konklusjon

Tosom lider ikke av dårlig kode. Det lider av **inkonsistens mellom flere generasjoner av riktig kode** — tre journey-motorer, fire matching-motorer, to terskelsett, fire rate-limitere. Hver enkelt ble skrevet med omhu; problemet er at ingen ble fjernet da den neste kom.

Konseptet er intakt og godt vernet. Ingen feed, ingen swipe, ingen AI-chat, ingen gamification. Én match, én reise, én relasjon — det holder hele veien gjennom koden.

De fire blokkerne er alle avgrensede. Ingen av dem krever omskriving av arkitektur.

**Én ting fortjener særlig vekt:** B-3 er ikke en teknisk feil. Det er et løfte til to mennesker som fant hverandre, og som mister minnet om hvordan det skjedde. Det bør rettes først av grunner som ikke er tekniske.