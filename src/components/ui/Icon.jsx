// Stroke icons on a 24px grid; `play` is filled
const STROKE_PATHS = {
  chevronRight: 'M9 5l7 7-7 7',
  chevronDown: 'M5 9l7 7 7-7',
  podium: 'M3 20h18M5 20v-7h4.5v7M9.5 20V6h5v14M14.5 20v-4.5H19V20',
  share: 'M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6',
  map: 'M9 4L3 6.5V20l6-2.5 6 2.5 6-2.5V4L15 6.5 9 4zM9 4v13.5M15 6.5V20',
  users: 'M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM21 20v-1.5a4 4 0 0 0-3-3.87M15.5 4.13a3.5 3.5 0 0 1 0 6.74',
  minus: 'M5 12h14',
  plus: 'M12 5v14M5 12h14',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  dash: 'M7 12h10',
  lock: 'M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z',
};

export default function Icon({ name, size = 20 }) {
  if (name === 'play') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor" style={{ flex: 'none' }}>
        <path d="M7 4.6v14.8a1.2 1.2 0 0 0 1.8 1l12-7.4a1.2 1.2 0 0 0 0-2L8.8 3.6A1.2 1.2 0 0 0 7 4.6z" />
      </svg>
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: 'none' }}
    >
      <path d={STROKE_PATHS[name]} />
    </svg>
  );
}
