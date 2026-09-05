"use client";

/**
 * PERSISTENT CANVAS PROVIDER
 * 
 * The single most important architectural change for $100M tier.
 * 
 * This component:
 * - Mounts a single R3F <Canvas> that persists across route changes
 * - Provides 3D context to all child components via tunnel-rat
 * - Manages global 3D state (camera, scroll, hover)
 * - Handles DPR-aware quality scaling
 * - Supports prefers-reduced-motion fallback
 * - Includes post-processing chain (Bloom, ChromaticAberration, Vignette, SMAA, Noise)
 * 
 * Usage in app/layout.tsx:
 *   <CanvasProvider>
 *     <ViewContext>
 *       {children}
 *     </ViewContext>
 *   </CanvasProvider>
 */

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor, View } from "@react-three/drei";
import { EffectComposer, EffectGroup, Bloom, Vignette, ChromaticAberration, Noise, SMAA } from "@react-three/postprocessing";
import { ACESFilmicToneMapping, SRGBColorSpace, type ColorRepresentation } from "three";
import { usePerformanceMonitor } from "@/components/v6/performance-optimizer";
import { useAdaptiveQuality } from "@/components/v6/performance-optimizer";

interface CanvasProviderProps {
  children: ReactNode;
  // Render only on client (this is always client, but explicit for clarity)
  className?: string;
}

export function CanvasProvider({ children, className = "" }: CanvasProviderProps) {
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);
  const [quality, setQuality] = useState<"high" | "medium" | "low">("high");
  const [reducedMotion, setReducedMotion] = useState(false);
  const { shouldReduceParticles } = useAdaptiveQuality();
  const { quality: perfQuality } = usePerformanceMonitor();

  const effectiveQuality = perfQuality as "high" | "medium" | "low";

  useEffect(() => {
    // Check prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Adaptive DPR based on device capability
  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as any).deviceMemory ?? 4;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobile || cores < 4 || memory < 4) {
      setDpr([1, 1.5]);
      setQuality("medium");
    } else if (cores < 8 || memory < 8) {
      setDpr([1, 2]);
      setQuality("high");
    } else {
      setDpr([1, 2.5]);
      setQuality("high");
    }
  }, []);

  // If user prefers reduced motion, render a static 2D fallback instead
  if (reducedMotion) {
    return <div className={`canvas-fallback ${className}`}>{children}</div>;
  }

  return (
    <div className={`canvas-perspective-container ${className}`}>
      <Canvas
        // Performance: adaptive quality
        dpr={dpr}
        performance={{ min: 0.5, max: 1, debounce: 200 }}
        // Shaders
        gl={{
          antialias: effectiveQuality === "high",
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        // Camera defaults
        camera={{
          position: [0, 0, 8],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        // Color management
        flat={false} // Use tone mapping
        // Events: listen to entire document for global interaction
        eventSource={typeof document !== "undefined" ? document.documentElement : undefined}
        eventPrefix="client"
        // Shadows
        shadows={effectiveQuality === "high" ? "soft" : false}
        // Style
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
        // R3F 9.0+ flat option removed; use linear workflow
        linear={false}
      >
        <PerformanceMonitor
          onIncline={() => setQuality("high")}
          onDecline={() => setQuality("medium")}
          flipflops={3}
          onFallback={() => setQuality("low")}
          factor={1}
        >
          <Suspense fallback={null}>
            <CanvasScene />
            <PreloadQueue />
            {/* Post-processing chain */}
            <PostProcessingChain quality={effectiveQuality as "high" | "medium" | "low"} />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>

      {/* DOM content rendered above the canvas */}
      <div className="canvas-dom-layer">
        {children}
      </div>
    </div>
  );
}

/**
 * Post-processing chain component
 * Applies: Bloom, Chromatic Aberration, Vignette, SMAA, Noise (quality-adaptive)
 */
function PostProcessingChain({ quality }: { quality: "high" | "medium" | "low" }) {
  // Use a runtime variable to prevent TypeScript from narrowing
  const qualityValue = quality;
  const isLow = qualityValue === "low";
  const isHigh = qualityValue === "high";
  
  if (isLow) return null;

  return (
    <EffectComposer
      multisampling={8}
      renderPriority={999}
      enabled={true}
      mergeMode="auto"
    >
      <EffectGroup>
        {/* Bloom - only on high/medium quality */}
        {!isLow && (
          <Bloom
            intensity={isHigh ? 0.6 : 0.4}
            luminanceThreshold={0.85}
            luminanceSmoothing={0.025}
            mipmapBlur
          />
        )}
        
        {/* Chromatic Aberration - subtle, only on high quality */}
        {isHigh && (
          <ChromaticAberration
            offset={[0.0008, 0.0008]}
            radialModulation={false}
          />
        )}
        
        {/* Vignette - always on, subtle */}
        <Vignette
          eskil={false}
          offset={0.3}
          darkness={isHigh ? 0.4 : 0.3}
        />
        
        {/* Noise - only on high quality, very subtle */}
        {isHigh && (
          <Noise
            opacity={0.02}
            premultiply={false}
          />
        )}
        
        {/* SMAA - anti-aliasing */}
        <SMAA
          preset={isHigh ? 2 : 1} // SMAAPreset.HIGH = 2, MEDIUM = 1
          edgeDetectionMode={0} // EdgeDetectionMode.COLOR = 0
        />
      </EffectGroup>
    </EffectComposer>
  );
}

/**
 * The main 3D scene container
 * Contains: camera rig, lighting, global effects
 */
function CanvasScene() {
  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.0} />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#a855f7" />
      <pointLight position={[5, -5, 5]} intensity={0.5} color="#14b8a6" />
    </>
  );
}

/**
 * Camera Rig - scroll-driven camera path
 * Reads global scroll progress and animates camera position
 */
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";

function CameraRig() {
  const { camera } = useThree();
  const targetPos = useRef(new Vector3(0, 0, 8));
  const lookAt = useRef(new Vector3(0, 0, 0));

  useFrame(() => {
    // Read global scroll progress from window
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const scrollHeight = typeof document !== "undefined" 
      ? Math.max(document.body.scrollHeight - window.innerHeight, 1) 
      : 1;
    const progress = Math.min(scrollY / scrollHeight, 1);

    // Cinematic camera path through the page
    targetPos.current.set(
      Math.sin(progress * Math.PI * 2) * 2,
      progress * 4 - 2,
      8 - progress * 3
    );
    lookAt.current.set(0, progress * 2 - 1, 0);

    camera.position.lerp(targetPos.current, 0.05);
    camera.lookAt(lookAt.current);
  });

  return null;
}

/**
 * Preload queue - preloads critical 3D assets
 */
import { Preload } from "@react-three/drei";
function PreloadQueue() {
  return <Preload all />;
}

/**
 * Helper: Check if WebGL is available
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return !!gl;
  } catch {
    return false;
  }
}

export default CanvasProvider;