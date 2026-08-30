"use client";

/**
 * TUNNEL - DOM to 3D Scroll Synchronization
 * 
 * This solves the hardest problem in $100M-tier web experiences:
 * How do DOM sections tell the 3D camera what to do?
 * 
 * Architecture:
 * - Zustand store holds all scroll state (sections, progress, velocity)
 * - React Context provides hooks to DOM sections
 * - 3D scenes read directly from zustand (no Context needed)
 * - ScrollTracker mounts once in root layout and updates all sections
 */

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { create } from "zustand";

interface SectionState {
  progress: number;
  velocity: number;
  isInView: boolean;
  lastUpdate: number;
}

interface TunnelStore {
  sections: Map<string, SectionState>;
  globalProgress: number;
  globalVelocity: number;
  activeSection: string | null;
  registerSection: (id: string) => void;
  unregisterSection: (id: string) => void;
  setGlobalProgress: (progress: number) => void;
  setGlobalVelocity: (velocity: number) => void;
  setActiveSection: (id: string | null) => void;
  updateSection: (id: string, state: Partial<SectionState>) => void;
}

export const useTunnelStore = create<TunnelStore>((set, get) => ({
  sections: new Map(),
  globalProgress: 0,
  globalVelocity: 0,
  activeSection: null,
  registerSection: (id: string) => {
    const sections = new Map(get().sections);
    sections.set(id, { progress: 0, velocity: 0, isInView: false, lastUpdate: performance.now() });
    set({ sections });
  },
  unregisterSection: (id: string) => {
    const sections = new Map(get().sections);
    sections.delete(id);
    set({ sections });
  },
  setGlobalProgress: (progress: number) => set({ globalProgress: progress }),
  setGlobalVelocity: (velocity: number) => set({ globalVelocity: velocity }),
  setActiveSection: (id: string | null) => set({ activeSection: id }),
  updateSection: (id: string, state: Partial<SectionState>) => {
    const sections = new Map(get().sections);
    const existing = sections.get(id);
    if (existing) {
      sections.set(id, { ...existing, ...state, lastUpdate: performance.now() });
      set({ sections });
    }
  },
}));

/**
 * Hook: useSectionProgress
 * Get real-time scroll progress for a specific section (0-1)
 * Use this INSIDE a 3D component to drive animations
 */
export function useSectionProgress(sectionId: string): number {
  const sections = useTunnelStore((s) => s.sections);
  return sections.get(sectionId)?.progress ?? 0;
}

/**
 * Hook: useGlobalScrollProgress
 * Get the global scroll progress (0-1) across the entire page
 */
export function useGlobalScrollProgress(): number {
  return useTunnelStore((s) => s.globalProgress);
}

/**
 * Hook: useGlobalScrollVelocity
 * Get the current scroll velocity (px/ms, signed)
 */
export function useGlobalScrollVelocity(): number {
  return useTunnelStore((s) => s.globalVelocity);
}

/**
 * Hook: useActiveSection
 * Get the ID of the currently most-visible section
 */
export function useActiveSection(): string | null {
  return useTunnelStore((s) => s.activeSection);
}

/**
 * Hook: useSectionInView
 * Check if a specific section is currently in the viewport
 */
export function useSectionInView(sectionId: string): boolean {
  const sections = useTunnelStore((s) => s.sections);
  return sections.get(sectionId)?.isInView ?? false;
}

/**
 * TunnelProvider
 * Minimal provider — just wraps children. State lives in zustand.
 */
export function TunnelProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default TunnelProvider;

/**
 * Component: ScrollTracker
 * Mounts a global scroll listener that updates tunnel state.
 * Should be placed once in the root layout.
 */
export function ScrollTracker() {
  const lastScroll = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    const store = useTunnelStore.getState();
    
    const handleScroll = () => {
      const now = performance.now();
      const currentScroll = window.scrollY;
      const dt = now - lastTime.current;
      const dy = currentScroll - lastScroll.current;
      
      // Global progress
      const scrollHeight = Math.max(
        document.body.scrollHeight - window.innerHeight, 
        1
      );
      const globalProgress = Math.min(currentScroll / scrollHeight, 1);
      const globalVelocity = dt > 0 ? dy / dt : 0;
      
      useTunnelStore.getState().setGlobalProgress(globalProgress);
      useTunnelStore.getState().setGlobalVelocity(globalVelocity);
      
      // Update each section's progress
      const currentSections = useTunnelStore.getState().sections;
      currentSections.forEach((state, id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const vh = window.innerHeight;
          
          const center = rect.top + rect.height / 2;
          const isInView = center > -vh * 0.5 && center < vh * 1.5;
          
          const rawProgress = (vh - rect.top) / (vh + rect.height);
          const progress = Math.max(0, Math.min(1, rawProgress));
          
          useTunnelStore.getState().updateSection(id, {
            progress,
            velocity: globalVelocity,
            isInView,
          });
        }
      });
      
      // Determine active section
      let activeId: string | null = null;
      let maxVisibility = 0;
      currentSections.forEach((state, id) => {
        if (state.isInView) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const visibility = Math.max(0, 1 - Math.abs((rect.top + rect.height / 2) / vh - 0.5) * 2);
            if (visibility > maxVisibility) {
              maxVisibility = visibility;
              activeId = id;
            }
          }
        }
      });
      useTunnelStore.getState().setActiveSection(activeId);
      
      lastScroll.current = currentScroll;
      lastTime.current = now;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
}
