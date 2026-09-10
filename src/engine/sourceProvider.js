/**
 * CrisisLens AI — Source Provider Layer
 * 
 * Clean abstraction decoupling evidence retrieval from data providers:
 * - DatasetSourceProvider: Queries the verified offline synthetic crisis repository
 * - MockSourceProvider: Simulates real-time latency and network ingest
 * - LiveFeedSourceProvider: Future extension interface for RSS/Gov API/GDACS
 * 
 * EVERY result explicitly carries the "SIMULATION / DEMO DATA" badge for hackathon transparency.
 */

import { SYNTHETIC_SOURCES, SYNTHETIC_EVIDENCE_REPOSITORY } from '../data/crisisDataset.js';

export class BaseSourceProvider {
  constructor(name = 'BaseProvider') {
    this.name = name;
  }

  async getSources() {
    throw new Error('getSources() must be implemented by subclass');
  }

  async retrieveEvidence(claim, assertions) {
    throw new Error('retrieveEvidence() must be implemented by subclass');
  }
}

export class DatasetSourceProvider extends BaseSourceProvider {
  constructor() {
    super('DatasetSourceProvider (Simulation Repository)');
    this.sources = SYNTHETIC_SOURCES;
    this.evidence = SYNTHETIC_EVIDENCE_REPOSITORY;
    this.isSimulated = true;
    this.badgeText = 'SIMULATION DATA';
  }

  async getSources() {
    return this.sources;
  }

  /**
   * Retrieves relevant evidence items matching a claim and its sub-assertions
   * @param {Object} claim 
   * @param {Array} assertions 
   */
  async retrieveEvidence(claim, assertions = []) {
    const claimLower = claim.text.toLowerCase();
    
    // Find matching evidence items by matching keywords or preset ID
    let matchedEvidence = this.evidence.filter(ev => {
      if (claim.id && ev.claimId === claim.id) return true;
      
      // Semantic keyword matching for free-form queries
      if (claimLower.includes('dam') && (ev.claimId === 'claim-preset-01' || ev.excerpt.toLowerCase().includes('dam') || ev.excerpt.toLowerCase().includes('spillway'))) {
        return true;
      }
      if ((claimLower.includes('cyclone') || claimLower.includes('storm') || claimLower.includes('paradip')) && 
          (ev.claimId === 'claim-preset-02' || ev.excerpt.toLowerCase().includes('cyclone') || ev.excerpt.toLowerCase().includes('wind'))) {
        return true;
      }
      if ((claimLower.includes('metro') || claimLower.includes('pillar') || claimLower.includes('collapse') || claimLower.includes('viaduct')) && 
          (ev.claimId === 'claim-preset-03' || ev.excerpt.toLowerCase().includes('pillar') || ev.excerpt.toLowerCase().includes('metro'))) {
        return true;
      }
      return false;
    });

    // If zero direct match found, synthesize grounded diagnostic evidence from available sources
    if (matchedEvidence.length === 0) {
      matchedEvidence = this.generateDiagnosticEvidence(claim, assertions);
    }

    // Enrich each evidence item with source metadata
    return matchedEvidence.map(ev => {
      const source = this.sources.find(s => s.id === ev.sourceId) || {
        id: 'src-unknown',
        name: 'Local Emergency Bulletin Aggregator',
        type: 'LOCAL_AUTHORITY',
        reliability: 0.70,
        organization: 'Civil Defense Node'
      };

      return {
        ...ev,
        source,
        isSimulated: true,
        providerBadge: this.badgeText,
        retrievedAt: new Date().toISOString()
      };
    });
  }

  generateDiagnosticEvidence(claim, assertions) {
    // Generate context for custom input claims
    return [
      {
        id: `ev-diag-${Date.now()}-1`,
        claimId: claim.id || 'custom-claim',
        sourceId: 'src-ndma-01',
        assertionKey: 'incident_occurrence',
        excerpt: `NDMA Rapid Response Watch: Automated ingestion scan across regional dispatch records in ${claim.location || 'specified location'} found no verified emergency alerts corresponding to: "${claim.text.substring(0, 80)}...".`,
        relation: 'NEUTRAL',
        relevance: 0.85,
        freshness: 0.90,
        directness: 0.70,
        timestamp: new Date().toISOString()
      },
      {
        id: `ev-diag-${Date.now()}-2`,
        claimId: claim.id || 'custom-claim',
        sourceId: 'src-social-01',
        assertionKey: 'spatiotemporal_scope',
        excerpt: `Social telemetry indicates initial unconfirmed chatter originating from local chat groups. No corroborating multimedia evidence confirmed.`,
        relation: 'SUPPORTS',
        relevance: 0.65,
        freshness: 0.95,
        directness: 0.35,
        timestamp: new Date().toISOString()
      }
    ];
  }
}

/**
 * MockSourceProvider: Simulates real-time network latency for realistic hackathon pipeline demos
 */
export class MockSourceProvider extends DatasetSourceProvider {
  constructor(simulatedLatencyMs = 600) {
    super();
    this.name = 'MockSourceProvider (Simulated Feed)';
    this.latencyMs = simulatedLatencyMs;
  }

  async retrieveEvidence(claim, assertions) {
    if (this.latencyMs > 0) {
      await new Promise(resolve => setTimeout(resolve, this.latencyMs));
    }
    return super.retrieveEvidence(claim, assertions);
  }
}
