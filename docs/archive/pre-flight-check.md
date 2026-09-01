# ToSom Pre-Flight Check

## Formål
Dokumentet skal fyllest ut manuelt før ToSom settest i produksjon. Hver linje må ha status OK eller FEIL.

---

## 1. READINESS_FOR_PROD

| Felt | Verdi |
|--|--|
| READINESS_FOR_PROD | false |
| Sist oppdatert | 08.06.2026 |
| Godkjent av | George Iulian Stanica |

**Må være true før du gjer vidare.**

---

## 2. Backup og Restore

| Komponent | Status | Merknad |
|--|--|--|
| Dagleg backup kjører | OK | |
| Dagleg backup verifisert (filstorleik > 0) | OK | |
| Restore testet manuelt | OK | |
| retention-policy korrekt (30 dager) | OK | |
| dbBackup.sh testet | OK | |
| dbRestore.sh testet | OK | |

---

## 3. Prod-miljø

| Komponent | Status | Merknad |
|--|--|--|
| DATABASE_URL (egen prod-DB) | FEIL | |
| DATABASE_URL testkopla | FEIL | psql -h prod-db -c 'SELECT 1' |
| NEXTAUTH_SECRET sett | FEIL | Unik streng, minst 32 karakter |
| NEXTAUTH_URL korrekt | FEIL | https://tosom.no |
| AI-nøkler (ekte med høg kvote) | FEIL | |
| AI API-test fungerer | FEIL | curl mot AI-endepunkt |
| HTTPS aktiv | FEIL | curl -I https://tosom.no |
| HSTS aktiv (max-age >= 31536000) | FEIL | |
| TLS versjon >= 1.2 | FEIL | |
| Security headers (CSP, X-Frame, etc.) | FEIL | |
| SSH-tilgang til server | FEIL | ssh root@prod-server.tosom.no |
| SSH-tilgang tester | FEIL | ls /opt/tosom |
| Environment variablar i secrets-manager | FEIL | |
| prod-config.json lasta inn | FEIL | |

---

## 4. Docker Build

| Komponent | Status | Merknad |
|--|--|--|
| Docker versjon >= 24 | OK | docker --version |
| Docker build fungerer | OK | docker build -f deploy/docker/Dockerfile . |
| Image size < 1GB | OK | docker images tosom |
| Image scan (ingen kritiske CVE) | OK | dockerscan eller liknande |
| Image pushed til registry | OK | docker push registry.tosom.no/tosom:prod |
| Registry tilgjengeleg | OK | docker pull registry.tosom.no/tosom:prod |

---

## 5. Migreringar

| Komponent | Status | Merknad |
|--|--|--|
| prisma migrate deploy køyrer | OK | docker run prisma migrate deploy |
| Alle tabellar eksisterer | OK | SELECT count(*) FROM users; |
| Ingen nye migrations pending | OK | prisma migrate status |
| Direct URL fungerer | OK | DIRECT_URL testkopla |
| Migration backup gjort | OK | Før siste migrering |

---

## 6. Domene og SSL

| Komponent | Status | Merknad |
|--|--|--|
| tosom.no peiker på prod-IP | FEIL | nslookup tosom.no |
| api.tosom.no peiker på prod-IP | FEIL | nslookup api.tosom.no |
| SSL-sertifikat gyldig | FEIL | openssl s_client -connect tosom.no:443 |
| SSL-sertifikat ikke utgår | FEIL | < 30 dager att |
| Auto-renewal aktiv | FEIL | letsencrypt eller liknande |
| DNS-propagering fullført | FEIL | dig tosom.no |

---

## 7. Server-tilgang

| Komponent | Status | Merknad |
|--|--|--|
| SSH tilgang (root) | OK | ssh root@prod-server.tosom.no |
| SSH tilgang (tosom-bruker) | OK | ssh tosom@prod-server.tosom.no |
| Docker kan køyrast | OK | docker run hello-world |
| Ports 3000 og 443 opne | OK | curl https://api.tosom.no:3000 |
| Firewall reglar aktive | OK | ufw status eller liknande |
| DB-tilgang fra server | OK | psql -h prod-db -U tosom_prod |
| Diskrom > 20% ledig | OK | df -h |
| Minne > 20% ledig | OK | free -h |
| CPU-load < 50% | OK | uptime eller top |

---

## 8. Quick Check (post-deploy)

| Komponent | Status | Merknad |
|--|--|--|
| Healthcheck returnerer 200 | OK / FEIL | curl https://api.tosom.no/api/system/health |
| Smoke tests alle OK | OK / FEIL | npx tsx scripts/smoke/smokeTest.ts |
| Admin dashboard fungerer | OK / FEIL | curl + admin token mot system/overview |
| Observability viser data | OK / FEIL | curl + admin token mot metrics |
| Security dashboard viser data | OK / FEIL | curl + admin token mot security/overview |
| AI-endepunkt krev auth (401) | OK / FEIL | curl uten token mot AI-endepunkt |
| QuickCheck.ts alle OK | OK / FEIL | npx tsx scripts/monitoring/quickCheck.ts |

---

## 9. Oppsummering

| Kategori | Status |
|--|--|
| READINESS_FOR_PROD | false |
| Backup & Restore | OK |
| Prod-miljø | FEIL |
| Docker Build | OK |
| Migreringar | OK |
| Domene & SSL | FEIL |
| Server-tilgang | OK |
| Quick Check | OK / FEIL |

### Total status

**PRE_FLIGHT_OK = false**

Må være true for å starte deploy. Alle komponentar over må være "OK" før deploy kan startast.

---

## 10. Godkjenning

| Roll | Namn | Signatur | Dato |
|--|--|--|--|
| Tech Lead | George Iulian Stanica | George Iulian Stanica | 08.06.2026 |
| DevOps | George Iulian Stanica | George Iulian Stanica | 08.06.2026 |
| CTO | George Iulian Stanica | George Iulian Stanica | 08.06.2026 |

---

## 11. Deploy-loggbok

| Dato | Kl | Handling | Av | Merknad |
|--|--|--|--|--|
| | | | | |
| | | | | |
| | | | | |

---

## 12. Post-Deploy Status

| Felt | Verdi |
|--|--|
| DEPLOY_OK | false |
| POST_DEPLOY_OK | false |
| LAUNCH_APPROVED | false |
| LAUNCH_SUCCESS | false |
| Deploy start kl | |
| Deploy slutt kl | |
| Deploy av | |
| Merknader | |

Set alle til true når deploy er fullført og verifisert i 24 timar.

---

## 13. Sprint 0 — Dag 2 Verifikasjon

### Prod-miljø verifikasjon

Kommandoar som må køyrast manuelt:

1. cat /opt/tosom/.env
2. nslookup tosom.no
3. nslookup api.tosom.no
4. curl -I https://tosom.no
5. curl -X POST https://api.tosom.no/api/ai/test
6. openssl s_client -connect tosom.no:443

### Domene & SSL — Verifikasjon

Kommandoar:

1. openssl s_client -connect tosom.no:443
2. curl -I https://tosom.no
