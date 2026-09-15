# Mario Kart World Random Map Selector - Copilot Instructions

## Project Overview
A Progressive Web App (PWA) that randomly picks Mario Kart World courses for a session, with optional player standings. React 19 + Vite 7, plain JavaScript/JSX and vanilla CSS. The UI is bilingual EN/FR and follows the system light/dark theme (no toggle).

## Key Facts
- 40 courses in `src/data/circuits.js`: 30 world courses + 10 SNES courses (update 1.8.0). SNES courses have a `parentId` and use its map point through `getMapSpot`.
- 3, 4, 5, 6, 8, 12, 16 or 32 races, an optional "Rainbow Road last", and at least 3 courses always selected.
- 0–4 players (optional). Without players: a route recap. With players: live standings, a positions sheet and a podium.
- Compact (phone/tablet) layouts up to 1100px wide (`useIsMobile`), desktop layouts above.
- Offline-first: every asset is bundled, no runtime request to an external host.
- Course ids and the localStorage key `mkw-random-selector-settings` never change.

## Component Structure
- `SelectionScreen` (+ `TrackBlocks`): home screen with race count, course blocks and players
- `RaceScreen` (+ `Standings`, `PositionsSheet`): one race at a time on the map, live standings, positions entry
- `Results`: podium, final table and history with players, or the session route without
- `Map` (`MapView`, `MapPin`, `MiniMap`, `SessionRouteMap`): the layered world map used everywhere
- `utils/`: `raceLogic` (draw, points, standings), `trackSelection` (pool rules), `mapGeometry`, `format`, `share`, `settings`

## Development Guidelines
- Function components and hooks only, simple local state (no router, no state library)
- Every user-visible string goes through `t(key, vars)` with both `en` and `fr`; French copy uses a no-break space before `!`, `?`, `:` and the ’ apostrophe
- Design tokens live in `src/index.css`; no emoji, icons come from `components/ui/Icon.jsx`
- Hit targets are at least 44px; keep `npm run lint` and `npm test` green
