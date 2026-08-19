# TOSOM — VIPPS INTEGRATION PLAN v1.0

**Dato:** 2026-08-19
**Commit:** `e7fe325`
**Grunnlag:** `TOSOM-MASTERPLAN-v9.0.md` Del IX
**Status:** 🔴 **KRITISK STI** — uten Vipps finnes ingen 5 000-bølge

**Merking:** **[GEORGE]** = kun du · **[AGENT]** = jeg · **[G+A]** = sammen

---

## 1. Hvorfor dette er kritisk sti

Vipps blir **eneste innlogging** for alle vanlige brukere. Magic link degraderes til beta-verktøy for ~50 testere.

Det betyr:

- Ingen Vipps → ingen brukere → ingen bølge
- Ingen Vipps → ingen betaling → ingen inntekt
- **Søknadsbehandling tar uker**

**Send søknaden før alt annet arbeid.** Alt annet kan gjøres parallelt mens du venter. Dette er den eneste oppgaven der ventetiden ikke kan komprimeres.

---

## 2. To separate Vipps-produkter

Dette forvirrer ofte, så det er verdt å være tydelig:

| Produkt | Hva | Når |
|---|---|---|
| **Vipps Logg inn** | OIDC/OAuth 2.0-innlogging med BankID-verifisert identitet | Fra første ekte bruker |
| **Vipps ePayment** | Betaling, 349 kr per reise | Fra bruker nr. 5 001 |

De søkes om hver for seg, men under samme merchant-avtale. **Søk om begge samtidig** — du trenger dem uansett, og det sparer en runde.

---

## 3. Nåtilstand i koden

### 3.1 Det som finnes

**To ruter:**
- `app/api/auth/vipps/authorize/route.ts` — bygger autorisasjons-URL. Leser `VIPPS_CLIENT_ID`, setter `client_id`, `redirect_uri`, `scope: 'openid profile email'`. **Strukturen er riktig.**
- `app/api/auth/vipps/callback/route.ts` — mottar callback.

**Korrekt skjult** bak `NEXT_PUBLIC_VIPPS_ENABLED` (S-2):
- `config/features.ts:26` — `enableVipps`
- `app/login/page.tsx:166,173,246` — knapp og informasjon vises kun når flagget er på
- Begge ruter har defense-in-depth-sjekk (`authorize:15`, `callback:52`)

**Databasemodeller finnes allerede:**
- `prisma/schema.prisma:657` — `model Order`
- `prisma/schema.prisma:683` — `model WebhookEvent`

Det er bedre enn forventet: grunnmuren for betaling er lagt.

### 3.2 Det som er ødelagt

`app/api/auth/vipps/callback/route.ts:229`:
```ts
await signIn('credentials', …)
```

CredentialsProvider er **fjernet** fra NextAuth-konfigurasjonen (`lib/auth/config.ts:7-8`, bevisst av sikkerhetsgrunner). Kallet kaster alltid.

**Dette er hele problemet.** Callback-en henter token og brukerinfo, men kan ikke opprette en sesjon.

---

## 4. Løsningen: Vipps som NextAuth-provider

Ikke lapp på callback-en. Bygg Vipps som en **fullverdig OAuth-provider** i NextAuth v5. Da håndterer rammeverket token-utveksling, tilstandsvalidering, nonce og sesjonsoppretting — og vi slipper å skrive sikkerhetskritisk kode selv.

### 4.1 Struktur **[AGENT]**

I `lib/auth/config.ts`, som en `OAuthConfig` med:
- `id: 'vipps'`, `type: 'oidc'`
- `issuer`: testmiljø `https://apitest.vipps.no/access-management-1.0/access` / produksjon `https://api.vipps.no/access-management-1.0/access`
- `wellKnown` for automatisk oppdagelse av endepunkter
- `clientId` / `clientSecret` fra miljø
- `authorization: { params: { scope: 'openid name phoneNumber email birthDate' } }`
- `profile()` som mapper Vipps-krav til vår `User`

