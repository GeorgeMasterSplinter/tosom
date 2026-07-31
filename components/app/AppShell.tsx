"use client";

/** AppShell.tsx — hovedrammeverk for app-navigasjon
 *  NS5/6/7/11/12/13/14/17/18/19/20
 *  Holder: top-nav, main content (ruter), ModalStack */

import { useState, useCallback, useEffect } from "react";
import type { NavigationRoute, NavigationState, ModalType } from "../../lib/app/navigationState";
import {
  goTo,
  openModal,
  closeModal,
  resetModals,
  getTopModal,
  initialNavigationState,
  shouldForceOnboarding,
} from "../../lib/app/navigationState";
import ModalStack from "./ModalStack";
import OnboardingFlow from "../../app/onboarding/OnboardingFlow";
import type { UserProfile } from "../../lib/profile/userProfile";

/* ── Dummy-view-komponentar (NS6) ── */

function ChatPanel({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="text-5xl">💬</div>
      <h3 className="text-lg font-medium text-[#4A4A4A]">Chat</h3>
      <p className="text-sm text-[#4A4A4A]/50">Ingen meldinger enno.</p>
      {onClose && (
        <button
          onClick={onClose}
          className="px-6 py-2 text-xs rounded-xl bg-white border border-[#e2e8f0] text-[#4A4A4A]/60 hover:bg-[#f8fafc] transition-colors"
        >
          ← Tilbake
        </button>
      )}
    </div>
  );
}

function PartnerProfileView({ id, onClose }: { id?: string; onClose?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="text-5xl">👤</div>
      <h3 className="text-lg font-medium text-[#4A4A4A]">Partnerprofil</h3>
      {id && <p className="text-xs text-[#4A4A4A]/40">ID: {id}</p>}
      <p className="text-sm text-[#4A4A4A]/50">Ingen partnerprofil funnet.</p>
      {onClose && (
        <button
          onClick={onClose}
          className="px-6 py-2 text-xs rounded-xl bg-white border border-[#e2e8f0] text-[#4A4A4A]/60 hover:bg-[#f8fafc] transition-colors"
        >
          ← Tilbake
        </button>
      )}
    </div>
  );
}

function UserProfileView({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="text-5xl">📋</div>
      <h3 className="text-lg font-medium text-[#4A4A4A]">Min profil</h3>
      <p className="text-sm text-[#4A4A4A]/50">Rediger profilen din.</p>
      {onClose && (
        <button
          onClick={onClose}
          className="px-6 py-2 text-xs rounded-xl bg-white border border-[#e2e8f0] text-[#4A4A4A]/60 hover:bg-[#f8fafc] transition-colors"
        >
          ← Tilbake
        </button>
      )}
    </div>
  );
}

function MatchResultView({ matchId, onClose, onStartJourney }: {
  matchId?: string;
  onClose?: () => void;
  onStartJourney?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="text-5xl">✨</div>
      <h3 className="text-lg font-medium text-[#4A4A4A]">Matchfunn!</h3>
      {matchId && <p className="text-xs text-[#4A4A4A]/40">Match ID: {matchId}</p>}
      <p className="text-sm text-[#4A4A4A]/50">Start reisen din no.</p>
      <div className="flex gap-3">
        {onStartJourney && (
          <button
            onClick={onStartJourney}
            className="px-6 py-2 text-xs rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors font-medium"
          >
            Start reise
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="px-6 py-2 text-xs rounded-xl bg-white border border-[#e2e8f0] text-[#4A4A4A]/60 hover:bg-[#f8fafc] transition-colors"
          >
            ← Tilbake
          </button>
        )}
      </div>
    </div>
  );
}

