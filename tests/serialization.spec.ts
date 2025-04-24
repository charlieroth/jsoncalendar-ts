import { describe, it, expect } from 'vitest';
import { loadJsonCalendar, serializeJsonCalendar } from '../src/index';
import { JsonCalendarDocument } from '../src/types/jsonCalendarDocument';
import { JsonCalendarDocumentSchema } from '../src/schemas/jsonCalendarDocument';

describe('JSON Calendar Serialization', () => {
  // Test fixtures
  const minimalDocument: JsonCalendarDocument = {
    version: '1.0',
    calendar: {
      timezone: 'UTC',
      events: []
    }
  };

  const complexDocument: JsonCalendarDocument = {
    version: '1.0',
    productIdentifier: 'jsoncalendar-ts-test',
    calendar: {
      name: 'Test Calendar',
      description: 'A test calendar with various event types',
      timezone: 'America/New_York',
      events: [
        {
          uid: 'event-123',
          summary: 'Simple Event',
          description: 'A simple non-recurring event',
          start: '2023-01-01T12:00:00Z',
          end: '2023-01-01T13:30:00Z',
          created: '2022-12-20T08:00:00Z',
          lastModified: '2022-12-25T10:15:00Z',
          status: 'confirmed',
          url: 'https://example.com/event-123'
        },
        {
          uid: 'event-456',
          summary: 'Recurring Meeting',
          start: '2023-01-02T15:00:00Z',
          end: '2023-01-02T16:00:00Z',
          recurrence: {
            frequency: 'week',
            byDay: ['MO', 'WE', 'FR'],
            count: 10
          },
          attendees: [
            {
              name: 'John Doe',
              email: 'john@example.com',
              responseStatus: 'accepted'
            },
            {
              name: 'Jane Smith',
              email: 'jane@example.com',
              responseStatus: 'tentative'
            }
          ],
          notifications: [
            {
              action: 'email',
              trigger: {
                minutes: 30
              }
            }
          ],
          location: {
            name: 'Conference Room 3B',
            address: '123 Main St, Suite 300, Anytown, USA',
            latitude: 40.7128,
            longitude: -74.0060
          }
        }
      ]
    }
  };

  describe('serializeJsonCalendar', () => {
    it('should serialize a minimal document', () => {
      const serialized = serializeJsonCalendar(minimalDocument);
      
      // Verify it's valid JSON
      expect(() => JSON.parse(serialized)).not.toThrow();
      
      // Verify the parsed result matches the original document
      const parsed = JSON.parse(serialized);
      expect(parsed).toEqual(minimalDocument);
      
      // Verify it passes schema validation
      expect(() => JsonCalendarDocumentSchema.parse(parsed)).not.toThrow();
    });

    it('should serialize a complex document with all features', () => {
      const serialized = serializeJsonCalendar(complexDocument);
      
      // Verify it's valid JSON
      expect(() => JSON.parse(serialized)).not.toThrow();
      
      // Verify the parsed result matches the original document
      const parsed = JSON.parse(serialized);
      expect(parsed).toEqual(complexDocument);
      
      // Verify it passes schema validation
      expect(() => JsonCalendarDocumentSchema.parse(parsed)).not.toThrow();
    });

    it('should reject invalid documents', () => {
      // Document with invalid version
      const invalidDocument = {
        version: '2.0', // Invalid version
        calendar: {
          timezone: 'UTC',
          events: []
        }
      } as unknown as JsonCalendarDocument;

      expect(() => serializeJsonCalendar(invalidDocument)).toThrow();
    });

    it('should handle roundtrip serialization correctly', () => {
      // Load -> Serialize -> Parse -> Validate cycle
      const serialized = serializeJsonCalendar(complexDocument);
      const parsed = JSON.parse(serialized);
      const reloaded = loadJsonCalendar(parsed);
      
      // Should match the original document
      expect(reloaded).toEqual(complexDocument);
      
      // Should be able to serialize again
      const reserialized = serializeJsonCalendar(reloaded);
      expect(JSON.parse(reserialized)).toEqual(complexDocument);
    });

    it('should format the output with proper indentation', () => {
      const serialized = serializeJsonCalendar(minimalDocument);
      
      // Check for newlines and indentation (2 spaces)
      expect(serialized).toContain('\n  ');
      
      // The formatted JSON should have more characters than a compact version
      expect(serialized.length).toBeGreaterThan(JSON.stringify(minimalDocument).length);
    });
  });
}); 