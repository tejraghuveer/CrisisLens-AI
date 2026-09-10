/**
 * CrisisLens AI — Main Application Entry & Controller
 */

import { store } from './state/store.js';
import { renderNavbar } from './components/Navbar.js';
import { renderLandingView } from './components/LandingView.js';
import { renderVerifyClaimView } from './components/VerifyClaimView.js';
import { renderVerificationResultView } from './components/VerificationResultView.js';
import { renderCrisisDashboardView } from './components/CrisisDashboardView.js';
import { renderNarrativeClusterView } from './components/NarrativeClusterView.js';
import { renderHumanReviewView } from './components/HumanReviewView.js';
import { renderSimulationView } from './components/SimulationView.js';
import { renderMethodologyView } from './components/MethodologyView.js';
import { ProvenanceGraphRenderer } from './engine/provenanceGraph.js';
import { CrisisSimulator } from './engine/simulationEngine.js';
import { PRESET_CLAIMS } from './data/crisisDataset.js';

// Initialize Simulator Instance
let crisisSimulator = null;
let currentSimState = null;
let pendingAdjudication = { id: null, action: null };

function initSimulator() {
  crisisSimulator = new CrisisSimulator('sim-dam-evolution', (state) => {
    currentSimState = state;
    if (store.currentView === 'simulation') {
      render();
    }
  });
  currentSimState = {
    scenario: crisisSimulator.scenario,
    currentStep: crisisSimulator.getCurrentStep(),
    stepIndex: crisisSimulator.currentStepIndex,
    totalSteps: crisisSimulator.getTotalSteps(),
    isPlaying: crisisSimulator.isPlaying,
    eventHistory: crisisSimulator.eventHistory
  };
}

// Global UI Navigation Dispatcher
window.__navigateTo = function(viewName) {
  store.setView(viewName);
};

// Theme Toggle Dispatcher
window.__toggleTheme = function() {
  store.toggleTheme();
};

// Location-Aware Prioritization Handlers (Requirement 8, 9, 16, 17)
window.__toggleLocationAwarePriority = async function() {
  if (store.locationPriorityEnabled) {
    store.toggleLocationPriority(false);
  } else {
    await store.toggleLocationPriority(true);
  }
};

window.__requestBrowserLocation = async function() {
  store.showToast('Requesting browser location access...', 'info');
  const res = await locationService.requestBrowserLocation();
  if (res.success) {
    store.locationPriorityEnabled = true;
    store.showToast('Browser location acquired. Priority updated using proximity.', 'success');
  } else {
    store.showToast(res.error || 'Location unavailable — showing general crisis priority.', 'info');
  }
};

window.__selectDemoLocation = function(locId) {
  store.setDemoLocation(locId);
};

window.__clearLocationPriority = function() {
  locationService.clearLocation();
  store.toggleLocationPriority(false);
};

window.__setPriorityFilter = function(filter) {
  store.setPriorityFilter(filter);
};

// Handle Claim Form Submission
window.__handleVerificationSubmit = async function(event) {
  event.preventDefault();
  const text = document.getElementById('claim-text')?.value?.trim();
  const category = document.getElementById('crisis-category')?.value;
  const location = document.getElementById('claim-location')?.value?.trim();
  const severity = document.getElementById('claim-severity')?.value;

  if (!text) return;

  const btn = document.getElementById('btn-run-verify');
  const progressBox = document.getElementById('pipeline-progress-container');
  const statusLabel = document.getElementById('pipeline-status-label');
  const pct = document.getElementById('pipeline-percentage');

  if (btn) btn.disabled = true;
  if (progressBox) progressBox.classList.add('active');

  // Resolve approximate coordinates if known location name
  let latitude = null;
  let longitude = null;
  const locLower = (location || '').toLowerCase();
  if (locLower.includes('vijayawada')) { latitude = 16.5062; longitude = 80.6480; }
  else if (locLower.includes('visakhapatnam') || locLower.includes('vizag')) { latitude = 17.6868; longitude = 83.2185; }
  else if (locLower.includes('guntur')) { latitude = 16.3067; longitude = 80.4365; }
  else if (locLower.includes('hyderabad')) { latitude = 17.3850; longitude = 78.4867; }
  else if (locLower.includes('idukki')) { latitude = 9.8494; longitude = 76.9804; }
  else if (locLower.includes('paradip')) { latitude = 20.3164; longitude = 86.6114; }
  else if (locLower.includes('noida')) { latitude = 28.5355; longitude = 77.3910; }
  else if (locLower.includes('pune')) { latitude = 18.5204; longitude = 73.8567; }

  await store.runVerification({
    text,
    category,
    location,
    locationName: location,
    latitude,
    longitude,
    severity,
    timestamp: new Date().toISOString()
  }, (stepIndex, label) => {
    if (statusLabel) statusLabel.textContent = label;
    if (pct) pct.textContent = `${Math.min(100, stepIndex * 20)}%`;
  });
};

