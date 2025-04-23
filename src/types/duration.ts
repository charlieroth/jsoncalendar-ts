/**
 * A structured representation of an ISO 8601 duration. At least one property is required.
 */
export interface Duration {
  /** The number of years (must be >= 0). */
  years?: number;
  /** The number of months (must be >= 0). */
  months?: number;
  /** The number of days (must be >= 0). */
  days?: number;
  /** The number of hours (must be >= 0). */
  hours?: number;
  /** The number of minutes (must be >= 0). */
  minutes?: number;
  /** The number of seconds (must be >= 0). */
  seconds?: number;
} 