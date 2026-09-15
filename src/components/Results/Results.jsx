import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/useLanguage.js';
import { getCircuitName, getCircuitShortName, getMapSpot, isSnes, RAINBOW_ROAD_ID } from '../../data/circuits.js';
import { calculateStandings, getPoints, isPerfectTie } from '../../utils/raceLogic.js';
import { buildShareText } from '../../utils/share.js';
import { useIsMobile } from '../../hooks/useIsMobile.js';
import LanguageToggle from '../LanguageToggle/LanguageToggle.jsx';
import Icon from '../ui/Icon.jsx';
import { SnesBadge, RainbowBadge, RaceBadge, PlayerDot } from '../ui/Badges.jsx';
import { SessionRouteMap } from '../Map/MapView.jsx';
import './Results.css';

const PODIUM_STEPS = [
  { rank: 2, height: 96, background: 'var(--silver)' },
  { rank: 1, height: 132, background: 'var(--yellow)' },
  { rank: 3, height: 72, background: 'var(--bronze)' },
];

function RaceName({ race }) {
  const { language } = useLanguage();
  const snes = isSnes(race);
  return (
    <span className="race-name">
      {snes && <SnesBadge />}
      <span className="race-name__text">{snes ? getCircuitShortName(race, language) : getCircuitName(race, language)}</span>
    </span>
  );
}

function RaceHeading({ race, index }) {
  return (
    <div className="race-heading">
      <RaceBadge number={index + 1} />
      <RaceName race={race} />
      {race.id === RAINBOW_ROAD_ID && <RainbowBadge size={34} radius={9} />}
    </div>
  );
}

function Podium({ standings, scale }) {
  const { t } = useLanguage();
  const steps = PODIUM_STEPS.filter((step) => standings[step.rank - 1]);
  return (
    <div className="podium">
      <div className="podium__steps" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map(({ rank, height, background }) => {
          const standing = standings[rank - 1];
          return (
            <div key={rank} className={rank === 1 ? 'podium__col podium__col--first' : 'podium__col'}>
              <span className="podium__name"><PlayerDot index={standing.index} size={12} />{standing.name}</span>
              <span className="num muted podium__points">{standing.points}{' '}{t('common.pointsShort')}</span>
              <div className="podium__step" style={{ height: Math.round(height * scale), background }}>
                <span className="display">{rank}</span>
              </div>
            </div>
          );
        })}
      </div>
      {standings.length > 1 && isPerfectTie(standings[0], standings[1]) && <p className="muted podium__tie">{t('end.tie')}</p>}
    </div>
  );
}

function FinalTable({ standings }) {
  const { t } = useLanguage();
  return (
    <div className="sticker final-table" role="table">
      <div className="label final-table__row final-table__row--head" role="row">
        <span role="columnheader">#</span>
        <span role="columnheader">{t('end.player')}</span>
        <span role="columnheader" className="final-table__num">{t('end.wins')}</span>
        <span role="columnheader" className="final-table__num">{t('end.podiums')}</span>
        <span role="columnheader" className="final-table__num">{t('end.points')}</span>
      </div>
      {standings.map((standing, rank) => (
        <div key={standing.index} className="final-table__row" role="row">
          <span role="cell" className="display num final-table__rank">{rank + 1}</span>
          <span role="cell" className="final-table__player"><PlayerDot index={standing.index} />{standing.name}</span>
          <span role="cell" className="num final-table__num">{standing.wins}</span>
          <span role="cell" className="num final-table__num">{standing.podiums}</span>
          <span role="cell" className="num final-table__num final-table__points">{standing.points}</span>
        </div>
      ))}
    </div>
  );
}

const raceResults = (players, raceIndex) =>
  players
    .map((player, index) => ({ index, name: player.name, position: player.positions[raceIndex] }))
    .filter((result) => result.position)
    .sort((a, b) => a.position - b.position);

