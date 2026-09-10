# CrisisLens AI — Hackathon Presentation Notes & Judge Defense
> **Medha Engineering Day — Advanced Hackathon**  
> **Problem Statement P14: Crisis Misinformation Verification Hub**  
> **Tagline:** *"Evidence Before Amplification."*

---

## 1. 3–5 Minute Winning Demo Script

### [0:00 – 0:45] Problem Hook & The Failure of Naive Fact-Checkers
> *"Judges, during a catastrophic flood or cyclone, communication bandwidth is throttled, and a single viral message like 'Dam X has breached, evacuate immediately' can cause deadly traffic stampedes, divert rescue boats away from actual victims, and paralyze emergency phone lines.*
> 
> *The common approach today is to throw an LLM at the problem and output a binary 'True' or 'False'. But in life-or-death crises, that fails catastrophically. A rumor often has a grain of truth—authorities may have opened spillway gates for routine release—wrapped in a false panic claim of structural breach. Labeling it 'False' makes people ignore real riverbank precautions; labeling it 'True' causes mass hysteria.*
> 
> *Enter **CrisisLens AI**—an evidence-driven crisis verification hub designed around one core principle: **Evidence Before Amplification**."*

---

### [0:45 – 1:45] Core Workflow: Decomposition, Evidence Scoring & Provenance DAG
> *(Action: Click **"Verify Claim"** on Navbar. Select the Mullaperiyar Dam scenario or enter claim).*
> 
> *"Watch our verification pipeline execute in real time. Instead of an opaque black box, CrisisLens decomposes the claim into 5 atomic assertions: Entity existence, Structural breach occurrence, Impact flooding, Official evacuation directive, and Spatiotemporal locality.*
> 
> *(Action: Review the **Result & Graph** screen).*
> 
> *Notice our result: **CONTRADICTED**, backed by **88% Confidence** and **LOW Epistemic Uncertainty**. Why? Because our multi-tier evidence engine retrieved sensor logs from the Central Water Commission and official bulletins from the District Collectorate confirming all 13 spillway gates are intact.*
> 
> *Every evidence snippet receives a transparent, mathematically auditable weight: $W_i = \text{Reliability} \times \text{Relevance} \times \text{Freshness} \times \text{Directness}$.*
> 
> *(Action: Scroll down to the **Auditable Provenance Graph (DAG)** and click the **EV-1** node).*
> 
> *Look at this interactive Provenance Graph. We can trace every claim through assertions, evidence, and sources all the way to our assessment. Clicking any node slides out the forensic inspector with the exact scoring formula and source authority verification."*

---

### [1:45 – 2:30] Source Bias Audit & Human-in-the-Loop Review Queue
> *(Action: Highlight the **Source & Bias Check** panel).*
> 
> *"CrisisLens also protects against overconfidence. Our automated **Bias Check Service** audits source diversity. If 75% of reports originate from anonymous social channels and zero official emergency agencies have confirmed, the system flags a Monoculture Bias Warning.*
> 
> *(Action: Click **"Review Queue"** in Navbar).*
> 
> *Because AI is decision support, not an unquestionable authority, any claim with high severity, low confidence, or high controversy is automatically escalated to our **Human Review Queue**. Here, an emergency coordinator can inspect the evidence, click **Confirm**, enter operational notes, and commit an immutable entry into the Forensic Adjudication Audit Log."*

---

### [2:30 – 3:30] The WOW Factor: Live Dynamic Crisis Simulation
> *(Action: Click **"Live Sim"** in Navbar).*
> 
> *"Now, for our primary innovation: **Dynamic Temporal Crisis Simulation**. Disaster intelligence is never static. Watch our timeline:*
> 
> 1. *At **10:00 AM**, a viral audio clip circulates on WhatsApp. Status: **UNVERIFIED** (Confidence 42%, High Uncertainty).*
> 2. *At **10:10 AM**, social video uploads of rushing water cause panic. The Controversy Index spikes, and Human Review is flagged.*
> 3. *At **10:20 AM**, Central Water Commission publishes telemetry confirming sensor strain is normal. Watch the status instantly pivot to **CONTRADICTED** (Confidence jumps to 88%).*
> 4. *At **10:30 AM**, the District Collectorate clarifies that shutters were raised for routine regulated discharge of 1,200 cusecs. CrisisLens updates the assessment to **PARTIALLY SUPPORTED** with full operational context!*
> 
> *CrisisLens demonstrates how verification evolves as real evidence arrives, protecting communities before dangerous misinformation is amplified. Thank you!"*

---

## 2. Hard-Hitting Judge Q&A Defense

### Q1: Who is your biggest competitor?
**Response:** *"Our competitors are generic AI fact-checkers like Google Fact Check Explorer, Full Fact, and raw LLM wrappers. However, none of them are tailored for disaster operations. They provide static, retrospective boolean ratings days after an article is published. CrisisLens is an active crisis intelligence command system that operates on minutes-level temporal streams, decomposes claims into assertions, and separates confidence from truth."*

### Q2: Why is your approach fundamentally different?
**Response:** *"We do not build 'Claim $\to$ LLM $\to$ True/False'. We build: Claim $\to$ Assertion Decomposition $\to$ Multi-Tier Source Retrieval $\to$ Factor Weighting $\to$ Epistemic Uncertainty Quantification $\to$ Provenance DAG $\to$ Human-in-the-Loop Triage. The user and emergency coordinator can inspect every single step of the reasoning chain."*

