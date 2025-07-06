
import { useEffect, useRef } from 'react';

export const MouseTrail = () => {
  const trailRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const trail: HTMLDivElement[] = [];
    const trailLength = 10;

    // Create trail elements
    for (let i = 0; i < trailLength; i++) {
      const dot = document.createElement('div');
      dot.className = 'mouse-trail';
      dot.style.opacity = (1 - i / trailLength).toString();
      dot.style.transform = 'scale(' + (1 - i / trailLength) + ')';
      document.body.appendChild(dot);
      trail.push(dot);
    }

    trailRef.current = trail;

    let mouseX = 0;
    let mouseY = 0;
    let positions: { x: number; y: number }[] = [];

    const updateMousePosition = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animateTrail = () => {
      positions.unshift({ x: mouseX, y: mouseY });
      positions = positions.slice(0, trailLength);

      trail.forEach((dot, index) => {
        const position = positions[index];
        if (position) {
          dot.style.left = position.x + 'px';
          dot.style.top = position.y + 'px';
        }
      });

      requestAnimationFrame(animateTrail);
    };

    document.addEventListener('mousemove', updateMousePosition);
    animateTrail();

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      trail.forEach(dot => document.body.removeChild(dot));
    };
  }, []);

  return null;
};
