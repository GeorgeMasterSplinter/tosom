/**
 * GET /api/journey/today
 * 
 * Returnerer dagens innhold fra JourneyDayContent (database).
 * Fallback til hardkodede dersom ingen record finnes.
 * Utvidet 2026-08-03 (Pakke 4.3: JourneyDayContent Integrasjon)
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/requireAuth";
import { trackError } from "@/lib/errorTracker";

export const dynamic = 'force-dynamic';

interface DayTask {
  day: number;
  phase: string;
  title: string;
  description: string;
  prompt: string;
  conversationId?: string | null;
}

/**
 * Fallback hardkodede oppgaver (brukes bare dersom JourneyDayContent mangler)
 */
function getFallbackTask(day: number, phase: string, conversationId: string | null): DayTask | null {
  const FALLBACKS: Record<string, Array<{ title: string; description: string; prompt: string }>> = {
    EARLY: [
      { title: "Bryt isen", description: "Del en personlig erfaring som har formet deg.", prompt: "Hva er et minne eller en opplevelse som har gjort at du er den du er i dag?" },
      { title: "Daglige vaner", description: "Fortell om hvardagsrutinene dine.", prompt: "Hvordan ser en typisk dag for seg hos deg? Del noe av hverdagen din." },
      { title: "Sted som betyr mye", description: "Vel et sted som gjør deg rolig og trygg.", prompt: "Finnes det et sted der du alltid føler deg hjemme? Fortell om det." },
      { title: "Favoritt ting", description: "Del noe du er glad i.", prompt: "Hva er noe du alltid returnerer til? En bok, film, sang eller plass?" },
      { title: "Lærdom fra fjortisåra", description: "Fortell om noe viktig du lærte tidlig.", prompt: "Hva er en ting du ønsket at du visste da du var 20? Hva har lært deg det?" },
      { title: "Utvikling", description: "Reflekter over hvordan du har endret deg.", prompt: "Hva mener du er den største endringen i deg selv de siste årene?" },
      { title: "God stund", description: "Del en liten men kjær verdifull stund.", prompt: "Når føler du deg mest takknemlig? Del en liten stund som betyr mye for deg." },
      { title: "Selvmotivasjon", description: "Hva driver deg fremover?", prompt: "Hva får deg til å stå opp om dagen, også i tunge perioder?" },
      { title: "Drømmer", description: "Fortell om en drøm du har.", prompt: "Er det noe du alltid har lyst til å prøve? Hva føler du?" },
      { title: "Oppsummering av fasen", description: "Sammendrag hva du lærte om deg selv i denne fasen.", prompt: "Hva er den viktigste innsikten du har fått så langt i denne reisen?" },
    ],
    BUILDING_TRUST: [
      { title: "Trygghet i forhold", description: "Hvordan bygger du trygghet?", prompt: "Hva gjør du for å vise at du stoler på partneren din?" },
      { title: "Konflikt", description: "Håndter uoverensstemmelse med respekt.", prompt: "Hvordan håndterer du krangler? Del en strategi som fungerer." },
      { title: "Åpne deg", description: "Del noe personlig.", prompt: "Finnes det noe du har holdt tilbake ennå? Hva hindrer deg?" },
      { title: "Sette grenser", description: "Sett klare grenser i relasjon.", prompt: "Hva er viktig for deg at partneren din respekterer?" },
      { title: "Styrke og familie", description: "Familie som innflytelse på forholdet.", prompt: "Hvordan har familien din påvirket synet ditt på kjærlighet og tilhørighet?" },
      { title: "Verdier i samspill", description: "Utrykk verdiene dine i hverdagen.", prompt: "Hva verdi er viktigst for deg å leve etter i forholdet?" },
      { title: "Felles framtidvisjon", description: "Tegn en felles framtid.", prompt: "Hvordan tenker du selv at reisen deres kan gå de neste månedene?" },
      { title: "Styrke i sårbarhet", description: "Sårbarhet som styrke.", prompt: "Når har sårbarhet ført til nærmere relasjoner for deg?" },
      { title: "Takkjennelighet", description: "Uttrykk takknemlighet til partneren.", prompt: "Hva setter du pris på med partneren din? Fortell han eller henne det!" },
      { title: "Oppsummering av fasen", description: "Sammendrag hva du lærte om trygghet i denne fasen.", prompt: "Hva har lært deg mest om trygghet og nærhet så langt?" },
    ],
    DEEPER: [
      { title: "Dype følelser", description: "Utforsk dype følelser.", prompt: "Hvilken følelse er mest krevende å dele? Hva skjer når du gjør det?" },
      { title: "Livsvalg", description: "Reflekter over viktige livsvalg.", prompt: "Hva valg har hatt størst innflytelse på hvem du er i dag?" },
      { title: "Å la gå", description: "Hva må man la gå for å vokse?", prompt: "Når lærte du deg å slippe noe viktig? Hva var resultatet?" },
      { title: "Indre ro", description: "Hvordan finner du indre fred?", prompt: "Finnes det en metode, tanke eller rutine som gir deg ro?" },
      { title: "Meningsfylt liv", description: "Hva gir livet mening?", prompt: "Hva er meningen med livet for deg? Hva gjør hverdagen verdifull?" },
    ],
    CHECKIN: [
      { title: "Sammendrag", description: "Hva har reisen lært dere?", prompt: "Hva har denne reisen lært deg om deg selv og forholdet deres?" },
      { title: "Framtidsperspektiv", description: "Fortell om framtidig relasjon.", prompt: "Hvordan vil du ønske at forholdet deres utvikler seg de neste månedene?" },
      { title: "Vekst i fellesskap", description: "Sammen kan dere mer.", prompt: "Hva mener du er det viktigste dere har bygd sammen så langt?" },
      { title: "Fortsettelse eller oppsummering", description: "Reflekter over neste steg.", prompt: "Ønsker du å holde fram sammen? Hva føler du for relasjonen deres?" },
      { title: "Takk og framoverblikk", description: "Avslutt med takknemlighet.", prompt: "Hva er det viktigste du vil huske fra denne reisen?" },
    ],
  };

  const tasks = FALLBACKS[phase];
  if (!tasks) return null;

  const idx = phase === "EARLY" ? (day - 1) :
              phase === "BUILDING_TRUST" ? (day - 11) :
              phase === "DEEPER" ? (day - 21) :
              phase === "CHECKIN" ? (day - 26) : 0;

  const t = tasks[idx % tasks.length];
  return { day, phase, ...t, conversationId };
}

