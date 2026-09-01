# ToSom — En rolig, privat plattform for ekte relasjoner

ToSom er en relasjonsplattform for voksne (21+) som søker ekte forbindelse.
Ingen swipe. Ingen feed. Én match innen 24 timer.

## Språkprofil

Språket i ToSom er **norsk bokmål** — overalt. Brukerflate, dokumentasjon,
kodekommentarer, testfiler og commit-meldinger. Ingen nynorsk, ingen svorsk, ingen slang.

Språkmanualen står i [ai/system_prompt.md](ai/system_prompt.md) §2 og er
oppsummert i [docs/TOSOM-SUPER-MASTERPLAN-v2.0.md](docs/TOSOM-SUPER-MASTERPLAN-v2.0.md) §2.
Språkvakten (`npm run verify:lang`) blokkerer push og deploy som bryter dette.

## Kom-i-gang

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy

See [deploy/DEPLOYMENT-CHECKLIST.md](deploy/DEPLOYMENT-CHECKLIST.md)