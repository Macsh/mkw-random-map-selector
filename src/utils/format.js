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

export const formatRaceNumbers = (numbers) =>
  numbers.length <= 3 ? numbers.join('·') : `${numbers.slice(0, 2).join('·')}…`;
