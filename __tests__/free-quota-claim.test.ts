/**
 * F2-2: Atomisk gratiskvote-claim (claimFreeQuota)
 *
 * Tidlegare var kvotegrensa check-then-create (count Order → create):
 * to samtidige onboardingar ved taket kunne begge seie «4 999 < 5 000»
 * og begge få plass. Noko som skal vere éin grense skal vere éin grense.
 *
 * claimFreeQuota gjer éin betinga UPDATE ... SET used = used+1
 * WHERE used < cap — Prisma mockane under låser kvit-avstandinga:
 * count=1 vinn plass, count=0 tyder at plassen var teken.
 */

jest.mock('@/lib/prisma', () => {
  const mockPrisma = {
    quota: {
      findUnique: jest.fn(),
      updateMany: jest.fn(),
    },
    order: {
      create: jest.fn(),
    },
  };
  return { __esModule: true, prisma: mockPrisma, default: mockPrisma };
});

import prisma from '@/lib/prisma';
import { claimFreeQuota, FREE_QUOTA_LIMIT } from '@/lib/payment/freeQuota';

const mockedPrisma = prisma as unknown as {
  quota: { findUnique: jest.Mock; updateMany: jest.Mock };
  order: { create: jest.Mock };
};

function mockQuotaRow(used: number) {
  mockedPrisma.quota.findUnique.mockResolvedValue({
    id: 'free_users',
    used,
    updatedAt: new Date(),
    createdAt: new Date(),
  });
}

describe('claimFreeQuota — atomisk kvote-claim', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('vinn grenseplassen ved taket: count=1 → order blir laga', async () => {
    mockQuotaRow(FREE_QUOTA_LIMIT - 1); // siste frie plass
    mockedPrisma.quota.updateMany.mockResolvedValue({ count: 1 });
    const fakeOrder = { id: 'ord_1', userId: 'u1', freeQuota: true, status: 'PAID' };
    mockedPrisma.order.create.mockResolvedValue(fakeOrder);

    const result = await claimFreeQuota('u1');

    expect(result).toBe(fakeOrder);
    // Betinga increment mot kvoteraden
    expect(mockedPrisma.quota.updateMany).toHaveBeenCalledWith({
      where: { id: 'free_users', used: { lt: FREE_QUOTA_LIMIT } },
      data: { used: { increment: 1 } },
    });
    expect(mockedPrisma.order.create).toHaveBeenCalledTimes(1);
  });

  it('returner null ved full kvota: count=0 → ingen order', async () => {
    mockQuotaRow(FREE_QUOTA_LIMIT);
    mockedPrisma.quota.updateMany.mockResolvedValue({ count: 0 });

    const result = await claimFreeQuota('u2');

    expect(result).toBeNull();
    expect(mockedPrisma.order.create).not.toHaveBeenCalled();
  });

  it('roller telleren attende dersom order-kreeringa feilar', async () => {
    mockQuotaRow(0);
    mockedPrisma.quota.updateMany
      .mockResolvedValueOnce({ count: 1 }) // claim-en
      .mockResolvedValueOnce({ count: 1 }); // rollback-en
    mockedPrisma.order.create.mockRejectedValue(new Error('db ned'));

    await expect(claimFreeQuota('u3')).rejects.toThrow('db ned');

    expect(mockedPrisma.quota.updateMany).toHaveBeenCalledTimes(2);
    // Rollback: decrement (ikkje betinga — plassen er vår no)
    expect(mockedPrisma.quota.updateMany).toHaveBeenLastCalledWith({
      where: { id: 'free_users' },
      data: { used: { decrement: 1 } },
    });
  });

  it('kastar dersom kvote-raden mangler (migreringa ikkje kjørd)', async () => {
    mockedPrisma.quota.findUnique.mockResolvedValue(null);

    await expect(claimFreeQuota('u4')).rejects.toThrow(/Quota-rad manglar/);
    expect(mockedPrisma.quota.updateMany).not.toHaveBeenCalled();
    expect(mockedPrisma.order.create).not.toHaveBeenCalled();
  });

  it('FREE_QUOTA_LIMIT er det same tallet vilkårene lover', async () => {
    expect(FREE_QUOTA_LIMIT).toBe(5000);
  });
});