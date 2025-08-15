// src/components/ui/R3FHero.tsx
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

// Custom particle field
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  const particlesCount = 5000;
  const positions = useMemo(() => {
    const arr = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 50;
    }
    return arr;
  }, []);

  useFrame(({ mouse }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x += 0.0005;
      pointsRef.current.rotation.y += 0.0005;
      // Parallax effect with cursor
      pointsRef.current.rotation.y += mouse.x * 0.0002;
      pointsRef.current.rotation.x += mouse.y * 0.0002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]} // FIX: args is required for TS
        />
      </bufferGeometry>
      <pointsMaterial color="#00ffff" size={0.03} />
    </points>
  );
}



export default function R3FHero() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        {/* Background stars */}
        <Stars radius={100} depth={50} count={5000} factor={4} fade />
        
        {/* Custom particles */}
        <ParticleField />

      

        {/* Controls */}
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
