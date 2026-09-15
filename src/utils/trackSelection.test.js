import { describe, it, expect } from 'vitest';
import { circuits, RAINBOW_ROAD_ID, getCircuitsByGroup } from '../data/circuits.js';
import {
  MIN_POOL,
  isLocked,
  drawPoolSize,
  setCourseIncluded,
  setGroupIncluded,
  groupState,
  sanitizeExcluded,
} from './trackSelection.js';

const worldIds = getCircuitsByGroup('world').map((c) => c.id);
const snesIds = getCircuitsByGroup('snes').map((c) => c.id);
const allIds = circuits.map((c) => c.id);

describe('trackSelection', () => {
  it('locks Rainbow Road only while it is set as the last race', () => {
    expect(isLocked(RAINBOW_ROAD_ID, true)).toBe(true);
    expect(isLocked(RAINBOW_ROAD_ID, false)).toBe(false);
    expect(isLocked('boo_cinema', true)).toBe(false);
  });

  it('measures the draw pool without a locked Rainbow Road', () => {
    expect(MIN_POOL).toBe(3);
    expect(drawPoolSize([], false)).toBe(40);
    expect(drawPoolSize([], true)).toBe(39);
    expect(drawPoolSize(snesIds, true)).toBe(29);
  });

  it('includes and excludes a single course', () => {
    const excluded = setCourseIncluded([], 'boo_cinema', false, false);
    expect(excluded).toEqual(['boo_cinema']);
    expect(setCourseIncluded(excluded, 'boo_cinema', true, false)).toEqual([]);
  });

  it('refuses to exclude a locked Rainbow Road', () => {
    const before = [];
    expect(setCourseIncluded(before, RAINBOW_ROAD_ID, false, true)).toBe(before);
  });

  it('refuses a change that leaves fewer than 3 courses to draw', () => {
    const keepThree = allIds.filter((id) => !['boo_cinema', 'dk_pass', 'crown_city'].includes(id));
    expect(drawPoolSize(keepThree, false)).toBe(3);
    expect(setCourseIncluded(keepThree, 'dk_pass', false, false)).toBe(keepThree);
    // with Rainbow Road last, Rainbow Road does not count toward the pool
    const keepRainbowAndTwo = allIds.filter((id) => ![RAINBOW_ROAD_ID, 'boo_cinema', 'dk_pass'].includes(id));
    expect(setGroupIncluded([], allIds, false, true)).toEqual([]);
    expect(drawPoolSize(keepRainbowAndTwo, true)).toBe(2);
  });

  it('toggles a whole block and reports its state', () => {
    const noSnes = setGroupIncluded([], snesIds, false, false);
    expect(new Set(noSnes)).toEqual(new Set(snesIds));
    expect(groupState(noSnes, snesIds, false)).toBe('off');
    expect(groupState(noSnes, worldIds, false)).toBe('on');
    const oneBack = setCourseIncluded(noSnes, 'snes_ghost_valley_1', true, false);
    expect(groupState(oneBack, snesIds, false)).toBe('mixed');
    expect(setGroupIncluded(oneBack, snesIds, true, false)).toEqual([]);
  });

  it('keeps a locked Rainbow Road when a block is cleared and ignores it in the block state', () => {
    const noWorld = setGroupIncluded([], worldIds, false, true);
    expect(noWorld).not.toContain(RAINBOW_ROAD_ID);
    expect(noWorld).toHaveLength(29);
    expect(groupState(noWorld, worldIds, true)).toBe('off');
  });

  it('refuses to clear both blocks', () => {
    const noSnes = setGroupIncluded([], snesIds, false, false);
    expect(setGroupIncluded(noSnes, worldIds, false, false)).toBe(noSnes);
  });

  it('sanitizes stored exclusions', () => {
    expect(sanitizeExcluded(['boo_cinema', 'boo_cinema', 'not_a_course'], false)).toEqual(['boo_cinema']);
    expect(sanitizeExcluded([RAINBOW_ROAD_ID, 'dk_pass'], true)).toEqual(['dk_pass']);
    expect(sanitizeExcluded(allIds, false)).toEqual([]);
    expect(sanitizeExcluded('garbage', false)).toEqual([]);
  });
});
