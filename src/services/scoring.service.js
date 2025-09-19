function calculateRuleScore(lead, offer) {
    let score = 0;

    const role = lead.role.toLowerCase();
    if (['head', 'vp', 'director', 'c-level', 'ceo', 'cto', 'cfo'].some(term => role.includes(term))) {
        score += 20;
    } else if (['manager', 'lead', 'senior'].some(term => role.includes(term))) {
        score += 10;
    }

    if (offer.ideal_use_cases && lead.industry) {
        const leadIndustry = lead.industry.toLowerCase();
        
        const adjacent_industries = ["fintech", "martech", "enterprise software", "it services"];

        const isExactMatch = offer.ideal_use_cases.some(use_case => 
            leadIndustry.includes(use_case.toLowerCase())
        );
        const isAdjacentMatch = adjacent_industries.some(adj_industry => 
            leadIndustry.includes(adj_industry)
        );

        if (isExactMatch) {
            score += 20;
        } else if (isAdjacentMatch) {
            score += 10;
        }
    }
    
    if (lead.name && lead.role && lead.company && lead.industry && lead.location && lead.linkedin_bio) {
        score += 10;
    }

    return score; 
}

module.exports = { calculateRuleScore };