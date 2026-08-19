# MASTERSPLINTER — KOMPLETT SIKKERHETSGUIDE v1.0

**Dato:** 2026-08-19
**Maskin:** HP Z2 G1i 9 · Intel Ultra 9 285K · 152 GB RAM · RTX PRO 5000 Blackwell
**System:** Ubuntu 26.04 LTS · kjerne 7.0.0-29 · NVMe 915 GB
**Kartlagt av:** Cline, direkte mot systemet

> **Formål:** Gjøre MasterSplinter trygg. Ikke bare for Tosom, men som maskin — med dine nøkler, hemmeligheter, kode og Tailscale-tilgang.
>
> **Erstatter:** `MASTERSPLINTER-HERDING-v1.0.md` (som kun dekket Tosom-relaterte funn). Dette dokumentet er bredere og står alene.

**Merking:** **[G]** = kun George kan utføre (sudo/BIOS/fysisk) · **[A]** = agenten kan utføre

---

## 0. Les dette først

Tre ting før du begynner:

**1. Rekkefølgen er ikke tilfeldig.** Slår du på brannmuren før du åpner databasene til loopback, mister du tilgang til dine egne dev-databaser. Låser du SSH før du har verifisert nøkkelen, kan du stenge deg ut av maskinen. Følg rekkefølgen i §2.

**2. Ha alltid en åpen terminal.** Når du endrer SSH eller brannmur: behold den terminalen du sitter i. Test i en **ny** terminal. Feiler noe, har du fortsatt veien inn.

**3. Du har fysisk tilgang.** Det er ditt sikkerhetsnett. Verst tenkelig utfall av en feil er at du må logge inn med tastatur og skjerm. Det er ubehagelig, ikke katastrofalt.

---

## 1. Nåtilstand

### 1.1 Det som er bra

| Funn | Betydning |
|---|---|
| **AppArmor er aktiv** | Kjerne-nivå isolasjon av prosesser |
| **TPM finnes** (`/dev/tpm0`, `/dev/tpmrm0`) | Diskkryptering kan låses opp automatisk |
| **Kun én brukerkonto** (`george`, uid 1000) | Liten angrepsflate |
| **SSH-nøkkel finnes** (`id_ed25519`, 1 i `authorized_keys`) | Du kan trygt slå av passordinnlogging |
| **Tailscale er ikke exit node** | Ingen fremmed trafikk rutes gjennom maskinen |
| **`.env` er gitignorert** (`.gitignore:56`) | Hemmeligheter havner ikke i repo |
| **Ollama på `127.0.0.1:11434`** | AI-tjenesten er ikke eksponert |
| **CUPS på `127.0.0.1:631`** | Utskrift er ikke eksponert |
| **`PermitRootLogin prohibit-password`** | Root kan ikke logge inn med passord |
| **Ubuntu 26.04 LTS, fersk kjerne** | Ikke etterlatt |
| **Unattended-Upgrade aktiv** | Sikkerhetsoppdateringer installeres |

Grunnlaget er godt. Problemet er åpne dører, ikke råtne fundamenter.

### 1.2 Funnene

| ID | Funn | Alvor |
|---|---|---|
| **F-1** | Brannmuren er avslått (`ENABLED=no`, ingen iptables-regler) | 🔴 Kritisk |
| **F-2** | Postgres på `0.0.0.0:5432` og `:5433`, passord «tosom» | 🔴 Kritisk |
| **F-3** | Disken er ukryptert (0 LUKS-enheter) | 🔴 Kritisk |
| **F-4** | SSH på alle grensesnitt, passordinnlogging uavklart | 🟠 Høy |
| **F-5** | Ingen fail2ban — SSH kan brute-forces fritt | 🟠 Høy |
| **F-6** | Ingen verifisert backup | 🟠 Høy |
| **F-7** | Secure Boot avslått | 🟠 Høy |
| **F-8** | Oppdateringer lastes ikke ned (`Download-Upgradeable "0"`) | 🟡 Middels |
| **F-9** | Ingen rootkit-deteksjon eller filintegritet | 🟡 Middels |
| **F-10** | `george` er i `docker`-gruppen = root uten passord | 🟡 Middels, bevisst |

