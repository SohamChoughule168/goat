export { default as MagneticCursor } from "./MagneticCursor";
export { default as ParticleSystem } from "./ParticleSystem";

// ThreeProvider exports
export { 
  ThreeProvider, 
  useThree, 
  useThreeCanvas, 
  getParticleCount, 
  getGeometryDetail,
  PARTICLE_PRESETS,
  GEOMETRY_PRESETS,
} from "./ThreeProvider";

// MotionProvider exports
export { 
  MotionProvider, 
  useThreeCanvas as useMotionCanvas, 
  MOTION_VARIANTS, 
  MOTION_SPRINGS, 
  MOTION_TRANSITIONS 
} from "./MotionProvider";

// DesignSystem exports
export { 
  DESIGN_COLORS, 
  SPRINGS, 
  TRANSITIONS, 
  BREAKPOINTS, 
  Z_INDEX, 
  SPACING, 
  TYPOGRAPHY, 
  RADIUS, 
  SHADOWS, 
  BLUR, 
  ANIMATION_PRESETS, 
  INTERACTIONS, 
  THREE_PRESETS, 
  getGradient, 
  getRadialGradient, 
  getMeshGradient, 
  generateCSSVariables 
} from "./DesignSystem";

export type { 
  DesignColors, 
  Springs, 
  Transitions, 
  Breakpoints, 
  ZIndex, 
  Spacing, 
  Typography, 
  Radius, 
  Shadows, 
  Blur, 
  AnimationPresets, 
  Interactions, 
  ThreePresets 
} from "./DesignSystem";