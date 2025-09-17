import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { useLocalization } from '../hooks/useLocalization';
import { getSubsidiesAndMarkets } from '../services/geminiService';
import Header from './Header';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';
import type { User, View, SubsidiesAndMarketsData, Subsidy, Market } from '../types';

const SubsidyCard: React.FC<{ subsidy: Subsidy }> = ({ subsidy }) => {
    const t = useLocalization();
    return (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
            <h4 className="font-bold text-lg text-green-800">{subsidy.name}</h4>
            <p className="text-gray-600 mt-2 text-sm">{subsidy.description}</p>
            <p className="text-gray-600 mt-2 text-sm"><span className="font-semibold">{t('eligibility')}:</span> {subsidy.eligibility}</p>
            <a href={subsidy.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-4 inline-block text-sm font-semibold">
                {t('learnMore')} &rarr;
            </a>
        </div>
    );
}

const MarketCard: React.FC<{ market: Market }> = ({ market }) => {
    const t = useLocalization();
    return (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
            <h4 className="font-bold text-lg text-green-800">{market.name}</h4>
            <p className="text-gray-600 mt-2 text-sm"><span className="font-semibold">{t('location')}:</span> {market.location}</p>
            <p className="text-gray-600 mt-2 text-sm"><span className="font-semibold">{t('commodities')}:</span> {market.commodities}</p>
        </div>
    );
}


const Subsidies: React.FC<{ user: User; onLogout: () => void; onNavigate: (view: View) => void; }> = ({ user, onLogout, onNavigate }) => {
    const t = useLocalization();
    const { language } = useContext(LanguageContext)!;
    const [data, setData] = useState<SubsidiesAndMarketsData | null>(null);
    const [loadingState, setLoadingState] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResources = (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            getSubsidiesAndMarkets({ latitude, longitude }, language)
                .then(result => {
                    setData(result);
                    setLoadingState('success');
                })
                .catch(err => {
                    console.error(err);
                    setError(t('errorMessage'));
                    setLoadingState('error');
                });
        };

        if (!navigator.geolocation) {
            setError(t('geolocationNotSupported'));
            setLoadingState('error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            fetchResources,
            (geoError) => {
                let errorMessage = t('geolocationError');
                if (geoError.code === geoError.PERMISSION_DENIED) {
                    errorMessage = t('geolocationPermissionDenied');
                }
                setError(errorMessage);
                console.error("Geolocation error:", geoError);
                setLoadingState('error');
            }
        );

    }, [language, t]);

    return (
         <div className="relative min-h-screen font-sans">
             <div 
                className="fixed inset-0 bg-cover bg-center z-0" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1974&auto=format&fit=crop')" }} 
            />
            <div className="fixed inset-0 bg-green-900/80 z-0" />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header 
                    user={user} 
                    isAuthenticated={true} 
                    onLogout={onLogout} 
                    onHomeClick={() => onNavigate('landing')} 
                    onChatClick={() => onNavigate('chatbot')}
                />
                 <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={() => onNavigate('landing')}
                            className="font-semibold text-sm text-green-100 hover:text-white"
                        >
                           {t('backToHome')}
                        </button>
                    </div>

                    <h2 className="text-3xl font-bold text-center text-white mb-8">{t('subsidiesTitle')}</h2>

                    {loadingState === 'loading' && (
                        <div className="flex flex-col items-center justify-center mt-8 text-center">
                            <LoadingSpinner />
                            <p className="mt-4 text-green-100">{t('subsidiesLoading')}</p>
                        </div>
                    )}

                    {loadingState === 'error' && (
                         <p className="mt-8 text-center text-red-600 bg-red-100 p-4 rounded-lg max-w-2xl mx-auto">{error}</p>
                    )}

                    {loadingState === 'success' && data && (
                        <div className="space-y-12 max-w-4xl mx-auto">
                            {/* Central Subsidies */}
                            <section>
                                <h3 className="text-2xl font-semibold text-white mb-4">{t('centralSubsidies')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {data.centralSubsidies.map((subsidy, i) => <SubsidyCard key={`cen-${i}`} subsidy={subsidy} />)}
                                </div>
                            </section>

                            {/* State Subsidies */}
                            <section>
                                <h3 className="text-2xl font-semibold text-white mb-4">{t('stateSubsidies')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     {data.stateSubsidies.map((subsidy, i) => <SubsidyCard key={`sta-${i}`} subsidy={subsidy} />)}
                                </div>
                            </section>

                             {/* Local Markets */}
                            <section>
                                <h3 className="text-2xl font-semibold text-white mb-4">{t('localMarkets')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     {data.localMarkets.map((market, i) => <MarketCard key={`mar-${i}`} market={market} />)}
                                </div>
                            </section>
                        </div>
                    )}
                 </main>
                 <Footer variant="dark" />
            </div>
        </div>
    );
};

export default Subsidies;