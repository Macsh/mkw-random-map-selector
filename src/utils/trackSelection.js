import { circuits, RAINBOW_ROAD_ID } from '../data/circuits.js';

// Minimum number of courses the random draw can pick from
export const MIN_POOL = 3;

const knownIds = new Set(circuits.map((circuit) => circuit.id));

export const isLocked = (id, rainbowRoadLast) => rainbowRoadLast && id === RAINBOW_ROAD_ID;

// Selected courses the draw can pick for regular races (a locked Rainbow Road is added at the end instead)
export const drawPoolSize = (excludedIds, rainbowRoadLast) => {
  const excluded = new Set(excludedIds);
  return circuits.filter((circuit) => !excluded.has(circuit.id) && !isLocked(circuit.id, rainbowRoadLast)).length;
};

const keepsMinimum = (excludedIds, rainbowRoadLast) => drawPoolSize(excludedIds, rainbowRoadLast) >= MIN_POOL;

export const setCourseIncluded = (excludedIds, id, included, rainbowRoadLast) => {
  if (!included && isLocked(id, rainbowRoadLast)) return excludedIds;
  const next = included ? excludedIds.filter((excludedId) => excludedId !== id) : [...new Set([...excludedIds, id])];
  return keepsMinimum(next, rainbowRoadLast) ? next : excludedIds;
};

export const setGroupIncluded = (excludedIds, groupIds, included, rainbowRoadLast) => {
  const group = new Set(groupIds);
  const next = included
    ? excludedIds.filter((id) => !group.has(id))
    : [...new Set([...excludedIds, ...groupIds.filter((id) => !isLocked(id, rainbowRoadLast))])];
  return keepsMinimum(next, rainbowRoadLast) ? next : excludedIds;
};

export const groupState = (excludedIds, groupIds, rainbowRoadLast) => {
  const toggleable = groupIds.filter((id) => !isLocked(id, rainbowRoadLast));
  const excludedCount = toggleable.filter((id) => excludedIds.includes(id)).length;
  if (excludedCount === 0) return 'on';
  return excludedCount === toggleable.length ? 'off' : 'mixed';
};

// Clean exclusions read from localStorage: unknown or duplicate ids, a locked Rainbow Road,
// or a pool below the minimum (then everything is selected again)
export const sanitizeExcluded = (excludedIds, rainbowRoadLast) => {
  if (!Array.isArray(excludedIds)) return [];
  const next = [...new Set(excludedIds)].filter((id) => knownIds.has(id) && !isLocked(id, rainbowRoadLast));
  return keepsMinimum(next, rainbowRoadLast) ? next : [];
};
