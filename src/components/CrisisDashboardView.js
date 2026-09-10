/**
 * CrisisLens AI — Crisis Command Center & Telemetry Dashboard
 * Requirements 11 & 12: Command Center + Simulated Crisis Map
 */

import { store } from '../state/store.js';

export function renderCrisisDashboardView() {
  const claims = store.claims;
  const reviewCount = store.reviewQueue.length;
  const contradictedCount = claims.filter(c => c.status === 'CONTRADICTED').length;
  const supportedCount = claims.filter(c => c.status === 'SUPPORTED' || c.status === 'PARTIALLY SUPPORTED').length;
  const unverifiedCount = claims.filter(c => c.status === 'UNVERIFIED' || c.status === 'INSUFFICIENT EVIDENCE').length;

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
          <div class="stat-value font-mono">${claims.length}</div>
          <div class="stat-sub text-tertiary">Across 4 disaster zones</div>
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

      <!-- Main Layout: Claims Feed + Simulated Map -->
      <div class="dashboard-main-grid">
        <!-- Claims Feed Column -->
        <div class="feed-column">
          <div class="glass-panel feed-panel">
            <div class="panel-header-flex">
              <div>
                <h3>Monitored Crisis Claims</h3>
                <p class="text-tertiary">Filtered by latest incident urgency and telemetry status</p>
              </div>
              <div class="filter-controls">
                <select id="dashboard-filter-status" class="form-select-sm" onchange="window.__filterDashboardClaims(this.value)">
                  <option value="ALL">All Statuses</option>
                  <option value="CONTRADICTED">Contradicted Only</option>
                  <option value="SUPPORTED">Supported Only</option>
                  <option value="UNVERIFIED">Unverified Only</option>
                </select>
              </div>
            </div>

            <div class="feed-items-list" id="dashboard-feed-container">
              ${claims.map(claim => `
                <div class="feed-item glass-panel" onclick="window.__selectPresetClaim('${claim.id}')">
                  <div class="feed-item-header">
                    <span class="status-badge ${claim.status ? claim.status.replace(' ', '_') : 'UNVERIFIED'}">
                      ${claim.status || 'UNVERIFIED'}
                    </span>
                    <span class="feed-time font-mono font-xs text-tertiary">
                      📍 ${claim.location} • ${claim.severity || 'HIGH'}
                    </span>
                  </div>
                  <h4 class="feed-item-claim">"${claim.text}"</h4>
                  <div class="feed-item-footer">
                    <span class="font-mono font-xs text-cyan">Confidence: ${claim.confidence || 75}%</span>
                    <span class="text-tertiary font-xs">Click to Run Full Forensic Audit →</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Simulated Map Column (Requirement 12) -->
        <div class="map-column">
          <div class="glass-panel map-panel">
            <div class="panel-header-flex">
              <div>
                <div class="simulation-pill"><span class="pulse-dot"></span> SIMULATED CRISIS DATA</div>
                <h3>Geospatial Incident Matrix</h3>
              </div>
              <span class="font-mono font-xs text-tertiary">Projection: WGS84 Safe Synthetic</span>
            </div>

            <!-- Polished Vector Map Visualization -->
            <div class="simulated-map-container">
              <div class="map-grid-overlay"></div>
              
              <!-- Hotspot Pins -->
              <div class="map-pin-hotspot pin-idukki" onclick="window.__selectPresetClaim('claim-preset-01')">
                <div class="pin-sonar bg-crimson"></div>
                <div class="pin-dot bg-crimson"></div>
                <div class="pin-tooltip">
                  <strong>Mullaperiyar Shutter Spillway</strong>
                  <span class="status-badge CONTRADICTED">CONTRADICTED RUMOR</span>
                  <p>Sensor telemetry normal. Routine 1,200 cusecs release.</p>
                </div>
              </div>

              <div class="map-pin-hotspot pin-paradip" onclick="window.__selectPresetClaim('claim-preset-02')">
                <div class="pin-sonar bg-amber"></div>
                <div class="pin-dot bg-amber"></div>
                <div class="pin-tooltip">
                  <strong>Paradip Coastal Sector</strong>
                  <span class="status-badge PARTIALLY_SUPPORTED">PARTIAL</span>
                  <p>Cyclone approaching; 110 km/h gusts. Sea wall intact.</p>
                </div>
              </div>

              <div class="map-pin-hotspot pin-noida" onclick="window.__selectPresetClaim('claim-preset-03')">
                <div class="pin-sonar bg-crimson"></div>
                <div class="pin-dot bg-crimson"></div>
                <div class="pin-tooltip">
                  <strong>Sector 62 Transit Viaduct</strong>
                  <span class="status-badge CONTRADICTED">CONTRADICTED</span>
                  <p>Recycled 2018 construction photo. Zero structural damage.</p>
                </div>
              </div>

              <div class="map-legend-box">
                <span class="leg-row"><span class="dot bg-crimson"></span> Structural Breach Rumor (Contradicted)</span>
                <span class="leg-row"><span class="dot bg-amber"></span> Cyclone Wind Alert (Partially Supported)</span>
                <span class="leg-row"><span class="dot bg-purple"></span> Water Supply Claim (Under Review)</span>
              </div>
            </div>

            <div class="map-footer-caption">
              <span class="font-mono font-xs text-tertiary">
                NOTE: Coordinates and operational sectors are synthetic safe approximations for hackathon evaluation.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
