# ToSom — Security Overview (v2026)

Denne filen dekker sikkerhetsarkitekturen, autentisering, autorisasjon og alle sikkerhetsrelaterte systemer i ToSom.

---

## 1. AUTENTISERING-OVERSIKT

ToSom bruker **NextAuth v5** (Auth.js) som hovedautentiseringsløsning med tre innloggingsmetoder:

### Innloggingsmetoder
| Metode | Beskrivelse | Bruk |
|--------|-------------|------|
| **Vipps OAuth** | Norsk OIDC/OAuth2 login | Hovedmetode for norske brukere |
| **Magic Link** | E-post basert innlogging | Alternativer for internasjonale brukere |
| **Phone Verification** | SMS verifikasjonskode | Valgfritt for ekstra trygghet |

### Database-modeller
```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  password      String?  // Hashed passord (valgfritt)
  phone         String?
  phoneVerified Boolean  @default(false)
  role          Role     @default(USER)
  verified      Boolean  @default(false)
  bannedAt      DateTime?
  deletedAt     DateTime?
  // ...
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  sessionToken String   @unique
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 2. VIPPS OAuth FLOW

### Stig 1: Autorisasjon
```
POST /api/auth/vipps/authorize
→ Redirect til Vipps autorisasjonsside
```

### Stig 2: Callback
```
GET /api/auth/vipps/callback?code=XXX&state=YYY
→ Bytte kode mot token med Vipps API
→ Opprette eller oppdatere User og Account
→ Opprette session
→ Redirect til dashboard
```

### Konfigurasjon
```typescript
// I next-auth config
providers: [
  VippsProvider({
    clientId: env.VIPPS_CLIENT_ID,
    clientSecret: env.VIPPS_CLIENT_SECRET,
    authorization: {
      url: 'https://auth.vipps.no/access_token',
      params: { grant_type: 'authorization_code' }
    }
  })
]
```

---

## 3. MAGIC LINK FLOW

### Stig 1: Send magic link
```
POST /api/auth/magic-link
Body: { "email": "bruker@eksempel.no" }

→ Genererer token med expire i 15 minutt
→ Lager MagicLinkToken i database
→ Sender e-post med lenke: https://tosom.no/api/auth/magic-link/verify?token=XXX&email=YYY
```

### Stig 2: Verifiser magic link
```
POST /api/auth/magic-link/verify
Body: { "token": "XXX", "email": "bruker@eksempel.no" }

→ Validerer token (ikke utløpt, matcher e-post)
→ Oppretter eller finner User med den e-posten
→ Oppretter session via NextAuth
→ Returnerer user + session data
```

### Database-modell
```prisma
model MagicLinkToken {
  id        String    @id @default(cuid())
  email     String
  token     String    @unique
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime  @default(now())
  
  @@index([email])
  @@index([token])
  @@index([expiresAt])
}
```

---

## 4. PHONE VERIFICATION

### Stig 1: Send SMS kode
```
POST /api/auth/phone/send
Body: { "phone": "+47 123 45 678" }

→ Genererer 6-sifret kode
→ Lager PhoneVerification i database (expire i 10 min)
→ Sender SMS via provider (f.eks. Twilio)
```

### Stig 2: Verifiser telefon
```
POST /api/auth/phone/verify
Body: { "phone": "+47 123 45 678", "code": "123456" }

