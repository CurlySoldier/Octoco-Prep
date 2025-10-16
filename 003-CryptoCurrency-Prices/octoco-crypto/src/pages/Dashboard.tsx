import { useEffect, useState } from "react";
import { fetchTopCoins } from "../api/coingecko";
import type { CoinMarket } from "../types/coin";
import CoinList from "../components/CoinList";

export default function Dashboard() {
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchTopCoins(10);
        setCoins(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load coins.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Top 10 Cryptocurrencies</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && <CoinList coins={coins} />}
    </div>
  );
}
