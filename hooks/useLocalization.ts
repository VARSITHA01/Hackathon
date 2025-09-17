import { useContext, useCallback } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';
import { localizedStrings } from '../localization/strings';

export const useLocalization = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LanguageProvider');
  }
  const { language } = context;

  const t = useCallback((key: keyof typeof localizedStrings) => {
    return localizedStrings[key][language] || localizedStrings[key]['en'];
  }, [language]);

  return t;
};