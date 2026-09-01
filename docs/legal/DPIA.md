# ToSom — Datavernkonsekvensvurdering (DPIA)

**Dato:** 2026-09-01
**Versjon:** 1.0
**Status:** Ferdig utfylt av eier — trenger advokatsignatur før lansering.
**Rettsgrunnlag:** GDPR art. 35 (DPIA påkrevd ved stor risiko, særlige kategorier art. 9, systematisk profilering)
**Koble til:** `docs/JURIDISK-GRUNNLAG-v1.0.md`, `docs/legal/DPA.md`

> **Hvorfor ToSom trenger DPIA:** ToSom behandler særlige kategorier persondata (livssituasjon, personlighet, relasjonsdata) og bruker dem for matching/profilering — dette utløser art. 35.1(b) og (c). Vurderingen er utfylt fra faktisk kodelagring (Prisma-schema, verifisert 2026-09-01).

---

## 1. Behandlingens beskrivelse

### 1.1 Formål
ToSom er et guidet 30-dagers reise- og matching-produkt for enslige 21+. Målet er å redusere ensomhet gjennom strukturert self-work og trygg matching med én person av gangen.

### 1.2 Behandlinger (per GDPR art. 13)

| Behandling | Rettsgrunnlag | Data |
|---|---|---|
| Registrering og identitet | Art. 6(1)(b) — avtaleinngåelse | E-post, navn, alder, telefon (valgfritt) |
| Onboarding og psykometrisk profil | Art. 6(1)(a) samtykke | Svar om livssituasjon, livsstil, personlighetstest, relasjonshistorikk |
| Guidet 30-dagers reise | Art. 6(1)(b) | Daglig progresjon, svar, refleksjonsnotater |
| Matching med én person | Art. 6(1)(f) berettiget interesse (produktkjerne) | Profillag, preferanser, postnummer |
| Privat chat mellom matchet par | Art. 6(1)(b) | Meldingsinnhold, bilder |
| Transaksjonell e-post | Art. 6(1)(f) | E-postadresse, emne |
| Feilmonitorering | Art. 6(1)(f) | Stack traces (uten PII) |
| Driftslogging | Art. 6(1)(f) | IP, tidsstempel, hendelsestype |

### 1.3 Særlige kategorier (art. 9)

ToSom spør i onboarding om:
- **Livssituasjon** (barn, alenestående, separasjon)
- **Personlighet og psykisk helse** (psykometriske skalaer)
- **Relasjonshistorikk** (eks, død av ektefelle, traumer)
- **Religion / etnisitet** (hvis spurt)

**Samtykke:** Brukeren gir eksplisitt samtykke i onboarding før disse dataene behandles. Samtykket kan trekkes tilbake når som helst, og all data slettes via `settings/delete-account` (art. 17).

### 1.4 Mottakere og tredjepart

| Mottaker | Hva | Rettsgrunnlag for deling |
|---|---|---|
| Matchet person | Profil (utvalgte felter), chat-meldinger | 6(1)(a) samtykke ved matching |
| Vercel, Neon, Cloudflare, Pusher, Resend, UploadThing, Sentry | Hosting, DB, lagring, realtid, e-post, feillogging | 6(1)(f) + DPA (art. 28) |
| Datatilsynet | Ved pålegget/anke | 6(1)(c) |

---

## 2. Nødvendighet og proporsjonalitet

| Spørsmål | Vurdering |
|---|---|
| Er behandlingen nødvendig for formålet? | **Ja.** Psykometrisk profil er kjernen i matching-algoritmen. Uten den kan ToSom ikke levere det lovnede produktet. |
| Minst inngripende alternativ? | **Ja.** ToSom spør kun om det som er nødvendig for matching og reisen. Ingen tredjepart-markedsføring, ingen annonsesporing. |
| Risiko proporsjonal med nytte? | **Ja.** Nytten (reduksjon av ensomhet, trygg matching) er stor; risikoen er håndterbar med tiltakene i seksjon 4. |

**Konklusjon:** Behandlingen er nødvendig og proporsjonal.

---

## 3. Risikovurdering

Skala: **Sannsynlighet × Konsekvens** (Lav/Middels/Høy)

| # | Trussel | Sannsyn | Konsekvens | Risiko |
|---|---|---|---|---|
| R1 | DB-datastjele / utsettelse | Lav | Høy | **Middels** |
| R2 | Uautorisert admin-tilgang | Lav | Høy | **Middels** |
| R3 | Chat-innhold lekes (Pusher/DB) | Lav | Høy | **Middels** |
| R4 | Profiler brukes urettmessig (profilsalg) | Lav | Høy | **Middels** |
| R5 | E-postlekkasje / phishing | Middels | Middels | **Middels** |
| R6 | Bildelekkasje (R2 presigned URL) | Lav | Middels | **Lav** |
| R7 | CSRF / XSS-angrep | Middels | Middels | **Middels** |
| R8 | Behandler (tredjepart) leker data / US-overføring | Lav | Høy | **Middels** |
| R9 | Inkident oppdages for sent | Middels | Middels | **Middels** |
| R10 | Uønsket match / feilmatch | Høy | Lav | **Middels** |

---

## 4. Tiltak per risiko

### R1 — DB-datastjele
TLS 1.2+ i transit (Cloudflare + Neon) · AES-256 i hvile (Neon, R2) · DB-credentials kun i Vercel env vars (aldri i kode) · backup `scripts/db-backup.sh` (pg_dump, 30 dagers retensjon). **Residual: Lav**

