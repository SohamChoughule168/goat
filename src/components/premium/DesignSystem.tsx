"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

// ============================================
// DESIGN SYSTEM - Two Color Theme
// ============================================

export const DESIGN_COLORS = {
  // Primary brand colors - Two color system
  primary: {
    main: "#14D896",      // Emerald/Cobalt green
    light: "#2EE8B8",
    dark: "#0DB87A",
    glow: "rgba(20, 216, 150, 0.6)",
    glowStrong: "rgba(20, 216, 150, 0.9)",
  },
  secondary: {
    main: "#3B82F6",      // Electric blue
    light: "#60A5FA",
    dark: "#2563EB",
    glow: "rgba(59, 130, 246, 0.6)",
    glowStrong: "rgba(59, 130, 246, 0.9)",
  },
  // Accent colors
  accent: {
    purple: "#D946EF",
    orange: "#F59E0B",
    red: "#EF4444",
  },
  // Neutral system
  neutral: {
    50: "#FAFAFA",
    100: "#F4F4F5",
    200: "#E4E4E7",
    300: "#D4D4D8",
    400: "#A1A1AA",
    500: "#71717A",
    600: "#52525B",
    700: "#3F3F46",
    800: "#27272A",
    900: "#18181B",
    950: "#09090B",
  },
  // Semantic colors
  surface: {
    primary: "rgba(24, 24, 27, 0.9)",      // Dark surface
    secondary: "rgba(39, 39, 42, 0.8)",    // Card surface
    tertiary: "rgba(63, 63, 70, 0.6)",     // Elevated surface
    glass: "rgba(255, 255, 255, 0.03)",    // Glass morphism
    glassStrong: "rgba(255, 255, 255, 0.08)",
  },
  border: {
    default: "rgba(255, 255, 255, 0.08)",
    strong: "rgba(255, 255, 255, 0.15)",
    glow: "rgba(20, 216, 150, 0.3)",
  },
  text: {
    primary: "#FAFAFA",
    secondary: "#A1A1AA",
    tertiary: "#71717A",
    inverse: "#09090B",
    accent: "#14D896",
  },
  gradient: {
    primary: "linear-gradient(135deg, #14D896 0%, #3B82F6 100%)",
    primaryReverse: "linear-gradient(135deg, #3B82F6 0%, #14D896 100%)",
    radial: "radial-gradient(ellipse at center, rgba(20,216,150,0.15) 0%, transparent 70%)",
    radialBlue: "radial-gradient(ellipse at center, rgba(59,130,246,0.1) 0%, transparent 70%)",
    mesh: "conic-gradient(from 180deg at 50% 50%, #14D896, #3B82F6, #D946EF, #14D896)",
  },
} as const;

// ============================================
// MOTION SYSTEM - Spring configurations (motion v14 compatible - use array format)
// ============================================

export const SPRINGS = {
  gentle: [0.25, 0.46, 0.45, 0.94],
  smooth: [0.25, 0.46, 0.45, 0.94],
  snappy: [0.25, 0.46, 0.45, 0.94],
  bouncy: [0.34, 1.56, 0.64, 1],
  stiff: [0.4, 0, 0.2, 1],
} as const;

// ============================================
// TRANSITION PRESETS
// ============================================

export const TRANSITIONS = {
  // Page/section transitions
  page: { duration: 0.8, ease: SPRINGS.smooth },
  section: { duration: 0.6, ease: SPRINGS.gentle },
  card: { duration: 0.4, ease: SPRINGS.snappy },
  button: { duration: 0.2, ease: SPRINGS.snappy },
  hover: { duration: 0.3, ease: SPRINGS.gentle },
  // Scroll-linked
  scroll: { duration: 1, ease: "linear" },
  parallax: { duration: 0.5, ease: SPRINGS.gentle },
  // Stagger
  stagger: { duration: 0.5, ease: SPRINGS.smooth },
} as const;

// ============================================
// BREAKPOINTS
// ============================================

export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// ============================================
// Z-INDEX LAYERS
// ============================================

