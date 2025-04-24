import { Recurrence } from './types/recurrence';
import { Event } from './types/event';

/**
 * ParsedRecurrence represents a recurrence rule with parsed dates and defaults.
 */
export interface ParsedRecurrence {
  frequency?: Recurrence['frequency'];
  interval: number;
  until?: Date;
  count?: number;
  byDay?: string[];
  byMonthDay?: number[];
  weekStart: Recurrence['weekStart'];
  exceptionDates: Date[];
  recurrenceAdditions: Date[];
}

/**
 * Parse and normalize a Recurrence object, converting string dates to Date,
 * and applying defaults for interval and weekStart.
 */
export function parseRecurrence(recurrence: Recurrence): ParsedRecurrence {
  const {
    frequency,
    interval,
    until,
    count,
    byDay,
    byMonthDay,
    weekStart,
    exceptionDates,
    recurrenceAdditions,
  } = recurrence;

  if (!frequency && count === undefined && until === undefined) {
    throw new Error(
      'Invalid Recurrence: must have frequency (with interval), or until, or count'
    );
  }

  return {
    frequency,
    interval: interval ?? 1,
    until: until ? new Date(until) : undefined,
    count,
    byDay: byDay ? [...byDay] : undefined,
    byMonthDay: byMonthDay ? [...byMonthDay] : undefined,
    weekStart: weekStart ?? 'MO',
    exceptionDates: exceptionDates
      ? exceptionDates.map((d) => new Date(d))
      : [],
    recurrenceAdditions: recurrenceAdditions
      ? recurrenceAdditions.map((d) => new Date(d))
      : [],
  };
}

/**
 * Check if the given date matches one of the byDay rules.
 * byDay entries are abbreviations like 'MO', 'TU', ..., possibly with ordinals like '1MO', '-1SU'.
 */
export function matchesByDay(date: Date, byDay?: string[]): boolean {
  if (!byDay || byDay.length === 0) return true;
  const weekDays = ['SU','MO','TU','WE','TH','FR','SA'];
  const day = weekDays[date.getUTCDay()];
  return byDay.some((rule) => {
    const match = rule.match(/^-?\d*(MO|TU|WE|TH|FR|SA|SU)$/);
    if (!match) return false;
    const token = rule.slice(-2);
    return token === day;
  });
}

/**
 * Check if the given date matches one of the byMonthDay rules.
 */
export function matchesByMonthDay(date: Date, byMonthDay?: number[]): boolean {
  if (!byMonthDay || byMonthDay.length === 0) return true;
  const day = date.getUTCDate();
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  
  return byMonthDay.some((d) => {
    if (d > 0) {
      return d === day;
    } else {
      // negative values: count from end, e.g., -1 is last day, -2 second to last
      const targetDay = lastDay + d + 1;
      return targetDay === day;
    }
  });
}

/**
 * Apply exceptionDates and recurrenceAdditions to a list of dates.
 * Removes any dates matching exceptionDates, and adds any recurrenceAdditions.
 */
