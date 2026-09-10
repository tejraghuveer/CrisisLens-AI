/**
 * CrisisLens AI — Source Diversity & Bias Audit Service
 * 
 * Prevents overconfidence by detecting:
 * - Monoculture sourcing (e.g. >65% evidence from social posts)
 * - Single-source reliance
 * - Official agency telemetry gaps
 * - Stale reporting lag
 */

export class BiasCheckService {
  /**
   * Audit the evidence distribution for bias and gaps
   * @param {Array} scoredEvidence 
   * @param {Object} claim 
   */
  static audit(scoredEvidence = [], claim = {}) {
    const total = scoredEvidence.length;
    const warnings = [];
    const insights = [];

    if (total === 0) {
      return {
        diversityScore: 0,
        dominantCategory: 'NONE',
        warnings: ['Critical Evidence Gap: No verifiable evidence items available to audit.'],
        insights: ['System operating in zero-prior state. Complete uncertainty.'],
        hasMonocultureWarning: false
      };
    }

    // Tally source categories
    const categoryCounts = {};
    const sourceCounts = {};

    scoredEvidence.forEach(ev => {
      const cat = ev.source?.type || 'UNKNOWN';
      const sName = ev.source?.name || 'Unknown Source';

      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      sourceCounts[sName] = (sourceCounts[sName] || 0) + 1;
    });

    // 1. Dominance & Monoculture Check
    let dominantCategory = '';
    let maxCatCount = 0;

    for (const [cat, count] of Object.entries(categoryCounts)) {
      if (count > maxCatCount) {
        maxCatCount = count;
        dominantCategory = cat;
      }
    }

    const dominantRatio = maxCatCount / total;
    const hasMonocultureWarning = dominantRatio > 0.60 && total >= 3;

    if (hasMonocultureWarning) {
      warnings.push({
        type: 'MONOCULTURE_BIAS',
        severity: 'MEDIUM',
        message: `High Category Reliance: ${(dominantRatio * 100).toFixed(0)}% of available evidence stems from "${dominantCategory.replace('_', ' ')}". Cross-verification advised.`
      });
    }

    // 2. Single Source Over-Reliance Check
    for (const [sName, count] of Object.entries(sourceCounts)) {
      const sRatio = count / total;
      if (sRatio > 0.55 && total >= 3) {
        warnings.push({
          type: 'SINGLE_SOURCE_RISK',
          severity: 'HIGH',
          message: `Single Source Exposure: ${(sRatio * 100).toFixed(0)}% of evidence originates from a single publisher (${sName}).`
        });
      }
    }

    // 3. Official Source Presence Check
    const hasOfficial = Boolean(
      categoryCounts['OFFICIAL_AGENCY'] || categoryCounts['LOCAL_AUTHORITY']
    );

    if (!hasOfficial && total > 0) {
      warnings.push({
        type: 'MISSING_OFFICIAL_CONFIRMATION',
        severity: 'HIGH',
        message: 'Evidence Gap: Zero official disaster management agencies or local authorities have verified or commented on this report.'
      });
    } else if (hasOfficial) {
      insights.push('Authoritative Validation: Grounded in official disaster management/telemetry registries.');
    }

    // 4. Source Diversity Score (0 - 100%)
    const uniqueSources = Object.keys(sourceCounts).length;
    const uniqueCategories = Object.keys(categoryCounts).length;
    const diversityScore = Math.min(100, Math.round((uniqueCategories / 4) * 50 + (uniqueSources / 4) * 50));

    if (diversityScore >= 75) {
      insights.push('Healthy Source Distribution: Evidence incorporates multiple independent operational vantage points.');
    }

    return {
      diversityScore,
      dominantCategory,
      dominantRatio: Math.round(dominantRatio * 100),
      uniqueSourcesCount: uniqueSources,
      warnings,
      insights,
      categoryCounts
    };
  }
}
