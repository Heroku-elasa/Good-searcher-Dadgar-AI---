import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { useLanguage } from '../types';

interface ContractGeneratorProps {
    onGenerate: () => void;
    investor: string;
    setInvestor: (value: string) => void;
    company: string;
    setCompany: (value: string) => void;
    amount: string;
    setAmount: (value: string) => void;
    share: string;
    setShare: (value: string) => void;
    duration: string;
    setDuration: (value: string) => void;
    generatedContract: string;
}

const ContractGenerator: React.FC<ContractGeneratorProps> = ({
    onGenerate,
    investor, setInvestor,
    company, setCompany,
    amount, setAmount,
    share, setShare,
    duration, setDuration,
    generatedContract
}) => {
    const { t } = useLanguage();
    const [contractHtml, setContractHtml] = useState('');

    useEffect(() => {
        let isMounted = true;
        const parseMarkdown = () => {
            if (generatedContract) {
                const html = marked.parse(generatedContract) as string;
                if (isMounted) setContractHtml(html);
            } else {
                if (isMounted) setContractHtml('');
            }
        };
        parseMarkdown();
        return () => { isMounted = false; };
    }, [generatedContract]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!investor.trim() || !company.trim() || !amount.trim() || !share.trim() || !duration.trim()) {
            alert(t('contractGenerator.validationError'));
            return;
        }
        onGenerate();
    };

    return (
        <section id="contract-generator" className="py-12 sm:py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white">{t('contractGenerator.title')}</h2>
                <p className="mt-2 text-gray-400 max-w-2xl mx-auto">{t('contractGenerator.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="lg:sticky top-28">
                    <div className="bg-gray-800/50 rounded-lg p-8 shadow-lg backdrop-blur-sm border border-gray-700">
                        <h3 className="text-2xl font-bold mb-6 text-white">{t('contractGenerator.formTitle')}</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="investor" className="block text-sm font-medium text-gray-300">{t('contractGenerator.investorLabel')}</label>
                                <input id="investor" type="text" value={investor} onChange={(e) => setInvestor(e.target.value)}
                                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                                    placeholder={t('contractGenerator.investorPlaceholder')} />
                            </div>
                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-300">{t('contractGenerator.companyLabel')}</label>
                                <input id="company" type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                                    placeholder={t('contractGenerator.companyPlaceholder')} />
                            </div>
                             <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-300">{t('contractGenerator.amountLabel')}</label>
                                <input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                                    placeholder={t('contractGenerator.amountPlaceholder')} />
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="share" className="block text-sm font-medium text-gray-300">{t('contractGenerator.shareLabel')}</label>
                                    <input id="share" type="number" value={share} onChange={(e) => setShare(e.target.value)}
                                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                                        placeholder={t('contractGenerator.sharePlaceholder')} />
                                </div>
                                <div>
                                    <label htmlFor="duration" className="block text-sm font-medium text-gray-300">{t('contractGenerator.durationLabel')}</label>
                                    <input id="duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)}
                                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-white"
                                        placeholder={t('contractGenerator.durationPlaceholder')} />
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors">
                                    {t('contractGenerator.buttonText')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="bg-gray-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-gray-700 min-h-[60vh]">
                        <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
                           <h3 className="text-lg font-semibold text-white">{t('contractGenerator.generatedTitle')}</h3>
                        </div>
                         <div className="p-6 text-gray-300">
                             {contractHtml ? (
                                <div className="judicial-letterhead">
                                    <div className="judicial-header">
                                        <img src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjgwMHB4IiB3aWR0aD0iODAwcHgiIHZlcnNpb249IjEuMSIgaWQ9Im1hbiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmlld0JveD0iMCAwIDQ3MS4zOCA0NzEuMzgiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIHN0eWxlPSJmaWxsOiMwMTAwMDI7IiBkPSJNMzU4LjgsMTY5LjE0Yy00MS4yMDksMC03OC44MDMsMTkuODg2LTExMC40NjgsNTAuOTY1Yy0zMS42NjUtMzEuMDc5LTY5LjI1OC01MC45NjUtMTEwLjQ2OC01MC45NjVDMTIuNTI4LDE2OS4xNCwwLDE4MC42MTMsMCwyMDEuMTMyYzAsMTMuMzg2LDguMTkzLDI0LjU3MywyMC4wMzIsMjguODIzYy0yLjYwNC04LjMxMS0yLjYwNC0xOS4zNjksMC0yNy42OGM1MTAuNTY4LDI1LjU1NywyMC4wMzIsNDYuNTIsMjAuMDMyLDQ2LjUycy04LjE5My0yMC45NjMtMjAuMDMyLTQ2LjUyYzIuNjA0LDguMzExLDIuNjA0LDE5LjM2OSwwLDI3LjY4Yy0xMS44MzktNC4yNS0yMC4wMzItMTUuNDM4LTIwLjAwOS0yOC4wMjNjMC0xMC41MTgsMTIuNTI4LTIxLjk5MSwzNy44OTYtMjEuOTkxYzQwLjA2NSwwLDY5LjI1OCwyMC45NjMsOTIuNjUsNTMuNTcxYzIzLjM5MS0zMi42MDcsNTIuNTg2LTUzLjU3MSw5Mi42NS01My41NzFjMjUuMzY5LDAsMzcuODk2LDExLjQ3MywzNy44OTYsMjEuOTkxYzAsMTMuMzg2LTguMTcwLDI0LjU3My0xOS45OTIsMjguODIzYzIuNjA0LTguMzExLDIuNjA0LTE5LjM2OSwwLTI3LjY4Yy0xMC41NjgsMjUuNTU3LTIwLjAzMiw0Ni41Mi0yMC4wMzIsNDYuNTJzOC4xOTMtMjAuOTYzLDIwLjAzMi00Ni41MmMyLjYwNCw4LjMxMSwyLjYwNCwxOS4zNjksMCwyNy42OGMxMS44MzktNC4yNSwyMC4wMzItMTUuNDM4LDIwLjAzMi0yOC4wMjNDNDcxLjM4LDE4MC42MTMsNDU4Ljg1MywxNjkuMTQsMzU4LjgsMTY5LjE0eiIvPjxwYXRoIHN0eWxlPSJmaWxsOiMwMTAwMDI7IiBkPSJNMjM1LjY5LDQyNC45MDRjLTcuMDQ5LDAtMTIuODEtNS43NjEtMTIuODEtMTIuODExVjEwMy45MjRjMC03LjA1LDUuNzYxLTEyLjgxMSwxMi44MS0xMi44MTFjNy4wNSwwLDEyLjgxMSw1LjcuMTIuODExdjMwOC4xN0M0OC41MDEsNDE5LjE0MywyNDIuNzM5LDQyNC45MDQsMjM1LjY5LDQyNC45MDR6IiBV9aCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCjwvZz48L3N2Zz4=" 
                                             alt="Judicial Emblem" className="judicial-emblem" />
                                        <p className="bismillah">بسمه تعالی</p>
                                    </div>
                                    <div 
                                        className="judicial-letterhead-content prose max-w-none prose-sm sm:prose-base"
                                        dangerouslySetInnerHTML={{ __html: contractHtml }} 
                                    />
                                </div>
                             ) : (
                                <div className="text-center text-gray-500 py-16">
                                    <p>{t('reportDisplay.placeholder1')}</p>
                                    <p>{t('reportDisplay.placeholder2')}</p>
                                </div>
                             )}
                         </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContractGenerator;