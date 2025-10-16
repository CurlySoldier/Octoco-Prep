# CryptoCurrency Prices App

A React + TypeScript app to view cryptocurrency prices, market cap, and details. Uses Vite for fast development and CoinGecko API for data.

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
   docker build -t crypto-prices-app .
   ```
3. Run the container:
   ```bash
   docker run -p 5173:5173 crypto-prices-app
   ```
4. The app will be available at `http://localhost:5173`.

---

## 2. Running Outside Docker

### Install Dependencies
1. Install Node.js and npm if not already installed.
2. In the project root, install dependencies:
   ```bash
   npm install
   ```

### Start the App
3. Run the development server:
   ```bash
   npm run dev
   ```
   Or build and preview for production:
   ```bash
   npm run build
   npm run preview
   ```
4. The app will be available at `http://localhost:5173`.

---

## Notes
- API requests use CoinGecko; no API key required.
- For testing, run:
  ```bash
  npm test
  ```
- Configuration (port, etc.) can be adjusted in `vite.config.ts`.
