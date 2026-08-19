# TOSOM — SECURITY & STABILITY PLAN v2.0

**Dato:** 2026-08-19
**Commit:** `bc1ef13`
**Erstatter:** `SECURITY-STABILITY-PLAN-v1.md`
**Grunnlag:** `TOSOM-PLATTFORMDIAGNOSE-v2.0.md`

---

## 1. Trusselbilde

Tosom håndterer noe av det mest sensitive som finnes i en database: menneskers tilknytningsmønstre, grenser, sårbarhet, intimitetsønsker og trygghetsprofil. En lekkasje her er ikke et personvernbrudd i abstrakt forstand — det er en dyp krenkelse av mennesker som stolte på oss.

Dette styrer prioriteringene under.

| Aktiva | Sensitivitet | Kilde |
|---|---|---|
| `DeepProfile` — tilknytning, grenser, intimitet | **Ekstrem** | Onboarding steg 1–11 |
| Samtaleinnhold i reisen | **Ekstrem** | `Message` |
| Postnummer + avstand | Høy | Onboarding steg 0 |
| Resonansscore og nedbrytning | Høy | `Match` |
| E-post, telefon | Middels | `User` |

---

## 2. Autentisering

### 2.1 Nåtilstand

| Element | Status | Referanse |
|---|---|---|
| EmailProvider (magic link) | **Sender ikke e-post** | `lib/auth/config.ts:32-37` |
| CredentialsProvider | Fjernet (bevisst) | `config.ts:7-8` |
| Vipps | Død kode | `app/api/auth/vipps/callback/route.ts:229` |
| Sesjon | JWT | `config.ts:41-43` |
| Secure cookies | Kun i produksjon | `config.ts:102` |
| `trustHost` | Betinget i produksjon | `config.ts:95-97` |

Bunnlinjen: **det finnes ingen fungerende innloggingsvei for en ekte bruker.**

### 2.2 S-1 🔴 Aktiver e-postsending — KRITISK

`sendVerificationRequest` logger lenken i stedet for å sende den. Magic link-flyten er komplett i alle andre ledd; kun utsendelsen mangler.

**Tiltak:** Implementer reell utsendelse via SMTP-oppsettet som allerede er konfigurert (`EMAIL_SERVER_HOST/PORT/USER/PASSWORD`, `EMAIL_FROM`). E-posten skal følge språkmanualen: rolig, varm, uten hastverk.

**Krav til innhold:**
- Emne uten press («Din innlogging til Tosom»)
- Én tydelig lenke
- Gyldighetstid oppgitt
- Ingen markedsføring

**Akseptanse:** En invitert bruker mottar e-post og kommer inn i dashbordet.

### 2.3 S-2 🔴 Vipps — fullfør eller skjul

Callback kaller `signIn('credentials', …)` mot en provider som ikke finnes. Kastet svelges i `test-login`, men er synlig i Vipps-stien.

**Valg A (anbefalt for beta):** Skjul Vipps-knappen bak `VIPPS_ENABLED=false`. Behold koden. Ærlig, og fjerner en blindvei.

**Valg B:** Implementer Vipps som fullverdig OAuth-provider i NextAuth-konfigurasjonen. Større arbeid; ikke nødvendig for 50–100 inviterte.

**Anbefaling:** A nå, B før åpen lansering.

### 2.4 S-3 🟠 Dev-login må være miljøsikret

`app/api/dev/setup/route.ts` og `app/api/auth/test-login/route.ts` oppretter brukere uten autentisering.

**Krav:** Begge skal returnere 404 når `NODE_ENV === 'production'`, uavhengig av andre flagg. Ingen IP-whitelist som eneste vern — miljøsjekk først.

---

## 3. Autorisasjon

### 3.1 S-4 🔴 Privilegie-eskalering på admin — KRITISK

`app/api/admin/stats/route.ts:13-19`:

```ts
function isAdmin(req: NextRequest): boolean {
  const adminToken = req.cookies.get('admin_token')?.value;
  const sessionToken = req.cookies.get('authjs.session-token')?.value
    ?? req.cookies.get('next-auth.session-token')?.value;
  return !!(adminToken || sessionToken);   // ← kun eksistens
}
```

Verken signatur, utløp eller rolle sjekkes. **Enhver innlogget bruker kan lese admin-statistikk.** Samme feil i `app/api/admin/journeys/route.ts:16-17`.

