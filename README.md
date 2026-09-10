# CrisisLens AI — Crisis Misinformation Verification Hub
> **"Evidence Before Amplification."**  
> *Developed for MEDHA Engineering Day — Advanced Hackathon (Selected Problem Statement: P14)*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Status](https://img.shields.io/badge/status-Demo--Ready-blue)](#)
[![Hackathon](https://img.shields.io/badge/Hackathon-Medha%20Day%20P14-orange)](#)
[![License](https://img.shields.io/badge/license-MIT-green)](#)

---

## 1. Problem Understanding
During natural disasters and civil emergencies (flash floods, cyclones, tremors, structural collapses), communication bandwidth collapses while panic virally amplifies. Traditional "AI fact checkers" fail during crises because:
1. **Binary True/False Fallacy:** Emergencies are nuanced. A claim stating *"Dam wall breached; flee now"* often contains a grain of truth (emergency gates opened for regulated release) combined with a false panic assertion (the dam has not breached). Labeling it simply "FALSE" dismisses legitimate riverbank alerts; labeling it "TRUE" causes stampedes.
2. **Black-Box Logits & Hallucinations:** Generative LLMs hallucinate non-existent sensor readings and official quotes when ungrounded.
3. **Static Classifications:** Disaster intelligence is a rapid temporal stream; what is unverified at 10:00 AM may be officially disproven by 10:20 AM and operationally clarified by 10:30 AM.

**CrisisLens AI** solves this by decomposing claims into verifiable assertions, retrieving weighted multi-tier evidence against sensor telemetry, quantifying epistemic uncertainty, rendering an auditable provenance DAG, clustering viral narratives, and enforcing human oversight.

---

## 2. Core Epistemic Principles & Status Ontology

CrisisLens AI rejects unsupported boolean certainty. Every assessment produces one of **five defensible statuses**:

| Status | Epistemic Meaning |
| :--- | :--- |
| **SUPPORTED** | Multiple independent authoritative sources corroborate primary factual assertions. |
| **PARTIALLY SUPPORTED** | Underlying hazard conditions verified, but specific operational assertions (e.g. breach, evacuation directive) show discrepancies or exaggeration. |
| **CONTRADICTED** | Authoritative physical telemetry, sensor logs, or official bulletins definitively refute the claim. |
| **UNVERIFIED** | Claim is circulating in preliminary chatter; independent corroboration is pending. |
| **INSUFFICIENT EVIDENCE** | Zero credible dispatch records or sensor entries exist; system refuses to guess. |

> **Critical Principle:** *Confidence $\neq$ Truth Probability.*  
> Confidence reflects epistemic certainty given the quantity, quality, and consensus of evidence. A claim can have **95% Confidence** of being **CONTRADICTED**.

---

## 3. System Architecture & Component Pipeline

```
                              [ Emergency Claim Input ]
                                          │
                                          ▼
                         [ Claim Decomposition Engine ]
             (Splits into Entity, Incident, Impact, Directive, Locality Assertions)
                                          │
                                          ▼
                           [ Multi-Tier Source Layer ]
             (Official Agency [0.95], News [0.85], Social [0.40], Anonymous [0.20])
                                          │
                                          ▼
                        [ Transparent Evidence Weighting ]
                     W_i = Reliability × Relevance × Freshness × Directness
                                          │
                                          ▼
                      [ Conflict & Controversy Analytics ]
             Controversy Index = 2 × min(Support, Contradict) / Total Mass
                                          │
                                          ▼
                     [ Epistemic Confidence & Status Engine ]
             (Evaluates sufficiency, bounds uncertainty, triggers HITL triage)
                                          │
             ┌────────────────────────────┼────────────────────────────┐
             ▼                            ▼                            ▼
   [ Interactive DAG Graph ]     [ Narrative Clustering ]     [ Human Review Queue ]
   Forensic node-link trail      Macro-rumor aggregation      Mandatory adjudication
   from raw text to verdict      and velocity tracking        for high-risk alerts
```

---

## 4. Key Innovations & Differentiators ("Why CrisisLens Is Different")

1. **Claim Decomposition Engine:** Decomposes complex claims into isolated assertions so partial truths are accurately parsed without false binary verdicts.
2. **Deterministic Evidence Scoring:** $W_i = \text{Reliability} \times \text{Relevance} \times \text{Freshness} \times \text{Directness}$. The math is 100% auditable and visible to operators.
3. **Auditable Provenance Graph (DAG):** Interactive vector graph mapping Claim $\to$ Assertions $\to$ Evidence $\to$ Sources $\to$ Assessment with slide-out node forensic inspection.
4. **Source & Bias Check Audit:** Automatically detects monoculture bias (e.g., $>60\%$ social media sourcing) or missing official agency telemetry before publication.
5. **Narrative Clustering Engine:** Groups viral mutations (e.g. 14 variations of a dam leak forward) to track collective velocity and geographic trajectory.
6. **Human-in-the-Loop (HITL) Adjudication Gateway:** Automatically routes low-confidence, high-controversy, or high-severity claims to human dispatchers with an immutable audit log.
7. **Temporal Crisis Simulator (The "WOW" Demo):** Interactive timeline demonstrating real-time verdict shifts as social chatter (10:00 AM) meets sensor logs (10:20 AM) and operational bulletins (10:30 AM).

---

## 5. Technology Stack
- **Frontend Architecture:** Modern modular Vanilla ES Modules & Component Controllers (zero bulky framework overhead, instant reaction time).
- **Styling:** Custom Emergency Intelligence Design System (CSS Custom Properties, Dark Ops glassmorphism, responsive data density).
- **Visualization:** Native interactive SVG Directed Acyclic Graph (DAG) with bezier link routing and dynamic DOM inspector.
- **State Management:** Reactive Pub/Sub Store with centralized action dispatchers.
- **Tooling:** Vite 5.4 build system & dev server.

---

## 6. Project Directory Structure
```
crisislens/
├── index.html                      # Entry HTML template
├── package.json                    # Project configuration & scripts
├── src/
│   ├── main.js                     # Central controller & router
│   ├── models/
│   │   └── types.js                # Status enums, source tiers, categories
│   ├── data/
│   │   └── crisisDataset.js        # Synthetic multi-scenario crisis dataset
│   ├── engine/
│   │   ├── claimDecomposer.js      # Assertion extraction engine
│   │   ├── sourceProvider.js       # Abstract multi-tier source provider
│   │   ├── evidenceScorer.js       # Transparent weighted math engine
│   │   ├── confidenceEngine.js     # Epistemic confidence & uncertainty model
│   │   ├── biasCheck.js            # Diversity & monoculture auditor
│   │   ├── provenanceGraph.js      # Interactive SVG DAG visualization
│   │   ├── narrativeClusterer.js   # Macroscopic rumor clustering
│   │   └── simulationEngine.js     # Temporal crisis stream simulator
│   ├── state/
│   │   └── store.js                # Centralized reactive application store
│   ├── components/
│   │   ├── Navbar.js               # Top ops navigation & status badges
│   │   ├── LandingView.js          # Overview & stakeholder impact
│   │   ├── VerifyClaimView.js      # Claim input & animated progress
│   │   ├── VerificationResultView.js # Verdict hero, DAG, evidence cards
│   │   ├── CrisisDashboardView.js  # Command center & simulated vector map
│   │   ├── NarrativeClusterView.js # Rumor clusters & velocity tracking
│   │   ├── HumanReviewView.js      # HITL review queue & audit table
│   │   ├── SimulationView.js       # Temporal crisis simulation demo
│   │   └── MethodologyView.js      # Mathematical specs & Judge FAQ
│   └── styles/
│       ├── theme.css               # Design tokens & status palettes
│       └── components.css          # High-density ops layout styling
├── README.md                       # Comprehensive system documentation
└── PRESENTATION_NOTES.md           # 3-minute winning demo script & Q&A
```

---

## 7. Setup & Execution Instructions

### Prerequisites
- Node.js v18+ (tested on Node v24.16.0)
- npm v9+

### Quick Start
```bash
# 1. Clone or navigate to workspace
cd c:/projects/crisislens

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the local development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 8. Privacy, Safety & Ethical Guardrails
- **Safe Synthetic Data:** Complies with privacy and safety standards. Contains zero real personal telephone numbers, private home coordinates, or individual medical identities.
- **Air-Gapped Operation:** Functions reliably offline without brittle dependency on third-party live APIs during hackathon judging.
- **Clear Demarcation:** Every dashboard panel explicitly displays `SIMULATION DATA` to prevent accidental real-world confusion.
- **No Autonomous Action:** The system strictly advises and assists human disaster coordinators; it never unilaterally triggers civil sirens or emergency directives.
