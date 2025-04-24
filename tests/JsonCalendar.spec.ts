import { describe, it, expect } from 'vitest';
import { JsonCalendar } from '../src/JsonCalendar';
import { Calendar } from '../src/types/calendar';
import { Event } from '../src/types/event';

describe('JsonCalendar', () => {
  // Sample calendar for testing
  const sampleCalendar: Calendar = {
    timezone: 'UTC',
    name: 'Test Calendar',
    events: [
      {
        uid: 'event-123',
        summary: 'Test Event 1',
        start: '2023-01-01T10:00:00Z',
        end: '2023-01-01T11:00:00Z'
      },
      {
        uid: 'event-456',
        summary: 'Test Event 2',
        start: '2023-01-02T10:00:00Z',
        end: '2023-01-02T11:00:00Z'
      }
    ]
  };

  // Sample event for testing
  const sampleEvent: Event = {
    uid: 'event-789',
    summary: 'Test Event 3',
    start: '2023-01-03T10:00:00Z',
    end: '2023-01-03T11:00:00Z'
  };

  describe('constructor', () => {
    it('should create a new instance with valid calendar data', () => {
      const calendar = new JsonCalendar(sampleCalendar);
      expect(calendar.calendar.name).toBe('Test Calendar');
      expect(calendar.calendar.events).toHaveLength(2);
    });

    it('should throw an error with invalid calendar data', () => {
      // @ts-expect-error Testing invalid input
      expect(() => new JsonCalendar({ events: [] })).toThrow();
    });
  });

  describe('addEvent', () => {
    it('should add a new event to the calendar', () => {
      const calendar = new JsonCalendar(sampleCalendar);
      calendar.addEvent(sampleEvent);
      
      expect(calendar.calendar.events).toHaveLength(3);
      expect(calendar.calendar.events[2].uid).toBe('event-789');
    });

    it('should update an existing event with the same UID', () => {
      const calendar = new JsonCalendar(sampleCalendar);
      const updatedEvent: Event = {
        uid: 'event-123',
        summary: 'Updated Event',
        start: '2023-01-01T10:00:00Z',
        end: '2023-01-01T11:00:00Z'
      };
      
      calendar.addEvent(updatedEvent);
      
      expect(calendar.calendar.events).toHaveLength(2);
      expect(calendar.calendar.events[0].summary).toBe('Updated Event');
    });

    it('should throw an error with invalid event data', () => {
      const calendar = new JsonCalendar(sampleCalendar);
      
      // @ts-expect-error Testing invalid input
      expect(() => calendar.addEvent({ uid: 'invalid' })).toThrow();
    });
  });

  describe('findEventsByDateRange', () => {
    it('should find events within a date range', () => {
      const calendar = new JsonCalendar(sampleCalendar);
      const events = calendar.findEventsByDateRange(
        '2023-01-01T00:00:00Z',
        '2023-01-01T23:59:59Z'
      );
      
      expect(events).toHaveLength(1);
      expect(events[0].uid).toBe('event-123');
    });

    it('should return empty array when no events in range', () => {
      const calendar = new JsonCalendar(sampleCalendar);
      const events = calendar.findEventsByDateRange(
        '2023-02-01T00:00:00Z',
        '2023-02-28T23:59:59Z'
      );
      
      expect(events).toHaveLength(0);
    });

    it('should throw an error with invalid date format', () => {
      const calendar = new JsonCalendar(sampleCalendar);
      
      expect(() => calendar.findEventsByDateRange('invalid-date', '2023-01-01T23:59:59Z')).toThrow();
      expect(() => calendar.findEventsByDateRange('2023-01-01T00:00:00Z', 'invalid-date')).toThrow();
    });
  });

  describe('getEventsByUid', () => {
    it('should find an event by UID', () => {
      const calendar = new JsonCalendar(sampleCalendar);
      const events = calendar.getEventsByUid('event-123');
      
      expect(events).toHaveLength(1);
      expect(events[0].summary).toBe('Test Event 1');
    });

    it('should return an empty array when UID not found', () => {
      const calendar = new JsonCalendar(sampleCalendar);
      const events = calendar.getEventsByUid('non-existent');
      
      expect(events).toHaveLength(0);
    });
  });

  describe('validate', () => {
    it('should return true for valid calendar', () => {
      const calendar = new JsonCalendar(sampleCalendar);
      expect(calendar.validate()).toBe(true);
    });

    it('should throw an error for invalid calendar', () => {
      const calendar = new JsonCalendar(sampleCalendar);
      
      // Deliberately corrupt the internal state
      // @ts-expect-error Accessing private property for testing
      calendar._calendar.events[0] = { uid: 'corrupted' };
      
      expect(() => calendar.validate()).toThrow();
    });
  });
}); 