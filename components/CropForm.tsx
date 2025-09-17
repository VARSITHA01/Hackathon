import React, { useState, useContext } from 'react';
import type { FormData, InputMode } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { getWeatherAndParse, parseVoiceInput } from '../services/geminiService';
import { LanguageContext } from '../contexts/LanguageContext';

interface CropFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
}

const InputField: React.FC<{
  id: keyof FormData;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
}> = ({ id, label, value, onChange, placeholder, disabled }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="number"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out disabled:bg-gray-100"
      required
      disabled={disabled}
    />
  </div>
);


const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors duration-200 ${
            active
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        }`}
    >
        {children}
    </button>
);

const CropForm: React.FC<CropFormProps> = ({ onSubmit, isLoading }) => {
    const t = useLocalization();
    const { language } = useContext(LanguageContext)!;

    const [formData, setFormData] = useState<FormData>({
        N: '90', P: '42', K: '43', temperature: '20.8',
        humidity: '82', ph: '6.5', rainfall: '202',
    });
    const [activeTab, setActiveTab] = useState<InputMode>('manual');
    const [locationState, setLocationState] = useState<'idle' | 'fetching' | 'success' | 'error'>('idle');
    const [aiAssistStatus, setAiAssistStatus] = useState('');
    const [error, setError] = useState('');
    const [isListening, setIsListening] = useState(false);
    
    const handleTabChange = (tab: InputMode) => {
        setActiveTab(tab);
        setError(''); // Clear errors when switching tabs
        if(tab === 'ai') {
             setFormData(prev => ({ ...prev, temperature: '', humidity: '', rainfall: '' }));
             setLocationState('idle');
        } else if (tab === 'manual' && (!formData.temperature || !formData.humidity || !formData.rainfall)) {
            // Restore defaults if switching back to manual and weather fields were empty
            setFormData(prev => ({ ...prev, temperature: '20.8', humidity: '82', rainfall: '202' }));
        }
    }

    const handleRequestLocation = () => {
        if (!navigator.geolocation) {
            setError(t('geolocationNotSupported'));
            setLocationState('error');
            return;
        }

        setLocationState('fetching');
        setError('');
        setAiAssistStatus(t('fetchingLocation'));

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setAiAssistStatus(t('fetchingWeather'));
                try {
                    const weatherData = await getWeatherAndParse({ latitude, longitude }, language);
                    setFormData(prev => ({ ...prev, ...weatherData }));
                    setLocationState('success');
                } catch (err) {
                    setError(t('weatherErrorMessage'));
                    setLocationState('error');
                } finally {
                    setAiAssistStatus('');
                }
            },
            (geoError) => {
                let errorMessage = t('geolocationError');
                if (geoError.code === geoError.PERMISSION_DENIED) {
                    errorMessage = t('geolocationPermissionDenied');
                }
                setError(errorMessage);
                console.error("Geolocation error:", geoError);
                setLocationState('error');
                setAiAssistStatus('');
            }
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        onSubmit(formData);
    };

    const handleVoiceInput = () => {
        // Fix: Cast window to `any` to access non-standard SpeechRecognition APIs and resolve TypeScript errors.
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = language;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsListening(true);
        setError('');

        recognition.start();

        recognition.onresult = async (event: any) => {
            const transcript = event.results[0][0].transcript;
            try {
                const parsedData = await parseVoiceInput(transcript, language);
                setFormData(prev => ({...prev, ...parsedData}));
            } catch (err) {
                setError(t('voiceErrorMessage'));
            }
        };

        recognition.onspeechend = () => {
            recognition.stop();
            setIsListening(false);
        };
        
        recognition.onerror = (event: any) => {
            setError(`Speech recognition error: ${event.error}`);
            setIsListening(false);
        }
    };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-green-800 mb-2">{t('formTitle')}</h2>
      <div className="flex border-b border-gray-200 mb-6">
          <TabButton active={activeTab === 'manual'} onClick={() => handleTabChange('manual')}>Manual</TabButton>
          <TabButton active={activeTab === 'voice'} onClick={() => handleTabChange('voice')}>Voice</TabButton>
          <TabButton active={activeTab === 'ai'} onClick={() => handleTabChange('ai')}>AI Assist</TabButton>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-600 text-center text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

        {activeTab === 'manual' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="N" label={t('nitrogenLabel')} value={formData.N} onChange={handleChange} placeholder="e.g., 90" />
                <InputField id="P" label={t('phosphorusLabel')} value={formData.P} onChange={handleChange} placeholder="e.g., 42" />
                <InputField id="K" label={t('potassiumLabel')} value={formData.K} onChange={handleChange} placeholder="e.g., 43" />
                <InputField id="temperature" label={t('temperatureLabel')} value={formData.temperature} onChange={handleChange} placeholder="e.g., 21.5" />
                <InputField id="humidity" label={t('humidityLabel')} value={formData.humidity} onChange={handleChange} placeholder="e.g., 80.3" />
                <InputField id="ph" label={t('phLabel')} value={formData.ph} onChange={handleChange} placeholder="e.g., 6.5" />
                <InputField id="rainfall" label={t('rainfallLabel')} value={formData.rainfall} onChange={handleChange} placeholder="e.g., 203" />
            </div>
        )}

        {activeTab === 'ai' && (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField id="N" label={t('nitrogenLabel')} value={formData.N} onChange={handleChange} placeholder="e.g., 90" />
                    <InputField id="P" label={t('phosphorusLabel')} value={formData.P} onChange={handleChange} placeholder="e.g., 42" />
                    <InputField id="K" label={t('potassiumLabel')} value={formData.K} onChange={handleChange} placeholder="e.g., 43" />
                    <InputField id="ph" label={t('phLabel')} value={formData.ph} onChange={handleChange} placeholder="e.g., 6.5" />
                </div>
                
                <div className="text-center p-4 border-t mt-4">
                    {locationState === 'idle' && (
                        <>
                            <p className="text-gray-600 mb-4">{t('aiAssistInstruction')}</p>
                            <button type="button" onClick={handleRequestLocation} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600">
                                {t('useCurrentLocationButton')}
                            </button>
                        </>
                    )}

                    {locationState === 'fetching' && (
                         <div className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-gray-600">{aiAssistStatus}</p>
                        </div>
                    )}

                    {locationState === 'success' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <InputField id="temperature" label={t('temperatureLabel')} value={formData.temperature} onChange={handleChange} placeholder="..." disabled={true} />
                            <InputField id="humidity" label={t('humidityLabel')} value={formData.humidity} onChange={handleChange} placeholder="..." disabled={true} />
                            <InputField id="rainfall" label={t('rainfallLabel')} value={formData.rainfall} onChange={handleChange} placeholder="..." disabled={true} />
                        </div>
                    )}
                </div>
            </>
        )}

        {activeTab === 'voice' && (
            <div className="text-center">
                 <p className="text-gray-600 mb-4">{t('voiceInstruction')}</p>
                 <button type="button" onClick={handleVoiceInput} disabled={isListening} className="bg-red-500 text-white font-bold py-3 px-6 rounded-full hover:bg-red-600 disabled:bg-red-300 flex items-center justify-center mx-auto">
                    {isListening ? t('listening') : t('startListening')}
                 </button>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <InputField id="N" label={t('nitrogenLabel')} value={formData.N} onChange={handleChange} placeholder="e.g., 90" />
                    <InputField id="P" label={t('phosphorusLabel')} value={formData.P} onChange={handleChange} placeholder="e.g., 42" />
                    <InputField id="K" label={t('potassiumLabel')} value={formData.K} onChange={handleChange} placeholder="e.g., 43" />
                    <InputField id="temperature" label={t('temperatureLabel')} value={formData.temperature} onChange={handleChange} placeholder="e.g., 21.5" />
                    <InputField id="humidity" label={t('humidityLabel')} value={formData.humidity} onChange={handleChange} placeholder="e.g., 80.3" />
                    <InputField id="ph" label={t('phLabel')} value={formData.ph} onChange={handleChange} placeholder="e.g., 6.5" />
                    <InputField id="rainfall" label={t('rainfallLabel')} value={formData.rainfall} onChange={handleChange} placeholder="e.g., 203" />
                </div>
            </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
        >
          {isLoading ? (
             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          ) : t('predictButton')}
        </button>
      </form>
    </div>
  );
};

export default CropForm;