"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memory: number | null;
  gpuMemory: number | null;
  quality: "high" | "medium" | "low";
}

interface AdaptiveQualityOptions {
  targetFPS?: number;
  lowThreshold?: number;
  highThreshold?: number;
  sampleSize?: number;
  onQualityChange?: (quality: "high" | "medium" | "low") => void;
}

export function usePerformanceMonitor(options: AdaptiveQualityOptions = {}) {
  const {
    targetFPS = 60,
    lowThreshold = 30,
    highThreshold = 55,
    sampleSize = 60,
    onQualityChange
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    memory: null,
    gpuMemory: null,
    quality: "high"
  });

  const framesRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(performance.now());
  const qualityRef = useRef<"high" | "medium" | "low">("high");
  const rafRef = useRef<number>(0);
  const checkIntervalRef = useRef<number>(0);

  const updateQuality = useCallback((newQuality: "high" | "medium" | "low") => {
    if (qualityRef.current !== newQuality) {
      qualityRef.current = newQuality;
      setMetrics(prev => ({ ...prev, quality: newQuality }));
      onQualityChange?.(newQuality);
    }
  }, [onQualityChange]);

  useEffect(() => {
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    function tick(now: number) {
      frameCount++;
      const delta = now - lastTimeRef.current;
      framesRef.current.push(delta);
      if (framesRef.current.length > sampleSize) {
        framesRef.current.shift();
      }
      lastTimeRef.current = now;

      // Update FPS every second
      if (now - lastFpsUpdate >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastFpsUpdate = now;

        const avgFrameTime = framesRef.current.reduce((a, b) => a + b, 0) / framesRef.current.length;
        
        // Memory info (if available)
        let memory: number | null = null;
        if ((performance as any).memory) {
          memory = (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
        }

        setMetrics(prev => ({
          ...prev,
          fps,
          frameTime: avgFrameTime,
          memory
        }));

        // Adaptive quality logic
        if (fps < lowThreshold && qualityRef.current !== "low") {
          updateQuality("low");
        } else if (fps > highThreshold && qualityRef.current === "low") {
          updateQuality("medium");
        } else if (fps > targetFPS - 5 && qualityRef.current === "medium") {
          updateQuality("high");
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [targetFPS, lowThreshold, highThreshold, sampleSize, updateQuality]);

  const isOptimal = metrics.fps >= targetFPS - 5;

  return { ...metrics, deviceTier: detectDeviceTier(), isOptimal };
}

function detectDeviceTier(): "high" | "medium" | "low" {
  if (typeof window === "undefined") return "high";
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as any).deviceMemory ?? 4;
  if (cores >= 8 && memory >= 8) return "high";
  if (cores >= 4 && memory >= 4) return "medium";
  return "low";
}

// Hook for adaptive rendering
export function useAdaptiveQuality() {
  const { quality, fps, frameTime } = usePerformanceMonitor();

  const shouldReduceMotion = quality === "low";
  const shouldReduceParticles = quality !== "high";
  const shouldDisableBloom = quality === "low";
  const shouldDisableShadows = quality !== "high";
  const shouldUseSimpleShaders = quality === "low";
  const targetParticleCount = quality === "high" ? 10000 : quality === "medium" ? 5000 : 2000;

  return {
    quality,
    fps,
    frameTime,
    shouldReduceMotion,
    shouldReduceParticles,
    shouldDisableBloom,
    shouldDisableShadows,
    shouldUseSimpleShaders,
    targetParticleCount
  };
}

// WebGL performance optimizer
export function useWebGLOptimizer(renderer: any, scene: any, camera: any) {
  const { quality, shouldDisableBloom, shouldDisableShadows, shouldUseSimpleShaders } = useAdaptiveQuality();
  const prevQualityRef = useRef(quality);

  useEffect(() => {
    if (!renderer || !scene) return;

    // Adjust renderer settings based on quality
    if (quality === "low") {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
      renderer.shadowMap.enabled = false;
      renderer.toneMapping = THREE.LinearToneMapping;
    } else if (quality === "medium") {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
    } else {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
    }

    // Adjust scene materials
    scene.traverse((object: any) => {
      if (object.isMesh && object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material: any) => {
          if (shouldUseSimpleShaders && material.isShaderMaterial) {
            // Could swap to simpler shader
          }
          if (shouldDisableShadows) {
            material.castShadow = false;
            material.receiveShadow = false;
          }
        });
      }
    });
  }, [quality, shouldDisableShadows, shouldUseSimpleShaders]);

  // LOD system for meshes
  const createLOD = useCallback((
    highDetail: any,
    mediumDetail: any,
    lowDetail: any,
    distances: [number, number] = [10, 30]
  ) => {
    const lod = new THREE.LOD();
    lod.addLevel(highDetail, 0);
    lod.addLevel(mediumDetail, distances[0]);
    lod.addLevel(lowDetail, distances[1]);
    return lod;
  }, []);

  return { quality, createLOD };
}

// Frustum culling helper
export function useFrustumCulling(camera: any, objects: any[]) {
  const frustumRef = useRef(new THREE.Frustum());
  const projScreenMatrixRef = useRef(new THREE.Matrix4());

  useEffect(() => {
    if (!camera) return;

    const checkVisibility = () => {
      projScreenMatrixRef.current.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      frustumRef.current.setFromProjectionMatrix(projScreenMatrixRef.current);

      objects.forEach(obj => {
        if (obj.mesh && obj.mesh.geometry.boundingSphere) {
          const sphere = obj.mesh.geometry.boundingSphere.clone().applyMatrix4(obj.mesh.matrixWorld);
          obj.mesh.visible = frustumRef.current.intersectsSphere(sphere);
        }
      });
    };

    // Update on camera change
    camera.addEventListener("change", checkVisibility);
    
    const interval = setInterval(checkVisibility, 100);
    
    return () => {
      camera.removeEventListener("change", checkVisibility);
      clearInterval(interval);
    };
  }, [camera, objects]);
}

// Instanced rendering helper
export function createInstancedMesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  count: number,
  transformFn: (index: number, matrix: THREE.Matrix4) => void
) {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  
  const matrix = new THREE.Matrix4();
  const dummy = new THREE.Object3D();
  
  for (let i = 0; i < count; i++) {
    transformFn(i, matrix);
    mesh.setMatrixAt(i, matrix);
  }
  
  mesh.instanceMatrix.needsUpdate = true;
  mesh.computeBoundingSphere();
  
  return mesh;
}

