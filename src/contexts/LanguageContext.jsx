import { useState, useEffect, useCallback } from 'react';
import { LanguageContext } from './languageContext.js';
import { translations } from './translations.js';
import { loadSettings, updateSetting } from '../utils/settings.js';
import { interpolate } from '../utils/format.js';

export function LanguageProvider({ children }) {
  // Read the saved language before the first render so the UI never flashes in English
  const [language, setLanguage] = useState(() => loadSettings().language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'fr' : 'en';
    setLanguage(newLanguage);
    updateSetting('language', newLanguage);
  };

  const t = useCallback((key, vars) => {
    const table = translations[language];
    let template = table[key];
    if (vars && typeof vars.count === 'number') {
      template = table[`${key}_${vars.count === 1 ? 'one' : 'other'}`] ?? template;
    }
    return template === undefined ? key : interpolate(template, vars);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
