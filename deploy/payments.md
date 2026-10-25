# ToSom — Betaling

*Oppdatert av ACT v7, steg 2.1 (A15), 16. august 2026.*

## Tilstand i dag

**Ingen betalingsvei finnes.** `PAYMENTS_ENABLED` må forblive `false`.

`config/features.ts` inneholder en oppstartsperre: om `PAYMENTS_ENABLED=true` settes før en betalingsvei er bygget, kaster appen en tydelig feil ved oppstart. Dette er bevisst — bedre å feile ved oppstart enn å lede en bruker inn i en blindvei.

## Hva finnes

- **Innlogging til beta** virker allerede via e-postlenke (`lib/auth/config.ts:21`, `EmailProvider` med SMTP). Inviterte betatester logger inn uten Vipps.
- **Gratiskvote** på 5 000 brukere/personer (`lib/payment/freeQuota.ts`, `FREE_QUOTA_LIMIT = PRICING.freeUserCap = 5 000`). Telleren er per person: én atomisk claim ved kø-inngang, og den beholder seg gjennom `new_journey`. Koblet i `app/api/journey/queue/route.ts`. Bærer funnelen inntil videre.

## Hva er forkastet

**Stripe** er forkastet helt. Ingen Stripe-kode, ingen Stripe-miljøvariabler, ingen webhook-rute. De tre `STRIPE_*`-variablene er fjernet fra `.env.example`, og den tomme `app/api/payment/webhook/`-katalogen er slettet.

## Plan: Vipps

Vipps er eneste planlagte betalingsvei. Nøkkelen ventes om ca. to uker. Når den kommer:

1. Bygg Vipps-betalingsflyten (checkout → webhook → bekreftelse).
2. Sett opp `PAYMENTS_ENABLED` som faktisk kontrollerer betalingsveggen.
3. Fjern oppstartsperren i `config/features.ts` — erstatt med riktig logikk.
4. Vipps-kobles **også** inn som ekstra innloggingsmetode (skallrutene finnes i `app/api/auth/vipps/`).

## Observasjon til beta

`lib/payment/freeQuota.ts`-kommentaren sier at telleren «caches i Redis (60 s)», men koden i `countFreeQuotaOrders` (`:23`) gjør en direkte `prisma.order.count` uten caching. Atferden ved grensen er klar: person 5 001 blokkeres (5 000 < 5 000 = false). Manglende caching er ikke feil i dag — kun en observasjon dersom belastningen ved grensen blir relevant.