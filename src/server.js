const express = require('express');
const apiRoutes = require('./routes/api.routes'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 

app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
});