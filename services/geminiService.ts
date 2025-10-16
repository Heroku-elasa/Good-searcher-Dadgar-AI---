


import { GoogleGenAI, Type } from "@google/genai";
import { PROMPT_MAP } from '../constants';
import { Source, StrategyTask, IntentRoute, PersonalityAnalysisResult, EDiscoveryKeywords } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

// Centralized, robust error handler for Gemini API calls
function throwEnhancedError(error: unknown, defaultMessage: string): never {
    console.error("Gemini API Error:", error);

    let messageToParse: string;
    
    if (error instanceof Error) {
        messageToParse = error.message;
    } else if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as any).message === 'string') {
        messageToParse = (error as any).message;
    } else if (typeof error === 'string') {
        messageToParse = error;
    } else {
        try {
            messageToParse = JSON.stringify(error);
        } catch {
            messageToParse = String(error);
        }
    }

    let finalErrorMessage = messageToParse;
    try {
        const jsonMatch = finalErrorMessage.match(/({.*})/s);
        if (jsonMatch && jsonMatch[1]) {
            const parsed = JSON.parse(jsonMatch[1]);
            if (parsed.error?.message) {
                const status = parsed.error.status || '';
                const code = parsed.error.code || '';
                finalErrorMessage = `${code} ${status}: ${parsed.error.message}`;
            }
        }
    } catch (e) {
        // No valid JSON found.
    }
    
    const lowerCaseMessage = finalErrorMessage.toLowerCase();

    if (lowerCaseMessage.includes('api key not valid')) {
        throw new Error('Invalid API Key. Please check your API key in the environment variables.');
    }
    
    if (lowerCaseMessage.includes('resource_exhausted') || lowerCaseMessage.includes('429')) {
        if (lowerCaseMessage.includes('quota')) {
            throw new Error('You have exceeded your API usage quota. Please check your Google AI Studio account for details. (Quota Exceeded)');
        } else {
            throw new Error('The AI model is currently busy due to high demand. Please try again in a few moments. (Rate Limit Exceeded)');
        }
    }

    if (lowerCaseMessage.includes('400') || lowerCaseMessage.includes('invalid argument')) {
        throw new Error('There was a problem with the request. Please check the document or prompt. (Bad Request)');
    }
    if (lowerCaseMessage.includes('500') || lowerCaseMessage.includes('internal error') || lowerCaseMessage.includes('rpc failed')) {
        throw new Error('The AI service encountered an internal error. Please try again later. (Server Error)');
    }

    throw new Error(finalErrorMessage || defaultMessage);
}


// A generic retry wrapper for non-streaming Gemini calls.
async function withRetry<T>(apiCall: () => Promise<T>, errorMessage: string): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Gemini API call attempt ${attempt} failed:`, lastError);

      const message = lastError.message.toLowerCase();
      if (message.includes('api key not valid') || message.includes('quota') || message.includes('400') || message.includes('invalid argument')) {
          break; 
      }

      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throwEnhancedError(lastError, errorMessage);
}


export async function* generateReportStream(topic: string, description: string, reportType: string): AsyncGenerator<string, void, undefined> {
  
  let prompt = PROMPT_MAP[reportType] || PROMPT_MAP['petition'];
  prompt = prompt.replace('{topic}', topic).replace('{description}', description);
  
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContentStream({
          model: "gemini-2.5-flash",
          contents: prompt,
      });

      for await (const chunk of response) {
          yield chunk.text;
      }
      return; 

    } catch (error) {
      lastError = error instanceof Error ? error : new Error('An unknown error occurred during the API call');
      console.error(`Gemini API call attempt ${attempt} failed:`, lastError.message);
      
      const message = lastError.message.toLowerCase();
      if (message.includes('api key not valid') || message.includes('quota') || message.includes('400') || message.includes('invalid argument')) {
          break; 
      }

      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throwEnhancedError(lastError, `Failed to generate content from Gemini after ${MAX_RETRIES} attempts.`);
}

export async function* analyzeDocumentStream(documentText: string, promptTemplate: string): AsyncGenerator<string, void, undefined> {
  const prompt = promptTemplate.replace('{documentText}', documentText);

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContentStream({
          model: "gemini-2.5-flash",
          contents: prompt,
      });

      for await (const chunk of response) {
          yield chunk.text;
      }
      return;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error('An unknown error occurred during the API call');
      console.error(`Gemini API call for analysis attempt ${attempt} failed:`, lastError.message);

      const message = lastError.message.toLowerCase();
      if (message.includes('api key not valid') || message.includes('quota') || message.includes('400') || message.includes('invalid argument')) {
          break;
      }

      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
        console.log(`Retrying analysis in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throwEnhancedError(lastError, `Failed to analyze document from Gemini after ${MAX_RETRIES} attempts.`);
}

