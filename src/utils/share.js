import { getCircuitName } from '../data/circuits.js';

// Plain-text summary for navigator.share / clipboard, in the current language
export function buildShareText({ races, standings, language, t }) {
  const lines = [t('end.shareHeader', { count: races.length })];
  if (standings.length > 0) {
    lines.push(t('end.shareWinner', { name: standings[0].name, points: standings[0].points }));
  }
  lines.push('', ...races.map((race, index) => `${index + 1}. ${getCircuitName(race, language)}`));
  return lines.join('\n');
}
