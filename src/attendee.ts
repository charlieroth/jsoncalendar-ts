import { Event } from './types/event';
import { Attendee } from './types/attendee';
import { AttendeeSchema } from './schemas/attendee';

/**
 * Adds an attendee to an event
 * @param event The event to add the attendee to
 * @param attendee The attendee to add
 * @returns A new event with the attendee added
 */
export function addAttendee(event: Event, attendee: Attendee): Event {
  // Validate the attendee
  AttendeeSchema.parse(attendee);

  // Create a new copy of the event
  const newEvent: Event = {
    ...event,
    attendees: [...(event.attendees || []), attendee],
    lastModified: new Date().toISOString()
  };

  return newEvent;
}

/**
 * Removes an attendee from an event by email
 * @param event The event to remove the attendee from
 * @param email The email of the attendee to remove
 * @returns A new event with the attendee removed
 */
export function removeAttendee(event: Event, email: string): Event {
  // If no attendees, return the event unchanged
  if (!event.attendees || event.attendees.length === 0) {
    return event;
  }

  // Create a new copy of the event
  const newEvent: Event = {
    ...event,
    attendees: event.attendees.filter(a => a.email !== email),
    lastModified: new Date().toISOString()
  };

  return newEvent;
}

/**
 * Updates an attendee in an event
 * @param event The event to update the attendee in
 * @param attendee The attendee with updated fields (identified by email)
 * @returns A new event with the attendee updated
 */
export function updateAttendee(event: Event, attendee: Attendee): Event {
  // Validate the attendee
  AttendeeSchema.parse(attendee);

  // If no attendees, return the event with the attendee added
  if (!event.attendees || event.attendees.length === 0) {
    return addAttendee(event, attendee);
  }

  // Create a new copy of the event
  const newEvent: Event = {
    ...event,
    attendees: event.attendees.map(a => 
      a.email === attendee.email ? attendee : a
    ),
    lastModified: new Date().toISOString()
  };

  // If the attendee wasn't found (no update happened), add them
  const attendeeExists = newEvent.attendees?.some(a => a.email === attendee.email);
  if (!attendeeExists) {
    return addAttendee(event, attendee);
  }

  return newEvent;
} 