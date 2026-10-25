# ToSom — PAYMENT / VIPPS TRUTH PLAN (v1.0)

*Plan-mode audit. Ingen kode endret. Alt verifisert mot HEAD `cd04d32` (branch `main` = `origin/main` = production). Opprettet i PLAN P1, etter at ACT C1 prod-checkpoint var grønt.*

---

## ⭐ GEORGES PRODUKTBESLUTNINGER — ACT P1A (25.10.2026)

**Beslutning for launch-retningen: TOSOM LANSERES FØRST MED GRATIS BETA.**

Dagens fungerende gratisflyt beholdes. Betalt modus kommer senere som en separat
arbeidspakke, etter at:

1. Produktreglene er låst (D1–D7 under)
2. Juridiske betalingsspørsmål er avklart (PAYMENT LEGAL REVIEW REQUIRED)
3. Vipps-integrasjonen er implementert og verifisert

### Status

| OMRÅDE | STATUS |
|---|---|
| FREE BETA | **FIRST** — aktiv launch-retning. Gratis-kvoten gjelder 5 000 personer |
| PAID V1 | **PLANNED — NOT IMPLEMENTED** |
| VIPPS PAYMENT | **NOT IMPLEMENTED** (ingen adapter, checkout, webhook eller capture) |
| PAYMENT LEGAL REVIEW | **REQUIRED BEFORE PAID MODE** |
| REFUND/CREDIT POLICY | **PENDING PAID V1** (D3: retning = bounded credit, endelig regel venter) |

### D1–D7 — produktretning for BETALT V1 (ikke aktiv funksjonalitet ennå)

| # | Beslutning | Georges avgjørelse |
|---|---|---|
| D1 | Betalings-tidspunkt | **A — PAY ON MATCH / JOURNEY READY.** Brukeren skal ikke betale bare for å stå i kø. |
| D2 | Kvote-semantikk | **A — gratiskvoten gjelder personer (5 000 personer).** Dagens implementasjon er styrende; offentlig copy justert etter dette i ACT P1A. |
| D3 | Tidlig bortfall (partner/system/moderering) | **A — retning: bounded replacement journey / credit**, ikke automatisk refund som standard. Endelig regel fastsettes før betalt modus. |
| D4 | Begge parter betalingsklare | **A — i fremtidig betalt modell skal en betalt reise ikke starte før begge relevante parter har oppfylt betalingskravet.** |
| D5 | Fremtidig prisdefinisjon | **Godkjent produktretning:** «349 kr gjelder én faktisk startet 30-dagersreise med én person. Ingen abonnement.» Publiseres IKKE som bindende betalingsvilkår i gratisbetaen — kun som «planlagt pris». |
| D6 | Refund V1 | **A — manuell admin-refund anbefales fremfor komplisert automatikk i første betalte versjon.** |
| D7 | 21+ | **A — 21+ forblir Tosoms produktregel.** Ikke skriv «Vipps-verifisert alder» før dette faktisk er implementert og produksjonsverifisert. |

> Den opprinnelige analysen nedenfor (A–W) er beholdt uendret. Den er grunnlaget
> for beslutningene over og fortsatt referanse for det betalte arbeidspakket.

---

## A. Executive summary

Én setning om dagens sannhet:

> **ToSom lanseres GRATIS for de første 5 000 brukere. «349 kr + Vipps-betaling + refusjon» er design/scaffolding — ingen betalt betalingsvei er implementert, og `PAYMENTS_ENABLED` er hard-låst til `false` (app-en kaster en FATAL feil ved oppstart om den settes til `true`).**

Det som faktisk er sannt i dag (verifisert mot HEAD):

1. **Pris = 349 kr per reise, én gang, NOK.** Én kilde: `config/legal.ts` → `PRICING = { active:false, journeyPrice:349, freeUserCap:5000, currency:'NOK' }`. Men «349» er **hardkodet i 5+ steder** (`config/legal.ts`, `Order.amount @default(34900)` i schema, `/priser`, `/priser/layout`, `/landing`, `/betaling`). Kun `/vilkar` leser fra `PRICING`. → **Ikke én kilde i dag** (PAY-01).
2. **Gratis-kvote = 5 000** (`PRICING.freeUserCap`), konsumert **én gang per bruker ved kø-inngang** (`claimFreeQuota`, atomisk via `Quota.free_users`-raden). Teller = `Order` med `freeQuota=true, status=PAID`. Gratis-ordren **persisterer gjennom `new_journey`** (bytter reise) → i praksis **«5 000 brukere»**, ikke «5 000 reiser» (mismatch med public copy).
3. **Betalingsgaten sitter ved KØ-INNGANG** (`POST /api/journey/queue`): `isPaymentsEnabled()===true` → krever en `PAID`-ordre (ellers `402 → /betaling`); `===false` (nå) → atomisk gratis-claim. **Det finnes ingen betalt-order-oppretting noe sted i koden** — den eneste `prisma.order.create` er i `freeQuota.ts` og lager kun gratis-ordre (beløp 0, provider `free_quota`).
4. **Vipps er to separate ting — begge IKKE funksjonelle:**
   - **Vipps-innlogging** (`app/api/auth/vipps/*`): **død kode** — callbacken kaller `signIn('credentials')` som peker på en fjernet provider; skjult bak `VIPPS_ENABLED` (default av). Scope = `openid profile email` (gir navn + epost, **ikke** telefon, **ikke** alder). `/register/vipps` er en placeholder (auto-redirect til `/register` etter 3 s).
   - **Vipps-betaling**: **ikke implementert**. Kun `PaymentProvider`-grensesnittet (`createOrder/verifyWebhook/getStatus`) + `Order`/`WebhookEvent`-modellene + config. Ingen adapter, ingen checkout, ingen webhook-rute, ingen ePayment-kall.
5. **Refusjon = kun konfig + vilkårstekst.** `REFUND = { fullBeforeMatch:true, afterMatch:false }` (grensen = koblingen, ikke en dato). Ingen kode setter `order.status='REFUNDED'`, ingen admin-vekt for refund. ⚠️ Modellen forutsetter at reisen regnes som digitalt innhold etter **angrerettloven § 22 n — ikke juridisk bekreftet** (JURIDISK-GRUNNLAG A-1).
6. **`deploy/payments.md` er delvis utdatert:** sier «10 000» (HEAD = **5 000**) og «caches i Redis (60 s)» (koden gjør direkte `prisma.order.count`, ingen cache).

**Konsekvens for lansering:** Betalt modell er et **produktbeslutnings-spørsmål**, ikke en implementerings-mangel vi skal løse nå. Vi kan lansere trygt **gratis (første 5 000)** i dag. Når Vipps-nøkkelen er på plass, velger vi betalingsmodell (se Q/R/S).

