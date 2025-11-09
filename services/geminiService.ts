import { GoogleGenAI } from "@google/genai";

// The application is configured to use the API key from the environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const prompt = `
You are an expert technical analyst specializing in Deriv synthetic indices (like Volatility 75, Boom 500, Crash 500, etc.). Your task is to analyze the provided trading chart screenshot.

Based ONLY on the visual information in the image (candlestick patterns, chart patterns, indicators, trend lines, support/resistance levels), provide a concise and actionable trading entry strategy.

Your analysis MUST include the following sections:
1.  **Market Observation**
2.  **Potential Entry Strategy**
3.  **Entry Point**
4.  **Stop Loss**
5.  **Take Profit**

**IMPORTANT INSTRUCTIONS:**
- Do not provide financial advice. Your response is for informational and educational purposes only.
- Be objective and base your analysis strictly on the provided image.
- If the chart is unclear or provides insufficient information for a high-probability setup, state that and explain why.
- Format your response using Markdown. Each section must start with a heading formatted as bold text on its own line (e.g., "**Market Observation**").
- Place a blank line after a heading if it is followed by a list.
- Use numbered lists for multiple entry points and bullet points for multiple take-profit targets.
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
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error('The API key is not valid. Please ensure it is configured correctly.');
        }
        throw new Error(`An error occurred while communicating with the AI model: ${error.message}`);
    }
    throw new Error("An unknown error occurred during the analysis.");
  }
};
