/**
 * ToSom — Feature Flags / Kill Switches (F5)
 *
 * Bryterne leses fra miljøvariabler og krever INGEN deploy for å endres
 * — kun en env-oppdatering i Vercel-dashboardet.
 */

export const features = {
  /**
   * MATCHING_ENABLED — Stanser matcherunden uten å ta ned produktet.
   * Køen består. Brukere allerede i kjø står som QUEUED.
   */
  enableMatching: process.env.MATCHING_ENABLED === 'false' ? false : true,

  /**
   * REGISTRATION_ENABLED — Luker registreringen ved kapasitetsproblemer.
   */
  enableRegistration: process.env.REGISTRATION_ENABLED === 'false' ? false : true,

  /**
   * Om betaling er aktivert (PAYMENTS_ENABLED).
   * Når false: brukere får direkte tilgang uten betaling (gratiskvote).
   * Når true: sendes til /betaling før matching.
   */
  enablePayments: process.env.PAYMENTS_ENABLED === 'true' ? true : false,

  /**
   * MAINTENANCE_MODE — Viser app/maintenance flaten.
   */
  maintenanceMode: process.env.MAINTENANCE_MODE === 'true' ? true : false,

  /**
   * Om reise-funksjonalitet er aktivert.
   */
  enableJourney: true,

  /**
   * Om chat er aktivert.
   */
  enableChat: true,
};

/** Sjekk om betaling er aktivert */
export const isPaymentsEnabled = (): boolean => features.enablePayments;

/** Sjekk om matching er aktivert (kill switch for runden) */
export const isMatchingEnabled = (): boolean => features.enableMatching;

/** Sjekk om registrering er aktivert */
export const isRegistrationEnabled = (): boolean => features.enableRegistration;

/** Sjekk om vedlikeholdsmodus er på */
export const isMaintenanceMode = (): boolean => features.maintenanceMode;
