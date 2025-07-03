import { useEffect, useRef, useState } from 'react';
import { getCircuitName } from '../../data/circuits.js';
import { useLanguage } from '../../contexts/useLanguage.js';
import worldMapInner from '../../assets/MarioKartWorld_World_Map_Inner.webp';
import worldMapStages from '../../assets/MarioKartWorld_World_Map_Stages.webp';
import rainbowRoadIcon from '../../assets/MKWorld_Icon_Rainbow_Road.png';

function WorldMapCanvas({ currentRace, isMobile = false }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [images, setImages] = useState({ background: null, stages: null, rainbowRoadIcon: null });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
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
          width: clientWidth || (isMobile ? 300 : 800), 
          height: clientHeight || (isMobile ? 200 : 600) 
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isMobile]);

  // Animation loop for pin effects (both mobile and desktop)
  useEffect(() => {
    let animationId;
    const animate = () => {
      setAnimationFrame(prev => prev + 1);
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Draw canvas
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
    
    // Calculate scaling to fit image in canvas while maintaining aspect ratio
    const imageAspect = images.background.width / images.background.height;
    const canvasAspect = canvasWidth / canvasHeight;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imageAspect > canvasAspect) {
      // Image is wider than canvas
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imageAspect;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      // Image is taller than canvas
      drawHeight = canvasHeight;
      drawWidth = canvasHeight * imageAspect;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    }
    
    // Pre-calculate pin position and glow data for rendering between map layers
    let glowData = null;
    if (currentRace) {
      const pinX = offsetX + (drawWidth * currentRace.x / 100);
      const yOffset = isMobile ? -35 : -35; // Same positioning for both
      const pinY = offsetY + (drawHeight * currentRace.y / 100) + yOffset;
      const markerSize = isMobile ? 20 : 22; // Slightly larger pin for desktop
      
      // Store glow data for both mobile and desktop
      const time = Date.now() / 150;
      const glowIntensity = (Math.sin(time) + 1) / 2;
      glowData = {
        x: pinX,
        y: pinY + 30, // Glow below the track
        glowIntensity: glowIntensity,
        markerSize: markerSize,
        isShadow: false
      };
    }
    
    // Draw background image
    ctx.drawImage(images.background, offsetX, offsetY, drawWidth, drawHeight);
    
    // Draw pin shadow/glow BETWEEN map and stages (so it appears on the map but under stages)
    if (glowData) {
      if (glowData.isShadow) {
        // Legacy shadow code (not used anymore)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.ellipse(glowData.x, glowData.y, glowData.width, glowData.height, 0, 0, 2 * Math.PI);
        ctx.fill();
      } else {
        // White glow effect below the track (for both mobile and desktop)
        const glowAlpha = 0.4 + (glowData.glowIntensity * 0.6);
        const glowSize = glowData.markerSize * (2.0 + glowData.glowIntensity * 1.0);
        
        // Create bright white gradient for glow effect
        const glowGradient = ctx.createRadialGradient(glowData.x, glowData.y, 0, glowData.x, glowData.y, glowSize);
        glowGradient.addColorStop(0, `rgba(255, 255, 255, ${glowAlpha})`);
        glowGradient.addColorStop(0.3, `rgba(255, 255, 255, ${glowAlpha * 0.8})`);
        glowGradient.addColorStop(0.6, `rgba(255, 255, 255, ${glowAlpha * 0.4})`);
        glowGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(glowData.x, glowData.y, glowSize, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    
    // Draw stages overlay
    ctx.drawImage(images.stages, offsetX, offsetY, drawWidth, drawHeight);
    
    // Draw Rainbow Road icon at its coordinates
    const rainbowRoadX = offsetX + (drawWidth * 49.9 / 100); // Rainbow Road x coordinate (very slightly right from 49.8)
    const rainbowRoadY = offsetY + (drawHeight * 70.5 / 100); // Rainbow Road y coordinate (slightly up from 71.4)
    const iconWidth = isMobile ? 35 : 70; // Smaller on mobile (was 50), same on desktop
    const iconHeight = isMobile ? 28 : 55; // Smaller on mobile (was 40), same on desktop
    
    // Draw the Rainbow Road icon centered at the coordinates
    ctx.drawImage(
      images.rainbowRoadIcon, 
      rainbowRoadX - iconWidth / 2, 
      rainbowRoadY - iconHeight / 2, 
      iconWidth, 
      iconHeight
    );
    
    // Draw circuit name at race location (desktop only)
    if (currentRace && !isMobile) {
      const pinX = offsetX + (drawWidth * currentRace.x / 100);
      const yOffset = -35;
      const pinY = offsetY + (drawHeight * currentRace.y / 100) + yOffset;
      
      // Position text below the race location
      const textY = pinY + 50; // Position text 50px below the race location
      
      // Set up text styling
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw text with black outline for visibility
      ctx.strokeText(getCircuitName(currentRace, language), pinX, textY);
      ctx.fillText(getCircuitName(currentRace, language), pinX, textY);
    }
    
    // Draw circuit pin (mobile only)
    if (currentRace && isMobile) {
      // Calculate pin position relative to the drawn image
      const pinX = offsetX + (drawWidth * currentRace.x / 100);
      // Adjust Y position - mobile pin positioned higher
      const yOffset = -18; // Adjusted from -15 to -18 to move pin higher
      const pinY = offsetY + (drawHeight * currentRace.y / 100) + yOffset;
      
      // Draw circuit marker
      const markerSize = 25;
      
      // Mobile: Gentle animated bouncing pin
      const time = Date.now() / 200; // Back to original speed (was 300)
      const bounceOffset = Math.sin(time) * 4; // Keep reduced bounce at 4
      const currentPinY = pinY + bounceOffset - 8; // Keep reduced vertical offset at -8
      
      // Draw the emoji with strong shadow for visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 1)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      
      ctx.globalAlpha = 1.0;
      ctx.font = `${markerSize + 10}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FF0000';
      ctx.fillText('📍', pinX, currentPinY);
      
      // Reset shadow and alpha
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.globalAlpha = 1.0;
    }
  }, [imagesLoaded, currentRace, images, isMobile, dimensions, animationFrame, language]);

  return (
    <div 
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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
    </div>
  );
}

export default WorldMapCanvas;
