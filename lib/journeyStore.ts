interface JourneyStep { id: string; title: string; description: string; }

interface JourneyData {
  steps: JourneyStep[];
  current: JourneyStep;
  index: number;
}

const journeys = new Map<string, JourneyData>();

const DEFAULT_STEPS: JourneyStep[] = [
  { id: "step1", title: "Start reisen", description: "Del noko enkelt om dagen din." },
  { id: "step2", title: "Litt djupare", description: "Kva er noko du ser fram til denne veka?" },
  { id: "step3", title: "Felles refleksjon", description: "Kva gjer at du trivst i samtalar med andre?" },
];

export function initJourney(conversationId: string): JourneyData {
  if (journeys.has(conversationId)) return journeys.get(conversationId)!;
  const initialState: JourneyData = {
    steps: DEFAULT_STEPS,
    current: DEFAULT_STEPS[0],
    index: 0,
  };
  journeys.set(conversationId, initialState);
  return initialState;
}

export function getJourney(conversationId: string): JourneyData | undefined {
  return journeys.get(conversationId);
}

export function advanceJourney(conversationId: string): JourneyData | null {
  const journey = journeys.get(conversationId);
  if (!journey) return null;
  const newIndex = journey.index + 1;
  if (newIndex >= journey.steps.length) return journey;
  journey.index = newIndex;
  journey.current = journey.steps[newIndex];
  return journey;
}

export function resetJourney(conversationId: string): JourneyData | null {
  const journey = journeys.get(conversationId);
  if (!journey) return null;
  journey.index = 0;
  journey.current = DEFAULT_STEPS[0];
  return journey;
}

export function getAllJourneys(): JourneyData[] {
  const r: JourneyData[] = [];
  journeys.forEach(j => r.push(j));
  return r;
}