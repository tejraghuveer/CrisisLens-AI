/**
 * CrisisLens AI — Claim Decomposition Engine
 * 
 * Takes an incoming crisis claim and breaks it down into atomic, testable assertions:
 * 1. Entity Existence & State (e.g. "Dam X exists and is active")
 * 2. Event/Incident Occurrence (e.g. "Structural breach has occurred")
 * 3. Consequence/Impact (e.g. "Downstream flooding is occurring")
 * 4. Official Directive/Evacuation (e.g. "Mandatory evacuation order is in effect")
 * 5. Spatial/Temporal Validity (e.g. "Event is occurring now at location Y")
 */

export class ClaimDecomposer {
  /**
   * Decompose claim into structured assertions
   * @param {string} claimText 
   * @param {string} category 
   * @param {string} location 
   */
  static decompose(claimText, category = '', location = '') {
    const text = claimText.trim();
    const assertions = [];
    const textLower = text.toLowerCase();

    // 1. Entity & Subject Identification
    let entitySubject = 'Target Crisis Infrastructure / Entity';
    if (textLower.includes('dam')) entitySubject = 'Dam Structural Infrastructure';
    else if (textLower.includes('cyclone') || textLower.includes('storm')) entitySubject = 'Cyclonic Weather System';
    else if (textLower.includes('bridge') || textLower.includes('pillar') || textLower.includes('viaduct')) entitySubject = 'Transit / Bridge Infrastructure';
    else if (textLower.includes('water') || textLower.includes('reservoir')) entitySubject = 'Water Supply / Reservoir Facility';

    assertions.push({
      id: `asst-${Date.now()}-1`,
      key: 'entity_state',
      type: 'ENTITY_STATE',
      statement: `${entitySubject} is under active emergency stress or hazard condition.`,
      targetLocation: location || 'Designated Hazard Zone',
      confidence: 0.85
    });

    // 2. Incident Occurrence Assertion
    let incidentStatement = 'A catastrophic structural or natural incident has occurred.';
    let assertionKey = 'incident_occurrence';

    if (textLower.includes('breach') || textLower.includes('broken') || textLower.includes('cracked')) {
      incidentStatement = 'A physical structural breach or failure has occurred at the facility.';
      assertionKey = 'structural_breach';
    } else if (textLower.includes('landfall') || textLower.includes('wind') || textLower.includes('gust')) {
      incidentStatement = 'The cyclone eye has made landfall with extreme category wind gusts.';
      assertionKey = 'landfall_status';
    } else if (textLower.includes('collapse') || textLower.includes('fallen') || textLower.includes('crumbled')) {
      incidentStatement = 'A physical structural collapse of the transit structure has occurred.';
      assertionKey = 'structural_collapse';
    } else if (textLower.includes('contaminat') || textLower.includes('poison')) {
      incidentStatement = 'Chemical or biological contamination has infiltrated the drinking reservoir.';
      assertionKey = 'contamination_status';
    }

    assertions.push({
      id: `asst-${Date.now()}-2`,
      key: assertionKey,
      type: 'INCIDENT_OCCURRENCE',
      statement: incidentStatement,
      targetLocation: location || 'Designated Area',
      confidence: 0.90
    });

    // 3. Consequence & Severity Assertion
    let impactStatement = 'Severe secondary disaster impacts (flooding, storm surge, or trauma) are immediately unfolding.';
    if (textLower.includes('flood') || textLower.includes('submerge') || textLower.includes('water gushing')) {
      impactStatement = 'Catastrophic downstream inundation and flooding of residential zones is actively underway.';
    } else if (textLower.includes('surge') || textLower.includes('wave') || textLower.includes('meter')) {
      impactStatement = 'Storm surge levels have breached coastal retaining walls exceeding safe astronomical limits.';
    } else if (textLower.includes('casualt') || textLower.includes('trapped') || textLower.includes('fatal')) {
      impactStatement = 'Multiple civilian casualties and trapped individuals have been reported at the site.';
    }

    assertions.push({
      id: `asst-${Date.now()}-3`,
      key: 'impact_severity',
      type: 'IMPACT_SEVERITY',
      statement: impactStatement,
      targetLocation: location || 'Affected Vicinity',
      confidence: 0.80
    });

    // 4. Official Directive / Action Assertion
    if (textLower.includes('evacuat') || textLower.includes('flee') || textLower.includes('run') || textLower.includes('order')) {
      assertions.push({
        id: `asst-${Date.now()}-4`,
        key: 'evacuation_order',
        type: 'OFFICIAL_DIRECTIVE',
        statement: 'A mandatory or urgent general civilian evacuation directive has been ordered by authorities.',
        targetLocation: location || 'Surrounding Region',
        confidence: 0.92
      });
    }

    // 5. Spatiotemporal Locality Assertion
    assertions.push({
      id: `asst-${Date.now()}-5`,
      key: 'spatiotemporal_scope',
      type: 'SPATIOTEMPORAL_SCOPE',
      statement: `Reported events reflect real-time active crisis conditions specifically at ${location || 'the reported coordinates'}.`,
      targetLocation: location || 'Target Zone',
      confidence: 0.75
    });

    return {
      claimText,
      category,
      location,
      extractedAt: new Date().toISOString(),
      assertionCount: assertions.length,
      assertions
    };
  }
}