---

## B. Existing implementation — Payment Truth Matrix

Verifisert mot HEAD. `ACTIVE` = kjører i prod i dag · `PARTIAL` = bygd men ikke koblet/fullt · `DEAD` = død/scaffolding. C/S = Client/Server.

| # | NAVN | FIL | STATUS | C/S | FLOW (hva skjer i dag) | DB STATE | QUOTA-RELS | IDEMPOTENS |
|---|------|-----|--------|-----|------------------------|----------|-----------|------------|
| 1 | Pris-konfig (kanonisk) | `config/legal.ts` (`PRICING`) | ACTIVE | Server | Én kilde for 349/5000/NOK; `active:false` | — | cap=5000 | — |
| 2 | Pris hardkodet (UI) | `app/priser/*`, `app/(landing)/page.tsx`, `app/betaling/page.tsx` | ACTIVE | Client | Viser «349 kr / 5 000 gratis» — **hardkodet**, leser IKKE PRICING | — | 5000 (duplikat) | — |
| 3 | Pris hardkodet (schema) | `prisma/schema.prisma` (`Order.amount @default(34900)`) | ACTIVE | Server | Default-beløp i Order; **ikke** fra PRICING | `Order.amount` | — | — |
| 4 | Betalingsgate | `app/api/journey/queue/route.ts` (118-158) | ACTIVE | Server | `isPaymentsEnabled()` ? krever PAID-ordre : gratis-claim; `402 → /betaling` | `Order`,`User.journeyState` | claim her | kø idempotent (QUEUED→200) |
| 5 | Gratis-kvote | `lib/payment/freeQuota.ts` | ACTIVE | Server | `claimFreeQuota` (atomisk `UPDATE Quota SET used+1 WHERE used<cap`), `createFreeOrder` (PAID,0), `releaseFreeQuota` (rollback) | `Quota.free_users`,`Order` | **teller her** | atomisk (row-lock) |
| 6 | `/betaling`-side | `app/betaling/page.tsx` | ACTIVE | Client | «Start reisen»: 2 avkrysninger (vilkår + angrerett-waiver) → POST `/api/journey/queue` → `/dashboard`. **Ingen betalt Vipps-steg** | — (via queue) | — | — |
| 7 | PaymentProvider | `lib/payment/provider.ts` | DEAD | Server | Kun TS-grensesnitt (`createOrder/verifyWebhook/getStatus`); ingen adapter | — | — | — |
| 8 | Order-modell | `prisma/schema.prisma` (`Order`) | PARTIAL | Server | Eksisterer (PENDING/PAID/FAILED/REFUNDED); kun PAID-gratisordrer skapes i dag | `Order` | freeQuota-flagg | `providerRef @unique` (til framtida) |
| 9 | WebhookEvent-modell | `prisma/schema.prisma` (`WebhookEvent`) | PARTIAL | Server | Eksisterer for idempotens (`id`=provider-event-ID); **ingen rute skriver til den** | `WebhookEvent` | — | designet |
| 10 | Refusjon-konfig | `config/legal.ts` (`REFUND`) | PARTIAL | Server | `fullBeforeMatch:true, afterMatch:false`; kun lest av vilkårstekst; **ingen kode håndhever** | — | — | — |
| 11 | Vipps-innlogging | `app/api/auth/vipps/authorize\|callback/route.ts` | DEAD | Server | Authorize bygger OAuth-URL (scope `openid profile email`); callback kaller `signIn('credentials')` (fjernet provider) → feiler. Skjult bak `VIPPS_ENABLED` | `Account`,`User` | — | state-cookie (HMAC) |
| 12 | Vipps-login-side | `app/register/vipps/page.tsx` | DEAD | Client | Placeholder: auto-redirect til `/register` etter 3 s | — | — | — |
| 13 | `PAYMENTS_ENABLED` | `config/features.ts` | ACTIVE (kill switch) | Server | `true` → **throw FATAL ved oppstart**; ellers `false`. `.env.example` låst til `false` | — | — | — |
| 14 | 402→/betaling i UI | `app/onboarding/OnboardingFlow.tsx`, `app/matching/page.tsx` | PARTIAL | Client | Ved `402` fra queue → `router.push('/betaling')`; nås i free-modus kun når kvote er opp | — | — | — |
| 15 | Journey-end / bytte | `lib/journey/endJourney.ts`, `app/api/journey/exit/route.ts` | ACTIVE | Server | Outcomes: completed/early_exit/blocked/expired/found_each_other/new_journey/no_action. `new_journey`→IDLE, **Order beholdes**; `no_action`→**Order slettes** | `JourneyProgress`,`Match`,`Order` | Order persisterer via new_journey | exit idempotent (409) |
| 16 | Admin-kvote | `app/api/admin/overview/route.ts` | ACTIVE | Server | Viser `freeQuotaUsed` = `Order.count(freeQuota && PAID)` | `Order` | leses her | — |

**Test dekning i dag (payment-nerfed):** `__tests__/free-quota-claim.test.ts`, `free-quota-release.test.ts`, `free-quota-threshold.test.ts` — dekker den **atomiske kvoten** (claim/release/threshold). Ingen test for betalt betalingsflyt, refund, webhook-idempotens eller 2-parter-betaling (de finnes ikke).

---

## C. Existing database model

Relevante modeller (alle i `prisma/schema.prisma`):

