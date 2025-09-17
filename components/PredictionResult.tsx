import React from 'react';
import type { PredictionResult } from '../types';
import { useLocalization } from '../hooks/useLocalization';

interface PredictionResultProps {
  result: PredictionResult;
}

// Fix: Changed JSX.Element to React.ReactNode to resolve 'Cannot find namespace JSX' error.
const InfoCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg shadow-md flex items-start space-x-4">
        <div className="flex-shrink-0 text-green-600">
            {icon}
        </div>
        <div>
            <h4 className="text-sm font-semibold text-gray-600 uppercase">{title}</h4>
            <p className="text-lg font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const PredictionResultComponent: React.FC<PredictionResultProps> = ({ result }) => {
    const t = useLocalization();
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-center text-white mb-6">{t('predictionTitle')}</h2>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="relative">
            <img src={result.cropImage} alt={result.cropName} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-sm font-semibold text-gray-200 uppercase">{t('predictedCrop')}</h3>
                <p className="text-4xl font-extrabold text-white">{result.cropName}</p>
            </div>
        </div>
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <InfoCard title={t('predictedYield')} value={result.predictedYield} icon={<YieldIcon />} />
                <InfoCard title={t('estimatedProfit')} value={result.estimatedProfit} icon={<ProfitIcon />} />
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="font-bold text-green-700">{t('reasoning')}</h4>
                    <p className="text-gray-600">{result.reasoning}</p>
                </div>
                <div>
                    <h4 className="font-bold text-green-700">{t('description')}</h4>
                    <p className="text-gray-600">{result.cropDescription}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};


const YieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const ProfitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1h4v1m-4 0h-4v-1h4m0-4h.01M12 4h.01M12 2v1m0 18v-1m0-1h.01M12 20h.01M12 22v-1h-4v1m4 0h4v-1h-4m0 4h.01M12 20h.01" />
    </svg>
);


export default PredictionResultComponent;