#!/usr/bin/env node
/**
 * Generer ADMIN_PASSWORD_HASH for .env (scrypt — samme format som lib/admin-hash.ts).
 *
 * Bruk:   node scripts/generate-admin-hash.mjs "<sterkt passord>"
 * Output: ADMIN_PASSWORD_HASH=<salt>:<hash>   (kopier til .env / Vercel env)
 */
import { randomBytes, scryptSync } from 'crypto';

const pw = process.argv[2];
if (!pw) {
  console.error('Bruk: node scripts/generate-admin-hash.mjs "<sterkt passord>"');
  process.exit(1);
}
// MÅ stemme med hashAdminPassword i lib/admin-hash.ts (16-byte salt, 32-byte nøkkel).
const salt = randomBytes(16).toString('hex');
const hash = scryptSync(pw, salt, 32).toString('hex');
console.log(`ADMIN_PASSWORD_HASH=${salt}:${hash}`);