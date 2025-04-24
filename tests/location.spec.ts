import { describe, it, expect } from 'vitest';
import { 
  setLocation, 
  removeLocation, 
  updateLocation, 
  formatLocation,
  hasCoordinates,
  calculateDistance
} from '../src/location';
import { Location } from '../src/types/location';
import { Event } from '../src/types/event';

describe('Location Utilities', () => {
  // Sample event for testing
  const baseEvent: Event = {
    uid: 'test-event-123',
    summary: 'Test Event',
    start: '2023-06-01T10:00:00Z',
    end: '2023-06-01T11:00:00Z'
  };

  // Sample locations for testing
  const location1: Location = {
    name: 'Conference Room A',
    address: '123 Main St, Anytown, USA',
    latitude: 40.7128,
    longitude: -74.0060,
    mapUrl: 'https://maps.example.com/room-a'
  };

  const location2: Location = {
    name: 'Virtual Meeting',
    mapUrl: 'https://meeting.example.com/room-b'
  };

  const location3: Location = {
    name: 'Conference Room B',
    address: '456 Oak St, Othertown, USA',
    latitude: 37.7749,
    longitude: -122.4194
  };

  // Test setLocation function
  describe('setLocation', () => {
    it('sets a location for an event without a location', () => {
      const result = setLocation(baseEvent, location1);
      
      expect(result.location).toEqual(location1);
      expect(result.lastModified).toBeDefined();
    });

    it('replaces an existing location', () => {
      const eventWithLocation = {
        ...baseEvent,
        location: location1
      };

      const result = setLocation(eventWithLocation, location2);
      
      expect(result.location).toEqual(location2);
      expect(result.location).not.toEqual(location1);
    });

    it('throws an error for invalid location data', () => {
      const invalidLocation = {
        // Missing required 'name' property
        address: '123 Main St'
      };

      // @ts-ignore - Testing invalid input
      expect(() => setLocation(baseEvent, invalidLocation)).toThrow();
    });
  });

  // Test removeLocation function
  describe('removeLocation', () => {
    it('removes a location from an event', () => {
      const eventWithLocation = {
        ...baseEvent,
        location: location1
      };

      const result = removeLocation(eventWithLocation);
      
      expect(result.location).toBeUndefined();
    });

    it('returns the event unchanged if no location exists', () => {
      const result = removeLocation(baseEvent);
      
      expect(result).toEqual(baseEvent);
    });
  });

  // Test updateLocation function
  describe('updateLocation', () => {
    it('updates specific fields of an existing location', () => {
      const eventWithLocation = {
        ...baseEvent,
        location: location1
      };

      const updates = {
        address: 'Updated Address',
        mapUrl: 'https://updated-map.example.com'
      };

      const result = updateLocation(eventWithLocation, updates);
      
      expect(result.location).toEqual({
        ...location1,
        ...updates
      });
      expect(result.location?.name).toEqual(location1.name); // Unchanged field
    });

    it('creates a new location if none exists (when name is provided)', () => {
      const newLocationData = {
        name: 'New Location'
      };

      const result = updateLocation(baseEvent, newLocationData);
      
      expect(result.location).toEqual(newLocationData);
    });

    it('throws an error when creating a new location without a name', () => {
      const incompleteLocation = {
        address: 'No Name Location'
      };

      expect(() => updateLocation(baseEvent, incompleteLocation)).toThrow();
    });

    it('throws an error for invalid location data after update', () => {
      const eventWithLocation = {
        ...baseEvent,
        location: location1
      };

      const invalidUpdate = {
        mapUrl: 'not-a-url' // Invalid URL format
      };

      expect(() => updateLocation(eventWithLocation, invalidUpdate)).toThrow();
    });
  });

  // Test formatLocation function
  describe('formatLocation', () => {
    it('formats a location with name and address', () => {
      const result = formatLocation(location1);
      expect(result).toBe('Conference Room A, 123 Main St, Anytown, USA');
    });

    it('formats a location with name only', () => {
      const result = formatLocation(location2);
      expect(result).toBe('Virtual Meeting');
    });
  });

  // Test hasCoordinates function
  describe('hasCoordinates', () => {
    it('returns true when both latitude and longitude are defined', () => {
      expect(hasCoordinates(location1)).toBe(true);
    });

    it('returns false when coordinates are missing', () => {
      expect(hasCoordinates(location2)).toBe(false);
    });
  });

  // Test calculateDistance function
  describe('calculateDistance', () => {
    it('calculates distance between two locations with coordinates', () => {
      const distance = calculateDistance(location1, location3);
      
      // The approximate distance between NYC (40.7128, -74.0060) and SF (37.7749, -122.4194)
      // should be around 4,130 km
      expect(distance).toBeCloseTo(4130, -2); // Allow tolerance of ~100km
    });

    it('returns null if either location is missing coordinates', () => {
      const distance = calculateDistance(location1, location2);
      expect(distance).toBeNull();
    });
  });
}); 