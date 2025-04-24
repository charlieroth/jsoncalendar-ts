import { Event } from './types/event';
import { Notification } from './types/notification';
import { NotificationSchema } from './schemas/notification';

/**
 * Adds a notification to an event
 * @param event The event to add the notification to
 * @param notification The notification to add
 * @returns A new event with the notification added
 */
export function addNotification(event: Event, notification: Notification): Event {
  // Validate the notification
  NotificationSchema.parse(notification);

  // Create a new copy of the event
  const newEvent: Event = {
    ...event,
    notifications: [...(event.notifications || []), notification],
    lastModified: new Date().toISOString()
  };

  return newEvent;
}

/**
 * Removes a notification from an event by id
 * @param event The event to remove the notification from
 * @param id The id of the notification to remove (uses index position if no id exists)
 * @returns A new event with the notification removed
 */
export function removeNotification(event: Event, id: string): Event {
  // If no notifications, return the event unchanged
  if (!event.notifications || event.notifications.length === 0) {
    return event;
  }

  // Create a new copy of the event
  const newEvent: Event = {
    ...event,
    // Since notifications don't have an explicit id in the spec, 
    // we'll treat the id parameter as an index
    notifications: event.notifications.filter((_, index) => index.toString() !== id),
    lastModified: new Date().toISOString()
  };

  return newEvent;
}

/**
 * Updates a notification in an event
 * @param event The event to update the notification in
 * @param id The id (index) of the notification to update
 * @param notification The updated notification
 * @returns A new event with the notification updated
 */
export function updateNotification(
  event: Event, 
  id: string, 
  notification: Notification
): Event {
  // Validate the notification
  NotificationSchema.parse(notification);

  // If no notifications, return the event with the notification added
  if (!event.notifications || event.notifications.length === 0) {
    return addNotification(event, notification);
  }

  // Convert id to number for index
  const index = parseInt(id, 10);
  
  // Check if index is valid
  if (isNaN(index) || index < 0 || index >= event.notifications.length) {
    return addNotification(event, notification);
  }

  // Create a new array with the updated notification
  const updatedNotifications = [...event.notifications];
  updatedNotifications[index] = notification;

  // Create a new copy of the event
  const newEvent: Event = {
    ...event,
    notifications: updatedNotifications,
    lastModified: new Date().toISOString()
  };

  return newEvent;
} 