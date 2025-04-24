import { describe, it, expect } from 'vitest';
import { JsonCalendarEvent } from '../src/JsonCalendarEvent';
import { Event } from '../src/types/event';
import { Notification } from '../src/types/notification';

describe('JsonCalendarEvent', () => {
  // Sample event for testing
  const sampleEvent: Event = {
    uid: 'event-123',
    summary: 'Test Event',
    start: '2023-01-01T10:00:00Z',
    end: '2023-01-01T11:00:00Z'
  };

  describe('constructor', () => {
    it('should create a new instance with valid event data', () => {
      const calEvent = new JsonCalendarEvent(sampleEvent);
      expect(calEvent.event.uid).toBe('event-123');
      expect(calEvent.event.summary).toBe('Test Event');
    });
  });

  describe('isRecurring', () => {
    it('should return false for non-recurring events', () => {
      const calEvent = new JsonCalendarEvent(sampleEvent);
      expect(calEvent.isRecurring()).toBe(false);
    });

    it('should return true for recurring events', () => {
      const recurringEvent: Event = {
        ...sampleEvent,
        recurrence: {
          frequency: 'day',
          interval: 1
        }
      };
      const calEvent = new JsonCalendarEvent(recurringEvent);
      expect(calEvent.isRecurring()).toBe(true);
    });
  });

  describe('addAttendee', () => {
    it('should add an attendee to the event', () => {
      const calEvent = new JsonCalendarEvent(sampleEvent);
      const attendee = {
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      calEvent.addAttendee(attendee);
      
      expect(calEvent.event.attendees).toHaveLength(1);
      expect(calEvent.event.attendees?.[0].name).toBe('John Doe');
      expect(calEvent.event.attendees?.[0].email).toBe('john@example.com');
    });

    it('should update an existing attendee with the same email', () => {
      const calEvent = new JsonCalendarEvent(sampleEvent);
      
      // Add initial attendee
      calEvent.addAttendee({
        name: 'John Doe',
        email: 'john@example.com'
      });
      
      // Update the same attendee
      calEvent.addAttendee({
        name: 'John Updated',
        email: 'john@example.com',
        responseStatus: 'accepted'
      });
      
      expect(calEvent.event.attendees).toHaveLength(1);
      expect(calEvent.event.attendees?.[0].name).toBe('John Updated');
      expect(calEvent.event.attendees?.[0].responseStatus).toBe('accepted');
    });
  });

  describe('setNotification', () => {
    it('should add a notification to the event', () => {
      const calEvent = new JsonCalendarEvent(sampleEvent);
      const notification: Notification = {
        action: 'display',
        trigger: { minutes: 15 }
      };
      
      calEvent.setNotification(notification);
      
      expect(calEvent.event.notifications).toHaveLength(1);
      expect(calEvent.event.notifications?.[0].action).toBe('display');
      expect(calEvent.event.notifications?.[0].trigger).toEqual({ minutes: 15 });
    });
  });

  describe('getOccurrences', () => {
    it('should return an empty array if the event is outside the range', () => {
      const calEvent = new JsonCalendarEvent(sampleEvent);
      const occurrences = calEvent.getOccurrences(
        '2023-02-01T00:00:00Z', 
        '2023-02-28T23:59:59Z'
      );
      
      expect(occurrences).toHaveLength(0);
    });

    it('should return the event if it is within the range', () => {
      const calEvent = new JsonCalendarEvent(sampleEvent);
      const occurrences = calEvent.getOccurrences(
        '2022-12-01T00:00:00Z', 
        '2023-01-31T23:59:59Z'
      );
      
      expect(occurrences).toHaveLength(1);
      expect(occurrences[0].uid).toBe('event-123');
    });

    // Note: A full implementation would require more tests for recurrence rules
  });
}); 