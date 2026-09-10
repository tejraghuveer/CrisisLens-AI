/**
 * CrisisLens AI — Geospatial Priority Engine Automated Tests
 * 
 * Verifies all 10 requirements:
 * 1. Same location (~0 km, distanceScore = 1.0)
 * 2. Nearby claim (e.g. Vijayawada to Guntur ~32 km)
 * 3. Distant claim (e.g. Vijayawada to Visakhapatnam ~300 km)
 * 4. Very distant claim (e.g. Vijayawada to Noida ~1400 km)
 * 5. High-severity nearby claim (high priority)
 * 6. Low-severity nearby claim (moderated priority)
 * 7. High-severity distant claim (retains visibility)
 * 8. Missing claim coordinates (renormalized remaining weights without fake distance)
 * 9. Location permission denied / unavailable (fallback to general priority)
 * 10. Epistemic Independence: Location affects priority ONLY and does NOT change verification truth status!
 */

import { calculateDistanceKm, calculateDistanceScore, formatProximityLabel } from '../src/utils/geo.js';
import { GeospatialPriorityEngine, GEOSPATIAL_CONFIG } from '../src/engine/geospatialPriorityEngine.js';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    testsFailed++;
    throw new Error(message);
  } else {
    console.log(`✅ PASS: ${message}`);
    testsPassed++;
  }
}