---

## 2. NIVÅ 1 — NØDVENDIG

**Tid: under én time. Gjør dette i dag.** Dette lukker all reell risiko.

### Steg 1 — F-2: Lukk databasene **[A]**

**Må gjøres først**, ellers stenger brannmuren deg ute av dine egne databaser.

Bevis:
```
tcp LISTEN 0.0.0.0:5432   → tosom_dev_db  (postgres:15)
tcp LISTEN 0.0.0.0:5433   → tosom_test_db (postgres:16-alpine)
POSTGRES_USER: tosom
POSTGRES_PASSWORD: tosom
```

Begge databasene er nåbare fra hele lokalnettet — også wifi (`192.168.10.203`) — med brukernavn og passord som er samme ord. En gjests telefon på nettet kan koble seg til og lese alt.

Endringer i `docker-compose.yml` og `docker-compose.test.yml`:
```yaml
ports:
  - "127.0.0.1:5432:5432"      # var: "5432:5432"
environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}   # fra .env, generert verdi
```

Deretter `docker compose down && docker compose up -d`.

**Verifiser:**
```bash
ss -tulnp | grep -E "5432|5433"
# forventet: 127.0.0.1:5432 — IKKE 0.0.0.0
```

> **Merk:** Docker skriver egne iptables-regler og **omgår ufw**. Derfor må dette løses i compose-filen — brannmuren alene er ikke nok.

### Steg 2 — F-1: Slå på brannmuren **[G]**

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow in on tailscale0
sudo ufw enable
sudo ufw status verbose
```

`allow in on tailscale0` beholder admin-veien din. Uten den mister du fjerntilgang.

**Verifiser:** `sudo ufw status verbose` → `Status: active`

### Steg 3 — F-4: Lås SSH til Tailscale **[G]**

```bash
sudo tee /etc/ssh/sshd_config.d/99-sikkerhet.conf <<'EOF'
PasswordAuthentication no
PubkeyAuthentication yes
PermitRootLogin no
ListenAddress 100.122.158.46
MaxAuthTries 3
LoginGraceTime 30
EOF

sudo sshd -t          # syntakssjekk FØR restart
sudo systemctl restart ssh
```

⚠️ **Behold den aktive sesjonen.** Test i en ny terminal:
```bash
ssh george@100.122.158.46
```
Virker det ikke, reverser i den gamle sesjonen: `sudo rm /etc/ssh/sshd_config.d/99-sikkerhet.conf && sudo systemctl restart ssh`

Sjekk også rettigheter på privatnøkkelen:
```bash
chmod 600 ~/.ssh/id_ed25519
chmod 700 ~/.ssh
```

**Verifiser:** `ss -tulnp | grep :22` → kun `100.122.158.46:22`

### Steg 4 — F-5: fail2ban **[G]**

```bash
sudo apt install fail2ban -y

sudo tee /etc/fail2ban/jail.local <<'EOF'
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
EOF

sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

### Steg 5 — F-8: Fulle oppdateringer **[G]**

```bash
sudo tee /etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
EOF
```

### Steg 6 — Hemmeligheter i passordhåndterer **[G]**

Kopier innholdet i `.env` til Bitwarden/1Password. Hvis disken dør eller stjeles, har du dem.

**Etter nivå 1 er maskinen trygg mot alt realistisk.** Resten er dybdeforsvar.

---

## 3. NIVÅ 2 — SOLID

**Tid: en ettermiddag.** For deg som vil ha ordentlig sikkerhet.

### 3.1 F-3: Diskkryptering — to veier **[G]**

Bevis: `lsblk -o FSTYPE | grep -c crypto_LUKS` → **0**

Ved innbrudd, tyveri eller innlevering til service er hele disken lesbar ved å ta ut NVMe-en. Din `.env`, dine SSH-nøkler, dine Tailscale-legitimasjoner, all kode.

