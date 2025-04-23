import { z } from 'zod';

/**
 * Zod schema for the Recurrence type in JSON Calendar
 * 
 * Details for recurring events.
 */
export const RecurrenceSchema = z.object({
  frequency: z.enum([
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'year'
  ]).optional(),
  interval: z.number().int().min(1).optional(),
  until: z.string().datetime().optional(),
  count: z.number().int().min(1).optional(),
  byDay: z.array(
    z.string().regex(/^-?[1-5]?(MO|TU|WE|TH|FR|SA|SU)$/)
  ).optional(),
  byMonthDay: z.array(
    z.number().int().min(-31).max(31).refine(val => val !== 0, {
      message: "byMonthDay value cannot be 0"
    })
  ).optional(),
  weekStart: z.enum([
    'MO',
    'TU',
    'WE',
    'TH',
    'FR',
    'SA',
    'SU'
  ]).optional(),
  exceptionDates: z.array(z.string().datetime()).optional(),
  recurrenceAdditions: z.array(z.string().datetime()).optional(),
}).refine(
  data => {
    // Ensure one of the following combinations:
    // 1. frequency and interval are both present
    // 2. until is present
    // 3. count is present
    return (
      (data.frequency && data.interval) ||
      data.until !== undefined ||
      data.count !== undefined
    );
  },
  {
    message: "Recurrence must have 'frequency' and 'interval' or 'until' or 'count'."
  }
);

export type Recurrence = z.infer<typeof RecurrenceSchema>; 