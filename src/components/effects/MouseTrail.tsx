import { useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

export const MouseTrail = () => {
  const trailRef = useRef<HTMLDivElement[]>([]);
  const isMovingRef = useRef(false);
  const lastMoveTimeRef = useRef(0);
  const { theme } = useTheme();

  useEffect(() => {
    // 清理现有的trail元素
    const cleanupTrail = () => {
      trailRef.current.forEach(dot => {
        if (dot.parentNode) {
          document.body.removeChild(dot);
        }
      });
      trailRef.current = [];
    };

    // 先清理现有元素
    cleanupTrail();

    const trail: HTMLDivElement[] = [];
    const trailLength = 15; // 减少拖尾长度，提高响应速度

    // 根据主题设置不同的颜色配置
    const isDark = theme === 'dark';
    const baseOpacity = isDark ? 1 : 0.5;
    const maxSize = isDark ? 10 : 8;
    const blendMode = isDark ? 'screen' : 'multiply';
    
    // 创建拖尾元素
    for (let i = 0; i < trailLength; i++) {
      const dot = document.createElement('div');
      dot.className = 'mouse-trail';
      
      // 根据位置设置不同的样式
      const progress = i / trailLength;
      const size = maxSize - progress * (maxSize - 2); // 调整大小范围
      const opacity = baseOpacity * (1 - progress * 0.6); // 更明显的透明度变化
      const blur = progress * 2; // 减少模糊效果
      
      // 根据主题选择不同的颜色方案
      const colors = isDark 
        ? {
            primary: '#8b5cf6',
            secondary: '#06b6d4', 
            tertiary: '#10b981',
            quaternary: '#f59e0b'
          }
        : {
            primary: '#064e3b',  // 墨绿深色
            secondary: '#065f46', // 墨绿中色
            tertiary: '#047857',  // 墨绿亮色
            quaternary: '#059669' // 翠绿色
          };
      
      dot.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(45deg, ${colors.primary}, ${colors.secondary}, ${colors.tertiary}, ${colors.quaternary});
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: ${opacity};
        transform: scale(${1 - progress * 0.5});
        filter: blur(${blur}px);
        box-shadow: 
          0 0 ${size * 3}px ${isDark ? `rgba(139, 92, 246, ${opacity * 0.9})` : `rgba(6, 78, 59, ${opacity * 0.6})`},
          0 0 ${size * 6}px ${isDark ? `rgba(6, 182, 212, ${opacity * 0.6})` : `rgba(4, 120, 87, ${opacity * 0.4})`},
          0 0 ${size * 9}px ${isDark ? `rgba(16, 185, 129, ${opacity * 0.3})` : `rgba(5, 150, 105, ${opacity * 0.3})`};
        transition: all 0.05s linear;
        mix-blend-mode: ${blendMode};
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
            
            // 动态颜色变化 - 根据主题调整
            if (isDark) {
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
            } else {
              // 浅色主题使用墨绿色系的动态变化
              const baseHue = 150; // 绿色基调
              const hue1 = baseHue + intensity * 20;  // 150-170: 绿色到青绿
              const hue2 = baseHue - intensity * 30;  // 150-120: 绿色到深绿
              const hue3 = baseHue + intensity * 40;  // 150-190: 绿色到青色
              const hue4 = baseHue - intensity * 10;  // 150-140: 绿色微调
              
              dot.style.background = `linear-gradient(45deg, 
                hsl(${hue1}, 70%, 25%), 
                hsl(${hue2}, 75%, 20%), 
                hsl(${hue3}, 65%, 30%),
                hsl(${hue4}, 80%, 28%)
              )`;
            }
            
            // 动态大小变化
            const baseSize = maxSize;
            const dynamicSize = baseSize + intensity * (isDark ? 6 : 4);
            dot.style.width = `${dynamicSize}px`;
            dot.style.height = `${dynamicSize}px`;
            
            // 浅色主题使用墨绿色系阴影
            if (isDark) {
              const shadowOpacity = 0.9;
              dot.style.boxShadow = `
                0 0 ${dynamicSize * 3}px rgba(139, 92, 246, ${shadowOpacity + intensity * 0.1}),
                0 0 ${dynamicSize * 6}px rgba(6, 182, 212, ${(shadowOpacity * 0.6) + intensity * 0.2}),
                0 0 ${dynamicSize * 9}px rgba(16, 185, 129, ${(shadowOpacity * 0.3) + intensity * 0.3})
              `;
            } else {
              const shadowOpacity = 0.5;
              dot.style.boxShadow = `
                0 0 ${dynamicSize * 3}px rgba(6, 78, 59, ${shadowOpacity + intensity * 0.1}),
                0 0 ${dynamicSize * 6}px rgba(4, 120, 87, ${(shadowOpacity * 0.7) + intensity * 0.2}),
                0 0 ${dynamicSize * 9}px rgba(5, 150, 105, ${(shadowOpacity * 0.4) + intensity * 0.3})
              `;
            }
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
        dot.style.opacity = (baseOpacity * (1 - index / trailLength * 0.6)).toString();
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
    
    // 启动动画循环
    const animationId = requestAnimationFrame(animateTrail);

    // 清理函数
    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
      
      // 清理所有trail元素
      trail.forEach(dot => {
        if (dot.parentNode) {
          document.body.removeChild(dot);
        }
      });
    };
  }, [theme]); // theme依赖会触发完整的重新创建

  return null;
};
