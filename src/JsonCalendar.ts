import { Calendar } from './types/calendar';
import { Event } from './types/event';
import { CalendarSchema } from './schemas/calendar';
import { EventSchema } from './schemas/event';
import { JsonCalendarEvent } from './JsonCalendarEvent';

/**
 * Class representing a JSON Calendar with utility methods
 * for event management and validation.
 */
export class JsonCalendar {
  private _calendar: Calendar;

  /**
   * Create a new JsonCalendar instance
   * 
   * @param calendar - A Calendar object or data conforming to the Calendar interface
   */
  constructor(calendar: Calendar) {
    // Validate and create a copy of the calendar
    this._calendar = CalendarSchema.parse(calendar);
  }

  /**
   * Get the underlying Calendar object
   */
  get calendar(): Calendar {
    return { ...this._calendar, events: [...this._calendar.events] };
  }

  /**
   * Add an event to the calendar
   * 
   * @param event - The event to add
   * @returns this instance for method chaining
   */
  addEvent(event: Event): JsonCalendar {
    // Validate the event
    const validEvent = EventSchema.parse(event);
    
    // Check if event with same UID already exists
    const existingIndex = this._calendar.events.findIndex(
      e => e.uid === validEvent.uid
    );
    
    if (existingIndex >= 0) {
      // Replace existing event
      this._calendar.events[existingIndex] = validEvent;
    } else {
      // Add new event
      this._calendar.events.push(validEvent);
    }
    
    return this;
  }

  /**
   * Find events within a specified date range
   * 
   * @param start - ISO 8601 date-time string for range start
   * @param end - ISO 8601 date-time string for range end
   * @returns Array of events that occur within the date range
   */
  findEventsByDateRange(start: string, end: string): Event[] {
    // Validate date strings by creating Date objects
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date format. Please use ISO 8601 format (e.g., "2023-01-01T00:00:00Z")');
    }
    
    const events: Event[] = [];
    
    // Check each event
    for (const event of this._calendar.events) {
      const calendarEvent = new JsonCalendarEvent(event);
      const occurrences = calendarEvent.getOccurrences(start, end);
      
      if (occurrences.length > 0) {
        events.push(...occurrences);
      }
    }
    
    return events;
  }

  /**
   * Get events with a specific UID
   * 
   * @param uid - The unique identifier to search for
   * @returns Array of events with the specified UID (typically 0 or 1 events)
   */
  getEventsByUid(uid: string): Event[] {
    return this._calendar.events.filter(event => event.uid === uid);
  }

  /**
   * Validate the calendar structure and its events
   * 
   * @returns true if the calendar is valid
   * @throws Error if validation fails
   */
  validate(): boolean {
    // Validate the calendar structure
    CalendarSchema.parse(this._calendar);
    
    // Additionally validate each event individually for more detailed errors
    for (const event of this._calendar.events) {
      EventSchema.parse(event);
    }
    
    // If we get here, validation passed
    return true;
  }
} 