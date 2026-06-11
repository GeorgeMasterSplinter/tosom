import { createSystemMessage } from "../createSystemMessage";
import { milestonesAPI } from "./milestones";
import { buildJourneyState, JourneyState } from "./journeyEngine";
import prisma from "@/lib/prisma";

export async function runJourneyStep(conversationId: string) {
  const journey: JourneyState = buildJourneyState(1, 1);
  let day = journey.completedSteps;

  if (day < 1 || day > 35) return;

  // Milepæls-melding skal sendast før vanlege journey-steg
  const milestone = milestonesAPI.getMilestoneForDay(day);
  if (milestone) {
    await createSystemMessage(
      conversationId,
      `${milestone.title} – ${milestone.body}`
    );
  }


  // Dag 3
  if (day === 3) {
    await createSystemMessage(
      conversationId,
      "Del litt meir om deg sjølv i dag. Kva gjer deg glad?"
    );
  }

  // Dag 7 — verdier og trygg dybde
  if (day === 7) {
    await createSystemMessage(
      conversationId,
      "Snakk litt om kva som betyr noko for deg. Verdier, små ting i kvardagen, eller noko du set pris på."
    );
  }

  // Dag 10 — emosjonell tryggleik og rytme
  if (day === 10) {
    await createSystemMessage(
      conversationId,
      "Ta det i ditt tempo. Det viktigaste er at samtalen kjennest trygg og naturlig for begge."
    );
  }

  // Dag 14 — bilder opnast (rolig og trygg overgang)
  if (day === 14) {
    await createSystemMessage(
      conversationId,
      "Frå i dag kan de sjå kvarandres bilete. Ta det roleg, og lat det vere ein naturleg del av samtalen."
    );
  }

  // Dag 21 — retning og forventningar
  if (day === 21) {
    await createSystemMessage(
      conversationId,
      "Etter tre veker kan det vere fint å kjenne etter kva dere ønskjer vidare. Ta det roleg, og snakk om kva som kjennest riktig for begge."
    );
  }

  // Dag 28 — moden refleksjon og retning
  if (day === 28) {
    await createSystemMessage(
      conversationId,
      "Det er snart gått ein månad. Kanskje det er fint å kjenne etter om samtalen framleis kjennest riktig og gjevande for begge."
    );
  }

  // Dag 30 — avslutning og val
  if (day === 30) {
    await createSystemMessage(
      conversationId,
      "Dei har no hatt 30 dagar saman. Ta eit augeblink og kjenn etter om dette er noko dere ønskjer å halde fram med. Det viktigaste er at valet kjennest riktig for begge."
    );
  }

  // Dag 35 — modenheitsrefleksjon + continue-spørsmål
  if (day === 35) {
    await createSystemMessage(
      conversationId,
      "Dei har snakka ei god stund no. Kanskje det er fint å kjenne etter om dette er noko dere ønskjer å bygge vidare på."
    );
  }

  // Oppdater progresjon
  await prisma.journeyProgress.update({
    where: { userId: conversationId },
    data: { day: day + 1 },
  });

  return buildJourneyState(day + 1, day + 1);
}
