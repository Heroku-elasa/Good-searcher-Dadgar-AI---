import React, { useState, useRef, useEffect } from 'react';
import { REPORT_TYPES, PROMPT_MAP } from '../constants';
import { useLanguage } from '../types';
import { generateSuggestions } from '../services/geminiService';

interface DraftingFormProps {
  onGenerate: (topic: string, description: string, docType: string) => void;
  isLoading: boolean;
  isComplete: boolean;
  topic: string;
  description: string;
  docType: string;
  setTopic: (value: string) => void;
  setDescription: (value: string) => void;
  setDocType: (value: string) => void;
  isQuotaExhausted: boolean;
}

const DraftingForm: React.FC<DraftingFormProps> = ({ 
  onGenerate, 
  isLoading, 
  isComplete,
  topic,
  description,
  docType,
  setTopic,
  setDescription,
  setDocType,
  isQuotaExhausted
}) => {
  const { t } = useLanguage();

  const [topicSuggestions, setTopicSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionTimeoutRef = useRef<number | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  useEffect(() => {
    if (topic.trim() && description.trim()) {
        let promptTemplate = PROMPT_MAP[docType] || PROMPT_MAP['petition'];
        const filledPrompt = promptTemplate.replace('{topic}', topic).replace('{description}', description);
        setGeneratedPrompt(filledPrompt);
    } else {
        setGeneratedPrompt('');
    }
  }, [topic, description, docType]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !description.trim()) {
      alert(t('generatorForm.validationError'));
      return;
    }
    onGenerate(topic, description, docType);
  };

  const examples: { label: string; topic: string; description: string; docType: string }[] = t('generatorForm.examples');

  const handleExampleClick = (example: { topic: string; description: string; docType: string }) => {
    setTopic(example.topic);
    setDescription(example.description);
    setDocType(example.docType);
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTopic(value);
    
    if (value.trim().length > 0) {
        setShowSuggestions(true);
    } else {
        setShowSuggestions(false);
        setTopicSuggestions([]);
    }

    if (suggestionTimeoutRef.current) {
        clearTimeout(suggestionTimeoutRef.current);
    }

    if (value.trim().length < 3) {
        setTopicSuggestions([]);
        return;
    }

    setIsSuggesting(true);
    suggestionTimeoutRef.current = window.setTimeout(async () => {
        const context = t('generatorForm.topic');
        const suggestions = await generateSuggestions(value, context);
        setTopicSuggestions(suggestions);
        setIsSuggesting(false);
    }, 500); // 500ms debounce
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTopic(suggestion);
    setTopicSuggestions([]);
    setShowSuggestions(false);
  };


  return (
    <div className="bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-white">{t('generatorForm.title')}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="docType" className={`block text-sm font-medium text-gray-300 relative transition-colors duration-500 ${isComplete ? 'strikethrough-animated' : ''}`}>{t('generatorForm.docType')}</label>
          <select
            id="docType"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
          >
            {REPORT_TYPES.map(option => (
              <option key={option.value} value={option.value}>
                {t(`reportTypes.${option.value}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="topic" className={`block text-sm font-medium text-gray-300 relative transition-colors duration-500 ${isComplete ? 'strikethrough-animated' : ''}`}>{t('generatorForm.topic')}</label>
          <div className="relative">
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={handleTopicChange}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onFocus={() => { if (topic.trim().length > 0) setShowSuggestions(true); }}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
              placeholder={t('generatorForm.topicPlaceholder')}
              autoComplete="off"
            />
            {showSuggestions && (isSuggesting || topicSuggestions.length > 0) && (
              <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg">
                <ul className="py-1 max-h-48 overflow-y-auto">
                    {isSuggesting && topicSuggestions.length === 0 && (
                        <li className="px-3 py-2 text-sm text-gray-400">در حال جستجو...</li>
                    )}
                    {topicSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onMouseDown={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-2 text-sm text-white cursor-pointer hover:bg-gray-600"
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="description" className={`block text-sm font-medium text-gray-300 relative transition-colors duration-500 ${isComplete ? 'strikethrough-animated' : ''}`}>{t('generatorForm.description')}</label>
          <textarea
            id="description"
            rows={8}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
            placeholder={t('generatorForm.descriptionPlaceholder')}
          />
        </div>

        {Array.isArray(examples) && examples.length > 0 && (
          <div className="pt-2">
            <p className="text-sm font-medium text-gray-400 mb-3">{t('generatorForm.tryExample')}</p>
            <div className="space-y-3">
              {examples.map((ex, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleExampleClick(ex)}
                  className="w-full text-left p-3 bg-gray-700/60 rounded-lg hover:bg-gray-700/80 transition-all border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`Use example: ${ex.label}`}
                >
                  <div className="font-semibold text-white">{ex.label}</div>
                  <p className="text-xs text-gray-400 mt-1 truncate">{ex.topic}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading || isQuotaExhausted}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : isQuotaExhausted ? t('quotaErrorModal.title') : t('generatorForm.buttonText')}
          </button>
        </div>

        {generatedPrompt && (
          <div className="mt-6 pt-4 border-t border-gray-700/50">
            <details>
              <summary className="cursor-pointer text-sm font-medium text-gray-400 hover:text-white transition-colors">
                View Generated AI Prompt
              </summary>
              <pre className="mt-2 bg-gray-900 p-3 rounded-md text-xs text-gray-300 whitespace-pre-wrap font-mono">
                <code>{generatedPrompt}</code>
              </pre>
            </details>
          </div>
        )}
      </form>
    </div>
  );
};

export default DraftingForm;