const Papa = require('papaparse');
const fs = require('fs');
const storageService = require('../services/storage.service');

const saveOffer = (req, res) => {
    try {
        const offerData = req.body;
        if (!offerData || Object.keys(offerData).length === 0) {
            return res.status(400).send({ message: 'Offer data cannot be empty.' });
        }
        storageService.saveData('offer', offerData);
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
        complete: (results) => {
            try {
                storageService.saveData('leads', results.data);
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


module.exports = {
    saveOffer,
    uploadLeads,
};