Korrekte verktøy finnes allerede:
- `lib/auth/adminAuthGuard.ts:10-27` — session + `isAdminRole()`, gir 401/403
- `lib/auth/admin-jwt.ts:103` `verifyAdminCookie()` — verifisert signatur

Brukt riktig i `app/api/admin/analytics/route.ts:8` og `app/api/admin/session/route.ts`.

**Tiltak:** Erstatt begge `isAdmin()`-funksjonene med `adminAuthGuard()`. Slett de lokale hjelpefunksjonene.

### 3.2 S-5 🟠 Revider hele admin-flaten

Etter S-4: gå gjennom **alle** ruter under `app/api/admin/` og bekreft at hver enkelt kaller `adminAuthGuard()` eller `verifyAdminCookie()` som første handling.

Legg til en test som feiler hvis en admin-rute mangler guard — utvid `__tests__/admin-authorization.test.ts`.

### 3.3 S-6 🟡 Bekreft tilsiktet offentlige ruter

Disse mangler auth. Flere er korrekt offentlige, men bør bekreftes eksplisitt:

| Rute | Vurdering |
|---|---|
| `/api/questions/*` | OK — statisk innhold |
| `/api/system/health`, `/api/system/latency` | OK, men skal ikke lekke intern tilstand |
| `/api/analytics/track` | Trenger rate limiting |
| `/api/auth/phone/send`, `/verify` | Trenger streng rate limiting |
| `/api/notifications`, `/api/notifications/[id]/read` | 🔴 **Må ha auth** — brukerdata |
| `/api/relationship/milestones`, `/digest` | 🔴 **Må ha auth** — relasjonsdata |

**Tiltak:** De fire siste får `requireAuth()`.

---

## 4. Rate limiting

### 4.1 S-7 🟠 In-memory overlever ikke produksjon

Fire parallelle implementasjoner: `lib/rate-limit.ts`, `lib/rateLimit.ts`, `lib/api/rateLimit.ts`, `lib/security/phoneRateLimit.ts`.

Alle bruker prosesslokal `Map`. Eksempel `app/api/settings/export/route.ts:18`:

```ts
const exportRateLimit = new Map<string, number[]>();
```

På Vercel nullstilles dette ved hver kaldstart og deles ikke mellom instanser. Grensen er i praksis virkningsløs.

**Tiltak, faset:**

**Beta (50–100 brukere):** Behold in-memory. Ved dette volumet er risikoen akseptabel. Dokumenter begrensningen. **Unntak:** telefon-/e-postutsendelse må ha DB-basert teller — kostnad og misbrukspotensial er reelt.

**Før åpen lansering:** Samle til én implementasjon med delt lager. Postgres-basert teller er tilstrekkelig og krever ingen ny infrastruktur.

### 4.2 Foreslåtte grenser

| Endepunkt | Grense |
|---|---|
| Magic link | 3 per e-post per time |
| Telefonverifisering | 3 per nummer per time, 10 per IP per dag |
| Melding | 60 per bruker per time |
| Bildeopplasting | 20 per bruker per dag |
| Dataeksport | 1 per 5 min (som i dag) |
| Kontosletting | 1 per time |

---

## 5. Datasikkerhet og GDPR

### 5.1 Nåtilstand — grunnmuren finnes

| Rettighet | Rute | Status |
|---|---|---|
| Art. 17 sletting | `/api/settings/delete-account` | Implementert, hard delete (`:107`) |
| Art. 20 portabilitet | `/api/settings/export` | Implementert, JSON |

### 5.2 S-8 🔴 PDF-eksport før «Vi fant hverandre» — BLOKKER

Se diagnose B-3. `endJourney.ts:211-213` sletter begge kontoer permanent. `avslutning/page.tsx:240` lover eksport. Generatoren finnes ikke.

**Dette er både en GDPR-sak og en tillitssak.** Vi sletter brukerens data etter å ha lovet dem en kopi.

**Tiltak:** Bygg eksporten før beta. Detaljer i BETA-ACCESS §6.

**Ufravikelig krav:** Slettingen skal ikke kunne fullføres uten at eksporten er tilbudt og enten lastet ned eller aktivt avvist.

### 5.3 S-9 🟠 Verifiser at sletting er fullstendig

