# ToSom — Full Flow Mapping (Login → Onboarding → Dashboard → Chat)

**Dato:** 30.06.2026  
**Type:** Teknisk kartlegging — ingen endringer  
**Formål:** Dokumenter hele brukerflowet fra innlogging til chat, med fokus på testbrukere

---

## 1. LOGIN → INNLOGGING

### 1.1 Innloggingsruter

| Rute | Type | Beskrivelse |
|------|------|-------------|
| `/login` | Client Page | Hovedinnloggingsside med e-post + testbruker-knapp |
| `/login` | Server Page | Redirect til `/login` (én linje) |

### 1.2 `/login` page.tsx — Analyse

**To innloggingsmetoder:**

1. **E-post (Magic Link):**
   ```
   signIn("email", { email, callbackUrl: "/dashboard", redirect: false })
   ```
   - Kaller NextAuth EmailProvider
   - Sender magic link til e-post
   - Redirect til `/dashboard` etter bekreftelse

2. **Testbruker (Dev Login):**
   ```
   window.location.href = "/api/dev-login?userId=test-user-1"
   ```
   - Direkte redirect til `/api/dev-login`
   - Krever ingen e-postbekreftelse
   - Setter session-cookie direkte

### 1.3 NextAuth config (`lib/auth/config.ts`)

**Providers:**
- `EmailProvider` — magic link med PrismaAdapter
- `CredentialsProvider` (id: "credentials") — dev-login fallback

**Session Strategy:** JWT

**Pages:**
- `signIn: "/login"` — custom login page
- `error: "/login"` — feilsider
- `verifyRequest: "/login"` — bekreftelsesside

**Callbacks:**
- `jwt`: Setter `role` og `sub` i token. Dev-brukere får rollen `"dev"`
- `session`: Overfører `sub` til `session.user.id`, `role` til `session.user.role`

**Events:**
- `createUser`: Oppretter ny Profile med `deepProfileStep: "IDENTITY"` når ny bruker opprettes

---

## 2. DEV-LOGIN / TESTBRUKERE

### 2.1 `/api/dev-login/route.ts` — Analyse

**Støttede testbrukere:**
```typescript
const USERS = {
  'test-user-1': { id: 'test-user-1', email: 'test1@tosom.no', name: 'Testbruker 1', role: 'USER' },
  'test-user-2': { id: 'test-user-2', email: 'test2@tosom.no', name: 'Testbruker 2', role: 'USER' },
  'test-user-3': { id: 'test-user-3', email: 'test3@tosom.no', name: 'Testbruker 3', role: 'USER' },
};
```

**Måte å kalle på:**
```
GET /api/dev-login?userId=test-user-1
GET /api/dev-login?userId=test-user-2
GET /api/dev-login?userId=test-user-3
```

**Hva den gjør:**
1. Validerer `userId` mot USERS-objektet
2. Lager session payload med `sub`, `email`, `name`, `role`
3. Lager HMAC-SHA256 signert JWT (base64-encoded)
4. Setter cookie `next-auth.session.token` (httpOnly, 1 dag)
5. **Redirect til `/dashboard`**

**⚠️ VIKTIG:** Dev-login redirecter ALDRE til onboarding. Den redirecter direkte til `/dashboard`.

### 2.2 Middleware (middleware.ts)

**PUBLIC_PATHS (alltid tilgjengelige):**
```typescript
['/maintenance', '/dev-login', '/api/dev-login', '/_next', '/favicon.ico']
```

**PROTECTED_API_PREFIXES (krever valid session):**
```typescript
['/api/profile', '/api/matching', '/api/journey', '/api/conversation', '/api/system', '/api/admin', '/api/ai']
```

**Merk:** `/onboarding` er IKKE i PUBLIC_PATHS, men `/dashboard` er heller ikke. Ingen routing restrictions på disse side-rutene — de håndteres internt i API-komponenter.

---

## 3. PRISMA-SKJEMA — USER OG PROFILE

### 3.1 User-modellen (viktige felt)

```prisma
model User {
  id               String           @id @default(cuid())
  email            String           @unique
  onboardingStep   Int              @default(1)
  onboardingComplete Boolean        @default(false)
  deepProfileComplete Boolean        @default(false)
  role             Role              @default(USER)
  verified         Boolean           @default(false)
  bannedAt         DateTime?
  lockedUntil      DateTime?         // Core: låst i 30d etter match
  lastMatchAt      DateTime?         // Core: én match per 24t
  // ...
}
```

