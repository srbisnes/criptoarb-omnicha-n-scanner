# CriptoArb Omnichaín Scanner

**Expert Arbitrage Dashboard powered by Cryptoya API**

Inventado y construido por **Elcryptoboy** — Arquitecto Omnichaín Web3.

## Features

- Escaneo en tiempo real de oportunidades de arbitraje entre exchanges LATAM (Argentina, Brasil, Chile, Colombia, México, Uruguay, Venezuela, etc.)
- Alimentado 100% por la API pública de [Cryptoya](https://criptoya.com/api)
- Detección automática de mejor compra (menor totalAsk) y mejor venta (mayor totalBid)
- Cálculo de spread % y profit por unidad
- Filtros por volumen, coin (USDT, BTC, ETH, USDC, DAI) y fiat
- Auto-refresh cada 60 segundos
- UI moderna dark-mode, responsive, production-ready

## Arquitectura

- **Frontend**: Next.js 14 App Router + Tailwind + TypeScript
- **API Route**: `/api/arbitrage` — proxy y motor de cálculo de oportunidades (evita CORS y respeta rate limits)
- **Data Source**: Cryptoya public API (actualización ~1 min, 120 req/min)

## Setup Local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Deploy

Listo para Vercel:

```bash
vercel --prod
```

## Variables

No requiere API keys. Todo es público.

## Disclaimer

Esto es una herramienta educativa e informativa. Los spreads mostrados no incluyen fees de retiro, slippage, transferencias cross-exchange ni riesgos operativos. Siempre verifica en los exchanges antes de operar.

---

**Elcryptoboy** — Combinando AI + Crypto + Blockchain + Web3 + Fintech + Omnichain Layers 0-1-2-3
