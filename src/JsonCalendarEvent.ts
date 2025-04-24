import { Event } from './types/event';
import { Attendee } from './types/attendee';
import { Notification } from './types/notification';
import { EventSchema } from './schemas/event';
import { AttendeeSchema } from './schemas/attendee';
import { NotificationSchema } from './schemas/notification';

/**
 * Class representing a JSON Calendar Event with utility methods
 * for common operations like attendee management and recurrence handling.
 */
export class JsonCalendarEvent {
  private _event: Event;

  /**
   * Create a new JsonCalendarEvent instance
   * 
   * @param event - An Event object or data conforming to the Event interface
   */
  constructor(event: Event) {
    // Validate and create a copy of the event
    this._event = EventSchema.parse(event);
  }

  /**
   * Get the underlying Event object
   */
  get event(): Event {
    return { ...this._event };
  }

  /**
   * Check if this event is recurring
   * 
   * @returns true if the event has recurrence properties
   */
  isRecurring(): boolean {
    return Boolean(this._event.recurrence);
  }

  /**
   * Get occurrences of this event in a date range
   * 
   * Note: This is a placeholder implementation that only returns the original
   * event if it falls within the specified date range. A complete implementation
   * would calculate all occurrences based on recurrence rules.
   * 
   * @param startDate - ISO 8601 date-time string for range start
   * @param endDate - ISO 8601 date-time string for range end
   * @returns Array of event occurrences in the date range
   */
  getOccurrences(startDate: string, endDate: string): Event[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const eventStart = new Date(this._event.start);
    
    // For non-recurring events, just check if it's in the range
    if (!this.isRecurring()) {
      if (eventStart >= start && eventStart <= end) {
        return [this.event];
      }
      return [];
    }

    // Basic implementation for recurring events
    // This is a placeholder - a full implementation would calculate all occurrences
    // based on the specific recurrence rules (frequency, interval, etc.)
    if (eventStart >= start && eventStart <= end) {
      return [this.event];
    }
    
    // TODO: Implement full recurrence calculation logic
    return [];
  }

  /**
   * Add an attendee to the event
   * 
   * @param attendee - The attendee to add
   * @returns this instance for method chaining
   */
  addAttendee(attendee: Attendee): JsonCalendarEvent {
    // Validate the attendee
    const validAttendee = AttendeeSchema.parse(attendee);
    
    // Create a new array if one doesn't exist
    if (!this._event.attendees) {
      this._event.attendees = [];
    }
    
    // Check if attendee with same email already exists
    const existingIndex = this._event.attendees.findIndex(
      a => a.email === validAttendee.email
    );
    
    if (existingIndex >= 0) {
      // Replace existing attendee
      this._event.attendees[existingIndex] = validAttendee;
    } else {
      // Add new attendee
      this._event.attendees.push(validAttendee);
    }
    
    return this;
  }

  /**
   * Set a notification for the event
   * 
   * @param notification - The notification to set
   * @returns this instance for method chaining
   */
  setNotification(notification: Notification): JsonCalendarEvent {
    // Validate the notification
    const validNotification = NotificationSchema.parse(notification);
    
    // Create a new array if one doesn't exist
    if (!this._event.notifications) {
      this._event.notifications = [];
    }
    
    // Add the notification
    this._event.notifications.push(validNotification);
    
    return this;
  }
} 