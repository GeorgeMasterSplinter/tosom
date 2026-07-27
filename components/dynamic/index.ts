/* ═══════════════════════════════════════════
   ToSom — Dynamic Imports (Performance)
   Lazy-load tunge komponenter med next/dynamic
   ═══════════════════════════════════════════ */

import React from "react";
import dynamic from "next/dynamic";

/* ---------------------------------------------------------- */
/*  Loading fallback components                               */
/* ---------------------------------------------------------- */

function LoadingChat() {
  return React.createElement("div", { className: "flex items-center justify-center h-64" },
    React.createElement("div", { className: "text-white/40" }, "Laster chat...")
  );
}

function LoadingDetail() {
  return React.createElement("div", { className: "flex items-center justify-center" },
    React.createElement("div", { className: "text-white/40" }, "Laster detaljer...")
  );
}

function LoadingJourney() {
  return React.createElement("div", { className: "flex items-center justify-center" },
    React.createElement("div", { className: "text-white/40" }, "Laster reisekart...")
  );
}

function LoadingResonance() {
  return React.createElement("div", { className: "flex items-center justify-center" },
    React.createElement("div", { className: "text-white/40" }, "Laster resonans...")
  );
}

function LoadingMatch() {
  return React.createElement("div", { className: "flex items-center justify-center" },
    React.createElement("div", { className: "text-white/40" }, "Laster match...")
  );
}

function LoadingUpload() {
  return React.createElement("div", { className: "flex items-center justify-center" },
    React.createElement("div", { className: "text-white/40" }, "Laster opplasting...")
  );
}

function LoadingTimeline() {
  return React.createElement("div", { className: "flex items-center justify-center" },
    React.createElement("div", { className: "text-white/40" }, "Laster timeline...")
  );
}

function LoadingMemories() {
  return React.createElement("div", { className: "flex items-center justify-center" },
    React.createElement("div", { className: "text-white/40" }, "Laster minner...")
  );
}

function LoadingGraph() {
  return React.createElement("div", { className: "flex items-center justify-center" },
    React.createElement("div", { className: "text-white/40" }, "Laster relasjonskart...")
  );
}

function LoadingDigest() {
  return React.createElement("div", { className: "flex items-center justify-center" },
    React.createElement("div", { className: "text-white/40" }, "Laster ukeoppsummering...")
  );
}

function EmptyFallback() {
  return null;
}

/* ---------------------------------------------------------- */
/*  ChatWindow — dynamic import (ssr: false)                    */
/* ---------------------------------------------------------- */

export const DynamicChatWindow: any = dynamic(
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  () => require("@/components/chat/ChatView"),
  { ssr: false, loading: () => LoadingChat() },
);

/* ---------------------------------------------------------- */
/*  MatchDetailModal — dynamic import                             */
/* ---------------------------------------------------------- */

export const DynamicMatchDetailModal = dynamic(
  () => import("@/components/match/MatchDetailModal").catch(() => ({ default: EmptyFallback })),
  { ssr: false, loading: () => LoadingDetail() },
);

/* ---------------------------------------------------------- */
/*  JourneyMap — dynamic import                                   */
/* ---------------------------------------------------------- */

export const DynamicJourneyMap = dynamic(
  () => import("@/components/journey/JourneyMap").catch(() => ({ default: EmptyFallback })),
  { ssr: false, loading: () => LoadingJourney() },
);

/* ---------------------------------------------------------- */
/*  ResonanceMeter — dynamic import                               */
/* ---------------------------------------------------------- */

export const DynamicResonanceMeter = dynamic(
  () => import("@/components/dashboard/PremiumResonanceMeter").then(m => ({ default: m.PremiumResonanceMeter })).catch(() => ({ default: EmptyFallback })),
  { ssr: false, loading: () => LoadingResonance() },
);

/* ---------------------------------------------------------- */
/*  MatchPopup — dynamic import                                   */
/* ---------------------------------------------------------- */

export const DynamicMatchPopup = dynamic(
  () => import("@/components/MatchPopup").catch(() => ({ default: EmptyFallback })),
  { ssr: false, loading: () => LoadingMatch() },
);

/* ---------------------------------------------------------- */
/*  ImageUpload — dynamic import                                  */
/* ---------------------------------------------------------- */

export const DynamicImageUpload = dynamic(
  () => import("@/components/ImageUpload").catch(() => ({ default: EmptyFallback })),
  { ssr: false, loading: () => LoadingUpload() },
);

/* ---------------------------------------------------------- */
/*  Notification Center — dynamic import                          */
/* ---------------------------------------------------------- */

export const DynamicNotificationCenter = dynamic(
  () => import("@/components/NotificationCenter").catch(() => ({ default: EmptyFallback })),
  { ssr: false, loading: () => null },
);

/* ---------------------------------------------------------- */
/*  Relationship components — dynamic imports                     */
/* ---------------------------------------------------------- */

export const DynamicTimeline = dynamic(
  () => import("@/components/relationship/Timeline").catch(() => ({ default: EmptyFallback })),
  { ssr: false, loading: () => LoadingTimeline() },
);

export const DynamicMemories = dynamic(
  () => import("@/components/relationship/Memories").catch(() => ({ default: EmptyFallback })),
  { ssr: false, loading: () => LoadingMemories() },
);

export const DynamicSocialGraph = dynamic(
  () => import("@/components/relationship/SocialGraph").catch(() => ({ default: EmptyFallback })),
  { ssr: false, loading: () => LoadingGraph() },
);

export const DynamicWeeklyDigest = dynamic(
  () => import("@/components/relationship/WeeklyDigest").catch(() => ({ default: EmptyFallback })),
  { ssr: false, loading: () => LoadingDigest() },
);

export const DynamicMilestoneCard = dynamic(
  () => import("@/components/relationship/MilestoneCard").catch(() => ({ default: EmptyFallback })),
  { ssr: false, loading: () => null },
);