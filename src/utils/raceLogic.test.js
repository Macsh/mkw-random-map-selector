import { describe, it, expect } from 'vitest';
import { circuits, RAINBOW_ROAD_ID } from '../data/circuits.js';
import {
  generateRaceSelection,
  getPoints,
  calculateStandings,
  countRepeats,
  isPerfectTie,
  standingsWindow,
} from './raceLogic.js';

const ids = (races) => races.map((r) => r.id);
const allIds = circuits.map((c) => c.id);

describe('generateRaceSelection', () => {
  it('returns the requested number of races', () => {
    expect(generateRaceSelection(8)).toHaveLength(8);
  });

  it('never repeats a course while the pool lasts, SNES courses included', () => {
    const races = ids(generateRaceSelection(32));
    expect(new Set(races).size).toBe(32);
    // 32 unique picks among 30 world + 10 SNES courses need at least 2 SNES courses
    expect(races.filter((id) => id.startsWith('snes_')).length).toBeGreaterThanOrEqual(2);
  });

  it('puts Rainbow Road last and nowhere else when requested', () => {
    for (let run = 0; run < 20; run++) {
      const races = ids(generateRaceSelection(32, true));
      expect(races).toHaveLength(32);
      expect(races[31]).toBe(RAINBOW_ROAD_ID);
      expect(races.slice(0, 31)).not.toContain(RAINBOW_ROAD_ID);
      expect(new Set(races).size).toBe(32);
    }
  });

  it('never picks an excluded course', () => {
    const excluded = allIds.filter((id) => id.startsWith('snes_'));
    for (let run = 0; run < 20; run++) {
      const races = ids(generateRaceSelection(16, false, excluded));
      expect(races.some((id) => excluded.includes(id))).toBe(false);
    }
  });

  it('does not repeat a course within 8 races once the pool is used up (pool of 12)', () => {
    const kept = allIds.slice(0, 12);
    const excluded = allIds.filter((id) => !kept.includes(id));
    for (let run = 0; run < 20; run++) {
      const races = ids(generateRaceSelection(32, false, excluded));
      races.forEach((id, i) => {
        expect(races.slice(Math.max(0, i - 8), i)).not.toContain(id);
      });
    }
  });

  it('never draws the same course twice in a row once a small pool is used up (pool of 3)', () => {
    const kept = allIds.slice(0, 3);
    const noBackToBack = (races) => races.slice(1).forEach((id, i) => expect(id).not.toBe(races[i]));
    for (let run = 0; run < 20; run++) {
      const races = ids(generateRaceSelection(12, false, allIds.filter((id) => !kept.includes(id))));
      expect(races).toHaveLength(12);
      noBackToBack(races);

      // with Rainbow Road last, the pool of 3 is the regular courses only
      const withRainbow = ids(generateRaceSelection(12, true, allIds.filter((id) => ![...kept, RAINBOW_ROAD_ID].includes(id))));
      expect(withRainbow).toHaveLength(12);
      expect(withRainbow.slice(0, 11).every((id) => kept.includes(id))).toBe(true);
      noBackToBack(withRainbow);
    }
  });

  it('keeps the order random once a small pool is used up (pool of 4, 16 races)', () => {
    const kept = allIds.slice(0, 4);
    const excluded = allIds.filter((id) => !kept.includes(id));
    // A fixed order would replay the same 4-race cycle for the whole session
    const cycleOrders = (races) => new Set([0, 4, 8, 12].map((start) => races.slice(start, start + 4).join()));
    const draws = Array.from({ length: 20 }, () => ids(generateRaceSelection(16, false, excluded)));
    draws.forEach((races) => expect(races.every((id) => kept.includes(id))).toBe(true));
    expect(draws.some((races) => cycleOrders(races).size >= 2)).toBe(true);
  });

  it('still returns a full session from a pool of 3', () => {
    const kept = allIds.slice(0, 3);
    const excluded = allIds.filter((id) => !kept.includes(id));
    const races = ids(generateRaceSelection(8, false, excluded));
    expect(races).toHaveLength(8);
    expect(races.every((id) => kept.includes(id))).toBe(true);
  });
});

describe('points and standings', () => {
  it('awards Mario Kart style points', () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24].map(getPoints)).toEqual([15, 12, 10, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0]);
  });

  const players = [
    { name: 'Alex', positions: [1, 2, 1, 3] },
    { name: 'Julie', positions: [3, 1, 2, 1] },
    { name: 'Tom', positions: [2, 4, 6, 2] },
    { name: 'Sarah', positions: [5, 3, 4, 7] },
  ];

  it('ranks by points, then wins, then podiums, keeping player order on a perfect tie', () => {
    const standings = calculateStandings([], players);
    expect(standings.map((s) => [s.index, s.name, s.points, s.wins, s.podiums])).toEqual([
      [0, 'Alex', 52, 2, 4],
      [1, 'Julie', 52, 2, 4],
      [2, 'Tom', 38, 0, 2],
      [3, 'Sarah', 30, 0, 1],
    ]);
    expect(standings[0].races[0]).toEqual({ raceIndex: 0, position: 1, points: 15 });
  });

  it('ignores races without a position', () => {
    const standings = calculateStandings([], [{ name: 'Solo', positions: [null, 4, undefined] }]);
    expect(standings[0].points).toBe(8);
    expect(standings[0].races).toHaveLength(1);
  });

  it('detects a perfect tie', () => {
    const [alex, julie, tom] = calculateStandings([], players);
    expect(isPerfectTie(alex, julie)).toBe(true);
    expect(isPerfectTie(julie, tom)).toBe(false);
  });
});

describe('countRepeats', () => {
  it('counts the races that must reuse a course', () => {
    expect(countRepeats(32, 40, true)).toBe(0);
    expect(countRepeats(4, 40, false)).toBe(0);
    expect(countRepeats(32, 30, false)).toBe(2);
    expect(countRepeats(8, 5, true)).toBe(3);
  });
});

describe('standingsWindow', () => {
  it('shows up to 3 previous races, the current one, and upcoming races to fill 4 chips', () => {
    expect(standingsWindow(0, 4)).toEqual({ start: 0, end: 3 });
    expect(standingsWindow(2, 4)).toEqual({ start: 0, end: 3 });
    expect(standingsWindow(10, 32)).toEqual({ start: 7, end: 10 });
    expect(standingsWindow(0, 3)).toEqual({ start: 0, end: 2 });
    expect(standingsWindow(31, 32)).toEqual({ start: 28, end: 31 });
  });
});
