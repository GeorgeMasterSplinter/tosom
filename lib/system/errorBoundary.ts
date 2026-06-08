/**
 * ToSom API Error Boundary
 * 
 * Fang uventa feil i API-handlarar og logg med captureError.
 */

import { NextRequest, NextResponse } from 'next/server'
import { captureError } from '@/lib/system/errors'
import { errorResponse } from '@/lib/api/response'

export type ApiHandler = (req: NextRequest) => Promise<NextResponse>

export function wrapApiHandler(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest) => {
    try {
      return await handler(req)
    } catch (error) {
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        return errorResponse('Unauthorized', { statusCode: 401, code: 'UNAUTHORIZED' })
      }
      if (error instanceof Error && error.message === 'FORBIDDEN') {
        return errorResponse('Forbidden', { statusCode: 403, code: 'FORBIDDEN' })
      }

      await captureError(error, {
        module: 'errorBoundary',
        message: `API handler failed on ${req.nextUrl.pathname}`,
        metadata: { route: req.nextUrl.pathname, method: req.method },
      })

      return errorResponse('Internal server error', { statusCode: 500, code: 'INTERNAL_ERROR' })
    }
  }
}
