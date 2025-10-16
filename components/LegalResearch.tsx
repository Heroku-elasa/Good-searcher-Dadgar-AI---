import React, { useEffect, useState, useRef } from 'react';
import { marked } from 'marked';
import { Source, useLanguage } from '../types';
import { generateSuggestions } from '../services/geminiService';

interface LegalResearchProps {
    onSearch: (query: string) => void;
    query: string;
    setQuery: (value: string) => void;
    result: string;
    sources: Source[];
    isLoading: boolean;
    error: string | null;
    isQuotaExhausted: boolean;
}

const LegalResearch: React.FC<LegalResearchProps> = ({
    onSearch,
    query,
    setQuery,
    result,
    sources,
    isLoading,
    error,
    isQuotaExhausted
}) => {
    const { t } = useLanguage();
    const [resultHtml, setResultHtml] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionTimeoutRef = useRef<number | null>(null);
    const [generatedPrompt, setGeneratedPrompt] = useState('');

    useEffect(() => {
        if (query.trim()) {
            const prompt = t('legalResearch.prompt').replace('{query}', query);
            setGeneratedPrompt(prompt);
        } else {
            setGeneratedPrompt('');
        }
    }, [query, t]);

    useEffect(() => {
        if (result) {
            setResultHtml(marked.parse(result) as string);
        } else {
            setResultHtml('');
        }
    }, [result]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) {
            alert(t('legalResearch.validationError'));
            return;
        }
        onSearch(query);
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim().length > 0) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }

        if (suggestionTimeoutRef.current) {
            clearTimeout(suggestionTimeoutRef.current);
        }

        if (value.trim().length < 3) {
            setSuggestions([]);
            return;
        }

        setIsSuggesting(true);
        suggestionTimeoutRef.current = window.setTimeout(async () => {
            const context = t('legalResearch.queryLabel');
            const newSuggestions = await generateSuggestions(value, context);
            setSuggestions(newSuggestions);
            setIsSuggesting(false);
        }, 500);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const examples: { label: string; query: string; }[] = t('legalResearch.examples');

    const handleExampleClick = (example: { query: string; }) => {
        setQuery(example.query);
    };

    return (
        <section id="legal-research" className="py-12 sm:py-16">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">{t('legalResearch.title')}</h2>
                    <p className="mt-2 text-gray-400 max-w-2xl mx-auto">{t('legalResearch.subtitle')}</p>
                </div>

                <div className="mt-10 bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-gray-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="research-query" className="block text-sm font-medium text-gray-300">{t('legalResearch.queryLabel')}</label>
                            <div className="relative">
                                <textarea
                                    id="research-query"
                                    rows={3}
                                    value={query}
                                    onChange={handleQueryChange}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    onFocus={() => { if (query.trim().length > 0) setShowSuggestions(true); }}
                                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                                    placeholder={t('legalResearch.queryPlaceholder')}
                                    autoComplete="off"
                                />
                                {showSuggestions && (isSuggesting || suggestions.length > 0) && (
                                    <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg">
                                        <ul className="py-1 max-h-48 overflow-y-auto">
                                            {isSuggesting && suggestions.length === 0 && (
                                                <li className="px-3 py-2 text-sm text-gray-400">در حال جستجو...</li>
                                            )}
                                            {suggestions.map((suggestion, index) => (
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

                        {Array.isArray(examples) && examples.length > 0 && (
                            <div className="pt-2">
                                <p className="text-sm font-medium text-gray-400 mb-3">{t('legalResearch.tryExample')}</p>
                                <div className="flex flex-wrap gap-3">
                                {examples.map((ex, index) => (
                                    <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleExampleClick(ex)}
                                    className="text-left p-2 px-3 bg-gray-700/60 rounded-lg hover:bg-gray-700/80 transition-all border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label={`Use example: ${ex.label}`}
                                    >
                                    <div className="font-semibold text-sm text-white">{ex.label}</div>
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
                                {isLoading ? t('legalResearch.searching') : isQuotaExhausted ? t('quotaErrorModal.title') : t('legalResearch.buttonText')}
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

                {(isLoading || error || result) && (
                    <div className="mt-10 bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 animate-fade-in">
                        <div className="p-4 bg-gray-800 border-b border-gray-700">
                            <h3 className="text-lg font-semibold text-white">{t('legalResearch.resultsTitle')}</h3>
                        </div>
                        <div className="p-6">
                            {isLoading && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-blue-400"></div>
                                    <span className="ml-3 text-gray-400">{t('legalResearch.searching')}</span>
                                </div>
                            )}
                            {error && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
                            {resultHtml && (
                                <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-gray-300">
                                    <div dangerouslySetInnerHTML={{ __html: resultHtml }} />
                                    <hr className="my-6 border-gray-600"/>
                                    <h4 className="text-md font-semibold text-gray-200">{t('legalResearch.sourcesTitle')}</h4>
                                    {sources.length > 0 ? (
                                        <ul className="list-disc pl-5 space-y-2">
                                            {sources.map((source, index) => (
                                                <li key={index}>
                                                    <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-words">
                                                        {source.web.title || source.web.uri}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <p className="text-gray-500 text-sm">{t('newsSummarizer.noSources')}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default LegalResearch;