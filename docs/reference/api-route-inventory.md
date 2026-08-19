# ToSom — API Route Inventory (A12)

*Generert av ACT v7, steg 3.1, 16. august 2026. 109 ruter kartlagt.*

> **UBRUKT-listen nedenfor er IKKE en sletteliste.**
> Ingen fil slettes før et menneske har gjennomgått og godkjent listen.
> Klassifiseringsregel: ved minste tvil → SERVER, ikke UBRUKT.

## Sammendrag

| Gruppe | Antall |
|--------|--------|
| BRUKT | 57 |
| SERVER | 46 |
| EKSTERN | 6 |
| TEST | 0 |
| UBRUKT | 0 |
| **Totalt** | **109** |

## Full liste

| # | Rute | Metoder | Gruppe | Kaller |
|---|------|---------|--------|--------|
| 1 | /api/admin/ai/logs | GET | SERVER | — (tvil: admin sub-rute) |
| 2 | /api/admin/analytics | GET | BRUKT | app/admin/analytics/page.tsx |
| 3 | /api/admin/auth | POST | BRUKT | app/admin/login/page.tsx |
| 4 | /api/admin/conversation/[id]/freeze | POST | BRUKT | app/admin/conversations/page.tsx (dynamic `${endpoint}`) |
| 5 | /api/admin/conversation/[id] | GET | BRUKT | app/admin/conversations/page.tsx |
| 6 | /api/admin/conversation/[id]/unlock | POST | BRUKT | app/admin/conversations/page.tsx (dynamic `${endpoint}`) |
| 7 | /api/admin/conversations | GET | BRUKT | app/admin/conversations/page.tsx |
| 8 | /api/admin/journey-content/[day] | PATCH | BRUKT | app/admin/journey-content/page.tsx |
| 9 | /api/admin/journey-content | GET | BRUKT | app/admin/journey-content/page.tsx |
| 10 | /api/admin/journey/[id]/complete | POST | SERVER | — (tvil: admin sub-rute) |
| 11 | /api/admin/journey/[id]/next-step | POST | SERVER | — (tvil: admin sub-rute) |
| 12 | /api/admin/journey/[id]/reset | POST | SERVER | — (tvil: admin sub-rute) |
| 13 | /api/admin/journeys | GET | BRUKT | app/admin/journeys/page.tsx |
| 14 | /api/admin/journey-stats | GET | BRUKT | app/admin/analytics/page.tsx |
| 15 | /api/admin/logout | DELETE | SERVER | — (tvil: admin sub-rute) |
| 16 | /api/admin/matches/[id]/inspector | GET | BRUKT | app/admin/matches/page.tsx |
| 17 | /api/admin/matches/[id]/reset | POST | SERVER | — (tvil: admin sub-rute) |
| 18 | /api/admin/matches/[id]/review | POST | SERVER | — (tvil: admin sub-rute) |
| 19 | /api/admin/matches/[id]/unmatch | POST | SERVER | — (tvil: admin sub-rute) |
| 20 | /api/admin/matches | GET | BRUKT | app/admin/matches/page.tsx |
| 21 | /api/admin/matching-rounds | GET | BRUKT | app/admin/resonance/page.tsx |
| 22 | /api/admin/metrics | GET | BRUKT | app/admin/dashboard/page.tsx |
| 23 | /api/admin/notification/[id] | DELETE | SERVER | — (tvil: admin sub-rute) |
| 24 | /api/admin/notifications | GET | SERVER | — (tvil: admin sub-rute) |
| 25 | /api/admin/observability/heatmap | GET | SERVER | — (tvil: admin sub-rute) |
| 26 | /api/admin/observability/metrics | GET | SERVER | — (tvil: admin sub-rute) |
| 27 | /api/admin/observability/traces | GET | SERVER | — (tvil: admin sub-rute) |
| 28 | /api/admin/overview | GET | BRUKT | app/admin/dashboard/page.tsx |
| 29 | /api/admin/resonance | GET | BRUKT | app/admin/resonance/page.tsx |
| 30 | /api/admin/security/overview | GET | SERVER | — (tvil: admin sub-rute) |
| 31 | /api/admin/session | GET | SERVER | — (tvil: admin sub-rute) |
| 32 | /api/admin/setup | POST | SERVER | — (tvil: admin sub-rute) |
| 33 | /api/admin/stats | GET | SERVER | — (tvil: admin sub-rute) |
| 34 | /api/admin/system/errors | GET | SERVER | — (tvil: admin sub-rute) |
| 35 | /api/admin/system-logs | GET | BRUKT | app/admin/logs/page.tsx; app/admin/system/page.tsx |
| 36 | /api/admin/system/logs | GET | SERVER | — (tvil: admin sub-rute) |
| 37 | /api/admin/system-message | GET | SERVER | — (tvil: admin sub-rute) |
| 38 | /api/admin/system/overview | GET | SERVER | — (tvil: admin sub-rute) |
| 39 | /api/admin/system/rate-limits | GET | SERVER | — (tvil: admin sub-rute) |
| 40 | /api/admin/system/realtime | GET | SERVER | — (tvil: admin sub-rute) |
| 41 | /api/admin/users/[id] | PATCH | BRUKT | app/admin/users/page.tsx |
| 42 | /api/admin/users | GET | BRUKT | app/admin/users/page.tsx |
| 43 | /api/analytics/track | GET,POST | BRUKT | components/analytics/AnalyticsProvider.tsx |
| 44 | /api/auth/[...nextauth] | GET,POST | EKSTERN | NextAuth (app/api/auth/phone/send, verify, request-reset, test-login, vipps, dev-login, login, dashboard, chat, e2e) |
| 45 | /api/auth/phone/send | POST | SERVER | — (tvil; kun rate-limit-konfig) |
| 46 | /api/auth/phone/verify | POST | SERVER | — (tvil; kun rate-limit-konfig) |
| 47 | /api/auth/request-reset | POST | SERVER | — (tvil) |
| 48 | /api/auth/test-login | POST | SERVER | — (tvil) |
| 49 | /api/auth/vipps/authorize | GET | EKSTERN | Vipps OAuth (e2e-test; ekstern redirect-init) |
| 50 | /api/auth/vipps/callback | GET | EKSTERN | Vipps OAuth (ekstern redirect; kaller: vipps/authorize) |
| 51 | /api/chat/conversation/[conversationId] | GET | BRUKT | app/chat/[id]/ChatPageClient.tsx |
| 52 | /api/chat/conversations | GET | BRUKT | app/chat/page.tsx |
| 53 | /api/chat/image | POST | BRUKT | app/chat/components/ChatContainer.tsx |
| 54 | /api/chat/messages | GET | BRUKT | app/chat/context/ChatContext.tsx; hooks/useChatMessages.ts |
| 55 | /api/chat/send | POST | BRUKT | app/chat/context/ChatContext.tsx; hooks/useSendMessage.ts |
| 56 | /api/chat/typing | POST | BRUKT | components/chat/ChatRoom.tsx |
| 57 | /api/conversation/create | POST | SERVER | — (tvil) |
| 58 | /api/cron/health | GET | EKSTERN | Ekstern overvåking (UptimeRobot m.fl.) |
| 59 | /api/cron/journey | GET | EKSTERN | Vercel cron (0 4 * * * UTC) |
| 60 | /api/cron/matching | GET | EKSTERN | Vercel cron (0 2 * * * UTC) |
| 61 | /api/dashboard/overview | GET | BRUKT | app/dashboard/context/DashboardContext.tsx |
| 62 | /api/dashboard | GET | BRUKT | app/dashboard/context/DashboardContext.tsx |
| 63 | /api/dev/setup | POST,GET | SERVER | — (tvil) |
| 64 | /api/dev-login | GET,POST | BRUKT | app/dev-login/page.tsx; lib/auth/config.ts |
| 65 | /api/dev-login/status | GET | BRUKT | app/dev-login/page.tsx |
| 66 | /api/dev-login/users | GET | BRUKT | app/dev-login/page.tsx |
| 67 | /api/journey/check | GET | SERVER | — (tvil) |
| 68 | /api/journey/exit | POST | BRUKT | app/dashboard/page.tsx; app/reisen/avslutning/page.tsx; components/chat/ChatHeader.tsx |
| 69 | /api/journey/progress/advance | POST | SERVER | — (tvil) |
| 70 | /api/journey/progress | GET | BRUKT | app/chat/[id]/ChatPageClient.tsx |
| 71 | /api/journey/queue | POST,DELETE | BRUKT | app/betaling/page.tsx; app/onboarding/OnboardingFlow.tsx; components/dashboard/WaitingForMatch.tsx |
| 72 | /api/journey/reflect | POST | SERVER | — (tvil) |
| 73 | /api/journey/reset | POST,GET | SERVER | — (tvil) |
| 74 | /api/journey/resonance | GET | SERVER | — (tvil) |
| 75 | /api/journey/status | GET | BRUKT | app/dashboard/page.tsx |
| 76 | /api/journey/today | GET | BRUKT | components/journey/TodayCard.tsx; app/admin/journey-content/page.tsx |
| 77 | /api/match/[id]/complete | PUT,GET | SERVER | — (tvil; lib/api.ts kaller /api/match/${id}) |
| 78 | /api/match/breakdown | GET | BRUKT | components/MatchBreakdown.tsx |
| 79 | /api/match/check | POST | BRUKT | app/dashboard/page.tsx |
| 80 | /api/match | GET | BRUKT | app/dashboard/page.tsx; app/matching/page.tsx; components/* (6 filer) |
| 81 | /api/match/score | POST | SERVER | — (tvil) |
| 82 | /api/match/status | GET | BRUKT | components/DashboardMatchStatus.tsx |
| 83 | /api/notifications/[id]/read | POST | SERVER | app/api/system/mark-read/route.ts |
| 84 | /api/notifications | GET,POST | SERVER | app/api/system/mark-read/route.ts |
| 85 | /api/onboarding/complete | POST | SERVER | — (tvil) |
| 86 | /api/onboarding/draft | POST,GET | BRUKT | app/onboarding/OnboardingFlow.tsx |
| 87 | /api/onboarding/progress | GET | SERVER | — (tvil) |
| 88 | /api/onboarding/save | POST | BRUKT | hooks/useAutoSaveForm.ts |
| 89 | /api/presence/get/[id] | GET | BRUKT | hooks/usePresence.ts |
| 90 | /api/presence/update | PATCH | BRUKT | app/chat/components/ChatContainer.tsx |
| 91 | /api/profile/me | GET | BRUKT | app/profile/page.tsx |
| 92 | /api/profile | GET,PUT | BRUKT | app/onboarding/OnboardingFlow.tsx; app/profile/page.tsx |
| 93 | /api/profile/setup | POST | BRUKT | app/onboarding/OnboardingFlow.tsx |
| 94 | /api/questions/[category] | GET | SERVER | app/api/questions/categories/route.ts |
| 95 | /api/questions/categories | GET | SERVER | — (tvil) |
| 96 | /api/questions | GET | BRUKT | app/chat/components/BliKjentPanel.tsx |
| 97 | /api/relationship/digest | GET | BRUKT | components/relationship/WeeklyDigest.tsx |
| 98 | /api/relationship/memories | GET,POST | BRUKT | components/relationship/Memories.tsx |
| 99 | /api/relationship/milestones | GET,POST | BRUKT | components/relationship/MilestoneCard.tsx |
| 100 | /api/relationship/timeline | GET,POST | BRUKT | components/relationship/Timeline.tsx |
| 101 | /api/report | POST,GET,PATCH | BRUKT | app/admin/reports/page.tsx; components/chat/ChatHeader.tsx |
| 102 | /api/settings/delete-account | DELETE | SERVER | — (tvil) |
| 103 | /api/settings/export | GET | SERVER | — (tvil) |
| 104 | /api/settings/preferences | GET,POST | SERVER | — (tvil) |
| 105 | /api/system/cron-health | GET | SERVER | — (tvil) |
| 106 | /api/system/health | GET | BRUKT | app/admin/dashboard/page.tsx; app/admin/system/page.tsx; app/admin/system/status/page.tsx |
| 107 | /api/system/latency | GET | BRUKT | app/admin/system/status/page.tsx |
| 108 | /api/system/mark-read | POST | BRUKT | components/NotificationCenter.tsx |
| 109 | /api/system/messages | GET,POST | BRUKT | components/NotificationCenter.tsx |

## Merknader

- **SERVER-kategorien (46):** De fleste er admin sub-ruter som sannsynligvis kalles fra admin-komponenter via dynamiske URLer eller fra andre API-ruter. De 9 ikke-admin SERVER-rutene er journey/match/settings-ruter som sannsynligvis kalles fra serverkomponenter eller som er designet for fremtidig bruk. **Ingen er bekreftet døde.**
- **EKSTERN (6):** NextAuth, Vipps (2), cron (2), ekstern overvåking (1). Disse kalles aldri fra klientkode — en `fetch()`-basert vakt ville merket dem som døde.
- **UBRUKT: 0.** Ved minste tvil klassifisert som SERVER.