- **`User`** (betalingsrelevante felter): `journeyState JourneyUserState @default(IDLE)`; `matchQueuedAt DateTime?`; `termsAcceptedAt/termsVersion`; `withdrawalWaiverAt DateTime?` («angrerett-samtykke ved betaling» — lagres på User av `/betaling`/queue). **Ingen `paidUntil`, ingen `creditBalance`, ingen `paymentRequired`-flagg** — betalingsstatus finnes KUN som en relasjon til `Order`.
- **`Order`** (STEG G1): `id`, `userId`, `amount Int @default(34900) // øre`, `currency 'NOK'`, `status OrderStatus @default(PENDING)`, `provider 'vipps'`, `providerRef String? @unique`, `freeQuota Boolean @default(false)`, `withdrawalWaiver Boolean @default(false)`, `waiverAt`, `createdAt`, `completedAt`. Indekser: `[userId,status]`, `[status,createdAt]`.
- **`OrderStatus`** enum: `PENDING · PAID · FAILED · REFUNDED`. (Merk: ingen `AUTHORIZED`, `CAPTURED`, `CANCELLED` — se K for tilstandsmodell.)
- **`WebhookEvent`** (STEG G1, idempotens): `id` (provider-event-ID → idempotens), `provider`, `payload Json`, `receivedAt`. Indeks `[provider,receivedAt]`.
- **`Quota`** (F2-2): `id`, `used Int @default(0)`, `updatedAt`, `createdAt`. Én seedet rad: `free_users`. (Ingen `cap`-kolonne — taket er konstant `PRICING.freeUserCap` i koden.)
- **`Match`**: `userAId/userBId`, `status MatchStatus @default(active)` (`active·ended·expired`), `score`, `resonanceLevel`, `lockedAt`, `expiresAt`. `@@unique([userAId,userBId])`. **Ingen betalingsfelt på Match** — betaling er per-bruker (Order), ikke per-match.
- **`JourneyProgress`** (per user + match): `userId`, `matchId`, `phase` (EARLY/BUILDING_TRUST/DEEPER/CHECKIN), `day Int @default(0)`, `completedDays`, `userASeenAt`, `userBSeenAt`, `bothSeenAt` (**null = reisen har ikke startet**), `nextDayAt`, `startedAt`, `endedAt`, `pausedAt`, `resumedAt`, `completedAt`, `continueA…`. `@@unique` per `(userId, matchId)`.
- **`JourneyUserState`** enum: `IDLE · QUEUED · MATCHED · ON_JOURNEY · COMPLETED`.
- **`MatchHistory`**: `userAId/userBId`, `matchId?`, `endedAt`, `outcomeA`, `outcomeB` (f.eks. `found_each_other`, `abandoned`, `reported`, `new_journey`, `blocked`). `@@unique([userAId,userBId])` — hindrer rematch med samme person.

**Gap (mangler for en betalt modell):**
1. **Ingen per-match betalt-status** — betaling er per-bruker (`Order`), men reisen er per-match. Det finnes ingen felt som sier «begge i denne matchen har betalt». (Kritisk for 2-parter, se S/Q.)
2. **Ingen `credit`/`replacement`-teller** — «ny reise uten ny betaling» kan ikke begrenses i dag (mangler misbruk-vaktklapp, se step 14).
3. **`Order.amount @default(34900)` er hardkodet** — ikke koblet til `PRICING.journeyPrice` (drift-risiko).
4. **`Order` slettes i `endJourney` ved `no_action`** — i betalt-modus ville dette ødelegge regnskaps-sporet (bokføringsloven). Må skilles: behold Order (regnskap) når User slettes.
5. **Ingen idempotency-nykkelen er i bruk** — `providerRef @unique` og `WebhookEvent.id` er designet men aldri skrevet til.

---

## D. Existing Vipps integration

**Hvilken API planlegges:** Vipps **ePayment (MobilePay)**. Offisiell ePayment-lifecycle er: `CREATE → AUTHORIZE → CAPTURE` (alternativt `CANCEL` / `REFUND`), pluss `GET STATUS`, `GET EVENT LOG` og `WEBHOOK`.

**Hva er faktisk implementert i HEAD:** **Ingen av dem.** Tabell:

| ePayment-steg | Implementert? | Hva finnes |
|---------------|---------------|-----------|
| CREATE (checkout/order) | ❌ NEI | Kun `PaymentProvider.createOrder()` i **grensesnittet** — ingen adapter, ingen rute |
| AUTHORIZE (reserver) | ❌ NEI | Ingen kode, ingen `AUTHORIZED`-status i `OrderStatus` |
| CAPTURE (belast) | ❌ NEI | Ingen kode |
| CANCEL | ❌ NEI | Ingen kode |
| REFUND | ❌ NEI | Ingen kode, ingen admin-vekt, `REFUNDED`-status aldri satt |
| GET STATUS | ❌ NEI | Kun `PaymentProvider.getStatus()` i grensesnittet — ingen implementasjon |
| GET EVENT LOG | ❌ NEI | — |
| WEBHOOK | ❌ NEI | `WebhookEvent`-modellen finnes, **men ingen webhook-rute** (`find app/api -path '*webhook*'` → tom) |

**Skill Vipps-LOGIN vs Vipps-BETALING (viktig, step 30):**
- **Vipps-LOGIN (OAuth)**: død kode i `app/api/auth/vipps/*`. Scope = `openid profile email` → gir **navn + epost** kun. **Gir IKKE telefonnummer, gir IKKE aldersverifisering, gir IKKE «identitetsverifisert».**
- **Vipps-BETALING (ePayment)**: ubygget. En vanlig ePayment gir (når den bygges) typisk **status + beløp + referanse/transactionId** — **ikke** profil/alder med mindre en separat scope (f.eks. minimum-age) eksplicit etterlates. → **Ikke skrive «Vipps-verifisert alder» eller «identitetsverifisert» før det er implementert og prod-verifisert.**
- `.env.example` har `VIPPS_CLIENT_ID/SECRET/HOST` (for login) + `PAYMENTS_ENABLED=false`. **Ingen ePayment-spesifikke nøkler er til stede** (Vipps-betalingsnøkkelen er «ikke på plass», se deploy/payments.md).

**Konklusjon:** «Vipps» i dag = (a) død login-scaffolding + (b) ubygget betalingsplan. Det finnes ingen fungerende Vipps-berøring i prod.

---

## E. Existing quota system («5 000 gratis»)

**Hva teller ned kvoten:** Antall `Order`-rader med `freeQuota=true AND status='PAID'` (= `Quota.free_users.used`, backfylt fra Order-tellingen).

**Når konsumeres den:** **Én gang per bruker ved KØ-INNGANG** (`POST /api/journey/queue` → `claimFreeQuota`), ikke ved registrering/onboarding/match/start/fullføring.

| Egenskap | Status i dag |
|----------|-------------|
| Teller | `Quota.free_users` (rad) + `Order` (audit-logg admin leser) |
| Atomisk claim | ✅ `UPDATE "Quota" SET used=used+1 WHERE id='free_users' AND used<cap` — Postgres row-lock seriariserer; kun én vinner grenseplassen (F2-2) |
| Oversubscription | ✅ Forebygd (betinga update, ingen check-then-create-race) |
| Rollback ved feil | ✅ `releaseFreeQuota` — ruller teller + sletter gratis-ordren hvis Order-oppsett eller kø-transaksjonen feiler etter claim (A4) |
| Re-entrè | En bruker med eksisterende PAID-ordre re-klamerer **ikke** (existingOrder-sjekk i queue) |
| Ny reise (`new_journey`) | **Konsumerer IKKE ny kvote** — Order beholde → samme bruker kan re-reise gratis |
| Admin override | ❌ Ingen manuell justering (verken øk/mink) uten å kjøre kode |
| Prod-status | ✅ Fungerer (free-modus). Taket `5000` er langt unna nå |
| **MISMATCH** | ⚠️ Public copy sier «5 000 **reiser**»; koden teller «5 000 **brukere/ordrer**» (Order persisterer via `new_journey`) |

