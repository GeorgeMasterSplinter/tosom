# ToSom — Subsystems Overview (v2026)

Denne filen gir en detaljert oversikt over alle subsystemer i ToSom-plattformen.  
Hvert subsystem beskrives med formål, komponenter, status og kritiske merknader.

---

## 1. AUTH-SYSTEMET

### Formål
Brukerautentisering og -identitet for hele plattformen.

### Teknologi
- NextAuth v5 (Auth.js)
- Vipps OAuth (Norsk login)
- Magic Link e-post
- Phone Verification (SMS)
- 2FA (TOTP med backup-coder)

### API-endepunkter
| Metode | Rute | Beskrivelse |
|--------|------|-------------|
| POST | `/api/auth/magic-link` | Send magic link til e-post |
| POST | `/api/auth/magic-link/verify` | Verifiser og logg inn med magic link |
| POST | `/api/auth/vipps/authorize` | Start Vipps OAuth flow |
| POST | `/api/auth/vipps/callback` | Vipps callback, håndter token |
| POST | `/api/auth/phone/send` | Send SMS verifikasjonskode |
| POST | `/api/auth/phone/verify` | Verifiser telefonnummer |
| POST | `/api/auth/request-reset` | Be om passord-tilbakestilling |

### Database-modeller
- `User` — Hovedbrukerprofil med role, verified, bannedAt, deletedAt
- `Account` — OAuth-kontoer (Vipps, etc.)
- `Session` — Aktive sessioner
- `VerificationToken` — E-post verifikasjon
- `PasswordResetToken` — Passord-tilbakestilling
- `MagicLinkToken` — Magic link tokens
- `PhoneVerification` — Telefonverifikasjon
- `TwoFactorSecret` — 2FA config

### Status: ✅ Ferdig

### Merknader
- Vipps OAuth er hovedinnloggingsmetode for norske brukere
- Magic link som alternativ for internasjonale brukere
- Phone verification valgfritt for ekstra trygghet
- 2FA tilgjengelig via admin eller user settings

---

## 2. ONBOARDING-SYSTEMET

### Formål
Bygge en dyp, privat profil fra bruker med 9 steg.  
Profilen er kun tilgjengelig for match-motoren — aldri offentlig.

### Struktur (9 steg)
| Steg | Kategori | Beskrivelse |
|------|----------|-------------|
| 1 | Identitet | Navn, alder, grunnleggende info |
| 2 | Livssituasjon | Bolig, arbeid, livsstil |
| 3 | Livsstil | Hverdagsrutiner, sosiale vaner |
| 4 | Personlighet | Temperament, verdier, styrker |
| 5 | Relasjonsstil | Tilhengerkompatibilitet, kommunikasjon |
| 6 | Kommunikasjon | Hvordan bruke uttrykker behov og følelser |
| 7 | Intimitet & Nærhet | Fysisk og emosjonell nærhet (modent) |
| 8 | Fremtidsønsker | Hva bruker søker, langsiktige mål |
| 9 | Oppsummering | Gjennomgang av profildata |

### API-endepunkter
| Metode | Rute | Beskrivelse |
|--------|------|-------------|
| POST | `/api/onboarding/save` | Lagre data for nåværende steg |
| GET | `/api/onboarding/progress` | Hent pågående progresjon |
| POST | `/api/onboarding/complete` | Fullfør onboarding (starter matching) |

### Database-modeller
- `User.onboardingStep` — Nåværende steg (1-9)
- `User.onboardingComplete` — Boolean flag
- `User.deepProfileComplete` — Boolean flag
- `Profile` — Dyp profil data (JSON-felter for alle kategorier)
- `DeepProfileStep` enum: IDENTITY, LIFE_SITUATION, LIFESTYLE, PERSONALITY, RELATIONSHIP_STYLE, COMMUNICATION, INTIMACY, FUTURE_VISION, BOUNDARIES, SUMMARY

### Status: ✅ Ferdig (med noen validerings gaps)

### Merknader
- Steg 9 inkluderer oppsummering før match-prosess starter
- Ingen push eller kommandoer — kun invitasjoner til dybde
- Profildata lagres som JSON for fleksibilitet
- `matchTags` genereres fra profil for matching

---

## 3. MATCHING-SYSTEMET

### Formål
Den **eneste** AI-funksjonen i ToSom. Gir én match per 24 timer basert på dyp profilkompatibilitet — aldri bilder, aldri swipe.

