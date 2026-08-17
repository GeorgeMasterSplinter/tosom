/**
 * Tosom Dashboard 2.0 — Event Stream
 * Event handlers og connect-funksjon for realtime oppdateringer.
 * Mock-eventer simulerer SSE/WebStream later erstattet med ekte implementasjon.
 */

import type { DashboardAction, DashboardState } from './dashboardReducer';
import { dashboardActions } from './dashboardReducer';

// ─── Action type for dispatch ─────────

export type DashboardDispatch = (action: DashboardAction) => void;

// ─── Event handler interfaces ────────

export type AddNotification = (message: string, type: 'info' | 'success' | 'warning') => void;

export interface NewMessagePayload {
  topic: string;
  description: string;
  lastInteraction: string;
  preview: string;
}

export interface PartnerTypingPayload {
  isTyping: boolean;
}

export interface StepCompletedPayload {
  todayStep: string;
  stepDescription: string;
  progress: number;
}

export interface NewMilestonePayload {
  nextMilestone: string;
}

export interface JourneyProgressUpdatePayload {
  progress: number;
  upcomingSteps: Array<{ label: string }>;
}

// ─── Event handlers ──────────────────

export function handleNewMessage(dispatch: DashboardDispatch, payload: NewMessagePayload, addNotification?: AddNotification): void {
  dispatch(dashboardActions.setConversation({
    topic: payload.topic,
    description: payload.description,
    lastInteraction: payload.lastInteraction,
  }));
  dispatch(dashboardActions.setLastMessagePreview(payload.preview));
  if (addNotification) {
    addNotification('Ny melding fra partneren din', 'info');
  }
}

export function handlePartnerTyping(dispatch: DashboardDispatch, payload: PartnerTypingPayload, addNotification?: AddNotification): void {
  dispatch(dashboardActions.setPartnerTyping(payload.isTyping));
  if (addNotification && payload.isTyping) {
    addNotification('Partneren din skriver …', 'info');
  }
}

export function handleStepCompleted(dispatch: DashboardDispatch, payload: StepCompletedPayload): void {
  dispatch(dashboardActions.setDailyStep({
    todayStep: payload.todayStep,
    stepDescription: payload.stepDescription,
    progress: payload.progress,
  }));
}

export function handleNewMilestone(dispatch: DashboardDispatch, payload: NewMilestonePayload, addNotification?: AddNotification): void {
  dispatch(dashboardActions.setMilestoneMessage(payload.nextMilestone));
  if (addNotification) {
    addNotification(payload.nextMilestone, 'success');
  }
  // Fjern melding etter 4 sekunder
  setTimeout(() => {
    dispatch(dashboardActions.setMilestoneMessage(null));
  }, 4000);
}

export function handleJourneyProgressUpdate(dispatch: DashboardDispatch, payload: JourneyProgressUpdatePayload, addNotification?: AddNotification): void {
  dispatch(dashboardActions.setJourneyProgress({
    progress: payload.progress,
    upcomingSteps: payload.upcomingSteps,
  }));
  dispatch(dashboardActions.setJourneyUpdateTimestamp(Date.now()));
  if (addNotification) {
    addNotification('Fremdriften er oppdatert', 'success');
  }
}

// ─── Mock event data ──────────────────

const mockTopics = [
  'Dine dypeste verdier',
  'Hva motivere deg daglig',
  'Din drøm om en trygg relasjon',
  'Måter å vise kjærlighet på',
  'Fremtidsbilder og felles mål',
];

const mockDescriptions = [
  'Del en verdier som har formet hvem du er.',
  'Hva får deg til å stå opp om morgenen?',
  'Beskriv den perfekte hverdagen sammen.',
  'Hvordan viser du at du bryr deg?',
  'Hva ønsker dere å bygge sammen?',
];

const mockPreviews = [
  'Jeg tror verdsetter ærlighet mest av alt.',
  'Det som motivere meg er å vokse som menneske.',
  'Jeg drømmer om en relasjon med dyp trygghet.',
  'Jeg viser kjærlighet gjennom oppmerksomhet.',
  'Jeg vil bygge noe varaktig med noen jeg stoler pa.',
];

const mockUpcomingSteps = [
  [{ label: 'Dag 6 – Refleksjon sammen' }, { label: 'Dag 7 – Verdier i praksis' }, { label: 'Dag 8 – Fremtidsbilder' }],
  [{ label: 'Dag 9 – Sårbarhet i praksis' }, { label: 'Dag 10 – Dybdekonflikt' }, { label: 'Dag 11 – Felles rutiner' }],
  [{ label: 'Dag 12 – Intimitet og grenser' }, { label: 'Dag 13 – Trygghetssymbol' }, { label: 'Dag 14 – Første refleksjon' }],
];

// ─── Connect event stream ────────────

export function connectEventStream(dispatch: DashboardDispatch, addNotification?: AddNotification): () => void {
  // Simuler ny melding hvert 5. sekund
  const messageInterval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * mockTopics.length);
    handleNewMessage(dispatch, {
      topic: mockTopics[randomIndex],
      description: mockDescriptions[randomIndex],
      lastInteraction: 'Akkurat nå',
      preview: `Partneren din: ${mockPreviews[randomIndex]}`,
    }, addNotification);
  }, 5000);

  // Simuler partner typing hvert 7. sekund
  const typingInterval = setInterval(() => {
    handlePartnerTyping(dispatch, { isTyping: true }, addNotification);
    setTimeout(() => {
      handlePartnerTyping(dispatch, { isTyping: false }, addNotification);
    }, 2000);
  }, 7000);

  // Simuler journey progress update hvert 10. sekund
  const progressInterval = setInterval(() => {
    const randomProgress = Math.floor(Math.random() * 30) + 1;
    const randomStepsIndex = Math.floor(Math.random() * mockUpcomingSteps.length);
    handleJourneyProgressUpdate(dispatch, {
      progress: randomProgress,
      upcomingSteps: mockUpcomingSteps[randomStepsIndex],
    }, addNotification);
  }, 10000);

  // Simuler ny milepæl hvert 20. sekund
  const milestoneInterval = setInterval(() => {
    const milestones = [
      'Dere har nådd en ny milepæl!',
      'Stolt av dere — dere kommer videre!',
      'Dypere forbindelse hver dag.',
      'Dere bygger noe varaktig.',
      'En milepæl i reisen deres.',
    ];
    const randomIndex = Math.floor(Math.random() * milestones.length);
    handleNewMilestone(dispatch, { nextMilestone: milestones[randomIndex] }, addNotification);
  }, 20000);

  // Cleanup funksjon
  return () => {
    clearInterval(messageInterval);
    clearInterval(typingInterval);
    clearInterval(progressInterval);
    clearInterval(milestoneInterval);
  };
}
