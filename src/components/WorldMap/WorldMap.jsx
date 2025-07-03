import { useState, useEffect } from 'react';
import { trackThemes, getCircuitName } from '../../data/circuits.js';
import { useLanguage } from '../../contexts/useLanguage.js';
import WorldMapCanvas from './WorldMapCanvas.jsx';
import ZoomedMapCanvas from './ZoomedMapCanvas.jsx';
import './WorldMap.css';

function WorldMap({ 
  currentRace, 
  races,
  raceIndex, 
  totalRaces, 
  players, 
  onNextRace, 
  onEndSession,
  onPositionsEntered
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [positions, setPositions] = useState([]);
  const [editingRaceIndex, setEditingRaceIndex] = useState(null);
  const { language, t } = useLanguage();

  // Reset editing state when changing races
  useEffect(() => {
    setEditingRaceIndex(null);
  }, [raceIndex]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize positions when players change or when opening modal
  useEffect(() => {
    if (players.length > 0) {
      // Check if positions already exist for the race being edited (current or previous)
      const targetRaceIndex = editingRaceIndex !== null ? editingRaceIndex : raceIndex;
      const existingPositions = players.map(player => 
        player.positions[targetRaceIndex] || ''
      );
      setPositions(existingPositions);
    }
  }, [players, raceIndex, editingRaceIndex, showPositionModal]);

  const handleNext = () => {
    if (raceIndex < totalRaces - 1) {
      onNextRace();
    } else {
      onEndSession();
    }
  };

  const handleOpenPositionModal = (targetRaceIndex = null) => {
    // If targetRaceIndex is provided and is a valid number, we're editing a previous race
    // If targetRaceIndex is null or undefined, we're editing the current race
    const isEditingPreviousRace = targetRaceIndex !== null && targetRaceIndex !== undefined && typeof targetRaceIndex === 'number';
    
    if (isEditingPreviousRace) {
      setEditingRaceIndex(targetRaceIndex);
    } else {
      setEditingRaceIndex(null);
    }
    
    const raceToEdit = isEditingPreviousRace ? targetRaceIndex : raceIndex;
    
    // Load existing positions for the target race
    const existingPositions = players.map(player => 
      player.positions[raceToEdit] || ''
    );
    setPositions(existingPositions);
    setShowPositionModal(true);
  };

  const handleClosePositionModal = () => {
    setShowPositionModal(false);
    setEditingRaceIndex(null);
  };

  const handlePositionChange = (playerIndex, position) => {
    const newPositions = [...positions];
    newPositions[playerIndex] = position;
    setPositions(newPositions);
  };

  const handleSavePositions = () => {
    const finalPositions = positions.map(pos => parseInt(pos) || null);
    
    // Validate positions (check for duplicates among non-null values)
    const validPositions = finalPositions.filter(pos => pos !== null);
    const uniquePositions = new Set(validPositions);
    
    if (validPositions.length !== uniquePositions.size) {
      alert('Each player must have a unique position. Please check for duplicates.');
      return;
    }
    
    // Check if positions are in valid range (1-24 for Mario Kart)
    const invalidPositions = validPositions.filter(pos => pos < 1 || pos > 24);
    if (invalidPositions.length > 0) {
      alert('Positions must be between 1 and 24 (standard Mario Kart race positions).');
      return;
    }
    
    // If editing a previous race, we need to handle it differently
    const isEditingPreviousRace = editingRaceIndex !== null && editingRaceIndex !== undefined && typeof editingRaceIndex === 'number';
    
    if (isEditingPreviousRace) {
      onPositionsEntered(finalPositions, editingRaceIndex);
    } else {
      onPositionsEntered(finalPositions);
    }
    
    setShowPositionModal(false);
    setEditingRaceIndex(null);
    // Don't reset positions - they can be re-edited
  };

  if (!currentRace) {
    return (
      <div className="world-map">
        <div className="loading">Loading race...</div>
      </div>
    );
  }

  return (
    <div className="world-map">
      <div className="race-header">
        <div className="race-info">
          <span 
            className="track-badge"
            style={{ backgroundColor: trackThemes[currentRace.id] }}
          >
            Track {raceIndex + 1}
          </span>
        </div>
      </div>

      <div className="race-controls">
        <div className="race-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((raceIndex + 1) / totalRaces) * 100}%` }}
            ></div>
          </div>
          <p>{raceIndex + 1} / {totalRaces} {t('selection.races')} {t('worldMap.of')}</p>
        </div>

        <div className="action-buttons">
          {players.length > 0 && (
            <button 
              className="positions-button compact"
              onClick={() => handleOpenPositionModal()}
            >
              {t('worldMap.enterPositions')}
            </button>
          )}
          
          <button 
            className="next-button compact"
            onClick={handleNext}
          >
            {raceIndex < totalRaces - 1 ? t('worldMap.nextRace') : t('worldMap.viewResults')}
          </button>
        </div>
      </div>

      <div className={`map-container ${isMobile ? 'mobile' : 'desktop'}`}>
        {isMobile ? (
          <>
            <div className="circuit-zoom">
              <div className="circuit-zoom-container">
                <ZoomedMapCanvas
                  currentRace={currentRace}
                />
              </div>
            </div>
            
            <div className="mini-map">
              <div className="mini-map-container">
                <WorldMapCanvas
                  currentRace={currentRace}
                  isMobile={true}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="full-map">
            <div className="full-map-container">
              <WorldMapCanvas
                currentRace={currentRace}
                isMobile={false}
              />
            </div>
          </div>
        )}
      </div>

      {/* Player Positions - only show if there are players */}
      {players.length > 0 && (
        <div className="player-positions">
          <h2>Player Positions</h2>
          <div className="positions-list">
            {players.map((player, index) => (
              <div key={index} className="position-item">
                <span className="player-name">{player.name}</span>
                <div className="player-race-positions">
                  {/* Show all races up to totalRaces */}
                  {Array.from({ length: totalRaces }, (_, raceIdx) => {
                    const position = player.positions[raceIdx];
                    const isCurrentRace = raceIdx === raceIndex;
                    const isFutureRace = raceIdx > raceIndex;
                    const isClickable = raceIdx <= raceIndex; // Can edit current and previous races
                    
                    return (
                      <span 
                        key={raceIdx} 
                        className={`race-position ${isClickable ? 'clickable' : ''} ${!position ? 'missing' : ''} ${isCurrentRace ? 'current' : ''}`}
                        onClick={() => {
                          if (!isClickable) return;
                          if (isCurrentRace) {
                            // For current race, pass null (no editingRaceIndex)
                            handleOpenPositionModal(null);
                          } else {
                            // For previous races, pass the race index
                            handleOpenPositionModal(raceIdx);
                          }
                        }}
                        title={
                          isFutureRace 
                            ? `Race ${raceIdx + 1} - not yet available`
                            : `Click to ${position ? 'edit' : 'enter'} Race ${raceIdx + 1} positions`
                        }
                      >
                        {position || '?'}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Position Entry Modal */}
      {showPositionModal && (
        <div className="modal-overlay">
          <div className="position-modal">
            <h3>Enter Race Positions</h3>
            <p>
              {(() => {
                // Debug info
                const isEditingPrevious = editingRaceIndex !== null && editingRaceIndex !== undefined && typeof editingRaceIndex === 'number';
                
                if (isEditingPrevious) {
                  const raceName = races && races[editingRaceIndex] && races[editingRaceIndex] ? 
                    getCircuitName(races[editingRaceIndex], language) : t('worldMap.race');
                  return (
                    <>
                      {t('worldMap.race')} {editingRaceIndex + 1}: {raceName}
                      <span className="editing-note"> ({t('worldMap.editRace')})</span>
                    </>
                  );
                } else {
                  const raceName = currentRace ? getCircuitName(currentRace, language) : t('worldMap.race');
                  return `${t('worldMap.race')} ${raceIndex + 1}: ${raceName}`;
                }
              })()}
            </p>
            
            <div className="position-inputs">
              {players.map((player, index) => (
                <div key={index} className="position-input-row">
                  <label>{player.name}:</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={positions[index]}
                    onChange={(e) => handlePositionChange(index, e.target.value)}
                    placeholder={t('worldMap.position')}
                  />
                </div>
              ))}
            </div>

            <div className="modal-buttons">
              <button onClick={handleClosePositionModal} className="cancel-button">
                {t('worldMap.cancel')}
              </button>
              <button onClick={handleSavePositions} className="save-button">
                {t('worldMap.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorldMap;