export function applyRecurrenceFilters(
  dates: Date[],
  parsed: ParsedRecurrence
): Date[] {
  let result = dates.filter(
    (d) =>
      !parsed.exceptionDates.some(
        (ex) => ex.getTime() === d.getTime()
      )
  );
  if (parsed.recurrenceAdditions.length > 0) {
    result = [...result, ...parsed.recurrenceAdditions];
  }
  return result.sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Generate all occurrences of an event in the specified date range.
 * Takes into account recurrence rules, exceptions, and additions.
 * 
 * @param event - The event to generate occurrences for
 * @param startRange - ISO 8601 date string for the start of the range
 * @param endRange - ISO 8601 date string for the end of the range
 * @returns Array of event occurrences within the range
 */
export function getOccurrences(
  event: Event,
  startRange: string,
  endRange: string
): Event[] {
  const startRangeDate = new Date(startRange);
  const endRangeDate = new Date(endRange);
  
  // For non-recurring events, just check if it's in the range
  if (!event.recurrence) {
    const eventStart = new Date(event.start);
    if (eventStart >= startRangeDate && eventStart <= endRangeDate) {
      // Create a new event with ISO string
      const newEvent = { ...event };
      newEvent.start = eventStart.toISOString();
      if (event.end) {
        newEvent.end = new Date(event.end).toISOString();
      }
      return [newEvent];
    }
    return [];
  }
  
  // Parse the recurrence rule
  const parsedRecurrence = parseRecurrence(event.recurrence);
  
  // Get the base event start date
  const eventStartDate = new Date(event.start);
  // Calculate event duration in milliseconds for creating end dates
  const eventDuration = event.end 
    ? new Date(event.end).getTime() - eventStartDate.getTime()
    : 0;
  
  // Generate dates based on the recurrence rule
  const occurrenceDates = generateOccurrenceDates(
    eventStartDate, 
    startRangeDate,
    endRangeDate,
    parsedRecurrence
  );
  
  // Apply recurrence filters (exceptions and additions)
  const filteredDates = applyRecurrenceFilters(occurrenceDates, parsedRecurrence);
  
  // Convert dates to events
  return filteredDates.map(date => {
    const newEvent = { ...event };
    newEvent.start = date.toISOString();
    
    // Set end date if original event had one
    if (event.end) {
      const newEndDate = new Date(date.getTime() + eventDuration);
      newEvent.end = newEndDate.toISOString();
    }
    
    // Remove recurrence rules from the instances
    delete newEvent.recurrence;
    
    return newEvent;
  });
}

/**
 * Generate occurrence dates based on recurrence rule
 */
function generateOccurrenceDates(
  baseDate: Date,
  startRange: Date,
  endRange: Date,
  recurrence: ParsedRecurrence
): Date[] {
  const result: Date[] = [];
  
  // If the base date is in range, include it
  if (baseDate >= startRange && baseDate <= endRange && 
      matchesByDay(baseDate, recurrence.byDay) && 
      matchesByMonthDay(baseDate, recurrence.byMonthDay)) {
    result.push(new Date(baseDate.getTime()));
  }
  
  // If no frequency, we only have the base date
  if (!recurrence.frequency) {
    return result;
  }

  // Special handling for byDay in weekly recurrence
  if (recurrence.frequency === 'week' && recurrence.byDay && recurrence.byDay.length > 0) {
    return generateWeeklyOccurrences(baseDate, startRange, endRange, recurrence);
  }
  
  // Special handling for byMonthDay in monthly recurrence
  if (recurrence.frequency === 'month' && recurrence.byMonthDay && recurrence.byMonthDay.length > 0) {
    return generateMonthlyOccurrences(baseDate, startRange, endRange, recurrence);
  }
  
  // Set a reasonable iteration limit and bail if we hit it
  const MAX_ITERATIONS = 1000;
  let iterations = 0;
  
  // Clone the base date to start generating occurrences
  const currentDate = new Date(baseDate.getTime());
  
  // Continue until we exceed the end range, hit count limit,
  // or exceed the "until" date if specified
  while (iterations < MAX_ITERATIONS) {
    iterations++;
    
    // Apply the frequency and interval to get the next occurrence
    advanceDate(currentDate, recurrence.frequency, recurrence.interval);
    
    // Stop if we've exceeded the "until" date
    if (recurrence.until && currentDate > recurrence.until) {
      break;
    }
    
    // Stop if we've exceeded the end range
    if (currentDate > endRange) {
      break;
    }
    
    // Skip if we're before the start range
    if (currentDate < startRange) {
      continue;
    }
    
    // Check if this date matches byDay and byMonthDay constraints
    if (matchesByDay(currentDate, recurrence.byDay) && 
        matchesByMonthDay(currentDate, recurrence.byMonthDay)) {
      result.push(new Date(currentDate.getTime()));
    }
    
    // Stop if we've reached the count limit
    if (recurrence.count && result.length >= recurrence.count) {
      break;
    }
  }
  
  return result;
}

/**
 * Generate weekly occurrences with byDay rules
 */
function generateWeeklyOccurrences(
  baseDate: Date,
  startRange: Date,
  endRange: Date,
  recurrence: ParsedRecurrence
): Date[] {
  const result: Date[] = [];
  
  // Set a reasonable iteration limit and bail if we hit it
  const MAX_ITERATIONS = 1000;
  let iterations = 0;
  
  // Clone the base date to start generating occurrences
  const currentDate = new Date(baseDate.getTime());
  const interval = recurrence.interval;
  const byDay = recurrence.byDay;
  
  if (!byDay) return result;
  
  // Get the base week
  const baseWeekStart = new Date(currentDate.getTime());
  baseWeekStart.setUTCDate(baseWeekStart.getUTCDate() - baseWeekStart.getUTCDay());
  
  // Add base date if it matches criteria and is in range
  if (baseDate >= startRange && baseDate <= endRange && 
      matchesByDay(baseDate, byDay)) {
    result.push(new Date(baseDate.getTime()));
  }
  
  // Keep track of the current week
  let currentWeek = 0;
  
  while (iterations < MAX_ITERATIONS) {
    iterations++;
    
    // Check each day in the week
    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(baseWeekStart.getTime());
      weekDay.setUTCDate(weekDay.getUTCDate() + i + (currentWeek * 7 * interval));
      
      // Skip if out of range or doesn't match criteria
      if (weekDay <= baseDate) continue; // Skip days before the base date
      if (weekDay < startRange) continue;
      if (weekDay > endRange) return result;
      if (recurrence.until && weekDay > recurrence.until) return result;
      
      // Check if this day matches byDay rules
      if (matchesByDay(weekDay, byDay)) {
        result.push(new Date(weekDay.getTime()));
      }
    }
    
    // Stop if we've reached the count limit
    if (recurrence.count && result.length >= recurrence.count) {
      break;
    }
    
    // Move to the next week
    currentWeek++;
  }
  
  return result;
}

