/**
 * Recurrence interface for JSON Calendar
 * 
 * Details for recurring events.
 */
export interface Recurrence {
  frequency?: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
  interval?: number;
  until?: string;
  count?: number;
  byDay?: string[];
  byMonthDay?: number[];
  weekStart?: 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU';
  exceptionDates?: string[];
  recurrenceAdditions?: string[];
} 