### 3.2 Profile-modellen (viktige felt)

```prisma
model Profile {
  userId      String   @unique
  identityName String?
  age         Int?
  lifeSituation    Json?
  lifestyle        Json?
  personality      Json?
  relationshipStyle String?
  communication    Json?
  intimacy         Json?
  futureVision     Json?
  boundaries       Json?
  emotionalNeeds   Json?
  maturityLevel    Int?           // 1-10
  securityLevel    String?        // "unsicher" | "ambivalent" | "secure"
  deepProfileStep  DeepProfileStep @default(IDENTITY)
  deepProfileData  Json?
  photoUrl         String?
  matchTags        String[]
  preferences      Json?
  // ...
}
```

### 3.3 Key-flåkart

| Felts | Verdi | Betydning |
|-------|-------|-----------|
| `User.onboardingComplete` | `false` | Bruker må fullføre onboarding |
| `User.onboardingComplete` | `true` | Onboarding fullført |
| `User.deepProfileComplete` | `false` | Dyp profil ikke fullført |
| `User.deepProfileComplete` | `true` | Dyp profil fullført |
| `Profile.deepProfileStep` | `"IDENTITY"` | Starter på første steg |
| `Profile.deepProfileStep` | `"SUMMARY"` | Sist steg fullført |

---

## 4. ONBOARDING-FLOW

### 4.1 Hovedrute

```
GET /onboarding → OnboardingFlow (client component)
```

### 4.2 OnboardingFlow — 10 steg

| Steg | Navn | Felter |
|------|------|--------|
| 0 | Basis | identityName, age, gender, seekingGender, height, bodyType, lifestyle, smoking, religion, children, wantChildren, city, distancePref, agePrefMin, agePrefMax |
| 1 | Personlighet | selfDesc, energyGiver, energyDrainer, pressureReact, quirk |
| 2 | Tilknytning | safetyNeed, insecurityTrigger, sadnessNeed, stressNeed, importantBoundary |
| 3 | Kommunikasjon | commStyle, conflictStyle, calmingHelp, trigger, trustBuilder |
| 4 | Kjærlighetsspråk | loveGive, loveReceive, closenessBuilder, distanceCreator, smallThing |
| 5 | Livsstil | (5 spørsmål) |
| 6 | Fremtid | (5 spørsmål) |
| 7 | Humor | (5 spørsmål) |
| 8 | Modenhet | (5 spørsmål) |
| 9 | Preferanser | politicsImportance, religionImportance, dietPreference, sleepSchedule, pets, travelFreq, alcoholFreq, ambitionLevel, structureSpontaneity, introExtrovert, attachmentStyle |

### 4.3 Fullføringslogikk (`handleNext` på steg 9)

```typescript
// Steg 1: Lagre profil
const profileRes = await fetch('/api/profile/setup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ basic, personlighet, tilknytning, kommunikasjon, kjaerlighet, livsstil, fremtid, humor, moden, preferanser }),
});

// Steg 2: Kjør matching (valgfritt)
const matchRes = await fetch('/api/matching', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId }),
});

// Redirect
window.location.href = '/dashboard';  // eller '/matching?userId=...'
```

### 4.4 `/api/profile/setup/route.ts` — Analyser

**Hva den gjør:**
1. Validerer session (krever innlogging)
2. `prisma.profile.upsert` — oppretter eller oppdaterer profil med alle data
3. `prisma.user.update` — markerer onboarding som fullført:
   ```typescript
   await prisma.user.update({
     where: { id: userId },
     data: {
       onboardingComplete: true,
       deepProfileComplete: true,
       onboardingStep: 10,
     },
   });
   ```

---

## 5. DASHBOARD-FLOW

### 5.1 Hovedrute

```
GET /dashboard → DashboardPage (server component)
```

### 5.2 DashboardPage — Analyser

**Auth-check:**
```typescript
const session = await auth();
if (!session?.user?.id) {
  redirect('/login');
}
```

**Data-henting:**
- `getUserProfile(userId)` — onboardingComplete, deepProfileComplete, deepProfileStep, etc.
- `getUserMatches(userId)` — aktive matcher med score, resonance
- `getUserConversations(userId)` — aktive samtaler med unreadCount
- `getUserInsights(userId, matchCount, convoCount, profileComplete)` — dynamiske innsikter

