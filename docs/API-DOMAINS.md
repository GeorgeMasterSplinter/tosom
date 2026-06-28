# ToSom — API Domains

**Generert:** 2026-06-26  
**Oppdatert:** Fase 3

---

## API STRUCTURE

### auth/ (8 endepunkter)
| Path | Metode | Beskrivelse |
|------|--|-------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth v5 handlers |
| `/api/auth/magic-link` | POST | Send magic link |
| `/api/auth/magic-link/verify` | POST | Verifiser magic link |
| `/api/auth/phone/send` | POST | Send telefonverifisering |
| `/api/auth/phone/verify` | POST | Verifiser telefon |
| `/api/auth/request-reset` | POST | Tilbakestill passord |
| `/api/auth/phone/verify/[id]` | GET/POST | Telefon verifisering |

### admin/ (27+ endepunkter)
| Path | Metode | Beskrivelse |
|------|--|-------|
| `/api/admin/auth` | GET/POST | Admin login |
| `/api/admin/setup` | POST | Admin setup |
| `/api/admin/ai/logs` | GET | AI-loggføring |
| `/api/admin/conversation/[id]` | GET/POST | Se/endre chat |
| `/api/admin/conversation/[id]/freeze` | POST | Fryse chat |
| `/api/admin/journey/[id]` | GET | Se reise |
| `/api/admin/journey/[id]/complete` | POST | Fullfør reise |
| `/api/admin/journey/[id]/next-step` | POST | Neste steg |
| `/api/admin/journey/[id]/reset` | POST | Tilbakestill |
| `/api/admin/matches/[id]` | GET | Se match |
| `/api/admin/matches/[id]/reset` | POST | Tilbakestill |
| `/api/admin/matches/[id]/review` | POST | Gjennomgå |
| `/api/admin/matches/[id]/unmatch` | POST | Fjern match |
| `/api/admin/notification/[id]` | GET/POST | Notifikasjon |
| `/api/admin/notifications` | GET | Alle notifikasjoner |
| `/api/admin/observability/heatmap` | GET | Heatmap |
| `/api/admin/observability/metrics` | GET | Metrikker |
| `/api/admin/observability/traces` | GET | Traces |
| `/api/admin/security/overview` | GET | Sikkerhetsoversikt |
| `/api/admin/system/errors` | GET | Feil |
| `/api/admin/system/logs` | GET | Systemlogger |
| `/api/admin/system/overview` | GET | System status |
| `/api/admin/system/rate-limits` | GET | Rate limits |
| `/api/admin/system/realtime` | GET | Realtime |
| `/api/admin/system-message` | GET/POST | Systemmelding |

### ai/ (7 endepunkter)
| Path | Metode | Beskrivelse |
|------|--|-------|
| `/api/ai/journey/next-step` | POST | AI neste steg |
| `/api/ai/journey-guidance` | POST | AI reise-guiding |
| `/api/ai/match-insights` | POST | AI match-insights |
| `/api/ai/message-suggestions` | POST | AI meldingsforslag |
| `/api/ai/profile/rewrite` | POST | AI profil-omskrivning |
| `/api/ai/profile-rewrite` | POST | **DEPRECATED** — returnerer 410 |

### chat/ (5 endepunkter)
| Path | Metode | Beskrivelse |
|------|--|-------|
| `/api/chat/conversations` | GET | Hent samtaler |
| `/api/chat/messages` | GET | Hent meldinger |
| `/api/chat/send` | POST | Send melding |
| `/api/chat/starter` | GET | Starter prompts |
| `/api/chat/image-permission` | GET | Bilde tillatelse |

### conversation/ (5 endepunkter)
| Path | Metode | Beskrivelse |
|------|--|-------|
| `/api/conversation` | GET | Hent konversasjon |
| `/api/conversation/[id]` | GET | Enkelt konversasjon |
| `/api/conversation/[id]/messages` | GET | Meldinger |
| `/api/conversation/[id]/read` | POST | Marker som lest |
| `/api/conversation/[id]/send` | POST | Send melding |

