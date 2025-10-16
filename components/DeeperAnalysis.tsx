import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { useLanguage } from '../types';

interface DeeperAnalysisProps {
  onAnalyze: () => void;
  result: string;
  isLoading: boolean;
  error: string | null;
  isQuotaExhausted: boolean;
}

const DeeperAnalysis: React.FC<DeeperAnalysisProps> = ({ onAnalyze, result, isLoading, error, isQuotaExhausted }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [analysisHtml, setAnalysisHtml] = useState('');

  useEffect(() => {
    let isMounted = true;
    const parseMarkdown = () => {
      if (result) {
        const html = marked.parse(result) as string;
        if (isMounted) {
            setAnalysisHtml(html);
            setIsOpen(true); // Automatically open when results arrive
        }
      } else {
        if (isMounted) setAnalysisHtml('');
      }
    };
    parseMarkdown();
    return () => { isMounted = false; };
  }, [result]);

  return (
    <div className="bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 animate-fade-in">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 text-left flex justify-between items-center bg-gray-800 hover:bg-gray-700/50 transition-colors rounded-t-lg"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-white">{t('deeperAnalysis.title')}</h3>
        <svg className={`w-6 h-6 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-6 border-t border-gray-700">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-blue-400"></div>
              <span className="ml-3 text-gray-400">{t('deeperAnalysis.analyzing')}</span>
            </div>
          )}
          {error && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
          
          {!isLoading && !error && !result && (
             <div className="text-center py-4">
                <p className="text-gray-400 mb-4">{t('deeperAnalysis.placeholder')}</p>
                <button
                    onClick={onAnalyze}
                    disabled={isQuotaExhausted}
                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                    {isQuotaExhausted ? t('quotaErrorModal.title') : t('deeperAnalysis.buttonText')}
                </button>
             </div>
          )}

          {analysisHtml && (
             <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: analysisHtml }} />
          )}

        </div>
      )}
    </div>
  );
};

export default DeeperAnalysis;