# ToSom — API Overview (v2026)

Denne filen gir en komplett oversikt over alle API-endepunkter i ToSom-plattformen.  
Alle endepunkter følger standardisert response-format.

---

## STANDARD RESPONSE-FORMAT

### Suksess
```json
{
  "success": true,
  "data": { /* ... */ },
  "message": "Valgfri beskjed"
}
```

### Feil
```json
{
  "success": false,
  "error": "Beskrivende feilmelding",
  "code": "OPTIONAL_ERROR_CODE"
}
```

### Feilkoder
| Kode | HTTP Status | Beskrivelse |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Ikke autentifisert |
| `FORBIDDEN` | 403 | Ingen tilgang |
| `NOT_FOUND` | 404 | Resurs ikke funnet |
| `VALIDATION_ERROR` | 400 | Ugyldig input |
| `RATE_LIMITED` | 429 | For mange forespørsler |
| `INTERNAL_ERROR` | 500 | Serverfeil |

---

## 1. AUTH API (/api/auth/*)

### POST /api/auth/magic-link
Send magic link til e-post for innlogging.

**Body:**
```json
{ "email": "bruker@eksempel.no" }
```

**Response:**
```json
{ "success": true, "message": "Sjekk e-posten din" }
```

---

### POST /api/auth/magic-link/verify
Verifiser magic link og logg inn.

**Body:**
```json
{ "token": "magic-token-123", "email": "bruker@eksempel.no" }
```

**Response:**
```json
{ "success": true, "data": { "user": { ... }, "session": { ... } } }
```

---

### POST /api/auth/vipps/authorize
Start Vipps OAuth flow.

**Response:**
```json
{ "success": true, "data": { "authorizeUrl": "https://verifikasjon.vipps.no/..." } }
```

---

### POST /api/auth/vipps/callback
Håndter Vipps callback og opprett session.

**Query params:** `code`, `state`

**Response:**
```json
{ "success": true, "data": { "user": { ... }, "session": { ... } } }
```

---

### POST /api/auth/phone/send
Send SMS verifikasjonskode.

**Body:**
```json
{ "phone": "+47 123 45 678" }
```

**Response:**
```json
{ "success": true, "message": "Kode sendt via SMS" }
```

---

### POST /api/auth/phone/verify
Verifiser telefonnummer.

**Body:**
```json
{ "phone": "+47 123 45 678", "code": "123456" }
```

**Response:**
```json
{ "success": true, "data": { "user": { ... } } }
```

---

### POST /api/auth/request-reset
Be om passord-tilbakestilling.

**Body:**
```json
{ "email": "bruker@eksempel.no" }
```

**Response:**
```json
{ "success": true, "message": "Sjekk e-posten din" }
```

---

### GET /api/auth/test-login
Test login (kun dev-miljø).

**Query params:** `email`

**Response:**
```json
{ "success": true, "data": { "user": { ... } } }
```

---

## 2. ONBOARDING API (/api/onboarding/*)

### POST /api/onboarding/save
Lagre onboarding-data for nåværende steg.

**Body:**
```json
{
  "step": 3,
  "data": {
    "lifestyle": { /* ... */ },
    // Steg-avhengige data
  }
}
```

**Response:**
```json
{ "success": true, "message": "Data lagret" }
```

---

### GET /api/onboarding/progress
Hent pågående onboarding-progresjon.

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "currentStep": 3,
    "totalSteps": 9,
    "complete": false,
    "progress": {
      "step1": true,
      "step2": true,
      "step3": false
    }
  }
}
```

---

### POST /api/onboarding/complete
Fullfør onboarding og start matching-prosess.

**Auth:** Required

**Response:**
```json
{ "success": true, "message": "Onboarding fullført! Du får din første match innen 24 timer." }
```

---

## 3. MATCHING API (/api/match*, /api/matching/*)

### GET /api/match
Hent aktive og pending matcher for aktuell bruker.

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "active": [],
    "pending": [
      {
        "id": "match_abc123",
        "score": 87,
        "normalizedScore": 0.87,
        "resonanceLevel": "STRONG",
        "partnerProfile": { ... },
        "createdAt": "2026-08-02T10:00:00Z"
      }
    ]
  }
}
```

---

### POST /api/match/accept
Aksepter match og start journey.

