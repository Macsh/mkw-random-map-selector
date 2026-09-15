import { describe, it, expect } from 'vitest';
import {
  MAP_ASPECT,
  zoomStackStyle,
  spotlightMask,
  groupRouteStops,
  routePolyline,
} from './mapGeometry.js';

describe('zoomStackStyle', () => {
  it('fills the frame at zoom 1', () => {
    expect(zoomStackStyle({ x: 30, y: 70 }, 1)).toEqual({ width: '100%', height: '100%', left: '0%', top: '0%' });
  });

  it('centres the spot at zoom 4 in a frame with the map aspect', () => {
    expect(zoomStackStyle({ x: 50, y: 50 }, 4)).toEqual({ width: '400%', height: '400%', left: '-150%', top: '-150%' });
  });

  it('never shows beyond the map edges', () => {
    // Acorn Heights is near the top of the map
    expect(zoomStackStyle({ x: 49.74, y: 11.33 }, 4).top).toBe('0%');
    // a spot at the far right is clamped to the last frame width
    expect(zoomStackStyle({ x: 99, y: 50 }, 4).left).toBe('-300%');
  });

  it('keeps map proportions in a square frame', () => {
    const style = zoomStackStyle({ x: 50.04, y: 57.37 }, 4, 1);
    expect(style.width).toBe('400%');
    expect(parseFloat(style.height)).toBeCloseTo(400 / MAP_ASPECT, 2);
    expect(parseFloat(style.top)).toBeCloseTo(50 - (400 / MAP_ASPECT) * 0.5737, 2);
  });
});

describe('spotlightMask', () => {
  it('builds one soft hole per spot in container units', () => {
    expect(spotlightMask([{ x: 50, y: 57.37 }], 5, 13)).toBe(
      'radial-gradient(circle at 50% 57.37%, transparent 5cqw, #000 13cqw)',
    );
    expect(spotlightMask([{ x: 1, y: 2 }, { x: 3, y: 4 }], 4, 10.5).split('), radial').length).toBe(2);
  });
});

describe('route helpers', () => {
  const booCinema = { x: 63.43, y: 17.44 };
  const dkPass = { x: 73.11, y: 43.18 };

  it('groups races that land on the same map point', () => {
    expect(groupRouteStops([booCinema, dkPass, booCinema])).toEqual([
      { spot: booCinema, numbers: [1, 3] },
      { spot: dkPass, numbers: [2] },
    ]);
  });

  it('draws the route in map pixels and skips zero-length segments', () => {
    expect(routePolyline([booCinema, booCinema, dkPass])).toBe('1696.1,407.9 1955,1010');
  });
});
