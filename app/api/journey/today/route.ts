/**
 * GET /api/journey/today
 * 
 * Returnerer dagens innhald frå JourneyDayContent (database).
 * Fallback til hardkoda dersom ingen record finst.
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
 * Fallback hardkoda oppgåver (brukast berre dersom JourneyDayContent manglar)
 */
function getFallbackTask(day: number, phase: string, conversationId: string | null): DayTask | null {
  const FALLBACKS: Record<string, Array<{ title: string; description: string; prompt: string }>> = {
    EARLY: [
      { title: "Bryt isen", description: "Del ein personleg erfaring som har formet deg.", prompt: "Kva er eit minne eller ei oppleving som har gjort at du er den du er i dag?" },
      { title: "Daglege vanar", description: "Fortel om kvardagsrutinene dine.", prompt: "Kvordan ser ein typisk dag for seg hos deg? Del noko av kvardagen din." },
      { title: "Stad som betyr mykje", description: "Vel ein stad som gjer deg roleg og trygg.", prompt: "Finnes det ein stad der du alltid kjener deg hjemme? Fortel om han." },
      { title: "Favoritt ting", description: "Del noko du er glad i.", prompt: "Kva er noko du alltid returnerer til? Ein bok, film, song eller plass?" },
      { title: "Lærdom frå fjortisåra", description: "Fortel om noko viktig du lærte tidleg.", prompt: "Kva er ein ting du wish visste då du var 20? Kva har lært deg det?" },
      { title: "Utvikling", description: "Reflekter over korleis du har endra seg.", prompt: "Kva meiner du er den største endringa i deg selv dei siste åra?" },
      { title: "God stund", description: "Del ein liten men kjær verdfull stund.", prompt: "Når kjener du mest takksam? Del ei liten stund som betyr mykje for deg." },
      { title: "Sjølvmotivasjon", description: "Kva driv deg framover?", prompt: "Kva får deg til å stå opp om dagen, også i tunge periodar?" },
      { title: "Drømmer", description: "Fortel om ein drøm du har.", prompt: "Er det noko du alltid har lyst til å prøve? Kva kjener på?" },
      { title: "Oppsummering av fasen", description: "Samanfatt kalla lærde om deg selv i denne fasen.", prompt: "Kva er den viktigaste innsikta du har fått så langt i denne reisen?" },
    ],
    BUILDING_TRUST: [
      { title: "Trygghet i forhold", description: "Korleis byggjer du trygghet?", prompt: "Kva gjer du for å vise at du stolar på partneren din?" },
      { title: "Konflikt", description: "Handterer uoverensstemming med respekt.", prompt: "Korleis handterer du krangler? Del ein strategi som fungerer." },
      { title: "Åpent seg", description: "Del noko personleg.", prompt: "Finnes det noko du har halde tilbake ennå? Kva hindrar deg?" },
      { title: "Kvite grenser", description: "Setty klare grenser i relasjon.", prompt: "Kva er viktig for deg at partneren din respekterer?" },
      { title: "Styrfamiliar", description: "Familie som innflyting på forholdet.", prompt: "Korleis har familien din påverka synet ditt på kjærleik og tilhøyrsel?" },
      { title: "Verdiar i samspel", description: "Utrykk verdiane dine i kvardagen.", prompt: "Kva verdi er viktigast for deg å leve etter i forholdet?" },
      { title: "Felles framtidsvisjon", description: "Teikn ein felles framtid.", prompt: "Korleis tenkjer du sjølv at reisen deres kan gå dei neste månadane?" },
      { title: "Styrke i sårvit", description: "Sårbarheit som styrke.", prompt: "Når har sårbarheit ført til nære nærheite for deg?" },
      { title: "Takksemd", description: "Uttrykk takksemd til partneren.", prompt: "Kva set du pris på med partneren din? Fortel han eller henne det!" },
      { title: "Oppsummering av fasen", description: "Samanfatt kalla lærde om trygghet i denne fasen.", prompt: "Kva har lært deg mest om trygghet og nærheite så langt?" },
    ],
    DEEPER: [
      { title: "Kjære kjensler", description: "Utforsk djupe kjensler.", prompt: "Kva for ei kjensle er mest krevjande å dele? Kva skjer når du gjer det?" },
      { title: "Livsval", description: "Reflekter over viktige livsvalg.", prompt: "Kva val har hatt størst innflyting på kven du er i dag?" },
      { title: "Å la gå", description: "Kva må ein la gå for å vokse?", prompt: "Når lærte du deg å sløyfe noko viktig? Kva var resultatet?" },
      { title: "Indre ro", description: "Hvordan finn du indre frid?", prompt: "Finnes det ein metode, tanke eller rutine som gir deg ro?" },
      { title: "Meningsfylt liv", description: "Kva gir livet meining?", prompt: "Kva er meningen med livet for deg? Kva gjer kvardagen verdi full?" },
    ],
    CHECKIN: [
      { title: "Samansamling", description: "Hva har reisen lært dere?", prompt: "Kva har denne reisen lærte deg om deg selv og forholdet til dere?" },
      { title: "Framtidsperspektiv", description: "Fortel om framtidig relasjon.", prompt: "Korleis vil du ønskje at forholdet deres utvikler seg dei neste månadene?" },
      { title: "Vekst i felleskap", description: "Sammen kan dere meir.", prompt: "Kva meiner du er det viktigaste dere har byggt sammen så langt?" },
      { title: "Fortsetjing eller oppsummering", description: "Reflekter over neste steg.", prompt: "Ønsker du å halde fram saman? Kva kjener på for relasjonen deres?" },
      { title: "Takksemd og framoverblikk", description: "Avslutt med takksemd.", prompt: "Kva er det viktigaste du vil huske frå denne reisen?" },
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

    // 3. Hent journey progress for brukaren
    const journey = await prisma.journeyProgress.findUnique({
      where: { userId: user.id },
      select: { day: true, phase: true },
    });

    if (!journey) {
      return NextResponse.json({
        error: "Ingen reise funnen",
        day: 0,
        phase: "PRE_START",
        task: null,
      }, { status: 200 });
    }

    // 4. Hent frå JourneyDayContent (database) — primær-kjelde
    let content = await prisma.journeyDayContent.findUnique({
      where: { day: journey.day },
      select: { theme: true, phase: true, reflectionQuestion: true, conversationPrompt: true, task: true, resonanceGoal: true },
    });

    // 5. Fallback til hardkoda dersom ingen record
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
      // Eksstra felt frå JourneyDayContent dersom tilgjengeleg
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
