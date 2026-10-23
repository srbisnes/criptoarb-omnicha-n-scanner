import { NextResponse } from "next/server";

const CRYPTOYA_BASE = "https://criptoya.com/api";

const COINS = ["USDT", "USDC", "BTC", "ETH", "DAI"];
const FIATS = ["ARS", "BRL", "CLP", "COP", "MXN", "UYU", "VES"];
const DEFAULT_VOLUME = 100;

interface Quote {
  ask: number;
  totalAsk: number;
  bid: number;
  totalBid: number;
  time: number;
}

interface ExchangeQuotes {
  [exchange: string]: Quote;
}

interface Opportunity {
  coin: string;
  fiat: string;
  volume: number;
  buyExchange: string;
  buyPrice: number;
  sellExchange: string;
  sellPrice: number;
  spreadPercent: number;
  profitPerUnit: number;
  timestamp: number;
}

async function fetchQuotes(coin: string, fiat: string, volume: number): Promise<ExchangeQuotes | null> {
  try {
    const res = await fetch(`${CRYPTOYA_BASE}/${coin}/${fiat}/${volume}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (typeof data === "string" && data.includes("Invalid")) return null;
    return data as ExchangeQuotes;
  } catch {
    return null;
  }
}

function findBestOpportunity(quotes: ExchangeQuotes, coin: string, fiat: string, volume: number): Opportunity | null {
  const entries = Object.entries(quotes).filter(([, q]) => q.totalAsk > 0 && q.totalBid > 0);
  if (entries.length < 2) return null;

  const bestBuy = entries.reduce((min, curr) => (curr[1].totalAsk < min[1].totalAsk ? curr : min));
  const bestSell = entries.reduce((max, curr) => (curr[1].totalBid > max[1].totalBid ? curr : max));

  if (bestBuy[0] === bestSell[0]) return null;

  const buyPrice = bestBuy[1].totalAsk;
  const sellPrice = bestSell[1].totalBid;
  const spreadPercent = ((sellPrice - buyPrice) / buyPrice) * 100;
  const profitPerUnit = sellPrice - buyPrice;

  if (spreadPercent < 0.1) return null;

  return {
    coin,
    fiat,
    volume,
    buyExchange: bestBuy[0],
    buyPrice,
    sellExchange: bestSell[0],
    sellPrice,
    spreadPercent: Number(spreadPercent.toFixed(3)),
    profitPerUnit: Number(profitPerUnit.toFixed(2)),
    timestamp: Date.now(),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const volume = Number(searchParams.get("volume")) || DEFAULT_VOLUME;
  const coinFilter = searchParams.get("coin") || "";
  const fiatFilter = searchParams.get("fiat") || "ARS";

  const coins = coinFilter ? [coinFilter] : COINS;
  const fiats = fiatFilter ? [fiatFilter] : FIATS;

  const opportunities: Opportunity[] = [];

  for (const coin of coins) {
    for (const fiat of fiats) {
      const quotes = await fetchQuotes(coin, fiat, volume);
      if (!quotes) continue;
      const opp = findBestOpportunity(quotes, coin, fiat, volume);
      if (opp && opp.spreadPercent > 0) {
        opportunities.push(opp);
      }
    }
  }

  opportunities.sort((a, b) => b.spreadPercent - a.spreadPercent);

  return NextResponse.json({
    success: true,
    count: opportunities.length,
    volume,
    opportunities: opportunities.slice(0, 50),
    updatedAt: new Date().toISOString(),
    source: "Cryptoya API",
  });
}