**Tiltak:** Skriv en integrasjonstest som:
1. Oppretter to brukere, matcher dem, kjører en reise med meldinger og bilder
2. Utløser `found_each_other`
3. Bekrefter at `User`, `Profile`, `DeepProfile`, `Message`, `Conversation`, `JourneyProgress` er borte for begge
4. Bekrefter at `MatchHistory`, `Report`, `AuditLog` **består** i anonymisert form
5. Bekrefter at opplastede bilder er slettet fra lagring — ikke bare DB-radene

Punkt 5 er lett å glemme og er en reell lekkasjevei.

### 5.4 S-10 🟡 Oppbevaringstid

Ingen sletting av forlatte kontoer i dag.

**Forslag:** Kontoer uten innlogging på 12 måneder anonymiseres. Varsel på e-post 30 dager før. Rolig tone, ingen «vi savner deg»-manipulasjon — bare et ærlig varsel.

---

## 6. Matching-sikkerhet

### 6.1 Nåtilstand — godt bygget

| Vern | Referanse |
|---|---|
| `CRON_SECRET` med `timingSafeEqual` | `route.ts:34-37` |
| Advisory lock mot overlapp | `:122-133` |
| Tidsbudsjett 50 s | `:31` |
| Ekskluderer utestengte/slettede | `:137-149` |
| Kill switch | `config/features.ts:60` |
| Strukturert logging ved defer | `:161-168` |

Dette er den best sikrede delen av systemet.

### 6.2 S-11 🟡 Sperreliste uten paginering

`:179-182` laster hele `MatchHistory` i minnet. Ved beta-volum er dette uproblematisk. Ved 10 000 brukere over tid blir det en minnerisiko innenfor et 60-sekunders funksjonsvindu.

**Tiltak:** Ved innføring av tidsvindu (A-4) begrenses spørringen samtidig til relevant periode. Løser begge problemer.

### 6.3 S-12 🟠 Profildata valideres ikke før scoring

`normalizeProfile()` (`unifiedScorer.ts:243`) caster uten validering. Misdannet JSON i `Profile.preferences` kan gi kast midt i runden.

**Tiltak:** Pakk scoring av hvert par i `try/catch`. En korrupt profil skal hoppes over og logges — ikke velte hele lørdagsrunden for alle andre.

Dette er den enkeltendringen med høyest robusthetsgevinst i matcherunden.

---

## 7. Reise- og chatsikkerhet

### 7.1 S-13 🟠 Bildesperren må håndheves server-side

`app/api/chat/image/route.ts` har ingen fase-sjekk. Bilder kan lastes opp fra dag 0.

**Tiltak:**
1. `imageShareAllowedAt` settes på `Conversation` når dag 15 nås (i journey-cron)
2. Bildeopplasting avviser med 403 hvis `imageShareAllowedAt` er null eller i framtiden
3. Fjern den avvikende `day >= 13`-porten i `journeySync.ts:31,80`

Invariant I-6 skal håndheves i koden, ikke bare i grensesnittet.

### 7.2 S-14 🟠 Bekreft eierskap på alle samtaleruter

Hver rute som leser eller skriver til `Conversation` eller `Message` må verifisere at innlogget bruker er `userAId` eller `userBId`.

**Tiltak:** Systematisk gjennomgang av `app/api/chat/*` og `app/api/conversations/*`. Test som forsøker tilgang på tvers av samtaler og forventer 403.

### 7.3 S-15 🟡 Rapportering og blokkering

`Report` finnes i schema, og `__tests__/report-alert.test.ts` dekker varsling. Migrasjonen `20260815140000_add_user_block` ligger på `wip/chat-moods-and-blocking`.

**Tiltak:** Fullfør blokkeringsfunksjonen før beta. I et produkt der to fremmede snakker sammen i 30 dager, er dette ikke valgfritt. En blokkert bruker skal aldri kunne matches med den som blokkerte.

---

## 8. Observability

### 8.1 Nåtilstand
Sentry er koblet opp (`sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation.ts`). `SystemLog` i database. Moduler i `lib/system/` og `lib/observability/alert.ts`.

### 8.2 S-16 🟠 PII-skrubbing i Sentry — KRITISK for dette produktet

Sentry må aldri motta profilinnhold, meldinger eller e-post. En stack trace med `DeepProfile` i konteksten er en lekkasje av det mest sensitive vi har.

