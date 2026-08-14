/**
 * ToSom Standardized API Response
 * 
 * Alle API-ruter skal bruke desse typane for konsistente svar.
 */

import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  code?: string
  meta?: {
    traceId?: string
    timestamp: string
  }
}

export interface ApiError {
  success: false
  error: string
  code?: string
  meta?: {
    traceId?: string
    timestamp: string
  }
}

/**
 * Opprett eit suksess-svar
 */
export function successResponse<T>(
  data: T,
  options?: { statusCode?: number; traceId?: string },
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        traceId: options?.traceId,
        timestamp: new Date().toISOString(),
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
  options?: { statusCode?: number; code?: string; traceId?: string },
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: options?.code,
      meta: {
        traceId: options?.traceId,
        timestamp: new Date().toISOString(),
      },
    } as ApiError,
    { status: options?.statusCode ?? 500 },
  )
}

/**
 * Opprett eit valideringsfeil-svar
 */
export function validationErrorResponse(
  errors: Array<{ field: string; message: string }>,
  traceId?: string,
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      meta: {
        traceId,
        timestamp: new Date().toISOString(),
        errors,
      },
    } as ApiError,
    { status: 400 },
  )
}

/**
 * Opprett eit uautorisert svar
 */
export function unauthorizedResponse(traceId?: string): NextResponse<ApiError> {
  return errorResponse('Unauthorized', { statusCode: 401, code: 'UNAUTHORIZED', traceId })
}

/**
 * Opprett eit ikke autorisert svar
 */
export function forbiddenResponse(traceId?: string): NextResponse<ApiError> {
  return errorResponse('Forbidden', { statusCode: 403, code: 'FORBIDDEN', traceId })
}

/**
 * Opprett eit ikke funnet svar
 */
export function notFoundResponse(traceId?: string): NextResponse<ApiError> {
  return errorResponse('Not found', { statusCode: 404, code: 'NOT_FOUND', traceId })
}

/**
 * Opprett eit rate limit svar
 */
export function rateLimitResponse(traceId?: string): NextResponse<ApiError> {
  return errorResponse('Rate limit exceeded', { statusCode: 429, code: 'RATE_LIMITED', traceId })
}
