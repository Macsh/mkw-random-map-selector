// Mario Kart World course data.
// World courses: x/y = centre of the course miniature on the world map, in % of the
// 2674×2339 map images (measured on MarioKartWorld_World_Map_Stages.webp).
// Rainbow Road is not on the miniatures layer: its point is where its icon is drawn.
// SNES courses (update 1.8.0) are picked from an existing course and have no point of
// their own: use getMapSpot(). French SNES names are unofficial for now.

export const RAINBOW_ROAD_ID = 'rainbow_road';
export const COURSE_GROUPS = ['world', 'snes'];

export const circuits = [
  { id: 'acorn_heights', group: 'world', nameEn: 'Acorn Heights', nameFr: 'Chemin du chêne', x: 49.74, y: 11.33 },
  { id: 'airship_fortress', group: 'world', nameEn: 'Airship Fortress', nameFr: 'Bateau volant', x: 14.88, y: 32.15 },
  { id: 'boo_cinema', group: 'world', nameEn: 'Boo Cinema', nameFr: 'Cinéma Boo', x: 63.43, y: 17.44 },
  { id: 'bowsers_castle', group: 'world', nameEn: "Bowser's Castle", nameFr: 'Château de Bowser', x: 26.96, y: 18.64 },
  { id: 'cheep_cheep_falls', group: 'world', nameEn: 'Cheep Cheep Falls', nameFr: 'Chutes Cheep Cheep', x: 62.79, y: 51.86 },
  { id: 'choco_mountain', group: 'world', nameEn: 'Choco Mountain', nameFr: 'Montagne Choco', x: 37.81, y: 51.47 },
  { id: 'crown_city', group: 'world', nameEn: 'Crown City', nameFr: 'Trophéopolis', x: 37.88, y: 70.29 },
  { id: 'dandelion_depths', group: 'world', nameEn: 'Dandelion Depths', nameFr: 'Gouffre Pissenlit', x: 61.97, y: 36.81 },
  { id: 'desert_hills', group: 'world', nameEn: 'Desert Hills', nameFr: 'Désert du soleil', x: 12.3, y: 69.56 },
  { id: 'dino_dino_jungle', group: 'world', nameEn: 'Dino Dino Jungle', nameFr: 'Jungle Dino Dino', x: 64.66, y: 86.15 },
  { id: 'dk_pass', group: 'world', nameEn: 'DK Pass', nameFr: 'Alpes DK', x: 73.11, y: 43.18 },
  { id: 'dk_spaceport', group: 'world', nameEn: 'DK Spaceport', nameFr: 'Spatioport DK', x: 39.34, y: 83.8 },
  { id: 'dry_bones_burnout', group: 'world', nameEn: 'Dry Bones Burnout', nameFr: 'Fournaise osseuse', x: 38.15, y: 18.08 },
  { id: 'faraway_oasis', group: 'world', nameEn: 'Faraway Oasis', nameFr: 'Savane sauvage', x: 60.81, y: 68.62 },
  { id: 'great_question_block_ruins', group: 'world', nameEn: 'Great ? Block Ruins', nameFr: 'Bloc ? antique', x: 76.93, y: 80.5 },
  { id: 'koopa_troopa_beach', group: 'world', nameEn: 'Koopa Troopa Beach', nameFr: 'Plage Koopa', x: 49.89, y: 79.56 },
  { id: 'mario_bros_circuit', group: 'world', nameEn: 'Mario Bros. Circuit', nameFr: 'Circuit Mario Bros.', x: 23.19, y: 59.43 },
  { id: 'mario_circuit', group: 'world', nameEn: 'Mario Circuit', nameFr: 'Circuit Mario', x: 50.45, y: 27.58 },
  { id: 'moo_moo_meadows', group: 'world', nameEn: 'Moo Moo Meadows', nameFr: 'Prairie Meuh Meuh', x: 49.96, y: 41.98 },
  { id: 'peach_beach', group: 'world', nameEn: 'Peach Beach', nameFr: 'Plage Peach', x: 85.04, y: 68.75 },
  { id: 'peach_stadium', group: 'world', nameEn: 'Peach Stadium', nameFr: 'Stade Peach', x: 50.04, y: 57.37 },
  { id: 'rainbow_road', group: 'world', nameEn: 'Rainbow Road', nameFr: 'Route Arc-en-ciel', x: 49.9, y: 70.5 },
  { id: 'salty_salty_speedway', group: 'world', nameEn: 'Salty Salty Speedway', nameFr: 'Cité Fleur-de-sel', x: 74.2, y: 60.62 },
  { id: 'shy_guy_bazaar', group: 'world', nameEn: 'Shy Guy Bazaar', nameFr: 'Souk Maskass', x: 13.09, y: 50.06 },
  { id: 'sky_high_sundae', group: 'world', nameEn: 'Sky-High Sundae', nameFr: 'Cité Sorbet', x: 84.78, y: 34.8 },
  { id: 'starview_peak', group: 'world', nameEn: 'Starview Peak', nameFr: "Pic de ’observatoire", x: 73.6, y: 23.9 },
  { id: 'toads_factory', group: 'world', nameEn: "Toad's Factory", nameFr: 'Usine Toad', x: 39.01, y: 35.06 },
  { id: 'wario_stadium', group: 'world', nameEn: 'Wario Stadium', nameFr: 'Stade Wario', x: 26.25, y: 43.05 },
  { id: 'warios_galleon', group: 'world', nameEn: 'Wario Shipyard', nameFr: 'Galion de Wario', x: 85.79, y: 54.04 },
  { id: 'whistlestop_summit', group: 'world', nameEn: 'Whistlestop Summit', nameFr: 'Mont Tchou Tchou', x: 23.86, y: 79.52 },

  { id: 'snes_mario_circuit_1', group: 'snes', parentId: 'mario_circuit', nameEn: 'SNES Mario Circuit 1', nameFr: 'SNES Circuit Mario 1' },
  { id: 'snes_mario_circuit_2', group: 'snes', parentId: 'mario_circuit', nameEn: 'SNES Mario Circuit 2', nameFr: 'SNES Circuit Mario 2' },
  { id: 'snes_mario_circuit_3', group: 'snes', parentId: 'mario_circuit', nameEn: 'SNES Mario Circuit 3', nameFr: 'SNES Circuit Mario 3' },
  { id: 'snes_ghost_valley_1', group: 'snes', parentId: 'boo_cinema', nameEn: 'SNES Ghost Valley 1', nameFr: 'SNES Vallée fantôme 1' },
  { id: 'snes_ghost_valley_2', group: 'snes', parentId: 'boo_cinema', nameEn: 'SNES Ghost Valley 2', nameFr: 'SNES Vallée fantôme 2' },
  { id: 'snes_ghost_valley_3', group: 'snes', parentId: 'boo_cinema', nameEn: 'SNES Ghost Valley 3', nameFr: 'SNES Vallée fantôme 3' },
  { id: 'snes_choco_island_1', group: 'snes', parentId: 'choco_mountain', nameEn: 'SNES Choco Island 1', nameFr: 'SNES Île Choco 1' },
  { id: 'snes_choco_island_2', group: 'snes', parentId: 'choco_mountain', nameEn: 'SNES Choco Island 2', nameFr: 'SNES Île Choco 2' },
  { id: 'snes_vanilla_lake_1', group: 'snes', parentId: 'sky_high_sundae', nameEn: 'SNES Vanilla Lake 1', nameFr: 'SNES Lac Vanille 1' },
  { id: 'snes_koopa_beach_1', group: 'snes', parentId: 'koopa_troopa_beach', nameEn: 'SNES Koopa Beach 1', nameFr: 'SNES Plage Koopa 1' },
];

