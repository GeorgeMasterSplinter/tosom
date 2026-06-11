# Post-Deploy Monitoring (6 hours)

## 1. Purpose

Etter deploy til produksjon er dei første 6 timene kritiske. Systemet må overvâkast kontinuerleg for å oppdage problem tidleg, sikre at alle komponentar fungerer som forventet, og verifisere at deployen var suksessfull.

## 2. Monitoring Window

Total varigheit: 6 timer etter deploy.

Alle sjekkpunkt må vere OK innan 6 timar for å gå vidare til 24-timers overvåking.

## 3. Checklist (time-based)

| Tid | Sjekk | Mål |
|--|--|--|
| +0 min | Health-check grønt | Alle 3 endpoints svarar (200 OK) |
| +5 min | Error-rate < 1% | Ingen critical errors |
| +15 min | DB-latens < 50ms p95 | Database OK |
| +30 min | AI-kostnad < $5/time | AI-kostnad OK |
| +1 time | CPU/memory < 70% | Ressursar OK |
| +2 timer | Login-flow test | Auth fungerer |
| +3 timer | Match-flow test | Matching fungerer |
| +4 timer | Messaging test | Samtaler fungerer |
| +6 timer | Full statusrapport | Fullstendig oversikt |

**Når alle 9 sjekkpunkt er OK og ingen critical/high-feil:**
→ Set `POST_DEPLOY_OK = true` i seksjon 6
→ Vent på 24-timers full overvåking før LAUNCH_APPROVED

## 4. Metrics to Watch

- **Error-rate:** Mål < 1%. Alarm ved > 5%. Sjekk /admin/observability/metrics.
- **Latency (API + DB):** API p95 < 500ms. DB < 50ms. Alarm ved > 2x mål.
- **AI-kostnad:** Mål < $50/dag (< $5/time). Alarm ved > 2x forventet.
- **CPU/memory:** Mål < 70%. Alarm ved > 85% CPU eller > 90% minne.
- **Rate-limit events:** Mål < 10/dag. Alarm ved > 50 i timen.
- **Auth-flow:** Login, register og 2FA må fungere utan feil.
- **Matching-flow:** Match-score og match-listing må returnere resultat.
- **Messaging-flow:** Send/mottak av meldingar må fungere i sanntid.

## 5. Incident Handling

Ved feil under overvåking:

1. **Critical (system nede):** Stop deploy umiddelbart. Følg rollback-prosedyra i deploy/README.md.
2. **High (error-rate > 5%):** Informer Tech Lead innan 15 min. Analyze logs i /admin/system/errors.
3. **Medium (latens høg):** Informer Tech Lead innan 1 time. Sjekk DB og AI-provider.
4. **Low (advarsel):** Dokumenter og løys neste dag. Ingen umiddelbar handling krevst.

**Rollback-prosedyre:**
```bash
# Start forrige versjon
docker stop tosom-app
docker run -d --name tosom-app \
  -e DATABASE_URL="${DATABASE_URL}" \
  registry.tosom.no/tosom:$(git log -1 --format=%h)
# Verifiser healthcheck
curl https://api.tosom.no/api/system/health
```

## 6. Final Approval

| Felt | Verdi |
|--|--|
| POST_DEPLOY_OK | false |
| Overvåking start | |
| Overvåking slutt | |
| Verifisert av | |
| Merknader | |

**Set `POST_DEPLOY_OK = true` når alle metrikk er innanfor normal i 24 timar etter deploy.**

---

**LAUNCH_APPROVED = false** (set til true etter 24-timers overvåking utan critical/high-feil)