→ Validerer kode
→ Oppdaterer User.phoneVerified = true
→ Sletter PhoneVerification token
```

### Database-modell
```prisma
model PhoneVerification {
  id        String    @id @default(cuid())
  userId    String
  phone     String
  code      String
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime  @default(now())
  
  @@index([userId])
  @@index([phone])
  @@index([code])
}
```

---

## 5. TO-FAKTOR AUTENTISERING (2FA)

### Struktur
```prisma
model TwoFactorSecret {
  id          String   @id @default(cuid())
  userId      String   @unique
  secret      String   @unique       // TOTP secret key
  enabled     Boolean  @default(false)
  backupCodes String[]  // 8 engangskoder
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id])
}
```

### Hvordan det fungerer
1. Bruker går til Settings → Security → Enable 2FA
2. System genererer TOTP secret + backup-coder
3. Bruker skanner QR-kode med Authenticator-app (f.eks. Google Authenticator)
4. Bruker bekrefter med kode fra app
5. 2FA aktiveres — neste login krever både passord/Magic Link + TOTP kode

### Verifikasjon
- Bruker logger inn via Magic Link eller Vipps først
- Deretter blir de redirectet til 2FA-verifikasjonsside hvis 2FA er aktivert
- Systemet verifierer TOTP kode mot secret (RFC 6238)

---

## 6. PASSORD-SIKKERHET

### Lagring
- Passord **alltid** hashed med `bcrypt` (cost factor 12+)
- Aldri lagret i cleartext i database

### Tilbakestilling
```
POST /api/auth/request-reset
Body: { "email": "bruker@eksempel.no" }

→ Genererer PasswordResetToken (expire i 1 time)
→ Sender e-post med tilbakestillingslenke
```

### Database-modell
```prisma
model PasswordResetToken {
  id        String    @id @default(cuid())
  userId    String
  tokenHash String    @unique     // Hashet token (ikke cleartext)
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime  @default(now())
  user      User      @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([tokenHash])
}
```

---

## 7. AUTORISASJON / ROLLER

### Roller
```prisma
enum Role {
  USER    // Normal bruker
  ADMIN   // Administrator
}
```

### Auth-Guard Middleware
Alle protected API-ruter må sjekke auth:

```typescript
// Eksempel på auth-guard i API-rute
import { auth } from "@/lib/auth"

export async function GET(request: Request) {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "Ikke autentifisert" },
      { status: 401 }
    )
  }

  return NextResponse.json({ success: true, data: /* ... */ })
}
```

### Admin-Guard
Alle admin-ruter må sjekke rollen:

```typescript
export async function GET(request: Request) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: "Ingen tilgang" },
      { status: 403 }
    )
  }

  // Admin-logikk...
}
```

### Admin-Session
Admin-sessioner har ekstra validering:
```typescript
// /api/admin/session
export async function GET() {
  const session = await adminAuth()
  
  return NextResponse.json({
    success: true,
    data: {
      isAdmin: session?.user?.role === 'ADMIN',
      userId: session?.user?.id,
      createdAt: session?.createdAt
    }
  })
}
```

---

## 8. ADMIN-AUDIT-LOGG

All admin-handlinger logges:

### Database-modell
```prisma
model AuditLog {
  id        String      @id @default(cuid())
  adminId   String
  action    AuditAction
  metadata  String?     // JSON-streng med detaljer
  createdAt DateTime    @default(now())
  admin     User        @relation("AdminAuditLogs", fields: [adminId], references: [id])
  
  @@index([adminId])
  @@index([action])
  @@index([createdAt])
}

enum AuditAction {
  USER_BAN
  USER_UNBAN
  USER_VERIFY
  USER_DEACTIVATE
  USER_ACTIVATE
  CONTENT_DELETE
  JOURNEY_RESET
  CONVERSATION_FREEZE
  ADMIN_LOGIN
  TWOFA_ENABLE
  TWOFA_DISABLE
  ADMIN_SETTINGS_CHANGE
  PASSWORD_RESET
}
```

### Eksempel på audit-logg i admin-handling
```typescript
// Når admin bann en bruker
await prisma.auditLog.create({
  data: {
    adminId: session.user.id,
    action: 'USER_BAN',
    metadata: JSON.stringify({ 
      targetUserId: userId, 
      reason: 'Brudd av regler' 
    })
  }
})

await prisma.user.update({
  where: { id: userId },
  data: { bannedAt: new Date() }
})
```

---

## 9. SYSTEM-LOGGING & MONITORING

### SystemLog modell
```prisma
model SystemLog {
  id        String   @id @default(cuid())
  level     LogLevel // INFO, WARN, ERROR, DEBUG
  message   String
  module    String?  // "auth", "matching", "journey", etc.
  metadata  Json?
  createdAt DateTime @default(now())
  
  @@index([level])
  @@index([module])
  @@index([createdAt])
}

