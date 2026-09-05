'use client';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ManifestoSceneProps {
  scrollProgress: number;
}

export function ManifestoScene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="#14b8a6" />
      </mesh>
    </group>
  );
}