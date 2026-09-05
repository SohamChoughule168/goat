'use client';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AILabSceneProps {
  scrollProgress: number;
}

export function AILabScene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#14b8a6" />
      </mesh>
    </group>
  );
}