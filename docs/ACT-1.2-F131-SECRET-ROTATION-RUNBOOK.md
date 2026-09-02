# ACT 1.2 — F-131-01 (KRITISK): Secrets i git-historikk — rotasjon + historikk-rens

Status: KARTLEGGING FERDIG · ROTASJONSPLAN FERDIG · UTFØRELSE BLOKKERT (krever George + leverandør-tilgang)
Dato: 2026-09-01 · Forfatter: MasterSplinter
Kobling: `docs/ACT-STATE.json` (funnregister F-131-01 / F-132-01) · GEORGE.md §8/§11

---

## 1. Forensikk — hva som ligger i git-historikken (read-only, verdier maskert)

Remote: `origin = https://github.com/GeorgeMasterSplinter/tosom.git` (GitHub, 1 remote).
Brancher: `main`, `backup/pre-roadmap`, `wip/chat-moods-and-blocking`.

To env-filer har vært commit-et med reelle secrets (~2026-04 til 2026-08-25):

| Fil | Status nå | Secrets i historikken (variablenavn) |
|-----|-----------|--------------------------------------|
| `.env` | untracked | NEXTAUTH_SECRET, EMAIL_SERVER_PASSWORD, ADMIN_PASSWORD, UPLOADTHING_TOKEN, AI_API_KEY, DATABASE_URL, DIRECT_URL |
| `.env.prod` | fjernet fra tracking 2026-08-10 (af4fcad), i ≥2 commits før | + CRON_SECRET, PUSHER_SECRET, PUSHER_KEY, VIPPS_PAYMENT_CLIENT_SECRET, ADMIN_EMAIL, ADMIN_USERNAME |

`.env.local` — aldri i historikken (rent). `.env.test`/`.env.example` — kun placeholder (ikke secrets).

Reelle tjenester referert i env-historikken (maskert, ingen verdier): `prisma.io` (DB), `resend` (e-post), `pusher` (realtime), `uploadthing` (lagring).

**Konklusjon:** Minst 9 distinkte secrets er eksponert i historikken. Standard respons: **anta at alle er kompromitterte → rotér alle** (kan ikke bekrefte om noen er rotert siden siste commit).

---

## 2. Rotasjonsplan (per secret)

Prioritet: (1) leverandør-baserte først (de draper de eksponerte verdiene), (2) selv-rotasjon, (3) NEXTAUTH_SECRET sist (slår ut alle sesjoner — koordiner timing).

| # | Secret (var) | Provider | Rotér HVA + HVAR | Vercel | Lokal .env | Effekt |
|---|--------------|----------|------------------|--------|-----------|--------|
| 1 | DB (DATABASE_URL, DIRECT_URL) | Prisma/Neon (prisma.io) | Ny DB-passord/credential i Neon-konsollen (eller ny rolle) | `vercel env rm` + `add` (begge) | Oppdater | App ned i byttevindu |
| 2 | E-post (EMAIL_SERVER_PASSWORD) | Resend | Revoke + ny API-nøkkel i Resend | `vercel env rm` + `add` | Oppdater | E-post ned i byttevindu |
| 3 | Realtime (PUSHER_SECRET/KEY) | Pusher | Regenerer secret i Pusher | `vercel env rm` + `add` | Oppdater | Server-side trigger |
| 4 | Lagring (UPLOADTHING_TOKEN) | UploadThing | Revoke + ny token | `vercel env rm` + `add` | Oppdater | Ny upload-sesjon |
| 5 | AI (AI_API_KEY) | (AI-leverandør) | Revoke + ny nøkkel | `vercel env rm` + `add` | Oppdater | AI ned i byttevindu |
| 6 | Vipps (VIPPS_PAYMENT_CLIENT_SECRET) | Vipps | Bekreft om den er reell; hvis ja rotér (selv om betaling er deaktivert) | (hvis satt) | Fjern/oppdater | Ingen (betaling av) |
| 7 | CRON_SECRET | selv | `openssl rand -base64 32` | `vercel env rm` + `add` | Oppdater | Cron-auth |
| 8 | Admin (ADMIN_PASSWORD_HASH) | selv | Nytt admin-passord → bcrypt(10) hash | `vercel env rm` + `add` | Oppdater; FJERN død ADMIN_PASSWORD (klartekst, F-122-02) | Admin logger inn med nytt passord |
| 9 | **NEXTAUTH_SECRET** (sensitiv timing) | selv | `openssl rand -base64 32` | `vercel env rm` + `add` (+AUTH_SECRET) | Oppdater | **SLÅR UT ALLE SESJONER** — kjør ved lav aktivitet |

Merk: ADMIN_EMAIL/ADMIN_USERNAME (i .env.prod-historikken) er credentials (semi) — roter admin-kontoen i #8.

---

## 3. Georges rotasjons-runbook (kjøres i ett vindu)

