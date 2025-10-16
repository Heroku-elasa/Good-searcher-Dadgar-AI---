
import React from 'react';
import { useLanguage } from '../types';

const SiteFooter: React.FC = () => {
    const { t } = useLanguage();
    const quickLinks: { text: string; link: string }[] = t('footer.quickLinks');

    return (
        <footer id="footer" className="bg-gray-900 text-gray-400 border-t border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Column 1: Logo & Description */}
                    <div className="space-y-4 md:col-span-1">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                             <svg className="h-8 w-8 text-blue-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52v16.5m-1.5-16.5v16.5m-3-16.5v16.5m-1.5-16.5v16.5m-3-16.5v16.5m-1.5-16.5v16.5M5.25 4.97c-1.01.143-2.01.317-3 .52m3-.52v16.5m1.5-16.5v16.5m3-16.5v16.5m1.5-16.5v16.5m3-16.5v16.5m1.5-16.5v16.5" />
                            </svg>
                            <span className="font-bold text-xl text-white">دادگر AI</span>
                        </div>
                        <p className="text-sm leading-relaxed">{t('footer.description')}</p>
                    </div>
                    {/* Column 2: Quick Links */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-white border-b-2 border-gray-700 pb-2">{t('footer.quickLinksTitle')}</h2>
                        <ul className="space-y-2 text-sm columns-2">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link.link} className="hover:text-white transition-colors">{link.text}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Column 3: Contact Info */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-white border-b-2 border-gray-700 pb-2">{t('footer.contactTitle')}</h2>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                                <span className="mt-1 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0">📧</span>
                                <a href={`mailto:${t('footer.email')}`} className="hover:text-white transition-colors font-inter">{t('footer.email')}</a>
                            </li>
                            <li className="flex items-start">
                                <span className="mt-1 mr-3 rtl:ml-3 rtl:mr-0 flex-shrink-0">📍</span>
                                <span>{t('footer.address')}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="bg-black py-4 mt-8 border-t border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs">
                    <p>{t('footer.copyright')}</p>
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;
