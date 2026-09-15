import { describe, it, expect } from 'vitest';
import { translations } from './translations.js';

const NEW_NAMESPACES = /^(common|home|race|sheet|end)\./;
const newKeys = (language) => Object.keys(translations[language]).filter((key) => NEW_NAMESPACES.test(key)).sort();

describe('translations', () => {
  it('defines the same new keys in English and French', () => {
    expect(newKeys('en').length).toBeGreaterThan(50);
    expect(newKeys('fr')).toEqual(newKeys('en'));
  });

  it('uses French typography in the new French copy', () => {
    for (const key of newKeys('fr')) {
      const value = translations.fr[key];
      expect(value, key).not.toMatch(/ [!?:]/); // needs a no-break space U+00A0 before ! ? :
      expect(value, key).not.toMatch(/'/); // typographic apostrophe ’ only
    }
  });

  it('pairs plural keys', () => {
    for (const key of newKeys('en').filter((k) => k.endsWith('_one'))) {
      expect(translations.en[key.replace(/_one$/, '_other')], key).toBeDefined();
    }
  });

  it('has no legacy keys left', () => {
    for (const language of ['en', 'fr']) {
      expect(Object.keys(translations[language]).filter((key) => !NEW_NAMESPACES.test(key))).toEqual([]);
    }
  });
});
