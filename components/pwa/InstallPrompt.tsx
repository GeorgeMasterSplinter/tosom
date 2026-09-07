"use client";

import { useState, useEffect } from "react";

const DISMISS_KEY = "tosom_install_prompt_dismissed";

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const install = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") dismiss();
    } else {
      dismiss();
    }
  };

  if (!visible) return null;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-[9999] max-w-sm mx-auto"
      style={{
        background: "linear-gradient(135deg, rgba(11,21,32,0.97), rgba(13,22,35,0.97))",
        border: "1px solid rgba(212,175,55,0.3)",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 16px rgba(212,175,55,0.15)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}
        >
          <span className="text-xl font-bold" style={{ color: "#D4AF37" }}>T</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold mb-1" style={{ color: "rgba(255,255,255,0.95)" }}>
            Få Tosom-appen
          </p>
          {isIOS ? (
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              Trykk <strong style={{ color: "rgba(212,175,55,0.8)" }}>del-ikonet</strong> (⬆) i Safari,
              deretter <strong style={{ color: "rgba(212,175,55,0.8)" }}>«Legg til hjemmekort»</strong>.
            </p>
          ) : (
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              Legg Tosom på hjemskjermen for app-opplevelse.
            </p>
          )}

          <div className="flex gap-2 mt-3">
            <button
              onClick={install}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:brightness-110 active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #E8C766)",
                color: "#0B1520",
              }}
            >
              {isIOS ? "Vis instruksjoner" : "Installer"}
            </button>
            <button
              onClick={dismiss}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:brightness-125 active:scale-[0.97]"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Senere
            </button>
          </div>
        </div>

        <button
          onClick={dismiss}
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all hover:bg-white/10 active:scale-90"
          style={{ color: "rgba(255,255,255,0.4)" }}
          aria-label="Lukk"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default InstallPrompt;