**Tiltak:**
- `beforeSend` som fjerner `profile`, `deepProfile`, `message`, `content`, `email`, `phone`
- `sendDefaultPii: false`
- Verifiser med en bevisst framkalt feil i staging

### 8.3 S-17 🟡 Varsling for lørdagsrunden

Runden kjører én gang i uken. Feiler den, mister alle i køen en hel uke — og de får aldri vite hvorfor.

**Tiltak — varsle George ved:**
- Runden kastet
- Runden ble ikke kjørt innen 03:00 lørdag
- Null matcher med ≥ 10 i kø
- Runden traff tidsbudsjettet
- Eldste i kø > 14 dager

Denne siste er den viktigste for brukeropplevelsen: den fanger opp mennesker som venter forgjeves, uke etter uke.

---

## 9. Drift

### 9.1 Faktisk mål: Vercel
`vercel.json` definerer cron og funksjonsgrenser. Docker/systemd-filene i `deploy/` er alternativer som ikke er i bruk.

**Tiltak:** Marker Vercel som eneste støttede driftsmåte. Flytt `deploy/docker*` og `deploy/systemd.service` til `deploy/archive/`.

### 9.2 S-18 🔴 Ingen verifisert produksjonsbuild
`.next/` mangler `BUILD_ID` — kun dev-artefakt. **`next build` er aldri bekreftet grønn.**

**Tiltak:** Kjør `npm run build` og rett eventuelle feil før alt annet. Dette er en forutsetning, ikke et punkt på listen.

### 9.3 S-19 🟠 Backup
`deploy/backup.md` finnes. Ingen bekreftet gjenoppretting.

**Tiltak før beta:**
- Daglig automatisk backup av Postgres
- **Verifiser gjenoppretting til en tom database** — en backup som aldri er testet er ikke en backup
- Dokumenter gjenopprettingstid

### 9.4 Failover

| Svikt | Konsekvens | Håndtering |
|---|---|---|
| Matcherunden feiler | Alle venter en uke | Varsel + manuell rekjøring |
| Journey-cron feiler | Dagteller står | Idempotent — neste kjøring henter inn |
| Pusher nede | Ingen sanntid | Chat fungerer ved oppfriskning |
| Sentry nede | Blind på feil | Ingen brukerpåvirkning |
| Database nede | Total | Vercel + backup |

**Manuell rekjøring av runden** må dokumenteres: hvordan George trygt kjører `/api/cron/matching` på nytt hvis lørdagen svikter. Advisory lock gjør dette trygt.

---

## 10. Tiltaksliste

### Før beta — ufravikelig

| ID | Tiltak | Alvor |
|---|---|---|
| S-18 | Verifisert `next build` | 🔴 |
| S-1 | Aktiver e-postsending | 🔴 |
| S-4 | Fiks admin-eskalering | 🔴 |
| S-8 | PDF-eksport før sletting | 🔴 |
| S-13 | Håndhev bildesperre | 🟠 |
| S-16 | PII-skrubbing i Sentry | 🟠 |
| S-2 | Vipps skjult bak flagg | 🟠 |
| S-3 | Dev-ruter blokkert i produksjon | 🟠 |
| S-6 | Auth på notifications/relationship | 🟠 |
| S-12 | try/catch rundt parscoring | 🟠 |
| S-15 | Blokkering fullført | 🟠 |
| S-19 | Verifisert gjenoppretting | 🟠 |

### Beta-uke 1

S-5 (admin-revisjon) · S-9 (slettetest) · S-14 (eierskapssjekk) · S-17 (varsling)

### Før åpen lansering

S-7 (delt rate limiting) · S-10 (oppbevaring) · S-11 (paginering)

---

## 11. Prinsipper

1. **Miljøsjekk før alt annet.** Dev-verktøy dør i produksjon, uansett flagg.
2. **Én guard, brukt overalt.** `adminAuthGuard()` er kilden. Ingen lokale varianter.
3. **Feil skal aldri velte runden.** Én korrupt profil rammer bare seg selv.
4. **Sentry ser aldri profilinnhold.** Uten unntak.
5. **Sletting betyr sletting.** Inkludert filer i lagring.
6. **Kill switches krever ikke deploy.** Ro i en krise.
7. **En backup som aldri er gjenopprettet, finnes ikke.**