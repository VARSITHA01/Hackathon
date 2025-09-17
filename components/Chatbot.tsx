import React, { useState, useEffect, useRef, useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { useLocalization } from '../hooks/useLocalization';
import { createChat } from '../services/geminiService';
import AgroGeniusLogo from './icons/AgroGeniusLogo';
import Header from './Header';
import Footer from './Footer';
import type { Language, User, View } from '../types';
import type { Chat } from '@google/genai';

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

const Chatbot: React.FC<{ user: User; onLogout: () => void; onNavigate: (view: View) => void; }> = ({ user, onLogout, onNavigate }) => {
    const t = useLocalization();
    const { language } = useContext(LanguageContext)!;

    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chatSession = createChat(language);
        setChat(chatSession);
        setMessages([{ sender: 'bot', text: t('chatbotWelcome') }]);
    }, [language, t]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    const handleSend = async () => {
        if (!input.trim() || !chat) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await chat.sendMessageStream({ message: input });
            let botResponse = '';
            setMessages(prev => [...prev, { sender: 'bot', text: '' }]);
            
            for await (const chunk of stream) {
                botResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = botResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I encountered an error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen font-sans">
             <div 
                className="fixed inset-0 bg-cover bg-center z-0" 
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1597992958329-faf74cb78713?q=80&w=1935&auto=format&fit=crop')" }} 
            />
            <div className="fixed inset-0 bg-green-900/80 z-0" />

            <div className="relative z-10 flex flex-col h-screen">
                <Header 
                    user={user} 
                    isAuthenticated={true} 
                    onLogout={onLogout} 
                    onHomeClick={() => onNavigate('landing')} 
                    onChatClick={() => onNavigate('chatbot')}
                />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                     <div className="max-w-3xl mx-auto mb-4">
                         <button
                            type="button"
                            onClick={() => onNavigate('landing')}
                            className="font-semibold text-sm text-green-100 hover:text-white"
                        >
                           {t('backToHome')}
                        </button>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'bot' && <AgroGeniusLogo className="h-8 w-8 flex-shrink-0" />}
                                <div className={`max-w-md lg:max-w-xl px-4 py-2 rounded-2xl shadow-md ${msg.sender === 'user' ? 'bg-green-600 text-white rounded-br-none' : 'bg-white/90 backdrop-blur-sm text-gray-800 rounded-bl-none'}`}>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-3 justify-start">
                                <AgroGeniusLogo className="h-8 w-8 flex-shrink-0" />
                                <div className="px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-sm text-gray-800 rounded-bl-none shadow-md">
                                    <div className="flex items-center justify-center space-x-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </main>
                <footer className="bg-white/30 backdrop-blur-sm border-t border-white/20 p-4 z-10 relative">
                    <div className="max-w-3xl mx-auto flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                            placeholder={t('chatbotPlaceholder')}
                            className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-green-500 focus:border-green-500 shadow-sm"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-green-600 text-white rounded-full p-2 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center w-10 h-10 shadow-sm"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Chatbot;