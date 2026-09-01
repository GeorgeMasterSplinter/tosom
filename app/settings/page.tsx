/**
 * Tosom — Settings Page (Premium Nordic Gold 2026) ⭐
 * Oppgradert: personlig header, granular varsler, sikkerhet, hjelp, statusbevisst match.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { csrfFetch } from "@/lib/api/csrfClient";
import GlassCard from "@/components/ui/cards/GlassCard";

/* ═══════════════════════════════════════
   DESIGN SYSTEM (kodeklar blueprint)
   ═══════════════════════════════════════ */

const THEME = {
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
  greenPrimary: "#10B981",
  greenLight: "#34D399",
  h1Size: "42px",
  h1Weight: 600 as const,
  sectionTitleSize: "24px",
  sectionTitleWeight: 600 as const,
  bodyFontSize: "18px",
  cardRadius: "20px",
  buttonRadius: "16px",
  toggleRadius: "20px",
  radioRadius: "20px",
  spaceXl: "48px",
  spaceLg: "32px",
  spaceMd: "24px",
  spaceSm: "16px",
};

/* ═══════════════════════════════════════
   INTERFACES
   ═══════════════════════════════════════ */

interface ProfileData {
  identityName: string | null;
  photoUrl: string | null;
  currentDay: number;
}

interface MatchStatus {
  hasActiveMatch: boolean;
  matchId: string | null;
  conversationId: string | null;
}

interface JourneyStatus {
  journeyState: string;
  day: number;
  conversationId: string | null;
}

