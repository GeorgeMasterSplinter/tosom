"use client";

/** ChatViewDemo — selvstendig demo av ChatView med ekte ChatFlow + JourneyStateEngine
 *  CF31 — Vis ChatView med dummy-data (ikke i DashboardLayout)
 *  CF32 — Dummy chatState
 *  CF33 — Koble ChatFlow (getChatState) til JourneyStateEngine
 *  CF34 — Koble systemMessagesAPI via ChatFlow
 *  CF35–CF37 — Implementer chatLocked, photosAllowed, journeyCompleted
 *  CF38 — Bokmål, varmt, rolig, kort
 *  CF39 — Ingen ubrukte imports
 *  CF40 — Ingen nye features */

import { useState } from "react";
import ChatView from "./ChatView";
import { chatFlowAPI, type ChatFlowInput } from "../../lib/chat/chatFlow";
import { buildJourneyState, dummyMatchContext } from "@/lib/journey/engine";

/* -- CF32 — Dummy input for testing -- */

const dummyInput: ChatFlowInput = {
  matchState: "in_journey",
  currentDay: 7,
  photosAllowed: false,
  journeyCompleted: false,
};

export default function ChatViewDemo() {
  const [input, setInput] = useState<ChatFlowInput>(dummyInput);

  /* Bruk engine.ts (éin kilde) */
  const journeyState = buildJourneyState(
    input.currentDay,
    { matchState: input.matchState as any }
  );

  const chatState = chatFlowAPI.getChatState({
    matchState: input.matchState as any,
    currentDay: journeyState.currentDay,
    photosAllowed: journeyState.photosAllowed,
    journeyCompleted: journeyState.journeyCompleted,
  });

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Demo-kontroll */}
      <div className="bg-white/60 shadow-[0_1px_3px_rgba(0,0,0,0.03)] rounded-xl p-3 space-y-2">
        <p className="text-xs font-medium text-[#4A4A4A]">Demo-kontroll</p>

        <div className="flex items-center gap-2">
          <label className="text-xs text-[#4A4A4A]/70">Dag:</label>
          <input
            type="number"
            min={1}
            max={35}
            value={input.currentDay}
            onChange={(e) =>
              setInput({
                ...input,
                currentDay: Math.max(1, Math.min(35, Number(e.target.value))),
              })
            }
            className="w-16 text-xs px-2 py-1 bg-white/80 rounded-lg border border-black/5 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-[#4A4A4A]/70">Fase:</label>
          <select
            value={input.matchState}
            onChange={(e) =>
              setInput({ ...input, matchState: e.target.value as any })
            }
            className="text-xs px-2 py-1 bg-white/80 rounded-lg border border-black/5 outline-none"
          >
            <option value="ready_for_match">Klar for match</option>
            <option value="searching">Leiter</option>
            <option value="matched">Matcha</option>
            <option value="in_journey">I reise</option>
            <option value="completed">Ferdig</option>
          </select>
        </div>

         <p className="text-xs text-[#4A4A4A]/60">
          {journeyState.journeyCompleted
            ? "Reise ferdig"
            : `Dag ${input.currentDay} · ${journeyState.phase}`}
        </p>
      </div>

      {/* ChatView med ekte ChatFlow-data */}
      <ChatView chatState={chatState} />

      {/* CF38 — Bokmål, varmt, rolig, kort */}
      <p className="text-xs text-[#4A4A4A]/40 text-center">
        Dette er en demo av ChatView. Alle meldinger er genererte fra ChatFlow.
      </p>
    </div>
  );
}
