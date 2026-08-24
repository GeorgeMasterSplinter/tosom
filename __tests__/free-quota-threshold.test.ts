/**
 * ToSom — Gratiskvote- og reisekø-terskler (admin-panelet)
 *
 * Panelet må vise det samme tallet produktet håndhever:
 * kvotetak = PRICING.freeUserCap (config/legal.ts) — samme tall som
 * vilkårene lover. Tidligere var 8000/9500 hardkodet mot et 10 000-tak
 * som aldri har eksistert; nå er tersklene relative (80 %/95 % av taket).
 */

import { PRICING } from '@/config/legal';
import {
  thresholdFreeQuota,
  thresholdPendingJourneys,
} from '@/components/admin/StatusBadge';

describe('thresholdFreeQuota — relativ mot PRICING.freeUserCap', () => {
  const cap = PRICING.freeUserCap;

  it('bruker kvotetaket fra vilkårene som standard tak', () => {
    expect(cap).toBe(5000);
    expect(thresholdFreeQuota(0)).toBe('ok');
  });

  it('ok inntil 80 % av taket', () => {
    expect(thresholdFreeQuota(Math.floor(cap * 0.8) - 1)).toBe('ok');
  });

  it('warn mellom 80 % og 95 % av taket', () => {
    expect(thresholdFreeQuota(cap * 0.8)).toBe('warn');
    expect(thresholdFreeQuota(cap * 0.95)).toBe('warn');
  });

  it('critical over 95 % av taket', () => {
    expect(thresholdFreeQuota(cap * 0.95 + 1)).toBe('critical');
    expect(thresholdFreeQuota(cap)).toBe('critical');
  });

  it('fungerer med eksplisitt tak (f.eks. oppjustert kvote)', () => {
    expect(thresholdFreeQuota(1599, 2000)).toBe('ok');
    expect(thresholdFreeQuota(1600, 2000)).toBe('warn');
    expect(thresholdFreeQuota(1901, 2000)).toBe('critical');
  });

  it('er robust mot degenerert tak', () => {
    expect(thresholdFreeQuota(0, 0)).toBe('ok');
    expect(thresholdFreeQuota(5, 0)).toBe('critical');
  });
});

describe('thresholdPendingJourneys', () => {
  it('0 = ok (alt er framrykt)', () => {
    expect(thresholdPendingJourneys(0)).toBe('ok');
  });

  it('1–99 = warn (selvkorrigeres ved timebasert cron)', () => {
    expect(thresholdPendingJourneys(1)).toBe('warn');
    expect(thresholdPendingJourneys(99)).toBe('warn');
  });

  it('≥ 100 = critical (cronen kjører kanskje ikke)', () => {
    expect(thresholdPendingJourneys(100)).toBe('critical');
  });
});
