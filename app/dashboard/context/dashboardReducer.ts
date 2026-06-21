/**
 * ToSom Dashboard 2.0 — dashboardReducer
 * Reducer-funksjon for DashboardContext state-håndtering.
 * API-klar arkitektur med typed actions.
 */

// ─── Type-struktur (duplisert for å unngå sirkulær import) ─────────

// Memory Engine typer (for refleksjoner og heatmap)
export interface ReflectionEntry {
  day: number;
  question: string;
  yourAnswer: string;
  partnerAnswer: string;
  timestamp: string;
}

export interface HeatmapEntry {
  day: number;
  tone: string;
  intensity: number; // 1–5
}

export interface WeeklySummary {
  week: string;
  progress: number;
  reflectionsCompleted: number;
  milestonesReached: number;
  highlight: string;
  upcoming: string[];
}

export interface AIInsights {
  emotionalTone: string;
  connectionLevel: string;
  conversationDepth: string;
  summary: string;
  recommendations: string[];
}

export interface SafetyPoint {
  title: string;
  description: string;
}

export interface UpcomingStep {
  label: string;
}

export interface DashboardState {
  loading: boolean;
  error: string | null;

  // TopCard
  matchStatus: string | null;
  daysTogether: number | null;
  nextMilestone: string | null;

  // DailyStep
  todayStep: string | null;
  stepDescription: string | null;
  progress: number | null;

  // Conversation
  conversationTopic: string | null;
  conversationDescription: string | null;
  lastInteraction: string | null;
  lastMessagePreview: string | null;

  // JourneyProgress
  upcomingSteps: Array<UpcomingStep> | null;
  journeyUpdatedAt: number | null;

  // Safety
  safetyPoints: Array<SafetyPoint> | null;

  // Typing indicator
  partnerTyping: boolean;

  // Milestone
  milestoneMessage: string | null;

  // Profile
  profile: ProfileData | null;

  // Memory Engine
  reflections: Array<ReflectionEntry> | null;
  heatmap: Array<HeatmapEntry> | null;
  weeklySummary: WeeklySummary | null;
  aiInsights: AIInsights | null;
  memoryProgress: number | null;
}

export interface ProfileData {
  yourName: string | null;
  partnerName: string | null;
  matchDate: string | null;
  relationshipStyle: string | null;
  sharedValues: string[] | null;
}

// ─── Default state ──────────────────────────────

export const defaultDashboardState: DashboardState = {
  loading: true,
  error: null,

  matchStatus: null,
  daysTogether: null,
  nextMilestone: null,

  todayStep: null,
  stepDescription: null,
  progress: null,

  conversationTopic: null,
  conversationDescription: null,
  lastInteraction: null,
  lastMessagePreview: null,

  upcomingSteps: null,
  safetyPoints: null,

  partnerTyping: false,

  journeyUpdatedAt: null,

  milestoneMessage: null,

  profile: null,

  // Memory Engine
  reflections: null,
  heatmap: null,
  weeklySummary: null,
  aiInsights: null,
  memoryProgress: null,
};

// ─── Action Types ────────────────────────────

export type DashboardAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MATCH_DATA'; payload: { matchStatus: string; daysTogether: number; nextMilestone: string } }
  | { type: 'SET_DAILY_STEP'; payload: { todayStep: string; stepDescription: string; progress: number } }
  | { type: 'SET_CONVERSATION'; payload: { topic: string; description: string; lastInteraction: string } }
  | { type: 'SET_JOURNEY_PROGRESS'; payload: { progress: number; upcomingSteps: Array<UpcomingStep> } }
  | { type: 'SET_SAFETY'; payload: Array<SafetyPoint> }
  | { type: 'SET_PARTNER_TYPING'; payload: boolean }
  | { type: 'SET_JOURNEY_UPDATE_TIMESTAMP'; payload: number }
  | { type: 'SET_LAST_MESSAGE_PREVIEW'; payload: string }
  | { type: 'SET_MILESTONE_MESSAGE'; payload: string | null }
  | { type: 'SET_PROFILE'; payload: ProfileData }
  | { type: 'SET_REFLECTIONS'; payload: Array<ReflectionEntry> }
  | { type: 'SET_HEATMAP'; payload: Array<HeatmapEntry> }
  | { type: 'SET_WEEKLY_SUMMARY'; payload: WeeklySummary | null }
  | { type: 'SET_AI_INSIGHTS'; payload: AIInsights | null }
  | { type: 'UPDATE_PROGRESS'; payload: number }
  | { type: 'RESET_DASHBOARD' };

// ─── Reducer ────────────────────────────────────

