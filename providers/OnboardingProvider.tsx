/**
 * ToSom OnboardingProvider — Global context for onboarding flow.
 * 
 * State machine: steps 1-5 with validation, persistence, navigation.
 */

'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
export interface OnboardingData {
  // STEP 1 – Personalia
  name: string;
  age: string;
  gender: string;
  email: string;
  location: string;

  // STEP 2 – Preferanser
  lookingFor: string;
  relationshipType: string;
  educationLevel: string;
  careerFocus: string;
  ambitionLevel: string;
  eliteSinglesType: string;
  lifestyle: string;
  interests: string;

  // STEP 3 – Relasjonspreferanser
  communicationStyle: string;
  loveLanguage: string;
  conflictStyle: string;
  boundaries: string;

  // STEP 4 – Personlighet
  personalityType: string;
  traits: string[];
  strengths: string;
  weaknesses: string;
}

const INITIAL_DATA: OnboardingData = {
  name: '', age: '', gender: '', email: '', location: '',
  lookingFor: '', relationshipType: '', educationLevel: '',
  careerFocus: '', ambitionLevel: '', eliteSinglesType: '',
  lifestyle: '', interests: '',
  communicationStyle: '', loveLanguage: '', conflictStyle: '', boundaries: '',
  personalityType: '', traits: [], strengths: '', weaknesses: '',
};

type Action =
  | { type: 'UPDATE_FIELD'; field: keyof OnboardingData; value: string | string[] }
  | { type: 'SET_STEP'; step: number }
  | { type: 'RESET' }
  | { type: 'LOAD_DATA'; payload: Partial<OnboardingData> };

/* ═══════════════════════════════════════════
   REDUCER
   ═══════════════════════════════════════════ */
function reducer(state: OnboardingData & { step: number }, action: Action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      if (Array.isArray(action.value)) {
        if (action.field === 'traits') {
          return { ...state, step: state.step, [action.field]: action.value as string[] };
        }
      }
      return { ...state, [action.field]: action.value };
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'RESET':
      return { ...INITIAL_DATA, step: 1 };
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

/* ═══════════════════════════════════════════
   CONTEXT
   ═══════════════════════════════════════════ */
interface OnboardingContextValue {
  data: OnboardingData;
  step: number;
  totalSteps: number;
  updateField: (field: keyof OnboardingData, value: string | string[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  goToStep: (step: number) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

/* ═══════════════════════════════════════════
   PROVIDER
   ═══════════════════════════════════════════ */
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { ...INITIAL_DATA, step: 1 });
  const totalSteps = 5;

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tosom_onboarding', JSON.stringify({
        data: {
          name: state.name, age: state.age, gender: state.gender,
          email: state.email, location: state.location,
          lookingFor: state.lookingFor, relationshipType: state.relationshipType,
          educationLevel: state.educationLevel, careerFocus: state.careerFocus,
          ambitionLevel: state.ambitionLevel, eliteSinglesType: state.eliteSinglesType,
          lifestyle: state.lifestyle, interests: state.interests,
          communicationStyle: state.communicationStyle, loveLanguage: state.loveLanguage,
          conflictStyle: state.conflictStyle, boundaries: state.boundaries,
          personalityType: state.personalityType, traits: state.traits,
          strengths: state.strengths, weaknesses: state.weaknesses,
        },
        step: state.step,
      }));
    } catch { /* ignore */ }
  }, [state]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tosom_onboarding');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data) dispatch({ type: 'LOAD_DATA', payload: parsed.data });
        if (parsed.step) dispatch({ type: 'SET_STEP', step: parsed.step });
      }
    } catch { /* ignore */ }
  }, []);

  const updateField = (field: keyof OnboardingData, value: string | string[]) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const nextStep = () => {
    if (state.step < totalSteps) dispatch({ type: 'SET_STEP', step: state.step + 1 });
  };

  const prevStep = () => {
    if (state.step > 1) dispatch({ type: 'SET_STEP', step: state.step - 1 });
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) dispatch({ type: 'SET_STEP', step });
  };

  const reset = () => dispatch({ type: 'RESET' });

  return (
    <OnboardingContext.Provider value={{
      data: state,
      step: state.step,
      totalSteps,
      updateField,
      nextStep,
      prevStep,
      goToStep,
      reset,
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export { OnboardingContext };
export default OnboardingProvider;