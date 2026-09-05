'use client';

import { useEffect, useRef, useCallback, useMemo, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Float, Html, PerspectiveCamera as DreiPerspectiveCamera, Html as DreiHtml } from '@react-three/drei';
import { useRegionRegistry } from '@/lib/spatial/RegionRegistry';
import { useCameraController } from '@/lib/spatial/CameraController';
import { usePerformanceMonitor } from '@/components/v6/performance-optimizer';
import { useAdaptiveQuality } from '@/components/v6/performance-optimizer';
import { SpatialOSConfig, DEFAULT_SPATIAL_CONFIG } from '@/lib/spatial/types';
import { Region } from '@/lib/spatial/types';
import { BufferGeometry, Mesh, MeshStandardMaterial, Scene, Group } from 'three';

// Camera updater component - runs inside Canvas
function CameraUpdater({ updateCamera }: { updateCamera: (delta: number) => void }) {
  const mountedRef = useRef(false);
  
  useEffect(() => {
    mountedRef.current = true;
  }, []);
  
  useFrame((_state: any, delta: number) => {
    if (mountedRef.current) {
      updateCamera(delta);
    }
  });
  
  return null;
}

// Extend Three.js types for R3F
extend({
  BufferGeometry,
  Mesh,
  MeshStandardMaterial,
  Scene,
  Group,
});

// Region components (lazy loaded)
const MarketingRegion = () => (
  <section id="marketing" className="region-content">
    <Html as="div" className="marketing-region">
      <div className="marketing-content">
        <h1>Spatial OS Platform</h1>
        <p>Navigate through regions using scroll or navigation controls</p>
      </div>
    </Html>
  </section>
);

const PortalRegion = () => (
  <section id="portal" className="region-content">
    <Html as="div" className="portal-region">
      <div className="portal-content">
        <h1>Client Portal</h1>
        <p>Manage projects, billing, and team</p>
      </div>
    </Html>
  </section>
);

const AIToolsRegion = () => (
  <section id="ai-tools" className="region-content">
    <Html as="div" className="ai-tools-region">
      <div className="ai-tools-content">
        <h1>AI Tools</h1>
        <p>Proposal Generator, ROI Calculator, Playground</p>
      </div>
    </Html>
  </section>
);

const DevRegion = () => (
  <section id="dev" className="region-content">
    <Html as="div" className="dev-region">
      <div className="dev-content">
        <h1>Developer Portal</h1>
        <p>API Reference, SDK Playground, Webhook Tester</p>
      </div>
    </Html>
  </section>
);

const PlaygroundRegion = () => (
  <section id="playground" className="region-content">
    <Html as="div" className="playground-region">
      <div className="playground-content">
        <h1>Design System Playground</h1>
        <p>Component Explorer, Theme Builder, Token Inspector</p>
      </div>
    </Html>
  </section>
);

const REGION_COMPONENTS: Record<string, React.ComponentType> = {
  marketing: MarketingRegion,
  portal: PortalRegion,
  // 'ai-tools': AIToolsRegion,
  dev: DevRegion,
  playground: PlaygroundRegion,
};

// Background 3D scene for each region
const RegionBackgrounds: Record<string, React.ComponentType<{ intensity?: number }>> = {
  marketing: ({ intensity = 1 }) => (
    <MarketingBackground intensity={intensity} />
  ),
  portal: ({ intensity = 1 }) => (
    <PortalBackground intensity={intensity} />
  ),
  // 'ai-tools': ({ intensity = 1 }) => (
  //   <AIToolsBackground intensity={intensity} />
  // ),
  dev: ({ intensity = 1 }) => (
    <DevBackground intensity={intensity} />
  ),
  playground: ({ intensity = 1 }) => (
    <PlaygroundBackground intensity={intensity} />
  ),
};

// Background components using the existing 3D scenes
import { HeroScene } from './scenes/HeroScene';

const MarketingBackground = ({ intensity = 1 }: { intensity?: number }) => {
  const { quality } = usePerformanceMonitor();
  const { shouldReduceParticles } = useAdaptiveQuality();
  
  const intensityValue = quality === 'high' ? 1.0 : quality === 'medium' ? 0.7 : 0.4;
  const finalIntensity = intensity * intensityValue;
  
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.3}>
      <HeroScene 
        scrollProgress={0} 
        mousePos={{ x: 0, y: 0 }} 
        hovered={false} 
        intensity={finalIntensity} 
      />
    </Float>
  );
};

const PortalBackground = ({ intensity = 1 }: { intensity?: number }) => (
  <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.2}>
    <PortalScene intensity={intensity} />
  </Float>
);

// const AIToolsBackground = ({ intensity = 1 }: { intensity?: number }) => (
//   <Float speed={1.0} rotationIntensity={0.4} floatIntensity={0.25}>
//     <AIToolsScene intensity={intensity} />
//   </Float>
// );

const DevBackground = ({ intensity = 1 }: { intensity?: number }) => (
  <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.2}>
    <DevScene intensity={intensity} />
  </Float>
);

