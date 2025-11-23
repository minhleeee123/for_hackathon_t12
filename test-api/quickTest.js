// Quick API Test - Simplified Version
console.log("🔬 Starting Crypto API Tests...\n");

// Test 1: CoinGecko Price
async function testPrice() {
  console.log("1️⃣ Testing CoinGecko Price API...");
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24h_change=true&include_market_cap=true');
    const data = await response.json();
    console.log("✅ SUCCESS:", JSON.stringify(data, null, 2));
    console.log(`Bitcoin Price: $${data.bitcoin.usd}`);
    console.log(`24h Change: ${data.bitcoin.usd_24h_change}%\n`);
    return data;
  } catch (error) {
    console.error("❌ FAILED:", error.message, "\n");
    return null;
  }
}

// Test 2: Fear & Greed Index
async function testSentiment() {
  console.log("2️⃣ Testing Fear & Greed Index...");
  try {
    const response = await fetch('https://api.alternative.me/fng/?limit=1');
    const data = await response.json();
    console.log("✅ SUCCESS:", JSON.stringify(data.data[0], null, 2));
    console.log(`Sentiment: ${data.data[0].value}/100 (${data.data[0].value_classification})\n`);
    return data;
  } catch (error) {
    console.error("❌ FAILED:", error.message, "\n");
    return null;
  }
}

// Test 3: Price History
async function testHistory() {
  console.log("3️⃣ Testing Price History API...");
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7&interval=daily');
    const data = await response.json();
    console.log("✅ SUCCESS: Got", data.prices?.length, "data points");
    
    // Show last 3 days
    const last3 = data.prices?.slice(-3).map(item => ({
      date: new Date(item[0]).toLocaleDateString(),
      price: Math.round(item[1])
    }));
    console.log("Last 3 days:", JSON.stringify(last3, null, 2), "\n");
    return data;
  } catch (error) {
    console.error("❌ FAILED:", error.message, "\n");
    return null;
  }
}

// Test 4: CoinCap Backup
async function testBackup() {
  console.log("4️⃣ Testing CoinCap Backup API...");
  try {
    const response = await fetch('https://api.coincap.io/v2/assets?search=bitcoin&limit=1');
    const data = await response.json();
    console.log("✅ SUCCESS:", JSON.stringify({
      name: data.data[0].name,
      symbol: data.data[0].symbol,
      price: parseFloat(data.data[0].priceUsd).toFixed(2)
    }, null, 2), "\n");
    return data;
  } catch (error) {
    console.error("❌ FAILED:", error.message, "\n");
    return null;
  }
}

// Run all tests
async function runTests() {
  const startTime = Date.now();
  
  const results = {
    price: await testPrice(),
    sentiment: await testSentiment(),
    history: await testHistory(),
    backup: await testBackup()
  };
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log("=" .repeat(60));
  console.log("📊 TEST SUMMARY");
  console.log("=" .repeat(60));
  console.log(`Price API:     ${results.price ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Sentiment API: ${results.sentiment ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`History API:   ${results.history ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Backup API:    ${results.backup ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`\nTotal Duration: ${duration}s`);
  console.log("=" .repeat(60));
  
  const allPassed = Object.values(results).every(r => r !== null);
  if (allPassed) {
    console.log("\n🎉 ALL TESTS PASSED! APIs are working correctly.");
    console.log("✅ You can now integrate real data into your AI agent.\n");
  } else {
    console.log("\n⚠️ Some tests failed. Check the errors above.\n");
  }
}

// Execute
runTests().catch(console.error);
