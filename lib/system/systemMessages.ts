// ToSom SystemMessages-API – systemets varme, rolige stemme
// Ren logikk, ingen sideeffekter, ingen IO.
// TODO: Her kan vi senere koble til AI-generering av meldinger.
// TODO: Her kan vi hente meldinger fra en konfigurasjonsfil eller CMS.

// SM2 — Definer SystemEvent-type
export type SystemEvent =
  | "match_requested"
  | "search_started"
  | "match_found"
  | "journey_started"
  | "milestone_reached"
  | "phase1_active"
  | "phase2_active"
  | "journey_completed"
  | "ready_for_new_match";

// SM3 — Definer SystemMessage-type
export interface SystemMessage {
  event: SystemEvent;
  title: string;
  body: string;
  level: "info" | "success" | "warning";
}

// SM4 — Meldingstabell for alle event-typer
const messagesMap: Record<SystemEvent, SystemMessage> = {
  match_requested: {
    event: "match_requested",
    title: "Du er klar for en ny match.",
    body: "Når du er klar, hjelper vi deg med å finne noen som passer deg.",
    level: "info",
  },
  search_started: {
    event: "search_started",
    title: "Vi leter etter en match til deg.",
    body: "Det kan ta opptil 48 timer, men vi skal finne noen riktig.",
    level: "info",
  },
  match_found: {
    event: "match_found",
    title: "Du har fått en match!",
    body: "Gratulerer. Nå gjenstår det bare at begge aksepterer.",
    level: "success",
  },
  journey_started: {
    event: "journey_started",
    title: "Reisen deres er i gang.",
    body: "Ta det rolig – hver dag er et lite steg mot hverandre.",
    level: "success",
  },
  phase1_active: {
    event: "phase1_active",
    title: "Denne delen av reisen er uten bilder.",
    body: "La ord og tanker være veien mellom dere – i alle fall for nå.",
    level: "info",
  },
  phase2_active: {
    event: "phase2_active",
    title: "Nå kan dere dele bilder hvis dere ønsker.",
    body: "Bildene kommer til å gi dere en ny dimensjon sammen.",
    level: "success",
  },
  journey_completed: {
    event: "journey_completed",
    title: "Reisen er ferdig.",
    body: "Takk for at dere ga hverandre 35 dager. Når du er klar, kan du starte på nytt.",
    level: "warning",
  },
  milestone_reached: {
    event: "milestone_reached",
    title: "Du har nådd en milepæl.",
    body: "Dette er et viktig skritt i reisen din. Fortsett i ditt eget tempo.",
    level: "info",
  },
  ready_for_new_match: {
    event: "ready_for_new_match",
    title: "Du kan starte en ny match.",
    body: "Ta deg tid – neste en passer deg, kommer når det er rett tid.",
    level: "info",
  },
};

// SM6 — getMessageForEvent
export function getMessageForEvent(event: SystemEvent): SystemMessage {
  const fallback: SystemMessage = {
    event,
    title: "Systemmelding",
    body: "Ingen informasjon tilgjengelig akkurat nå.",
    level: "info",
  };
  return messagesMap[event] ?? fallback;
}

// SM7 — getMessagesForState
export function getMessagesForState(
  matchState: string,
  currentDay?: number
): SystemMessage[] {
  const messages: SystemMessage[] = [];

  switch (matchState) {
    case "ready_for_match":
      messages.push(getMessageForEvent("match_requested"));
      break;

    case "searching":
      messages.push(getMessageForEvent("search_started"));
      break;

    case "matched":
      messages.push(getMessageForEvent("match_found"));
      break;

    case "in_journey": {
      const day = currentDay ?? 1;
      messages.push(getMessageForEvent("journey_started"));

      if (day >= 1 && day <= 14) {
        messages.push(getMessageForEvent("phase1_active"));
        if (day === 14) {
          messages.push({
            event: "phase1_active",
            title: "I morgen blir bilder tilgjengelige.",
            body: "Du får vite når dere kan begynne å dele bilder.",
            level: "info",
          });
        }
      }

      if (day >= 15 && day <= 35) {
        messages.push(getMessageForEvent("phase2_active"));
      }

      if (day === 35) {
        messages.push({
          event: "journey_completed",
          title: "Reisen er ferdig.",
          body: "Takk for at dere ga hverandre 35 dager.",
          level: "warning",
        });
      }
      break;
    }

    case "completed":
      messages.push(getMessageForEvent("journey_completed"));
      messages.push(getMessageForEvent("ready_for_new_match"));
      break;

    default:
      messages.push({
        event: "match_requested",
        title: "Du har ikke startet en match ennå.",
        body: "Når du er klar, hjelper vi deg med å finne noen.",
        level: "info",
      });
      break;
  }

  return messages;
}

// SM9 — Eksporter systemMessagesAPI
export const systemMessagesAPI = {
  messagesMap,
  getMessageForEvent,
  getMessagesForState,
};