**Konsekvens:** I dag kan én av de første 5 000 brukerne teoretisk gjennomføre flere gratis reiser (via `new_journey`) uten å konsumere ny kvote. For en gratis lansering er dette lav risiko, men det er en **sannhets-mismatch** som må avgjøres (S) før betalt-modus: er kvoten «5000 reiser» eller «5000 brukere»?

---

## F. Existing public claims (cross-site truth matrix)

Verifisert mot HEAD. `TRUE`=stemmer med config/kode · `PARTLY` · `FALSE` · `PENDING`=trenger produktbeslutning.

| SIDE | CLAIM | KATEGORI | VERDI |
|------|-------|----------|-------|
| `/priser` | «349 kr, per reise, betalt én gang med Vipps. Ingen abonnement.» | pris/én-gang | ✅ TRUE (stemmer med PRICING) |
| `/priser` | «De første 5 000 reiser er gratis.» | gratis | ⚠️ PARTLY (5000, men «reiser» vs kodes «brukere») |
| `/priser`+`layout` | pris hardkodet (leser ikke PRICING) | kilde | ⚠️ drift-risiko (PAY-01) |
| `/landing` | «5 000 gratis. Ingen kredittkort, ingen abonnement. Når de 5 000 er tatt, koster én reise 349 — betalt én gang med Vipps.» | pris/gratis | ✅ TRUE |
| `/faq` | «Du betaler for reisen, ikke for å være der.» | hva-betaler-de-til | ✅ TRUE (stemmer med modell: pris=koblingen/reisen) |
| `/vilkar` | leser PRICING (349, 5000); «Grensen går ved koblingen: full refusjon før, ingen etter.» | pris/refusjon | ⚠️ PENDING (juridisk §22 n ubekreftet) |
| `/betaling` | «5 000 gratis. Deretter 349, én gang, Vipps.» + 2 avkrysninger (vilkår + angrerett) | checkout | ✅ TRUE (men siden betaler ingenting i dag) |
| `/motpol` | Ingen betalingscopy (kun «en pris» i metafysisk/ærlighetssinne-forstand) | — | ✅ N/A (motsier ingen betalingsmodell) |
| onboarding/matching | «forlate køen — gratis, ingen binding»; 402→/betaling | kø | ✅ consistent |
| emails (`lib/email`) | Ingen betalingscopy | — | ✅ N/A |

**Én sannhet i dag (public):** «Første 5 000 gratis, deretter 349 kr per reise, én gang, Vipps, ingen abonnement.» — **konsistent på tvers av alle sider.** De to unntakene: (1) «reiser» vs «brukere» (E), (2) pris hardkodet i UI (PAY-01).

---

## G. Payment lifecycle (hvor sitter betaling i dag)

Dagens **designede** flyt (betalt-modus) og **faktiske** flyt (free-modus, i dag):

```
REGISTER → ONBOARDING (onboardingComplete=true)
   → /betaling (konsent: vilkår + angrerett-waiver)
   → POST /api/journey/queue
        ┌─ isPaymentsEnabled()=TRUE (FREM TID): krever PAID-Order, ellers 402→/betaling
        └─ isPaymentsEnabled()=FALSE (I DAG): atomisk gratis-claim → PAID-gratisordre
   → journeyState=QUEUED (står i kø)
   → MATCHING-CRON (lør 03:00): matcher QUEUED → Match(active) + JourneyProgress → journeyState=MATCHED
   → begge ser hverandre → bothSeenAt settes → journeyState=ON_JOURNEY (reisen «starter»)
   → 30 dager (day 0→30) → journeyState=COMPLETED  (eller tidlig exit)
```

**Betalingstidspunkt = KØ-INNGANG** (før matcherunden, før match finnes). IKKE «etter match funnet».
→ Det er **Model B** (pay-before-queue). I DAG betales det **ingenting** (free-modus); betalingen ville hatt skjedd her når Vipps er bygget.

**Refusjonsgrense (config/vilkar) = KOBLINGEN (matchen), ikke en dato:**
- `QUEUED` (ikke matchet) → refundabel («full refusjon fram til koblingen»).
- `MATCHED`+ (koblingen er gjort) → **ikke** refundabel («tjenesten er levert»).
- Merk: matchen skjer **før** reisen «starter» (bothSeenAt). Så «betalt, matchet, men partneren forsvinner dag 1» = **ikke refundabel** etter dagens vilkår → problemet som I/J/S skal løse.

**Produktvurdering (step 6):** Dagens modell lar brukeren betale **før** Tosom vet om de kan levere (match), og beskytter med refusjon-til-match. Den fungerer, men gir «pay and wait». Georges preferanse (step 18) er å skyve betalingen **til** match (Model A) for å unngå dette. Se Q/R.

---

## H. Failure scenarios (hvordan håndteres i dag)

| Scenario | I DAG (free-modus) | I betalt-modus (må bygges) |
|----------|--------------------|----------------------------|
| payment failed | N/A (ingen betaling). Kvote-feil → `releaseFreeQuota` (rollback) → bruker kan prøve igjen | Order PENDING→FAILED; bruker kan retry (idempotent create) |
| payment pending | N/A | Order PENDING; reise starter **ikke** før PAID (bekreftet server-side) |
| paid, men reise ikke startet | N/A | Bruker i kø uten match → refundabel inntil match (config) — **men ingen refund-kode finnes** |
| duplicate payment | N/A | Må forebygges (WebhookEvent idempotens + providerRef unique) — **designet, ikke bygget** |
| gratis-kvote opp brukt | `402 → /betaling` → **blindvei** (payments off kan ikke motta betaling) | Krever betalt-vei; latent (kvote langt fra 5000) |
| Vipps outage | N/A | Order PENDING, reiser starter ikke; manual reconciliasjon (se N) |

**Konklusjon:** I dag er det **ingen** betalt-feil å håndtere (ingen betaling). Alle betalt-failure-scenarier er **open design**. Den eneste faktiske failure-håndteringen er kvote-rollback (A4), som er solid.

---

## I. Partner-drop scenarios (den vanskelige)

Dagens tekniske realiteter (fra schema + endJourney):
- **DAY 0** (match opprettet, ingen samtale): `JourneyProgress.bothSeenAt = null` → **reisen har ikke startet**. `Match.status=active`, `expiresAt` (~14 dager). Ingen av de to «innom» innen 14 dager → `MatchStatus=expired` (auto).
- **DAY 1–3** (partner trekker seg/inaktiv): Den som gis opp kan `POST /api/journey/exit` → `endJourney(outcome)` → reset begge til IDLE.
- **DAY 4–14**: samme exit-vekt.
- **DAY 15+** (`imageUnlockDay=15`): bilder åpnes, reisen er «sen» — å avslutte her koster mer (relasjon pågår).

