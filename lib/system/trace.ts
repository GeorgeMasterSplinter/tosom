/**
 * ToSom Request Tracing
 * 
 * Genererer og sporer traceId for alle API-kall.
 * Bruker cuid()-format for unike trace-identifikatorar.
 */

const TRACE_HEADER = 'x-trace-id'

export function createTraceId(): string {
  // Generer en unik traceId med crypto
  const bytes = new Uint8Array(10)
  crypto.getRandomValues(bytes)
  const base32 = 'abcdefghijklmnopqrstuv'
  return Array.from(bytes).map(b => base32[b % base32.length]).join('')
}

export function getTraceId(req: Request): string {
  return req.headers.get(TRACE_HEADER) || createTraceId()
}

export function attachTraceIdToRequest(req: Request, traceId: string): Request {
  const newHeaders = new Headers(req.headers)
  newHeaders.set(TRACE_HEADER, traceId)
  return new Request(req.url, { ...req, headers: newHeaders })
}

export function getTraceIdFromHeaders(headers: Headers): string {
  return headers.get(TRACE_HEADER) || createTraceId()
}

export function createTraceMetadata(traceId: string): Record<string, unknown> {
  return { traceId }
}
