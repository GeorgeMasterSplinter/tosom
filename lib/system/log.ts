import { prisma } from '@/lib/prisma'
import { logger, LogLevel } from '@/lib/logging'

/**
 * Skriv logg til SystemLog-modellen i databasen.
 * Sikkerheitsregel: aldri lagre passord, tokens eller 2FA-secrets.
 */

export type LogEntryType = 'INFO' | 'WARN' | 'ERROR'

async function logToDatabase(
  level: LogEntryType,
  message: string,
  module: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  const safeMetadata = sanitizeMetadata(metadata)

  await prisma.systemLog.create({
    data: {
      level,
      message,
      module,
      metadata: (safeMetadata || undefined) as any,
    },
  })
}

function sanitizeMetadata(
  metadata?: Record<string, unknown>,
): Record<string, unknown> | undefined {
  if (!metadata) return undefined

  const safe = { ...metadata }

  for (const key of Object.keys(safe)) {
    const lowerKey = key.toLowerCase()
    if (
      lowerKey.includes('password') ||
      lowerKey.includes('token') ||
      lowerKey.includes('secret') ||
      lowerKey.includes('2fa') ||
      lowerKey.includes('backup')
    ) {
      safe[key] = '[REDACTED]'
    }
  }

  return safe
}

export async function logInfo(
  message: string,
  module: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  logger.info(message, module, metadata)
  await logToDatabase('INFO', message, module, metadata)
}

export async function logWarn(
  message: string,
  module: string,
  metadata?: Record<string, unknown>,
): Promise<void> {
  logger.warn(message, module, metadata)
  await logToDatabase('WARN', message, module, metadata)
}

export async function logError(
  message: string,
  module: string,
  metadata?: Record<string, unknown>,
  err?: Error,
): Promise<void> {
  logger.error(message, module, metadata, err)
  const errorMeta = err
    ? { ...metadata, error: err.message, stack: err.stack }
    : metadata
  await logToDatabase('ERROR', message, module, errorMeta)
}