### Filosofi
- Aldri bilder som grunnlag
- Aldri overflatefaktor (utseende, avstand alene)
- Aldri swipe-mekanisme
- Aldri flere valg
- Alltid én match basert på resonans
- Fokus på verdier, personlighet, livssituasjon, relasjonsstil

### Matching-algoritme (konseptuell)
```
score = base_score(
  values_compatibility(profileA.verdier, profileB.verdier),
  personality_compatibility(profileA.personlighet, profileB.personlighet),
  relationship_style_compatibility(profileA.relasjonsStil, profileB.relasjonsStil),
  communication_compatibility(profileA.kommunikasjon, profileB.kommunikasjon),
  life_situation_compatibility(profileA.livssituasjon, profileB.livssituasjon),
  maturity_level_compatibility(profileA.moenethetsLevel, profileB.moennhetsLevel)
)

resonance = calculate_resonance(score, emotional_patterns)
```

### API-endepunkter
| Metode | Rute | Beskrivelse |
|--------|------|-------------|
| GET | `/api/match` | Hent aktive/pending matcher for bruker |
| POST | `/api/match/accept` | Aksepter match (oppretter Conversation) |
| GET | `/api/match/check` | Sjekk om bruker har aktuell match |
| GET | `/api/match/status` | Hent match-status |
| GET | `/api/match/insight` | AI-generated match-innsikt |
| POST | `/api/match/score` | Beregn resonans-score (internal) |
| GET | `/api/matching` | **Cron-endepunkt** — kjører matching-jobb |

### Cron-jobb
- **Rutine**: Daglig (configurable via Vercel cron)
- **Endepunkt**: `POST /api/cron/matching` eller `GET /api/matching`
- **Logikk**: 
  1. Finn alle brukere klar for ny match
  2. For hver bruker, beregn resonans mot kvalifiserte kandidater
  3. Velg beste match per bruker (hvis minst én kandidat finnes)
  4. Opprett Match-objekt med status "pending"
  5. Send notifikasjon til berørte brukere

### Database-modeller
- `Match` — Hovedmatch med score, normalizedScore, resonanceLevel, status
- `MatchInsight` — AI-generated innsikt per match
- `MatchFeedback` — @deprecated vurder sletting
- `MatchHistory` — @deprecated vurder sletting
- `MatchQueue` — @deprecated vurder sletting

### Status: ✅ Ferdig

### Merknader
- Matching kjøres som cron-jobb, ikke på forespørsel
- Kun én match per 24 timer per bruker
- Når begge aksepterer: låst i 30 dager (ingen nye matcher)
- Resonans målt som enum: GENTLE, MODERATE, STRONG, DEEP

---

## 4. JOURNEY-SYSTEMET

### Formål
En guidet 30-dagers reise mellom to matchede mennesker. Daglige temaer, refleksjoner, oppgaver og resonansmåling.

### Faser
| Fase | Dager | Beskrivelse |
|------|-------|-------------|
| **Fase 1** | Dag 1-14 | Introduksjon og trygghetsbygging (uten bilder anbefalt) |
| **Fase 2** | Dag 15-30 | Dypere samtaler, sårbarhet, felles reise |

### Daglig innhold
Hver dag har:
- **Theme** — Tema for dagen (f.eks. "Trygghet", "Verdier")
- **ReflectionQuestion** — Refleksjon til selvgransking
- **ConversationPrompt** — Spørsmål til samtale med partner
- **Task** — Valgfatt oppgave (f.eks. "Del en minne fra barndommen")
- **ResonanceGoal** — Hva paret skal oppnå denne dagen

### API-endepunkter
| Metode | Rute | Beskrivelse |
|--------|------|-------------|
| GET | `/api/journey/today` | Dagens innhold (theme, prompt, task) |
| GET | `/api/journey/progress` | Hent progresjon (dag, phase, completedDays) |
| POST | `/api/journey/progress/advance` | Neste dag (dag + 1) |
| POST | `/api/journey/reflect` | Lag refleksjon og mål resonans |
| GET | `/api/journey/resonance` | Hent historiske resonansdata |
| GET | `/api/journey/check` | Sjekk om reise er låst |
| POST | `/api/journey/exit` | Avslutt reise |

### AI-guidance (valgfritt)
| Metode | Rute | Beskrivelse |
|--------|------|-------------|
| POST | `/api/ai/journey-guidance` | AI veiledning for dagens tema |
| POST | `/api/ai/journey/next-step` | AI anbefaling for neste steg |

### Cron-jobb
- **Rutine**: Daglig
- **Endepunkt**: `POST /api/cron/journey`
- **Logikk**: Advance dager for inaktive brukere, sjekk expired journeys

