# 🟡 ToSom — Deploy Checklist (Vercel)

## 📋 Pre-Deploy

### Code Quality
- [x] TypeScript compilation: `npx tsc --noEmit` → EXIT_CODE: 0 ✅
- [x] ESLint: `npm run lint` → ingen feil
- [x] Git status: 262 files changed, +5108/-15026

### Ny/Fornyede Filer
- [x] `app/chat/components/ChatContainer.tsx` — V2 rebuild (rolig/lett/premium)
- [x] `app/chat/components/MessageBubble.tsx` — Unified renderer
- [x] `app/chat/context/ChatContext.tsx` — Global state
- [x] `app/chat/page.tsx` — Rot-side med empty-state
- [x] `app/chat/[id]/page.tsx` — Dynamisk chat-side
- [x] `app/onboarding/components/OnboardingSlide.tsx` — max-w-2xl standardisert
- [x] `styles/globals.css` — bubblePop + fade-in animasjonar

### Viktige Endringer
- [x] Chat V2: lysare bakgrunn, minimal header, luftige meldinger, transparent input
- [x] Onboarding breidd: max-w-2xl (672px) same som Settings
- [x] Fjernede obsolete filer (chat/api/chat/*, conversation/*, onboarding/steps/*)

---

## 🚀 Deploy til Vercel

### Steg 1: Push til GitHub
```bash
git add .
git commit -m "feat: chat V2 rebuild, onboarding breidd standardisert, deploy-prep"
git push origin main
```

### Steg 2: Environment Variables (må settes på Vercel)
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://tosom.no
NEXT_PUBLIC_APP_URL=https://tosom.no
NEXT_PUBLIC_API_URL=https://api.tosom.no
NEXT_PUBLIC_OPENAI_API_KEY=sk-...
REDIS_URL=redis://...
```

### Steg 3: Vercel Deploy
1. Gå til https://vercel.com/dashboard
2. Import repo (dersom ikke allerede importert)
3. Environment variables → legg til alle .env.prod verdier
4. Deploy — skal byggje automatisk

---

## ✅ Post-Deploy Sjekkliste

### Mobil-sjekk (iOS/Android)
- [ ] Onboarding-flow: alle 10 steg fungerer
- [ ] Settings-side: alle seksjonar synlege
- [ ] Dashboard: match-cards og statistikk
- [ ] Chat: vis layout (chat er ikke helt klar ennå)

### Desktop-sjekk
- [ ] Onboarding-slide breidd: 672px max-w ✅
- [ ] Settings breidd: same som onboarding ✅
- [ ] Dashboard: responsive cards ✅
- [ ] Admin: tilgjengeleg for admin-brukere

### API-sjekk
- [ ] /api/auth/* — login fungerer
- [ ] /api/onboarding/* — save/progress/complete
- [ ] /api/match/* — fetch/accept/status
- [ ] /api/dashboard/* — overview data
- [ ] /api/journey/* — progress/resonance/today

### Kritiske Sider (må fungere)
1. `/` — Landing page ✅
2. `/login` — Magic link login ✅
3. `/register` — Registration ✅
4. `/onboarding` — 9-stegs onboarding ✅
5. `/dashboard` — Dashboard med match og statistikk ✅
6. `/settings` — Brukarsinnstillingar ✅
7. `/journey` — Reiseside ✅

### Ukjente/Utsettte Problem
- [ ] Chat: `app/chat/page.tsx` fungerer med mock-data (dev-mode)
- [ ] Chat: Echte conversations krev funksjonelle API-endpoint
- [ ] Chat: Bilde-deling etter 14 dager ikke implementert ennå

---

## 📊 Deploy-fakta

| Verdi | Verdi |
|-------|-------|
| Files changed | 262 |
| +lines | 5108 |
| -lines | 15026 |
| Netto endring | -9918 lines (rening) |
| TypeScript | ✅ EXIT_CODE: 0 |
| npm build | ✅ (ventar på deploy) |

---

## 🟡 Status Chat

**Chat er IKKE helt klar for production ennå.** Men:
- Mock-data fungerer med `/chat/dev-conversation`
- Layout og design er premium og rolig
- Echte API-endpoint (`/api/chat/messages`, `/api/chat/send`) eksisterer
- DB-DB-kommunikasjon må testast med ekte data

**Anbefaling:** Deploy allerede, men sett `chat` til "under utvikling" i UIet.