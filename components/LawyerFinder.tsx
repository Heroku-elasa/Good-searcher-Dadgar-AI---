// --- components/LawyerFinder.tsx ---
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { findLawyers, generateSuggestions } from '../services/geminiService';
import { Lawyer, SearchEntityType } from '../types';
import { useLanguage } from '../types';

const parseMarkdownLink = (text: string): { url: string; title: string } => {
    const markdownMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(text);
    if (markdownMatch) {
        return { title: markdownMatch[1], url: markdownMatch[2].trim() };
    }
    const url = text.trim();
    if (url.includes('.') && !url.includes(' ')) {
        return { title: url, url: url.startsWith('http') ? url : `https://${url}` };
    }
    return { title: text.trim(), url: '' };
};

const parseLawyerTable = (markdown: string): Lawyer[] => {
    const lawyers: Lawyer[] = [];
    const tableStartIndex = markdown.indexOf('| Name');
    if (tableStartIndex === -1) {
        console.warn("Could not find a markdown table header in the AI response.");
        return [];
    }
    const tableMarkdown = markdown.substring(tableStartIndex);
    const rows = tableMarkdown.split('\n').map(row => row.trim()).filter(row => row.startsWith('|') && row.endsWith('|'));
    if (rows.length < 2) return [];

    const headers = rows[0].split('|').map(h => h.trim().toLowerCase()).slice(1, -1);
    const headerMap: { [key: string]: number } = {};
    headers.forEach((header, index) => {
        if (header.includes('name')) headerMap.name = index;
        if (header.includes('specialty')) headerMap.specialty = index;
        if (header.includes('city')) headerMap.city = index;
        if (header.includes('address')) headerMap.address = index;
        if (header.includes('contact')) headerMap.contactInfo = index;
        if (header.includes('website')) headerMap.website = index;
        if (header.includes('relevance')) headerMap.relevanceScore = index;
    });
    
    if (headerMap.name === undefined || headerMap.website === undefined) {
        console.warn("Could not find essential 'Name' or 'Website' headers.");
        return [];
    }

    const dataRows = rows.slice(1).filter(row => !row.includes('---'));
    dataRows.forEach(row => {
        const columns = row.split('|').map(col => col.trim()).slice(1, -1);
        const name = columns[headerMap.name] ?? '';
        if (!name) return;

        const rawLink = columns[headerMap.website] ?? '';
        const linkData = parseMarkdownLink(rawLink);
        if (!linkData.url) return;

        const rawScore = headerMap.relevanceScore !== undefined ? columns[headerMap.relevanceScore] : '0';
        const relevanceScore = parseInt(rawScore?.replace('%', '').trim() || '0', 10);

        lawyers.push({
            name,
            specialty: columns[headerMap.specialty] ?? 'N/A',
            city: columns[headerMap.city] ?? 'N/A',
            address: columns[headerMap.address] ?? 'N/A',
            contactInfo: columns[headerMap.contactInfo] ?? 'N/A',
            website: linkData.url,
            websiteTitle: linkData.title,
            relevanceScore: isNaN(relevanceScore) ? 0 : relevanceScore,
        });
    });

    return lawyers;
};

interface LawyerFinderProps {
  savedLawyers: Lawyer[];
  onSaveLawyer: (lawyer: Lawyer) => void;
  onRemoveLawyer: (lawyer: Lawyer) => void;
  onClearAllSaved: () => void;
  onNoteChange: (website: string, note: string) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  entityType: SearchEntityType;
  setEntityType: (value: SearchEntityType) => void;
  handleApiError: (err: unknown) => string;
  isQuotaExhausted: boolean;
  allLawyers: Lawyer[];
  onLawyersFound: (lawyers: Lawyer[]) => void;
  onClearAllDbLawyers: () => void;
}

type SortKey = 'relevanceScore' | 'city';

