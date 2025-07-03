import { useState } from 'react';
import SelectionScreen from './components/SelectionScreen/SelectionScreen.jsx';
import WorldMap from './components/WorldMap/WorldMap.jsx';
import Results from './components/Results/Results.jsx';
import { generateRaceSelection } from './utils/raceLogic.js';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('selection'); // 'selection', 'racing', 'results'
  const [sessionData, setSessionData] = useState({
    races: [],
    players: [],
    raceResults: [],
    currentRaceIndex: 0
  });

  const handleStartSession = ({ raceCount, players }) => {
    const selectedRaces = generateRaceSelection(raceCount);
    const newSessionData = {
      races: selectedRaces,
      players: players.map(name => ({
        name,
        positions: [] // Array to track position in each race
      })),
      raceResults: new Array(raceCount).fill(null).map(() => ({ positions: [] })),
      currentRaceIndex: 0
    };
    
    setSessionData(newSessionData);
    setGameState('racing');
  };

  const handlePositionsEntered = (positions, targetRaceIndex = null) => {
    setSessionData(prev => {
      // Use targetRaceIndex if provided (for editing previous races), otherwise current race
      const raceIndex = targetRaceIndex !== null ? targetRaceIndex : prev.currentRaceIndex;
      
      const newPlayers = prev.players.map((player, index) => {
        const newPlayerPositions = [...player.positions];
        // Ensure the positions array is long enough
        while (newPlayerPositions.length <= raceIndex) {
          newPlayerPositions.push(null);
        }
        // Replace or set position for the target race
        newPlayerPositions[raceIndex] = positions[index] || null;
        
        return {
          ...player,
          positions: newPlayerPositions
        };
      });

      const newRaceResults = [...prev.raceResults];
      // Ensure the raceResults array is long enough
      while (newRaceResults.length <= raceIndex) {
        newRaceResults.push({ positions: [] });
      }
      newRaceResults[raceIndex] = { positions };

      return {
        ...prev,
        players: newPlayers,
        raceResults: newRaceResults
      };
    });
  };

  const handleNextRace = () => {
    setSessionData(prev => ({
      ...prev,
      currentRaceIndex: prev.currentRaceIndex + 1
    }));
  };

  const handleEndSession = () => {
    setGameState('results');
  };

  const handleNewSession = () => {
    setGameState('selection');
    setSessionData({
      races: [],
      players: [],
      raceResults: [],
      currentRaceIndex: 0
    });
  };

  return (
    <LanguageProvider>
      <div className="app">
        {gameState === 'selection' && (
          <SelectionScreen onStartSession={handleStartSession} />
        )}
        
        {gameState === 'racing' && (
          <WorldMap
            currentRace={sessionData.races[sessionData.currentRaceIndex]}
            races={sessionData.races}
            raceIndex={sessionData.currentRaceIndex}
            totalRaces={sessionData.races.length}
            players={sessionData.players}
            onNextRace={handleNextRace}
            onEndSession={handleEndSession}
            onPositionsEntered={handlePositionsEntered}
          />
        )}
        
        {gameState === 'results' && (
          <Results
            sessionData={sessionData}
            onNewSession={handleNewSession}
          />
        )}
      </div>
    </LanguageProvider>
  );
}

export default App;
