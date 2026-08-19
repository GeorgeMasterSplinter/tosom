# MASTERSPLINTER — SIKKERHETSHERDING v1.0

**Dato:** 2026-08-19
**Maskin:** HP Z2 G1i 9 · Ubuntu 26.04 LTS · kjerne 7.0.0-29
**Vurdert av:** Cline, direkte mot systemet
**Grunnlag:** `TOSOM-MASTERPLAN-v9.0.md` Del III

> **Formål:** Lukke sikkerhetshullene på utviklingsmaskinen. Produksjon flyttes til leverandør (se `HOSTING-MIGRATION-PLAN-v1.0.md`), men PC-en har **i dag** eksponerte databaser og må sikres uansett.

**Merking:** **[GEORGE]** = kun du kan utføre (sudo, BIOS, fysisk tilgang, kontoer). **[AGENT]** = jeg kan utføre.

---

## 0. Maskinvare — konklusjon først

| Ressurs | Verdi | Vurdering |
|---|---|---|
| CPU | Intel Ultra 9 285K, **24 kjerner**, 5,7 GHz | Kraftig overdimensjonert for Tosom |
| RAM | **152 GB** (141 GB tilgjengelig) | 15–20× behovet |
| Disk | 915 GB NVMe, 351 GB ledig (60 % brukt) | Holder i mange år |
| GPU | RTX PRO 5000 Blackwell, **48 GB VRAM** | Irrelevant for Tosom, utmerket for Qwen |
| Oppetid | 1 dag 18 t, last 1,37 | Sunn |

**Kunne maskinen kjørt Tosom for 5 000 brukere?** Teknisk: ja, med stor margin. Lørdagsrunden ved 1 500 i kø tar ~0,13 s CPU her.

**Bør den?** Nei. Kapasitet er ikke egnethet. Én person kan ikke være brannmur, backup-ansvarlig, DDoS-vern, oppetidsgaranti og databehandler alene — uten vaktordning, for 5 000 menneskers dypeste personopplysninger. Én strømstans eller diskkrasj, og reisen deres er borte.

**Derfor:** MasterSplinter blir **utviklingsmaskin og AI-arbeidshest**. Aldri produksjon. Aldri ekte brukerdata (invariant I-15).

---

## 1. Funnene

Syv funn. Tre kritiske.

| ID | Funn | Alvor |
|---|---|---|
| K-1 | Brannmuren er avslått | 🔴 Kritisk |
| K-2 | Postgres eksponert på alle grensesnitt, passord «tosom» | 🔴 Kritisk |
| K-3 | Disken er ukryptert | 🔴 Kritisk |
| Ø-4 | SSH lytter på alle grensesnitt, passordinnlogging uavklart | 🟠 Høy |
| Ø-5 | Ingen verifisert databasebackup | 🟠 Høy |
| Ø-6 | Automatiske oppdateringer laster ikke ned | 🟡 Middels |
| G-7 | Det som er bra | 🟢 |

---

## 2. 🔴 K-1 — Brannmuren er avslått

### Bevis
```
/etc/ufw/ufw.conf → ENABLED=no
sudo iptables -L INPUT -n → (ingen regler)
```

Maskinen har **ingen** nettverksfiltrering. Alt som lytter, er nåbart fra lokalnettet — inkludert wifi (`192.168.10.203`) og kablet (`192.168.10.184`).

### Tiltak **[GEORGE]**

Gjør **K-2 først**, ellers kan du låse deg ut av dine egne dev-databaser.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow in on tailscale0        # behold admin-vei
sudo ufw enable
sudo ufw status verbose
```

### Verifiser
```bash
sudo ufw status verbose     # forventet: Status: active
```

### Merk om Docker
Docker skriver **egne iptables-regler** og omgår ufw. Selv med ufw aktiv vil `0.0.0.0:5432` fortsatt være åpen. Derfor må K-2 løses i compose-filen — ikke i brannmuren.

---

## 3. 🔴 K-2 — Postgres eksponert med trivielt passord

### Bevis
```
tcp LISTEN 0.0.0.0:5432   → tosom_dev_db  (postgres:15)
tcp LISTEN 0.0.0.0:5433   → tosom_test_db (postgres:16-alpine)
[::]:5432, [::]:5433      → også IPv6