const circuitsById = Object.fromEntries(circuits.map((circuit) => [circuit.id, circuit]));

export const getCircuitById = (id) => circuitsById[id];

export const getCircuitName = (circuit, language = 'en') => (language === 'fr' ? circuit.nameFr : circuit.nameEn);

// For places where an SNES badge is already shown next to the name
export const getCircuitShortName = (circuit, language = 'en') => getCircuitName(circuit, language).replace(/^SNES /, '');

export const isSnes = (circuit) => circuit.group === 'snes';

export const getParentCircuit = (circuit) => (circuit.parentId ? circuitsById[circuit.parentId] : circuit);

export const getMapSpot = (circuit) => {
  const { x, y } = getParentCircuit(circuit);
  return { x, y };
};

export const getCircuitsByGroup = (group) => circuits.filter((circuit) => circuit.group === group);

// Since Mario Kart World doesn't use traditional cups for VS mode,
// we'll use themed colors for visual variety
export const trackThemes = {
  'acorn_heights': '#8B4513',        // Brown (forest)
  'airship_fortress': '#708090',     // Gray (metal)
  'boo_cinema': '#4B0082',          // Purple (spooky)
  'bowsers_castle': '#8B0000',      // Dark red (fire)
  'cheep_cheep_falls': '#00CED1',   // Turquoise (water)
  'choco_mountain': '#D2691E',      // Chocolate brown
  'crown_city': '#FFD700',          // Gold (royal)
  'dandelion_depths': '#FFFF00',    // Yellow (flowers)
  'desert_hills': '#F4A460',        // Sandy brown
  'dino_dino_jungle': '#228B22',    // Forest green
  'dk_pass': '#2F4F4F',            // Dark slate gray (mountain)
  'dk_spaceport': '#191970',        // Midnight blue (space)
  'dry_bones_burnout': '#BC8F8F',   // Rosy brown (bone)
  'faraway_oasis': '#40E0D0',       // Turquoise (oasis)
  'great_question_block_ruins': '#FFA500', // Orange (? block)
  'koopa_troopa_beach': '#87CEEB',  // Sky blue (beach)
  'mario_bros_circuit': '#FF0000',  // Red (Mario)
  'mario_circuit': '#FF0000',       // Red (Mario)
  'moo_moo_meadows': '#90EE90',     // Light green (grass)
  'peach_beach': '#FFB6C1',         // Light pink (Peach)
  'peach_stadium': '#FF69B4',       // Hot pink (Peach)
  'rainbow_road': '#9932CC',        // Purple (rainbow)
  'salty_salty_speedway': '#1E90FF', // Dodger blue (salt/ocean)
  'shy_guy_bazaar': '#DDA0DD',      // Plum (bazaar)
  'sky_high_sundae': '#FFE4E1',     // Misty rose (ice cream)
  'starview_peak': '#4169E1',       // Royal blue (mountain peak)
  'toads_factory': '#696969',       // Dim gray (industrial)
  'wario_stadium': '#DAA520',       // Goldenrod (Wario)
  'warios_galleon': '#8B4513',      // Saddle brown (ship)
  'whistlestop_summit': '#B0C4DE'   // Light steel blue (summit)
};
