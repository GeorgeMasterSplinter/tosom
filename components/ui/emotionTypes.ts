/**
 * Tosom 5.0 — Emotional Intelligence Layer
 *
 * Core types and constants for emotional analysis.
 */

/* ── Tone Dimensions ── */
export interface ToneSignal {
  warmth: number;       // 0–100
  clarity: number;      // 0–100
  empathy: number;      // 0–100
  tension: number;      // 0–100
  vulnerability: number;// 0–100
}

/* ── Mood Types ── */
export type Mood =
  | 'calm'
  | 'excited'
  | 'curious'
  | 'romantic'
  | 'stressed'
  | 'unsure'
  | 'distant'
  | 'warm'
  | 'playful'
  | 'reflective'
  | 'hopeful'
  | 'connected';

export interface MoodSignal {
  mood: Mood;
  confidence: number; // 0–100
  timestamp: number;
}

/* ── Mood Palettes ── */
export const moodPalettes: Record<Mood, {
  color: string;
  gradient: string;
  emoji: string;
  label: string;
  desc: string;
}> = {
  calm:     { color: '#60A5FA', gradient: 'from-[#60A5FA]/20 to-transparent', emoji: '🌊', label: 'Rolig', desc: 'Du føler deg rolig og jordet' },
  excited:  { color: '#FBBF24', gradient: 'from-[#FBBF24]/20 to-transparent', emoji: '✨', label: 'Spennende', desc: 'Du er opphisset og energisk' },
  curious:  { color: '#A78BFA', gradient: 'from-[#A78BFA]/20 to-transparent', emoji: '🔍', label: 'Nyskjerring', desc: 'Du er nyskjerring og åpen' },
  romantic: { color: '#F472B6', gradient: 'from-[#F472B6]/20 to-transparent', emoji: '💛', label: 'Romantisk', desc: 'Du føler romantisk varme' },
  stressed: { color: '#FF6B6B', gradient: 'from-[#FF6B6B]/20 to-transparent', emoji: '🌪️', label: 'Stresset', desc: 'Du føler press og uro' },
  unsure:   { color: '#94A3B8', gradient: 'from-[#94A3B8]/20 to-transparent', emoji: '🌫️', label: 'Usikker', desc: 'Du er usikker på neste steg' },
  distant:  { color: '#64748B', gradient: 'from-[#64748B]/20 to-transparent', emoji: '🌙', label: 'Distant', desc: 'Du føler deg litt borte' },
  warm:     { color: '#D4AF37', gradient: 'from-[#D4AF37]/20 to-transparent', emoji: '☀️', label: 'Varm', desc: 'Du føler deg varm og trygg' },
  playful:  { color: '#34D399', gradient: 'from-[#34D399]/20 to-transparent', emoji: '🦋', label: 'Legende', desc: 'Du er lege og lekfull' },
  reflective:{ color: '#818CF8', gradient: 'from-[#818CF8]/20 to-transparent', emoji: '🌅', label: 'Reflekterende', desc: 'Du reflekterer over noe dypt' },
  hopeful:  { color: '#FBBF24', gradient: 'from-[#FBBF24]/20 to-transparent', emoji: '🌱', label: 'Håpefull', desc: 'Du ser fremover med håp' },
  connected:{ color: '#F472B6', gradient: 'from-[#F472B6]/20 to-transparent', emoji: '♡', label: 'Forbundet', desc: 'Du føler dyp forbindelse' },
};

/* ── Relationship Dimensions ── */
export type HealthDimension =
  | 'communication'
  | 'emotionalSafety'
  | 'curiosity'
  | 'sharedGoals'
  | 'connection';

export interface HealthSignal {
  dimension: HealthDimension;
  score: number;   // 0–100
  trend: 'up' | 'down' | 'stable';
  lastUpdated: number;
}

/* ── Emotional Suggestion Types ── */
export type SuggestionType = 'message' | 'question' | 'reassurance';

export interface EmotionalSuggestion {
  type: SuggestionType;
  text: string;
  reason: string;
  warmth: number;
}

/* ── De-escalation Step ── */
export type DeescalationStep =
  | 'identifyTension'
  | 'validateFeelings'
  | 'proposeSoftening';

export interface DeescalationStepDef {
  title: string;
  description: string;
  icon: string;
  prompt: string;
}

/* ── Memory Summary Types ── */
export interface MemoryHighlight {
  id: string;
  type: 'connection' | 'growth' | 'joy' | 'insight';
  summary: string;
  mood: Mood;
  date: number;
}

/* ── Couple Insight Sections ── */
export interface CoupleInsight {
  section: 'communicationPatterns' | 'emotionalTrends' | 'sharedValues' | 'opportunities';
  title: string;
  items: InsightItem[];
}

export interface InsightItem {
  text: string;
  type: 'pattern' | 'trend' | 'value' | 'opportunity';
  strength: 'strong' | 'neutral' | 'needsAttention';
}

/* ── Emotional Exercise Types ── */export type ExerciseType =
  | 'gratitude'
  | 'curiosity'
  | 'vulnerability'
  | 'appreciation'
  | 'futureVision'
  | 'deepQuestion'
  | 'silentMoment'
  | 'sharedMemory'
  | 'dreamBuilding'
  | 'loveLanguages';

