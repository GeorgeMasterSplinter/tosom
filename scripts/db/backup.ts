#!/usr/bin/env ts-node
/**
 * ToSom — Database backup script
 * 
 * Lager en timestampet SQL-dump av PostgreSQL-databasen.
 * Bruk: npx tsx scripts/db/backup.ts [--keep N]
 *   --keep N  : behold de N siste backupene (standard: 5)
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

/**
 * Last DATABASE_URL fra miljøvariabel eller les fra .env-fil.
 */
function getDatabaseUrl(): string | undefined {
  // Først: sjekk miljøvariabel
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  // Deretter: les fra .env-filer
  const envFiles = ['.env.local', '.env.dev', '.env'];
  for (const file of envFiles) {
    try {
      const content = readFileSync(join(process.cwd(), file), 'utf-8');
      const match = content.match(/^DATABASE_URL="([^"]+)"/m);
      if (match) return match[1];
    } catch {
      // Ignorer feil ved lesing av .env-filer
    }
  }

  return undefined;
}

async function main() {
  const DATABASE_URL = getDatabaseUrl();
  if (!DATABASE_URL) {
    console.error('Feil: DATABASE_URL er ikke satt i .env eller miljøvariabel');
    process.exit(1);
  }

  // Parse DATABASE_URL for psql-tilkoblingsparametre
  const url = new URL(DATABASE_URL);
  const dbname = url.pathname.slice(1);
  const user = url.username;
  const host = url.hostname;
  const port = url.port || '5432';

  // Set PGPASSWORD for pg_dump
  process.env.PGPASSWORD = url.password || '';

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const backupDir = join(process.cwd(), 'backups');
  mkdirSync(backupDir, { recursive: true });
  const filename = `tosom-backup-${timestamp}.sql`;
  const filepath = join(backupDir, filename);

  console.log(`Lager databasebackup av "${dbname}"...`);
  console.log(`  → ${filepath}`);

  try {
    const { stdout, stderr } = await execAsync(
      `pg_dump -h ${host} -p ${port} -U ${user} -d ${dbname} --no-owner --no-privileges --clean --if-exists > "${filepath}"`
    );
    
    if (stderr) console.warn(stderr);

    // Sjekk filstørrelse
    const { stdout: size } = await execAsync(`wc -c < "${filepath}"`);
    const bytes = parseInt(size.trim(), 10);
    const mb = (bytes / (1024 * 1024)).toFixed(2);
    
    console.log(`Backup fullført! (${mb} MB)`);
    console.log(`Lagret: ${filepath}`);

    // Rydd gamle backupfiler (behold de N siste)
    const keepCount = parseKeepCount();
    await cleanupOldBackups(backupDir, keepCount);

  } catch (error) {
    console.error('Backup feilet:', error);
    process.exit(1);
  } finally {
    delete process.env.PGPASSWORD;
  }
}

function parseKeepCount(): number {
  const args = process.argv.slice(2);
  const keepIndex = args.indexOf('--keep');
  if (keepIndex !== -1 && args[keepIndex + 1]) {
    return parseInt(args[keepIndex + 1], 10) || 5;
  }
  return 5;
}

async function cleanupOldBackups(dir: string, keep: number): Promise<void> {
  try {
    const { stdout } = await execAsync(
      `ls -1t "${dir}"/tosom-backup-*.sql 2>/dev/null`
    );
    const files = stdout.trim().split('\n').filter(Boolean);
    
    if (files.length > keep) {
      const toDelete = files.slice(keep);
      for (const file of toDelete) {
        console.log(`  Sletter gammel backup: ${file}`);
        await execAsync(`rm "${file}"`);
      }
    }
  } catch {
    // Ignorer feil ved opprydding
  }
}

main();