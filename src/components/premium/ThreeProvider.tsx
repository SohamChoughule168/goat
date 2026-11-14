"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from "react";
import * as THREE from "three";

export interface CanvasOptions {
  cameraZ?: number;
  fov?: number;
  clearColor?: number;
  clearAlpha?: number;
  antialias?: boolean;
  powerPreference?: "high-performance" | "default" | "low-power";
}

export interface CanvasContext {
  id: string;
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  animationId: number | null;
  animate: (callback: (delta: number, time?: number) => void) => void;
  stop: () => void;
  render: () => void;
  resize: () => void;
}

interface ThreeContextValue {
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  registerCanvas: (canvas: HTMLCanvasElement, id: string, renderOptions?: CanvasOptions) => CanvasContext;
  unregisterCanvas: (id: string) => void;
  getCanvasContext: (id: string) => CanvasContext | undefined;
  performanceLevel: "high" | "medium" | "low";
  prefersReducedMotion: boolean;
}

const ThreeContext = createContext<ThreeContextValue | null>(null);

export function useThree() {
  const context = useContext(ThreeContext);
  if (!context) {
    throw new Error("useThree must be used within a ThreeProvider");
  }
  return context;
}

interface ThreeProviderProps {
  children: ReactNode;
}

export function ThreeProvider({ children }: ThreeProviderProps) {
  const [performanceLevel, setPerformanceLevel] = useState<"high" | "medium" | "low">("medium");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });
  const canvasesRef = useRef<Map<string, CanvasContext>>(new Map());

  // Detect performance level and reduced motion
  useEffect(() => {
    // Check reduced motion updates
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    // Detect performance level based on hardware in next tick
    const timer = setTimeout(() => {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      let level: "high" | "medium" | "low" = "medium";

      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const rendererName = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          const isMobile = /mobile|android|iphone|ipad/i.test(navigator.userAgent);
          const cores = navigator.hardwareConcurrency || 4;
          const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;

          if (isMobile || cores < 4 || memory < 4) {
            level = "low";
          } else if (cores >= 8 && memory >= 8 && /nvidia|amd|radeon|geforce|rtx|gtx/i.test(rendererName)) {
            level = "high";
          }
        }
      }
      setPerformanceLevel(level);
    }, 0);

    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);

  // Register an independent canvas with its own dedicated WebGLRenderer
  const registerCanvas = useCallback(
    (canvas: HTMLCanvasElement, id: string, renderOptions?: CanvasOptions): CanvasContext => {
      // If canvas already registered and active for this exact canvas element, reuse it
      const existing = canvasesRef.current.get(id);
      if (existing && existing.canvas === canvas) {
        return existing;
      }
      if (existing) {
        // Different canvas element for same id: clean up previous first
        const cleanupPrev = (existing as unknown as { _cleanup?: () => void })._cleanup;
        cleanupPrev?.();
        canvasesRef.current.delete(id);
      }

      // Create a dedicated WebGLRenderer for this canvas element
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: renderOptions?.antialias ?? (performanceLevel !== "low"),
        powerPreference: renderOptions?.powerPreference ?? (performanceLevel === "high" ? "high-performance" : "default"),
        preserveDrawingBuffer: false,
      });

      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      renderer.setPixelRatio(Math.min(dpr, performanceLevel === "high" ? 2 : 1.5));
      renderer.setClearColor(renderOptions?.clearColor ?? 0x000000, renderOptions?.clearAlpha ?? 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;

      const scene = new THREE.Scene();
      const initialWidth = canvas.clientWidth || canvas.parentElement?.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 800);
      const initialHeight = canvas.clientHeight || canvas.parentElement?.clientHeight || (typeof window !== "undefined" ? window.innerHeight : 600);
      const aspect = initialWidth > 0 && initialHeight > 0 ? initialWidth / initialHeight : 16 / 9;

      const camera = new THREE.PerspectiveCamera(renderOptions?.fov ?? 50, aspect, 0.1, 1000);
      camera.position.z = renderOptions?.cameraZ ?? 50;

      renderer.setSize(initialWidth, initialHeight, false);

      let animationId: number | null = null;
      let lastTime = 0;
      let isVisible = true;

      // Observe visibility to pause rendering when offscreen
      let observer: IntersectionObserver | null = null;
      if (typeof IntersectionObserver !== "undefined") {
        observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              isVisible = entry.isIntersecting;
            }
          },
          { threshold: 0.02 }
        );
        observer.observe(canvas);
      }

      const render = () => {
        try {
          renderer.render(scene, camera);
        } catch (err) {
          console.warn(`[ThreeProvider] render call on "${id}" encountered error:`, err);
        }
      };

      const stop = () => {
        if (animationId !== null) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      };

      const animate = (callback: (delta: number, time?: number) => void) => {
        stop();
        const tick = (time: number) => {
          const delta = lastTime === 0 ? 0.016 : Math.min((time - lastTime) * 0.001, 0.1);
          lastTime = time;
          if (isVisible) {
            callback(delta, time * 0.001);
            // CRITICAL FIX: explicitly call renderer.render(scene, camera) every frame
            renderer.render(scene, camera);
          }
          animationId = requestAnimationFrame(tick);
        };
        lastTime = performance.now();
        animationId = requestAnimationFrame(tick);
      };

      const resize = () => {
        const w = canvas.clientWidth || canvas.parentElement?.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 800);
        const h = canvas.clientHeight || canvas.parentElement?.clientHeight || (typeof window !== "undefined" ? window.innerHeight : 600);
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
          render();
        }
      };

      let resizeObserver: ResizeObserver | null = null;
      if (typeof ResizeObserver !== "undefined" && canvas.parentElement) {
        resizeObserver = new ResizeObserver(() => resize());
        resizeObserver.observe(canvas.parentElement);
      }

      if (typeof window !== "undefined") {
        window.addEventListener("resize", resize);
      }

      // Handle WebGL context loss cleanly
      const handleContextLost = (e: Event) => {
        e.preventDefault();
        console.warn(`[ThreeProvider] WebGL context lost for canvas "${id}"`);
        stop();
      };
      const handleContextRestored = () => {
        console.info(`[ThreeProvider] WebGL context restored for canvas "${id}"`);
        render();
      };
      canvas.addEventListener("webglcontextlost", handleContextLost, false);
      canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

      const cleanup = () => {
        stop();
        if (observer) observer.disconnect();
        if (resizeObserver) resizeObserver.disconnect();
        if (typeof window !== "undefined") {
          window.removeEventListener("resize", resize);
        }
        canvas.removeEventListener("webglcontextlost", handleContextLost);
        canvas.removeEventListener("webglcontextrestored", handleContextRestored);

        // Traverse scene and dispose resources
        scene.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry?.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material?.dispose();
            }
          } else if (obj instanceof THREE.Points) {
            obj.geometry?.dispose();
            obj.material?.dispose();
          } else if (obj instanceof THREE.Line) {
            obj.geometry?.dispose();
            obj.material?.dispose();
          }
        });

        // Dispose dedicated renderer
        try {
          renderer.dispose();
          renderer.forceContextLoss();
        } catch {
          // ignore disposal errors
        }
      };

      const context: CanvasContext = {
        id,
        canvas,
        scene,
        camera,
        renderer,
        animationId,
        animate,
        stop,
        render,
        resize,
      };

      (context as unknown as { _cleanup: () => void })._cleanup = cleanup;
      canvasesRef.current.set(id, context);
      return context;
    },
    [performanceLevel]
  );

  const unregisterCanvas = useCallback((id: string) => {
    const context = canvasesRef.current.get(id);
    if (context) {
      const cleanup = (context as unknown as { _cleanup?: () => void })._cleanup;
      cleanup?.();
      canvasesRef.current.delete(id);
    }
  }, []);

  const getCanvasContext = useCallback((id: string) => {
    return canvasesRef.current.get(id);
  }, []);

  const value: ThreeContextValue = {
    renderer: null,
    scene: null,
    camera: null,
    registerCanvas,
    unregisterCanvas,
    getCanvasContext,
    performanceLevel,
    prefersReducedMotion,
  };

  return <ThreeContext.Provider value={value}>{children}</ThreeContext.Provider>;
}

