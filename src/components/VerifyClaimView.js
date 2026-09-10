/**
 * CrisisLens AI — Verify Claim View Component
 */

import { PRESET_CLAIMS } from '../data/crisisDataset.js';
import { store } from '../state/store.js';

export function renderVerifyClaimView() {
  const isVerifying = store.isVerifying;
  const currentStep = store.verificationStep;

  return `
    <div class="verify-page container animate-fade-in">
      <div class="page-header">
        <div class="page-badge">
          <span class="simulation-pill"><span class="pulse-dot"></span> PIPELINE WORKFLOW</span>
          <span class="text-tertiary">Step 1 of 4 • Claim Ingestion</span>
        </div>
        <h1>Emergency Claim Verification Hub</h1>
        <p>Submit an emergency claim or select a synthetic crisis scenario to execute the multi-tier evidence comparison engine.</p>
      </div>

      <div class="verify-layout-grid">
        <!-- Main Form Column -->
        <div class="verify-form-col glass-panel">
          <form id="verify-form" onsubmit="window.__handleVerificationSubmit(event)">
            <div class="form-group">
              <label for="claim-text" class="form-label">
                <span>Emergency Claim Statement</span>
                <span class="label-hint">Be specific regarding incident, location, and consequence</span>
              </label>
              <textarea 
                id="claim-text" 
                rows="4" 
                class="form-textarea" 
                placeholder="e.g. Mullaperiyar Dam has suffered a massive breach at Spillway 3 and residents must evacuate immediately."
                required
              >Mullaperiyar Dam has developed a massive breach at Spillway 3 and downstream residents must evacuate immediately.</textarea>
            </div>

            <div class="form-row-three">
              <div class="form-group">
                <label for="crisis-category" class="form-label">Crisis Category</label>
                <select id="crisis-category" class="form-select">
                  <option value="Flood & Dam Operations" selected>Flood & Dam Operations</option>
                  <option value="Cyclone & Extreme Weather">Cyclone & Extreme Weather</option>
                  <option value="Earthquake & Structural Collapse">Earthquake & Structural Collapse</option>
                  <option value="Civil & Public Safety Alert">Civil & Public Safety Alert</option>
                </select>
              </div>

              <div class="form-group">
                <label for="claim-location" class="form-label">Incident Location</label>
                <input 
                  type="text" 
                  id="claim-location" 
                  class="form-input" 
                  value="Idukki, Kerala" 
                  placeholder="e.g. Idukki, Kerala"
                  required
                />
              </div>

              <div class="form-group">
                <label for="claim-severity" class="form-label">Reported Urgency / Severity</label>
                <select id="claim-severity" class="form-select">
                  <option value="CRITICAL" selected>CRITICAL (Immediate Life Threat)</option>
                  <option value="HIGH">HIGH (Severe Hazard Alert)</option>
                  <option value="MEDIUM">MEDIUM (Cautionary Advisory)</option>
                  <option value="LOW">LOW (Informational)</option>
                </select>
              </div>
            </div>

            <div class="form-submit-row">
              <button type="submit" class="btn btn-primary btn-lg" id="btn-run-verify" ${isVerifying ? 'disabled' : ''}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                ${isVerifying ? 'Evaluating Multi-Source Evidence...' : 'Execute Evidence Verification'}
              </button>

              <button type="button" class="btn btn-secondary" onclick="window.__loadRandomPreset()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
                Load Different Preset
              </button>
            </div>
          </form>

          <!-- Verification Progress Pipeline Indicator -->
          <div id="pipeline-progress-container" class="pipeline-progress-box ${isVerifying ? 'active' : ''}">
            <div class="progress-title-row">
              <div class="pipeline-status-text">
                <span class="spinner-dot"></span>
                <span id="pipeline-status-label">Verification Pipeline Active...</span>
              </div>
              <span class="font-mono text-tertiary" id="pipeline-percentage">0%</span>
            </div>

            <div class="pipeline-steps-track">
              <div class="step-point ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'current' : ''}">
                <div class="dot">1</div>
                <span>Decompose</span>
              </div>
              <div class="step-point ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'current' : ''}">
                <div class="dot">2</div>
                <span>Sources</span>
              </div>
              <div class="step-point ${currentStep >= 3 ? 'completed' : ''} ${currentStep === 3 ? 'current' : ''}">
                <div class="dot">3</div>
                <span>Scoring</span>
              </div>
              <div class="step-point ${currentStep >= 4 ? 'completed' : ''} ${currentStep === 4 ? 'current' : ''}">
                <div class="dot">4</div>
                <span>Confidence</span>
              </div>
              <div class="step-point ${currentStep >= 5 ? 'completed' : ''} ${currentStep === 5 ? 'current' : ''}">
                <div class="dot">5</div>
                <span>Assessment</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Preset Sidebar / Example Scenarios -->
        <div class="verify-presets-col">
          <div class="glass-panel presets-panel">
            <div class="panel-header">
              <span class="section-tag">SIMULATION SCENARIOS</span>
              <h3>Demo Crisis Claims</h3>
              <p>Select any scenario to evaluate how the engine handles varying degrees of truth, contradiction, and context:</p>
            </div>

            <div class="preset-cards-list">
              ${PRESET_CLAIMS.map((preset, idx) => `
                <div class="preset-card glass-panel" onclick="window.__selectPresetClaim('${preset.id}')">
                  <div class="preset-card-top">
                    <span class="badge-cat">${preset.category}</span>
                    <span class="badge-sev ${preset.severity}">${preset.severity}</span>
                  </div>
                  <h4 class="preset-claim-text">"${preset.text}"</h4>
                  <div class="preset-card-meta">
                    <span>📍 ${preset.location}</span>
                    <span class="click-prompt">Load Scenario →</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="panel-footer-note">
              <div class="simulation-pill"><span class="pulse-dot"></span> AIR-GAPPED DEMO DATA</div>
              <p class="text-tertiary">Synthesized against realistic NDMA, CWC, IMD, and local DEOC emergency bulletins.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
