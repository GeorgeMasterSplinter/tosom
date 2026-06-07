"use client";

import ReflectionBox from "./ReflectionBox";
import JourneySummary from "./JourneySummary";
import SystemNotice from "./SystemNotice";
import MatchFlowPreview from "../match/MatchFlowPreview";
import SystemMessageBox from "../system/SystemMessageBox";
import { journeyStateAPI, dummyMatchContext } from "../../lib/journey/journeyStateEngine";

export default function DashboardMiddle({
  reflectionText,
  onOpenReflection,
  journeyText,
  journeyStatus,
  noticeText,
  noticeType,
  matchState = "in_journey",
}: {
  reflectionText?: string;
  onOpenReflection?: () => void;
  journeyText?: string;
  journeyStatus?: string;
  noticeText?: string;
  noticeType?: string;
  matchState?: string;
}) {
  // JS22 + JS24 — Bruk journeyStateAPI istaden for getMessagesForState
  // TODO: matchState skal komme frå backend.
  const journeyState = journeyStateAPI.getJourneyState({
    matchContext: { ...dummyMatchContext, matchState: matchState as any },
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-[#4A4A4A] mb-3">Dagens refleksjon</h3>
        <ReflectionBox
          reflectionText={reflectionText}
          onOpen={onOpenReflection}
        />
      </div>

      <div className="h-px bg-black/5" />

      <div>
        <h3 className="text-sm font-medium text-[#4A4A4A] mb-3">Reisen din</h3>
        <JourneySummary
          journeyText={journeyText}
          journeyStatus={journeyStatus}
        />
      </div>

      <div className="h-px bg-black/5" />

      <div>
        <h3 className="text-sm font-medium text-[#4A4A4A] mb-3">Systemmelding</h3>
        {/* JS22 — Systemmeldingar frå journeyState */}
        <SystemMessageBox messages={journeyState.messages} />
      </div>

      <div className="h-px bg-black/5" />

      <div>
        <h3 className="text-sm font-medium text-[#4A4A4A] mb-3">Matchstatus</h3>
        {/* JS24 — MatchFlowPreview skal kunne bruke journeyState.matchState */}
        <MatchFlowPreview matchState={journeyState.matchState} />
      </div>
    </div>
  );
}
