const express = require('express');
const path = require('path');

require('dotenv').config()

// Creates express app
const app = express();

// Pull in routes file.
app.use('/api/', require('./routes/api/userCalls'));

// Serves static files
app.use(express.static('public'))

// Uses port from environment or 500 if none.
const PORT = process.env.PORT || 5000;

// Starts server
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));