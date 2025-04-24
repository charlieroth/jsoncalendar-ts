import { Event } from './event';

/**
 * Calendar interface for JSON Calendar
 * 
 * A calendar with its associated metadata and events.
 */
export interface Calendar {
  timezone: string;
  name?: string;
  description?: string;
  events: Event[];
} 