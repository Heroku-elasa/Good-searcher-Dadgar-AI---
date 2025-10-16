import React, { useState, useCallback, createContext, useContext } from 'react';
import { en, fa } from './constants';

// --- LANGUAGE & TRANSLATION SETUP ---
type Language = 'en' | 'fa';
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}
const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fa');

  const t = useCallback((key: string) => {
    const keys = key.split('.');
    const translations = language === 'fa' ? fa : en;
    let result: any = translations;
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) return key;
    }
    return result || key;
  }, [language]);

  return React.createElement(LanguageContext.Provider, { value: { language, setLanguage, t } }, children);
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};

// --- TYPE DEFINITIONS ---
export type PageKey = 
  | 'legal_drafter' 
  | 'lawyer_finder' 
  | 'news_summarizer' 
  | 'case_strategist' 
  | 'personality_analyst' 
  | 'investment' 
  | 'contract_generator'
  | 'legal_research'
  | 'deposition_summarizer'
  | 'e_discovery_helper'
  | 'python_projects';

export type SearchEntityType = 'lawyer' | 'notary';


// Interface for a lawyer profile from the AI search or in saved state
export interface Lawyer {
    name: string;
    specialty: string;
    city: string;
    contactInfo: string;
    address: string;
    website: string;
    websiteTitle: string;
    relevanceScore?: number;
    notes?: string;
}

// Interface for a web source from Google Search grounding
export interface Source {
  web: { 
    uri: string; 
    title: string; 
  } 
}

// Interface for a single task in the generated strategy
export interface StrategyTask {
  taskName: string;
  description: string;
  effortPercentage: number;
  deliverableType: string;
  suggestedPrompt: string;
}

export interface SuggestedInputs {
  // Legal Drafter
  topic?: string;
  description?: string;
  docType?: string;
  // Lawyer Finder
  keywords?: string;
  entityType?: SearchEntityType;
  // News Summarizer
  query?: string;
  // Case Strategist
  goal?: string;
  // Personality Analyst
  text?: string;
  // Legal Research
  researchQuery?: string;
  // Deposition Summarizer
  depositionText?: string;
  // E-Discovery Helper
  eDiscoveryCaseDesc?: string;
}

// Interface for a single AI-guided routing suggestion
export interface IntentRoute {
  module: PageKey;
  confidencePercentage: number;
  reasoning: string;
  suggestedInputs?: SuggestedInputs;
}

// Interfaces for Personality Analyst
export interface TraitAnalysis {
  trait: string;
  score: number; // 1-10
  reasoning: string;
  suggestion: string;
}

export interface PersonalityAnalysisResult {
  lightTriad: TraitAnalysis[];
  loveTriad: TraitAnalysis[];
}

export interface EDiscoveryKeywords {
    keyPeople: string[];
    keyConcepts: string[];
    dateRanges: string[];
    booleanPhrases: string[];
}


// --- APP STATE & CHECKPOINT SETUP ---
export interface AppState {
  page: 'home' | PageKey;
  document: string;
  form: {
    topic: string;
    description: string;
    docType: string;
  };
  lawyers: Lawyer[];
  allLawyers: Lawyer[];
  lawyerFinderKeywords: string;
  lawyerFinderEntityType: SearchEntityType;
  newsQuery: string;
  newsSummary: string;
  newsSources: Source[];
  strategyGoal: string;
  strategyResult: StrategyTask[];
  aiGuidePrompt: string;
  aiGuideResults: IntentRoute[];
  deeperAnalysisResult: string;
  deeperAnalysisError: string | null;
  personalityAnalysisText: string;
  personalityAnalysisResult: PersonalityAnalysisResult | null;
  personalityAnalysisError: string | null;
  // Contract Generator State
  contractInvestor: string;
  contractCompany: string;
  contractAmount: string;
  contractShare: string;
  contractDuration: string;
  generatedContract: string;
  // New Module States
  researchQuery: string;
  researchResult: string;
  researchSources: Source[];
  depositionText: string;
  depositionSummary: string;
  eDiscoveryCaseDesc: string;
  eDiscoveryKeywords: EDiscoveryKeywords | null;
}
export interface Checkpoint {
  id: string;
  timestamp: number;
  name: string;
  state: AppState;
}