const LawyerFinder: React.FC<LawyerFinderProps> = ({ 
    savedLawyers,
    onSaveLawyer,
    onRemoveLawyer,
    onClearAllSaved,
    onNoteChange,
    keywords,
    setKeywords,
    entityType,
    setEntityType,
    handleApiError,
    isQuotaExhausted,
    allLawyers,
    onLawyersFound,
    onClearAllDbLawyers
}) => {
    const { t, language } = useLanguage();
    const [maxResults, setMaxResults] = useState<number>(10);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [rawTextResult, setRawTextResult] = useState<string | null>(null);
    const [sortKey, setSortKey] = useState<SortKey>('relevanceScore');
    const [visibleContact, setVisibleContact] = useState<string | null>(null);
    const [generatedPrompt, setGeneratedPrompt] = useState('');

    const [keywordsSuggestions, setKeywordsSuggestions] = useState<string[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (keywords.trim()) {
            const entityTypePlural = entityType === 'lawyer' 
                ? (language === 'fa' ? 'وکلا' : 'lawyers')
                : (language === 'fa' ? 'دفاتر اسناد رسمی' : 'notary publics');

            const prompt = t('lawyerFinder.prompt')
                .replace('{queries}', keywords)
                .replace('{maxResults}', maxResults.toString())
                .replace('{entityTypePlural}', entityTypePlural);
            setGeneratedPrompt(prompt);
        } else {
            setGeneratedPrompt('');
        }
    }, [keywords, entityType, maxResults, language, t]);
    
    const handleSearch = async () => {
        if (!keywords.trim()) {
            setError(t('lawyerFinder.validationError'));
            return;
        }
        setError(null);
        setRawTextResult(null);
        setIsLoading(true);

        try {
            const searchResult = await findLawyers(generatedPrompt);
            const parsed = parseLawyerTable(searchResult.text);
            
            if (parsed.length > 0) {
                onLawyersFound(parsed);
            } else if (searchResult.text) {
                setRawTextResult(searchResult.text);
            }
        } catch (err) {
            const msg = handleApiError(err);
            setError(msg);
        } finally { setIsLoading(false); }
    };
    
    const isLawyerSaved = useCallback((lawyer: Lawyer): boolean => {
        return savedLawyers.some(l => l.name === lawyer.name && l.website === lawyer.website);
    }, [savedLawyers]);

    const sortedLawyers = useMemo(() => {
        return [...allLawyers].sort((a, b) => {
            switch (sortKey) {
                case 'relevanceScore': return (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0);
                case 'city': return (a.city ?? '').localeCompare(b.city ?? '');
                default: return 0;
            }
        });
    }, [allLawyers, sortKey]);

    const handleKeywordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setKeywords(value);

        if (value.trim().length > 0) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
            setKeywordsSuggestions([]);
        }

        if (suggestionTimeoutRef.current) {
            clearTimeout(suggestionTimeoutRef.current);
        }

        if (value.trim().length < 5) {
            setKeywordsSuggestions([]);
            return;
        }

        setIsSuggesting(true);
        suggestionTimeoutRef.current = window.setTimeout(async () => {
            const context = t('lawyerFinder.keywordsLabel');
            const suggestions = await generateSuggestions(value, context);
            setKeywordsSuggestions(suggestions);
            setIsSuggesting(false);
        }, 500);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setKeywords(suggestion);
        setKeywordsSuggestions([]);
        setShowSuggestions(false);
    };

    const examples: { label: string; keywords: string; entityType: SearchEntityType }[] = t('lawyerFinder.examples');

    const handleExampleClick = (example: { keywords: string; entityType: SearchEntityType }) => {
        setKeywords(example.keywords);
        setEntityType(example.entityType);
    };

    return (
        <section id="lawyer-finder" className="py-12 sm:py-16 space-y-12">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white">{t('lawyerFinder.title')}</h2>
                <p className="mt-2 text-gray-400 max-w-2xl mx-auto">{t('lawyerFinder.subtitle')}</p>
            </div>

            <div className="max-w-3xl mx-auto bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-gray-700 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300">{t('lawyerFinder.entityTypeLabel')}</label>
                    <fieldset className="mt-2">
                        <legend className="sr-only">Entity Type</legend>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex items-center">
                                <input id="entity-lawyer" name="entity-type" type="radio" value="lawyer"
                                    checked={entityType === 'lawyer'}
                                    onChange={(e) => setEntityType(e.target.value as SearchEntityType)}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-500 bg-gray-700" />
                                <label htmlFor="entity-lawyer" className="ml-2 rtl:mr-2 block text-sm font-medium text-gray-200">{t('lawyerFinder.entityTypeLawyer')}</label>
                            </div>
                            <div className="flex items-center">
                                <input id="entity-notary" name="entity-type" type="radio" value="notary"
                                    checked={entityType === 'notary'}
                                    onChange={(e) => setEntityType(e.target.value as SearchEntityType)}
                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-500 bg-gray-700" />
                                <label htmlFor="entity-notary" className="ml-2 rtl:mr-2 block text-sm font-medium text-gray-200">{t('lawyerFinder.entityTypeNotary')}</label>
                            </div>
                        </div>
                    </fieldset>
                </div>

                <div>
                    <label htmlFor="keywords-prompt" className="block text-sm font-medium text-gray-300">{t('lawyerFinder.keywordsLabel')}</label>
                     <div className="relative">
                        <textarea id="keywords-prompt" rows={3} value={keywords} 
                            onChange={handleKeywordsChange}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            onFocus={() => { if (keywords.trim().length > 0) setShowSuggestions(true); }}
                            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                            placeholder={t('lawyerFinder.keywordsPlaceholder')} 
                            autoComplete="off"
                        />
                        {showSuggestions && (isSuggesting || keywordsSuggestions.length > 0) && (
                            <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-lg">
                                <ul className="py-1 max-h-48 overflow-y-auto">
                                    {isSuggesting && keywordsSuggestions.length === 0 && (
                                        <li className="px-3 py-2 text-sm text-gray-400">در حال جستجو...</li>
                                    )}
                                    {keywordsSuggestions.map((suggestion, index) => (
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
                    <label htmlFor="max-results" className="block text-sm font-medium text-gray-300">{t('lawyerFinder.maxResults')} ({maxResults})</label>
                    <input id="max-results" type="range" min="5" max="25" step="5" value={maxResults} onChange={(e) => setMaxResults(Number(e.target.value))}
                        className="mt-1 block w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                </div>
                
                {Array.isArray(examples) && examples.length > 0 && (
                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-400 mb-3">{t('lawyerFinder.tryExample')}</p>
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
                    <button onClick={handleSearch} disabled={isLoading || !keywords.trim() || isQuotaExhausted}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
                        {isLoading ? t('lawyerFinder.finding') : isQuotaExhausted ? t('quotaErrorModal.title') : t('lawyerFinder.findButton')}
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
            </div>
            
            {savedLawyers.length > 0 && (
                <div className="mt-12 space-y-8 animate-fade-in">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-white">{t('lawyerFinder.savedTitle')}</h3>
                        <button onClick={onClearAllSaved} className="px-3 py-1 bg-red-800/70 hover:bg-red-700 text-white text-sm font-semibold rounded-md transition-colors">{t('lawyerFinder.clearAll')}</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {savedLawyers.map((lawyer, index) => (
                            <div key={`${lawyer.website}-${index}`} className="bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 p-6 flex flex-col">
                                <a href={lawyer.website} target="_blank" rel="noopener noreferrer" className="hover:underline"><h4 className="text-lg font-bold text-teal-300">{lawyer.name}</h4></a>
                                <p className="text-sm text-gray-400 mb-2">{lawyer.specialty} - {lawyer.city}</p>
                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <label htmlFor={`notes-${index}`} className="block text-sm font-medium text-gray-300 mb-2">{t('lawyerFinder.notesLabel')}</label>
                                    <textarea id={`notes-${index}`} rows={3}
                                        className="w-full bg-gray-900 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white transition-colors"
                                        placeholder={t('lawyerFinder.notesPlaceholder')} value={lawyer.notes || ''} onChange={(e) => onNoteChange(lawyer.website, e.target.value)} />
                                </div>
                                <div className="mt-6">
                                     <button onClick={() => onRemoveLawyer(lawyer)} className="w-full text-center bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-colors">{t('lawyerFinder.remove')}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-12 space-y-8">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h3 className="text-2xl font-bold text-white">{t('lawyerFinder.crateTitle')}</h3>
                        <p className="text-sm text-gray-400">{t('lawyerFinder.crateSubtitle')}</p>
                    </div>
                    {allLawyers.length > 0 &&
                        <button onClick={onClearAllDbLawyers} className="px-3 py-1 bg-red-800/70 hover:bg-red-700 text-white text-sm font-semibold rounded-md transition-colors">{t('lawyerFinder.clearCrate')}</button>
                    }
                </div>

                {isLoading && (
                    <div className="text-center p-8"><div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-400 mx-auto"></div></div>
                )}
                {error && !error.includes('(Quota Exceeded)') && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
                
                {!isLoading && (
                    <div className="space-y-6">
                        {sortedLawyers.length > 0 ? (
                            <>
                                <div className="flex justify-end">
                                    <label htmlFor="sort-key" className="text-sm text-gray-400 self-center mr-2">{t('lawyerFinder.sortBy')}:</label>
                                    <select id="sort-key" value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}
                                        className="bg-gray-700 border-gray-600 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white">
                                        <option value="relevanceScore">{t('lawyerFinder.sort.relevance')}</option>
                                        <option value="city">{t('lawyerFinder.sort.city')}</option>
                                    </select>
                                </div>
                                <div className="space-y-8">
                                    {sortedLawyers.map((lawyer) => (
                                        <div key={lawyer.website} className="pb-8 border-b border-gray-700 last:border-b-0">
                                            <a href={lawyer.website} target="_blank" rel="noopener noreferrer" className="group">
                                                <h4 className="text-xl font-medium text-blue-400 group-hover:underline truncate" title={lawyer.name}>
                                                    {lawyer.name}
                                                </h4>
                                                <p className="text-sm text-green-400 truncate">{lawyer.website}</p>
                                            </a>
                                            <p className="mt-2 text-gray-300">
                                                <strong className="font-semibold">{lawyer.specialty}</strong> &bull; {lawyer.city}
                                            </p>
                                            
                                            {visibleContact === lawyer.website ? (
                                                <div className="mt-3 p-3 bg-gray-900/50 rounded-md animate-fade-in border border-gray-700">
                                                    <p className="text-sm text-gray-300 break-words">
                                                        <strong className="text-gray-400">{t('lawyerFinder.contact')}: </strong>
                                                        {lawyer.contactInfo}
                                                    </p>
                                                    <p className="text-sm text-gray-300 break-words mt-1">
                                                        <strong className="text-gray-400">{t('lawyerFinder.address')}: </strong>
                                                        {lawyer.address}
                                                    </p>
                                                </div>
                                            ) : <p className="mt-1 text-sm text-gray-400">{lawyer.address}</p>}

                                            <div className="mt-4 flex items-center gap-3">
                                                 <button
                                                    onClick={() => setVisibleContact(visibleContact === lawyer.website ? null : lawyer.website)}
                                                    className="px-3 py-1 text-xs font-semibold rounded-full transition-colors flex items-center justify-center bg-gray-700 text-gray-200 hover:bg-gray-600"
                                                >
                                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                     <span className={language === 'fa' ? 'mr-1.5' : 'ml-1.5'}>
                                                        {visibleContact === lawyer.website ? t('lawyerFinder.hideContact') : t('lawyerFinder.showContact')}
                                                     </span>
                                                </button>
                                                <button onClick={() => onSaveLawyer(lawyer)} disabled={isLawyerSaved(lawyer)} className="px-3 py-1 text-xs font-semibold rounded-full transition-colors bg-purple-800 text-purple-200 hover:bg-purple-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed">
                                                    {isLawyerSaved(lawyer) ? `✓ ${t('lawyerFinder.saved')}` : `+ ${t('lawyerFinder.save')}`}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            rawTextResult ? (
                                <div className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
                                    <h4 className="font-semibold text-white mb-2">{t('lawyerFinder.parseErrorTitle')}</h4>
                                    <pre className="whitespace-pre-wrap bg-gray-900/50 p-4 rounded-md text-sm text-gray-300">{rawTextResult}</pre>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-10 bg-gray-800/30 rounded-lg"><p>{t('lawyerFinder.crateEmpty')}</p></div>
                            )
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default LawyerFinder;