import { useLanguage } from '../../contexts/useLanguage.js';
import './LanguageToggle.css';

const LANGUAGES = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
];

function LanguageToggle() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="lang-toggle" role="group" aria-label={t('common.language')}>
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={language === code}
          onClick={() => { if (language !== code) toggleLanguage(); }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default LanguageToggle;
