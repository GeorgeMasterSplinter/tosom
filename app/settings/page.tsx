/**
 * ToSom — Settings Page (Premium Nordic Gold 2026) ⭐
 * Fullstendig ny oppbygging etter din blueprint — rolig, moden, premium.
 */

"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

/* ═══════════════════════════════════════
   DESIGN SYSTEM (kodeklar blueprint)
   ═══════════════════════════════════════ */

const THEME = {
  // Fargar
  tosomBlue: "#0B1520",
  nordicGold: "#D4AF37",
  goldLight: "#E8C766",
  softWhite: "#F8F9FA",
  deepGrey: "#9CA3AF",
  whitePrimary: "#E5E7EB",
  glassBg: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(255,255,255,0.12)",
  goldMuted: "rgba(212,175,55,0.2)",
  dangerRed: "#FF4D4D",
  orangePrimary: "#F59E0B",
  orangeLight: "#FBBF24",
  greenPrimary: "#10B981",
  greenLight: "#34D399",
  // Typografi
  h1Size: "42px",
  h1Weight: 600 as const,
  sectionTitleSize: "24px",
  sectionTitleWeight: 600 as const,
  bodyFontSize: "18px",
  microFontSize: "16px",
  // Radius
  cardRadius: "20px",
  buttonRadius: "16px",
  toggleRadius: "20px",
  radioRadius: "20px",
  // Spacing
  spaceXl: "48px",
  spaceLg: "32px",
  spaceMd: "24px",
  spaceSm: "16px",
};

/* ═══════════════════════════════════════
   GLASS CARD-komponent (signature)
   ═══════════════════════════════════════ */

function GlassCard({ children, danger }: { children: React.ReactNode; danger?: boolean }) {
  return (
    <div
      className="transition-all duration-300 hover:brightness-110"
      style={{
        background: THEME.glassBg,
        border: `1px solid ${danger ? "rgba(255,77,77,0.2)" : THEME.glassBorder}`,
        borderRadius: THEME.cardRadius,
        padding: THEME.spaceLg,
        marginBottom: THEME.spaceLg,
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════
   SECTION TITTEL (Nordic Gold)
   ═══════════════════════════════════════ */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: THEME.sectionTitleSize,
        fontWeight: THEME.sectionTitleWeight,
        color: THEME.nordicGold,
        marginBottom: THEME.spaceMd,
        letterSpacing: "0.1em",
      }}
    >
      {children}
    </h2>
  );
}

/* ═══════════════════════════════════════
   PREMIUM GULL-KNAPP (48px høgde)
   ═══════════════════════════════════════ */

