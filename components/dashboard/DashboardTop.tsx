"use client";

import JourneySummaryMini from "../journey/JourneySummaryMini";
import SystemMessageBox from "../system/SystemMessageBox";
import { journeyStateAPI, dummyMatchContext } from "../../lib/journey/journeyStateEngine";

export default function DashboardTop({
  userName = "Hei",
  date = new Date().toLocaleDateString("nb-NO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  journeyStatus = "in_progress",
  matchState = "in_journey",
}: {
  userName?: string;
  date?: string;
  journeyStatus?: string;
  matchState?: string;
}) {
  // JS23 — Bruk journeyStateAPI isteden for getMessagesForState
  // TODO: matchState skal komme fra backend.
  const journeyState = journeyStateAPI.getJourneyState({
    matchContext: { ...dummyMatchContext, matchState: matchState as any },
  });

  const statusMap: Record<string, { label: string; color: string }> = {
    not_started: { label: "Ikke startet", color: "bg-[#F7F1E3] text-[#4A4A4A]" },
    in_progress: { label: "På veg", color: "bg-[#E7EEF4] text-[#2F3A45]" },
    completed: { label: "Fullført", color: "bg-[#E6F3EC] text-[#2F4538]" },
  };

  const status = statusMap[journeyStatus] || statusMap.in_progress;

  return (
    <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 pb-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-[#2F3A45]">{userName}, velkommen</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#4A4A4A] leading-relaxed">{date}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${status.color} hover:bg-opacity-95 cursor-default`}
          >
            {status.label}
          </span>
        </div>
      </div>
      <div className="h-px bg-black/5" />
      <JourneySummaryMini />
      {/* JS23 — Systemmeldinger fra journeyState */}
      <SystemMessageBox messages={journeyState.messages} />
    </div>
  );
}
