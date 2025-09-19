const fs = require('fs').promises; 
const path = require('path'); 

const inMemoryStore = {};

const DATA_DIR = path.join(__dirname, '..', 'data');

const FILE_KEYS = {
    OFFER: 'offer',
    LEADS: 'leads',
    RESULTS: 'results',
};

const initializeDataDir = async () => {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
        // Only log an error if it's not the expected "read-only" error in production
        if (process.env.NODE_ENV !== 'production') {
            console.error('Failed to create data directory:', error);
            process.exit(1);
        }
    }
};

initializeDataDir();

const saveData = async (fileKey, data) => {
    inMemoryStore[fileKey] = data;
    console.log(`Data successfully saved to in-memory store for key: ${fileKey}`);
};

const readData = async (fileKey) => {
    const data = inMemoryStore[fileKey];
    if (!data) {
        return null;
    }
    return data;
};

module.exports = {
    saveData,
    readData,
    FILE_KEYS,
};