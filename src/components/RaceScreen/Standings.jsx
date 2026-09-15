import { useLanguage } from '../../contexts/useLanguage.js';
import { getCircuitName } from '../../data/circuits.js';
import { calculateStandings, standingsWindow } from '../../utils/raceLogic.js';
import { PlayerDot } from '../ui/Badges.jsx';

// Live standings with a chip per recent race; played and current chips open the positions sheet
function Standings({ players, races, raceIndex, totalRaces, onEditRace, hint }) {
  const { t, language } = useLanguage();
  const standings = calculateStandings([], players);
  const { start, end } = standingsWindow(raceIndex, totalRaces);
  const chipIndices = Array.from({ length: end - start + 1 }, (_, offset) => start + offset);

  return (
    <section className="sticker standings">
      <div className="standings__head">
        <h2 className="display standings__title">{t('race.standings')}</h2>
        {raceIndex > 0 && <span className="label standings__after">{t('race.afterRaces', { count: raceIndex })}</span>}
      </div>
      <ol className="standings__list">
        {standings.map((standing, rank) => (
          <li key={standing.index} className="standings__row">
            <span className="display num standings__rank">{rank + 1}</span>
            <span className="standings__player">
              <PlayerDot index={standing.index} />
              <span className="standings__name">{standing.name}</span>
            </span>
            <span className="standings__chips">
              {chipIndices.map((index) => {
                if (index > raceIndex) {
                  return <span key={index} className="chip chip--later" aria-hidden="true">–</span>;
                }
                const position = players[standing.index].positions[index];
                return (
                  <button
                    key={index}
                    type="button"
                    className={index === raceIndex ? 'chip chip--now' : 'chip'}
                    aria-label={t('race.editResult', {
                      player: standing.name,
                      number: index + 1,
                      course: getCircuitName(races[index], language),
                      position: position || '?',
                    })}
                    onClick={() => onEditRace(index)}
                  >
                    {position || '?'}
                  </button>
                );
              })}
            </span>
            <span className="num standings__points">
              {standing.points}
              <span className="standings__pts">{' '}{t('common.pointsShort')}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="muted standings__hint">{hint}</p>
    </section>
  );
}

export default Standings;