export async function GET(req: NextRequest) {
  try {
    // 1. Auth
    const result = await requireAuth(req);
    if (result instanceof NextResponse) return result;
    const user = result.user;

    // 2. Query-params
    const url = new URL(req.url);
    const conversationId = url.searchParams.get("conversationId");

    // 3. Hent journey progress for brukeren
    const journey = await prisma.journeyProgress.findUnique({
      where: { userId: user.id },
      select: { day: true, phase: true },
    });

    if (!journey) {
      return NextResponse.json({
        error: "Ingen reise funnet",
        day: 0,
        phase: "PRE_START",
        task: null,
      }, { status: 200 });
    }

    // 4. Hent fra JourneyDayContent (database) — primær-kilde
    let content = await prisma.journeyDayContent.findUnique({
      where: { day: journey.day },
      select: { theme: true, phase: true, reflectionQuestion: true, conversationPrompt: true, task: true, resonanceGoal: true },
    });

    // 5. Fallback til hardkodede dersom ingen record
    const fallbackTask = content
      ? {
          day: journey.day,
          phase: journey.phase,
          title: content.theme,
          description: content.resonanceGoal || '',
          prompt: content.conversationPrompt || content.reflectionQuestion || '',
          conversationId,
        }
      : getFallbackTask(journey.day, journey.phase, conversationId);

    const responsePhase = content?.phase ?? journey.phase;
    const fromDB = content !== null;

    return NextResponse.json({
      day: journey.day,
      phase: responsePhase,
      totalDays: 30,
      source: fromDB ? 'database' : 'fallback',
      task: fallbackTask,
      // Ekstra felt fra JourneyDayContent dersom tilgjengelig
      theme: content?.theme ?? null,
      reflectionQuestion: content?.reflectionQuestion ?? null,
      resonanceGoal: content?.resonanceGoal ?? null,
    });
  } catch (error) {
    console.error('[GET /api/journey/today] Error:', error);
    trackError(error, "api/journey/today");
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}