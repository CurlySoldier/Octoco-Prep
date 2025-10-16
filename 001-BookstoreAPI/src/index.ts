/**
 * @openapi
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         genre:
 *           type: string
 *         price:
 *           type: number
 *         createdat:
 *           type: string
 *           format: date-time
 */
// app.ts  
import express from 'express';  
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import booksRouter from './routes/books';
  
const app = express();  

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());  

app.use('/books', booksRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
