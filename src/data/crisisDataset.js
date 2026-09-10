/**
 * CrisisLens AI — Synthetic Crisis Intelligence Dataset
 * 
 * NOTICE: ALL DATA IS SAFE SYNTHETIC DEMO/SIMULATION DATA FOR HACKATHON EVALUATION.
 * No real personal identifiers, phone numbers, or private addresses are stored.
 */

import { SOURCE_TYPE, EVIDENCE_RELATION, CRISIS_CATEGORY, VERDICT_STATUS } from '../models/types.js';

export const SYNTHETIC_SOURCES = [
  {
    id: 'src-ndma-01',
    name: 'National Disaster Management Authority (NDMA)',
    type: SOURCE_TYPE.OFFICIAL_AGENCY,
    reliability: 0.95,
    organization: 'NDMA Central Operations',
    url: 'https://ndma.gov.in/bulletins/dam-safety',
    verified: true,
    jurisdiction: 'National'
  },
  {
    id: 'src-cwc-01',
    name: 'Central Water Commission (CWC) Telemetry',
    type: SOURCE_TYPE.OFFICIAL_AGENCY,
    reliability: 0.98,
    organization: 'Ministry of Jal Shakti',
    url: 'https://cwc.gov.in/monitoring/sensor-logs',
    verified: true,
    jurisdiction: 'National/River Basins'
  },
  {
    id: 'src-imd-01',
    name: 'India Meteorological Department (IMD)',
    type: SOURCE_TYPE.OFFICIAL_AGENCY,
    reliability: 0.94,
    organization: 'Earth System Science Organization',
    url: 'https://mausam.imd.gov.in/cyclone-tracker',
    verified: true,
    jurisdiction: 'National'
  },
  {
    id: 'src-collector-01',
    name: 'Idukki District Collectorate Emergency Desk',
    type: SOURCE_TYPE.LOCAL_AUTHORITY,
    reliability: 0.91,
    organization: 'District Administration',
    url: 'https://idukki.nic.in/alerts',
    verified: true,
    jurisdiction: 'Idukki District'
  },
  {
    id: 'src-collector-02',
    name: 'Cuttack District Emergency Operation Centre (DEOC)',
    type: SOURCE_TYPE.LOCAL_AUTHORITY,
    reliability: 0.92,
    organization: 'District Disaster Management Authority',
    url: 'https://cuttack.nic.in/deoc',
    verified: true,
    jurisdiction: 'Odisha Coast'
  },
  {
    id: 'src-reuters-01',
    name: 'Reuters Disaster Verification Desk',
    type: SOURCE_TYPE.ACCREDITED_NEWS,
    reliability: 0.88,
    organization: 'Thomson Reuters',
    url: 'https://reuters.com/world/india/flood-tracker',
    verified: true,
    jurisdiction: 'Global / Wire'
  },
  {
    id: 'src-thehindu-01',
    name: 'The Hindu Regional Bureau',
    type: SOURCE_TYPE.ACCREDITED_NEWS,
    reliability: 0.85,
    organization: 'Kasturi & Sons Ltd',
    url: 'https://thehindu.com/news/national/kerala/dam-update',
    verified: true,
    jurisdiction: 'Regional News'
  },
  {
    id: 'src-social-01',
    name: '@KeralaFloodWatch (X / Twitter)',
    type: SOURCE_TYPE.SOCIAL_POST,
    reliability: 0.42,
    organization: 'Anonymous Social Account',
    url: 'https://x.com/anon_user/status/178492019',
    verified: false,
    jurisdiction: 'Social Network'
  },
  {
    id: 'src-social-02',
    name: 'Coastal Alert Group (Public Telegram Channel)',
    type: SOURCE_TYPE.SOCIAL_POST,
    reliability: 0.38,
    organization: 'Crowdsourced Channel (32k subscribers)',
    url: 'https://t.me/coastal_storm_surge',
    verified: false,
    jurisdiction: 'Social Network'
  },
  {
    id: 'src-whatsapp-01',
    name: 'Forwarded Voice Note ("Urgent Dam Warning")',
    type: SOURCE_TYPE.ANONYMOUS_FEED,
    reliability: 0.18,
    organization: 'Unverified Viral Messaging',
    url: 'internal://telemetry/whatsapp_viral_hash_94a2',
    verified: false,
    jurisdiction: 'Viral Social P2P'
  },
  {
    id: 'src-pwd-inspection-01',
    name: 'State PWD Infrastructure Inspection Cell',
    type: SOURCE_TYPE.LOCAL_AUTHORITY,
    reliability: 0.93,
    organization: 'Public Works Department',
    url: 'https://pwd.state.gov.in/structural-safety',
    verified: true,
    jurisdiction: 'State Infrastructure'
  }
];

