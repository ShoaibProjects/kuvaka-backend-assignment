// Load environment variables from a .env file into process.env
require('dotenv').config();

const express = require('express');
const apiRoutes = require('./routes/api.routes'); // Import the router for our API endpoints

const app = express();

// Middleware to parse incoming JSON payloads
app.use(express.json()); 

// All routes defined in api.routes.js will be prefixed with /api.
app.use('/api', apiRoutes);

// Export the app for Vercel functions
module.exports = app;

// Conditionally start the server for local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`API available at http://localhost:${PORT}/api`);
    });
}