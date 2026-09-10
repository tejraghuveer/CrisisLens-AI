/**
 * CrisisLens AI — Confidence & Uncertainty Engine
 * 
 * CRITICAL PRINCIPLE:
 * Confidence ≠ Truth Probability.
 * Confidence represents epistemic certainty in the evaluation based on:
 * 1. Sufficiency of available evidence mass
 * 2. Quality and corroboration of independent sources
 * 3. Absence of polarizing conflict/controversy
 * 
 * Truth status is expressed as a defensible verdict:
 * SUPPORTED | PARTIALLY SUPPORTED | CONTRADICTED | UNVERIFIED | INSUFFICIENT EVIDENCE
 */

import { VERDICT_STATUS, UNCERTAINTY_LEVEL, SUFFICIENCY_LEVEL, REVIEW_STATUS } from '../models/types.js';

export class ConfidenceEngine {
  /**
   * Determine assessment, confidence, uncertainty, and review recommendation
   * @param {Object} evaluation - Output from EvidenceScorer.evaluateEvidenceSet
   * @param {Object} claim 
   */
  static assess(evaluation, claim = {}) {
    const {
      totalCount,
      supportCount,
      contradictCount,
      supportMass,
      contradictMass,
      totalMass,
      netStance,
      controversyIndex,
      uniqueSourcesCount
    } = evaluation;

    // 1. Evidence Sufficiency Evaluation
    let sufficiency = SUFFICIENCY_LEVEL.HIGH;
    if (totalCount === 0 || totalMass < 0.3) {
      sufficiency = SUFFICIENCY_LEVEL.INSUFFICIENT;
    } else if (totalCount < 2 || totalMass < 0.8) {
      sufficiency = SUFFICIENCY_LEVEL.LOW;
    } else if (totalCount < 4 || totalMass < 1.6) {
      sufficiency = SUFFICIENCY_LEVEL.MODERATE;
    }

    // 2. Verdict Determination
    let status = VERDICT_STATUS.UNVERIFIED;
    let rationale = '';

    if (sufficiency === SUFFICIENCY_LEVEL.INSUFFICIENT) {
      status = VERDICT_STATUS.INSUFFICIENT_EVIDENCE;
      rationale = 'No verifiable institutional reports or credible telemetry logs match this claim yet. Assessment cannot be substantiated.';
    } else if (controversyIndex > 0.65) {
      // High conflict between sources
      status = VERDICT_STATUS.PARTIALLY_SUPPORTED;
      rationale = `High source controversy detected. Reports conflict between supporting claims (${supportCount}) and contradicting telemetry (${contradictCount}). Situation requires contextual triage.`;
    } else if (contradictMass > supportMass * 1.5 && contradictMass >= 0.8) {
      status = VERDICT_STATUS.CONTRADICTED;
      rationale = 'High-reliability institutional telemetry and verified agency bulletins directly refute the central assertions of this claim.';
    } else if (supportMass > contradictMass * 1.5 && supportMass >= 0.8) {
      if (contradictCount > 0 || controversyIndex > 0.25) {
        status = VERDICT_STATUS.PARTIALLY_SUPPORTED;
        rationale = 'Core disaster conditions are corroborated by authoritative sources, but specific operational assertions (e.g. breach or emergency order) show discrepancies.';
      } else {
        status = VERDICT_STATUS.SUPPORTED;
        rationale = 'Multiple accredited sources and verified emergency records corroborate the primary factual assertions of this claim.';
      }
    } else if (supportMass > 0 && contradictMass > 0) {
      status = VERDICT_STATUS.PARTIALLY_SUPPORTED;
      rationale = 'Available evidence provides partial confirmation of incident conditions but fails to validate the full severity claimed.';
    } else {
      status = VERDICT_STATUS.UNVERIFIED;
      rationale = 'Claims are circulating with preliminary social activity, but no official confirmation or definitive refutation has been established.';
    }

    // 3. Epistemic Confidence Calculation (0 - 100%)
    // Confidence increases with mass and source variety, decreases with controversy and sparse data
    let baseConfidence = 50;

    if (sufficiency === SUFFICIENCY_LEVEL.INSUFFICIENT) {
      baseConfidence = 20;
    } else if (sufficiency === SUFFICIENCY_LEVEL.LOW) {
      baseConfidence = 45;
    } else if (sufficiency === SUFFICIENCY_LEVEL.MODERATE) {
      baseConfidence = 70;
    } else {
      baseConfidence = 88;
    }

    // Adjust for source variety
    if (uniqueSourcesCount >= 3) baseConfidence += 6;
    if (uniqueSourcesCount <= 1) baseConfidence -= 10;

    // Heavy penalty for controversy
    const controversyPenalty = Math.round(controversyIndex * 25);
    baseConfidence -= controversyPenalty;

    // Bound between 15% and 98% (never 100% false certainty)
    const confidenceScore = Math.min(96, Math.max(18, baseConfidence));

    // 4. Uncertainty Level
    let uncertainty = UNCERTAINTY_LEVEL.LOW;
    if (confidenceScore < 45 || controversyIndex > 0.6) {
      uncertainty = UNCERTAINTY_LEVEL.HIGH;
    } else if (confidenceScore < 75 || controversyIndex > 0.3) {
      uncertainty = UNCERTAINTY_LEVEL.MODERATE;
    }

    // 5. Human Review Trigger
    let humanReview = REVIEW_STATUS.NOT_REQUIRED;
    let reviewReasons = [];

    const isHighSeverity = claim.severity === 'CRITICAL' || claim.severity === 'HIGH';

    if (sufficiency === SUFFICIENCY_LEVEL.INSUFFICIENT || sufficiency === SUFFICIENCY_LEVEL.LOW) {
      humanReview = REVIEW_STATUS.REQUIRED;
      reviewReasons.push('Evidence sufficiency is low or insufficient for autonomous triage');
    }
    if (controversyIndex > 0.4) {
      humanReview = REVIEW_STATUS.REQUIRED;
      reviewReasons.push(`Elevated controversy index (${(controversyIndex * 100).toFixed(0)}%) indicates conflicting reports`);
    }
    if (isHighSeverity && status !== VERDICT_STATUS.CONTRADICTED && confidenceScore < 85) {
      humanReview = REVIEW_STATUS.REQUIRED;
      reviewReasons.push('High-risk public safety claim requires human operator sign-off');
    } else if (confidenceScore < 70 && humanReview !== REVIEW_STATUS.REQUIRED) {
      humanReview = REVIEW_STATUS.RECOMMENDED;
      reviewReasons.push('Moderate confidence score warrants secondary verification');
    }

    // 6. Transparent Explainability Factors
    const explainability = {
      formula: 'Confidence = f(Evidence Mass, Source Diversity, Penalty(Controversy))',
      sufficiencyAssessment: `Evidence sufficiency is assessed as ${sufficiency} across ${totalCount} recorded evidence items.`,
      conflictAssessment: controversyIndex > 0.3
        ? `Moderate-to-high disagreement between sources (${(controversyIndex * 100).toFixed(0)}% controversy score).`
        : 'Broad consensus observed across available evidence items.',
      sourceIntegrity: `Evidence retrieved from ${uniqueSourcesCount} independent reporting entities.`,
      safetyDirective: isHighSeverity
        ? 'CRITICAL ALERT: Emergency directives should follow official NDMA/DEOC bulletins.'
        : 'Advisory: Re-evaluate as incoming telemetry updates.'
    };

    return {
      status,
      confidenceScore,
      uncertainty,
      sufficiency,
      humanReview,
      reviewReasons,
      rationale,
      explainability
    };
  }
}
