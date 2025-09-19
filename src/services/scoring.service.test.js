// Import the function to be tested
const { calculateRuleScore } = require('./scoring.service');

// Describe the test suite for the function
describe('calculateRuleScore', () => {

    // Define a standard offer object to use in tests
    const mockOffer = {
        name: 'Enterprise AI Suite',
        value_props: ['Automated workflows', 'Predictive analytics'],
        ideal_use_cases: ['fintech', 'healthcare', 'e-commerce'],
    };

    // Test for a high-scoring lead
    test('should return a high score for a lead with a senior role and exact industry match', () => {
        const highScoreLead = {
            name: 'Jane Doe',
            role: 'Director of Marketing',
            company: 'TechCorp',
            industry: 'Fintech',
            location: 'New York',
            linkedin_bio: 'A marketing leader with 10 years of experience.',
        };
        const expectedScore = 20 + 20 + 10; // Senior role + Exact industry + Data completeness
        const actualScore = calculateRuleScore(highScoreLead, mockOffer);
        expect(actualScore).toBe(expectedScore);
    });

    // Test for a medium-scoring lead
    test('should return a medium score for a lead with a mid-level role and adjacent industry match', () => {
        const mediumScoreLead = {
            name: 'John Smith',
            role: 'Senior Developer',
            company: 'Innovate Solutions',
            industry: 'IT Services',
            location: 'San Francisco',
            linkedin_bio: 'A software developer specializing in cloud computing.',
        };
        const expectedScore = 10 + 10 + 10; // Mid-level role + Adjacent industry + Data completeness
        const actualScore = calculateRuleScore(mediumScoreLead, mockOffer);
        expect(actualScore).toBe(expectedScore);
    });
    
    // Test for a low-scoring lead (not a good fit)
    test('should return a low score for a lead with no matching criteria', () => {
        const lowScoreLead = {
            name: 'Alice Johnson',
            role: 'Junior Analyst',
            company: 'EcoGreen Inc.',
            industry: 'Environmental Consulting',
            location: 'Austin',
            linkedin_bio: 'Passionate about sustainability.',
        };
        const expectedScore = 0 + 0 + 10; // No role match + No industry match + Data completeness
        const actualScore = calculateRuleScore(lowScoreLead, mockOffer);
        expect(actualScore).toBe(expectedScore);
    });

    // Test edge case: Missing data should not get the completeness bonus
    test('should not add completeness score if a field is missing', () => {
        const incompleteLead = {
            name: 'Bob',
            role: 'CEO',
            company: 'BigCorp',
            industry: 'E-commerce',
            linkedin_bio: 'Co-founder and CEO.',
            // 'location' is missing
        };
        const expectedScore = 20 + 20 + 0; // Senior role + Exact industry + No completeness
        const actualScore = calculateRuleScore(incompleteLead, mockOffer);
        expect(actualScore).toBe(expectedScore);
    });

    // Test edge case: Industry matching should be case-insensitive
    test('should match industry regardless of case', () => {
        const caseInsensitiveLead = {
            name: 'Casey',
            role: 'VP of Sales',
            company: 'Sales Co.',
            industry: 'e-commerce', // Lowercase
            location: 'Chicago',
            linkedin_bio: 'Driving revenue growth.',
        };
        const expectedScore = 20 + 20 + 10;
        const actualScore = calculateRuleScore(caseInsensitiveLead, mockOffer);
        expect(actualScore).toBe(expectedScore);
    });

    // Test for a lead with a non-matching, but senior-level role
    test('should score a senior role even if it is not in the list', () => {
        const seniorRoleLead = {
            name: 'Frank',
            role: 'Team Lead',
            company: 'Innovate Inc.',
            industry: 'Manufacturing',
            location: 'Detroit',
            linkedin_bio: 'Managing production teams.',
        };
        const expectedScore = 10 + 0 + 10; // "Team Lead" matches 'lead' + no industry match + completeness
        const actualScore = calculateRuleScore(seniorRoleLead, mockOffer);
        expect(actualScore).toBe(expectedScore);
    });

});