import { z } from 'zod';

/**
 * Zod schema for the Duration type in JSON Calendar
 * 
 * A structured representation of an ISO 8601 duration.
 * At least one property is required.
 */
export const DurationSchema = z.object({
  years: z.number().min(0).optional(),
  months: z.number().min(0).optional(),
  days: z.number().min(0).optional(),
  hours: z.number().min(0).optional(),
  minutes: z.number().min(0).optional(),
  seconds: z.number().min(0).optional(),
}).refine(
  data => Object.keys(data).length >= 1,
  {
    message: "Duration must have at least one property",
  }
);

export type Duration = z.infer<typeof DurationSchema>; 