**Viktig:** Vipps støtter OIDC discovery. Bruk `wellKnown` framfor å hardkode endepunkter — da følger vi automatisk endringer hos Vipps.

### 4.2 Scope og aldersgrense

| Scope | Hvorfor |
|---|---|
| `openid` | Påkrevd |
| `name` | Fornavn til profilen |
| `phoneNumber` | Unik identifikator |
| `email` | Varsler |
| **`birthDate`** | **Aldersgrense 23+ (invariant I-14)** |

`birthDate` fra Vipps er BankID-verifisert. Det gir en **reell** aldersgrense — ikke en avkrysningsboks. Det er en betydelig forbedring over dagens selvrapporterte alder.

Ikke be om mer enn dette. Dataminimering (GDPR art. 5) er både lovkrav og i tråd med Tosoms løfte.

### 4.3 Kontokobling

Vipps' `sub` (subject) er stabil per bruker per merchant. Lagre den på `User` som `vippsSub` med `@unique`.

Ved innlogging: finn bruker på `vippsSub`. Ved førstegangs innlogging: opprett bruker + `Profile` (samme mønster som `events.createUser` i dag gjør).

**Merk om beta:** hvis en testbruker først har logget inn med magic link og senere med Vipps, må e-postmatch kunne koble kontoene. Håndter dette bevisst, ellers får testerne to kontoer.

### 4.4 Rydding **[AGENT]**

Når provideren virker: slett `app/api/auth/vipps/authorize/route.ts` og `callback/route.ts`. NextAuth håndterer begge veier via `/api/auth/callback/vipps`. Å beholde død kode ved siden av fungerende kode er nettopp det M-7 ryddet opp i.

---

## 5. Betaling: 349 kr per reise

### 5.1 Modellen

| Bruker | Pris |
|---|---|
| Nr. 1–5 000 | **Gratis** — én 30-dagers reise |
| Nr. 5 001+ | **349 kr** per reise |
| Etter fullført reise | 349 kr for en ny |

Ingen abonnement. Ingen konto for alltid. **Betaling per reise.**

### 5.2 Gratis-kvoten **[AGENT]**

Ingen teller finnes i koden i dag. Må bygges:

1. Tabell eller teller for **tildelte gratis reiser** (ikke registrerte brukere — en bruker kan fullføre og komme tilbake)
2. Ved kø-innmelding: har brukeren ubrukt gratis reise? → i kø. Ellers → betaling.
3. Atomisk økning — **to samtidige registreringer skal ikke kunne gi reise 5 000 og 5 001 samtidig**. Bruk databasetransaksjon eller unik constraint.
4. Admin-visning av forbruk: «3 412 av 5 000 brukt»

Punkt 3 er lett å overse og gir vanskelige feil under en spike.

### 5.3 Betalingsflyt

```
Fullført onboarding
  └→ Har gratis reise? ──JA──→ KØ (QUEUED)
        │
        NEI
        └→ /betaling ──→ Vipps ePayment (349 kr)
              └→ webhook: capture bekreftet
                    └→ Order.status = paid
                          └→ KØ (QUEUED)
```

`app/betaling/` finnes som flate. `Order` og `WebhookEvent` finnes i schema. Det som mangler er selve Vipps-kallet og webhook-håndteringen.

**Kritisk: idempotens.** Vipps kan sende samme webhook flere ganger. `WebhookEvent` må lagre hendelses-ID og avvise duplikater — ellers får en bruker to reiser for én betaling, eller motsatt.

**Aldri** sett brukeren i kø før `capture` er bekreftet. Autorisasjon er ikke betaling.

### 5.4 `PAYMENTS_ENABLED`

`config/features.ts:29-38` **kaster ved oppstart** hvis satt til `true`, siden ingen betalingsvei finnes:

```ts
throw new Error('[FATAL] PAYMENTS_ENABLED=true, men ingen betalingsvei er implementert…')
```

Dette vernet er forbilledlig og skal **beholdes** til betalingen faktisk virker. Fjern det først når testkjøp er bekreftet ende-til-ende i testmiljø.

### 5.5 Refusjon

