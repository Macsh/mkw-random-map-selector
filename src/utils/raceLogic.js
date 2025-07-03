import { circuits } from '../data/circuits.js';

/**
 * Generates a random race selection for a session
 * @param {number} raceCount - Number of races (3, 4, 5, 6, 8, 12, 16, 32)
 * @returns {Array} Array of selected circuits
 */
export function generateRaceSelection(raceCount) {
  const availableCircuits = [...circuits];
  const selectedRaces = [];
  const recentRaces = []; // Track last 8 races to avoid duplicates

  for (let i = 0; i < raceCount; i++) {
    let selectedCircuit;
    
    if (availableCircuits.length > 0) {
      // Select from available circuits first
      const randomIndex = Math.floor(Math.random() * availableCircuits.length);
      selectedCircuit = availableCircuits.splice(randomIndex, 1)[0];
    } else {
      // All circuits used, select from circuits not in recent 8
      const eligibleCircuits = circuits.filter(
        circuit => !recentRaces.includes(circuit.id)
      );
      
      if (eligibleCircuits.length === 0) {
        // Fallback: select any circuit
        selectedCircuit = circuits[Math.floor(Math.random() * circuits.length)];
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