Du har **TPM** (`/dev/tpm0`), og det endrer regnestykket: LUKS kan låses opp automatisk ved oppstart, uten at du taster passord hver gang.

#### Vei A — Kryptert volum for det sensitive (ingen reinstallasjon)

Lag en LUKS-kryptert container for dev-databaser, `.env` og nøkler:

```bash
# 1. Lag en 50 GB fil
sudo fallocate -l 50G /var/lib/kryptert.img

# 2. Krypter den
sudo cryptsetup luksFormat /var/lib/kryptert.img

# 3. Åpne og formater
sudo cryptsetup open /var/lib/kryptert.img sikker
sudo mkfs.ext4 /dev/mapper/sikker
sudo mkdir -p /sikker
sudo mount /dev/mapper/sikker /sikker
```

Flytt Docker-volumene og hemmelighetene dit. Må åpnes manuelt etter omstart — én kommando.

**Fordel:** ingen reinstallasjon, kan gjøres nå.
**Ulempe:** dekker ikke systemdisken. Logger, swap og midlertidige filer forblir ukrypterte.

#### Vei B — Full diskkryptering med TPM (krever reinstallasjon)

LUKS kan **ikke** slås på i etterkant. Full kryptering krever ny installasjon av Ubuntu med «Encrypt the new Ubuntu installation» valgt.

Etter installasjon, koble til TPM for automatisk opplåsing:
```bash
sudo systemd-cryptenroll --tpm2-device=auto /dev/nvme0n1p3
```

**Fordel:** alt er kryptert. Ingen passordtasting takket være TPM.
**Ulempe:** en helgejobb. Du må sette opp Docker, Ollama, VS Code og CUDA på nytt.

#### Min anbefaling

**Vei A nå, Vei B ved neste naturlige reinstallasjon.**

Begrunnelsen: når Tosom-produksjon ligger hos leverandør (`HOSTING-MIGRATION-PLAN-v1.0.md`), inneholder PC-en **ingen ekte brukerdata**. Da er full kryptering god hygiene, ikke en GDPR-plikt. Vei A dekker det som faktisk er sensitivt — dine hemmeligheter — uten en helg med reinstallasjon.

Blir maskinen båret ut av huset, eller skal du levere den til service, går du for Vei B først.

### 3.2 F-7: Secure Boot — med en advarsel **[G]**

Bevis: `mokutil --sb-state` → `SecureBoot disabled`

Secure Boot verifiserer at kjernen og bootloaderen ikke er tuklet med. Uten det kan en angriper med fysisk tilgang bytte kjernen.

⚠️ **Reell risiko for GPU-oppsettet ditt.** NVIDIA-driveren er en kjernemodul. Med Secure Boot aktiv må den være signert, ellers laster den ikke — og da mister du CUDA og Qwen til du har fikset MOK-signering.

**Vurdering:** Med F-1 til F-5 på plass er Secure Boot marginal nytte for deg. Det beskytter primært mot en angriper som allerede står ved maskinen — og som da også kunne tatt disken. Det er en langt mer sannsynlig trussel, og den løses av kryptering, ikke Secure Boot.

**Anbefaling: hopp over, med mindre maskinen står tilgjengelig for andre.** Prioriter §3.1 i stedet. Vil du likevel: aktiver i BIOS, og ha `mokutil --import` klar for NVIDIA-modulen.

### 3.3 F-6: Verifisert backup **[A]**

Én disk, ingen RAID, ingen ekstern kopi. Diskkrasj = alt utviklingsarbeid tapt.

Daglig `pg_dump` av dev-databasen til kryptert arkiv, med 14 dagers rotasjon, lagt utenfor repoet.

For kode: `git push` er backup — bruk den ofte.
For `.env` og nøkler: passordhåndterer (§2 steg 6).

**Prinsipp:** en backup som aldri er gjenopprettet, finnes ikke. Test gjenoppretting til en tom database.

### 3.4 F-9: Rootkit og filintegritet **[G]**

