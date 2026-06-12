import { useEffect, useState, useMemo } from 'react';

/**
 * Hook to calculate the scale factor to fit a fixed-size canvas 
 * within the user's browser window, maintaining the exact 1920x1080 resolution.
 */
export function useCanvasScale(targetWidth = 1920, targetHeight = 1080) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scaleInfo = useMemo(() => {
    const scaleX = windowSize.width / targetWidth;
    const scaleY = windowSize.height / targetHeight;
    const scale = Math.min(scaleX, scaleY); // 等比缩放，不形变 (Scale to fit)

    return {
      scale,
      scaleX,
      scaleY
    };
  }, [windowSize, targetWidth, targetHeight]);

  return scaleInfo;
}