function GoldButton({
  children,
  onClick,
  fullWidth,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="transition-all duration-300 hover:brightness-110 active:scale-[0.98] focus:outline-none"
      style={{
        background: `linear-gradient(135deg, ${THEME.nordicGold}, ${THEME.goldLight})`,
        color: THEME.tosomBlue,
        borderRadius: THEME.buttonRadius,
        height: "48px",
        padding: fullWidth ? `0 ${THEME.spaceLg}` : `0 24px`,
        fontSize: "18px",
        fontWeight: 600,
        width: fullWidth ? "100%" : "auto",
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════
   OUTLINE GULL-KNAPP
   ═══════════════════════════════════════ */

function OutlineGoldButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="transition-all duration-300 hover:brightness-110 active:scale-[0.98] focus:outline-none"
      style={{
        background: "transparent",
        border: `1px solid ${THEME.nordicGold}`,
        color: THEME.nordicGold,
        borderRadius: THEME.buttonRadius,
        height: "48px",
        padding: "0 24px",
        fontSize: "16px",
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════
   ORANGE KNAPP (sama stil som Danger — transparent bakgrunn)
   ═══════════════════════════════════════ */

function OrangeButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="transition-all duration-300 hover:brightness-110 active:scale-[0.98] focus:outline-none"
      style={{
        background: "transparent",
        border: `1px solid ${THEME.orangePrimary}`,
        color: THEME.orangePrimary,
        borderRadius: THEME.buttonRadius,
        height: "48px",
        padding: "0 24px",
        fontSize: "16px",
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════
   GREEN KNAPP (sama stil som Danger — transparent bakgrunn)
   ═══════════════════════════════════════ */

function GreenButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="transition-all duration-300 hover:brightness-110 active:scale-[0.98] focus:outline-none"
      style={{
        background: "transparent",
        border: `1px solid ${THEME.greenPrimary}`,
        color: THEME.greenPrimary,
        borderRadius: THEME.buttonRadius,
        height: "48px",
        padding: "0 24px",
        fontSize: "16px",
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════
   GREEN LENKJE
   ═══════════════════════════════════════ */

function GreenLink({ children, href }: { children: React.ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="transition-all duration-300 hover:opacity-80 focus:outline-none"
      style={{ color: THEME.greenPrimary, fontSize: "16px", fontWeight: 600 }}
    >
      {children}
    </a>
  );
}

/* ═══════════════════════════════════════
   PREMIUM TOGGLE (gull, 20px radius)
   ═══════════════════════════════════════ */

function GoldToggle({ label, desc, checked, onChange }: { label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <p style={{ color: THEME.softWhite, fontSize: "16px", fontWeight: 500 }}>{label}</p>
        {desc && <p style={{ color: THEME.deepGrey, fontSize: "14px", marginTop: "4px" }}>{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className="relative w-[52px] h-[28px] rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
        style={{
          background: checked
            ? `linear-gradient(135deg, ${THEME.nordicGold}, ${THEME.goldLight})`
            : "rgba(255,255,255,0.12)",
          borderRadius: THEME.toggleRadius,
        }}
      >
        <div
          className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300"
          style={{ left: checked ? "24px" : "2px" }}
        />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════
   PREMIUM RADIO-knapp (20px radius)
   ═══════════════════════════════════════ */

function GoldRadio({ label, sublabel, selected, onClick }: { label: string; sublabel?: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left transition-all duration-300 focus:outline-none"
      style={{
        display: "flex",
        alignItems: "center",
        gap: THEME.spaceSm,
        padding: `${THEME.spaceSm} ${THEME.spaceMd}`,
        borderRadius: THEME.radioRadius,
        background: selected ? `${THEME.goldMuted}` : "rgba(255,255,255,0.04)",
        border: selected ? `2px solid ${THEME.nordicGold}` : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Radio ikon */}
      <div
        className="flex-shrink-0"
        style={{ width: "24px", height: "24px", borderRadius: "50%", border: `2px solid ${selected ? THEME.nordicGold : "rgba(255,255,255,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {selected && (
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: THEME.nordicGold }} />
        )}
      </div>
      <div>
        <p style={{ color: selected ? THEME.nordicGold : THEME.softWhite, fontSize: "16px", fontWeight: selected ? 600 : 400 }}>{label}</p>
        {sublabel && <p style={{ color: THEME.deepGrey, fontSize: "13px" }}>{sublabel}</p>}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════
   GULL LENKJE
   ═══════════════════════════════════════ */

function GoldLink({ children, href }: { children: React.ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="transition-all duration-300 hover:opacity-80 focus:outline-none"
      style={{ color: THEME.nordicGold, fontSize: "16px", fontWeight: 500 }}
    >
      {children}
    </a>
  );
}

/* ═══════════════════════════════════════
   RAUD KNAPP (Slett konto)
   ═══════════════════════════════════════ */

function DangerButton({ children, onClick, fullWidth }: { children: React.ReactNode; onClick?: () => void; fullWidth?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="transition-all duration-300 hover:brightness-110 active:scale-[0.98] focus:outline-none"
      style={{
        background: "rgba(255,77,77,0.12)",
        border: "1px solid rgba(255,77,77,0.4)",
        color: THEME.dangerRed,
        borderRadius: THEME.buttonRadius,
        height: "48px",
        padding: fullWidth ? `0 ${THEME.spaceLg}` : "0 24px",
        fontSize: "16px",
        fontWeight: 600,
        width: fullWidth ? "100%" : "auto",
      }}
    >
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════
   LABEL-komponent
   ═══════════════════════════════════════ */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: THEME.deepGrey, fontSize: "14px", marginBottom: "8px" }}>{children}</p>
  );
}

/* ═══════════════════════════════════════
   FIELD-VERDI-komponent
   ═══════════════════════════════════════ */

function FieldValue({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: THEME.softWhite, fontSize: "16px", fontWeight: 500 }}>{children}</p>
  );
}

/* ═══════════════════════════════════════
   AVDELING-LINJE
   ═══════════════════════════════════════ */

function Divider() {
  return (
    <div style={{ borderTop: `1px solid ${THEME.glassBorder}`, marginTop: "16px", marginBottom: "16px" }} />
  );
}

/* ═══════════════════════════════════════
   AKTIV SECTION
   ═══════════════════════════════════════ */

function ActiveBadge() {
  return (
    <span
      className="text-xs font-semibold px-3 py-1.5 rounded-full"
      style={{ background: `${THEME.goldMuted}`, color: THEME.nordicGold }}
    >
      Aktivert
    </span>
  );
}

/* ═══════════════════════════════════════
   1. KONTAKT-SEKSJON
   ═══════════════════════════════════════ */

function KontoSection() {
  return (
    <GlassCard>
      <SectionTitle>KONTO</SectionTitle>

      <div style={{ marginBottom: "24px" }}>
        <FieldLabel>E-post</FieldLabel>
        <FieldValue>innlogga@eksempel.no</FieldValue>
      </div>

      <Divider />

      <div style={{ marginBottom: "24px" }}>
        <FieldLabel>Påloggingsmetode</FieldLabel>
        <FieldValue>Vipps / e-post</FieldValue>
      </div>

      <Divider />

      <div className="flex gap-3 flex-wrap">
        <GoldButton>Bytt konto</GoldButton>
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   2. VARSLER-SEKSJON
   ═══════════════════════════════════════ */

function VarslerSection() {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  return (
    <GlassCard>
      <SectionTitle>VARSLER</SectionTitle>

      <div className="flex items-center justify-between">
        <div>
          <p style={{ color: THEME.softWhite, fontSize: "16px", fontWeight: 500 }}>Push-varsler</p>
          <p style={{ color: THEME.deepGrey, fontSize: "14px" }}>Meldings- og match-varsler på mobilen</p>
        </div>
        <button
          onClick={() => setPush(!push)}
          role="switch"
          aria-checked={push}
          className="relative w-[52px] h-[28px] rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
          style={{
            background: push
              ? `linear-gradient(135deg, ${THEME.nordicGold}, ${THEME.goldLight})`
              : "rgba(255,255,255,0.12)",
            borderRadius: THEME.toggleRadius,
          }}
        >
          <div
            className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300"
            style={{ left: push ? "24px" : "2px" }}
          />
        </button>
      </div>

      <Divider />

      <div className="flex items-center justify-between">
        <div>
          <p style={{ color: THEME.softWhite, fontSize: "16px", fontWeight: 500 }}>E-post-varsler</p>
          <p style={{ color: THEME.deepGrey, fontSize: "14px" }}>Få varsel på e-post ved nye matcher og meldingar</p>
        </div>
        <button
          onClick={() => setEmail(!email)}
          role="switch"
          aria-checked={email}
          className="relative w-[52px] h-[28px] rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
          style={{
            background: email
              ? `linear-gradient(135deg, ${THEME.nordicGold}, ${THEME.goldLight})`
              : "rgba(255,255,255,0.12)",
            borderRadius: THEME.toggleRadius,
          }}
        >
          <div
            className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-lg transition-all duration-300"
            style={{ left: email ? "24px" : "2px" }}
          />
        </button>
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   3. PERSONVERN-SEKSJON
   ═══════════════════════════════════════ */

function PersonvernSection() {
  return (
    <GlassCard>
      <SectionTitle>PERSONVERN</SectionTitle>

      <p style={{ color: THEME.whitePrimary, fontSize: "16px", lineHeight: "1.7", marginBottom: "24px" }}>
        ToSom lagrar bare data som er nødvendig for å gi deg ei trygg og roleg relasjonsoppleving. 
        Du kan til enhver tid be om uttrekk eller sletting av dine persondata.
      </p>

      <div className="flex gap-3 flex-wrap">
        <GreenLink href="/personvern">Les personvernerklæring →</GreenLink>
      </div>

      <div style={{ marginTop: "16px" }}>
        <GreenButton>Be om uttrekk av persondata</GreenButton>
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   4. SPRÅK-SEKSJON
   ═══════════════════════════════════════ */

function SprakSection() {
  const [lang, setLang] = useState("bokmal");
  return (
    <GlassCard>
      <SectionTitle>SPRÅK</SectionTitle>

      <div className="space-y-3">
        <GoldRadio label="Bokmål" selected={lang === "bokmal"} onClick={() => setLang("bokmal")} />
        <GoldRadio label="Nynorsk" sublabel="Kommer snart" selected={lang === "nynorsk"} onClick={() => setLang("nynorsk")} />
        <GoldRadio label="English" sublabel="Coming soon" selected={lang === "english"} onClick={() => setLang("english")} />
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   5. TEMA-SEKSJON
   ═══════════════════════════════════════ */

function TemaSection() {
  const [theme, setTheme] = useState("mork");
  return (
    <GlassCard>
      <SectionTitle>TEMA</SectionTitle>

      <div className="space-y-3">
        <GoldRadio label="Mørk blå" selected={theme === "mork"} onClick={() => setTheme("mork")} />
        <GoldRadio label="ToSom Blue + Nordic Gold" sublabel="Premium kombinasjon" selected={theme === "premium"} onClick={() => setTheme("premium")} />
        <GoldRadio label="Lys" sublabel="Kommer snart" selected={theme === "lys"} onClick={() => setTheme("lys")} />
        <GoldRadio label="Lys bakgrunn med gull-aksenter" sublabel="Kommer snart" selected={theme === "gul"} onClick={() => setTheme("gul")} />
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   6. MATCH-SEKSJON
   ═══════════════════════════════════════ */

function MatchSection() {
  return (
    <GlassCard>
      <SectionTitle>MATCH</SectionTitle>

      <div className="flex gap-3 flex-wrap">
        <GoldButton>Start ny reise</GoldButton>
        <OrangeButton>Slett match og start på nytt</OrangeButton>
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   7. SLETT KONTO-SEKSJON
   ═══════════════════════════════════════ */

function SlettKontoSection() {
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <GlassCard danger>
      <SectionTitle>SLETT KONTO</SectionTitle>

      <p style={{ color: THEME.deepGrey, fontSize: "16px", lineHeight: "1.7", marginBottom: "24px" }}>
        Når du sletter kontoen din blir all data permanent fjernet. Dette kan ikke angrast.
      </p>

      {!showConfirm ? (
        <DangerButton fullWidth>Slett konto permanent</DangerButton>
      ) : (
        <div className="space-y-3" style={{ background: "rgba(255,77,77,0.04)", borderRadius: "16px", padding: "24px" }}>
          <p style={{ color: THEME.dangerRed, fontSize: "16px", fontWeight: 500 }}>Er du sikker? Type "SLETT" for å bekrefte.</p>
          <input
            className="w-full h-10 text-center rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-red-400/40"
            style={{ background: "rgba(255,77,77,0.06)", border: "1px solid rgba(255,77,77,0.2)", color: THEME.dangerRed }}
            placeholder="SLETT"
          />
          <div className="flex gap-3">
            <DangerButton onClick={() => setShowConfirm(false)}>Angre</DangerButton>
            <OutlineGoldButton onClick={() => setShowConfirm(false)}>Bare lukke</OutlineGoldButton>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   8. AVSLUTT-SEKSJON
   ═══════════════════════════════════════ */

function AvsluttSection() {
  return (
    <div style={{ marginTop: "16px" }}>
      <GoldButton fullWidth onClick={() => signOut({ callbackUrl: "/" })}>Logg ut</GoldButton>
    </div>
  );
}

/* ═══════════════════════════════════════
   HOVUD-KOMponent — SETTINGS PAGE
   ═══════════════════════════════════════ */

export default function SettingsPage() {
  return (
    <div
      className="min-h-screen flex items-start justify-center px-4"
      style={{
        background: `linear-gradient(180deg, ${THEME.tosomBlue} 0%, #0F1A26 100%)`,
        paddingTop: "96px",
        paddingBottom: "96px",
      }}
    >
      {/* Max-width container — venstrejustert */}
      <div className="w-full" style={{ maxWidth: "840px" }}>
        {/* ═══ HEADER ═══ */}
        <div style={{ marginBottom: "48px" }}>
          <h1
            style={{
              fontSize: THEME.h1Size,
              fontWeight: THEME.h1Weight,
              color: THEME.softWhite,
              margin: 0,
            }}
          >
            Innstillinger
          </h1>
          <p
            style={{
              fontSize: "20px",
              fontWeight: 400,
              color: THEME.deepGrey,
              marginTop: "8px",
            }}
          >
            Administrer kontoen, varslene og preferansene dine.
          </p>
        </div>

        {/* ═══ SEKSJONAR ═══ */}

        <KontoSection />
        <VarslerSection />
        <PersonvernSection />
        <SprakSection />
        <TemaSection />
        <MatchSection />
        <SlettKontoSection />
        <AvsluttSection />
      </div>
    </div>
  );
}