const PlaygroundBackground = ({ intensity = 1 }: { intensity?: number }) => (
  <Float speed={1.3} rotationIntensity={0.4} floatIntensity={0.3}>
    <PlaygroundScene intensity={intensity} />
  </Float>
);

// Placeholder scene components (to be implemented)
const PortalScene = ({ intensity = 1 }: { intensity?: number }) => (
  <group>
    <mesh>
      <torusGeometry args={[5, 1.5, 16, 100]} />
      <meshStandardMaterial 
        color="#14b8a6" 
        metalness={0.3} 
        roughness={0.4} 
        opacity={0.8 * intensity}
        transparent
      />
    </mesh>
  </group>
);

const AIToolsScene = ({ intensity = 1 }: { intensity?: number }) => (
  <group>
    <mesh>
      <icosahedronGeometry args={[3, 2]} />
      <meshStandardMaterial 
        color="#a855f7" 
        metalness={0.4} 
        roughness={0.3} 
        opacity={0.8 * intensity}
        transparent
      />
    </mesh>
  </group>
);

const DevScene = ({ intensity = 1 }: { intensity?: number }) => (
  <group>
    <mesh>
      <boxGeometry args={[4, 4, 4]} />
      <meshStandardMaterial 
        color="#06b6d4" 
        metalness={0.2} 
        roughness={0.5} 
        opacity={0.8 * intensity}
        transparent
      />
    </mesh>
  </group>
);

const PlaygroundScene = ({ intensity = 1 }: { intensity?: number }) => (
  <group>
    <mesh>
      <sphereGeometry args={[3, 32, 32]} />
      <meshStandardMaterial 
        color="#f59e0b" 
        metalness={0.5} 
        roughness={0.2} 
        opacity={0.8 * intensity}
        transparent
      />
    </mesh>
  </group>
);

// Main Spatial Canvas Component
interface SpatialCanvasProps {
  config?: Partial<SpatialOSConfig>;
  children?: React.ReactNode;
  className?: string;
  onRegionChange?: (regionId: string) => void;
}

export function SpatialCanvas({ 
  config, 
  children, 
  className = '',
  onRegionChange 
}: SpatialCanvasProps) {
  const mergedConfig = useMemo(
    () => ({ ...DEFAULT_SPATIAL_CONFIG, ...config }),
    [config]
  );

  const { quality } = usePerformanceMonitor();
  const { shouldReduceParticles } = useAdaptiveQuality();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { regions, activeRegionId, setActiveRegion, getActiveRegion } = useRegionRegistry();
  const { 
    initialize, 
    animateToRegion, 
    setNavigationMode,
    update: updateCamera,
    setShowMinimap 
  } = useCameraController();

  // Initialize camera controller
  useEffect(() => {
    if (canvasRef.current) {
      initialize(canvasRef.current, mergedConfig);
    }
  }, [initialize, mergedConfig]);

  // Handle region change
  const handleRegionChange = useCallback(async (regionId: string) => {
    await animateToRegion(regionId);
    onRegionChange?.(regionId);
  }, [animateToRegion, onRegionChange]);

  // Handle scroll to region
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const scrollY = container.scrollTop;
    const containerHeight = container.clientHeight;
    
    // Determine which region is most visible
    let mostVisibleRegion: string | null = null;
    let maxVisibility = 0;
    
    regions.forEach((region) => {
      const element = document.getElementById(region.id);
      if (!element) return;
      
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const visibleTop = Math.max(0, rect.top - containerRect.top);
      const visibleBottom = Math.min(containerHeight, rect.bottom - containerRect.top);
      const visibility = Math.max(0, visibleBottom - visibleTop) / rect.height;
      
      if (visibility > maxVisibility) {
        maxVisibility = visibility;
        mostVisibleRegion = region.id;
      }
    });
    
    if (mostVisibleRegion && mostVisibleRegion !== activeRegionId) {
      setActiveRegion(mostVisibleRegion);
    }
  }, [regions, activeRegionId, setActiveRegion]);

  // Scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      const regionIds = Array.from(regions.keys());
      const currentIndex = regionIds.indexOf(activeRegionId || '');
      
      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
          event.preventDefault();
          if (currentIndex < regionIds.length - 1) {
            animateToRegion(regionIds[currentIndex + 1]);
          }
          break;
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault();
          if (currentIndex > 0) {
            animateToRegion(regionIds[currentIndex - 1]);
          }
          break;
        case 'Home':
          event.preventDefault();
          animateToRegion(regionIds[0]);
          break;
        case 'End':
          event.preventDefault();
          animateToRegion(regionIds[regionIds.length - 1]);
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeRegionId, regions, animateToRegion]);

  // Render region components
  const regionElements = Array.from(regions.values()).map((region) => {
    const RegionComponent = REGION_COMPONENTS[region.id];
    const BackgroundComponent = RegionBackgrounds[region.id];
    const isActive = activeRegionId === region.id;
    const isTransitioning = false; // Simplified for now

    return (
      <section
        key={region.id}
        id={region.id}
        ref={(el) => { if (el) region.element = el; }}
        className={`spatial-region ${isActive ? 'active' : ''} ${isTransitioning ? 'transitioning' : ''}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          minHeight: '100vh',
          zIndex: isActive ? 10 : 1,
          opacity: isActive ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: isActive ? 'auto' : 'none',
        }}
      >
        {/* 3D Background */}
        <div 
          className="region-3d-background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
          }}
        >
          <Canvas
            camera={{ position: [0, 5, 20], fov: 60 }}
            gl={{ 
              antialias: true, 
              alpha: true,
              preserveDrawingBuffer: false,
            }}
            style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          >
            <BackgroundComponent 
              intensity={1} 
            />
            {isActive && <CameraUpdater updateCamera={updateCamera} />}
          </Canvas>
        </div>
        
        {/* DOM Content */}
        <div 
          className="region-content-wrapper"
          style={{
            position: 'relative',
            zIndex: 5,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <RegionComponent />
        </div>
      </section>
    );
  });

  return (
    <div
      ref={containerRef}
      className={`spatial-canvas-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'auto',
        scrollSnapType: 'y mandatory',
        background: 'var(--color-bg-primary)',
      }}
    >
      {/* Navigation UI */}
      <NavigationUI
        regions={Array.from(regions.values())}
        activeRegionId={activeRegionId}
        onRegionChange={handleRegionChange}
        showMinimap={true}
        onMinimapToggle={setShowMinimap}
      />
      
      {/* Main Content */}
      <div style={{ height: '100%' }}>
        {regionElements}
      </div>
      
      {/* Minimap */}
      {true && (
        <Minimap
          regions={Array.from(regions.values())}
          activeRegionId={activeRegionId}
          onRegionClick={handleRegionChange}
        />
      )}
    </div>
  );
}

