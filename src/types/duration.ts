/**
 * Duration interface for JSON Calendar
 * 
 * A structured representation of an ISO 8601 duration.
 * At least one property is required.
 */
export interface Duration {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
} 