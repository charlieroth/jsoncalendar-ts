import { Event } from './types/event';
import { Location } from './types/location';
import { LocationSchema } from './schemas/location';

/**
 * Sets or updates the location for an event
 * @param event The event to update the location for
 * @param location The location data to set
 * @returns A new event with the updated location
 */
export function setLocation(event: Event, location: Location): Event {
  // Validate the location
  LocationSchema.parse(location);

  // Create a new copy of the event with the location and updated lastModified
  const newEvent: Event = {
    ...event,
    location,
    lastModified: new Date().toISOString()
  };

  return newEvent;
}

/**
 * Removes the location from an event
 * @param event The event to remove the location from
 * @returns A new event with the location removed
 */
export function removeLocation(event: Event): Event {
  // If no location, return the event unchanged
  if (!event.location) {
    return event;
  }

  // Create a new copy of the event without the location
  const { location, ...eventWithoutLocation } = event;
  const newEvent: Event = {
    ...eventWithoutLocation,
    lastModified: new Date().toISOString()
  };

  return newEvent;
}

/**
 * Updates specific fields of an existing location
 * @param event The event containing the location to update
 * @param locationUpdates Partial location with fields to update
 * @returns A new event with the updated location
 */
export function updateLocation(event: Event, locationUpdates: Partial<Location>): Event {
  // If no existing location, set a new one (must have 'name' property)
  if (!event.location) {
    if (!('name' in locationUpdates)) {
      throw new Error("Location name is required when creating a new location");
    }
    return setLocation(event, locationUpdates as Location);
  }

  // Merge existing location with updates
  const updatedLocation: Location = {
    ...event.location,
    ...locationUpdates
  };

  // Validate the merged location
  LocationSchema.parse(updatedLocation);

  // Create a new copy of the event
  const newEvent: Event = {
    ...event,
    location: updatedLocation,
    lastModified: new Date().toISOString()
  };

  return newEvent;
}

/**
 * Utility to format a location as a display string
 * @param location The location to format
 * @returns A formatted string representation of the location
 */
export function formatLocation(location: Location): string {
  const parts: string[] = [location.name];
  
  if (location.address) {
    parts.push(location.address);
  }
  
  return parts.join(', ');
}

/**
 * Check if a location has geographic coordinates
 * @param location The location to check
 * @returns True if the location has both latitude and longitude
 */
export function hasCoordinates(location: Location): boolean {
  return typeof location.latitude === 'number' && 
         typeof location.longitude === 'number';
}

/**
 * Calculate distance between two locations (using Haversine formula)
 * @param location1 First location with coordinates
 * @param location2 Second location with coordinates
 * @returns Distance in kilometers, or null if coordinates are missing
 */
export function calculateDistance(location1: Location, location2: Location): number | null {
  if (!hasCoordinates(location1) || !hasCoordinates(location2)) {
    return null;
  }
  
  // Haversine formula implementation
  const R = 6371; // Earth radius in kilometers
  const lat1 = location1.latitude!;
  const lon1 = location1.longitude!;
  const lat2 = location2.latitude!;
  const lon2 = location2.longitude!;
  
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
} 