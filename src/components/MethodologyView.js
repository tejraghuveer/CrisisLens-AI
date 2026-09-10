/**
 * CrisisLens AI — Methodology, Ethics & Technical Defense View
 */

export function renderMethodologyView() {
  return `
    <div class="methodology-page container animate-fade-in">
      <div class="page-header-bar">
        <div>
          <div class="page-badge">
            <span class="simulation-pill"><span class="pulse-dot"></span> TECHNICAL DEFENSE & SPECS</span>
            <span class="font-mono text-tertiary">Epistemic Principles</span>
          </div>
          <h1>System Architecture & Verification Methodology</h1>
          <p>
            CrisisLens AI rejects black-box truth scoring. Every assessment is grounded in transparent mathematical weighting, 
            epistemic uncertainty quantification, and human-in-the-loop accountability.
          </p>
        </div>
      </div>

      <!-- Core Formula Cards Grid -->
      <div class="methodology-grid">
        <!-- Evidence Weighting Formula -->
        <div class="glass-panel method-card">
          <div class="method-card-header">
            <span class="method-tag font-mono font-xs text-cyan">MATHEMATICAL FORMULATION</span>
            <h3>1. Transparent Evidence Weighting</h3>
          </div>
          <p>
            Rather than relying on uninterpretable neural logits, each individual evidence snippet $i$ receives a deterministic score based on four verifiable dimensions:
          </p>
          <div class="code-box-formula font-mono">
            W_i = Source_Reliability × Relevance × Freshness × Directness
          </div>
          <ul class="method-list font-xs">
            <li><strong>Source Reliability ($R_s \in [0.1, 0.99]$):</strong> Calibrated by institutional accountability tier (Official Agency: 0.95+, Accredited Wire: 0.85+, Unverified Social: &lt;0.45).</li>
            <li><strong>Relevance ($Rel \in [0, 1]$):</strong> Semantic cosine alignment between the assertion target and the excerpt context.</li>
            <li><strong>Freshness ($F \in [0, 1]$):</strong> Exponential half-life decay based on time elapsed since publication.</li>
            <li><strong>Directness ($D \in [0, 1]$):</strong> Measures whether the source provides primary sensor telemetry vs hearsay/amplification.</li>
          </ul>
        </div>

        <!-- Epistemic Uncertainty Model -->
        <div class="glass-panel method-card">
          <div class="method-card-header">
            <span class="method-tag font-mono font-xs text-amber">EPISTEMIC UNCERTAINTY</span>
            <h3>2. Confidence vs. Truth Probability</h3>
          </div>
          <p>
            A common failure of commercial "AI checkers" is confusing epistemic certainty with truth value.
          </p>
          <div class="code-box-formula font-mono">
            Controversy Index = 2 × min(Mass_Support, Mass_Contradict) / Total_Active_Mass
          </div>
          <ul class="method-list font-xs">
            <li><strong>High Confidence + Contradicted:</strong> "We are 94% certain that this claim is factually false based on CWC sensor logs."</li>
            <li><strong>Low Confidence + Unverified:</strong> "Only single-source social chatter exists; we lack sufficient data to make any claim."</li>
            <li><strong>High Controversy:</strong> Triggers mandatory escalation to the Human Review Queue.</li>
          </ul>
        </div>

        <!-- 5 Defensible Statuses -->
        <div class="glass-panel method-card">
          <div class="method-card-header">
            <span class="method-tag font-mono font-xs text-emerald">STATUS ONTOLOGY</span>
            <h3>3. Five Defensible Assessment States</h3>
          </div>
          <div class="status-def-list font-xs">
            <div class="status-def-item">
              <span class="status-badge SUPPORTED">SUPPORTED</span>
              <span>Multiple independent authoritative sources confirm the factual assertions.</span>
            </div>
            <div class="status-def-item">
              <span class="status-badge PARTIALLY_SUPPORTED">PARTIALLY SUPPORTED</span>
              <span>Underlying crisis conditions verified, but details (e.g. breach or evacuation order) are exaggerated or unconfirmed.</span>
            </div>
            <div class="status-def-item">
              <span class="status-badge CONTRADICTED">CONTRADICTED</span>
              <span>Authoritative physical sensor logs or official agency records definitively disprove the claim.</span>
            </div>
            <div class="status-def-item">
              <span class="status-badge UNVERIFIED">UNVERIFIED</span>
              <span>Claim is actively circulating, but independent corroboration is currently pending.</span>
            </div>
            <div class="status-def-item">
              <span class="status-badge INSUFFICIENT_EVIDENCE">INSUFFICIENT EVIDENCE</span>
              <span>Zero credible telemetry or dispatch entries exist; epistemic confidence is insufficient for verdict.</span>
            </div>
          </div>
        </div>

        <!-- Privacy & Safety Protocol -->
        <div class="glass-panel method-card">
          <div class="method-card-header">
            <span class="method-tag font-mono font-xs text-crimson">ETHICS & PRIVACY</span>
            <h3>4. Privacy, Safety & Air-Gapped Demo</h3>
          </div>
          <p>
            In compliance with hackathon guidelines, CrisisLens AI implements strict safety guardrails:
          </p>
          <ul class="method-list font-xs">
            <li><strong>Zero Real PII:</strong> No real-world citizen phone numbers, private home coordinates, or medical identities are captured.</li>
            <li><strong>Synthetic Telemetry:</strong> All crisis incidents utilize safe synthetic datasets based on public disaster blueprints.</li>
            <li><strong>Explicit Tagging:</strong> Every view clearly states <code>SIMULATION DATA</code> to prevent accidental public misinformation.</li>
            <li><strong>No Autonomous Action:</strong> Evacuation directives can only be issued by human authorities, never by AI alone.</li>
          </ul>
        </div>
      </div>

      <!-- FAQ & Judging Defense -->
      <section class="faq-section mt-8">
        <div class="section-title-row">
          <h3>Judge & Evaluator Technical Defense FAQ</h3>
          <span class="font-mono font-xs text-tertiary">Direct Responses to Judging Criteria</span>
        </div>

        <div class="faq-accordion glass-panel">
          <div class="faq-item">
            <h4 class="faq-q">Q1: How does CrisisLens prevent LLM hallucinations during life-or-death emergencies?</h4>
            <p class="faq-a">
              CrisisLens decouples text decomposition from evidence evaluation. The final status and confidence score are 
              computed via deterministic mathematical equations based on retrieved sensor records and source reliability ratings. 
              The AI never synthesizes unsupported facts or unverified citations out of thin air.
            </p>
          </div>

          <div class="faq-item">
            <h4 class="faq-q">Q2: How does the system handle rapid contradictions when disaster reports break?</h4>
            <p class="faq-a">
              As demonstrated in our Live Crisis Simulation, assessments are temporal streams rather than static classifications. 
              When an official sensor report arrives, the Controversy Index surges, triggering human review and updating the net balance 
              from UNVERIFIED to CONTRADICTED in real-time.
            </p>
          </div>

          <div class="faq-item">
            <h4 class="faq-q">Q3: Why not just use a standard True/False LLM prompt?</h4>
            <p class="faq-a">
              Binary labels are catastrophic during crises. A claim like "Dam water is gushing; evacuate immediately" often contains 
              a factual grain of truth (water is indeed being released via spillways) combined with a false panic assertion (the dam has not breached). 
              A binary label either creates panic or dismisses real riverbank precautions. Decomposition into assertions resolves this.
            </p>
          </div>

          <div class="faq-item">
            <h4 class="faq-q">Q4: How does CrisisLens scale to live production?</h4>
            <p class="faq-a">
              The <code>SourceProvider</code> layer is strictly abstracted. The mock layer can be swapped with live GDACS (Global Disaster Alert and Coordination System), 
              NDMA CAP feeds (Common Alerting Protocol), and official Twitter API firehoses with zero changes to the core scoring or provenance DAG engines.
            </p>
          </div>
        </div>
      </section>
    </div>
  `;
}
