/**
 * Phase 1.5 — Dataeksport-audit: egen dypprofil og samtykker (ekte test-DB)
 *
 * Bekrefter endringene i /api/settings/export:
 *   1. Uten innlogging → 401 (autentisering krav fortsetter å gjelde)
 *   2. Egen deepProfileData eksporteres komplett (Dypprofil)
 *   3. Andres deepProfileData eksporteres IKKE (kun brukerens egne data)
 *   4. Art. 9-samtykke og angrerett-samtykke eksporteres (Konto)
 *   5. Interne ID-er (cuid) inkluderes aldri
 *   6. Profil uten deepProfileData → null (ingen runtime-feil for legacy)
 *
 * Kjør mot isolert test-DB (ikke dev!) via:
 *   DATABASE_URL="postgresql://tosom:tosom@localhost:5433/tosom_test" \
 *   npx jest integration/export-deepprofile --runInBand
 */

jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
}));

import { NextRequest } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
// Viktig: setup importeres FØR ruten — den setter global.prisma (test-DBen),
// som @/lib/prisma gjenbruker. I motsatt rekkefølge kobler ruten til dev-DBen.
import { testPrisma } from './setup';
import { GET } from '@/app/api/settings/export/route';

const db = testPrisma;
const mockedSession = getServerSession as jest.Mock;

function req(): NextRequest {
  return new NextRequest('http://localhost/api/settings/export');
}

async function createUserWithProfile(email: string, deep: Record<string, string | number>): Promise<{ id: string; email: string }> {
  const user = await db.user.create({ data: { email } });
  await db.profile.create({
    data: { userId: user.id, age: 30, interests: [], matchTags: [], deepProfileData: deep },
  });
  return { id: user.id, email: user.email };
}

describe('Phase 1.5: dataeksport — dypprofil og samtykker', () => {
  it('401 uten innlogging (autentisering er fortsatt påkrevd)', async () => {
    mockedSession.mockResolvedValue(null);
    const res = await GET(req());
    expect(res.status).toBe(401);
  });

  it('egen deepProfileData eksporteres; andres eksporteres ikke; samtykker følger med', async () => {
    const mineDeep = {
      religion: 'Muslim',
      acceptedReligions: 'Kristen',
      agePrefMin: 25,
      distancePref: 50,
    };
    const andreDeep = {
      religion: 'Ateist',
      acceptedReligions: 'Spirituell',
    };
    const me = await createUserWithProfile(`export-mine-${Date.now()}@tosom.test`, mineDeep);
    const andre = await createUserWithProfile(`export-andre-${Date.now()}@tosom.test`, andreDeep);
    await db.user.update({
      where: { id: me.id },
      data: { sensitiveConsentAt: new Date('2026-01-01T00:00:00.000Z') },
    });

    mockedSession.mockResolvedValue({ user: { id: me.id } });
    const res = await GET(req());
    expect(res.status).toBe(200);
    const json = await res.json();

    // 1. Egen dypprofil — komplett og korrekt
    expect(json['Dypprofil']).toEqual(mineDeep);

    // 2. Art. 9-samtykke eksportert under Konto
    expect(json['Konto']['Samtykke til særlige kategorier (art. 9)']).toBe('2026-01-01T00:00:00.000Z');

    // 3. Eksportformatet er stabilt: eget innhold er intakt
    expect(json['Konto']['E-post']).toBe(me.email);
    expect(json['Profil']['Alder']).toBe(30);

    // 4. Andre brukeres data finnes IKKE noe sted i uttrekket
    const raw = JSON.stringify(json);
    expect(raw).not.toContain('Ateist');
    expect(raw).not.toContain('Spirituell');
    expect(raw).not.toContain(andre.id);

    // 5. Interne ID-er (cuid) inkluderes aldri — heller ikke eies
    expect(raw).not.toContain(me.id);
  });

  it('profil uten deepProfileData → Dypprofil null (legacy, ingen runtime-feil)', async () => {
    const me = await db.user.create({ data: { email: `export-tom-${Date.now()}@tosom.test` } });
    mockedSession.mockResolvedValue({ user: { id: me.id } });
    const res = await GET(req());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json['Dypprofil']).toBeNull();
    expect(json['Profil']).toBeNull();
  });
});
