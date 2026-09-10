/**
 * CrisisLens AI — Geospatial Utilities
 * 
 * Implements the standard Haversine distance formula and smooth distance decay functions.
 * All computations are purely local and in-memory to preserve user privacy.
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Calculates great-circle distance between two geographic coordinates using Haversine formula.
 * @param {number} lat1 Latitude of point 1 in degrees
 * @param {number} lon1 Longitude of point 1 in degrees
 * @param {number} lat2 Latitude of point 2 in degrees
 * @param {number} lon2 Longitude of point 2 in degrees
 * @returns {number} Distance in kilometers
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  // Validate coordinates
  if (
    lat1 === null || lat1 === undefined || isNaN(lat1) ||
    lon1 === null || lon1 === undefined || isNaN(lon1) ||
    lat2 === null || lat2 === undefined || isNaN(lat2) ||
    lon2 === null || lon2 === undefined || isNaN(lon2)
  ) {
    return null;
  }

  // Exact same point
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }

  const toRad = (angle) => (angle * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const radLat1 = toRad(lat1);
  const radLat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = EARTH_RADIUS_KM * c;
  return Math.round(distance * 10) / 10; // 1 decimal place precision
}

/**
 * Calculates a smooth distance decay score in range [0, 1].
 * Uses a hyperbolic decay curve: score = 1 / (1 + distanceKm / decayScaleKm)
 * Closer claims receive a score near 1.0; distant claims decay toward 0.
 * 
 * @param {number} distanceKm Distance in kilometers
 * @param {number} decayScaleKm Characteristic decay distance (default 50 km)
 * @returns {number} Distance score clamped to [0, 1]
 */
export function calculateDistanceScore(distanceKm, decayScaleKm = 50) {
  if (distanceKm === null || distanceKm === undefined || isNaN(distanceKm)) {
    return null;
  }

  if (distanceKm < 0) return 0;
  if (distanceKm === 0) return 1;

  const score = 1 / (1 + distanceKm / decayScaleKm);
  return Math.min(1, Math.max(0, Math.round(score * 1000) / 1000));
}

/**
 * Formats a distance value into a human-friendly string without exposing exact user coordinates.
 * @param {number|null} distanceKm 
 * @returns {string} e.g. "Nearby (< 1 km)", "12.4 km from you", or "Distance unavailable"
 */
export function formatProximityLabel(distanceKm) {
  if (distanceKm === null || distanceKm === undefined || isNaN(distanceKm)) {
    return 'Distance unavailable';
  }
  if (distanceKm < 1) {
    return 'Nearby (< 1 km from you)';
  }
  if (distanceKm < 5) {
    return `~${distanceKm.toFixed(1)} km from you`;
  }
  return `${Math.round(distanceKm)} km from you`;
}
