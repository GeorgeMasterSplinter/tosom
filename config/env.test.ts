/**
 * F-133-01 (S-ENV): prod-kritiske miljøvariabler valideres ved oppstart.
 *
 * MODULLEN leser process.env ved import (bygger variabellistene), så hver test
 * setter env, resetter modulene og importerer på nytt.
 */
describe('config/env — validateEnv (F-133-01)', () => {
  const ORIGINAL_ENV: Record<string, string | undefined> = { ...process.env };

  const baseRequired = {
    DATABASE_URL: 'postgres://u:p@h:5432/db',
    NEXTAUTH_SECRET: 'secret',
    NEXTAUTH_URL: 'http://localhost:3000',
    ADMIN_JWT_SECRET: 'jwt-secret',
  };

  const prodVars = {
    CRON_SECRET: 'cron',
    PUSHER_APP_ID: 'app-id',
    PUSHER_KEY: 'key',
    PUSHER_SECRET: 'secret',
    R2_ACCOUNT_ID: 'acct',
    R2_ACCESS_KEY_ID: 'key-id',
    R2_SECRET_ACCESS_KEY: 'secret-key',
    R2_BUCKET: 'bucket',
    EMAIL_SERVER_HOST: 'smtp.resend.com',
    EMAIL_SERVER_USER: 'resend',
    EMAIL_SERVER_PASSWORD: 'pw',
    ALERT_EMAIL_TO: 'alerts@tosom.no',
  };

  afterEach(() => {
    // Gjenopprett process.env og resetter modulene
    for (const k of Object.keys(process.env)) {
      if (!(k in ORIGINAL_ENV)) delete process.env[k];
    }
    for (const [k, v] of Object.entries(ORIGINAL_ENV)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
    jest.resetModules();
    jest.restoreAllMocks();
  });

  async function loadWithEnv(env: Record<string, string | undefined>) {
    for (const [k, v] of Object.entries(env)) {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    }
    jest.resetModules();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    return import('./env');
  }

  it('PROD: mangler CRON_SECRET → kaster med variabelnavnet', async () => {
    const { validateEnv } = await loadWithEnv({
      ...baseRequired, ...prodVars, CRON_SECRET: undefined, NODE_ENV: 'production',
    });
    expect(() => validateEnv()).toThrow(/CRON_SECRET/);
  });

  it('PROD: mangler PUSHER_SECRET → kaster', async () => {
    const { validateEnv } = await loadWithEnv({
      ...baseRequired, ...prodVars, PUSHER_SECRET: undefined, NODE_ENV: 'production',
    });
    expect(() => validateEnv()).toThrow(/PUSHER_SECRET/);
  });

  it('DEV: prod-var mangler → kaster IKKE (advarsel bare)', async () => {
    const { validateEnv } = await loadWithEnv({
      ...baseRequired, NODE_ENV: 'development',
    });
    expect(() => validateEnv()).not.toThrow();
  });

  it('PROD: alle prod-var satt → kaster IKKE', async () => {
    const { validateEnv } = await loadWithEnv({
      ...baseRequired, ...prodVars, NODE_ENV: 'production',
    });
    expect(() => validateEnv()).not.toThrow();
  });

  it('mangler REQUIRED (DATABASE_URL) → kaster uavhengig av NODE_ENV', async () => {
    const { validateEnv } = await loadWithEnv({
      ...prodVars, DATABASE_URL: undefined, NEXTAUTH_SECRET: undefined,
      NODE_ENV: 'development',
    });
    expect(() => validateEnv()).toThrow();
  });
});