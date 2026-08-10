# ToSom Produksjonsmiljø

## 1. Formål
Dette dokumentet beskriver produksjonsmiljøet for ToSom. Det inneholder alle miljøvariabler, sikkerheitskrav, og konfigurasjon som trengst for drift i produksjon.

---

## 2. Miljøvariablar

### Database
| Variabel | Verdi | Krav |
|--|--|--|
| `DATABASE_URL` | `postgresql://tosom_prod:<password>@prod-db-host:5432/tosom_prod` | Ekte produksjons-DB, kryptert i secrets |
| `DIRECT_URL` | `postgresql://tosom_prod:<password>@prod-db-host:5432/tosom_prod` | Direkte tilkopling for migreringar |

### Auth
| Variabel | Verdi | Krav |
|--|--|--|
| `NEXTAUTH_SECRET` | Tilfeldig generert streng (minst 32 karakterar) | Unik for produksjon, aldri i git |
| `NEXTAUTH_URL` | `https://tosom.no` | Produksjons-frontend URL |

### AI
| Variabel | Verdi | Krav |
|--|--|--|
| `AI_API_KEY` | Ekte AI-provider nøkkel | Prod-nøkkel med høg kvote |
| `AI_BASE_URL` | AI-provider base URL | Prod-endepunkt |

### Logging
| Variabel | Verdi | Krav |
|--|--|--|
| `LOG_LEVEL` | `info` | Aktiv logging i prod |
| `NODE_ENV` | `production` | Production-modus |

### Environment
| Variabel | Verdi | Krav |
|--|--|--|
| `TOSOM_ENV` | `production` | Kjent for app-logikk |
| `API_BASE_URL` | `https://api.tosom.no` | Produksjons-API URL |
| `FRONTEND_BASE_URL` | `https://tosom.no` | Produksjons-frontend URL |
| `PORT` | `3000` | Standard port |
| `NODE_TLS_REJECT_UNAUTHORIZED` | `0` | Berre ved behov for interne cert |

---

## 3. Sikkerheitskrav

### Database
- Ekte produksjons-DB (ikkje pre-prod eller lokal)
- Kryptert med TDE eller volum-encrypting
- Tilgang berre frå app-server IP
- Daglege automasjonar backups

### AI-nøklar
- Ekte produksjons-AI-nøklar med høg kvote
- Aldri hardkoda eller i git
- Lagre i secrets-manager (Vault, AWS Secrets Manager, etc.)
- Rotasjon kvart 90. dag

### Andre krav
- HTTPS på alle endpoint
- HSTS med minst 1 år
- CSP med strict-policy
- Rate-limit aktivert med prod-nivå
- Security headers på alle svar

---

## 4. Logging-nivå

| Komponent | Nivå | Mål |
|--|--|--|
| SystemLog | `info` | Aktiv logging av alle hendingar |
| AIRequestLog | `info` | All AI-kall loggast |
| PerformanceMetric | `info` | All metrikk samlad |
| RateLimitHit | `info` | All rate-limit hendingar |
| AuditLog | `info` | All admin-handlinger |
| Auth log | `warn` | Berre feil og advarsler |

---

## 5. Base-URL

| Komponent | URL |
|--|--|
| API base URL | `https://api.tosom.no` |
| Frontend base URL | `https://tosom.no` |
| Healthcheck | `https://api.tosom.no/api/system/health` |
| Admin dashboard | `https://tosom.no/admin` |

---

## 6. HTTPS og HSTS

### HTTPS
- TLS 1.2 eller høgare
- Sertifikat frå gyldig CA (Let's Encrypt eller kommersiell)
- Automatisk rotasjon

### HSTS
- `max-age=31536000` (1 år)
- `includeSubDomains`
- `preload`

### HTTP Headers (prod)
| Header | Verdi |
|--|--|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none'` |
| `X-XSS-Protection` | `1; mode=block` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |

---

## 7. Verifisering

### Sjekkliste før deploy
- [ ] Alle miljøvariablar er sette i secrets-manager
- [ ] Database er produksjons-DB (ikkje test)
- [ ] AI-nøkkel er ekte med høg kvote
- [ ] HTTPS er aktiv med gyldig sertifikat
- [ ] HSTS er konfigurert med max-age >= 31536000
- [ ] Security headers er aktive (curl-test)
- [ ] Rate-limit er aktiv med prod-nivå
- [ ] Logging er på info-nivå

---

## 8. Miljøstatus

| Felt | Verdi |
|--|--|
| PROD_ENV_READY | false |
| Sist verifisert | |
| Verifisert av | |

Set `PROD_ENV_READY` til `true` når alle krav over er oppfylde.
