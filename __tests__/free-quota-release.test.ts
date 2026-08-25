/**
 * A4: Frigjøring av gratisplass (releaseFreeQuota)
 *
 * claimFreeQuota ruller kun tilbake hvis selve Order-opprettingen feiler.
 * Feiler noe ETTER at plassen er claimet — for eksempel kø-transaksjonen i
 * /api/journey/queue — var plassen tidligere brent permanent: telleren var
 * økt, men ingen fikk en reise. Gratiskvoten krympet for hver slike feil.
 *
 * releaseFreeQuota gir plassen tilbake og sletter gratisordren, slik at
 * Quota-telleren og Order-tellingen (audit-loggen) forblir enige.
 */

jest.mock('@/lib/prisma', () => {
  const mockPrisma = {
    quota: {
      findUnique: jest.fn(),
      updateMany: jest.fn(),
    },
    order: {
      create: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { __esModule: true, prisma: mockPrisma, default: mockPrisma };
});

import prisma from '@/lib/prisma';
import { releaseFreeQuota } from '@/lib/payment/freeQuota';

const mockedPrisma = prisma as unknown as {
  quota: { findUnique: jest.Mock; updateMany: jest.Mock };
  order: { create: jest.Mock; delete: jest.Mock };
};

describe('releaseFreeQuota — gir tilbake en ubrukt gratisplass', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sletter ordren og teller kvoten ned igjen', async () => {
    mockedPrisma.order.delete.mockResolvedValue({ id: 'ord_1' });
    mockedPrisma.quota.updateMany.mockResolvedValue({ count: 1 });

    await releaseFreeQuota('ord_1');

    expect(mockedPrisma.order.delete).toHaveBeenCalledWith({
      where: { id: 'ord_1' },
    });
    // Betinget decrement: used > 0 hindrer at telleren går i minus.
    expect(mockedPrisma.quota.updateMany).toHaveBeenCalledWith({
      where: { id: 'free_users', used: { gt: 0 } },
      data: { used: { decrement: 1 } },
    });
  });

  it('retter telleren selv om ordren allerede er borte', async () => {
    mockedPrisma.order.delete.mockRejectedValue(new Error('ikke funnet'));
    mockedPrisma.quota.updateMany.mockResolvedValue({ count: 1 });

    await expect(releaseFreeQuota('ord_2')).resolves.toBeUndefined();

    // Ordren feilet, men plassen skal likevel gis tilbake.
    expect(mockedPrisma.quota.updateMany).toHaveBeenCalledTimes(1);
  });

  it('kaster aldri — den kjører i en feilhåndteringssti', async () => {
    mockedPrisma.order.delete.mockRejectedValue(new Error('db nede'));
    mockedPrisma.quota.updateMany.mockRejectedValue(new Error('db nede'));

    // Skal aldri skygge for den opprinnelige feilen som utløste frigjøringen.
    await expect(releaseFreeQuota('ord_3')).resolves.toBeUndefined();
  });

  it('teller aldri under null ved dobbel frigjøring', async () => {
    mockedPrisma.order.delete.mockResolvedValue({ id: 'ord_4' });
    // Andre gang matcher ingen rad fordi used allerede er 0.
    mockedPrisma.quota.updateMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 0 });

    await releaseFreeQuota('ord_4');
    await releaseFreeQuota('ord_4');

    // Begge kall bruker used > 0 som vakt.
    expect(mockedPrisma.quota.updateMany).toHaveBeenLastCalledWith({
      where: { id: 'free_users', used: { gt: 0 } },
      data: { used: { decrement: 1 } },
    });
  });
});
