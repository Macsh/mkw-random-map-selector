export const MAP_WIDTH = 2674;
export const MAP_HEIGHT = 2339;
export const MAP_ASPECT = MAP_WIDTH / MAP_HEIGHT;

// Rainbow Road is not on the miniatures layer: its icon is drawn at this point (width in % of the map)
export const RAINBOW_ICON = { x: 49.9, y: 70.5, width: 10.8 };

export const SPOTLIGHT_DIM = 'rgba(6, 8, 28, 0.62)';

// Past this many races the session route is drawn thin and faded, so the numbered stops stay readable
export const DISCREET_ROUTE_AFTER_RACES = 8;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const round = (value) => Math.round(value * 1000) / 1000 + 0; // + 0 turns -0 into 0
const percent = (value) => `${round(value)}%`;

/**
 * Size and offset of the map stack inside a frame, zoomed `zoom` times and centred on `spot`
 * (in % of the map), clamped so the frame never shows beyond the map edges.
 * All values are % of the frame. `frameAspect` is the frame width / height.
 */
export function zoomStackStyle(spot, zoom = 1, frameAspect = MAP_ASPECT) {
  const width = zoom * 100;
  const height = (zoom * 100 * frameAspect) / MAP_ASPECT;
  const left = clamp(50 - (width * spot.x) / 100, Math.min(0, 100 - width), 0);
  const top = clamp(50 - (height * spot.y) / 100, Math.min(0, 100 - height), 0);
  return { width: percent(width), height: percent(height), left: percent(left), top: percent(top) };
}

// Mask for the dark spotlight overlay: a soft hole on each spot. Sizes are in cqw of the map stack.
export function spotlightMask(spots, inner, outer) {
  return spots
    .map((spot) => `radial-gradient(circle at ${spot.x}% ${spot.y}%, transparent ${inner}cqw, #000 ${outer}cqw)`)
    .join(', ');
}

const sameSpot = (a, b) => a.x === b.x && a.y === b.y;

// One stop per distinct map point, with the 1-based numbers of the races played there
export function groupRouteStops(spots) {
  const stops = [];
  spots.forEach((spot, index) => {
    const stop = stops.find((candidate) => sameSpot(candidate.spot, spot));
    if (stop) stop.numbers.push(index + 1);
    else stops.push({ spot, numbers: [index + 1] });
  });
  return stops;
}

const px = (value) => Math.round(value * 10) / 10;

// SVG polyline points in map pixels (viewBox 0 0 MAP_WIDTH MAP_HEIGHT), race order, no zero-length segments
export function routePolyline(spots) {
  return spots
    .filter((spot, index) => index === 0 || !sameSpot(spot, spots[index - 1]))
    .map((spot) => `${px((spot.x / 100) * MAP_WIDTH)},${px((spot.y / 100) * MAP_HEIGHT)}`)
    .join(' ');
}
