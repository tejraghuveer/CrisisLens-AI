/**
 * CrisisLens AI — Provenance & Evidence Graph Engine
 * 
 * Renders an interactive DAG (Directed Acyclic Graph) showing the complete provenance trail:
 * Tier 0: Crisis Claim
 * Tier 1: Factual Assertions
 * Tier 2: Evidence Items (Color-coded by stance: Support/Contradict/Neutral)
 * Tier 3: Verified Sources
 * Tier 4: Final Epistemic Assessment
 * 
 * Provides interactive node inspection and filtering.
 */

export class ProvenanceGraphRenderer {
  /**
   * Build graph model from verification run
   * @param {Object} verificationResult 
   */
  static buildGraphData(verificationResult) {
    const { claim, decomposition, evaluation, assessment } = verificationResult;

    const nodes = [];
    const links = [];

    // Root Claim Node
    const claimNodeId = 'node-claim-root';
    nodes.push({
      id: claimNodeId,
      tier: 0,
      label: 'CLAIM',
      sublabel: claim.text.length > 45 ? claim.text.substring(0, 42) + '...' : claim.text,
      type: 'CLAIM',
      severity: claim.severity || 'HIGH',
      data: claim
    });

    // Tier 1: Assertions
    const assertionNodes = (decomposition?.assertions || []).map((asst, idx) => {
      const asstId = `node-asst-${idx}`;
      nodes.push({
        id: asstId,
        tier: 1,
        label: `A${idx + 1}: ${asst.type.replace('_', ' ')}`,
        sublabel: asst.statement.length > 38 ? asst.statement.substring(0, 35) + '...' : asst.statement,
        type: 'ASSERTION',
        data: asst
      });
      links.push({
        source: claimNodeId,
        target: asstId,
        relation: 'DECOMPOSED_INTO'
      });
      return { asstId, key: asst.key };
    });

    // Tier 2: Evidence Items
    const evidenceNodes = (evaluation?.scoredItems || []).map((ev, idx) => {
      const evId = `node-ev-${idx}`;
      const stanceColor = ev.relation === 'SUPPORTS' ? '#10b981' : ev.relation === 'CONTRADICTS' ? '#ef4444' : '#06b6d4';
      nodes.push({
        id: evId,
        tier: 2,
        label: `EV-${idx + 1} (${ev.relation})`,
        sublabel: ev.excerpt.length > 42 ? ev.excerpt.substring(0, 39) + '...' : ev.excerpt,
        type: 'EVIDENCE',
        stance: ev.relation,
        color: stanceColor,
        score: ev.weightedScore,
        data: ev
      });

      // Link to matching assertion or first assertion
      const targetAsst = assertionNodes.find(a => a.key === ev.assertionKey) || assertionNodes[0];
      if (targetAsst) {
        links.push({
          source: targetAsst.asstId,
          target: evId,
          relation: ev.relation
        });
      }

      return { evId, sourceId: ev.sourceId || ev.source?.id, source: ev.source };
    });

    // Tier 3: Sources
    const uniqueSourcesMap = new Map();
    evidenceNodes.forEach(evObj => {
      if (evObj.source && !uniqueSourcesMap.has(evObj.source.id)) {
        uniqueSourcesMap.set(evObj.source.id, evObj.source);
      }
    });

    uniqueSourcesMap.forEach((source, sId) => {
      const sourceNodeId = `node-src-${sId}`;
      nodes.push({
        id: sourceNodeId,
        tier: 3,
        label: source.name.length > 25 ? source.name.substring(0, 22) + '...' : source.name,
        sublabel: `Reliability: ${(source.reliability * 100).toFixed(0)}% • ${source.type}`,
        type: 'SOURCE',
        data: source
      });

      // Link corresponding evidence items to this source
      evidenceNodes.filter(ev => ev.sourceId === sId).forEach(ev => {
        links.push({
          source: ev.evId,
          target: sourceNodeId,
          relation: 'PUBLISHED_BY'
        });
      });
    });

    // Tier 4: Assessment Node
    const assessNodeId = 'node-assessment';
    nodes.push({
      id: assessNodeId,
      tier: 4,
      label: `ASSESSMENT: ${assessment.status}`,
      sublabel: `Confidence ${assessment.confidenceScore}% • Uncertainty: ${assessment.uncertainty}`,
      type: 'ASSESSMENT',
      status: assessment.status,
      data: assessment
    });

    // Link all sources to final assessment
    uniqueSourcesMap.forEach((_, sId) => {
      links.push({
        source: `node-src-${sId}`,
        target: assessNodeId,
        relation: 'AGGREGATED_INTO'
      });
    });

    return { nodes, links };
  }

