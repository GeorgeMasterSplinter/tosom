# DEPRECATED — Pages Router

Denne mappa er utdatert og blir fjerna snart.

Alle sider skal brukast frå `app/` mappen istadenfor.

## Flytteguide:
- pages/foo.tsx → app/foo/page.tsx
- pages/bar/index.tsx → app/bar/page.tsx
- pages/api/baz/route.ts → app/api/baz/route.ts

## Kontakt George før du slettar denne mappa.

---
## Korfor er dette deprecated?

ToSom-prosjektet brukar no Next.js App Router (`app/` mappa) som einheits kilde for alle sider.
Pages-routaren eksisterer enno av historiske årsaker, men ingen nye sider skal lagast der.

### Status:
- ✅ Alle aktive sider er migrerte til `app/`
- ✅ API-endepunkt er alle i `app/api/`
- ⚠️ Nokre gamle filer kan enno eksistere — dei blir ignorerte av Next.js