interface Preferences {
  language: string;
  theme: string;
  notifications: boolean;
  push: boolean;
  email: boolean;
  pushMatch: boolean;
  pushMessages: boolean;
  pushJourney: boolean;
  emailMatch: boolean;
  emailMessages: boolean;
  emailJourney: boolean;
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
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="transition-all duration-300 hover:brightness-110 active:scale-[0.98] focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: `linear-gradient(135deg, ${THEME.nordicGold}, ${THEME.goldLight})`,
        color: THEME.tosomBlue,
        borderRadius: THEME.buttonRadius,
        height: "48px",
        padding: fullWidth ? `0 ${THEME.spaceLg}` : "0 24px",
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
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="transition-all duration-300 hover:brightness-110 active:scale-[0.98] focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
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
   DANGER KNAPP (transparent bakgrunn)
   ═══════════════════════════════════════ */

function DangerButton({ children, onClick, fullWidth, disabled }: { children: React.ReactNode; onClick?: () => void; fullWidth?: boolean; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="transition-all duration-300 hover:brightness-110 active:scale-[0.98] focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
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
   PREMIUM TOGGLE (gull, 20px radius)
   ═══════════════════════════════════════ */

function GoldToggle({
  label,
  desc,
  checked,
  onChange,
  disabled,
  sub,
}: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  sub?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-xl transition-all duration-300 hover:bg-white/[0.02]"
      style={{
        padding: sub ? "14px 16px" : "16px 20px",
        paddingLeft: sub ? "32px" : "20px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(212,175,55,0.12)",
        marginBottom: "4px",
      }}
    >
      <div>
        <p style={{ color: disabled ? "rgba(255,255,255,0.3)" : THEME.softWhite, fontSize: sub ? "14px" : "16px", fontWeight: sub ? 400 : 500, letterSpacing: sub ? "0.01em" : "0.02em" }}>
          {label}
        </p>
        {desc && <p style={{ color: THEME.deepGrey, fontSize: "13px", marginTop: "6px", letterSpacing: "0.01em" }}>{desc}</p>}
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className="relative w-[52px] h-[28px] rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: checked
            ? `linear-gradient(135deg, ${THEME.nordicGold}, ${THEME.goldLight})`
            : "rgba(255,255,255,0.12)",
          borderRadius: THEME.toggleRadius,
          boxShadow: checked ? `0 0 12px rgba(212,175,55,0.35), 0 0 24px rgba(212,175,55,0.15)` : "none",
        }}
      >
        <div
          className="absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300"
          style={{
            left: checked ? "24px" : "2px",
            background: "#fff",
            boxShadow: checked ? "0 2px 8px rgba(212,175,55,0.4)" : "0 2px 4px rgba(0,0,0,0.3)",
          }}
        />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════
   PREMIUM RADIO-knapp (20px radius)
   ═══════════════════════════════════════ */

function GoldRadio({ label, sublabel, selected, onClick, disabled }: { label: string; sublabel?: string; selected: boolean; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left transition-all duration-300 focus:outline-none disabled:opacity-50"
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
      <div
        className="flex-shrink-0"
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          border: `2px solid ${selected ? THEME.nordicGold : "rgba(255,255,255,0.3)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
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
   1. HEADER — Personlig med avatar
   ═══════════════════════════════════════ */

function SettingsHeader({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  return (
    <div style={{ marginBottom: "48px" }}>
      <div className="flex items-center gap-4" style={{ marginBottom: "16px" }}>
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt={name}
            className="w-14 h-14 rounded-full object-cover"
            style={{
              border: `2px solid ${THEME.nordicGold}`,
              boxShadow: `0 0 16px ${THEME.goldMuted}`,
            }}
          />
        ) : (
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-semibold"
            style={{
              background: `linear-gradient(135deg, ${THEME.goldMuted}, rgba(212,175,55,0.08))`,
              border: `2px solid ${THEME.goldMuted}`,
              color: THEME.nordicGold,
            }}
          >
            {name?.charAt(0)?.toUpperCase() || "T"}
          </div>
        )}
        <div>
          <h1
            style={{
              fontSize: THEME.h1Size,
              fontWeight: THEME.h1Weight,
              color: THEME.softWhite,
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            Innstillinger
          </h1>
          <p style={{ fontSize: "16px", fontWeight: 400, color: THEME.deepGrey, marginTop: "4px" }}>
            Hei {name}. Administrer kontoen, varslene og preferansene dine.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   2. KONTO-SEKSJON
   ═══════════════════════════════════════ */

function KontoSection({ name, email, memberSince }: { name: string; email: string; memberSince: string }) {
  return (
    <GlassCard className="transition-all duration-300 hover:brightness-110 mb-8">
      <SectionTitle>KONTO</SectionTitle>

      <div style={{ marginBottom: "24px" }}>
        <FieldLabel>Påloggingsmetode</FieldLabel>
        <FieldValue>Vipps</FieldValue>
      </div>

      <Divider />

      <div style={{ marginBottom: "24px" }}>
        <FieldLabel>E-postadresse</FieldLabel>
        <FieldValue>{email}</FieldValue>
      </div>

      <Divider />

      <div style={{ marginBottom: "24px" }}>
        <FieldLabel>Medlem siden</FieldLabel>
        <FieldValue>{memberSince}</FieldValue>
      </div>

      <Divider />

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="transition-all duration-300 hover:bg-white/[0.06] hover:border-[rgba(212,175,55,0.4)] active:scale-[0.98] focus:outline-none"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(212,175,55,0.25)",
            color: THEME.nordicGold,
            borderRadius: THEME.buttonRadius,
            height: "48px",
            padding: "0 24px",
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          Logg ut
        </button>
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   3. VARSLER-SEKSJON — Granular kontroll
   ═══════════════════════════════════════ */

function NotificationPill({
  label,
  active,
  dimmed,
  onClick,
}: {
  label: string;
  active: boolean;
  dimmed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={dimmed}
      className="rounded-full transition-all duration-300 focus:outline-none disabled:cursor-not-allowed"
      style={{
        padding: "6px 16px",
        fontSize: "13px",
        fontWeight: 500,
        letterSpacing: "0.02em",
        background: active ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${active ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.08)"}`,
        color: active ? THEME.nordicGold : "rgba(255,255,255,0.4)",
        boxShadow: active ? "0 0 10px rgba(212,175,55,0.2)" : "none",
        opacity: dimmed ? 0.4 : 1,
        pointerEvents: dimmed ? "none" : "auto",
      }}
    >
      {label}
    </button>
  );
}

function NotificationGroup({
  icon,
  title,
  pills,
}: {
  icon: string;
  title: string;
  pills: Array<{ label: string; active: boolean; onToggle: () => void }>;
}) {
  return (
    <div
      className="rounded-2xl transition-all duration-300"
      style={{
        padding: "16px 20px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(212,175,55,0.12)",
        marginBottom: "12px",
      }}
    >
      <div className="flex items-center gap-3" style={{ marginBottom: "12px" }}>
        <span style={{ fontSize: "24px" }}>{icon}</span>
        <p style={{ color: THEME.softWhite, fontSize: "15px", fontWeight: 500, letterSpacing: "0.02em" }}>
          {title}
        </p>
      </div>

      <div className="flex flex-wrap gap-2" style={{ paddingLeft: "32px" }}>
        {pills.map((p) => (
          <NotificationPill
            key={p.label}
            label={p.label}
            active={p.active}
            dimmed={false}
            onClick={p.onToggle}
          />
        ))}
      </div>
    </div>
  );
}