**Dagens «beskyttelse» (verifisert):** `new_journey`-outcomet i exit = **«Start ny reise»** → reset til IDLE, **Order beholdes** (ingen ny kvote, ingen ny betaling i free-modus). Dette **er** allerede en «ny reise uten ny betaling»-mekanisme. Det finnes **ingen** automatisk refusjon, og **ingen** automatisk «partner forsvant»-deteksjon (alt er bruker-initiert eller admin/moderasjon).

**Utløser (step 15) i dag:** Alt er **ME** (bruker trykker exit) eller **MODERATOR** (ban/block). **Ingen** automatisk **PARTNER-inaktiv** → økonomisk konsekvens. (Step 16: anbefal MANUELL support/admin for første versjon, ikke automatisk «inaktivitet»-økonomikk.)

---

## J. Refund vs credit (skill)

- **REFUND** = penger tilbake til bruker.
- **CREDIT / REPLACEMENT JOURNEY** = Tosom lar brukeren prøve igjen **uten ny betaling**.

**I dag:** Kun `new_journey` (credit/replace) finnes i koden — og den er gratis. **Ingen refund-kode** (`REFUNDED` aldri satt, ingen admin-refund). `REFUND`-konfigen er kun lest av vilkårstekst.

**Kandidat-retningslinje (ikke beslutning):**
- **Tidlig bortfall pga PARTNER / SYSTEM / MODERATION** (før reisen «er i gang på en meningsfull måte») → **credit** (`new_journey`, ny reise uten ny betaling). Enkelt for support/regnskap (ingen pengebevegelse).
- **REFUND** bare i klart definerte tilfeller — i første versjon: **MANUELL ADMIN-REFUND** for sjeldne spesialtilfeller (enkelhet > automatikk).
- **Bruker selv ombestemmer seg** → **ikke** automatisk gratis ny reise.
- **Misbruk (step 14):** credit kan loopes (`new_journey` → match → exit → `new_journey`). I dag **ingen grense**. For betalt-modus: sett én enkel begrensning (f.eks. maks N kreditter per bruker, eller «credit kun før dag X / kun hvis motpart/system feilet»). Hold det dumt og auditert.

---

## K. State machine

**Eksisterende states (i dag):**
- `OrderStatus`: `PENDING · PAID · FAILED · REFUNDED`
- `JourneyUserState`: `IDLE · QUEUED · MATCHED · ON_JOURNEY · COMPLETED`
- `MatchStatus`: `active · ended · expired`

**Minimum nødvendig betalings-tilstandsmodell (frem tid):** Reuse eksisterende `OrderStatus` så langt det går, og legge til **`CANCELLED`** (for 2-parter-tilfellet «match ugyldiggjort / en part droppet betaling»). **Ikke** legg til `AUTHORIZED` i v1 (se nedenfor).

```
Order:  PENDING ──► PAID ──► (REFUNDED | CANCELLED)
                └──► FAILED (retry-allow: ny PENDING)
JourneyUserState: IDLE ─► QUEUED ─► MATCHED ─► ON_JOURNEY ─► COMPLETED
                                             └──► (match voided) ─► QUEUED (båt tilbake)
```

**Authorization vs Capture (step 8) — vurdering:**
- Vipps ePayment **støtter** `AUTHORIZE → CAPTURE` som to steg. Det kan gi «reserver betaling ved kø-inngang, capture når reisen er gyldig» — elegant for Model B sin «refusjon til match» (avbryt authorization = refund, uten ekte pengebevegelse).
- **Men:** Vipps-authorizationer har begrenset holdetid, og i ToSoms modell starter reisen **prompt etter match** (begge må se hverandre). En langvarig reserve er upraktisk og øker kompleksitet.
- **Anbefaling v1:** **Enkel CAPTURE** (én belastning), ikke authorize. «Refusjon til match» håndteres enten (a) **Model A**: ingen pre-betaling → ingen refund nødvendig, eller (b) **Model B**: capture + **REFUND** hvis ingen match (manual/cron). Enkelhet vinner.

---

## L. Idempotency

**Krav (step 21):** én reise skal IKKE kunne føre til flere captures. Trusler: dobbel-klikk, refresh, Vipps-callback ×N, webhook-retry, bruker returnerer, server/cron-retry.

| Nivå | I DAG | Betalt-modus (må bygges) |
|------|-------|---------------------------|
| Kø | ✅ idempotent (QUEUED→200, endrer ikke `matchQueuedAt`) | — |
| Gratis-claim | ✅ atomisk (betinga update) + rollback | — |
| Order-create (betalt) | — (finnes ikke) | `Order.providerRef @unique` → samme referanse ikke kan opprettes to ganger |
| Webhook (betalt) | — (ingen rute) | `WebhookEvent.id` = provider-event-ID → samme hendelse behandles én gang |
| Capture | — (finnes ikke) | capture kun når `PENDING→PAID` (betinga update); allerede PAID → ingen ny capture |
| Exit | ✅ idempotent (409 hvis match ikke `active`) | — |

**Status: PRE-LAUNCH BLOCKER for betalt-modus.** Designet (modeller + unique-felt) er på plass, men **ingen** av idempotens-mekanismene for betalingsflyten er implementert/testet. For **gratis-lansering i dag** er idempotens solid (kø + kvote).

---

## M. Webhooks

**I dag:** Ingen webhook-rute (`find app/api -path '*webhook*'` → tom). `WebhookEvent`-modellen finnes men skrives aldri til.

**Krav ved oppbygging (step 22):**
- **Signatur/auth-verifisering** av Vipps-webhook (HMAC/header) — forkast uautoriserte.
- **Duplicate delivery**: idempotent via `WebhookEvent.id` (provider-event-ID).
- **Ordering/retordre**: behandlingsrekkefølge er ikke garantert → status er **tilstands-basert**, ikke rekkefølge-basert.
- **Retry**: Vipps re-leverer → idempotens må ta det.
- **Event storage**: lag rå payload i `WebhookEvent` (audit).
- **Source of truth**: **server-side webhook + GET STATUS er autoritativt. Browser-redirect fra Vipps betyr IKKE «betalt».** (Step 23.)

---

## N. Reconciliation (DB vs Vipps)

**Source of truth (step 23):** For betalingsstatus er **Vipps (server-side) autoritativt** i en konflikt; **DB er det operative regnskapssporet.**

| Konflikt | Håndtering |
|----------|-----------|
| DB `PENDING` / Vipps `CAPTURED` | Tross Vipps → sett `PAID` (cron reconciliasjon via `GET STATUS`) |
| DB `PAID` / Vipps ikke-captured | Anomali → flag til support; ikke «uskyldig» — undersøk (burde ikke skje hvis capture kun via bekreftet webhook) |
| Webhook tapt | Cron `GET STATUS`/`EVENT LOG` for `PENDING`-ordrer fanger opp |

