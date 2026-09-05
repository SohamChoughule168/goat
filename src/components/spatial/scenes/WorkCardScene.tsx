'use client';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WorkCardSceneProps {
  scrollProgress: number;
}

export function WorkCardScene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <group>
      <mesh>
        <boxGeometry args={[4, 5.5, 0.3]} />
        <meshStandardMaterial color="#14b8a6" />
      </mesh>
    </group>
  );
}