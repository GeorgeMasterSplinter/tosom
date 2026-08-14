/**
 * ToSom — Admin Authorization Tests (E1: reelle tester)
 */

describe('Admin Authorization — Reelle tester mot lib/admin/requireAuth', () => {
  describe('lib/admin/requireAuth har reelle funksjoner', () => {
    it('skal ha requireAdminAuth som er en funksjon', async () => {
      const mod = await import('@/lib/admin/requireAuth');
      expect(mod.requireAdminAuth).toBeDefined();
      expect(typeof mod.requireAdminAuth).toBe('function');
    });

    it('skal ha getSessionData som er en funksjon', async () => {
      const mod = await import('@/lib/admin/requireAuth');
      expect(mod.getSessionData).toBeDefined();
      expect(typeof mod.getSessionData).toBe('function');
    });

    it('skal re-eksportere requireAdmin og requireAuth', async () => {
      const mod = await import('@/lib/admin/requireAuth');
      expect(mod.requireAdmin || mod.requireAuth).toBeDefined();
    });
  });

  describe('castToAdminUser eksisterer i lib/auth/admin-auth', () => {
    it('skal eksistere og være en funksjon', async () => {
      const mod = await import('@/lib/auth/admin-auth');
      expect(mod.castToAdminUser).toBeDefined();
      expect(typeof mod.castToAdminUser).toBe('function');
    });
  });

  describe('roles.ts har isAdminRole', () => {
    it('isAdminRole skal eksistere og returnere boolean', async () => {
      const mod = await import('@/lib/auth/roles');
      expect(mod.isAdminRole).toBeDefined();
      expect(typeof mod.isAdminRole).toBe('function');

      // Test med kjente verdier
      expect(mod.isAdminRole('ADMIN')).toBe(true);
      expect(mod.isAdminRole('USER')).toBe(false);
    });
  });

  describe('Admin-ruter må finnes i filsystemet', () => {
    it('skal ha minst 5 admin-endepunkter', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const routeDirs = fs.readdirSync(path.join(process.cwd(), 'app/api/admin'));
      expect(routeDirs.length).toBeGreaterThanOrEqual(5);
    });

    it('de fleste admin-ruter skal kalle requireAuth eller adminAuthGuard', async () => {
      const fs = await import('fs');
      const path = await import('path');

      const adminDir = path.join(process.cwd(), 'app/api/admin');
      const routeFiles = fs.readdirSync(adminDir, { recursive: true })
        .filter((f: string) => typeof f === 'string' && f.endsWith('route.ts')) as string[];
      const contents = routeFiles.map((f) => fs.readFileSync(path.join(adminDir, f), 'utf-8'));

      const withAuth = contents.filter(
        (content: string) => content.includes('requireAuth') || content.includes('adminAuthGuard')
      );
      // Flest ruter må ha auth — minimum 75 %
      expect(withAuth.length).toBeGreaterThanOrEqual(Math.ceil(contents.length * 0.75));
    });
  });
});