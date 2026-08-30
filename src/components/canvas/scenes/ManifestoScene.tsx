"use client";

/**
 * MANIFESTO 3D SCENE - Liquid Metal Surface
 * 
 * A flowing liquid mercury surface that responds to scroll position.
 * Uses a custom shader with:
 * - Simplex noise displacement
 * - Iridescent fresnel
 * - Scroll-driven flow direction
 * - Mouse parallax
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface ManifestoSceneProps {
  scrollProgress: number;
  mousePos: { x: number; y: number };
}

export function ManifestoScene({ scrollProgress, mousePos }: ManifestoSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Custom material with onBeforeCompile injection
  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: "#14b8a6",
      metalness: 1.0,
      roughness: 0.1,
      transmission: 0.5,
      thickness: 0.5,
      ior: 2.0,
      envMapIntensity: 2.0,
      iridescence: 1.0,
      iridescenceIOR: 1.8,
      iridescenceThicknessRange: [100, 800] as [number, number],
    });

    // Inject custom shader code
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uScroll = { value: 0 };
      shader.uniforms.uMouse = { value: new THREE.Vector2(0, 0) };

      // Vertex shader injection
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `#include <common>
         uniform float uTime;
         uniform float uScroll;
         uniform vec2 uMouse;`
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
         // Liquid metal flow
         float t = uTime * 0.3;
         vec3 transformed = vec3(position);
         // Scroll-driven flow direction
         float flow = sin(position.x * 2.0 + uScroll * 6.28) * 0.15;
         float flow2 = cos(position.y * 2.0 + uScroll * 6.28) * 0.15;
         transformed.z += flow * (1.0 - uScroll * 0.3);
         transformed.z += flow2 * (1.0 - uScroll * 0.3);
         // Mouse parallax
         transformed.xy += uMouse * 0.1;`
      );

      // Fragment shader injection
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `#include <common>
         uniform float uTime;
         uniform float uScroll;`
      );

      // Store reference for animation
      mat.userData.shader = shader;
    };

    return mat;
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || !material.userData.shader) return;

    const shader = material.userData.shader;
    shader.uniforms.uTime.value = state.clock.elapsedTime;
    shader.uniforms.uScroll.value = scrollProgress;
    shader.uniforms.uMouse.value.set(mousePos.x, mousePos.y);

    // Slow rotation
    meshRef.current.rotation.y += delta * 0.05;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;

    // Float
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} material={material}>
        <planeGeometry args={[8, 6, 128, 128]} />
      </mesh>

      {/* Lighting for the liquid metal */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.0} color="#14b8a6" />
      <pointLight position={[-5, -5, 5]} intensity={1.0} color="#a855f7" />
      <directionalLight position={[0, 10, 5]} intensity={0.5} color="#ffffff" />
    </group>
  );
}
