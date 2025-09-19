// Load environment variables from a .env file into process.env
require('dotenv').config();

const express = require('express');
const apiRoutes = require('./routes/api.routes'); // Import the router for our API endpoints

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON payloads
app.use(express.json()); 

// All routes defined in api.routes.js will be prefixed with /api.
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
});