import { useState, useEffect } from 'react';
import { LanguageContext } from './languageContext.js';
import { translations } from './translations.js';
import { loadSettings, updateSetting } from '../utils/settings.js';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  // Load language preference on mount
  useEffect(() => {
    const settings = loadSettings();
    setLanguage(settings.language);
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'fr' : 'en';
    setLanguage(newLanguage);
    updateSetting('language', newLanguage);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
