export const analyzeChartImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            base64Image: base64Image,
            mimeType: mimeType,
        }),
    });
    
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data.analysis;
  } catch (error) {
    console.error("Error calling analysis function:", error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error("An unknown error occurred during API communication.");
  }
};
