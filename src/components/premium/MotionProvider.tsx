"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { DESIGN_COLORS, THREE_PRESETS, type ThreePresets } from "@/components/premium/DesignSystem";

// ============================================
// MOTION PROVIDER - Combines Three.js + Motion
// ============================================

interface ThreeContextValue {
  renderer: THREE.WebGLRenderer | null;
  registerCanvas: (canvas: HTMLCanvasElement, id: string, options?: CanvasOptions) => CanvasContext;
  unregisterCanvas: (id: string) => void;
  getCanvasContext: (id: string) => CanvasContext | undefined;
  performanceLevel: "high" | "medium" | "low";
  prefersReducedMotion: boolean;
  devicePixelRatio: number;
}

interface CanvasOptions {
  cameraZ?: number;
  fov?: number;
  clearColor?: number;
  clearAlpha?: number;
  antialias?: boolean;
  powerPreference?: "high-performance" | "default" | "low-power";
}

interface CanvasContext {
  id: string;
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  animationId: number | null;
  animate: (callback: (delta: number, time: number) => void) => void;
  stop: () => void;
  resize: () => void;
  dispose: () => void;
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
  fallbackRenderer?: boolean;
}

export function ThreeProvider({ children, fallbackRenderer = true }: ThreeProviderProps) {
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [performanceLevel, setPerformanceLevel] = useState<"high" | "medium" | "low">("medium");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [devicePixelRatio, setDevicePixelRatio] = useState(1);
  
  const canvasesRef = useRef<Map<string, CanvasContext>>(new Map());
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const performanceLevelRef = useRef(performanceLevel);
  const prefersReducedMotionRef = useRef(prefersReducedMotion);

  // Keep refs in sync
  useEffect(() => { performanceLevelRef.current = performanceLevel; }, [performanceLevel]);
  useEffect(() => { prefersReducedMotionRef.current = prefersReducedMotion; }, [prefersReducedMotion]);

  // Detect performance level and preferences
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    // Device pixel ratio
    setDevicePixelRatio(window.devicePixelRatio || 1);
    const dprHandler = () => setDevicePixelRatio(window.devicePixelRatio || 1);
    window.addEventListener("resize", dprHandler);

    // Performance detection
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
        } else if (cores >= 8 && memory >= 8 && /nvidia|amd|radeon|geforce|rtx|gtx/i.test(renderer)) {
          level = "high";
        }
      }
    }
    setPerformanceLevel(level);

    return () => {
      mediaQuery.removeEventListener("change", handler);
      window.removeEventListener("resize", dprHandler);
    };
  }, []);

  // Create or reuse shared renderer
  const getOrCreateRenderer = useCallback((canvas: HTMLCanvasElement, options: CanvasOptions = {}) => {
    const { 
      antialias = performanceLevel !== "low",
      powerPreference = performanceLevel === "high" ? "high-performance" : "default",
      clearColor = 0x000000,
      clearAlpha = 0,
    } = options;

    if (!rendererRef.current) {
      const newRenderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias,
        powerPreference,
        preserveDrawingBuffer: false,
        logarithmicDepthBuffer: true,
      });
      
      newRenderer.setPixelRatio(Math.min(devicePixelRatio, performanceLevel === "high" ? 2 : 1.5));
      newRenderer.setClearColor(clearColor, clearAlpha);
      newRenderer.autoClear = true;
      // newRenderer.physicallyCorrectLights = true; // Removed in Three.js r187+
      newRenderer.outputColorSpace = THREE.SRGBColorSpace;
      newRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      newRenderer.toneMappingExposure = 1;
      
      // Enable shadow mapping for high performance
      if (performanceLevel === "high") {
        newRenderer.shadowMap.enabled = true;
        newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }
      
      rendererRef.current = newRenderer;
      setRenderer(newRenderer);
    } else {
      // Update existing renderer with new canvas
      rendererRef.current.domElement = canvas;
      rendererRef.current.setPixelRatio(Math.min(devicePixelRatio, performanceLevel === "high" ? 2 : 1.5));
    }

    return rendererRef.current;
  }, [devicePixelRatio, performanceLevel]);

  // Register a new canvas
  const registerCanvas = useCallback((
    canvas: HTMLCanvasElement, 
    id: string, 
    options: CanvasOptions = {}
  ): CanvasContext => {
    const renderer = getOrCreateRenderer(canvas, options);
    
    // Create scene
    const scene = new THREE.Scene();
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      options.fov || 50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.z = options.cameraZ || 50;

    let animationId: number | null = null;
    let lastTime = 0;
    let isAnimating = false;

    const animate = (callback: (delta: number, time: number) => void) => {
      if (isAnimating) return;
      isAnimating = true;
      
      const tick = (time: number) => {
        if (!isAnimating) return;
        
        const delta = (time - lastTime) * 0.001;
        lastTime = time;
        
        // Cap delta to prevent huge jumps
        const cappedDelta = Math.min(delta, 1/30);
        
        callback(cappedDelta, time * 0.001);
        
        // Render the scene
        if (rendererRef.current) {
          rendererRef.current.render(scene, camera);
        }
        
        animationId = requestAnimationFrame(tick);
      };
      
      lastTime = performance.now();
      animationId = requestAnimationFrame(tick);
    };

    const stop = () => {
      isAnimating = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    const resize = () => {
      if (!rendererRef.current) return;
      
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(canvas.clientWidth, canvas.clientHeight);
      rendererRef.current.setPixelRatio(Math.min(devicePixelRatio, performanceLevel === "high" ? 2 : 1.5));
    };

    const dispose = () => {
      stop();
      
      // Dispose Three.js objects
      scene.traverse((obj) => {
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
      
      // Remove resize listener
      window.removeEventListener("resize", resize);
    };

    // Handle resize
    window.addEventListener("resize", resize);
    resize();

    const context: CanvasContext = {
      id,
      canvas,
      scene,
      camera,
      renderer,
      animationId,
      animate,
      stop,
      resize,
      dispose,
    };

    canvasesRef.current.set(id, context);
    return context;
  }, [getOrCreateRenderer, devicePixelRatio, performanceLevel]);

  const unregisterCanvas = useCallback((id: string) => {
    const context = canvasesRef.current.get(id);
    if (context) {
      context.dispose();
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
    registerCanvas,
    unregisterCanvas,
    getCanvasContext,
    performanceLevel,
    prefersReducedMotion,
    devicePixelRatio,
  };

  return (
    <ThreeContext.Provider value={value}>
      {children}
    </ThreeContext.Provider>
  );
}

// ============================================
// HOOKS
// ============================================

export function useThreeCanvas(
  id: string, 
  options: CanvasOptions = {},
  deps: React.DependencyList = []
) {
  const { registerCanvas, unregisterCanvas, getCanvasContext, prefersReducedMotion, performanceLevel, devicePixelRatio } = useThree();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasContext | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    mountedRef.current = true;
    const ctx = registerCanvas(canvas, id, options);
    contextRef.current = ctx;

    return () => {
      mountedRef.current = false;
      unregisterCanvas(id);
      contextRef.current = null;
    };
  }, [id, registerCanvas, unregisterCanvas, prefersReducedMotion, options.cameraZ, options.fov, ...deps]);

  // Update camera on options change
  useEffect(() => {
    if (contextRef.current && (options.cameraZ || options.fov)) {
      if (options.cameraZ) contextRef.current.camera.position.z = options.cameraZ;
      if (options.fov) contextRef.current.camera.fov = options.fov;
      contextRef.current.camera.updateProjectionMatrix();
    }
  }, [options.cameraZ, options.fov]);

  return { 
    canvasRef, 
    context: contextRef.current, 
    prefersReducedMotion, 
    performanceLevel,
    devicePixelRatio,
  };
}

// Particle count helper
export function getParticleCount(
  type: keyof ThreePresets["particleCounts"]["high"],
  level: "high" | "medium" | "low"
) {
  return THREE_PRESETS.particleCounts[level][type];
}

// Geometry detail helper
export function getGeometryDetail(
  type: keyof ThreePresets["geometryDetail"]["high"],
  level: "high" | "medium" | "low"
) {
  return THREE_PRESETS.geometryDetail[level][type];
}

// Post-processing helper
export function shouldUsePostProcessing(level: "high" | "medium" | "low") {
  return THREE_PRESETS.postProcessing[level];
}

// Render scale helper
export function getRenderScale(level: "high" | "medium" | "low") {
  return THREE_PRESETS.renderScale[level];
}

// ============================================
// MOTION (FRAMER MOTION) INTEGRATION
// ============================================

// Re-export motion types and utilities
export type { Variants, Transition } from "motion/react";

// Motion presets for common animations
export const MOTION_VARIANTS = {
  // Page transitions
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  
  // Section reveals
  section: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  
  // Card animations
  card: {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  
  // Stagger containers
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  },
  
  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  
  // Button interactions
  button: {
    whileHover: { scale: 1.03, transition: { duration: 0.2 } },
    whileTap: { scale: 0.97, transition: { duration: 0.1 } },
  },
  
  // Link interactions
  link: {
    whileHover: { x: 4, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98 },
  },
  
  // Image interactions
  image: {
    whileHover: { scale: 1.05, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
  },
  
  // Magnetic elements
  magnetic: {
    whileHover: { scale: 1.03, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
  },
  
  // Floating animation
  float: {
    animate: { 
      y: [-10, 10, -10],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    },
  },
  
  // Pulse animation
  pulse: {
    animate: { 
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
  },
  
  // Rotate animation
  rotate: {
    animate: { 
      rotate: 360,
      transition: { duration: 20, repeat: Infinity, ease: "linear" }
    },
  },
} as const;

// Spring configurations matching motion.dev
export const MOTION_SPRINGS = {
  gentle: { type: "spring", stiffness: 120, damping: 14, mass: 0.8 },
  smooth: { type: "spring", stiffness: 180, damping: 16, mass: 0.9 },
  snappy: { type: "spring", stiffness: 280, damping: 18, mass: 0.7 },
  bouncy: { type: "spring", stiffness: 200, damping: 12, mass: 1 },
  stiff: { type: "spring", stiffness: 400, damping: 22, mass: 0.6 },
} as const;

// Transition presets
export const MOTION_TRANSITIONS = {
  fast: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
  normal: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  slow: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  slower: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
} as const;

export default ThreeProvider;
export { ThreeProvider as MotionProvider };