import { GoogleGenAI, Type } from "@google/genai";
import { AiAnalysisResponse } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION_THERAPIST = `
You are the bartender at the "Soul Bar". You are an art therapist and a mixologist. 
Your goal is to interpret emotions into cocktail metaphors. 
Be empathetic, poetic, and soothing. 
Your output must be strictly valid JSON.
`;

export const analyzeEmotionalVent = async (text: string): Promise<AiAnalysisResponse> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
  The user has entrusted these emotions to you: "${text}".
  
  Create a conceptual cocktail for them.
  1. Determine the 'color' of their emotion (hex code).
  2. Name the cocktail creatively.
  3. List 3-4 metaphorical or real ingredients (e.g., "2oz Tears of Joy", "Dash of Bitters", "Vodka").
  4. Provide a psycho-emotional analysis (max 2 sentences) explaining why this drink fits their mood.
  5. Assign a 'positivityScore' from 0 (very sad/angry) to 100 (ecstatic) based on the input.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_THERAPIST,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cocktailName: { type: Type.STRING },
          hexColor: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          analysis: { type: Type.STRING },
          positivityScore: { type: Type.NUMBER },
        },
        required: ["cocktailName", "hexColor", "ingredients", "analysis", "positivityScore"],
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as AiAnalysisResponse;
  }
  
  throw new Error("Failed to generate cocktail analysis");
};

export const interpretManualCraft = async (
  baseName: string, 
  baseColor: string, 
  garnishes: string[]
): Promise<AiAnalysisResponse> => {
  const model = "gemini-2.5-flash";

  const prompt = `
  The user manually crafted a drink.
  Base Liquid: ${baseName} (${baseColor}).
  Garnishes: ${garnishes.join(", ")}.
  
  Interpret their aesthetic choices psychologically.
  1. Keep the hex color provided: ${baseColor}.
  2. Give the creation a name based on the visual combo.
  3. List the ingredients based on the base and garnishes.
  4. Provide an analysis (max 2 sentences) of what their choices say about their subconscious state (e.g., choosing fiery red means release).
  5. Estimate a 'positivityScore' (0-100) based on the vibrancy and garnishes.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION_THERAPIST,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          cocktailName: { type: Type.STRING },
          hexColor: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          analysis: { type: Type.STRING },
          positivityScore: { type: Type.NUMBER },
        },
        required: ["cocktailName", "hexColor", "ingredients", "analysis", "positivityScore"],
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as AiAnalysisResponse;
  }
  
  throw new Error("Failed to interpret craft");
};
