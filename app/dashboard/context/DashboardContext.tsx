/**
 * ToSom Dashboard 2.0 — DashboardContext
 * Sentral motor for Dashboard-data og state-håndtering.
 * API-klar arkitektur med useReducer + action-based dispatch.
 * Ingen UI-endringer. Kun arkitektur.
 */

'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import {
  dashboardReducer,
  dashboardActions,
  defaultDashboardState,
  DashboardAction,
  DashboardState,
} from './dashboardReducer';
import { memoryEngine, type MemoryState } from '../core/MemoryEngine';

// Re-export types for convenience
export type { SafetyPoint, UpcomingStep, ReflectionEntry, HeatmapEntry, WeeklySummary, AIInsights } from './dashboardReducer';

// ─── Mock-data struktur (midlertidig) ─────────

interface MockDashboardData {
  match: { matchStatus: string; daysTogether: number; nextMilestone: string };
  dailyStep: { todayStep: string; stepDescription: string; progress: number };
  conversation: { topic: string; description: string; lastInteraction: string };
  journey: { progress: number; upcomingSteps: Array<import('./dashboardReducer').UpcomingStep> };
  safety: Array<import('./dashboardReducer').SafetyPoint>;
  profile: import('./dashboardReducer').ProfileData;
}

const mockDashboardData: MockDashboardData = {
  match: {
    matchStatus: 'Dere er matchet',
    daysTogether: 12,
    nextMilestone: 'Neste milepæl: Dag 14 – Første refleksjon',
  },
  dailyStep: {
    todayStep: 'Dag 5 – Verdier og forventninger',
    stepDescription: 'Utforsk hva som betyr mest for dere, og hvordan dere ønsker å bygge relasjonen.',
    progress: 5,
  },
  conversation: {
    topic: 'Dagens samtaletema: Dine dypeste verdier',
    description: 'Hva er viktigst for deg i en relasjon? Del en verdi som har formet hvem du er.',
    lastInteraction: 'Siste interaksjon: 2 dager siden',
  },
  journey: {
    progress: 5,
    upcomingSteps: [
      { label: 'Dag 6 – Refleksjon sammen' },
      { label: 'Dag 7 – Verdier i praksis' },
      { label: 'Dag 8 – Fremtidsbilder' },
    ],
  },
  safety: [
    {
      title: 'Du kontrollerer hva du deler',
      description: 'Ingen kan se profilen din utenfor matchen. Du velger hva som deles – og når.',
    },
    {
      title: 'Ingen offentlig profil',
      description: 'ToSom har ingen feed, ingen søkefunksjon og ingen åpne profiler.',
    },
    {
      title: 'Bygget for trygghet',
      description: 'All kommunikasjon er kryptert, og data deles aldri med tredjeparter.',
    },
  ],
  profile: {
    yourName: 'Deg',
    partnerName: 'Partneren din',
    matchDate: '12 dager siden',
    relationshipStyle: 'Trygg / åpen',
    sharedValues: ['Ærlighet', 'Trygghet', 'Vekst'],
  },
};

// ─── Mock data loader (placeholder for ekte API) ─────────

async function loadDashboardData(dispatch: (action: DashboardAction) => void) {
  dispatch(dashboardActions.setLoading(true));

  try {
    // TODO: Bytt til ekte API-kall senere
    // const response = await fetch('/api/dashboard');
    // const data = await response.json();

    const data = mockDashboardData;

    dispatch(dashboardActions.setMatchData({
      matchStatus: data.match.matchStatus,
      daysTogether: data.match.daysTogether,
      nextMilestone: data.match.nextMilestone,
    }));

    dispatch(dashboardActions.setDailyStep({
      todayStep: data.dailyStep.todayStep,
      stepDescription: data.dailyStep.stepDescription,
      progress: data.dailyStep.progress,
    }));

    dispatch(dashboardActions.setConversation({
      topic: data.conversation.topic,
      description: data.conversation.description,
      lastInteraction: data.conversation.lastInteraction,
    }));

    dispatch(dashboardActions.setJourneyProgress({
      progress: data.journey.progress,
      upcomingSteps: data.journey.upcomingSteps,
    }));

    dispatch(dashboardActions.setSafety(data.safety));

    if (data.profile) {
      dispatch(dashboardActions.setProfile(data.profile));
    }

    dispatch(dashboardActions.setLoading(false));
  } catch {
    dispatch(dashboardActions.setError('Kunne ikke laste dashboard-data'));
    dispatch(dashboardActions.setLoading(false));
  }
}

