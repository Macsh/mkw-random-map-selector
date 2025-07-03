import { calculateStandings } from '../../utils/raceLogic.js';
import { trackThemes } from '../../data/circuits.js';
import './Results.css';

function Results({ sessionData, onNewSession }) {
  const { races, players, raceResults } = sessionData;
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
      <div className="results-container">
        <div className="results-header">
          <h1>🏆 Session Complete!</h1>
          <p>{races.length} races completed</p>
        </div>

        {players.length > 0 && (
          <div className="standings-section">
            <h2>Final Standings</h2>
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
                      🏆 {player.races.filter(r => r.position === 1).length} wins
                    </div>
                    <div className="podiums">
                      🥇 {player.races.filter(r => r.position <= 3).length} podiums
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="race-history">
          <h2>Race History</h2>
          <div className="race-list">
            {races.map((race, index) => (
              <div key={race.id} className="race-item">
                <div className="race-number">
                  <span>Race {index + 1}</span>
                </div>
                <div className="race-info">
                  <h3 className="race-name">{race.name}</h3>
                  <span 
                    className="race-theme"
                    style={{ backgroundColor: trackThemes[race.id] }}
                  >
                    Track {index + 1}
                  </span>
                </div>
                {players.length > 0 && raceResults[index] && raceResults[index].positions && (
                  <div className="race-results">
                    <h4>Results:</h4>
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

        <div className="session-stats">
          <h2>Session Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{races.length}</span>
              <span className="stat-label">Races</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{new Set(races.map(r => r.name.split(' ')[0])).size}</span>
              <span className="stat-label">Unique Themes</span>
            </div>
            {players.length > 0 && (
              <div className="stat-item">
                <span className="stat-number">{players.length}</span>
                <span className="stat-label">Players</span>
              </div>
            )}
            <div className="stat-item">
              <span className="stat-number">{races.length}</span>
              <span className="stat-label">Total Tracks</span>
            </div>
          </div>
        </div>

        <div className="action-section">
          <button className="new-session-button" onClick={onNewSession}>
            🏁 Start New Session
          </button>
          
          <div className="sharing-options">
            <p>Share your results:</p>
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
              📱 Share Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
