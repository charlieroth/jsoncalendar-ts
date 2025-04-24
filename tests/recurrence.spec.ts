import { describe, it, expect } from 'vitest';
import { 
  parseRecurrence, 
  matchesByDay, 
  matchesByMonthDay, 
  applyRecurrenceFilters,
  getOccurrences 
} from '../src/recurrence';
import { Recurrence } from '../src/types/recurrence';
import { Event } from '../src/types/event';

describe('Recurrence Functions', () => {
  describe('parseRecurrence', () => {
    it('should apply defaults correctly', () => {
      const recurrence: Recurrence = {
        frequency: 'day'
      };

      const parsed = parseRecurrence(recurrence);
      expect(parsed.interval).toBe(1);
      expect(parsed.weekStart).toBe('MO');
      expect(parsed.exceptionDates).toEqual([]);
      expect(parsed.recurrenceAdditions).toEqual([]);
    });

    it('should parse date strings to Date objects', () => {
      const recurrence: Recurrence = {
        frequency: 'day',
        until: '2023-01-01T00:00:00Z',
        exceptionDates: ['2022-12-25T00:00:00Z'],
        recurrenceAdditions: ['2022-12-26T00:00:00Z']
      };

      const parsed = parseRecurrence(recurrence);
      expect(parsed.until).toBeInstanceOf(Date);
      expect(parsed.until?.toISOString()).toBe('2023-01-01T00:00:00.000Z');
      expect(parsed.exceptionDates[0]).toBeInstanceOf(Date);
      expect(parsed.exceptionDates[0].toISOString()).toBe('2022-12-25T00:00:00.000Z');
      expect(parsed.recurrenceAdditions[0]).toBeInstanceOf(Date);
      expect(parsed.recurrenceAdditions[0].toISOString()).toBe('2022-12-26T00:00:00.000Z');
    });

    it('should throw an error for invalid recurrence rules', () => {
      const recurrence: Recurrence = {};
      expect(() => parseRecurrence(recurrence)).toThrow();
    });
  });

  describe('matchesByDay', () => {
    it('should match simple weekday rules', () => {
      // Sunday
      const sunday = new Date('2023-01-01T12:00:00Z');
      expect(matchesByDay(sunday, ['SU'])).toBe(true);
      expect(matchesByDay(sunday, ['MO'])).toBe(false);
      
      // Monday
      const monday = new Date('2023-01-02T12:00:00Z');
      expect(matchesByDay(monday, ['MO'])).toBe(true);
      expect(matchesByDay(monday, ['TU'])).toBe(false);
    });

    it('should return true when byDay is empty or undefined', () => {
      const date = new Date();
      expect(matchesByDay(date, [])).toBe(true);
      expect(matchesByDay(date, undefined)).toBe(true);
    });
  });

  describe('matchesByMonthDay', () => {
    it('should match positive monthDay rules', () => {
      const date1 = new Date('2023-01-15T12:00:00Z'); // 15th of the month
      expect(matchesByMonthDay(date1, [15])).toBe(true);
      expect(matchesByMonthDay(date1, [16])).toBe(false);
    });

    it('should match negative monthDay rules (counting from end)', () => {
      // January has 31 days, so -1 is the 31st, -2 is 30th, etc.
      const date = new Date('2023-01-30T12:00:00Z'); // Second to last day
      expect(matchesByMonthDay(date, [-2])).toBe(true);
      expect(matchesByMonthDay(date, [-1])).toBe(false);
    });

    it('should return true when byMonthDay is empty or undefined', () => {
      const date = new Date();
      expect(matchesByMonthDay(date, [])).toBe(true);
      expect(matchesByMonthDay(date, undefined)).toBe(true);
    });
  });

  describe('applyRecurrenceFilters', () => {
    it('should filter out exception dates', () => {
      const dates = [
        new Date('2023-01-01T12:00:00Z'),
        new Date('2023-01-08T12:00:00Z'),
        new Date('2023-01-15T12:00:00Z')
      ];
      
      const parsed = {
        interval: 1,
        weekStart: 'MO' as const,
        exceptionDates: [new Date('2023-01-08T12:00:00Z')],
        recurrenceAdditions: []
      };
      
      const result = applyRecurrenceFilters(dates, parsed);
      expect(result).toHaveLength(2);
      expect(result[0].toISOString()).toBe('2023-01-01T12:00:00.000Z');
      expect(result[1].toISOString()).toBe('2023-01-15T12:00:00.000Z');
    });

    it('should add recurrence additions', () => {
      const dates = [
        new Date('2023-01-01T12:00:00Z'),
        new Date('2023-01-15T12:00:00Z')
      ];
      
      const parsed = {
        interval: 1,
        weekStart: 'MO' as const,
        exceptionDates: [],
        recurrenceAdditions: [new Date('2023-01-08T12:00:00Z')]
      };
      
      const result = applyRecurrenceFilters(dates, parsed);
      expect(result).toHaveLength(3);
      expect(result[0].toISOString()).toBe('2023-01-01T12:00:00.000Z');
      expect(result[1].toISOString()).toBe('2023-01-08T12:00:00.000Z');
      expect(result[2].toISOString()).toBe('2023-01-15T12:00:00.000Z');
    });

    it('should sort dates after applying filters', () => {
      const dates = [
        new Date('2023-01-15T12:00:00Z'),
        new Date('2023-01-01T12:00:00Z')
      ];
      
      const parsed = {
        interval: 1,
        weekStart: 'MO' as const,
        exceptionDates: [],
        recurrenceAdditions: [new Date('2023-01-08T12:00:00Z')]
      };
      
      const result = applyRecurrenceFilters(dates, parsed);
      expect(result).toHaveLength(3);
      expect(result[0].toISOString()).toBe('2023-01-01T12:00:00.000Z');
      expect(result[1].toISOString()).toBe('2023-01-08T12:00:00.000Z');
      expect(result[2].toISOString()).toBe('2023-01-15T12:00:00.000Z');
    });
  });

  describe('getOccurrences', () => {
    // Test for non-recurring events
    it('should return a single event for non-recurring events in range', () => {
      const event: Event = {
        uid: 'test-event',
        summary: 'Test Event',
        start: '2023-01-15T12:00:00Z',
        end: '2023-01-15T13:00:00Z'
      };

      const result = getOccurrences(
        event,
        '2023-01-01T00:00:00Z',
        '2023-01-31T23:59:59Z'
      );

      expect(result).toHaveLength(1);
      expect(result[0].uid).toBe('test-event');
      expect(result[0].start).toBe('2023-01-15T12:00:00.000Z');
    });

    it('should return empty array for non-recurring events outside range', () => {
      const event: Event = {
        uid: 'test-event',
        summary: 'Test Event',
        start: '2023-02-15T12:00:00Z',
        end: '2023-02-15T13:00:00Z'
      };

      const result = getOccurrences(
        event,
        '2023-01-01T00:00:00Z',
        '2023-01-31T23:59:59Z'
      );

      expect(result).toHaveLength(0);
    });

    // Test for daily recurrence
    it('should generate daily occurrences', () => {
      const event: Event = {
        uid: 'daily-event',
        summary: 'Daily Event',
        start: '2023-01-01T12:00:00Z',
        end: '2023-01-01T13:00:00Z',
        recurrence: {
          frequency: 'day',
          interval: 1
        }
      };

      const result = getOccurrences(
        event,
        '2023-01-01T00:00:00Z',
        '2023-01-05T23:59:59Z'
      );

      expect(result).toHaveLength(5);
      expect(result[0].start).toBe('2023-01-01T12:00:00.000Z');
      expect(result[1].start).toBe('2023-01-02T12:00:00.000Z');
      expect(result[2].start).toBe('2023-01-03T12:00:00.000Z');
      expect(result[3].start).toBe('2023-01-04T12:00:00.000Z');
      expect(result[4].start).toBe('2023-01-05T12:00:00.000Z');
    });

    // Test for weekly recurrence with byDay
    it('should generate weekly occurrences with byDay', () => {
      const event: Event = {
        uid: 'weekly-event',
        summary: 'Weekly Event',
        start: '2023-01-02T12:00:00Z', // Monday
        end: '2023-01-02T13:00:00Z',
        recurrence: {
          frequency: 'week',
          interval: 1,
          byDay: ['MO', 'WE', 'FR'] // Monday, Wednesday, Friday
        }
      };

      const result = getOccurrences(
        event,
        '2023-01-02T00:00:00Z', // Monday
        '2023-01-08T23:59:59Z'  // Sunday
      );

      // Should get Monday, Wednesday, Friday
      expect(result).toHaveLength(3);
      
      // Verify dates are Monday, Wednesday, Friday
      const dates = result.map(e => new Date(e.start));
      expect(dates[0].getUTCDay()).toBe(1); // Monday
      expect(dates[1].getUTCDay()).toBe(3); // Wednesday
      expect(dates[2].getUTCDay()).toBe(5); // Friday
    });

    // Test for monthly recurrence with byMonthDay
    it('should generate monthly occurrences with byMonthDay', () => {
      const event: Event = {
        uid: 'monthly-event',
        summary: 'Monthly Event',
        start: '2023-01-15T12:00:00Z',
        end: '2023-01-15T13:00:00Z',
        recurrence: {
          frequency: 'month',
          interval: 1,
          byMonthDay: [15, 20] // 15th and 20th of each month
        }
      };

      const result = getOccurrences(
        event,
        '2023-01-01T00:00:00Z',
        '2023-02-28T23:59:59Z'
      );

      // Should get Jan 15, Jan 20, Feb 15, Feb 20
      expect(result).toHaveLength(4);
      expect(result[0].start).toBe('2023-01-15T12:00:00.000Z');
      expect(result[1].start).toBe('2023-01-20T12:00:00.000Z');
      expect(result[2].start).toBe('2023-02-15T12:00:00.000Z');
      expect(result[3].start).toBe('2023-02-20T12:00:00.000Z');
    });

    // Test for recurrence with count limit
    it('should respect count limit in recurrence', () => {
      const event: Event = {
        uid: 'count-event',
        summary: 'Count Limited Event',
        start: '2023-01-01T12:00:00Z',
        end: '2023-01-01T13:00:00Z',
        recurrence: {
          frequency: 'day',
          interval: 1,
          count: 3 // Only 3 occurrences
        }
      };

      const result = getOccurrences(
        event,
        '2023-01-01T00:00:00Z',
        '2023-01-31T23:59:59Z'
      );

      expect(result).toHaveLength(3);
      expect(result[0].start).toBe('2023-01-01T12:00:00.000Z');
      expect(result[1].start).toBe('2023-01-02T12:00:00.000Z');
      expect(result[2].start).toBe('2023-01-03T12:00:00.000Z');
    });

    // Test for recurrence with until limit
    it('should respect until limit in recurrence', () => {
      const event: Event = {
        uid: 'until-event',
        summary: 'Until Limited Event',
        start: '2023-01-01T12:00:00Z',
        end: '2023-01-01T13:00:00Z',
        recurrence: {
          frequency: 'day',
          interval: 1,
          until: '2023-01-03T23:59:59Z' // Until January 3rd
        }
      };

      const result = getOccurrences(
        event,
        '2023-01-01T00:00:00Z',
        '2023-01-31T23:59:59Z'
      );

      expect(result).toHaveLength(3);
      expect(result[0].start).toBe('2023-01-01T12:00:00.000Z');
      expect(result[1].start).toBe('2023-01-02T12:00:00.000Z');
      expect(result[2].start).toBe('2023-01-03T12:00:00.000Z');
    });

    // Test for exception dates
    it('should handle exception dates', () => {
      const event: Event = {
        uid: 'exception-event',
        summary: 'Event with Exceptions',
        start: '2023-01-01T12:00:00Z',
        end: '2023-01-01T13:00:00Z',
        recurrence: {
          frequency: 'day',
          interval: 1,
          exceptionDates: ['2023-01-03T12:00:00Z', '2023-01-05T12:00:00Z']
        }
      };

      const result = getOccurrences(
        event,
        '2023-01-01T00:00:00Z',
        '2023-01-07T23:59:59Z'
      );

      // Should get Jan 1, 2, 4, 6, 7 (excluding exceptions on Jan 3 and 5)
      expect(result).toHaveLength(5);
      expect(result[0].start).toBe('2023-01-01T12:00:00.000Z');
      expect(result[1].start).toBe('2023-01-02T12:00:00.000Z');
      expect(result[2].start).toBe('2023-01-04T12:00:00.000Z');
      expect(result[3].start).toBe('2023-01-06T12:00:00.000Z');
      expect(result[4].start).toBe('2023-01-07T12:00:00.000Z');
    });

    // Test for recurrence additions
    it('should handle recurrence additions', () => {
      const event: Event = {
        uid: 'addition-event',
        summary: 'Event with Additions',
        start: '2023-01-01T12:00:00Z',
        end: '2023-01-01T13:00:00Z',
        recurrence: {
          frequency: 'week',
          interval: 1,
          recurrenceAdditions: ['2023-01-05T15:00:00Z'] // Special occurrence (different time)
        }
      };

      const result = getOccurrences(
        event,
        '2023-01-01T00:00:00Z',
        '2023-01-14T23:59:59Z'
      );

      // Should get Jan 1, Jan 5 (special), Jan 8
      expect(result).toHaveLength(3);
      expect(result[0].start).toBe('2023-01-01T12:00:00.000Z');
      expect(result[1].start).toBe('2023-01-05T15:00:00.000Z'); // Special time
      expect(result[2].start).toBe('2023-01-08T12:00:00.000Z');
    });

    // Edge case: Month transition and leap year
    it('should handle month transitions correctly', () => {
      const event: Event = {
        uid: 'month-transition',
        summary: 'Month Transition Event',
        start: '2023-01-30T12:00:00Z',
        end: '2023-01-30T13:00:00Z',
        recurrence: {
          frequency: 'day',
          interval: 1
        }
      };

      const result = getOccurrences(
        event,
        '2023-01-30T00:00:00Z',
        '2023-02-02T23:59:59Z'
      );

      // Should get Jan 30, 31, Feb 1, 2
      expect(result).toHaveLength(4);
      expect(result[0].start).toBe('2023-01-30T12:00:00.000Z');
      expect(result[1].start).toBe('2023-01-31T12:00:00.000Z');
      expect(result[2].start).toBe('2023-02-01T12:00:00.000Z');
      expect(result[3].start).toBe('2023-02-02T12:00:00.000Z');
    });

    it('should handle leap year correctly', () => {
      const event: Event = {
        uid: 'leap-year',
        summary: 'Leap Year Event',
        start: '2024-02-28T12:00:00Z',
        end: '2024-02-28T13:00:00Z',
        recurrence: {
          frequency: 'day',
          interval: 1
        }
      };

      const result = getOccurrences(
        event,
        '2024-02-28T00:00:00Z',
        '2024-03-01T23:59:59Z'
      );

      // Should get Feb 28, 29, Mar 1
      expect(result).toHaveLength(3);
      expect(result[0].start).toBe('2024-02-28T12:00:00.000Z');
      expect(result[1].start).toBe('2024-02-29T12:00:00.000Z'); // Leap day
      expect(result[2].start).toBe('2024-03-01T12:00:00.000Z');
    });
  });
}); 