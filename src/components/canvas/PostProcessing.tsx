"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { usePerformanceMonitor } from "@/components/v6/performance-optimizer";
import { useAdaptiveQuality } from "@/components/v6/performance-optimizer";

interface PostProcessingProps {
  enabled?: boolean;
}

export function PostProcessing({ enabled = true }: PostProcessingProps) {
  const { quality } = usePerformanceMonitor();
  const { shouldReduceParticles } = useAdaptiveQuality();

  const effects = useMemo(() => {
    if (!enabled) return [];
    
    const fx: any[] = [];
    
    // Vignette - always on, subtle
    fx.push({
      type: 'vignette',
      eskil: false,
      offset: 0.3,
      darkness: quality === "high" ? 0.4 : 0.3,
    });
    
    // Bloom - only on high/medium quality
    if (quality !== "low") {
      fx.push({
        type: 'bloom',
        intensity: quality === "high" ? 0.6 : 0.4,
        radius: quality === "high" ? 0.8 : 0.5,
        threshold: 0.85,
      });
    }
    
    // Chromatic Aberration - subtle, only on high quality
    if (quality === "high") {
      fx.push({
        type: 'chromaticAberration',
        offset: [0.0008, 0.0008],
        radialModulation: false,
      });
      
      // Film grain / noise - only on high quality, very subtle
      fx.push({
        type: 'noise',
        opacity: 0.02,
        premultiply: false,
      });
    }
    
    return fx;
  }, [enabled, quality]);

  // This is a data provider component - actual effects are applied in PostProcessingCanvas
  return null;
}

interface PostProcessingCanvasProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function PostProcessingCanvas({ children, enabled = true }: PostProcessingCanvasProps) {
  const { quality } = usePerformanceMonitor();
  const { shouldReduceParticles } = useAdaptiveQuality();

  if (!enabled || quality === "low") {
    return <>{children}</>;
  }

  // For now, just render children - post-processing will be added via a separate canvas overlay
  // or by extending the main canvas
  return <>{children}</>;
}

export default PostProcessingCanvas;