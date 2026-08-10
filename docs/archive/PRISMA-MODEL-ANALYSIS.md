# Prisma-modellanalyse — ToSom

**Generert:** 2026-06-26  
**Status:** Fase 4 — Trygg analysen  
**Totalt:** 32 modeller

---

## OVERSYKT

| Domenear | Modell | Status | Bruk i kode |
|-----|-----|-|----|
| Auth | User | AKTIV | Mykje brukt |
| Auth | Account | AKTIV | NextAuth |
| Auth | Session | AKTIV | NextAuth |
| Auth | VerificationToken | AKTIV | NextAuth |
| Profile | Profile | AKTIV | Mykje brukt |
| Profile | MagicLinkToken | DELVIS | Berre schema |
| Profile | PhoneVerification | DELVIS | Berre schema |
| Matching | Match | AKTIV | Mykje brukt |
| Matching | MatchHistory | DELVIS | Schema + nokre API |
| Matching | MatchQueue | EKSPERIMENTELL | Schema + cron |
| Matching | MatchFeedback | EKSPERIMENTELL | Schema |
| Matching | MatchInsight | AKTIV | AI API |
| Journey | JourneyProgress | AKTIV | Mykje brukt |
| Journey | JourneyMilestone | AKTIV | Mykje brukt |
| Journey | JourneyStep | AKTIV | Mykje brukt |
| Journey | JourneyDayContent | DELVIS | Schema + seed |
| Chat | Conversation | AKTIV | Mykje brukt |
| Chat | Message | AKTIV | Mykje brukt |
| Chat | ResonanceSession | DELVIS | Nokre API |
| Admin | Notification | AKTIV | Nokre API |
| Admin | PasswordResetToken | AKTIV | Auth API |
| Admin | TwoFactorSecret | DELVIS | Schema + admin |
| Admin | AuditLog | DELVIS | Nokre API |
| System | SystemMessage | EKSPERIMENTELL | Schema |
| System | SystemLog | DELVIS | Nokre API |
| System | RateLimitLog | EKSPERIMENTELL | Schema |
| System | PerformanceMetric | DELVIS | Nokre API |
| System | RouteHit | EKSPERIMENTELL | Schema |
| System | AIRequestLog | DELVIS | Nokre API |

---

## DETALJERT ANALYSE PER MODEL

### 🟢 AKTIV (brukt i kodebasen)

#### 1. User
- **Bruk:** Hovudbrukar-modell
- **Felt:** id, email, password, phone, role, bannedAt, etc.
- **Relasjonar:** 15+ relasjonar — meir enn nødvendig
- **Status:** AKTIV — men kan forenlast

#### 2. Profile
- **Bruk:** Dyptprofil (core-definition)
- **Felt:** 20+ felt — identityName, lifeSituation, lifestyle, personality, etc.
- **Status:** AKTIV — god struktur

#### 3. Match
- **Bruk:** Matching mellom to brukarar
- **Felt:** status, score, normalizedScore, explanation, etc.
- **Status:** AKTIV — men mange felt ubrukte

#### 4. MatchInsight
- **Bruk:** AI-generert match-insight
- **Status:** AKTIV — brukt i `/api/ai/match-insights`

#### 5. JourneyProgress
- **Bruk:** 30-dagers reise for kvar brukar
- **Status:** AKTIV — god struktur

#### 6. JourneyMilestone
- **Bruk:** Milepæler i reise
- **Status:** AKTIV — brukt

#### 7. JourneyStep
- **Bruk:** Steg i reise per konversasjon
- **Status:** AKTIV — brukt

#### 8. Conversation
- **Bruk:** Chat mellom to brukarar
- **Status:** AKTIV — god struktur

#### 9. Message
- **Bruk:** Meldingar i chat
- **Status:** AKTIV — god struktur

#### 10. JourneyDayContent
- **Bruk:** Dagens innhald (1-30)
- **Status:** DELVIS — schema + seed-data

#### 11. Notification
- **Bruk:** Notifikasjonar for brukarar
- **Status:** AKTIV — brukt i nokre API

#### 12. PasswordResetToken
- **Bruk:** Passord-tilbakestilling
- **Status:** AKTIV — brukt i auth API

---

### 🟡 DELVIS AKTIV (schema + nokre API)

#### 13. ResonanceSession
- **Bruk:** Resonansmåling per dag
- **Status:** DELVIS — schema + `/api/journey/resonance`

#### 14. MagicLinkToken
- **Bruk:** Magic link-auth
- **Status:** DELVIS — schema + nokre auth-ruter
- **Anbefaling:** Kan erstattast av NextAuth VerificationToken

#### 15. PhoneVerification
- **Bruk:** Telefonverifisering
- **Status:** DELVIS — schema + `/api/auth/phone`
- **Anbefaling:** Behold så lenje telefon-login eksisterer

#### 16. TwoFactorSecret
- **Bruk:** 2FA for admin
- **Status:** DELVIS — schema + admin UI
- **Anbefaling:** Behold for framtida

#### 17. AuditLog
- **Bruk:** Admin-auditing
- **Status:** DELVIS — nokre API-er bruker det
- **Anbefaling:** Behold for admin

#### 18. SystemLog
- **Bruk:** Systemlogg
- **Status:** DELVIS — nokre API-er bruker det
- **Anbefaling:** Behold, men kan forenlast

#### 19. PerformanceMetric
- **Bruk:** API-latensmåling
- **Status:** DELVIS — nokre API-er bruker det
- **Anbefaling:** Behold så lenje det gir verdi

#### 20. AIRequestLog
- **Bruk:** AI-request-tracking
- **Status:** DELVIS — nokre API-er bruker det
- **Anbefaling:** Behold for quota-tracking