### R2 — Uautorisert admin-tilgang
HMAC-signert JWT med 15 minutt utløp (ikke session-cookie) · `adminAuthGuard` på alle admin-ruter · `AuditLog` for alle admin-handlinger · Postgres-basert rate limiting på alle API-ruter. **Residual: Lav**

### R3 — Chat-innhold lekes
Kun de to brukere i en `Conversation` kan lese meldingene (Prisma-relasjon) · Pusher-kanal krever server-side verifisering · chat-bilder i R2 med presigned URL, 15 min TTL (`IMAGE_URL_TTL_SECONDS`). **Residual: Lav**

### R4 — Profiler brukes urettmessig
ToSom selger aldri persondata eller profiler (står i personvern-policy og vilkår) · ingen API-utstillingspunkt for profildata til tredjepart · all profilering dokumentert i `JURIDISK-GRUNNLAG`. **Residual: Lav**

### R5 — E-postlekkasje
⚠️ **SPF/DKIM mangler ennå** (Resend-domenet er ikke verifisert — se DPA-sjekkliste) · kun e-postadresse + emne sendes til Resend · `ALERT_EMAIL_TO` sikrer at driftsalere kommer til eier. **Residual: Middels** (inntil SPF/DKIM er på plass)

### R6 — Bildelekkasje (R2)
Presigned URL med 15 min TTL · R2-bucket er privat (ingen public URL). **Residual: Lav**

### R7 — CSRF / XSS
`lib/auth/csrf.ts` — token-basert CSRF-vern på alle kritiske skrive-ruter (aktiveres med `ENABLE_CSRF_PROTECTION=true`) · React auto-escapes · Zod-validering på alle API-innganger · CSP i `next.config` · NextAuth-cookies `SameSite=Lax`. **Residual: Lav** (når flagget aktiveres)

### R8 — Behandler-lekkasje / US-overføring
Alle behandlere under DPA (art. 28) — se `DPA.md` · **DB og bilder ligger i EU (eu-central-1)** ⚠️ Vercel-funksjoner, Pusher, Resend, UploadThing og Sentry ligger i **US**. Tiltak: verifisere at hver US-behandler har signert Standard Contractual Clauses (SCC); vurdere EU-alternativer for Pusher (f.eks. Ably) dersom SCC-verifisering mislykkes. **Residual: Middels** (inntil SCC er verifisert)

### R9 — Inkident oppdages for sent
Sentry (aktiveres med `SENTRY_DSN`, PII redigert i `instrumentation.ts`) · `SystemLog` i DB · `sendAlert()` e-posterer eier ved kritiske hendelser · uptime-monitor på `/api/system/health` (5 min intervall) · prosedyre i `SECURITY-STABILITY-PLAN-v2.0.md`. **Residual: Lav** (når Sentry + uptime er aktivert)

### R10 — Uønsket match
Bruker kan avvise match, blokkere person (`UserBlock`) og rapportere misbruk (`Report`) · admin-panelet har rapport-innbox og ban-aksjon. **Residual: Lav**

---

## 5. Oppsummert residual risiko

| Risiko | Før tiltak | Etter tiltak |
|---|---|---|
| R1 | Middels | **Lav** |
| R2 | Middels | **Lav** |
| R3 | Middels | **Lav** |
| R4 | Middels | **Lav** |
| R5 | Middels | **Middels** (mangler SPF/DKIM) |
| R6 | Lav | **Lav** |
| R7 | Middels | **Lav** (mangler CSRF-aktivering) |
| R8 | Middels | **Middels** (mangler SCC-verifisering) |
| R9 | Middels | **Lav** (mangler Sentry + uptime) |
| R10 | Middels | **Lav** |

**Samlet residual risiko: LAV–MIDDELS** — akseptabel for lansering, forutsatt at de fire åpne punktene (R5, R7, R8, R9) lukkes.

---

## 6. Konsultasjon med Datatilsynet (art. 35.2)

ToSom har færre enn 250 ansatte og behandler ikke data på systematisk, storskala måte i beta-fasen. Konsultasjon er ikke påkrevd, men **anbefales før lansering med betaling**.

---

## 7. Databesitterens rettigheter

| Rettighet | Implementert? | Hvordan |
|---|---|---|
| Tilgang (art. 15) | ✅ | `settings/export` — JSON-eksport av alle data |
| Retting (art. 16) | ✅ | `profile/setup` (onboarding) |
| Sletting (art. 17) | ✅ | `settings/delete-account` — full sletting |
| Begrenset behandling (art. 18) | ❌ | Ikke implementert (henvendelse → manuell prosess) |
| Dataportabilitet (art. 20) | ✅ | `settings/export` — JSON |
| Innvending (art. 21) | ⚠️ | Delvis: blokkering av match, ingen generell innvending |

**Tiltak:** Implementere «begrenset behandling» som flagg i User-modellen (lav prioritet i beta).

---

## 8. Konklusjon og signatur

Datavernkonsekvensvurderingen viser at ToSoms behandling av persondata er **nødvendig, proporsjonal og tilstrekkelig sikret** for beta-lansering. Fire åpne punkter (SPF/DKIM, CSRF-aktivering, SCC-verifisering, Sentry/uptime) må lukkes før lansering.

**Vurdering:** 🟢 **Klar for lansering** etter at de fire punktene er utført.

| Rolle | Navn | Dato | Signatur |
|---|---|---|---|
| Eier (kontrollør) | George Høglend | ______ | ______ |
| Advokat | ____________ | ______ | ______ |