/**
 * ToSom — Matcherunde-watchdog (B5.6)
 *
 * Watchdoggen må kun fyre når lørdagsrunden virkelig uteble — aldri i en
 * normal uke. Den gamle 26-timers terskelen fyrte hver natt mandag–fredag
 * (falske alarme), så disse testene låser den ukentlige logikken.
 */
import {
  inMatchingRoundWindow,
  lastSaturdayRoundStart,
  matchingRoundMissed,
} from '@/lib/cron/matchingWatchdog';

// 10.10.2026 er lørdag, 17.10.2026 er lørdag, 18.10.2026 er søndag.
const satOct10 = (hour: number, minute = 0) => new Date(Date.UTC(2026, 9, 10, hour, minute, 0));
const satOct17 = (hour: number, minute = 0) => new Date(Date.UTC(2026, 9, 17, hour, minute, 0));

describe('matchingWatchdog', () => {
  describe('lastSaturdayRoundStart', () => {
    it('søndag 00:05 → denne ukes lørdag 02:00', () => {
      const now = new Date(Date.UTC(2026, 9, 18, 0, 5, 0));
      expect(lastSaturdayRoundStart(now)).toEqual(satOct17(2));
    });

    it('lørdag 00:05 (før runden) → forrige ukes lørdag 02:00', () => {
      const now = new Date(Date.UTC(2026, 9, 17, 0, 5, 0));
      expect(lastSaturdayRoundStart(now)).toEqual(satOct10(2));
    });

    it('mandag 00:05 → denne ukes lørdag 02:00', () => {
      const now = new Date(Date.UTC(2026, 9, 19, 0, 5, 0));
      expect(lastSaturdayRoundStart(now)).toEqual(satOct17(2));
    });
  });

  describe('inMatchingRoundWindow', () => {
    it('telger logger inne i lørdagsvinduet 02:00–05:00 UTC', () => {
      expect(inMatchingRoundWindow(satOct10(2, 5))).toBe(true);
      expect(inMatchingRoundWindow(satOct10(3, 10))).toBe(true);
      expect(inMatchingRoundWindow(satOct10(4, 5))).toBe(true);
    });

    it('telger ikke logger utenfor vinduet eller på ukedager', () => {
      expect(inMatchingRoundWindow(satOct10(1, 59))).toBe(false);
      expect(inMatchingRoundWindow(satOct10(5, 0))).toBe(false);
      // onsdag 03:00
      expect(inMatchingRoundWindow(new Date(Date.UTC(2026, 9, 14, 3, 0, 0)))).toBe(false);
    });
  });

  describe('matchingRoundMissed', () => {
    it('normal uke: runden kjørte lørdag 03:10 → søndag 00:05 fyrer ikke', () => {
      const now = new Date(Date.UTC(2026, 9, 18, 0, 5, 0));
      expect(matchingRoundMissed(now, [satOct17(3, 10)])).toBe(false);
    });

    it('utenble runde: siste logg fra forrige uke → søndag 00:05 fyrer', () => {
      const now = new Date(Date.UTC(2026, 9, 18, 0, 5, 0));
      expect(matchingRoundMissed(now, [satOct10(3, 10)])).toBe(true);
    });

    it('fredag 00:05 i en normal uke: forrige runde er ~140 timer siden, men det er OK', () => {
      const now = new Date(Date.UTC(2026, 9, 16, 0, 5, 0));
      expect(matchingRoundMissed(now, [satOct10(3, 10)])).toBe(false);
    });

    it('lørdag 00:05 før runden: forrige ukes runde teller → fyrer ikke', () => {
      const now = new Date(Date.UTC(2026, 9, 17, 0, 5, 0));
      expect(matchingRoundMissed(now, [satOct10(3, 10)])).toBe(false);
    });

    it('manuell runde en ukedag teller ikke som lørdagsrunden', () => {
      const now = new Date(Date.UTC(2026, 9, 18, 0, 5, 0));
      const manuellOnsdag = new Date(Date.UTC(2026, 9, 14, 12, 0, 0));
      expect(matchingRoundMissed(now, [manuellOnsdag, satOct10(3, 10)])).toBe(true);
    });

    it('ingen logger i det hele tatt → true (ruten sender critical i steden)', () => {
      const now = new Date(Date.UTC(2026, 9, 18, 0, 5, 0));
      expect(matchingRoundMissed(now, [])).toBe(true);
    });
  });
});