docker-compose.yml:      POSTGRES_USER: tosom
docker-compose.yml:      POSTGRES_PASSWORD: tosom
docker-compose.test.yml:  (identisk)
```

Begge databasene er nåbare fra hele lokalnettet, med brukernavn og passord som er **samme ord**. Enhver enhet på nettet — inkludert en gjests telefon på wifi — kan koble seg til og lese alt.

### Tiltak **[AGENT]**

1. Bind til loopback i begge compose-filer:
   ```yaml
   ports:
     - "127.0.0.1:5432:5432"    # var: "5432:5432"
   ```
2. Erstatt passordet med en generert verdi, lest fra `.env` (som allerede er gitignorert, `.gitignore:56`)
3. Oppdater `DATABASE_URL` tilsvarende
4. `docker compose down && docker compose up -d`

### Verifiser
```bash
ss -tulnp | grep -E "5432|5433"
# forventet: 127.0.0.1:5432 — IKKE 0.0.0.0
```

Fra en annen maskin på nettet:
```bash
psql -h 192.168.10.184 -p 5432 -U tosom    # skal nå feile
```

---

## 4. 🔴 K-3 — Disken er ukryptert

### Bevis
```
lsblk -o FSTYPE | grep -c crypto_LUKS → 0
```

Ingen LUKS. Ved innbrudd, tyveri eller innlevering til service er hele disken lesbar ved å ta ut NVMe-en.

### Vurdering

Så lenge dev-databasene inneholder **syntetiske** data, er dette god hygiene — ikke en GDPR-plikt. Men i dag inneholder de sannsynligvis testdata som ligner ekte, og du har `.env` med hemmeligheter på disken.

Etter migrering, når PC-en er fri for ekte brukerdata, faller alvoret betydelig.

### Tre veier **[GEORGE]**

| Vei | Arbeid | Anbefaling |
|---|---|---|
| **1. Utsett LUKS**, migrer først, hold PC-en fri for ekte data | Ingen | ✅ **Anbefalt** |
| 2. LUKS-kryptert separat volum kun for dev-databaser og `.env` | Moderat | God mellomting |
| 3. Full reinstallasjon med LUKS på systemdisken | Helgejobb | Grundigst |

Full LUKS på et kjørende system krever reinstallasjon eller full backup + re-kryptering — det kan ikke slås på i etterkant.

**Sjekk også:** HP Z2 støtter TPM. Verifiser i BIOS at TPM er aktiv, og at oppstart er passordbeskyttet.

**Uansett vei:** ta en kryptert kopi av `.env` og andre hemmeligheter til en passordhåndterer nå.

---

## 5. 🟠 Ø-4 — SSH på alle grensesnitt

### Bevis
```
tcp LISTEN 0.0.0.0:22   ← alle grensesnitt
[::]:22

/etc/ssh/sshd_config:
  PermitRootLogin prohibit-password
  #PasswordAuthentication yes      ← kommentert ut = default «yes»
