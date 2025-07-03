import { useState, useRef } from 'react';
import { circuits } from '../../data/circuits.js';
import worldMapInner from '../../assets/MarioKartWorld_World_Map_Inner.webp';
import worldMapStages from '../../assets/MarioKartWorld_World_Map_Stages.webp';
import './CoordinatePicker.css';

function CoordinatePicker() {
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(0);
  const [trackCoordinates, setTrackCoordinates] = useState(
    circuits.reduce((acc, track) => {
      acc[track.id] = { x: 0, y: 0 };
      return acc;
    }, {})
  );
  const mapRef = useRef(null);

  const handleMapClick = (event) => {
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const currentTrack = circuits[selectedTrackIndex];
    setTrackCoordinates(prev => ({
      ...prev,
      [currentTrack.id]: { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
    }));
  };

  const generateCoordinatesCode = () => {
    const coordinatesArray = circuits.map(track => {
      const coords = trackCoordinates[track.id];
      return `  { id: '${track.id}', name: '${track.name}', x: ${coords.x}, y: ${coords.y} }`;
    }).join(',\n');

    return `export const circuits = [\n${coordinatesArray}\n];`;
  };

  const copyToClipboard = () => {
    const code = generateCoordinatesCode();
    navigator.clipboard.writeText(code);
    alert('Coordinates copied to clipboard!');
  };

  const nextTrack = () => {
    if (selectedTrackIndex < circuits.length - 1) {
      setSelectedTrackIndex(selectedTrackIndex + 1);
    }
  };

  const prevTrack = () => {
    if (selectedTrackIndex > 0) {
      setSelectedTrackIndex(selectedTrackIndex - 1);
    }
  };

  const currentTrack = circuits[selectedTrackIndex];
  const currentCoords = trackCoordinates[currentTrack.id];
  const completedTracks = Object.values(trackCoordinates).filter(coord => coord.x !== 0 || coord.y !== 0).length;

  return (
    <div className="coordinate-picker">
      <div className="picker-header">
        <h1>🎯 Mario Kart World Coordinate Picker</h1>
        <p>Click on the map to position each track. Progress: {completedTracks}/30</p>
      </div>

      <div className="picker-controls">
        <div className="track-selector">
          <button onClick={prevTrack} disabled={selectedTrackIndex === 0}>
            ← Previous
          </button>
          
          <div className="current-track">
            <h2>{currentTrack.name}</h2>
            <p>Track {selectedTrackIndex + 1} of {circuits.length}</p>
            <p>Current position: ({currentCoords.x}%, {currentCoords.y}%)</p>
          </div>
          
          <button onClick={nextTrack} disabled={selectedTrackIndex === circuits.length - 1}>
            Next →
          </button>
        </div>

        <div className="track-list">
          <h3>Quick Select Track:</h3>
          <select 
            value={selectedTrackIndex} 
            onChange={(e) => setSelectedTrackIndex(parseInt(e.target.value))}
          >
            {circuits.map((track, index) => {
              const coords = trackCoordinates[track.id];
              const isSet = coords.x !== 0 || coords.y !== 0;
              return (
                <option key={track.id} value={index}>
                  {isSet ? '✅' : '⚪'} {track.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="map-container">
        <div 
          className="interactive-map" 
          ref={mapRef}
          onClick={handleMapClick}
        >
          <img 
            src={worldMapInner} 
            alt="Mario Kart World Map" 
            className="map-background"
            draggable={false}
          />
          <img 
            src={worldMapStages} 
            alt="Track Locations" 
            className="map-stages"
            draggable={false}
          />
          
          {/* Show all positioned tracks */}
          {Object.entries(trackCoordinates).map(([trackId, coords]) => {
            if (coords.x === 0 && coords.y === 0) return null;
            
            const track = circuits.find(t => t.id === trackId);
            const isCurrentTrack = track.id === currentTrack.id;
            
            return (
              <div
                key={trackId}
                className={`track-marker ${isCurrentTrack ? 'current' : ''}`}
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`
                }}
              >
                <div className="marker-icon">
                  {isCurrentTrack ? '🎯' : '📍'}
                </div>
                <div className="marker-label">
                  {track.name}
                </div>
              </div>
            );
          })}

          {/* Crosshair for current track if not positioned */}
          {(currentCoords.x === 0 && currentCoords.y === 0) && (
            <div className="instruction-overlay">
              <p>Click on the map to position: <strong>{currentTrack.name}</strong></p>
            </div>
          )}
        </div>
      </div>

      <div className="picker-footer">
        <div className="export-section">
          <h3>Export Coordinates</h3>
          <p>Positioned tracks: {completedTracks}/30</p>
          <button 
            className="export-button" 
            onClick={copyToClipboard}
            disabled={completedTracks === 0}
          >
            📋 Copy Coordinates to Clipboard
          </button>
        </div>

        <div className="instructions">
          <h3>Instructions:</h3>
          <ul>
            <li>Select a track from the dropdown or use Previous/Next buttons</li>
            <li>Click on the map where you want to position that track</li>
            <li>The track marker will appear with the track name</li>
            <li>Continue until all 30 tracks are positioned</li>
            <li>Click "Copy Coordinates" to get the final code</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CoordinatePicker;
