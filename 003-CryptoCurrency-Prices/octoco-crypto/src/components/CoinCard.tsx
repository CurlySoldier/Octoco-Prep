import type { CoinMarket } from "../types/coin";
import { Link } from "react-router-dom";

export default function CoinCard({ coin }: { coin: CoinMarket }) {
  const priceFormatter = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  });

  return (
    <div className="coin-card">
      <div className="coin-meta">
  <img className="coin-thumb" src={coin.image} alt={coin.name} />
        <div className="coin-info">
          <strong>
            {coin.market_cap_rank}. {coin.name}
          </strong>
          <div>({coin.symbol.toUpperCase()})</div>
          <div className="coin-price">{priceFormatter.format(coin.current_price)}</div>
        </div>
      </div>

      <Link to={`/coin/${coin.id}`}>
        <button>Details</button>
      </Link>
    </div>
  );
}
