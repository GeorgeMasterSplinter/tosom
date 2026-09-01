"use client";

/** NavigationDemo.tsx — full test av navigasjon uten backend
 *  NS21–NS29 — demo med dummy initialState, knapper for testing, state-logging,
 *  integrasjon med OnboardingFlow og MatchResultView */

import { useState, useCallback } from "react";
import type { NavigationRoute, ModalType } from "../../lib/app/navigationState";
import {
  goTo,
  openModal,
  closeModal,
  resetModals,
  getTopModal,
  initialNavigationState,
} from "../../lib/app/navigationState";
import AppShell from "./AppShell";

/* ── Knapp-hjelp ── */
function NavButton({
  label,
  onClick,
  accent = false,
}: {
  label: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-xs rounded-xl border transition-colors ${
        accent
          ? "bg-emerald-100 border-emerald-200 text-emerald-800 hover:bg-emerald-200"
          : "bg-white border-[#e2e8f0] text-[#4A4A4A]/70 hover:bg-[#f8fafc]"
      }`}
    >
      {label}
    </button>
  );
}

export default function NavigationDemo() {
  const [state, setState] = useState(initialNavigationState());

  const handleGoTo = useCallback(
    (route: NavigationRoute, params?: Record<string, any>) => {
      setState((prev) => {
        const next = goTo(prev, route, params);
        console.log("[NavigationDemo] → goTo:", route, "params:", params ?? null, "state:", next);
        return next;
      });
    },
    []
  );

  const handleOpenModal = useCallback((type: ModalType, props?: Record<string, any>) => {
    setState((prev) => {
      const next = openModal(prev, type, props);
      console.log("[NavigationDemo] ↑ openModal:", type, "stack:", next.modalStack.length);
      return next;
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setState((prev) => {
      const next = closeModal(prev);
      console.log("[NavigationDemo] ↓ closeModal:", "stack:", next.modalStack.length);
      return next;
    });
  }, []);

  const handleResetModals = useCallback(() => {
    setState((prev) => {
      const next = resetModals(prev);
      console.log("[NavigationDemo] ✕ resetModals:", "stack:", next.modalStack.length);
      return next;
    });
  }, []);

  const routeLabels: Record<NavigationRoute, string> = {
    onboarding: "Onboarding",
    dashboard: "Dashboard",
    chat: "Chat",
    partner_profile: "Partnerprofil",
    user_profile: "Min profil",
    match_result: "Matchfunnen",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50 flex flex-col items-center p-6">
      {/* Overskrift */}
      <h1 className="text-2xl font-semibold text-[#4A4A4A] mb-2">
        🧭 NavigationShell Demo
      </h1>
      <p className="text-xs text-[#4A4A4A]/40 mb-8">
        NS21–NS29 — Test navigasjon, modalar og parametre
      </p>

      {/* AppShell med full navigasjon */}
      <div className="w-full max-w-3xl border border-[#e2e8f0] rounded-2xl shadow-lg overflow-hidden">
        <AppShell initialState={state} />
      </div>

      {/* Testknappar (NS23–NS29) */}
      <div className="w-full max-w-3xl mt-6 space-y-4">

        {/* NS23 — Rut-knapper */}
        <div>
          <h3 className="text-xs font-medium text-[#4A4A4A]/50 mb-2">
            NS23 — Rout-knapper
          </h3>
          <div className="flex flex-wrap gap-2">
            <NavButton label="🌿 Onboarding" onClick={() => handleGoTo("onboarding")} />
            <NavButton label="🏠 Dashboard" onClick={() => handleGoTo("dashboard")} />
            <NavButton label="💬 Chat" onClick={() => handleGoTo("chat")} />
            <NavButton label="👤 Partnerprofil" onClick={() => handleGoTo("partner_profile", { id: "demo-partner-123" })} />
            <NavButton label="📋 Min profil" onClick={() => handleGoTo("user_profile", { id: "demo-user-456" })} />
            <NavButton label="✨ Matchfunnen" onClick={() => handleGoTo("match_result", { matchId: "demo-match-789" })} />
          </div>
        </div>

        {/* NS25 — Modal-knapper */}
        <div>
          <h3 className="text-xs font-medium text-[#4A4A4A]/50 mb-2">
            NS25 — Modal-knapper
          </h3>
          <div className="flex flex-wrap gap-2">
            <NavButton label="↑ Info-modal" onClick={() => handleOpenModal("info", { title: "Info", message: "Dette er en test-modal." })} />
            <NavButton label="↑ Bekreft-modal" onClick={() =>
              handleOpenModal("confirm", {
                title: "Bekreft",
                message: "Er du sikker på at du vil holde fram?",
                onConfirm: () => console.log("[NavigationDemo] ✓ Bekrefta!"),
                onClose: handleCloseModal,
              })
            } />
            <NavButton label="↓ Lukk modal" onClick={handleCloseModal} />
            <NavButton label="✕ Nullstill modalar" onClick={handleResetModals} />
          </div>
        </div>

        {/* NS26 — Rout-test */}
        <div>
          <h3 className="text-xs font-medium text-[#4A4A4A]/50 mb-2">
            NS26 — Rout-test (onboarding → dashboard → chat)
          </h3>
          <button
            onClick={() => {
              console.log("[NavigationDemo] NS26: Rout-test starte");
              handleGoTo("onboarding");
              setTimeout(() => handleGoTo("dashboard"), 300);
              setTimeout(() => handleGoTo("chat"), 600);
              setTimeout(() => handleGoTo("dashboard"), 900);
              console.log("[NavigationDemo] NS26: Rout-test fullført");
            }}
            className="px-5 py-2 text-xs rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            ▶ Spel av rout-test
          </button>
        </div>

        {/* NS27 — Parametre-test */}
        <div>
          <h3 className="text-xs font-medium text-[#4A4A4A]/50 mb-2">
            NS27 — Parametre-test
          </h3>
          <button
            onClick={() => {
              handleGoTo("chat", { matchId: "demo" });
              console.log("[NavigationDemo] NS27: goTo('chat', { matchId: 'demo' })");
            }}
            className="px-5 py-2 text-xs rounded-xl bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            → goTo("chat", {"{ matchId: 'demo' }"})
          </button>
        </div>

        {/* NS28 — OnboardingDemo-integrasjon */}
        <div>
          <h3 className="text-xs font-medium text-[#4A4A4A]/50 mb-2">
            NS28 — Onboarding → Dashboard-integrasjon
          </h3>
          <p className="text-xs text-[#4A4A4A]/40 mb-2">
            Fullfør onboarding i AppShell ovanfor → goTo("dashboard") skjer automatisk.
          </p>
        </div>

        {/* NS29 — MatchResult → Chat-integrasjon */}
        <div>
          <h3 className="text-xs font-medium text-[#4A4A4A]/50 mb-2">
            NS29 — MatchResultView → Chat-integrasjon
          </h3>
          <p className="text-xs text-[#4A4A4A]/40 mb-2">
            Gå til "Matchfunnen" → klikk "Start reisen" → goTo("chat").
          </p>
        </div>

        {/* NS24 — Live state-logging */}
        <div>
          <h3 className="text-xs font-medium text-[#4A4A4A]/50 mb-2">
            NS24 — Live status
          </h3>
          <details className="bg-white/80 rounded-xl p-4 text-xs font-mono">
            <summary className="cursor-pointer text-[#4A4A4A]/50 hover:text-[#4A4A4A]/70">
              📋 state
            </summary>
            <pre className="mt-2 text-[#4A4A4A]/60 whitespace-pre-wrap break-all">
              {JSON.stringify(
                {
                  currentRoute: state.currentRoute,
                  routeLabel: routeLabels[state.currentRoute],
                  modalStackDepth: state.modalStack.length,
                  topModal: getTopModal(state)?.type ?? null,
                  params: state.params,
                },
                null,
                2
              )}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
