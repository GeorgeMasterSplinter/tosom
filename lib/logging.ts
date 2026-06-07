/**
 * ToSom Structured Logging
 * 
 * Brukar konsistent format for alle logglinjer.
 * Produksjon: JSON. Utvikling: human-readable.
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'

export interface LogEntry {
  level: LogLevel
  message: string
  module: string
  metadata?: Record<string, unknown>
  timestamp: string
}

function formatEntry(entry: LogEntry): string {
  const { timestamp, level, message, module, metadata } = entry
  const prefix = `[${timestamp}] [${level}] [${module}] ${message}`

  if (process.env.NODE_ENV === 'production') {
    return JSON.stringify({
      timestamp,
      level,
      message,
      module,
      ...metadata,
    })
  }

  const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : ''
  return `${prefix}${metaStr}`
}

function log(level: LogLevel, message: string, module: string, metadata?: Record<string, unknown>): void {
  const entry: LogEntry = {
    level,
    message,
    module,
    metadata: metadata ?? {},
    timestamp: new Date().toISOString(),
  }

  const formatted = formatEntry(entry)

  switch (level) {
    case 'DEBUG':
    case 'INFO':
      console.log(formatted)
      break
    case 'WARN':
      console.warn(formatted)
      break
    case 'ERROR':
      console.error(formatted)
      break
  }
}

export const logger = {
  debug(message: string, module: string, metadata?: Record<string, unknown>) {
    log('DEBUG', message, module, metadata)
  },

  info(message: string, module: string, metadata?: Record<string, unknown>) {
    log('INFO', message, module, metadata)
  },

  warn(message: string, module: string, metadata?: Record<string, unknown>) {
    log('WARN', message, module, metadata)
  },

  error(message: string, module: string, metadata?: Record<string, unknown>, err?: Error) {
    const errorMeta = err ? { ...metadata, error: err.message, stack: err.stack } : metadata
    log('ERROR', message, module, errorMeta)
  },

  entry(entry: LogEntry): void {
    log(entry.level, entry.message, entry.module, entry.metadata)
  },
}