export interface ExerciseDef {
  type: ExerciseType;
  title: string;
  description: string;
  prompt: string;
  duration: number; // seconds
  icon: string;
}

/* ── Journal Prompt ── */
export interface JournalPrompt {
  text: string;
  mood: Mood;
  moodLabel: string;
}

/* ── Exercise Definitions ── */
export const exerciseDefs: ExerciseDef[] = [
  {
    type: 'gratitude',
    title: 'Takkknar',
    description: 'Del noe dere er takknemlige for sammen',
    prompt: 'Hva er ett øyeblikk dere delte denne uken som du er takknemlig for?',
    duration: 120,
    icon: '🙏',
  },
  {
    type: 'curiosity',
    title: 'Nyskjerring',
    description: 'Stil et dypere spørsmål om partnens indre verden',
    prompt: 'Hva er noe om deg selv du ønsker at partneren din forstår bedre?',
    duration: 180,
    icon: '🔍',
  },
  {
    type: 'vulnerability',
    title: 'Sårbarhet',
    description: 'Del noe sårbart og ærlig',
    prompt: 'Hva er noe du frykter å dele med partneren din?',
    duration: 180,
    icon: '💛',
  },
  {
    type: 'appreciation',
    title: 'Versetting',
    description: 'Uttrykk dyp versetting for partneren',
    prompt: 'Hva ved partneren din beundrer du mest — og hvorfor?',
    duration: 120,
    icon: '⭐',
  },
  {
    type: 'futureVision',
    title: 'Fremtidssyn',
    description: 'Bygg en felles fremtidsvisjon sammen',
    prompt: 'Hvordan ser dere drømme-dag ut ett år fra nå? Beskriv sammen.',
    duration: 240,
    icon: '🗺️',
  },
  {
    type: 'deepQuestion',
    title: 'Døyt spørsmål',
    description: 'Dype spørsmål som utforsker kjernen',
    prompt: 'Hva betyr mest for deg i et forhold — og hvor kommer det fra?',
    duration: 180,
    icon: '♡',
  },
  {
    type: 'silentMoment',
    title: 'Stiil stund',
    description: 'Del et stille øyeblikk sammen',
    prompt: 'Puster sammen. Føl partnerens nærvær. Hva merker du?',
    duration: 60,
    icon: '🍃',
  },
  {
    type: 'sharedMemory',
    title: 'Delil minne',
    description: 'Utforsk et felles minne på nytt',
    prompt: 'Velg et minne som føles spesielt. Hva ser du? Hva føler du nå?',
    duration: 180,
    icon: '📸',
  },
  {
    type: 'dreamBuilding',
    title: 'Drømmebyggin',
    description: 'Bygg en drøm sammen',
    prompt: 'Hva er en drøm dere har sammen? Beskriv den med ord, bilder og følelser.',
    duration: 240,
    icon: '🌟',
  },
  {
    type: 'loveLanguages',
    title: 'Kjærlighets språk',
    description: 'Utforsk hvordan dere uttrykker kjærlighet',
    prompt: 'Hvordan føler du deg mest elska av partneren din? Hvilket språk taler dere?',
    duration: 180,
    icon: '💌',
  },
];

/* ── Deescalation Step Definitions ── */
export const deescalationSteps: DeescalationStepDef[] = [
  {
    title: 'Identifiser spenning',
    description: 'Merk av hva som skaper uro. Uten å dømme.',
    icon: '🔍',
    prompt: 'Hva føles som kjernen i uroen? Er det trygghet, forståelse, eller noe annet?',
  },
  {
    title: 'Valider følelser',
    description: 'Annen parts følelser er ekte — selv om du ikke er enig.',
    icon: '💛',
    prompt: 'Noe du kan si som viser at du forstår og tar deres følelser på alvor?',
  },
  {
    title: 'Foreslå bløtgjøring',
    description: 'Et blødt svar som reduserer tensjonen.',
    icon: '🌉',
    prompt: 'Hva kan du si som inviterer til nærmere, ikke fjernere?',
  },
];

/* ── AI Journal Prompts by Mood ── */
export const journalPromptsByMood: Record<Mood, string> = {
  calm: 'I en rolig stund — hva leverde deg fred denne uken?',
  excited: 'Denne spenningen er livskraftig. Hva driver deg fremover?',
  curious: 'Nysgjerrighet er døråpner. Hva lurte du på denne uken?',
  romantic: 'Hva minne fra denne uken føles mest romantisk?',
  stressed: 'Når stresset kommer — hva trenger du mest akkurat nå?',
  unsure: 'Utsikkerhet er en dør. Hva forsøker du å se gjennom den?',
  distant: 'Når vi føler oss borte — hva kan bringe oss tilbake?',
  warm: 'Denne varmen er verdifull. Del et øyeblikk av varme fra uken.',
  playful: 'Hva var det morsomme eller lette du opplevde denne uken?',
  reflective: 'Hva lærte du om deg selv denne uken?',
  hopeful: 'Hva gir deg håp for dere to?',
  connected: 'Når du føler deg mest forbundet — hva skapte det?',
};

/* ── AI Emotional Analysis Result ── */
export interface EmotionalAnalysis {
  tone: ToneSignal;
  mood: MoodSignal;
  health: HealthSignal[];
  suggestions: EmotionalSuggestion[];
  highlights: MemoryHighlight[];
  insights: CoupleInsight;
}