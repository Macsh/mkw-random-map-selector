import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/useLanguage.js';
import { circuits, getCircuitName } from '../../data/circuits.js';
import { loadSettings, updateSetting } from '../../utils/settings.js';
import LanguageToggle from '../LanguageToggle/LanguageToggle.jsx';
import './SelectionScreen.css';

function SelectionScreen({ onStartSession }) {
  const [raceCount, setRaceCount] = useState(8);
  const [showPlayerOptions, setShowPlayerOptions] = useState(false);
  const [players, setPlayers] = useState(['', '', '', '']);
  const [rainbowRoadLast, setRainbowRoadLast] = useState(false);
  const [showTrackOptions, setShowTrackOptions] = useState(false);
  const [excludedTracks, setExcludedTracks] = useState(new Set());
  const { t, language } = useLanguage();

  const raceOptions = [3, 4, 5, 6, 8, 12, 16, 32];

  // Load user preferences on mount
  useEffect(() => {
    const settings = loadSettings();
    setRaceCount(settings.raceCount);
    setRainbowRoadLast(settings.rainbowRoadLast);
    setShowPlayerOptions(settings.showPlayerOptions);
    setShowTrackOptions(settings.showTrackOptions);
    setExcludedTracks(new Set(settings.excludedTracks));
  }, []);

  // Save race count preference
  const handleRaceCountChange = (count) => {
    setRaceCount(count);
    updateSetting('raceCount', count);
  };

  // Save rainbow road preference
  const handleRainbowRoadChange = (checked) => {
    setRainbowRoadLast(checked);
    updateSetting('rainbowRoadLast', checked);
    
    // If Rainbow Road Last is enabled, ensure Rainbow Road is not excluded
    if (checked && excludedTracks.has('rainbow_road')) {
      const newExcluded = new Set(excludedTracks);
      newExcluded.delete('rainbow_road');
      setExcludedTracks(newExcluded);
      updateSetting('excludedTracks', Array.from(newExcluded));
    }
  };

  // Save player options visibility preference
  const handleShowPlayerOptions = (show) => {
    setShowPlayerOptions(show);
    updateSetting('showPlayerOptions', show);
  };

  // Save track options visibility preference
  const handleShowTrackOptions = (show) => {
    setShowTrackOptions(show);
    updateSetting('showTrackOptions', show);
  };

  const handlePlayerChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const getActivePlayers = () => {
    return players.filter(player => player.trim() !== '');
  };

  const handleTrackExclusion = (trackId, isExcluded) => {
    // Prevent excluding Rainbow Road if "Rainbow Road Last" is enabled
    if (trackId === 'rainbow_road' && isExcluded && rainbowRoadLast) {
      return; // Don't allow excluding Rainbow Road when it's set to be last
    }
    
    const newExcluded = new Set(excludedTracks);
    if (isExcluded) {
      newExcluded.add(trackId);
    } else {
      newExcluded.delete(trackId);
    }
    
    // Ensure at least 3 tracks remain available
    const availableTracks = circuits.length - newExcluded.size;
    if (availableTracks >= 3) {
      setExcludedTracks(newExcluded);
      updateSetting('excludedTracks', Array.from(newExcluded));
    }
  };

  const handleSelectAllTracks = () => {
    setExcludedTracks(new Set());
    updateSetting('excludedTracks', []);
  };

  const handleDeselectAllTracks = () => {
    // Keep at least 3 tracks available, so exclude all but the first 3
    const newExcluded = new Set();
    circuits.forEach((circuit, index) => {
      if (index >= 3) {
        newExcluded.add(circuit.id);
      }
    });
    setExcludedTracks(newExcluded);
    updateSetting('excludedTracks', Array.from(newExcluded));
  };

  const handleStartSession = () => {
    const activePlayers = getActivePlayers();
    onStartSession({
      raceCount,
      players: activePlayers.length > 0 ? activePlayers : [],
      rainbowRoadLast,
      excludedTracks: Array.from(excludedTracks)
    });
  };

  return (
    <div className="selection-screen">
      <div className="selection-container">
        <div className="header-with-language">
          <div className="title-with-flags">
            <div className="title-block">
              <h1 className="title">{t('app.title')}</h1>
              <h2 className="subtitle">{t('app.subtitle')}</h2>
            </div>
            <LanguageToggle />
          </div>
        </div>

        <div className="race-count-section">
          <h3>{t('selection.raceCount')}</h3>
          <div className="race-options">
            {raceOptions.map(count => (
              <button
                key={count}
                className={`race-option ${raceCount === count ? 'selected' : ''}`}
                onClick={() => handleRaceCountChange(count)}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="rainbow-road-section">
          <label className="rainbow-road-option">
            <input
              type="checkbox"
              checked={rainbowRoadLast}
              onChange={(e) => handleRainbowRoadChange(e.target.checked)}
              className="rainbow-road-checkbox"
            />
            <span className="rainbow-road-text">
              🌈 {t('selection.rainbowRoadLast')}
            </span>
          </label>
          <p className="rainbow-road-help">
            {t('selection.rainbowRoadLastHelp')}
          </p>
        </div>

        <div className="track-section">
          <button
            className="toggle-tracks"
            onClick={() => handleShowTrackOptions(!showTrackOptions)}
          >
            {showTrackOptions ? t('selection.hideTrackOptions') : t('selection.showTrackOptions')}
            <span className="track-counter">
              ({circuits.length - excludedTracks.size}/{circuits.length})
            </span>
          </button>

          {showTrackOptions && (
            <div className="track-options">
              <h3>{t('selection.excludeTracks')}</h3>
              <div className="track-controls">
                <button onClick={handleSelectAllTracks} className="track-control-btn">
                  {t('selection.selectAll')}
                </button>
                <button onClick={handleDeselectAllTracks} className="track-control-btn">
                  {t('selection.deselectAll')}
                </button>
              </div>
              <div className="track-grid">
                {circuits.map((circuit) => (
                  <label key={circuit.id} className="track-option">
                    <input
                      type="checkbox"
                      checked={!excludedTracks.has(circuit.id)}
                      onChange={(e) => handleTrackExclusion(circuit.id, !e.target.checked)}
                      disabled={circuit.id === 'rainbow_road' && rainbowRoadLast}
                      className="track-checkbox"
                    />
                    <span className="track-name">
                      {getCircuitName(circuit, language)}
                    </span>
                  </label>
                ))}
              </div>
              <p className="track-help">
                {t('selection.excludeTracksHelp')}
              </p>
            </div>
          )}
        </div>

        <div className="player-section">
          <button
            className="toggle-players"
            onClick={() => handleShowPlayerOptions(!showPlayerOptions)}
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
              {rainbowRoadLast ? t('selection.warning32WithRainbow') : t('selection.warning32')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SelectionScreen;
