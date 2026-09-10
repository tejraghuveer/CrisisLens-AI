/**
 * CrisisLens AI — Minimalist About & Methodology View
 * Clean reading layout, simple narrative clusters list, FAQ
 */

import { store } from '../state/store.js';

export function renderMethodologyView() {
  const clusters = store.narrativeClusterer.getClusters();

  return `
    <div class="about-page container-narrow animate-fade-in">
      <div class="about-header-simple mb-6 text-center">
        <h2>About CrisisLens AI</h2>
        <p class="font-sm text-secondary">
          Evidence-driven crisis verification and emergency intelligence.
        </p>
      </div>

      <!-- Core Principles -->
      <section class="card p-6 mb-6">
        <h3 class="font-base font-semibold mb-2">Design & Verification Philosophy</h3>
        <p class="font-sm text-secondary mb-3">
          During disasters, rumors spread faster than official bulletins. Traditional boolean "True/False" fact-checkers fail because claims often bundle partial facts (e.g. routine spillway gate release) with false catastrophic rumors (e.g. dam wall breach).
        </p>
        <p class="font-sm text-secondary">
          CrisisLens AI decomposes claims into verifiable assertions, retrieves multi-tier evidence, calculates epistemic confidence and uncertainty, and enforces human-in-the-loop oversight when controversy is elevated.
        </p>
      </section>

      <!-- Narrative Clusters: Simple Clean List (Requirement 10) -->
      <section class="mb-6">
        <div class="flex-center justify-between mb-3">
          <h3 class="font-sm font-semibold text-secondary">Active Narrative Clusters</h3>
          <span class="font-xs font-mono text-tertiary">${clusters.length} tracked clusters</span>
        </div>

        <div class="clusters-simple-list">
          ${clusters.map(c => `
            <div class="cluster-simple-row card p-4">
              <div class="cluster-top-line flex-center justify-between mb-1">
                <h4 class="font-sm font-medium text-primary">${c.name}</h4>
                <span class="status-badge ${c.status.replace(' ', '_')}">${c.status}</span>
              </div>
              <p class="font-xs text-secondary mb-2">"${c.dominantNarrative}"</p>
              <div class="cluster-meta-clean font-xs text-tertiary flex-center gap-2">
                <span>${c.claimCount} related claims</span>
                <span>•</span>
                <span>${c.velocity}</span>
                <span>•</span>
                <span>📍 ${c.geographicSpread}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Key Formulas & Defense -->
      <section class="card p-6 mb-6 font-sm">
        <h3 class="font-base font-semibold mb-3">Scoring & Epistemic Formulas</h3>
        
        <div class="formula-block mb-3 p-3 bg-subtle">
          <span class="font-xs text-tertiary block font-mono mb-1">1. Evidence Score:</span>
          <code>Score = Source Reliability × Relevance × Freshness × Directness</code>
        </div>

        <div class="formula-block mb-3 p-3 bg-subtle">
          <span class="font-xs text-tertiary block font-mono mb-1">2. Controversy Index:</span>
          <code>Controversy = 2 × min(Support Mass, Contradict Mass) / Total Active Mass</code>
        </div>

        <div class="formula-block p-3 bg-subtle">
          <span class="font-xs text-tertiary block font-mono mb-1">3. Location-Aware Priority:</span>
          <code>Priority = 0.40 × Proximity + 0.25 × Severity + 0.20 × Uncertainty + 0.15 × Recency</code>
          <span class="font-xs text-secondary block mt-1"><em>Distance affects priority and dispatch urgency, not factual truth.</em></span>
        </div>
      </section>

      <!-- Privacy & Guardrails -->
      <section class="card p-6 mb-8 font-xs text-secondary">
        <h4 class="font-sm font-semibold text-primary mb-2">Privacy & Synthetic Data Safety</h4>
        <p class="mb-2">
          • <strong>Zero Coordinate Storage:</strong> User coordinates are used purely in memory to compute distance and are never saved to localStorage or external servers.
        </p>
        <p class="mb-2">
          • <strong>Safe Synthetic Dataset:</strong> All crisis scenarios are synthetic simulations based on official emergency disaster response blueprints. Zero personal phone numbers or private addresses are stored.
        </p>
        <p>
          • <strong>Decision Support:</strong> AI advises and structures evidence; evacuation directives are issued only by official civil defense authorities.
        </p>
      </section>
    </div>
  `;
}
