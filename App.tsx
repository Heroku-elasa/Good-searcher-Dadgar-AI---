import React, { useState, useCallback, useEffect } from 'react';
import { marked } from 'marked';
import SiteHeader from './components/Header';
import HomePage from './components/Hero';
import LawyerFinder from './components/LawyerFinder';
import LegalDrafter from './components/LegalDrafter';
import NewsSummarizer from './components/NewsSummarizer';
import CaseStrategist from './components/CaseStrategist';
import PersonalityAnalyst from './components/PersonalityAnalyst';
import ContractGenerator from './components/ContractGenerator';
import LegalResearch from './components/LegalResearch';
import DepositionSummarizer from './components/DepositionSummarizer';
import EDiscoveryHelper from './components/EDiscoveryHelper';
import SiteFooter from './components/Footer';
import QuotaErrorModal from './components/QuotaErrorModal';
import AIGuideModal from './components/AIGuideModal';
import InvestmentPage from './components/InvestmentPage';
import PythonProjectsPage from './components/PythonProjectsPage';
import { generateReportStream, summarizeNews, generateStrategy, routeUserIntent, analyzeDocumentStream, analyzePersonality, legalSearch, summarizeDepositionStream, generateEDiscoveryKeywords, findLawyers } from './services/geminiService';
import { initDB, getAllLawyers, addLawyers, clearAllLawyers } from './services/dbService';
import { Lawyer, Checkpoint, AppState, useLanguage, Source, StrategyTask, IntentRoute, PageKey, PersonalityAnalysisResult, EDiscoveryKeywords, SearchEntityType, SuggestedInputs } from './types';
import { REPORT_TYPES } from './constants';


// --- AI ASSISTANT PAGE COMPONENT (NOW WITH TABS) ---

const AIAssistantHero: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="text-center pt-16 pb-12 sm:pt-24 sm:pb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 tracking-tight">
                {t('aiHero.title')}
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">{t('aiHero.subtitle')}</p>
        </div>
    );
};

