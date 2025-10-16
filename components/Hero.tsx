

import React from 'react';
import { useLanguage, PageKey } from '../types';

interface HomePageProps {
    setPage: (page: 'home' | PageKey) => void;
    onOpenAIGuide: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage, onOpenAIGuide }) => {
  const { t } = useLanguage();
  
  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const services: { title: string; text: string; }[] = t('home.services');
  const whyUsItems: { title: string; text: string; }[] = t('home.whyUsItems');

  return (
    <div className="animate-fade-in bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white text-center overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
          src="https://cdn.pixabay.com/video/2022/10/08/133039-759828594_large.mp4"
        />
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <div className="z-20 p-4 space-y-6">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight"
            dangerouslySetInnerHTML={{ __html: t('hero.title') }}
          />
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">{t('hero.subtitle')}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button onClick={onOpenAIGuide} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold rounded-lg hover:from-blue-600 hover:to-teal-500 transition-all text-lg shadow-xl scale-105 hover:scale-110">
                {t('aiGuide.button')}
              </button>
              <button onClick={() => setPage('investment')} className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-500 transition-all text-lg shadow-xl scale-105 hover:scale-110">
                🚀 {t('header.investment')}
              </button>
          </div>
           <div className="pt-8 text-sm text-gray-400">
              Or jump directly to a tool: 
              <button onClick={() => setPage('legal_drafter')} className="ml-2 text-blue-300 hover:underline">{t('header.aiAssistant')}</button> | 
              <button onClick={() => setPage('lawyer_finder')} className="ml-2 text-blue-300 hover:underline">{t('header.lawyerFinder')}</button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 sm:py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.servicesTitle')}</h2>
                <div className="w-24 h-px bg-blue-400 mx-auto mb-12"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service, index) => (
                    <div key={index} className="text-center p-6 space-y-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                        <h4 className="text-xl font-semibold text-blue-300">{service.title}</h4>
                        <p className="text-sm text-gray-400">{service.text}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="about" className="py-16 sm:py-24 bg-gray-800/50 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-bold mb-12">{t('home.whyUsTitle')}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {whyUsItems.map((item, index) => (
                      <div key={index} className="text-center p-6">
                           <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
                           <p className="text-gray-400">{item.text}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>
    </div>
  );
};

export default HomePage;