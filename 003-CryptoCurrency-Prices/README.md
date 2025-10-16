# CryptoCurrency Prices App

A React + TypeScript app to view cryptocurrency prices, market cap, and details. Uses Vite for fast development and CoinGecko API for data.

## Prerequisites
- Node.js (v18+ recommended)
- npm
- Docker (optional) 
- docker compose

## Note
- If you are in the root of the repo you need to run 
```bash
cd 003-CryptoCurrency-Prices
```
to get to the project root


---

## 1. Running with Docker

### Build and Start the Container
1. Ensure Docker is installed on your device.
2. In the project root, build the Docker image:
   ```bash
   docker compose up
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
- Configuration (port, etc.) can be adjusted in `vite.config.ts`.