// Preset Selection
window.__selectPresetClaim = function(presetId) {
  const preset = PRESET_CLAIMS.find(p => p.id === presetId);
  if (!preset) return;

  store.setView('verify');

  setTimeout(() => {
    const txtArea = document.getElementById('claim-text');
    const catSelect = document.getElementById('crisis-category');
    const locInput = document.getElementById('claim-location');
    const sevSelect = document.getElementById('claim-severity');
    const locPreview = document.getElementById('preview-claim-loc');

    if (txtArea) txtArea.value = preset.text;
    if (catSelect) catSelect.value = preset.category;
    if (locInput) locInput.value = preset.locationName || preset.location;
    if (sevSelect) sevSelect.value = preset.severity;
    if (locPreview) locPreview.textContent = preset.locationName || preset.location;
  }, 50);
};

window.__loadRandomPreset = function() {
  const randomPreset = PRESET_CLAIMS[Math.floor(Math.random() * PRESET_CLAIMS.length)];
  window.__selectPresetClaim(randomPreset.id);
};

window.__loadClusterIntoVerify = function(clusterId) {
  const cluster = store.narrativeClusterer.getClusters().find(c => c.id === clusterId);
  if (!cluster || !cluster.sampleClaims?.length) return;

  store.setView('verify');
  setTimeout(() => {
    const txtArea = document.getElementById('claim-text');
    const catSelect = document.getElementById('crisis-category');
    if (txtArea) txtArea.value = cluster.sampleClaims[0];
    if (catSelect) catSelect.value = cluster.category;
  }, 50);
};

// Human Adjudication Modal Handlers
window.__openAdjudicationModal = function(reviewId, action) {
  pendingAdjudication = { id: reviewId, action: action || 'REVIEW' };
  const modal = document.getElementById('adjudication-modal');
  const title = document.getElementById('modal-adjudication-title');
  const summary = document.getElementById('modal-claim-summary');
  const notes = document.getElementById('modal-reviewer-notes');

  const item = store.reviewQueue.find(q => q.id === reviewId);
  if (modal && item) {
    if (title) title.textContent = `Review Claim: ${item.severity || 'ALERT'}`;
    if (summary) summary.textContent = `"${item.claimText}" (${item.location}) — AI verdict: ${item.status || 'UNVERIFIED'}`;
    if (notes) notes.value = '';
    modal.style.display = 'flex';
  }
};

window.__closeAdjudicationModal = function() {
  const modal = document.getElementById('adjudication-modal');
  if (modal) modal.style.display = 'none';
  pendingAdjudication = { id: null, action: null };
};

window.__submitAdjudication = function() {
  const notes = document.getElementById('modal-reviewer-notes')?.value?.trim();
  if (pendingAdjudication.id) {
    store.resolveReview(pendingAdjudication.id, pendingAdjudication.action, notes);
    window.__closeAdjudicationModal();
  }
};