export function dashboardReducer(
  state: DashboardState,
  action: DashboardAction
): DashboardState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_MATCH_DATA':
      return {
        ...state,
        matchStatus: action.payload.matchStatus,
        daysTogether: action.payload.daysTogether,
        nextMilestone: action.payload.nextMilestone,
      };

    case 'SET_DAILY_STEP':
      return {
        ...state,
        todayStep: action.payload.todayStep,
        stepDescription: action.payload.stepDescription,
        progress: action.payload.progress,
      };

    case 'SET_CONVERSATION':
      return {
        ...state,
        conversationTopic: action.payload.topic,
        conversationDescription: action.payload.description,
        lastInteraction: action.payload.lastInteraction,
      };

    case 'SET_JOURNEY_PROGRESS':
      return {
        ...state,
        progress: action.payload.progress,
        upcomingSteps: action.payload.upcomingSteps,
      };

    case 'SET_SAFETY':
      return { ...state, safetyPoints: action.payload };

    case 'SET_PARTNER_TYPING':
      return { ...state, partnerTyping: action.payload };

    case 'SET_JOURNEY_UPDATE_TIMESTAMP':
      return { ...state, journeyUpdatedAt: action.payload };

    case 'SET_LAST_MESSAGE_PREVIEW':
      return { ...state, lastMessagePreview: action.payload };

    case 'SET_MILESTONE_MESSAGE':
      return { ...state, milestoneMessage: action.payload };

    case 'SET_PROFILE':
      return { ...state, profile: action.payload };

    case 'SET_REFLECTIONS':
      return { ...state, reflections: action.payload };

    case 'SET_HEATMAP':
      return { ...state, heatmap: action.payload };

    case 'SET_WEEKLY_SUMMARY':
      return { ...state, weeklySummary: action.payload };

    case 'SET_AI_INSIGHTS':
      return { ...state, aiInsights: action.payload };

    case 'UPDATE_PROGRESS':
      return { ...state, memoryProgress: action.payload };

    case 'RESET_DASHBOARD':
      return defaultDashboardState;

    default:
      return state;
  }
}

// ─── Action Helpers ─────────────────────────────

export const dashboardActions = {
  setLoading: (loading: boolean): DashboardAction => ({
    type: 'SET_LOADING',
    payload: loading,
  }),

  setError: (error: string | null): DashboardAction => ({
    type: 'SET_ERROR',
    payload: error,
  }),

  setMatchData: (payload: { matchStatus: string; daysTogether: number; nextMilestone: string }): DashboardAction => ({
    type: 'SET_MATCH_DATA',
    payload,
  }),

  setDailyStep: (payload: { todayStep: string; stepDescription: string; progress: number }): DashboardAction => ({
    type: 'SET_DAILY_STEP',
    payload,
  }),

  setConversation: (payload: { topic: string; description: string; lastInteraction: string }): DashboardAction => ({
    type: 'SET_CONVERSATION',
    payload,
  }),

  setJourneyProgress: (payload: { progress: number; upcomingSteps: Array<UpcomingStep> }): DashboardAction => ({
    type: 'SET_JOURNEY_PROGRESS',
    payload,
  }),

  setSafety: (payload: Array<SafetyPoint>): DashboardAction => ({
    type: 'SET_SAFETY',
    payload,
  }),

  setPartnerTyping: (payload: boolean): DashboardAction => ({
    type: 'SET_PARTNER_TYPING',
    payload,
  }),

  setJourneyUpdateTimestamp: (payload: number): DashboardAction => ({
    type: 'SET_JOURNEY_UPDATE_TIMESTAMP',
    payload,
  }),

  setLastMessagePreview: (payload: string): DashboardAction => ({
    type: 'SET_LAST_MESSAGE_PREVIEW',
    payload,
  }),

  setMilestoneMessage: (payload: string | null): DashboardAction => ({
    type: 'SET_MILESTONE_MESSAGE',
    payload,
  }),

  setProfile: (payload: ProfileData): DashboardAction => ({
    type: 'SET_PROFILE',
    payload,
  }),

  setReflections: (payload: Array<ReflectionEntry>): DashboardAction => ({
    type: 'SET_REFLECTIONS',
    payload,
  }),

  setHeatmap: (payload: Array<HeatmapEntry>): DashboardAction => ({
    type: 'SET_HEATMAP',
    payload,
  }),

  setWeeklySummary: (payload: WeeklySummary | null): DashboardAction => ({
    type: 'SET_WEEKLY_SUMMARY',
    payload,
  }),

  setAIInsights: (payload: AIInsights | null): DashboardAction => ({
    type: 'SET_AI_INSIGHTS',
    payload,
  }),

  updateProgress: (payload: number): DashboardAction => ({
    type: 'UPDATE_PROGRESS',
    payload,
  }),

  resetDashboard: (): DashboardAction => ({
    type: 'RESET_DASHBOARD',
  }),
};

// Type alias for dispatch
export type Dispatch = (action: DashboardAction) => void;