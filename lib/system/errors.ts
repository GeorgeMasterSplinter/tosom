import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logging'

export async function captureError(
  error: unknown,
  context: {
    module: string
    message: string
    userId?: string
    metadata?: Record<string, unknown>
  },
): Promise<void> {
  const { module, message, userId, metadata } = context

  // Lagre til SystemLog
  const stack = error instanceof Error
    ? { name: error.name, message: error.message, stack: error.stack }
    : { name: typeof error, message: String(error) }

  const safeMetadata = sanitizeMetadata({
    ...metadata,
    userId,
    error: stack,
  })

  await prisma.systemLog.create({
    data: {
      level: 'ERROR',
      message,
      module,
      metadata: safeMetadata,
    },
  })

  // Log til console
  logger.error(message, module, safeMetadata, error instanceof Error ? error : undefined)
}

function sanitizeMetadata(metadata?: Record<string, unknown>): Record<string, unknown> | null {
  if (!metadata) return null

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
