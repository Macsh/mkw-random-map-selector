// Course-select thumbnails of the sub-courses (SNES courses from update 1.8.0, remixed
// courses from update 1.9.0; source: Super Mario Wiki), by course id.
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
import airshipFortress2 from '../assets/remix/airship_fortress_2.webp';
import desertHills2 from '../assets/remix/desert_hills_2.webp';
import saltySaltySpeedway2 from '../assets/remix/salty_salty_speedway_2.webp';
import dkPass2 from '../assets/remix/dk_pass_2.webp';
import koopaTroopaBeach2 from '../assets/remix/koopa_troopa_beach_2.webp';
import shyGuyBazaar2 from '../assets/remix/shy_guy_bazaar_2.webp';
import marioBrosCircuit2 from '../assets/remix/mario_bros_circuit_2.webp';
import warioStadium2 from '../assets/remix/wario_stadium_2.webp';

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
  airship_fortress_2: airshipFortress2,
  desert_hills_2: desertHills2,
  salty_salty_speedway_2: saltySaltySpeedway2,
  dk_pass_2: dkPass2,
  koopa_troopa_beach_2: koopaTroopaBeach2,
  shy_guy_bazaar_2: shyGuyBazaar2,
  mario_bros_circuit_2: marioBrosCircuit2,
  wario_stadium_2: warioStadium2,
};

export const getSubCourseThumbnail = (id) => thumbnails[id];