```bash
# 0) Backup (før alt)
git clone <repo> /tmp/tosom-pre-rotation   # full lokal kopi (backup/pre-roadmap finnes allerede)

# 1) DB (Neon-konsoll: endre passord/credential -> kopier ny DATABASE_URL + DIRECT_URL)
vercel env rm DATABASE_URL production && vercel env add DATABASE_URL production
vercel env rm DIRECT_URL  production && vercel env add DIRECT_URL  production

# 2) Resend (revoke + ny API-nøkkel)
vercel env rm EMAIL_SERVER_PASSWORD production && vercel env add EMAIL_SERVER_PASSWORD production

# 3) Pusher (regenerate secret)
vercel env rm PUSHER_SECRET production && vercel env add PUSHER_SECRET production

# 4) UploadThing (revoke + ny token)
vercel env rm UPLOADTHING_TOKEN production && vercel env add UPLOADTHING_TOKEN production

# 5) AI (revoke + ny nøkkel)
vercel env rm AI_API_KEY production && vercel env add AI_API_KEY production

# 6) Selv-rotasjon
CRON=$(openssl rand -base64 32)
vercel env rm CRON_SECRET production && vercel env add CRON_SECRET production <<< "$CRON"
NEWAUTH=$(openssl rand -base64 32)   # SISTE, lav aktivitet — invaliderer alle sesjoner
vercel env rm NEXTAUTH_SECRET production && vercel env add NEXTAUTH_SECRET production <<< "$NEWAUTH"
vercel env rm AUTH_SECRET  production && vercel env add  AUTH_SECRET  production  <<< "$NEWAUTH"
# Admin: nytt passord + hash  (node -e "console.log(require('bcrypt').hashSync('NYPASSORD',10))" -> ADMIN_PASSWORD_HASH)
vercel env rm ADMIN_PASSWORD_HASH production && vercel env add ADMIN_PASSWORD_HASH production

# 7) Redeploy
vercel redeploy production --yes
# 8) Oppdater lokal .env + .env.local med alle 9 nye verdier
# 9) Verifiser: logg inn som admin, test e-post, chat, upload
```
## 4. Git-historikk-omskrivning (filter-repo/BFG) — BESLUTTNINGS-GATE

**AVGJORT 2026-09-01: repo PRIVAT → historikk-omskrivning HOPPET OVER.** Rotasjon (avsnitt 3) er nok; lavest risiko. Detaljene nedenfor gjelder kun hvis repo senere deles/blir offentlig.

**Når trengs det?** Bare hvis repo er **delt med eksterne** eller **offentlig**. Hvis `GeorgeMasterSplinter/tosom` er PRIVAT + kun George: rotasjon (avsnitt 3) draper sekretene, og historikk-rens er valgfritt hardening (anbefalt: hopp over — lavest risiko).

- PRIVAT + kun George → **hopp over** historikk-omskrivning (rotasjon er nok).
- Delt/offentlig/eksterne med-workere → **MÅ** rewrite + force-push.

**Risiko (hvis rewrite):**
- Endrer ALLE commit-hash. Force-push til `origin/main`.
- `backup/pre-roadmap` + `wip/chat-moods-and-blocking` deler historikk → påvirkes (beskytt backup!).
- Alle med-workere må re-clone (ikke pull).
- Force-push til `main` triggerer CI (`push: branches:[main]`) → CD (`vercel deploy`). Bekreft at branch protection ikke blokkerer.
- Eksisterende PR/issue-referanser brytes.

**Pre-requisites (obligatoriske før rewrite):**
1. Alle 9 secrets rotert (avsnitt 3) — slik at selv en senere lekk er død.
2. Full backup (ny clone + backup/pre-roadmap bevart).
3. Samordning med alle med-workere (re-clone).
4. Bekreft Vercel-kobling (git-integration vs CI) + branch protection.

**Kommandoer (kjøres av George, IKKE automatisk):**
```bash
pip install git-filter-repo     # eller: java -jar bfg.jar
git clone --no-checkout <repo> /tmp/tosom-rewrite
cd /tmp/tosom-rewrite
# secrets.map: 1 linje per REELL VERDI -> erstatning. Verdier hentes fra historikken (maskert her):
cat > /tmp/secrets.map <<'EOF'
<REELL_DBLINK>*==><ROTERTE_DBLINK>
<REELL_RESEND_KEY>*==><ROTERTE>
<REELL_NEXTAUTH_SECRET>*==><ROTERTE>
# ... alle 9 reelle verdier fra historikken
EOF
git filter-repo --replace-text /tmp/secrets.map --force
git push --force origin main    # + evt. andre brancher (IKKE backup/pre-roadmap)
# Med-workere: ny clone (ikke pull)
```

**Verifisering etter rewrite (ny fresh clone):**
```bash
cd /tmp/tosom-verify
for pat in 'sk_live_' 're_' 'AKIA'; do
  git log --all -p | grep -i "$pat" && echo "FEIL: $pat funnet" || echo "OK: $pat borte"
done
# Sjekker også de 9 maskerte verdiene fra historikken
```

---

## 5. Status
- Kartlegging (avsnitt 1) — FERDIG, read-only, verdier maskert.
- Rotasjonsplan (avsnitt 2) + runbook (avsnitt 3) + historikk-runbook (avsnitt 4) — FERDIG (dokumentasjon).
- Rotasjon i Vercel — BLOKKERT: krever Georges autentiserte tilgang til Neon/Resend/Pusher/UploadThing/Vercel. Ingen kredensialer i dette miljøet.
- Git-historikk-omskrivning — HOPPET OVER (avgjort 2026-09-01: repo PRIVAT; rotasjon er nok, lavest risiko).
- Lokal .env-rotasjon — BLOKKERT: krever de roterte verdiene fra avsnitt 3; opprettes ikke selv-roterte verdier uten koordinering (NEXTAUTH_SECRET kaster sesjoner).

