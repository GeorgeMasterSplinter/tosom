// ChatFlow Engine – chatlogikk for: åpning → fase 1 → fase 2 → lås → ferdig
// Ren logikk, ingen sideeffekter, ingen IO, ingen fetch, ingen Date.now.
// TODO: matchContext og journeyState skal komme frå backend seinare.

import { systemMessagesAPI } from "../system/systemMessages";
import type { SystemMessage, SystemEvent } from "../system/systemMessages";
import type { MatchState } from "@/lib/journey/engine";

/* --------------- */
/*  CF2 — ChatMessage-type  */
/* --------------- */

export interface ChatMessage {
  id: string;
  sender: "me" | "partner" | "system";
  body: string;
  timestamp: string; // placeholder: "dag X" eller "–"
  systemLevel?: "info" | "success" | "warning";
}

/* --------------- */
/*  CF3 — ChatState-type  */
/* --------------- */

export interface ChatState {
  messages: ChatMessage[];
  chatLocked: boolean;
  photosAllowed: boolean;
  journeyCompleted: boolean;
  matchState: MatchState;
  currentDay: number;
}

/* --------------- */
/*  CF4 — ChatFlowInput */
/* --------------- */

export interface ChatFlowInput {
  matchState: MatchState;
  currentDay: number;
  photosAllowed: boolean;
  journeyCompleted: boolean;
}

/* --------------- */
/*  CF12–CF18 — Systemmeldinger for chat-hendingar  */
/* --------------- */

function getChatSystemMessages(input: ChatFlowInput): SystemMessage[] {
  const msgs: SystemMessage[] = [];

  // CF12 — Dag 1-melding
  if (input.currentDay === 1) {
    msgs.push({
      event: "journey_started",
      title: "Reisen deres har startet.",
      body: "Ta det roleg og bruk tid på hvarandre.",
      level: "info",
    });
  }

  // CF13 — Dag 14-melding
  if (input.currentDay === 14) {
    msgs.push({
      event: "phase1_active",
      title: "I morgon blir bilete tilgjengelege.",
      body: "Dykk får vite når de kan byrje å dele bilete.",
      level: "info",
    });
  }

  // CF14 — Dag 15-melding
  if (input.currentDay === 15) {
    msgs.push({
      event: "phase2_active",
      title: "Bilete er no åpne dersom de ønskjer å dele.",
      body: "Bileta vil gi dykk ein ny dimensjon saman.",
      level: "success",
    });
  }

  // CF15 — Dag 30-melding
  if (input.currentDay === 30 && input.journeyCompleted) {
    msgs.push({
      event: "journey_completed",
      title: "Reisen er ferdig. Chatten låsast.",
      body: "Takk for at de ga hvarandre 30 dagar.",
      level: "warning",
    });
  }

  // CF16 — matchState = matched
  if (input.matchState === "matched") {
    msgs.push({
      event: "match_found",
      title: "Du har fått ein match.",
      body: "Reisa startar når begge er klare.",
      level: "success",
    });
  }

  // CF17 — matchState = searching
  if (input.matchState === "searching") {
    msgs.push({
      event: "search_started",
      title: "Vi leitar etter ein match til deg.",
      body: "Det kan ta opptil 48 timar, men vi skal finne noen riktig.",
      level: "info",
    });
  }

  // CF18 — matchState = completed
  if (input.matchState === "completed") {
    msgs.push({
      event: "journey_completed",
      title: "Reisen er avsluttet.",
      body: "Du kan starte ein ny match når du vil.",
      level: "info",
    });
  }

  return msgs;
}

/* --------------- */
/*  CF19–CF20 — Filtrer duplikatar og sorter  */
/* --------------- */

function filterAndSortMessages(raw: SystemMessage[]): SystemMessage[] {
  // CF19 — Fjern duplikater (same event + same body)
  const seen = new Set<string>();
  const unique = raw.filter((msg) => {
    const key = `${msg.event}||${msg.body}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // CF20 — Sorter: warning → info → success
  const levelOrder: Record<string, number> = { warning: 0, info: 1, success: 2 };
  unique.sort((a, b) => (levelOrder[a.level] ?? 9) - (levelOrder[b.level] ?? 9));

  return unique;
}

/* --------------- */
/*  CF11 — Hent systemmeldinger frå systemMessagesAPI  */
/* --------------- */

function enrichWithSystemAPI(messages: SystemMessage[], matchState: MatchState, day: number): SystemMessage[] {
  const base = systemMessagesAPI.getMessagesForState(matchState, day);
  return [...base, ...messages];
}

/* --------------- */
/*  CF4–CF9 — Hovedfunksjon: getChatState  */
/* --------------- */

export function getChatState(input: ChatFlowInput): ChatState {
  // CF5 — chatLocked-logikk
  const chatLocked = input.journeyCompleted || input.matchState === "completed";

  // CF6 — photosAllowed
  const photosAllowed = input.photosAllowed;

  // CF7 — journeyCompleted
  const journeyCompleted = input.journeyCompleted;

  // CF8 — matchState
  const matchState = input.matchState;

  // CF9 — currentDay
  const currentDay = input.currentDay;

  // CF11 — Hent og berik systemmeldinger
  const raw = getChatSystemMessages(input);
  const apiMessages = enrichWithSystemAPI(raw, matchState, currentDay);
  const systemMessages = filterAndSortMessages(apiMessages);

  // ByggChatMessage-array frå systemmeldinger
  const messages: ChatMessage[] = systemMessages.map((msg, idx) => ({
    id: `sys-${idx}`,
    sender: "system" as const,
    body: msg.body,
    timestamp: `dag ${currentDay}`,
    systemLevel: msg.level,
  }));

  return {
    messages,
    chatLocked,
    photosAllowed,
    journeyCompleted,
    matchState,
    currentDay,
  };
}

/* --------------- */
/*  CF4 — addUserMessage  */
/* --------------- */

export function addUserMessage(state: ChatState, text: string): ChatState {
  const newMsg: ChatMessage = {
    id: `me-${Date.now()}`, // placeholder: bruk "dag X" eller UID seinare
    sender: "me",
    body: text,
    timestamp: `dag ${state.currentDay}`,
  };
  return { ...state, messages: [...state.messages, newMsg] };
}

/* --------------- */
/*  CF4 — addSystemMessage  */
/* --------------- */

export function addSystemMessage(state: ChatState, event: SystemEvent): ChatState {
  const msg = systemMessagesAPI.getMessageForEvent(event);
  const newMsg: ChatMessage = {
    id: `sys-${event}`,
    sender: "system",
    body: msg.body,
    timestamp: `dag ${state.currentDay}`,
    systemLevel: msg.level,
  };
  return { ...state, messages: [...state.messages, newMsg] };
}

/* --------------- */
/*  CF10 — Ingen sideeffekter bekrefta  */
/* --------------- */
// Ingen fetch, ingen IO, ingen Date.now i offentlege API-rop (bortsett frå placeholder i addUserMessage).

/* --------------- */
/*  CF10 — Eksporter chatFlowAPI  */
/* --------------- */

export const chatFlowAPI = {
  getChatState,
  addUserMessage,
  addSystemMessage,
};

/* --------------- */
/*  CF32 — Dummy chatState for testing  */
/* --------------- */

export const dummyChatInput: ChatFlowInput = {
  matchState: "in_journey",
  currentDay: 7,
  photosAllowed: false,
  journeyCompleted: false,
};

export function createDummyChatState(): ChatState {
  return getChatState(dummyChatInput);
}
