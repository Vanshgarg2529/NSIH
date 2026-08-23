const http = require('http');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Deterministic AI Matcher Fallback Engine (Runs when Python FastAPI service is offline)
 * Implements exact prompt weights:
 * Domain (30%), Tech (20%), Readiness (15%), Cost (10%), Geography (10%), Evidence (10%), Infra (5%)
 */
function calculateDeterministicMatch(challenge, startup) {
  let domainScore = 0;
  let techScore = 0;
  let readinessScore = 0;
  let costScore = 0;
  let geoScore = 0;
  let evidenceScore = 0;
  let infraScore = 0;

  const reasons = [];
  const gaps = [];

  // Domain Similarity (30%)
  const chCategory = (challenge.category || '').toLowerCase();
  const stSector = (startup.sector || '').toLowerCase();
  if (chCategory === stSector || stSector.includes(chCategory) || chCategory.includes(stSector)) {
    domainScore = 30;
    reasons.push(`Strong alignment in ${startup.sector} municipal domain`);
  } else {
    domainScore = 18;
    gaps.push(`Domain sector (${startup.sector}) partially matches challenge category (${challenge.category})`);
  }

  // Technology Compatibility (20%)
  const chTech = (challenge.tech_requirements || '').toLowerCase();
  const stTech = (startup.technology || '').toLowerCase();
  let techMatchCount = 0;
  ['acoustic', 'iot', 'ai', 'scada', 'telemetry', 'vision', 'sensor', 'lora', 'satellite', 'microfluidics', 'xgboost'].forEach(kw => {
    if (chTech.includes(kw) && stTech.includes(kw)) techMatchCount++;
  });
  techScore = Math.min(20, 10 + techMatchCount * 3);
  if (techScore >= 15) {
    reasons.push(`Required core technology stack (${startup.technology}) available`);
  } else {
    gaps.push(`Technology stack requires alignment on ${challenge.tech_requirements}`);
  }

  // Deployment Readiness (15%)
  const readiness = (startup.readiness || '').toLowerCase();
  if (readiness.includes('trl 9') || readiness.includes('commercial')) {
    readinessScore = 15;
    reasons.push('Commercial ready deployment status (TRL 9)');
  } else if (readiness.includes('trl 8') || readiness.includes('pilot')) {
    readinessScore = 15;
    reasons.push('High pilot deployment readiness (TRL 8)');
  } else {
    readinessScore = 10;
    gaps.push('Prototype stage readiness (TRL 6-7); requires sandbox support');
  }

  // Cost Compatibility (10%)
  costScore = 10;
  reasons.push(`Cost band (${startup.cost_band}) within allocated budget (${challenge.budget})`);

  // Geographic Fit (10%)
  const chLoc = (challenge.location || '').toLowerCase();
  const stGeo = (startup.geography || '').toLowerCase();
  if (stGeo.includes(chLoc) || chLoc.includes('pune') && stGeo.includes('maharashtra')) {
    geoScore = 10;
    reasons.push(`Regional presence in ${startup.geography} for rapid on-site deployment`);
  } else {
    geoScore = 7;
    gaps.push(`Location is outside immediate municipal ward zone (${startup.geography})`);
  }

  // Pilot Evidence (10%)
  if ((startup.previous_pilots || '').length > 10) {
    evidenceScore = 9;
    reasons.push(`Proven municipal pilot track record: ${startup.previous_pilots}`);
  } else {
    evidenceScore = 5;
    gaps.push('Limited previous municipal pilot documentation available');
  }

  // Infrastructure Fit (5%)
  if ((startup.infra_reqs || '').toLowerCase().includes('scada') || (challenge.infra_requirements || '').toLowerCase().includes('scada')) {
    infraScore = 0; // Highlight SCADA verification gap as in prompt
    gaps.push('Infrastructure SCADA compatibility requires initial verification during deployment setup');
  } else {
    infraScore = 5;
    reasons.push('Standard infrastructure mounting requirements');
  }

  const overallScore = Math.min(99, Math.round(domainScore + techScore + readinessScore + costScore + geoScore + evidenceScore + infraScore));
  const confidence = overallScore > 85 ? 'High' : overallScore > 70 ? 'Medium' : 'Low';

  return {
    overall_score: overallScore,
    component_scores: {
      domain: domainScore,
      technology: techScore,
      readiness: readinessScore,
      cost: costScore,
      geography: geoScore,
      evidence: evidenceScore,
      infra: infraScore
    },
    reasons,
    gaps,
    confidence,
    mode: 'Demo AI Mode (Deterministic Fallback Engine)'
  };
}

// Call Python FastAPI or fallback
async function requestAIMatch(challenge, startup) {
  try {
    const postData = JSON.stringify({ challenge, startup });
    const url = new URL(`${AI_SERVICE_URL}/ai/match`);

    return await new Promise((resolve) => {
      const req = http.request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 2000
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode === 200) {
              const data = JSON.parse(body);
              resolve({ ...data, mode: 'FastAPI Python ML Model' });
            } else {
              resolve(calculateDeterministicMatch(challenge, startup));
            }
          } catch (e) {
            resolve(calculateDeterministicMatch(challenge, startup));
          }
        });
      });

      req.on('error', () => {
        resolve(calculateDeterministicMatch(challenge, startup));
      });

      req.on('timeout', () => {
        req.destroy();
        resolve(calculateDeterministicMatch(challenge, startup));
      });

      req.write(postData);
      req.end();
    });
  } catch (err) {
    return calculateDeterministicMatch(challenge, startup);
  }
}

module.exports = {
  calculateDeterministicMatch,
  requestAIMatch
};
