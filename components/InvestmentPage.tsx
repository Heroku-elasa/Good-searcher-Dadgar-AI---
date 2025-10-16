
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../types';

const InvestmentPage: React.FC = () => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('iran');
    
    // State for the token drafting calculator
    const [isDrafting, setIsDrafting] = useState(false);
    const [draftAmount, setDraftAmount] = useState('');
    const [draftTokens, setDraftTokens] = useState('');

    const TOKEN_PRICE = 100000;
    const numberFormatter = new Intl.NumberFormat('en-US');

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amountValue = e.target.value.replace(/,/g, '');
        if (/^\d*$/.test(amountValue)) {
            setDraftAmount(numberFormatter.format(Number(amountValue)));
            if (amountValue) {
                const tokens = Number(amountValue) / TOKEN_PRICE;
                setDraftTokens(tokens.toString());
            } else {
                setDraftTokens('');
            }
        }
    };

    const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tokenValue = e.target.value;
        if (/^\d*\.?\d*$/.test(tokenValue)) {
            setDraftTokens(tokenValue);
            if (tokenValue) {
                const amount = Number(tokenValue) * TOKEN_PRICE;
                setDraftAmount(numberFormatter.format(amount));
            } else {
                setDraftAmount('');
            }
        }
    };
    
    const generatedDraft = useMemo(() => {
        if (!draftAmount || !draftTokens) return '';
        const template = t('investmentPage.tokenDrafting.draftTemplate');
        return template
            .replace('{tokens}', draftTokens)
            .replace('{amount}', draftAmount);
    }, [draftAmount, draftTokens, t]);


    const costData = t('investmentPage.costEstimates');
    const tabs = costData.regions;
    const roadmapData = t('investmentPage.roadmap');
    const landscapeData = t('investmentPage.competitiveLandscape');

    const renderTable = (data: any) => (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                    <tr>
                        {data.headers.map((header: string, index: number) => (
                            <th key={index} scope="col" className="px-6 py-3">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.rows.map((row: any, rowIndex: number) => (
                        <tr key={rowIndex} className="border-b border-gray-700 hover:bg-gray-800/50">
                            {Object.values(row).map((cell: any, cellIndex: number) => (
                                <td key={cellIndex} className={`px-6 py-4 ${cellIndex === 0 ? 'font-medium text-white' : ''}`}>
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                    <tr className="font-bold bg-gray-700/50 text-white">
                        <td className="px-6 py-3">{data.footer.label}</td>
                        <td colSpan={data.headers.length - 1} className="px-6 py-3 text-right">{data.footer.value}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
    
    return (
        <div className="animate-fade-in bg-gray-900 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 tracking-tight">
                        {t('header.investment')}
                    </h1>
                    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                        {t('investmentPage.subtitle')}
                    </p>
                </div>

                <div className="mt-16 max-w-5xl mx-auto space-y-12">
                     <div className="bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-2">{t('investmentPage.projectGoals.title')}</h2>
                        <p className="text-gray-400">{t('investmentPage.projectGoals.body')}</p>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-white mb-2">{costData.title}</h2>
                            <p className="text-gray-400 mb-6">{costData.subtitle}</p>
                            <div className="border-b border-gray-700">
                                <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
                                    {Object.entries(tabs).map(([key, tab]: [string, any]) => (
                                        <button
                                            key={key}
                                            onClick={() => setActiveTab(key)}
                                            className={`whitespace-nowrap py-4 px-1 sm:px-4 border-b-2 font-medium text-sm transition-colors ${
                                                activeTab === key
                                                    ? 'border-green-400 text-green-300'
                                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                                            }`}
                                        >
                                            {tab.title}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                        <div className="animate-fade-in">
                            {renderTable((tabs as any)[activeTab].data)}
                        </div>
                        <div className="p-8">
                            <h3 className="text-lg font-semibold text-white">{costData.summary.title}</h3>
                            <p className="text-gray-400 mt-2">{costData.summary.body}</p>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-4">{landscapeData.title}</h2>
                        <p className="text-gray-400 mb-6">{landscapeData.body}</p>
                        <div className="border-t border-gray-700 pt-6">
                            <h3 className="text-xl font-semibold text-white mb-4">{landscapeData.advantages.title}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {landscapeData.advantages.points.map((point: any, index: number) => (
                                    <div key={index} className="bg-gray-900/50 p-4 rounded-lg">
                                        <h4 className="font-bold text-teal-300">{point.title}</h4>
                                        <p className="text-sm text-gray-400 mt-2">{point.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-6">{roadmapData.title}</h2>
                        <div className="relative border-r-2 border-gray-700 ml-3">
                            {roadmapData.phases.map((phase: any, index: number) => (
                                <div key={index} className="mb-10 ml-6">
                                    <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-900 rounded-full -right-3 ring-8 ring-gray-900">
                                        <svg className="w-2.5 h-2.5 text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z"/>
                                            <path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                                        </svg>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-white">
                                        {phase.title}
                                        <span className="bg-blue-800 text-blue-300 text-sm font-medium mr-2 px-2.5 py-0.5 rounded ml-3">{phase.duration}</span>
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                                        {phase.objectives.map((obj: string, i: number) => (
                                            <li key={i}>{obj}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                     <div className="bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-4">{t('investmentPage.investmentStatus.title')}</h2>
                        <div className="w-full bg-gray-700 rounded-full h-4">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-4 rounded-full" style={{ width: `${t('investmentPage.investmentStatus.progress')}%` }}></div>
                        </div>
                        <p className="mt-3 text-gray-400">
                            {t('investmentPage.investmentStatus.statusText')}
                        </p>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-gray-700">
                        <h2 className="text-2xl font-bold text-white mb-6">{t('investmentPage.methods.title')}</h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold text-teal-300 mb-2">{t('investmentPage.methods.crowdfunding.title')}</h3>
                                <p className="text-gray-400">{t('investmentPage.methods.crowdfunding.body')}</p>
                                <div className="flex flex-wrap gap-4 mt-4">
                                    <a href="https://example.com/token-sale" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-500 transition-all shadow-lg">
                                        💵 {t('investmentPage.methods.crowdfunding.buyButton')}
                                    </a>
                                     <button onClick={() => setIsDrafting(prev => !prev)} className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-lg">
                                        ⚙️ {t('investmentPage.tokenDrafting.draftButton')}
                                    </button>
                                </div>
                                {isDrafting && (
                                    <div className="mt-6 p-6 bg-gray-900/50 border border-gray-700 rounded-lg animate-fade-in space-y-4">
                                        <h4 className="text-lg font-semibold text-white">{t('investmentPage.tokenDrafting.calculatorTitle')}</h4>
                                        <p className="text-sm text-gray-400">{t('investmentPage.tokenDrafting.tokenPriceInfo').replace('{price}', numberFormatter.format(TOKEN_PRICE))}</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="amount-input" className="block text-sm font-medium text-gray-300">{t('investmentPage.tokenDrafting.amountLabel')}</label>
                                                <input id="amount-input" type="text" value={draftAmount} onChange={handleAmountChange}
                                                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white" />
                                            </div>
                                            <div>
                                                <label htmlFor="tokens-input" className="block text-sm font-medium text-gray-300">{t('investmentPage.tokenDrafting.tokensLabel')}</label>
                                                <input id="tokens-input" type="text" value={draftTokens} onChange={handleTokenChange}
                                                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white" />
                                            </div>
                                        </div>
                                        {generatedDraft && (
                                            <div className="mt-4 pt-4 border-t border-gray-700">
                                                <h5 className="font-semibold text-gray-200">{t('investmentPage.tokenDrafting.draftTitle')}</h5>
                                                <p className="mt-2 p-4 bg-gray-800 rounded-md text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: generatedDraft }}></p>
                                            </div>
                                        )}
                                        <button onClick={() => setIsDrafting(false)} className="mt-4 text-sm text-gray-400 hover:text-white transition-colors">{t('investmentPage.tokenDrafting.closeButton')}</button>
                                    </div>
                                )}
                            </div>
                             <div className="border-t border-gray-700"></div>
                            <div>
                                <h3 className="text-xl font-semibold text-teal-300 mb-2">{t('investmentPage.methods.seed.title')}</h3>
                                <p className="text-gray-400">{t('investmentPage.methods.seed.body')}</p>
                                <div className="flex flex-wrap gap-4 mt-4">
                                    <a href="/contract.pdf" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-lg">
                                        📄 {t('investmentPage.methods.seed.contractButton')}
                                    </a>
                                     <a href={`https://wa.me/${t('investmentPage.methods.seed.whatsappNumber')}`} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all shadow-lg">
                                        📲 {t('investmentPage.methods.seed.whatsappButton')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InvestmentPage;
