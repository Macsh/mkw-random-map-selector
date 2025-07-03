# Mario Kart World Random Map Selector - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Progressive Web App (PWA) for Mario Kart World that randomly selects race circuits for multiplayer sessions.

## Key Features
- Random race selection with no-repeat logic for sessions
- Support for 3, 4, 5, 6, 8, 12, 16, or 32 races per session
- Player nickname management (1-4 players)
- Interactive world map display (desktop: full map, mobile: zoomed + mini-map)
- Tournament tracking with player positions after each race
- Session recap with complete results
- Offline functionality via PWA

## Technical Stack
- React with Vite
- PWA with service workers for offline capability
- Responsive design for desktop and mobile
- Image map coordinates for interactive Mario Kart World map

## Component Structure
- `SelectionScreen`: Race count selection and player options
- `WorldMap`: Interactive map display with circuit highlighting
- `PlayerPositions`: Input player positions after each race
- `Results`: Tournament recap and session summary
- `utils/raceLogic`: Random selection and no-repeat algorithms

## Development Guidelines
- Use modern React patterns (hooks, functional components)
- Implement responsive design with CSS media queries
- Maintain offline-first approach for PWA functionality
- Use semantic HTML and accessibility best practices
- Keep state management simple with React hooks
