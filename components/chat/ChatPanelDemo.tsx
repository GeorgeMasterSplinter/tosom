"use client";

/** ChatPanelDemo — test ChatPanel utan dashboard
 *  CF51 — opprett demo-komponent
 *  CF52–CF54 — dummy-data
 *  CF55–CF56 — koble ChatFlow og ChatPanel
 *  CF57–CF59 — knappar for dagskifte, fasebytte, journeyCompleted
 *  CF60 — ferdigstilling, ingen nye features */

import { useState, useCallback } from "react";
import ChatPanel from "./ChatPanel";
import {
  chatFlowAPI,
  type ChatState,
  type ChatFlowInput,
} from "../../lib/chat/chatFlow";
import {
  journeyStateAPI,
  dummyMatchContext,
  type MatchContext,
  type MatchState,
} from "../../lib/journey/journeyStateEngine";

/* CF52 — Dummy matchContext */
const dummyMatch: MatchContext = { ...dummyMatchContext, matchState: "in_journey" as const };

/* CF53 — Dummy journeyState */
const initialDay = 12;

export default function ChatPanelDemo() {
  /* CF57–CF59 — Stat */
  const [day, setDay] = useState(initialDay);
  const [photosAllowed, setPhotosAllowed] = useState(false);
  const [journeyCompleted, setJourneyCompleted] = useState(false);
  const [matchState, setMatchState] = useState<MatchState>("in_journey");

  /* CF55 — Koble ChatFlow via getChatState */
  const journeyState = journeyStateAPI.getJourneyState({
    matchContext: dummyMatch,
    currentDay: day,
  });

  const chatFlowInput: ChatFlowInput = {
    matchState,
    currentDay: journeyState.currentDay,
    photosAllowed,
    journeyCompleted,
  };

  const chatState: ChatState = chatFlowAPI.getChatState(chatFlowInput);

  /* CF50 — onSendMessage berre kall addUserMessage */
  const handleSendMessage = useCallback((text: string) => {
    chatFlowAPI.addUserMessage(chatState, text);
  }, [chatState]);

  return (
    <div className="max-w-lg mx-auto p-4 h-[600px]">
      {/* Demo-knappar */}
      <div className="bg-white/60 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2 mb-4">
        <p className="text-xs font-medium text-[#4A4A4A]">Demo-kontroll</p>

        <div className="flex flex-wrap gap-2">
          {/* CF57 — Neste dag */}
          <button
            onClick={() => setDay((d) => Math.min(35, d + 1))}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
          >
            Neste dag ({day})
          </button>

          {/* CF58 — Bytt fase */}
          <button
            onClick={() => setPhotosAllowed((p) => !p)}
            className="text-xs px-3 py-1.5 rounded-lg bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
          >
            {photosAllowed ? "Lås bilder" : "Åpne bilder"}
          </button>

          {/* CF59 — JourneyCompleted */}
          <button
            onClick={() => setJourneyCompleted((c) => !c)}
            className="text-xs px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
          >
            {journeyCompleted ? "Angre ferdig" : "Markér ferdig"}
          </button>
        </div>

        <p className="text-xs text-[#4A4A4A]/50">
          {journeyState.journeyCompleted
            ? "Reise ferdig"
            : `Dag ${journeyState.currentDay} · ${journeyState.phase} · ${photosAllowed ? "bilder åpne" : "bilder låst"}`}
        </p>
      </div>

      {/* CF56 — ChatPanel med ekte ChatFlow-data */}
      <ChatPanel
        chatState={chatState}
        partnerName="Makei"
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