**Body:**
```json
{ "matchId": "match_abc123" }
```

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "conversationId": "conv_xyz789",
    "journeyDay": 1,
    "message": "Velkommen til reisen! Dag 1 starter nå."
  }
}
```

---

### GET /api/match/check
Sjekk om bruker har aktuell match.

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "hasPendingMatch": true,
    "lastMatchAt": "2026-08-02T10:00:00Z",
    "nextEligibleAt": "2026-08-03T10:00:00Z"
  }
}
```

---

### GET /api/match/status
Hent detaljert match-status.

**Auth:** Required

**Query params:** `matchId`

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "active",
    "acceptedByA": true,
    "acceptedByB": false,
    "lockedAt": null,
    "expiresAt": null
  }
}
```

---

### GET /api/match/insight
Hent AI-generated match-innsikt.

**Auth:** Required

**Query params:** `matchId`

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "Dere deler sterke verdier om...",
    "strengths": "Komunikasjon,verdier,fremtidsvisjon",
    "clarity": "Dere har en naturlig forbindelse...",
    "starter": "Prå å starte med: Hva tror du...?"
  }
}
```

---

### POST /api/match/score
Beregn resonans-score (internal).

**Auth:** Admin required

**Body:**
```json
{
  "profileAId": "user_123",
  "profileBId": "user_456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "baseScore": 85,
    "normalizedScore": 0.85,
    "resonanceLevel": "STRONG",
    "breakdown": {
      "values": 90,
      "personality": 82,
      "relationshipStyle": 88,
      "communication": 79,
      "lifeSituation": 85
    }
  }
}
```

---

### GET /api/matching (Cron)
Kjør matching-jobb for alle kvalifiserte brukere.

**Auth:** Cron/Bearer token required

**Response:**
```json
{
  "success": true,
  "data": {
    "matchesCreated": 12,
    "usersProcessed": 150,
    "elapsedMs": 3450
  }
}
```

---

## 4. JOURNEY API (/api/journey/*)

**Canonical ruter (2026-08-02 oppdatert):**
| Metode | Rute | Formål |
|--------|------|--------|
| GET | `/api/journey/today` | Hent dagens innhald |
| GET | `/api/journey/progress` | Hent progresjon |
| POST | `/api/journey/progress` | Advance til neste dag |
| POST | `/api/journey/reflect` | Lag refleksjon |
| GET | `/api/journey/resonance` | Hent resonansdata |
| GET | `/api/journey/check` | Sjekk om reise er låst |
| POST | `/api/journey/exit` | Avslutt reise |
| GET | `/api/journey/[conversationId]` | Hent journey state per conversation (GET berre) |

**Fjernede ruter (2026-08-02):**
- ~~`POST /api/journey/conversations/[conversationId]`~~ — fjerna, bruk `GET /api/journey/[conversationId]`
- ~~`POST /api/journey/[conversationId]`~~ — POST-metoden fjerna, bruk `POST /api/journey/progress` for advance

---

### GET /api/journey/today
Hent dagens journey-innhold.

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "day": 5,
    "phase": "EARLY",
    "theme": "Trygghet",
    "reflectionQuestion": "Hva trenger du for å føle deg trygg?",
    "conversationPrompt": "Fortell partneren din når du føler deg tryggest.",
    "task": "Del en situasjon der du følte deg forstått.",
    "resonanceGoal": "Bygg emosjonell trygghet"
  }
}
```

---

### GET /api/journey/progress
Hent journey-progresjon.

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "phase": "EARLY",
    "day": 5,
    "completedDays": 4,
    "startedAt": "2026-07-28T10:00:00Z",
    "nextDayAt": null,
    "canAdvance": true
  }
}
```

---

### POST /api/journey/progress (advance)
Flytt til neste dag.

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "day": 6,
    "phase": "EARLY",
    "message": "Dag 6 er klart. Nytt tema venter."
  }
}
```

---

### POST /api/journey/reflect (utvidet 2026-08-03)
Lag refleksjon — lagrar både JourneyMilestone OG ResonanceSession.

**Auth:** Required

**Body:**
```json
{
  "reflection": "Dagens refleksjon...",
  "emotionalTone": "open",    // open, guarded, deep, surface
  "depthLevel": 2              // 1-3
}
```

**Response:**
```json
{
  "success": true,
  "milestone": {
    "id": "ms_123",
    "day": 5,
    "title": "Refleksjon dag 5",
    "summary": "Dagens refleksjon..."
  },
  "resonanceSession": {
    "id": "rs_456",
    "day": 5,
    "emotionalTone": "open",
    "depthLevel": 2,
    "vulnerability": false
  },
  "completedDays": 5,
  "message": "Refleksjon lagra. Du kan gå vidare til neste dag etter 24 timer."
}
```

---

### GET /api/journey/resonance
Hent historiske resonansdata.

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      { "day": 1, "emotionalTone": "guarded", "depthLevel": 1 },
      { "day": 5, "emotionalTone": "open", "depthLevel": 2 }
    ],
    "trend": "improving"
  }
}
```

