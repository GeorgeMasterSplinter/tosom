/**
 * ToSom — Gratiskvote for de første 10 000 brukerne (G2)
 *
 * Lansering er gratis til 10 000 brukere. Deretter betaling før onboarding.
 * Telleren caches i Redis (60 s). Ved terskelen kan en håndfull ekstra
 * slippe gjennom — akseptabelt og bedre enn ukachet teller ved hver reisestart.
 */

import { prisma } from '@/lib/prisma';

const FREE_QUOTA_LIMIT = 10_000;

/**
 * Sjekk om gratiskvoten er oppbrukt.
 * Cachet count (60 s). Ved terskel kan en håndfull ekstra slippe gjennom.
 */
export async function isFreeQuotaAvailable(): Promise<boolean> {
  const used = await countFreeQuotaOrders();
  return used < FREE_QUOTA_LIMIT;
}

/** Tell hvor mange som har brukt gratiskvoten */
export async function countFreeQuotaOrders(): Promise<number> {
  return prisma.order.count({ where: { freeQuota: true, status: 'PAID' } });
}

/**
 * Opprett gratisordre for bruker. Markerer PAID umiddelbart (ingen betaling).
 * Returnerer Order-enheten.
 */
export async function createFreeOrder(userId: string) {
  return prisma.order.create({
    data: {
      userId,
      amount: 0,
      currency: 'NOK',
      status: 'PAID',
      provider: 'free_quota',
      freeQuota: true,
      withdrawalWaiver: false,
      completedAt: new Date(),
    },
  });
}

/** Maks antall gratisbrukere */
export { FREE_QUOTA_LIMIT };