import { calculateStandings } from '../../utils/raceLogic.js';
import { getCircuitName } from '../../data/circuits.js';
import { useLanguage } from '../../contexts/useLanguage.js';
import LanguageToggle from '../LanguageToggle/LanguageToggle.jsx';
import './Results.css';

function Results({ sessionData, onNewSession }) {
  const { language, t } = useLanguage();
  
  if (!sessionData) {
    return (
      <div className="results">
        <div className="results-container">
          <h1>Error: No session data</h1>
          <button onClick={onNewSession}>Back to Selection</button>
        </div>
      </div>
    );
  }

  const { races = [], players = [], raceResults = [] } = sessionData;
  const standings = calculateStandings(raceResults, players);

  const getMedalEmoji = (position) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏁';
    }
  };

  const getPositionSuffix = (position) => {
    if (position % 10 === 1 && position % 100 !== 11) return 'st';
    if (position % 10 === 2 && position % 100 !== 12) return 'nd';
    if (position % 10 === 3 && position % 100 !== 13) return 'rd';
    return 'th';
  };

  return (
    <div className="results">
      <LanguageToggle />
      <div className="results-container">
        <div className="results-header">
          <h1>🏆 {t('results.tournamentComplete')}</h1>
          <p>{races.length} {t('selection.races')} completed</p>
        </div>

        {players.length > 0 && (
          <div className="standings-section">
            <h2>{t('results.finalStandings')}</h2>
            <div className="standings-list">
              {standings.map((player, index) => (
                <div key={player.name} className={`standing-item position-${index + 1}`}>
                  <div className="standing-rank">
                    <span className="medal">{getMedalEmoji(index + 1)}</span>
                    <span className="position">{index + 1}{getPositionSuffix(index + 1)}</span>
                  </div>
                  <div className="standing-info">
                    <h3 className="player-name">{player.name}</h3>
                    <p className="points">{player.points} points</p>
                  </div>
                  <div className="race-summary">
                    <div className="wins">
                      🏆 {player.races.filter(r => r.position === 1).length} {t('results.wins')}
                    </div>
                    <div className="podiums">
                      🥇 {player.races.filter(r => r.position <= 3).length} {t('results.podiums')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="race-history">
          <h2>{t('results.raceHistory')}</h2>
          <div className="race-list">
            {races.map((race, index) => (
              <div key={race.id} className="race-item">
                <div className="race-number">
                  <span>{t('worldMap.race')} {index + 1}</span>
                </div>
                <div className="race-info">
                  <h3 className="race-name">{getCircuitName(race, language)}</h3>
                </div>
                {players.length > 0 && raceResults[index] && raceResults[index].positions && (
                  <div className="race-results">
                    <h4>{t('results.results')}</h4>
                    <ol className="position-list">
                      {raceResults[index].positions.map((position, playerIndex) => {
                        const player = players[playerIndex];
                        return position && player ? (
                          <li key={playerIndex} className="position-item">
                            <span className="position-medal">{getMedalEmoji(position)}</span>
                            {player.name}: {position}{getPositionSuffix(position)}
                          </li>
                        ) : null;
                      })}
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="action-section">
          <button className="new-session-button" onClick={onNewSession}>
            🏁 {t('results.newSession')}
          </button>
          
          <div className="sharing-options">
            <p>{t('results.shareResults')}</p>
            <button 
              className="share-button"
              onClick={() => {
                const text = `Mario Kart World Session Complete!\n${races.length} races\n${players.length > 0 ? `Winner: ${standings[0]?.name} (${standings[0]?.points} points)` : ''}`;
                if (navigator.share) {
                  navigator.share({ text });
                } else {
                  navigator.clipboard.writeText(text);
                  alert('Results copied to clipboard!');
                }
              }}
            >
              📱 {t('results.shareButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
