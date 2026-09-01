# ToSom — Behandleravtaler (DPA)

**Dato:** 2026-09-01
**Status:** Internt dokument til underskrift/follow-up. Må godkjennes av jurist før lansering.
**Koble til:** `docs/JURIDISK-GRUNNLAG-v1.0.md` (datamapping) og `docs/legal/DPIA.md` (konsekvensvurdering).

> ⚠️ **Viktig:** ToSom inngår aldri én stor DPA. GDPR art. 28 krever en behandleravtale **per behandler**. De fleste av våre behandlere har egne standardavtaler som vi signerer i deres dashboard. Dette dokumentet er (a) en oversikt over hvilke behandlere vi har, (b) hvilken DPA som gjelder for hver, og (c) et mal for de tilfellene hvor behandleren ikke tilbyr egen DPA.

---

## 1. Behandlere (verifisert mot koden, 2026-09-01)

| Behandler | Tjeneste | Hvilke persondata | Region | DPA-status |
|---|---|---|---|---|
| **Vercel** (Vercel Inc.) | Hosting, Next.js-runtime, CDN, logs | E-post, navn, sesjonscookies, IP i logs, feillogs | US (default IAD) — ⚠️ verifiser region | Vercel DPA — signeres i dashboard (EU DPA tilgjengelig) |
| **Neon** (Neon Technologies) | Postgres-database | **Alle** databasdata: profiler, chat, journey, matcher | **eu-central-1 (Frankfurt)** | Neon DPA — signeres i dashboard |
| **Cloudflare** | R2-lagring (chat-bilder), CDN, WAF, SSL | Chat-bilder (binære), IP i access-logs | R2: **eu-central-1** | Cloudflare DPA — signeres i dashboard |
| **Pusher** | Realtid (WebSocket) til chat | Meldingsinnhold i transit, bruker-ID, kanal-ID | US (AWS us-east-1) | Pusher DPA — signeres i dashboard |
| **Resend** (Resend Inc.) | Transaksjonell e-post (match-varsel, passord-reset, alerte) | E-postadresse, epost-emne/innhold i transit | US | Resend DPA — signeres i dashboard |
| **UploadThing** | Mellomledd for bildeopplastning | Bildefiler i transit, filstørrelse/mime-type | US | UploadThing DPA — signeres i dashboard |
| **Sentry** (Sentry Inc.) | Feilmonitorering | Stack traces, URL, browser-info — **uten PII** (satt opp i `instrumentation.ts` med `redact`-regler) | US | Sentry DPA — signeres i dashboard (kun når SENTRY_DSN settes) |
| **Stripe / Vipps** | Betaling (framtidig, ikke aktiv) | Betalingsdata — håndteres av betalingspartner, ToSom lagrer ikke kortdata | — | Ikke relevant før lansering med betaling |

**Oppsummering av databehandler-ansvar for ToSom:**

- **Kontrollør:** ToSom (George Høglend, t.b. organisasjonsnummer) — bestemmelsesstiller for alle persondata.
- **Subbehendlere:** Alle ovenforstående handler på ToSoms vegne (art. 28.2).
- **Subsubbehendere:** F.eks. AWS bak Pusher/Neon. Behandleravtalene dekker subbehendere i tråd med art. 28.4.

---

## 2. Sjekkliste før lansering

- [ ] Signere Vercel DPA (dashboard → Legal)
- [ ] Signere Neon DPA (dashboard → Compliance)
- [ ] Signere Cloudflare DPA (dashboard → Legal)
- [ ] Signere Pusher DPA (dashboard → Legal)
- [ ] Signere Resend DPA (dashboard → Legal)
- [ ] Signere UploadThing DPA (dashboard → Legal)
- [ ] (Når Sentry aktiveres) Signere Sentry DPA
- [ ] Verifisere Vercel-funksjonsregion og eventuelt flytte til EU-region
- [ ] Gi advokat dette dokumentet + `JURIDISK-GRUNNLAG` + `DPIA` til gjennomgang

---

## 3. DPA-mal (GDPR art. 28.3)

*Brukes kun hvis en behandler ikke tilbyr egen standard-DPA. For behandlere med egen DPA: signer deres, ikke denne.*

### Behandleravtale mellom ToSom («Bestiller») og [BEHANDLERNAVN] («Behandler»)

**1. Gjenstand og varighet**
Behandler behandler persondata kun på vegne av Bestiller, i henhold til Bestillers dokumenterte instruksjoner (inkludert `docs/JURIDISK-GRUNNLAG-v1.0.md` som beskrivelse av behandlingene). Avtalen gjelder fra [DATO] og så lenge tjenesten leveres.

**2. Hemmelighet**
Behandler sikrer at personer med tilgang til dataene har forpliktet seg til hemmelighet eller lovbestemt taushetsplikt (art. 28.3a).

**3. Sikkerhet (art. 28.3b / art. 32)**
Behandler implementerer egnede tekniske og organisatoriske tiltak: kryptering i transit (TLS 1.2+) og i hvile, tilgangsstyring, logging av inngrep, og prosedyrer for persondatainkident.

**4. Subbehendere (art. 28.3c–e)**
Behandler må ha Bestillers forhåndsskriftlige tillatelse for å engasjere subbehendere. Bestiller gir generell tillatelse til subbehendere listet i vedlegg 1. Endringer kreves 30 dagers varsel.

**5. Rettigheter for databesittere (art. 28.3f)**
Behandler bistår Bestiller i å svare på henvendelser om rettighetene til tilgang, retting, sletting, begrenset behandling og dataportabilitet innen fristen i art. 12 (1 måned).

**6. Sletting/returnering (art. 28.3g)**
Ved opphør av tjenesten sletter eller returnerer Behandler alle persondata innen 30 dager, med mindre EU-norsk lov krever lagring.

**7. Kontroll og audit (art. 28.3h–i)**
Bestiller har rett til å kreve informasjon om overholdelse, inkludert audit, med rimelig varsel.

**8. Databesitterens plikter**
Bestiller er ansvarlig for å verifisere at behandlingene har rettsgrunnlag (art. 6/9), gi informasjonspliktene i art. 13/14, og dokumentere behandlingen i register (art. 30).

**9. Personvernansvarlig**
Bestiller har ikke personvernansvarlig (bedrift under 250 ansatte, behandling er ikke systematisk). Henvendelser rettes til eier: support@tosom.no.

**Underskrifter**

| ToSom (Bestiller) | [Behandler] (Behandler) |
|---|---|
| Navn: George Høglend | Navn: ____________ |
| Stilling: Eier | Stilling: ____________ |
| Dato: ____________ | Dato: ____________ |
| Signatur: ____________ | Signatur: ____________ |