function HistoryList({ races, players }) {
  return (
    <div className="sticker history-list">
      {races.map((race, raceIndex) => (
        <div key={raceIndex} className="history-list__item">
          <RaceHeading race={race} index={raceIndex} />
          <div className="history-list__chips">
            {raceResults(players, raceIndex).map((result) => (
              <span key={result.index} className={result.position === 1 ? 'result-chip result-chip--first' : 'result-chip'}>
                <span className="num result-chip__position">{result.position}</span>
                <span className="result-chip__name">{result.name}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryCards({ races, players }) {
  return (
    <div className="history-cards">
      {races.map((race, raceIndex) => (
        <div key={raceIndex} className="sticker history-card">
          <RaceHeading race={race} index={raceIndex} />
          <div className="history-card__results">
            {raceResults(players, raceIndex).map((result) => (
              <div key={result.index} className={result.position === 1 ? 'result-row result-row--first' : 'result-row'}>
                <span className="num result-row__position">{result.position}</span>
                <PlayerDot index={result.index} size={12} />
                <span className="result-row__name">{result.name}</span>
                <span className="num result-row__points">+{getPoints(result.position)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function PlayedList({ races }) {
  return (
    <ol className="sticker played-list">
      {races.map((race, raceIndex) => (
        <li key={raceIndex} className="played-list__item">
          <RaceHeading race={race} index={raceIndex} />
        </li>
      ))}
    </ol>
  );
}

function Results({ sessionData, onNewSession }) {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  if (!sessionData) return null;

  const { races = [], players = [] } = sessionData;
  const hasPlayers = players.length > 0;
  const standings = hasPlayers ? calculateStandings([], players) : [];
  const title = t(hasPlayers ? 'end.tournamentOver' : 'end.sessionOver');
  const summary = hasPlayers
    ? `${t('common.races', { count: races.length })} · ${t('common.players', { count: players.length })}`
    : t('common.races', { count: races.length });

  const share = async () => {
    const text = buildShareText({ races, standings, language, t });
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
      }
    } catch {
      // Share sheet dismissed or clipboard refused: nothing to report
    }
  };

  const spots = races.map(getMapSpot);

  if (isMobile) {
    return (
      <div className="results">
        <div className="checker" />
        <main className="results__body">
          <header className="results__header">
            <span className="label label--brand">{t('common.brand')}</span>
            <LanguageToggle />
          </header>
          <div className="results__heading">
            <h1 className="display title-shadow-sm results__title">{title}</h1>
            <p className="muted results__summary">{summary}</p>
          </div>
          {hasPlayers ? (
            <>
              <Podium standings={standings} scale={1} />
              <FinalTable standings={standings} />
              <h2 className="display results__section">{t('end.history')}</h2>
              <HistoryList races={races} players={players} />
            </>
          ) : (
            <>
              <section className="results__group">
                <h2 className="display results__section">{t('end.route')}</h2>
                <SessionRouteMap spots={spots} className="sticker" />
              </section>
              <section className="results__group">
                <h2 className="display results__section">{t('end.racesPlayed')}</h2>
                <PlayedList races={races} />
              </section>
            </>
          )}
        </main>
        <div className="results-bar">
          <button type="button" className="btn btn--primary results-bar__new" onClick={onNewSession}>
            {t('end.newSession')}
            <Icon name="play" size={18} />
          </button>
          <button type="button" className="btn btn--icon results-bar__share" aria-label={t(copied ? 'end.copied' : 'end.shareResults')} onClick={share}>
            <Icon name={copied ? 'check' : 'share'} size={22} />
          </button>
        </div>
      </div>
    );
  }

  const actions = (
    <div className="results-desktop__actions">
      <button type="button" className="btn btn--primary" onClick={onNewSession}>
        {t('end.newSession')}
        <Icon name="play" size={18} />
      </button>
      <button type="button" className="btn" onClick={share}>
        <Icon name={copied ? 'check' : 'share'} />
        {t(copied ? 'end.copied' : 'end.share')}
      </button>
    </div>
  );

  return (
    <div className="results">
      <div className="checker" />
      <main className="results-desktop">
        <header className="results__header">
          <span className="label label--brand results-desktop__brand">{t('common.brand')}</span>
          <LanguageToggle />
        </header>
        <div className={hasPlayers ? 'results-desktop__grid' : 'results-desktop__grid results-desktop__grid--route'}>
          <div className="results-desktop__main">
            <div className="results__heading">
              <h1 className="display title-shadow-lg results__title">{title}</h1>
              <p className="muted results__summary">{summary}</p>
            </div>
            {actions}
            {hasPlayers ? (
              <>
                <div className="results-desktop__podium"><Podium standings={standings} scale={1.3} /></div>
                <FinalTable standings={standings} />
              </>
            ) : (
              <section className="results__group">
                <h2 className="display results__section">{t('end.racesPlayed')}</h2>
                <PlayedList races={races} />
              </section>
            )}
          </div>
          <section className="results__group">
            <h2 className="display results__section">{t(hasPlayers ? 'end.history' : 'end.routeLong')}</h2>
            {hasPlayers ? <HistoryCards races={races} players={players} /> : <SessionRouteMap spots={spots} className="sticker" />}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Results;
