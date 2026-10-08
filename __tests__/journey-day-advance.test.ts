// ═══════════════════════════════════════════
// ToSom — journeyDayFor (PL-06 / K-4) unit tests
// ═══════════════════════════════════════════
// Dag 1 = startdøgnet (norsk tid), beregnet deterministisk fra bothSeenAt.
// Begrenset til 1–30, og DST-sikker (Oslo-kalenderdager).
//

import { journeyDayFor, JOURNEY_TOTAL_DAYS } from '@/lib/journey/engine';

// Bygger et tidspunkt kl. 12:00 UTC. I Oslo er dette alltid kl. 13:00/14:00
// samme dato (UTC+1 om vinteren, UTC+2 om sommeren), så Oslo-datoen blir
// nøyaktig den oppgitte — uavhengig av sommertid/vintertid.
const oslo = (dato: string): Date => new Date(`${dato}T12:00:00Z`);

describe('journeyDayFor (PL-06 / K-4)', () => {
  test('startdøgnet er dag 1', () => {
    expect(journeyDayFor(oslo('2026-01-10'), oslo('2026-01-10'))).toBe(1);
  });

  test('ett døgn etter start er dag 2', () => {
    expect(journeyDayFor(oslo('2026-01-10'), oslo('2026-01-11'))).toBe(2);
  });

  test('den 14. dagen er dag 14 (start = dag 1)', () => {
    expect(journeyDayFor(oslo('2026-01-01'), oslo('2026-01-14'))).toBe(14);
  });

  test('den siste dagen er dag 30', () => {
    expect(journeyDayFor(oslo('2026-01-01'), oslo('2026-01-30'))).toBe(30);
  });

  test('klampes til 30 etter reisens slutt', () => {
    const dag = journeyDayFor(oslo('2026-01-01'), oslo('2026-06-01'));
    expect(dag).toBe(30);
    expect(dag).toBe(JOURNEY_TOTAL_DAYS);
  });

  test('klampes til 1 hvis now er før start (forsvarlig)', () => {
    expect(journeyDayFor(oslo('2026-01-10'), oslo('2026-01-09'))).toBe(1);
  });

  test('DST vintertid → sommertid (klokka springer frem)', () => {
    // 3 kalenderdager = dag 4, uavhengig av at overgangsdøgnet er 23 timer.
    expect(journeyDayFor(oslo('2026-03-27'), oslo('2026-03-30'))).toBe(4);
  });

  test('DST sommertid → vintertid (klokka går tilbake)', () => {
    // 3 kalenderdager = dag 4, uavhengig av at overgangsdøgnet er 25 timer.
    expect(journeyDayFor(oslo('2026-10-23'), oslo('2026-10-26'))).toBe(4);
  });

  test('begge partnere med felles bothSeenAt får identisk dag', () => {
    const bothSeenAt = oslo('2026-02-03');
    const now = oslo('2026-02-17');
    const partnerA = journeyDayFor(bothSeenAt, now);
    const partnerB = journeyDayFor(bothSeenAt, now);
    expect(partnerA).toBe(partnerB);
    expect(partnerA).toBe(15); // 14 døgn etter start = dag 15
  });

  test('cron fanger opp utilsatte døgn (beregnet, ikke talt)', () => {
    // Cronen hoppet over flere døgn — beregningen lander likevel på riktig dag.
    const bothSeenAt = oslo('2026-04-01');
    const now = oslo('2026-04-07'); // 6 døgn etter start = dag 7
    expect(journeyDayFor(bothSeenAt, now)).toBe(7);
  });
});
