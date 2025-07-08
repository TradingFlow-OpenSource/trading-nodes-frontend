import { useEffect, useRef } from 'react';

export const MouseTrail = () => {
  const trailRef = useRef<HTMLDivElement[]>([]);
  const isMovingRef = useRef(false);
  const lastMoveTimeRef = useRef(0);

  useEffect(() => {
    const trail: HTMLDivElement[] = [];
    const trailLength = 15; // 减少拖尾长度，提高响应速度

    // 创建拖尾元素
    for (let i = 0; i < trailLength; i++) {
      const dot = document.createElement('div');
      dot.className = 'mouse-trail';
      
      // 根据位置设置不同的样式
      const progress = i / trailLength;
      const size = 10 - progress * 8; // 调整大小范围
      const opacity = 1 - progress * 0.6; // 更明显的透明度变化
      const blur = progress * 2; // 减少模糊效果
      
      dot.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(45deg, #8b5cf6, #06b6d4, #10b981, #f59e0b);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: ${opacity};
        transform: scale(${1 - progress * 0.5});
        filter: blur(${blur}px);
        box-shadow: 
          0 0 ${size * 3}px rgba(139, 92, 246, ${opacity * 0.9}),
          0 0 ${size * 6}px rgba(6, 182, 212, ${opacity * 0.6}),
          0 0 ${size * 9}px rgba(16, 185, 129, ${opacity * 0.3});
        transition: all 0.05s linear;
        mix-blend-mode: screen;
      `;
      
      document.body.appendChild(dot);
      trail.push(dot);
    }

    trailRef.current = trail;

    let mouseX = 0;
    let mouseY = 0;
    let positions: { x: number; y: number; timestamp: number; velocity: number }[] = [];

    const updateMousePosition = (e: MouseEvent) => {
      const now = Date.now();
      const timeDiff = now - lastMoveTimeRef.current;
      
      // 计算移动速度
      const deltaX = e.clientX - mouseX;
      const deltaY = e.clientY - mouseY;
      const velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / Math.max(timeDiff, 1);
      
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastMoveTimeRef.current = now;
      
      // 设置移动状态
      isMovingRef.current = velocity > 0.1; // 降低移动检测阈值
    };

    const animateTrail = () => {
      const now = Date.now();
      positions.unshift({ 
        x: mouseX, 
        y: mouseY, 
        timestamp: now,
        velocity: isMovingRef.current ? 1 : 0
      });
      positions = positions.slice(0, trailLength);

      trail.forEach((dot, index) => {
        const position = positions[index];
        if (position) {
          // 减少缓动时间，提高响应速度
          const timeDiff = now - position.timestamp;
          const easeFactor = Math.max(0, 1 - timeDiff / 50); // 从150ms减少到50ms
          
          // 减少位置偏移，让跟踪更紧密
          const offsetX = Math.sin(timeDiff * 0.02 + index) * 1; // 减少偏移量
          const offsetY = Math.cos(timeDiff * 0.02 + index) * 1;
          
          dot.style.left = (position.x + offsetX) + 'px';
          dot.style.top = (position.y + offsetY) + 'px';
          
          // 根据移动速度调整颜色和大小
          if (index === 0 && positions[1]) {
            const speed = Math.sqrt(
              Math.pow(position.x - positions[1].x, 2) + 
              Math.pow(position.y - positions[1].y, 2)
            );
            const intensity = Math.min(speed / 10, 1); // 降低速度阈值
            
            // 动态颜色变化
            const hue1 = 280 + intensity * 60;
            const hue2 = 200 + intensity * 60;
            const hue3 = 160 + intensity * 60;
            const hue4 = 45 + intensity * 30;
            
            dot.style.background = `linear-gradient(45deg, 
              hsl(${hue1}, 80%, 65%), 
              hsl(${hue2}, 80%, 65%), 
              hsl(${hue3}, 80%, 65%),
              hsl(${hue4}, 80%, 65%)
            )`;
            
            // 动态大小变化
            const baseSize = 10;
            const dynamicSize = baseSize + intensity * 6;
            dot.style.width = `${dynamicSize}px`;
            dot.style.height = `${dynamicSize}px`;
            dot.style.boxShadow = `
              0 0 ${dynamicSize * 3}px rgba(139, 92, 246, ${0.9 + intensity * 0.1}),
              0 0 ${dynamicSize * 6}px rgba(6, 182, 212, ${0.6 + intensity * 0.2}),
              0 0 ${dynamicSize * 9}px rgba(16, 185, 129, ${0.3 + intensity * 0.3})
            `;
          }
          
          // 减少呼吸效果，让动画更稳定
          const breath = Math.sin(now * 0.01 + index * 0.3) * 0.05 + 1;
          dot.style.transform = `scale(${(1 - index / trailLength * 0.5) * breath})`;
        }
      });

      requestAnimationFrame(animateTrail);
    };

    // 添加鼠标进入/离开效果
    const handleMouseEnter = () => {
      trail.forEach((dot, index) => {
        dot.style.opacity = (1 - index / trailLength * 0.6).toString();
      });
    };

    const handleMouseLeave = () => {
      trail.forEach((dot) => {
        dot.style.opacity = '0';
      });
    };

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    animateTrail();

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      trail.forEach(dot => {
        if (dot.parentNode) {
          document.body.removeChild(dot);
        }
      });
    };
  }, []);

  return null;
};
