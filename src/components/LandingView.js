/**
 * CrisisLens AI — Landing Page View
 * Professional emergency intelligence platform aesthetic
 */

export function renderLandingView() {
  return `
    <div class="landing-page animate-fade-in">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container hero-content">
          <div class="hero-badge">
            <span class="simulation-pill"><span class="pulse-dot"></span> ADVANCED HACKATHON • PROBLEM P14</span>
            <span class="hero-subpill">Medha Engineering Day</span>
          </div>

          <h1 class="hero-title">
            Crisis Misinformation Verification Hub: <br/>
            <span class="gradient-text">Evidence Before Amplification</span>
          </h1>

          <p class="hero-lead">
            During disasters, unchecked rumors trigger fatal panics, drain emergency dispatch, and clog evacuation routes. 
            CrisisLens AI moves beyond naive "True/False" black boxes by decomposing claims into verifiable assertions, 
            weighing multi-tier evidence against sensor telemetry, quantifying epistemic uncertainty, and preserving auditable provenance.
          </p>

          <div class="hero-cta-group">
            <button class="btn btn-primary btn-lg" onclick="window.__navigateTo('verify')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              Verify Crisis Claim
            </button>
            <button class="btn btn-secondary btn-lg" onclick="window.__navigateTo('simulation')">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Launch Live Simulation
            </button>
            <button class="btn btn-ghost" onclick="window.__navigateTo('dashboard')">
              Command Center →
            </button>
          </div>

          <!-- Hero Metrics Bar -->
          <div class="hero-metrics-bar glass-panel">
            <div class="metric-item">
              <span class="metric-val text-cyan">5-Tier</span>
              <span class="metric-lbl">Defensible Status Architecture</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-item">
              <span class="metric-val text-emerald">100%</span>
              <span class="metric-lbl">Auditable Provenance DAG</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-item">
              <span class="metric-val text-amber">Epistemic</span>
              <span class="metric-lbl">Uncertainty vs. Truth Model</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-item">
              <span class="metric-val text-indigo">Human-in-Loop</span>
              <span class="metric-lbl">Autonomous Triage Escalation</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Danger of Crisis Misinformation -->
      <section class="section-crisis-hazard">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">THE CRITICAL PROBLEM</span>
            <h2>Why Crisis Misinformation Is Deadly</h2>
            <p>In the first 90 minutes of a flash flood or cyclone, communication bandwidth is constrained and panic spreads virally.</p>
          </div>

          <div class="grid-three">
            <div class="glass-panel hazard-card">
              <div class="hazard-icon bg-red-glow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <h3>Resource Exhaustion & False Rescues</h3>
              <p>Viral fabricated rumors divert rescue boats, helicopters, and NDRF teams to phantom disaster spots, leaving actual victims stranded.</p>
            </div>

            <div class="glass-panel hazard-card">
              <div class="hazard-icon bg-amber-glow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h3>Premature or Dangerous Mass Evacuation</h3>
              <p>Uncorroborated "dam breach" warnings push thousands onto flooded highways in midnight panics, creating secondary stampedes and vehicular entrapment.</p>
            </div>

            <div class="glass-panel hazard-card">
              <div class="hazard-icon bg-cyan-glow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
              </div>
              <h3>Erosion of Public Trust in Official Bulletins</h3>
              <p>Conflicting unverified reports cause civil cynicism. When official emergency sirens sound, citizens hesitate, questioning authenticity.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How Verification Works -->
      <section class="section-pipeline-flow">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">EXPLAINABLE PIPELINE</span>
            <h2>How CrisisLens AI Evaluates Emergency Claims</h2>
            <p>A deterministic, multi-stage assessment pipeline designed for explainability, transparency, and high scrutiny.</p>
          </div>

          <div class="pipeline-flow-grid">
            <div class="step-box">
              <div class="step-num">01</div>
              <h4>Claim Ingestion</h4>
              <p>Claim received with spatio-temporal metadata, location tags, and urgency severity.</p>
            </div>
            <div class="step-connector">→</div>

            <div class="step-box">
              <div class="step-num">02</div>
              <h4>Assertion Extraction</h4>
              <p>Splits composite text into independent factual assertions (e.g. Entity, Incident, Action).</p>
            </div>
            <div class="step-connector">→</div>

            <div class="step-box">
              <div class="step-num">03</div>
              <h4>Multi-Tier Retrieval</h4>
              <p>Cross-references official agencies, accredited news desks, and verified telemetry logs.</p>
            </div>
            <div class="step-connector">→</div>

            <div class="step-box">
              <div class="step-num">04</div>
              <h4>Weighted Scoring</h4>
              <p>Computes evidence score: Reliability × Relevance × Freshness × Directness.</p>
            </div>
            <div class="step-connector">→</div>

            <div class="step-box">
              <div class="step-num">05</div>
              <h4>Confidence & Triage</h4>
              <p>Calculates controversy index, evaluates uncertainty, and escalates to human review when needed.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Target Users -->
      <section class="section-users">
        <div class="container">
          <div class="section-header">
            <span class="section-tag">STAKEHOLDERS & IMPACT</span>
            <h2>Built For Disaster Operations Stakeholders</h2>
          </div>

          <div class="grid-four">
            <div class="glass-panel user-badge-card">
              <span class="user-role-tag">NDMA / DEOC</span>
              <h4>Disaster Management Authorities</h4>
              <p>Rapidly debunk panic-inducing claims with verifiable telemetry and publish authoritative counter-bulletins.</p>
            </div>

            <div class="glass-panel user-badge-card">
              <span class="user-role-tag">News Desks</span>
              <h4>Accredited Emergency Journalists</h4>
              <p>Verify viral social clips and voice notes before broadcasting or amplifiying unverified reports.</p>
            </div>

            <div class="glass-panel user-badge-card">
              <span class="user-role-tag">NGOs & Field Ops</span>
              <h4>First Responders & Red Cross</h4>
              <p>Prioritize relief supply chains based on corroborated road and bridge structural assessments.</p>
            </div>

            <div class="glass-panel user-badge-card">
              <span class="user-role-tag">Local Communities</span>
              <h4>Civil Defense Volunteers</h4>
              <p>Consult a non-partisan evidence dashboard to confirm official evacuation alerts before fleeing.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Footer Banner -->
      <section class="landing-cta-banner">
        <div class="container">
          <div class="cta-card glass-panel">
            <div class="cta-text">
              <h3>Ready to inspect a crisis scenario?</h3>
              <p>Select from realistic synthetic crisis scenarios or enter custom emergency claim text to test the complete verification pipeline.</p>
            </div>
            <div class="cta-actions">
              <button class="btn btn-primary btn-lg" onclick="window.__navigateTo('verify')">
                Launch Claim Verification
              </button>
              <button class="btn btn-secondary btn-lg" onclick="window.__navigateTo('simulation')">
                Watch Dynamic Dam Simulation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}
