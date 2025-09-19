
function calculateRuleScore(lead, offer) {
    let score = 0;

    [cite_start]
    const role = lead.role.toLowerCase();
    if (['head', 'vp', 'director', 'c-level', 'ceo', 'cto', 'cfo'].some(term => role.includes(term))) {
        score += 20;
    } else if (['manager', 'lead', 'senior'].some(term => role.includes(term))) {
        score += 10;
    }

    [cite_start]
    if (offer.ideal_use_cases && lead.industry) {
        if (offer.ideal_use_cases.some(use_case => lead.industry.toLowerCase().includes(use_case.toLowerCase()))) {
            score += 20;
        }
    }
    
    [cite_start]
    if (lead.name && lead.role && lead.company && lead.industry && lead.linkedin_bio) {
        score += 10;
    }

    return score; 
}

module.exports = { calculateRuleScore };