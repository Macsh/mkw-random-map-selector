import worldMapInner from '../../assets/MarioKartWorld_World_Map_Inner.webp';
import worldMapStages from '../../assets/MarioKartWorld_World_Map_Stages.webp';
import rainbowRoadIcon from '../../assets/MKWorld_Icon_Rainbow_Road.png';
import {
  MAP_WIDTH,
  MAP_HEIGHT,
  MAP_ASPECT,
  RAINBOW_ICON,
  SPOTLIGHT_DIM,
  zoomStackStyle,
  spotlightMask,
  groupRouteStops,
  routePolyline,
} from '../../utils/mapGeometry.js';
import { raceNumberRows } from '../../utils/format.js';
import './Map.css';

const CENTER = { x: 50, y: 50 };
const DEFAULT_SPOTLIGHT = { inner: 5, outer: 13 };
const at = (spot) => ({ left: `${spot.x}%`, top: `${spot.y}%` });

// Layers, bottom to top: terrain, glow, miniatures + Rainbow Road icon, spotlight, children (pins, route)
export function MapView({
  spot = CENTER,
  spots,
  effect = 'none',
  zoom = 1,
  aspect = MAP_ASPECT,
  spotlight = DEFAULT_SPOTLIGHT,
  glowSize = 16,
  dim = false,
  className = '',
  style,
  children,
}) {
  const effectSpots = spots ?? [spot];
  const mask = effect === 'spotlight' ? spotlightMask(effectSpots, spotlight.inner, spotlight.outer) : null;

  return (
    <div className={`map-frame${dim ? ' map-frame--dim' : ''} ${className}`} style={{ aspectRatio: aspect, ...style }}>
      <div className="map-stack" style={zoomStackStyle(spot, zoom, aspect)}>
        <img className="map-stack__layer" src={worldMapInner} alt="" width={MAP_WIDTH} height={MAP_HEIGHT} decoding="async" draggable="false" />
        {effect === 'glow' && effectSpots.map((glowSpot, index) => (
          <div key={index} className="map-glow" style={{ ...at(glowSpot), width: `${glowSize}cqw`, height: `${glowSize}cqw` }} />
        ))}
        <img className="map-stack__layer" src={worldMapStages} alt="" width={MAP_WIDTH} height={MAP_HEIGHT} decoding="async" draggable="false" />
        <img
          className="map-rainbow-icon"
          src={rainbowRoadIcon}
          alt=""
          width={450}
          height={350}
          decoding="async"
          draggable="false"
          style={{ ...at(RAINBOW_ICON), width: `${RAINBOW_ICON.width}%` }}
        />
        {mask && <div className="map-spotlight" style={{ background: SPOTLIGHT_DIM, WebkitMaskImage: mask, maskImage: mask }} />}
        {children}
      </div>
    </div>
  );
}

export function MapPin({ spot, lift = 24 }) {
  return (
    <div className="map-pin" style={at(spot)} aria-hidden="true">
      <svg width="40" height="52" viewBox="0 0 40 52" style={{ transform: `translate(-50%, calc(-100% - ${lift}px))` }}>
        <path d="M20 49S37 32 37 19A17 17 0 0 0 3 19c0 13 17 30 17 30z" fill="#E62B1E" stroke="#16172B" strokeWidth="3" />
        <circle cx="20" cy="19" r="6.5" fill="#FFFFFF" stroke="#16172B" strokeWidth="3" />
      </svg>
    </div>
  );
}

export function MiniMap({ spot, className = '' }) {
  return (
    <div className={`map-mini ${className}`} aria-hidden="true">
      <MapView>
        <span className="map-mini__dot" style={at(spot)} />
      </MapView>
    </div>
  );
}

// Spotlight on each played course, dotted route in race order, one numbered label per map point
export function SessionRouteMap({ spots, className = '' }) {
  const stops = groupRouteStops(spots);
  const points = routePolyline(spots);

  return (
    <MapView spots={stops.map((stop) => stop.spot)} effect="spotlight" spotlight={{ inner: 4, outer: 10.5 }} dim className={className}>
      <svg className="map-route" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} aria-hidden="true">
        <polyline points={points} fill="none" stroke="#16172B" strokeWidth="40" strokeDasharray="1 70" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={points} fill="none" stroke="#FFC83D" strokeWidth="22" strokeDasharray="1 70" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {stops.map((stop) => (
        <span key={stop.numbers.join('-')} className="map-stop display num" style={at(stop.spot)}>
          {raceNumberRows(stop.numbers).map((row) => (
            <span key={row} className="map-stop__row">{row}</span>
          ))}
        </span>
      ))}
    </MapView>
  );
}