/**
 * Generate monthly occurrences with byMonthDay rules
 */
function generateMonthlyOccurrences(
  baseDate: Date,
  startRange: Date,
  endRange: Date,
  recurrence: ParsedRecurrence
): Date[] {
  const result: Date[] = [];
  
  // Set a reasonable iteration limit and bail if we hit it
  const MAX_ITERATIONS = 1000;
  let iterations = 0;
  
  // Clone the base date to start generating occurrences
  const currentDate = new Date(baseDate.getTime());
  const interval = recurrence.interval;
  const byMonthDay = recurrence.byMonthDay;
  
  if (!byMonthDay) return result;
  
  // Add base date if it matches criteria and is in range
  if (baseDate >= startRange && baseDate <= endRange && 
      matchesByMonthDay(baseDate, byMonthDay)) {
    result.push(new Date(baseDate.getTime()));
  }
  
  // Track current month (0 = base month)
  let currentMonth = 0;
  
  while (iterations < MAX_ITERATIONS) {
    iterations++;
    
    // Advance to next month by interval
    if (iterations > 1) {
      currentMonth += interval;
    }
    
    const year = baseDate.getUTCFullYear() + Math.floor((baseDate.getUTCMonth() + currentMonth) / 12);
    const month = (baseDate.getUTCMonth() + currentMonth) % 12;
    
    // Check each specified monthDay
    for (const day of byMonthDay) {
      // Calculate the actual day, handling negative days (counting from end)
      let actualDay;
      if (day > 0) {
        actualDay = day;
      } else {
        // For negative days, count from end of month
        const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
        actualDay = lastDay + day + 1;
      }
      
      // Skip invalid days
      if (actualDay < 1) continue;
      
      // Create date for this occurrence
      const occurrenceDate = new Date(Date.UTC(
        year,
        month,
        actualDay,
        baseDate.getUTCHours(),
        baseDate.getUTCMinutes(),
        baseDate.getUTCSeconds(),
        baseDate.getUTCMilliseconds()
      ));
      
      // Skip if out of range
      if (occurrenceDate <= baseDate) continue; // Skip dates before the base date
      if (occurrenceDate < startRange) continue;
      if (occurrenceDate > endRange) return result;
      if (recurrence.until && occurrenceDate > recurrence.until) return result;
      
      result.push(occurrenceDate);
    }
    
    // Stop if we've reached the count limit
    if (recurrence.count && result.length >= recurrence.count) {
      break;
    }
  }
  
  return result;
}

/**
 * Advance a date based on frequency and interval
 */
function advanceDate(
  date: Date, 
  frequency: Recurrence['frequency'], 
  interval: number
): void {
  switch (frequency) {
    case 'second':
      date.setUTCSeconds(date.getUTCSeconds() + interval);
      break;
    case 'minute':
      date.setUTCMinutes(date.getUTCMinutes() + interval);
      break;
    case 'hour':
      date.setUTCHours(date.getUTCHours() + interval);
      break;
    case 'day':
      date.setUTCDate(date.getUTCDate() + interval);
      break;
    case 'week':
      date.setUTCDate(date.getUTCDate() + (interval * 7));
      break;
    case 'month':
      date.setUTCMonth(date.getUTCMonth() + interval);
      break;
    case 'year':
      date.setUTCFullYear(date.getUTCFullYear() + interval);
      break;
  }
}
