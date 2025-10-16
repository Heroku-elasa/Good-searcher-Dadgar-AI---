import React, { useState, useEffect } from 'react';
import { EDiscoveryKeywords, useLanguage } from '../types';

interface EDiscoveryHelperProps {
    onGenerate: (caseDesc: string) => void;
    caseDesc: string;
    setCaseDesc: (value: string) => void;
    keywords: EDiscoveryKeywords | null;
    isLoading: boolean;
    error: string | null;
    isQuotaExhausted: boolean;
}

const EDiscoveryHelper: React.FC<EDiscoveryHelperProps> = ({
    onGenerate,
    caseDesc,
    setCaseDesc,
    keywords,
    isLoading,
    error,
    isQuotaExhausted
}) => {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState('');

    useEffect(() => {
        if (caseDesc.trim()) {
            const prompt = t('eDiscoveryHelper.prompt').replace('{caseDesc}', caseDesc);
            setGeneratedPrompt(prompt);
        } else {
            setGeneratedPrompt('');
        }
    }, [caseDesc, t]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!caseDesc.trim()) {
            alert(t('eDiscoveryHelper.validationError'));
            return;
        }
        onGenerate(caseDesc);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const formatKeywordsForCopy = (k: EDiscoveryKeywords | null) => {
        if (!k) return '';
        return `
${t('eDiscoveryHelper.categories.keyPeople')}:
${k.keyPeople.join('\n')}

${t('eDiscoveryHelper.categories.keyConcepts')}:
${k.keyConcepts.join('\n')}

${t('eDiscoveryHelper.categories.dateRanges')}:
${k.dateRanges.join('\n')}

${t('eDiscoveryHelper.categories.booleanPhrases')}:
${k.booleanPhrases.join('\n')}
        `.trim();
    };

    const renderKeywordSection = (title: string, items: string[]) => {
        if (!items || items.length === 0) return null;
        return (
            <div>
                <h4 className="text-lg font-semibold text-teal-300 mb-2">{title}</h4>
                <div className="flex flex-wrap gap-2">
                    {items.map((item, index) => (
                        <code key={index} className="px-3 py-1 bg-gray-700 text-gray-200 rounded-md text-sm cursor-pointer" onClick={() => navigator.clipboard.writeText(item)} title="Click to copy">
                            {item}
                        </code>
                    ))}
                </div>
            </div>
        );
    };

    const examples: { label: string; caseDesc: string; }[] = t('eDiscoveryHelper.examples');

    const handleExampleClick = (example: { caseDesc: string; }) => {
        setCaseDesc(example.caseDesc);
    };


    return (
        <section id="e-discovery-helper" className="py-12 sm:py-16">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">{t('eDiscoveryHelper.title')}</h2>
                    <p className="mt-2 text-gray-400 max-w-2xl mx-auto">{t('eDiscoveryHelper.subtitle')}</p>
                </div>

                <div className="mt-10 bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-gray-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="case-desc" className="block text-sm font-medium text-gray-300">{t('eDiscoveryHelper.caseDescLabel')}</label>
                            <textarea
                                id="case-desc"
                                rows={8}
                                value={caseDesc}
                                onChange={(e) => setCaseDesc(e.target.value)}
                                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                                placeholder={t('eDiscoveryHelper.caseDescPlaceholder')}
                            />
                        </div>
                        
                        {Array.isArray(examples) && examples.length > 0 && (
                          <div className="pt-2">
                            <p className="text-sm font-medium text-gray-400 mb-3">{t('eDiscoveryHelper.tryExample')}</p>
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
                                  <p className="text-xs text-gray-400 mt-1 truncate">{ex.caseDesc}</p>
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
                                {isLoading ? t('eDiscoveryHelper.generating') : isQuotaExhausted ? t('quotaErrorModal.title') : t('eDiscoveryHelper.buttonText')}
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

                {(isLoading || error || keywords) && (
                    <div className="mt-10 bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 animate-fade-in">
                        <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-white">{t('eDiscoveryHelper.resultsTitle')}</h3>
                            {keywords && (
                                <button onClick={() => copyToClipboard(formatKeywordsForCopy(keywords))} className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 rounded-md transition-colors">
                                    {copied ? t('eDiscoveryHelper.copied') : t('eDiscoveryHelper.copyAll')}
                                </button>
                            )}
                        </div>
                        <div className="p-6">
                            {isLoading && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-blue-400"></div>
                                    <span className="ml-3 text-gray-400">{t('eDiscoveryHelper.generating')}</span>
                                </div>
                            )}
                            {error && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
                            {keywords && (
                                <div className="space-y-6">
                                    {renderKeywordSection(t('eDiscoveryHelper.categories.keyPeople'), keywords.keyPeople)}
                                    {renderKeywordSection(t('eDiscoveryHelper.categories.keyConcepts'), keywords.keyConcepts)}
                                    {renderKeywordSection(t('eDiscoveryHelper.categories.dateRanges'), keywords.dateRanges)}
                                    {renderKeywordSection(t('eDiscoveryHelper.categories.booleanPhrases'), keywords.booleanPhrases)}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default EDiscoveryHelper;