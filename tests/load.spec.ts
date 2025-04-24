import { describe, it, expect } from 'vitest';
import { loadJsonCalendar, safeLoadJsonCalendar } from '../src/index';
import { JsonCalendarDocument } from '../src/types/jsonCalendarDocument';

describe('JSON Calendar Loading', () => {
  // Valid minimal document for testing successful loads
  const validDocument = {
    version: '1.0',
    calendar: {
      timezone: 'UTC',
      events: []
    }
  };

  // Valid complete document with all fields
  const validCompleteDocument = {
    version: '1.0',
    productIdentifier: 'jsoncalendar-ts-test',
    calendar: {
      name: 'Test Calendar',
      timezone: 'UTC',
      events: [
        {
          uid: 'event-123',
          summary: 'Test Event',
          description: 'This is a test event',
          start: '2023-01-01T12:00:00Z',
          end: '2023-01-01T13:00:00Z'
        }
      ]
    }
  };

  // Test cases for invalid documents
  const invalidDocuments = [
    {
      name: 'missing version',
      document: {
        calendar: { 
          timezone: 'UTC',
          events: [] 
        }
      },
      expectedError: 'version'
    },
    {
      name: 'wrong version',
      document: {
        version: '2.0',
        calendar: { 
          timezone: 'UTC',
          events: [] 
        }
      },
      expectedError: 'version'
    },
    {
      name: 'missing calendar',
      document: {
        version: '1.0'
      },
      expectedError: 'calendar'
    },
    {
      name: 'missing timezone',
      document: {
        version: '1.0',
        calendar: {
          events: []
        }
      },
      expectedError: 'timezone'
    },
    {
      name: 'missing events array',
      document: {
        version: '1.0',
        calendar: {
          timezone: 'UTC'
        }
      },
      expectedError: 'events'
    },
    {
      name: 'invalid event (missing uid)',
      document: {
        version: '1.0',
        calendar: {
          timezone: 'UTC',
          events: [{ start: '2023-01-01T12:00:00Z' }]
        }
      },
      expectedError: 'uid'
    },
    {
      name: 'invalid event (missing start)',
      document: {
        version: '1.0',
        calendar: {
          timezone: 'UTC',
          events: [{ uid: 'event-123' }]
        }
      },
      expectedError: 'start'
    },
    {
      name: 'invalid datetime format',
      document: {
        version: '1.0',
        calendar: {
          timezone: 'UTC',
          events: [{ 
            uid: 'event-123',
            start: 'not-a-date'
          }]
        }
      },
      expectedError: 'start'
    }
  ];

  describe('loadJsonCalendar', () => {
    it('should load a valid minimal document', () => {
      const result = loadJsonCalendar(validDocument);
      expect(result).toBeDefined();
      expect(result.version).toBe('1.0');
      expect(result.calendar.events).toEqual([]);
      expect(result.calendar.timezone).toBe('UTC');
    });

    it('should load a valid complete document', () => {
      const result = loadJsonCalendar(validCompleteDocument);
      expect(result).toBeDefined();
      expect(result.version).toBe('1.0');
      expect(result.productIdentifier).toBe('jsoncalendar-ts-test');
      expect(result.calendar.name).toBe('Test Calendar');
      expect(result.calendar.events.length).toBe(1);
      expect(result.calendar.events[0].uid).toBe('event-123');
    });

    it.each(invalidDocuments)('should throw for $name', ({ document, expectedError }) => {
      expect(() => loadJsonCalendar(document)).toThrow();
      try {
        loadJsonCalendar(document);
      } catch (error) {
        expect(error instanceof Error).toBe(true);
        if (error instanceof Error) {
          expect(error.message.toLowerCase()).toContain(expectedError.toLowerCase());
        }
      }
    });
  });

  describe('safeLoadJsonCalendar', () => {
    it('should successfully load a valid minimal document', () => {
      const result = safeLoadJsonCalendar(validDocument);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.version).toBe('1.0');
        expect(result.data.calendar.events).toEqual([]);
        expect(result.data.calendar.timezone).toBe('UTC');
      }
    });

    it('should successfully load a valid complete document', () => {
      const result = safeLoadJsonCalendar(validCompleteDocument);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.version).toBe('1.0');
        expect(result.data.productIdentifier).toBe('jsoncalendar-ts-test');
        expect(result.data.calendar.name).toBe('Test Calendar');
        expect(result.data.calendar.events.length).toBe(1);
        expect(result.data.calendar.events[0].uid).toBe('event-123');
      }
    });

    it.each(invalidDocuments)('should return failure for $name', ({ document, expectedError }) => {
      const result = safeLoadJsonCalendar(document);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.toLowerCase()).toContain(expectedError.toLowerCase());
      }
    });
  });

  describe('Validation error formatting', () => {
    it('should provide clear error messages with paths', () => {
      try {
        loadJsonCalendar({
          version: '1.0',
          calendar: {
            timezone: 'UTC',
            events: [{ 
              uid: 'event-123',
              // Missing required 'start' field
              end: 'invalid-date' // Also invalid date format
            }]
          }
        });
        // Should not reach here
        expect(true).toBe(false);
      } catch (error) {
        if (error instanceof Error) {
          // Check that error has useful information
          expect(error.message).toContain('calendar.events.0');  // Adjust to match actual dot notation
          expect(error.message).toContain('start');
          expect(error.message).toContain('end');
        }
      }
    });

    it('should format errors in the safe version', () => {
      const result = safeLoadJsonCalendar({
        version: '1.0',
        calendar: {
          timezone: 'UTC',
          events: [{ 
            uid: 'event-123',
            // Missing required 'start' field
            end: 'invalid-date' // Also invalid date format
          }]
        }
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        // Check that error has useful information
        expect(result.error).toContain('calendar.events.0');  // Adjust to match actual dot notation
        expect(result.error).toContain('start');
        expect(result.error).toContain('end');
      }
    });
  });
}); 