import { describe, it, expect } from 'vitest';
import {
  circuits,
  RAINBOW_ROAD_ID,
  COURSE_GROUPS,
  getCircuitName,
  getCircuitShortName,
  getCircuitById,
  getParentCircuit,
  getMapSpot,
  getCircuitsByGroup,
  isSnes,
  isSubCourse,
} from './circuits.js';
import { getSubCourseThumbnail } from './subCourseThumbnails.js';

describe('circuits data', () => {
  it('has 30 world courses, 10 SNES courses and 8 remixed courses', () => {
    expect(circuits).toHaveLength(48);
    expect(getCircuitsByGroup('world')).toHaveLength(30);
    expect(getCircuitsByGroup('snes')).toHaveLength(10);
    expect(getCircuitsByGroup('remix')).toHaveLength(8);
    expect(COURSE_GROUPS).toEqual(['world', 'snes', 'remix']);
  });

  it('uses unique ids', () => {
    const ids = circuits.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every course an English and a French name', () => {
    for (const c of circuits) {
      expect(c.nameEn, c.id).toMatch(/\S/);
      expect(c.nameFr, c.id).toMatch(/\S/);
    }
  });

  it('places every world course inside the map', () => {
    for (const c of getCircuitsByGroup('world')) {
      expect(c.x, c.id).toBeGreaterThan(0);
      expect(c.x, c.id).toBeLessThan(100);
      expect(c.y, c.id).toBeGreaterThan(0);
      expect(c.y, c.id).toBeLessThan(100);
    }
  });

  it('links every SNES course to an existing world parent and gives it no own point', () => {
    for (const c of getCircuitsByGroup('snes')) {
      const parent = getCircuitById(c.parentId);
      expect(parent, c.id).toBeDefined();
      expect(parent.group).toBe('world');
      expect(c.x).toBeUndefined();
      expect(c.y).toBeUndefined();
      expect(c.nameEn.startsWith('SNES ')).toBe(true);
      expect(c.nameFr.startsWith('SNES ')).toBe(true);
    }
  });

  it('names every remixed course after its world parent, plus " 2"', () => {
    for (const c of getCircuitsByGroup('remix')) {
      const parent = getCircuitById(c.parentId);
      expect(parent, c.id).toBeDefined();
      expect(parent.group).toBe('world');
      expect(c.x).toBeUndefined();
      expect(c.y).toBeUndefined();
      expect(c.id).toBe(`${parent.id}_2`);
      expect(c.nameEn).toBe(`${parent.nameEn} 2`);
      expect(c.nameFr).toBe(`${parent.nameFr} 2`);
    }
  });

  it('has a thumbnail for every sub-course', () => {
    for (const c of circuits.filter(isSubCourse)) {
      expect(getSubCourseThumbnail(c.id), c.id).toBeTruthy();
    }
  });

  it('keeps the historical ids used by saved settings', () => {
    expect(getCircuitById(RAINBOW_ROAD_ID)).toBeDefined();
    expect(getCircuitById('warios_galleon').nameEn).toBe('Wario Shipyard');
    expect(getCircuitById('warios_galleon').nameFr).toBe('Galion de Wario');
    expect(getCircuitById('starview_peak').nameFr).toBe("Pic de l’observatoire");
  });
});

describe('circuit helpers', () => {
  const ghostValley = getCircuitById('snes_ghost_valley_1');
  const booCinema = getCircuitById('boo_cinema');

  it('returns names by language', () => {
    expect(getCircuitName(booCinema, 'en')).toBe('Boo Cinema');
    expect(getCircuitName(booCinema, 'fr')).toBe('Cinéma Boo');
    expect(getCircuitName(booCinema)).toBe('Boo Cinema');
  });

  it('strips the SNES prefix for short names only', () => {
    expect(getCircuitShortName(ghostValley, 'fr')).toBe('Vallée fantôme 1');
    expect(getCircuitShortName(ghostValley, 'en')).toBe('Ghost Valley 1');
    expect(getCircuitShortName(booCinema, 'fr')).toBe('Cinéma Boo');
  });

  it('resolves the parent and the map point of a SNES course', () => {
    expect(isSnes(ghostValley)).toBe(true);
    expect(isSnes(booCinema)).toBe(false);
    expect(isSubCourse(ghostValley)).toBe(true);
    expect(isSubCourse(getCircuitById('wario_stadium_2'))).toBe(true);
    expect(isSnes(getCircuitById('wario_stadium_2'))).toBe(false);
    expect(isSubCourse(booCinema)).toBe(false);
    expect(getParentCircuit(ghostValley)).toBe(booCinema);
    expect(getParentCircuit(booCinema)).toBe(booCinema);
    expect(getMapSpot(ghostValley)).toEqual({ x: booCinema.x, y: booCinema.y });
    expect(getMapSpot(booCinema)).toEqual({ x: 63.43, y: 17.44 });
  });

  it('keeps the full name of a remixed course as its short name', () => {
    expect(getCircuitShortName(getCircuitById('shy_guy_bazaar_2'), 'fr')).toBe('Souk Maskass 2');
  });
});
