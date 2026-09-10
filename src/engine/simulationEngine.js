/**
 * CrisisLens AI — Dynamic Crisis Simulator Engine
 * 
 * Hackathon Primary Demo Driver:
 * Simulates an evolving crisis timeline where evidence lands sequentially,
 * dynamically shifting the assessment from:
 * UNVERIFIED ➔ POLARIZED CONTROVERSY ➔ CONTRADICTED ➔ PARTIALLY SUPPORTED (OPERATIONAL CONTEXT)
 */

import { SIMULATION_SCENARIOS } from '../data/crisisDataset.js';

export class CrisisSimulator {
  constructor(scenarioId = 'sim-dam-evolution', onStateChange = null) {
    this.scenario = SIMULATION_SCENARIOS.find(s => s.id === scenarioId) || SIMULATION_SCENARIOS[0];
    this.currentStepIndex = 0;
    this.isPlaying = false;
    this.timer = null;
    this.playbackIntervalMs = 4000;
    this.onStateChange = onStateChange;
    this.eventHistory = [];
  }

  getCurrentStep() {
    return this.scenario.steps[this.currentStepIndex];
  }

  getTotalSteps() {
    return this.scenario.steps.length;
  }

  jumpToStep(index) {
    if (index >= 0 && index < this.scenario.steps.length) {
      const prevStep = this.scenario.steps[this.currentStepIndex];
      this.currentStepIndex = index;
      const currentStep = this.scenario.steps[this.currentStepIndex];
      
      this.eventHistory.push({
        timestamp: new Date().toISOString(),
        timeLabel: currentStep.timeLabel,
        prevStatus: prevStep.expectedStatus,
        newStatus: currentStep.expectedStatus,
        headline: currentStep.headline
      });

      if (this.onStateChange) {
        this.onStateChange({
          scenario: this.scenario,
          currentStep,
          stepIndex: this.currentStepIndex,
          totalSteps: this.scenario.steps.length,
          isPlaying: this.isPlaying,
          eventHistory: this.eventHistory
        });
      }
    }
  }

  nextStep() {
    if (this.currentStepIndex < this.scenario.steps.length - 1) {
      this.jumpToStep(this.currentStepIndex + 1);
    } else {
      this.pause();
    }
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.jumpToStep(this.currentStepIndex - 1);
    }
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    if (this.currentStepIndex >= this.scenario.steps.length - 1) {
      this.currentStepIndex = 0;
    }

    this.timer = setInterval(() => {
      if (this.currentStepIndex < this.scenario.steps.length - 1) {
        this.nextStep();
      } else {
        this.pause();
      }
    }, this.playbackIntervalMs);

    this.notify();
  }

  pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.notify();
  }

  reset() {
    this.pause();
    this.currentStepIndex = 0;
    this.eventHistory = [];
    this.jumpToStep(0);
  }

  injectCustomEvidence(evidenceItem) {
    const currentStep = this.getCurrentStep();
    currentStep.incomingEvidence.push(evidenceItem);
    this.notify();
  }

  notify() {
    if (this.onStateChange) {
      this.onStateChange({
        scenario: this.scenario,
        currentStep: this.getCurrentStep(),
        stepIndex: this.currentStepIndex,
        totalSteps: this.scenario.steps.length,
        isPlaying: this.isPlaying,
        eventHistory: this.eventHistory
      });
    }
  }
}
