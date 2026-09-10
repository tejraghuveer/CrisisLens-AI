/**
 * CrisisLens AI — Minimalist Navigation Header
 */

import { store } from '../state/store.js';

export function renderNavbar() {
  const active = store.currentView;
  const reviewCount = store.reviewQueue.length;
  const isDark = store.theme === 'dark';

  return `
    <header class="navbar-header">
      <div class="container navbar-inner">
        <div class="navbar-brand" onclick="window.__navigateTo('verify')">
          <span class="brand-name">CrisisLens<span class="brand-accent">AI</span></span>
        </div>

        <nav class="navbar-links" aria-label="Main Navigation">
          <button class="nav-link ${active === 'verify' ? 'active' : ''}" onclick="window.__navigateTo('verify')">
            Verify
          </button>
          <button class="nav-link ${active === 'dashboard' ? 'active' : ''}" onclick="window.__navigateTo('dashboard')">
            Dashboard
          </button>
          <button class="nav-link ${active === 'review' ? 'active' : ''}" onclick="window.__navigateTo('review')">
            Review
            ${reviewCount > 0 ? `<span class="nav-badge">${reviewCount}</span>` : ''}
          </button>
          <button class="nav-link ${active === 'simulation' ? 'active' : ''}" onclick="window.__navigateTo('simulation')">
            Simulation
          </button>
          <button class="nav-link ${active === 'about' || active === 'methodology' ? 'active' : ''}" onclick="window.__navigateTo('about')">
            About
          </button>
        </nav>

        <div class="navbar-actions">
          <button 
            type="button" 
            class="btn-theme-toggle" 
            onclick="window.__toggleTheme()" 
            title="${isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}" 
            aria-label="Toggle theme"
          >
            ${isDark ? '☀️' : '🌙'}
          </button>
          <span class="sim-tag" title="Synthetic simulation dataset for hackathon evaluation">Demo Data</span>
        </div>
      </div>
    </header>
  `;
}
