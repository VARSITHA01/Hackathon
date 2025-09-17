import React, { useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import Header from './Header';
import Footer from './Footer';
import ChatbotIcon from './icons/ChatbotIcon';
import type { View, User } from '../types';

interface LandingProps {
  onNavigate: (view: View) => void;
  isAuthenticated: boolean;
  user: User | null;
  onLogout: () => void;
}

const FeatureCard: React.FC<{ title: string; description: string; icon: React.ReactNode; delay: string }> = ({ title, description, icon, delay }) => (
    <div className="text-center p-6 bg-white/5 rounded-lg observe-me opacity-0" style={{ animationDelay: delay }}>
        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mx-auto mb-5 text-green-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-green-200">{description}</p>
    </div>
);

const ContactInfo: React.FC<{ href: string; title: string; detail: string; icon: React.ReactNode }> = ({ href, title, detail, icon }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg transition-colors hover:bg-white/20">
        <div className="flex-shrink-0 text-green-300">{icon}</div>
        <div>
            <h4 className="font-semibold text-white">{title}</h4>
            <p className="text-green-200">{detail}</p>
        </div>
    </a>
);


const Landing: React.FC<LandingProps> = ({ onNavigate, isAuthenticated, user, onLogout }) => {
    const t = useLocalization();
    
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.observe-me');
        elements.forEach(el => observer.observe(el));

        return () => elements.forEach(el => observer.unobserve(el));
    }, []);

    return (
        <div className="relative w-full overflow-x-hidden bg-green-900">
            <div className="absolute inset-0 z-0">
                <img
                    src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOW82enZtdm91dzZmM2E1dW9ucWpydXFsc3Rtd2o1dXgzZmdxN2w5ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LNO1wInI533c4/giphy.gif"
                    alt="Golden wheat field swaying in the wind"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header 
                    isAuthenticated={isAuthenticated}
                    user={user}
                    onLogout={onLogout}
                    onHomeClick={() => onNavigate('landing')}
                    onLoginClick={() => onNavigate('login')}
                    onSignupClick={() => onNavigate('signup')}
                    onChatClick={() => onNavigate('chatbot')}
                    isTransparent={true}
                />
                
                <section className="flex-grow flex flex-col items-center justify-center text-center px-4 pt-24 pb-12">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            {t('landingTitle')}
                        </h1>
                        <p className="mt-4 text-lg md:text-xl text-green-200 drop-shadow-md animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            {t('landingDescription')}
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            <button
                                onClick={() => onNavigate(isAuthenticated ? 'app' : 'signup')}
                                className="px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-green-700 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
                            >
                                {t('ctaButton')}
                            </button>
                             <button
                                onClick={() => onNavigate('subsidies')}
                                className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                {t('findSubsidiesButton')}
                            </button>
                        </div>
                    </div>
                </section>
                
                {/* How It Works Section */}
                <section className="py-20 bg-black/40 backdrop-blur-sm">
                    <div className="max-w-6xl mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12 observe-me opacity-0">{t('howItWorksTitle')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard 
                                title={t('step1Title')} 
                                description={t('step1Description')}
                                delay="0.2s"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                            />
                            <FeatureCard 
                                title={t('step2Title')} 
                                description={t('step2Description')}
                                delay="0.4s"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3M5.636 5.636l-1.414-1.414M19.778 5.636l-1.414 1.414M18.364 18.364l1.414 1.414M4.222 18.364l1.414-1.414M12 12a3 3 0 100-6 3 3 0 000 6z" /></svg>}
                            />
                            <FeatureCard 
                                title={t('step3Title')} 
                                description={t('step3Description')}
                                delay="0.6s"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                            />
                        </div>
                    </div>
                </section>

                {/* Our Mission Section */}
                <section className="py-20">
                    <div className="max-w-3xl mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 observe-me opacity-0">{t('ourMissionTitle')}</h2>
                        <p className="text-lg text-green-200 observe-me opacity-0" style={{ animationDelay: '0.2s' }}>{t('ourMissionText')}</p>
                    </div>
                </section>

                {/* Contact Us Section */}
                <section className="py-20 bg-black/40 backdrop-blur-sm">
                    <div className="max-w-3xl mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 observe-me opacity-0">{t('contactUsTitle')}</h2>
                        <p className="text-green-200 mb-8 observe-me opacity-0" style={{ animationDelay: '0.2s' }}>{t('contactUsDescription')}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 observe-me opacity-0" style={{ animationDelay: '0.4s' }}>
                            <ContactInfo 
                                href="mailto:ramitha.s2023@vitstudent.ac.in"
                                title={t('contactEmail')}
                                detail="ramitha.s2023@vitstudent.ac.in"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                            />
                            <ContactInfo 
                                href="tel:+917093011106"
                                title={t('contactPhone')}
                                detail="+91 70930 11106"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                            />
                        </div>
                    </div>
                </section>
                
                <Footer variant="dark" />
            </div>

            {/* Chatbot FAB */}
            <button 
              onClick={() => onNavigate('chatbot')}
              title={t('chatbotTooltip')}
              className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transform hover:scale-110 transition-all duration-300 z-20"
            >
              <ChatbotIcon className="h-8 w-8" />
            </button>
        </div>
    );
};

export default Landing;