/**
 * CrisisLens AI — Navigation Header Component
 */

import { store } from '../state/store.js';

export function renderNavbar() {
  const active = store.currentView;
  const reviewCount = store.reviewQueue.length;

  return `
    <header class="navbar-header">
      <div class="container navbar-inner">
        <div class="navbar-brand" onclick="window.__navigateTo('landing')">
          <div class="brand-logo-badge">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <circle cx="12" cy="11" r="3"/>
            </svg>
          </div>
          <div class="brand-titles">
            <span class="brand-name">CrisisLens<span class="brand-accent">AI</span></span>
            <span class="brand-tagline">Evidence Before Amplification</span>
          </div>
        </div>

        <nav class="navbar-links" aria-label="Main Navigation">
          <button class="nav-link ${active === 'landing' ? 'active' : ''}" onclick="window.__navigateTo('landing')">
            Overview
          </button>
          <button class="nav-link ${active === 'verify' ? 'active' : ''}" onclick="window.__navigateTo('verify')">
            Verify Claim
          </button>
          ${store.activeVerification ? `
            <button class="nav-link ${active === 'result' ? 'active' : ''}" onclick="window.__navigateTo('result')">
              Result & Graph
            </button>
          ` : ''}
          <button class="nav-link ${active === 'dashboard' ? 'active' : ''}" onclick="window.__navigateTo('dashboard')">
            Command Center
          </button>
          <button class="nav-link ${active === 'clusters' ? 'active' : ''}" onclick="window.__navigateTo('clusters')">
            Narratives
          </button>
          <button class="nav-link ${active === 'review' ? 'active' : ''}" onclick="window.__navigateTo('review')">
            Review Queue
            ${reviewCount > 0 ? `<span class="nav-badge alert">${reviewCount}</span>` : ''}
          </button>
          <button class="nav-link highlight ${active === 'simulation' ? 'active' : ''}" onclick="window.__navigateTo('simulation')">
            <span class="pulse-dot"></span> Live Sim
          </button>
          <button class="nav-link ${active === 'methodology' ? 'active' : ''}" onclick="window.__navigateTo('methodology')">
            Methodology
          </button>
        </nav>

        <div class="navbar-actions">
          <div class="simulation-pill" title="System running in offline synthetic telemetry mode">
            <span class="pulse-dot"></span>
            SIMULATION DATA
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.__navigateTo('verify')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            Verify
          </button>
        </div>
      </div>
    </header>
  `;
}
