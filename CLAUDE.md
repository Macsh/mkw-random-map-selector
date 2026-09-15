# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Mario Kart World random course picker: a React 19 + Vite 7 PWA (plain JavaScript/JSX, vanilla CSS, no router, no state library). The whole project was originally "vibe coded" with an AI, so expect some dead code, duplicated logic and stale docs (the README says React 18 and calls the map a placeholder; both are out of date). The owner speaks French; the UI is bilingual EN/FR.

## Commands

```bash
npm run dev      # Vite dev server → http://localhost:5173/mkw-random-map-selector/
npm run build    # production build into dist/ (also generates the service worker)
npm run lint     # ESLint flat config (eslint.config.js)
npm run preview  # serve the built dist/
```

There is no test suite. Check changes with `npm run lint`, `npm run build`, and by running the app (the map is canvas-drawn, so only a visual check shows whether it's correct).

Deployment: every push to `main` triggers `.github/workflows/deploy.yml` (Node 18, `npm ci && npm run build`) and publishes to GitHub Pages. The Vite `base` and the PWA `start_url` are both hard-coded to `/mkw-random-map-selector/`.

## Architecture

### App flow
`App.jsx` holds all session state and switches on `gameState`: `'selection'` → `'racing'` → `'results'`. `SelectionScreen` calls `onStartSession({ raceCount, players, rainbowRoadLast, excludedTracks })`, `App` builds the race list up front with `generateRaceSelection()`, then `WorldMap` shows one race at a time (`currentRaceIndex`). Player finishing positions are stored twice: in `players[i].positions[raceIndex]` and in `raceResults[raceIndex].positions`. `calculateStandings()` reads from `players`.

The player-position entry modal and the positions grid live inline in `WorldMap.jsx`. There is no separate `PlayerPositions` component, even though `.github/copilot-instructions.md` mentions one.

### Course data: `src/data/circuits.js`
This file is the single source of truth for courses. Each entry has `id`, `nameEn`, `nameFr`, `x` and `y`, where `x`/`y` are **percentages of the world map image** (2674×2339). Course names are not in `translations.js`: always go through `getCircuitName(circuit, language)`. `trackThemes` maps each `id` to the color of the "Track N" badge.

The `id` values are persisted in localStorage (the excluded-tracks list), so renaming an `id` silently drops a user's saved exclusions.

### World map rendering
The map is a stack of **two same-size images** from `src/assets/` (they originally come from the Super Mario Wiki):
1. `MarioKartWorld_World_Map_Inner.webp`: the terrain.
2. `MarioKartWorld_World_Map_Stages.webp`: a transparent overlay containing the 3D miniature of each course.

A pulsing white glow is drawn **between** the two layers so it appears under the course miniature. Rainbow Road is **not** on the Stages overlay, so `MKWorld_Icon_Rainbow_Road.png` is drawn separately at hard-coded coordinates (`49.9, 70.5`, which differ slightly from its `circuits.js` entry). Any course missing from the Stages overlay needs the same special handling.

There are two canvas components with a lot of duplicated code (image loading, resizing, Rainbow Road icon). **Change both** when touching map drawing:
- `WorldMapCanvas`: the whole map. On desktop it is the main view with the course name drawn as a label. On mobile it is a mini-map with a bouncing 📍 pin. The pin/label Y offsets (`-35`, `-18`, `+50`) are pixel nudges applied on top of the percentage coordinates.
- `ZoomedMapCanvas`: mobile only. A 4× crop centered on the course, with the name shown in an HTML overlay.

Mobile vs desktop is decided in JS (`window.innerWidth <= 768` in `WorldMap.jsx`), not only through CSS. Both canvases redraw on every `requestAnimationFrame` by bumping a state counter.

### Race selection: `src/utils/raceLogic.js`
`generateRaceSelection` draws courses without replacement until the pool is empty. After that, repeats are allowed but never among the last 8 races. With `rainbowRoadLast`, Rainbow Road is removed from the pool and appended at the end. Points per position: 15/12/10/8/7/6/5/4/3/2/1, then 0.

The special id `'rainbow_road'` is hard-coded in `raceLogic.js`, `SelectionScreen.jsx` (it can't be excluded while "Rainbow Road Last" is on), and both canvases. `SelectionScreen` requires at least 3 non-excluded courses.

### Settings and i18n
- `src/utils/settings.js`: one localStorage key, `mkw-random-selector-settings`. `loadSettings()` merges the stored value over the defaults, and `updateSetting(key, value)` writes the change immediately. Player names are not persisted.
- The language context is split across three files (`languageContext.js` creates the context, `LanguageContext.jsx` is the provider, `useLanguage.js` is the hook) to satisfy the `react-refresh/only-export-components` lint rule. Keep that split.
- `translations.js` uses flat `section.key` strings, and `t(key)` falls back to the key itself. Several strings are still hard-coded in English: alerts and headings in `WorldMap.jsx`, plus "completed"/"points" in `Results.jsx`.

### Touchpoints when the course list changes
- `circuits.js`: the entry itself plus its `trackThemes` color.
- A course icon on the map: either an updated Stages overlay, or separate drawing like Rainbow Road in both canvases.
- Hard-coded course counts in `translations.js` (`selection.warning32*`, "30 unique tracks" / "29") and in `CoordinatePicker.jsx`.
- The README feature list ("all 30 tracks").

### Dead / dev-only code
- `CoordinatePicker`: a click-to-place tool used once to measure course coordinates. It is not mounted anywhere and reads a stale `track.name` field; it must be wired in temporarily to be used.
- `ResultsTest.jsx`, `isValidRaceCount`, `clearSettings`, and many unused translation keys.

### PWA
`vite-plugin-pwa` is set to `registerType: 'autoUpdate'`. Workbox precaches every js/css/html/image file, and images also use a CacheFirst runtime cache. Assets imported from `src/assets/` get hashed file names. `public/` only holds the favicon and PWA icon.

## Conventions (from `.github/copilot-instructions.md`)
Functional components and hooks only, with simple local state. Responsive design must work on both desktop and mobile. Offline-first: every asset must be bundled (no runtime fetches from external hosts). Supported race counts: 3, 4, 5, 6, 8, 12, 16, 32. Players: 0–4 (optional).
