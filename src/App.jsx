import { useEffect, useState } from 'react';
import SelectionScreen from './components/SelectionScreen/SelectionScreen.jsx';
import RaceScreen from './components/RaceScreen/RaceScreen.jsx';
import Results from './components/Results/Results.jsx';
import { generateRaceSelection } from './utils/raceLogic.js';
import { LanguageProvider } from './contexts/LanguageContext.jsx';

function App() {
  const [gameState, setGameState] = useState('selection'); // 'selection', 'racing', 'results'
  const [sessionData, setSessionData] = useState({
    races: [],
    players: [],
    raceResults: [],
    currentRaceIndex: 0
  });

  // Each screen and each race starts at the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [gameState, sessionData.currentRaceIndex]);

  const handleStartSession = ({ raceCount, players, rainbowRoadLast, excludedTracks }) => {
    const selectedRaces = generateRaceSelection(raceCount, rainbowRoadLast, excludedTracks);
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
          <RaceScreen
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
