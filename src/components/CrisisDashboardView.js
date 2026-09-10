/**
 * CrisisLens AI — Crisis Command Center & Telemetry Dashboard
 * Requirements 8, 9, 10, 16, 17:
 * - Location-Aware Prioritization Control
 * - Multi-factor Crisis Urgency Ranking
 * - Approximate Proximity Badges
 * - Simulated Map with Distance Rings
 * - Privacy Notice & Truth Distinction Disclaimer
 */

import { store } from '../state/store.js';
import { locationService, LOCATION_STATUS } from '../services/locationService.js';
import { DEMO_LOCATIONS } from '../data/crisisDataset.js';

export function renderCrisisDashboardView() {
  const claims = store.getPrioritizedClaims();
  const rawClaims = store.claims;
  const reviewCount = store.reviewQueue.length;
  const contradictedCount = rawClaims.filter(c => c.status === 'CONTRADICTED').length;
  const supportedCount = rawClaims.filter(c => c.status === 'SUPPORTED' || c.status === 'PARTIALLY SUPPORTED').length;

  const locStatus = locationService.getStatus();
  const userLoc = locationService.getUserLocation();
  const isLocEnabled = store.locationPriorityEnabled && Boolean(userLoc);
  const activeFilter = store.priorityFilter;

  return `
    <div class="dashboard-page container animate-fade-in">
      <div class="dashboard-header-bar">
        <div>
          <div class="page-badge">
            <span class="simulation-pill"><span class="pulse-dot"></span> LIVE OPERATIONS DESK</span>
            <span class="font-mono text-tertiary">Sector: Western & Eastern Disaster Watch</span>
          </div>
          <h1>Crisis Command Center</h1>
          <p>Real-time surveillance of viral disaster claims, verification posture, and triage queues.</p>
        </div>

        <div class="dashboard-actions">
          <button class="btn btn-primary" onclick="window.__navigateTo('verify')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            Ingest New Claim
          </button>
          <button class="btn btn-secondary" onclick="window.__navigateTo('simulation')">
            Dynamic Simulator
          </button>
        </div>
      </div>

      <!-- Telemetry Stats Row -->
      <div class="telemetry-stats-grid">
        <div class="glass-panel stat-card">
          <div class="stat-top">
            <span class="stat-title">Active Claims</span>
            <span class="stat-icon text-cyan">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </span>
          </div>
          <div class="stat-value font-mono">${rawClaims.length}</div>
          <div class="stat-sub text-tertiary">Across monitored disaster sectors</div>
        </div>

        <div class="glass-panel stat-card">
          <div class="stat-top">
            <span class="stat-title">Debunked Rumors</span>
            <span class="stat-icon text-crimson">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </span>
          </div>
          <div class="stat-value font-mono text-crimson">${contradictedCount}</div>
          <div class="stat-sub text-tertiary">Prevented panic amplification</div>
        </div>

        <div class="glass-panel stat-card">
          <div class="stat-top">
            <span class="stat-title">Corroborated Alerts</span>
            <span class="stat-icon text-emerald">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </span>
          </div>
          <div class="stat-value font-mono text-emerald">${supportedCount}</div>
          <div class="stat-sub text-tertiary">Backed by official telemetry</div>
        </div>

        <div class="glass-panel stat-card">
          <div class="stat-top">
            <span class="stat-title">Human Triage Queue</span>
            <span class="stat-icon text-amber">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>
            </span>
          </div>
          <div class="stat-value font-mono text-amber">${reviewCount}</div>
          <div class="stat-sub">
            <a href="javascript:void(0)" onclick="window.__navigateTo('review')" class="link-cyan">Adjudicate Queue →</a>
          </div>
        </div>
      </div>

      <!-- LOCATION-AWARE CRISIS PRIORITIZATION CONTROL BAR -->
      <section class="glass-panel geo-priority-control-panel mb-6">
        <div class="geo-control-top">
          <div class="geo-title-box">
            <div class="geo-icon-badge ${isLocEnabled ? 'active' : ''}">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
              </svg>
            </div>
            <div>
              <div class="geo-header-flex">
                <h3 class="geo-panel-heading">Location-Aware Crisis Prioritization</h3>
                <span class="simulation-pill"><span class="pulse-dot"></span> NEW INNOVATION</span>
              </div>
              <p class="geo-panel-sub">
                ${isLocEnabled 
                  ? `Active proximity baseline: <strong>${userLoc.locationName}</strong> ${userLoc.isDemo ? '(DEMO MODE)' : '(BROWSER GPS)'}`
                  : 'Allow location access to prioritize crisis information near you.'}
              </p>
            </div>
          </div>

          <!-- Master Priority Switch -->
          <div class="geo-toggle-wrapper">
            <button 
              id="btn-toggle-geo"
              class="btn ${isLocEnabled ? 'btn-primary' : 'btn-secondary'} btn-sm geo-toggle-btn"
              onclick="window.__toggleLocationAwarePriority()"
            >
              <span class="pulse-dot ${isLocEnabled ? 'bg-cyan' : ''}"></span>
              ${isLocEnabled ? 'Prioritize Near Me (Active)' : 'Prioritize What Matters Near Me'}
            </button>
          </div>
        </div>

        <!-- Location Controls & Demo Mode Selector -->
        <div class="geo-options-row">
          <div class="geo-btn-group">
            <span class="option-lbl font-mono font-xs text-tertiary">LOCATION SOURCE:</span>
            <button 
              class="btn btn-xs ${isLocEnabled && !userLoc.isDemo ? 'btn-primary' : 'btn-secondary'}" 
              onclick="window.__requestBrowserLocation()"
              title="Request browser GPS with explicit permission"
            >
              📡 Use My Location (GPS)
            </button>
            <span class="option-divider">or Demo:</span>
            ${DEMO_LOCATIONS.map(demo => `
              <button 
                class="btn btn-xs ${isLocEnabled && userLoc.locationName === demo.name ? 'btn-primary' : 'btn-secondary'}" 
                onclick="window.__selectDemoLocation('${demo.id}')"
                title="Synthetic test hub for hackathon presentation"
              >
                📍 ${demo.name}
              </button>
            `).join('')}
            ${isLocEnabled ? `
              <button class="btn btn-ghost btn-xs text-tertiary" onclick="window.__clearLocationPriority()">
                ✕ Reset
              </button>
            ` : ''}
          </div>

          <div class="geo-privacy-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span class="font-xs text-secondary">Your location is used locally to calculate crisis proximity and is not stored.</span>
          </div>
        </div>

        <!-- Fallback / Denied Warning -->
        ${locStatus === LOCATION_STATUS.DENIED || locStatus === LOCATION_STATUS.UNAVAILABLE ? `
          <div class="geo-alert-bar warning mt-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>Location unavailable — showing general crisis priority. (You can also pick a Demo Location above for testing).</span>
          </div>
        ` : ''}

        <!-- Truth Distinction & Formula Footer -->
        <div class="geo-footer-disclaimer">
          <div class="formula-caption font-mono font-xs text-tertiary">
            Formula: Priority = 0.40 × Proximity + 0.25 × Severity + 0.20 × Uncertainty + 0.15 × Recency
          </div>
          <div class="disclaimer-text font-mono font-xs text-amber">
            ⚠️ <strong>Critical Principle:</strong> Proximity affects priority and relevance only. It does not determine whether a claim is true or false.
          </div>
        </div>
      </section>

      <!-- Main Layout: Claims Feed + Simulated Map -->
      <div class="dashboard-main-grid">
        <!-- Claims Feed Column -->
        <div class="feed-column">
          <div class="glass-panel feed-panel">
            <div class="panel-header-flex">
              <div>
                <h3>Monitored Crisis Claims (${claims.length})</h3>
                <p class="text-tertiary">
                  ${isLocEnabled 
                    ? `Dynamically ranked by geographic urgency relative to ${userLoc.locationName}`
                    : 'Sorted by default incident urgency and telemetry status'}
                </p>
              </div>

              <!-- Priority Filters (Requirement 9) -->
              <div class="filter-controls-group">
                <span class="font-mono font-xs text-tertiary">FILTER:</span>
                <div class="filter-pills">
                  <button class="filter-pill ${activeFilter === 'ALL' ? 'active' : ''}" onclick="window.__setPriorityFilter('ALL')">
                    All
                  </button>
                  <button class="filter-pill ${activeFilter === 'NEAR_ME' ? 'active' : ''}" onclick="window.__setPriorityFilter('NEAR_ME')">
                    Near Me (&lt;100 km)
                  </button>
                  <button class="filter-pill ${activeFilter === 'HIGH_PRIORITY' ? 'active' : ''}" onclick="window.__setPriorityFilter('HIGH_PRIORITY')">
                    High Priority
                  </button>
                  <button class="filter-pill ${activeFilter === 'CRITICAL' ? 'active' : ''}" onclick="window.__setPriorityFilter('CRITICAL')">
                    Critical
                  </button>
                </div>
              </div>
            </div>

            <div class="feed-items-list" id="dashboard-feed-container">
              ${claims.length === 0 ? `
                <div class="empty-feed-card text-center py-8">
                  <p class="text-tertiary">No claims match the active proximity/priority filter.</p>
                  <button class="btn btn-secondary btn-xs mt-2" onclick="window.__setPriorityFilter('ALL')">
                    Reset Filter to All
                  </button>
                </div>
              ` : claims.map(claim => {
                const prio = claim.priority;
                return `
                  <div class="feed-item glass-panel priority-border-${prio ? prio.level : 'DISTANT'}" onclick="window.__selectPresetClaim('${claim.id}')">
                    <div class="feed-item-header">
                      <div class="feed-badges-left">
                        <span class="status-badge ${claim.status ? claim.status.replace(' ', '_') : 'UNVERIFIED'}">
                          ${claim.status || 'UNVERIFIED'}
                        </span>
                        ${prio ? `
                          <span class="priority-badge level-${prio.level}">
                            ${prio.levelIcon} ${prio.level} (${prio.priorityScore}/100)
                          </span>
                        ` : ''}
                      </div>

                      <div class="feed-time font-mono font-xs text-tertiary">
                        ${prio && prio.distanceKm !== null ? `
                          <span class="distance-pill font-bold text-cyan">📍 ${prio.proximityLabel}</span>
                        ` : `
                          <span>📍 ${claim.locationName || claim.location}</span>
                        `}
                      </div>
                    </div>

                    <h4 class="feed-item-claim">"${claim.text}"</h4>

                    <!-- Explainability Breakdown Snippet (Requirement 12) -->
                    <div class="feed-item-explainability">
                      <div class="explainability-factors font-mono font-xs">
                        <span>Proximity: <strong>${prio && prio.factors.proximity !== null ? prio.factors.proximity + '/100' : 'N/A'}</strong></span>
                        <span>Severity: <strong>${prio ? prio.factors.severity + '/100' : '50/100'}</strong></span>
                        <span>Uncertainty: <strong>${prio ? prio.factors.uncertainty + '/100' : '50/100'}</strong></span>
                        <span>Recency: <strong>${prio ? prio.factors.recency + '/100' : '50/100'}</strong></span>
                      </div>
                      <p class="feed-rationale font-xs text-secondary">${prio ? prio.rationale : ''}</p>
                    </div>

                    <div class="feed-item-footer">
                      <span class="font-mono font-xs text-cyan">Confidence: ${claim.confidence || 75}%</span>
                      <span class="text-tertiary font-xs click-prompt">Click to Run Forensic Verification →</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Simulated Map Column (Requirements 10 & 12) -->
        <div class="map-column">
          <div class="glass-panel map-panel">
            <div class="panel-header-flex">
              <div>
                <div class="simulation-pill"><span class="pulse-dot"></span> SIMULATED CRISIS DATA</div>
                <h3>Geospatial Incident Matrix</h3>
              </div>
              <span class="font-mono font-xs text-tertiary">
                ${isLocEnabled ? `Center: ${userLoc.locationName}` : 'Projection: WGS84 Safe'}
              </span>
            </div>

            <!-- Polished Vector Map Visualization -->
            <div class="simulated-map-container">
              <div class="map-grid-overlay"></div>

              <!-- Distance Rings Visualization if User Location Active (Requirement 10) -->
              ${isLocEnabled ? `
                <div class="user-location-marker pulse-user">
                  <div class="user-pulse-ring ring-25" title="0–25 km Immediate Proximity Radius"></div>
                  <div class="user-pulse-ring ring-100" title="25–100 km Regional Operational Radius"></div>
                  <div class="user-center-dot" title="Your approximate baseline: ${userLoc.locationName}">
                    <span>👤</span>
                  </div>
                  <div class="user-location-label font-mono font-xs">
                    ${userLoc.locationName} (You)
                  </div>
                </div>
              ` : ''}
              
              <!-- Hotspot Pins with Distance Badges -->
              <!-- Vijayawada Pin -->
              <div class="map-pin-hotspot pin-vijayawada" onclick="window.__selectPresetClaim('claim-preset-05')">
                <div class="pin-sonar bg-crimson"></div>
                <div class="pin-dot bg-crimson"></div>
                <div class="pin-tooltip">
                  <strong>Prakasam Barrage, Vijayawada</strong>
                  <span class="status-badge CONTRADICTED">CRITICAL SURGE</span>
                  ${isLocEnabled ? `<p class="font-mono text-cyan">${userLoc.locationName === 'Vijayawada' ? 'Nearby (< 4 km from you)' : '~45 km away'}</p>` : ''}
                  <p>Flood gate operations underway. Telemetry monitored.</p>
                </div>
              </div>

              <!-- Guntur Pin -->
              <div class="map-pin-hotspot pin-guntur" onclick="window.__selectPresetClaim('claim-preset-07')">
                <div class="pin-sonar bg-amber"></div>
                <div class="pin-dot bg-amber"></div>
                <div class="pin-tooltip">
                  <strong>Guntur Canal Belt</strong>
                  <span class="status-badge PARTIALLY_SUPPORTED">CANAL RUMOR</span>
                  ${isLocEnabled ? `<p class="font-mono text-cyan">${userLoc.locationName === 'Guntur' ? 'Nearby (< 5 km from you)' : '~38 km away'}</p>` : ''}
                  <p>Agricultural waterlogging amplified as breach.</p>
                </div>
              </div>

              <!-- Visakhapatnam Pin -->
              <div class="map-pin-hotspot pin-vizag" onclick="window.__selectPresetClaim('claim-preset-06')">
                <div class="pin-sonar bg-amber"></div>
                <div class="pin-dot bg-amber"></div>
                <div class="pin-tooltip">
                  <strong>Visakhapatnam Industrial Zone</strong>
                  <span class="status-badge UNVERIFIED">GAS DISPERSION RUMOR</span>
                  ${isLocEnabled ? `<p class="font-mono text-cyan">${userLoc.locationName === 'Visakhapatnam' ? 'Nearby (< 8 km from you)' : '~340 km away'}</p>` : ''}
                  <p>Mock drill misinterpreted on social chat groups.</p>
                </div>
              </div>

              <!-- Idukki Pin -->
              <div class="map-pin-hotspot pin-idukki" onclick="window.__selectPresetClaim('claim-preset-01')">
                <div class="pin-sonar bg-crimson"></div>
                <div class="pin-dot bg-crimson"></div>
                <div class="pin-tooltip">
                  <strong>Mullaperiyar Shutter Spillway</strong>
                  <span class="status-badge CONTRADICTED">CONTRADICTED RUMOR</span>
                  ${isLocEnabled ? `<p class="font-mono text-cyan">~680 km from you</p>` : ''}
                  <p>Sensor telemetry normal. Routine release.</p>
                </div>
              </div>

              <!-- Paradip Pin -->
              <div class="map-pin-hotspot pin-paradip" onclick="window.__selectPresetClaim('claim-preset-02')">
                <div class="pin-sonar bg-amber"></div>
                <div class="pin-dot bg-amber"></div>
                <div class="pin-tooltip">
                  <strong>Paradip Coastal Sector</strong>
                  <span class="status-badge PARTIALLY_SUPPORTED">PARTIAL CYCLONE</span>
                  ${isLocEnabled ? `<p class="font-mono text-cyan">~720 km from you</p>` : ''}
                  <p>Cyclone approaching; sea wall intact.</p>
                </div>
              </div>

              <div class="map-legend-box">
                <span class="leg-row"><span class="dot bg-crimson"></span> Structural / Barrage Hazard</span>
                <span class="leg-row"><span class="dot bg-amber"></span> Extreme Weather / Canal</span>
                <span class="leg-row"><span class="dot bg-cyan"></span> ${isLocEnabled ? 'Proximity Rings: 0–25 km, 25–100 km' : 'Location Inactive'}</span>
              </div>
            </div>

            <div class="map-footer-caption">
              <span class="font-mono font-xs text-tertiary">
                NOTE: Coordinates and proximity rings are approximate synthetic visualizations for hackathon safety.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
