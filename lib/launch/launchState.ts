/** launchState.ts — steg- og tilstandshandsaming for LaunchFlow
 *  LF1/2/3/4/12
 *  Ingen backend, bare UI-tilstand */

/* ── LF2: LaunchStep ── */
export type LaunchStep =
  | "splash"
  | "loading"
  | "match_search"
  | "journey_update"
  | "done";

/* ── LF3: LaunchState ── */
export interface LaunchState {
  currentStep: LaunchStep;
  message?: string;
  progress: number;
}

/* ── LF12: Dummy initialState ── */
export function initialLaunchState(): LaunchState {
  return {
    currentStep: "splash",
    message: "",
    progress: 0,
  };
}

/* ── LF4: launchAPI ── */

/** Gå til neste steg */
const stepOrder: LaunchStep[] = [
  "splash",
  "loading",
  "match_search",
  "journey_update",
  "done",
];

export function nextStep(state: LaunchState): LaunchState {
  const idx = stepOrder.indexOf(state.currentStep);
  const next = stepOrder[idx + 1];
  if (!next) return { ...state, currentStep: "done", progress: 100 };
  return { ...state, currentStep: next };
}

/** Sette melding */
export function setMessage(state: LaunchState, msg: string): LaunchState {
  return { ...state, message: msg };
}

/** Sette progress (0–100) */
export function setProgress(state: LaunchState, value: number): LaunchState {
  const clamped = Math.max(0, Math.min(100, value));
  return { ...state, progress: clamped };
}

/* ── LF10: Ingen backend ── */
// Denne fila inneholder bare UI-tilstand. Ingen API-kall eller DB-operasjonar.
