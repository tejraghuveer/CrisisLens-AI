/**
 * CrisisLens AI — Verification Result & Evidence Intelligence View
 */

import { store } from '../state/store.js';
import { ProvenanceGraphRenderer } from '../engine/provenanceGraph.js';

export function renderVerificationResultView() {
  const result = store.activeVerification;
  if (!result) {
    return `
      <div class="container empty-state-box animate-fade-in">
        <div class="glass-panel text-center py-12">
          <h3>No Active Verification Session</h3>
          <p>Please enter or select an emergency claim to execute the verification pipeline.</p>
          <button class="btn btn-primary mt-4" onclick="window.__navigateTo('verify')">
            Go to Claim Verification
          </button>
        </div>
      </div>
    `;
  }

  const { claim, decomposition, evaluation, assessment, biasAudit, cluster } = result;

  return `
    <div class="result-page container animate-fade-in">
      <!-- Top Bar / Back to Input -->
      <div class="result-header-bar">
        <button class="btn btn-secondary btn-sm" onclick="window.__navigateTo('verify')">
          ← Verify Another Claim
        </button>
        <div class="header-status-group">
          <span class="simulation-pill"><span class="pulse-dot"></span> VERIFIED AUDIT TRAIL</span>
          <span class="font-mono text-tertiary">ID: ${claim.id}</span>
        </div>
      </div>

      <!-- Hero Verdict Banner -->
      <div class="verdict-hero-card glass-panel status-border-${assessment.status.replace(' ', '_')}">
        <div class="verdict-main-row">
          <div class="verdict-badge-col">
            <div class="status-label-caption">EPISTEMIC ASSESSMENT</div>
            <div class="status-badge large ${assessment.status.replace(' ', '_')}">
              ${assessment.status}
            </div>
            <div class="verdict-time-sub">
              Audited: ${new Date(claim.verifiedAt || Date.now()).toLocaleTimeString()} IST • Loc: ${claim.location}
            </div>
          </div>

          <!-- Quantitative Confidence & Epistemic Uncertainty Gauges -->
          <div class="verdict-metrics-group">
            <div class="gauge-card">
              <span class="gauge-label">Confidence Score</span>
              <div class="gauge-val-row">
                <span class="gauge-number text-cyan">${assessment.confidenceScore}%</span>
                <span class="gauge-chip">${assessment.confidenceScore > 75 ? 'HIGH CERTAINTY' : 'MODERATE'}</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill bg-cyan" style="width: ${assessment.confidenceScore}%"></div>
              </div>
            </div>

            <div class="gauge-card">
              <span class="gauge-label">Epistemic Uncertainty</span>
              <div class="gauge-val-row">
                <span class="gauge-number text-${assessment.uncertainty === 'LOW' ? 'emerald' : assessment.uncertainty === 'MODERATE' ? 'amber' : 'crimson'}">
                  ${assessment.uncertainty}
                </span>
                <span class="gauge-chip">SUFFICIENCY: ${assessment.sufficiency}</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill ${assessment.uncertainty === 'LOW' ? 'bg-emerald' : assessment.uncertainty === 'MODERATE' ? 'bg-amber' : 'bg-red'}" 
                     style="width: ${assessment.uncertainty === 'LOW' ? 25 : assessment.uncertainty === 'MODERATE' ? 55 : 85}%"></div>
              </div>
            </div>

            <div class="gauge-card">
              <span class="gauge-label">Human Review Protocol</span>
              <div class="gauge-val-row">
                <span class="gauge-number text-${assessment.humanReview === 'REQUIRED' ? 'crimson' : assessment.humanReview === 'RECOMMENDED' ? 'amber' : 'emerald'}">
                  ${assessment.humanReview}
                </span>
                <span class="gauge-chip">${claim.severity} PRIORITY</span>
              </div>
              ${assessment.humanReview === 'REQUIRED' ? `
                <button class="btn btn-danger btn-xs mt-2" onclick="window.__navigateTo('review')">
                  View in Review Queue →
                </button>
              ` : `
                <span class="text-tertiary font-xs mt-2">Automated triage sufficient</span>
              `}
            </div>
          </div>
        </div>

        <!-- Natural Language Why Summary -->
        <div class="verdict-rationale-box">
          <div class="rationale-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <strong>WHY DID CRISISLENS REACH THIS ASSESSMENT?</strong>
          </div>
          <p class="rationale-statement">${assessment.rationale}</p>
        </div>
      </div>

      <!-- Location-Aware Prioritization & Urgency Breakdown (Requirements 11, 12, 15) -->
      <section class="result-section">
        <div class="section-title-row">
          <div>
            <h3>Location-Aware Crisis Prioritization</h3>
            <p>Geographic urgency and operational triage weighting relative to citizen proximity.</p>
          </div>
          <span class="badge-tag font-mono">
            ${result.locationPriority ? result.locationPriority.levelIcon + ' ' + result.locationPriority.level + ' (' + result.locationPriority.priorityScore + '/100)' : 'PRIORITY N/A'}
          </span>
        </div>

        <div class="glass-panel location-priority-result-panel p-6">
          <div class="loc-summary-grid">
            <div class="loc-summary-card">
              <span class="font-mono font-xs text-tertiary">INCIDENT LOCATION</span>
              <div class="font-bold text-lg text-primary">📍 ${claim.locationName || claim.location}</div>
              <span class="font-mono font-xs text-secondary">Verified Disaster Sector</span>
            </div>

            <div class="loc-summary-card">
              <span class="font-mono font-xs text-tertiary">ESTIMATED PROXIMITY</span>
              <div class="font-bold text-lg text-cyan font-mono">
                ${result.locationPriority ? result.locationPriority.proximityLabel : 'Distance unavailable'}
              </div>
              <span class="font-mono font-xs text-secondary">In-Memory Privacy Calculation</span>
            </div>

            <div class="loc-summary-card">
              <span class="font-mono font-xs text-tertiary">URGENCY LEVEL</span>
              <div class="font-bold text-lg font-mono" style="color: ${result.locationPriority ? result.locationPriority.levelColor : '#94a3b8'}">
                ${result.locationPriority ? result.locationPriority.level : 'STANDARD'}
              </div>
              <span class="font-mono font-xs text-secondary">Priority Score: ${result.locationPriority ? result.locationPriority.priorityScore : 'N/A'}/100</span>
            </div>
          </div>

          <!-- Why is this claim prioritized? (Requirement 12) -->
          <div class="why-prioritized-box mt-4">
            <div class="why-prioritized-header flex-center justify-between">
              <div class="flex-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="12 6 12 12 16 14"/></svg>
                <strong class="font-mono font-xs uppercase text-amber">WHY IS THIS CLAIM PRIORITIZED?</strong>
              </div>
              <span class="font-mono font-xs text-tertiary">Multi-factor Triage Formulation</span>
            </div>

            <p class="prioritized-rationale-text text-primary font-xs mt-2">
              ${result.locationPriority ? result.locationPriority.rationale : 'Standard non-geospatial triage weighting.'}
            </p>

            <div class="priority-factors-breakdown-grid mt-3">
              <div class="p-factor-box">
                <span class="p-lbl font-mono font-xs text-tertiary">Proximity Weight (40%)</span>
                <span class="p-val font-mono text-cyan font-bold">
                  ${result.locationPriority && result.locationPriority.factors.proximity !== null ? result.locationPriority.factors.proximity + '/100' : 'N/A'}
                </span>
                <span class="p-sub font-xs text-tertiary">${result.locationPriority ? result.locationPriority.proximityLabel : 'Unavailable'}</span>
              </div>
              <div class="p-factor-box">
                <span class="p-lbl font-mono font-xs text-tertiary">Severity Weight (25%)</span>
                <span class="p-val font-mono text-crimson font-bold">
                  ${result.locationPriority ? result.locationPriority.factors.severity + '/100' : '50/100'}
                </span>
                <span class="p-sub font-xs text-tertiary">${claim.severity} Urgency</span>
              </div>
              <div class="p-factor-box">
                <span class="p-lbl font-mono font-xs text-tertiary">Uncertainty Weight (20%)</span>
                <span class="p-val font-mono text-amber font-bold">
                  ${result.locationPriority ? result.locationPriority.factors.uncertainty + '/100' : '50/100'}
                </span>
                <span class="p-sub font-xs text-tertiary">Triage Risk: ${assessment.uncertainty}</span>
              </div>
              <div class="p-factor-box">
                <span class="p-lbl font-mono font-xs text-tertiary">Recency Weight (15%)</span>
                <span class="p-val font-mono text-emerald font-bold">
                  ${result.locationPriority ? result.locationPriority.factors.recency + '/100' : '50/100'}
                </span>
                <span class="p-sub font-xs text-tertiary">Freshness Decay</span>
              </div>
            </div>

            <div class="priority-truth-disclaimer-alert mt-4">
              <span class="alert-icon">⚠️</span>
              <span class="alert-text font-xs">
                <strong>Epistemic Guarantee:</strong> This is a prioritization and dispatch relevance score, <em>NOT a truth score</em>. Proximity determines where emergency resources and attention are urgently needed; it never influences the factual evidence verification verdict (${assessment.status}).
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Claim & Assertion Decomposition Breakdown -->
      <section class="result-section">
        <div class="section-title-row">
          <div>
            <h3>Factual Assertion Decomposition</h3>
            <p>CrisisLens breaks compound statements into discrete claims to prevent conflating true partial context with false catastrophic rumors.</p>
          </div>
          <span class="badge-tag font-mono">${decomposition.assertions.length} Assertions Extracted</span>
        </div>

        <div class="assertions-grid">
          ${decomposition.assertions.map((asst, i) => `
            <div class="glass-panel assertion-card">
              <div class="assertion-card-top">
                <span class="asst-index">A${i + 1}</span>
                <span class="badge-cat">${asst.type.replace('_', ' ')}</span>
                <span class="font-mono font-xs text-tertiary">Loc: ${asst.targetLocation}</span>
              </div>
              <p class="assertion-text">${asst.statement}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Evidence Corpus Breakdown & Weighting -->
      <section class="result-section">
        <div class="section-title-row">
          <div>
            <h3>Evidence Comparison Engine (${evaluation.totalCount} Sources Corroborated)</h3>
            <p>Every evidence snippet is weighted by: <code>Source Reliability × Relevance × Freshness × Directness</code>.</p>
          </div>
          <div class="evidence-stats-chips">
            <span class="chip-support font-mono">SUPPORTS: ${evaluation.supportCount} (${evaluation.supportMass.toFixed(2)} mass)</span>
            <span class="chip-contradict font-mono">CONTRADICTS: ${evaluation.contradictCount} (${evaluation.contradictMass.toFixed(2)} mass)</span>
            <span class="chip-neutral font-mono">CONTEXT: ${evaluation.neutralCount}</span>
          </div>
        </div>

        <div class="evidence-cards-list">
          ${evaluation.scoredItems.map((ev, i) => `
            <div class="glass-panel evidence-card border-stance-${ev.relation}">
              <div class="evidence-card-header">
                <div class="source-info">
                  <span class="source-avatar-tag ${ev.source?.type}">${(ev.source?.type || 'S').substring(0, 3)}</span>
                  <div>
                    <h4 class="source-name">${ev.source?.name}</h4>
                    <span class="source-type-pill font-mono font-xs">${ev.source?.organization} • ${ev.source?.type}</span>
                  </div>
                </div>
                <div class="evidence-stance-badge ${ev.relation}">
                  ${ev.relation}
                </div>
              </div>

              <blockquote class="evidence-excerpt">
                "${ev.excerpt}"
              </blockquote>

              <div class="evidence-scoring-breakdown">
                <div class="score-metric">
                  <span class="lbl">Source Reliability</span>
                  <span class="val font-mono">${(ev.factors.reliability * 100).toFixed(0)}%</span>
                </div>
                <div class="score-metric">
                  <span class="lbl">Relevance</span>
                  <span class="val font-mono">${(ev.factors.relevance * 100).toFixed(0)}%</span>
                </div>
                <div class="score-metric">
                  <span class="lbl">Freshness</span>
                  <span class="val font-mono">${(ev.factors.freshness * 100).toFixed(0)}%</span>
                </div>
                <div class="score-metric">
                  <span class="lbl">Directness</span>
                  <span class="val font-mono">${(ev.factors.directness * 100).toFixed(0)}%</span>
                </div>
                <div class="score-metric total-score">
                  <span class="lbl">Weighted Weight (W_i)</span>
                  <span class="val font-mono font-bold text-cyan">${ev.weightedScore.toFixed(2)}</span>
                </div>
              </div>

              <div class="evidence-card-footer font-xs text-tertiary">
                <span>Timestamp: ${new Date(ev.timestamp).toLocaleTimeString()} IST</span>
                <span class="font-mono">Formula: ${ev.scoringFormula}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Source Diversity & Bias Audit Panel -->
      <section class="result-section">
        <div class="section-title-row">
          <div>
            <h3>Source & Bias Check Audit</h3>
            <p>Detects monoculture bias, single-source dependency, and reporting gaps before amplification.</p>
          </div>
          <span class="badge-tag font-mono">Diversity Score: ${biasAudit.diversityScore}%</span>
        </div>

        <div class="glass-panel bias-audit-panel">
          <div class="bias-metrics-grid">
            <div class="bias-stat-box">
              <span class="lbl">Source Diversity Index</span>
              <span class="val text-cyan">${biasAudit.diversityScore}%</span>
              <span class="sub text-tertiary">${biasAudit.uniqueSourcesCount} Distinct Reporting Publishers</span>
            </div>
            <div class="bias-stat-box">
              <span class="lbl">Dominant Category</span>
              <span class="val font-mono">${biasAudit.dominantCategory.replace('_', ' ')}</span>
              <span class="sub text-tertiary">${biasAudit.dominantRatio}% of Evidence Corpus</span>
            </div>
            <div class="bias-stat-box">
              <span class="lbl">Controversy Index</span>
              <span class="val text-amber">${(evaluation.controversyIndex * 100).toFixed(0)}%</span>
              <span class="sub text-tertiary">${evaluation.controversyIndex > 0.4 ? 'Elevated Stance Conflict' : 'Consensus Corroboration'}</span>
            </div>
          </div>

          ${biasAudit.warnings.length > 0 ? `
            <div class="bias-warnings-container mt-4">
              <h5 class="warning-title">Auditor Discrepancy Warnings:</h5>
              <div class="warnings-list">
                ${biasAudit.warnings.map(w => `
                  <div class="warning-alert-row severity-${w.severity}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <span>${w.message}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : `
            <div class="bias-clean-alert mt-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Source diversity passed standard telemetry threshold. No high-risk monoculture detected.</span>
            </div>
          `}
        </div>
      </section>

      <!-- Interactive Provenance & Evidence Graph (DAG) -->
      <section class="result-section">
        <div class="section-title-row">
          <div>
            <h3>Auditable Provenance & Evidence Graph</h3>
            <p>Click any node in the graph below to inspect the forensic verification lineage from raw claim to final assessment.</p>
          </div>
          <div class="graph-legend">
            <span class="leg-item"><span class="leg-dot bg-indigo"></span> Claim</span>
            <span class="leg-item"><span class="leg-dot bg-cyan"></span> Assertion</span>
            <span class="leg-item"><span class="leg-dot bg-emerald"></span> Supports</span>
            <span class="leg-item"><span class="leg-dot bg-red"></span> Contradicts</span>
            <span class="leg-item"><span class="leg-dot bg-blue"></span> Source</span>
          </div>
        </div>

        <div class="glass-panel graph-canvas-panel">
          <div id="provenance-graph-container" class="graph-container">
            <!-- SVG rendered dynamically via ProvenanceGraphRenderer -->
          </div>

          <div id="graph-inspector-panel" class="graph-inspector-drawer">
            <div class="drawer-header">
              <h4 id="inspector-node-title">Node Inspector</h4>
              <button class="btn-close" onclick="window.__closeGraphInspector()">×</button>
            </div>
            <div id="inspector-node-body" class="drawer-body">
              <p class="text-tertiary">Select any graph node above to inspect its metadata, reliability weights, and cryptographic verification trail.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Action Footer -->
      <div class="result-footer-actions glass-panel">
        <div>
          <h4>Assigned to Narrative Cluster</h4>
          <p class="text-tertiary font-mono">${cluster.name} (${cluster.claimCount} related claims)</p>
        </div>
        <div class="action-buttons">
          <button class="btn btn-secondary" onclick="window.__navigateTo('clusters')">
            Inspect Narrative Cluster →
          </button>
          <button class="btn btn-primary" onclick="window.__navigateTo('dashboard')">
            Go to Command Center
          </button>
        </div>
      </div>
    </div>
  `;
}
