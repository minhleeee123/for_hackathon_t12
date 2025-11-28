
import { ai } from "../client";
import { PortfolioItem } from "../../types";

export async function analyzePortfolio(portfolio: PortfolioItem[]): Promise<string> {
  try {
     const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze this crypto portfolio based on the provided data: ${JSON.stringify(portfolio)}. 
      
      Provide:
      1. Total Value Breakdown.
      2. Performance Check (Comparing Avg Price vs Current Price).
      3. Risk Assessment (Diversification).
      4. Suggestion for rebalancing.`,
    });
    return response.text || "Error analyzing portfolio.";
  } catch {
    return "Error analyzing portfolio.";
  }
}