**ProfileStatusSection — viser:**
- Onboarding-status (checkbox)
- Dyp profil-status (checkbox)
- 30-dagers reise-status (dagens fase + dag)
- Progress bar (0-100%)

**CTA-knapp:**
```typescript
// Hvis onboarding ikke fullført:
<Link href="/onboarding">
  "Fullfør profilen din"
</Link>

// Hvis onboarding fullført:
<Link href="/onboarding">
  "Oppdater profil"
</Link>
```

### 5.3 Ingen automatisk redirect i dashboard

Dashboard sjekker **ikke** `onboardingComplete` for å redirecte. Det er opp til brukeren å klikke "Fullfør profilen din" på CTA-knappen.

---

## 6. CHAT-FLOW

### 6.1 Hovedrute

```
GET /chat/[id] → ChatDetailPage (client component)
```

### 6.2 ChatDetailPage — Analyser

**Hentet session:**
```typescript
const res = await fetch('/api/auth/signin?json=true');
const data = await res.json();
setSession(data?.session ?? null);
```

**Merk:** Chat-siden henter session via `/api/auth/signin?json=true` (ikke server-side auth). Dette er en svakhet — dersom session er invalid, vil ikke meldinger lastes riktig.

**Hooks brukt:**
- `useChatMessages(conversationId, userId)` — laster og refreshes meldinger
- `useChatRealtime(conversationId, userId)` — Pusher-sanntid
- `useTypingIndicator(conversationId, userId)` — typing-status

**Send melding:**
```typescript
fetch('/api/chat/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ conversationId, content }),
});
```

**AI-chatstarter:**
```typescript
fetch('/api/chat/starter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ matchId: conversationId }),
});
```

---

## 7. FULL BRUKERFLOW — SAMMENFATTENDE

### 7.1 Ny bruker (første gang)

```
1. Besøker /login
2. Velger "Logg inn som testbruker"
     → /api/dev-login?userId=test-user-1
     → Session settes (cookie)
     → Redirect til /dashboard

3. Landing på /dashboard
   - Ingen matcher ennå ("Du har ingen aktive matcher enno")
   - Ingen samtaler ennå
   - Profilstatus: Onboarding: ⬜, Dyp profil: ⬜
   - CTA: "Fullfør profilen din" → /onboarding

4. Fullfører /onboarding (10 steg)
   → POST /api/profile/setup
     → onboardingComplete = true
     → deepProfileComplete = true
     → deepProfileStep = "SUMMARY"
   → POST /api/matching (valgfritt)
   → Redirect til /dashboard

5. Dashboard nå viser:
   - Profilstatus: Onboarding: ✓, Dyp profil: ✓
   - Mulig ny match (hvis matching kjørte)
   - CTA: "Oppdater profil"

6. Åpner chat (hvis match eksisterer):
   /chat/[conversationId]
   → Viser meldinger, AI-chatstarter, sanntids-oppdateringer
```

### 7.2 Tilbakekomende bruker (fullført onboarding)

```
1. Besøker /login
2. Logger inn via e-post (magic link)
   → Redirect til /dashboard

3. Dashboard vises med:
   - Aktive matcher (hvis noen)
   - Aktive samtaler (hvis noen)
   - Profilstatus: Alle ✓
   - 30-dagers reise-status (hvis startet)
```

---

## 8. VIKTIGE FUNN OG POTENSIELLE PROBLEMER

### 8.1 Dev-login → Onboarding-gap

**Problemet:** Dev-login redirecter **ALLTID** til `/dashboard`, uavhengig av brukerens onboarding-stand.

**Konsekvens:**
- Ny testbruker havner på dashboard med tom profil
- Må manuelt klikke "Fullfør profilen din" for å starte onboarding
- Ingen sjekk av `onboardingComplete` i dev-login eller middleware

**Løsning (valgfritt):** 
- I dev-login: Sjekk om bruker finnes i DB
- Hvis `onboardingComplete === false`: redirect til `/onboarding`
- Hvis `onboardingComplete === true`: redirect til `/dashboard`

### 8.2 Ingen onboarding-sjekk i middleware

Middleware har ingen logikk som tvinger på nye brukere til onboarding. Det er en "soft" flow — brukeren velger selv om de vil fullføre.

### 8.3 Matching API finnes ikke som route

