import axios from "axios";
import type { CoinMarket, CoinDetails } from "../types/coin";
import topCoinsMock from "../mocks/top-coins.json";
import bitcoinDetailsMock from "../mocks/bitcoin-details.json";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

/**
 * Get top coins by market cap.
 */
export async function fetchTopCoins(limit = 10): Promise<CoinMarket[]> {
  try {
    const res = await axios.get<CoinMarket[]>(`${COINGECKO_BASE}/coins/markets`, {
      params: {
        // Request prices denominated in South African Rands
        vs_currency: "zar",
        order: "market_cap_desc",
        per_page: limit,
        page: 1,
        sparkline: false,
      },
    });
    return res.data;
  } catch (err: any) {
    // If rate-limited or offline, fall back to local mock data for development
    console.warn("fetchTopCoins failed, returning mock data:", err?.message || err);
    return (topCoinsMock as unknown) as CoinMarket[];
  }
}

/**
 * Get details for a specific coin by ID.
 */
export async function fetchCoinDetails(id: string): Promise<CoinDetails> {
  try {
    const res = await axios.get<CoinDetails>(`${COINGECKO_BASE}/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });
    return res.data;
  } catch (err: any) {
    console.warn("fetchCoinDetails failed, returning mock data:", err?.message || err);
    // return bitcoin mock for development regardless of id
    return (bitcoinDetailsMock as unknown) as CoinDetails;
  }
}
