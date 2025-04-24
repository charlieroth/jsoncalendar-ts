import { describe, it, expect } from 'vitest';
import { createEvent, getEventByUid, getAllEvents, updateEvent, deleteEvent } from '../src/calendarOperations';
import { Calendar } from '../src/types/calendar';
import { Event } from '../src/types/event';

describe('Calendar Operations', () => {
  // Sample calendar and events for testing
  const sampleEvent1: Event = {
    uid: 'event-1',
    summary: 'Test Event 1',
    start: '2023-01-01T09:00:00Z',
    end: '2023-01-01T10:00:00Z',
    created: '2023-01-01T08:00:00Z'
  };

  const sampleEvent2: Event = {
    uid: 'event-2',
    summary: 'Test Event 2',
    start: '2023-01-02T09:00:00Z',
    end: '2023-01-02T10:00:00Z',
    created: '2023-01-01T08:00:00Z'
  };

  const emptyCalendar: Calendar = {
    timezone: 'UTC',
    name: 'Test Calendar',
    events: []
  };

  const populatedCalendar: Calendar = {
    timezone: 'UTC',
    name: 'Test Calendar',
    events: [sampleEvent1, sampleEvent2]
  };

  describe('createEvent', () => {
    it('should add an event to an empty calendar', () => {
      const result = createEvent(emptyCalendar, sampleEvent1);
      
      // Original calendar should be unchanged
      expect(emptyCalendar.events.length).toBe(0);
      
      // New calendar should have the event
      expect(result.events.length).toBe(1);
      expect(result.events[0]).toEqual(sampleEvent1);
    });

    it('should add an event to a populated calendar', () => {
      const newEvent: Event = {
        uid: 'event-3',
        summary: 'Test Event 3',
        start: '2023-01-03T09:00:00Z',
        end: '2023-01-03T10:00:00Z'
      };
      
      const result = createEvent(populatedCalendar, newEvent);
      
      // Original calendar should be unchanged
      expect(populatedCalendar.events.length).toBe(2);
      
      // New calendar should have the additional event
      expect(result.events.length).toBe(3);
      expect(result.events[2]).toEqual(newEvent);
    });
  });

  describe('getEventByUid', () => {
    it('should return the event with matching UID', () => {
      const result = getEventByUid(populatedCalendar, 'event-2');
      expect(result).toEqual(sampleEvent2);
    });

    it('should return undefined for non-existent UID', () => {
      const result = getEventByUid(populatedCalendar, 'non-existent');
      expect(result).toBeUndefined();
    });

    it('should return undefined for empty calendar', () => {
      const result = getEventByUid(emptyCalendar, 'event-1');
      expect(result).toBeUndefined();
    });
  });

  describe('getAllEvents', () => {
    it('should return all events from populated calendar', () => {
      const result = getAllEvents(populatedCalendar);
      expect(result).toEqual([sampleEvent1, sampleEvent2]);
      
      // Verify it returns a copy, not a reference
      expect(result).not.toBe(populatedCalendar.events);
    });

    it('should return empty array for empty calendar', () => {
      const result = getAllEvents(emptyCalendar);
      expect(result).toEqual([]);
      expect(result).not.toBe(emptyCalendar.events);
    });
  });

  describe('updateEvent', () => {
    it('should update an existing event', () => {
      const updatedEvent: Event = {
        ...sampleEvent1,
        summary: 'Updated Test Event 1'
      };
      
      const result = updateEvent(populatedCalendar, updatedEvent);
      
      // Original calendar should be unchanged
      expect(populatedCalendar.events[0].summary).toBe('Test Event 1');
      
      // New calendar should have the updated event
      expect(result.events[0].summary).toBe('Updated Test Event 1');
      expect(result.events[0].lastModified).toBeDefined();
      
      // Second event should remain unchanged
      expect(result.events[1]).toEqual(sampleEvent2);
    });

    it('should update lastModified timestamp', () => {
      const before = new Date().toISOString();
      const updatedEvent: Event = {
        ...sampleEvent1,
        summary: 'Updated Test Event 1'
      };
      
      const result = updateEvent(populatedCalendar, updatedEvent);
      const after = new Date().toISOString();
      
      // Verify lastModified is between before and after timestamps
      const lastModified = result.events[0].lastModified;
      expect(lastModified).toBeDefined();
      expect(lastModified! >= before).toBe(true);
      expect(lastModified! <= after).toBe(true);
    });

    it('should return unchanged calendar if event UID not found', () => {
      const nonExistentEvent: Event = {
        uid: 'non-existent',
        summary: 'Non-existent Event',
        start: '2023-01-01T09:00:00Z',
        end: '2023-01-01T10:00:00Z'
      };
      
      const result = updateEvent(populatedCalendar, nonExistentEvent);
      
      // Calendar should be unchanged
      expect(result).toEqual(populatedCalendar);
    });
  });

  describe('deleteEvent', () => {
    it('should remove an existing event', () => {
      const result = deleteEvent(populatedCalendar, 'event-1');
      
      // Original calendar should be unchanged
      expect(populatedCalendar.events.length).toBe(2);
      
      // New calendar should have one less event
      expect(result.events.length).toBe(1);
      expect(result.events[0]).toEqual(sampleEvent2);
    });

    it('should return unchanged calendar if event UID not found', () => {
      const result = deleteEvent(populatedCalendar, 'non-existent');
      
      // Calendar should be unchanged
      expect(result).toEqual(populatedCalendar);
    });

    it('should return empty events array if last event is deleted', () => {
      const calendarWithOneEvent = createEvent(emptyCalendar, sampleEvent1);
      const result = deleteEvent(calendarWithOneEvent, 'event-1');
      
      expect(result.events.length).toBe(0);
    });
  });
}); 