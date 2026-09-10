/**
 * CrisisLens AI — Minimalist Crisis Simulation View
 * Changing assessment is the primary visual focus
 */

export function renderSimulationView(simState) {
  if (!simState) return '';

  const { scenario, currentStep, stepIndex, totalSteps, isPlaying } = simState;

  return `
    <div class="simulation-page container-narrow animate-fade-in">
      <div class="sim-header-clean text-center mb-6">
        <span class="font-xs font-mono text-tertiary uppercase">CRISIS SIMULATION</span>
        <h2>${scenario.title || 'Dam Breach Scenario'}</h2>
        <p class="font-sm text-secondary">
          Watch CrisisLens dynamically update as new evidence arrives.
        </p>
      </div>

      <!-- Main Step Focus Card -->
      <div class="sim-focus-card card text-center mb-6">
        <div class="sim-time-tag font-mono font-xs text-secondary mb-2">
          ${currentStep.timeLabel} IST • Step ${stepIndex + 1} of ${totalSteps}
        </div>

        <div class="sim-verdict-large mb-3">
          <span class="status-badge ${currentStep.expectedStatus.replace(' ', '_')} large">
            ${currentStep.expectedStatus}
          </span>
        </div>

        <div class="sim-metrics-compact font-xs font-mono text-tertiary mb-4">
          <span>Confidence: <strong class="text-primary">${currentStep.confidence}%</strong></span>
          <span class="text-muted">•</span>
          <span>Uncertainty: <strong class="text-primary">${currentStep.uncertainty}</strong></span>
          <span class="text-muted">•</span>
          <span>Review: <strong class="text-primary">${currentStep.humanReview}</strong></span>
        </div>

        <h3 class="sim-headline font-medium text-primary mb-2">
          ${currentStep.headline}
        </h3>

        <p class="sim-rationale-clean font-sm text-secondary mb-4">
          "${currentStep.rationale}"
        </p>

        <!-- Current Incoming Evidence Excerpt -->
        <div class="sim-evidence-simple font-xs card p-3 text-left">
          <span class="text-tertiary block font-mono mb-1">Incoming Evidence (${currentStep.incomingEvidence[0]?.sourceId}):</span>
          <p class="text-primary">"${currentStep.incomingEvidence[0]?.text}"</p>
        </div>
      </div>

      <!-- Clean Minimal Step Bar: 10:00 -> 10:10 -> 10:20 -> 10:30 -->
      <div class="sim-timeline-clean mb-6">
        ${scenario.steps.map((step, idx) => `
          <button 
            type="button" 
            class="timeline-pill ${idx === stepIndex ? 'active' : ''} ${idx < stepIndex ? 'past' : ''}" 
            onclick="window.__simJumpToStep(${idx})"
          >
            <span class="time font-mono">${step.timeLabel}</span>
            <span class="status-dot dot-${step.expectedStatus.replace(' ', '_')}"></span>
            <span class="name font-xs">${step.expectedStatus}</span>
          </button>
        `).join('')}
      </div>

      <!-- Minimal Controls -->
      <div class="sim-controls-simple flex-center justify-center gap-2 mb-8">
        <button class="btn btn-secondary btn-sm" onclick="window.__simPrevStep()" ${stepIndex === 0 ? 'disabled' : ''}>
          Previous
        </button>
        <button class="btn btn-primary btn-sm" onclick="window.__toggleSimulationPlay()">
          ${isPlaying ? 'Pause' : 'Play'}
        </button>
        <button class="btn btn-secondary btn-sm" onclick="window.__simNextStep()" ${stepIndex >= totalSteps - 1 ? 'disabled' : ''}>
          Next
        </button>
        <button class="btn btn-ghost btn-sm" onclick="window.__simReset()">
          Reset
        </button>
      </div>
    </div>
  `;
}