// Performance budget checker
export function usePerformanceBudget(budget: {
  maxFrameTime?: number;
  maxMemory?: number;
  maxDrawCalls?: number;
}) {
  const { frameTime, memory } = usePerformanceMonitor();
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    const newWarnings: string[] = [];
    
    if (budget.maxFrameTime && frameTime > budget.maxFrameTime) {
      newWarnings.push(`Frame time ${frameTime.toFixed(1)}ms exceeds budget ${budget.maxFrameTime}ms`);
    }
    
    if (budget.maxMemory && memory && memory > budget.maxMemory) {
      newWarnings.push(`Memory ${memory.toFixed(0)}MB exceeds budget ${budget.maxMemory}MB`);
    }
    
    setWarnings(newWarnings);
  }, [frameTime, memory, budget]);

  return warnings;
}

// RequestIdleCallback polyfill
export function scheduleIdleWork(callback: (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void, timeout = 2000) {
  if ("requestIdleCallback" in window) {
    return (window as any).requestIdleCallback(callback, { timeout });
  }
  
  // Polyfill
  const start = Date.now();
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
    });
  }, 1);
}

export function cancelIdleWork(id: number) {
  if ("cancelIdleCallback" in window) {
    (window as any).cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

// Web Worker for heavy computation
export function useWebWorker<T, R>(
  workerCode: string,
  onMessage: (result: R) => void
) {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const blob = new Blob([workerCode], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    
    worker.onmessage = (e) => onMessage(e.data);
    worker.onerror = (e) => console.error("Worker error:", e);
    
    workerRef.current = worker;
    
    return () => {
      worker.terminate();
      URL.revokeObjectURL(url);
    };
  }, [workerCode, onMessage]);

  const postMessage = useCallback((data: T) => {
    workerRef.current?.postMessage(data);
  }, []);

  return { postMessage };
}

// Texture streaming for large assets
export function useTextureStreaming(textures: string[], priority: number[]) {
  const loadedRef = useRef<Set<string>>(new Set());
  const loadingRef = useRef<Set<string>>(new Set());

  const loadTexture = useCallback(async (url: string, priority: number) => {
    if (loadedRef.current.has(url) || loadingRef.current.has(url)) return;
    
    loadingRef.current.add(url);
    
    // Use requestIdleCallback for low priority
    if (priority < 5) {
      scheduleIdleWork(async () => {
        try {
          const texture = await new Promise<THREE.Texture>((resolve, reject) => {
            const loader = new THREE.TextureLoader();
            loader.load(url, resolve, undefined, reject);
          });
          loadedRef.current.add(url);
        } catch (e) {
          console.error("Failed to load texture:", url);
        } finally {
          loadingRef.current.delete(url);
        }
      });
    } else {
      // High priority - load immediately
      try {
        const texture = await new Promise<THREE.Texture>((resolve, reject) => {
          const loader = new THREE.TextureLoader();
          loader.load(url, resolve, undefined, reject);
        });
        loadedRef.current.add(url);
      } catch (e) {
        console.error("Failed to load texture:", url);
      } finally {
        loadingRef.current.delete(url);
      }
    }
  }, []);

  useEffect(() => {
    // Sort by priority and load
    const sorted = textures
      .map((url, i) => ({ url, priority: priority[i] || 0 }))
      .sort((a, b) => b.priority - a.priority);
    
    sorted.forEach(({ url, priority }) => loadTexture(url, priority));
  }, [textures, priority, loadTexture]);

  return { loaded: loadedRef.current, loading: loadingRef.current };
}

/**
 * PERFORMANCE PROVIDER
 * 
 * Wraps the app at root level to provide global performance monitoring.
 * Manages FPS tracking, adaptive quality, and global performance state.
 * 
 * Usage in app/layout.tsx:
 *   <PerformanceProvider>
 *     {children}
 *   </PerformanceProvider>
 */
import { type ReactNode, createContext, useContext } from "react";

interface PerformanceContextValue {
  fps: number;
  quality: "high" | "medium" | "low";
  isOptimal: boolean;
  deviceTier: "high" | "medium" | "low";
}

const PerformanceContext = createContext<PerformanceContextValue | null>(null);

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const { fps, quality, isOptimal, deviceTier } = usePerformanceMonitor();
  
  return (
    <PerformanceContext.Provider value={{ fps, quality, isOptimal, deviceTier }}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance() {
  const ctx = useContext(PerformanceContext);
  return ctx || { fps: 60, quality: "high" as const, isOptimal: true, deviceTier: "high" as const };
}