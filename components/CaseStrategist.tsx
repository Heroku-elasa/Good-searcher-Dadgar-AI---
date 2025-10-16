import React, { useState, useRef, useEffect } from 'react';
import { StrategyTask, useLanguage } from '../types';
import { generateSuggestions } from '../services/geminiService';

interface CaseStrategistProps {
    onGenerate: (goal: string) => void;
    goal: string;
    setGoal: (value: string) => void;
    result: StrategyTask[];
    isLoading: boolean;
    error: string | null;
    isQuotaExhausted: boolean;
}

const CaseStrategist: React.FC<CaseStrategistProps> = ({ onGenerate, goal, setGoal, result, isLoading, error, isQuotaExhausted }) => {
    const { t } = useLanguage();
    const [visiblePromptId, setVisiblePromptId] = useState<number | null>(null);
    const [copiedPromptId, setCopiedPromptId] = useState<number | null>(null);
    const [generatedPrompt, setGeneratedPrompt] = useState('');

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (goal.trim()) {
            const prompt = t('caseStrategist.prompt').replace('{goal}', goal);
            setGeneratedPrompt(prompt);
        } else {
            setGeneratedPrompt('');
        }
    }, [goal, t]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal.trim()) {
            alert(t('caseStrategist.validationError'));
            return;
        }
        onGenerate(goal);
        setVisiblePromptId(null);
    };

    const handleCopyPrompt = (promptText: string, index: number) => {
        navigator.clipboard.writeText(promptText).then(() => {
            setCopiedPromptId(index);
            setTimeout(() => setCopiedPromptId(null), 2000); // Reset after 2 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy prompt.');
        });
    };

    const handleGoalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setGoal(value);

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
            const context = t('caseStrategist.goalLabel');
            const newSuggestions = await generateSuggestions(value, context);
            setSuggestions(newSuggestions);
            setIsSuggesting(false);
        }, 500);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setGoal(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const examples: { label: string; goal: string; }[] = t('caseStrategist.examples');

    const handleExampleClick = (example: { goal: string; }) => {
        setGoal(example.goal);
    };

    return (
        <section id="case-strategist" className="py-12 sm:py-16">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">{t('caseStrategist.title')}</h2>
                    <p className="mt-2 text-gray-400 max-w-2xl mx-auto">{t('caseStrategist.subtitle')}</p>
                </div>

                <div className="mt-10 bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-gray-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="goal-input" className="block text-sm font-medium text-gray-300">{t('caseStrategist.goalLabel')}</label>
                            <div className="relative">
                                <textarea
                                    id="goal-input"
                                    rows={4}
                                    value={goal}
                                    onChange={handleGoalChange}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    onFocus={() => { if (goal.trim().length > 0) setShowSuggestions(true); }}
                                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                                    placeholder={t('caseStrategist.goalPlaceholder')}
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
                                <p className="text-sm font-medium text-gray-400 mb-3">{t('caseStrategist.tryExample')}</p>
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
                                {isLoading ? t('caseStrategist.generating') : isQuotaExhausted ? t('quotaErrorModal.title') : t('caseStrategist.buttonText')}
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

                {(isLoading || error || result.length > 0) && (
                    <div className="mt-10 animate-fade-in">
                        <div className="mb-4">
                            <h3 className="text-2xl font-semibold text-white">{t('caseStrategist.resultsTitle')}</h3>
                        </div>
                        <div className="space-y-6">
                            {isLoading && (
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-blue-400"></div>
                                    <span className="ml-3 text-gray-400">{t('caseStrategist.generating')}</span>
                                </div>
                            )}
                            {error && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
                            {result.map((task, index) => (
                                <div key={index} className="bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 p-6">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-xl font-bold text-teal-300">{task.taskName}</h4>
                                        <div className="text-right flex-shrink-0 ml-4">
                                            <div className="text-sm text-gray-400">{t('caseStrategist.effort')}</div>
                                            <div className="text-lg font-bold text-white">{task.effortPercentage}%</div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2.5 my-2">
                                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${task.effortPercentage}%` }}></div>
                                    </div>
                                    <p className="text-gray-300 mt-3">{task.description}</p>
                                    <div className="mt-4 pt-4 border-t border-gray-600">
                                        <p className="text-sm"><span className="font-semibold text-gray-400">{t('caseStrategist.deliverable')}:</span> <span className="font-medium text-gray-200 bg-gray-700 px-2 py-1 rounded-md">{task.deliverableType}</span></p>
                                        <button 
                                            onClick={() => setVisiblePromptId(visiblePromptId === index ? null : index)}
                                            className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            {visiblePromptId === index ? '▲ ' : '▼ '} {t('caseStrategist.suggestedPrompt')}
                                        </button>
                                        {visiblePromptId === index && (
                                            <div className="mt-2 bg-gray-900/70 p-4 rounded-md border border-gray-700 relative group">
                                                <pre className="whitespace-pre-wrap text-sm text-gray-300">
                                                    <code>{task.suggestedPrompt}</code>
                                                </pre>
                                                <button 
                                                    onClick={() => handleCopyPrompt(task.suggestedPrompt, index)}
                                                    className="absolute top-2 right-2 rtl:right-auto rtl:left-2 px-2 py-1 bg-gray-600 text-gray-200 text-xs rounded opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200"
                                                    aria-label={t('caseStrategist.copyPrompt')}
                                                >
                                                    {copiedPromptId === index ? t('caseStrategist.copiedPrompt') : t('caseStrategist.copyPrompt')}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CaseStrategist;