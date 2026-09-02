/**
 * ToSom Environment Variable Validation
 * 
 * Validerer alle nødvendige miljøvariablar ved oppstart.
 * Kastar feil ved manglande kritiske variablar.
 */

interface EnvVar {
  value: string | undefined
  required: boolean
  description: string
}

const REQUIRED_VARS: EnvVar[] = [
  { value: process.env.DATABASE_URL, required: true, description: 'PostgreSQL connection string' },
  { value: process.env.NEXTAUTH_SECRET, required: true, description: 'NextAuth secret key' },
  { value: process.env.NEXTAUTH_URL, required: true, description: 'NextAuth URL' },
  // STEG 2.4: Legg til ADMIN_JWT_SECRET som påkrevd i produksjon
  { value: process.env.ADMIN_JWT_SECRET, required: true, description: 'Admin JWT secret key (sikkerheitskritisk)' },
]

// F-133-01 (S-ENV): prod-kritiske variabler appen er avhengig av i produksjon,
// men som kan mangle i dev/CI/build. Valideres kun når NODE_ENV === 'production'
// (Node-runtime avslutter via process.exit i instrumentation.ts, Edge logger).
// Mål: fange en "halvdød" prod-oppstart (manglende Pusher/R2/e-post/cron) ved
// oppstart, i stedet for at en tilfeldig rute feiler senere.
const PROD_REQUIRED_VARS: EnvVar[] = [
  { value: process.env.CRON_SECRET, required: true, description: 'CRON_SECRET (cron-auth)' },
  { value: process.env.PUSHER_APP_ID, required: true, description: 'PUSHER_APP_ID (Pusher realtid)' },
  { value: process.env.PUSHER_KEY, required: true, description: 'PUSHER_KEY (Pusher realtid)' },
  { value: process.env.PUSHER_SECRET, required: true, description: 'PUSHER_SECRET (Pusher realtid)' },
  { value: process.env.R2_ACCOUNT_ID, required: true, description: 'R2_ACCOUNT_ID (bildeoppbevaring)' },
  { value: process.env.R2_ACCESS_KEY_ID, required: true, description: 'R2_ACCESS_KEY_ID (bildeoppbevaring)' },
  { value: process.env.R2_SECRET_ACCESS_KEY, required: true, description: 'R2_SECRET_ACCESS_KEY (bildeoppbevaring)' },
  { value: process.env.R2_BUCKET, required: true, description: 'R2_BUCKET (bildeoppbevaring)' },
  { value: process.env.EMAIL_SERVER_HOST, required: true, description: 'EMAIL_SERVER_HOST (SMTP/Resend)' },
  { value: process.env.EMAIL_SERVER_USER, required: true, description: 'EMAIL_SERVER_USER (SMTP/Resend)' },
  { value: process.env.EMAIL_SERVER_PASSWORD, required: true, description: 'EMAIL_SERVER_PASSWORD (SMTP/Resend)' },
  { value: process.env.ALERT_EMAIL_TO, required: true, description: 'ALERT_EMAIL_TO (uptime-alert)' },
]

const OPTIONAL_VARS: EnvVar[] = [
  { value: process.env.AI_API_KEY, required: false, description: 'AI provider API key' },
  { value: process.env.AI_MODEL, required: false, description: 'AI model name' },
  { value: process.env.UPLOADTHING_TOKEN, required: false, description: 'UploadThing token' },
  { value: process.env.SUPABASE_URL, required: false, description: 'Supabase URL' },
  { value: process.env.SUPABASE_KEY, required: false, description: 'Supabase key' },
]

export function validateEnv(): void {
  const missing: string[] = []
  const isProd = process.env.NODE_ENV === 'production'

  for (const envVar of REQUIRED_VARS) {
    if (!envVar.value) {
      missing.push(envVar.description)
    }
  }

  // Prod-kritiske variabler: påkrevd kun i produksjon (fail i Node, log i Edge).
  // I dev/CI/build er de bare advarsler, slik at lokal utvikling og build ikke
  // blokkeres av prod-spesifikke verdier.
  for (const envVar of PROD_REQUIRED_VARS) {
    if (!envVar.value) {
      if (isProd) {
        missing.push(envVar.description)
      } else {
        console.warn(`[env] Prod-kritisk variabel ikke satt (dev): ${envVar.description}`)
      }
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n  - ${missing.join('\n  - ')}`
    )
  }

  // Warn about optional vars not set
  for (const envVar of OPTIONAL_VARS) {
    if (!envVar.value) {
      console.warn(`Optional env var not set: ${envVar.description}`)
    }
  }
}

export function getEnvStatus(): {
  critical: string[]
  optional: string[]
  production: boolean
} {
  const critical = REQUIRED_VARS.filter((v) => v.value)
  const optional = OPTIONAL_VARS.filter((v) => v.value)

  return {
    critical: critical.map((v) => v.description),
    optional: optional.map((v) => v.description),
    production: process.env.NODE_ENV === 'production',
  }
}

// Run validation on import (only in non-test environments).
//
// MERK: denne filen lastes også i Edge runtime via instrumentation.ts.
// Edge har ingen process.exit — et kall dit ga «TypeError: process.exit is
// not a function» og veltet middleware på hver eneste forespørsel.
// Vi logger derfor tydelig og lar prosessen leve; manglende variabler
// gir en synlig feil der de faktisk brukes, ikke en total nedetid.
if (process.env.NODE_ENV !== 'test') {
  try {
    validateEnv()
  } catch (error) {
    if (error instanceof Error && error.message.includes('Missing required')) {
      console.error('[env] Environment validation failed:')
      console.error(error.message)
    } else {
      throw error
    }
  }
}