```bash
sudo apt install rkhunter chkrootkit aide -y

# Grunnlinje for AIDE (tar noen minutter)
sudo aideinit
sudo mv /var/lib/aide/aide.db.new /var/lib/aide/aide.db

# Kjør rootkit-sjekk
sudo rkhunter --update
sudo rkhunter --check --skip-keypress
```

AIDE varsler hvis systemfiler endres uventet. Kjør `sudo aide --check` månedlig (§5).

### 3.5 F-10: Docker-gruppen — bevisst risiko **[G]**

`george` er i `docker`-gruppen. Det tilsvarer **root uten passord**:

```bash
docker run -v /:/host -it alpine chroot /host    # full tilgang til hele disken
```

Enhver prosess som kjører som deg — også en kompromittert VS Code-utvidelse eller npm-pakke — kan gjøre dette.

**Vurdering:** Du trenger Docker daglig. Alternativet (rootless Docker) er tungt og bryter oppsettet ditt.

**Anbefaling: behold, men vit hva det betyr.** Det gjør disse to punktene viktigere:
- Vær kritisk til VS Code-utvidelser og npm-pakker
- `npm audit` jevnlig, og les hva du installerer

Dette er et bevisst valg, ikke en glipp — så lenge du kjenner det.

### 3.6 Nettverksherding **[G]**

```bash
sudo tee /etc/sysctl.d/99-sikkerhet.conf <<'EOF'
# Ignorer ICMP-broadcast
net.ipv4.icmp_echo_ignore_broadcasts = 1
# Logg mistenkelige pakker
net.ipv4.conf.all.log_martians = 1
# Ingen source routing
net.ipv4.conf.all.accept_source_route = 0
# Ingen ICMP-redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
# SYN flood-vern
net.ipv4.tcp_syncookies = 1
# Reverse path filtering
net.ipv4.conf.all.rp_filter = 1
EOF

sudo sysctl --system
```

---

## 4. NIVÅ 3 — GRUNDIG

For deg som vil ha alt. Ikke nødvendig, men ikke bortkastet.

### 4.1 BIOS/UEFI-passord **[G]**
HP Z2 støtter oppstartspassord. Hindrer at noen booter fra USB og forbigår systemet. Kombinert med kryptering er dette et sterkt fysisk vern.

### 4.2 Revisjonslogg (auditd) **[G]**
```bash
sudo apt install auditd -y
sudo systemctl enable --now auditd
```
Logger hvem som gjorde hva, når. Uvurderlig hvis du en gang skal finne ut hva som skjedde.

### 4.3 Automatisk skjermlås **[G]**
5 minutters inaktivitet → lås. Trivielt, men den vanligste reelle inngangen når noen andre er i rommet.

### 4.4 Separat utviklingskonto **[G]**
En egen konto uten `sudo` for daglig arbeid. Beste vernet mot at en kompromittert npm-pakke får full tilgang. Krever omlegging av arbeidsflyten — vurder om det er verdt det.

### 4.5 Sikker sletting av gamle disker **[G]**
Skal en NVMe ut av huset: `blkdiscard` eller fysisk destruksjon. Formatering er ikke sletting.

### 4.6 Ved mistanke om kompromittering

1. **Koble fra nettet** — fysisk, trekk kabelen
2. **Ikke slå av** — minnet inneholder bevis
3. `sudo aide --check` — hva er endret?
4. `sudo rkhunter --check`
5. `last`, `journalctl -u ssh --since "7 days ago"` — hvem har vært inne?
6. `sudo fail2ban-client status sshd` — blokkerte forsøk?
7. **Roter alle hemmeligheter** — Vipps-nøkler, database, Tailscale, GitHub
8. Ved bekreftet innbrudd: reinstaller. Ikke prøv å rense.

Punkt 7 er det som glemmes. Hemmeligheter på en kompromittert maskin skal regnes som lekket.

---

## 5. LØPENDE RUTINE

Sikkerhet er ikke en engangsjobb.

### Hver uke — 5 minutter
```bash
sudo apt update && sudo apt upgrade      # oppdater
sudo fail2ban-client status sshd         # blokkerte forsøk?
ss -tulnp | grep LISTEN                  # noe nytt som lytter?
git status                               # hemmeligheter på vei inn i repo?
```

