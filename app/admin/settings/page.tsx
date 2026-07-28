/**
 * ToSom — Admin Settings
 * 
 * Sentral kontrollsenter for systemflagg, feature toggles,
 * sikkerheitsinnstillinger og konfigurasjon.
 */

"use client";

import { useState, useEffect } from "react";

interface AdminSettings {
  enableOnboarding: boolean;
  enableMatching: boolean;
  enableJourney: boolean;
  enableChat: boolean;
  enableReflections: boolean;
  maintenanceMode: boolean;
  requireEmailVerification: boolean;
  maxUploadSizeMB: number;
  sessionTimeoutHours: number;
  allowedOAuthProviders: string[];
  betaFeatures: string[];
}

interface ToggleItem {
  key: string;
  label: string;
  desc: string;
  enabled: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"features" | "security" | "system">("features");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/admin/system");
      if (res.ok) {
        const data = await res.json();
        setSettings({
          enableOnboarding: data.enableOnboarding ?? true,
          enableMatching: data.enableMatching ?? true,
          enableJourney: data.enableJourney ?? true,
          enableChat: data.enableChat ?? true,
          enableReflections: data.enableReflections ?? true,
          maintenanceMode: data.maintenanceMode ?? false,
          requireEmailVerification: data.requireEmailVerification ?? false,
          maxUploadSizeMB: data.maxUploadSizeMB ?? 10,
          sessionTimeoutHours: data.sessionTimeoutHours ?? 24,
          allowedOAuthProviders: data.allowedOAuthProviders ?? ["vipps"],
          betaFeatures: data.betaFeatures ?? [],
        });
      }
    } catch {
      // Fallback til standard-verdiar
      setSettings({
        enableOnboarding: true,
        enableMatching: true,
        enableJourney: true,
        enableChat: true,
        enableReflections: true,
        maintenanceMode: false,
        requireEmailVerification: false,
        maxUploadSizeMB: 10,
        sessionTimeoutHours: 24,
        allowedOAuthProviders: ["vipps"],
        betaFeatures: [],
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/system", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      // Feil — vis ikkje feilmelding for noy
    } finally {
      setSaving(false);
    }
  }

  function toggleFeature(key: keyof AdminSettings, value: boolean) {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  }

  function getFeatureToggles(): ToggleItem[] {
    if (!settings) return [];
    return [
      { key: "enableOnboarding", label: "Onboarding open", desc: "Tillat nye brukarar å starte onboarding-prosess", enabled: settings.enableOnboarding },
      { key: "enableMatching", label: "Matching aktiv", desc: "AI-matching kjører som planlagt — gir éin match per 24 timer", enabled: settings.enableMatching },
      { key: "enableJourney", label: "30-dagers reise", desc: "Aktive brukarar kan starte og fullføre reisa si", enabled: settings.enableJourney },
      { key: "enableChat", label: "Chat tilgjengeleg", desc: "Brukarar i aktiv reise kan sende guidede meldingar", enabled: settings.enableChat },
      { key: "enableReflections", label: "Refleksjonar", desc: "Brukarar kan skrive daglege refleksjoner under reisa", enabled: settings.enableReflections },
    ];
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-white/40 animate-pulse">Laster innstillinger...</div>
      </div>
    );
  }

  const toggles = getFeatureToggles();

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white">Innstillinger</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            Kontroller systemfunksjonar, sikkerheit og konfigurasjon.
          </p>
        </div>

        {saved && (
          <span className="text-sm px-3 py-1.5 rounded-lg" style={{ background: "rgba(212,175,55,0.1)", color: "#D4AF37" }}>
            ✓ Lagra
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
        {(
          [
            { key: "features", label: "Funksjonar" },
            { key: "security", label: "Sikkerheit" },
            { key: "system", label: "System" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200"
            style={{
              background: activeTab === tab.key ? "rgba(212,175,55,0.12)" : "transparent",
              color: activeTab === tab.key ? "#D4AF37" : "rgba(255,255,255,0.4)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Features Tab */}
      {activeTab === "features" && settings && (
        <div className="space-y-4">
          {toggles.map((toggle) => (
            <ToggleCard key={toggle.key} toggle={toggle} onToggle={(val) => toggleFeature(toggle.key as keyof AdminSettings, val)} />
          ))}

          {/* Maintenance Mode */}
          <div
            className="p-5 rounded-xl"
            style={{ background: settings.maintenanceMode ? "rgba(255,77,77,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${settings.maintenanceMode ? "rgba(255,77,77,0.2)" : "rgba(255,255,255,0.06)"}` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm mb-1" style={{ color: "#FFFFFF" }}>
                  🚧 Vedlikeholdsmodus
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Stenger for nye påloggingar og onboarding. Eksisterande brukarar kan framleis bruke appen.
                </p>
              </div>
              <ToggleSwitch
                checked={settings.maintenanceMode}
                onChange={(v) => toggleFeature("maintenanceMode", v)}
                activeColor="red"
              />
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && settings && (
        <div className="space-y-4">
          {/* OAuth Providers */}
          <div className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="font-medium text-sm mb-1" style={{ color: "#FFFFFF" }}>OAuth-leverandørar</h3>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Kva innloggingsmetodar som er tilgjengelege for brukarar.
            </p>
            <div className="space-y-3">
              {["vipps", "email"].map((provider) => (
                <label key={provider} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowedOAuthProviders.includes(provider)}
                    onChange={(e) => {
                      const providers = e.target.checked
                        ? [...settings.allowedOAuthProviders, provider]
                        : settings.allowedOAuthProviders.filter((p: string) => p !== provider);
                      toggleFeature("allowedOAuthProviders", providers as unknown as boolean);
                    }}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: "#D4AF37" }}
                  />
                  <span className="text-sm capitalize" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {provider === "vipps" ? "VIPPS" : "E-post magic link"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Email verification */}
          <ToggleCard
            toggle={{
              key: "requireEmailVerification",
              label: "Krev e-postverifisering",
              desc: "Brukarar må verifisere e-post før deira profil blir aktiv",
              enabled: settings.requireEmailVerification,
            }}
            onToggle={(val) => toggleFeature("requireEmailVerification", val)}
          />

          {/* Session timeout */}
          <div className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="font-medium text-sm mb-1" style={{ color: "#FFFFFF" }}>Sesjonslengde</h3>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Kor lenge ein brukar er innlogga utan å måtte logge inn på nytt.
            </p>
            <div className="flex gap-3">
              {[1, 8, 24, 72].map((h) => (
                <button
                  key={h}
                  onClick={() => setSettings({ ...settings, sessionTimeoutHours: h })}
                  className="px-4 py-2 text-sm rounded-lg transition-all duration-200"
                  style={{
                    background: settings.sessionTimeoutHours === h ? "rgba(212,175,55,0.15)" : "transparent",
                    border: `1px solid ${settings.sessionTimeoutHours === h ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.08)"}`,
                    color: settings.sessionTimeoutHours === h ? "#D4AF37" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {h}t
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === "system" && settings && (
        <div className="space-y-4">
          {/* Upload size */}
          <div className="p-5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="font-medium text-sm mb-1" style={{ color: "#FFFFFF" }}>Maksimal opplasting</h3>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Største filstorleik for profilbilete og oppgåvetilfang (MB).
            </p>
            <div className="flex gap-3">
              {[5, 10, 20].map((mb) => (
                <button
                  key={mb}
                  onClick={() => setSettings({ ...settings, maxUploadSizeMB: mb })}
                  className="px-4 py-2 text-sm rounded-lg transition-all duration-200"
                  style={{
                    background: settings.maxUploadSizeMB === mb ? "rgba(212,175,55,0.15)" : "transparent",
                    border: `1px solid ${settings.maxUploadSizeMB === mb ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.08)"}`,
                    color: settings.maxUploadSizeMB === mb ? "#D4AF37" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {mb} MB
                </button>
              ))}
            </div>
          </div>

          {/* Beta Features */}
          <div className="p-5 rounded-xl" style={{ background: "rgba(212,175,55,0.03)", border: "1px solid rgba(212,175,55,0.1)" }}>
            <h3 className="font-medium text-sm mb-1" style={{ color: "#D4AF37" }}>⚡ Beta-funksjonar</h3>
            <p className="text-xs mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Eksperimelle funksjonar som er under test. Bruk med forsiktighet.
            </p>
            <div className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              Ingen beta-funksjonar aktive for øyeblikket.
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setSettings(null);
              setLoading(true);
              fetchSettings();
            }}
            className="text-sm underline transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Tilbakestill alle innstillinger
          </button>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 font-medium rounded-xl transition-all duration-300"
          style={{
            background: saving ? "rgba(212,175,55,0.3)" : "linear-gradient(135deg, #D4AF37, #E8C766)",
            color: saving ? "rgba(255,255,255,0.4)" : "#0B1520",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "Lagrar..." : "Lagra innstillinger"}
        </button>
      </div>
    </div>
  );
}

/* ─── ToggleCard ─── */
function ToggleCard({ toggle, onToggle }: { toggle: ToggleItem; onToggle: (val: boolean) => void }) {
  return (
    <div
      className="p-5 rounded-xl flex items-center justify-between"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div>
        <h3 className="font-medium text-sm mb-1" style={{ color: "#FFFFFF" }}>{toggle.label}</h3>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{toggle.desc}</p>
      </div>
      <ToggleSwitch checked={toggle.enabled} onChange={onToggle} />
    </div>
  );
}

/* ─── ToggleSwitch ─── */
function ToggleSwitch({ checked, onChange, activeColor }: { checked: boolean; onChange: (v: boolean) => void; activeColor?: "gold" | "red" }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-12 h-7 rounded-full transition-colors duration-300 flex-shrink-0"
      style={{
        background: checked ? (activeColor === "red" ? "#FF4D4D" : "#D4AF37") : "rgba(255,255,255,0.1)",
      }}
    >
      <div
        className="absolute top-0.5 w-6 h-6 rounded-full transition-transform duration-300 shadow-sm"
        style={{
          background: "#FFFFFF",
          transform: checked ? "translateX(20px)" : "translateX(2px)",
        }}
      />
    </button>
  );
}