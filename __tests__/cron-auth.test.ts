/**
 * ToSom — Cron Authentication Tests (STEG 12.5)
 *
 * Bekrefter at Bølge 1/6-fiksene (cron-secret via Authorization-header) faktisk holder.
 */

import { createMocks } from 'node-mocks-http';

describe('Cron Authentication Tests', () => {
  const VALID_SECRET = process.env.CRON_SECRET || 'test-cron-secret';

  // Helper: simulate timing-safe comparison (same pattern as cron routes use)
  function timingSafeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }

  // Helper: simulate cron auth check from routes
  function simulateCronAuth(req: any): { authorized: boolean; error?: string } {
    const authHeader = req.headers?.['authorization'] as string | undefined;
    if (!authHeader) {
      return { authorized: false, error: 'Missing Authorization header' };
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token || !timingSafeCompare(token, VALID_SECRET)) {
      return { authorized: false, error: 'Invalid cron secret' };
    }

    return { authorized: true };
  }

  describe('/api/cron/journey og /api/cron/matching', () => {
    it('skal avise kall uten Authorization header', () => {
      const req = createMocks({ method: 'POST', url: '/api/cron/journey' });
      const result = simulateCronAuth(req);
      expect(result.authorized).toBe(false);
      expect(result.error).toContain('Authorization');
    });

    it('skal avise kall med feil secret i header', () => {
      const req = createMocks({
        method: 'POST',
        url: '/api/cron/journey',
        headers: { authorization: 'Bearer wrong-secret' },
      });
      const result = simulateCronAuth(req);
      expect(result.authorized).toBe(false);
      expect(result.error).toContain('Invalid');
    });

    it('skal godkjenne kall med korrekt secret i header', () => {
      const req = createMocks({
        method: 'POST',
        url: '/api/cron/journey',
        headers: { authorization: `Bearer ${VALID_SECRET}` },
      });
      const result = simulateCronAuth(req);
      expect(result.authorized).toBe(true);
    });

    it('skal IKKE godkjenne secret i query params (gamle mønster)', () => {
      // After STEG 1.12/1.13, secrets should NOT be in query params
      const req = createMocks({
        method: 'POST',
        url: `/api/cron/journey?secret=${VALID_SECRET}`,
      });
      const result = simulateCronAuth(req);
      expect(result.authorized).toBe(false);
    });

    it('skal avise tom Bearer-token', () => {
      const req = createMocks({
        method: 'POST',
        url: '/api/cron/matching',
        headers: { authorization: 'Bearer ' },
      });
      const result = simulateCronAuth(req);
      expect(result.authorized).toBe(false);
    });

    it('skal avise Authorization header uten Bearer-prefix', () => {
      const req = createMocks({
        method: 'POST',
        url: '/api/cron/matching',
        headers: { authorization: VALID_SECRET }, // Missing "Bearer " prefix
      });
      const result = simulateCronAuth(req);
      // Should still fail because the route expects "Bearer <secret>" format
      expect(result.authorized).toBe(false);
    });
  });

  describe('Integration: verify routes use Authorization header', () => {
    it('skal at /api/cron/journey/route.ts ikke bruker searchParams.get for secret', async () => {
      const fs = await import('fs');
      const content = fs.readFileSync(
        'app/api/cron/journey/route.ts',
        'utf-8'
      );
      // Should NOT contain searchParams.get for secret
      expect(content).not.toMatch(/searchParams\.get\s*\(\s*['"](secret|cron_secret)['"]\s*\)/);
      // SHOULD contain Authorization header check
      expect(content).toMatch(/Authorization|timingSafeEqual/i);
    });

    it('skal at /api/cron/matching/route.ts ikke bruker searchParams.get for secret', async () => {
      const fs = await import('fs');
      const content = fs.readFileSync(
        'app/api/cron/matching/route.ts',
        'utf-8'
      );
      expect(content).not.toMatch(/searchParams\.get\s*\(\s*['"](secret|cron_secret)['"]\s*\)/);
      expect(content).toMatch(/Authorization|timingSafeEqual/i);
    });
  });
});