// Hook for easy canvas setup with state trigger for re-rendering
export function useThreeCanvas(id: string, options?: CanvasOptions) {
  const { registerCanvas, unregisterCanvas, prefersReducedMotion, performanceLevel } = useThree();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [context, setContext] = useState<CanvasContext | null>(null);

  const cameraZ = options?.cameraZ;
  const fov = options?.fov;
  const clearColor = options?.clearColor;
  const clearAlpha = options?.clearAlpha;
  const antialias = options?.antialias;
  const powerPreference = options?.powerPreference;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = registerCanvas(canvas, id, {
      cameraZ,
      fov,
      clearColor,
      clearAlpha,
      antialias,
      powerPreference,
    });
    setContext(ctx);

    return () => {
      unregisterCanvas(id);
      setContext(null);
    };
  }, [
    id,
    registerCanvas,
    unregisterCanvas,
    prefersReducedMotion,
    cameraZ,
    fov,
    clearColor,
    clearAlpha,
    antialias,
    powerPreference,
  ]);

  return { canvasRef, context, prefersReducedMotion, performanceLevel };
}

// Particle count presets based on performance level
export const PARTICLE_PRESETS = {
  high: { hero: 1500, sequence: 500, instrument: 1000, command: 600, wipe: 500, card: 150 },
  medium: { hero: 800, sequence: 300, instrument: 500, command: 400, wipe: 300, card: 80 },
  low: { hero: 300, sequence: 150, instrument: 200, command: 200, wipe: 150, card: 40 },
} as const;

// Geometry detail presets based on performance level
export const GEOMETRY_PRESETS = {
  high: { sphere: 64, torus: 32, icosahedron: 5 },
  medium: { sphere: 32, torus: 24, icosahedron: 4 },
  low: { sphere: 16, torus: 16, icosahedron: 3 },
} as const;

export function getParticleCount(type: keyof typeof PARTICLE_PRESETS.high, level: "high" | "medium" | "low") {
  return PARTICLE_PRESETS[level][type];
}

export function getGeometryDetail(type: keyof typeof GEOMETRY_PRESETS.high, level: "high" | "medium" | "low") {
  return GEOMETRY_PRESETS[level][type];
}