enum LogLevel {
  INFO
  WARN
  ERROR
  DEBUG
}
```

### SystemMessages modell (for admin-kontrollerte meldinger)
```prisma
model SystemMessage {
  id        String            @id
  content   String
  type      SystemMessageType @default(INFO) // INFO, WARNING, ALERT
  createdAt DateTime          @default(now())
}

enum SystemMessageType {
  INFO
  WARNING
  ALERT
}
```

### AI Request Log
Alle AI-anrop logges for overvåking og kostnadskontroll:

```prisma
model AIRequestLog {
  id        String    @id @default(cuid())
  userId    String
  feature   AIFeature // journeyGuidance, matchInsights, messageSuggestions, profileRewrite
  model     String
  tokensIn  Int
  tokensOut Int
  latencyMs Int
  success   Boolean
  traceId   String?
  createdAt DateTime  @default(now())
  
  @@index([userId])
  @@index([feature])
  @@index([createdAt])
}

enum AIFeature {
  journeyGuidance
  matchInsights
  messageSuggestions
  profileRewrite
}
```

---

## 10. RATE LIMITING

### Hovedstrategier
| Lag | Metode | Limit |
|-----|--------|-------|
| **API-ruter** | In-memory eller Redis-basert | Avhengig av endpoint |
| **Auth-endepunkter** | Strikt rate limiting | Magic link: 3/hour, SMS: 5/day |
| **Admin endpoints** | Session-basert | Ingen spesifikk limit, men audit logg |

### Eksempel på rate limiting i API-rute
```typescript
// Enkel in-memory rate limiting (bytt til Redis i produksjon)
const requestCounts = new Map<string, number[]>()

function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now()
  const requests = requestCounts.get(key) || []
  
  // Fjern gamle forespørsler utenfor vinduet
  const recent = requests.filter(t => now - t < windowMs)
  
  if (recent.length >= maxRequests) {
    return false // Rate limited
  }
  
  recent.push(now)
  requestCounts.set(key, recent)
  return true
}