export const DEMO_LOCATIONS = [
  { id: 'loc-vijayawada', name: 'Vijayawada', state: 'Andhra Pradesh', latitude: 16.5062, longitude: 80.6480 },
  { id: 'loc-vizag', name: 'Visakhapatnam', state: 'Andhra Pradesh', latitude: 17.6868, longitude: 83.2185 },
  { id: 'loc-guntur', name: 'Guntur', state: 'Andhra Pradesh', latitude: 16.3067, longitude: 80.4365 },
  { id: 'loc-hyderabad', name: 'Hyderabad', state: 'Telangana', latitude: 17.3850, longitude: 78.4867 }
];

export const PRESET_CLAIMS = [
  {
    id: 'claim-preset-01',
    text: 'Mullaperiyar Dam has developed a massive breach at Spillway 3 and downstream residents must evacuate immediately.',
    category: CRISIS_CATEGORY.FLOOD_DAM,
    location: 'Idukki, Kerala',
    locationName: 'Idukki, Kerala',
    latitude: 9.8494,
    longitude: 76.9804,
    timestamp: '2026-09-10T09:15:00Z',
    severity: 'CRITICAL',
    syntheticScenario: 'SCENARIO_1_DAM_BREACH',
    clusterId: 'cluster-dam-breach',
    description: 'Rapidly viral forward claiming structural failure of the main dam wall and mandatory midnight evacuation.'
  },
  {
    id: 'claim-preset-02',
    text: 'Cyclone Sagar eye has made landfall near Paradip Port with 220 km/h wind gusts and storm surge over 6 meters.',
    category: CRISIS_CATEGORY.CYCLONE_WEATHER,
    location: 'Paradip, Odisha',
    locationName: 'Paradip, Odisha',
    latitude: 20.3164,
    longitude: 86.6114,
    timestamp: '2026-09-10T08:30:00Z',
    severity: 'HIGH',
    syntheticScenario: 'SCENARIO_2_CYCLONE_SURGE',
    clusterId: 'cluster-cyclone-sagar',
    description: 'Social post exaggerating cyclone intensity to Super Cyclonic Storm category before official radar confirmation.'
  },
  {
    id: 'claim-preset-03',
    text: 'Metro Rail Viaduct at Pillar 412 has suffered structural collapse after the 4.8 magnitude tremor; rescue ops ongoing.',
    category: CRISIS_CATEGORY.EARTHQUAKE_COLLAPSE,
    location: 'Sector 62, Noida Metro',
    locationName: 'Sector 62, Noida Metro',
    latitude: 28.5355,
    longitude: 77.3910,
    timestamp: '2026-09-10T07:45:00Z',
    severity: 'CRITICAL',
    syntheticScenario: 'SCENARIO_3_METRO_COLLAPSE',
    clusterId: 'cluster-metro-tremor',
    description: 'Photo circulated from 2018 construction incident being recycled as current tremor aftermath.'
  },
  {
    id: 'claim-preset-04',
    text: 'Drinking water reservoir in Zone 4 is contaminated with chemical runoff following flash floods; do not consume tap water.',
    category: CRISIS_CATEGORY.CIVIL_EMERGENCY,
    location: 'Zone 4, Pune Cantonment',
    locationName: 'Zone 4, Pune Cantonment',
    latitude: 18.5204,
    longitude: 73.8567,
    timestamp: '2026-09-10T06:20:00Z',
    severity: 'MEDIUM',
    syntheticScenario: 'SCENARIO_4_WATER_CONTAMINATION',
    clusterId: 'cluster-water-contamination',
    description: 'Unverified rumor regarding municipal supply contamination causing panic water-can buying.'
  },
  {
    id: 'claim-preset-05',
    text: 'Prakasam Barrage flood gates jammed under sudden 6.5 lakh cusecs surge; Krishna river inundating Bhavanipuram and low-lying Vijayawada wards.',
    category: CRISIS_CATEGORY.FLOOD_DAM,
    location: 'Vijayawada, Andhra Pradesh',
    locationName: 'Vijayawada, Andhra Pradesh',
    latitude: 16.5062,
    longitude: 80.6480,
    timestamp: '2026-09-10T09:40:00Z',
    severity: 'CRITICAL',
    syntheticScenario: 'SCENARIO_5_KRISHNA_FLOOD',
    clusterId: 'cluster-krishna-flood',
    description: 'Breaking flood warning regarding Krishna River discharge and barrage counterweight counter-measures.'
  },
  {
    id: 'claim-preset-06',
    text: 'Industrial corridor ammonia gas cylinder leakage alert triggered at coastal Visakhapatnam export processing zone; sirens sounding.',
    category: CRISIS_CATEGORY.CIVIL_EMERGENCY,
    location: 'Visakhapatnam, Andhra Pradesh',
    locationName: 'Visakhapatnam, Andhra Pradesh',
    latitude: 17.6868,
    longitude: 83.2185,
    timestamp: '2026-09-10T08:55:00Z',
    severity: 'HIGH',
    syntheticScenario: 'SCENARIO_6_VIZAG_GAS',
    clusterId: 'cluster-vizag-alert',
    description: 'Exaggerated social panic stemming from routine fire safety mock drill at industrial container terminal.'
  },
  {
    id: 'claim-preset-07',
    text: 'Canal retaining breach reported near Guntur rural agricultural belts; secondary roads submerged.',
    category: CRISIS_CATEGORY.FLOOD_DAM,
    location: 'Guntur, Andhra Pradesh',
    locationName: 'Guntur, Andhra Pradesh',
    latitude: 16.3067,
    longitude: 80.4365,
    timestamp: '2026-09-10T08:10:00Z',
    severity: 'MEDIUM',
    syntheticScenario: 'SCENARIO_7_GUNTUR_CANAL',
    clusterId: 'cluster-guntur-canal',
    description: 'Waterlogging on local access roads erroneously amplified as major irrigation canal breach.'
  }
];

