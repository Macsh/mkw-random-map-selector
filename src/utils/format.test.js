import { describe, it, expect } from 'vitest';
import { interpolate, formatOrdinal, sortByName, raceNumberRows, longestWordLength } from './format.js';

describe('interpolate', () => {
  it('replaces known placeholders and keeps unknown ones', () => {
    expect(interpolate('Race {current} / {total}', { current: 3, total: 4 })).toBe('Race 3 / 4');
    expect(interpolate('Hi {name} {other}', { name: 'Alex' })).toBe('Hi Alex {other}');
    expect(interpolate('No vars')).toBe('No vars');
  });
});

describe('formatOrdinal', () => {
  it('formats English ordinals', () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 24].map((n) => formatOrdinal(n, 'en').suffix))
      .toEqual(['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'st', 'nd', 'rd', 'th']);
    expect(formatOrdinal(7, 'en')).toEqual({ value: '7', suffix: 'th' });
  });

  it('formats French ordinals', () => {
    expect(formatOrdinal(1, 'fr')).toEqual({ value: '1', suffix: 'er' });
    expect(formatOrdinal(2, 'fr')).toEqual({ value: '2', suffix: 'e' });
    expect(formatOrdinal(21, 'fr')).toEqual({ value: '21', suffix: 'e' });
  });
});

describe('sortByName', () => {
  const list = [
    { nameEn: 'Peach Stadium', nameFr: 'Stade Peach' },
    { nameEn: 'Desert Hills', nameFr: 'Désert du soleil' },
    { nameEn: 'Boo Cinema', nameFr: 'Cinéma Boo' },
  ];

  it('sorts by the name in the given language without mutating the input', () => {
    expect(sortByName(list, 'fr').map((c) => c.nameFr)).toEqual(['Cinéma Boo', 'Désert du soleil', 'Stade Peach']);
    expect(sortByName(list, 'en').map((c) => c.nameEn)).toEqual(['Boo Cinema', 'Desert Hills', 'Peach Stadium']);
    expect(list[0].nameEn).toBe('Peach Stadium');
  });
});

describe('raceNumberRows', () => {
  it('keeps every race number, three per row', () => {
    expect(raceNumberRows([3])).toEqual(['3']);
    expect(raceNumberRows([2, 5, 9])).toEqual(['2·5·9']);
    expect(raceNumberRows([10, 13, 15, 20])).toEqual(['10·13·15', '20']);
    expect(raceNumberRows([1, 2, 3, 4, 5, 6, 7])).toEqual(['1·2·3', '4·5·6', '7']);
  });

  it('accepts another row length and an empty list', () => {
    expect(raceNumberRows([1, 2, 3, 4], 2)).toEqual(['1·2', '3·4']);
    expect(raceNumberRows([])).toEqual([]);
  });
});

describe('longestWordLength', () => {
  it('counts the characters of the longest word', () => {
    expect(longestWordLength('Whistlestop Summit')).toBe(11);
    expect(longestWordLength('Pic de l’observatoire')).toBe(14);
    expect(longestWordLength('  Crown   City ')).toBe(5);
    expect(longestWordLength('Trophéopolis')).toBe(12);
  });

  it('counts accented and astral characters once', () => {
    expect(longestWordLength('Île Choco 1')).toBe(5);
    expect(longestWordLength('Désert du soleil')).toBe(6);
    expect(longestWordLength('\u{1D538}\u{1D539} go')).toBe(2);
  });

  it('keeps words joined by a no-break space together, since the line cannot break there', () => {
    expect(longestWordLength('Tournoi terminé\u{A0}!')).toBe(9);
    expect(longestWordLength('Pas\u{202F}encore')).toBe(10);
    expect(longestWordLength('Tournament over!')).toBe(10);
  });

  it('returns 0 for an empty text', () => {
    expect(longestWordLength('')).toBe(0);
    expect(longestWordLength('   ')).toBe(0);
  });
});