// Bruk i API-rute
if (!checkRateLimit(userId, 3, 60 * 60 * 1000)) {
  return NextResponse.json(
    { success: false, error: "For mange forespørsler. Prøv igjen senere." },
    { status: 429 }
  )
}
```

---

## 11. DATA PROTEKSJON & PRIVATITET

### Privat profil-data
- Profildata (deepProfileData) er **aldri** eksponert til andre brukere
- Kun match-motoren og brukeren selv har tilgang
- API-ruter må validerer at kun eier kan lese sin egen profil

### Profil-tilgangskontroll
```typescript
// Brukeren kan bare lese SIN EGEN profil
export async function GET(request: Request) {
  const session = await auth()
  const { id } = nextParams.params
  
  // Admin kan lese alle profiler
  if (session.user.role !== 'ADMIN' && id !== session.user.id) {
    return NextResponse.json(
      { success: false, error: "Ingen tilgang" },
      { status: 403 }
    )
  }
  
  const profile = await prisma.profile.findUnique({ where: { userId: id }})
  // Returner ikke sensitive felt som deepProfileData til andre brukere
}
```

### Sletting av data
- `User.deletedAt` for soft-delete (GDPR)
- Admin kan initiere permanent sletting etter 30-dagers grace period
- All persondata skal kunne eksporteres og slettes på forespørsel

---

## 12. SESSION-HÅNDTERING

### Session modell
```prisma
model Session {
  id           String   @id @default(cuid())
  userId       String
  sessionToken String   @unique
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Session lifecycle
1. Bruker logger inn → Oppretter Session med expire i 30 dager
2. Hver gang brukeren besøker appen → Extends session expires
3. Når expire nås → Session slettes automatisk (NextAuth cleanup cron)
4. Når brukeren logger ut → Session slettes

### Admin sessioner
Admin-sessioner har kortere lifetime (f.eks. 4 timer) og krever:
- Admin login-side (/api/admin/setup)
- Ekstra verifikasjon for sensitive handlinger

---

## 13. VERIFICATION TOKENS

### VerificationToken (NextAuth standard)
```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}
```

Brukes av NextAuth for:
- E-post verifikasjon ved registrering
- Magic link verifikasjon
- Passord tilbakestilling (hvis brukt)

---

## 14. SIKKERHETSJEKKER OG BEST PRACTICES

### Nødvendige sjekker i hver API-rute
```typescript
export async function POST(request: Request) {
  // 1. Auth-sjekk
  const session = await auth()
  if (!session?.user) return unauthorized()
  
  // 2. Rate limiting
  if (!checkRateLimit(session.user.id, 10, 60000)) return rateLimited()
  
  // 3. Input validasjon (Zod)
  const schema = z.object({ field: z.string().min(1) })
  const parsed = schema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error)
  
  // 4. Autorisasjonssjekk
  if (session.user.role !== 'ADMIN' && notOwner(resource, session.user.id)) {
    return forbidden()
  }
  
  // 5. Utfør handling
  // 6. Logg eventuelle sensitive handlinger
  // 7. Returner standardisert respons
}
```

### Sensible konfigurasjoner (ikke committed)
| Variabel | Beskrivelse | Hvor lagres |
|----------|-------------|-------------|
| `DATABASE_URL` | PostgreSQL connection string | Vercel env / .env.local |
| `NEXTAUTH_SECRET` | NextAuth signing key | Vercel env / .env.local |
| `VIPPS_CLIENT_ID` / `VIPPS_CLIENT_SECRET` | Vipps OAuth | Vercel env |
| `PUSHER_*` | Pusher API keys | Vercel env |
| `UPLOADTHING_*` | Uploadthing API keys | Vercel env |
| `STRIPE_*` | Stripe API keys | Vercel env |
| `OPENAI_API_KEY` | OpenAI API key | Vercel env |

---

## 15. SIKKERHETS-ADMIN-UI

Admin har tilgang til sikkerhetsrelaterte endepunkter:

### GET /api/admin/security/overview
```json
{
  "success": true,
  "data": {
    "bannedUsers": 3,
    "lockedAccounts": 1,
    "failedLoginsLast24h": 12,
    "twoFactorEnabled": 45,
    "activeAdminSessions": 2
  }
}
```

### GET /api/admin/system/overview
```json
{
  "success": true,
  "data": {
    "database": "connected",
    "pusher": "connected",
    "storage": "operational",
    "uptime": "99.7%",
    "lastCronRun": "2026-08-02T06:00:00Z"
  }
}
```

### GET /api/admin/system/errors
Feil logging og overvåking for admin.

---

## 16. PERFORMANC METRIKKER

### PerformanceMetric modell
```prisma
model PerformanceMetric {
  id        String     @id @default(cuid())
  route     String
  metric    PerfMetric // api_latency, db_latency
  valueMs   Int
  createdAt DateTime   @default(now())
  
  @@index([route])
  @@index([metric])
  @@index([createdAt])
}

enum PerfMetric {
  api_latency
  db_latency
}
```

### Endpoint for metrikk-logging
```typescript
// POST /api/analytics/track — Analytics events
// GET /api/system/latency — Latency data

// Eksempel på logging i en API-rute
const start = Date.now()
try {
  // ... API-logikk
  await prisma.performanceMetric.create({
    data: {
      route: '/api/journey/today',
      metric: 'api_latency',
      valueMs: Date.now() - start
    }
  })
} catch (error) {
  await prisma.systemLog.create({
    data: {
      level: 'ERROR',
      message: error.message,
      module: 'journey'
    }
  })
  throw error
}
```

---

*Sikkerhetsdokumentasjon oppdateres ved hver endring i auth eller autorisasjon.*  
*Versjon: 1.0 — Opprettet 2026-08-02*