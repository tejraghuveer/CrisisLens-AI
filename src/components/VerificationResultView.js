/**
 * CrisisLens AI — Minimalist Verification Result View
 * Clean, readable, result-focused
 */

import { store } from '../state/store.js';
import { ProvenanceGraphRenderer } from '../engine/provenanceGraph.js';

export function renderVerificationResultView() {
  const result = store.activeVerification;
  if (!result) {
    return `
      <div class="container-narrow text-center py-12 animate-fade-in">
        <p class="text-tertiary mb-4">No active verification session.</p>
        <button class="btn btn-primary" onclick="window.__navigateTo('verify')">Verify a Claim</button>
      </div>
    `;
  }

  const { claim, evaluation, assessment, biasAudit, locationPriority } = result;

  return `
    <div class="result-page container-narrow animate-fade-in">
      <!-- Back / Action Header -->
      <div class="result-nav-row">
        <button class="btn-back" onclick="window.__navigateTo('verify')">
          ← Verify another claim
        </button>
        ${locationPriority && locationPriority.distanceKm !== null ? `
          <div class="loc-subtle-badge font-xs font-mono">
            📍 ${locationPriority.proximityLabel} • Priority: <span class="text-semibold">${locationPriority.level}</span>
          </div>
        ` : ''}
      </div>

      <!-- Main Result Card: Clean & Focused -->
      <div class="result-hero card">
        <div class="result-status-row">
          <span class="status-badge ${assessment.status.replace(' ', '_')} large">
            ${assessment.status}
          </span>
          <div class="confidence-summary font-mono font-xs">
            <span class="conf-pct">${assessment.confidenceScore}%</span> Evidence Confidence 
            <span class="text-muted">•</span> ${assessment.uncertainty.toLowerCase()} uncertainty
          </div>
        </div>

        <p class="result-rationale">
          "${assessment.rationale}"
        </p>

        <!-- Summary Evidence Count Row -->
        <div class="evidence-count-row font-xs text-secondary">
          <span>Supporting evidence: <strong class="text-primary">${evaluation.supportCount}</strong></span>
          <span class="text-muted">•</span>
          <span>Contradicting evidence: <strong class="text-primary">${evaluation.contradictCount}</strong></span>
          ${evaluation.neutralCount > 0 ? `
            <span class="text-muted">•</span>
            <span>Context: <strong class="text-primary">${evaluation.neutralCount}</strong></span>
          ` : ''}
        </div>

        <!-- Two Simple Actions -->
        <div class="result-actions-row">
          <a href="#evidence-section" class="btn btn-secondary btn-sm">
            View Evidence (${evaluation.totalCount})
          </a>
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.__toggleConfidenceDrawer()">
            Why this result?
          </button>
          <button type="button" class="btn btn-ghost btn-sm" onclick="window.__toggleGraphDrawer()">
            View Evidence Trail →
          </button>
        </div>
      </div>

      <!-- Expandable "Why this result & confidence?" Drawer (Initially collapsed or toggled) -->
      <div id="confidence-drawer" class="card drawer-card mt-4" style="display: none;">
        <div class="drawer-header-clean">
          <h4>Why this confidence?</h4>
          <button class="btn-close-sm" onclick="window.__toggleConfidenceDrawer()">×</button>
        </div>
        <p class="font-xs text-secondary mb-3">
          Confidence reflects evidence sufficiency and agreement, not simple probability.
        </p>

        <div class="metric-bar-group font-xs font-mono">
          <div class="metric-bar-item">
            <div class="bar-lbl-row">
              <span>Source reliability</span>
              <span>${Math.round((evaluation.scoredItems[0]?.factors?.reliability ?? 0.85) * 100)}%</span>
            </div>
            <div class="clean-bar"><div class="clean-bar-fill" style="width: 85%;"></div></div>
          </div>

          <div class="metric-bar-item">
            <div class="bar-lbl-row">
              <span>Evidence agreement</span>
              <span>${evaluation.controversyIndex < 0.3 ? 'High consensus' : 'Moderate conflict'}</span>
            </div>
            <div class="clean-bar"><div class="clean-bar-fill" style="width: ${Math.round((1 - evaluation.controversyIndex) * 100)}%;"></div></div>
          </div>

          <div class="metric-bar-item">
            <div class="bar-lbl-row">
              <span>Freshness</span>
              <span>High (Recent reports)</span>
            </div>
            <div class="clean-bar"><div class="clean-bar-fill" style="width: 90%;"></div></div>
          </div>

          <div class="metric-bar-item">
            <div class="bar-lbl-row">
              <span>Evidence sufficiency</span>
              <span>${assessment.sufficiency}</span>
            </div>
            <div class="clean-bar"><div class="clean-bar-fill" style="width: ${assessment.sufficiency === 'HIGH' ? 85 : 55}%;"></div></div>
          </div>
        </div>

        ${biasAudit.warnings.length > 0 ? `
          <div class="audit-warning-clean font-xs mt-3">
            ⚠️ <strong>Diversity Check:</strong> ${biasAudit.warnings[0].message}
          </div>
        ` : ''}

        ${locationPriority ? `
          <div class="geo-note-clean font-xs text-tertiary mt-3">
            📍 <strong>Proximity:</strong> ${locationPriority.proximityLabel} (${locationPriority.rationale}). 
            <em>Distance affects priority, not truth.</em>
          </div>
        ` : ''}
      </div>

      <!-- Provenance Graph Drawer / Modal (Requirement 9: Behind "View Evidence Trail") -->
      <div id="provenance-graph-wrapper" class="card drawer-card mt-4" style="display: none;">
        <div class="drawer-header-clean">
          <div>
            <h4>Evidence Provenance Trail</h4>
            <p class="font-xs text-tertiary">Trace from claim to assertions, evidence snippets, sources, and assessment.</p>
          </div>
          <button class="btn-close-sm" onclick="window.__toggleGraphDrawer()">×</button>
        </div>
        <div id="provenance-graph-container" class="graph-clean-container"></div>
      </div>

      <!-- Clean Evidence Rows Section -->
      <section id="evidence-section" class="evidence-section-clean mt-8">
        <h3 class="section-clean-title">Evidence (${evaluation.totalCount})</h3>

        <div class="evidence-list-clean">
          ${evaluation.scoredItems.map((ev, i) => `
            <div class="evidence-row card">
              <div class="evidence-row-top">
                <div class="stance-indicator ${ev.relation}">
                  ${ev.relation === 'SUPPORTS' ? '✓ SUPPORTS' : ev.relation === 'CONTRADICTS' ? '✕ CONTRADICTS' : '• CONTEXT'}
                </div>
                <div class="source-clean-name text-primary font-semibold">
                  ${ev.source?.name}
                </div>
                <div class="source-clean-time font-xs text-tertiary">
                  ${ev.source?.organization} • ${new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST
                </div>
              </div>

              <blockquote class="evidence-quote font-sm">
                "${ev.excerpt}"
              </blockquote>

              <div class="evidence-row-footer font-xs text-tertiary">
                <span>Reliability: <strong class="text-secondary">${(ev.factors.reliability * 100).toFixed(0)}% (${ev.source?.type?.replace('_', ' ')})</strong></span>
                
                <details class="evidence-details-toggle">
                  <summary class="details-summary-link">Evidence details</summary>
                  <div class="technical-factors-grid font-mono font-xs mt-2">
                    <span>Relevance: ${(ev.factors.relevance * 100).toFixed(0)}%</span>
                    <span>Freshness: ${(ev.factors.freshness * 100).toFixed(0)}%</span>
                    <span>Directness: ${(ev.factors.directness * 100).toFixed(0)}%</span>
                    <span>Weight Score: ${ev.weightedScore.toFixed(2)}</span>
                  </div>
                </details>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Bottom simple action -->
      <div class="text-center mt-8 mb-8">
        <button class="btn btn-secondary" onclick="window.__navigateTo('verify')">
          Verify Another Claim
        </button>
      </div>
    </div>
  `;
}
