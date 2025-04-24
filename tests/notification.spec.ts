import { describe, it, expect } from 'vitest';
import { addNotification, removeNotification, updateNotification } from '../src/notification';
import { Notification } from '../src/types/notification';
import { Event } from '../src/types/event';

describe('Notification Utilities', () => {
  // Sample event for testing
  const baseEvent: Event = {
    uid: 'test-event-123',
    summary: 'Test Event',
    start: '2023-06-01T10:00:00Z',
    end: '2023-06-01T11:00:00Z'
  };

  // Sample notifications for testing
  const notification1: Notification = {
    action: 'display',
    trigger: { minutes: 15 }
  };

  const notification2: Notification = {
    action: 'email',
    trigger: '2023-06-01T09:45:00Z',
    message: 'Your event is starting soon'
  };

  const updatedNotification: Notification = {
    action: 'display',
    trigger: { minutes: 30 },
    message: 'Updated notification'
  };

  // Test addNotification function
  describe('addNotification', () => {
    it('adds a notification to an event with no notifications', () => {
      const result = addNotification(baseEvent, notification1);
      
      expect(result.notifications).toHaveLength(1);
      expect(result.notifications?.[0]).toEqual(notification1);
      expect(result.lastModified).toBeDefined();
    });

    it('adds a notification to an event with existing notifications', () => {
      const eventWithNotification = {
        ...baseEvent,
        notifications: [notification1]
      };

      const result = addNotification(eventWithNotification, notification2);
      
      expect(result.notifications).toHaveLength(2);
      expect(result.notifications?.[0]).toEqual(notification1);
      expect(result.notifications?.[1]).toEqual(notification2);
    });

    it('throws an error for invalid notification data', () => {
      const invalidNotification = {
        action: 'invalid-action', // Invalid action type
        trigger: { minutes: 15 }
      };

      // @ts-ignore - Testing invalid input
      expect(() => addNotification(baseEvent, invalidNotification)).toThrow();
    });
  });

  // Test removeNotification function
  describe('removeNotification', () => {
    it('removes a notification by id (index)', () => {
      const eventWithNotifications = {
        ...baseEvent,
        notifications: [notification1, notification2]
      };

      const result = removeNotification(eventWithNotifications, '0');
      
      expect(result.notifications).toHaveLength(1);
      expect(result.notifications?.[0]).toEqual(notification2);
    });

    it('returns the event unchanged if notification id not found', () => {
      const eventWithNotification = {
        ...baseEvent,
        notifications: [notification1]
      };

      const result = removeNotification(eventWithNotification, '5');
      
      expect(result.notifications).toHaveLength(1);
      expect(result.notifications?.[0]).toEqual(notification1);
    });

    it('returns the event unchanged if no notifications exist', () => {
      const result = removeNotification(baseEvent, '0');
      
      expect(result).toEqual(baseEvent);
    });
  });

  // Test updateNotification function
  describe('updateNotification', () => {
    it('updates an existing notification by id', () => {
      const eventWithNotifications = {
        ...baseEvent,
        notifications: [notification1, notification2]
      };

      const result = updateNotification(eventWithNotifications, '0', updatedNotification);
      
      expect(result.notifications).toHaveLength(2);
      // First notification should be updated
      expect(result.notifications?.[0]).toEqual(updatedNotification);
      // Second notification should remain unchanged
      expect(result.notifications?.[1]).toEqual(notification2);
    });

    it('adds the notification if id is invalid', () => {
      const eventWithNotification = {
        ...baseEvent,
        notifications: [notification1]
      };

      const result = updateNotification(eventWithNotification, '5', updatedNotification);
      
      expect(result.notifications).toHaveLength(2);
      // Original notification should remain
      expect(result.notifications?.[0]).toEqual(notification1);
      // New notification should be added
      expect(result.notifications?.[1]).toEqual(updatedNotification);
    });

    it('adds the notification if no notifications exist', () => {
      const result = updateNotification(baseEvent, '0', notification1);
      
      expect(result.notifications).toHaveLength(1);
      expect(result.notifications?.[0]).toEqual(notification1);
    });

    it('throws an error for invalid notification data', () => {
      const invalidNotification = {
        action: 'invalid-action', // Invalid action type
        trigger: { minutes: 15 }
      };

      const eventWithNotification = {
        ...baseEvent,
        notifications: [notification1]
      };

      // @ts-ignore - Testing invalid input
      expect(() => updateNotification(eventWithNotification, '0', invalidNotification)).toThrow();
    });
  });
}); 