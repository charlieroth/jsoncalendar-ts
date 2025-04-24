import { z } from 'zod';
import { DurationSchema } from './duration';

/**
 * Zod schema for the Notification type in JSON Calendar
 * 
 * A notification or reminder for an event.
 */
export const NotificationSchema = z.object({
  action: z.enum([
    'display',
    'email'
  ]),
  trigger: z.union([
    DurationSchema,
    z.string().datetime()
  ]),
  message: z.string().optional(),
});

export type Notification = z.infer<typeof NotificationSchema>; 