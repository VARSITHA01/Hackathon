import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { authService } from '../services/authService';
import type { View, User } from '../types';
import AgroGeniusLogo from './icons/AgroGeniusLogo';
import Header from './Header';

interface LoginProps {
    onLoginSuccess: (user: User) => void;
    onNavigate: (view: View) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigate }) => {
    const t = useLocalization();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            const result = authService.login(email, password);
            if (result.success && result.user) {
                onLoginSuccess(result.user);
            } else {
                setError(t('invalidCredentialsError'));
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="relative min-h-screen bg-green-50 flex flex-col">
            <Header 
                isAuthenticated={false} 
                onHomeClick={() => onNavigate('landing')}
                onLoginClick={() => onNavigate('login')}
                onSignupClick={() => onNavigate('signup')}
                onChatClick={() => onNavigate('chatbot')}
                isTransparent={false}
            />
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="mb-4">
                         <button
                            type="button"
                            onClick={() => onNavigate('landing')}
                            className="font-semibold text-sm text-green-600 hover:text-green-500"
                        >
                           {t('backToHome')}
                        </button>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-8 rounded-2xl shadow-lg space-y-6"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-green-800">{t('loginTitle')}</h2>
                        </div>
                        
                        {error && <p className="text-red-600 text-center text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('emailLabel')}
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('passwordLabel')}
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-300 flex items-center justify-center"
                        >
                            {isLoading ? '...' : t('loginButton')}
                        </button>
                        <p className="text-center text-sm text-gray-600">
                            {t('loginPrompt')}{' '}
                            <button
                                type="button"
                                onClick={() => onNavigate('signup')}
                                className="font-semibold text-green-600 hover:text-green-500"
                            >
                                {t('signupButton')}
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;