GEORGE.md — ToSom i åpen beta
Deploy‑guide, drift, og daglig oversikt  
Opprettet 24.08.2026 — Sist oppdatert 02.09.2026 (CD: deploy NÅ VERIFISERT GRØNN — team-scoped Vercel-token fungerer, production-deploy tosom-4qem53lih READY; rotårsak: forrige token var prosjekt-scoped uten team-adgang; deploy-gate be66067 valideres)

0. Status i dag (01.09.2026)
🟢 Produksjon kjører: tosom.no → www.tosom.no (Vercel, prod, HTTP 200). Landing, /login, /admin/login fungerer.

🟢 Database: Neon Frankfurt, pooled URL, helsesjekk viser connected (~1000 ms kald start).

🟢 Auth: secret 60 tegn, URL OK, trustHost OK.

🟢 Cron: journey-cron kjører (siste kjøring ~15:27). Matching-cron kjører lørdag 02–04.

🟢 UploadThing: configured (token + secret satt).

🟢 Pusher: configured (key/secret/cluster satt).

🟢 Cloudflare: domenet aktivert, proxy + SSL/TLS OK.

🟢 Chat: Pusher fungerer etter variabler ble satt — men routing og UI er feil (se §1).

🟡 R2: ikke verifiserbart via health — verifiserings-script er klart (scripts/launch-3-verify-r2.mjs, krever R2_*-verdier).

🟡 E-post: alle 6 EMAIL_*/ALERT-vars er satt i Vercel (01.09) og Resend-nøgelen fungerer — MEN tosom.no er ikke verifisert i Resend (mangler SPF/DKIM). Ingen e-post kan sendes før §5 er utført.

🟡 Testbrukere: test1/test2 er fortsatt i prod-DB. Slettes med scripts/launch-1-delete-test-users.mjs (dry run standard, krever DATABASE_URL).

🟢 CSRF: kode klar på 7 kritiske ruter (profil, settings, chat, report, reset, onboarding) — flagget er AV (ENABLE_CSRF_PROTECTION) og slås på som siste steg.

🟢 Uptime: GitHub Actions monitor pinger /api/system/health hver 5. minutt (krev GitHub-secrets for alert-e-post).

🟢 Juridisk: DPA + DPIA klar i docs/legal/ — trenger advokatgjennomgang og signatur.

🟡 Sentry: koden er fullt koblet — mangler bare SENTRY_DSN-verdien.

🟡 OpenAI: missing — OK i beta (AI kjører fallback).

🟡 Vipps: missing — OK (fase 2).

🟢 Admin: /admin/login fungerer, kvote vises.

🟢 Kill switches: fungerer (MAINTENANCE_MODE, MATCHING_ENABLED, etc).

Hurtigsjekk:  
curl -s https://www.tosom.no/api/system/health  
→ ok = alt grønt
→ degraded = manglende optional variabler (OpenAI/Vipps)
→ error = database nede

1. Kritiske avvik (routing + chat) — må fikses før testere
1.1 Brukere med match havner i venterommet
Feil: etter login sendes begge parter til /venterom, selv om de har en aktiv match.

Riktig oppførsel:

Har match → /dashboard

Har ikke match → /venterom

1.2 Venterommet viser feil meny
Feil: venterommet viser “Logg inn”, “Start reisen”, osv.

Riktig:

Venterommet skal kun vise “Du venter på match”.

1.3 Tilbakeknapp fra chat går til venterommet
Feil: router.push("/venterom").

Riktig:

router.push("/dashboard").

1.4 Chat kobler ikke til Pusher
Feil: kanalnavn mismatch eller feil conversationId.

Riktig:

Kanal: private-conversation-${conversationId}

Event: "new-message"

1.5 Meldinger leveres ikke
Feil: API returnerer feil shape eller trigger ikke Pusher.

Riktig:

senderId = session.user.id

conversationId fra URL/body

Trigger Pusher med korrekt kanalnavn.

2. Miljøvariabler (Production)
Påkrevd (må være satt)
Variabel	Status
DATABASE_URL	🟢
NEXTAUTH_SECRET	🟢
NEXTAUTH_URL	🟢
CRON_SECRET	🟢
ADMIN_EMAIL	❓
ADMIN_PASSWORD_HASH	❓
ADMIN_JWT_SECRET	❓
EMAIL_SERVER_HOST=smtp.resend.com	🟢 (satt 01.09)
EMAIL_SERVER_PORT=587	🟢 (satt 01.09)
EMAIL_SERVER_USER=resend	🟢 (satt 01.09)
EMAIL_SERVER_PASSWORD=re_...	🟢 (satt 01.09)
EMAIL_FROM=ToSom <no-reply@tosom.no>	🟢 (satt 01.09)
ALERT_EMAIL_TO=<din>	🟢 (satt 01.09)
ENABLE_CSRF_PROTECTION=false	🟢 (settes til true som siste steg, etter verifisering)
PUSHER_APP_ID	🟢
PUSHER_KEY	🟢
PUSHER_SECRET	🟢
PUSHER_CLUSTER=eu	🟢
NEXT_PUBLIC_PUSHER_KEY	🟢
NEXT_PUBLIC_PUSHER_CLUSTER=eu	🟢
STORAGE_DRIVER=r2	⚠️
R2_ACCOUNT_ID	⚠️
R2_ACCESS_KEY_ID	⚠️
R2_SECRET_ACCESS_KEY	⚠️
R2_BUCKET=tosom-images	⚠️
R2_REGION=eu-central-1	⚠️
BETA_INVITE_MODE=false	🟢
JOURNEY_BATCH_SIZE=300	🟢


