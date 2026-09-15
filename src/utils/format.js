import { getCircuitName } from '../data/circuits.js';

export const interpolate = (template, vars = {}) =>
  template.replace(/\{(\w+)\}/g, (match, name) => (vars[name] === undefined ? match : String(vars[name])));

const EN_SUFFIXES = { one: 'st', two: 'nd', few: 'rd', other: 'th' };
const enOrdinalRules = new Intl.PluralRules('en', { type: 'ordinal' });

export const formatOrdinal = (n, language) => {
  const suffix = language === 'fr' ? (n === 1 ? 'er' : 'e') : EN_SUFFIXES[enOrdinalRules.select(n)];
  return { value: String(n), suffix };
};

export const sortByName = (circuits, language) =>
  [...circuits].sort((a, b) => getCircuitName(a, language).localeCompare(getCircuitName(b, language), language));

// Every race number of one route stop, `perRow` per row: [10, 13, 15, 20] → ['10·13·15', '20']
export const raceNumberRows = (numbers, perRow = 3) =>
  Array.from({ length: Math.ceil(numbers.length / perRow) }, (_, row) =>
    numbers.slice(row * perRow, (row + 1) * perRow).join('·'));

// Breaking whitespace only: a no-break space (U+00A0, U+202F) keeps its neighbours on one line
const BREAKING_SPACE = /[^\S\u{A0}\u{202F}]+/u;

// Characters in the longest unbreakable word, used to size display titles so that word fits
export const longestWordLength = (text) =>
  Math.max(0, ...text.split(BREAKING_SPACE).map((word) => [...word].length));