function DashboardView({
  onOpenChat,
  onOpenPartnerProfile,
  onOpenUserProfile,
}: {
  onOpenChat?: () => void;
  onOpenPartnerProfile?: () => void;
  onOpenUserProfile?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="text-5xl">🏠</div>
      <h3 className="text-lg font-medium text-[#4A4A4A]">Dashboard</h3>
      <p className="text-sm text-[#4A4A4A]/50">Vel en handling:</p>
      <div className="flex flex-wrap gap-3 justify-center">
        {onOpenChat && (
          <button
            onClick={onOpenChat}
            className="px-5 py-2 text-xs rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            💬 Åpne chat
          </button>
        )}
        {onOpenPartnerProfile && (
          <button
            onClick={onOpenPartnerProfile}
            className="px-5 py-2 text-xs rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
          >
            👤 Partnerprofil
          </button>
        )}
        {onOpenUserProfile && (
          <button
            onClick={onOpenUserProfile}
            className="px-5 py-2 text-xs rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
          >
            📋 Min profil
          </button>
        )}
      </div>
    </div>
  );
}

/* ── AppShell-komponent ── */

interface AppShellProps {
  initialRoute?: NavigationRoute;
  initialState?: NavigationState;
}

export default function AppShell({
  initialRoute = "onboarding",
  initialState,
}: AppShellProps) {
  const [state, setState] = useState<NavigationState>(
    initialState ?? initialNavigationState()
  );

  // NS18: Navigasjonsbeskyttelse
  useEffect(() => {
    if (shouldForceOnboarding() && state.currentRoute !== "onboarding") {
      setState((prev) => ({ ...prev, currentRoute: "onboarding" }));
    }
  }, [state.currentRoute]);

  const handleGoTo = useCallback(
    (route: NavigationRoute, params?: Record<string, any>) => {
      setState((prev) => goTo(prev, route, params));
    },
    []
  );

  const handleOpenModal = useCallback(
    (type: ModalType, props?: Record<string, any>) => {
      setState((prev) => openModal(prev, type, props));
    },
    []
  );

  const handleCloseModal = useCallback(() => {
    setState((prev) => closeModal(prev));
  }, []);

  const handleResetModals = useCallback(() => {
    setState((prev) => resetModals(prev));
  }, []);

  // NS18: tving onboarding
  const effectiveRoute =
    shouldForceOnboarding() && state.currentRoute !== "onboarding"
      ? "onboarding"
      : state.currentRoute;

  // Rute-visning (NS6)
  const renderRoute = () => {
    switch (effectiveRoute) {
      case "onboarding":
        return (
          <OnboardingFlow
            onComplete={(profile: UserProfile) => {
              console.log("[AppShell] ✓ Onboarding fullført!", profile);
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  "tosom_onboarding_completed",
                  "true"
                );
              }
              handleGoTo("dashboard");
            }}
          />
        );
      case "dashboard":
        return (
          <DashboardView
            onOpenChat={() => handleGoTo("chat")}
            onOpenPartnerProfile={() =>
              handleOpenModal("partner_profile", { title: "Partnerprofil" })
            }
            onOpenUserProfile={() =>
              handleOpenModal("user_profile", { title: "Min profil" })
            }
          />
        );
      case "chat":
        return (
          <ChatPanel
            onClose={() => handleGoTo("dashboard")}
          />
        );
      case "partner_profile":
        return (
          <PartnerProfileView
            id={state.params?.id}
            onClose={() => handleGoTo("dashboard")}
          />
        );
      case "user_profile":
        return (
          <UserProfileView
            onClose={() => handleGoTo("dashboard")}
          />
        );
      case "match_result":
        return (
          <MatchResultView
            matchId={state.params?.matchId}
            onClose={() => handleGoTo("dashboard")}
            onStartJourney={() => handleGoTo("chat")}
          />
        );
      default:
        return null;
    }
  };

  // Modal (NS7)
  const topModal = getTopModal(state);

  return (
    // NS9: Global layout
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-8">
        {renderRoute()}
      </main>

      {/* Modal-stack */}
      <ModalStack
        stack={state.modalStack}
        onClose={handleCloseModal}
        onReset={handleResetModals}
      />
    </div>
  );
}
