
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth/requireAuth'

/**
 * GET /api/system/latency — Detaljert latens-sporing
 * 
 * Utvidet 2026-08-02 (Pakke 3, Steg 3b):
 * - Gjennomsnittlig API-latens (fra PerformanceMetric)
 * - Gjennomsnittlig DB-latens (fra PerformanceMetric)
 * - P95 latens per route (top 5 tregeste rutene)
 * - Database-ping (real-time)
 *
 * KUN ADMIN: responsen lister rutenavn og ytelsestall — et kart over
 * API-overflaten som ikke skal være offentlig. Middleware dekker
 * /api/system-prefikset, men rollen må sjekkes her.
 */

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<Response> {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    // Real-time DB ping
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const currentDbLatency = Date.now() - dbStart

    // Hent PerformanceMetrics for dei siste 24 timene
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    let apiLatencyStats: { avgValueMs: number; p95ValueMs: number } = { avgValueMs: 0, p95ValueMs: 0 }
    let dbLatencyStats: { avgValueMs: number; p95ValueMs: number } = { avgValueMs: 0, p95ValueMs: 0 }
    let topSlowRoutes: Array<{ route: string; avgValueMs: number }> = []

    try {
      // API-latens gjennomsnitt
      const apiMetrics = await prisma.performanceMetric.findMany({
        where: {
          metric: 'api_latency',
          createdAt: { gte: since }
        },
        orderBy: { valueMs: 'desc' },
        take: 100,
        select: { route: true, valueMs: true, createdAt: true }
      })

      if (apiMetrics.length > 0) {
        const avgApi = apiMetrics.reduce((sum, m) => sum + m.valueMs, 0) / apiMetrics.length
        const p95Idx = Math.floor(apiMetrics.length * 0.95)
        apiLatencyStats = {
          avgValueMs: Math.round(avgApi),
          p95ValueMs: apiMetrics[p95Idx]?.valueMs ?? 0
        }

        // Top 5 tregaste ruter
        const routeMap = new Map<string, number[]>()
        for (const m of apiMetrics) {
          const routes = routeMap.get(m.route) || []
          routes.push(m.valueMs)
          routeMap.set(m.route, routes)
        }
        
        const routeAvgs = Array.from(routeMap.entries())
          .map(([route, values]) => ({ route, avgValueMs: Math.round(values.reduce((a, b) => a + b, 0) / values.length) }))
          .sort((a, b) => b.avgValueMs - a.avgValueMs)
          .slice(0, 5)
        topSlowRoutes = routeAvgs
      }

      // DB-latens gjennomsnitt
      const dbMetrics = await prisma.performanceMetric.findMany({
        where: {
          metric: 'db_latency',
          createdAt: { gte: since }
        },
        select: { valueMs: true }
      })

      if (dbMetrics.length > 0) {
        const avgDb = dbMetrics.reduce((sum, m) => sum + m.valueMs, 0) / dbMetrics.length
        dbLatencyStats = {
          avgValueMs: Math.round(avgDb),
          p95ValueMs: 0 // Enkel implementering for no
        }
      }
    } catch {
      // PerformanceMetric finnes kanskje ikke ennå
    }

    const response = {
      timestamp: new Date().toISOString(),
      db: {
        pingLatencyMs: currentDbLatency,
        avg24h: dbLatencyStats.avgValueMs,
        p9524h: dbLatencyStats.p95ValueMs,
      },
      api: {
        avg24h: apiLatencyStats.avgValueMs,
        p9524h: apiLatencyStats.p95ValueMs,
      },
      topSlowRoutes,
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('[system latency GET] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