window.__submitAdjudicationWithAction = function(action) {
  const notes = document.getElementById('modal-reviewer-notes')?.value?.trim();
  if (pendingAdjudication.id) {
    store.resolveReview(pendingAdjudication.id, action, notes);
    window.__closeAdjudicationModal();
  }
};

// Drawer Toggles for Minimalist Result View
window.__toggleConfidenceDrawer = function() {
  const drawer = document.getElementById('confidence-drawer');
  if (drawer) {
    drawer.style.display = (drawer.style.display === 'none' || drawer.style.display === '') ? 'block' : 'none';
  }
};

window.__toggleGraphDrawer = function() {
  const wrapper = document.getElementById('provenance-graph-wrapper');
  if (wrapper) {
    const isHidden = (wrapper.style.display === 'none' || wrapper.style.display === '');
    wrapper.style.display = isHidden ? 'block' : 'none';
    if (isHidden && store.activeVerification) {
      setTimeout(() => {
        const graphContainer = document.getElementById('provenance-graph-container');
        if (graphContainer) {
          const graphData = ProvenanceGraphRenderer.buildGraphData(store.activeVerification);
          ProvenanceGraphRenderer.render(graphContainer, graphData, (node) => {
            showNodeDetailsInInspector(node);
          });
        }
      }, 50);
    }
  }
};

// Dashboard Claim Filter
window.__filterDashboardClaims = function(filterStatus) {
  const container = document.getElementById('dashboard-feed-container');
  if (!container) return;

  let filtered = store.claims;
  if (filterStatus !== 'ALL') {
    filtered = store.claims.filter(c => (c.status || 'UNVERIFIED').replace(' ', '_') === filterStatus);
  }

  container.innerHTML = filtered.map(claim => `
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
  `).join('');
};

// Graph Inspector Drawer Handlers
window.__closeGraphInspector = function() {
  const drawer = document.getElementById('graph-inspector-panel');
  if (drawer) drawer.classList.remove('open');
};

function showNodeDetailsInInspector(node) {
  const drawer = document.getElementById('graph-inspector-panel');
  const title = document.getElementById('inspector-node-title');
  const body = document.getElementById('inspector-node-body');

  if (!drawer || !title || !body) return;

  title.textContent = `${node.type}: ${node.label}`;
  
  let contentHtml = `
    <div class="inspector-item mb-2">
      <span class="font-mono font-xs text-tertiary">NODE ID:</span>
      <div class="font-mono text-cyan">${node.id}</div>
    </div>
  `;

  if (node.type === 'EVIDENCE') {
    const ev = node.data;
    contentHtml += `
      <div class="mb-2">
        <span class="font-mono font-xs text-tertiary">STANCE RELATION:</span>
        <div><span class="status-badge ${ev.relation}">${ev.relation}</span></div>
      </div>
      <div class="mb-2">
        <span class="font-mono font-xs text-tertiary">EXCERPT:</span>
        <blockquote class="text-secondary font-xs mt-1">"${ev.excerpt}"</blockquote>
      </div>
      <div class="mb-2">
        <span class="font-mono font-xs text-tertiary">SCORING BREAKDOWN:</span>
        <div class="font-mono font-xs mt-1 text-cyan">${ev.scoringFormula}</div>
        <div class="font-mono font-xs font-bold mt-1 text-emerald">Calculated Weight: ${ev.weightedScore}</div>
      </div>
      <div>
        <span class="font-mono font-xs text-tertiary">RETRIEVED FROM:</span>
        <div class="font-xs text-primary">${ev.source?.name} (${ev.source?.organization})</div>
      </div>
    `;
  } else if (node.type === 'SOURCE') {
    const src = node.data;
    contentHtml += `
      <div class="mb-2">
        <span class="font-mono font-xs text-tertiary">PUBLISHER:</span>
        <div class="text-primary font-bold">${src.name}</div>
      </div>
      <div class="mb-2">
        <span class="font-mono font-xs text-tertiary">RELIABILITY INDEX:</span>
        <div class="font-mono font-bold text-cyan">${(src.reliability * 100).toFixed(0)}%</div>
      </div>
      <div class="mb-2">
        <span class="font-mono font-xs text-tertiary">JURISDICTION:</span>
        <div class="font-mono font-xs text-secondary">${src.jurisdiction}</div>
      </div>
      <div>
        <span class="font-mono font-xs text-tertiary">STATUS:</span>
        <div class="text-emerald font-xs font-mono">Verified Institutional Registrar</div>
      </div>
    `;
  } else if (node.type === 'ASSERTION') {
    const asst = node.data;
    contentHtml += `
      <div class="mb-2">
        <span class="font-mono font-xs text-tertiary">ASSERTION TYPE:</span>
        <div class="font-mono text-cyan">${asst.type}</div>
      </div>
      <div class="mb-2">
        <span class="font-mono font-xs text-tertiary">FACTUAL STATEMENT:</span>
        <p class="text-primary font-xs mt-1">${asst.statement}</p>
      </div>
      <div>
        <span class="font-mono font-xs text-tertiary">TARGET GEOGRAPHY:</span>
        <div class="font-mono font-xs text-secondary">${asst.targetLocation}</div>
      </div>
    `;
  } else {
    contentHtml += `
      <p class="font-xs text-secondary">${node.sublabel || ''}</p>
    `;
  }

  body.innerHTML = contentHtml;
  drawer.classList.add('open');
}

