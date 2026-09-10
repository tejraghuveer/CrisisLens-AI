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
import { GeospatialPriorityEngine } from '../engine/geospatialPriorityEngine.js';
import { locationService } from '../services/locationService.js';

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

    // Location-Aware Prioritization State (Privacy: in-memory only)
    this.locationPriorityEnabled = false;
    this.priorityFilter = 'ALL'; // 'ALL', 'NEAR_ME', 'HIGH_PRIORITY', 'CRITICAL'
    this.toast = null; // { message, type, id }

    // Human Review Queue
    this.reviewQueue = [];
    this.reviewHistory = [];

    // Subscribers
    this.listeners = new Set();

    // Listen to location changes
    locationService.subscribe(() => {
      this.notify();
    });

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

  showToast(message, type = 'info') {
    this.toast = {
      id: Date.now(),
      message,
      type
    };
    this.notify();
    setTimeout(() => {
      if (this.toast && this.toast.id) {
        this.dismissToast();
      }
    }, 4000);
  }

  dismissToast() {
    this.toast = null;
    this.notify();
  }

  async toggleLocationPriority(enabled) {
    this.locationPriorityEnabled = Boolean(enabled);
    if (this.locationPriorityEnabled) {
      const userLoc = locationService.getUserLocation();
      if (!userLoc) {
        await locationService.requestBrowserLocation();
      }
      this.showToast('Priority updated using geographic proximity.', 'success');
    } else {
      this.showToast('Location-aware priority disabled. Showing general crisis priority.', 'info');
    }
    this.notify();
  }

  setDemoLocation(locationId) {
    const success = locationService.setDemoLocation(locationId);
    if (success) {
      this.locationPriorityEnabled = true;
      const loc = locationService.getUserLocation();
      this.showToast(`Active demo location set to ${loc.locationName}. Priority updated using proximity.`, 'success');
    }
    this.notify();
  }

  setPriorityFilter(filter) {
    this.priorityFilter = filter;
    this.notify();
  }

  getPrioritizedClaims() {
    const userLoc = this.locationPriorityEnabled ? locationService.getUserLocation() : null;

    const evaluated = this.claims.map(claim => {
      const priority = GeospatialPriorityEngine.evaluatePriority(claim, userLoc);
      return {
        ...claim,
        priority
      };
    });

    if (this.locationPriorityEnabled) {
      // Sort primarily by calculated priority score (highest first)
      evaluated.sort((a, b) => b.priority.priorityScore - a.priority.priorityScore);

      // Filtering (never hides distant high-severity claims when filter is ALL)
      if (this.priorityFilter === 'NEAR_ME') {
        return evaluated.filter(c => c.priority.distanceKm !== null && c.priority.distanceKm <= 100);
      } else if (this.priorityFilter === 'CRITICAL') {
        return evaluated.filter(c => c.priority.level === 'CRITICAL');
      } else if (this.priorityFilter === 'HIGH_PRIORITY') {
        return evaluated.filter(c => c.priority.level === 'CRITICAL' || c.priority.level === 'HIGH');
      }
    }

    return evaluated;
  }

  /**
   * Execute End-to-End Verification Pipeline
   * @param {Object} claimInput { text, category, location, timestamp, severity, latitude, longitude }
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

    // 4. Assess Confidence & Epistemic Uncertainty (TRUTH VERDICT: UNAFFECTED BY LOCATION)
    const assessment = ConfidenceEngine.assess(evaluation, claimInput);

    // 5. Source Diversity & Bias Audit
    const biasAudit = BiasCheckService.audit(evaluation.scoredItems, claimInput);

    // 6. Narrative Cluster Assignment
    const cluster = this.narrativeClusterer.assignCluster(claimInput);

    this.verificationStep = 5;
    this.notify();
    if (onProgress) onProgress(5, 'Synthesizing auditable provenance trail & location priority...');
    await new Promise(r => setTimeout(r, 300));

    const claimRecord = {
      id: claimInput.id || `claim-${Date.now()}`,
      text: claimInput.text,
      category: claimInput.category || 'Disaster Incident Alert',
      location: claimInput.location || claimInput.locationName || 'Reported Hazard Area',
      locationName: claimInput.locationName || claimInput.location || 'Reported Hazard Area',
      latitude: claimInput.latitude ?? null,
      longitude: claimInput.longitude ?? null,
      severity: claimInput.severity || 'HIGH',
      timestamp: claimInput.timestamp || new Date().toISOString(),
      status: assessment.status,
      confidence: assessment.confidenceScore,
      uncertainty: assessment.uncertainty,
      clusterId: cluster.id,
      verifiedAt: new Date().toISOString()
    };

    // 7. Calculate Geospatial Priority (Affects urgency/ranking only, NOT truth!)
    const userLoc = locationService.getUserLocation();
    const locationPriority = GeospatialPriorityEngine.evaluatePriority(claimRecord, userLoc);

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
      cluster,
      locationPriority
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
