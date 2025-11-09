
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const prompt = `
You are an expert technical analyst specializing in Deriv synthetic indices (like Volatility 75, Boom 500, Crash 500, etc.). Your task is to analyze the provided trading chart screenshot.

Based ONLY on the visual information in the image (candlestick patterns, chart patterns, indicators, trend lines, support/resistance levels), provide a concise and actionable trading entry strategy.

Your analysis MUST include the following sections:
1.  **Market Observation:** Briefly describe the current market structure visible in the chart (e.g., "The chart shows a clear uptrend with a recent pullback," or "Price is consolidating within a symmetrical triangle pattern.").
2.  **Potential Entry Strategy:** Suggest a specific entry strategy. Clearly state whether it's a 'BUY' or 'SELL' opportunity.
3.  **Entry Point:** Recommend a potential price level or condition for entry (e.g., "Enter a BUY position if the price breaks and closes above the resistance at 12345.67," or "Consider a SELL entry on the rejection of the upper trendline.").
4.  **Stop Loss:** Suggest a logical placement for a stop-loss order to manage risk.
5.  **Take Profit:** Recommend one or two potential take-profit targets.

**IMPORTANT:**
- Do not provide financial advice. Start your response with a clear disclaimer.
- Be objective and base your analysis strictly on the provided image.
- If the chart is unclear or provides insufficient information for a high-probability setup, state that and explain why.
- Format your response using Markdown for clarity. Use headings, bold text, and bullet points.
`;

export const analyzeChartImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    };

    const textPart = {
      text: prompt,
    };

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [textPart, imagePart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing image with Gemini API:", error);
    if (error instanceof Error) {
        return `Error from Gemini API: ${error.message}`;
    }
    return "An unknown error occurred during API communication.";
  }
};
