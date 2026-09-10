/**
 * CrisisLens AI — Central Application State & Store
 */

import { PRESET_CLAIMS, SYNTHETIC_SOURCES } from '../data/crisisDataset.js';
import { ClaimDecomposer } from '../engine/claimDecomposer.js';
import { MockSourceProvider } from '../engine/sourceProvider.js';
import { EvidenceScorer } from '../engine/evidenceScorer.js';
import { ConfidenceEngine } from '../engine/confidenceEngine.js';
import { BiasCheckService } from '../engine/biasCheck.js';
import { NarrativeClusterer } from '../engine/narrativeClusterer.js';

class StateStore {
  constructor() {
    this.currentView = 'landing'; // landing, verify, result, dashboard, clusters, review, simulation, methodology
    this.sourceProvider = new MockSourceProvider(450);
    this.narrativeClusterer = new NarrativeClusterer();
    
    this.claims = [...PRESET_CLAIMS];
    this.activeVerification = null;
    this.selectedGraphNode = null;
    this.isVerifying = false;
    this.verificationStep = 0; // 0..5 pipeline progress

    // Human Review Queue
    this.reviewQueue = [];
    this.reviewHistory = [];

    // Subscribers
    this.listeners = new Set();

    // Bootstrap initial claims into review queue if high severity
    this.bootstrapState();
  }

  bootstrapState() {
    // Populate an initial review queue item for demo
    this.reviewQueue = [
      {
        id: 'rev-01',
        claimId: 'claim-preset-01',
        claimText: 'Mullaperiyar Dam has developed a massive breach at Spillway 3 and downstream residents must evacuate immediately.',
        category: 'Flood & Dam Operations',
        location: 'Idukki, Kerala',
        severity: 'CRITICAL',
        status: 'CONTRADICTED',
        confidence: 88,
        uncertainty: 'LOW',
        reason: 'High-severity dam safety alert flagged for mandatory verification sign-off.',
        addedAt: '2026-09-10T09:25:00Z',
        assignedTo: 'Lead Emergency Officer (Desk 4)'
      },
      {
        id: 'rev-02',
        claimId: 'claim-preset-04',
        claimText: 'Drinking water reservoir in Zone 4 is contaminated with chemical runoff following flash floods; do not consume tap water.',
        category: 'Civil & Public Safety Alert',
        location: 'Zone 4, Pune Cantonment',
        severity: 'HIGH',
        status: 'UNVERIFIED',
        confidence: 42,
        uncertainty: 'HIGH',
        reason: 'Controversy detected; no local water board or public health laboratory test result filed.',
        addedAt: '2026-09-10T09:30:00Z',
        assignedTo: 'Health & Sanitation Inspector'
      }
    ];
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  setView(viewName) {
    this.currentView = viewName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notify();
  }

  /**
   * Execute End-to-End Verification Pipeline
   * @param {Object} claimInput { text, category, location, timestamp, severity }
   * @param {Function} onProgress
   */
  async runVerification(claimInput, onProgress = null) {
    this.isVerifying = true;
    this.verificationStep = 1;
    this.notify();

    if (onProgress) onProgress(1, 'Decomposing claim into factual assertions...');
    await new Promise(r => setTimeout(r, 400));

    // 1. Decompose
    const decomposition = ClaimDecomposer.decompose(
      claimInput.text,
      claimInput.category,
      claimInput.location
    );

    this.verificationStep = 2;
    this.notify();
    if (onProgress) onProgress(2, 'Querying multi-tier source registries (Official, News, Social)...');

    // 2. Retrieve Evidence
    const rawEvidence = await this.sourceProvider.retrieveEvidence(claimInput, decomposition.assertions);

    this.verificationStep = 3;
    this.notify();
    if (onProgress) onProgress(3, 'Extracting excerpts and evaluating evidence weight factors...');
    await new Promise(r => setTimeout(r, 350));

    // 3. Score Evidence
    const evaluation = EvidenceScorer.evaluateEvidenceSet(rawEvidence);

    this.verificationStep = 4;
    this.notify();
    if (onProgress) onProgress(4, 'Calculating epistemic confidence and controversy index...');
    await new Promise(r => setTimeout(r, 350));

    // 4. Assess Confidence & Epistemic Uncertainty
    const assessment = ConfidenceEngine.assess(evaluation, claimInput);

    // 5. Source Diversity & Bias Audit
    const biasAudit = BiasCheckService.audit(evaluation.scoredItems, claimInput);

    // 6. Narrative Cluster Assignment
    const cluster = this.narrativeClusterer.assignCluster(claimInput);

    this.verificationStep = 5;
    this.notify();
    if (onProgress) onProgress(5, 'Synthesizing auditable provenance trail...');
    await new Promise(r => setTimeout(r, 300));

    const claimRecord = {
      id: claimInput.id || `claim-${Date.now()}`,
      text: claimInput.text,
      category: claimInput.category || 'Disaster Incident Alert',
      location: claimInput.location || 'Reported Hazard Area',
      severity: claimInput.severity || 'HIGH',
      timestamp: claimInput.timestamp || new Date().toISOString(),
      status: assessment.status,
      confidence: assessment.confidenceScore,
      uncertainty: assessment.uncertainty,
      clusterId: cluster.id,
      verifiedAt: new Date().toISOString()
    };

    // Add to claims repository if new
    if (!this.claims.some(c => c.text.toLowerCase() === claimRecord.text.toLowerCase())) {
      this.claims.unshift(claimRecord);
    }

    // Auto-triage to Human Review if needed
    if (assessment.humanReview === 'REQUIRED') {
      const existingQueueItem = this.reviewQueue.find(q => q.claimText === claimRecord.text);
      if (!existingQueueItem) {
        this.reviewQueue.unshift({
          id: `rev-${Date.now()}`,
          claimId: claimRecord.id,
          claimText: claimRecord.text,
          category: claimRecord.category,
          location: claimRecord.location,
          severity: claimRecord.severity,
          status: assessment.status,
          confidence: assessment.confidenceScore,
          uncertainty: assessment.uncertainty,
          reason: assessment.reviewReasons.join('; '),
          addedAt: new Date().toISOString(),
          assignedTo: 'Triage Queue Operator'
        });
      }
    }

    this.activeVerification = {
      claim: claimRecord,
      decomposition,
      evaluation,
      assessment,
      biasAudit,
      cluster
    };

    this.isVerifying = false;
    this.verificationStep = 0;
    this.setView('result');
    return this.activeVerification;
  }

  // Human Review Actions
  resolveReview(reviewId, action, notes) {
    const queueIndex = this.reviewQueue.findIndex(q => q.id === reviewId);
    if (queueIndex === -1) return;

    const item = this.reviewQueue[queueIndex];
    this.reviewQueue.splice(queueIndex, 1);

    this.reviewHistory.unshift({
      id: `rev-hist-${Date.now()}`,
      claimId: item.claimId,
      claimText: item.claimText,
      previousStatus: item.status,
      actionTaken: action, // 'CONFIRM', 'OVERRULE_CONTRADICTED', 'OVERRULE_SUPPORTED', 'REQUEST_EVIDENCE', 'UNRESOLVED'
      reviewerNotes: notes,
      resolvedAt: new Date().toISOString(),
      reviewer: 'Emergency Verification Specialist'
    });

    this.notify();
  }
}

export const store = new StateStore();
