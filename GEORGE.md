# GEORGE.md — ToSom i åpen beta: deploy-guide og daglig oversikt

For George. Alt du skal gjere manuelt står her. Alt anna er allerede i koden.
*Oppretta 24.08.2026. Koden vinn alltid — finnar du avvik, noter det her.*

---

## 0. Status i dag

- **Åpen beta er slik det fungerer allerede.** Én dør: `/login` — e-post og passord, kontoen opprettes automatisk. Ingen invitasjoner, ingen koder, ingen e-postverifisering. (Dette er BETA-TEST §3.)
- **Denne deployen inneholder:**
  - Fikset kvotetall i admin-panelet: viser nå `0 / 5 000` (ikke hardkodet `10 000`), terskler 80 %/95 % av det reelle taket.
  - Journey-cron kjører **timevis** i stedet for én gang per dag, med `JOURNEY_BATCH_SIZE` (300 på Vercel = kapasitet for ~7 200 samtidige reiser i stedet for ~100).
  - Ny indikator i panelet: **«Reiser som venter på fremrykk»** + auto-varsel til e-post når køen heng.
- **Ingen endringer i produktet sjølvt** — same reise, same matcher, same kvote.

---

## 1. Gjør dette, i denne rekkefølgen

### Steg 1 — Koden er pusket (agenten har gjort dette)
- [ ] Verifiser at `origin/main` er oppdatert: `git fetch && git --no-pager log --oneline origin/main -3`