---

### 🔴 EKSPERIMENTELL/UBRUKT (kan deprekkerast)

#### 21. MatchHistory
- **Bruk:** Match-historikk
- **Status:** EKSPERIMENTELL — schema definerer, men lite bruk
- **Anbefaling:** MERGE_INTO Match (lagre events som JSON)

#### 22. MatchQueue
- **Bruk:** Match-cooldown
- **Status:** EKSPERIMENTELL — cron-jobben kjører ikkje
- **Anbefaling:** MERGE_INTO User (lastMatchAt + lockedUntil)

#### 23. MatchFeedback
- **Bruk:** Match-rating
- **Status:** EKSPERIMENTELL — UI har det, men ingen API
- **Anbefaling:** REMOVE — ikkje i ToSom-konseptet

#### 24. SystemMessage
- **Bruk:** System-wide meldingar
- **Status:** EKSPERIMENTELL — schema definerer, men ingen bruk
- **Anbefaling:** REMOVE — kan erstattast av db-table eller config

#### 25. RateLimitLog
- **Bruk:** Rate limiting-logg
- **Status:** EKSPERIMENTELL — schema definerer, men in-memory rate limiting er brukt
- **Anbefaling:** REMOVE — in-memory er tilstrekkeleg

#### 26. RouteHit
- **Bruk:** Route-telling
- **Status:** EKSPERIMENTELL — schema definerer, men ingen bruk
- **Anbefaling:** REMOVE — kan erstattast av analytics

#### 27. JourneyDayContent
- **Bruk:** Dagens innhald (1-30 tema)
- **Status:** DELVIS — seed-data kan vere hardkoda
- **Anbefaling:** Behold som seed-data istadenfor database

---

## DOMENEGRUPPING

### Auth (4-5 modeller)
| Modell | Handling |
|-----|-----|
| User | KEEP |
| Account | KEEP (NextAuth) |
| Session | KEEP (NextAuth) |
| VerificationToken | KEEP (NextAuth) |
| MagicLinkToken | MERGE_INTO VerificationToken |
| PhoneVerification | KEEP (så lenje telefon-login eksisterer) |
| TwoFactorSecret | KEEP (2FA for admin) |
| PasswordResetToken | KEEP |

### Profile (1 modell)
| Modell | Handling |
|-----|-----|
| Profile | KEEP |

### Matching (5 modeller)
| Modell | Handling |
|-----|-----|
| Match | KEEP |
| MatchHistory | MERGE_INTO Match |
| MatchQueue | MERGE_INTO User |
| MatchFeedback | REMOVE |
| MatchInsight | KEEP |

### Journey (4-5 modeller)
| Modell | Handling |
|-----|-----|
| JourneyProgress | KEEP |
| JourneyMilestone | KEEP |
| JourneyStep | KEEP |
| JourneyDayContent | KONSIDER SOM SEED-DATA |

### Chat (3 modeller)
| Modell | Handling |
|-----|-----|
| Conversation | KEEP |
| Message | KEEP |
| ResonanceSession | MERGE_INTO JourneyProgress |

### Admin (3-4 modeller)
| Modell | Handling |
|-----|-----|
| Notification | KEEP |
| AuditLog | KEEP |

### System (4 modeller)
| Modell | Handling |
|-----|-----|
| SystemMessage | REMOVE |
| SystemLog | KEEP (forenlast) |
| RateLimitLog | REMOVE |
| PerformanceMetric | KEEP (forenlast) |
| RouteHit | REMOVE |
| AIRequestLog | KEEP |

---

## MÅLSTRUKTUR (~15 modeller)

```
User (auth + profile-data)
├── Profile (dyptprofil)
├── Match (matching)
│   ├── MatchInsight (AI-generert)
│   └── MatchHistory (events som JSON)
├── JourneyProgress (reise)
│   ├── JourneyMilestone (milepæler)
│   └── ResonanceSession (dagleg resonans)
├── Conversation (chat)
│   └── Message (meldingar)
├── JourneyStep (konversasjon-steig)
├── Notification (notifikasjonar)
├── AuditLog (admin)
├── AIRequestLog (AI-tracking)
├── Account (NextAuth)
├── Session (NextAuth)
├── VerificationToken (NextAuth)
├── PasswordResetToken (auth)
├── TwoFactorSecret (2FA)
└── SystemLog (system)
```

**Totalt: ~15 modeller** (frå 32)

**Fjerna:**
- MatchHistory (merge)
- MatchQueue (merge)
- MatchFeedback (remove)
- SystemMessage (remove)
- RateLimitLog (remove)
- RouteHit (remove)

**Merged:**
- MatchHistory → Match.events JSON
- MatchQueue → User.lastMatchAt + lockedUntil
- ResonanceSession → JourneyProgress.resonance JSON
- MagicLinkToken → VerificationToken

---

## OPPSUMMERING

| Status | Modell | Tal |
|-----|--|---|
| AKTIV | User, Profile, Match, MatchInsight, JourneyProgress, JourneyMilestone, JourneyStep, Conversation, Message, Notification, PasswordResetToken | 11 |
| DELVIS | ResonanceSession, MagicLinkToken, PhoneVerification, TwoFactorSecret, AuditLog, SystemLog, PerformanceMetric, AIRequestLog, JourneyDayContent | 9 |
| EKSPERIMENTELL | MatchHistory, MatchQueue, MatchFeedback, SystemMessage, RateLimitLog, RouteHit | 6 |
| **Totalt** | | **26** (fjerna 6 enum = 32 total) |

**Mål:** ~15 modeller (frå 26+ enum)

**Deprecated for fjerning:** 6 modeller
**Merge:** 3 modeller
**Beheld:** 17 modeller