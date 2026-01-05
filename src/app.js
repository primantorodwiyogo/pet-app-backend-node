const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes/index'); // 👈 PENTING

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

module.exports = app;
