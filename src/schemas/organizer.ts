import { z } from 'zod';

/**
 * Zod schema for the Organizer type in JSON Calendar
 * 
 * The organizer of the event.
 */
export const OrganizerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export type Organizer = z.infer<typeof OrganizerSchema>; 