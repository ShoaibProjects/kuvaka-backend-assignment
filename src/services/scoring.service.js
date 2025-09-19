// Define a constant for adjacent industries for better readability and maintenance.
const ADJACENT_INDUSTRIES = ["fintech", "martech", "enterprise software", "it services"];

function calculateRuleScore(lead, offer) {
    let score = 0;

    // Rule 1: Score based on the lead's role seniority
    const role = lead.role.toLowerCase();
    if (['head', 'vp', 'director', 'c-level', 'ceo', 'cto', 'cfo'].some(term => role.includes(term))) {
        score += 20;
    } else if (['manager', 'lead', 'senior'].some(term => role.includes(term))) {
        score += 10;
    }

    // Rule 2: Score based on industry match
    if (offer.ideal_use_cases && lead.industry) {
        const leadIndustry = lead.industry.toLowerCase();

        // Check for an exact industry match
        const isExactMatch = offer.ideal_use_cases.some(use_case =>
            leadIndustry.includes(use_case.toLowerCase())
        );
        // Check for an adjacent industry match
        const isAdjacentMatch = ADJACENT_INDUSTRIES.some(adj_industry =>
            leadIndustry.includes(adj_industry)
        );

        if (isExactMatch) {
            score += 20;
        } else if (isAdjacentMatch) {
            score += 10;
        }
    }
    
    // Rule 3: Add points for data completeness
    if (lead.name && lead.role && lead.company && lead.industry && lead.location && lead.linkedin_bio) {
        score += 10;
    }

    return score;
}

module.exports = { calculateRuleScore };