Hva om noen betaler og ikke får match? Køen kan i teorien la noen vente flere runder.

**Anbefaling:** Reisen starter ved match, ikke ved betaling. Får brukeren ikke match innen **tre runder (tre uker)**, tilbys full refusjon automatisk — uten at hun må spørre.

Det er ærlig, det er i tråd med tonen, og det er langt billigere enn en klage til Forbrukertilsynet. Vipps ePayment støtter refusjon via API.

---

## 6. Søknaden **[GEORGE]**

### 6.1 Dette trenger du

| Krav | Merknad |
|---|---|
| Organisasjonsnummer | Registrert foretak |
| BankID | Signering |
| Bankkonto | Utbetaling |
| Nettsted | tosom.no må være oppe med vilkår og personvern |
| Beskrivelse av tjenesten | Se under |
| Vilkår og personvernerklæring | ✅ `app/vilkar`, `app/personvern` finnes |

### 6.2 Om beskrivelsen

Vipps vurderer risiko og omdømme. Vær ærlig og presis:

> Tosom er en norsk relasjonsplattform for voksne over 23 år. Brukere fyller ut en profil og mottar én match per uke, etterfulgt av en veiledet 30-dagers periode. Betaling er en engangssum på 349 kr per reise — ikke abonnement. Vipps Logg inn brukes for aldersverifisering og trygg identitet.

Ikke bruk ordet «dating» hvis du kan unngå det — Tosom er ikke det, og noen kategorier utløser strengere vurdering.

**Nevn aldersverifisering.** At du bruker `birthDate` for å håndheve 23+ er et argument *for* deg.

### 6.3 Prosessen

| Steg | Eier | Tid |
|---|---|---|
| Send søknad, begge produkter | **[GEORGE]** | 1 dag |
| Vipps behandler | — | **1–4 uker** |
| Motta testnøkler | **[GEORGE]** | — |
| Implementer mot testmiljø | **[AGENT]** | 2–3 dager |
| Vipps godkjenner integrasjonen | — | dager–uker |
| Motta produksjonsnøkler | **[GEORGE]** | — |
| Sett i produksjon | **[G+A]** | 1 dag |

**Realistisk: 3–6 uker fra søknad til produksjon.** Det er hovedgrunnen til at lanseringsklarheten står på 62 %.

---

## 7. Miljøvariabler

```
# Vipps Logg inn
VIPPS_CLIENT_ID
VIPPS_CLIENT_SECRET
VIPPS_ISSUER                        # apitest.vipps.no eller api.vipps.no
NEXT_PUBLIC_VIPPS_ENABLED=false     # true når klar

# Vipps ePayment
VIPPS_MSN                           # merchant serial number
VIPPS_SUBSCRIPTION_KEY
VIPPS_WEBHOOK_SECRET

# Betaling
PAYMENTS_ENABLED=false              # kaster hvis true — se §5.4
JOURNEY_PRICE_NOK=349
FREE_JOURNEY_QUOTA=5000
```

Alle i Vercels miljøvariabler. Aldri i repo. Egne nøkler for test og produksjon.

---

## 8. Testing

### 8.1 Innlogging
- [ ] Ny bruker via Vipps → konto + `Profile` opprettes
- [ ] Eksisterende bruker → gjenkjennes på `vippsSub`
- [ ] Under 23 år → **avvises med rolig, tydelig melding**
- [ ] Avbrutt i Vipps → tilbake til `/login` uten feilmelding
- [ ] Beta: magic link fungerer fortsatt bak flagg
- [ ] Testbruker med både magic link og Vipps → **én konto, ikke to**

### 8.2 Betaling
- [ ] Bruker 1–5 000 → gratis, rett i kø
- [ ] Bruker 5 001 → sendes til betaling
- [ ] Fullført betaling → `Order.status = paid` → kø
- [ ] Avbrutt betaling → **ikke** i kø, ingen belastning
- [ ] **Duplisert webhook → kun én reise tildelt**
- [ ] Refusjon etter tre runder uten match
- [ ] Kvittering på e-post

