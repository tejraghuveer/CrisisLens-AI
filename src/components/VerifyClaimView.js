/**
 * CrisisLens AI — Minimalist Verify Claim View (Primary Experience)
 * "Google Search simplicity + professional fact-checking tool"
 */

import { PRESET_CLAIMS, DEMO_LOCATIONS } from '../data/crisisDataset.js';
import { store } from '../state/store.js';
import { locationService } from '../services/locationService.js';

export function renderVerifyClaimView() {
  const isVerifying = store.isVerifying;
  const currentStep = store.verificationStep;
  const userLoc = locationService.getUserLocation();

  return `
    <div class="verify-page container-narrow animate-fade-in">
      <!-- Minimal Hero Section -->
      <div class="hero-clean text-center">
        <h1 class="hero-clean-title">Verify before you amplify.</h1>
        <p class="hero-clean-subtitle">
          Evaluate crisis claims using evidence, source reliability and transparent confidence.
        </p>
      </div>

      <!-- Primary Search/Verify Box -->
      <div class="verify-box card">
        <form id="verify-form" onsubmit="window.__handleVerificationSubmit(event)">
          <div class="input-wrap">
            <textarea 
              id="claim-text" 
              rows="3" 
              class="clean-textarea" 
              placeholder="Paste a crisis-related claim..."
              required
            >Mullaperiyar Dam has developed a massive breach at Spillway 3 and downstream residents must evacuate immediately.</textarea>
          </div>

          <!-- Compact Location & Options Row -->
          <div class="verify-options-row">
            <div class="location-picker-inline">
              <span class="opt-label">Location:</span>
              <button 
                type="button" 
                class="btn-text ${userLoc && !userLoc.isDemo ? 'active' : ''}" 
                onclick="window.__requestBrowserLocation()"
                title="Use browser GPS"
              >
                ${userLoc && !userLoc.isDemo ? '📍 Using my location' : '📍 Use my location'}
              </button>
              <span class="text-divider">or</span>
              <select 
                class="demo-loc-select" 
                onchange="window.__selectDemoLocation(this.value)"
                aria-label="Select demo location"
              >
                <option value="">Demo location...</option>
                ${DEMO_LOCATIONS.map(d => `
                  <option value="${d.id}" ${userLoc && userLoc.locationName === d.name ? 'selected' : ''}>
                    ${d.name} (${d.state})
                  </option>
                `).join('')}
              </select>
              ${userLoc ? `
                <span class="active-loc-tag font-mono">
                  ${userLoc.locationName}
                  <button type="button" class="btn-clear-loc" onclick="window.__clearLocationPriority()" title="Clear location">×</button>
                </span>
              ` : ''}
            </div>

            <div class="location-hint-note font-xs text-tertiary">
              Distance affects priority, not truth.
            </div>
          </div>

          <div class="verify-submit-row">
            <button type="submit" class="btn btn-primary btn-lg" id="btn-run-verify" ${isVerifying ? 'disabled' : ''}>
              ${isVerifying ? 'Verifying evidence...' : 'Verify Claim'}
            </button>
          </div>
        </form>

        <!-- Minimal Clean Pipeline Progress Indicator -->
        <div id="pipeline-progress-container" class="pipeline-clean ${isVerifying ? 'active' : ''}">
          <div class="pipeline-flow-minimal font-xs font-mono">
            <span class="pipe-step ${currentStep >= 1 ? 'done' : ''} ${currentStep === 1 ? 'current' : ''}">Claim</span>
            <span class="pipe-arrow">→</span>
            <span class="pipe-step ${currentStep >= 2 ? 'done' : ''} ${currentStep === 2 ? 'current' : ''}">Sources</span>
            <span class="pipe-arrow">→</span>
            <span class="pipe-step ${currentStep >= 3 ? 'done' : ''} ${currentStep === 3 ? 'current' : ''}">Evidence</span>
            <span class="pipe-arrow">→</span>
            <span class="pipe-step ${currentStep >= 4 ? 'done' : ''} ${currentStep === 4 ? 'current' : ''}">Assessment</span>
          </div>
          <div id="pipeline-status-label" class="pipeline-label-clean font-xs text-secondary mt-1">
            Analyzing claims against multi-source evidence...
          </div>
        </div>
      </div>

      <!-- Quick Preset Examples -->
      <div class="presets-minimal text-center mt-6">
        <span class="preset-label font-xs text-tertiary">Try examples:</span>
        <div class="preset-chips-wrap">
          ${PRESET_CLAIMS.slice(0, 4).map(p => `
            <button type="button" class="preset-chip" onclick="window.__selectPresetClaim('${p.id}')">
              ${p.locationName || p.location}: ${p.text.substring(0, 42)}...
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
