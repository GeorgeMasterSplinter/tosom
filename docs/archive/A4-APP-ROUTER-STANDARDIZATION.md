# Fase A4 — App Router Standardization

**Dato:** 2026-07-10  
**Status:** Ingen endring trengst for strukturen

## 1. Oversikt

ToSom er allerede fullt migrert til App Router. Ingen legacy `pages/`-katalog eksisterer.

## 2. Funn

### ✅ App Router-struktur
- Alle API-ruter: `app/api/...` (25+ katalogar)
- Alle sider: `app/dashboard/`, `app/login/`, `app/profile/`, `app/journey/`, `app/chat/`, etc.
- Admin-panel: `app/admin/...` (15+ sider)

### ⚠️ Duplikat-advarsel — vilkår vs vilkar
Det finnes to URL-variantar som begge er tilgjengelege:

| URL | Fila | Innhold |
|-----|------|---------|
| `/vilkår` | `app/vilkår/page.tsx` | "Vilkår for bruk" (328 linjer) |
| `/vilkar` | `app/vilkar/page.tsx` | "Vilkår" (344 linjer) |

**Anbefaling:** Konsolidere til én side og leggje inn redirect fra den andre.

### ✅ Ingen duplikat av `viljar`
`app/viljar/page.tsx` finnes ikke — ingen konsolidering trengst her.

## 3. Konklusjon

App Router-strukturen er heil og korrekt. Ingen endringer trengst for Fase A.

**En anbefaling for framtidig:**
- Konsolidere `vilkår/` og `vilkar/` til én side (val mellom norsk bokmål «Vilkår» vs URL-safe «vilkår»)
- Bruke middleware eller Next.js redirect for å han begge variantar

## 4. Anbefaling

✅ **Fase A er klar til Phase B** — ingen strukturelle endringer trengst i App Router.
<task_progress>
- [x] A1: API-ruter allerede i app/api/ — ferdig ✅
- [x] A2: Remove deprecated Prisma models (schema validert ✅)
- [x] A3: Clarify Journey model (dokumentert ✅)
- [ ] A4: Standardize to App Router (under investigation)
  - [x] Ingen pages/ katalog eksisterer
  - [x] Duplikat-advarsel: vilkår/vilkar/viljar
  - [ ] Dokumentere anbefalingar
- [ ] A5: Backup + verify full flow before next phase
</task_progress>
</read_file>