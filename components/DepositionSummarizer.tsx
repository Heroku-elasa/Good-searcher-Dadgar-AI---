import React, { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';
import { useLanguage } from '../types';

interface DepositionSummarizerProps {
    onSummarize: (text: string) => void;
    text: string;
    setText: (value: string) => void;
    summary: string;
    isLoading: boolean;
    error: string | null;
    isQuotaExhausted: boolean;
}

const DepositionSummarizer: React.FC<DepositionSummarizerProps> = ({
    onSummarize,
    text,
    setText,
    summary,
    isLoading,
    error,
    isQuotaExhausted
}) => {
    const { t } = useLanguage();
    const [summaryHtml, setSummaryHtml] = useState('');
    const endOfSummaryRef = useRef<HTMLDivElement>(null);
    const [generatedPrompt, setGeneratedPrompt] = useState('');

     useEffect(() => {
        if (text.trim()) {
            const prompt = t('depositionSummarizer.prompt').replace('{text}', text);
            setGeneratedPrompt(prompt);
        } else {
            setGeneratedPrompt('');
        }
    }, [text, t]);

    useEffect(() => {
        if (summary) {
            setSummaryHtml(marked.parse(summary) as string);
        } else {
            setSummaryHtml('');
        }
    }, [summary]);

    useEffect(() => {
        if (isLoading) {
            endOfSummaryRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [summary, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            alert(t('depositionSummarizer.validationError'));
            return;
        }
        onSummarize(text);
    };
    
    const examples: { label: string; text: string; }[] = t('depositionSummarizer.examples');

    const handleExampleClick = (example: { text: string; }) => {
        setText(example.text);
    };

    return (
        <section id="deposition-summarizer" className="py-12 sm:py-16">
            <div className="max-w-5xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">{t('depositionSummarizer.title')}</h2>
                    <p className="mt-2 text-gray-400 max-w-2xl mx-auto">{t('depositionSummarizer.subtitle')}</p>
                </div>

                <div className="mt-10 bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-gray-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="deposition-text" className="block text-sm font-medium text-gray-300">{t('depositionSummarizer.textLabel')}</label>
                            <textarea
                                id="deposition-text"
                                rows={12}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                                placeholder={t('depositionSummarizer.textPlaceholder')}
                            />
                        </div>

                        {Array.isArray(examples) && examples.length > 0 && (
                          <div className="pt-2">
                            <p className="text-sm font-medium text-gray-400 mb-3">{t('depositionSummarizer.tryExample')}</p>
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
                                  <p className="text-xs text-gray-400 mt-1 truncate">{ex.text}</p>
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
                                {isLoading ? t('depositionSummarizer.summarizing') : isQuotaExhausted ? t('quotaErrorModal.title') : t('depositionSummarizer.buttonText')}
                            </button>
                        </div>
                        
                        {generatedPrompt && (
                            <div className="mt-4 pt-4 border-t border-gray-700/50">
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

                {(isLoading || error || summary) && (
                    <div className="mt-10 bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 animate-fade-in">
                        <div className="p-4 bg-gray-800 border-b border-gray-700">
                            <h3 className="text-lg font-semibold text-white">{t('depositionSummarizer.resultsTitle')}</h3>
                        </div>
                        <div className="p-6">
                            {isLoading && !summary && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-blue-400"></div>
                                    <span className="ml-3 text-gray-400">{t('depositionSummarizer.summarizing')}</span>
                                </div>
                            )}
                            {error && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
                            {summaryHtml && (
                                <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-gray-300">
                                    <div dangerouslySetInnerHTML={{ __html: summaryHtml }} />
                                </div>
                            )}
                             {isLoading && summary && (
                                <div className="flex items-center justify-start pt-4">
                                    <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-blue-400"></div>
                                </div>
                             )}
                            <div ref={endOfSummaryRef} />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DepositionSummarizer;