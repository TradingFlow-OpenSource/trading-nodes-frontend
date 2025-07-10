
import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '@/hooks/useTheme';

const ParticleField = ({ theme }: { theme: 'dark' | 'light' }) => {
  const ref = useRef<THREE.Points>(null);
  
  const particlesPosition = new Float32Array(5000 * 3);
  
  for (let i = 0; i < 5000; i++) {
    particlesPosition[i * 3] = (Math.random() - 0.5) * 20;
    particlesPosition[i * 3 + 1] = (Math.random() - 0.5) * 20;
    particlesPosition[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  // 根据主题选择不同的粒子配色
  const particleColor = theme === 'dark' ? '#8b5cf6' : '#e0e7ff';
  const particleSize = theme === 'dark' ? 0.02 : 0.015;
  const particleOpacity = theme === 'dark' ? 1 : 0.6;

  return (
    <Points ref={ref} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={particleColor}
        size={particleSize}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={particleOpacity}
      />
    </Points>
  );
};

export const WebGLBackground = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ParticleField theme={theme} />
      </Canvas>
    </div>
  );
};
