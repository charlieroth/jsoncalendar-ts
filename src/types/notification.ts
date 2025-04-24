import { Duration } from './duration';

/**
 * Notification interface for JSON Calendar
 * 
 * A notification or reminder for an event.
 */
export interface Notification {
  action: 'display' | 'email';
  trigger: Duration | string;
  message?: string;
} 