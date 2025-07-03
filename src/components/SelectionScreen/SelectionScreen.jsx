import { useState } from 'react';
import { useLanguage } from '../../contexts/useLanguage.js';
import './SelectionScreen.css';

function SelectionScreen({ onStartSession }) {
  const [raceCount, setRaceCount] = useState(8);
  const [showPlayerOptions, setShowPlayerOptions] = useState(false);
  const [players, setPlayers] = useState(['', '', '', '']);
  const { language, toggleLanguage, t } = useLanguage();

  const raceOptions = [3, 4, 5, 6, 8, 12, 16, 32];

  const handlePlayerChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const getActivePlayers = () => {
    return players.filter(player => player.trim() !== '');
  };

  const handleStartSession = () => {
    const activePlayers = getActivePlayers();
    onStartSession({
      raceCount,
      players: activePlayers.length > 0 ? activePlayers : []
    });
  };

  return (
    <div className="selection-screen">
      <div className="selection-container">
        <div className="header-with-language">
          <div className="title-section">
            <h1 className="title">{t('app.title')}</h1>
            <h2 className="subtitle">{t('app.subtitle')}</h2>
          </div>
          <div className="language-toggle">
            <button 
              className={`language-button ${language === 'en' ? 'active' : ''}`}
              onClick={toggleLanguage}
              aria-label="Switch to English"
            >
              🇺🇸
            </button>
            <button 
              className={`language-button ${language === 'fr' ? 'active' : ''}`}
              onClick={toggleLanguage}
              aria-label="Passer au français"
            >
              🇫🇷
            </button>
          </div>
        </div>

        <div className="race-count-section">
          <h3>{t('selection.raceCount')}</h3>
          <div className="race-options">
            {raceOptions.map(count => (
              <button
                key={count}
                className={`race-option ${raceCount === count ? 'selected' : ''}`}
                onClick={() => setRaceCount(count)}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="player-section">
          <button
            className="toggle-players"
            onClick={() => setShowPlayerOptions(!showPlayerOptions)}
          >
            {showPlayerOptions ? t('selection.hidePlayers') : t('selection.showPlayers')}
          </button>

          {showPlayerOptions && (
            <div className="player-options">
              <h3>{t('selection.playerNames')}</h3>
              <div className="player-inputs">
                {players.map((player, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`${t('selection.playerPlaceholder')} ${index + 1}`}
                    value={player}
                    onChange={(e) => handlePlayerChange(index, e.target.value)}
                    className="player-input"
                  />
                ))}
              </div>
              <p className="player-help">
                {t('selection.playerHelp')}
              </p>
            </div>
          )}
        </div>

        <button className="start-button" onClick={handleStartSession}>
          {t('selection.startSession')}
        </button>

        <div className="info-section">
          <p>
            {t('selection.selected')} <strong>{raceCount} {t('selection.races')}</strong>
            {getActivePlayers().length > 0 && (
              <span> {t('selection.with')} {getActivePlayers().length} {t('selection.players')}</span>
            )}
          </p>
          {raceCount === 32 && (
            <p className="warning">
              {t('selection.warning32')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectionScreen;
