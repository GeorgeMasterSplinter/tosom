interface JourneyStep { id: string; title: string; description: string; }
interface JourneyData { conversationId: string; steps: JourneyStep[]; currentStep: number; current: JourneyStep; updatedAt: string; }
const journeys = new Map<string, JourneyData>();
const DEFAULT_STEPS: JourneyStep[] = [
  { id: "step1", title: "Start reisen", description: "Del noko enkelt om dagen din." },
  { id: "step2", title: "Litt djupare", description: "Kva er noko du ser fram til denne veka?" },
  { id: "step3", title: "Felles refleksjon", description: "Kva gjer at du trivst i samtalar med andre?" },
];
export function initJourney(conversationId: string): JourneyData {
  if (journeys.has(conversationId)) return journeys.get(conversationId)!;
  const journey: JourneyData = { conversationId, steps: [...DEFAULT_STEPS], currentStep: 0, updatedAt: new Date().toISOString() };
  journeys.set(conversationId, journey);
  return journey;
}
export function getJourney(conversationId: string): JourneyData | undefined { return journeys.get(conversationId); }
export function advanceJourney(conversationId: string): JourneyData | null {
  const journey = journeys.get(conversationId);
  if (!journey) return null;
  const nextStep = journey.currentStep + 1;
  if (nextStep >= journey.steps.length) return journey;
  journey.currentStep = nextStep;
  journey.updatedAt = new Date().toISOString();
  return journey;
}
export function resetJourney(conversationId: string): JourneyData | null {
  const journey = journeys.get(conversationId);
  if (!journey) return null;
  journey.currentStep = 0;
  journey.updatedAt = new Date().toISOString();
  return journey;
}
export function getAllJourneys(): JourneyData[] {
  const r: JourneyData[] = [];
  journeys.forEach(j => r.push(j));
  return r;
}
