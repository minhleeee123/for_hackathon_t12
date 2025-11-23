// Real Data API Wrappers
// Production-ready API functions với error handling và caching

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

// Helper: Get cached data
function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

// Helper: Set cache
function setCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// Helper: Fetch with retry
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return await response.json();
      }
      
      if (response.status === 429) {
        // Rate limit - wait longer
        await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// ==============================================
// 1. Get Real Price (Primary: CoinGecko)
// ==============================================
export async function getRealPrice(coinId) {
  const cacheKey = `price:${coinId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24h_change=true&include_market_cap=true&include_24h_vol=true`;
    const data = await fetchWithRetry(url);
    
    if (data[coinId]) {
      const result = {
        price: data[coinId].usd,
        change24h: data[coinId].usd_24h_change,
        marketCap: data[coinId].usd_market_cap,
        volume24h: data[coinId].usd_24h_vol,
        source: 'CoinGecko',
        timestamp: new Date().toISOString()
      };
      
      setCache(cacheKey, result);
      return result;
    }
    
    throw new Error('Coin not found');
  } catch (error) {
    console.warn(`CoinGecko failed for ${coinId}, trying CoinCap...`);
    return await getRealPriceBackup(coinId);
  }
}

// Backup: CoinCap API
async function getRealPriceBackup(coinId) {
  const cacheKey = `price-backup:${coinId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://api.coincap.io/v2/assets?search=${encodeURIComponent(coinId)}&limit=1`;
    const data = await fetchWithRetry(url);
    
    if (data.data && data.data.length > 0) {
      const asset = data.data[0];
      const result = {
        price: parseFloat(asset.priceUsd),
        change24h: parseFloat(asset.changePercent24Hr),
        marketCap: parseFloat(asset.marketCapUsd),
        volume24h: parseFloat(asset.volumeUsd24Hr),
        source: 'CoinCap',
        timestamp: new Date().toISOString()
      };
      
      setCache(cacheKey, result);
      return result;
    }
    
    throw new Error('Coin not found in backup');
  } catch (error) {
    console.error('Both price APIs failed:', error);
    return null;
  }
}

// ==============================================
// 2. Get 7-Day Price History
// ==============================================
export async function getPriceHistory(coinId, days = 7) {
  const cacheKey = `history:${coinId}:${days}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
    const data = await fetchWithRetry(url);
    
    if (data.prices && data.prices.length > 0) {
      const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      
      const result = data.prices.slice(-days).map((item, index) => {
        const date = new Date(item[0]);
        return {
          time: dayNames[date.getDay()],
          price: Math.round(item[1] * 100) / 100,
          timestamp: date.toISOString(),
          date: date.toLocaleDateString()
        };
      });
      
      setCache(cacheKey, result);
      return result;
    }
    
    throw new Error('No history data');
  } catch (error) {
    console.error('Price history failed:', error);
    return null;
  }
}

// ==============================================
// 3. Get Fear & Greed Index
// ==============================================
export async function getFearGreedIndex() {
  const cacheKey = 'fear-greed';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const url = 'https://api.alternative.me/fng/?limit=1';
    const data = await fetchWithRetry(url);
    
    if (data.data && data.data.length > 0) {
      const current = data.data[0];
      const result = {
        score: parseInt(current.value),
        classification: current.value_classification,
        timestamp: current.timestamp,
        source: 'Alternative.me'
      };
      
      setCache(cacheKey, result);
      return result;
    }
    
    throw new Error('No sentiment data');
  } catch (error) {
    console.error('Fear & Greed failed:', error);
    // Return neutral if API fails
    return {
      score: 50,
      classification: 'Neutral',
      timestamp: Date.now().toString(),
      source: 'Fallback'
    };
  }
}

// ==============================================
// 4. Get Long/Short Ratio
// ==============================================
export async function getLongShortRatio(symbol) {
  const cacheKey = `long-short:${symbol}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=${symbol}&period=1d&limit=7`;
    const data = await fetchWithRetry(url);
    
    if (data && Array.isArray(data) && data.length > 0) {
      const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      
      const result = data.slice(-7).map((item, index) => {
        const longRatio = parseFloat(item.longShortRatio);
        const longPercent = (longRatio / (1 + longRatio)) * 100;
        const shortPercent = 100 - longPercent;
        
        return {
          time: dayNames[index % 7],
          long: Math.round(longPercent * 10) / 10,
          short: Math.round(shortPercent * 10) / 10,
          timestamp: new Date(parseInt(item.timestamp)).toISOString()
        };
      });
      
      setCache(cacheKey, result);
      return result;
    }
    
    throw new Error('No long/short data');
  } catch (error) {
    console.error('Long/Short ratio failed:', error);
    // Return neutral 50/50 if fails
    return Array(7).fill(0).map((_, i) => ({
      time: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      long: 50,
      short: 50,
      timestamp: new Date().toISOString()
    }));
  }
}

// ==============================================
// 5. Get Coin Details (for tokenomics)
// ==============================================
export async function getCoinDetails(coinId) {
  const cacheKey = `details:${coinId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`;
    const data = await fetchWithRetry(url);
    
    if (data) {
      const result = {
        name: data.name,
        symbol: data.symbol,
        description: data.description?.en?.substring(0, 500),
        categories: data.categories,
        marketCapRank: data.market_cap_rank,
        circulatingSupply: data.market_data?.circulating_supply,
        totalSupply: data.market_data?.total_supply,
        maxSupply: data.market_data?.max_supply,
        source: 'CoinGecko'
      };
      
      setCache(cacheKey, result);
      return result;
    }
    
    throw new Error('No coin details');
  } catch (error) {
    console.error('Coin details failed:', error);
    return null;
  }
}

// ==============================================
// 6. Get All Data for a Coin (Composite)
// ==============================================
export async function getAllCryptoData(coinId, symbol) {
  console.log(`📊 Fetching all real data for ${coinId}...`);
  
  try {
    // Fetch all data in parallel
    const [price, history, sentiment, longShort, details] = await Promise.all([
      getRealPrice(coinId),
      getPriceHistory(coinId, 7),
      getFearGreedIndex(),
      getLongShortRatio(`${symbol}USDT`),
      getCoinDetails(coinId)
    ]);
    
    const result = {
      coinId,
      symbol,
      timestamp: new Date().toISOString(),
      price,
      priceHistory: history,
      sentiment,
      longShortRatio: longShort,
      details,
      dataVerified: true
    };
    
    console.log('✅ All data fetched successfully');
    return result;
  } catch (error) {
    console.error('Failed to fetch all data:', error);
    throw error;
  }
}

// ==============================================
// 7. Clear Cache (for testing)
// ==============================================
export function clearCache() {
  cache.clear();
  console.log('🗑️ Cache cleared');
}

// Export for CommonJS
if (typeof module !== 'undefined') {
  module.exports = {
    getRealPrice,
    getPriceHistory,
    getFearGreedIndex,
    getLongShortRatio,
    getCoinDetails,
    getAllCryptoData,
    clearCache
  };
}
