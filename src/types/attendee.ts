/**
 * Attendee interface for JSON Calendar
 * 
 * A calendar event attendee.
 */
export interface Attendee {
  name: string;
  email: string;
  responseStatus?: 'accepted' | 'declined' | 'tentative' | 'needs-action';
} 