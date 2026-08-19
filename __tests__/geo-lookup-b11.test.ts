/**
 * ToSom — B1.1: Enhetstest for postnummer-opplesing
 */
import {
  lookupPostalCode,
  postalCodeCount,
  postalCodeCountWithCoords,
} from '@/lib/geo/lookup';

describe('lookupPostalCode (B1.1)', () => {
  it('returnerer Oslo-koordinater for 0150', () => {
    const r = lookupPostalCode('0150');
    expect(r).not.toBeNull();
    expect(r!.sted.toLowerCase()).toBe('oslo');
    expect(r!.lat).toBeGreaterThan(0);
    expect(r!.lon).toBeGreaterThan(0);
  });

  it('returnerer null for ukjend postnummer (9999)', () => {
    expect(lookupPostalCode('9999')).toBeNull();
  });

  it('returnerer null for ikke-numerisk/feil format (abc, 123, 12345)', () => {
    expect(lookupPostalCode('abc')).toBeNull();
    expect(lookupPostalCode('123')).toBeNull();
    expect(lookupPostalCode('12345')).toBeNull();
    expect(lookupPostalCode('')).toBeNull();
  });

  it('returnerer koordinater for kjente steder (Oslo, Bergen, Tromsø)', () => {
    const oslo = lookupPostalCode('0150');
    expect(oslo!.lat).toBeCloseTo(59.91, 1); // ~59,91
    expect(oslo!.lon).toBeCloseTo(10.75, 1); // ~10,75

    const bergen = lookupPostalCode('5003');
    expect(bergen!.lat).toBeCloseTo(60.39, 1); // ~60,39
    expect(bergen!.lon).toBeCloseTo(5.32, 1); // ~5,32

    const tromso = lookupPostalCode('9008');
    expect(tromso!.lat).toBeCloseTo(69.65, 1); // ~69,65
    expect(tromso!.lon).toBeCloseTo(18.96, 1); // ~18,96
  });

  it('datasettet har 100 % koordinat-dekning (dag 10: 0 uten koordinater)', () => {
    const total = postalCodeCount();
    const withCoords = postalCodeCountWithCoords();
    expect(total).toBeGreaterThan(4000); // gate-kriterium: > 4000 keys
    expect(withCoords).toBe(total); // 100 % — ingen postnummer uten sentrumspunkt
  });

  it('koordinater er innenfor Norges geografiske område', () => {
    for (const code of ['0150', '5003', '7010', '9008', '6002', '8006']) {
      const r = lookupPostalCode(code);
      expect(r).not.toBeNull();
      if (r!.lat != null && r!.lon != null) {
        expect(r!.lat).toBeGreaterThan(57);
        expect(r!.lat).toBeLessThan(71.5);
        expect(r!.lon).toBeGreaterThan(4);
        expect(r!.lon).toBeLessThan(32);
      }
    }
  });
});