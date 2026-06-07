/** navigationState.ts — rute-, modal- og params-håndtering
 *  NS1/2/3/4/8/9/10/15/16/19
 *  Ingen backend, berre UI + state */

/* ── NS2: NavigationRoute ── */
export type NavigationRoute =
  | "onboarding"
  | "dashboard"
  | "chat"
  | "partner_profile"
  | "user_profile"
  | "match_result";

/* ── NS3: NavigationState ── */
export interface NavigationState {
  currentRoute: NavigationRoute;
  modalStack: ModalEntry[];
  params: Record<string, any>;
}

/* ── NS16: ModalStack-typer ── */
export type ModalType = "partner_profile" | "user_profile" | "info" | "confirm";

export interface ModalEntry {
  type: ModalType;
  props?: Record<string, any>;
}

/* ── NS5: Hjelp — standard modalProps for ulike typar ── */
function modalDefaultProps(type: ModalType): Record<string, any> {
  switch (type) {
    case "partner_profile":
      return { title: "Partnerprofil", onClose: undefined };
    case "user_profile":
      return { title: "Min profil", onClose: undefined };
    case "info":
      return { title: "Info", message: "Ingen informasjon." };
    case "confirm":
      return { title: "Bekreft handling", message: "Er du sikker?", onConfirm: undefined };
    default:
      return {};
  }
}

/* ── NS4: navigationAPI ── */

/** Gå til ein rute */
export function goTo(
  state: NavigationState,
  route: NavigationRoute,
  params?: Record<string, any>
): NavigationState {
  return {
    ...state,
    currentRoute: route,
    params: params ? { ...state.params, ...params } : state.params,
  };
}

/** Open modal */
export function openModal(
  state: NavigationState,
  type: ModalType,
  props?: Record<string, any>
): NavigationState {
  const entry: ModalEntry = {
    type,
    props: { ...modalDefaultProps(type), ...props },
  };
  return {
    ...state,
    modalStack: [...state.modalStack, entry],
  };
}

/** Close top modal */
export function closeModal(state: NavigationState): NavigationState {
  return {
    ...state,
    modalStack: state.modalStack.slice(0, -1),
  };
}

/** Clear all modals */
export function resetModals(state: NavigationState): NavigationState {
  return { ...state, modalStack: [] };
}

/** Get the top modal */
export function getTopModal(state: NavigationState): ModalEntry | undefined {
  return state.modalStack[state.modalStack.length - 1];
}

/* ── NS22: Dummy initialState ── */
export function initialNavigationState(): NavigationState {
  return {
    currentRoute: "onboarding",
    modalStack: [],
    params: {},
  };
}

/* ── NS18: Navigasjonsbeskyttelse ── */
export const ONBOARDING_COMPLETED_KEY = "tosom_onboarding_completed";

export function shouldForceOnboarding(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(ONBOARDING_COMPLETED_KEY) !== "true";
}

/* ── NS10: Ingen backend ── */
// Denne fila inneheld berre UI-tilstand. Ingen API-kall eller DB-operasjonar.
