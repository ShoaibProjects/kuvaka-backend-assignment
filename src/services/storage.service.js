const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

const FILE_KEYS = {
    OFFER: 'offer',
    LEADS: 'leads',
    RESULTS: 'results',
};

const FILE_PATHS = {
    [FILE_KEYS.OFFER]: path.join(DATA_DIR, 'offer.json'),
    [FILE_KEYS.LEADS]: path.join(DATA_DIR, 'leads.json'),
    [FILE_KEYS.RESULTS]: path.join(DATA_DIR, 'results.json'),
};


const getFilePath = (fileKey) => {
    const filePath = FILE_PATHS[fileKey];
    if (!filePath) {
        throw new Error(`Invalid file key specified: ${fileKey}`);
    }
    return filePath;
};


const initializeDataDir = async () => {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
        console.error('Failed to create data directory:', error);
        process.exit(1);
    }
};

initializeDataDir();

const saveData = async (fileKey, data) => {
    const filePath = getFilePath(fileKey);
    try {
        const content = JSON.stringify(data, null, 2);
        await fs.writeFile(filePath, content, 'utf8');
        console.log(`Data successfully saved to ${filePath}`);
    } catch (error) {
        console.error(`Error saving data to ${filePath}:`, error);
        throw error;
    }
};

const readData = async (fileKey) => {
    const filePath = getFilePath(fileKey);
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }
        console.error(`Error reading or parsing ${filePath}:`, error);
        throw error;
    }
};

module.exports = {
    saveData,
    readData,
    FILE_KEYS, 
};