# ToSom — Dokumentasjon

Denne mappen inneholder all dokumentasjon for ToSom-prosjektet.

---

## MAPPESTRUKTUR

```
/docs/
├── README.md                    ← Denne filen
├── core/                        ← Offisiell master-dokumentasjon (alltid oppdatert)
│   ├── TOSOM_MASTER_OVERVIEW.md
│   ├── TOSOM_ARCHITECTURE_MAP.md
│   ├── TOSOM_ROADMAP.md
│   ├── TOSOM_DEVELOPMENT_PROTOCOL.md
│   ├── TOSOM_SUBSYSTEMS_OVERVIEW.md
│   ├── TOSOM_API_OVERVIEW.md
│   ├── TOSOM_JOURNEY_OVERVIEW.md
│   ├── TOSOM_MATCHING_OVERVIEW.md
│   └── TOSOM_SECURITY_OVERVIEW.md
├── archive/                     ← Historiske og utdaterte dokumenter (~145 filer)
└── system/                      ← Auto-genererte system-rapporter
```

---

## HVORDAN BRUKE DOKUMENTASJONEN

### Før du starter en ny oppgave:
1. Les `core/TOSOM_MASTER_OVERVIEW.md` for helhetsforståelse
2. Les `core/TOSOM_DEVELOPMENT_PROTOCOL.md` for regler og arbeidsmetode
3. Les relevant subsystem-dokumentasjon for detaljer

### For utviklere:
- `core/TOSOM_ARCHITECTURE_MAP.md` — Komplett arkitekturkartlegging
- `core/TOSOM_API_OVERVIEW.md` — Alle API-endepunkter med eksempel-respons
- `core/TOSOM_DEVELOPMENT_PROTOCOL.md` — Kodekrav, naming, import-struktur

### For prosjektledelse:
- `core/TOSOM_ROADMAP.md` — Prioriteringer og status for alle pakker
- `core/TOSOM_SUBSYSTEMS_OVERVIEW.md` — Status per subsystem

---

## DOKUMENTASJONSREGLER

1. **Alltid oppdatere** når en subsystem endres vesentlig
2. **Aldri slette** fra `/docs/core/` uten godkjenning
3. **Arkivere** utdaterte dokumenter til `/docs/archive/`
4. **Skrive i bokmål** — aldri nynorsk eller svorsk

---

*Versjon: 1.0 — Opprettet 2026-08-02*