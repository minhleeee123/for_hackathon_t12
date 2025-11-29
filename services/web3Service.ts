
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface WalletInfo {
  address: string;
  balance: string; // ETH amount in string format
}

// Full Chain Configuration for Auto-Add Network
interface ChainConfig {
    chainId: string;
    chainName: string;
    rpcUrls: string[];
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    blockExplorerUrls: string[];
}

const CHAIN_CONFIGS: Record<string, ChainConfig> = {
  "Ethereum Mainnet": {
      chainId: "0x1",
      chainName: "Ethereum Mainnet",
      rpcUrls: ["https://mainnet.infura.io/v3/"],
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      blockExplorerUrls: ["https://etherscan.io"]
  },
  "Sepolia Testnet": {
      chainId: "0xaa36a7",
      chainName: "Sepolia Testnet",
      rpcUrls: ["https://rpc.sepolia.org"],
      nativeCurrency: { name: "Sepolia Ether", symbol: "SEP", decimals: 18 },
      blockExplorerUrls: ["https://sepolia.etherscan.io"]
  },
  "Binance Smart Chain": {
      chainId: "0x38",
      chainName: "Binance Smart Chain",
      rpcUrls: ["https://bsc-dataseed.binance.org/"],
      nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
      blockExplorerUrls: ["https://bscscan.com"]
  },
  "Polygon": {
      chainId: "0x89",
      chainName: "Polygon Mainnet",
      rpcUrls: ["https://polygon-rpc.com/"],
      nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
      blockExplorerUrls: ["https://polygonscan.com"]
  },
  "Avalanche C-Chain": {
      chainId: "0xa86a",
      chainName: "Avalanche C-Chain",
      rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
      nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
      blockExplorerUrls: ["https://snowtrace.io"]
  }
};

const ERC20_ABI = [
  "function transfer(address to, uint256 value) public returns (bool)",
  "function decimals() view returns (uint8)"
];

// Map of common token addresses on different chains
const TOKEN_ADDRESSES: Record<string, Record<string, string>> = {
  "Binance Smart Chain": {
    "ETH": "0x2170Ed081Fd40655d751827c5aF1d1Fe0E00f608", // Binance-Peg Ethereum Token
    "USDT": "0x55d398326f99059fF775485246999027B3197955", // BSC-USD
    "USDC": "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d"
  },
  "Ethereum Mainnet": {
    "USDT": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  },
  "Polygon": {
      "USDT": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      "WETH": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"
  }
};

export const connectToMetaMask = async (): Promise<WalletInfo | null> => {
  if (typeof window.ethereum === 'undefined') {
    alert("MetaMask is not installed! Please install it to use this feature.");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Force permission request to reset the connection context.
    await provider.send("wallet_requestPermissions", [{ eth_accounts: {} }]);

    // Request account access
    const accounts = await provider.send("eth_requestAccounts", []);
    
    if (accounts.length === 0) return null;

    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const balanceWei = await provider.getBalance(address);
    const balanceEth = ethers.formatEther(balanceWei);

    return {
      address,
      balance: balanceEth
    };
  } catch (error) {
    console.error("User denied account access or error occurred:", error);
    return null;
  }
};

export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Function to send a transaction with Network Switching & Token Support
export const sendTransaction = async (
    toAddress: string, 
    amount: string, 
    networkName?: string,
    tokenSymbol?: string
): Promise<{ hash: string } | null> => {
    
    if (typeof window.ethereum === 'undefined') {
        alert("MetaMask is not installed!");
        return null;
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);

        // 1. Network Switching Logic
        if (networkName && CHAIN_CONFIGS[networkName]) {
            const targetConfig = CHAIN_CONFIGS[networkName];
            
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: targetConfig.chainId }],
                });
            } catch (switchError: any) {
                if (switchError.code === 4902) {
                     try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [targetConfig],
                        });
                     } catch (addError) {
                         throw new Error(`Failed to add network ${networkName} to MetaMask.`);
                     }
                } else if (switchError.code === 4001) {
                    throw new Error("User rejected network switch.");
                } else {
                    console.error("Failed to switch network:", switchError);
                    throw new Error(`Failed to switch to ${networkName}.`);
                }
            }
        }

        // 2. Re-Initialize Provider
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        
        // 3. Normalize Address
        let formattedTo = toAddress;
        try {
            formattedTo = ethers.getAddress(toAddress);
        } catch (e) {
             // Try lower case as fallback for some formats
             try {
                formattedTo = ethers.getAddress(toAddress.toLowerCase());
             } catch(e2) {
                throw new Error(`Invalid recipient address: ${toAddress}`);
             }
        }

        // 4. Sanitize Amount (replace comma with dot for locales)
        const sanitizedAmount = amount.replace(',', '.');
        if (isNaN(parseFloat(sanitizedAmount))) {
            throw new Error("Invalid amount format");
        }

        // 5. Check if Native vs Token
        const config = networkName ? CHAIN_CONFIGS[networkName] : CHAIN_CONFIGS["Ethereum Mainnet"];
        const isNative = !tokenSymbol || tokenSymbol.toUpperCase() === config.nativeCurrency.symbol.toUpperCase();

        if (isNative) {
            // --- NATIVE TRANSACTION (ETH, BNB, MATIC) ---
            const tx: any = {
                to: formattedTo,
                value: ethers.parseEther(sanitizedAmount)
            };

            try {
                const response = await signer.sendTransaction(tx);
                return { hash: response.hash };
            } catch (error: any) {
                const isInsufficientFunds = error.code === 'INSUFFICIENT_FUNDS';
                const isGasEstimationFailed = error.info?.error?.code === -32000 || error.message?.includes("insufficient funds");

                if (isInsufficientFunds || isGasEstimationFailed) {
                    console.warn("Gas estimation failed. Retrying with manual gasLimit...");
                    tx.gasLimit = 300000; 
                    const response = await signer.sendTransaction(tx);
                    return { hash: response.hash };
                }
                throw error;
            }

        } else {
            // --- ERC20 TOKEN TRANSACTION ---
            const chainTokens = TOKEN_ADDRESSES[networkName || "Ethereum Mainnet"];
            const tokenAddr = chainTokens ? chainTokens[tokenSymbol!.toUpperCase()] : null;

            if (!tokenAddr) {
                throw new Error(`Token ${tokenSymbol} is not directly supported on ${networkName} yet. Please check the network or use the native coin.`);
            }

            const tokenContract = new ethers.Contract(tokenAddr, ERC20_ABI, signer);
            
            // Get decimals dynamically
            let decimals = 18;
            try {
                decimals = await tokenContract.decimals();
            } catch (e) {
                console.warn("Could not fetch decimals, defaulting to 18");
            }

            const amountWei = ethers.parseUnits(sanitizedAmount, decimals);
            const tx = await tokenContract.transfer(formattedTo, amountWei);
            return { hash: tx.hash };
        }

    } catch (error) {
        console.error("Transaction Failed:", error);
        throw error;
    }
};
