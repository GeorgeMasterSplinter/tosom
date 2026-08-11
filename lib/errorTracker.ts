/**
 * ToSom Error Tracker
 * 
 * Logger feil til både console og database (SystemLog).
 * Bruk denne i API-ruter for konsistent error-håndtering.
 * 
 * Example usage:
 *   import { trackError } from '@/lib/errorTracker'
 *   try { someOperation() } catch (err) {
 *     trackError(err, 'api/chat/send', { userId, conversationId })
 *   }
 */

import prisma from '@/lib/prisma'
import { logger } from './logging'

export interface ErrorMeta {
  moduleName?: string
  route?: string
  userId?: string
  metadata?: Record<string, unknown>
}

/**
 * Logg ein feil til både console og database.
 */
export async function trackError(
  error: unknown,
  meta: ErrorMeta | string,
  metadata?: Record<string, unknown>
): Promise<void> {
  let moduleName: string = 'general'
  let route: string | undefined
  let userId: string | undefined

  if (typeof meta === 'string') {
    moduleName = meta
  } else {
    moduleName = meta.moduleName ?? 'general'
    route = meta.route
    userId = meta.userId
  }

  const message = error instanceof Error ? error.message : String(error)
  const stack: string | undefined = error instanceof Error ? error.stack : undefined

  // Console-logging (allereie i logger.error)
  logger.error(message, moduleName, { route, userId, ...metadata }, error as Error | undefined)

  // Database-logging (asynkron — feil her skal ikke krasje forespørselen)
  try {
    await prisma.systemLog.create({
      data: {
        level: 'ERROR',
        message,
        module: moduleName,
        metadata: JSON.stringify({ route, userId, stack, ...metadata }),
      },
    })
  } catch {
    // SystemLog kan ikke lagrast — inga problem, console-logging er allereie gjort
  }
}

/**
 * Logg ein varsel (ikke feil).
 */
export async function trackWarn(
  message: string,
  meta: ErrorMeta | string,
  metadata?: Record<string, unknown>
): Promise<void> {
  let moduleName: string = 'general'
  let route: string | undefined
  let userId: string | undefined

  if (typeof meta === 'string') {
    moduleName = meta
  } else {
    moduleName = meta.moduleName ?? 'general'
    route = meta.route
    userId = meta.userId
  }

  logger.warn(message, moduleName, { route, userId, ...metadata })

  try {
    await prisma.systemLog.create({
      data: {
        level: 'WARN',
        message,
        module: moduleName,
        metadata: JSON.stringify({ route, userId, ...metadata }),
      },
    })
  } catch {
    // Ignores
  }
}

/**
 * Logg ein info-event.
 */
export async function trackInfo(
  message: string,
  meta: ErrorMeta | string,
  metadata?: Record<string, unknown>
): Promise<void> {
  let moduleName: string = 'general'

  if (typeof meta === 'string') {
    moduleName = meta
  } else {
    moduleName = meta.moduleName ?? 'general'
  }

  logger.info(message, moduleName, { ...metadata })
}