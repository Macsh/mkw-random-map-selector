import { useEffect, useRef, useState } from 'react';
import { getCircuitName } from '../../data/circuits.js';
import { useLanguage } from '../../contexts/useLanguage.js';
import worldMapInner from '../../assets/MarioKartWorld_World_Map_Inner.webp';
import worldMapStages from '../../assets/MarioKartWorld_World_Map_Stages.webp';
import rainbowRoadIcon from '../../assets/MKWorld_Icon_Rainbow_Road.png';

function ZoomedMapCanvas({ currentRace }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [images, setImages] = useState({ background: null, stages: null, rainbowRoadIcon: null });
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });
  const [animationFrame, setAnimationFrame] = useState(0);
  const { language } = useLanguage();

  // Load images
  useEffect(() => {
    const loadImage = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });
    };

    Promise.all([
      loadImage(worldMapInner),
      loadImage(worldMapStages),
      loadImage(rainbowRoadIcon)
    ]).then(([background, stages, rainbowRoadIcon]) => {
      setImages({ background, stages, rainbowRoadIcon });
      setImagesLoaded(true);
    });
  }, []);

  // Handle container resizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ 
          width: clientWidth || 400, 
          height: clientHeight || 300 
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Animation loop for pin effects
  useEffect(() => {
    let animationId;
    const animate = () => {
      setAnimationFrame(prev => prev + 1);
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Draw zoomed canvas
  useEffect(() => {
    if (!imagesLoaded || !currentRace) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match container dimensions
    const { width: canvasWidth, height: canvasHeight } = dimensions;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Calculate base scaling for the full image
    const imageAspect = images.background.width / images.background.height;
    const canvasAspect = canvasWidth / canvasHeight;
    
    let baseDrawWidth, baseDrawHeight;
    
    if (imageAspect > canvasAspect) {
      baseDrawWidth = canvasWidth;
      baseDrawHeight = canvasWidth / imageAspect;
    } else {
      baseDrawHeight = canvasHeight;
      baseDrawWidth = canvasHeight * imageAspect;
    }
    
    // Zoom settings
    const zoomFactor = 4; // Increased from 3x to 4x zoom for a bit more detail
    
    // Calculate the center point for the current race (as percentage of image)
    const centerX = currentRace.x / 100;
    const centerY = currentRace.y / 100;
    
    // Calculate source coordinates for cropping the image
    const sourceWidth = images.background.width / zoomFactor;
    const sourceHeight = images.background.height / zoomFactor;
    const sourceX = Math.max(0, Math.min(
      (centerX * images.background.width) - (sourceWidth / 2),
      images.background.width - sourceWidth
    ));
    const sourceY = Math.max(0, Math.min(
      (centerY * images.background.height) - (sourceHeight / 2),
      images.background.height - sourceHeight
    ));
    
    // Calculate destination coordinates to center the zoomed area
    const destX = (canvasWidth - baseDrawWidth) / 2;
    const destY = (canvasHeight - baseDrawHeight) / 2;
    
    // Draw zoomed background image
    ctx.drawImage(
      images.background,
      sourceX, sourceY, sourceWidth, sourceHeight, // Source crop
      destX, destY, baseDrawWidth, baseDrawHeight   // Destination
    );
    
    // Add static glow at race location (between background and stages)
    if (currentRace) {
      // Calculate race position relative to the zoomed view
      const relativeX = ((centerX * images.background.width) - sourceX) / sourceWidth;
      const relativeY = ((centerY * images.background.height) - sourceY) / sourceHeight;
      
      const glowX = destX + (baseDrawWidth * relativeX);
      const glowY = destY + (baseDrawHeight * relativeY) - 20; // Move glow 20px higher
      
      // Draw static white glow effect - larger and more visible
      const glowSize = 60; // Increased from 30 to 60 for much larger glow
      const glowAlpha = 0.9; // Increased from 0.6 to 0.9 for higher opacity
      
      // Create white gradient for glow effect
      const glowGradient = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, glowSize);
      glowGradient.addColorStop(0, `rgba(255, 255, 255, ${glowAlpha})`);
      glowGradient.addColorStop(0.2, `rgba(255, 255, 255, ${glowAlpha * 0.9})`); // Brighter inner area
      glowGradient.addColorStop(0.5, `rgba(255, 255, 255, ${glowAlpha * 0.6})`);
      glowGradient.addColorStop(0.8, `rgba(255, 255, 255, ${glowAlpha * 0.3})`);
      glowGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
      
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(glowX, glowY, glowSize, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Draw zoomed stages overlay
    ctx.drawImage(
      images.stages,
      sourceX, sourceY, sourceWidth, sourceHeight, // Source crop
      destX, destY, baseDrawWidth, baseDrawHeight   // Destination
    );
    
    // Draw Rainbow Road icon if it's visible in the zoomed area
    const rainbowRoadX = 49.9;
    const rainbowRoadY = 70.5;
    
    // Check if Rainbow Road is in the visible area
    const rrSourceX = (rainbowRoadX / 100) * images.background.width;
    const rrSourceY = (rainbowRoadY / 100) * images.background.height;
    
    if (rrSourceX >= sourceX && rrSourceX <= sourceX + sourceWidth &&
        rrSourceY >= sourceY && rrSourceY <= sourceY + sourceHeight) {
      
      const relativeRrX = (rrSourceX - sourceX) / sourceWidth;
      const relativeRrY = (rrSourceY - sourceY) / sourceHeight;
      
      const iconX = destX + (baseDrawWidth * relativeRrX);
      const iconY = destY + (baseDrawHeight * relativeRrY);
      const iconWidth = 60; // Larger in zoomed view
      const iconHeight = 45;
      
      ctx.drawImage(
        images.rainbowRoadIcon,
        iconX - iconWidth / 2,
        iconY - iconHeight / 2,
        iconWidth,
        iconHeight
      );
    }
  }, [imagesLoaded, currentRace, images, dimensions, animationFrame]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          borderRadius: '10px',
          objectFit: 'contain'
        }}
      />
      {currentRace && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '16px',
          fontWeight: 'bold',
          textAlign: 'center',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
          zIndex: 10
        }}>
          {getCircuitName(currentRace, language)}
        </div>
      )}
    </div>
  );
}

export default ZoomedMapCanvas;