### Hver måned — 20 minutter
```bash
sudo aide --check                        # endrede systemfiler?
sudo rkhunter --check --skip-keypress    # rootkits?
npm audit                                # sårbare pakker?
last -20                                 # innlogginger
```
Verifiser også at backupen finnes og kan gjenopprettes.

### Hvert kvartal
- Gjennomgå VS Code-utvidelser — fjern det du ikke bruker
- Gjennomgå Tailscale-enheter — fjern gamle
- Roter SSH-nøkler og API-nøkler
- Les gjennom dette dokumentet på nytt

### Etter enhver endring i oppsettet
`ss -tulnp | grep LISTEN` — lytter noe nytt på `0.0.0.0`? Det er den ene kommandoen som ville avdekket F-2 før den ble et problem.

---

## 6. SJEKKLISTE

### Nivå 1 — nødvendig
- [ ] Databaser bundet til `127.0.0.1`, nytt passord
- [ ] ufw aktiv, `deny incoming`, Tailscale tillatt
- [ ] SSH: ingen passord, kun Tailscale, nøkkel verifisert
- [ ] `~/.ssh` er 700, privatnøkkel 600
- [ ] fail2ban aktiv
- [ ] Fulle automatiske oppdateringer
- [ ] `.env` i passordhåndterer

### Nivå 2 — solid
- [ ] Kryptert volum (Vei A) **eller** full LUKS (Vei B)
- [ ] Verifisert backup av dev-database
- [ ] rkhunter + AIDE installert, grunnlinje satt
- [ ] sysctl-herding
- [ ] Secure Boot vurdert (GPU-risiko forstått)
- [ ] Docker-gruppens betydning forstått

### Nivå 3 — grundig
- [ ] BIOS-passord
- [ ] auditd
- [ ] Automatisk skjermlås
- [ ] Rutine ved kompromittering lest

### Løpende
- [ ] Ukentlig sjekk i kalenderen
- [ ] Månedlig sjekk i kalenderen

---

## 7. Forholdet til Tosom

Dette dokumentet handler om **maskinen**. `HOSTING-MIGRATION-PLAN-v1.0.md` handler om **hvor Tosom bor**. De utfyller hverandre:

| Spørsmål | Dokument |
|---|---|
| Hvordan sikrer jeg PC-en min? | **Dette** |
| Hvor skal brukernes data bo? | HOSTING-MIGRATION-PLAN |

Hostingplanen har invariant **I-15**: *ekte brukerdata skal aldri lagres på MasterSplinter.* Den regelen er bare en intensjon hvis maskinen ikke er sikret — og den gjør samtidig denne guiden lettere, fordi PC-en da ikke huser noe som utløser GDPR-plikter.

**Etter migrering gjelder:**

| Regel |
|---|
| Aldri ekte brukerdata på MasterSplinter — kun syntetiske testdata |
| Dev-databaser kun på loopback |
| Produksjonshemmeligheter kun i passordhåndterer og hos leverandør |
| Ingen produksjonsdump lastes ned — heller ikke «for å debugge» |

Den siste brytes lettest og betyr mest.

---

## 8. Sluttord

Maskinen din er godt satt opp. AppArmor er aktiv, du har TPM, du bruker Tailscale i stedet for å åpne porter mot internett, og `.env` er korrekt gitignorert. Det er ikke tilfeldig — det er noen som har tenkt.

Men to dører står åpne, og den ene er alvorlig: **Postgres på `0.0.0.0` med passordet «tosom»**. Enhver enhet på nettverket ditt kan lese begge databasene.

**Nivå 1 tar under en time og fjerner all reell risiko.** Begynn der, i dag. Resten kan følge i det tempoet du ønsker.

Og husk den ene kommandoen som er verdt mer enn resten til sammen:

```bash
ss -tulnp | grep LISTEN
```

Kjør den av og til. Den forteller deg hvilke dører som står åpne.