const LegalAssistantPage: React.FC<any> = ({
    page,
    setPage,
    // Drafter Props
    handleGenerate, generatedDocument, isLoading, error, isComplete, topic, description, docType, setTopic, setDescription, setDocType,
    onAnalyze, analysisResult, isAnalyzing, analysisError,
    // Lawyer Finder Props
    savedLawyers, handleSaveLawyer, handleRemoveLawyer, handleClearAllSaved, handleNoteChange, lawyerFinderKeywords, setLawyerFinderKeywords,
    lawyerFinderEntityType, setLawyerFinderEntityType,
    allLawyers, onLawyersFound, onClearAllDbLawyers,
    // News Summarizer Props
    handleSummarizeNews, newsQuery, setNewsQuery, newsSummary, newsSources, isSummarizingNews, newsError,
    // Case Strategist Props
    handleGenerateStrategy, strategyGoal, setStrategyGoal, strategyResult, isGeneratingStrategy, strategyError,
    // Personality Analyst Props
    handleAnalyzePersonality, personalityAnalysisText, setPersonalityAnalysisText, personalityAnalysisResult, isAnalyzingPersonality, personalityAnalysisError,
    // Contract Generator Props
    handleGenerateContract, contractInvestor, setContractInvestor, contractCompany, setContractCompany, contractAmount, setContractAmount, contractShare, setContractShare, contractDuration, setContractDuration, generatedContract,
    // Legal Research Props
    handleLegalSearch, researchQuery, setResearchQuery, researchResult, researchSources, isSearchingLegal, legalSearchError,
    // Deposition Summarizer Props
    handleSummarizeDeposition, depositionText, setDepositionText, depositionSummary, isSummarizingDeposition, depositionError,
    // E-Discovery Helper Props
    handleGenerateKeywords, eDiscoveryCaseDesc, setEDiscoveryCaseDesc, eDiscoveryKeywords, isGeneratingKeywords, eDiscoveryError,
    // Global Error Props
    handleApiError,
    isQuotaExhausted,
}) => {
    const { t } = useLanguage();

    const tabs = [
        { id: 'legal_drafter', label: t('header.aiAssistant') },
        { id: 'lawyer_finder', label: t('header.lawyerFinder') },
        { id: 'news_summarizer', label: t('header.newsSummarizer') },
        { id: 'case_strategist', label: t('header.caseStrategist') },
        { id: 'personality_analyst', label: t('header.personalityAnalyst') },
        { id: 'contract_generator', label: t('header.contractGenerator') },
        { id: 'legal_research', label: t('header.legalResearch') },
        { id: 'deposition_summarizer', label: t('header.depositionSummarizer') },
        { id: 'e_discovery_helper', label: t('header.eDiscoveryHelper') },
    ];
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AIAssistantHero />

             {/* Tab Navigation */}
            <div className="border-b border-gray-700 mb-8 sticky top-20 bg-gray-900/80 backdrop-blur-sm z-40">
                <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setPage(tab.id)}
                            className={`whitespace-nowrap py-4 px-2 sm:px-4 border-b-2 font-medium text-sm transition-colors ${
                                page === tab.id
                                    ? 'border-blue-400 text-blue-300'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {page === 'legal_drafter' && (
                    <LegalDrafter
                      onGenerate={handleGenerate}
                      generatedDocument={generatedDocument}
                      isLoading={isLoading}
                      error={error}
                      isComplete={isComplete}
                      topic={topic}
                      description={description}
                      docType={docType}
                      setTopic={setTopic}
                      setDescription={setDescription}
                      setDocType={setDocType}
                      isQuotaExhausted={isQuotaExhausted}
                      onAnalyze={onAnalyze}
                      analysisResult={analysisResult}
                      isAnalyzing={isAnalyzing}
                      analysisError={analysisError}
                    />
                )}
                {page === 'lawyer_finder' && (
                    <LawyerFinder 
                        savedLawyers={savedLawyers}
                        onSaveLawyer={handleSaveLawyer}
                        onRemoveLawyer={handleRemoveLawyer}
                        onClearAllSaved={handleClearAllSaved}
                        onNoteChange={handleNoteChange}
                        keywords={lawyerFinderKeywords}
                        setKeywords={setLawyerFinderKeywords}
                        entityType={lawyerFinderEntityType}
                        setEntityType={setLawyerFinderEntityType}
                        handleApiError={handleApiError}
                        isQuotaExhausted={isQuotaExhausted}
                        allLawyers={allLawyers}
                        onLawyersFound={onLawyersFound}
                        onClearAllDbLawyers={onClearAllDbLawyers}
                    />
                )}
                {page === 'news_summarizer' && (
                    <NewsSummarizer
                      onSummarize={handleSummarizeNews}
                      query={newsQuery}
                      setQuery={setNewsQuery}
                      summary={newsSummary}
                      sources={newsSources}
                      isLoading={isSummarizingNews}
                      error={newsError}
                      isQuotaExhausted={isQuotaExhausted}
                    />
                )}
                 {page === 'case_strategist' && (
                    <CaseStrategist
                      onGenerate={handleGenerateStrategy}
                      goal={strategyGoal}
                      setGoal={setStrategyGoal}
                      result={strategyResult}
                      isLoading={isGeneratingStrategy}
                      error={strategyError}
                      isQuotaExhausted={isQuotaExhausted}
                    />
                )}
                 {page === 'personality_analyst' && (
                    <PersonalityAnalyst
                      onAnalyze={handleAnalyzePersonality}
                      text={personalityAnalysisText}
                      setText={setPersonalityAnalysisText}
                      result={personalityAnalysisResult}
                      isLoading={isAnalyzingPersonality}
                      error={personalityAnalysisError}
                      isQuotaExhausted={isQuotaExhausted}
                    />
                )}
                {page === 'contract_generator' && (
                    <ContractGenerator
                        onGenerate={handleGenerateContract}
                        investor={contractInvestor}
                        setInvestor={setContractInvestor}
                        company={contractCompany}
                        setCompany={setContractCompany}
                        amount={contractAmount}
                        setAmount={setContractAmount}
                        share={contractShare}
                        setShare={setContractShare}
                        duration={contractDuration}
                        setDuration={setContractDuration}
                        generatedContract={generatedContract}
                    />
                )}
                {page === 'legal_research' && (
                    <LegalResearch
                        onSearch={handleLegalSearch}
                        query={researchQuery}
                        setQuery={setResearchQuery}
                        result={researchResult}
                        sources={researchSources}
                        isLoading={isSearchingLegal}
                        error={legalSearchError}
                        isQuotaExhausted={isQuotaExhausted}
                    />
                )}
                 {page === 'deposition_summarizer' && (
                    <DepositionSummarizer
                        onSummarize={handleSummarizeDeposition}
                        text={depositionText}
                        setText={setDepositionText}
                        summary={depositionSummary}
                        isLoading={isSummarizingDeposition}
                        error={depositionError}
                        isQuotaExhausted={isQuotaExhausted}
                    />
                )}
                {page === 'e_discovery_helper' && (
                    <EDiscoveryHelper
                        onGenerate={handleGenerateKeywords}
                        caseDesc={eDiscoveryCaseDesc}
                        setCaseDesc={setEDiscoveryCaseDesc}
                        keywords={eDiscoveryKeywords}
                        isLoading={isGeneratingKeywords}
                        error={eDiscoveryError}
                        isQuotaExhausted={isQuotaExhausted}
                    />
                )}
            </div>
        </div>
    );
}

// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const { language, t } = useLanguage();
  const [page, setPage] = useState<PageKey | 'home'>('home');

  // All application state is managed here
  const [generatedDocument, setGeneratedDocument] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [docType, setDocType] = useState(REPORT_TYPES[0].value);
  const [deeperAnalysisResult, setDeeperAnalysisResult] = useState<string>('');
  const [isAnalyzingDeeper, setIsAnalyzingDeeper] = useState<boolean>(false);
  const [deeperAnalysisError, setDeeperAnalysisError] = useState<string | null>(null);

  const [savedLawyers, setSavedLawyers] = useState<Lawyer[]>([]);
  const [allLawyers, setAllLawyers] = useState<Lawyer[]>([]);
  const [lawyerFinderKeywords, setLawyerFinderKeywords] = useState<string>('');
  const [lawyerFinderEntityType, setLawyerFinderEntityType] = useState<SearchEntityType>('lawyer');
  
  const [newsQuery, setNewsQuery] = useState('');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsSources, setNewsSources] = useState<Source[]>([]);
  const [isSummarizingNews, setIsSummarizingNews] = useState(false);
  const [newsError, setNewsError] = useState<string|null>(null);

  const [strategyGoal, setStrategyGoal] = useState('');
  const [strategyResult, setStrategyResult] = useState<StrategyTask[]>([]);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [strategyError, setStrategyError] = useState<string|null>(null);

  const [personalityAnalysisText, setPersonalityAnalysisText] = useState('');
  const [personalityAnalysisResult, setPersonalityAnalysisResult] = useState<PersonalityAnalysisResult | null>(null);
  const [isAnalyzingPersonality, setIsAnalyzingPersonality] = useState(false);
  const [personalityAnalysisError, setPersonalityAnalysisError] = useState<string|null>(null);

  // Contract Generator State
  const [contractInvestor, setContractInvestor] = useState('');
  const [contractCompany, setContractCompany] = useState('');
  const [contractAmount, setContractAmount] = useState('');
  const [contractShare, setContractShare] = useState('');
  const [contractDuration, setContractDuration] = useState('');
  const [generatedContract, setGeneratedContract] = useState('');

  // Legal Research State
  const [researchQuery, setResearchQuery] = useState('');
  const [researchResult, setResearchResult] = useState('');
  const [researchSources, setResearchSources] = useState<Source[]>([]);
  const [isSearchingLegal, setIsSearchingLegal] = useState(false);
  const [legalSearchError, setLegalSearchError] = useState<string|null>(null);

  // Deposition Summarizer State
  const [depositionText, setDepositionText] = useState('');
  const [depositionSummary, setDepositionSummary] = useState('');
  const [isSummarizingDeposition, setIsSummarizingDeposition] = useState(false);
  const [depositionError, setDepositionError] = useState<string|null>(null);

  // E-Discovery Helper State
  const [eDiscoveryCaseDesc, setEDiscoveryCaseDesc] = useState('');
  const [eDiscoveryKeywords, setEDiscoveryKeywords] = useState<EDiscoveryKeywords | null>(null);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [eDiscoveryError, setEDiscoveryError] = useState<string|null>(null);

  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  
  // State for AI Guide
  const [isAIGuideOpen, setIsAIGuideOpen] = useState(false);
  const [aiGuidePrompt, setAIGuidePrompt] = useState('');
  const [aiGuideResults, setAIGuideResults] = useState<IntentRoute[]>([]);
  const [isRouting, setIsRouting] = useState(false);
  const [routingError, setRoutingError] = useState<string | null>(null);

  // Global Error State
  const [showQuotaErrorModal, setShowQuotaErrorModal] = useState<boolean>(false);
  const [isQuotaExhausted, setIsQuotaExhausted] = useState<boolean>(false);

  // Global handler for API errors, checks for quota issues.
  const handleApiError = useCallback((err: unknown): string => {
    const errorMessage = err instanceof Error ? err.message : String(err);
    if (errorMessage.includes('(Quota Exceeded)')) {
      setShowQuotaErrorModal(true);
      setIsQuotaExhausted(true);
    }
    return errorMessage;
  }, []);


  // Set document direction based on language
  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Load from local storage and DB on initial mount
  useEffect(() => {
    const loadData = async () => {
        try {
            await initDB();
            const dbLawyers = await getAllLawyers();
            setAllLawyers(dbLawyers);

            const savedLawyersItem = window.localStorage.getItem('savedLawyers');
            if (savedLawyersItem) setSavedLawyers(JSON.parse(savedLawyersItem));

            const checkpointsItem = window.localStorage.getItem('projectCheckpoints');
            if (checkpointsItem) {
                const loadedCheckpoints = JSON.parse(checkpointsItem);
                setCheckpoints(loadedCheckpoints);
            } else {
                const initialState: AppState = {
                    page: 'home',
                    document: '',
                    form: { topic: '', description: '', docType: REPORT_TYPES[0].value },
                    lawyers: [],
                    allLawyers: [],
                    lawyerFinderKeywords: '',
                    lawyerFinderEntityType: 'lawyer',
                    newsQuery: '',
                    newsSummary: '',
                    newsSources: [],
                    strategyGoal: '',
                    strategyResult: [],
                    aiGuidePrompt: '',
                    aiGuideResults: [],
                    deeperAnalysisResult: '',
                    deeperAnalysisError: null,
                    personalityAnalysisText: '',
                    personalityAnalysisResult: null,
                    personalityAnalysisError: null,
                    contractInvestor: '',
                    contractCompany: '',
                    contractAmount: '',
                    contractShare: '',
                    contractDuration: '',
                    generatedContract: '',
                    researchQuery: '',
                    researchResult: '',
                    researchSources: [],
                    depositionText: '',
                    depositionSummary: '',
                    eDiscoveryCaseDesc: '',
                    eDiscoveryKeywords: null,
                };
                const initialCheckpoint: Checkpoint = {
                    id: `ckpt-init-${Date.now()}`,
                    timestamp: Date.now(),
                    name: 'Initial Clean State',
                    state: initialState,
                };
                setCheckpoints([initialCheckpoint]);
            }
        } catch (error) {
            console.error("Error loading data from storage", error);
        }
    };
    loadData();
  }, []);

  // Persist lawyers and checkpoints to local storage
  useEffect(() => {
    try { 
      window.localStorage.setItem('savedLawyers', JSON.stringify(savedLawyers)); 
      window.localStorage.setItem('projectCheckpoints', JSON.stringify(checkpoints));
    } catch (error) { console.error("Error saving general data", error); }
  }, [savedLawyers, checkpoints]);
  

  // --- All handlers remain here ---
  const handleCreateCheckpoint = useCallback(() => {
    const checkpointName = prompt('Enter a name for this checkpoint:', `Checkpoint ${new Date().toLocaleString()}`);
    if (!checkpointName) return;

    const currentState: AppState = {
      page,
      document: generatedDocument,
      form: { topic, description, docType },
      lawyers: savedLawyers,
      allLawyers: allLawyers,
      lawyerFinderKeywords,
      lawyerFinderEntityType,
      newsQuery,
      newsSummary,
      newsSources,
      strategyGoal,
      strategyResult,
      aiGuidePrompt,
      aiGuideResults,
      deeperAnalysisResult,
      deeperAnalysisError,
      personalityAnalysisText,
      personalityAnalysisResult,
      personalityAnalysisError,
      contractInvestor,
      contractCompany,
      contractAmount,
      contractShare,
      contractDuration,
      generatedContract,
      researchQuery,
      researchResult,
      researchSources,
      depositionText,
      depositionSummary,
      eDiscoveryCaseDesc,
      eDiscoveryKeywords,
    };

    const newCheckpoint: Checkpoint = {
      id: `ckpt-${Date.now()}`,
      timestamp: Date.now(),
      name: checkpointName,
      state: currentState,
    };

    setCheckpoints(prev => [newCheckpoint, ...prev]);
  }, [page, generatedDocument, topic, description, docType, savedLawyers, allLawyers, lawyerFinderKeywords, lawyerFinderEntityType, newsQuery, newsSummary, newsSources, strategyGoal, strategyResult, aiGuidePrompt, aiGuideResults, deeperAnalysisResult, deeperAnalysisError, personalityAnalysisText, personalityAnalysisResult, personalityAnalysisError, contractInvestor, contractCompany, contractAmount, contractShare, contractDuration, generatedContract, researchQuery, researchResult, researchSources, depositionText, depositionSummary, eDiscoveryCaseDesc, eDiscoveryKeywords]);

  const handleRestoreCheckpoint = useCallback((id: string) => {
    const checkpointToRestore = checkpoints.find(ckpt => ckpt.id === id);
    if (checkpointToRestore) {
      const state = checkpointToRestore.state;
      setPage(state.page as any);
      setGeneratedDocument(state.document);
      setTopic(state.form.topic);
      setDescription(state.form.description);
      setDocType(state.form.docType);
      setSavedLawyers(state.lawyers);
      setAllLawyers(state.allLawyers || []);
      setLawyerFinderKeywords(state.lawyerFinderKeywords);
      setLawyerFinderEntityType(state.lawyerFinderEntityType || 'lawyer');
      setNewsQuery(state.newsQuery || '');
      setNewsSummary(state.newsSummary || '');
      setNewsSources(state.newsSources || []);
      setStrategyGoal(state.strategyGoal || '');
      setStrategyResult(state.strategyResult || []);
      setAIGuidePrompt(state.aiGuidePrompt || '');
      setAIGuideResults(state.aiGuideResults || []);
      setDeeperAnalysisResult(state.deeperAnalysisResult || '');
      setDeeperAnalysisError(state.deeperAnalysisError || null);
      setPersonalityAnalysisText(state.personalityAnalysisText || '');
      setPersonalityAnalysisResult(state.personalityAnalysisResult || null);
      setPersonalityAnalysisError(state.personalityAnalysisError || null);
      setContractInvestor(state.contractInvestor || '');
      setContractCompany(state.contractCompany || '');
      setContractAmount(state.contractAmount || '');
      setContractShare(state.contractShare || '');
      setContractDuration(state.contractDuration || '');
      setGeneratedContract(state.generatedContract || '');
      setResearchQuery(state.researchQuery || '');
      setResearchResult(state.researchResult || '');
      setResearchSources(state.researchSources || []);
      setDepositionText(state.depositionText || '');
      setDepositionSummary(state.depositionSummary || '');
      setEDiscoveryCaseDesc(state.eDiscoveryCaseDesc || '');
      setEDiscoveryKeywords(state.eDiscoveryKeywords || null);
      
      alert(`Restored checkpoint: "${checkpointToRestore.name}"`);
    }
  }, [checkpoints]);

  const handleDeleteCheckpoint = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this checkpoint? This action cannot be undone.')) {
        setCheckpoints(prev => prev.filter(ckpt => ckpt.id !== id));
    }
  }, []);

  const handleGenerate = useCallback(async (newTopic: string, newDescription: string, newDocType: string) => {
    setIsLoading(true);
    setGeneratedDocument('');
    setError(null);
    setDeeperAnalysisResult('');
    setDeeperAnalysisError(null);
    setTopic(newTopic);
    setDescription(newDescription);
    setDocType(newDocType);

    try {
      const stream = generateReportStream(newTopic, newDescription, newDocType);
      for await (const chunk of stream) {
        setGeneratedDocument(prev => prev + chunk);
      }
    } catch (err) {
        const msg = handleApiError(err);
        setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

    const handleDeeperAnalysis = useCallback(async () => {
        if (!generatedDocument) return;

        setIsAnalyzingDeeper(true);
        setDeeperAnalysisResult('');
        setDeeperAnalysisError(null);

        const promptTemplate = t('deeperAnalysis.prompt');

        try {
            const stream = analyzeDocumentStream(generatedDocument, promptTemplate);
            for await (const chunk of stream) {
                setDeeperAnalysisResult(prev => prev + chunk);
            }
        } catch (err) {
            const msg = handleApiError(err);
            setDeeperAnalysisError(msg);
        } finally {
            setIsAnalyzingDeeper(false);
        }
    }, [generatedDocument, handleApiError, t]);

    const handleSummarizeNews = useCallback(async (query: string) => {
        setIsSummarizingNews(true);
        setNewsSummary('');
        setNewsSources([]);
        setNewsError(null);
        setNewsQuery(query);
        
        const prompt = t('newsSummarizer.prompt').replace('{query}', query);

        try {
            const result = await summarizeNews(prompt);
            const htmlSummary = marked.parse(result.text) as string;
            setNewsSummary(htmlSummary);
            setNewsSources(result.sources);
        } catch (err) {
            const msg = handleApiError(err);
            setNewsError(msg);
        } finally {
            setIsSummarizingNews(false);
        }
    }, [handleApiError, t]);

    const handleGenerateStrategy = useCallback(async (goal: string) => {
        setIsGeneratingStrategy(true);
        setStrategyResult([]);
        setStrategyError(null);
        setStrategyGoal(goal);
        
        const promptTemplate = t('caseStrategist.prompt');

        try {
            const result = await generateStrategy(goal, promptTemplate);
            setStrategyResult(result);
        } catch (err) {
            const msg = handleApiError(err);
            setStrategyError(msg);
        } finally {
            setIsGeneratingStrategy(false);
        }
    }, [handleApiError, t]);

    const handleAnalyzePersonality = useCallback(async (text: string) => {
        setIsAnalyzingPersonality(true);
        setPersonalityAnalysisResult(null);
        setPersonalityAnalysisError(null);
        setPersonalityAnalysisText(text);
        
        const promptTemplate = t('personalityAnalyst.prompt');

        try {
            const result = await analyzePersonality(text, promptTemplate);
            setPersonalityAnalysisResult(result);
        } catch (err) {
            const msg = handleApiError(err);
            setPersonalityAnalysisError(msg);
        } finally {
            setIsAnalyzingPersonality(false);
        }
    }, [handleApiError, t]);

  const handleGenerateContract = useCallback(() => {
      const template = t('contractGenerator.contractTemplate');
      const date = new Date().toLocaleDateString(language === 'fa' ? "fa-IR" : "en-US", {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
      let formattedText = template
          .replace('{investor}', contractInvestor)
          .replace('{company}', contractCompany)
          .replace('{amount}', new Intl.NumberFormat().format(Number(contractAmount)))
          .replace('{share}', contractShare)
          .replace('{duration}', contractDuration)
          .replace('{date}', date);
      setGeneratedContract(formattedText);
  }, [t, language, contractInvestor, contractCompany, contractAmount, contractShare, contractDuration]);

  const handleRouteIntent = useCallback(async (goal: string) => {
      setIsRouting(true);
      setAIGuideResults([]);
      setRoutingError(null);
      setAIGuidePrompt(goal);

      const promptTemplate = t('aiGuide.prompt');

      try {
          const results = await routeUserIntent(goal, promptTemplate);
          setAIGuideResults(results);
      } catch (err) {
          const msg = handleApiError(err);
          setRoutingError(msg);
      } finally {
          setIsRouting(false);
      }
  }, [handleApiError, t]);

  // --- NEW HANDLERS ---
  const handleLegalSearch = useCallback(async (query: string) => {
        setIsSearchingLegal(true);
        setResearchResult('');
        setResearchSources([]);
        setLegalSearchError(null);
        setResearchQuery(query);
        
        const prompt = t('legalResearch.prompt').replace('{query}', query);

        try {
            const result = await legalSearch(prompt);
            setResearchResult(result.text);
            setResearchSources(result.sources);
        } catch (err) {
            const msg = handleApiError(err);
            setLegalSearchError(msg);
        } finally {
            setIsSearchingLegal(false);
        }
    }, [handleApiError, t]);

  const handleSummarizeDeposition = useCallback(async (text: string) => {
      setIsSummarizingDeposition(true);
      setDepositionSummary('');
      setDepositionError(null);
      setDepositionText(text);
      
      const prompt = t('depositionSummarizer.prompt').replace('{text}', text);
      
      try {
          const stream = summarizeDepositionStream(prompt);
          for await (const chunk of stream) {
              setDepositionSummary(prev => prev + chunk);
          }
      } catch (err) {
          const msg = handleApiError(err);
          setDepositionError(msg);
      } finally {
          setIsSummarizingDeposition(false);
      }
  }, [handleApiError, t]);

  const handleGenerateKeywords = useCallback(async (caseDesc: string) => {
      setIsGeneratingKeywords(true);
      setEDiscoveryKeywords(null);
      setEDiscoveryError(null);
      setEDiscoveryCaseDesc(caseDesc);

      const prompt = t('eDiscoveryHelper.prompt').replace('{caseDesc}', caseDesc);

      try {
          const result = await generateEDiscoveryKeywords(prompt);
          setEDiscoveryKeywords(result);
      } catch (err) {
          const msg = handleApiError(err);
          setEDiscoveryError(msg);
      } finally {
          setIsGeneratingKeywords(false);
      }
  }, [handleApiError, t]);


  const handleSelectRoute = useCallback((pageKey: PageKey, suggestedInputs?: SuggestedInputs) => {
      setPage(pageKey);
      
      if (suggestedInputs) {
        // Legal Drafter
        if (suggestedInputs.topic) setTopic(suggestedInputs.topic);
        if (suggestedInputs.description) setDescription(suggestedInputs.description);
        if (suggestedInputs.docType) setDocType(suggestedInputs.docType);
        // Lawyer Finder
        if (suggestedInputs.keywords) setLawyerFinderKeywords(suggestedInputs.keywords);
        if (suggestedInputs.entityType) setLawyerFinderEntityType(suggestedInputs.entityType);
        // News Summarizer
        if (suggestedInputs.query) setNewsQuery(suggestedInputs.query);
        // Case Strategist
        if (suggestedInputs.goal) setStrategyGoal(suggestedInputs.goal);
        // Personality Analyst
        if (suggestedInputs.text) setPersonalityAnalysisText(suggestedInputs.text);
        // Legal Research
        if (suggestedInputs.researchQuery) setResearchQuery(suggestedInputs.researchQuery);
        // Deposition Summarizer
        if (suggestedInputs.depositionText) setDepositionText(suggestedInputs.depositionText);
        // E-Discovery Helper
        if (suggestedInputs.eDiscoveryCaseDesc) setEDiscoveryCaseDesc(suggestedInputs.eDiscoveryCaseDesc);
      }
      
      setIsAIGuideOpen(false);
  }, []);

  const handleSaveLawyer = useCallback((lawyerToSave: Lawyer) => {
    setSavedLawyers(prevLawyers => {
      if (!prevLawyers.some(l => l.name === lawyerToSave.name && l.website === lawyerToSave.website)) {
        return [...prevLawyers, lawyerToSave];
      }
      return prevLawyers;
    });
  }, []);

  const handleRemoveLawyer = useCallback((lawyerToRemove: Lawyer) => {
    setSavedLawyers(prevLawyers => prevLawyers.filter(l => l.name !== lawyerToRemove.name || l.website !== lawyerToRemove.website));
  }, []);
  
  const handleClearAllSaved = useCallback(() => {
      if (window.confirm('Are you sure you want to clear all saved lawyers?')) {
          setSavedLawyers([]);
      }
  }, []);

  const handleNoteChange = useCallback((website: string, note: string) => {
    setSavedLawyers(prevLawyers => 
      prevLawyers.map(l => 
        l.website === website ? { ...l, notes: note } : l
      )
    );
  }, []);
  
  const handleLawyersFound = useCallback(async (newLawyers: Lawyer[]) => {
    try {
      await addLawyers(newLawyers);
      const updatedLawyers = await getAllLawyers();
      setAllLawyers(updatedLawyers);
    } catch (error) {
      console.error("Error saving or refreshing lawyers from DB", error);
    }
  }, []);

  const handleClearAllDbLawyers = useCallback(async () => {
    if (window.confirm('Are you sure you want to clear the entire lawyer directory? This will remove all discovered lawyers from your local database.')) {
        try {
            await clearAllLawyers();
            setAllLawyers([]);
        } catch (error) {
            console.error("Error clearing lawyer directory", error);
            alert("Failed to clear the lawyer directory.");
        }
    }
  }, []);


  // JSX to render
  const renderPage = () => {
    const assistantPages: PageKey[] = [
        'legal_drafter', 'lawyer_finder', 'news_summarizer', 'case_strategist', 
        'personality_analyst', 'contract_generator', 'legal_research', 
        'deposition_summarizer', 'e_discovery_helper'
    ];
    const isAssistantPage = assistantPages.includes(page as PageKey);

    if (isAssistantPage) {
        return <LegalAssistantPage 
            page={page}
            setPage={setPage}
            handleGenerate={handleGenerate}
            generatedDocument={generatedDocument}
            isLoading={isLoading}
            error={error}
            isComplete={!isLoading && !!generatedDocument}
            topic={topic}
            description={description}
            docType={docType}
            setTopic={setTopic}
            setDescription={setDescription}
            setDocType={setDocType}
            onAnalyze={handleDeeperAnalysis}
            analysisResult={deeperAnalysisResult}
            isAnalyzing={isAnalyzingDeeper}
            analysisError={deeperAnalysisError}
            savedLawyers={savedLawyers}
            handleSaveLawyer={handleSaveLawyer}
            handleRemoveLawyer={handleRemoveLawyer}
            handleClearAllSaved={handleClearAllSaved}
            handleNoteChange={handleNoteChange}
            lawyerFinderKeywords={lawyerFinderKeywords}
            setLawyerFinderKeywords={setLawyerFinderKeywords}
            lawyerFinderEntityType={lawyerFinderEntityType}
            setLawyerFinderEntityType={setLawyerFinderEntityType}
            allLawyers={allLawyers}
            onLawyersFound={handleLawyersFound}
            onClearAllDbLawyers={handleClearAllDbLawyers}
            handleSummarizeNews={handleSummarizeNews}
            newsQuery={newsQuery}
            setNewsQuery={setNewsQuery}
            newsSummary={newsSummary}
            newsSources={newsSources}
            isSummarizingNews={isSummarizingNews}
            newsError={newsError}
            handleGenerateStrategy={handleGenerateStrategy}
            strategyGoal={strategyGoal}
            setStrategyGoal={setStrategyGoal}
            strategyResult={strategyResult}
            isGeneratingStrategy={isGeneratingStrategy}
            strategyError={strategyError}
            handleAnalyzePersonality={handleAnalyzePersonality}
            personalityAnalysisText={personalityAnalysisText}
            setPersonalityAnalysisText={setPersonalityAnalysisText}
            personalityAnalysisResult={personalityAnalysisResult}
            isAnalyzingPersonality={isAnalyzingPersonality}
            personalityAnalysisError={personalityAnalysisError}
            handleGenerateContract={handleGenerateContract}
            contractInvestor={contractInvestor}
            setContractInvestor={setContractInvestor}
            contractCompany={contractCompany}
            setContractCompany={setContractCompany}
            contractAmount={contractAmount}
            setContractAmount={setContractAmount}
            contractShare={contractShare}
            setContractShare={setContractShare}
            contractDuration={contractDuration}
            setDuration={setContractDuration}
            generatedContract={generatedContract}
            handleLegalSearch={handleLegalSearch}
            researchQuery={researchQuery}
            setResearchQuery={setResearchQuery}
            researchResult={researchResult}
            researchSources={researchSources}
            isSearchingLegal={isSearchingLegal}
            legalSearchError={legalSearchError}
            handleSummarizeDeposition={handleSummarizeDeposition}
            depositionText={depositionText}
            setDepositionText={setDepositionText}
            depositionSummary={depositionSummary}
            isSummarizingDeposition={isSummarizingDeposition}
            depositionError={depositionError}
            handleGenerateKeywords={handleGenerateKeywords}
            eDiscoveryCaseDesc={eDiscoveryCaseDesc}
            setEDiscoveryCaseDesc={setEDiscoveryCaseDesc}
            eDiscoveryKeywords={eDiscoveryKeywords}
            isGeneratingKeywords={isGeneratingKeywords}
            eDiscoveryError={eDiscoveryError}
            handleApiError={handleApiError}
            isQuotaExhausted={isQuotaExhausted}
        />;
    } else if (page === 'investment') {
        return <InvestmentPage />;
    } else if (page === 'python_projects') {
        return <PythonProjectsPage />;
    } else {
        return <HomePage setPage={setPage} onOpenAIGuide={() => setIsAIGuideOpen(true)} />;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <SiteHeader 
        currentPage={page}
        setPage={setPage} 
        checkpoints={checkpoints}
        onCreateCheckpoint={handleCreateCheckpoint}
        onRestoreCheckpoint={handleRestoreCheckpoint}
        onDeleteCheckpoint={handleDeleteCheckpoint}
      />
      <main>
        {renderPage()}
      </main>
      <SiteFooter />
      <QuotaErrorModal 
        isOpen={showQuotaErrorModal}
        onClose={() => setShowQuotaErrorModal(false)}
      />
      <AIGuideModal 
        isOpen={isAIGuideOpen}
        onClose={() => setIsAIGuideOpen(false)}
        onRoute={handleRouteIntent}
        onSelectRoute={handleSelectRoute}
        prompt={aiGuidePrompt}
        setPrompt={setAIGuidePrompt}
        results={aiGuideResults}
        isLoading={isRouting}
        error={routingError}
      />
    </div>
  );
};

export default App;