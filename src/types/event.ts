import { Location } from './location';
import { Recurrence } from './recurrence';
import { Notification } from './notification';
import { Attendee } from './attendee';
import { Organizer } from './organizer';

/**
 * Event interface for JSON Calendar
 * 
 * A calendar event with all relevant properties.
 */
export interface Event {
  uid: string;
  summary: string;
  description?: string;
  location?: Location;
  start: string;
  end: string;
  recurrence?: Recurrence;
  notifications?: Notification[];
  attendees?: Attendee[];
  created?: string;
  lastModified?: string;
  status?: 'confirmed' | 'tentative' | 'cancelled';
  transparency?: 'opaque' | 'transparent';
  url?: string;
  organizer?: Organizer;
} 