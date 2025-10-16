export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
}

export interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  market_data: {
    current_price: { [currency: string]: number };
    market_cap: { [currency: string]: number };
    total_supply: number | null;
    circulating_supply: number | null;
  };
  description: { en: string };
  market_cap_rank: number | null;
  image: { thumb: string; small: string; large: string };
}
