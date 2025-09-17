import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import type { Language, User } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import AgroGeniusLogo from './icons/AgroGeniusLogo';

interface HeaderProps {
    user?: User | null;
    isAuthenticated: boolean;
    onHomeClick: () => void;
    onLoginClick?: () => void;
    onSignupClick?: () => void;
    onLogout?: () => void;
    onChatClick: () => void;
    isTransparent?: boolean;
}

const Header: React.FC<HeaderProps> = (props) => {
    const { 
        user, isAuthenticated, onHomeClick, onLoginClick, onSignupClick, 
        onLogout, onChatClick, isTransparent = false 
    } = props;
    
    const t = useLocalization();
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('Header must be used within a LanguageProvider');
    }
    const { language, setLanguage } = context;

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as Language);
    };

    const headerClasses = isTransparent
        ? 'absolute top-0 left-0 right-0 z-10'
        : 'relative bg-white/30 backdrop-blur-sm shadow-sm';

    const textColor = isTransparent ? 'text-white' : 'text-green-800';
    const subtextColor = isTransparent ? 'text-green-200' : 'text-green-600';

    return (
        <header className={`py-4 px-4 md:px-8 ${headerClasses}`}>
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <button onClick={onHomeClick} className="flex items-center gap-4 text-left">
                    <AgroGeniusLogo className="h-10 w-10 flex-shrink-0" />
                    <div>
                        <h1 className={`text-2xl md:text-3xl font-extrabold ${textColor}`}>{t('appTitle')}</h1>
                        <p className={`text-sm ${subtextColor} -mt-1`}>{t('appSubtitle')}</p>
                    </div>
                </button>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className={`appearance-none border text-sm py-2 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${isTransparent ? 'bg-white/20 border-white/30 text-white' : 'bg-white border-gray-300 text-gray-700'}`}
                        >
                            <option className="text-black" value="en">English</option>
                            <option className="text-black" value="es">Español</option>
                            <option className="text-black" value="hi">हिन्दी</option>
                            <option className="text-black" value="bn">বাংলা</option>
                            <option className="text-black" value="ta">தமிழ்</option>
                            <option className="text-black" value="te">తెలుగు</option>
                            <option className="text-black" value="mr">मराठी</option>
                            <option className="text-black" value="gu">ગુજરાતી</option>
                        </select>
                        <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${isTransparent ? 'text-white' : 'text-gray-700'}`}>
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                           <span className={`hidden sm:block font-semibold ${textColor}`}>{t('welcomeUser')} {user?.name.split(' ')[0]}</span>
                           <button onClick={onLogout} className="px-4 py-2 text-sm font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                               {t('logoutButton')}
                           </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                             <button onClick={onLoginClick} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${isTransparent ? 'text-white hover:bg-white/20' : 'text-green-700 hover:bg-green-100'}`}>
                                {t('loginButton')}
                            </button>
                            <button onClick={onSignupClick} className="px-4 py-2 text-sm font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                {t('signupButton')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;