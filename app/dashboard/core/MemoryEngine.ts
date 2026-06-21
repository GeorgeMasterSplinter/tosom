/**
 * ToSom Dashboard 1.0 — Memory Engine
 * Sentral lagring og henting av all Dashboard-data via localStorage.
 */

// --- TYPEDEFINISJONER ---

export type ReflectionEntry = {
  day: number;
  question: string;
  yourAnswer: string;
  partnerAnswer: string;
  timestamp: string;
};

export type HeatmapEntry = {
  day: number;
  tone: string;
  intensity: number; // 1–5
};

export type WeeklySummary = {
  week: string;
  progress: number;
  reflectionsCompleted: number;
  milestonesReached: number;
  highlight: string;
  upcoming: string[];
};

export type AIInsights = {
  emotionalTone: string;
  connectionLevel: string;
  conversationDepth: string;
  summary: string;
  recommendations: string[];
};

export type MemoryState = {
  progress: number;
  reflections: ReflectionEntry[];
  heatmap: HeatmapEntry[];
  weeklySummary: WeeklySummary | null;
  aiInsights: AIInsights | null;
  questionHistory: string[];
  lastUpdated: string;
};

// --- DEFAULT STATE ---

const defaultState: MemoryState = {
  progress: 0,
  reflections: [],
  heatmap: [],
  weeklySummary: null,
  aiInsights: null,
  questionHistory: [],
  lastUpdated: new Date().toISOString(),
};

// --- MEMORY ENGINE KLASSE ---

export class MemoryEngine {
  private static KEY = 'tosom-memory';
  private state: MemoryState;

  constructor() {
    this.state = this.load();
  }

  private load(): MemoryState {
    if (typeof window === 'undefined') return defaultState;
    const raw = localStorage.getItem(MemoryEngine.KEY);
    return raw ? JSON.parse(raw) : defaultState;
  }

  private save() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(MemoryEngine.KEY, JSON.stringify(this.state));
  }

  // GETTERS
  getState() {
    return this.state;
  }

  // SETTERS
  updateProgress(value: number) {
    this.state.progress = value;
    this.state.lastUpdated = new Date().toISOString();
    this.save();
  }

  addReflection(entry: ReflectionEntry) {
    this.state.reflections.push(entry);
    this.state.lastUpdated = new Date().toISOString();
    this.save();
  }

  updateHeatmap(entries: HeatmapEntry[]) {
    this.state.heatmap = entries;
    this.state.lastUpdated = new Date().toISOString();
    this.save();
  }

  setWeeklySummary(summary: WeeklySummary) {
    this.state.weeklySummary = summary;
    this.state.lastUpdated = new Date().toISOString();
    this.save();
  }

  setAIInsights(insights: AIInsights) {
    this.state.aiInsights = insights;
    this.state.lastUpdated = new Date().toISOString();
    this.save();
  }

  // ─── SPØRSMÅLS-HISTORIKK OG ANTI-DUPLIKAT ──────────

  addQuestionToHistory(q: string) {
    if (!this.state.questionHistory) {
      this.state.questionHistory = [];
    }
    // Anti-duplikat: sjekk om spørsmålet allerede finnes
    if (!this.state.questionHistory.includes(q)) {
      this.state.questionHistory.unshift(q);
      this.state.questionHistory = this.state.questionHistory.slice(0, 10);
      this.state.lastUpdated = new Date().toISOString();
      this.save();
    }
  }

  getQuestionHistory(): string[] {
    return this.state.questionHistory || [];
  }

  clearQuestionHistory() {
    this.state.questionHistory = [];
    this.state.lastUpdated = new Date().toISOString();
    this.save();
  }

  // ─── AI-DRIVET TONE-ANALYSE ──────────────────────

  private analyzeTone(text: string): { tone: string; intensity: number } {
    const lower = text.toLowerCase();

    if (lower.includes("takk") || lower.includes("setter pris")) {
      return { tone: "varm", intensity: 4 };
    }

    if (lower.includes("elsker") || lower.includes("savner")) {
      return { tone: "dyp", intensity: 5 };
    }

    if (lower.includes("ok") || lower.includes("greit")) {
      return { tone: "nøytral", intensity: 3 };
    }

    return { tone: "rolig", intensity: 2 };
  }

  // ─── AUTO-OPPDATERING AV HEATMAP FRA MELDING ───

  autoUpdateHeatmapFromMessage(message: string) {
    const { tone, intensity } = this.analyzeTone(message);

    const today = new Date().getDay() || 7; // 1–7 (søndag = 0 → 7)

    const updated = [...this.state.heatmap];
    const index = updated.findIndex((d) => d.day === today);

    if (index >= 0) {
      updated[index] = { day: today, tone, intensity };
    } else {
      updated.push({ day: today, tone, intensity });
    }

    this.state.heatmap = updated;
    this.state.lastUpdated = new Date().toISOString();
    this.save();

    return { tone, intensity };
  }

  // ─── AUTO-OPPDATERING AV AI-INSIGHTS ─────────────

  autoUpdateAIInsights(message: string) {
    const { tone, intensity } = this.analyzeTone(message);

    const insights: AIInsights = {
      emotionalTone: tone,
      connectionLevel: intensity >= 4 ? "Styrkende" : "Stabil",
      conversationDepth: intensity >= 5 ? "Dyp" : "Normal",
      summary: "AI har analysert deres siste samtale og oppdatert innsikt.",
      recommendations: [
        "Still et spørsmål som inviterer til sårbarhet.",
        "Del en liten personlig historie.",
        "Utforsk et nytt tema sammen."
      ]
    };

    this.state.aiInsights = insights;
    this.state.lastUpdated = new Date().toISOString();
    this.save();

    return insights;
  }
}

// --- EKSPORTER SINGLETON ---

export const memoryEngine = new MemoryEngine();