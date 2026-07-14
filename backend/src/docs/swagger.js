const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Netflix Clone Premium Backend API',
      version: '1.0.0',
      description: 'API for Streaming Platform utilizing a Modular Content Engine',
      contact: {
        name: 'Developer',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: [
    './src/modules/content/routes/*.js',
    './src/routes/*.js',
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