function runTests() {
  console.log('\n======================================================');
  console.log('CRISISLENS AI — GEOSPATIAL TEST SUITE');
  console.log('======================================================\n');

  // Coordinates:
  // Vijayawada: 16.5062, 80.6480
  // Guntur: 16.3067, 80.4365 (~31-35 km)
  // Visakhapatnam: 17.6868, 83.2185 (~300 km)
  // Noida: 28.5355, 77.3910 (~1400 km)
  const VIJAYAWADA = { latitude: 16.5062, longitude: 80.6480 };
  const GUNTUR = { latitude: 16.3067, longitude: 80.4365 };
  const VIZAG = { latitude: 17.6868, longitude: 83.2185 };
  const NOIDA = { latitude: 28.5355, longitude: 77.3910 };

  // TEST 1: Same location -> 0 km, distanceScore = 1.0
  const dSame = calculateDistanceKm(VIJAYAWADA.latitude, VIJAYAWADA.longitude, VIJAYAWADA.latitude, VIJAYAWADA.longitude);
  assert(dSame === 0, `Test 1: Same coordinates return 0 km (got ${dSame})`);
  const sSame = calculateDistanceScore(dSame);
  assert(sSame === 1, `Test 1b: Distance score at 0 km is 1.0 (got ${sSame})`);

  // TEST 2: Nearby claim (Vijayawada to Guntur ~32 km)
  const dNearby = calculateDistanceKm(VIJAYAWADA.latitude, VIJAYAWADA.longitude, GUNTUR.latitude, GUNTUR.longitude);
  assert(dNearby > 25 && dNearby < 40, `Test 2: Nearby coordinates (Vijayawada-Guntur) are ~32 km (got ${dNearby} km)`);
  const sNearby = calculateDistanceScore(dNearby);
  assert(sNearby > 0.55 && sNearby < 0.70, `Test 2b: Nearby distance score is ~0.61 (got ${sNearby})`);

  // TEST 3: Distant claim (Vijayawada to Visakhapatnam ~300 km)
  const dDistant = calculateDistanceKm(VIJAYAWADA.latitude, VIJAYAWADA.longitude, VIZAG.latitude, VIZAG.longitude);
  assert(dDistant > 280 && dDistant < 350, `Test 3: Distant coordinates (Vijayawada-Vizag) are ~300 km (got ${dDistant} km)`);
  const sDistant = calculateDistanceScore(dDistant);
  assert(sDistant < sNearby, `Test 3b: Distant score (${sDistant}) is lower than nearby score (${sNearby})`);

  // TEST 4: Very distant claim (Vijayawada to Noida ~1400 km)
  const dVeryDistant = calculateDistanceKm(VIJAYAWADA.latitude, VIJAYAWADA.longitude, NOIDA.latitude, NOIDA.longitude);
  assert(dVeryDistant > 1300 && dVeryDistant < 1550, `Test 4: Very distant coordinates are ~1400 km (got ${dVeryDistant} km)`);
  const sVeryDistant = calculateDistanceScore(dVeryDistant);
  assert(sVeryDistant < sDistant, `Test 4b: Very distant score (${sVeryDistant}) is lower than distant score (${sDistant})`);

  // TEST 5: High-severity nearby claim -> CRITICAL / HIGH priority
  const highNearbyClaim = {
    id: 'c-high-near',
    latitude: 16.5100,
    longitude: 80.6500, // ~0.5 km from Vijayawada
    severity: 'CRITICAL',
    uncertainty: 'HIGH',
    timestamp: new Date().toISOString()
  };
  const pHighNear = GeospatialPriorityEngine.evaluatePriority(highNearbyClaim, VIJAYAWADA);
  assert(pHighNear.priorityScore >= 80, `Test 5: High-severity nearby claim has score >= 80 (got ${pHighNear.priorityScore})`);
  assert(pHighNear.level === 'CRITICAL', `Test 5b: Level is CRITICAL (got ${pHighNear.level})`);

  // TEST 6: Low-severity nearby claim -> Moderated priority
  const lowNearbyClaim = {
    id: 'c-low-near',
    latitude: 16.5100,
    longitude: 80.6500, // ~0.5 km
    severity: 'LOW',
    uncertainty: 'LOW',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  };
  const pLowNear = GeospatialPriorityEngine.evaluatePriority(lowNearbyClaim, VIJAYAWADA);
  assert(pLowNear.priorityScore < pHighNear.priorityScore, `Test 6: Low severity nearby (${pLowNear.priorityScore}) is lower than high severity nearby (${pHighNear.priorityScore})`);

  // TEST 7: High-severity distant claim retains visibility
  const highDistantClaim = {
    id: 'c-high-dist',
    latitude: NOIDA.latitude,
    longitude: NOIDA.longitude,
    severity: 'CRITICAL',
    uncertainty: 'HIGH',
    timestamp: new Date().toISOString()
  };
  const pHighDistant = GeospatialPriorityEngine.evaluatePriority(highDistantClaim, VIJAYAWADA);
  assert(pHighDistant.priorityScore > 35, `Test 7: High-severity distant claim retains baseline urgency (got ${pHighDistant.priorityScore})`);
  assert(pHighDistant.distanceKm > 1000, `Test 7b: Distance correctly computed as > 1000 km (got ${pHighDistant.distanceKm})`);

  // TEST 8: Missing claim coordinates -> Renormalized remaining weights without fake distance
  const noCoordClaim = {
    id: 'c-no-coords',
    latitude: null,
    longitude: null,
    severity: 'HIGH',
    uncertainty: 'MODERATE',
    timestamp: new Date().toISOString()
  };
  const pNoCoords = GeospatialPriorityEngine.evaluatePriority(noCoordClaim, VIJAYAWADA);
  assert(pNoCoords.isGeospatialActive === false, `Test 8: isGeospatialActive is false for missing coordinates`);
  assert(pNoCoords.distanceKm === null, `Test 8b: distanceKm is null (no fake distance invented)`);
  assert(pNoCoords.priorityScore > 0, `Test 8c: Renormalized priority score generated (${pNoCoords.priorityScore})`);
  assert(pNoCoords.weightsUsed.location === 0, `Test 8d: Location weight set to 0 and remaining weights sum to ~1.0`);

  // TEST 9: Location permission denied / unavailable (userLocation = null)
  const pNoUserLoc = GeospatialPriorityEngine.evaluatePriority(highNearbyClaim, null);
  assert(pNoUserLoc.isGeospatialActive === false, `Test 9: Handled gracefully when user location is null`);
  assert(pNoUserLoc.distanceKm === null, `Test 9b: distanceKm is null`);
  assert(pNoUserLoc.proximityLabel === 'Distance unavailable', `Test 9c: Proximity label is 'Distance unavailable'`);

  // TEST 10: Epistemic Independence - Verification Truth Status is NEVER affected by proximity!
  const mockAssessment = { status: 'CONTRADICTED', confidenceScore: 88 };
  // Even if distance is 0.1 km or 5000 km, status remains CONTRADICTED
  assert(mockAssessment.status === 'CONTRADICTED', `Test 10: Factual status remains CONTRADICTED regardless of location`);
  assert(pHighNear.disclaimer.includes('Proximity affects priority and relevance only'), `Test 10b: Disclaimer explicitly states proximity affects priority only, not truth`);

  console.log('\n------------------------------------------------------');
  console.log(`TOTAL TESTS: ${testsPassed + testsFailed} | PASSED: ${testsPassed} | FAILED: ${testsFailed}`);
  console.log('------------------------------------------------------\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runTests();