**Strategi v1:** en **cron-reconciliasjon** som for `PENDING`-ordrer spør Vipps om status og bringer DB i samsvar, pluss **manual admin** for resterende konflikter. **Aldri** stole på browser-redirect.

---

## O. Privacy / data (step 32)

**Vipps-data som vil bli lagret (når betalt-modus bygges) — klassifisert:**

| Data | HUKOMSLAG | Bør lagres? |
|------|-----------|-------------|
| `Order.amount`, `currency`, `status`, `createdAt`, `completedAt` | NEEDED FOR ACCOUNTING | ✅ (bokføringsloven) |
| `Order.providerRef` (Vipps transactionId/orderRef) | PAYMENT OPERATION | ✅ (reconciliasjon + idempotens) |
| `Order.userId` | PAYMENT OPERATION | ✅ (lenke til kjøper) |
| `WebhookEvent.payload` (rå) | PAYMENT OPERATION | ✅ (audit) — men hold **minimalt**; maskér PII hvis Vipps sender f.eks. telefon |
| Telefonnummer | IDENTITY | ⚠️ BARE hvis nødvendig; en vanlig ePayment gir ikke nødvendigvis telefon |
| Navn/profil | IDENTITY | ❌ IKKE fra betaling (kun fra login-scope, og den er død) |

**Viktige notater:**
- En **betalings**transaksjon gir **IKKE** identitetsverifisering (step 30/31). 21+-regelen er **selvrapportert** i onboarding.
- `endJourney` sletter `Order` ved `no_action` → i betalt-modus MÅ Order **beholdes** for regnskapsretensjon (bokføringsloven ~5-6 år) selv når User slettes.
- `/personvern` vil trenge en betalingsdata-retensjons-nemning **når** betalt-modus er aktiv (endres IKKE nå).

---

## P. Support / admin (step 33-34)

**Admin i DAG kan:** se `freeQuotaUsed` (overview), se/resette reiser (`/admin/journey/[id]/reset`), ban/block. **Kan IKKE:** se en bestemt `Order`/ref, se betalingsstatus per match, refund, gi gratis reise/credit, reparere fast betalingstilstand. → **Gap: ingen betalings-admin-vekt.** (For betalt-modus er dette en pre-launch-mangel for support.)

**Supportmatrise (kandidat, betalt-modus):**

| SCENARIO | USER MESSAGE | ADMIN ACTION | REFUND? | CREDIT? | WAIT? | ESCALATE? |
|----------|--------------|--------------|---------|---------|-------|-----------|
| payment failed | «Vipps funket ikke» | Sjekk Order-status; la retry | Nei | Nei | Nei | Nei |
| payment pending (fast) | «Jeg betalte men ingenting skjedde» | Reconciliasjon (GET STATUS) → PAID | Nei | Nei | Kort | Ja om konflikt |
| paid, reise ikke startet | «Betalt, står fortsatt i kø» | Forventet (venter på match); oppdater | Ja (før match, Model B) | Nei | Ja (kø) | Nei |
| duplicate payment | «Ble belastet to ganger» | Identifiser dobbel Order; refund én | **Ja** (én) | Nei | Nei | Ja |
| partner forsvinner (tidlig) | «Hun svarer ikke» | Bekreft tidlig + utløser; gi credit | Nei | **Ja** (bounded) | Nei | Nei |
| ingen match (lenge) | «Får aldri noen» | Normal (kø); oppdater | Ja (Model B, før match) | Nei | Ja | Nei |
| bruker kansellerer | «Bytte meg ut» | Exit (ME) → IDLE | Nei (før match: ja) | Nei | Nei | Nei |
| moderation fjerner partner | (system) | Credit til uinnblandede part | Nei | **Ja** | Nei | Ja |
| Vipps outage | «Kan ikke betale akkurat nå» | Vent; reconciliasjon etterpå | Nei | Nei | Ja | Ja om varig |

---

## Q. Product model alternatives (maks 3)

| DIMENSJON | **A — PAY ON MATCH** (George step-18) | **B — PAY BEFORE QUEUE + PROTECTION** (dagens design) | **C — FREE FIRST 5 000** (dagens impl.) |
|-----------|---------------------------------------|--------------------------------------------------------|------------------------------------------|
| USER EXPERIENCE | «Du betaler bare når vi har funnet noen.» — best tillit, men «overraskende» betaling på match + begge må betale + frist | Betal 349 før kø, vent, **refund inntil match** — «pay and wait» men beskyttet | Gratis — ingen friksjon |
| TECHNICAL COMPLEXITY | **HØY** — 2-parter-koordinering, betalingsfrist, match-release-bak-til-kø, «bruker forsvinner på betalingssteg» | **MIDL** — betaling ved kø-inngang (én part av gangen, uavhengig); refund-mekanisme | **INGEN** (bygd og fungerer) |
| VIPPS COMPLEXITY | **HØY** — asynkron betaling på match, status per part, frist-cron | **MIDL** — betaling ved kø-inngang + refund | **INGEN** |
| SUPPORT | MIDL (payment-failure-på-match, én-betalt-én-ikke) | MIDL (refund-forespørsler, «betalt men ingen match ennå») | **MINIMAL** |
| ABUSE RISK | **LAV** (betaler bare for ekte match; credit begrenset) | LAV-MIDL | LAV (men `new_journey`/credit ubegrenset i dag) |
| REFUND COMPLEXITY | **LAV** (mest pre-betaling; credit for tidlig drop; minimal refund) | **MIDL** (refund-til-match + angrerett §22 n-legalrisiko) | **INGEN** |
| ACCOUNTING | MIDL (2 Orders per reise, én per bruker) | MIDL (refund-transaksjoner) | MINIMAL (gratis-ordrer) |
| TRUST | **HØYEST** | MIDL (pay and wait) | HØY (gratis) |
| COPY SIMPLICITY | MIDL (må skrives om: «du betaler når vi finner noen») | **ENKEL** (allerede skrevet i /priser, /vilkar, /betaling) | ENKEL (allerede konsistent) |
| LAUNCH FITNESS | **LAV** (mest å bygge) | HØY (svarer mot eksisterende kode-design) | **HØYEST** (zero risiko, shippbar nå) |

**Kjernen i A vs B (det som avgjør D1):** Produktet er **tosidig** (BEGGE betaler 349 hver).
- **Model A** → begge må betale **på match** → koordinering + frist + release. Mer tillit, mer bygg.
- **Model B** → hver betaler **uavhengig ved kø-inngang** → ingen koordinering. Enklere, men «pay and wait».
- Begge støter på samme «hard case»: **matchet, men partneren forsvinner tidlig** → løses med **credit** (bounded `new_journey`), uavhengig av A/B.