### Q3: How is confidence calculated?
**Response:** *"Confidence is calculated through a deterministic epistemic model:
$$\text{Base Confidence} = f(\text{Evidence Mass}, \text{Source Diversity}) - \text{Penalty}(\text{Controversy Index})$$
Where the Controversy Index is $2 \times \min(\text{Support Mass}, \text{Contradict Mass}) / \text{Total Mass}$. If sources heavily disagree, the controversy index surges, confidence drops, and mandatory human review is triggered."*

### Q4: How do you prevent LLM hallucinations?
**Response:** *"We decouple text extraction from epistemic scoring. The LLM or decomposer is strictly restricted to extracting atomic assertions from text. The status and confidence calculation are governed by deterministic mathematical algorithms operating over verified sensor registries and authenticated source feeds. The AI cannot invent citations or alter weights."*

### Q5: How do you determine source reliability?
**Response:** *"Sources are categorized into institutional reliability tiers:
- **High Trust (0.90–0.99):** Government agencies and physical sensor telemetry (NDMA, CWC, IMD).
- **Medium-High Trust (0.80–0.89):** Accredited news organizations (Reuters, BBC, The Hindu).
- **Medium Trust (0.70–0.79):** Local municipal desks and district collectorates.
- **Lower Trust (0.30–0.49):** Social media posts and unverified citizen uploads.
- **Lowest Trust (<0.25):** Anonymous viral messaging forwards."*

### Q6: What happens when sources contradict each other?
**Response:** *"Rather than averaging them out or guessing, the system calculates the **Controversy Index**. If high-reliability sensor telemetry contradicts low-reliability social posts, the sensor telemetry outweighs the rumor. If two equally reputable sources contradict each other, the Controversy Index triggers a high-uncertainty state, assigns status **PARTIALLY SUPPORTED** or **UNVERIFIED**, and immediately locks the claim into the Human Review Queue."*

### Q7: Where does your data come from?
**Response:** *"For this hackathon MVP, we created an air-gapped synthetic crisis dataset grounded in authentic NDMA, IMD, and CWC operational blueprints. This guarantees 100% reliability during offline judging without risk of API rate limits. All simulated data is clearly badged as `SIMULATION DATA`. Crucially, our `SourceProvider` architecture is modular and ready to connect to live RSS and CAP feeds."*

### Q8: Can this work in real time?
**Response:** *"Yes. Because our scoring formulas are deterministic and lightweight ($O(N)$ where $N$ is evidence count), evidence scoring executes in under 20 milliseconds. Even under heavy disaster loads, thousands of incoming claims can be decomposed and matched against telemetry without server bottlenecks."*

### Q9: How would you scale it?
**Response:** *"Architecturally:
1. Connect our `SourceProvider` to the Common Alerting Protocol (CAP) and GDACS global feeds.
2. Store claims and vector embeddings in a distributed cluster (e.g., Qdrant or Milvus).
3. Distribute the Provenance DAG rendering client-side to preserve zero server latency.
4. Integrate with district-level Emergency Operations Centers (DEOCs) via webhook triage queues."*

### Q10: How do you protect privacy?
**Response:** *"Disaster verification only requires verifying public conditions and physical infrastructure. We capture zero personal phone numbers, private home addresses, or civilian medical identities. All social inputs are anonymized before being entered into the evidence repository."*

### Q11: Why use AI if the formulas are mathematical?
**Response:** *"AI is essential for the unstructured-to-structured transition: parsing natural language claims into discrete factual assertions, matching semantic intent across informal vernacular dialects, and clustering mutating rumors into macroscopic narrative threads. Deterministic math is then applied where accountability matters: scoring, controversy calculation, and status determination."*

### Q12: What happens if the AI is wrong?
**Response:** *"That is why CrisisLens implements a mandatory **Human-in-the-Loop (HITL)** gateway. The system never executes autonomous emergency actions. When uncertainty is high, or when high-severity claims arise, human disaster coordinators are required to adjudicate. Furthermore, our audit trail preserves full operator notes."*

### Q13: Why should emergency coordinators trust the system?
**Response:** *"Because CrisisLens is **explainable by design**. It never outputs an unexplained verdict. The coordinator sees the exact formula, inspects the interactive Provenance DAG, reviews the Source Diversity Audit, and sees the raw excerpts before making any operational decision."*

### Q14: What are the current limitations?
**Response:** *"1. Synthetic data in the MVP rather than live API integrations.
2. Computer vision forensic analysis on manipulated disaster images is currently mocked via metadata rather than a deep neural forensic detector.
3. Natural language decomposition is currently optimized for English (regional vernacular multi-lingual expansion is our Phase 2 roadmap)."*

### Q15: How would you deploy this in the real world?
**Response:** *"We would deploy CrisisLens as an official intelligence sidecar inside State Disaster Management Authority (SDMA) War Rooms. Emergency desks would ingest WhatsApp and Twitter tip lines, while field officers and DEOCs use the verified counter-bulletin outputs to publish official clarifications before panic spreads."*
