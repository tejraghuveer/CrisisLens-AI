/**
 * CrisisLens AI — Dynamic Crisis Simulator View
 * Requirement 14: Dynamic Evolving Timeline & Primary Hackathon WOW Demo
 */

export function renderSimulationView(simState) {
  if (!simState) return '';

  const { scenario, currentStep, stepIndex, totalSteps, isPlaying, eventHistory } = simState;

  return `
    <div class="simulation-page container animate-fade-in">
      <div class="page-header-bar">
        <div>
          <div class="page-badge">
            <span class="simulation-pill"><span class="pulse-dot"></span> HERO HACKATHON DEMO</span>
            <span class="font-mono text-tertiary">Temporal Stream Simulation</span>
          </div>
          <h1>Dynamic Crisis Stream Simulation</h1>
          <p>
            Misinformation is not static. Observe how CrisisLens AI dynamically adapts its epistemic verdict 
            as unverified social chatter gives way to official sensor telemetry and operational clarity.
          </p>
        </div>

        <div class="simulation-controls glass-panel">
          <button class="btn btn-primary btn-sm" onclick="window.__toggleSimulationPlay()">
            ${isPlaying ? `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              Pause Stream
            ` : `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Play Dynamic Stream
            `}
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.__simPrevStep()" ${stepIndex === 0 ? 'disabled' : ''}>
            ⏮ Prev
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.__simNextStep()" ${stepIndex >= totalSteps - 1 ? 'disabled' : ''}>
            Next ⏭
          </button>
          <button class="btn btn-ghost btn-sm" onclick="window.__simReset()">
            ↺ Reset
          </button>
        </div>
      </div>

      <!-- Timeline Step Navigator Bar -->
      <div class="glass-panel timeline-stepper-bar">
        <div class="timeline-stepper-inner">
          ${scenario.steps.map((step, idx) => `
            <div class="stepper-step ${idx === stepIndex ? 'active' : ''} ${idx < stepIndex ? 'past' : ''}" 
                 onclick="window.__simJumpToStep(${idx})">
              <div class="step-time-badge font-mono font-xs">${step.timeLabel}</div>
              <div class="step-indicator-node">
                <span class="step-node-number">${idx + 1}</span>
              </div>
              <div class="step-headline-text">${step.headline}</div>
              <div class="status-badge-mini ${step.expectedStatus.replace(' ', '_')}">${step.expectedStatus}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Active Temporal State Display Card -->
      <div class="sim-state-card glass-panel status-border-${currentStep.expectedStatus.replace(' ', '_')}">
        <div class="sim-card-top">
          <div class="sim-time-col">
            <span class="font-mono text-cyan font-bold text-lg">${currentStep.timeLabel} IST</span>
            <span class="font-xs text-tertiary">Step ${stepIndex + 1} of ${totalSteps}</span>
          </div>

          <div class="sim-verdict-col">
            <span class="font-xs font-mono text-tertiary uppercase">CURRENT VERDICT POSTURE:</span>
            <span class="status-badge large ${currentStep.expectedStatus.replace(' ', '_')}">
              ${currentStep.expectedStatus}
            </span>
          </div>

          <div class="sim-metrics-col">
            <div class="sim-metric-cell">
              <span class="lbl font-mono font-xs">Confidence</span>
              <span class="val font-mono text-cyan font-bold">${currentStep.confidence}%</span>
            </div>
            <div class="sim-metric-cell">
              <span class="lbl font-mono font-xs">Uncertainty</span>
              <span class="val font-mono font-bold text-${currentStep.uncertainty === 'LOW' ? 'emerald' : currentStep.uncertainty === 'MODERATE' ? 'amber' : 'crimson'}">
                ${currentStep.uncertainty}
              </span>
            </div>
            <div class="sim-metric-cell">
              <span class="lbl font-mono font-xs">Sufficiency</span>
              <span class="val font-mono font-bold text-secondary">${currentStep.sufficiency}</span>
            </div>
            <div class="sim-metric-cell">
              <span class="lbl font-mono font-xs">Human Review</span>
              <span class="val font-mono font-bold text-${currentStep.humanReview === 'REQUIRED' ? 'crimson' : 'emerald'}">
                ${currentStep.humanReview}
              </span>
            </div>
          </div>
        </div>

        <div class="sim-narrative-summary">
          <h4>${currentStep.headline}</h4>
          <p class="incoming-claim-text font-mono font-xs text-accent">
            "${currentStep.incomingClaim}"
          </p>
        </div>

        <!-- Newly Ingested Evidence In This Step -->
        <div class="sim-incoming-evidence-box">
          <span class="font-xs font-mono font-bold text-tertiary uppercase tracking-wider">
            INCOMING EVIDENCE INGESTED IN THIS TIMEFRAME:
          </span>
          <div class="sim-evidence-cards-row">
            ${currentStep.incomingEvidence.map(ev => `
              <div class="glass-panel sim-ev-item border-stance-${ev.relation}">
                <div class="sim-ev-top font-mono font-xs">
                  <span class="source-tag">${ev.sourceId}</span>
                  <span class="stance-badge ${ev.relation}">${ev.relation}</span>
                  <span class="rel-tag">Rel: ${(ev.reliability * 100).toFixed(0)}%</span>
                </div>
                <blockquote class="sim-ev-text">"${ev.text}"</blockquote>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Rationale Box -->
        <div class="sim-rationale-box">
          <span class="font-xs font-mono font-bold text-cyan">SYSTEM REASONING & VERDICT SHIFT:</span>
          <p class="sim-rationale-text">${currentStep.rationale}</p>
        </div>
      </div>

      <!-- Dynamic Event History Audit Log -->
      <div class="glass-panel sim-history-card mt-6">
        <div class="panel-header-flex">
          <h4>State Transition Audit Log</h4>
          <span class="font-mono font-xs text-tertiary">${eventHistory.length} Recorded Transitions</span>
        </div>
        <div class="sim-history-items">
          ${eventHistory.length === 0 ? `
            <p class="text-tertiary font-xs font-mono">Run simulation or step through timeline to observe verdict mutations.</p>
          ` : `
            <ul class="sim-history-list">
              ${eventHistory.slice().reverse().map(evt => `
                <li class="sim-history-row font-mono font-xs">
                  <span class="time text-tertiary">${evt.timeLabel}</span>
                  <span class="shift">
                    <span class="status-badge ${evt.prevStatus ? evt.prevStatus.replace(' ', '_') : 'UNVERIFIED'}">${evt.prevStatus}</span>
                    <span class="arrow">➔</span>
                    <span class="status-badge ${evt.newStatus.replace(' ', '_')}">${evt.newStatus}</span>
                  </span>
                  <span class="headline text-secondary">${evt.headline}</span>
                </li>
              `).join('')}
            </ul>
          `}
        </div>
      </div>
    </div>
  `;
}