---

## R. Recommended model (anbefaling)

**Anbefaling er fase­delt:**

1. **LAUNCH (nå) = Model C — gratis for de første 5 000.**
   Dette er bygd, testet (kvote-idempotens) og **zero risiko**. Vipps-betaling er ubygget og `PAYMENTS_ENABLED` er låst til `false` — vi **kan i dag ikke** lansere betalt. Derfor er lanseringsmodellen gratis uansett hvilket betalt-modell George velger. Vi skal **ikke** bygge Vipps før lansering med mindre både nøkkel og flyt er ferdig og testet.

2. **BETALT-V1 (når Vipps-nøkkelen er på plass) = Model A (Pay on Match)** — anbefalt mål, med én forenklet 2-parter-regel:
   - Køen er gratis. Når en gyldig match finnes → **betalingssteg for begge** med frist (f.eks. 72 t).
   - Reisen starter **bare når begge er PAID** (server-side bekreftet).
   - Frist utløper uten at begge har betalt → **match voides, begge tilbake i kø, delvis betalt auto-refunderes** (ingen belastning).
   - Tidlig bortfall pga **partner/system/moderasjon** etter at reisen startet → **credit** (bounded `new_journey`).
   - Bruker selv ombestemmer seg → **ikke** automatisk credit.

**Hvorfor A (ikke B) som mål:** (1) Høyest tillit — «du betaler bare når vi har funnet noen», samsvarer med ToSoms varemerke (ro/trygghet) og med Georges step-18. (2) Fjerner mest av **angrerett/refusjons-risikoen** (den største juridiske blockeren) siden det nesten ikke pre-betalles. (3) `new_journey`-credit-mekanismen finnes **allerede** i koden.
**Hvorfor ikke A i v1 om det blir for tungt:** A sin kostnad er 2-parter-koordinering + betalingsfrist + match-release. Hvis det er for mye for v1, **fall tilbake til B** (svarer mot eksisterende kø-gate, enklere copy, men krever refund-til-match + §22 n-juridisk grønn lys).

**Én setning (step 25) — for anbefalt Model A:**
> **«349 kr kjøper én faktisk startet 30-dagersreise (én kobling) til én bestemt person.»**
For Model B ville blanken bli: «349 kr kjøper plass i kø + koblingen (matchen) til én bestemt person — refundabel inntil koblingen er gjort.»

---

## S. George decisions (maks 7)

Svar format: `D1=A`, `D2=A`, … Deretter kan ACT starte.

| # | BESLUTNING | OPSJONER | ANBEFALING | HVA-FOR | TECH IMPACT | USER IMPACT | LEGAL DEPS |
|---|-----------|----------|-----------|---------|-------------|-------------|------------|
| **D1** | Betalt-modell (betalings-tidspunkt) | A = Pay on match · B = Pay before queue + refund-til-match | **A** (fallback B) | Høyest tillit, minst angrerett-risiko; `new_journey` finnes | A: 2-parter+frist+release (høy). B: kø-gate + refund (midt) | A: «betaler bare når ekte». B: «pay and wait» | A: lite. B: §22 n MÅ bekreftes |
| **D2** | Kvote-semantikk | A = 5 000 **personer** · B = 5 000 **reiser** · C = annet tall | **A** (personer) | Svarer mot koden (Order persisterer via `new_journey`) | A: ingen endring. B: konsumer per `new_journey` | A: de første 5 000 får tilgang | Copy/markedsføring (markedsføringsloven) |
| **D3** | Beskyttelse ved tidlig bortfall (partner/system/mod) | A = **Credit** (ny reise, begrenset) · B = Refund · C = begge | **A** (credit, bounded) | Enklere: ingen pengebevegelse, `new_journey` finnes | A: +credit-teller/grense. B: refund-kode+admin | Forlatt brukker prøver igjen gratis | Credit vs refund (jurist) |
| **D4** | Begge parter + betaling (gjelder for A) | A = Begge innen frist ellers void+auto-refund · B = start med én betalt | **A** | Unngår «én betalt, én ikke»-blindvei | A: frist-cron + release + per-part status | Begge i same båt; ingen «du ventende alene» | — |
| **D5** | En kilde for pris + én setning | A = sentraliser i `PRICING` + «349 kr = én startet reise til én person» | **A** | Fjerner 5 hardkodede duplikater (PAY-01) | A: UI leser PRICING; Order-default koblet | Én forståelig pris | — |
| **D6** | Refund i v1 | A = **Manual admin-refund** (sjeldne tilfeller) · B = Auto-refund (cron) | **A** | Enkelhet; ingen penge-risiko i v1 | A: +admin-vekt. B: refund-kode+cron+idempotens | Support-håndterbar | Refusjonsvilkår (jurist) |
| **D7** | 21+ / identitet-claim | A = selvrapportert alder, IKKE «Vipps-verifisert» · B = mål Vipps min-age (senere) | **A** (nå), B (senere) | Vipps-betaling gir IKKE alder; login-scope er død | A: ingen endring | Ingen feil-claim | Markedsføring/angrerett (ikke verifisert) |

---

## T. Legal-review questions (til jurist — kun det som krever svar)

1. **Hva er Tosoms leveranse juridisk?** — «koblingen/matchen» eller «den 30-dagersreisen»? (Avtaleloven; avgjør alt annet.)
2. **Når anses reisen levert/påbegynt?** — ved match, ved «begge ser hverandre» (`bothSeenAt`), eller ved dag 1?
3. **Angrerett (§ 22 n):** kan vi behandle reisen som digitalt innhold der angreretten bortfaller ved uttrykkelig samtykke + bekreftelse (som `/betaling`-waiveren i dag)? **MÅ svares før betalt-modus.**
4. **Refusjon ved tidlig bortfall:** er «ingjen refusjon etter match» holdbart, eller krever forbrukerretten noe ved alvorlig mangel/feilleveranse?
5. **Credit (ny gratis reise) vs refund:** er en «ny reise uten ny betaling» et gyldig alternativ til refusjon i de tilfeller vi foreslår (D3)?
6. **Hva må vilkårene si FØR betaling** for at samtykket er gyldig (pris, levering, angrerett, opphør)?
7. **Hva må checkout vise** før belastning (én-gangspris, totalbeløp, betalingsmiddel, angrerett-avståelse)?
8. **Dokumentasjons-/kvitteringskrav:** hva må vi lagre/vise (kvittering, ordereferanse, bokføringsretensjon)?
9. **Automatisk ny reise/credit:** er en auto-credit-mekanisme (D3) OK, eller må den alltid være support-styrt?

