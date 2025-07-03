// Mario Kart World Circuit Data
// Coordinates will be updated when positioned on the actual world map

export const circuits = [
  { id: 'acorn_heights', nameEn: 'Acorn Heights', nameFr: 'Chemin du chêne', x: 50, y: 14.2 },
  { id: 'airship_fortress', nameEn: 'Airship Fortress', nameFr: 'Bateau volant', x: 14.8, y: 33.5 },
  { id: 'boo_cinema', nameEn: 'Boo Cinema', nameFr: 'Cinéma Boo', x: 63.6, y: 21.1 },
  { id: 'bowsers_castle', nameEn: "Bowser's Castle", nameFr: 'Château de Bowser', x: 27, y: 21.2 },
  { id: 'cheep_cheep_falls', nameEn: 'Cheep Cheep Falls', nameFr: 'Chutes Cheep Cheep', x: 62.9, y: 53.7 },
  { id: 'choco_mountain', nameEn: 'Choco Mountain', nameFr: 'Montagne Choco', x: 38, y: 54 },
  { id: 'crown_city', nameEn: 'Crown City', nameFr: 'Trophéopolis', x: 38, y: 73.2 },
  { id: 'dandelion_depths', nameEn: 'Dandelion Depths', nameFr: 'Gouffre Pissenlit', x: 61.9, y: 39.7 },
  { id: 'desert_hills', nameEn: 'Desert Hills', nameFr: 'Désert du soleil', x: 12, y: 72.5 },
  { id: 'dino_dino_jungle', nameEn: 'Dino Dino Jungle', nameFr: 'Jungle Dino Dino', x: 65, y: 89 },
  { id: 'dk_pass', nameEn: 'DK Pass', nameFr: 'Alpes DK', x: 73.5, y: 45.9 },
  { id: 'dk_spaceport', nameEn: 'DK Spaceport', nameFr: 'Spatioport DK', x: 39.4, y: 86.2 },
  { id: 'dry_bones_burnout', nameEn: 'Dry Bones Burnout', nameFr: 'Fournaise ossesseuse', x: 38.5, y: 19.5 },
  { id: 'faraway_oasis', nameEn: 'Faraway Oasis', nameFr: 'Savane sauvage', x: 60.9, y: 70.8 },
  { id: 'great_question_block_ruins', nameEn: 'Great ? Block Ruins', nameFr: 'Bloc ? antique', x: 76.8, y: 83.5 },
  { id: 'koopa_troopa_beach', nameEn: 'Koopa Troopa Beach', nameFr: 'Plage Koopa', x: 50, y: 82.7 },
  { id: 'mario_bros_circuit', nameEn: 'Mario Bros. Circuit', nameFr: 'Circuit Mario Bros.', x: 23.3, y: 61.0 },
  { id: 'mario_circuit', nameEn: 'Mario Circuit', nameFr: 'Circuit Mario', x: 50.6, y: 28.8 },
  { id: 'moo_moo_meadows', nameEn: 'Moo Moo Meadows', nameFr: 'Prairie Meuh Meuh', x: 50, y: 45.1 },
  { id: 'peach_beach', nameEn: 'Peach Beach', nameFr: 'Plage Peach', x: 85.4, y: 71.5 },
  { id: 'peach_stadium', nameEn: 'Peach Stadium', nameFr: 'Stade Peach', x: 50, y: 60.5 },
  { id: 'rainbow_road', nameEn: 'Rainbow Road', nameFr: 'Route Arc-en-ciel', x: 50.6, y: 71.4 },
  { id: 'salty_salty_speedway', nameEn: 'Salty Salty Speedway', nameFr: 'Cité Fleur-de-sel', x: 74, y: 63.7 },
  { id: 'shy_guy_bazaar', nameEn: 'Shy Guy Bazaar', nameFr: 'Souk Maskass', x: 13, y: 52.9 },
  { id: 'sky_high_sundae', nameEn: 'Sky-High Sundae', nameFr: 'Cité Sorbet', x: 85, y: 37.6 },
  { id: 'starview_peak', nameEn: 'Starview Peak', nameFr: "Pic de l'observatoire", x: 73.7, y: 27.3 },
  { id: 'toads_factory', nameEn: "Toad's Factory", nameFr: 'Usine Toad', x: 39, y: 37.7 },
  { id: 'wario_stadium', nameEn: 'Wario Stadium', nameFr: 'Stade Wario', x: 26.1, y: 44.4 },
  { id: 'warios_galleon', nameEn: "Wario's Galleon", nameFr: 'Galion de Wario', x: 86, y: 56.7 },
  { id: 'whistlestop_summit', nameEn: 'Whistlestop Summit', nameFr: 'Mont Tchou Tchou', x: 24.3, y: 81.8 }
];

// Helper function to get circuit name in the current language
export const getCircuitName = (circuit, language = 'en') => {
  return language === 'fr' ? circuit.nameFr : circuit.nameEn;
};

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
