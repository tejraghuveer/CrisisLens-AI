/**
 * CrisisLens AI — Minimalist Human Review View
 * Simple triage queue and clean adjudication modal
 */

import { store } from '../state/store.js';

export function renderHumanReviewView() {
  const queue = store.reviewQueue;
  const history = store.reviewHistory;

  return `
    <div class="review-page container-narrow animate-fade-in">
      <div class="review-header-simple mb-6">
        <div>
          <h2>Human Review Queue</h2>
          <p class="text-tertiary font-sm">
            Cases flagged for human oversight due to high controversy, low evidence, or critical severity.
          </p>
        </div>
        <span class="font-xs font-mono text-secondary">
          Pending: <strong>${queue.length}</strong>
        </span>
      </div>

      <!-- Simple Queue List -->
      <div class="queue-simple-section mb-8">
        <h3 class="font-sm font-semibold text-secondary mb-3">Needs Review</h3>

        ${queue.length === 0 ? `
          <div class="card p-6 text-center">
            <p class="text-tertiary font-sm">Queue all clear. No claims currently require human sign-off.</p>
          </div>
        ` : `
          <div class="queue-list-clean">
            ${queue.map(item => `
              <div class="queue-item-row card">
                <div class="queue-main-info">
                  <h4 class="font-sm font-medium text-primary mb-1">"${item.claimText}"</h4>
                  <div class="queue-meta-row font-xs text-tertiary">
                    <span>Reason: <strong class="text-secondary">${item.reason}</strong></span>
                    <span>•</span>
                    <span>Confidence: <strong>${item.confidence}%</strong></span>
                    <span>•</span>
                    <span>Priority: <strong>${item.severity}</strong></span>
                    <span>•</span>
                    <span>📍 ${item.location}</span>
                  </div>
                </div>

                <div class="queue-action-col">
                  <button class="btn btn-secondary btn-sm" onclick="window.__openAdjudicationModal('${item.id}', 'REVIEW')">
                    Review
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Clean Audit History Table -->
      ${history.length > 0 ? `
        <div class="history-clean-section mt-8">
          <h3 class="font-sm font-semibold text-secondary mb-3">Review History</h3>
          <div class="card overflow-hidden">
            <table class="simple-table font-xs">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Claim</th>
                  <th>Decision</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${history.map(h => `
                  <tr>
                    <td class="font-mono text-tertiary">${new Date(h.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>"${h.claimText.substring(0, 45)}..."</td>
                    <td><strong class="text-primary">${h.actionTaken}</strong></td>
                    <td class="text-secondary">${h.reviewerNotes || 'Reviewed'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <!-- Simple Adjudication Modal -->
      <div id="adjudication-modal" class="clean-modal-backdrop" style="display: none;">
        <div class="clean-modal card">
          <div class="modal-header-simple">
            <h4 id="modal-adjudication-title">Review Claim</h4>
            <button class="btn-close-sm" onclick="window.__closeAdjudicationModal()">×</button>
          </div>

          <div class="modal-body-simple font-xs">
            <div class="mb-3">
              <span class="text-tertiary block mb-1">Claim:</span>
              <p id="modal-claim-summary" class="font-sm text-primary font-medium"></p>
            </div>

            <div class="mb-4">
              <label class="text-tertiary block mb-1" for="modal-reviewer-notes">Reviewer notes / rationale:</label>
              <textarea 
                id="modal-reviewer-notes" 
                rows="2" 
                class="clean-textarea-sm" 
                placeholder="Optional notes for audit trail..."
              ></textarea>
            </div>

            <div class="adjudication-buttons-row">
              <button class="btn btn-primary btn-sm" onclick="window.__submitAdjudicationWithAction('CONFIRM')">
                Confirm Assessment
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.__submitAdjudicationWithAction('OVERRULE')">
                Overrule
              </button>
              <button class="btn btn-secondary btn-sm" onclick="window.__submitAdjudicationWithAction('REQUEST_EVIDENCE')">
                Request Evidence
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
