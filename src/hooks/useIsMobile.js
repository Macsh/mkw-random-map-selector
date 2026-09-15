import { useEffect, useState } from 'react';

// Compact (phone and tablet) layouts up to 1100px; the desktop grids need more room
const MOBILE_QUERY = '(max-width: 1100px)';

// Read synchronously so the first render already uses the right layout
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const onChange = () => setIsMobile(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
