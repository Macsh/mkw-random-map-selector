import { useLanguage } from '../../contexts/useLanguage.js';
import { COURSE_GROUPS, getCircuitsByGroup, getCircuitName, getParentCircuit } from '../../data/circuits.js';
import { sortByName } from '../../utils/format.js';
import { groupState, isLocked, setCourseIncluded, setGroupIncluded } from '../../utils/trackSelection.js';
import Icon from '../ui/Icon.jsx';

const GROUP_COPY = {
  world: { title: 'home.groupWorld', hint: 'home.groupWorldHint' },
  snes: { title: 'home.groupSnes', hint: 'home.groupSnesHint' },
};

const CHECK_ICONS = { on: 'check', mixed: 'dash', locked: 'lock' };

function Checkbox({ state }) {
  const icon = CHECK_ICONS[state];
  return (
    <span className={state === 'off' ? 'check' : `check check--${state}`} aria-hidden="true">
      {icon && <Icon name={icon} size={state === 'locked' ? 14 : 16} />}
    </span>
  );
}

// Two blocks (world, SNES): the block checkbox selects or clears the whole block,
// each tile toggles one course. Rules (minimum pool, locked Rainbow Road) live in trackSelection.js.
function TrackBlocks({ excludedTracks, rainbowRoadLast, onChange }) {
  const { t, language } = useLanguage();

  return (
    <div className="track-blocks">
      {COURSE_GROUPS.map((group) => {
        const courses = sortByName(getCircuitsByGroup(group), language);
        const ids = courses.map((course) => course.id);
        const state = groupState(excludedTracks, ids, rainbowRoadLast);
        const selectedCount = ids.filter((id) => !excludedTracks.includes(id)).length;

        return (
          <section key={group} className="track-block">
            <button
              type="button"
              role="checkbox"
              aria-checked={state === 'mixed' ? 'mixed' : state === 'on'}
              className="track-block__header"
              onClick={() => onChange(setGroupIncluded(excludedTracks, ids, state !== 'on', rainbowRoadLast))}
            >
              <Checkbox state={state} />
              <span className="track-block__titles">
                <span className="display track-block__title">{t(GROUP_COPY[group].title)}</span>
                <span className="muted track-block__hint">{t(GROUP_COPY[group].hint)}</span>
              </span>
              <span className="track-block__count num">{selectedCount}/{ids.length}</span>
            </button>

            <div className="track-block__grid">
              {courses.map((course) => {
                const locked = isLocked(course.id, rainbowRoadLast);
                const included = !excludedTracks.includes(course.id);
                const subtitle = locked
                  ? t('home.alwaysLast')
                  : course.parentId
                    ? t('home.fromCourse', { course: getCircuitName(getParentCircuit(course), language) })
                    : null;

                return (
                  <button
                    key={course.id}
                    type="button"
                    role="checkbox"
                    aria-checked={included}
                    aria-disabled={locked || undefined}
                    className={included ? 'tile' : 'tile tile--off'}
                    onClick={() => {
                      if (!locked) onChange(setCourseIncluded(excludedTracks, course.id, !included, rainbowRoadLast));
                    }}
                  >
                    <Checkbox state={locked ? 'locked' : included ? 'on' : 'off'} />
                    <span className="tile__text">
                      <span className="tile__name">{getCircuitName(course, language)}</span>
                      {subtitle && <span className="tile__sub muted">{subtitle}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
      <p className="muted track-blocks__help">{t('home.coursesHelp')}</p>
    </div>
  );
}

export default TrackBlocks;
