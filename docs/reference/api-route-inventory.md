# TOSOM — API-ruter (levende inventar)

**Generert:** 2026-08-24, commit `1c454d5` — fra faktisk kode (`app/api/**/route.ts`), ikke fra dokumentasjon.
**Totalt:** 116 ruter. 2 scheduled crons i `vercel.json` (`matching` lørdag 02:00 UTC, `journey` daglig 04:00 UTC); `health` er manuell helse-rute.

> Denne tabellen er en gjengivelse av koden. Legger du til eller endrer en rute, oppdater tabellen i samme commit. Eldre klassifisering (BRUKT/SERVER/EKSTERN, 109 ruter) ligger i git-historikken (docs/reference/api-route-inventory.md v2026-08-16).

| # | Rute | Metoder |
|---|------|---------|
| 1 | `/admin/ai/logs` | GET |
| 2 | `/admin/analytics` | GET |
| 3 | `/admin/auth` | POST |
| 4 | `/admin/conversation/[id]/freeze` | POST |
| 5 | `/admin/conversation/[id]` | GET |
| 6 | `/admin/conversation/[id]/unlock` | POST |
| 7 | `/admin/conversations` | GET |
| 8 | `/admin/journey-content/[day]` | PATCH |
| 9 | `/admin/journey-content` | GET |
| 10 | `/admin/journey-stats` | GET |
| 11 | `/admin/journey/[id]/complete` | POST |
| 12 | `/admin/journey/[id]/next-step` | POST |
| 13 | `/admin/journey/[id]/reset` | POST |
| 14 | `/admin/journeys` | GET |
| 15 | `/admin/logout` | DELETE |
| 16 | `/admin/matches/[id]/inspector` | GET |
| 17 | `/admin/matches/[id]/reset` | POST |
| 18 | `/admin/matches/[id]/review` | POST |
| 19 | `/admin/matches/[id]/unmatch` | POST |
| 20 | `/admin/matches` | GET |
| 21 | `/admin/matching-rounds` | GET |
| 22 | `/admin/metrics` | GET |
| 23 | `/admin/notification/[id]` | DELETE |
| 24 | `/admin/notifications` | GET |
| 25 | `/admin/observability/heatmap` | GET |
| 26 | `/admin/observability/metrics` | GET |
| 27 | `/admin/observability/traces` | GET |
| 28 | `/admin/overview` | — |
| 29 | `/admin/resonance` | GET |
| 30 | `/admin/run-matching` | POST |
| 31 | `/admin/security/overview` | GET |
| 32 | `/admin/session` | GET |
| 33 | `/admin/setup` | POST |
| 34 | `/admin/stats` | GET |
| 35 | `/admin/system-logs` | GET |
| 36 | `/admin/system-message` | GET |
| 37 | `/admin/system/errors` | GET |
| 38 | `/admin/system/logs` | GET |
| 39 | `/admin/system/overview` | GET |
| 40 | `/admin/system/rate-limits` | GET |
| 41 | `/admin/system/realtime` | GET |
| 42 | `/admin/users/[id]` | PATCH, DELETE |
| 43 | `/admin/users` | GET |
| 44 | `/analytics/track` | GET, POST |
| 45 | `/auth/[...nextauth]` | — |
| 46 | `/auth/phone/send` | POST |
| 47 | `/auth/phone/verify` | POST |
| 48 | `/auth/request-reset` | POST |
| 49 | `/auth/test-login` | POST |
| 50 | `/auth/vipps/authorize` | GET |
| 51 | `/auth/vipps/callback` | — |
| 52 | `/beta/invite/request` | POST |
| 53 | `/beta/invites` | GET, POST |
| 54 | `/chat/conversation/[conversationId]` | GET |
| 55 | `/chat/conversations` | GET |
| 56 | `/chat/image/[messageId]` | GET |
| 57 | `/chat/image` | — |
| 58 | `/chat/messages` | — |
| 59 | `/chat/mood` | PATCH |
| 60 | `/chat/send` | — |
| 61 | `/chat/typing` | POST |
| 62 | `/conversation/create` | POST |
| 63 | `/cron/health` | GET |
| 64 | `/cron/journey` | GET |
| 65 | `/cron/matching` | GET |
| 66 | `/dashboard/overview` | GET |
| 67 | `/dashboard` | GET |
| 68 | `/dev-login` | GET, POST |
| 69 | `/dev-login/status` | GET |
| 70 | `/dev-login/users` | GET |
| 71 | `/dev/setup` | GET, POST |
| 72 | `/journey/check` | GET |
| 73 | `/journey/exit` | POST |
| 74 | `/journey/export-pdf` | GET |
| 75 | `/journey/progress/advance` | POST |
| 76 | `/journey/progress` | GET |
| 77 | `/journey/queue` | — |
| 78 | `/journey/reflect` | POST |
| 79 | `/journey/reset` | GET, POST |
| 80 | `/journey/resonance` | GET |
| 81 | `/journey/status` | GET |
| 82 | `/journey/today` | — |
| 83 | `/match/[id]/complete` | GET, PUT |
| 84 | `/match/breakdown` | GET |
| 85 | `/match/check` | POST |
| 86 | `/match` | GET |
| 87 | `/match/score` | POST |
| 88 | `/match/status` | — |
| 89 | `/notifications/[id]/read` | POST |
| 90 | `/notifications` | GET, POST |
| 91 | `/onboarding/complete` | POST |
| 92 | `/onboarding/draft` | GET, POST, DELETE |
| 93 | `/onboarding/prefill` | GET |
| 94 | `/onboarding/progress` | GET |
| 95 | `/onboarding/save` | — |
| 96 | `/presence/get/[id]` | GET |
| 97 | `/presence/update` | PATCH |
| 98 | `/profile/me` | GET |
| 99 | `/profile` | GET, PUT |
| 100 | `/profile/setup` | — |
| 101 | `/questions/[category]` | GET |
| 102 | `/questions/categories` | GET |
| 103 | `/questions` | GET |
| 104 | `/relationship/digest` | GET |
| 105 | `/relationship/memories` | GET, POST |
| 106 | `/relationship/milestones` | GET, POST |
| 107 | `/relationship/timeline` | GET, POST |
| 108 | `/report` | GET, POST, PATCH |
| 109 | `/settings/delete-account` | DELETE |
| 110 | `/settings/export` | GET |
| 111 | `/settings/preferences` | GET, POST |
| 112 | `/system/cron-health` | GET |
| 113 | `/system/health` | GET |
| 114 | `/system/latency` | GET |
| 115 | `/system/mark-read` | POST |
| 116 | `/system/messages` | GET, POST |