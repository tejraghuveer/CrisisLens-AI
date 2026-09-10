/**
 * CrisisLens AI — Human Review Queue & Adjudication Workspace
 * Requirement 13: Human-in-the-Loop Oversight & Audit Trail
 */

import { store } from '../state/store.js';

export function renderHumanReviewView() {
  const queue = store.reviewQueue;
  const history = store.reviewHistory;

  return `
    <div class="review-page container animate-fade-in">
      <div class="page-header-bar">
        <div>
          <div class="page-badge">
            <span class="simulation-pill"><span class="pulse-dot"></span> HUMAN-IN-THE-LOOP (HITL) GATEWAY</span>
            <span class="font-mono text-tertiary">Operational Safety & Accountability</span>
          </div>
          <h1>Human Review & Adjudication Queue</h1>
          <p>
            AI is decision support, NOT an unquestionable authority. High-severity claims, high source conflicts, 
            and low-confidence edge cases are routed here for mandatory human operator sign-off before downstream dissemination.
          </p>
        </div>

        <div class="queue-counter-badge font-mono">
          <span class="pulse-dot"></span>
          Pending Adjudication: ${queue.length}
        </div>
      </div>

      <!-- Pending Queue Section -->
      <section class="queue-section">
        <div class="section-title-row">
          <h3>Active Triage Queue (${queue.length} Pending Actions)</h3>
          <span class="font-mono font-xs text-tertiary">Queue SLA: Priority 1 (&lt; 5 mins)</span>
        </div>

        ${queue.length === 0 ? `
          <div class="glass-panel empty-queue-card text-center py-8">
            <div class="empty-icon text-emerald">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h4>Queue All Clear</h4>
            <p class="text-tertiary">No crisis claims currently exceed the automated uncertainty or controversy threshold.</p>
          </div>
        ` : `
          <div class="queue-items-list">
            ${queue.map(item => `
              <div class="glass-panel review-card">
                <div class="review-card-header">
                  <div class="review-meta-left">
                    <span class="status-badge ${item.status ? item.status.replace(' ', '_') : 'UNVERIFIED'}">
                      AI: ${item.status}
                    </span>
                    <span class="badge-sev ${item.severity}">${item.severity}</span>
                    <span class="font-mono font-xs text-tertiary">📍 ${item.location}</span>
                  </div>
                  <div class="review-meta-right font-mono font-xs text-cyan">
                    Confidence: ${item.confidence}% • Uncertainty: ${item.uncertainty}
                  </div>
                </div>

                <h3 class="review-claim-text">"${item.claimText}"</h3>

                <div class="triage-trigger-alert">
                  <span class="trigger-label font-mono font-xs font-bold text-amber">TRIGGER REASON:</span>
                  <span class="trigger-text">${item.reason}</span>
                </div>

                <!-- Adjudication Action Toolbar -->
                <div class="adjudication-actions-box">
                  <span class="action-caption font-mono font-xs text-tertiary">OPERATOR ADJUDICATION:</span>
                  <div class="action-buttons-group">
                    <button class="btn btn-primary btn-sm" onclick="window.__openAdjudicationModal('${item.id}', 'CONFIRM')">
                      ✓ Confirm AI Assessment
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="window.__openAdjudicationModal('${item.id}', 'REQUEST_EVIDENCE')">
                      🔍 Request Sensor Logs
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="window.__openAdjudicationModal('${item.id}', 'OVERRULE')">
                      ✕ Overrule / Refute
                    </button>
                    <button class="btn btn-ghost btn-sm" onclick="window.__openAdjudicationModal('${item.id}', 'MARK_UNRESOLVED')">
                      ⏱ Mark Unresolved
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </section>

      <!-- Completed Audit Log History -->
      <section class="audit-history-section mt-8">
        <div class="section-title-row">
          <h3>Forensic Adjudication Audit Log (${history.length} Records)</h3>
          <span class="font-mono font-xs text-tertiary">Immutable Operational Record</span>
        </div>

        ${history.length === 0 ? `
          <div class="glass-panel p-6 text-center text-tertiary font-mono font-xs">
            No historical human adjudications logged in this session yet.
          </div>
        ` : `
          <div class="audit-table-wrapper glass-panel">
            <table class="audit-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Claim Statement</th>
                  <th>Prior AI Status</th>
                  <th>Human Decision</th>
                  <th>Reviewer Notes</th>
                  <th>Adjudicator</th>
                </tr>
              </thead>
              <tbody>
                ${history.map(record => `
                  <tr>
                    <td class="font-mono font-xs text-tertiary">${new Date(record.resolvedAt).toLocaleTimeString()}</td>
                    <td class="claim-snippet font-xs">"${record.claimText.substring(0, 50)}..."</td>
                    <td><span class="status-badge ${record.previousStatus.replace(' ', '_')}">${record.previousStatus}</span></td>
                    <td><span class="font-mono font-bold text-cyan">${record.actionTaken}</span></td>
                    <td class="font-xs text-secondary">${record.reviewerNotes || 'Standard operating clearance'}</td>
                    <td class="font-mono font-xs text-tertiary">${record.reviewer}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </section>

      <!-- Adjudication Modal Container -->
      <div id="adjudication-modal" class="modal-backdrop" style="display: none;">
        <div class="modal-dialog glass-panel">
          <div class="modal-header">
            <h4 id="modal-adjudication-title">Human Adjudication Sign-Off</h4>
            <button class="btn-close" onclick="window.__closeAdjudicationModal()">×</button>
          </div>
          <div class="modal-body">
            <p id="modal-claim-summary" class="font-mono font-xs text-tertiary"></p>
            <div class="form-group mt-4">
              <label class="form-label">Reviewer Operational Justification / Notes</label>
              <textarea id="modal-reviewer-notes" rows="3" class="form-textarea" placeholder="Explain basis for this manual adjudication decision (e.g. Cross-verified with DEOC radar logs at 09:32 IST)..."></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="window.__closeAdjudicationModal()">Cancel</button>
            <button class="btn btn-primary" id="btn-submit-adjudication" onclick="window.__submitAdjudication()">
              Submit & Commit Audit Record
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