export const SYNTHETIC_EVIDENCE_REPOSITORY = [
  // --- Mullaperiyar Dam Evidence Set ---
  {
    id: 'ev-dam-01',
    claimId: 'claim-preset-01',
    sourceId: 'src-cwc-01',
    assertionKey: 'structural_breach',
    excerpt: 'Telemetry log at 09:00 IST confirms water level at 138.40 ft against FRL 142.0 ft. All 13 spillway shutters and masonry structure structural strain gauges indicate normal integrity. No breach or physical failure detected.',
    relation: EVIDENCE_RELATION.CONTRADICTS,
    relevance: 0.98,
    freshness: 0.95,
    directness: 0.99,
    timestamp: '2026-09-10T09:05:00Z'
  },
  {
    id: 'ev-dam-02',
    claimId: 'claim-preset-01',
    sourceId: 'src-collector-01',
    assertionKey: 'evacuation_order',
    excerpt: 'District Collectorate bulletin: "Spillway shutters 1 to 4 were raised by 30 cm for routine regulated discharge of 1,200 cusecs. Rumors of dam breach are completely false. No general evacuation order is active; riverside residents advised standard alertness."',
    relation: EVIDENCE_RELATION.CONTRADICTS,
    relevance: 0.96,
    freshness: 0.92,
    directness: 0.95,
    timestamp: '2026-09-10T09:20:00Z'
  },
  {
    id: 'ev-dam-03',
    claimId: 'claim-preset-01',
    sourceId: 'src-thehindu-01',
    assertionKey: 'water_discharge',
    excerpt: 'Authorities open four spillway gates at Mullaperiyar following heavy catchment inflow. Downstream water levels rose by 0.4 meters within safe bank limits.',
    relation: EVIDENCE_RELATION.SUPPORTS,
    relevance: 0.85,
    freshness: 0.88,
    directness: 0.80,
    timestamp: '2026-09-10T09:30:00Z'
  },
  {
    id: 'ev-dam-04',
    claimId: 'claim-preset-01',
    sourceId: 'src-social-01',
    assertionKey: 'structural_breach',
    excerpt: 'URGENT: Water gushing wildly near downstream bridge! Dam wall seems cracked at shutter 3, people running away! Evacuate now!',
    relation: EVIDENCE_RELATION.SUPPORTS,
    relevance: 0.70,
    freshness: 0.96,
    directness: 0.45,
    timestamp: '2026-09-10T09:12:00Z'
  },
  {
    id: 'ev-dam-05',
    claimId: 'claim-preset-01',
    sourceId: 'src-whatsapp-01',
    assertionKey: 'structural_breach',
    excerpt: 'Forwarded voice message claiming dam has broken and 3 districts will submerge in 40 minutes.',
    relation: EVIDENCE_RELATION.SUPPORTS,
    relevance: 0.60,
    freshness: 0.97,
    directness: 0.20,
    timestamp: '2026-09-10T09:08:00Z'
  },

  // --- Cyclone Sagar Evidence Set ---
  {
    id: 'ev-cyc-01',
    claimId: 'claim-preset-02',
    sourceId: 'src-imd-01',
    assertionKey: 'landfall_status',
    excerpt: 'IMD National Bulletin 14: Cyclone Sagar is centered 110 km south-east of Paradip, moving at 14 km/h. Landfall is expected between 14:00 and 16:00 IST with sustained wind speeds of 110-120 km/h gusting to 135 km/h. Eye has NOT made landfall yet.',
    relation: EVIDENCE_RELATION.CONTRADICTS,
    relevance: 0.97,
    freshness: 0.94,
    directness: 0.98,
    timestamp: '2026-09-10T08:35:00Z'
  },
  {
    id: 'ev-cyc-02',
    claimId: 'claim-preset-02',
    sourceId: 'src-collector-02',
    assertionKey: 'surge_height',
    excerpt: 'Tidal gauges at Paradip port record storm surge of 1.4 meters above astronomical tide. Precautionary evacuation of 4,000 low-lying coastal residents completed.',
    relation: EVIDENCE_RELATION.CONTRADICTS,
    relevance: 0.92,
    freshness: 0.90,
    directness: 0.92,
    timestamp: '2026-09-10T08:25:00Z'
  },
  {
    id: 'ev-cyc-03',
    claimId: 'claim-preset-02',
    sourceId: 'src-reuters-01',
    assertionKey: 'wind_speed',
    excerpt: 'Severe cyclonic storm approaches eastern Indian coastline bringing heavy rainfall and coastal wind gusts exceeding 100 km/h.',
    relation: EVIDENCE_RELATION.SUPPORTS,
    relevance: 0.82,
    freshness: 0.86,
    directness: 0.78,
    timestamp: '2026-09-10T08:15:00Z'
  },
  {
    id: 'ev-cyc-04',
    claimId: 'claim-preset-02',
    sourceId: 'src-social-02',
    assertionKey: 'landfall_status',
    excerpt: 'Super cyclone eye has hit Paradip! 220 km/h winds tearing down cranes! 6m waves breaking sea wall!',
    relation: EVIDENCE_RELATION.SUPPORTS,
    relevance: 0.75,
    freshness: 0.98,
    directness: 0.50,
    timestamp: '2026-09-10T08:28:00Z'
  },

  // --- Metro Collapse Evidence Set ---
  {
    id: 'ev-met-01',
    claimId: 'claim-preset-03',
    sourceId: 'src-pwd-inspection-01',
    assertionKey: 'structural_collapse',
    excerpt: 'Joint inspection by Metro Rail Engineers and State PWD confirms Pillar 412 has ZERO structural damage. The circulating photograph is confirmed to be an archive image from an unrelated girder launch incident in 2018.',
    relation: EVIDENCE_RELATION.CONTRADICTS,
    relevance: 0.99,
    freshness: 0.95,
    directness: 0.98,
    timestamp: '2026-09-10T08:00:00Z'
  },
  {
    id: 'ev-met-02',
    claimId: 'claim-preset-03',
    sourceId: 'src-ndma-01',
    assertionKey: 'tremor_event',
    excerpt: 'National Seismology Center recorded a mild tremor of magnitude 3.8 (not 4.8) at depth 10km, epicentered 45km east of NCR. No structural damage reported across the transit network.',
    relation: EVIDENCE_RELATION.CONTRADICTS,
    relevance: 0.92,
    freshness: 0.91,
    directness: 0.90,
    timestamp: '2026-09-10T07:55:00Z'
  },
  {
    id: 'ev-met-03',
    claimId: 'claim-preset-03',
    sourceId: 'src-reuters-01',
    assertionKey: 'transit_status',
    excerpt: 'Metro operations halted briefly for 15 minutes as standard safety protocol for track visual checks. Services have resumed on all corridors.',
    relation: EVIDENCE_RELATION.CONTEXT,
    relevance: 0.88,
    freshness: 0.89,
    directness: 0.85,
    timestamp: '2026-09-10T08:05:00Z'
  }
];

