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

export const connectToMetaMask = async (): Promise<WalletInfo | null> => {
  if (typeof window.ethereum === 'undefined') {
    alert("MetaMask is not installed! Please install it to use this feature.");
    return null;
  }

  try {
    // Request account access
    const provider = new ethers.BrowserProvider(window.ethereum);
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