"use client";

/**
 * WORK CARD 3D SCENE
 * 
 * Subtle background distortion effect for work cards.
 * Uses a custom shader plane that distorts based on mouse position.
 * Low priority scene - only renders in viewport.
 */

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface WorkCardSceneProps {
  scrollProgress: number;
  mousePos: { x: number; y: number };
  hovered: boolean;
}

export function WorkCardScene({ scrollProgress, mousePos, hovered }: WorkCardSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Distortion material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uHover: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uHover;
        varying vec2 vUv;
        varying float vDistort;

        void main() {
          vUv = uv;
          vec3 pos = position;
          float dist = length(uv - uMouse);
          float wave = sin(dist * 10.0 - uTime * 2.0) * 0.1 * uHover;
          pos.z += wave;
          vDistort = wave;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uHover;
        varying vec2 vUv;
        varying float vDistort;

        void main() {
          vec3 colorA = vec3(0.05, 0.7, 0.6);
          vec3 colorB = vec3(0.4, 0.2, 0.8);
          float dist = length(vUv - uMouse);
          float glow = smoothstep(0.4, 0.0, dist) * uHover;
          vec3 color = mix(colorA, colorB, vUv.y + vDistort * 2.0);
          color += glow * vec3(0.2);
          gl_FragColor = vec4(color, 0.3 * (0.5 + uHover));
        }
      `,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uMouse.value.set(mousePos.x * 0.5 + 0.5, mousePos.y * 0.5 + 0.5);
    mat.uniforms.uHover.value = THREE.MathUtils.lerp(
      mat.uniforms.uHover.value,
      hovered ? 1.0 : 0.0,
      0.1
    );
  });

  return (
    <mesh ref={meshRef} material={material} position={[0, 0, -0.5]}>
      <planeGeometry args={[3, 2, 32, 32]} />
    </mesh>
  );
}
