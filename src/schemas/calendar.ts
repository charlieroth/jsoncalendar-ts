import { z } from 'zod';
import { EventSchema } from './event';

/**
 * Zod schema for the Calendar type in JSON Calendar
 * 
 * A calendar with its associated metadata and events.
 */
export const CalendarSchema = z.object({
  timezone: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  events: z.array(EventSchema),
});

export type Calendar = z.infer<typeof CalendarSchema>; 