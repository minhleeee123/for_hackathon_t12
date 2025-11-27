import CryptoJS from 'crypto-js';
import { BinanceBalance, BinanceOrder } from '../types';

// Provided Demo Keys
const API_KEY = 'KabIYO6AfJqiMx6EFxvL7YYPOX4va1MfAXxWLKNfQNxPfCPz4cl25cUejmHeOsNp';
const SECRET_KEY = '6ferhU8q6k55ZYpYpDBzi6mMc70YxKeerMvYYLJe2pt7MOMQ8kpdZvROD2OgUq9u';

const SPOT_BASE_URL = 'https://testnet.binance.vision';
const FUTURES_BASE_URL = 'https://testnet.binancefuture.com';

// --- Helper: Sign Request ---
const signRequest = (queryString: string) => {
    return CryptoJS.HmacSHA256(queryString, SECRET_KEY).toString();
};

const getHeaders = () => ({
    'X-MBX-APIKEY': API_KEY,
    // 'Content-Type': 'application/x-www-form-urlencoded' // Fetch handles this automatically for URLSearchParams
});

// --- Public: Get Price ---
export const getBinancePrice = async (symbol: string): Promise<number | null> => {
    try {
        // Try Spot first
        const res = await fetch(`${SPOT_BASE_URL}/api/v3/ticker/price?symbol=${symbol}`);
        const data = await res.json();
        if (data.price) return parseFloat(data.price);
        return null;
    } catch (e) {
        return null;
    }
};

// --- Private: Get Balances ---
export const getBinanceBalances = async (): Promise<{ spot: BinanceBalance[], futures: BinanceBalance[] }> => {
    const timestamp = Date.now();
    const spotBalances: BinanceBalance[] = [];
    const futuresBalances: BinanceBalance[] = [];

    // 1. Fetch Spot
    try {
        const query = `timestamp=${timestamp}`;
        const signature = signRequest(query);
        const res = await fetch(`${SPOT_BASE_URL}/api/v3/account?${query}&signature=${signature}`, {
            headers: getHeaders()
        });
        const data = await res.json();
        
        if (data.balances) {
            data.balances.forEach((b: any) => {
                const free = parseFloat(b.free);
                const locked = parseFloat(b.locked);
                if (free > 0 || locked > 0) {
                    spotBalances.push({ asset: b.asset, free, locked });
                }
            });
        }
    } catch (e) {
        console.error("Binance Spot Balance Error", e);
    }

    // 2. Fetch Futures
    try {
        const query = `timestamp=${timestamp}`;
        const signature = signRequest(query);
        const res = await fetch(`${FUTURES_BASE_URL}/fapi/v2/account?${query}&signature=${signature}`, {
            headers: getHeaders()
        });
        const data = await res.json();
        
        if (data.assets) {
            data.assets.forEach((a: any) => {
                const balance = parseFloat(a.walletBalance);
                if (balance > 0) {
                    futuresBalances.push({ asset: a.asset, free: parseFloat(a.availableBalance), locked: balance - parseFloat(a.availableBalance) });
                }
            });
        }
    } catch (e) {
        console.error("Binance Futures Balance Error", e);
    }

    return { spot: spotBalances, futures: futuresBalances };
};

// --- Private: Execute Order ---
export const executeBinanceOrder = async (order: BinanceOrder): Promise<{ success: boolean; msg: string; orderId?: string }> => {
    const timestamp = Date.now();
    
    // Normalize Symbol
    const symbol = order.symbol.toUpperCase().replace('-', '').replace('/', '');

    try {
        if (order.market === 'FUTURES') {
            // 1. Set Leverage (Futures Only)
            if (order.leverage) {
                try {
                    const levQuery = `symbol=${symbol}&leverage=${order.leverage}&timestamp=${timestamp}`;
                    const levSig = signRequest(levQuery);
                    await fetch(`${FUTURES_BASE_URL}/fapi/v1/leverage?${levQuery}&signature=${levSig}`, {
                        method: 'POST',
                        headers: getHeaders()
                    });
                } catch (e) {
                    console.warn("Could not set leverage, proceeding with default", e);
                }
            }

            // 2. Place Future Order
            const side = order.side;
            const type = order.type;
            const quantity = order.quantity.toFixed(3); // Adjust precision carefully in real app
            
            let query = `symbol=${symbol}&side=${side}&type=${type}&quantity=${quantity}&timestamp=${timestamp}`;
            if (type === 'LIMIT' && order.price) {
                query += `&price=${order.price}&timeInForce=GTC`;
            }

            const signature = signRequest(query);
            const res = await fetch(`${FUTURES_BASE_URL}/fapi/v1/order?${query}&signature=${signature}`, {
                method: 'POST',
                headers: getHeaders()
            });
            const data = await res.json();

            if (data.orderId) {
                return { success: true, msg: `Futures Order Placed! ID: ${data.orderId}`, orderId: data.orderId };
            } else {
                return { success: false, msg: data.msg || "Order failed" };
            }

        } else {
            // 3. Place Spot Order
            const side = order.side;
            const type = order.type;
            const quantity = order.quantity.toFixed(5);

            let query = `symbol=${symbol}&side=${side}&type=${type}&quantity=${quantity}&timestamp=${timestamp}`;
            // For market buy by Quote Quantity (spending USDT directly)
            // if (type === 'MARKET' && side === 'BUY') ... complicated logic omitted for simplicity

            const signature = signRequest(query);
            const res = await fetch(`${SPOT_BASE_URL}/api/v3/order?${query}&signature=${signature}`, {
                method: 'POST',
                headers: getHeaders()
            });
            const data = await res.json();

            if (data.orderId) {
                return { success: true, msg: `Spot Order Placed! ID: ${data.orderId}`, orderId: data.orderId };
            } else {
                return { success: false, msg: data.msg || "Order failed" };
            }
        }
    } catch (e: any) {
        return { success: false, msg: e.message || "Network error connecting to Binance" };
    }
};