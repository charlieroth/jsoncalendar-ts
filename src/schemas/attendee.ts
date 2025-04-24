import { z } from 'zod';

/**
 * Zod schema for the Attendee type in JSON Calendar
 * 
 * A calendar event attendee.
 */
export const AttendeeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  responseStatus: z.enum([
    'accepted',
    'declined',
    'tentative',
    'needs-action'
  ]).optional(),
});

export type Attendee = z.infer<typeof AttendeeSchema>; 