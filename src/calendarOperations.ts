import { Calendar } from "./types/calendar";
import { Event } from "./types/event";

/**
 * Adds a new event to the calendar and returns the updated calendar.
 * @param calendar The calendar to add the event to
 * @param event The event to add
 * @returns A new Calendar object with the event added
 */
export function createEvent(calendar: Calendar, event: Event): Calendar {
  // Create a new calendar object with a copy of the events array plus the new event
  return {
    ...calendar,
    events: [...calendar.events, event]
  };
}

/**
 * Finds an event by its UID.
 * @param calendar The calendar to search in
 * @param uid The UID of the event to find
 * @returns The event if found, undefined otherwise
 */
export function getEventByUid(calendar: Calendar, uid: string): Event | undefined {
  return calendar.events.find(event => event.uid === uid);
}

/**
 * Returns all events from a calendar.
 * @param calendar The calendar to get events from
 * @returns An array of all events
 */
export function getAllEvents(calendar: Calendar): Event[] {
  return [...calendar.events];
}

/**
 * Updates an existing event in the calendar by UID and returns the updated calendar.
 * Also updates the lastModified timestamp of the event.
 * @param calendar The calendar containing the event to update
 * @param updatedEvent The updated event data (must have the same UID as an existing event)
 * @returns A new Calendar object with the event updated
 */
export function updateEvent(calendar: Calendar, updatedEvent: Event): Calendar {
  const eventIndex = calendar.events.findIndex(event => event.uid === updatedEvent.uid);
  
  // If the event doesn't exist, return the calendar unchanged
  if (eventIndex === -1) {
    return calendar;
  }

  // Create a new event with updated lastModified timestamp
  const eventWithTimestamp = {
    ...updatedEvent,
    lastModified: new Date().toISOString()
  };

  // Create a new events array with the updated event
  const updatedEvents = [...calendar.events];
  updatedEvents[eventIndex] = eventWithTimestamp;

  // Return a new calendar object with the updated events
  return {
    ...calendar,
    events: updatedEvents
  };
}

/**
 * Removes an event from the calendar by UID and returns the updated calendar.
 * @param calendar The calendar containing the event to delete
 * @param uid The UID of the event to delete
 * @returns A new Calendar object with the event removed
 */
export function deleteEvent(calendar: Calendar, uid: string): Calendar {
  return {
    ...calendar,
    events: calendar.events.filter(event => event.uid !== uid)
  };
} 