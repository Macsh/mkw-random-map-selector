import { circuits } from '../data/circuits.js';

/**
 * Generates a random race selection for a session
 * @param {number} raceCount - Number of races (3, 4, 5, 6, 8, 12, 16, 32)
 * @param {boolean} rainbowRoadLast - Whether to make Rainbow Road the last race
 * @param {Array} excludedTracks - Array of track IDs to exclude from selection
 * @returns {Array} Array of selected circuits
 */
export function generateRaceSelection(raceCount, rainbowRoadLast = false, excludedTracks = []) {
  // Find Rainbow Road circuit
  const rainbowRoad = circuits.find(circuit => circuit.id === 'rainbow_road');
  
  // Filter out excluded tracks
  const availableCircuits = circuits.filter(circuit => !excludedTracks.includes(circuit.id));
  
  // If Rainbow Road last is enabled, we need one less regular race
  const regularRaceCount = rainbowRoadLast ? raceCount - 1 : raceCount;
  
  // Create pool for regular races, excluding Rainbow Road if it's set to be last
  const regularCircuitPool = rainbowRoadLast 
    ? availableCircuits.filter(circuit => circuit.id !== 'rainbow_road')
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
                  (!rainbowRoadLast || circuit.id !== 'rainbow_road')
      );
      
      if (eligibleCircuits.length === 0) {
        // Fallback: select any available circuit except Rainbow Road if it's set to be last
        const fallbackCircuits = rainbowRoadLast 
          ? availableCircuits.filter(circuit => circuit.id !== 'rainbow_road')
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

/**
 * Calculates tournament standings based on race results
 * @param {Array} raceResults - Array of race results with player positions
 * @param {Array} players - Array of player names
 * @returns {Array} Sorted standings with points
 */
export function calculateStandings(raceResults, players) {
  const standings = players.map(player => ({
    name: player.name,
    points: 0,
    races: []
  }));

  // Points system based on Mario Kart: 1st=15, 2nd=12, 3rd=10, 4th=8, etc.
  const getPoints = (position) => {
    if (position === 1) return 15;
    if (position === 2) return 12;
    if (position === 3) return 10;
    if (position === 4) return 8;
    if (position === 5) return 7;
    if (position === 6) return 6;
    if (position === 7) return 5;
    if (position === 8) return 4;
    if (position === 9) return 3;
    if (position === 10) return 2;
    if (position === 11) return 1;
    return 0; // 12th place and below get 0 points
  };

  // Calculate points for each player based on their race positions
  players.forEach((player, playerIndex) => {
    const playerStanding = standings[playerIndex];
    
    player.positions.forEach((position, raceIndex) => {
      if (position && position >= 1 && position <= 24) {
        const points = getPoints(position);
        playerStanding.points += points;
        playerStanding.races.push({
          raceIndex,
          position: position,
          points
        });
      }
    });
  });

  // Sort by points (descending), then by best finishes
  return standings.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // Tiebreaker: count wins, then podiums
    const aWins = a.races.filter(r => r.position === 1).length;
    const bWins = b.races.filter(r => r.position === 1).length;
    if (bWins !== aWins) {
      return bWins - aWins;
    }
    // Secondary tiebreaker: podiums
    const aPodiums = a.races.filter(r => r.position <= 3).length;
    const bPodiums = b.races.filter(r => r.position <= 3).length;
    return bPodiums - aPodiums;
  });
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
