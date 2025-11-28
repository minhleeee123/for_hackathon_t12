
import { Type, Schema } from "@google/genai";
import { ai } from "../client";
import { TransactionData } from "../../types";

const transactionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    type: { type: Type.STRING, enum: ["SEND", "SWAP", "BUY", "SELL"] },
    token: { type: Type.STRING },
    amount: { type: Type.NUMBER },
    toAddress: { type: Type.STRING },
    network: { type: Type.STRING },
    estimatedGas: { type: Type.STRING },
    summary: { type: Type.STRING }
  },
  required: ["type", "token", "amount", "toAddress", "network", "estimatedGas", "summary"]
};

export const createTransactionPreview = async (userText: string): Promise<TransactionData> => {
    const systemPrompt = `
      You are a Web3 Transaction Agent. Your job is to extract transaction details from the user's natural language request.
      
      Rules:
      1. Detect intent: SEND (transfer tokens), SWAP (trade tokens), BUY, SELL.
      2. Extract 'token' (default to ETH if unclear but implied), 'amount'.
      3. For 'toAddress':
         - If user provides a 0x address, use it.
         - If SWAP/BUY/SELL, use the Uniswap V2 Router address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'.
         - If SEND and no address provided, use a placeholder '0x0000...0000' but mention in summary user needs to verify.
      4. Network: Assume 'Ethereum Mainnet' or 'Sepolia Testnet' based on context, default to 'Ethereum Mainnet'.
      5. Estimated Gas: Estimate standard ETH gas (e.g. 0.002 ETH).
      
      Example: "Swap 1 ETH for USDT" -> Type: SWAP, Token: ETH, Amount: 1, To: RouterAddress.
      Example: "Send 0.5 ETH to 0x123..." -> Type: SEND, Token: ETH, Amount: 0.5, To: 0x123...
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Parse this transaction request: "${userText}"`,
            config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: transactionSchema
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as TransactionData;
        }
        throw new Error("Failed to parse transaction");
    } catch (error) {
        console.error("Transaction Parse Error", error);
        throw error;
    }
}