export const SYNTHETIC_NARRATIVE_CLUSTERS = [
  {
    id: 'cluster-dam-breach',
    name: 'Mullaperiyar Shutter & Breach Rumors',
    dominantNarrative: 'False claim that dam structure has failed following regulated spillway opening.',
    category: CRISIS_CATEGORY.FLOOD_DAM,
    claimCount: 14,
    status: VERDICT_STATUS.CONTRADICTED,
    evidenceStrength: 'HIGH (CWC sensor logs & District Collectorate verify integrity)',
    firstSeen: '2026-09-10T08:50:00Z',
    lastUpdated: '2026-09-10T09:35:00Z',
    velocity: 'High (+12 claims / hour)',
    geographicSpread: 'Idukki, Ernakulam, Kottayam',
    sampleClaims: [
      'Dam X has broken and downstream will flood in 20 min',
      'Mullaperiyar Dam has developed a massive breach at Spillway 3',
      'Water gushing wildly from breached wall at shutter 3',
      'Government is secretly hiding dam crack at Idukki'
    ]
  },
  {
    id: 'cluster-cyclone-sagar',
    name: 'Premature Super-Cyclone Landfall & Surge Exaggerations',
    dominantNarrative: 'Exaggerating Category 1 storm into a 220 km/h Super Cyclone prior to actual landfall.',
    category: CRISIS_CATEGORY.CYCLONE_WEATHER,
    claimCount: 9,
    status: VERDICT_STATUS.PARTIALLY_SUPPORTED,
    evidenceStrength: 'HIGH (IMD Radar & Port Telemetry establish exact timeline and intensity)',
    firstSeen: '2026-09-10T07:15:00Z',
    lastUpdated: '2026-09-10T08:45:00Z',
    velocity: 'Moderate (+5 claims / hour)',
    geographicSpread: 'Paradip, Jagatsinghpur, Kendrapara Coast',
    sampleClaims: [
      'Cyclone Sagar eye made landfall with 220 km/h winds',
      'Paradip port sea wall washed away by 6m wave',
      'Super cyclone hit coast early this morning'
    ]
  },
  {
    id: 'cluster-metro-tremor',
    name: 'Viral Recycling of 2018 Transit Collapse Photo',
    dominantNarrative: 'Recycled 2018 bridge construction mishap photo shared as tremor damage.',
    category: CRISIS_CATEGORY.EARTHQUAKE_COLLAPSE,
    claimCount: 22,
    status: VERDICT_STATUS.CONTRADICTED,
    evidenceStrength: 'VERY HIGH (PWD inspection & reverse image provenance audit)',
    firstSeen: '2026-09-10T07:40:00Z',
    lastUpdated: '2026-09-10T08:20:00Z',
    velocity: 'Very High (+18 claims / hour)',
    geographicSpread: 'NCR, Noida, Delhi Metro Line',
    sampleClaims: [
      'Metro viaduct at Pillar 412 collapsed after tremor',
      'Noida metro bridge broken, casualties reported',
      'Pillar 412 crumbled during morning earthquake'
    ]
  }
];

