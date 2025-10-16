import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchCoinDetails } from "../api/coingecko";
import type { CoinDetails } from "../types/coin";
import PriceChart from "../components/PriceChart";

export default function CoinDetails() {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<CoinDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchCoinDetails(id)
      .then(setCoin)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!coin) return <div style={{ padding: 20 }}>No data</div>;

  const zar = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" });
  const price = coin.market_data.current_price["zar"] ?? coin.market_data.current_price["usd"];
  const marketCap = coin.market_data.market_cap["zar"] ?? coin.market_data.market_cap["usd"];

  return (
    <div className="coin-details" style={{ margin: 20 }}>
      <div className="coin-main">
        <div className="coin-header">
          <Link to="/">
            <button className="back-button">← Back</button>
          </Link>
          <h1>
            {coin.name} <small className="muted">({coin.symbol.toUpperCase()})</small>
          </h1>
        </div>

        <section className="coin-description">
          <h3>Description</h3>
          <div dangerouslySetInnerHTML={{ __html: coin.description.en || "<i>No description available</i>" }} />
        </section>

        <PriceChart id={coin.id} />

        <section className="coin-supply">
          <h3>Supply</h3>
          <div className="muted">
            🔁 Total Supply: {coin.market_data.total_supply ?? "N/A"} <br />
            🌀 Circulating Supply: {coin.market_data.circulating_supply ?? "N/A"}
          </div>
        </section>
      </div>

      <aside className="coin-aside">
        <img className="coin-hero" src={coin.image.large} alt={coin.name} />
        <div style={{ marginTop: 12 }}>
          <div>💰 <strong>{zar.format(price)}</strong></div>
          <div className="muted">🏦 Market Cap: <strong>{zar.format(marketCap)}</strong></div>
          <div className="muted">📊 Rank: <strong>{coin.market_cap_rank}</strong></div>
        </div>
      </aside>
    </div>
  );
}
