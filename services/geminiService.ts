
import { GoogleGenAI } from "@google/genai";
import { CampaignData } from '../types';

// IMPORTANT: The API key must be set as an environment variable.
// Do not hardcode the API key in the code.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateInsights = async (
  data: CampaignData[],
  metrics: { totalContacts: number; totalQualified: number; totalDisqualified: number; }
): Promise<string> => {
  if (!API_KEY) {
    return "API Key for Gemini not configured. Please set the API_KEY environment variable.";
  }

  const prompt = `
    Analyze the following Meta Ads campaign performance data and provide a concise, insightful summary in Portuguese for a client.
    The summary should be easy to understand, avoiding technical jargon where possible.
    Focus on key trends, potential wins, and areas for improvement.
    Structure the output in markdown.

    Summary Metrics:
    - Total Contacts: ${metrics.totalContacts}
    - Qualified Contacts: ${metrics.totalQualified}
    - Disqualified Contacts: ${metrics.totalDisqualified}

    Detailed Daily Data (sample):
    ${JSON.stringify(data.slice(0, 10), null, 2)}

    Please generate the analysis based on the full dataset provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating insights with Gemini:", error);
    return "Ocorreu um erro ao gerar a análise. Por favor, tente novamente.";
  }
};
