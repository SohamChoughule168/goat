"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from "react";
import * as THREE from "three";

interface ThreeContextValue {
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  registerCanvas: (canvas: HTMLCanvasElement, id: string, renderOptions?: { clearColor?: number; clearAlpha?: number }) => void;
  unregisterCanvas: (id: string) => void;
  getCanvasContext: (id: string) => CanvasContext | undefined;
  performanceLevel: "high" | "medium" | "low";
  prefersReducedMotion: boolean;
}

interface CanvasContext {
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  animationId: number | null;
  animate: (callback: (delta: number) => void) => void;
  stop: () => void;
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
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [performanceLevel, setPerformanceLevel] = useState<"high" | "medium" | "low">("medium");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const canvasesRef = useRef<Map<string, CanvasContext>>(new Map());
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  // Detect performance level and reduced motion
  useEffect(() => {
    // Check reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    // Detect performance level based on hardware
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    let level: "high" | "medium" | "low" = "medium";

    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        const isMobile = /mobile|android|iphone|ipad/i.test(navigator.userAgent);
        const cores = navigator.hardwareConcurrency || 4;
        const memory = (navigator as any).deviceMemory || 4;

        if (isMobile || cores < 4 || memory < 4) {
          level = "low";
        } else if (cores >= 8 && memory >= 8 && /nvidia|amd|radeon|geforce/i.test(renderer)) {
          level = "high";
        }
      }
    }
    setPerformanceLevel(level);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Create shared renderer on first canvas registration
  const registerCanvas = useCallback((canvas: HTMLCanvasElement, id: string, renderOptions?: { clearColor?: number; clearAlpha?: number }) => {
    if (!rendererRef.current) {
      const newRenderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: performanceLevel !== "low",
        powerPreference: performanceLevel === "high" ? "high-performance" : "default",
        preserveDrawingBuffer: false,
      });
      newRenderer.setPixelRatio(Math.min(window.devicePixelRatio, performanceLevel === "high" ? 2 : 1.5));
      newRenderer.setClearColor(renderOptions?.clearColor ?? 0x000000, renderOptions?.clearAlpha ?? 0);
      newRenderer.autoClear = false;
      rendererRef.current = newRenderer;
      setRenderer(newRenderer);
    } else {
      // Reuse existing renderer with new canvas
      rendererRef.current.domElement = canvas;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 50;

    let animationId: number | null = null;
    let lastTime = 0;

    const animate = (callback: (delta: number) => void) => {
      const tick = (time: number) => {
        const delta = (time - lastTime) * 0.001;
        lastTime = time;
        callback(delta);
        animationId = requestAnimationFrame(tick);
      };
      lastTime = performance.now();
      animationId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    const context: CanvasContext = { canvas, scene, camera, animationId, animate, stop };
    canvasesRef.current.set(id, context);

    // Handle resize
    const handleResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      if (rendererRef.current) {
        rendererRef.current.setSize(canvas.clientWidth, canvas.clientHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // Store cleanup
    (context as any)._cleanup = () => {
      window.removeEventListener("resize", handleResize);
      stop();
    };
  }, [performanceLevel]);

  const unregisterCanvas = useCallback((id: string) => {
    const context = canvasesRef.current.get(id);
    if (context) {
      context.stop();
      (context as any)._cleanup?.();
      context.scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
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
      canvasesRef.current.delete(id);
    }

    // Dispose renderer if no more canvases
    if (canvasesRef.current.size === 0 && rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
      setRenderer(null);
    }
  }, []);

  const getCanvasContext = useCallback((id: string) => {
    return canvasesRef.current.get(id);
  }, []);

  const value: ThreeContextValue = {
    renderer,
    scene: null, // Each canvas has its own scene
    camera: null, // Each canvas has its own camera
    registerCanvas,
    unregisterCanvas,
    getCanvasContext,
    performanceLevel,
    prefersReducedMotion,
  };

  return <ThreeContext.Provider value={value}>{children}</ThreeContext.Provider>;
}

// Hook for easy canvas setup
export function useThreeCanvas(id: string, options?: { cameraZ?: number; fov?: number; clearColor?: number; clearAlpha?: number }) {
  const { registerCanvas, unregisterCanvas, getCanvasContext, prefersReducedMotion, performanceLevel } = useThree();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasContext | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    mountedRef.current = true;
    registerCanvas(canvas, id, { clearColor: options?.clearColor, clearAlpha: options?.clearAlpha });
    const ctx = getCanvasContext(id);
    if (ctx) {
      contextRef.current = ctx;
      if (options?.cameraZ) ctx.camera.position.z = options.cameraZ;
      if (options?.fov) ctx.camera.fov = options.fov;
      ctx.camera.updateProjectionMatrix();
    }

    return () => {
      mountedRef.current = false;
      unregisterCanvas(id);
      contextRef.current = null;
    };
  }, [id, registerCanvas, unregisterCanvas, getCanvasContext, prefersReducedMotion, options?.cameraZ, options?.fov, options?.clearColor, options?.clearAlpha]);

  return { canvasRef, context: contextRef.current, prefersReducedMotion, performanceLevel };
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