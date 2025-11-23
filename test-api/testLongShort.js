// Test Binance Long/Short Ratio API
console.log("🔍 Testing Binance Long/Short Ratio API...\n");

async function testLongShortRatio(symbol = "BTCUSDT") {
  console.log(`Testing for symbol: ${symbol}`);
  console.log("=" .repeat(60));
  
  try {
    // Try multiple endpoints
    const endpoints = [
      `https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=${symbol}&period=1d&limit=7`,
      `https://fapi.binance.com/fapi/v1/globalLongShortAccountRatio?symbol=${symbol}&period=1d&limit=7`,
      `https://www.binance.com/fapi/v1/globalLongShortAccountRatio?symbol=${symbol}&period=1d&limit=7`
    ];
    
    let url = endpoints[0]; // Try first endpoint
    console.log("📡 API URL:", url);
    console.log("\n⏳ Fetching data...\n");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    console.log("📊 Response Status:", response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error Response:", errorText);
      return null;
    }
    
    const data = await response.json();
    
    console.log("\n✅ SUCCESS! Raw Data:");
    console.log(JSON.stringify(data, null, 2));
    
    // Format for our app
    console.log("\n📈 Formatted Data for App:");
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    const formatted = data.map((item, index) => {
      const date = new Date(parseInt(item.timestamp));
      const longRatio = parseFloat(item.longShortRatio);
      
      // Calculate percentages
      const longPercent = (longRatio / (1 + longRatio)) * 100;
      const shortPercent = 100 - longPercent;
      
      return {
        time: dayNames[date.getDay()],
        long: Math.round(longPercent * 10) / 10,
        short: Math.round(shortPercent * 10) / 10,
        rawRatio: item.longShortRatio,
        longAccount: item.longAccount,
        shortAccount: item.shortAccount,
        timestamp: date.toISOString(),
        date: date.toLocaleDateString()
      };
    });
    
    console.log(JSON.stringify(formatted, null, 2));
    
    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 SUMMARY");
    console.log("=".repeat(60));
    console.log(`Symbol: ${symbol}`);
    console.log(`Data Points: ${formatted.length}`);
    console.log(`Latest Long/Short: ${formatted[formatted.length - 1].long}% / ${formatted[formatted.length - 1].short}%`);
    console.log(`Average Long: ${(formatted.reduce((sum, item) => sum + item.long, 0) / formatted.length).toFixed(1)}%`);
    console.log(`Average Short: ${(formatted.reduce((sum, item) => sum + item.short, 0) / formatted.length).toFixed(1)}%`);
    
    return formatted;
    
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    
    if (error.name === 'AbortError') {
      console.error("⏱️ Request timeout after 10 seconds");
    }
    
    return null;
  }
}

// Test multiple coins
async function testMultipleCoins() {
  const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
  
  console.log("🚀 Testing Multiple Coins\n");
  
  for (const symbol of symbols) {
    console.log("\n" + "=".repeat(70));
    const result = await testLongShortRatio(symbol);
    
    if (result) {
      console.log(`✅ ${symbol}: SUCCESS`);
    } else {
      console.log(`❌ ${symbol}: FAILED`);
    }
    
    // Wait 1 second between requests (rate limit protection)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Run test
async function main() {
  console.log("🧪 BINANCE LONG/SHORT RATIO TEST SUITE");
  console.log("Testing Binance Futures API for Long/Short Account Ratio\n");
  
  // Test single coin first
  await testLongShortRatio("BTCUSDT");
  
  // Uncomment to test multiple coins
  // console.log("\n\n");
  // await testMultipleCoins();
  
  console.log("\n✅ Testing Complete!");
}

main().catch(console.error);
