/**
 * CrisisLens AI — Minimalist Crisis Dashboard
 * Clean 4-metric overview + simple claims list
 */

import { store } from '../state/store.js';
import { locationService } from '../services/locationService.js';
import { DEMO_LOCATIONS } from '../data/crisisDataset.js';

export function renderCrisisDashboardView() {
  const claims = store.getPrioritizedClaims();
  const rawClaims = store.claims;
  const reviewCount = store.reviewQueue.length;
  const contradictedCount = rawClaims.filter(c => c.status === 'CONTRADICTED').length;
  const unverifiedCount = rawClaims.filter(c => c.status === 'UNVERIFIED' || c.status === 'INSUFFICIENT EVIDENCE').length;

  const userLoc = locationService.getUserLocation();
  const isLocEnabled = store.locationPriorityEnabled && Boolean(userLoc);
  const activeFilter = store.priorityFilter;

  return `
    <div class="dashboard-page container-narrow animate-fade-in">
      <!-- Minimal Page Header -->
      <div class="dashboard-header-simple mb-6">
        <div>
          <h2>Crisis Dashboard</h2>
          <p class="text-tertiary font-sm">Recent disaster reports and verification statuses.</p>
        </div>
        <div>
          <button class="btn btn-primary btn-sm" onclick="window.__navigateTo('verify')">
            + Verify Claim
          </button>
        </div>
      </div>

      <!-- 4 Key Metrics Only -->
      <div class="metrics-four-grid mb-6">
        <div class="metric-clean-box card">
          <span class="metric-clean-num">${rawClaims.length}</span>
          <span class="metric-clean-lbl font-xs text-tertiary">Active claims</span>
        </div>
        <div class="metric-clean-box card">
          <span class="metric-clean-num text-amber">${reviewCount}</span>
          <span class="metric-clean-lbl font-xs text-tertiary">Needs review</span>
        </div>
        <div class="metric-clean-box card">
          <span class="metric-clean-num text-red">${contradictedCount}</span>
          <span class="metric-clean-lbl font-xs text-tertiary">Contradicted</span>
        </div>
        <div class="metric-clean-box card">
          <span class="metric-clean-num text-secondary">${unverifiedCount}</span>
          <span class="metric-clean-lbl font-xs text-tertiary">Unverified</span>
        </div>
      </div>

      <!-- Compact Location Prioritization Strip -->
      <div class="location-strip card mb-6">
        <div class="strip-left">
          <button 
            class="btn btn-sm ${isLocEnabled ? 'btn-primary' : 'btn-secondary'}"
            onclick="window.__toggleLocationAwarePriority()"
          >
            ${isLocEnabled ? '📍 Location Priority Active' : '📍 Prioritize Near Me'}
          </button>
          
          <select 
            class="demo-loc-select-sm" 
            onchange="window.__selectDemoLocation(this.value)"
            aria-label="Demo Location"
          >
            <option value="">Demo location...</option>
            ${DEMO_LOCATIONS.map(d => `
              <option value="${d.id}" ${userLoc && userLoc.locationName === d.name ? 'selected' : ''}>
                ${d.name}
              </option>
            `).join('')}
          </select>

          ${userLoc ? `
            <span class="loc-summary-text font-xs text-tertiary">
              Active: <strong>${userLoc.locationName}</strong>
            </span>
          ` : ''}
        </div>

        <div class="strip-right font-xs text-tertiary">
          Distance affects priority, not truth.
        </div>
      </div>

      <!-- Recent Claims Table / Simple Rows -->
      <div class="recent-claims-section">
        <div class="section-filter-row mb-3">
          <h3 class="font-sm font-semibold text-secondary">Recent claims</h3>
          
          <!-- Filter pills -->
          <div class="filter-pills-clean font-xs">
            <button class="pill-btn ${activeFilter === 'ALL' ? 'active' : ''}" onclick="window.__setPriorityFilter('ALL')">All</button>
            <button class="pill-btn ${activeFilter === 'NEAR_ME' ? 'active' : ''}" onclick="window.__setPriorityFilter('NEAR_ME')">Near Me</button>
            <button class="pill-btn ${activeFilter === 'HIGH_PRIORITY' ? 'active' : ''}" onclick="window.__setPriorityFilter('HIGH_PRIORITY')">High Priority</button>
            <button class="pill-btn ${activeFilter === 'CRITICAL' ? 'active' : ''}" onclick="window.__setPriorityFilter('CRITICAL')">Critical</button>
          </div>
        </div>

        <div class="claims-simple-list">
          ${claims.map(claim => {
            const prio = claim.priority;
            return `
              <div class="claim-simple-row card" onclick="window.__selectPresetClaim('${claim.id}')">
                <div class="claim-main-cell">
                  <div class="claim-title-text font-sm font-medium">"${claim.text}"</div>
                  <div class="claim-meta-text font-xs text-tertiary">
                    📍 ${claim.locationName || claim.location}
                    ${prio && prio.distanceKm !== null ? ` • <span class="text-primary">${prio.proximityLabel}</span>` : ''}
                    • ${new Date(claim.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div class="claim-status-cell">
                  <span class="status-badge ${claim.status ? claim.status.replace(' ', '_') : 'UNVERIFIED'}">
                    ${claim.status || 'UNVERIFIED'}
                  </span>
                </div>

                <div class="claim-priority-cell font-xs font-mono">
                  ${prio ? `
                    <span class="prio-tag prio-${prio.level}">
                      ${prio.level}
                    </span>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}