---

### GET /api/journey/check
Sjekk om reise er låst eller tilgjengelig.

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "hasActiveJourney": true,
    "conversationId": "conv_xyz789",
    "journeyDay": 5,
    "phase": "EARLY",
    "canSendImages": false,
    "lockedUntil": null
  }
}
```

---

### POST /api/journey/exit
Avslutt reise.

**Auth:** Required

**Body:**
```json
{ "reason": "Valgfatt grunn" }
```

**Response:**
```json
{ "success": true, "message": "Reisen er avsluttet." }
```

---

### AI-guidance endpoints (valgfritt)

| Metode | Rute | Beskrivelse |
|--------|------|-------------|
| POST | `/api/ai/journey-guidance` | AI-veiledning for dagens tema |
| POST | `/api/ai/journey/next-step` | AI-anbefaling for neste steg |

**Auth:** Required (bruker må eksistere)

---

## 5. CHAT API (/api/chat*, /api/conversation*)

### GET /api/chat/messages
Hent alle meldinger for en conversation.

**Auth:** Required

**Query params:** `conversationId`, `limit` (default: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_123",
        "content": "Hei! Hvordan har du det?",
        "type": "user",
        "state": "READ",
        "senderId": "user_a",
        "createdAt": "2026-08-02T10:00:00Z"
      }
    ],
    "hasMore": false,
    "conversation": { "id": "conv_123", "imageShareAllowedAt": null }
  }
}
```

---

### POST /api/chat/send
Send en melding (realtime via Pusher).

**Auth:** Required

**Body:**
```json
{
  "conversationId": "conv_123",
  "content": "Hei! Hvordan har du det?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "msg_123",
    "pusherEvent": "chat:message"
  }
}
```

---

### GET /api/chat/conversation/[id]
Hent conversation metadata.

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "conv_123",
    "userAId": "user_a",
    "userBId": "user_b",
    "matchId": "match_123",
    "createdAt": "2026-08-01T10:00:00Z",
    "lastMessageAt": "2026-08-02T10:00:00Z",
    "imageShareAllowedAt": null,
    "imageShared": false,
    "unreadCountA": 2,
    "unreadCountB": 0
  }
}
```

---

### GET /api/chat/image
Hent bilde i chat.

**Auth:** Required

**Query params:** `conversationId`, `imageUrl`

**Response:** Redirect eller base64-data.

---

### POST /api/conversation/create
Opprett ny conversation (kjøres automatisk ved match-accept, men kan kallast manuelt).

**Auth:** Required

**Body:**
```json
{
  "userAId": "user_a",
  "userBId": "user_b",
  "matchId": "match_123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversationId": "conv_new123",
    "journeyStarted": true
  }
}
```

---

## 6. AI API (/api/ai/*)

### POST /api/ai/match-insights
AI-generert match-innsikt basert på profiler.

**Auth:** Required (admin eller post-match)

**Body:**
```json
{
  "profileAId": "user_123",
  "profileBId": "user_456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": "Dere har sterke felles verdier...",
    "strengths": "Komunikasjon,verdier,fremtidsvisjon",
    "clarity": "Naturlig forbindelse gjennom...",
    "starter": "Tips til første samtale..."
  }
}
```

---

### POST /api/ai/journey-guidance
AI-veiledning for dagens journey-tema.

**Auth:** Required (bruker i aktiv journey)

**Body:**
```json
{
  "conversationId": "conv_123",
  "day": 5,
  "previousReflections": [/* ... */]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "guidance": "Dag 5 handler om trygghet. Prå å spørre...",
    "suggestedQuestions": [/* ... */]
  }
}
```

---

### POST /api/ai/message-suggestions
AI-genererte meldingsforslag (bruker må velge/send manuelt!).

**Auth:** Required (i aktiv chat)

**Body:**
```json
{
  "conversationId": "conv_123",
  "context": "Siste 5 meldinger"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      "Jeg tenker på det du sa om...",
      "Det er fint at du deler dette med meg."
    ]
  }
}
```

**⚠️ REGEL:** Aldri auto-send disse forslaga!

---

### POST /api/ai/profile/rewrite
Hjelp med profil-tekst (onboarding/dynamic).

**Auth:** Required

**Body:**
```json
{
  "rawText": "Brukers råprofiltekst...",
  "category": "bio"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "rewritten": "En varm, autentisk formulering..."
  }
}
```

---

## 7. ADMIN API (/api/admin/*)

### GET /api/admin/setup
Admin login/setup.

**Response:** Admin session eller setup-flow.

---

### POST /api/admin/logout
Admin logout.

**Response:**
```json
{ "success": true }
```

---

### GET /api/admin/session
Sjekk admin session status.

**Response:**
```json
{
  "success": true,
  "data": {
    "isAdmin": true,
    "userId": "admin_123",
    "createdAt": "2026-08-02T08:00:00Z"
  }
}
```

---

### GET /api/admin/users
Liste alle brukere.

**Auth:** Admin required

**Query params:** `page`, `limit`, `search`, `role`

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [/* ... */],
    "total": 150,
    "page": 1,
    "hasMore": true
  }
}
```

