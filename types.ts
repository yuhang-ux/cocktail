export enum Page {
  HOME = 'HOME',
  AI_WHISPER = 'AI_WHISPER',
  MANUAL_WORKBENCH = 'MANUAL_WORKBENCH',
  MOOD_ELIXIR = 'MOOD_ELIXIR',
  CELLAR = 'CELLAR',
}

export interface CocktailData {
  id: string;
  name: string;
  description: string; // The AI analysis
  color: string; // Hex code
  ingredients: string[];
  baseMood: string;
  timestamp: number;
  mode: 'AI' | 'MANUAL';
  garnish?: string[];
  isConsumed: boolean;
  positivityScore: number; // 0-100 for graph
}

// For Manual Mode State
export interface ManualDraft {
  baseColor: string; // Hex
  baseName: string; // e.g., "Deep Blue"
  garnishes: string[];
  stirLevel: number; // 0-100
}

// AI Response Schemas
export interface AiAnalysisResponse {
  cocktailName: string;
  hexColor: string;
  ingredients: string[];
  analysis: string;
  positivityScore: number;
}
