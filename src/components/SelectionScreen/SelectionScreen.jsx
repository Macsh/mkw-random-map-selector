import { useState } from 'react';
import { useLanguage } from '../../contexts/useLanguage.js';
import { circuits } from '../../data/circuits.js';
import { loadSettings, updateSetting } from '../../utils/settings.js';
import { countRepeats } from '../../utils/raceLogic.js';
import { sanitizeExcluded } from '../../utils/trackSelection.js';
import { longestWordLength } from '../../utils/format.js';
import { useIsMobile } from '../../hooks/useIsMobile.js';
import LanguageToggle from '../LanguageToggle/LanguageToggle.jsx';
import Icon from '../ui/Icon.jsx';
import { RainbowBadge, PlayerDot } from '../ui/Badges.jsx';
import { MapView } from '../Map/MapView.jsx';
import TrackBlocks from './TrackBlocks.jsx';
import './SelectionScreen.css';

const RACE_OPTIONS = [3, 4, 5, 6, 8, 12, 16, 32];

function SelectionScreen({ onStartSession }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  // Saved preferences are read once, before the first render
  const [initial] = useState(loadSettings);
  const [raceCount, setRaceCount] = useState(initial.raceCount);
  const [rainbowRoadLast, setRainbowRoadLast] = useState(initial.rainbowRoadLast);
  const [showTrackOptions, setShowTrackOptions] = useState(initial.showTrackOptions);
  const [showPlayerOptions, setShowPlayerOptions] = useState(initial.showPlayerOptions);
  const [excludedTracks, setExcludedTracks] = useState(() => sanitizeExcluded(initial.excludedTracks, initial.rainbowRoadLast));
  const [players, setPlayers] = useState(['', '', '', '']);

  const activePlayers = players.map((name) => name.trim()).filter(Boolean);
  const title = t('home.title');
  const titleStyle = { '--title-chars': longestWordLength(title) };
  const selectedCount = circuits.length - excludedTracks.length;
  const repeats = countRepeats(raceCount, selectedCount, rainbowRoadLast);

  const changeRaceCount = (count) => {
    setRaceCount(count);
    updateSetting('raceCount', count);
  };

  const changeExcluded = (next) => {
    if (next === excludedTracks) return; // refused by the selection rules
    setExcludedTracks(next);
    updateSetting('excludedTracks', next);
  };

  const toggleRainbowRoadLast = () => {
    const next = !rainbowRoadLast;
    setRainbowRoadLast(next);
    updateSetting('rainbowRoadLast', next);
    changeExcluded(sanitizeExcluded(excludedTracks, next));
  };

  const toggleTrackOptions = () => {
    setShowTrackOptions(!showTrackOptions);
    updateSetting('showTrackOptions', !showTrackOptions);
  };

  const togglePlayerOptions = () => {
    setShowPlayerOptions(!showPlayerOptions);
    updateSetting('showPlayerOptions', !showPlayerOptions);
  };

  const changePlayer = (index, value) => {
    setPlayers((previous) => previous.map((name, i) => (i === index ? value : name)));
  };

  const start = () => {
    onStartSession({ raceCount, players: activePlayers, rainbowRoadLast, excludedTracks });
  };

  const settings = (
    <div className="home__settings">
      {!isMobile && (
        <div className="home__lang">
          <LanguageToggle />
        </div>
      )}

      <section className="sticker home-card">
        <h2 className="display home-card__title">{t('home.raceCount')}</h2>
        <div className="race-options">
          {RACE_OPTIONS.map((count) => (
            <button key={count} type="button" className="pill" aria-pressed={raceCount === count} onClick={() => changeRaceCount(count)}>
              {count}
            </button>
          ))}
        </div>
      </section>

      <button type="button" role="switch" aria-checked={rainbowRoadLast} className="sticker home-switch" onClick={toggleRainbowRoadLast}>
        <RainbowBadge size={52} radius={12} />
        <span className="home-switch__text">
          <span className="home-switch__label">{t('home.rainbowLast')}</span>
          <span className="muted home-switch__help">{t('home.rainbowLastHelp')}</span>
        </span>
        <span className="switch" aria-hidden="true">
          <span className="switch__knob" />
        </span>
      </button>

      <section className="sticker home-options">
        <button type="button" className="option-row" aria-expanded={showTrackOptions} onClick={toggleTrackOptions}>
          <span className="option-row__icon"><Icon name="map" size={22} /></span>
          <span className="option-row__label">{t('home.courses')}</span>
          <span className="option-row__value num">{selectedCount}/{circuits.length}</span>
          <Icon name={showTrackOptions ? 'chevronDown' : 'chevronRight'} />
        </button>
        {showTrackOptions && (
          <TrackBlocks excludedTracks={excludedTracks} rainbowRoadLast={rainbowRoadLast} onChange={changeExcluded} />
        )}

        <div className="home-options__rule" />

        <button type="button" className="option-row" aria-expanded={showPlayerOptions} onClick={togglePlayerOptions}>
          <span className="option-row__icon"><Icon name="users" size={22} /></span>
          <span className="option-row__label">{t('home.players')}</span>
          <span className="option-row__value num">{activePlayers.length > 0 ? activePlayers.length : t('home.noPlayers')}</span>
          <Icon name={showPlayerOptions ? 'chevronDown' : 'chevronRight'} />
        </button>
        {showPlayerOptions && (
          <div className="players-panel">
            <div className="players-panel__grid">
              {players.map((name, index) => {
                const placeholder = t('home.playerPlaceholder', { number: index + 1 });
                return (
                  <label key={index} className="player-field">
                    <PlayerDot index={index} />
                    <input
                      type="text"
                      value={name}
                      maxLength={16}
                      placeholder={placeholder}
                      aria-label={placeholder}
                      onChange={(event) => changePlayer(index, event.target.value)}
                    />
                  </label>
                );
              })}
            </div>
            <p className="muted players-panel__help">{t('home.playersHelp')}</p>
          </div>
        )}
      </section>

      {repeats > 0 && <p className="home-warning" role="status">{t('home.repeatWarning', { count: repeats })}</p>}

      <div className="home-start">
        <button type="button" className="btn btn--primary btn--block home-start__button" onClick={start}>
          {t('home.start')}
          <Icon name="play" size={20} />
        </button>
        <p className="muted home-start__summary">
          <strong>{t('common.races', { count: raceCount })}</strong>
          {activePlayers.length > 0 && ` · ${t('common.players', { count: activePlayers.length })}`}
          {rainbowRoadLast && ` · ${t('common.rainbowLastShort')}`}
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="home">
        <div className="checker" />
        <main className="home__body home__body--mobile">
          <header className="home__header">
            <span className="label label--brand">{t('common.brand')}</span>
            <LanguageToggle />
          </header>
          <h1 className="display title-shadow-sm fit-title home__title" style={titleStyle}>{title}</h1>
          {settings}
        </main>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="checker" />
      <main className={`home__body home__body--desktop${showTrackOptions ? ' home__body--top' : ''}`}>
        <div className="home__hero">
          <span className="label label--brand home__brand">{t('common.brand')}</span>
          <h1 className="display title-shadow-lg fit-title home__title" style={titleStyle}>{title}</h1>
          <div className="home__map">
            <div className="sticker home__map-card">
              <MapView className="home__map-view" />
            </div>
            <span className="sticker display home__map-badge">{t('home.courseCountBadge', { count: circuits.length })}</span>
          </div>
        </div>
        {settings}
      </main>
    </div>
  );
}

export default SelectionScreen;
