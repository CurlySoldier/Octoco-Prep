import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bookstore API',
      version: '1.0.0',
      description: 'API for managing books and calculating discounts',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/books.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;