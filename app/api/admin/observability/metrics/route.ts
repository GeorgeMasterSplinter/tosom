/**
 * OBSERVABILITY O-9 — Spørrings-API for metrikker
 *
 * GET /api/admin/observability/metrics?metric=match.round.duration_ms&days=30&agg=avg
 *
 * Leser metrikker fra SystemLog (module = 'metric', metadata->>'metric').
 * Returnerer:
 *   { metric, days, agg, points: [{ date, value, count }], summary: { avg, min, max, p95, count } }
 *
 * Admin-autorisasjon som alle andre admin-ruter.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAuth'
import prisma from '@/lib/prisma'
export const dynamic = 'force-dynamic';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const s = [...values].sort((a, b) => a - b);
  const idx = Math.min(s.length - 1, Math.max(0, Math.ceil((p / 100) * s.length) - 1));
  return s[idx];
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const url = new URL(request.url);
    const metric = url.searchParams.get('metric');
    const days = Math.min(365, Math.max(1, parseInt(url.searchParams.get('days') ?? '30', 10) || 30));
    const agg = url.searchParams.get('agg') === 'sum' ? 'sum' : 'avg';

    if (!metric) {
      return json({ error: 'Mangler query-param: metric' }, 400);
    }

    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const rows = await prisma.systemLog.findMany({
      where: {
        module: 'metric',
        metadata: { path: ['metric'], equals: metric },
        createdAt: { gte: cutoff },
      },
      select: { metadata: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Flate verdier + gruppering per kalenderdag (UTC).
    const values: number[] = [];
    const byDay = new Map<string, number[]>();
    for (const r of rows) {
      const v = (r.metadata as Record<string, unknown> | null)?.value;
      if (typeof v !== 'number') continue;
      values.push(v);
      const day = r.createdAt.toISOString().slice(0, 10);
      const arr = byDay.get(day);
      if (arr) arr.push(v);
      else byDay.set(day, [v]);
    }

    const points = [...byDay.entries()]
      .map(([date, vals]) => {
        const sum = vals.reduce((a, b) => a + b, 0);
        const value = agg === 'sum' ? sum : Math.round((sum / vals.length) * 100) / 100;
        return { date, value, count: vals.length };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    const summary =
      values.length > 0
        ? {
            avg: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100,
            min: Math.min(...values),
            max: Math.max(...values),
            p95: percentile(values, 95),
            count: values.length,
          }
        : { avg: 0, min: 0, max: 0, p95: 0, count: 0 };

    return json({ metric, days, agg, points, summary });
  } catch (error) {
    console.error('[admin observability metrics GET] Error:', error)
    return json({ error: 'Internal server error' }, 500);
  }
}