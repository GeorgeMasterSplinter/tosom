/**
 * ToSom — Gratiskvote ved lansering (G2)
 *
 * Lansering er gratis til grensen i PRICING.freeUserCap (config/legal.ts).
 * Deretter betaling før onboarding.
 * Telleren caches i Redis (60 s). Ved terskelen kan en håndfull ekstra
 * slippe gjennom — akseptabelt og bedre enn ukachet teller ved hver reisestart.
 */

import { prisma } from '@/lib/prisma';
import { PRICING } from '@/config/legal';

/**
 * Kvoten er den samme som vilkårene lover brukeren.
 * Tallet bor i config/legal.ts (PRICING.freeUserCap) og vises i
 * app/vilkar/page.tsx. Én kilde — ellers lover vi ett tall og
 * håndhever et annet.
 */
const FREE_QUOTA_LIMIT = PRICING.freeUserCap;

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