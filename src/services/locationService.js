/**
 * CrisisLens AI — Browser Geolocation & Location Service
 * 
 * PRIVACY RULES ENFORCED:
 * 1. Coordinates are kept strictly in-memory; NEVER persisted to localStorage or backend.
 * 2. Exact numerical coordinates are never exposed to the UI; only approximate proximity labels (e.g. "~12 km from you").
 * 3. Graceful fallback when denied or unavailable.
 * 4. Includes demo locations for safe, guaranteed presentation execution.
 */

import { DEMO_LOCATIONS } from '../data/crisisDataset.js';

export const LOCATION_STATUS = {
  IDLE: 'IDLE',
  REQUESTING: 'REQUESTING',
  ACTIVE: 'ACTIVE',
  DEMO: 'DEMO',
  DENIED: 'DENIED',
  UNAVAILABLE: 'UNAVAILABLE',
  UNSUPPORTED: 'UNSUPPORTED'
};

class LocationService {
  constructor() {
    // In-memory state only (privacy requirement)
    this.userLocation = null; // { latitude, longitude, accuracy, isDemo, locationName }
    this.status = LOCATION_STATUS.IDLE;
    this.errorMessage = null;
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  getUserLocation() {
    return this.userLocation;
  }

  getStatus() {
    return this.status;
  }

  getDemoLocations() {
    return DEMO_LOCATIONS;
  }

  /**
   * Request real browser geolocation with explicit user permission
   * @returns {Promise<{success: boolean, location: Object|null, error: string|null}>}
   */
  async requestBrowserLocation() {
    if (!navigator || !navigator.geolocation) {
      this.status = LOCATION_STATUS.UNSUPPORTED;
      this.errorMessage = 'Geolocation is not supported by your browser.';
      this.notify();
      return { success: false, location: null, error: this.errorMessage };
    }

    this.status = LOCATION_STATUS.REQUESTING;
    this.errorMessage = null;
    this.notify();

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            isDemo: false,
            locationName: 'Your Current Area'
          };
          this.status = LOCATION_STATUS.ACTIVE;
          this.errorMessage = null;
          this.notify();
          resolve({ success: true, location: this.userLocation, error: null });
        },
        (err) => {
          this.userLocation = null;
          if (err.code === 1) { // PERMISSION_DENIED
            this.status = LOCATION_STATUS.DENIED;
            this.errorMessage = 'Location access permission was denied. Showing general crisis priority.';
          } else if (err.code === 2) { // POSITION_UNAVAILABLE
            this.status = LOCATION_STATUS.UNAVAILABLE;
            this.errorMessage = 'Location unavailable — showing general crisis priority.';
          } else if (err.code === 3) { // TIMEOUT
            this.status = LOCATION_STATUS.UNAVAILABLE;
            this.errorMessage = 'Location request timed out — showing general crisis priority.';
          } else {
            this.status = LOCATION_STATUS.UNAVAILABLE;
            this.errorMessage = 'Location unavailable — showing general crisis priority.';
          }
          this.notify();
          resolve({ success: false, location: null, error: this.errorMessage });
        },
        {
          enableHighAccuracy: false, // Low battery / privacy-friendly
          timeout: 8000,
          maximumAge: 60000 // Cache for 1 min in memory
        }
      );
    });
  }

  /**
   * Set a predefined synthetic demo location for presentation
   * @param {string} locationId 
   */
  setDemoLocation(locationId) {
    const demo = DEMO_LOCATIONS.find(loc => loc.id === locationId || loc.name.toLowerCase() === locationId.toLowerCase());
    if (!demo) return false;

    this.userLocation = {
      latitude: demo.latitude,
      longitude: demo.longitude,
      accuracy: 50,
      isDemo: true,
      locationName: demo.name,
      state: demo.state
    };
    this.status = LOCATION_STATUS.DEMO;
    this.errorMessage = null;
    this.notify();
    return true;
  }

  /**
   * Disable location-aware prioritization and clear in-memory coordinates
   */
  clearLocation() {
    this.userLocation = null;
    this.status = LOCATION_STATUS.IDLE;
    this.errorMessage = null;
    this.notify();
  }
}

export const locationService = new LocationService();
