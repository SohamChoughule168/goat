export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Box3 {
  min: Vector3;
  max: Vector3;
}

export interface Region {
  id: string;
  name: string;
  bounds: Box3;
  cameraPosition: Vector3;
  cameraTarget: Vector3;
  lodLevels: LODConfig[];
  streaming: boolean;
  collaborators: UserPresence[];
  metadata: RegionMetadata;
  element?: HTMLElement;
}

export interface LODConfig {
  distance: number;
  quality: 'high' | 'medium' | 'low';
  particleMultiplier: number;
  shaderComplexity: number;
}

export interface RegionMetadata {
  title: string;
  description: string;
  thumbnail?: string;
  tags: string[];
  order: number;
}

export interface UserPresence {
  id: string;
  name: string;
  color: string;
  position: Vector3;
  rotation: Vector3;
  lastActive: number;
  cursorTrail?: Vector3[];
}

export interface CameraState {
  position: Vector3;
  target: Vector3;
  zoom: number;
  mode: 'fly' | 'orbit' | 'pan' | 'focus';
}

export interface NavigationMode {
  type: 'fly' | 'zoom' | 'pan' | 'focus' | 'minimap' | 'orbit';
  active: boolean;
}

export interface SpatialOSConfig {
  regions: Region[];
  defaultRegion: string;
  camera: {
    fov: number;
    near: number;
    far: number;
    defaultPosition: Vector3;
    defaultTarget: Vector3;
    transitionDuration: number;
    easing: string;
  };
  lod: {
    high: { distance: number; quality: number };
    medium: { distance: number; quality: number };
    low: { distance: number; quality: number };
  };
  navigation: {
    enableFlyTo: boolean;
    enableZoom: boolean;
    enablePan: boolean;
    enableFocus: boolean;
    enableMinimap: boolean;
  };
  performance: {
    targetFPS: number;
    maxDrawCalls: number;
    maxTriangles: number;
    adaptiveQuality: boolean;
  };
}

export const DEFAULT_SPATIAL_CONFIG: SpatialOSConfig = {
  regions: [],
  defaultRegion: 'marketing',
  camera: {
    fov: 60,
    near: 0.1,
    far: 1000,
    defaultPosition: { x: 0, y: 5, z: 20 },
    defaultTarget: { x: 0, y: 0, z: 0 },
    transitionDuration: 1.5,
    easing: 'expo.inOut',
  },
  lod: {
    high: { distance: 50, quality: 1.0 },
    medium: { distance: 100, quality: 0.7 },
    low: { distance: 200, quality: 0.4 },
  },
  navigation: {
    enableFlyTo: true,
    enableZoom: true,
    enablePan: true,
    enableFocus: true,
    enableMinimap: true,
  },
  performance: {
    targetFPS: 60,
    maxDrawCalls: 100,
    maxTriangles: 100000,
    adaptiveQuality: true,
  },
};

export const REGION_DEFINITIONS: Omit<Region, 'collaborators' | 'bounds'>[] = [
  {
    id: 'marketing',
    name: 'Marketing',
    cameraPosition: { x: 0, y: 5, z: 20 },
    cameraTarget: { x: 0, y: 0, z: 0 },
    lodLevels: [
      { distance: 0, quality: 'high', particleMultiplier: 1.0, shaderComplexity: 1.0 },
      { distance: 50, quality: 'medium', particleMultiplier: 0.7, shaderComplexity: 0.8 },
      { distance: 100, quality: 'low', particleMultiplier: 0.4, shaderComplexity: 0.5 },
    ],
    streaming: true,
    metadata: {
      title: 'Marketing',
      description: 'Hero, Manifesto, Craft Chapters, AI Lab, Work Strip',
      tags: ['hero', 'manifesto', 'craft', 'ai', 'work'],
      order: 0,
    },
  },
  {
    id: 'portal',
    name: 'Client Portal',
    cameraPosition: { x: 0, y: 5, z: -20 },
    cameraTarget: { x: 0, y: 0, z: -10 },
    lodLevels: [
      { distance: 0, quality: 'high', particleMultiplier: 1.0, shaderComplexity: 1.0 },
      { distance: 50, quality: 'medium', particleMultiplier: 0.7, shaderComplexity: 0.8 },
      { distance: 100, quality: 'low', particleMultiplier: 0.4, shaderComplexity: 0.5 },
    ],
    streaming: true,
    metadata: {
      title: 'Client Portal',
      description: 'Dashboard, Projects, Billing, Team',
      tags: ['dashboard', 'projects', 'billing', 'team'],
      order: 1,
    },
  },
  {
    id: 'ai-tools',
    name: 'AI Tools',
    cameraPosition: { x: -30, y: 5, z: 0 },
    cameraTarget: { x: -15, y: 0, z: 0 },
    lodLevels: [
      { distance: 0, quality: 'high', particleMultiplier: 1.0, shaderComplexity: 1.0 },
      { distance: 50, quality: 'medium', particleMultiplier: 0.7, shaderComplexity: 0.8 },
      { distance: 100, quality: 'low', particleMultiplier: 0.4, shaderComplexity: 0.5 },
    ],
    streaming: true,
    metadata: {
      title: 'AI Tools',
      description: 'Proposal Generator, ROI Calculator, Playground',
      tags: ['proposal', 'roi', 'playground', 'ai'],
      order: 2,
    },
  },
  {
    id: 'dev',
    name: 'Developer Portal',
    cameraPosition: { x: -30, y: 5, z: -20 },
    cameraTarget: { x: -15, y: 0, z: -10 },
    lodLevels: [
      { distance: 0, quality: 'high', particleMultiplier: 1.0, shaderComplexity: 1.0 },
      { distance: 50, quality: 'medium', particleMultiplier: 0.7, shaderComplexity: 0.8 },
      { distance: 100, quality: 'low', particleMultiplier: 0.4, shaderComplexity: 0.5 },
    ],
    streaming: true,
    metadata: {
      title: 'Developer Portal',
      description: 'API Reference, SDK Playground, Webhook Tester',
      tags: ['api', 'sdk', 'webhook', 'docs'],
      order: 3,
    },
  },
  {
    id: 'playground',
    name: 'Design System Playground',
    cameraPosition: { x: 0, y: 5, z: 30 },
    cameraTarget: { x: 0, y: 0, z: 15 },
    lodLevels: [
      { distance: 0, quality: 'high', particleMultiplier: 1.0, shaderComplexity: 1.0 },
      { distance: 50, quality: 'medium', particleMultiplier: 0.7, shaderComplexity: 0.8 },
      { distance: 100, quality: 'low', particleMultiplier: 0.4, shaderComplexity: 0.5 },
    ],
    streaming: true,
    metadata: {
      title: 'Playground',
      description: 'Component Explorer, Theme Builder, Token Inspector',
      tags: ['components', 'themes', 'tokens', 'design'],
      order: 4,
    },
  },
];

import * as THREE from 'three';

export function createRegionFromDefinition(def: Omit<Region, 'collaborators' | 'bounds'>): Region {
  const bounds = new THREE.Box3(
    new THREE.Vector3(def.cameraPosition.x - 50, def.cameraPosition.y - 50, def.cameraPosition.z - 50),
    new THREE.Vector3(def.cameraPosition.x + 50, def.cameraPosition.y + 50, def.cameraPosition.z + 50)
  );
  return {
    ...def,
    bounds,
    collaborators: [],
  };
}