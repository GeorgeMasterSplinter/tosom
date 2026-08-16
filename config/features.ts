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
   *
   * A15 (v7): Ingen betalingsvei finnes i dag. Vipps er eneste planlagte,
   * og nøkkelen er ikke på plass. Å sette PAYMENTS_ENABLED=true før veien
   * er bygget ville lede brukeren inn i en blindvei. Feiler ved oppstart.
   */
  enablePayments: ((): boolean => {
    if (process.env.PAYMENTS_ENABLED === 'true') {
      throw new Error(
        '[FATAL] PAYMENTS_ENABLED=true, men ingen betalingsvei er implementert. ' +
        'Vipps er eneste planlagte vei og er ikke koblet opp enda. ' +
        'Se deploy/payments.md. Sett PAYMENTS_ENABLED=false til Vipps er på plass.'
      );
    }
    return false;
  })(),

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
