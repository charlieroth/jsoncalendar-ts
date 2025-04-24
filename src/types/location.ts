/**
 * Location interface for JSON Calendar
 * 
 * A structured representation of the event location.
 */
export interface Location {
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
} 