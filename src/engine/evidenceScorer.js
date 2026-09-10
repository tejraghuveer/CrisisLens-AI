/**
 * CrisisLens AI — Evidence Scoring & Comparison Engine
 * 
 * Implements a transparent, mathematically defensible scoring mechanism:
 * 
 * Individual Evidence Weight:
 * W_i = Source_Reliability × Relevance × Freshness × Directness
 * 
 * Aggregation:
 * Support Mass       = Σ (W_i for relation == SUPPORTS)
 * Contradiction Mass = Σ (W_i for relation == CONTRADICTS)
 * Context Mass       = Σ (W_i for relation == CONTEXT / NEUTRAL)
 * 
 * Controversy Index:
 * CI = 2 × min(Support Mass, Contradiction Mass) / (Support Mass + Contradiction Mass + ε)
 */

import { EVIDENCE_RELATION } from '../models/types.js';

export class EvidenceScorer {
  /**
   * Score an individual evidence item
   * @param {Object} item 
   */
  static scoreItem(item) {
    const reliability = item.source?.reliability ?? 0.5;
    const relevance = item.relevance ?? 0.7;
    const freshness = item.freshness ?? 0.8;
    const directness = item.directness ?? 0.6;

    // Multiplicative weighting
    const rawScore = reliability * relevance * freshness * directness;
    const weightedScore = Math.round(rawScore * 100) / 100;

    return {
      ...item,
      factors: {
        reliability,
        relevance,
        freshness,
        directness
      },
      weightedScore,
      scoringFormula: `${reliability.toFixed(2)} (Reliability) × ${relevance.toFixed(2)} (Relevance) × ${freshness.toFixed(2)} (Freshness) × ${directness.toFixed(2)} (Directness)`
    };
  }

  /**
   * Evaluate a collection of scored evidence items
   * @param {Array} evidenceItems 
   */
  static evaluateEvidenceSet(evidenceItems = []) {
    const scoredItems = evidenceItems.map(item => this.scoreItem(item));

    let supportMass = 0;
    let contradictMass = 0;
    let neutralMass = 0;

    let supportCount = 0;
    let contradictCount = 0;
    let neutralCount = 0;

    const sourceCategoryDistribution = {};

    scoredItems.forEach(item => {
      const weight = item.weightedScore;
      const type = item.source?.type || 'UNKNOWN';
      sourceCategoryDistribution[type] = (sourceCategoryDistribution[type] || 0) + 1;

      if (item.relation === EVIDENCE_RELATION.SUPPORTS) {
        supportMass += weight;
        supportCount++;
      } else if (item.relation === EVIDENCE_RELATION.CONTRADICTS) {
        contradictMass += weight;
        contradictCount++;
      } else {
        neutralMass += weight;
        neutralCount++;
      }
    });

    const totalMass = supportMass + contradictMass + neutralMass;
    const totalCount = scoredItems.length;

    // Net Stance Balance (-1.0 strictly contradicted to +1.0 fully supported)
    const netStance = (supportMass + contradictMass > 0)
      ? (supportMass - contradictMass) / (supportMass + contradictMass)
      : 0;

    // Controversy Index (0.0 = perfect consensus, 1.0 = heavy polarized conflict)
    const sumActive = supportMass + contradictMass;
    const controversyIndex = sumActive > 0.05
      ? (2 * Math.min(supportMass, contradictMass)) / sumActive
      : 0;

    // Corroboration Factor: measures whether mass is backed by multiple independent sources
    const uniqueSources = new Set(scoredItems.map(s => s.sourceId || s.source?.name)).size;
    const corroborationFactor = totalCount > 0 ? Math.min(1.0, uniqueSources / 3) : 0;

    return {
      scoredItems,
      totalCount,
      supportCount,
      contradictCount,
      neutralCount,
      supportMass: Math.round(supportMass * 100) / 100,
      contradictMass: Math.round(contradictMass * 100) / 100,
      neutralMass: Math.round(neutralMass * 100) / 100,
      totalMass: Math.round(totalMass * 100) / 100,
      netStance: Math.round(netStance * 100) / 100,
      controversyIndex: Math.round(controversyIndex * 100) / 100,
      corroborationFactor: Math.round(corroborationFactor * 100) / 100,
      uniqueSourcesCount: uniqueSources,
      sourceCategoryDistribution
    };
  }
}