*Ingen juridiske konklusjoner trekkes i denne planen. Prikker ovenfor markerer der ekstern vurdering kreves før betaling aktiveres.*

---

## U. Test plan (PAY-01 – PAY-20)

Bygges/kjører **når betalt-modell er besluttet** (etter S). For **gratis-lansering** er kun PAY-01/02/10/11/18/20 relevante i dag.

| ID | Test | Status i dag |
|----|------|--------------|
| PAY-01 | Pris = én kilde (UI + Order-default leser `PRICING`) | ❌ (5 hardkodede duplikater) |
| PAY-02 | Ingen betaling i modellens no-charge-scenario (free-modus) | ✅ (free-modus) |
| PAY-03 | Payment create idempotent | ❌ (ikke bygget) |
| PAY-04 | Duplicate callback/webhook idempotent | ❌ (ikke bygget; `WebhookEvent` designet) |
| PAY-05 | Capture idempotent | ❌ (ikke bygget) |
| PAY-06 | Ingen dobbel capture | ❌ (ikke bygget) |
| PAY-07 | Payment failure recovery (retry) | ❌ (ikke bygget) |
| PAY-08 | Begge parter-state deterministisk (Model A) | ❌ (ikke bygget) |
| PAY-09 | Reise starter KUN ved riktig payment-state | ❌ (gratis: starter ved match; betalt: må bygges) |
| PAY-10 | Free quota atomisk (ingen oversubscription) | ✅ (`free-quota-claim`/`-threshold` test) |
| PAY-11 | Free→paid overgang uten blindvei | ❌ (402→/betaling er blindvei i free-modus) |
| PAY-12 | Refund idempotent | ❌ (ikke bygget) |
| PAY-13 | Replacement journey/credit deterministisk (bounded) | ⚠️ (`new_journey` finnes, men ubegrenset) |
| PAY-14 | User-caused vs partner-caused end distinct | ⚠️ (exit har outcomes, men ingen økonomisk skill) |
| PAY-15 | Moderation scenario (credit til uinnblandede) | ❌ (manuell i dag) |
| PAY-16 | DB/Vipps reconciliation | ❌ (ikke bygget) |
| PAY-17 | Privacy export/payment data (retensjon) | ⚠️ (Order slettes ved `no_action`; må beholdes for regnskap) |
| PAY-18 | Public copy samsvarer med modell | ✅ i dag (consistnt); ⚠️ «reiser» vs «brukere» |
| PAY-19 | 21+-claim samsvarer med faktisk verifisering | ✅ (ingen claim; selvrapportert) |
| PAY-20 | Full regression (ingenting brøt) | ✅ (CI/CD kjører) |

---

## V. Implementation sequence (når — ikke kode nå)

**Fase 0 — LAUNCH (nå, gratis):** Ingen betalings-bygging nødvendig. Valgfri forbedring før/etter lansering: PAY-01 (sentraliser pris) og justere «5 000 reiser»-copy etter D2. **Ikke blokkerende for gratis-lansering.**

**Fase 1 — BETALT (etter Georges svar på S + Vipps-nøkkel på plass), rekkefølge:**
1. **PAY-01** — Én kilde for pris: UI (`/priser`, `/landing`, `/betaling`) + `Order`-default leser `PRICING.journeyPrice`.
2. **Legal (T)** — få svarene; **spesielt §22 n** før noe pre-betaling (gjelder Model B; mindre for A).
3. **Vipps ePayment-adapter** i `lib/payment/` (implementer `PaymentProvider`: createOrder, webhook, getStatus) — per valgt modell (A/B).
4. **Betalings-tilstandsmodell** (K) — legg evt. `CANCELLED`; hold enkel capture.
5. **Idempotens (L)** — `WebhookEvent.id`, `providerRef @unique`, capture-kun-på-`PENDING→PAID`.
6. **Webhook-rute** (M) — signatur-verifisering, event-lagring, source-of-truth.
7. **Reconciliasjon (N)** — cron for `PENDING`-ordrer (GET STATUS/EVENT LOG).
8. **Modell-spesifikk:** Model A → 2-parter-koordinering + frist-cron + match-release (D4). Model B → refund-til-match.
9. **Credit-mekanism (J/D3)** — bounded `new_journey` (teller/grense + audit).
10. **Admin-betalings-vekt (P)** — se order/ref/status, manual refund, gi credit, reparer fast state.
11. **Copy** — juster `/vilkar`, `/priser`, `/betaling` til den avgjorte modellen (én setning, D5).
12. **Test (U)** — PAY-01–20 grønne.
13. **Slipp:** bytt `PAYMENTS_ENABLED`-oppstartsperren mot riktig logikk; Vipps sandbox → prod; `PAYMENTS_ENABLED=true`.

---

## W. Launch gates

**GATE 1 — Gratis-lansering (nå):**
- ✅ Free-kvote atomisk + testet (PAY-10).
- ✅ Public copy konsistent («5 000 gratis, deretter 349, Vipps, ingen abonnement»).
- ✅ `PAYMENTS_ENABLED=false` (låst; app kræsner om satt true).
- ✅ Prod health 200, CI/CD grønt (ACT C1).
→ **Klar til gratis-lansering i dag.**

**GATE 2 — Betalt-lansering (senere):**
- [ ] Vipps-nøkkel mottatt + adapter bygget/testet.
- [ ] PAY-01–20 grønne (minst: 01, 03, 04, 05, 06, 08, 09, 11, 12, 16).
- [ ] Legal (T) besvart — **spesielt §22 n** (hvis Model B) og credit-vs-refund (D3).
- [ ] `/vilkar` + `/priser` + `/betaling` copy = avgjort modell (én setning, D5).
- [ ] Admin-betalings-vekt på plass (se/refund/credit/repair).
- [ ] Reconciliasjon-cron kjører.
- [ ] `PAYMENTS_ENABLED`-perre erstattet med riktig logikk; sandbox→prod verifisert.
- [ ] Idempotens verifisert: **én reise → max én capture** (PAY-06).

---

## Endring til Lanse­rings­Check­list (kun rapport, IKKE endret)

Denne auditen berører følgende punkter i `docs/LanseringsCheckList.md` (endres IKKE før betalt-modell er godkjent):
- **Pris/betaling/349** — betalt-modell + «349 kr kjøper …» er **åpen produktbeslutning** (S: D1/D5).
- **Gratiskvote 5 000** — semantikk (personer vs reiser) åpen (S: D2).
- **Vilkår/angrerett/refusjon** — **LEGAL REVIEW REQUIRED** (T) før betaling aktiveres.
- **Vipps** — betaling **ikke implementert**; login **død kode**; `PAYMENTS_ENABLED` låst `false`.
- **Test** — PAY-01–20 (U) er det som må være grønt før betalt-lansering (GATE 2).