Eksplisitt av
Variabel	Verdi
MAINTENANCE_MODE	false
DEV_LOGIN_ENABLED	false
PAYMENTS_ENABLED	false
BETA_MATCH_EMAIL	false


3. Cloudflare R2 (bilde-lagring)
Må være satt før testere:

Bucket: tosom-images

Region: eu-central-1

Token: Read/Write

Variabler: R2_* + STORAGE_DRIVER=r2

Uten R2 → bilder lagres lokalt og slettes ved hver deploy. ⚠️ F-133-01 (02.09): R2_* er nå STARTUP-PAKREVDE i prod — mangler de, starter appen ikke (validateEnv kaster i instrumentation.ts). Må settes i Vercel FØR neste prod-deploy (ellers blokkeres deployen).

4. Pusher (realtime chat)
Status: nå OK.  
Men chat‑routing må fikses (se §1).

5. Resend (e-post)
DOMENET ER IKKE VERIFISERT (sjekket 01.09: tosom.no har ingen SPF/DKIM-records i det hele). Steg:

1. Resend-dashboard → Domains → legg til tosom.no
2. Cloudflare DNS for tosom.no:
   - TXT: v=spf1 include:spf.resend.com -all
   - CNAME (DKIM): verdien Resend viser etter at domenet er lagt til
3. Vent til Resend viser «verified» (1–10 min)

Nøkkelen fungerer (verifisert 01.09) og alle Vercel-vars er satt — e-post fungerer så snart DOMENET er verifisert. Test: passord-reset i prod → e-post må lande + «email: sent» i admin-systemloggen.

6. Kvoten
Tak: 5 000 gratis reiser.

50 testere = 1 % av kvoten.

Par som fullfører reisen gir 2 plasser tilbake.

Panelet viser grønt/gult/rødt basert på terskler.

7. Kapasitet
Journey-cron: ~7 200 samtidige reiser.

Matcherunde: 5 000 kandidater på ~11 sek.

API/DB/Pusher/R2: skalerer.

8. Daglig drift (0–5 min)
curl -s https://www.tosom.no/api/system/health

/admin/login → sjekk kvote + logs

Lørdag: sjekk matcherunden

Sjekk support‑innboks

Hvis rødt → §9

9. Ved rødt
MAINTENANCE_MODE=true → redeploy

Diagnose: Vercel Logs, Sentry, /admin/logs, health

Rett i repo → ny deploy

Ikke rør produksjons‑DB direkte

CD-deploy til Vercel (GitHub Actions): krever VERCEL_TOKEN + VERCEL_ORG_ID + VERCEL_PROJECT_ID i GitHub Secrets, og tokenet må ha tilgang til prosjektet. 02.09: CD-deploy VERIFISERT GRØNN. Forrige rotårsak: VERCEL_TOKEN (vcp_) var prosjekt-scoped — leste prosjektet, men hadde ikke team-adgang (GET /v2/teams = 403 team_unauthorized), så «vercel pull --yes» feilet («Could not retrieve Project Settings»). FIX (gjennomført): satte et Vercel-token med TEAM-scope + read-write (til team_RJ0... / prosjekt «tosom») — verifisert: vercel pull OK lokalt, production-deploy tosom-4qem53lih READY, prod-health 200. Husk: tokenet MÅ ha team-adgang, ikke kun prosjekt-adgang. Deploy Gate (be66067) viser rødt for ekte deploy-feil, gul warning for bevisst hoppet over (CI-rødt).

10. Etter beta (fase 2)
Vipps Login + betaling

DPA + DPIA: DOKUMENTENE ER KLARE (docs/legal/, 01.09) — gjenstår advokatgjennomgang + signatur + DPA i hvert behandler-dashboard

Vercel Pro/Fluid

Pusher/Resend betalt tier

R2-lagring oppskalert

11. Ikke gjør dette
Ikke sett PAYMENTS_ENABLED=true

Ikke rør produksjons‑DB

Ikke juster terskler

Ikke åpne for hundrevis av brukere før fase 2

Ikke aktiver DEV_LOGIN_ENABLED i prod

12. Språk: bokmål — alltid
Alt i repoet er norsk bokmål: brukerflate, dokumentasjon, kodekommentarer,
testfiler, e2e-tester og commit-meldinger. Ingen nynorsk, ingen svorsk.

Språkvakt: `npm run verify:lang` (scripts/verify-language.mjs) — MÅ være grønn
før push. CI kjører samme skript (jobben `lang-guard`); rød vakt = rød CI =
blokkert deploy.

Ordliste og regler: ai/system_prompt.md (REGEL 0 + §2 Språkmanual) og README §Språkprofil.