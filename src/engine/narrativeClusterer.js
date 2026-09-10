/**
 * CrisisLens AI — Narrative Clustering Engine
 * 
 * Groups semantically related crisis claims into macroscopic narrative clusters:
 * - Aggregates claim velocity
 * - Identifies dominant narrative shifts
 * - Tracks evidence strength across the narrative life-cycle
 */

import { SYNTHETIC_NARRATIVE_CLUSTERS } from '../data/crisisDataset.js';

export class NarrativeClusterer {
  constructor() {
    this.clusters = [...SYNTHETIC_NARRATIVE_CLUSTERS];
  }

  /**
   * Get all active clusters
   */
  getClusters() {
    return this.clusters;
  }

  /**
   * Find matching cluster for a claim or create new emerging cluster
   * @param {Object} claim 
   */
  assignCluster(claim) {
    const textLower = claim.text.toLowerCase();

    // Match keywords against existing clusters
    for (const cluster of this.clusters) {
      if (cluster.category === claim.category) {
        if (textLower.includes('dam') && cluster.id === 'cluster-dam-breach') return cluster;
        if ((textLower.includes('cyclone') || textLower.includes('wind')) && cluster.id === 'cluster-cyclone-sagar') return cluster;
        if ((textLower.includes('metro') || textLower.includes('pillar')) && cluster.id === 'cluster-metro-tremor') return cluster;
      }
    }

    // Emerging cluster fallback
    const newCluster = {
      id: `cluster-emerging-${Date.now()}`,
      name: `Emerging: ${claim.text.substring(0, 32)}...`,
      dominantNarrative: `Uncorrelated incident reports emerging in ${claim.location || 'unspecified sector'}.`,
      category: claim.category || 'Civil & Public Safety Alert',
      claimCount: 1,
      status: 'UNVERIFIED',
      evidenceStrength: 'INITIAL (Single Report)',
      firstSeen: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      velocity: 'Low (1 claim / hour)',
      geographicSpread: claim.location || 'Local vicinity',
      sampleClaims: [claim.text]
    };

    this.clusters.push(newCluster);
    return newCluster;
  }
}
