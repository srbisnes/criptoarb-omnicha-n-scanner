"use client";

import { useEffect, useState } from "react";
import { RefreshCw, TrendingUp, Zap, Globe } from "lucide-react";

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

export default function Home() {
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [volume, setVolume] = useState(100);
  const [coin, setCoin] = useState("");
  const [fiat, setFiat] = useState("ARS");
  const [lastUpdate, setLastUpdate] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        volume: volume.toString(),
        ...(coin && { coin }),
        fiat,
      });
      const res = await fetch(`/api/arbitrage?${params}`);
      const data = await res.json();
      setOpps(data.opportunities || []);
      setLastUpdate(data.updatedAt || "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [volume, coin, fiat]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent">
            CriptoArb Omnichaín Scanner
          </h1>
        </div>
        <p className="text-slate-400 flex items-center gap-2">
          <Globe className="w-4 h-4" /> Powered by Cryptoya API • Expert LATAM Arbitrage by Elcryptoboy
        </p>
      </header>

      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-sm text-slate-400 block mb-1">Volumen</label>
          <input
            type="number"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 w-28"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400 block mb-1">Coin</label>
          <select
            value={coin}
            onChange={(e) => setCoin(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2"
          >
            <option value="">Todas</option>
            <option value="USDT">USDT</option>
            <option value="USDC">USDC</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="DAI">DAI</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-400 block mb-1">Fiat</label>
          <select
            value={fiat}
            onChange={(e) => setFiat(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2"
          >
            <option value="ARS">ARS</option>
            <option value="BRL">BRL</option>
            <option value="CLP">CLP</option>
            <option value="COP">COP</option>
            <option value="MXN">MXN</option>
            <option value="UYU">UYU</option>
            <option value="VES">VES</option>
          </select>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded font-medium disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            Oportunidades de Arbitraje ({opps.length})
          </h2>
          {lastUpdate && (
            <span className="text-sm text-slate-500">
              Actualizado: {new Date(lastUpdate).toLocaleTimeString()}
            </span>
          )}
        </div>

        {loading && opps.length === 0 ? (
          <div className="text-center py-20 text-slate-400">Cargando oportunidades...</div>
        ) : opps.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No se encontraron oportunidades significativas.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-4 py-3 text-left">Par</th>
                  <th className="px-4 py-3 text-left">Comprar en</th>
                  <th className="px-4 py-3 text-right">Precio Compra</th>
                  <th className="px-4 py-3 text-left">Vender en</th>
                  <th className="px-4 py-3 text-right">Precio Venta</th>
                  <th className="px-4 py-3 text-right">Spread %</th>
                  <th className="px-4 py-3 text-right">Profit / unidad</th>
                </tr>
              </thead>
              <tbody>
                {opps.map((opp, i) => (
                  <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/50">
                    <td className="px-4 py-3 font-medium">
                      {opp.coin}/{opp.fiat}
                    </td>
                    <td className="px-4 py-3 text-cyan-400">{opp.buyExchange}</td>
                    <td className="px-4 py-3 text-right">{opp.buyPrice.toLocaleString()}</td>
                    <td className="px-4 py-3 text-emerald-400">{opp.sellExchange}</td>
                    <td className="px-4 py-3 text-right">{opp.sellPrice.toLocaleString()}</td>
                    <td className={`px-4 py-3 text-right font-bold ${opp.spreadPercent > 1 ? "text-green-400" : "text-yellow-400"}`}>
                      {opp.spreadPercent.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right text-green-300">
                      {opp.profitPerUnit.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <footer className="max-w-7xl mx-auto mt-12 text-center text-slate-500 text-sm">
        Datos en tiempo real de Cryptoya.com • No es consejo financiero • Elcryptoboy Omnichain Solutions
      </footer>
    </div>
  );
}
