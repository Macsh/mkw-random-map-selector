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
} from './circuits.js';

describe('circuits data', () => {
  it('has 30 world courses and 10 SNES courses', () => {
    expect(circuits).toHaveLength(40);
    expect(getCircuitsByGroup('world')).toHaveLength(30);
    expect(getCircuitsByGroup('snes')).toHaveLength(10);
    expect(COURSE_GROUPS).toEqual(['world', 'snes']);
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
    expect(getParentCircuit(ghostValley)).toBe(booCinema);
    expect(getParentCircuit(booCinema)).toBe(booCinema);
    expect(getMapSpot(ghostValley)).toEqual({ x: booCinema.x, y: booCinema.y });
    expect(getMapSpot(booCinema)).toEqual({ x: 63.43, y: 17.44 });
  });
});
