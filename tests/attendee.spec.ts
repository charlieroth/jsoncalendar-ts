import { describe, it, expect } from 'vitest';
import { addAttendee, removeAttendee, updateAttendee } from '../src/attendee';
import { Attendee } from '../src/types/attendee';
import { Event } from '../src/types/event';

describe('Attendee Utilities', () => {
  // Sample event for testing
  const baseEvent: Event = {
    uid: 'test-event-123',
    summary: 'Test Event',
    start: '2023-06-01T10:00:00Z',
    end: '2023-06-01T11:00:00Z'
  };

  // Sample attendees for testing
  const attendee1: Attendee = {
    name: 'John Doe',
    email: 'john@example.com',
    responseStatus: 'accepted'
  };

  const attendee2: Attendee = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    responseStatus: 'tentative'
  };

  const attendee1Updated: Attendee = {
    name: 'John Doe',
    email: 'john@example.com',
    responseStatus: 'declined'
  };

  // Test addAttendee function
  describe('addAttendee', () => {
    it('adds an attendee to an event with no attendees', () => {
      const result = addAttendee(baseEvent, attendee1);
      
      expect(result.attendees).toHaveLength(1);
      expect(result.attendees?.[0]).toEqual(attendee1);
      expect(result.lastModified).toBeDefined();
    });

    it('adds an attendee to an event with existing attendees', () => {
      const eventWithAttendee = {
        ...baseEvent,
        attendees: [attendee1]
      };

      const result = addAttendee(eventWithAttendee, attendee2);
      
      expect(result.attendees).toHaveLength(2);
      expect(result.attendees?.[0]).toEqual(attendee1);
      expect(result.attendees?.[1]).toEqual(attendee2);
    });

    it('throws an error for invalid attendee data', () => {
      const invalidAttendee = {
        name: 'Invalid',
        email: 'not-an-email' // Invalid email format
      };

      // @ts-ignore - Testing invalid input
      expect(() => addAttendee(baseEvent, invalidAttendee)).toThrow();
    });
  });

  // Test removeAttendee function
  describe('removeAttendee', () => {
    it('removes an attendee by email', () => {
      const eventWithAttendees = {
        ...baseEvent,
        attendees: [attendee1, attendee2]
      };

      const result = removeAttendee(eventWithAttendees, 'john@example.com');
      
      expect(result.attendees).toHaveLength(1);
      expect(result.attendees?.[0]).toEqual(attendee2);
    });

    it('returns the event unchanged if attendee not found', () => {
      const eventWithAttendee = {
        ...baseEvent,
        attendees: [attendee1]
      };

      const result = removeAttendee(eventWithAttendee, 'nonexistent@example.com');
      
      expect(result.attendees).toHaveLength(1);
      expect(result.attendees?.[0]).toEqual(attendee1);
    });

    it('returns the event unchanged if no attendees exist', () => {
      const result = removeAttendee(baseEvent, 'john@example.com');
      
      expect(result).toEqual(baseEvent);
    });
  });

  // Test updateAttendee function
  describe('updateAttendee', () => {
    it('updates an existing attendee', () => {
      const eventWithAttendee = {
        ...baseEvent,
        attendees: [attendee1, attendee2]
      };

      const result = updateAttendee(eventWithAttendee, attendee1Updated);
      
      expect(result.attendees).toHaveLength(2);
      // First attendee should be updated
      expect(result.attendees?.[0]).toEqual(attendee1Updated);
      // Second attendee should remain unchanged
      expect(result.attendees?.[1]).toEqual(attendee2);
    });

    it('adds the attendee if not found', () => {
      const eventWithAttendee = {
        ...baseEvent,
        attendees: [attendee2]
      };

      const result = updateAttendee(eventWithAttendee, attendee1);
      
      expect(result.attendees).toHaveLength(2);
      // Original attendee should remain
      expect(result.attendees?.some(a => a.email === attendee2.email)).toBe(true);
      // New attendee should be added
      expect(result.attendees?.some(a => a.email === attendee1.email)).toBe(true);
    });

    it('adds the attendee if no attendees exist', () => {
      const result = updateAttendee(baseEvent, attendee1);
      
      expect(result.attendees).toHaveLength(1);
      expect(result.attendees?.[0]).toEqual(attendee1);
    });

    it('throws an error for invalid attendee data', () => {
      const invalidAttendee = {
        name: 'Invalid',
        email: 'not-an-email' // Invalid email format
      };

      const eventWithAttendee = {
        ...baseEvent,
        attendees: [attendee1]
      };

      // @ts-ignore - Testing invalid input
      expect(() => updateAttendee(eventWithAttendee, invalidAttendee)).toThrow();
    });
  });
}); 