  /**
   * Render SVG Provenance Graph inside a container
   * @param {HTMLElement} container 
   * @param {Object} graphData 
   * @param {Function} onNodeSelect 
   */
  static render(container, graphData, onNodeSelect) {
    container.innerHTML = '';

    const width = container.clientWidth || 980;
    const height = 520;

    // Layout tiers horizontally across 5 columns
    const tiers = [[], [], [], [], []];
    graphData.nodes.forEach(node => {
      const t = Math.min(4, Math.max(0, node.tier));
      tiers[t].push(node);
    });

    const colWidth = width / 5;
    const nodeCoords = new Map();

    tiers.forEach((tierNodes, colIdx) => {
      const count = tierNodes.length;
      const x = colIdx * colWidth + colWidth / 2;
      tierNodes.forEach((node, rowIdx) => {
        const spacing = height / (count + 1);
        const y = (rowIdx + 1) * spacing;
        nodeCoords.set(node.id, { x, y, node });
      });
    });

    // Create SVG element
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.overflow = 'visible';

    // Defs for arrows and gradients
    const defs = document.createElementNS(svgNS, 'defs');
    defs.innerHTML = `
      <marker id="arrow-supports" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
      </marker>
      <marker id="arrow-contradicts" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
      </marker>
      <marker id="arrow-default" viewBox="0 0 10 10" refX="15" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
      </marker>
    `;
    svg.appendChild(defs);

    // Draw Links
    const linksGroup = document.createElementNS(svgNS, 'g');
    linksGroup.setAttribute('class', 'graph-links');

    graphData.links.forEach(link => {
      const sourceCoord = nodeCoords.get(link.source);
      const targetCoord = nodeCoords.get(link.target);
      if (!sourceCoord || !targetCoord) return;

      const path = document.createElementNS(svgNS, 'path');
      const dx = targetCoord.x - sourceCoord.x;
      const c1x = sourceCoord.x + dx * 0.5;
      const c2x = sourceCoord.x + dx * 0.5;
      const d = `M ${sourceCoord.x} ${sourceCoord.y} C ${c1x} ${sourceCoord.y}, ${c2x} ${targetCoord.y}, ${targetCoord.x} ${targetCoord.y}`;
      path.setAttribute('d', d);

      let strokeColor = '#cbd5e1';
      let marker = 'url(#arrow-default)';

      if (link.relation === 'SUPPORTS') {
        strokeColor = '#16a34a';
        marker = 'url(#arrow-supports)';
      } else if (link.relation === 'CONTRADICTS') {
        strokeColor = '#dc2626';
        marker = 'url(#arrow-contradicts)';
      }

      path.setAttribute('stroke', strokeColor);
      path.setAttribute('stroke-width', '1.5');
      path.setAttribute('fill', 'none');
      path.setAttribute('marker-end', marker);
      linksGroup.appendChild(path);
    });

    svg.appendChild(linksGroup);

    // Draw Nodes
    const nodesGroup = document.createElementNS(svgNS, 'g');
    nodesGroup.setAttribute('class', 'graph-nodes');

    nodeCoords.forEach((coord, id) => {
      const { x, y, node } = coord;
      const g = document.createElementNS(svgNS, 'g');
      g.setAttribute('transform', `translate(${x}, ${y})`);
      g.setAttribute('class', 'graph-node');
      g.style.cursor = 'pointer';

      // Node background pill
      const rect = document.createElementNS(svgNS, 'rect');
      const w = 150;
      const h = 54;
      rect.setAttribute('x', -w / 2);
      rect.setAttribute('y', -h / 2);
      rect.setAttribute('width', w);
      rect.setAttribute('height', h);
      rect.setAttribute('rx', 6);

      let fillColor = '#ffffff';
      let strokeColor = '#e2e8f0';
      let labelColor = '#0f172a';
      let subColor = '#64748b';

      if (node.type === 'CLAIM') {
        fillColor = '#f8fafc';
        strokeColor = '#64748b';
      } else if (node.type === 'ASSERTION') {
        fillColor = '#f8fafc';
        strokeColor = '#cbd5e1';
      } else if (node.type === 'EVIDENCE') {
        fillColor = node.stance === 'SUPPORTS' ? '#f0fdf4' : node.stance === 'CONTRADICTS' ? '#fef2f2' : '#f8fafc';
        strokeColor = node.stance === 'SUPPORTS' ? '#16a34a' : node.stance === 'CONTRADICTS' ? '#dc2626' : '#cbd5e1';
      } else if (node.type === 'SOURCE') {
        fillColor = '#eff6ff';
        strokeColor = '#3b82f6';
      } else if (node.type === 'ASSESSMENT') {
        fillColor = '#f0fdf4';
        strokeColor = '#16a34a';
      }

      rect.setAttribute('fill', fillColor);
      rect.setAttribute('stroke', strokeColor);
      rect.setAttribute('stroke-width', '1.5');
      g.appendChild(rect);

      // Node Label
      const textLabel = document.createElementNS(svgNS, 'text');
      textLabel.setAttribute('x', 0);
      textLabel.setAttribute('y', -4);
      textLabel.setAttribute('text-anchor', 'middle');
      textLabel.setAttribute('fill', labelColor);
      textLabel.setAttribute('font-size', '11');
      textLabel.setAttribute('font-weight', '600');
      textLabel.setAttribute('font-family', 'Inter, system-ui, sans-serif');
      textLabel.textContent = node.label;
      g.appendChild(textLabel);

      // Node Sublabel
      const textSub = document.createElementNS(svgNS, 'text');
      textSub.setAttribute('x', 0);
      textSub.setAttribute('y', 14);
      textSub.setAttribute('text-anchor', 'middle');
      textSub.setAttribute('fill', subColor);
      textSub.setAttribute('font-size', '10');
      textSub.setAttribute('font-family', 'Inter, system-ui, sans-serif');
      textSub.textContent = node.sublabel;
      g.appendChild(textSub);

      // Click Interaction
      g.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof onNodeSelect === 'function') {
          onNodeSelect(node);
        }
      });

      nodesGroup.appendChild(g);
    });

    svg.appendChild(nodesGroup);
    container.appendChild(svg);
  }
}
