import { z } from 'zod';
import { CalendarSchema } from './calendar';

/**
 * Zod schema for the root JSON Calendar Document
 * 
 * The root object for a JSON Calendar document.
 */
export const JsonCalendarDocumentSchema = z.object({
  version: z.literal('1.0'),
  productIdentifier: z.string().optional(),
  calendar: CalendarSchema,
});

export type JsonCalendarDocument = z.infer<typeof JsonCalendarDocumentSchema>; 