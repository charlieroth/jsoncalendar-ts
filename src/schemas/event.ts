import { z } from 'zod';
import { LocationSchema } from './location';
import { RecurrenceSchema } from './recurrence';
import { NotificationSchema } from './notification';
import { AttendeeSchema } from './attendee';
import { OrganizerSchema } from './organizer';

/**
 * Zod schema for the Event type in JSON Calendar
 * 
 * A calendar event with all relevant properties.
 */
export const EventSchema = z.object({
  uid: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  location: LocationSchema.optional(),
  start: z.string().datetime(),
  end: z.string().datetime(),
  recurrence: RecurrenceSchema.optional(),
  notifications: z.array(NotificationSchema).optional(),
  attendees: z.array(AttendeeSchema).optional(),
  created: z.string().datetime().optional(),
  lastModified: z.string().datetime().optional(),
  status: z.enum([
    'confirmed',
    'tentative',
    'cancelled'
  ]).optional(),
  transparency: z.enum([
    'opaque',
    'transparent'
  ]).optional(),
  url: z.string().url().optional(),
  organizer: OrganizerSchema.optional(),
});

export type Event = z.infer<typeof EventSchema>; 