/**
 * ToSom — B1.2/B1.3 Funksjonell verifisering av POST /api/profile/setup (geo)
 */

jest.mock('@/lib/auth/session', () => ({
  getServerSession: jest.fn(),
}));
jest.mock('@/lib/prisma', () => ({
  prisma: {
    profile: { upsert: jest.fn(), update: jest.fn() },
    user: { update: jest.fn() },
    $disconnect: jest.fn(),
  },
}));

import { getServerSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma';
import { POST } from '@/app/api/profile/setup/route';

const mockedSession = getServerSession as jest.Mock;
const mockedPrisma = prisma as unknown as {
  profile: { upsert: jest.Mock; update: jest.Mock };
  user: { update: jest.Mock };
};

const UID = 'b12_user';

function validBody(): any {
  return {
    basic: {
      identityName: 'Testbruker',
      age: 30,
      gender: 'Kvinne',
      seekingGender: 'Mann',
      city: 'Bergen',
      postalCode: '5003',
      distancePref: 50,
      agePrefMin: 23,
      agePrefMax: 40,
    },
    personlighet: { selfDesc: 'Jeg liker natur, musikk og gode samtaler om livet.' },
    livssituasjon: {},
    tilknytning: {},
    kommunikasjon: {},
    kjaerlighet: {},
    livsstil: {},
    relasjonsStil: {},
    fremtid: {},
    humor: {},
    grenser: {},
    moden: {},
    preferanser: {},
  };
}

function request(body: any): any {
  return new Request('http://localhost/api/profile/setup', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/profile/setup (B1.2/B1.3 geo)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedSession.mockResolvedValue({ user: { id: UID } });
  });

  it('skriver postalCode som kolonne + utleder lat/lon for 5003 (Bergen)', async () => {
    mockedPrisma.profile.upsert.mockResolvedValue({});
    mockedPrisma.user.update.mockResolvedValue({});

    const res = await POST(request(validBody()));
    expect(res.status).toBe(200);
    expect(mockedPrisma.profile.upsert).toHaveBeenCalledTimes(1);

    const call = mockedPrisma.profile.upsert.mock.calls[0][0];
    expect(call.update.postalCode).toBe('5003');
    expect(call.update.latitude).toBeCloseTo(60.39, 1);
    expect(call.update.longitude).toBeCloseTo(5.31, 1);
    expect(call.create.postalCode).toBe('5003');
    expect(call.create.latitude).toBeCloseTo(60.39, 1);
    expect(call.create.longitude).toBeCloseTo(5.31, 1);
  });

  it('Oslo 0150 → ~59.89/10.72 (sanity mot kjent sted)', async () => {
    mockedPrisma.profile.upsert.mockResolvedValue({});
    mockedPrisma.user.update.mockResolvedValue({});

    const body = validBody();
    body.basic.postalCode = '0150';
    body.basic.city = 'Oslo';

    await POST(request(body));

    const call = mockedPrisma.profile.upsert.mock.calls[0][0];
    expect(call.update.postalCode).toBe('0150');
    expect(call.update.latitude).toBeCloseTo(59.89, 1);
    expect(call.update.longitude).toBeCloseTo(10.72, 1);
  });

  it('ugyldig postnummer ("12") → 400 og INGEN lagring', async () => {
    const body = validBody();
    body.basic.postalCode = '12';

    const res = await POST(request(body));
    expect(res.status).toBe(400);
    expect(mockedPrisma.profile.upsert).not.toHaveBeenCalled();
  });

  it('ugyldig postnummer ("abcd") → 400 og INGEN lagring', async () => {
    const body = validBody();
    body.basic.postalCode = 'abcd';

    const res = await POST(request(body));
    expect(res.status).toBe(400);
    expect(mockedPrisma.profile.upsert).not.toHaveBeenCalled();
  });
});
