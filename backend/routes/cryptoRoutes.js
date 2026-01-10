const express = require('express');
const axios = require('axios');
const router = express.Router();

// Cache pour éviter trop de requêtes à CoinGecko
let cachedData = null;
let lastFetch = 0;
const CACHE_DURATION = 60000; // 1 minute

// Données de fallback en cas d'erreur
const FALLBACK_CRYPTOS = [
  { name: "Bitcoin", symbol: "BTC", price_usd: 42000 },
  { name: "Ethereum", symbol: "ETH", price_usd: 2200 },
  { name: "Binance Coin", symbol: "BNB", price_usd: 310 },
  { name: "Cardano", symbol: "ADA", price_usd: 0.45 },
  { name: "Solana", symbol: "SOL", price_usd: 98 },
  { name: "Ripple", symbol: "XRP", price_usd: 0.52 },
  { name: "Polkadot", symbol: "DOT", price_usd: 7.2 },
  { name: "Dogecoin", symbol: "DOGE", price_usd: 0.08 },
  { name: "Avalanche", symbol: "AVAX", price_usd: 36 },
  { name: "Chainlink", symbol: "LINK", price_usd: 14.5 }
];

router.get('/', async (req, res) => {
  try {
    // Si on a des données en cache et qu'elles sont récentes
    const now = Date.now();
    if (cachedData && (now - lastFetch) < CACHE_DURATION) {
      console.log("✅ Utilisation du cache");
      return res.json(cachedData);
    }

    // Sinon, on essaie de récupérer depuis CoinGecko
    console.log("🔄 Récupération depuis CoinGecko...");
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 10,
          page: 1,
          sparkline: false
        },
        timeout: 5000
      }
    );

    const formatted = data.map(c => ({
      name: c.name,
      symbol: c.symbol.toUpperCase(),
      price_usd: c.current_price
    }));

    // Mise en cache
    cachedData = formatted;
    lastFetch = now;

    console.log("✅ Données récupérées et mises en cache");
    res.json(formatted);

  } catch (err) {
    console.error("❌ Erreur CoinGecko :", err.response?.status || err.message);

    // Si on a des données en cache (même anciennes), on les retourne
    if (cachedData) {
      console.log("⚠️ Utilisation du cache (ancien)");
      return res.json(cachedData);
    }

    // Sinon, on retourne les données de fallback
    console.log("⚠️ Utilisation des données de fallback");
    res.json(FALLBACK_CRYPTOS);
  }
});

module.exports = router;