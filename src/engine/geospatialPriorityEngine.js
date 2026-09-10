/**
 * CrisisLens AI — Geospatial Priority Engine
 * 
 * Computes an explainable, multi-factor urgency and triage score combining:
 * 1. Geographic Proximity (Distance Decay)
 * 2. Crisis Hazard Severity
 * 3. Epistemic Uncertainty & Controversy
 * 4. Temporal Recency
 * 
 * CRITICAL EPITEMIC BOUNDARY:
 * Location affects PRIORITY, NOT TRUTH.
 * Proximity determines emergency response urgency, never whether a claim is factual or disproven.
 */

import { calculateDistanceKm, calculateDistanceScore, formatProximityLabel } from '../utils/geo.js';

export const GEOSPATIAL_CONFIG = {
  // Configurable Factor Weights
  // Rationale:
  // - LOCATION_WEIGHT (0.40): Proximity determines immediate personal/operational hazard radius.
  // - SEVERITY_WEIGHT (0.25): Extreme life-threat emergencies must retain high visibility even if at a distance.
  // - UNCERTAINTY_WEIGHT (0.20): Unverified or disputed claims need high triage attention before viral panic amplifies.
  // - RECENCY_WEIGHT (0.15): Fresh breaking events require faster attention than settled historical events.
  LOCATION_WEIGHT: 0.40,
  SEVERITY_WEIGHT: 0.25,
  UNCERTAINTY_WEIGHT: 0.20,
  RECENCY_WEIGHT: 0.15,

  // Distance decay scale: at 50 km distance, proximity score is 0.5
  DISTANCE_DECAY_SCALE_KM: 50,

  // Priority Level Thresholds (0 - 100)
  LEVEL_THRESHOLDS: {
    CRITICAL: 80,
    HIGH: 60,
    MEDIUM: 40,
    LOW: 20,
    DISTANT: 0
  }
};

