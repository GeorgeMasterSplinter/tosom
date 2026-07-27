import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readFileSync } from 'fs';
import { join } from 'path';
import os from 'os';

export const dynamic = 'error';

export async function GET(request: NextRequest) {
  try {
    // System uptime
    const uptimeSeconds = process.uptime();
    const uptimeFormatted = formatUptime(uptimeSeconds);

    // RAM usage
    const memUsage = process.memoryUsage();
    const ramUsedMB = +(memUsage.rss / (1024 * 1024)).toFixed(2);
    const ramTotalMB = +(os.totalmem() / (1024 * 1024)).toFixed(2);
    const ramUsagePercent = +((memUsage.rss / os.totalmem()) * 100).toFixed(2);

    // CPU load
    const loadAvg = os.loadavg();

    // Versions
    const nodeVersion = process.version;
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const nextVersion = packageJson?.dependencies?.['next'] ?? 'unknown';

    // Database ping
    let dbLatency = -1;
    let dbStatus = 'unknown';
    let dbError: string | null = null;
    try {
      const start = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - start;
      dbStatus = 'connected';
    } catch (error) {
      dbStatus = 'error';
      dbError = error instanceof Error ? error.message : 'Unknown error';
    }

    const response = {
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      system: {
        uptime: uptimeFormatted,
        uptimeSeconds: Math.round(uptimeSeconds),
        memory: {
          usedMB: ramUsedMB,
          totalMB: ramTotalMB,
          usagePercent: ramUsagePercent,
        },
        cpu: {
          load1m: loadAvg[0],
          load5m: loadAvg[1],
          load15m: loadAvg[2],
        },
        nodeVersion,
        nextVersion,
      },
      database: {
        status: dbStatus,
        latencyMs: dbLatency,
        error: dbError,
      },
      app: {
        name: packageJson.name ?? 'tosom',
        version: packageJson.version ?? '0.0.0',
        environment: process.env.NODE_ENV ?? 'development',
        port: process.env.PORT ?? 3000,
      },
    };

    return NextResponse.json(response, {
      status: dbStatus === 'connected' ? 200 : 503,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

// ─── Helpers ───

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(' ');
}
