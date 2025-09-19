const Papa = require('papaparse');
const fs = require('fs');
const storageService = require('../services/storage.service');
const aiService = require('../services/ai.service');
const scoringService = require('../services/scoring.service'); // Note: Added this require statement for the scoringService reference

const saveOffer = async (req, res) => {
    try {
        const offerData = req.body;
        if (!offerData || Object.keys(offerData).length === 0) {
            return res.status(400).send({ message: 'Offer data cannot be empty.' });
        }
        await storageService.saveData(storageService.FILE_KEYS.OFFER, offerData);
        res.status(200).send({ message: 'Offer data saved successfully.', data: offerData });
    } catch (error) {
        res.status(500).send({ message: 'Error saving offer data.', error: error.message });
    }
};

const uploadLeads = (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded.' });
    }

    const csvFile = fs.readFileSync(req.file.path, 'utf8');
    fs.unlinkSync(req.file.path);

    Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => { // Made this callback async
            try {
                await storageService.saveData(storageService.FILE_KEYS.LEADS, results.data);
                res.status(200).send({ message: `${results.data.length} leads uploaded and saved successfully.` });
            } catch (error) {
                res.status(500).send({ message: 'Error saving leads data.', error: error.message });
            }
        },
        error: (error) => {
            res.status(500).send({ message: 'Error parsing CSV file.', error: error.message });
        }
    });
};

const scoreLeads = async (req, res) => {
    console.log('Scoring process initiated...');

    const offerData = await storageService.readData(storageService.FILE_KEYS.OFFER);
    const leads = await storageService.readData(storageService.FILE_KEYS.LEADS);

    if (!offerData || !Array.isArray(leads) || leads.length === 0) {
        return res.status(400).send({ message: 'Please upload offer data and leads first.' });
    }

    const scoredResults = [];
    
    for (const lead of leads) {
        const ruleScore = scoringService.calculateRuleScore(lead, offerData);
        const aiResult = await aiService.getAiScore(lead, offerData);

        const finalScore = ruleScore + aiResult.score;
        
        let intent = 'Low';
        if (finalScore >= 75) { intent = 'High'; } 
        else if (finalScore >= 50) { intent = 'Medium'; }
        
        scoredResults.push({
            name: lead.name,
            role: lead.role,
            company: lead.company,
            intent: intent,
            score: finalScore,
            reasoning: aiResult.reasoning
        });
    }

    await storageService.saveData(storageService.FILE_KEYS.RESULTS, scoredResults);
    res.status(200).send({ message: `Scoring complete for ${scoredResults.length} leads.` });
};

const getResults = async (req, res) => {
    const results = await storageService.readData(storageService.FILE_KEYS.RESULTS);
    if (!results) {
        return res.status(404).send({ message: 'No results found. Please run the scoring first.' });
    }
    res.status(200).json(results);
};

module.exports = {
    saveOffer,
    uploadLeads,
    scoreLeads,
    getResults,
};