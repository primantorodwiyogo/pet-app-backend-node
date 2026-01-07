const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet App API',
      version: '1.0.0',
      description: 'API for Pet Adoption & Services App'
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },

  // ⬇️ INI YANG PENTING
  apis: [path.join(__dirname, '../routes/*.js')]
};

module.exports = swaggerJsdoc(options);
