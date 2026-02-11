
import { GoogleGenAI } from "@google/genai";
import { Case } from "../types";

// Always use process.env.API_KEY directly for initialization without fallback.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCaseInsights = async (caseData: Case): Promise<string> => {
  try {
    // Use gemini-3-pro-preview for complex reasoning tasks like legal case analysis.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Analyze this legal case and suggest the next logical "Course of Action".
      Case Type: ${caseData.type}
      Current Status: ${caseData.status}
      Latest Course of Action: ${caseData.courseOfAction}
      Court: ${caseData.court}
      Number of Hearings: ${caseData.hearings.length}
      
      Provide a concise, professional recommendation for the user.`,
    });
    // Access the .text property directly as it is a getter.
    return response.text || "No insights available at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to fetch AI insights. Please check your connection.";
  }
};
