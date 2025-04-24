import { JsonCalendarDocument } from './types/jsonCalendarDocument';
import { JsonCalendarDocumentSchema } from './schemas/jsonCalendarDocument';
import { ZodError } from 'zod';

/**
 * Loads and validates a JSON Calendar document
 * 
 * @param jsonData - The JSON data to validate (already parsed, not a string)
 * @returns A validated JsonCalendarDocument object
 * @throws Error if validation fails with detailed validation information
 */
export function loadJsonCalendar(jsonData: unknown): JsonCalendarDocument {
  try {
    // Parse and validate the input data against the schema
    return JsonCalendarDocumentSchema.parse(jsonData);
  } catch (error) {
    if (error instanceof ZodError) {
      // Format Zod validation errors into a more readable structure
      const formattedErrors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('\n');
      
      throw new Error(`Invalid JSON Calendar document:\n${formattedErrors}`);
    }
    // Handle other types of errors
    throw new Error(`Invalid JSON Calendar document: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Safely loads and validates a JSON Calendar document without throwing errors
 * 
 * @param jsonData - The JSON data to validate (already parsed, not a string)
 * @returns An object containing either the valid document or detailed error information
 */
export function safeLoadJsonCalendar(jsonData: unknown): 
  { success: true; data: JsonCalendarDocument } | 
  { success: false; error: string } {
  
  const result = JsonCalendarDocumentSchema.safeParse(jsonData);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    // Format Zod validation errors into a more readable structure
    const formattedErrors = result.error.errors.map(err => 
      `${err.path.join('.')}: ${err.message}`
    ).join('\n');
    
    return { success: false, error: formattedErrors };
  }
}