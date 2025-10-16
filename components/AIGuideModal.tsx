

import React from 'react';
import { IntentRoute, PageKey, SuggestedInputs, useLanguage } from '../types';

interface AIGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoute: (goal: string) => void;
  onSelectRoute: (page: PageKey, suggestedInputs?: SuggestedInputs) => void;
  prompt: string;
  setPrompt: (value: string) => void;
  results: IntentRoute[];
  isLoading: boolean;
  error: string | null;
}

const AIGuideModal: React.FC<AIGuideModalProps> = ({ 
    isOpen, onClose, onRoute, onSelectRoute, prompt, setPrompt, results, isLoading, error 
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
        alert(t('aiGuide.validationError'));
        return;
    }
    onRoute(prompt);
  };

  const moduleTranslations: Record<PageKey, string> = {
    legal_drafter: t('header.aiAssistant'),
    lawyer_finder: t('header.lawyerFinder'),
    news_summarizer: t('header.newsSummarizer'),
    case_strategist: t('header.caseStrategist'),
    personality_analyst: t('header.personalityAnalyst'),
    investment: t('header.investment'),
    contract_generator: t('header.contractGenerator'),
    legal_research: t('header.legalResearch'),
    deposition_summarizer: t('header.depositionSummarizer'),
    e_discovery_helper: t('header.eDiscoveryHelper'),
    python_projects: t('header.pythonProjects'),
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in" aria-modal="true" role="dialog">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 border border-blue-500/50 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold leading-6 text-white">{t('aiGuide.title')}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <p className="text-sm text-gray-400 mb-4">{t('aiGuide.subtitle')}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-gray-900 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                placeholder={t('aiGuide.placeholder')}
            />
            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                {isLoading ? t('aiGuide.gettingSuggestions') : t('aiGuide.submitButton')}
            </button>
        </form>

        <div className="mt-6 flex-grow overflow-y-auto pr-2">
            {isLoading && !error && (
                 <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-blue-400"></div>
                    <span className="ml-3 text-gray-400">{t('aiGuide.gettingSuggestions')}</span>
                </div>
            )}
            {error && <div className="text-red-400 text-center p-4 bg-red-900/50 rounded-md">{error}</div>}
            
            {results.length > 0 && !isLoading && (
                <div className="space-y-4">
                    <h4 className="font-semibold text-white">{t('aiGuide.resultsTitle')}</h4>
                    {results.map((result) => (
                        <div key={result.module} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                           <div className="flex justify-between items-center">
                                <h5 className="text-lg font-bold text-teal-300">{moduleTranslations[result.module]}</h5>
                                <div className="text-right">
                                    <div className="text-sm text-gray-400">{t('aiGuide.confidence')}</div>
                                    <div className="text-lg font-bold text-white">{result.confidencePercentage}%</div>
                                </div>
                           </div>
                           <p className="text-sm text-gray-300 mt-2">{result.reasoning}</p>
                           <button 
                                onClick={() => onSelectRoute(result.module, result.suggestedInputs)}
                                className="mt-4 w-full text-center bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                           >
                               {t('aiGuide.goTo')} {moduleTranslations[result.module]}
                           </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AIGuideModal;