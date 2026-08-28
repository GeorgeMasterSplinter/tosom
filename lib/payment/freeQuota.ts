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

/* ═══════════ F2-2: Atomisk kvote-claim (race-fri grense) ═══════════ */

/** Nøkkelen til gratiskvote-raden i Quota-tabellen. */
const FREE_QUOTA_KEY = 'free_users';

/**
 * F2-2: Atomisk claim av éin gratisbrukar-plass.
 *
 * Tidlegare var dette check-then-create (countFreeQuotaOrders → create)
 * — to samtidige onboardingar ved taket kunne begge seie «4 999 < 5 000»
 * og begge få plass. Noe som skal være éin grense skal være éin grense.
 *
 * Mekanismen: éin betinga
 *   UPDATE "Quota" SET "used" = "used" + 1
 *   WHERE "id" = 'free_users' AND "used" < cap
 * Postgres sin row-lock seriariserer samtidige oppdateringar av same
 * rad: den andre ser den oppdaterte verdien og matcher ikke lenger
 * WHERE-klausulen → count = 0 → kvota full. Ingen overskriding.
 *
 * @returns Order-enheiten ved suksess, null dersom kvota er full.
 * @throws dersom Order-kreeringa feilar (telleren blir da rolla tilbake)
 */
export async function claimFreeQuota(userId: string) {
  const row = await prisma.quota.findUnique({ where: { id: FREE_QUOTA_KEY } });
  if (!row) {
    // Skulle ikke skje: migrasjonen seeder raden. Feil skal høres — ikke
    // tyst gjennomslag ved ukjend teller.
    throw new Error(`Quota-rad manglar (${FREE_QUOTA_KEY}) — køyr migreringa`);
  }

  const result = await prisma.quota.updateMany({
    where: { id: FREE_QUOTA_KEY, used: { lt: FREE_QUOTA_LIMIT } },
    data: { used: { increment: 1 } },
  });

  if (result.count === 0) {
    return null; // grenseplassen ble teken (eller kvota er full)
  }

  try {
    return await createFreeOrder(userId);
  } catch (err) {
    // Order feilet — gi plassen tilbake slik at telleren ikke driver
    // fra Order-tellingen (admin-panelet leser den).
    await prisma.quota
      .updateMany({
        where: { id: FREE_QUOTA_KEY },
        data: { used: { decrement: 1 } },
      })
      .catch(() => {});
    throw err;
  }
}

/**
 * A4: Gi tilbake én gratisplass som ble claimet, men aldri tatt i bruk.
 *
 * claimFreeQuota() ruller kun tilbake hvis selve Order-opprettingen feiler.
 * Feiler noe ETTER at plassen er claimet — for eksempel kø-transaksjonen i
 * /api/journey/queue — er telleren allerede økt uten at noen fikk en reise.
 * Plassen ville da vært brent permanent: gratiskvoten krymper for hver slike
 * feil, og en bruker som prøver igjen får «Gratiskvoten er oppbrukt».
 *
 * Sletter også gratisordren, slik at Quota-telleren og Order-tellingen
 * (audit-loggen admin-panelet leser) forblir enige.
 *
 * Best-effort: kaster aldri — dette kjører i en feilhåndteringssti, og skal
 * aldri skygge for den opprinnelige feilen.
 */
export async function releaseFreeQuota(orderId: string): Promise<void> {
  try {
    await prisma.order.delete({ where: { id: orderId } });
  } catch {
    /* ordren finnes ikke lenger — fortsett og rett opp telleren */
  }

  try {
    // used > 0 hindrer at telleren kan gå i minus ved dobbelt frigjøring.
    await prisma.quota.updateMany({
      where: { id: FREE_QUOTA_KEY, used: { gt: 0 } },
      data: { used: { decrement: 1 } },
    });
  } catch {
    /* telleren skal aldri velte feilhåndteringen */
  }
}