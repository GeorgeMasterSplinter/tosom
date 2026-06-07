/**
 * ToSom Standardized API Response Types
 * 
 * Alle API-ruter skal bruke desse typane for konsistente svar.
 */

import { NextResponse } from 'next/server'

export type APIResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  meta?: {
    traceId?: string
    timestamp: string
    [key: string]: unknown
  }
}

export type APISuccess<T> = Omit<APIResponse<T>, 'error'> & {
  success: true
  data: T
}

export type APIError = Omit<APIResponse, 'data'> & {
  success: false
  error: string
  statusCode?: number
}

/**
 * Opprett eit suksess-svar
 */
export function successResponse<T>(
  data: T,
  options?: {
    statusCode?: number
    traceId?: string
    meta?: Record<string, unknown>
  },
): NextResponse<APIResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        traceId: options?.traceId,
        timestamp: new Date().toISOString(),
        ...options?.meta,
      },
    },
    { status: options?.statusCode ?? 200 },
  )
}

/**
 * Opprett eit feil-svar
 */
export function errorResponse(
  message: string,
  statusCode: number = 500,
  traceId?: string,
): NextResponse<APIError> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      meta: {
        traceId,
        timestamp: new Date().toISOString(),
      },
    } as APIError,
    { status: statusCode },
  )
}

/**
 * Opprett eit valideringsfeil-svar
 */
export function validationErrorResponse(
  errors: Array<{ field: string; message: string }>,
  traceId?: string,
): NextResponse<APIError> {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      meta: {
        traceId,
        timestamp: new Date().toISOString(),
        errors,
      },
    } as APIError,
    { status: 400 },
  )
}

/**
 * Opprett eit uautorisert svar
 */
export function unauthorizedResponse(traceId?: string): NextResponse<APIError> {
  return errorResponse('Unauthorized', 401, traceId)
}

/**
 * Opprett eit ikkje funnen svar
 */
export function notFoundResponse(traceId?: string): NextResponse<APIError> {
  return errorResponse('Not found', 404, traceId)
}

/**
 * Opprett eit rate limit svar
 */
export function rateLimitResponse(traceId?: string): NextResponse<APIError> {
  return errorResponse('Rate limit exceeded', 429, traceId)
}
