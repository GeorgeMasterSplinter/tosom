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
   * VIPPS_ENABLED — Vipps-innlogging.
   * Default: SKJULT (B-2/S-2). Callback kaller en fjernet CredentialsProvider,
   * så Vipps er død kode inntil fullverdig OAuth er implementert.
   * Sett NEXT_PUBLIC_VIPPS_ENABLED=true når Vipps er på plass.
   */
  enableVipps: process.env.NEXT_PUBLIC_VIPPS_ENABLED === 'true',

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
   * BETA_INVITE_MODE — Lukket beta: kun inviterte e-poster får magic link sendt.
   * Default: PÅ (beta). Sett BETA_INVITE_MODE=false når betaan er open.
   * (Invitasjonsport — BETA-ACCESS §3.)
   */
  betaInviteMode: ((): boolean => {
    if (process.env.BETA_INVITE_MODE === 'false') return false;
    // Default på i produksjon (lukket beta), av i dev/test (så dev kan logge inn fritt)
    return process.env.NODE_ENV === 'production';
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
   * Om chat er aktivert
   */
  enableChat: true,

  /**
   * S-10: RETENTION_ENABLED — oppbevaringskron for inaktive kontoer.
   * Default: OFF (opt-in). Sett RETENTION_ENABLED=true når du er klar.
   * Varsler ved 11 mnd inaktivitet (Notification + SystemLog),
   * anonymiserer ved 12 mnd via lib/privacy/anonymize.ts.
   */
  enableRetention: process.env.RETENTION_ENABLED === 'true',

  /**
   * BETA_MATCH_EMAIL — match-varsel på e-post etter matcherunde.
   * Default: AV (invariant I-4: «ingen push/e-post/SMS ved match»).
   *
   * Beta tester hypotesen: første runde uten (måler hvor mange som
   * oppdager matchen selv innen 24/48 t), deretter på for resten av
   * testen slik at reisen faktisk gjennomføres.
   * Se docs/BETA-TEST-v1.0.md §4.
   */
  betaMatchEmail: process.env.BETA_MATCH_EMAIL === 'true',
};

/** Sjekk om betaling er aktivert */
export const isPaymentsEnabled = (): boolean => features.enablePayments;

/** Sjekk om matching er aktivert (kill switch for runden) */
export const isMatchingEnabled = (): boolean => features.enableMatching;

/** Sjekk om registrering er aktivert */
export const isRegistrationEnabled = (): boolean => features.enableRegistration;

/** Sjekk om vedlikeholdsmodus er på */
export const isMaintenanceMode = (): boolean => features.maintenanceMode;

/** Sjekk om lukket beta (invitasjonsport) er aktiv */
export const isBetaInviteMode = (): boolean => features.betaInviteMode;

/**
 * S-10: Sjekk om oppbevaringskron (retention) er aktiv.
 * Leses LIVE fra env (ikke features.enableRetention på modul-load) slik at
 * det kan slås til/av uten restart og testes isolert.
 */
export const isRetentionEnabled = (): boolean => process.env.RETENTION_ENABLED === 'true';

/**
 * BETA: Sjekk om match-varsel på e-post er aktiv.
 * Leses LIVE fra env slik at flagget kan slås på/av uten deploy —
 * kun en env-oppdatering i Vercel-dashboardet.
 */
export const isBetaMatchEmailEnabled = (): boolean => process.env.BETA_MATCH_EMAIL === 'true';
