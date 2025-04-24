import { z } from 'zod';

/**
 * Zod schema for the Location type in JSON Calendar
 * 
 * A structured representation of the event location.
 */
export const LocationSchema = z.object({
  name: z.string(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  mapUrl: z.string().url().optional(),
});

export type Location = z.infer<typeof LocationSchema>; 