sshd: active
```

Passordinnlogging er sannsynligvis aktiv (kommentert linje = standardverdi). Kombinert med K-1 er dette en åpen dør.

### Tiltak **[GEORGE]**

```bash
sudo tee /etc/ssh/sshd_config.d/99-tosom.conf <<'EOF'
PasswordAuthentication no
PubkeyAuthentication yes
PermitRootLogin no
ListenAddress 100.122.158.46
EOF
sudo sshd -t                      # syntakssjekk FØR restart
sudo systemctl restart ssh
```

`ListenAddress` binder SSH til Tailscale-adressen — da er den kun nåbar via ditt private nett.

### ⚠️ Viktig rekkefølge
**Verifiser at du har en fungerende nøkkel før du lukker den aktive sesjonen.** Åpne en ny terminal og test innlogging. Hvis den feiler, har du fortsatt den gamle sesjonen til å reversere.

### Verifiser
```bash
ss -tulnp | grep :22        # forventet: kun 100.122.158.46:22
```

---

## 6. 🟠 Ø-5 — Ingen verifisert backup

Ingen `pg_dump`-jobb funnet. Én disk, ingen RAID, ingen ekstern kopi.

Etter migrering er dette mindre kritisk (leverandøren tar backup av produksjon), men du mister utviklingsarbeid ved diskkrasj.

### Tiltak **[AGENT]**
Daglig `pg_dump` av dev-databasen til kryptert arkiv, med rotasjon på 14 dager. Legges utenfor repoet.

### Prinsipp
**En backup som aldri er gjenopprettet, finnes ikke.** Test gjenoppretting til en tom database.

---

## 7. 🟡 Ø-6 — Oppdateringer lastes ikke ned

### Bevis
```
APT::Periodic::Update-Package-Lists "7";
APT::Periodic::Download-Upgradeable-Packages "0";   ← laster ikke ned
APT::Periodic::Unattended-Upgrade "1";
```

Sikkerhetsoppdateringer installeres, men pakkelister oppdateres bare hver 7. dag og nedlasting er av.

### Tiltak **[GEORGE]**
```bash
sudo tee /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
EOF
```

---

## 8. 🟢 G-7 — Det som er bra

Ærlighet begge veier:

- **`.env` er korrekt gitignorert** — `.gitignore:56: .env*` bekreftet med `git check-ignore`
- **Tailscale er oppe** (`100.122.158.46`) — gir en trygg admin-vei uten å åpne porter mot internett
- **Ollama bundet til `127.0.0.1:11434`** — ikke eksponert
- **CUPS bundet til `127.0.0.1:631`** — ikke eksponert
- **`PermitRootLogin prohibit-password`** — root kan ikke logge inn med passord
- **Unattended-Upgrade aktiv** — sikkerhetsoppdateringer installeres
- **Ubuntu 26.04 LTS** med fersk kjerne — ikke etterlatt

Grunnlaget er bedre enn funnene antyder. Problemet er de åpne dørene, ikke råtne fundamenter.

---

## 9. Rekkefølge

Rekkefølgen er ikke tilfeldig — K-2 må komme før K-1, ellers låser du deg ut.

| # | Tiltak | Eier | Tid |
|---|---|---|---|
| 1 | **K-2** Lukk databaser til loopback + nytt passord | **[AGENT]** | 15 min |
| 2 | **K-1** Slå på ufw | **[GEORGE]** | 5 min |
| 3 | **Ø-4** Lås SSH til Tailscale | **[GEORGE]** | 10 min |
| 4 | Kopier `.env` til passordhåndterer | **[GEORGE]** | 5 min |
| 5 | **Ø-6** Fulle automatiske oppdateringer | **[GEORGE]** | 2 min |
| 6 | **Ø-5** Backup av dev-database | **[AGENT]** | 30 min |
| 7 | **K-3** LUKS-beslutning | **[GEORGE]** | Vurdering |

**Punkt 1–3 kan gjøres i dag, på under en time.** Det lukker begge de kritiske nettverkshullene.

---

## 10. Kun George kan gjøre dette

Oppsummert, alt som krever deg:

| # | Oppgave | Hvorfor |
|---|---|---|
| 1 | Alle `sudo`-kommandoer over | Krever ditt passord |
| 2 | BIOS/TPM-sjekk | Fysisk tilgang |
| 3 | LUKS-beslutning og evt. reinstallasjon | Fysisk tilgang |
| 4 | Opprette konto hos Vercel/Neon/R2/e-post | Betalingskort, identitet |
| 5 | **Signere databehandleravtale (DPA)** hos hver leverandør | GDPR art. 28 — juridisk bindende, kun du kan signere |
| 6 | **Søke Vipps merchant** — org.nr + BankID | Kritisk sti. Start umiddelbart |
| 7 | Domene + DNS | Registrar-tilgang |
| 8 | Legge produksjonshemmeligheter i passordhåndterer | **Skal aldri i repo eller sendes til meg** |
| 9 | Vurdere behov for personvernrådgiver | Særlige kategorier personopplysninger |

**Punkt 6 er tidskritisk.** Vipps blir eneste innlogging. Uten godkjent avtale finnes det ingen 5 000-bølge, og behandlingstiden er uker.

---

## 11. Etter migrering

Når produksjon ligger hos leverandør, gjelder dette for MasterSplinter:

| Regel |
|---|
| **Aldri ekte brukerdata** — kun syntetiske testdata (I-15) |
| Dev-databaser kun på loopback |
| Produksjonshemmeligheter kun i passordhåndterer, aldri i lokal `.env` |
| Produksjonstilgang kun via leverandørens panel, aldri direkte DB-tilkobling |
| Ingen produksjonsdump lastes ned til PC-en — heller ikke «for å debugge» |

Den siste er den som brytes lettest, og den som betyr mest.

---

## 12. Sluttord

Maskinen er kraftig, oppsettet er ryddig, og Tailscale viser at du tenker på tilgang. Men tre dører står åpne, og den ene — Postgres på `0.0.0.0` med passordet «tosom» — er alvorlig nok at den bør lukkes i dag.

Punkt 1–3 tar under en time og fjerner den reelle risikoen. Resten kan følge i eget tempo.