`/api/matching` er **IKKE** definert som en Next.js route. Koden eksisterer i `lib/matching/` men det er ingen API-endepunkt som kaller dette fra frontend. OnboardingFlow kaller det, men det vil feile med 404.

### 8.4 Chat session-henting er weak

Chat-siden bruker `fetch('/api/auth/signin?json=true')` for å hente session. Denne endpointen returnerer ikke nødvendigvis session-data i JSON-format.

### 8.5 Profil-CTA redirecter til /onboarding selv om fullført

`ProfileStatusSection` har en CTA som alltid redirecter til `/onboarding`, uavhengig om profilen er fullført eller ikke. Teksten endrer seg ("Fullfør profilen din" vs "Oppdater profil"), men both redirecter til samme sted.

---

## 9. REDIRECT-SUMMAR

| Hendelse | Nåværende redirect | Mål |
|----------|-------------------|-----|
| Dev-login | `/api/dev-login` | `/dashboard` (alltid) |
| Magic link bekreftelse | NextAuth internal | `/dashboard` (via callbackUrl) |
| Onboarding fullført | `window.location.href` (client) | `/dashboard` eller `/matching?userId=...` |
| Profile setup API | (server-side) | returns JSON → client redirecter |
| Dashboard (ikke innlogget) | server-side `redirect()` | `/login` |
| Chat session missing | (ingen) | Tom chat, ingen feil |

---

## 10. TESTBRUKER-GUIDE

### 10.1 Trygge testbrukere

| userId | Email | Name | Rolle |
|--------|-------|------|-------|
| `test-user-1` | test1@tosom.no | Testbruker 1 | USER |
| `test-user-2` | test2@tosom.no | Testbruker 2 | USER |
| `test-user-3` | test3@tosom.no | Testbruker 3 | USER |

### 10.2 Hvordan logge inn som testbruker

**Metode 1: Fra /login-side**
1. Gå til `http://localhost:3000/login` (eller din dev-url)
2. Klikk "Logg inn som testbruker"-knappen
3. Den logger inn som test-user-1 automatisk

**Metode 2: Direkte URL**
```
http://localhost:3000/api/dev-login?userId=test-user-1
http://localhost:3000/api/dev-login?userId=test-user-2
http://localhost:3000/api/dev-login?userId=test-user-3
```

### 10.3 Sikkerhet

- Dev-login er kun ment for utvikling
- Ingen password/magic link nødvendig
- Session varer i 24 timer
- Ingen rolle-begrensning (alle er USER)

---

## 11. PUSHER / SANNTID

Chat-siden bruker Pusher for sanntid:
- `useChatRealtime` — init Pusher-kanal
- `onNewMessage` — mottar nye meldinger i sanntid
- `onTyping` — mottar typing-indikatorer

Pusher initieres med `conversationId` og `userId` som parametre.

---

## 12. RESENSE — FULL FLOW DIAGRAM

```
┌─────────────┐
│   /login    │
│             │
│  ┌─────────┐│
│  │ Email   ││──── Magic Link ──── /dashboard
│  └─────────┘│
│             │
│  ┌─────────┐│
│  │ Test    ││──── /api/dev-login?userId=xxx ──── /dashboard
│  │ User    ││     (⚠️ alltid dashboard, aldri onboarding)
│  └─────────┘│
└─────────────┘
        │
        ▼
┌─────────────┐
│ /dashboard  │
│             │
│ Profil:     │
│  Onboarding: ⬜ ──── CTA "Fullfør profilen din" ──── /onboarding
│  Dyp profil: ⬜
│  Reise: ⬜
│             │
│  Onboarding: ✓ ──── CTA "Oppdater profil" ──── /onboarding
│  Dyp profil: ✓
│  Reise: ✓
└─────────────┘
        │
        ▼
┌─────────────┐
│ /onboarding │
│  10 steg    │
│             │
│ Steg 0-9:   │
│  Profil-felter │
│             │
│ Steg 9 → POST /api/profile/setup │
│  → onboardingComplete = true     │
│  → deepProfileComplete = true    │
│             │
│ → POST /api/matching (💥 404!) │
│ → /dashboard              │
└─────────────┘
        │
        ▼
┌─────────────┐
│ /chat/[id]  │
│             │
│ Meldinger    │
│ Sanntid (Pusher) │
│ AI-starter   │
└─────────────┘
```

---

**Dokumentasjon fullført.** Ingen endringer er gjort.