// Dynamic Simulation Controls
window.__toggleSimulationPlay = function() {
  if (crisisSimulator.isPlaying) {
    crisisSimulator.pause();
  } else {
    crisisSimulator.play();
  }
  render();
};

window.__simNextStep = function() {
  crisisSimulator.nextStep();
  render();
};

window.__simPrevStep = function() {
  crisisSimulator.prevStep();
  render();
};

window.__simReset = function() {
  crisisSimulator.reset();
  render();
};

window.__simJumpToStep = function(index) {
  crisisSimulator.jumpToStep(index);
  render();
};

// Central Render Function
function render() {
  const app = document.getElementById('app');
  if (!app) return;

  const navbarHtml = renderNavbar();
  let mainContentHtml = '';

  switch (store.currentView) {
    case 'verify':
    case 'landing':
      mainContentHtml = renderVerifyClaimView();
      break;
    case 'result':
      mainContentHtml = renderVerificationResultView();
      break;
    case 'dashboard':
      mainContentHtml = renderCrisisDashboardView();
      break;
    case 'clusters':
      mainContentHtml = renderNarrativeClusterView();
      break;
    case 'review':
      mainContentHtml = renderHumanReviewView();
      break;
    case 'simulation':
      mainContentHtml = renderSimulationView(currentSimState);
      break;
    case 'about':
    case 'methodology':
      mainContentHtml = renderMethodologyView();
      break;
    default:
      mainContentHtml = renderVerifyClaimView();
  }

  app.innerHTML = `
    ${navbarHtml}
    <main id="main-view-container">
      ${mainContentHtml}
    </main>
    ${store.toast ? `
      <div class="toast-container">
        <div class="toast-message ${store.toast.type}">
          <span>${store.toast.type === 'success' ? '✓' : 'ℹ'}</span>
          <span>${store.toast.message}</span>
        </div>
      </div>
    ` : ''}
  `;

  // Render Interactive Provenance Graph if in result view
  if (store.currentView === 'result' && store.activeVerification) {
    setTimeout(() => {
      const graphContainer = document.getElementById('provenance-graph-container');
      if (graphContainer) {
        const graphData = ProvenanceGraphRenderer.buildGraphData(store.activeVerification);
        ProvenanceGraphRenderer.render(graphContainer, graphData, (node) => {
          showNodeDetailsInInspector(node);
        });
      }
    }, 40);
  }
}

// Initialize Application
initSimulator();
store.subscribe(render);
render();

// Auto-run Mullaperiyar preset in background on startup so Result view is immediately demo-ready
store.runVerification(PRESET_CLAIMS[0]).then(() => {
  store.setView('verify');
});
