/**
 * CrisisLens AI — Domain Types & Status Enums
 */

export const VERDICT_STATUS = {
  SUPPORTED: 'SUPPORTED',
  PARTIALLY_SUPPORTED: 'PARTIALLY SUPPORTED',
  CONTRADICTED: 'CONTRADICTED',
  UNVERIFIED: 'UNVERIFIED',
  INSUFFICIENT_EVIDENCE: 'INSUFFICIENT EVIDENCE'
};

export const UNCERTAINTY_LEVEL = {
  LOW: 'LOW',
  MODERATE: 'MODERATE',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

export const SUFFICIENCY_LEVEL = {
  HIGH: 'HIGH',
  MODERATE: 'MODERATE',
  LOW: 'LOW',
  INSUFFICIENT: 'INSUFFICIENT'
};

export const REVIEW_STATUS = {
  NOT_REQUIRED: 'NOT REQUIRED',
  RECOMMENDED: 'RECOMMENDED',
  REQUIRED: 'REQUIRED'
};

export const SOURCE_TYPE = {
  OFFICIAL_AGENCY: 'OFFICIAL_AGENCY',       // High Trust (NDMA, IMD, Police, State Disaster Mgmt)
  ACCREDITED_NEWS: 'ACCREDITED_NEWS',       // Medium-High Trust (Reuters, BBC, The Hindu, DD News)
  LOCAL_AUTHORITY: 'LOCAL_AUTHORITY',       // Medium Trust (District Collectorate, Municipal Corp)
  COMMUNITY_REPORTER: 'COMMUNITY_REPORTER', // Lower-Medium Trust (Verified local citizen journalist)
  SOCIAL_POST: 'SOCIAL_POST',               // Lower Trust (X/Twitter, Telegram, WhatsApp forward)
  ANONYMOUS_FEED: 'ANONYMOUS_FEED'          // Lowest Trust (Unverified crowd report)
};

export const EVIDENCE_RELATION = {
  SUPPORTS: 'SUPPORTS',
  CONTRADICTS: 'CONTRADICTS',
  NEUTRAL: 'NEUTRAL',
  CONTEXT: 'CONTEXT'
};

export const CRISIS_CATEGORY = {
  FLOOD_DAM: 'Flood & Dam Operations',
  CYCLONE_WEATHER: 'Cyclone & Extreme Weather',
  EARTHQUAKE_COLLAPSE: 'Earthquake & Structural Collapse',
  CIVIL_EMERGENCY: 'Civil & Public Safety Alert'
};
