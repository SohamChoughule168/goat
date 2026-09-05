import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Region, RegionMetadata, Vector3, Box3, SpatialOSConfig, DEFAULT_SPATIAL_CONFIG, REGION_DEFINITIONS, createRegionFromDefinition } from './types';
import * as THREE from 'three';

interface RegionRegistryState {
  config: SpatialOSConfig;
  regions: Map<string, Region>;
  activeRegionId: string | null;
  previousRegionId: string | null;
  isTransitioning: boolean;
  transitionProgress: number;
  
  // Actions
  registerRegion: (region: Region) => void;
  unregisterRegion: (regionId: string) => void;
  getRegion: (regionId: string) => Region | undefined;
  getAllRegions: () => Region[];
  setActiveRegion: (regionId: string, options?: { instant?: boolean }) => Promise<void>;
  getActiveRegion: () => Region | undefined;
  updateRegionBounds: (regionId: string, bounds: Box3) => void;
  addCollaborator: (regionId: string, collaborator: any) => void;
  removeCollaborator: (regionId: string, collaboratorId: string) => void;
  updateCollaboratorPosition: (regionId: string, collaboratorId: string, position: any, rotation?: any) => void;
  setTransitioning: (transitioning: boolean, progress?: number) => void;
}

const createDefaultRegions = (): Map<string, Region> => {
  const regions = new Map<string, Region>();
  REGION_DEFINITIONS.forEach((def) => {
    const region = createRegionFromDefinition(def);
    regions.set(region.id, region);
  });
  return regions;
};

export const useRegionRegistry = create<RegionRegistryState>()(
  subscribeWithSelector((set, get) => ({
    config: DEFAULT_SPATIAL_CONFIG,
    regions: createDefaultRegions(),
    activeRegionId: null,
    previousRegionId: null,
    isTransitioning: false,
    transitionProgress: 0,

    registerRegion: (region: Region) => {
      set((state) => {
        const newRegions = new Map(state.regions);
        newRegions.set(region.id, region);
        return { regions: newRegions };
      });
    },

    unregisterRegion: (regionId: string) => {
      set((state) => {
        const newRegions = new Map(state.regions);
        newRegions.delete(regionId);
        return { regions: newRegions };
      });
    },

    getRegion: (regionId: string) => {
      return get().regions.get(regionId);
    },

    getAllRegions: () => {
      return Array.from(get().regions.values());
    },

    setActiveRegion: async (regionId: string, options?: { instant?: boolean }) => {
      const { regions, activeRegionId, config } = get();
      const region = regions.get(regionId);
      if (!region) {
        console.warn(`Region ${regionId} not found`);
        return;
      }

      if (activeRegionId === regionId) return;

      set({ 
        previousRegionId: activeRegionId,
        isTransitioning: !options?.instant,
        transitionProgress: 0,
      });

      if (!options?.instant) {
        // Animate transition progress
        const duration = config.camera.transitionDuration * 1000;
        const startTime = Date.now();
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          set({ transitionProgress: progress });
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            set({ 
              activeRegionId: regionId,
              isTransitioning: false,
              transitionProgress: 1,
            });
          }
        };
        
        animate();
      } else {
        set({ 
          activeRegionId: regionId,
          isTransitioning: false,
          transitionProgress: 1,
        });
      }
    },

    getActiveRegion: () => {
      const { activeRegionId, regions } = get();
      if (!activeRegionId) return undefined;
      return regions.get(activeRegionId);
    },

    updateRegionBounds: (regionId: string, bounds: any) => {
      set((state) => {
        const region = state.regions.get(regionId);
        if (!region) return state;
        
        const newRegions = new Map(state.regions);
        newRegions.set(regionId, { ...region, bounds });
        return { regions: newRegions };
      });
    },

    addCollaborator: (regionId: string, collaborator: any) => {
      set((state) => {
        const region = state.regions.get(regionId);
        if (!region) return state;
        
        const newRegions = new Map(state.regions);
        newRegions.set(regionId, { 
          ...region, 
          collaborators: [...region.collaborators, collaborator] 
        });
        return { regions: newRegions };
      });
    },

    removeCollaborator: (regionId: string, collaboratorId: string) => {
      set((state) => {
        const region = state.regions.get(regionId);
        if (!region) return state;
        
        const newRegions = new Map(state.regions);
        newRegions.set(regionId, { 
          ...region, 
          collaborators: region.collaborators.filter(c => c.id !== collaboratorId) 
        });
        return { regions: newRegions };
      });
    },

    updateCollaboratorPosition: (regionId: string, collaboratorId: string, position: any, rotation?: any) => {
      set((state) => {
        const region = state.regions.get(regionId);
        if (!region) return state;
        
        const newRegions = new Map(state.regions);
        newRegions.set(regionId, { 
          ...region, 
          collaborators: region.collaborators.map(c => 
            c.id === collaboratorId 
              ? { ...c, position, rotation: rotation ?? c.rotation, lastActive: Date.now() }
              : c
          ) 
        });
        return { regions: newRegions };
      });
    },

    setTransitioning: (transitioning: boolean, progress?: number) => {
      set({ isTransitioning: transitioning, transitionProgress: progress ?? 0 });
    },
  }))
);

export const regionRegistry = useRegionRegistry.getState();