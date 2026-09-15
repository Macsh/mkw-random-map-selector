import { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/useLanguage.js';
import { formatOrdinal } from '../../utils/format.js';
import Icon from '../ui/Icon.jsx';
import { PlayerDot } from '../ui/Badges.jsx';

const MAX_POSITION = 24;

// Bottom sheet (centred dialog on desktop). Positions are optional; duplicates block saving.
function PositionsSheet({ raceNumber, courseName, players, initialPositions, onCancel, onSave }) {
  const { t, language } = useLanguage();
  const [values, setValues] = useState(() => initialPositions.map((position) => (position ? String(position) : '')));

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  const numbers = values.map((value) => (value === '' ? null : Number(value)));
  const entered = numbers.filter((number) => number !== null);
  const invalid = entered.some((number) => !Number.isInteger(number) || number < 1 || number > MAX_POSITION);
  const duplicate = new Set(entered).size !== entered.length;

  const setValue = (index, value) => {
    setValues((previous) => previous.map((current, i) => (i === index ? value : current)));
  };

  const step = (index, delta) => {
    const current = numbers[index];
    let next = current === null ? (delta > 0 ? 1 : null) : current + delta;
    if (next !== null && next < 1) next = null;
    if (next !== null && next > MAX_POSITION) next = MAX_POSITION;
    setValue(index, next === null ? '' : String(next));
  };

  return (
    <div className="sheet-backdrop" onClick={onCancel}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="positions-sheet-title" onClick={(event) => event.stopPropagation()}>
        <div className="sheet__grabber" aria-hidden="true" />
        <div className="sheet__head">
          <span className="label">{t('sheet.subtitle', { number: raceNumber, course: courseName })}</span>
          <h2 id="positions-sheet-title" className="display sheet__title">{t('sheet.title')}</h2>
        </div>

        <ul className="sheet__rows">
          {players.map((player, index) => {
            const number = numbers[index];
            const ordinal = number && !invalid ? formatOrdinal(number, language) : null;
            return (
              <li key={index} className="sheet__row">
                <PlayerDot index={index} size={16} />
                <span className="sheet__name">{player.name}</span>
                <div className="stepper">
                  <button
                    type="button"
                    className="stepper__btn"
                    aria-label={t('sheet.decrease', { player: player.name })}
                    disabled={number === null}
                    onClick={() => step(index, -1)}
                  >
                    <Icon name="minus" />
                  </button>
                  <label className={number === 1 ? 'stepper__value is-first' : 'stepper__value'}>
                    <input
                      className="display num"
                      type="number"
                      inputMode="numeric"
                      min="1"
                      max={MAX_POSITION}
                      placeholder="–"
                      value={values[index]}
                      aria-label={t('sheet.positionOf', { player: player.name })}
                      onChange={(event) => setValue(index, event.target.value)}
                    />
                    {ordinal && <span className="stepper__suffix" aria-hidden="true">{ordinal.suffix}</span>}
                  </label>
                  <button
                    type="button"
                    className="stepper__btn"
                    aria-label={t('sheet.increase', { player: player.name })}
                    disabled={number === MAX_POSITION}
                    onClick={() => step(index, 1)}
                  >
                    <Icon name="plus" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {duplicate && <p className="sheet__error" role="alert">{t('sheet.duplicate')}</p>}

        <div className="sheet__actions">
          <button type="button" className="btn" onClick={onCancel}>{t('sheet.cancel')}</button>
          <button type="button" className="btn btn--primary" disabled={duplicate || invalid} onClick={() => onSave(numbers)}>
            {t('sheet.save')}
            <Icon name="check" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PositionsSheet;