---

### GET /api/admin/stats
Systemstatistikk.

**Auth:** Admin required

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1500,
    "activeUsers": 420,
    "activeMatches": 85,
    "activeJourneys": 72,
    "newToday": 15,
    "conversationsActive": 70
  }
}
```

---

### PATCH /api/admin/matches/[id]/reset
Reset en match (fjerne lås).

**Auth:** Admin required

**Response:**
```json
{ "success": true, "message": "Match resatt" }
```

---

### PATCH /api/admin/matches/[id]/review
Review/en match.

**Auth:** Admin required

**Body:**
```json
{ "notes": "Admin notater..." }
```

**Response:**
```json
{ "success": true, "message": "Match vurdert" }
```

---

### PATCH /api/admin/matches/[id]/unmatch
Unmatch et par (fjerne match).

**Auth:** Admin required

**Response:**
```json
{ "success": true, "message": "Part unmatchet" }
```

---

### PATCH /api/admin/journey/[id]/reset
Reset en bruker sin journey.

**Auth:** Admin required

**Response:**
```json
{ "success": true, "message": "Journey resatt til dag 1" }
```

---

### PATCH /api/admin/journey/[id]/complete
Fullfør en reise manuelt.

**Auth:** Admin required

**Response:**
```json
{ "success": true, "message": "Reise fullført" }
```

---

### PATCH /api/admin/journey/[id]/next-step
Tving neste steg i journey.

**Auth:** Admin required

**Response:**
```json
{ "success": true, "message": "Neste dag aktivert" }
```

---

### GET /api/admin/ai/logs
AI-request logs.

**Auth:** Admin required

**Query params:** `page`, `limit`, `feature`, `dateFrom`, `dateTo`

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log_123",
        "userId": "user_456",
        "feature": "matchInsights",
        "model": "gpt-4",
        "tokensIn": 1200,
        "tokensOut": 350,
        "latencyMs": 2300,
        "success": true,
        "createdAt": "2026-08-02T10:00:00Z"
      }
    ],
    "total": 1500,
    "page": 1
  }
}
```

---

### GET /api/admin/system/overview
System health overview.

**Auth:** Admin required

**Response:**
```json
{
  "success": true,
  "data": {
    "database": "connected",
    "pusher": "connected",
    "storage": "operational",
    "uptime": "99.7%",
    "lastCronRun": "2026-08-02T06:00:00Z",
    "activeConnections": 45
  }
}
```

---

### GET /api/admin/system/errors
Error logs.

**Auth:** Admin required

**Query params:** `level`, `dateFrom`, `dateTo`

**Response:**
```json
{
  "success": true,
  "data": {
    "errors": [/* ... */],
    "total": 23,
    "byLevel": { "ERROR": 15, "WARN": 8 }
  }
}
```

---

### GET /api/admin/system/metrics
Performance metrics.

**Auth:** Admin required

