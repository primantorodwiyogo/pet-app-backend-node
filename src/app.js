/**
 * =========================================
 * APP INITIALIZATION
 * =========================================
 */
require('dotenv').config();

const express = require('express');
const app = express();

/**
 * =========================================
 * CORE MIDDLEWARE
 * =========================================
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * =========================================
 * DATABASE INITIALIZATION
 * =========================================
 */
require('./config/database'); // init sequelize connection
require('./models'); // load & register model relations

/**
 * =========================================
 * API DOCUMENTATION (SWAGGER)
 * =========================================
 */
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * =========================================
 * ROUTES
 * =========================================
 */
const routes = require('./routes');
app.use('/', routes);

/**
 * =========================================
 * GLOBAL ERROR HANDLER (OPTIONAL BUT CLEAN)
 * =========================================
 */
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
  });
});

/**
 * =========================================
 * EXPORT APP
 * =========================================
 */
module.exports = app;
