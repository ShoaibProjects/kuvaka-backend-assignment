
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

async function getAiScore(lead, offer) {
    const prompt = `
        Based on the product described as '${offer.name}' with value propositions like '${offer.value_props.join(', ')}' and an ideal customer profile of '${offer.ideal_use_cases.join(', ')}', please analyze the following lead:
        - Name: ${lead.name}
        - Role: ${lead.role} at ${lead.company}
        - Industry: ${lead.industry}
        - Bio: ${lead.linkedin_bio}

        Please classify this lead's buying intent as either **High**, **Medium**, or **Low**, and provide a one to two-sentence explanation for your classification.
    `;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            { contents: [{ parts: [{ text: prompt }] }] }
        );

        const text = response.data.candidates[0].content.parts[0].text;
        const reasoning = text;
        let score = 10; 

        if (text.toLowerCase().includes('high')) {
            score = 50;
        } else if (text.toLowerCase().includes('medium')) {
            score = 30;
        }
        
        return { score, reasoning };
    } catch (error) {
        console.error('Error calling AI API:', error.response ? error.response.data : error.message);
        return { score: 0, reasoning: 'Error from AI API.' };
    }
}

module.exports = { getAiScore };