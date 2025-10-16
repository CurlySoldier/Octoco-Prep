import type { CoinMarket } from "../types/coin";
import CoinCard from "./CoinCard";

export default function CoinList({ coins }: { coins: CoinMarket[] }) {
  return (
    <div className="coin-list" style={{ display: "grid", gap: 12 }}>
      {coins.map((coin) => (
        <CoinCard key={coin.id} coin={coin} />
      ))}
    </div>
  );
}
