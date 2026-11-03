"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Quality = "high" | "medium" | "low";
type DeviceTier = "high" | "medium" | "low";

export interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

interface PerformanceContextValue {
  quality: Quality;
  fps: number;
  frameTime: number;
  shouldReduceMotion: boolean;
  shouldReduceParticles: boolean;
  shouldDisableBloom: boolean;
  shouldDisableShadows: boolean;
  shouldUseSimpleShaders: boolean;
  targetParticleCount: number;
  isOptimal: boolean;
  deviceTier: DeviceTier;
}

const SAMPLE_INTERVAL_MS = 500;
const HIGH_FPS = 55;
const LOW_FPS = 30;
const FPS_REPORT_DELTA = 3;

const DEFAULT_PERFORMANCE: PerformanceContextValue = {
  quality: "high",
  fps: 60,
  frameTime: 16.67,
  shouldReduceMotion: false,
  shouldReduceParticles: false,
  shouldDisableBloom: false,
  shouldDisableShadows: false,
  shouldUseSimpleShaders: false,
  targetParticleCount: 10000,
  isOptimal: true,
  deviceTier: "high",
};

const PerformanceContext = createContext<PerformanceContextValue>(DEFAULT_PERFORMANCE);

function detectDeviceTier(): DeviceTier {
  if (typeof navigator === "undefined") return "high";
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as NavigatorWithMemory).deviceMemory || 4;
  if (cores >= 8 && memory >= 8) return "high";
  if (cores >= 4 && memory >= 4) return "medium";
  return "low";
}

function getServerDeviceTier(): DeviceTier {
  return "high";
}

function subscribeToDeviceTier() {
  return () => {};
}

function deriveQuality(fps: number): Quality {
  if (fps >= HIGH_FPS) return "high";
  if (fps >= LOW_FPS) return "medium";
  return "low";
}

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<{ fps: number; frameTime: number; quality: Quality }>({
    fps: 60,
    frameTime: 16.67,
    quality: "high",
  });
  const qualityRef = useRef<Quality>("high");
  const deviceTier = useSyncExternalStore(subscribeToDeviceTier, detectDeviceTier, getServerDeviceTier);

  useEffect(() => {
    let raf = 0;
    let frames = 0;
    let windowStart = performance.now();

    const loop = (now: number) => {
      frames += 1;
      const elapsed = now - windowStart;

      if (elapsed >= SAMPLE_INTERVAL_MS) {
        const fps = Math.max(1, Math.round((frames * 1000) / elapsed));
        frames = 0;
        windowStart = now;

        const quality = deriveQuality(fps);
        const qualityChanged = qualityRef.current !== quality;
        qualityRef.current = quality;

        setMetrics((prev) => {
          if (!qualityChanged && Math.abs(prev.fps - fps) < FPS_REPORT_DELTA) return prev;
          return { fps, frameTime: Math.round((1000 / fps) * 100) / 100, quality };
        });
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const { fps, frameTime, quality } = metrics;

  const value = useMemo<PerformanceContextValue>(
    () => ({
      quality,
      fps,
      frameTime,
      shouldReduceMotion: quality === "low",
      shouldReduceParticles: quality !== "high",
      shouldDisableBloom: quality === "low",
      shouldDisableShadows: quality !== "high",
      shouldUseSimpleShaders: quality === "low",
      targetParticleCount: quality === "high" ? 10000 : quality === "medium" ? 5000 : 2000,
      isOptimal: fps >= HIGH_FPS,
      deviceTier,
    }),
    [quality, fps, frameTime, deviceTier]
  );

  return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>;
}

export function usePerformanceMonitor() {
  return useContext(PerformanceContext);
}

export function useAdaptiveQuality() {
  const {
    quality,
    fps,
    frameTime,
    shouldReduceMotion,
    shouldReduceParticles,
    shouldDisableBloom,
    shouldDisableShadows,
    shouldUseSimpleShaders,
    targetParticleCount,
  } = useContext(PerformanceContext);

  return {
    quality,
    fps,
    frameTime,
    shouldReduceMotion,
    shouldReduceParticles,
    shouldDisableBloom,
    shouldDisableShadows,
    shouldUseSimpleShaders,
    targetParticleCount,
  };
}