function VarslerSection({
  prefs,
  onToggle,
}: {
  prefs: Preferences;
  onToggle: (key: keyof Preferences, value: boolean) => void;
}) {
  return (
    <GlassCard className="transition-all duration-300 hover:brightness-110 mb-8">
      <SectionTitle>VARSLER</SectionTitle>

      <NotificationGroup
        icon="📱"
        title="Push-varsler"
        pills={[
          { label: "Match", active: prefs.pushMatch, onToggle: () => onToggle("pushMatch", !prefs.pushMatch) },
          { label: "Meldinger", active: prefs.pushMessages, onToggle: () => onToggle("pushMessages", !prefs.pushMessages) },
        ]}
      />

      <NotificationGroup
        icon="📧"
        title="E-post-varsler"
        pills={[
          { label: "Match", active: prefs.emailMatch, onToggle: () => onToggle("emailMatch", !prefs.emailMatch) },
        ]}
      />
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   4. SIKKERHET — Rapportering & blokkering
   ═══════════════════════════════════════ */

function SikkerhetSection({ matchStatus, journeyStatus }: { matchStatus: MatchStatus; journeyStatus: JourneyStatus }) {
  const router = useRouter();
  const [showReport, setShowReport] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const hasActiveMatch = matchStatus.hasActiveMatch;

  const severities = [
    { value: "LOW", label: "Lav", desc: "Ubehagelig eller uønsket atferd", color: "#D4AF37", bg: "rgba(212,175,55,0.12)", border: "rgba(212,175,55,0.4)", apiCategory: "INAPPROPRIATE" },
    { value: "MEDIUM", label: "Middel", desc: "Gjentatt eller bevisst uønsket atferd", color: "#E8875B", bg: "rgba(232,135,91,0.12)", border: "rgba(232,135,91,0.4)", apiCategory: "HARASSMENT" },
    { value: "HIGH", label: "Høy", desc: "Trusler, voldelige uttrykk eller grov atferd", color: "#FF4D4D", bg: "rgba(255,77,77,0.12)", border: "rgba(255,77,77,0.4)", apiCategory: "HARASSMENT" },
  ];

  const severityToApi = (value: string): string => {
    const s = severities.find((x) => x.value === value);
    return s ? (s as any).apiCategory : "OTHER";
  };

  const handleSubmit = async () => {
    if (!category || !matchStatus.matchId) return;
    setSending(true);
    setReportError(null);
    try {
      // Hent partnerId via conversation
      const convRes = await fetch(`/api/chat/conversations`);
      const convData = convRes.ok ? await convRes.json() : {};
      // API-et returnerer { success, data: [...] } — «data», ikke «conversations»
      const conversations: any[] = convData.data || [];
      const currentConvo =
        conversations.find((c) => c.id === matchStatus.conversationId) ||
        conversations[0];
      const partnerId = currentConvo?.partnerId || currentConvo?.partner?.id;

      if (!partnerId) {
        console.error("Kunne ikke finne partnerId");
        setReportError("Fant ingen aktiv samtale å rapportere. Gå til chatten først, og prøv igjen.");
        setSending(false);
        return;
      }

      const res = await csrfFetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportedId: partnerId, matchId: matchStatus.matchId, category: severityToApi(category), description }),
      });

      if (res.ok) {
        setSuccess(true);
        setCategory("");
        setDescription("");
        setTimeout(() => {
          setShowReport(false);
          setSuccess(false);
        }, 2500);
      } else {
        const errJson = await res.json().catch(() => null);
        setReportError(errJson?.error || "Kunne ikke sende rapporten. Prøv igjen.");
      }
    } catch {
      console.error("Feil ved rapportering");
      setReportError("Noe gikk galt ved sending av rapporten. Prøv igjen.");
    }
    setSending(false);
  };

  const handleBlock = async () => {
    setSending(true);
    try {
      await fetch("/api/journey/exit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "blocked" }),
      });
      router.push("/dashboard?ended=safety");
    } catch {
      console.error("Feil ved blokkering");
      setSending(false);
    }
  };

  const handleEndJourney = async () => {
    setSending(true);
    try {
      await fetch("/api/journey/exit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "early_exit" }),
      });
      router.push("/dashboard?ended=early");
    } catch {
      console.error("Feil ved avslutt reise");
      setSending(false);
      setShowEndConfirm(false);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  const handleDelete = async () => {
    if (deleteText !== "SLETT") return;
    try {
      await csrfFetch("/api/settings/delete-account", { method: "POST" });
      await signOut({ callbackUrl: "/" });
    } catch {
      console.error("Feil ved sletting av konto");
    }
  };

  return (
    <GlassCard className="transition-all duration-300 hover:brightness-110 mb-8">
      <SectionTitle>SIKKERHET</SectionTitle>

      <p style={{ color: THEME.whitePrimary, fontSize: "15px", lineHeight: "1.7", marginBottom: "24px" }}>
        Opplever du noe ubehagelig, kan du rapportere det her. Vi leser alle rapporter. Ved brudd gir vi advarsel eller stenger kontoen.
      </p>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setShowReport(true)}
          className="transition-all duration-300 hover:brightness-110 active:scale-[0.98] focus:outline-none"
          style={{
            background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.4)",
            color: "#10B981",
            borderRadius: THEME.buttonRadius,
            height: "48px",
            padding: "0 24px",
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          Rapporter
        </button>
        <OutlineGoldButton onClick={() => setShowEndConfirm(true)} disabled={!hasActiveMatch}>Avslutt reisen</OutlineGoldButton>
        <DangerButton onClick={() => setShowBlock(true)} disabled={!hasActiveMatch}>Blokkere og avslutt</DangerButton>
      </div>

      {/* End Journey Confirm Modal */}
      {showEndConfirm && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-8 text-center relative"
            style={{ background: "rgba(11,21,32,0.97)", border: `1px solid ${THEME.goldMuted}` }}
          >
            <button
              onClick={() => setShowEndConfirm(false)}
              className="absolute top-4 right-4"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              ✕
            </button>
            <h3 className="mb-3 text-xl font-bold" style={{ color: THEME.nordicGold }}>
              Avslutt reisen?
            </h3>
            <p style={{ fontSize: "15px", lineHeight: "1.7", color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>
              Reisen avsluttes. Samtalen slettes for dere begge.
            </p>
            <p style={{ fontSize: "13px", lineHeight: "1.5", color: "rgba(212,175,55,0.8)", marginBottom: "24px", fontStyle: "italic" }}>
              Du kan starte en ny reise når du vil.
            </p>
            <GoldButton fullWidth onClick={handleEndJourney} disabled={sending}>
              {sending ? "Behandler..." : "Ja, avslutt reisen"}
            </GoldButton>
            <button
              onClick={() => setShowEndConfirm(false)}
              className="w-full mt-3 py-3 rounded-xl text-sm transition-all hover:opacity-80"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Avbryt
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReport && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-8 relative"
            style={{ background: "rgba(11,21,32,0.97)", border: `1px solid ${THEME.goldMuted}` }}
          >
            <button
              onClick={() => setShowReport(false)}
              className="absolute top-4 right-4"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4" style={{ color: THEME.nordicGold }}>
              Rapporter din match
            </h3>

            {success ? (
              <div className="text-center py-8">
                <p className="text-2xl mb-3">✓</p>
                <p style={{ color: THEME.softWhite, fontSize: "16px" }}>Takk. Rapporten din er mottatt.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {severities.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setCategory(s.value)}
                      className="w-full text-left px-4 py-3 rounded-xl transition-all"
                      style={{
                        background: category === s.value ? (s as any).bg : "rgba(255,255,255,0.03)",
                        border: `1px solid ${category === s.value ? (s as any).border : "rgba(255,255,255,0.06)"}`,
                      }}
                    >
                      <p style={{ color: category === s.value ? (s as any).color : THEME.softWhite, fontSize: "15px", fontWeight: 600 }}>{s.label}</p>
                      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "4px" }}>{s.desc}</p>
                    </button>
                  ))}
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beskriv hva som skjedde (valgfritt)..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm mb-4 bg-transparent border resize-none focus:outline-none"
                  style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
                />
                {reportError && (
                  <p style={{ color: "#FF4D4D", fontSize: "13px", marginBottom: "12px", lineHeight: "1.5" }}>{reportError}</p>
                )}
                <GoldButton fullWidth disabled={!category || sending} onClick={handleSubmit}>
                  {sending ? "Sender..." : "Send rapport"}
                </GoldButton>
              </>
            )}
          </div>
        </div>
      )}

      {/* Divider: Slett konto */}
      <Divider />

      <div>
        <p style={{ color: THEME.deepGrey, fontSize: "14px", marginBottom: "16px" }}>
          Du kan også slette kontoen din permanent.
        </p>
        {!showDeleteConfirm ? (
          <DangerButton onClick={() => setShowDeleteConfirm(true)}>
            Slett konto permanent
          </DangerButton>
        ) : (
          <div className="space-y-3" style={{ background: "rgba(255,77,77,0.04)", borderRadius: "16px", padding: "24px" }}>
            <p style={{ color: THEME.dangerRed, fontSize: "16px", fontWeight: 500 }}>
              Er du sikker? Skriv "SLETT" for å bekrefte.
            </p>
            <input
              className="w-full h-10 text-center rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-red-400/40"
              style={{ background: "rgba(255,77,77,0.06)", border: "1px solid rgba(255,77,77,0.2)", color: THEME.dangerRed }}
              placeholder="SLETT"
              value={deleteText}
              onChange={(e) => setDeleteText(e.target.value)}
            />
            <div className="flex gap-3">
              <DangerButton fullWidth onClick={handleDelete} disabled={deleteText !== "SLETT"}>
                Slett permanent
              </DangerButton>
              <OutlineGoldButton onClick={() => { setShowDeleteConfirm(false); setDeleteText(""); }}>
                Avbryt
              </OutlineGoldButton>
            </div>
          </div>
        )}
      </div>

      {/* Block Confirm Modal */}
      {showBlock && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-8 text-center relative"
            style={{ background: "rgba(11,21,32,0.97)", border: "1px solid rgba(255,77,77,0.3)" }}
          >
            <button
              onClick={() => setShowBlock(false)}
              className="absolute top-4 right-4"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              ✕
            </button>
            <h3 className="mb-3 text-xl font-bold" style={{ color: THEME.dangerRed }}>
              Blokker og avslutt?
            </h3>
            <p style={{ fontSize: "15px", lineHeight: "1.7", color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>
              Reisen avsluttes. Brukeren blokkeres permanent.
            </p>
            <p style={{ fontSize: "13px", lineHeight: "1.5", color: "rgba(212,175,55,0.8)", marginBottom: "24px", fontStyle: "italic" }}>
              Dette sletter samtalen for dere begge. Det kan ikke angres.
            </p>
            <DangerButton fullWidth onClick={handleBlock} disabled={sending}>
              {sending ? "Behandler..." : "Ja, blokker og avslutt"}
            </DangerButton>
            <button
              onClick={() => setShowBlock(false)}
              className="w-full mt-3 py-3 rounded-xl text-sm transition-all hover:opacity-80"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Avbryt
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   5. PERSONVERN-SEKSJON
   ═══════════════════════════════════════ */

function PersonvernSection() {
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleExport = async () => {
    setRequesting(true);
    try {
      const res = await fetch("/api/settings/export");
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tosom-persondata-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setRequested(true);
        setTimeout(() => setRequested(false), 3000);
      }
    } catch {
      console.error("Feil ved eksport");
    }
    setRequesting(false);
  };

  return (
    <GlassCard className="transition-all duration-300 hover:brightness-110 mb-8">
      <SectionTitle>PERSONVERN</SectionTitle>

      <p style={{ color: THEME.whitePrimary, fontSize: "16px", lineHeight: "1.7", marginBottom: "24px" }}>
        ToSom lagrer bare data som er nødvendig for å gi deg en trygg og rolig relasjonsopplevelse.
        Du kan til enhver tid be om uttrekk eller sletting av dine persondata.
      </p>

      <div className="flex gap-3 flex-wrap items-center">
        <GoldLink href="/personvern">Les personvernerklæring →</GoldLink>
      </div>

      <div style={{ marginTop: "16px" }}>
        <button
          onClick={handleExport}
          disabled={requesting}
          className="w-full transition-all duration-300 hover:bg-white/[0.06] hover:border-[rgba(212,175,55,0.4)] active:scale-[0.98] focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(212,175,55,0.25)",
            color: THEME.nordicGold,
            borderRadius: THEME.buttonRadius,
            height: "48px",
            padding: "0 24px",
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          {requested ? "✓ Nedlastet" : requesting ? "Lagrer..." : "Last ned uttrekk av persondata"}
        </button>
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   6. SPRÅK-SEKSJON — Forenklet
   ═══════════════════════════════════════ */

function SprakSection({ lang, onLangChange }: { lang: string; onLangChange: (l: string) => void }) {
  return (
    <GlassCard className="transition-all duration-300 hover:brightness-110 mb-8">
      <SectionTitle>SPRÅK</SectionTitle>

      <div className="space-y-3">
        <GoldRadio label="Bokmål" selected={lang === "bokmal"} onClick={() => onLangChange("bokmal")} />
        <GoldRadio label="Nynorsk" sublabel="Kommer snart" disabled selected={lang === "nynorsk"} />
        <GoldRadio label="English" sublabel="Coming soon" disabled selected={lang === "english"} />
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   7. TEMA-SEKSJON — Forenklet
   ═══════════════════════════════════════ */

function TemaSection({ theme, onThemeChange }: { theme: string; onThemeChange: (t: string) => void }) {
  return (
    <GlassCard className="transition-all duration-300 hover:brightness-110 mb-8">
      <SectionTitle>TEMA</SectionTitle>

      <div className="space-y-3">
        <GoldRadio
          label="ToSom Blue + Nordic Gold"
          sublabel="Premium kombinasjon"
          selected={theme === "mork" || theme === "premium"}
          onClick={() => onThemeChange("mork")}
        />
        <GoldRadio label="Lys" sublabel="Kommer snart" disabled selected={theme === "lys"} />
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   8. MATCH-SEKSJON — Statusbevisst
   ═══════════════════════════════════════ */

function MatchSection({
  matchStatus,
  journeyStatus,
}: {
  matchStatus: MatchStatus;
  journeyStatus: JourneyStatus;
}) {
  const router = useRouter();
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [ending, setEnding] = useState(false);

  const handleEndJourney = async () => {
    setEnding(true);
    try {
      await fetch("/api/journey/exit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "early_exit" }),
      });
      router.push("/dashboard?ended=early");
    } catch {
      console.error("Feil ved avslutt reise");
      setEnding(false);
      setShowEndConfirm(false);
    }
  };

  if (!matchStatus.hasActiveMatch) {
    return (
      <GlassCard className="transition-all duration-300 hover:brightness-110 mb-8">
        <SectionTitle>MATCH</SectionTitle>
        <p style={{ color: THEME.deepGrey, fontSize: "16px", lineHeight: "1.7", marginBottom: "24px" }}>
          Du har ingen aktiv match. Når resonansen har funnet en rytme som svinger med din, mottar du den her.
        </p>
        <GoldButton onClick={() => router.push("/dashboard")}>Gå til dashboard</GoldButton>
      </GlassCard>
    );
  }

  const day = journeyStatus.day || 0;

  return (
    <GlassCard className="transition-all duration-300 hover:brightness-110 mb-8">
      <SectionTitle>MATCH</SectionTitle>

      <div
        className="mb-6 p-4 rounded-2xl"
        style={{ background: "rgba(212,175,55,0.06)", border: `1px solid ${THEME.goldMuted}` }}
      >
        <p style={{ color: THEME.nordicGold, fontSize: "18px", fontWeight: 600 }}>
          Dag {day} av 30
        </p>
        <p style={{ color: THEME.deepGrey, fontSize: "14px", marginTop: "4px" }}>
          Reisen din er aktiv.
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <GoldButton onClick={() => router.push(`/chat/${matchStatus.conversationId}`)}>Gå til samtalen</GoldButton>
        <OutlineGoldButton onClick={() => setShowEndConfirm(true)}>Avslutt reisen</OutlineGoldButton>
      </div>

      {/* End Confirm Modal */}
      {showEndConfirm && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-8 text-center relative"
            style={{ background: "rgba(11,21,32,0.97)", border: `1px solid ${THEME.goldMuted}` }}
          >
            <button
              onClick={() => setShowEndConfirm(false)}
              className="absolute top-4 right-4"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              ✕
            </button>
            <h3 className="mb-3 text-xl font-bold" style={{ color: THEME.nordicGold }}>
              Avslutt reisen?
            </h3>
            <p style={{ fontSize: "15px", lineHeight: "1.7", color: "rgba(255,255,255,0.5)", marginBottom: "12px" }}>
              Reisen avsluttes. Samtalen slettes for dere begge.
            </p>
            <p style={{ fontSize: "13px", lineHeight: "1.5", color: "rgba(212,175,55,0.8)", marginBottom: "24px", fontStyle: "italic" }}>
              Dette kan ikke angres.
            </p>
            <GoldButton fullWidth onClick={handleEndJourney} disabled={ending}>
              {ending ? "Behandler..." : "Ja, avslutt reisen"}
            </GoldButton>
            <button
              onClick={() => setShowEndConfirm(false)}
              className="w-full mt-3 py-3 rounded-xl text-sm transition-all hover:opacity-80"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Avbryt
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   9. HJELP-SEKSJON
   ═══════════════════════════════════════ */

function HjelpSection() {
  return (
    <GlassCard className="transition-all duration-300 hover:brightness-110 mb-8">
      <SectionTitle>HJELP</SectionTitle>

      <p style={{ color: THEME.whitePrimary, fontSize: "16px", lineHeight: "1.7", marginBottom: "24px" }}>
        Har du spørsmål eller trenger du hjelp? Vi er her for deg.
      </p>

      <div className="space-y-3">
        <a
          href="mailto:support@tosom.no"
          className="flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 hover:bg-white/5"
          style={{ border: `1px solid ${THEME.glassBorder}` }}
        >
          <span className="text-xl">📧</span>
          <div>
            <p style={{ color: THEME.softWhite, fontSize: "15px", fontWeight: 500 }}>Kontakt oss</p>
            <p style={{ color: THEME.deepGrey, fontSize: "13px" }}>support@tosom.no</p>
          </div>
        </a>

        <a
          href="/personvern"
          className="flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 hover:bg-white/5"
          style={{ border: `1px solid ${THEME.glassBorder}` }}
        >
          <span className="text-xl">🔒</span>
          <div>
            <p style={{ color: THEME.softWhite, fontSize: "15px", fontWeight: 500 }}>Personvern</p>
            <p style={{ color: THEME.deepGrey, fontSize: "13px" }}>Les personvernerklæringen</p>
          </div>
        </a>

        <a
          href="/vilkar"
          className="flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 hover:bg-white/5"
          style={{ border: `1px solid ${THEME.glassBorder}` }}
        >
          <span className="text-xl">📋</span>
          <div>
            <p style={{ color: THEME.softWhite, fontSize: "15px", fontWeight: 500 }}>Vilkår</p>
            <p style={{ color: THEME.deepGrey, fontSize: "13px" }}>Les våre vilkår og regler</p>
          </div>
        </a>
      </div>
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   10. SLETT KONTO-SEKSJON
   ═══════════════════════════════════════ */

function SlettKontoSection() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (confirmText !== "SLETT") return;
    try {
      await csrfFetch("/api/settings/delete-account", { method: "POST" });
      await signOut({ callbackUrl: "/" });
    } catch {
      console.error("Feil ved sletting av konto");
    }
  };

  return (
    <GlassCard danger className="transition-all duration-300 hover:brightness-110 mb-8">
      <SectionTitle>SLETT KONTO</SectionTitle>

      <p style={{ color: THEME.deepGrey, fontSize: "16px", lineHeight: "1.7", marginBottom: "24px" }}>
        Når du sletter kontoen din blir all data permanent fjernet. Dette kan ikke angres.
      </p>

      {!showConfirm ? (
        <DangerButton fullWidth onClick={() => setShowConfirm(true)}>
          Slett konto permanent
        </DangerButton>
      ) : (
        <div className="space-y-3" style={{ background: "rgba(255,77,77,0.04)", borderRadius: "16px", padding: "24px" }}>
          <p style={{ color: THEME.dangerRed, fontSize: "16px", fontWeight: 500 }}>
            Er du sikker? Skriv "SLETT" for å bekrefte.
          </p>
          <input
            className="w-full h-10 text-center rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-red-400/40"
            style={{ background: "rgba(255,77,77,0.06)", border: "1px solid rgba(255,77,77,0.2)", color: THEME.dangerRed }}
            placeholder="SLETT"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />
          <div className="flex gap-3">
            <DangerButton fullWidth onClick={handleDelete} disabled={confirmText !== "SLETT"}>
              Slett permanent
            </DangerButton>
            <OutlineGoldButton onClick={() => { setShowConfirm(false); setConfirmText(""); }}>
              Avbryt
            </OutlineGoldButton>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

/* ═══════════════════════════════════════
   HOVUD-KOMONENT — SETTINGS PAGE
   ═══════════════════════════════════════ */

const DEFAULT_PREFS: Preferences = {
  language: "bokmal",
  theme: "mork",
  notifications: true,
  push: true,
  email: true,
  pushMatch: true,
  pushMessages: true,
  pushJourney: true,
  emailMatch: true,
  emailMessages: true,
  emailJourney: true,
};

interface SessionData {
  user?: { name?: string; email?: string; [key: string]: any };
  [key: string]: any;
}

export default function SettingsPage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [authStatus, setAuthStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  const [profile, setProfile] = useState<ProfileData>({ identityName: null, photoUrl: null, currentDay: 0 });
  const [matchStatus, setMatchStatus] = useState<MatchStatus>({ hasActiveMatch: false, matchId: null, conversationId: null });
  const [journeyStatus, setJourneyStatus] = useState<JourneyStatus>({ journeyState: "IDLE", day: 0, conversationId: null });
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);

  const userName = session?.user?.name || "ToSom-bruker";
  const userEmail = session?.user?.email || "";
  const memberSince = session?.user?.createdAt
    ? new Date(session.user.createdAt).toLocaleDateString("no-NO", { month: "long", year: "numeric" })
    : "—";

  // Hent sesjon + last inn data ved montering
  useEffect(() => {
    async function loadAll() {
      try {
        // Føst: hente sesjon
        const sessionRes = await fetch("/api/auth/session");
        if (!sessionRes.ok) {
          setAuthStatus("unauthenticated");
          setLoading(false);
          return;
        }
        const sessionData: SessionData = await sessionRes.json();
        if (!sessionData?.user) {
          setAuthStatus("unauthenticated");
          setLoading(false);
          return;
        }
        setSession(sessionData);
        setAuthStatus("authenticated");

        // Deretter: last inn settings-data
        // /api/match/check er POST (GET gir 405 og match-statusen blir aldri lastet)
        const [profileRes, matchRes, journeyRes, prefsRes] = await Promise.all([
          fetch("/api/profile/me"),
          fetch("/api/match/check", { method: "POST" }),
          fetch("/api/journey/status"),
          fetch("/api/settings/preferences"),
        ]);

        if (profileRes.ok) {
          const p = await profileRes.json();
          setProfile({ identityName: p.identityName, photoUrl: p.photoUrl, currentDay: p.currentDay });
        }

        if (matchRes.ok) {
          const m = await matchRes.json();
          setMatchStatus({
            hasActiveMatch: m.data?.hasActiveMatch ?? m.hasActiveMatch ?? false,
            matchId: m.data?.matchId ?? m.matchId ?? null,
            conversationId: m.data?.conversationId ?? m.conversationId ?? null,
          });
        }

        if (journeyRes.ok) {
          const j = await journeyRes.json();
          setJourneyStatus({
            journeyState: j.journeyState ?? j.data?.journeyState ?? "IDLE",
            day: j.day ?? j.data?.day ?? 0,
            conversationId: j.conversationId ?? j.data?.conversationId ?? null,
          });
        }

        if (prefsRes.ok) {
          const p = await prefsRes.json();
          setPrefs({
            language: p.language || "bokmal",
            theme: p.theme || "mork",
            notifications: p.notifications ?? true,
            push: (p as any).push ?? true,
            email: (p as any).email ?? true,
            pushMatch: (p as any).pushMatch ?? true,
            pushMessages: (p as any).pushMessages ?? true,
            pushJourney: (p as any).pushJourney ?? true,
            emailMatch: (p as any).emailMatch ?? true,
            emailMessages: (p as any).emailMessages ?? true,
            emailJourney: (p as any).emailJourney ?? true,
          });
        }
      } catch (err) {
        console.error("Feil ved lasting av settings:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, []);

  // Lagre preferanser
  const savePrefs = useCallback(
    async (newPrefs: Preferences) => {
      try {
        await csrfFetch("/api/settings/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: newPrefs.language,
            theme: newPrefs.theme,
            notifications: newPrefs.push || newPrefs.email,
            push: newPrefs.push,
            email: newPrefs.email,
            pushMatch: newPrefs.pushMatch,
            pushMessages: newPrefs.pushMessages,
            pushJourney: newPrefs.pushJourney,
            emailMatch: newPrefs.emailMatch,
            emailMessages: newPrefs.emailMessages,
            emailJourney: newPrefs.emailJourney,
          }),
        });
      } catch {
        console.error("Feil ved lagring av preferanser");
      }
    },
    []
  );

  const handleToggle = (key: keyof Preferences, value: boolean) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);
    savePrefs(newPrefs);
  };

  const handleLangChange = (lang: string) => {
    const newPrefs = { ...prefs, language: lang };
    setPrefs(newPrefs);
    savePrefs(newPrefs);
  };

  const handleThemeChange = (theme: string) => {
    const newPrefs = { ...prefs, theme };
    setPrefs(newPrefs);
    savePrefs(newPrefs);
  };

  // Loading state
  if (loading || authStatus === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: `linear-gradient(180deg, ${THEME.tosomBlue} 0%, #0F1A26 100%)` }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-2 animate-spin"
            style={{ borderColor: `${THEME.nordicGold}20`, borderTopColor: THEME.nordicGold }}
          />
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>Laster innstillinger…</p>
        </div>
      </div>
    );
  }

  return (
      <div
        className="min-h-screen flex items-start justify-center px-4"
        style={{
          background: `linear-gradient(180deg, ${THEME.tosomBlue} 0%, #0F1A26 100%)`,
          paddingTop: "32px",
          paddingBottom: "96px",
        }}
      >
      {/* Max-width container */}
      <div className="w-full" style={{ maxWidth: "720px" }}>
        {/* ═══ HEADER ═══ */}
        <SettingsHeader name={profile.identityName || userName} photoUrl={profile.photoUrl} />

        {/* ═══ SEKSJONAR ═══ */}
        <KontoSection name={userName} email={userEmail} memberSince={memberSince} />
        <VarslerSection prefs={prefs} onToggle={handleToggle} />
        <SikkerhetSection matchStatus={matchStatus} journeyStatus={journeyStatus} />
        <PersonvernSection />
        <SprakSection lang={prefs.language} onLangChange={handleLangChange} />
        <TemaSection theme={prefs.theme} onThemeChange={handleThemeChange} />
        <HjelpSection />
      </div>
    </div>
  );
}