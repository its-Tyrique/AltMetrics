
import axios from 'axios';

export interface CryptoData {
  [key: string]: {
    usd: number;
    usd_market_cap: number;
  };
}

export interface CryptoSnapshot {
  coin: string;
  price_usd: number;
  market_cap_usd: number;
  timestamp: string;
}

export interface ApiResponse {
  data: CryptoSnapshot[];
  source: 'cache' | 'fresh_api';
}

// Call Crypto endpoint
export async function fetchCryptoData(): Promise<ApiResponse> {
  const response = await axios.get<ApiResponse>('http://localhost:8080/api/crypto');
  return response.data;
}