# ToSom — Hvordan deploye (10-stegs prosess)

**Opprettet:** 2026-06-22  
**Status:** Første versjon

---

## 10-stegs deploy-prosess

### 1. Kjør lint
```bash
npm run lint
```
- Sjekk at det er ingen errors (bare eksisterande warnings er OK)

### 2. Bygg lokalt
```bash
npm run build
```
- Sjekk at build går rein (ingen errors)

### 3. Test i dev (valfritt)
```bash
npm run dev
```
- Test `/`, `/login`, `/onboarding`, `/dashboard` lokalt

### 4. Commit endringer
```bash
git add -A
git commit -m "Kort beskrivelse av endringer"
```

### 5. Push til main
```bash
git push origin main
```

### 6. Vent på Vercel deploy
- Vercel auto-deplar fra main-branch
- Sjekk Vercel dashboard: https://vercel.com/GeorgeMasterSplinter/tosom
- Vent på at build blir green (✅)

### 7. Kjøre smoke-tester på prod
```bash
curl -s -o /dev/null -w "%{http_code}" https://tosom.no
curl -s -o /dev/null -w "%{http_code}" https://tosom.no/login
curl -s -o /dev/null -w "%{http_code}" https://tosom.no/dashboard
```

### 8. Test i browser (prod)
- Gå til `https://tosom.no`
- Test landing page (hero, CTA, footer)
- Test login med magic link
- Test dashboard (dersom innlogga)

### 9. Roll tilbake ved feil
```bash
# Sjekk deploy-loggar i Vercel dashboard
# Finn previous good commit
git revert <bad-commit-hash>
git push origin main
```

### 10. Monitor etter 24 timer
- Sjekk Vercel analytics: latency, errors
- Sjekk Sentry (dersom aktivt): exception rate
- Sjekk email-del (dersom magic link fungerer)

---

## Environment variables (Vercel)

Desse må være set i Vercel dashboard:

| Variabel | Verdi |
|----------|---|----|
| `NEXTAUTH_URL` | `https://tosom.no` |
| `NEXTAUTH_SECRET` | Random 32+ chars |
| `DATABASE_URL` | PostgreSQL connection string |
| `NODE_ENV` | `production` |
| `EMAIL_SERVER_HOST` | SMTP host (Resend/eth) |

---

## Pre-deploy checklist

- [ ] `npm run lint` → clean
- [ ] `npm run build` → clean
- [ ] Alle commits pushed
- [ ] Environment variables i Vercel
- [ ] Vercel build green (✅)

---

## Post-deploy checklist

- [ ] Landing page laster (/)
- [ ] Login-side laster (/login)
- [ ] Dashboard lastar (/dashboard)
- [ ] Magic link fungerer
- [ ] Ingen nye errors i Vercel logs