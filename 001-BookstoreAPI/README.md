# API Documentation & Testing

This project automatically generates an OpenAPI (Swagger) specification from JSDoc comments in the code using `swagger-jsdoc`.

You can view and test the API interactively using Swagger UI:

1. Start the server:
   ```bash
   npm start
   ```
2. Open your browser and go to [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
   - The Swagger UI page will appear, showing all documented endpoints and models.
   - You can try out requests directly from the browser.

The OpenAPI spec is generated from JSDoc comments in `src/index.ts` and served at `/api-docs`.

If you add or change routes, update the JSDoc comments to keep the documentation in sync.
# BookstoreAPI

This project is a simple Bookstore API built with TypeScript, Node.js, and Express. It provides endpoints for managing books and calculating discounts.

## Prerequisites
- Node.js (v18+ recommended)
- npm
- Docker (optional)

---

## 1. Running with Docker

### Build and Start the Container
1. Ensure Docker is installed on your device.
2. In the project root, build the Docker image:
   ```bash
   docker build -t bookstore-api .
   ```
3. Run the container:
   ```bash
   docker run -p 3000:3000 bookstore-api
   ```
4. The API will be available at `http://localhost:3000`.

---

## 2. Running Outside Docker

### Install Dependencies
1. Install Node.js and npm if not already installed.
2. In the project root, install dependencies:
   ```bash
   npm install
   ```

### Start the API
3. Run the development server:
   ```bash
   npm run dev
   ```
   Or build and start for production:
   ```bash
   npm run build
   npm start
   ```
4. The API will be available at `http://localhost:3000`.

---

## API Documentation
- See `src/openAPI.yml` for OpenAPI (Swagger) documentation.

## Notes
- Configuration (port, etc.) can be adjusted in `src/index.ts`.
- For testing, run:
  ```bash
  npm test
  ```