### Database-modeller
- `JourneyProgress` — Per bruker: phase, day, completedDays, nextDayAt, startedAt, endedAt
- `JourneyMilestone` — Milepæler i reisen (title, summary)
- `ResonanceSession` — Målinger per conversation+dag
- `JourneyStateLog` — State transitions (NOT_STARTED → IN_PROGRESS → COMPLETED)
- `JourneyDayContent` — Global dag-innhold (tema, spørsmål, oppgaver for dag 1-30)
- `JourneyPhase` enum: EARLY, BUILDING_TRUST, DEEPER, CHECKIN

### Status: ⚠️ Delvis ferdig

### Merknader
- Ingen CHECK constraint på `day` felt (API-validering nødvendig)
- JourneyProgress er per User, ikke per Conversation
- `JourneyDayContent` er global for alle par (kan utvides til å være personlig)
- Bilde-share tillatt etter 14 dager via `Conversation.imageShareAllowedAt`

---

## 5. CHAT-SYSTEMET

### Formål
Privat samtalerom mellom matchede par. Guidede spørsmål, ikke AI-chat. Realtime via Pusher.

### Filosofi
- **Ingen AI-chat** — kun guidede spørsmål
- **Ingen AI-svar** — alle meldinger er fra brukere
- **Guiding gjennom spørsmål** — 8-10 kategorier med 15-20 spørsmål hver
- **Realtime** — Pusher for live oppdateringer

### Spørsmalkategorier
| Kategori | Beskrivelse |
|----------|-------------|
| Trygghet | Hvordan bygge trygghet i relasjonen |
| Verdier | Deling og forståelse av grunnleggende verdier |
| Livsstil | Hverdagsvaner og preferanser |
| Personlighet | Temperament, styrker, utfordringer |
| Relasjonsstil | Tilhengerkompatibilitet, attachment |
| Kommunikasjon | Hvordan uttrykke behov og følelser |
| Fremtid | Felles visjon og mål |
| Sårbarhet | Åpenhet om frykter og sårbare temaer |
| Nærhet | Fysisk og emosjonell nærhet |
| Felles reise | Opplevelser sammen i journey |

### API-endepunkter
| Metode | Rute | Beskrivelse |
|--------|------|-------------|
| GET | `/api/chat/messages` | Hent meldinger for conversation |
| POST | `/api/chat/send` | Send melding (realtime via Pusher) |
| GET | `/api/chat/conversation/[id]` | Hent conversation metadata |
| GET | `/api/chat/image` | Bilde i chat |
| GET | `/api/conversation/create` | Opprett ny conversation |

### AI-forslag (valgfritt, ikke auto-generert)
| Metode | Rute | Beskrivelse |
|--------|------|-------------|
| POST | `/api/ai/message-suggestions` | AI-genererte meldingsforslag (bruker må velge/sende manuelt) |

### Database-modeller
- `Conversation` — Privat rom mellom to brukere
- `Message` — Enkelte meldinger med type, state, content
- `QuestionCategory` — Guidede spørsmål-kategorier
- `GuidedQuestion` — Enkelte spørsmål per kategori

### Status: ✅ Ferdig

### Merknader
- `Message.state` kan være: SENT, DELIVERED, READ, DELETED
- `Message.type` kan være: user, system, continue_choice, image
- Image sharing tillatt etter 14 dager (`imageShareAllowedAt`)
- Pusher for realtime typing-indikator og unread-count

---

## 6. ADMIN-PANELET

### Formål
Administratorverktøy for moderering, brukerhåndtering og systemoversikt.

### Funksjoner
- Brukermoderasjon (ban, unbann, verifisere, deaktivere)
- Match-håndtering (reset, review, unmatch)
- Journey-admin (reset, complete, next-step)
- Systemoversikt (health, errors, metrics, traces)
- AI-request logging

### API-endepunkter (utvalg)
| Metode | Rute | Beskrivelse |
|--------|------|-------------|
| GET | `/api/admin/setup` | Admin login/setup |
| GET | `/api/admin/users` | Liste alle brukere |
| GET | `/api/admin/stats` | Systemstatistikk |
| PATCH | `/api/admin/matches/[id]/reset` | Reset match |
| PATCH | `/api/admin/journey/[id]/reset` | Reset journey |
| GET | `/api/admin/ai/logs` | AI-request logs |
| GET | `/api/admin/system/overview` | Health overview |
| GET | `/api/admin/security/overview` | Security overview |

