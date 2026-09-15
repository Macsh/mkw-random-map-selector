# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Mario Kart World random course picker: a React 19 + Vite 7 PWA (plain JavaScript/JSX, vanilla CSS, no router, no state library). The whole project was originally "vibe coded" with an AI, so expect some dead code and duplicated logic. The owner speaks French; the UI is bilingual EN/FR.

## Commands

Node 22.12+ is required (Vite 7 and Vitest 5; see `engines` in `package.json`).

```bash
npm run dev      # Vite dev server → http://localhost:5173/mkw-random-map-selector/
npm run build    # production build into dist/ (also generates the service worker)
npm run lint     # ESLint flat config (eslint.config.js)
npm run preview  # serve the built dist/
npm test         # runs Vitest once (vitest run)
npx vitest run src/utils/raceLogic.test.js -t "Rainbow Road"  # run a single test
```

CI: every pull request runs `.github/workflows/ci.yml` (Node 22, `npm ci`, lint, test, build, no deploy). Every push to `main` triggers `.github/workflows/deploy.yml` (same checks) and publishes to GitHub Pages. The Vite `base` and the PWA `start_url` are both hard-coded to `/mkw-random-map-selector/`.

## Data compatibility

Players' saved settings must keep working after an update. Never change the localStorage key `mkw-random-selector-settings` or an existing course `id`: saved exclusions store course ids. Rename a course through `nameEn`/`nameFr` only (for example `warios_galleon` keeps its id although its English name is now Wario Shipyard).

## Architecture

### Data: `src/data/circuits.js`
40 courses: 30 world courses plus 10 SNES courses (update 1.8.0). World courses have `x`/`y` at the centre of their miniature on the world map image (2674×2339, in %). SNES courses instead have a `parentId` and no point of their own; every map consumer gets a point via `getMapSpot(circuit)`, which returns the parent's. `getCircuitName(circuit, language)` reads `nameEn`/`nameFr`; `getCircuitShortName` strips the leading `SNES ` and is used next to an `SnesBadge`. `snesThumbnails.js` holds the SNES course-select thumbnails, kept apart so `circuits.js` stays asset-free.

### Selection rules: `src/utils/trackSelection.js`
Pure, tested helpers around the draw pool (selected courses minus a locked Rainbow Road): `MIN_POOL = 3` is enforced on every toggle (single course or whole block), a locked Rainbow Road can't be excluded, block state is `'on' | 'off' | 'mixed'`, and `sanitizeExcluded` runs on load to drop unknown ids, un-exclude a locked Rainbow Road, and reset if the pool would fall below the minimum. The draw itself (`generateRaceSelection` in `raceLogic.js`) uses every course once, then avoids the last 8 races, or the last `pool - 1` for a smaller pool, so a course never comes twice in a row.

### Map: `src/components/Map/MapView.jsx`
`MapView` is a single component reused everywhere: the home screen's desktop map card, the race screen (compact: a zoomed `MapView` plus a `MiniMap` with a red dot; desktop: a spotlighted `MapView` with a red `MapPin`, plus a separate zoomed spotlight card), and the results screen's route recap (`SessionRouteMap`, both compact and desktop, when no position was entered). Layers, bottom to top: terrain image, glow (when present), miniatures image + Rainbow Road icon, spotlight dark overlay (when present, above the miniatures), then children (pins, route). Zoom uses `zoomStackStyle` from `mapGeometry.js`: a real enlarged box (`zoom × 100%`) positioned with clamped `left`/`top` so the frame never shows past the map edges — no CSS `scale`. The stack is a `container-type: inline-size` container, so effect sizes (glow, spotlight mask) are in `cqw` and stay in map units regardless of zoom.

### Layout
The compact (phone and tablet) layouts apply at ≤1100px wide: `useIsMobile()` matches `(max-width: 1100px)`, and the positions sheet's desktop media query in `RaceScreen.css` is `(min-width: 1101px)`; keep the two in sync. Compact screen bodies are centred at 560px. Display titles use the `.fit-title` primitive (`src/index.css`): `--title-chars` comes from `longestWordLength(text)` and the font size is capped so the longest word fits its `container-type: inline-size` parent.

### Screens
- `SelectionScreen` (+ `TrackBlocks`): home, with course blocks and select-all.
- `RaceScreen` (+ `Standings`, `PositionsSheet`): compact uses a `glow` effect and a `MiniMap` with a red dot; desktop uses a dark `spotlight` with a red `MapPin`, plus a separate zoomed spotlight card. Standings and the positions sheet only render when there are players. The standings show chips for the last 3 races and the current one; the sheet's previous/next buttons reach any race played so far, saving valid entries before moving. While the sheet is open the screen behind it is `inert`, and focus returns to the control that opened it. SNES courses get an `SnesBadge` and a "pick from {course}" hint.
- `Results`: shows a podium/table/history once at least one position was entered, otherwise a route recap (`SessionRouteMap`).

### i18n
`t(key, vars)` from `useLanguage()`. Plurals use `key_one`/`key_other` selected by `vars.count`. French copy uses U+00A0 before `!`/`?`/`:` and the typographic apostrophe. Translation keys live in namespaces `common`, `home`, `race`, `sheet`, `end` inside `src/contexts/translations.js`. An unknown stored language falls back to English.

### Theme
Design tokens on `:root` in `src/index.css`; dark mode overrides them under `@media (prefers-color-scheme: dark)`, no toggle. Type is Archivo Variable, self-hosted via `@fontsource-variable/archivo` (imported in `main.jsx`), with only the latin `wdth` woff2 files precached by Workbox (`**/archivo-latin-wdth-*.woff2` in `vite.config.js`).

### Touchpoints when the course list changes
- `circuits.js` (the entry itself) and, for a SNES course, `snesThumbnails.js`.
- The course-count assertion in `circuits.test.js` (`toHaveLength(40)`).
- The literal counts in `src/utils/trackSelection.test.js`: `drawPoolSize` 40 / 39 / 29, and the 29 exclusions when the world block is cleared with Rainbow Road locked.
- The SNES assertion in `src/utils/raceLogic.test.js` (32 unique picks among 30 world + 10 SNES courses need at least 2 SNES courses).
- The README feature list ("40 courses").

### Dead code
`CoordinatePicker` (`src/components/CoordinatePicker/`) is not mounted anywhere and is stale; it was a one-off tool used to measure course coordinates.

## Conventions
Functional components and hooks only, with simple local state. Responsive design must work on both compact and desktop layouts. Offline-first: every asset must be bundled (no runtime fetches from external hosts). Supported race counts: 3, 4, 5, 6, 8, 12, 16, 32. Players: 0–4 (optional). `.github/copilot-instructions.md` holds a short copy of these facts for Copilot; keep it in sync.
