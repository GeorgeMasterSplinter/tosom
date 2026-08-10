#!/usr/bin/env ts-node
/**
 * ToSom — Dev-mode Cron Scheduler (STEG 2)
 *
 * Kjør matching-cron og journey-cron lokalt under utvikling.
 * Bruk: npx ts-node scripts/cron-dev.ts
 *
 * I produksjon kjører Vercel Cron (se vercel.json):
 * - matching: kl. 05:00 UTC daglig
 * - journey: kl. 07:00 UTC daglig
 */

import cron from 'node-cron';
import fetch from 'node-fetch';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const CRON_SECRET = process.env.CRON_SECRET || 'dev-secret';

console.log('[cron-dev] Starting dev cron scheduler...');
console.log(`[cron-dev] APP_URL: ${APP_URL}`);
console.log('[cron-dev] CRON_SECRET: ***');

// Matching-cron: kjør hvert 24. time (kl. 05:00 local time)
// I dev: kjør hvert 5. minut for testing
const MATCHING_INTERVAL = process.env.NODE_ENV === 'production' ? '0 5 * * *' : '*/5 * * * *';

// Journey-cron: kjør hvert 24. time (kl. 07:00 local time)
// I dev: kjør hvert 10. minut for testing
const JOURNEY_INTERVAL = process.env.NODE_ENV === 'production' ? '0 7 * * *' : '*/10 * * * *';

async function runMatchingCron() {
  try {
    console.log(`[cron-dev/matching] Running at ${new Date().toISOString()}`);
    const res = await fetch(`${APP_URL}/api/cron/matching?secret=${CRON_SECRET}`);
    const data = await res.json();

    if (res.ok) {
      console.log(`[cron-dev/matching] ✓ OK: processed=${data.processed}, created=${data.created}`);
    } else {
      console.error(`[cron-dev/matching] ✗ FAIL: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    console.error(`[cron-dev/matching] ✗ ERROR: ${(err as Error).message}`);
  }
}

async function runJourneyCron() {
  try {
    console.log(`[cron-dev/journey] Running at ${new Date().toISOString()}`);
    const res = await fetch(`${APP_URL}/api/cron/journey?secret=${CRON_SECRET}`);
    const data = await res.json();

    if (res.ok) {
      console.log(`[cron-dev/journey] ✓ OK: processed=${data.processed}, advanced=${data.advanced}, ended=${data.ended}`);
    } else {
      console.error(`[cron-dev/journey] ✗ FAIL: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    console.error(`[cron-dev/journey] ✗ ERROR: ${(err as Error).message}`);
  }
}

// Start cron jobs
console.log(`[cron-dev] Matching schedule: ${MATCHING_INTERVAL}`);
console.log(`[cron-dev] Journey schedule: ${JOURNEY_INTERVAL}`);

cron.schedule(MATCHING_INTERVAL, runMatchingCron);
cron.schedule(JOURNEY_INTERVAL, runJourneyCron);

// Kjør en gang ved start for rask testing
console.log('[cron-dev] Running initial matching + journey jobs...');
runMatchingCron();
setTimeout(() => runJourneyCron(), 2000);

console.log('[cron-dev] Cron scheduler started. Press Ctrl+C to stop.');

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[cron-dev] Shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n[cron-dev] Shutting down...');
  process.exit(0);
});