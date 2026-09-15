import { useCallback, useState } from 'react';
import { useLanguage } from '../../contexts/useLanguage.js';
import { getCircuitName, getCircuitShortName, getMapSpot, getParentCircuit, isSnes } from '../../data/circuits.js';
import { getSnesThumbnail } from '../../data/snesThumbnails.js';
import { MAP_ASPECT } from '../../utils/mapGeometry.js';
import { useIsMobile } from '../../hooks/useIsMobile.js';
import LanguageToggle from '../LanguageToggle/LanguageToggle.jsx';
import Icon from '../ui/Icon.jsx';
import { SnesBadge } from '../ui/Badges.jsx';
import { MapView, MapPin, MiniMap } from '../Map/MapView.jsx';
import Standings from './Standings.jsx';
import PositionsSheet from './PositionsSheet.jsx';
import './RaceScreen.css';

// Desktop side column is 420px wide: inner card width = 414px
const SIDE_CARD_WIDTH = 414;

function RaceTitle({ raceIndex, totalRaces }) {
  const { t } = useLanguage();
  return (
    <div className="race-title">
      <span className="visually-hidden">{t('race.progress', { current: raceIndex + 1, total: totalRaces })}</span>
      <span className="display" aria-hidden="true">{t('race.title', { current: raceIndex + 1 })}</span>
      <span className="display num muted" aria-hidden="true">/{' '}{totalRaces}</span>
    </div>
  );
}

function RaceProgress({ raceIndex, totalRaces }) {
  return (
    <ol className={totalRaces > 12 ? 'race-progress race-progress--dense' : 'race-progress'} aria-hidden="true">
      {Array.from({ length: totalRaces }, (_, index) => (
        <li
          key={index}
          className={`race-progress__seg${index < raceIndex ? ' is-done' : ''}${index === raceIndex ? ' is-now' : ''}`}
        />
      ))}
    </ol>
  );
}

function SnesTrack({ circuit, variant }) {
  const { t, language } = useLanguage();
  const parentName = getCircuitName(getParentCircuit(circuit), language);
  return (
    <div className={`sticker snes-track snes-track--${variant}`}>
      <img src={getSnesThumbnail(circuit.id)} alt="" decoding="async" />
      <div className="snes-track__text">
        <span className="label">{t('race.snesTrack')}</span>
        <strong>{t('race.pickFrom', { course: parentName })}</strong>
      </div>
    </div>
  );
}

function RaceScreen({ currentRace, races, raceIndex, totalRaces, players, onNextRace, onEndSession, onPositionsEntered }) {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [editingRaceIndex, setEditingRaceIndex] = useState(null);
  const closeSheet = useCallback(() => setEditingRaceIndex(null), []);

  if (!currentRace) return null;

  const hasPlayers = players.length > 0;
  const isLastRace = raceIndex >= totalRaces - 1;
  const snes = isSnes(currentRace);
  const spot = getMapSpot(currentRace);
  const title = snes ? getCircuitShortName(currentRace, language) : getCircuitName(currentRace, language);

  const goNext = () => (isLastRace ? onEndSession() : onNextRace());
  const nextLabel = isLastRace
    ? t(hasPlayers ? 'race.results' : 'race.seeResults')
    : t(hasPlayers ? 'race.next' : 'race.nextRace');

  const actions = (
    <div className={hasPlayers ? 'race-actions race-actions--split' : 'race-actions'}>
      {hasPlayers && (
        <button type="button" className="btn" onClick={() => setEditingRaceIndex(raceIndex)}>
          <Icon name="podium" />
          {t('race.positions')}
        </button>
      )}
      <button type="button" className={hasPlayers ? 'btn btn--primary' : 'btn btn--primary race-actions__solo'} onClick={goNext}>
        {nextLabel}
        <Icon name="play" size={18} />
      </button>
    </div>
  );

  const standings = hasPlayers && (
    <Standings
      players={players}
      races={races}
      raceIndex={raceIndex}
      totalRaces={totalRaces}
      onEditRace={setEditingRaceIndex}
      hint={t(isMobile ? 'race.tapToEdit' : 'race.clickToEdit')}
    />
  );

  const sheet = editingRaceIndex !== null && (
    <PositionsSheet
      key={editingRaceIndex}
      raceNumber={editingRaceIndex + 1}
      courseName={getCircuitName(races[editingRaceIndex], language)}
      players={players}
      initialPositions={players.map((player) => player.positions[editingRaceIndex] ?? null)}
      onCancel={closeSheet}
      onSave={(positions) => {
        onPositionsEntered(positions, editingRaceIndex);
        closeSheet();
      }}
    />
  );

  if (isMobile) {
    return (
      <div className="race">
        <div className="checker" />
        <main className="race__body">
          <div className="race__top">
            <RaceTitle raceIndex={raceIndex} totalRaces={totalRaces} />
            <LanguageToggle />
          </div>
          <RaceProgress raceIndex={raceIndex} totalRaces={totalRaces} />

          <div className={snes ? 'race-zoom race-zoom--snes' : 'race-zoom'}>
            <div className="sticker race-zoom__card">
              <MapView spot={spot} effect="glow" zoom={4} />
              <MiniMap spot={spot} className="race-zoom__mini" />
            </div>
            <h1 className="sticker race-zoom__banner">
              {snes && <SnesBadge />}
              <span className="display">{title}</span>
            </h1>
          </div>

          {snes && <SnesTrack circuit={currentRace} variant="row" />}
          {actions}
          {standings}
        </main>
        {sheet}
      </div>
    );
  }

  const zoomAspect = snes ? SIDE_CARD_WIDTH / 170 : hasPlayers ? SIDE_CARD_WIDTH / 200 : 1;

  return (
    <div className="race race--desktop">
      <div className="checker" />
      <header className="race-header">
        <RaceTitle raceIndex={raceIndex} totalRaces={totalRaces} />
        <RaceProgress raceIndex={raceIndex} totalRaces={totalRaces} />
        <div className="race-header__spacer" />
        <LanguageToggle />
      </header>
      <main className="race-desktop">
        <div className="sticker race-desktop__map">
          <MapView spot={spot} effect="spotlight" dim aspect={MAP_ASPECT} className="race-desktop__map-view">
            <MapPin spot={spot} />
          </MapView>
        </div>
        <aside className="race-desktop__side">
          <div className="race-desktop__heading">
            <span className="label">{t('race.drawn')}</span>
            {snes && <SnesBadge size="md" />}
            <h1 className={`display title-shadow-sm race-desktop__title${snes ? ' race-desktop__title--snes' : ''}`}>{title}</h1>
          </div>
          <div className="sticker race-desktop__zoom">
            <MapView spot={spot} effect="spotlight" dim zoom={4} aspect={zoomAspect} />
          </div>
          {snes && <SnesTrack circuit={currentRace} variant="card" />}
          {actions}
          {standings}
        </aside>
      </main>
      {sheet}
    </div>
  );
}

export default RaceScreen;
