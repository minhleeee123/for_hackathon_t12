// Test Real Data APIs for Crypto Analysis
// Run: node test-api/testCryptoAPIs.js

// ==============================================
// 1. CoinGecko API - Price Data
// ==============================================
async function testCoinGeckoPrice(coinId = "bitcoin") {
  console.log("\n🔍 Testing CoinGecko Price API...");
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24h_change=true&include_market_cap=true&include_24h_vol=true`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("✅ CoinGecko Price Data:");
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("❌ CoinGecko Error:", error.message);
    return null;
  }
}

// ==============================================
// 2. CoinGecko API - 7 Day Price History
// ==============================================
async function testCoinGeckoHistory(coinId = "bitcoin", days = 7) {
  console.log("\n🔍 Testing CoinGecko Price History API...");
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("✅ CoinGecko 7-Day History:");
    console.log(`Total data points: ${data.prices?.length || 0}`);
    
    // Format for our app
    const formatted = data.prices?.slice(-7).map((item, index) => ({
      time: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index] || `Day ${index + 1}`,
      price: Math.round(item[1] * 100) / 100,
      timestamp: new Date(item[0]).toISOString()
    }));
    
    console.log("Formatted for app:");
    console.log(JSON.stringify(formatted, null, 2));
    return formatted;
  } catch (error) {
    console.error("❌ CoinGecko History Error:", error.message);
    return null;
  }
}

// ==============================================
// 3. Alternative.me - Fear & Greed Index
// ==============================================
async function testFearGreedIndex() {
  console.log("\n🔍 Testing Fear & Greed Index API...");
  try {
    const url = "https://api.alternative.me/fng/?limit=7";
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("✅ Fear & Greed Index:");
    console.log(JSON.stringify(data.data[0], null, 2));
    
    // Current sentiment
    const current = data.data[0];
    console.log(`\nCurrent Sentiment: ${current.value}/100 (${current.value_classification})`);
    
    return {
      score: parseInt(current.value),
      classification: current.value_classification,
      timestamp: current.timestamp
    };
  } catch (error) {
    console.error("❌ Fear & Greed Error:", error.message);
    return null;
  }
}

// ==============================================
// 4. CoinCap API - Real-time Price (Backup)
// ==============================================
async function testCoinCapPrice(searchQuery = "bitcoin") {
  console.log("\n🔍 Testing CoinCap API...");
  try {
    const url = `https://api.coincap.io/v2/assets?search=${encodeURIComponent(searchQuery)}&limit=1`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const asset = data.data[0];
      console.log("✅ CoinCap Data:");
      console.log(JSON.stringify({
        id: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        price: parseFloat(asset.priceUsd).toFixed(2),
        marketCap: parseFloat(asset.marketCapUsd).toFixed(0),
        volume24h: parseFloat(asset.volumeUsd24Hr).toFixed(0),
        changePercent24h: parseFloat(asset.changePercent24Hr).toFixed(2)
      }, null, 2));
      
      return {
        price: parseFloat(asset.priceUsd),
        symbol: asset.symbol,
        name: asset.name
      };
    }
    return null;
  } catch (error) {
    console.error("❌ CoinCap Error:", error.message);
    return null;
  }
}

// ==============================================
// 5. CoinGecko - Coin Details (for Tokenomics)
// ==============================================
async function testCoinGeckoDetails(coinId = "bitcoin") {
  console.log("\n🔍 Testing CoinGecko Coin Details API...");
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("✅ Coin Details:");
    console.log(JSON.stringify({
      name: data.name,
      symbol: data.symbol,
      description: data.description?.en?.substring(0, 200) + "...",
      categories: data.categories,
      marketCapRank: data.market_cap_rank,
      circulatingSupply: data.market_data?.circulating_supply,
      totalSupply: data.market_data?.total_supply,
      maxSupply: data.market_data?.max_supply
    }, null, 2));
    
    return data;
  } catch (error) {
    console.error("❌ Coin Details Error:", error.message);
    return null;
  }
}

// ==============================================
// 6. Binance API - Long/Short Ratio
// ==============================================
async function testBinanceLongShortRatio(symbol = "BTCUSDT") {
  console.log("\n🔍 Testing Binance Long/Short Ratio API...");
  try {
    const url = `https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=${symbol}&period=1d&limit=7`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("✅ Binance Long/Short Ratio:");
    
    // Format for our app
    const formatted = data.slice(-7).map((item, index) => {
      const longRatio = parseFloat(item.longShortRatio);
      const longPercent = (longRatio / (1 + longRatio)) * 100;
      const shortPercent = 100 - longPercent;
      
      return {
        time: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index] || `Day ${index + 1}`,
        long: Math.round(longPercent * 10) / 10,
        short: Math.round(shortPercent * 10) / 10,
        timestamp: new Date(parseInt(item.timestamp)).toISOString()
      };
    });
    
    console.log(JSON.stringify(formatted, null, 2));
    return formatted;
  } catch (error) {
    console.error("❌ Binance Error:", error.message);
    return null;
  }
}

