import { Calendar } from './calendar';

/**
 * JsonCalendarDocument interface for JSON Calendar
 * 
 * The root object for a JSON Calendar document.
 */
export interface JsonCalendarDocument {
  version: '1.0';
  productIdentifier?: string;
  calendar: Calendar;
} 