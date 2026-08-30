"use client";

/**
 * SECTION VIEW
 * 
 * This is the magic glue between DOM and 3D.
 * 
 * Usage in a DOM section:
 *   <SectionView trackId="hero" priority={1}>
 *     <Hero3DScene />     ← This 3D scene is teleported into the persistent canvas
 *   </SectionView>
 * 
 * The 3D scene automatically:
 * - Tracks the DOM element's position and size
 * - Activates when in viewport
 * - Suspends when off-screen (perf savings)
 * - Reads scroll progress from the tunnel
 */

import { View } from "@react-three/drei";
import { useSectionProgress, useActiveSection } from "@/components/canvas/Tunnel";
import { type ReactNode, Suspense, useState, useEffect, useRef, type RefObject } from "react";

interface SectionViewProps {
  trackId: string;
  children: ReactNode;
  /** Z-offset from the DOM element's plane */
  zOffset?: number;
  /** Whether to render the scene only when in view */
  lazyMount?: boolean;
}

export function SectionView({
  trackId,
  children,
  zOffset = -3,
  lazyMount = true,
}: SectionViewProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const progress = useSectionProgress(trackId);
  const activeSection = useActiveSection();

  // IntersectionObserver for lazy mounting
  useEffect(() => {
    if (!trackRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
          if (entry.isIntersecting && !isMounted) {
            setIsMounted(true);
          }
        });
      },
      { threshold: 0, rootMargin: "200px" }
    );

    observer.observe(trackRef.current);
    return () => observer.disconnect();
  }, [isMounted]);

  // Mount scene if lazy mounting is disabled, or if section is in view
  const shouldRender = !lazyMount || isMounted;

  return (
    <div ref={trackRef} className="section-view-track" data-section={trackId} data-progress={progress}>
      <View
        track={trackRef as unknown as RefObject<HTMLElement>}
        index={parseInt(trackId) || 0}
        id={trackId}
      >
        {shouldRender && (
          <Suspense fallback={null}>
            {isInView || !lazyMount ? children : null}
          </Suspense>
        )}
      </View>
    </div>
  );
}

/**
 * HOC: withSectionView
 * Wraps a 3D component with the View tracking setup
 */
export function withSectionView<P extends object>(
  Component: React.ComponentType<P>,
  trackId: string
) {
  return function WrappedSectionView(props: P) {
    return (
      <SectionView trackId={trackId}>
        <Component {...props} />
      </SectionView>
    );
  };
}