export interface SearchResult {
  text: string;
  sources: Source[];
}

async function performSearch(prompt: string, errorMessage: string): Promise<SearchResult> {
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    const text = response.text;
    const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = rawSources
      .filter(source => source.web?.uri)
      .map(source => ({
        web: {
          uri: source.web!.uri!,
          title: source.web!.title || source.web!.uri!,
        },
      }));

    return { text, sources };
  }, errorMessage);
}


export async function findLawyers(prompt: string): Promise<SearchResult> {
  return performSearch(prompt, 'Failed to find lawyers. There might be an issue with the API or your request.');
}

export async function summarizeNews(prompt: string): Promise<SearchResult> {
    return performSearch(prompt, 'Failed to summarize news. There might be an issue with the API or your request.');
}

export async function legalSearch(prompt: string): Promise<SearchResult> {
    return performSearch(prompt, 'Failed to perform legal research. There might be an issue with the API or your request.');
}

export async function* summarizeDepositionStream(prompt: string): AsyncGenerator<string, void, undefined> {
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContentStream({
          model: "gemini-2.5-flash",
          contents: prompt,
      });
      for await (const chunk of response) {
          yield chunk.text;
      }
      return;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('An unknown error occurred');
      console.error(`Deposition summarization attempt ${attempt} failed:`, lastError.message);
      
      const message = lastError.message.toLowerCase();
      if (message.includes('api key not valid') || message.includes('quota') || message.includes('400') || message.includes('invalid argument')) {
          break;
      }

      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_DELAY_MS * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throwEnhancedError(lastError, `Failed to summarize text after ${MAX_RETRIES} attempts.`);
}


export async function generateStrategy(goal: string, promptTemplate: string): Promise<StrategyTask[]> {
  const prompt = promptTemplate.replace('{goal}', goal);

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        taskName: { type: Type.STRING, description: "A concise name for the task." },
        description: { type: Type.STRING, description: "A brief explanation of what the task involves." },
        effortPercentage: { type: Type.NUMBER, description: "An estimated percentage of the total project effort this task will take." },
        deliverableType: { type: Type.STRING, description: "A short, clear name for the output of this task (e.g., 'Business Plan', 'Market Research Report', 'Podcast Script')." },
        suggestedPrompt: { type: Type.STRING, description: "A detailed, high-quality prompt for an AI to generate the deliverable for this task." },
      },
      required: ['taskName', 'description', 'effortPercentage', 'deliverableType', 'suggestedPrompt'],
    },
  };
  
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    // It might be wrapped in markdown ```json ... ```, let's strip that.
    const cleanJson = jsonText.replace(/^```json\s*|```$/g, '');
    return JSON.parse(cleanJson);
  }, 'Failed to generate strategy. There might be an issue with the API or your request.');
}