// ==============================================
// 7. CryptoCompare - Multiple Coins Compare
// ==============================================
async function testCryptoCompare(symbols = ["BTC", "ETH", "SOL"]) {
  console.log("\n🔍 Testing CryptoCompare API...");
  try {
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbols.join(",")}&tsyms=USD`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("✅ CryptoCompare Multi-Coin Data:");
    
    const formatted = {};
    for (const symbol of symbols) {
      if (data.RAW?.[symbol]?.USD) {
        const coinData = data.RAW[symbol].USD;
        formatted[symbol] = {
          price: coinData.PRICE,
          change24h: coinData.CHANGEPCT24HOUR,
          marketCap: coinData.MKTCAP,
          volume24h: coinData.TOTALVOLUME24HTO
        };
      }
    }
    
    console.log(JSON.stringify(formatted, null, 2));
    return formatted;
  } catch (error) {
    console.error("❌ CryptoCompare Error:", error.message);
    return null;
  }
}

// ==============================================
// 8. Test All APIs for a Specific Coin
// ==============================================
async function testAllAPIsForCoin(coinId = "bitcoin", coinSymbol = "BTC") {
  console.log("\n" + "=".repeat(60));
  console.log(`🚀 TESTING ALL APIs FOR: ${coinId.toUpperCase()}`);
  console.log("=".repeat(60));
  
  const results = {
    coinId,
    timestamp: new Date().toISOString(),
    apis: {}
  };
  
  // Test each API
  results.apis.coinGeckoPrice = await testCoinGeckoPrice(coinId);
  await sleep(1000); // Rate limit protection
  
  results.apis.priceHistory = await testCoinGeckoHistory(coinId, 7);
  await sleep(1000);
  
  results.apis.fearGreed = await testFearGreedIndex();
  await sleep(1000);
  
  results.apis.coinCapPrice = await testCoinCapPrice(coinId);
  await sleep(1000);
  
  results.apis.coinDetails = await testCoinGeckoDetails(coinId);
  await sleep(1000);
  
  results.apis.longShortRatio = await testBinanceLongShortRatio(`${coinSymbol}USDT`);
  
  console.log("\n" + "=".repeat(60));
  console.log("📊 SUMMARY");
  console.log("=".repeat(60));
  console.log(`Price (CoinGecko): ${results.apis.coinGeckoPrice?.[coinId]?.usd ? '✅' : '❌'}`);
  console.log(`Price History: ${results.apis.priceHistory ? '✅' : '❌'}`);
  console.log(`Fear & Greed: ${results.apis.fearGreed ? '✅' : '❌'}`);
  console.log(`CoinCap Price: ${results.apis.coinCapPrice ? '✅' : '❌'}`);
  console.log(`Coin Details: ${results.apis.coinDetails ? '✅' : '❌'}`);
  console.log(`Long/Short Ratio: ${results.apis.longShortRatio ? '✅' : '❌'}`);
  
  return results;
}

// ==============================================
// Helper: Sleep function
// ==============================================
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ==============================================
// RUN TESTS
// ==============================================
async function main() {
  console.log("🔬 CRYPTO API TESTING SUITE");
  console.log("Testing real-time cryptocurrency data APIs\n");
  
  // Test individual APIs
  // await testCoinGeckoPrice("bitcoin");
  // await testCoinGeckoHistory("bitcoin", 7);
  // await testFearGreedIndex();
  // await testCoinCapPrice("bitcoin");
  // await testBinanceLongShortRatio("BTCUSDT");
  // await testCryptoCompare(["BTC", "ETH", "SOL"]);
  
  // Test all APIs for a coin
  await testAllAPIsForCoin("bitcoin", "BTC");
  
  console.log("\n✅ Testing Complete!");
}

// Run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  main().catch(console.error);
}

// Export for use in other files
if (typeof module !== 'undefined') {
  module.exports = {
    testCoinGeckoPrice,
    testCoinGeckoHistory,
    testFearGreedIndex,
    testCoinCapPrice,
    testCoinGeckoDetails,
    testBinanceLongShortRatio,
    testCryptoCompare,
    testAllAPIsForCoin
  };
}
