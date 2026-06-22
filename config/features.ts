/**
 * ToSom — Feature Flags
 * 
 * Denne fila styrer hvilke funksjonar som er på/av.
 */

export const features = {
  /**
   * Om betaling er aktivert.
   * Når false: brukarar får direkte tilgang utan betaling.
   * Når true: brukarar blir sende til /betaling før matching.
   */
  enablePayments: false,

  /**
   * Om match-funksjonalitet er aktivert.
   */
  enableMatching: true,

  /**
   * Om reise-funksjonalitet er aktivert.
   */
  enableJourney: true,

  /**
   * Om chat er aktivert.
   */
  enableChat: true,
};

/**
 * Sjekk om betaling er aktivert.
 */
export const isPaymentsEnabled = (): boolean => features.enablePayments;