### Steg 2 — Neon-database (Frankfurt)
- [ ] Lag prosjekt på [neon.tech](https://neon.tech) i region **eu-central (Frankfurt)**
- [ ] Kopier **pooled**-URL-en (den med `pooler`, port 5432) → dette blir `DATABASE_URL`
- [ ] Kjør migrasjoner mot databasen:
  ```bash
  DATABASE_URL="..." npx prisma migrate deploy
  ```
  (23 migrasjoner. Skal kjøre uten feil.)

  > **AVVIK notert 25.08:** `DATABASE_URL` i `.env.prod` peikar på ein `db.prisma.io`-DB,
  > ikke ein Neon-Frankfurt-DB. Det var den `db.prisma.io`-DB-en som mangla
  > `add_onboarding_draft` + `free_quota_counter` (årsak til 500 i onboarding-lagring) —
  > no deploya og verifisert. **Før neste migrasjon: verifiser at Vercel sin
  > `DATABASE_URL` er den same DB-en du kjører `migrate deploy` mot.**

### Steg 3 — Cloudflare R2 (bilde-lagring)
- [ ] Lag R2-bucket **tosom-images** (EU, t.d. eu-central-1)
- [ ] Lag API-token med «Object Read/Write» på bucketen
- [ ] Noter: `R2_ACCOUNT_ID` (Cloudflare → Overview), access key id/secret frå tokenet

> **Kvifor R2?** Utan R2-nøkler fell bilde-lagringa til lokal fil — på Vercel forsvinner dei då ved kvar ny deploy. Reisa er 30 dagar og bilder delast frå dag 15, så R2 er ett krav, ikke ett val.

### Steg 4 — Pusher (realtime-chat)
- [ ] Verifiser at Pusher-appen ligg i **EU-cluster** (`eu`)
- [ ] Noter: app id, key, secret, cluster

### Steg 5 — Resend (e-post)
- [ ] Resend API-nøkkel (`re_...`)
- [ ] Domenet `tosom.no` må være verifisert i Resend (DNS)
- [ ] Avsender: **noreplay@tosom.no**

### Steg 6 — E-post-videresending (10 minutt)
- [ ] `support@tosom.no` → videresend til din private e-post (alle tilbakemeldingar landar her)
- [ ] `noreplay@tosom.no` → autosvar («Tosom er i åpen test. Takknemleg for tilbakemelding!»)

### Steg 7 — Vercel
- [ ] Vercel → **Add New Project** → import `GeorgeMasterSplinter/tosom` (Next.js, standard)
- [ ] Set miljøvariablane i seksjon 2 (Production)
- [ ] Knytt domenet `tosom.no` (Vercel → Domains → DNS-instruksar)
- [ ] Deploy (automatisk ved push, eller knapp)

### Steg 8 — Verifiser (sju kontrollpunkt)
1. [ ] Open `tosom.no` → landingsida lastar (ikke `/maintenance`)
2. [ ] `/login` → ny e-post + passord → havnar i onboarding (auto-registreringa fungerer)
3. [ ] `/admin/login` → panelet åpner; kvoten viser **`0 / 5 000`**
4. [ ] Vercel → **Cron** → to jobbar: `journey` (timevis) og `matching` (lørdag 02:00, 03:00 og 04:00 — tre kjøringer)
5. [ ] Vercel → Logs: ingen 5xx ved testane over
6. [ ] Lag **partall** testbrukere (min. 2), fullfør onboarding, still dei i kø, så: `/admin/tools` → «Kjør matching manuelt» → paret får match
7. [ ] E-post: driftsvarslet til `ALERT_EMAIL_TO` kommer fram

### Steg 9 — Slipp inn testere
- [ ] Først **10**, ikke 50 (DRIFTSPLAN: éi uke observasjon før utviding)
- [ ] Deretter opp mot **50** — taket ditt er mjukt: du bare fortel 50 menneskje
- [ ] Min. 2 i kø per runde; **partall** gir beste dekningsgrad

---

## 2. Miljøvariablar i Vercel (Production)

### Kravde
| Variabel | Verdi |
|---|---|
| `DATABASE_URL` | Neon **pooled**-URL |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://tosom.no` |
| `CRON_SECRET` | `openssl rand -base64 32` |
| `ADMIN_EMAIL` | din e-post |
| `ADMIN_PASSWORD_HASH` | scrypt-hash av passordet — generer: `node scripts/generate-admin-hash.mjs "<passord>"` |
| `ADMIN_JWT_SECRET` | `openssl rand -base64 32` |
| `EMAIL_SERVER_HOST` | `smtp.resend.com` |
| `EMAIL_SERVER_PORT` | `587` |
| `EMAIL_SERVER_USER` | `resend` |
| `EMAIL_SERVER_PASSWORD` | `re_...` |
| `EMAIL_FROM` | `noreplay@tosom.no` |
| `ALERT_EMAIL_TO` | din e-post (driftsvarsler) |
| `PUSHER_APP_ID` / `PUSHER_KEY` / `PUSHER_SECRET` / `PUSHER_CLUSTER` | frå Pusher (`eu`) |
| `NEXT_PUBLIC_PUSHER_KEY` / `NEXT_PUBLIC_PUSHER_CLUSTER` | same key/cluster |
| `STORAGE_DRIVER` | `r2` |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET` / `R2_REGION` | frå steg 3 (`tosom-images`) |
| `BETA_INVITE_MODE` | `false` |
| `JOURNEY_BATCH_SIZE` | `300` |

### Eksplisitt av
| Variabel | Verdi | Kvifor |
|---|---|---|
| `MAINTENANCE_MODE` | (ikke sett / `false`) | Onns → alt redirectar til `/maintenance`. Det er nødbremsa di. |
| `DEV_LOGIN_ENABLED` | `false` | Må aldri være på i produksjon. |
| `PAYMENTS_ENABLED` | `false` | `true` gir **fatal feil ved oppstart** (A15) før Vipps er bygd. |
| `BETA_MATCH_EMAIL` | (ikke sett) | Av i den **første** matcherunden — så vi mår kor mange som oppdager matchen sjølv (I-4-data). Set `true` etter første runde. |

### Valfritt (anbefalt)
| Variabel | Verdi | Kvifor |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | frå Upstash | Distribuert rate-limiting (uten: in-memory per instance — riker for 50 brukere) |
| `NEXT_PUBLIC_SENTRY_DSN` | frå Sentry | Feilovervakjing |
| `LOG_LEVEL` | `info` | |

**Ikkje sett:** `MATCHING_ENABLED` — standard er `true` (matchinga kjører).

---

## 3. Kill switches (kjører uten ny kode — krev bare redeploy av Vercel)

| Variabel | Effekt |
|---|---|
| `MAINTENANCE_MODE=true` | **Nødbrems:** heile appen → `/maintenance`. Bruk ved rødt. |
| `MATCHING_ENABLED=false` | Stanser matcherundene (køen står, ingen nye par). |
| `BETA_MATCH_EMAIL=true` | Slår på match-e-post (etter den første runden). |
| `REGISTRATION_ENABLED=false` | Lukkar registreringen (kapasitetsbrems). |

Endring: Vercel → Settings → Environment Variables → endre → **Redeploy**.

---

## 4. Kvoten — tala du skal kjenne

- **Taket: 5 000 gratis reiser** — `PRICING.freeUserCap` i `config/legal.ts`. Samme tal vilkåra lover. Én kilde.
- **Korleis forbruk:** kvar tester som stiller seg i kø får én gratisordre. 50 testere ≈ **50 av 5 000** (1 %).
- **Lykkelige par gir 2 tilbake:** når ett par slutter reisa, sletter systemet ordena — plassane kommer tilbake i potten.
- **Panelet:** grønt < 4 000 · gult 4 000–4 750 · raudt > 4 750.
- **Ved taket:** ny bruker får «Gratiskvoten er oppbrukt. Betaling kreves» — skjer ikke med 50 testere.
- **Skal taket opp senere:** én linje i `config/legal.ts` (vilkåra følgjer automatisk).
- **Grensa er race-fri (F2-2):** kvoteplassen blir tatt med én atomisk database-operasjon (`Quota.free_users`) — to samtidige onboardingar ved taket kan ikke begge slippe gjennom. Panelet les fortsatt Order-tellingen (audit-loggen); telleren synkroniseres ved kvar claim.

---

## 5. Kapasitet — kva som holder, og når du skal bli uroleg

| Komponent | Kapasitet i dag | Risiko med 50 testere |
|---|---|---|
| Journey-cron (timevis × 300) | ~7 200 samtidige reiser | Ingen (50 testere = ~25 reiser) |
| Matcherunde (lørdag 02–04, 3×50 s budsjett, maks 5 000 i kø) | 5 000 kandidater i ~11 s (målt, F2-1) | Ingen — ~4× budsjett i én runde, pluss to fleire |
| API / DB / R2 / Pusher | Skalierer | Ingen |

**Kvar du ser varsla først:**
- **«Reiser som venter på fremrykk»** i panelet: `0` = alt fint · `>0` = selvkorrigerer seg innen én time (bekreft at det blir 0 igjen) · `≥100` = raudt — cronen kjører ikke (sjekk Vercel → Cron + Logs). Du får òg e-post-varsel.
- **Runde-varigheit:** grønt < 30 s · gult 30–50 s · raudt > 50 s. Med 50 testere skal det være under 5 s.
- **`rejectReasons`** (rundesloggen): `kjonn` og `alder` er **nye** kategoriar (WP1). Hoge tal = filterbug, ikke «vanlege avvisningar».

---

## 6. Dagleg oversikt (0–5 minutt)

1. `/admin/login` → alt grønt? Ferdig.
2. **Lørdag formiddag:** kom matcherunden? (Siste matcherunde + runde-varigheit + kø = 0?)
3. **support@:** alt svara? (videresendt til deg)
4. Noko **raudt**? → §7.

## 7. Kvifor du gjer noko når noko er raudt

1. **Nødbrems** dersom brukerne er påvirket: `MAINTENANCE_MODE=true` → redeploy.
2. **Diagnose:** Vercel Logs · Sentry · `/admin/logs` (Systemlogg) · `/admin/system/status`.
3. **Retting:** alltid i repoet → ny deploy. **Aldri** rett direkte i produksjons-DBen.
4. **Aldri** juster terskler under beta (DI-2) — talet er data til tuning, ikke ei hending.

---

## 8. Etter betaen — før lansering (fase 2, lokal jobb)

Rekkefølge (saman med `ACT-STATE.gjenstaarFoerLansering`):
1. ✅ **Matcherunden skalering (F2-1, 17.08):** prekalkulerte dealbreakers (O(n) i stedet for O(n²) normalisering), 4,7× raskare filter, 5 000 kandidater i ~11 s, laurdagstidasvindauget utvida til 02–04 (S3). Ekvivalens-testar låser semantikken.
2. **Vipps Login + Betaling** (349 kr) — då erstattast e-post+passord, og kvoten får sin betalings-tilbakefall.
3. **DPA + DPIA** (HOSTING-plan §6) — juridisk før kampanje.
4. ✅ **Geo-koordinatar 100 %** (ferdig 10.08 — `postalCodes.json` har 5 146/5 146 med koordinatar).
5. **Kostnadar/planar:** Vercel Pro/Fluid, Pusher/Resend betalte tier, R2-lagring.
6. ✅ **Atomisk kvote-teller (F2-2, 17.08):** `Quota.free_users` med betinga `UPDATE ... SET used = used+1 WHERE used < cap` — grenseplassen kan ikke bli tatt to gonger.

Med fase 2 på plass holder arkitekturen 100 000 brukere over eitt år med margin — dei to cron-takene var dei eneste flaskehalsene, og begge har kjende fixar.

---

## 9. Ikke gjør dette

- Set aldri `PAYMENTS_ENABLED=true` før Vipps er på plass (kjører ned appen ved oppstart).
- Rør aldri produksjons-DBen direkte.
- Juster ikke terskler under beta.
- Åpne ikke for hundrevis av brukere før fase 2 punkt 1 er gjort.
- `DEV_LOGIN_ENABLED` — aldri `true` i produksjon.
