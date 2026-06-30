/**
 * ToSom — ChatExperienceContext
 * 
 * Bind saman heile opplevelseslaget i ChatRoom:
 *   Presence → WarmFlow → Atmosphere → Animations → AI
 * 
 * Dataflow:
 *   1. Presence data → determineWarmFlowMood()
 *   2. WarmFlow mood → getAtmospherePreset()
 *   3. Atmosphere preset → setAmbientAnimations()
 *   4. WarmFlow mood → setAITone()
 * 
 * Dokumentasjon: docs/FRONTEND-FULL-INTEGRATION.md
 */

'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { determineMood, MoodType, MoodColors, MOOD_COLORS } from '@/lib/warmFlow/warmFlow';
import { getAtmosphereSystem, AtmospherePreset } from '@/lib/atmosphere/atmosphereEngine';
import { getPremiumChatConfig, ChatMood, getResonanceGlowStyle } from '@/lib/chatAnimations/chatAnimations';
import { determineChatMood } from '@/lib/chatAnimations/chatAnimations';
import { generateConversationSuggestion, generateReflectionPrompt, generateProfileEnhancement } from '@/lib/ai-features/aiFeatures';

// ─── TYPE DEFINISJONAR ─────────────────────────────

export interface ChatExperienceData {
  // Presence
  presence: PresenceState;
  setPresence: (p: Partial<PresenceState>) => void;
  
  // WarmFlow
  mood: MoodType;
  colors: MoodColors;
  glow: string;
  accent: string;
  
  // Atmosphere
  atmospherePreset: AtmospherePreset;
  atmosphereSystem: ReturnType<typeof getAtmosphereSystem> | null;
  
  // Animations
  bubbleAnimation: string;
  resonanceGlow: ReturnType<typeof getResonanceGlowStyle>;
  ambientLevel: number;
  
  // AI
  aiTone: string;
  aiHelpers: {
    suggestMessage: () => Promise<string>;
    getReflection: () => Promise<string>;
    improveProfile: () => Promise<string>;
  };
  
  // Samla
  resonanceScore: number;
  phase: string;
}

export interface PresenceState {
  isOnline: boolean;
  lastSeenAt: Date | null;
  activity: string;
  resonanceLevel: string;
  sharedPositionMessage: string;
}

// ─── CONTEXT ────────────────────────────────────────

export const ChatExperienceContext = createContext<ChatExperienceData>({
  presence: {
    isOnline: false,
    lastSeenAt: null,
    activity: 'idle',
    resonanceLevel: 'gentle',
    sharedPositionMessage: '',
  },
  setPresence: () => {},
  mood: 'calm',
  colors: MOOD_COLORS.calm,
  glow: MOOD_COLORS.calm.glow,
  accent: MOOD_COLORS.calm.accent,
  atmospherePreset: 'midnight-gold',
  atmosphereSystem: null,
  bubbleAnimation: 'warm-glow',
  resonanceGlow: { boxShadow: 'none', borderColor: 'rgba(212,175,55,0.25)', glowOpacity: 0 },
  ambientLevel: 0.5,
  aiTone: 'calm',
  aiHelpers: {
    suggestMessage: async () => '',
    getReflection: async () => '',
    improveProfile: async () => '',
  },
  resonanceScore: 0,
  phase: 'EARLY',
});

export const useChatExperience = () => useContext(ChatExperienceContext);

// ─── PROVIDER ──────────────────────────────────────

interface ChatExperienceProviderProps {
  children: ReactNode;
  initialPresence?: PresenceState;
  resonanceScore?: number;
  phase?: string;
}

export default function ChatExperienceProvider({
  children,
  initialPresence,
  resonanceScore = 50,
  phase = 'EARLY',
}: ChatExperienceProviderProps) {
  const [presence, setPresenceState] = useState<PresenceState>(
    initialPresence || {
      isOnline: false,
      lastSeenAt: null,
      activity: 'idle',
      resonanceLevel: 'gentle',
      sharedPositionMessage: '',
    }
  );
  
  const [mood, setMood] = useState<MoodType>('calm');
  const [colors, setColors] = useState(MOOD_COLORS.calm);
  const [atmospherePreset, setAtmospherePreset] = useState<AtmospherePreset>('midnight-gold');
  const [atmosphereSystem, setAtmosphereSystem] = useState<ReturnType<typeof getAtmosphereSystem> | null>(null);
  const [aiTone, setAiTone] = useState('calm');

  // 1. Presence → WarmFlow
  useEffect(() => {
    const newMood = determineMood(presence.activity, phase);
    setMood(newMood);
    setColors(MOOD_COLORS[newMood]);
  }, [presence.activity, phase]);

  // 2. WarmFlow → Atmosphere
  useEffect(() => {
    const preset = calculateAtmospherePreset(mood, phase, resonanceScore);
    setAtmospherePreset(preset);
    setAtmosphereSystem(getAtmosphereSystem(preset, phase, 15));
  }, [mood, phase, resonanceScore]);

  // 3. Atmosphere → Animations (ambient level)
  const ambientLevel = atmosphereSystem ? atmosphereSystem.ambientLevel : 0.5;

  // 4. WarmFlow → AI tone
  useEffect(() => {
    const tones: Record<MoodType, string> = {
      calm: 'balanced',
      warm: 'intim',
      deep: 'refleksjon',
      gentle: 'støttande',
      celebratory: 'entusiastisk',
    };
    setAiTone(tones[mood] || 'calm');
  }, [mood]);

  // Resonance glow
  const resonanceGlow = getResonanceGlowStyle(resonanceScore);

  // AI helpers
  const suggestMessage = useCallback(async () => {
    const suggestion = await generateConversationSuggestion({
      journeyPhase: phase,
      day: 1,
      lastTopic: '',
      resonanceLevel: resonanceScore,
      userCommunicationStyle: 'balanced',
    });
    return suggestion.suggestion;
  }, [phase, resonanceScore]);

  const getReflection = useCallback(async () => {
    const reflection = await generateReflectionPrompt(phase, 1, []);
    return reflection.question;
  }, [phase]);

  const improveProfile = useCallback(async () => {
    const enhancement = await generateProfileEnhancement({});
    return enhancement.bioSuggestions[0].text;
  }, []);

  const setPresence = useCallback((partial: Partial<PresenceState>) => {
    setPresenceState(prev => ({ ...prev, ...partial }));
  }, []);

  return (
    <ChatExperienceContext.Provider
      value={{
        presence,
        setPresence,
        mood,
        colors,
        glow: colors.glow,
        accent: colors.accent,
        atmospherePreset,
        atmosphereSystem,
        bubbleAnimation: 'warm-glow',
        resonanceGlow,
        ambientLevel,
        aiTone,
        aiHelpers: {
          suggestMessage,
          getReflection,
          improveProfile,
        },
        resonanceScore,
        phase,
      }}
    >
      {children}
    </ChatExperienceContext.Provider>
  );
}

// ─── HELPERS ────────────────────────────────────────

function calculateAtmospherePreset(
  mood: MoodType,
  phase: string,
  resonanceLevel: number
): AtmospherePreset {
  if (mood === 'celebratory') return 'golden-hour';
  if (mood === 'deep' || phase === 'DEEPER') return resonanceLevel >= 70 ? 'deep-ocean' : 'twilight-purple';
  if (mood === 'warm') return resonanceLevel >= 75 ? 'golden-hour' : 'dawn-blue';
  if (mood === 'gentle') return resonanceLevel >= 60 ? 'spring-bloom' : 'forest-green';
  return 'midnight-gold';
}