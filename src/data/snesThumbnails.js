// Course-select thumbnails of the SNES tracks (source: Super Mario Wiki), by course id.
// Kept apart from circuits.js so the data module stays free of asset imports.
import snesMarioCircuit1 from '../assets/snes/snes_mario_circuit_1.webp';
import snesMarioCircuit2 from '../assets/snes/snes_mario_circuit_2.webp';
import snesMarioCircuit3 from '../assets/snes/snes_mario_circuit_3.webp';
import snesGhostValley1 from '../assets/snes/snes_ghost_valley_1.webp';
import snesGhostValley2 from '../assets/snes/snes_ghost_valley_2.webp';
import snesGhostValley3 from '../assets/snes/snes_ghost_valley_3.webp';
import snesChocoIsland1 from '../assets/snes/snes_choco_island_1.webp';
import snesChocoIsland2 from '../assets/snes/snes_choco_island_2.webp';
import snesVanillaLake1 from '../assets/snes/snes_vanilla_lake_1.webp';
import snesKoopaBeach1 from '../assets/snes/snes_koopa_beach_1.webp';

const thumbnails = {
  snes_mario_circuit_1: snesMarioCircuit1,
  snes_mario_circuit_2: snesMarioCircuit2,
  snes_mario_circuit_3: snesMarioCircuit3,
  snes_ghost_valley_1: snesGhostValley1,
  snes_ghost_valley_2: snesGhostValley2,
  snes_ghost_valley_3: snesGhostValley3,
  snes_choco_island_1: snesChocoIsland1,
  snes_choco_island_2: snesChocoIsland2,
  snes_vanilla_lake_1: snesVanillaLake1,
  snes_koopa_beach_1: snesKoopaBeach1,
};

export const getSnesThumbnail = (id) => thumbnails[id];
