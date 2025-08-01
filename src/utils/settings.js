// Settings utility for managing user preferences in localStorage

const SETTINGS_KEY = 'mkw-random-selector-settings';

// Default settings
const defaultSettings = {
  language: 'en',
  raceCount: 8,
  rainbowRoadLast: false,
  showPlayerOptions: false,
  showTrackOptions: false,
  excludedTracks: []
};

/**
 * Load settings from localStorage
 * @returns {Object} Settings object with all user preferences
 */
export const loadSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all keys exist
      return { ...defaultSettings, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
  }
  return defaultSettings;
};

/**
 * Save settings to localStorage
 * @param {Object} settings - Settings object to save
 */
export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error);
  }
};

/**
 * Update specific setting and save to localStorage
 * @param {string} key - Setting key to update
 * @param {any} value - New value for the setting
 */
export const updateSetting = (key, value) => {
  const currentSettings = loadSettings();
  const newSettings = { ...currentSettings, [key]: value };
  saveSettings(newSettings);
  return newSettings;
};

/**
 * Clear all settings from localStorage
 */
export const clearSettings = () => {
  try {
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.warn('Failed to clear settings from localStorage:', error);
  }
};