export const Z_INDEX = {
  base: 0,
  canvas: 10,
  content: 20,
  sticky: 50,
  modal: 100,
  toast: 200,
  cursor: 1000,
} as const;

// ============================================
// SPACING SYSTEM
// ============================================

export const SPACING = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
} as const;

// ============================================
// TYPOGRAPHY SCALE
// ============================================

export const TYPOGRAPHY = {
  fontFamily: {
    sans: '"Geist", "Inter", system-ui, sans-serif',
    mono: '"Geist Mono", "JetBrains Mono", monospace',
    serif: '"Geist Serif", Georgia, serif',
  },
  fontSize: {
    xs: "0.75rem",      // 12px
    sm: "0.875rem",     // 14px
    base: "1rem",       // 16px
    lg: "1.125rem",     // 18px
    xl: "1.25rem",      // 20px
    "2xl": "1.5rem",    // 24px
    "3xl": "1.875rem",  // 30px
    "4xl": "2.25rem",   // 36px
    "5xl": "3rem",      // 48px
    "6xl": "3.75rem",   // 60px
    "7xl": "4.5rem",    // 72px
    "8xl": "6rem",      // 96px
    "9xl": "8rem",      // 128px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.1,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.02em",
    wider: "0.04em",
    tracking: "0.1em",
  },
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const RADIUS = {
  none: 0,
  sm: "0.25rem",    // 4px
  md: "0.375rem",   // 6px
  lg: "0.5rem",     // 8px
  xl: "0.75rem",    // 12px
  "2xl": "1rem",    // 16px
  "3xl": "1.5rem",  // 24px
  full: "9999px",
} as const;

// ============================================
// SHADOWS
// ============================================

export const SHADOWS = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  glow: "0 0 20px rgba(20, 216, 150, 0.3), 0 0 40px rgba(20, 216, 150, 0.15)",
  glowBlue: "0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.15)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
} as const;

// ============================================
// BLUR VALUES
// ============================================

export const BLUR = {
  none: "none",
  sm: "blur(4px)",
  md: "blur(8px)",
  lg: "blur(16px)",
  xl: "blur(24px)",
  "2xl": "blur(40px)",
  "3xl": "blur(64px)",
} as const;

// ============================================
// ANIMATION UTILITIES
// ============================================

export const ANIMATION_PRESETS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: TRANSITIONS.section,
  },
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: TRANSITIONS.section,
  },
  fadeInDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    transition: TRANSITIONS.section,
  },
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: TRANSITIONS.section,
  },
  slideInRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: TRANSITIONS.section,
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: TRANSITIONS.card,
  },
  rotateIn: {
    initial: { opacity: 0, rotate: -12 },
    animate: { opacity: 1, rotate: 0 },
    transition: TRANSITIONS.card,
  },
  // Stagger container
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
    transition: TRANSITIONS.stagger,
  },
} as const;

// ============================================
// HOVER/INTERACTION PRESETS
// ============================================

export const INTERACTIONS = {
  card: {
    whileHover: {
      y: -8,
      scale: 1.02,
      boxShadow: SHADOWS.glow,
      transition: { duration: 0.3, ease: SPRINGS.gentle },
    },
    whileTap: {
      scale: 0.98,
      transition: { duration: 0.2, ease: SPRINGS.snappy },
    },
  },
  button: {
    whileHover: {
      scale: 1.05,
      boxShadow: SHADOWS.glow,
      transition: { duration: 0.3, ease: SPRINGS.gentle },
    },
    whileTap: {
      scale: 0.95,
      transition: { duration: 0.15, ease: SPRINGS.snappy },
    },
  },
  link: {
    whileHover: {
      x: 4,
      transition: { duration: 0.2, ease: SPRINGS.gentle },
    },
    whileTap: {
      scale: 0.95,
    },
  },
  magnetic: {
    whileHover: {
      scale: 1.03,
      transition: { duration: 0.3, ease: SPRINGS.gentle },
    },
  },
  image: {
    whileHover: {
      scale: 1.05,
      transition: { duration: 0.6, ease: SPRINGS.gentle },
    },
  },
} as const;

// ============================================
// THREE.JS PERFORMANCE PRESETS
// ============================================

