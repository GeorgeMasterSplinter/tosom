GEORGE.md — ToSom i åpen beta
Deploy‑guide, drift, og daglig oversikt  
Opprettet 24.08.2026 — Sist oppdatert 30.08.2026 (prod‑routing + chat + UploadThing + Cloudflare + Pusher + R2)

0. Status i dag (30.08.2026)
🟢 Produksjon kjører: tosom.no → www.tosom.no (Vercel, prod, HTTP 200). Landing, /login, /admin/login fungerer.

🟢 Database: Neon Frankfurt, pooled URL, helsesjekk viser connected (~1000 ms kald start).

🟢 Auth: secret 60 tegn, URL OK, trustHost OK.

🟢 Cron: journey-cron kjører (siste kjøring ~15:27). Matching-cron kjører lørdag 02–04.

🟢 UploadThing: configured (token + secret satt).

🟢 Pusher: configured (key/secret/cluster satt).

🟢 Cloudflare: domenet aktivert, proxy + SSL/TLS OK.

🟢 Chat: Pusher fungerer etter variabler ble satt — men routing og UI er feil (se §1).

🟡 R2: ikke verifiserbart via health — må bekreftes manuelt (se §3).

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
EMAIL_SERVER_HOST=smtp.resend.com	❓
EMAIL_SERVER_PORT=587	❓
EMAIL_SERVER_USER=resend	❓
EMAIL_SERVER_PASSWORD=re_...	❓
EMAIL_FROM=noreplay@tosom.no	❓
ALERT_EMAIL_TO=<din>	❓
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

Uten R2 → bilder lagres lokalt og slettes ved hver deploy.

4. Pusher (realtime chat)
Status: nå OK.  
Men chat‑routing må fikses (se §1).

5. Resend (e-post)
Domenet tosom.no må være verifisert i Resend.

Avsender: noreplay@tosom.no

Viderekobling: support@tosom.no → din e-post.

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

10. Etter beta (fase 2)
Vipps Login + betaling

DPA + DPIA

Vercel Pro/Fluid

Pusher/Resend betalt tier

R2-lagring oppskalert

11. Ikke gjør dette
Ikke sett PAYMENTS_ENABLED=true

Ikke rør produksjons‑DB

Ikke juster terskler

Ikke åpne for hundrevis av brukere før fase 2

Ikke aktiver DEV_LOGIN_ENABLED i prod