import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readFileSync } from 'fs';
import { join } from 'path';
import os from 'os';

/**
 * GET /api/system/health — Detaljert health check med service-kjekk
 * 
 * Utvidet 2026-08-02 (Pakke 3, Steg 3a):
 * - DB-ping (allerede eksisterande)
 * - Pusher-status (miljøvariabel-validering)
 * - Uploadthing-status (miljøvariabel-validering)
 * - OpenAI-status (miljøvariabel-validering)
 * - Cron-siste kjøring (via Prisma MatchingAIRequestLog eller SystemLog)
 */

export const dynamic = 'force-dynamic';

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

    // ─── Database ping ───
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

    // ─── Service checks (miljøvariabel-validering + der mogleg faktiske sjekkar) ───
    // critical=true betyr at feil på denne tjenesten gjør hele systemet
    // utilgjengelig (HTTP 503). De øvrige er valgfrie: mangel vises som
    // warning i admin-panelet og nedgraderer ikke overall status.
    const uploadthingOk = Boolean(process.env.UPLOADTHING_TOKEN || process.env.NEXT_PUBLIC_UPLOADTHING_TOKEN);
    const vippsOk = Boolean(process.env.VIPPS_CLIENT_ID && process.env.VIPPS_CLIENT_SECRET);
    const services = {
    database: {
    status: dbStatus,
    latencyMs: dbLatency,
      error: dbError,
      critical: true,
    },
    pusher: {
      status: process.env.PUSHER_APP_ID ? 'configured' : 'missing',
        details: process.env.PUSHER_APP_ID ? 'Environment variabel satt' : 'Manglende miljøvariabel (PUSHER_APP_ID)',
      critical: false,
    },
    uploadthing: {
      status: uploadthingOk ? 'configured' : 'missing',
      details: uploadthingOk ? 'Token variabel satt' : 'Manglende miljøvariabel (UPLOADTHING_TOKEN)',
    critical: false,
    },
    openai: {
        // Ingen AI-integrasjon i koden (kverken `ai` eller `openai` er ei
        // avhengighet) — rapporterer not_in_use i staden for falsk alarm.
        status: 'not_in_use',
        details: 'Ikke brukt i koden',
        critical: false,
      },
      vipps: {
        status: vippsOk ? 'configured' : 'missing',
        details: vippsOk ? 'Vipps OAuth variabler sett' : 'Ikke konfigurert (valgfri — betaling er ikke aktivert)',
        critical: false,
      },
    };

    // Cron-siste kjøring — prøv å hente siste SystemLog createdAt som proxy (MatchingAIRequestLog fjernet 2026-08-02)
    let cronLastRun: string | null = null;
    try {
      const lastLog = await prisma.systemLog.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      });
      cronLastRun = lastLog?.createdAt?.toISOString() ?? null;
    } catch {
      // SystemLog finnes kanskje ikke ennå
      cronLastRun = 'ukjent';
    }

    // ─── Auth-config-kjekk ───
    // Uavhengig av lib/auth/config: en feil i auth-modulen skal ikke
    // ta ned health-endpoenket. Speilar configen i lib/auth/config.ts.
    const authConfig = checkAuthConfig();

    // Overall status: bare kritiske tjenester (database) avgjør 200 vs 503.
    // Valgfrie tjenester som mangler vises individuelt som warning.
    const criticalServicesOk = dbStatus === 'connected';
    const overallStatus = criticalServicesOk ? 'ok' : 'error';

    const response = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: packageJson.version ?? '0.0.0',
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
      services,
      auth: authConfig,
      cron: {
        lastRun: cronLastRun,
      },
      app: {
        name: packageJson.name ?? 'tosom',
        environment: process.env.NODE_ENV ?? 'development',
        port: process.env.PORT ? Number(process.env.PORT) : 3000,
      },
    };

    return NextResponse.json(response, {
      status: overallStatus === 'ok' ? 200 : 503,
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

/**
 * Sjekkar NextAuth miljøkonfig uten å importere auth-modulen.
 * Offentlig endepunkt: rapporterer kun lengde og gyldighet — aldri
 * selve secret-verdien. Speilar secret- og trustHost-logikken i
 * lib/auth/config.ts.
 */
function checkAuthConfig() {
  const problems: string[] = [];

  const rawUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || '';
  let urlOk = false;
  if (!rawUrl) {
    problems.push('NEXTAUTH_URL mangler');
  } else {
    try {
      new URL(rawUrl);
      urlOk = true;
    } catch {
      problems.push('NEXTAUTH_URL er ikke et gyldig URL (mangler skema som https://?)');
    }
  }

  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || '';
  if (secret.length === 0) {
    problems.push('AUTH_SECRET/NEXTAUTH_SECRET mangler');
  } else if (secret.length < 32) {
    problems.push('Secret er kortere enn 32 tegn');
  }

  const trustHost =
    process.env.NODE_ENV === 'production'
      ? Boolean(process.env.VERCEL_URL || process.env.NEXTAUTH_URL)
      : true;
  if (!trustHost) {
    problems.push('trustHost=false i produksjon (sett VERCEL_URL eller NEXTAUTH_URL)');
  }

  return {
    status: problems.length === 0 ? 'ok' : 'error',
    url: rawUrl || null,
    urlOk,
    secretLength: secret.length,
    trustHost,
    problems,
  };
}