**Response:**
```json
{
  "success": true,
  "data": {
    "avgApiLatency": 245,
    "avgDbLatency": 18,
    "p95Latency": 890,
    "errorRate": "0.3%"
  }
}
```

---

### GET /api/admin/resonance
Hent ResonanceSession for ein bruker (admin). Utvidet 2026-08-03.

**Auth:** Admin required

**Query params:** `userId` (obligatory), `limit` (valgfritt, default 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user_xxx",
    "totalSessions": 12,
    "uniqueDays": 12,
    "phases": {
      "EARLY": { "count": 8, "avgDepth": 1.8 },
      "BUILDING_TRUST": { "count": 3, "avgDepth": 2.3 },
      "DEEPER": { "count": 1, "avgDepth": 2.0 }
    },
    "sessions": [
      {
        "id": "rs_456",
        "day": 5,
        "emotionalTone": "open",
        "depthLevel": 2,
        "responseQuality": "brief",
        "vulnerability": false,
        "summary": "Dagens refleksjon...",
        "createdAt": "2026-08-03T10:00:00Z"
      }
    ]
  }
}
```

---

### GET /api/admin/security/overview
Security overview.

**Auth:** Admin required

**Response:**
```json
{
  "success": true,
  "data": {
    "bannedUsers": 3,
    "lockedAccounts": 1,
    "failedLoginsLast24h": 12,
    "twoFactorEnabled": 45
  }
}
```

---

## 8. PAYMENT API (/api/payment/*)

### POST /api/payment/create-checkout-session
Opprett Stripe checkout session.

**Auth:** Required

**Body:**
```json
{
  "plan": "premium",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/..."
  }
}
```

---

### POST /api/payment/webhook
Stripe webhook handler.

**Auth:** Stripe signature verification

**Response:**
```json
{ "received": true }
```

---

## 9. SYSTEM API (/api/system/*)

### GET /api/system/health
Health check.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "0.1.0",
    "timestamp": "2026-08-02T10:00:00Z"
  }
}
```

---

### GET /api/system/latency
Latency tracking.

**Response:**
```json
{
  "success": true,
  "data": {
    "apiLatency": 245,
    "dbLatency": 18,
    "totalLatency": 263
  }
}
```

---

### GET /api/system/messages
System messages.

**Auth:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      { "id": "sys_1", "type": "INFO", "content": "..." }
    ]
  }
}
```

---

## 10. QUESTIONS API (/api/questions/*)

### GET /api/questions/categories
Hent alle QuestionCategoryar med tal på GuidedQuestion per kategori.

**Auth:** Required (kan gjerast public)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat_xxx",
      "name": "Trygghet",
      "color": "#D4AF37",
      "description": "Grunnleggjande trygghet i relasjon",
      "questionCount": 15,
      "depthLevels": { "1": 0, "2": 0, "3": 0 }
    }
  ]
}
```

---

### GET /api/questions/[category]
Hent GuidedQuestionar per kategori. Kan filtrere på depth, limit og random.

**Auth:** Required

**Query params:** `depth` (1-3), `limit` (max 15), `random` (true/false)

**Response:**
```json
{
  "success": true,
  "category": { "id": "cat_xxx", "name": "Trygghet", "color": "#D4AF37" },
  "questions": [
    { "id": "q_123", "content": "Kva betyr trygghet for deg?", "depthLevel": 1, "order": 1 },
    { "id": "q_124", "content": "Kva er det som gjer at du føler deg trygg?", "depthLevel": 1, "order": 2 }
  ]
}
```

**Eksempel-kall:**
- `GET /api/questions/trygghet?depth=2&limit=3` — 3 djupne-spørsmål frå Trygghet
- `GET /api/questions/kommunikasjon?random=true` — tilfeldig rekkefølgje

---

### POST /api/analytics/track
Analytics event.

**Auth:** Optional (kan være anonymous)

**Body:**
```json
{
  "event": "onboarding_complete",
  "userId": "user_123",
  "metadata": { "stepsCompleted": 9 }
}
```

**Response:**
```json
{ "success": true }
```

---

*API-dokumentasjon oppdatert ved kvar endring i endepunkter.*  
*Versjon: 2.2 — Oppdatert 2026-08-03 (Pakke 4.2: ResonanceSession Tracking)*

---

*Dette dokumentet oppdaterast ved kvar større endring i plattformen.*
*Versjon: 1.0 — Opprettet 2026-08-02*
