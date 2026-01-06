const express = require('express');
const path = require('path');
const cors = require('cors');

const routes = require('./routes');

/**
 * ======================
 * INIT APP (WAJIB PALING ATAS)
 * ======================
 */
const app = express();

/**
 * ======================
 * GLOBAL MIDDLEWARE
 * ======================
 */
app.use(cors());

// ⬇️ INI HARUS SETELAH app dibuat
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * ======================
 * STATIC FILES
 * ======================
 */
app.use(
    '/uploads',
    express.static(path.join(__dirname, 'uploads'))
);

/**
 * ======================
 * ROUTES
 * ======================
 */
app.use('/api', routes);

/**
 * ======================
 * ERROR HANDLER
 * ======================
 */
app.use((err, req, res, next) => {
    console.error('GLOBAL ERROR:', err);
    res.status(500).json({
        error: err.message || 'Internal Server Error'
    });
});

module.exports = app;
