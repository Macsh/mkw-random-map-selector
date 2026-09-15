import { describe, it, expect } from 'vitest';
import { translations } from '../contexts/translations.js';
import { circuits } from '../data/circuits.js';
import { interpolate } from './format.js';
import { buildShareText } from './share.js';

const makeT = (language) => (key, vars) => {
  const table = translations[language];
  const plural = vars && typeof vars.count === 'number' ? table[`${key}_${vars.count === 1 ? 'one' : 'other'}`] : undefined;
  return interpolate(plural ?? table[key], vars);
};
const byId = (id) => circuits.find((c) => c.id === id);
const races = [byId('koopa_troopa_beach'), byId('snes_ghost_valley_1')];

describe('buildShareText', () => {
  it('lists the courses without players', () => {
    expect(buildShareText({ races, standings: [], language: 'en', t: makeT('en') })).toBe(
      'Mario Kart World session: 2 races\n\n1. Koopa Troopa Beach\n2. SNES Ghost Valley 1',
    );
  });

  it('adds the winner with players, in French', () => {
    const standings = [{ name: 'Alex', points: 27 }];
    expect(buildShareText({ races, standings, language: 'fr', t: makeT('fr') })).toBe(
      'Session Mario Kart World : 2 courses\nVainqueur : Alex (27 pts)\n\n1. Plage Koopa\n2. SNES Vallée fantôme 1',
    );
  });
});