export async function routeUserIntent(goal: string, promptTemplate: string): Promise<IntentRoute[]> {
  const prompt = promptTemplate.replace('{goal}', goal);

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        module: { 
          type: Type.STRING,
          description: "The key of the suggested module. Must be one of: 'legal_drafter', 'lawyer_finder', 'news_summarizer', 'case_strategist', 'personality_analyst', 'contract_generator', 'legal_research', 'deposition_summarizer', 'e_discovery_helper'.",
          enum: ['legal_drafter', 'lawyer_finder', 'news_summarizer', 'case_strategist', 'personality_analyst', 'contract_generator', 'legal_research', 'deposition_summarizer', 'e_discovery_helper']
        },
        confidencePercentage: { type: Type.NUMBER, description: "A percentage (0-100) indicating the confidence in this suggestion." },
        reasoning: { type: Type.STRING, description: "A brief explanation for why this module is recommended." },
        suggestedInputs: {
          type: Type.OBJECT,
          description: "An object containing extracted values from the user's goal to pre-fill form fields.",
          properties: {
            topic: { type: Type.STRING, description: "Suggested topic for the legal drafter." },
            description: { type: Type.STRING, description: "Suggested description for the legal drafter." },
            docType: { type: Type.STRING, description: "Suggested document type (e.g., 'petition').", enum: ['petition', 'complaint', 'contract', 'legal_warning', 'statement'] },
            keywords: { type: Type.STRING, description: "Suggested keywords for the lawyer finder." },
            entityType: { type: Type.STRING, description: "Suggested entity type ('lawyer' or 'notary').", enum: ['lawyer', 'notary'] },
            query: { type: Type.STRING, description: "Suggested query for the news summarizer." },
            goal: { type: Type.STRING, description: "Suggested goal for the case strategist." },
            text: { type: Type.STRING, description: "Suggested text for the personality analyst." },
            researchQuery: { type: Type.STRING, description: "Suggested query for legal research." },
            depositionText: { type: Type.STRING, description: "Suggested text for the deposition summarizer." },
            eDiscoveryCaseDesc: { type: Type.STRING, description: "Suggested case description for the e-discovery helper." }
          },
        },
      },
      required: ['module', 'confidencePercentage', 'reasoning'],
    },
  };
  
  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const cleanJson = jsonText.replace(/^```json\s*|```$/g, '');
    const parsedResult = JSON.parse(cleanJson);

    // Basic validation to ensure module keys are correct
    if (Array.isArray(parsedResult)) {
        return parsedResult.filter(item => 
            typeof item === 'object' &&
            item !== null &&
            ['legal_drafter', 'lawyer_finder', 'news_summarizer', 'case_strategist', 'personality_analyst', 'contract_generator', 'legal_research', 'deposition_summarizer', 'e_discovery_helper'].includes(item.module)
        ) as IntentRoute[];
    }
    
    throw new Error("Received invalid data structure from AI.");

  }, 'Failed to get routing suggestions. There might be an issue with the API or your request.');
}

export async function analyzePersonality(text: string, promptTemplate: string): Promise<PersonalityAnalysisResult> {
  const prompt = promptTemplate.replace('{text}', text);

  const traitAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
      trait: { type: Type.STRING },
      score: { type: Type.INTEGER },
      reasoning: { type: Type.STRING },
      suggestion: { type: Type.STRING },
    },
    required: ['trait', 'score', 'reasoning', 'suggestion'],
  };

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      lightTriad: {
        type: Type.ARRAY,
        items: traitAnalysisSchema,
      },
      loveTriad: {
        type: Type.ARRAY,
        items: traitAnalysisSchema,
      },
    },
    required: ['lightTriad', 'loveTriad'],
  };

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const cleanJson = jsonText.replace(/^```json\s*|```$/g, '');
    return JSON.parse(cleanJson);
  }, 'Failed to analyze personality. There might be an issue with the API or your request.');
}


export async function generateEDiscoveryKeywords(prompt: string): Promise<EDiscoveryKeywords> {
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
        keyPeople: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "A list of names of individuals, roles, or entities involved."
        },
        keyConcepts: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "A list of central themes, technical terms, or legal concepts."
        },
        dateRanges: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "A list of important dates or timeframes, formatted as strings (e.g., 'January 2023', 'Q4 2022')."
        },
        booleanPhrases: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of advanced search queries using boolean operators (AND, OR, NOT, NEAR) for more precise discovery."
        }
    },
    required: ['keyPeople', 'keyConcepts', 'dateRanges', 'booleanPhrases'],
  };

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });
    const jsonText = response.text.trim();
    const cleanJson = jsonText.replace(/^```json\s*|```$/g, '');
    return JSON.parse(cleanJson);
  }, 'Failed to generate e-discovery keywords.');
}

export async function generateSuggestions(currentValue: string, context: string): Promise<string[]> {
  if (!currentValue || currentValue.trim().length < 3) {
    return [];
  }
  
  const prompt = `You are an autocomplete assistant. Based on the user typing "${currentValue}" for a "${context}", provide up to 5 brief, relevant, and varied autocomplete suggestions. The user is a legal professional in Iran. Keep suggestions concise.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      suggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of up to 5 autocomplete suggestion strings."
      }
    },
    required: ['suggestions'],
  };
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 0 }, // For low latency
        temperature: 0.2, // Lower temperature for more predictable suggestions
      },
    });

    const jsonText = response.text.trim();
    const cleanJson = jsonText.replace(/^```json\s*|```$/g, '');
    const parsed = JSON.parse(cleanJson);
    return parsed.suggestions || [];
  } catch (error) {
    console.error("Failed to generate suggestions:", error);
    // Don't throw, just return empty array for a non-blocking UX
    return []; 
  }
}