import { useLanguage } from '../../contexts/useLanguage.js';
import './LanguageToggle.css';

function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  const handleButtonClick = (e) => {
    e.target.blur(); // Remove focus to prevent browser focus styling
    toggleLanguage(); // Always toggle, regardless of which flag is clicked
  };

  return (
    <div className="language-toggle">
      <button 
        className={`flag-button ${language === 'en' ? 'active' : ''}`}
        onClick={handleButtonClick}
        title={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
      >
        <span className="flag">🇺🇸</span>
      </button>
      <button 
        className={`flag-button ${language === 'fr' ? 'active' : ''}`}
        onClick={handleButtonClick}
        title={language === 'fr' ? 'Passer en anglais' : 'Switch to French'}
      >
        <span className="flag">🇫🇷</span>
      </button>
    </div>
  );
}

export default LanguageToggle;
