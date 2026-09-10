/**
 * CrisisLens AI — Narrative Clustering View
 * Requirement 10: Macroscopic rumor clustering & velocity tracking
 */

import { store } from '../state/store.js';

export function renderNarrativeClusterView() {
  const clusters = store.narrativeClusterer.getClusters();

  return `
    <div class="clusters-page container animate-fade-in">
      <div class="page-header-bar">
        <div>
          <div class="page-badge">
            <span class="simulation-pill"><span class="pulse-dot"></span> ADVANCED FEATURE</span>
            <span class="font-mono text-tertiary">Semantic Aggregation Engine</span>
          </div>
          <h1>Crisis Narrative Clusters</h1>
          <p>
            Emergency rumors rarely travel in isolation; they mutate into narrative variants. 
            CrisisLens clusters related rumors to track epidemic spread velocity and assess collective evidence strength.
          </p>
        </div>

        <div class="cluster-summary-pill font-mono">
          <span>Active Clusters: ${clusters.length}</span>
        </div>
      </div>

      <div class="clusters-grid">
        ${clusters.map(cluster => `
          <div class="glass-panel cluster-card">
            <div class="cluster-card-header">
              <div class="cluster-id-badge font-mono font-xs">
                ${cluster.id}
              </div>
              <div class="status-badge ${cluster.status ? cluster.status.replace(' ', '_') : 'UNVERIFIED'}">
                ${cluster.status}
              </div>
            </div>

            <h3 class="cluster-title">${cluster.name}</h3>
            
            <div class="dominant-narrative-box">
              <span class="font-xs text-accent font-bold uppercase tracking-wider">DOMINANT NARRATIVE:</span>
              <p class="dominant-text">"${cluster.dominantNarrative}"</p>
            </div>

            <div class="cluster-metrics-row">
              <div class="c-metric">
                <span class="lbl">Total Claims</span>
                <span class="val text-cyan font-mono">${cluster.claimCount} variants</span>
              </div>
              <div class="c-metric">
                <span class="lbl">Velocity</span>
                <span class="val text-amber font-mono">${cluster.velocity}</span>
              </div>
              <div class="c-metric">
                <span class="lbl">Coverage</span>
                <span class="val font-mono font-xs">${cluster.geographicSpread}</span>
              </div>
            </div>

            <div class="cluster-evidence-strength">
              <span class="lbl font-xs font-bold text-tertiary">EVIDENCE STRENGTH:</span>
              <p class="evidence-strength-text font-mono font-xs text-emerald">${cluster.evidenceStrength}</p>
            </div>

            <div class="sample-claims-tray">
              <span class="lbl font-xs font-bold text-tertiary">SAMPLE DETECTED VARIANTS:</span>
              <ul class="sample-claims-list">
                ${(cluster.sampleClaims || []).map(sample => `
                  <li class="sample-claim-item font-xs">
                    <span class="bullet">•</span>
                    <span>"${sample}"</span>
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="cluster-card-footer">
              <span class="font-xs text-tertiary">First Seen: ${new Date(cluster.firstSeen).toLocaleTimeString()} IST</span>
              <button class="btn btn-secondary btn-xs" onclick="window.__loadClusterIntoVerify('${cluster.id}')">
                Verify Cluster Focal Claim →
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