export class GeospatialPriorityEngine {
  /**
   * Calculates numerical severity score (0 to 1) from categorical urgency
   * @param {string} severity 
   * @returns {number}
   */
  static getSeverityScore(severity = 'MEDIUM') {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL': return 1.0;
      case 'HIGH': return 0.75;
      case 'MEDIUM': return 0.50;
      case 'LOW': return 0.25;
      default: return 0.50;
    }
  }

  /**
   * Calculates numerical uncertainty score (0 to 1).
   * Unverified or disputed claims receive higher triage priority to prevent rumor spread.
   * @param {Object} claim 
   * @returns {number}
   */
  static getUncertaintyScore(claim = {}) {
    const uncertainty = claim.uncertainty?.toUpperCase() || 'MODERATE';
    const status = claim.status?.toUpperCase() || 'UNVERIFIED';

    if (status === 'UNVERIFIED' || status === 'INSUFFICIENT EVIDENCE' || uncertainty === 'CRITICAL') {
      return 1.0;
    }
    if (uncertainty === 'HIGH' || status === 'PARTIALLY SUPPORTED') {
      return 0.75;
    }
    if (uncertainty === 'MODERATE') {
      return 0.50;
    }
    return 0.25; // LOW uncertainty
  }

  /**
   * Calculates recency score (0 to 1) based on hours elapsed since timestamp
   * @param {string} timestampISO 
   * @returns {number}
   */
  static getRecencyScore(timestampISO) {
    if (!timestampISO) return 0.5;
    const then = new Date(timestampISO).getTime();
    const now = Date.now();
    const diffHours = Math.max(0, (now - then) / (1000 * 60 * 60));

    // Decays over 24 hours
    if (diffHours <= 1) return 1.0;
    if (diffHours <= 3) return 0.85;
    if (diffHours <= 6) return 0.70;
    if (diffHours <= 12) return 0.50;
    if (diffHours <= 24) return 0.35;
    return 0.15;
  }

  /**
   * Evaluates priority score and factor breakdown for a claim relative to a user location.
   * 
   * @param {Object} claim Claim object containing { latitude, longitude, severity, uncertainty, timestamp, ... }
   * @param {Object|null} userLocation { latitude, longitude } or null if unavailable
   * @returns {Object} Complete prioritization payload
   */
  static evaluatePriority(claim, userLocation = null) {
    const hasUserLoc = Boolean(
      userLocation &&
      userLocation.latitude !== null && userLocation.latitude !== undefined &&
      userLocation.longitude !== null && userLocation.longitude !== undefined
    );

    const hasClaimCoords = Boolean(
      claim &&
      claim.latitude !== null && claim.latitude !== undefined &&
      claim.longitude !== null && claim.longitude !== undefined &&
      !isNaN(claim.latitude) && !isNaN(claim.longitude)
    );

    let distanceKm = null;
    let distanceScore = null;
    let isGeospatialActive = false;

    if (hasUserLoc && hasClaimCoords) {
      distanceKm = calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        claim.latitude,
        claim.longitude
      );
      distanceScore = calculateDistanceScore(distanceKm, GEOSPATIAL_CONFIG.DISTANCE_DECAY_SCALE_KM);
      isGeospatialActive = true;
    }

    const severityScore = this.getSeverityScore(claim.severity);
    const uncertaintyScore = this.getUncertaintyScore(claim);
    const recencyScore = this.getRecencyScore(claim.timestamp);

    let rawScore = 0;
    let weightsUsed = {};

    if (isGeospatialActive) {
      // Full 4-factor prioritization
      rawScore =
        GEOSPATIAL_CONFIG.LOCATION_WEIGHT * distanceScore +
        GEOSPATIAL_CONFIG.SEVERITY_WEIGHT * severityScore +
        GEOSPATIAL_CONFIG.UNCERTAINTY_WEIGHT * uncertaintyScore +
        GEOSPATIAL_CONFIG.RECENCY_WEIGHT * recencyScore;

      weightsUsed = {
        location: GEOSPATIAL_CONFIG.LOCATION_WEIGHT,
        severity: GEOSPATIAL_CONFIG.SEVERITY_WEIGHT,
        uncertainty: GEOSPATIAL_CONFIG.UNCERTAINTY_WEIGHT,
        recency: GEOSPATIAL_CONFIG.RECENCY_WEIGHT
      };
    } else {
      // Renormalize remaining weights without geographic contribution (do NOT invent fake distance)
      const baseSum =
        GEOSPATIAL_CONFIG.SEVERITY_WEIGHT +
        GEOSPATIAL_CONFIG.UNCERTAINTY_WEIGHT +
        GEOSPATIAL_CONFIG.RECENCY_WEIGHT;

      const normSev = GEOSPATIAL_CONFIG.SEVERITY_WEIGHT / baseSum;
      const normUnc = GEOSPATIAL_CONFIG.UNCERTAINTY_WEIGHT / baseSum;
      const normRec = GEOSPATIAL_CONFIG.RECENCY_WEIGHT / baseSum;

      rawScore =
        normSev * severityScore +
        normUnc * uncertaintyScore +
        normRec * recencyScore;

      weightsUsed = {
        location: 0,
        severity: Math.round(normSev * 100) / 100,
        uncertainty: Math.round(normUnc * 100) / 100,
        recency: Math.round(normRec * 100) / 100
      };
    }

    // Normalized to 0–100 integer
    const priorityScore = Math.min(100, Math.max(0, Math.round(rawScore * 100)));

    // Determine Level Label & Color
    let level = 'DISTANT';
    let levelColor = '#94a3b8';
    let levelIcon = '⚪';

    const th = GEOSPATIAL_CONFIG.LEVEL_THRESHOLDS;
    if (priorityScore >= th.CRITICAL) {
      level = 'CRITICAL';
      levelColor = '#ef4444';
      levelIcon = '🔴';
    } else if (priorityScore >= th.HIGH) {
      level = 'HIGH';
      levelColor = '#f97316';
      levelIcon = '🟠';
    } else if (priorityScore >= th.MEDIUM) {
      level = 'MEDIUM';
      levelColor = '#eab308';
      levelIcon = '🟡';
    } else if (priorityScore >= th.LOW) {
      level = 'LOW';
      levelColor = '#10b981';
      levelIcon = '🟢';
    }

    const proximityLabel = formatProximityLabel(distanceKm);

    // Natural-language explainability justification
    let rationale = '';
    if (isGeospatialActive) {
      if (distanceKm < 25) {
        rationale = `Immediate geographic proximity (${proximityLabel}) escalates triage priority for local responders.`;
      } else if (distanceKm < 100) {
        rationale = `Regional disaster radius (${proximityLabel}) combined with ${claim.severity} urgency.`;
      } else {
        rationale = `Distant event (${proximityLabel}); prioritised primarily by incident severity and uncertainty.`;
      }
    } else {
      rationale = 'General non-geospatial crisis priority based on severity, recency, and uncertainty.';
    }

    return {
      priorityScore,
      level,
      levelColor,
      levelIcon,
      distanceKm,
      proximityLabel,
      isGeospatialActive,
      factors: {
        proximity: isGeospatialActive ? Math.round(distanceScore * 100) : null,
        severity: Math.round(severityScore * 100),
        uncertainty: Math.round(uncertaintyScore * 100),
        recency: Math.round(recencyScore * 100)
      },
      weightsUsed,
      rationale,
      disclaimer: 'Proximity affects priority and relevance only. It does not determine whether a claim is true or false.'
    };
  }
}
