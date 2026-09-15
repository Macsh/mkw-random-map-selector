import './Badges.css';

const SNES_DOTS = ['#E62B1E', '#FFC83D', '#1FA463', '#2F6FEB'];
const RAINBOW = ['#FF4A3A', '#FF9A2E', '#FFD04D', '#3CCB7F', '#5B8CFF'];

// Console-grey badge with the four SNES controller button colours
export function SnesBadge({ size = 'sm' }) {
  return (
    <span className={`snes-badge${size === 'md' ? ' snes-badge--md' : ''}`}>
      <span className="snes-badge__dots" aria-hidden="true">
        {SNES_DOTS.map((color) => <span key={color} style={{ background: color }} />)}
      </span>
      SNES
    </span>
  );
}

export function RainbowBadge({ size = 52, radius = 12 }) {
  const art = Math.round(size * 0.72);
  return (
    <span className="rainbow-badge" style={{ width: size, height: size, borderRadius: radius }} aria-hidden="true">
      <svg width={art} height={art} viewBox="0 0 40 40" fill="none" strokeWidth="3.4" strokeLinecap="round">
        {RAINBOW.map((color, i) => (
          <path key={color} d={`M${4 + i * 3} 30a${16 - i * 3} ${16 - i * 3} 0 0 1 ${32 - i * 6} 0`} stroke={color} />
        ))}
      </svg>
    </span>
  );
}

export function RaceBadge({ number }) {
  return <span className="race-badge display num">{number}</span>;
}

export function PlayerDot({ index, size = 14 }) {
  return <span className="dot" style={{ width: size, height: size, background: `var(--player-${index + 1})` }} aria-hidden="true" />;
}
