import React, { useState, useEffect } from 'react';
import { PersonalityAnalysisResult, TraitAnalysis, useLanguage } from '../types';

interface RadarChartProps {
    data: { trait: string; score: number }[];
    size: number;
    maxValue?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, size, maxValue = 10 }) => {
    const center = size / 2;
    const radius = size * 0.35;
    const numTicks = 4;
    const ticks = Array.from({ length: numTicks }, (_, i) => (i + 1) * (maxValue / numTicks));

    if (!data || data.length === 0) return null;
    
    const angleSlice = (Math.PI * 2) / data.length;

    const getPoint = (value: number, index: number) => {
        const angle = angleSlice * index - Math.PI / 2;
        const currentRadius = (value / maxValue) * radius;
        return {
            x: center + currentRadius * Math.cos(angle),
            y: center + currentRadius * Math.sin(angle),
        };
    };

    const points = data.map((d, i) => getPoint(d.score, i));
    const pathData = points.map(p => `${p.x},${p.y}`).join(' ');

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="Radar chart of personality traits">
            <g>
                {/* Grid lines */}
                {ticks.map(tick => (
                    <polygon
                        key={tick}
                        points={data.map((_, i) => {
                            const p = getPoint(tick, i);
                            return `${p.x},${p.y}`;
                        }).join(' ')}
                        fill="none"
                        stroke="rgba(107, 114, 128, 0.5)"
                        strokeWidth="1"
                    />
                ))}
                {/* Axes */}
                {data.map((_, i) => {
                    const p = getPoint(maxValue, i);
                    return <line key={`axis-${i}`} x1={center} y1={center} x2={p.x} y2={p.y} stroke="rgba(107, 114, 128, 0.5)" strokeWidth="1" />;
                })}
                {/* Labels */}
                {data.map((d, i) => {
                    const p = getPoint(maxValue * 1.2, i);
                    return (
                        <text
                            key={`label-${i}`}
                            x={p.x}
                            y={p.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#cbd5e1"
                            fontSize="12"
                            fontWeight="bold"
                        >
                            {d.trait}
                        </text>
                    );
                })}
                {/* Data polygon */}
                <polygon points={pathData} fill="rgba(99, 102, 241, 0.4)" stroke="#818cf8" strokeWidth="2" />
                {/* Data points */}
                {points.map((p, i) => (
                    <circle key={`point-${i}`} cx={p.x} cy={p.y} r="4" fill="#818cf8" />
                ))}
            </g>
        </svg>
    );
};


interface PersonalityAnalystProps {
    onAnalyze: (text: string) => void;
    text: string;
    setText: (value: string) => void;
    result: PersonalityAnalysisResult | null;
    isLoading: boolean;
    error: string | null;
    isQuotaExhausted: boolean;
}

const PersonalityAnalyst: React.FC<PersonalityAnalystProps> = ({ onAnalyze, text, setText, result, isLoading, error, isQuotaExhausted }) => {
    const { t } = useLanguage();
    const [generatedPrompt, setGeneratedPrompt] = useState('');

    useEffect(() => {
        if (text.trim()) {
            const prompt = t('personalityAnalyst.prompt').replace('{text}', text);
            setGeneratedPrompt(prompt);
        } else {
            setGeneratedPrompt('');
        }
    }, [text, t]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            alert(t('personalityAnalyst.validationError'));
            return;
        }
        onAnalyze(text);
    };

    const getTranslatedTrait = (traitKey: string): string => {
        const keyMap: { [key: string]: string } = {
            'Kantianism': 'kantianism',
            'Humanism': 'humanism',
            'Faith in Humanity': 'faithInHumanity',
            'Intimacy': 'intimacy',
            'Passion': 'passion',
            'Commitment': 'commitment',
        };
        return t(`personalityAnalyst.traits.${keyMap[traitKey]}`) || traitKey;
    };

    const renderAnalysisSection = (title: string, description: string, analysisData: TraitAnalysis[]) => {
        if (!analysisData || analysisData.length === 0) return null;
        const chartData = analysisData.map(item => ({ trait: getTranslatedTrait(item.trait), score: item.score }));

        return (
            <div className="bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="mt-1 text-sm text-gray-400">{description}</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-6 p-6">
                    <div className="flex justify-center items-center">
                       {chartData.length > 0 && <RadarChart data={chartData} size={300} />}
                    </div>
                    <div className="space-y-4">
                        {analysisData.map(item => (
                            <div key={item.trait}>
                                <h4 className="font-bold text-teal-300">{getTranslatedTrait(item.trait)} - <span className="text-white">{t('personalityAnalyst.score')}: {item.score}/10</span></h4>
                                <p className="text-sm text-gray-300 mt-1"><strong className="text-gray-400">{t('personalityAnalyst.reasoning')}:</strong> {item.reasoning}</p>
                                <p className="text-sm text-gray-300 mt-1"><strong className="text-gray-400">{t('personalityAnalyst.suggestion')}:</strong> {item.suggestion}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    const examples: { label: string; text: string; }[] = t('personalityAnalyst.examples');

    const handleExampleClick = (example: { text: string; }) => {
        setText(example.text);
    };

    return (
        <section id="personality-analyst" className="py-12 sm:py-16">
            <div className="max-w-5xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white">{t('personalityAnalyst.title')}</h2>
                    <p className="mt-2 text-gray-400 max-w-2xl mx-auto">{t('personalityAnalyst.subtitle')}</p>
                </div>

                <div className="mt-10 bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-gray-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="text-to-analyze" className="block text-sm font-medium text-gray-300">{t('personalityAnalyst.textLabel')}</label>
                            <textarea
                                id="text-to-analyze"
                                rows={8}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                                placeholder={t('personalityAnalyst.textPlaceholder')}
                            />
                        </div>

                        {Array.isArray(examples) && examples.length > 0 && (
                          <div className="pt-2">
                            <p className="text-sm font-medium text-gray-400 mb-3">{t('personalityAnalyst.tryExample')}</p>
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
                                {isLoading ? t('personalityAnalyst.analyzing') : isQuotaExhausted ? t('quotaErrorModal.title') : t('personalityAnalyst.buttonText')}
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
                    <div className="mt-10 animate-fade-in space-y-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white">{t('personalityAnalyst.resultsTitle')}</h3>
                        </div>
                        {isLoading && (
                            <div className="flex items-center justify-center py-8">
                                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-400"></div>
                                <span className="ml-4 text-gray-400">{t('personalityAnalyst.analyzing')}</span>
                            </div>
                        )}
                        {error && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
                        {result && (
                            <>
                                {renderAnalysisSection(
                                    t('personalityAnalyst.lightTriadTitle'),
                                    t('personalityAnalyst.lightTriadDescription'),
                                    result.lightTriad
                                )}
                                {renderAnalysisSection(
                                    t('personalityAnalyst.loveTriadTitle'),
                                    t('personalityAnalyst.loveTriadDescription'),
                                    result.loveTriad
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default PersonalityAnalyst;