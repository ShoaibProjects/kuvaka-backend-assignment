const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const OFFER_FILE = path.join(DATA_DIR, 'offer.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

const saveData = (file, data) => {
    const filePath = file === 'offer' ? OFFER_FILE : LEADS_FILE;
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`Data successfully saved to ${filePath}`);
    } catch (error) {
        console.error(`Error saving data to ${filePath}:`, error);
        throw new Error(`Failed to save data for ${file}.`);
    }
};

module.exports = {
    saveData,
};