// ─── Context ───────────────────────────────

interface DashboardContextValue {
  state: DashboardState;
  dispatch: (action: DashboardAction) => void;
  addReflection: (entry: import('./dashboardReducer').ReflectionEntry) => void;
  updateHeatmap: (entries: import('./dashboardReducer').HeatmapEntry[]) => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(
  undefined
);

// ─── Provider ──────────────────────────────

interface DashboardProviderProps {
  children: ReactNode;
}

// Initialize from MemoryEngine
const memState: MemoryState = memoryEngine.getState();
const initialDashboardState: DashboardState = {
  ...defaultDashboardState,
  memoryProgress: memState.progress !== undefined ? memState.progress : null,
  reflections: memState.reflections?.length ? memState.reflections : null,
  heatmap: memState.heatmap?.length ? memState.heatmap : null,
  weeklySummary: memState.weeklySummary,
  aiInsights: memState.aiInsights,
};

// Helper funksjoner for MemoryEngine
const addReflection = (entry: import('./dashboardReducer').ReflectionEntry) => {
  memoryEngine.addReflection(entry);
};

const updateHeatmap = (entries: import('./dashboardReducer').HeatmapEntry[]) => {
  memoryEngine.updateHeatmap(entries);
};

const setHeatmap = (entry: import('./dashboardReducer').HeatmapEntry[]): DashboardAction => ({
  type: 'SET_HEATMAP',
  payload: entry,
});

const setWeeklySummary = (summary: import('./dashboardReducer').WeeklySummary | null): DashboardAction => ({
  type: 'SET_WEEKLY_SUMMARY',
  payload: summary,
});

const setAIInsights = (insights: import('./dashboardReducer').AIInsights | null): DashboardAction => ({
  type: 'SET_AI_INSIGHTS',
  payload: insights,
});

const updateMemoryProgress = (value: number): DashboardAction => ({
  type: 'UPDATE_PROGRESS',
  payload: value,
});

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
}) => {
  // Sync wrapper: dispatch + save to MemoryEngine
  const dispatchWithSync = (action: DashboardAction) => {
    dispatch(action);

    // Sync MemoryEngine på endringer
    if (action.type === 'UPDATE_PROGRESS') {
      memoryEngine.updateProgress(action.payload);
    }
    if (action.type === 'SET_REFLECTIONS' && action.payload) {
      // Konverter ReflectionEntry[] til HeatmapEntry-format for lagring
      const existing = memoryEngine.getState().reflections || [];
      memoryEngine.addReflection(action.payload[0]);
    }
    if (action.type === 'SET_HEATMAP' && action.payload) {
      memoryEngine.updateHeatmap(action.payload);
    }
    if (action.type === 'SET_WEEKLY_SUMMARY' && action.payload) {
      memoryEngine.setWeeklySummary(action.payload);
    }
    if (action.type === 'SET_AI_INSIGHTS' && action.payload) {
      memoryEngine.setAIInsights(action.payload);
    }
    if (action.type === 'SET_LAST_MESSAGE_PREVIEW' && action.payload) {
      // Auto-oppdater heatmap og AI Insights fra melding
      const { tone, intensity } = memoryEngine.autoUpdateHeatmapFromMessage(action.payload);
      memoryEngine.autoUpdateAIInsights(action.payload);
    }
  };

  const [state, dispatch] = useReducer(
    dashboardReducer,
    initialDashboardState
  );

  useEffect(() => {
    loadDashboardData(dispatchWithSync);
  }, []);

  return (
    <DashboardContext.Provider value={{ state, dispatch: dispatchWithSync, addReflection, updateHeatmap }}>
      {children}
    </DashboardContext.Provider>
  );
};

// ─── Hook ──────────────────────────────────

export const useDashboard = (): DashboardContextValue => {
  const context = useContext(DashboardContext);

  if (context === undefined) {
    throw new Error(
      'useDashboard must be used within a DashboardProvider'
    );
  }

  return context;
};

export {
  defaultDashboardState,
  dashboardActions,
  loadDashboardData,
  addReflection,
  updateHeatmap,
  setHeatmap,
  setWeeklySummary,
  setAIInsights,
  updateMemoryProgress,
  initialDashboardState,
};
export default DashboardContext;