export const SIMULATION_SCENARIOS = [
  {
    id: 'sim-dam-evolution',
    title: 'Evolving Dam Incident — Real-time Evidence Ingestion',
    location: 'Mullaperiyar Reservoir, Western Ghats',
    category: CRISIS_CATEGORY.FLOOD_DAM,
    description: 'Witness CrisisLens AI adapt as raw social panic gives way to telemetry and official operational bulletins.',
    steps: [
      {
        stepIndex: 1,
        timeLabel: '10:00 AM',
        headline: 'First Rumor Breaks on Messaging Apps',
        incomingClaim: 'Mullaperiyar Dam has suffered a major wall failure; water is surging downstream.',
        incomingEvidence: [
          {
            sourceId: 'src-social-01',
            text: 'Audio voice clip claims dam wall has failed. Neighbors are fleeing!',
            relation: EVIDENCE_RELATION.SUPPORTS,
            reliability: 0.35
          }
        ],
        expectedStatus: VERDICT_STATUS.UNVERIFIED,
        confidence: 42,
        uncertainty: 'HIGH',
        sufficiency: 'LOW',
        humanReview: 'REQUIRED',
        rationale: 'Single low-trust social post with zero institutional corroboration. Insufficient evidence to substantiate structural failure.'
      },
      {
        stepIndex: 2,
        timeLabel: '10:10 AM',
        headline: 'Social Amplification & Visual Misinterpretation',
        incomingClaim: 'Multiple accounts post video of foaming water near bridge claiming dam breach.',
        incomingEvidence: [
          {
            sourceId: 'src-social-02',
            text: 'Videos show torrential white water at river crossing. Captions claim dam wall cracked.',
            relation: EVIDENCE_RELATION.SUPPORTS,
            reliability: 0.40
          },
          {
            sourceId: 'src-thehindu-01',
            text: 'Water release underway as catchment experiences 90mm rain in 6 hours.',
            relation: EVIDENCE_RELATION.CONTEXT,
            reliability: 0.85
          }
        ],
        expectedStatus: VERDICT_STATUS.UNVERIFIED,
        confidence: 58,
        uncertainty: 'MODERATE',
        sufficiency: 'MODERATE',
        humanReview: 'REQUIRED',
        rationale: 'Controversy index elevated. High-volume social media confusion between routine high-flow release and catastrophic breach.'
      },
      {
        stepIndex: 3,
        timeLabel: '10:20 AM',
        headline: 'Authoritative Sensor Telemetry Received',
        incomingClaim: 'Central Water Commission structural sensor logs published.',
        incomingEvidence: [
          {
            sourceId: 'src-cwc-01',
            text: 'All 13 spillway gates and structural strain monitors intact. Water level at 138.40 ft (safe operating band). Zero breach detected.',
            relation: EVIDENCE_RELATION.CONTRADICTS,
            reliability: 0.98
          }
        ],
        expectedStatus: VERDICT_STATUS.CONTRADICTED,
        confidence: 88,
        uncertainty: 'LOW',
        sufficiency: 'HIGH',
        humanReview: 'NOT REQUIRED',
        rationale: 'Direct institutional sensor telemetry directly disproves physical dam breach. Structural integrity verified intact.'
      },
      {
        stepIndex: 4,
        timeLabel: '10:30 AM',
        headline: 'Official Operational Clarification & Safe Evacuation Context',
        incomingClaim: 'District Administration clarifies controlled spillway release of 1,200 cusecs.',
        incomingEvidence: [
          {
            sourceId: 'src-collector-01',
            text: 'Official press release: Regulated water discharge initiated via shutters 1-4. Downstream residents along riverbank advised standard alert; no emergency evacuation needed.',
            relation: EVIDENCE_RELATION.CONTEXT,
            reliability: 0.92
          }
        ],
        expectedStatus: VERDICT_STATUS.PARTIALLY_SUPPORTED,
        confidence: 94,
        uncertainty: 'LOW',
        sufficiency: 'HIGH',
        humanReview: 'NOT REQUIRED',
        rationale: 'Original rumor contained a grain of truth (water discharge and riverbank caution), but the catastrophic breach claim is disproven.'
      }
    ]
  }
];
