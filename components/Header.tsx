import React, { useState, useRef, useEffect } from 'react';
import { Checkpoint, useLanguage, PageKey } from '../types';

interface SiteHeaderProps {
    currentPage: string;
    setPage: (page: 'home' | PageKey) => void;
    checkpoints: Checkpoint[];
    onCreateCheckpoint: () => void;
    onRestoreCheckpoint: (id: string) => void;
    onDeleteCheckpoint: (id: string) => void;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ currentPage, setPage, checkpoints, onCreateCheckpoint, onRestoreCheckpoint, onDeleteCheckpoint }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isCheckpointMenuOpen, setIsCheckpointMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const checkpointMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
      if (checkpointMenuRef.current && !checkpointMenuRef.current.contains(event.target as Node)) {
        setIsCheckpointMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handlePageChange = (page: 'home' | PageKey) => {
      setPage(page);
      window.scrollTo(0, 0);
  }

  const handleScrollTo = (id: string) => {
    if (currentPage !== 'home') {
      handlePageChange('home');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };


  const navLinks = [
    { key: 'home', text: t('header.home'), action: () => handlePageChange('home') },
    { key: 'investment', text: t('header.investment'), action: () => handlePageChange('investment') },
    { key: 'legal_drafter', text: t('header.aiAssistant'), action: () => handlePageChange('legal_drafter') },
    { key: 'lawyer_finder', text: t('header.lawyerFinder'), action: () => handlePageChange('lawyer_finder') },
    { key: 'news_summarizer', text: t('header.newsSummarizer'), action: () => handlePageChange('news_summarizer') },
    { key: 'case_strategist', text: t('header.caseStrategist'), action: () => handlePageChange('case_strategist') },
    { key: 'personality_analyst', text: t('header.personalityAnalyst'), action: () => handlePageChange('personality_analyst') },
    { key: 'contract_generator', text: t('header.contractGenerator'), action: () => handlePageChange('contract_generator') },
    { key: 'legal_research', text: t('header.legalResearch'), action: () => handlePageChange('legal_research') },
    { key: 'deposition_summarizer', text: t('header.depositionSummarizer'), action: () => handlePageChange('deposition_summarizer') },
    { key: 'e_discovery_helper', text: t('header.eDiscoveryHelper'), action: () => handlePageChange('e_discovery_helper') },
    { key: 'python_projects', text: t('header.pythonProjects'), action: () => handlePageChange('python_projects') },
    { key: 'services', text: t('header.services'), action: () => handleScrollTo('services') },
    { key: 'about', text: t('header.about'), action: () => handleScrollTo('about') },
    { key: 'contact', text: t('header.contact'), action: () => handleScrollTo('footer') },
  ];

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <a href="#" onClick={() => setPage('home')} className="flex-shrink-0 flex items-center space-x-2 rtl:space-x-reverse">
              <svg className="h-8 w-8 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52v16.5m-1.5-16.5v16.5m-3-16.5v16.5m-1.5-16.5v16.5m-3-16.5v16.5m-1.5-16.5v16.5M5.25 4.97c-1.01.143-2.01.317-3 .52m3-.52v16.5m1.5-16.5v16.5m3-16.5v16.5m1.5-16.5v16.5m3-16.5v16.5m1.5-16.5v16.5" />
              </svg>
              <span className="font-bold text-xl text-white">دادگر AI</span>
            </a>
            <nav className="hidden md:flex md:ml-10 md:space-x-8">
              {navLinks.map(link => (
                  <button key={link.key} onClick={link.action} className={`text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === link.key ? 'text-blue-300' : ''}`}>
                    {link.text}
                  </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            {/* Checkpoint Controls */}
            <div className="hidden md:flex items-center space-x-2">
              <button 
                  onClick={onCreateCheckpoint}
                  className="flex items-center px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  title={t('header.createCheckpointTitle')}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4zm2 0v12h6V4H7z" /><path d="M7 2h6a2 2 0 012 2v2H5V4a2 2 0 012-2z" /></svg>
                  <span className={language === 'fa' ? 'mr-2' : 'ml-2'}>{t('header.createCheckpoint')}</span>
              </button>
              <div className="relative" ref={checkpointMenuRef}>
                  <button
                      onClick={() => setIsCheckpointMenuOpen(prev => !prev)}
                      className="flex items-center px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                      {t('header.checkpoints')}
                      <span className={`${language === 'fa' ? 'mr-2' : 'ml-2'} bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full`}>{checkpoints.length}</span>
                  </button>
                  {isCheckpointMenuOpen && (
                      <div className={`absolute mt-2 w-72 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-20 ${language === 'fa' ? 'left-0' : 'right-0'}`}>
                          <div className="p-2 text-sm text-center text-gray-300 border-b border-gray-700">{t('header.projectHistory')}</div>
                          {checkpoints.length > 0 ? (
                              <ul className="py-1 max-h-80 overflow-y-auto">
                                  {checkpoints.map(ckpt => (
                                      <li key={ckpt.id} className="px-3 py-2 hover:bg-gray-700/50 transition-colors">
                                         <div className="flex justify-between items-center">
                                              <div className="text-sm text-gray-300 truncate pr-2">{ckpt.name}</div>
                                              <div className="flex-shrink-0 flex items-center space-x-1">
                                                  <button onClick={() => onRestoreCheckpoint(ckpt.id)} title={t('header.restore')} className="p-1 text-gray-400 hover:text-blue-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg></button>
                                                  <button onClick={() => onDeleteCheckpoint(ckpt.id)} title={t('header.delete')} className="p-1 text-gray-400 hover:text-red-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                                              </div>
                                         </div>
                                      </li>
                                  ))}
                              </ul>
                          ) : (
                              <div className="text-center text-gray-500 py-4 px-3 text-sm">{t('header.noCheckpoints')}</div>
                          )}
                      </div>
                  )}
              </div>
            </div>

            {/* Language Switcher */}
            <div className="relative ml-4" ref={langMenuRef}>
                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="flex items-center text-gray-300 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m4 13l4-4M19 9l-4 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="font-semibold text-sm mx-1">{language === 'fa' ? 'FA' : 'EN'}</span>
                </button>
                {isLangMenuOpen && (
                    <div className={`absolute mt-2 w-28 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-20 ${language === 'fa' ? 'left-0' : 'right-0'}`}>
                        <ul className="py-1">
                            <li><button onClick={() => { setLanguage('fa'); setIsLangMenuOpen(false); }} className="block w-full text-right px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">فارسی</button></li>
                            <li><button onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 font-inter">English</button></li>
                        </ul>
                    </div>
                )}
            </div>
             <div className="-mr-2 flex md:hidden">
              <button onClick={() => setIsMobileMenuOpen(prev => !prev)} type="button" className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" aria-controls="mobile-menu" aria-expanded={isMobileMenuOpen}>
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
                <button key={link.key} onClick={() => { link.action(); setIsMobileMenuOpen(false); }} className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors">
                  {link.text}
                </button>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700 px-4 space-y-3">
            <button 
                onClick={() => { onCreateCheckpoint(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                title={t('header.createCheckpointTitle')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4zm2 0v12h6V4H7z" /><path d="M7 2h6a2 2 0 012 2v2H5V4a2 2 0 012-2z" /></svg>
                <span className={language === 'fa' ? 'mr-2' : 'ml-2'}>{t('header.createCheckpoint')}</span>
            </button>
            <div className="border-t border-gray-700 my-2"></div>
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('header.projectHistory')}</h3>
            {checkpoints.length > 0 ? (
                <ul className="mt-1 space-y-1 max-h-60 overflow-y-auto">
                    {checkpoints.map(ckpt => (
                        <li key={ckpt.id} className="group p-2 hover:bg-gray-700/50 rounded-md transition-colors">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-300 truncate pr-2">{ckpt.name}</span>
                                <div className="flex-shrink-0 flex items-center space-x-1">
                                    <button onClick={() => { onRestoreCheckpoint(ckpt.id); setIsMobileMenuOpen(false); }} title={t('header.restore')} className="p-1 text-gray-400 hover:text-blue-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg></button>
                                    <button onClick={() => { onDeleteCheckpoint(ckpt.id); setIsMobileMenuOpen(false); }} title={t('header.delete')} className="p-1 text-gray-400 hover:text-red-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center text-gray-500 py-4 px-3 text-sm">{t('header.noCheckpoints')}</div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;