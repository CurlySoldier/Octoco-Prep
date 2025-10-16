import axios from "axios";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export async function fetchMarketChart(id: string, range: "1d" | "1m" | "1y") {
  const days = range === "1d" ? 1 : range === "1m" ? 30 : 365;
  try {
    const res = await axios.get(`${COINGECKO_BASE}/coins/${id}/market_chart`, {
      params: { vs_currency: "zar", days },
    });
    return res.data;
  } catch (err) {
    console.warn("fetchMarketChart failed, generating mock series", err);
    // generate simple sine wave mock series
    const now = Date.now();
    const points: number[][] = [];
    if (range === "1d") {
      // per-hour points for 24 hours
      for (let i = 0; i < 24; i++) {
        const ts = now - (24 - i) * 60 * 60 * 1000;
        const price = 10000 + Math.sin(i / 3) * 2000 + (Math.random() - 0.5) * 400;
        points.push([ts, price]);
      }
    } else if (range === "1m") {
      // daily points for 30 days
      for (let i = 0; i < 30; i++) {
        const ts = now - (30 - i) * 24 * 60 * 60 * 1000;
        const price = 10000 + Math.sin(i / 3) * 2000 + (Math.random() - 0.5) * 400;
        points.push([ts, price]);
      }
    } else {
      // daily points for 365 days
      for (let i = 0; i < 365; i++) {
        const ts = now - (365 - i) * 24 * 60 * 60 * 1000;
        const price = 10000 + Math.sin(i / 20) * 2000 + (Math.random() - 0.5) * 800;
        points.push([ts, price]);
      }
    }
    return { prices: points };
  }
}