### journey/ (5 endepunkter)
| Path | Metode | Beskrivelse |
|------|--|-------|
| `/api/journey/[conversationId]` | GET | Hent reise |
| `/api/journey/progress` | GET/POST | Fremgang |
| `/api/journey/reflect` | POST | Refleksjon |
| `/api/journey/resonance` | POST | Resonansmåling |
| `/api/journey/today` | GET | Dagens innhold |

### match/ (4 endepunkter)
| Path | Metode | Beskrivelse |
|------|--|-------|
| `/api/match` | GET | Hent match |
| `/api/match/accept` | POST | Aksepter match |
| `/api/match/insight` | POST | Match-insight |
| `/api/match/status` | GET | Match-status |

### matching/ (legacy)
| Path | Metode | Beskrivelse |
|------|--|-------|
| `/api/matching` | GET/POST | **DEPRECATED** — legacy |
| `/api/matching/accept` | POST | **DEPRECATED** |
| `/api/matching/detail` | GET | **DEPRECATED** |

### notifications/ (3 endepunkter)
| Path | Metode | Beskrivelse |
|------|--|-------|
| `/api/notifications` | GET | Hent notifikasjoner |
| `/api/notifications/[id]` | GET | Enkelt notifikasjon |
| `/api/notifications/[id]/read` | POST | Marker som lest |

### onboarding/ (4 endepunkter)
| Path | Metode | Beskrivelse |
|------|--|-------|
| `/api/onboarding/complete` | POST | Fullfør onboarding |
| `/api/onboarding/deep-profile` | POST | Deep profile |
| `/api/onboarding/progress` | GET/POST | Fremgang |
| `/api/onboarding/save` | POST | Lagre profil |

### profile/ (2 endepunkter)
| Path | Metode | Beskrivelse |
|------|--|-------|
| `/api/profile` | GET | Hent profil |
| `/api/profile/setup` | POST | Settle profil |

### relationship/ (4 endepunkter)
| Path | Metode | Beskrivelse |
|------|--|-------|
| `/api/relationship/digest` | GET | Relasjons-digest |
| `/api/relationship/memories` | GET | Minner |
| `/api/relationship/milestones` | GET | Milepæler |
| `/api/relationship/timeline` | GET | Timeline |

### system/ (3 endepunkter)
| Path | Metode | Beskrivelse |
|------|--|-------|
| `/api/system/health` | GET | Helse-sjekk |
| `/api/system/latency` | GET | Latensmåling |

### cron/ (1 endepunkt)
| Path | Metode | Beskrivelse |
|------|--|-------|
| `/api/cron/matching` | POST | Cron matching |

### dashboard/ (2 endepunkter)
| Path | Metode | Beskrivelse |
|------|--|-------|
| `/api/dashboard` | GET | Dashboard data |
| `/api/dashboard/overview` | GET | Overview |

### uploadthing/ (1 fil)
| Path | Metode | Beskrivelse |
|------|--|-------|
| `/api/uploadthing` | GET/POST/PUT | Filopplasting |

---

## OPPSUMMERING

| Domain | Antall ruter | Status |
|--------|-----|-------|
| admin/ | 27 | Aktiv (RBAC) |
| ai/ | 7 | Aktiv (delvis) |
| auth/ | 8 | Aktiv (v5) |
| chat/ | 5 | Aktiv |
| conversation/ | 5 | Aktiv |
| journey/ | 5 | Aktiv |
| match/ | 4 | Aktiv |
| matching/ | 3 | **DEPRECATED** |
| notifications/ | 3 | Aktiv |
| onboarding/ | 4 | Aktiv |
| profile/ | 2 | Aktiv |
| relationship/ | 4 | Aktiv |
| system/ | 3 | Aktiv |
| cron/ | 1 | Aktiv |
| dashboard/ | 2 | Aktiv |
| uploadthing/ | 1 | Aktiv |
| **Totalt** | **~77** | **~60 aktive, ~17 deprecated** |

---

## ANBEFALING

1. **Slett matching/ (legacy)** — 3 endpoints
2. **Slett profile-rewrite duplikat** — 1 endpoint
3. **Konsolidér chat/conversation** — begge har overlapping
4. **Konsolidér dashboard/overview med match/**
5. **Flyt admin/observability til system/**
6. **Mål: Reduser til ~40-50 aktive ruter**