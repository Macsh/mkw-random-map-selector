import { circuits, RAINBOW_ROAD_ID } from '../data/circuits.js';

/**
 * Generates a random race selection for a session
 * @param {number} raceCount - Number of races (3, 4, 5, 6, 8, 12, 16, 32)
 * @param {boolean} rainbowRoadLast - Whether to make Rainbow Road the last race
 * @param {Array} excludedTracks - Array of track IDs to exclude from selection
 * @returns {Array} Array of selected circuits
 */
export function generateRaceSelection(raceCount, rainbowRoadLast = false, excludedTracks = []) {
  // Find Rainbow Road circuit
  const rainbowRoad = circuits.find(circuit => circuit.id === RAINBOW_ROAD_ID);

  // Filter out excluded tracks
  const availableCircuits = circuits.filter(circuit => !excludedTracks.includes(circuit.id));

  // If Rainbow Road last is enabled, we need one less regular race
  const regularRaceCount = rainbowRoadLast ? raceCount - 1 : raceCount;

  // Create pool for regular races, excluding Rainbow Road if it's set to be last
  const regularCircuitPool = rainbowRoadLast
    ? availableCircuits.filter(circuit => circuit.id !== RAINBOW_ROAD_ID)
    : [...availableCircuits];
    
  const selectedRaces = [];
  const recentRaces = []; // Track last 8 races to avoid duplicates

  // Generate regular races
  for (let i = 0; i < regularRaceCount; i++) {
    let selectedCircuit;
    
    if (regularCircuitPool.length > 0) {
      // Select from available circuits first
      const randomIndex = Math.floor(Math.random() * regularCircuitPool.length);
      selectedCircuit = regularCircuitPool.splice(randomIndex, 1)[0];
    } else {
      // All circuits used, select from circuits not in recent 8
      // When rainbowRoadLast is true, still exclude Rainbow Road from regular races
      const eligibleCircuits = availableCircuits.filter(
        circuit => !recentRaces.includes(circuit.id) &&
                  (!rainbowRoadLast || circuit.id !== RAINBOW_ROAD_ID)
      );

      if (eligibleCircuits.length === 0) {
        // Fallback: select any available circuit except Rainbow Road if it's set to be last
        const fallbackCircuits = rainbowRoadLast
          ? availableCircuits.filter(circuit => circuit.id !== RAINBOW_ROAD_ID)
          : availableCircuits;
        selectedCircuit = fallbackCircuits[Math.floor(Math.random() * fallbackCircuits.length)];
      } else {
        selectedCircuit = eligibleCircuits[Math.floor(Math.random() * eligibleCircuits.length)];
      }
    }

    selectedRaces.push(selectedCircuit);
    
    // Maintain recent races list (max 8)
    recentRaces.push(selectedCircuit.id);
    if (recentRaces.length > 8) {
      recentRaces.shift();
    }
  }

  // Add Rainbow Road as the last race if the option is enabled
  if (rainbowRoadLast && rainbowRoad) {
    selectedRaces.push(rainbowRoad);
  }

  return selectedRaces;
}

const POINTS_BY_POSITION = [0, 15, 12, 10, 8, 7, 6, 5, 4, 3, 2, 1];

/**
 * Points for a finishing position: 1st=15, 2nd=12, 3rd=10, 4th=8, ... 11th=1, then 0
 * @param {number} position
 * @returns {number}
 */
export function getPoints(position) {
  return POINTS_BY_POSITION[position] ?? 0;
}

/**
 * Calculates tournament standings from each player's positions
 * @param {Array} raceResults - kept for API compatibility (positions are read from players)
 * @param {Array} players - [{ name, positions: [position|null per race] }]
 * @returns {Array} [{ index, name, points, wins, podiums, races }] sorted by points, wins, podiums
 */
export function calculateStandings(raceResults, players) {
  const standings = players.map((player, index) => {
    const races = [];
    player.positions.forEach((position, raceIndex) => {
      if (position && position >= 1 && position <= 24) {
        races.push({ raceIndex, position, points: getPoints(position) });
      }
    });
    return {
      index,
      name: player.name,
      points: races.reduce((sum, race) => sum + race.points, 0),
      wins: races.filter((race) => race.position === 1).length,
      podiums: races.filter((race) => race.position <= 3).length,
      races,
    };
  });

  // Array.prototype.sort is stable: a perfect tie keeps player order
  return standings.sort((a, b) => b.points - a.points || b.wins - a.wins || b.podiums - a.podiums);
}

/**
 * Same points, wins and podiums: the order between the two players is arbitrary
 */
export function isPerfectTie(a, b) {
  return a.points === b.points && a.wins === b.wins && a.podiums === b.podiums;
}

/**
 * How many races must reuse a course because the draw pool is too small
 * @param {number} raceCount
 * @param {number} selectedCount - selected courses, Rainbow Road included
 * @param {boolean} rainbowRoadLast
 */
export function countRepeats(raceCount, selectedCount, rainbowRoadLast) {
  const regularRaces = rainbowRoadLast ? raceCount - 1 : raceCount;
  const pool = rainbowRoadLast ? selectedCount - 1 : selectedCount;
  return Math.max(0, regularRaces - pool);
}

/**
 * Validates race count selection
 * @param {number} count - Selected race count
 * @returns {boolean} Whether the count is valid
 */
export function isValidRaceCount(count) {
  const validCounts = [3, 4, 5, 6, 8, 12, 16, 32];
  return validCounts.includes(count);
}

/**
 * Races shown as chips in the live standings: up to 3 previous races, the current one,
 * then upcoming races while there is room (4 chips at most). Indices are inclusive.
 */
export function standingsWindow(raceIndex, totalRaces) {
  const start = Math.max(0, raceIndex - 3);
  const end = Math.min(totalRaces - 1, Math.max(raceIndex, start + 3));
  return { start, end };
}