### UI-sider
- `/app/admin/page.tsx` — Dashboard
- `/app/admin/users/` — Brukeroversikt
- `/app/admin/matches/` — Match-overblikk
- `/app/admin/journey/` — Journey-admin
- `/app/admin/settings/` — System-innstillinger

### Status: ✅ Ferdig

### Merknader
- Admin tilgang krever `User.role = ADMIN`
- All admin-action logges i `AuditLog`
- 2FA anbefalt for admin-brukere

---

## 7. PAYMENT-SYSTEMET

### Formål
Stripe-basert betaling for premium-funksjoner.

### Teknologi
- Stripe API
- Stripe Webhooks for event-håndtering

### API-endepunkter
| Metode | Rute | Beskrivelse |
|--------|------|-------------|
| POST | `/api/payment/create-checkout-session` | Opprett Stripe checkout session |
| POST | `/api/payment/webhook` | Stripe webhook handler |

### Database-modeller
- Ingen dedikerte payment-modeller i schema (usikker om dette er feil)

### Status: ✅ Ferdig (med usikker data-model)

### Merknader
- Mangler Subscription model i Prisma schema
- Webhook håndterer checkout.completed, invoice.paid, etc.
- Anbefaler legge til `Subscription` og `Payment` modeller

---

## 8. AI-SYSTEMET

### Formål
AI-funksjoner som støtter brukeropplevelsen — men aldri erstatter menneskelig kommunikasjon.

### Funksjoner
| Funksjon | Beskrivelse | Regler |
|----------|-------------|--------|
| **Match Insights** | AI-generert innsikt per match | Kun ved match, ikke i chat |
| **Journey Guidance** | AI-anbefaling for dagens tema | Mild, aldri pushy |
| **Message Suggestions** | Forslag til svar (bruker sender manuelt) | Aldri auto-send |
| **Profile Rewrite** | Hjelp med profil-tekst | Kun onboarding/dynamic |

### API-endepunkter
| Metode | Rute | Beskrivelse |
|--------|------|-------------|
| POST | `/api/ai/match-insights` | Match-innsikt |
| POST | `/api/ai/journey-guidance` | Journey-veiledning |
| POST | `/api/ai/message-suggestions` | Meldingsforslag |
| POST | `/api/ai/profile/rewrite` | Profil-tekst assistanse |

### Database-modeller
- `AIRequestLog` — Logget AI-anrop (feature, model, tokensIn, tokensOut, latencyMs, success)
- `MatchInsight` — Resultat av match-insight AI

### Status: ✅ Ferdig

### Merknader
- Aldri auto-send i chat
- Aldri AI-chat mellom brukere
- Aldri AI-coach eller AI-partner
- All AI-logg lagres for monitoring

---

## 9. SYSTEM- & MONITORING

### Formål
Overvåking, helse sjekker og logging for plattformen.

### API-endepunkter
| Metode | Rute | Beskrivelse |
|--------|------|-------------|
| GET | `/api/system/health` | Health check |
| GET | `/api/system/latency` | Latency tracking |
| GET | `/api/system/messages` | System messages |
| POST | `/api/analytics/track` | Analytics event |

### Database-modeller
- `SystemLog` — Logging (level: INFO, WARN, ERROR, DEBUG)
- `PerformanceMetric` — Routelatens og db-latens
- `AuditLog` — Admin-handlinger logget

### Status: ⚠️ Delvis ferdig

### Merknader
- Health check mangler detaljerte DB/Pusher sjekker
- Analytics tracking finnes men usikker om frontend-integrasjon
- PerformanceMetric logger API-latens men mangler frontend-page metrics

---

## SUBSYSTEM-SAMMENFATTNING

| System | Status | Kritisk? | Prioritet neste gang |
|--------|--------|----------|---------------------|
| **Auth** | ✅ Ferdig | Nei | — |
| **Onboarding** | ✅ Ferdig | Nei | Valider steg-nummering |
| **Matching** | ✅ Ferdig | Ja | — |
| **Journey** | ⚠️ Delvis | Ja | Legge til dag-validering (1-30) |
| **Chat** | ✅ Ferdig | Nei | Seed question categories |
| **Admin** | ✅ Ferdig | Nei | Bulk-actions |
| **Payment** | ✅ Ferdig | Nei | Legg til Subscription-model |
| **AI** | ✅ Ferdig | Ja | Sjekk at ingen auto-send |
| **System** | ⚠️ Delvis | Nei | Detaljert health check |

---

*Dette dokumentet oppdateres ved hver større subsystem-endring.*  
*Versjon: 1.0 — Opprettet 2026-08-02*