### 8.3 Kvote
- [ ] Teller øker atomisk
- [ ] **To samtidige registreringer på nr. 5 000 → kun én får gratis**
- [ ] Admin ser forbruk
- [ ] Nr. 5 001 får riktig melding

Testen «duplisert webhook» og «to samtidige på nr. 5 000» er de to som avdekker de dyre feilene.

---

## 9. Språk

Følg språkmanualen. Betaling skal føles rolig, ikke som et salg.

**Ved gratis reise:**
> Du er blant de første 5 000. Din første reise er vår gave.

**Ved betaling:**
> En reise koster 349 kroner. Det dekker 30 dager med veiledning for dere begge.
>
> Du betaler for én reise. Ikke abonnement, ingen binding.

**Ved avbrutt betaling:**
> Betalingen ble ikke fullført. Du kan prøve igjen når du vil.

**Ved refusjon:**
> Du fikk ikke en match vi mente var god nok. Pengene er på vei tilbake.

**Forbudt:** nedtelling · «kun X plasser igjen» · rabatt som utløper · «andre har allerede…» · utropstegn.

Brukerne som passer Tosom er nettopp de som gjennomskuer slikt. Mørke mønstre ville ikke bare være galt — de ville ikke virke.

---

## 10. Rekkefølge

| # | Oppgave | Eier | Blokkerer |
|---|---|---|---|
| 1 | **Send Vipps-søknad, begge produkter** | **[GEORGE]** | Alt |
| 2 | (Parallelt) hosting-migrering | [G+A] | — |
| 3 | (Parallelt) gratis-kvote-teller | [AGENT] | — |
| 4 | (Parallelt) beta med magic link, 50 testere | [G+A] | — |
| 5 | Vipps Logg inn mot testmiljø | [AGENT] | Krever testnøkler |
| 6 | Aldersgrense via `birthDate` | [AGENT] | 5 |
| 7 | Slett de to gamle Vipps-rutene | [AGENT] | 5 |
| 8 | Vipps ePayment mot testmiljø | [AGENT] | Krever testnøkler |
| 9 | Webhook med idempotens | [AGENT] | 8 |
| 10 | Refusjonsflyt | [AGENT] | 8 |
| 11 | Godkjenning fra Vipps | [GEORGE] | 5–10 |
| 12 | Produksjonsnøkler + `NEXT_PUBLIC_VIPPS_ENABLED=true` | [GEORGE] | 11 |
| 13 | `PAYMENTS_ENABLED=true` — fjern vernet | [G+A] | 12 |

Punkt 2–4 er hele poenget: **betaen kan gjennomføres med magic link mens du venter på Vipps.** Ventetiden er ikke tapt tid.

---

## 11. Risiko

| Risiko | Håndtering |
|---|---|
| **Søknad avslått** | Ha en plan B: magic link + Stripe. Mindre norsk, men fungerer. Ikke bygg den før du må. |
| Behandling tar lengre enn 4 uker | Beta kjører uansett med magic link |
| Vipps krever endringer | Bygg mot testmiljø tidlig |
| Duplisert webhook gir dobbel reise | Idempotens fra dag én |
| Kvoteteller feiler under spike | Atomisk transaksjon |
| Bruker betaler, får ikke match | Automatisk refusjon etter tre runder |

**Den største risikoen er tid, ikke teknikk.** Derfor: send søknaden i dag.

---

## 12. Sluttord

Vipps gir Tosom tre ting utover innlogging:

**BankID-verifisert identitet.** Ekte mennesker, ikke engangs-e-poster. For et produkt der to fremmede skal snakke fortrolig i 30 dager, er det et betydelig trygghetsløft — særlig for kvinner.

**Reell aldersgrense.** `birthDate` fra BankID gjør 23+ til et faktum framfor en avkrysningsboks.

**Norsk betaling nordmenn stoler på.** 349 kr i Vipps er én bekreftelse. Kortskjema er friksjon og mistenksomhet.

Det fjerner også det største spike-problemet: ingen e-postutsendelse i skala.

Send søknaden først. Alt annet kan vente på den, men den kan ikke vente på noe.