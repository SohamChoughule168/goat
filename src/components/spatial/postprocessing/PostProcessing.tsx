'use client';

import { useEffect, useRef, useMemo } from 'react';
import { EffectComposer, RenderPass, EffectPass, BloomEffect, ChromaticAberrationEffect, VignetteEffect, NoiseEffect, SMAAEffect } from 'postprocessing';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePerformanceMonitor } from '@/components/v6/performance-optimizer';
import { useAdaptiveQuality } from '@/components/v6/performance-optimizer';

interface PostProcessingProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function PostProcessing({ children, enabled = true }: PostProcessingProps) {
  const { quality } = usePerformanceMonitor();
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);

  const composerRef = useRef<any>(null);
  const renderPassRef = useRef<any>(null);
  const effectPassRef = useRef<any>(null);

  const effects = useMemo(() => {
    if (!enabled || quality === 'low') return [];

    const effectsList: any[] = [];

    effectsList.push(
      new BloomEffect({
        intensity: 0.5,
        mipmapBlur: true,
        resolutionScale: quality === 'high' ? 1 : 0.5,
      })
    );

    if (quality === 'high') {
      effectsList.push(
        new ChromaticAberrationEffect({
          offset: new THREE.Vector2(0.001, 0.0005),
          radialModulation: true,
          modulationOffset: 0,
        })
      );
    }

    effectsList.push(
      new VignetteEffect({
        darkness: 0.3,
      })
    );

    effectsList.push(
      new NoiseEffect({
        premultiply: true,
      })
    );

    effectsList.push(
      new SMAAEffect()
    );

    return effectsList;
  }, [enabled, quality]);

  const composer = useMemo(() => {
    if (!gl || !scene || !camera) return null;
    
    const composer = new EffectComposer(gl, {
      frameBufferType: THREE.HalfFloatType,
    });
    
    return composer;
  }, [gl, scene, camera]);

  useEffect(() => {
    if (!composer || !scene || !camera) return;

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    renderPassRef.current = renderPass;

    if (effects.length > 0) {
      const effectPass = new EffectPass(camera, ...effects);
      composer.addPass(effectPass);
      effectPassRef.current = effectPass;
    }

    return () => {
      composer.removePass(renderPass);
      if (effectPassRef.current) {
        composer.removePass(effectPassRef.current);
      }
      composer.dispose();
    };
  }, [composer, effects]);

  useFrame((state, delta) => {
    if (composer && enabled) {
      composer.render(delta);
    }
  });

  return (
    <>
      {children}
    </>
  );
}

export function usePostProcessing() {
  const { quality } = usePerformanceMonitor();

  return {
    quality,
    isHighQuality: quality === 'high',
    isLowQuality: quality === 'low',
  };
}

export default PostProcessing;