// Navigation UI Component
function NavigationUI({ 
  regions, 
  activeRegionId, 
  onRegionChange,
  showMinimap,
  onMinimapToggle 
}: {
  regions: Region[];
  activeRegionId: string | null;
  onRegionChange: (regionId: string) => void;
  showMinimap: boolean;
  onMinimapToggle: (show: boolean) => void;
}) {
  return (
    <nav 
      className="spatial-navigation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(15, 15, 15, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="nav-brand" style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>
        Spatial OS
      </div>
      
      <div className="nav-regions" style={{ display: 'flex', gap: '0.5rem' }}>
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => onRegionChange(region.id)}
            className={`nav-region ${activeRegionId === region.id ? 'active' : ''}`}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid transparent',
              background: activeRegionId === region.id 
                ? 'var(--color-brand-primary)' 
                : 'transparent',
              color: activeRegionId === region.id 
                ? 'var(--color-bg-primary)' 
                : 'var(--color-text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              borderColor: activeRegionId === region.id 
                ? 'var(--color-brand-primary)' 
                : 'rgba(255, 255, 255, 0.1)',
            }}
          >
            {region.metadata.title}
          </button>
        ))}
      </div>
      
      <div className="nav-controls" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          onClick={() => onMinimapToggle(!true)}
          style={{
            padding: '0.5rem',
            borderRadius: '0.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          title="Toggle Minimap"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

// Minimap Component
function Minimap({ 
  regions, 
  activeRegionId, 
  onRegionClick,
}: {
  regions: Region[];
  activeRegionId: string | null;
  onRegionClick: (regionId: string) => void;
}) {
  const { state } = useCameraController();

  return (
    <div
      className="spatial-minimap"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '200px',
        height: '200px',
        zIndex: 50,
        background: 'rgba(15, 15, 15, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        Minimap
      </div>
      <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 2.5rem)' }}>
        <Canvas
          camera={{ position: [0, 100, 0], fov: 10 }}
          style={{ width: '100%', height: '100%' }}
        >
          <orthographicCamera
            position={[0, 100, 0]}
            zoom={0.5}
          />
          
          {/* Region bounds */}
          {regions.map((region) => (
            <mesh
              key={region.id}
              position={[region.cameraPosition.x, 0.1, region.cameraPosition.z]}
              onClick={() => onRegionClick(region.id)}
              onPointerOver={(e) => e.stopPropagation()}
            >
              <boxGeometry args={[30, 0.2, 30]} />
              <meshBasicMaterial 
                color={activeRegionId === region.id ? '#14b8a6' : '#333333'}
                transparent
                opacity={0.5}
                side={2}
              />
            </mesh>
          ))}
          
          {/* Camera position indicator */}
          <mesh position={[state.position.x, 0.5, state.position.z]}>
            <coneGeometry args={[1, 2, 8]} />
            <meshBasicMaterial color="#14b8a6" />
          </mesh>
        </Canvas>
      </div>
    </div>
  );
}

export default SpatialCanvas;