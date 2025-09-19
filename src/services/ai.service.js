const { GoogleGenerativeAI } = require("@google/generative-ai");

// Define a constant for the AI model to make it easy to change
const AI_MODEL = "gemini-2.5-flash";
// Define constants for the scores to make them easier to manage
const SCORE_HIGH = 50;
const SCORE_MEDIUM = 30;
const SCORE_LOW = 10;
const SCORE_ERROR = 0;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getAiScore(lead, offer) {
  const prompt = `
    Based on the product described as '${offer.name}' with value propositions like '${offer.value_props.join(', ')}' and an ideal customer profile of '${offer.ideal_use_cases.join(', ')}', please analyze the following lead:
    - Name: ${lead.name}
    - Role: ${lead.role} at ${lead.company}
    - Industry: ${lead.industry}
    - Bio: ${lead.linkedin_bio}

    Please classify this lead's buying intent as one of **High**, **Medium**, or **Low**. Provide a one to two-sentence explanation for your classification.
    
    Respond with a JSON object in the following format:
    {
      "intent": "High" | "Medium" | "Low",
      "reasoning": "A brief explanation of the intent."
    }
    `;

  try {
    const model = genAI.getGenerativeModel({ model: AI_MODEL });
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Use a regular expression to extract the JSON string from the markdown code block
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
    
    if (!jsonMatch || jsonMatch.length < 2) {
      console.error('AI response did not contain a valid JSON code block.');
      return { score: SCORE_ERROR, reasoning: 'AI response was not in the expected format.' };
    }

    const jsonString = jsonMatch[1];
    const aiResponse = JSON.parse(jsonString.trim());

    // Map the intent from the AI to a numerical score
    let score;
    switch (aiResponse.intent.toLowerCase()) {
      case 'high':
        score = SCORE_HIGH;
        break;
      case 'medium':
        score = SCORE_MEDIUM;
        break;
      case 'low':
        score = SCORE_LOW;
        break;
      default:
        // Handle unexpected intent values
        console.warn('Unexpected intent from AI:', aiResponse.intent);
        score = SCORE_LOW;
    }
    
    // Return the score and reasoning
    return { score, reasoning: aiResponse.reasoning };
  } catch (error) {
    console.error('Error calling or parsing AI API response:', error);
    // Return a default error score and reasoning
    return { score: SCORE_ERROR, reasoning: 'Error from AI API or parsing response.' };
  }
}

module.exports = { getAiScore };