export const THREE_PRESETS = {
  particleCounts: {
    high: { hero: 2000, section: 800, card: 200, ambient: 500 },
    medium: { hero: 1000, section: 400, card: 100, ambient: 250 },
    low: { hero: 400, section: 200, card: 50, ambient: 100 },
  },
  geometryDetail: {
    high: { sphere: 64, torus: 32, icosahedron: 5 },
    medium: { sphere: 32, torus: 24, icosahedron: 4 },
    low: { sphere: 16, torus: 16, icosahedron: 3 },
  },
  postProcessing: {
    high: true,
    medium: false,
    low: false,
  },
  renderScale: {
    high: 2,
    medium: 1.5,
    low: 1,
  },
} as const;

// ============================================
// GRADIENT UTILITIES
// ============================================

export function getGradient(type: keyof typeof DESIGN_COLORS.gradient) {
  return DESIGN_COLORS.gradient[type];
}

export function getRadialGradient(x: number, y: number, color: string, opacity: number = 0.1) {
  return `radial-gradient(ellipse at ${x}% ${y}%, ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`;
}

export function getMeshGradient(colors: string[] = ["#14D896", "#3B82F6", "#D946EF"]) {
  return `conic-gradient(from 180deg at 50% 50%, ${colors.join(", ")}, ${colors[0]})`;
}

// ============================================
// CSS VARIABLE GENERATOR
// ============================================

export function generateCSSVariables(prefix: string = "design") {
  const vars: Record<string, string> = {};
  
  // Colors
  Object.entries(DESIGN_COLORS.primary).forEach(([key, value]) => {
    vars[`--${prefix}-primary-${key}`] = value;
  });
  Object.entries(DESIGN_COLORS.secondary).forEach(([key, value]) => {
    vars[`--${prefix}-secondary-${key}`] = value;
  });
  Object.entries(DESIGN_COLORS.surface).forEach(([key, value]) => {
    vars[`--${prefix}-surface-${key}`] = value;
  });
  Object.entries(DESIGN_COLORS.border).forEach(([key, value]) => {
    vars[`--${prefix}-border-${key}`] = value;
  });
  Object.entries(DESIGN_COLORS.text).forEach(([key, value]) => {
    vars[`--${prefix}-text-${key}`] = value;
  });
  Object.entries(DESIGN_COLORS.gradient).forEach(([key, value]) => {
    vars[`--${prefix}-gradient-${key}`] = value;
  });

  // Spacing
  Object.entries(SPACING).forEach(([key, value]) => {
    vars[`--${prefix}-space-${key}`] = `${value}px`;
  });

  // Radius
  Object.entries(RADIUS).forEach(([key, value]) => {
    vars[`--${prefix}-radius-${key}`] = String(value);
  });

  // Shadows
  Object.entries(SHADOWS).forEach(([key, value]) => {
    vars[`--${prefix}-shadow-${key}`] = value;
  });

  // Blur
  Object.entries(BLUR).forEach(([key, value]) => {
    vars[`--${prefix}-blur-${key}`] = value;
  });

  // Z-index
  Object.entries(Z_INDEX).forEach(([key, value]) => {
    vars[`--${prefix}-z-${key}`] = String(value);
  });

  // Typography
  Object.entries(TYPOGRAPHY.fontSize).forEach(([key, value]) => {
    vars[`--${prefix}-text-${key}`] = value;
  });

  return vars;
}

// ============================================
// TYPE EXPORTS
// ============================================

export type DesignColors = typeof DESIGN_COLORS;
export type Springs = typeof SPRINGS;
export type Transitions = typeof TRANSITIONS;
export type Breakpoints = typeof BREAKPOINTS;
export type ZIndex = typeof Z_INDEX;
export type Spacing = typeof SPACING;
export type Typography = typeof TYPOGRAPHY;
export type Radius = typeof RADIUS;
export type Shadows = typeof SHADOWS;
export type Blur = typeof BLUR;
export type AnimationPresets = typeof ANIMATION_PRESETS;
export type Interactions = typeof INTERACTIONS;
export type ThreePresets = typeof THREE_PRESETS;