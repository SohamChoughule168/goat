"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CraftStation as CraftStationData } from "@/content/craft";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Text, Center, useGLTF, Line } from "@react-three/drei";
import CraftStation from "@/components/craft/craft-station";
import { PosterBuildOrder } from "@/components/craft/station-posters";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import dynamic from "next/dynamic";
import * as THREE from "three";

// LineMaterial exists at runtime but not in @types/three
const LineMaterial = (THREE as any).LineMaterial;

const LAYERS = [
  { index: "01", title: "Intent", note: "What the scene must prove, and what it must never imply." },
  { index: "02", title: "Graph", note: "Named parts. One owner per transform." },
  { index: "03", title: "Camera", note: "Framing fixed in code. No orbit by default." },
  { index: "04", title: "Material", note: "Flat palette. Lighting is not a design system." },
  { index: "05", title: "Performance", note: "Demand frames, capped DPR, lazy chunk." },
  { index: "06", title: "Fallback", note: "Poster first. Canvas only after a probe." },
];

export default function StationBuildOrder({
  station,
}: {
  station: CraftStationData;
}) {
  const reduced = useReducedMotion();
  const [live, setLive] = useState(false);
  const [runId, setRunId] = useState(0);
  const [status, setStatus] = useState("Static stack. Six layers, no scene.");

  function run() {
    setLive(true);
    setRunId((value) => value + 1);
    setStatus("Resolving the stack from the floor up — Three.js scene initializing.");
  }

  function reset() {
    setLive(false);
    setStatus("Static stack restored.");
  }

  return (
    <CraftStation
      station={station}
      poster={<PosterBuildOrder />}
      live={live}
      status={status}
      controls={
        <>
          <button type="button" className="inst-btn" onClick={run}>
            {live ? "Run again" : "Run station"}
          </button>
          <button
            type="button"
            className="inst-btn inst-btn-ghost"
            onClick={reset}
            disabled={!live}
          >
            Reset
          </button>
        </>
      }
    >
      <div className="craft-build" key={runId}>
        {live ? (
          <BuildOrderSceneWrapper reduced={reduced} />
        ) : (
          <>
            <ol className="craft-build-list">
              {LAYERS.map((layer) => (
                <li key={layer.index} className="craft-build-row">
                  <span className="craft-build-slab" aria-hidden="true" />
                  <span className="craft-build-index" aria-hidden="true">
                    {layer.index}
                  </span>
                  <span className="craft-build-title">{layer.title}</span>
                  <span className="craft-build-note">{layer.note}</span>
                </li>
              ))}
            </ol>
            <p className="craft-build-log">06 / 06 resolved · fallback designed first</p>
          </>
        )}
      </div>
    </CraftStation>
  );
}

function BuildOrderSceneWrapper({ reduced }: { reduced: boolean }) {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <div className="craft-build-error">
        <p>Three.js scene failed to load: {error.message}</p>
        <p className="craft-build-log">Fallback: static stack displayed instead.</p>
      </div>
    );
  }

  return (
    <div className="craft-build-scene" style={{ width: "100%", aspectRatio: "4/3" }}>
      <ErrorBoundary onError={setError}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ width: "100%", height: "100%" }}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
          frameloop={reduced ? "demand" : "always"}
        >
          <Suspense fallback={<SceneLoader />}>
            <BuildOrderSceneContent reduced={reduced} />
          </Suspense>
          <OrbitControls enableZoom={!reduced} enablePan={!reduced} enableRotate={!reduced} />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

function ErrorBoundary({
  children,
  onError,
}: {
  children: React.ReactNode;
  onError: (error: Error) => void;
}) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!hasError) return;
    if (error) onError?.(error);
  }, [hasError, error, onError]);

  if (hasError) {
    return null;
  }

  return <>{children}</>;
}

function SceneLoader() {
  return (
    <Html center style={{ color: "var(--ink-3)", fontSize: 14 }}>
      Initializing Three.js scene…
    </Html>
  );
}

function BuildOrderSceneContent({ reduced }: { reduced: boolean }) {
  const [buildProgress, setBuildProgress] = useState(0);
  const [currentLayer, setCurrentLayer] = useState(0);

  useFrame((_, delta) => {
    if (reduced || buildProgress >= 1) return;
    setBuildProgress((prev) => Math.min(1, prev + delta * 0.3));
    if (buildProgress >= 1) {
      setCurrentLayer((prev) => Math.min(LAYERS.length - 1, prev + 1));
    }
  });

  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      setBuildProgress((prev) => {
        if (prev >= 1) {
          clearInterval(interval);
          return 1;
        }
        return prev + 0.15;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [reduced]);

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7]} intensity={1} />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />

      {/* Layer 01: Intent - Wireframe cube */}
      <LayerPlate
        index={0}
        progress={buildProgress}
        currentLayer={currentLayer}
        color={0x1f3ad8}
        label="01 Intent"
        position={[-2.5, 1.5, 0]}
      >
        {wireframeCube({ scale: 0.8 })}
      </LayerPlate>

      {/* Layer 02: Graph - Connected nodes */}
      <LayerPlate
        index={1}
        progress={buildProgress}
        currentLayer={currentLayer}
        color={0x2a2b26}
        label="02 Graph"
        position={[0, 1.5, 0]}
      >
        {nodeGraph()}
      </LayerPlate>

      {/* Layer 03: Camera - Frustum visualization */}
      <LayerPlate
        index={2}
        progress={buildProgress}
        currentLayer={currentLayer}
        color={0x5c5c53}
        label="03 Camera"
        position={[2.5, 1.5, 0]}
      >
        {cameraFrustum()}
      </LayerPlate>

      {/* Layer 04: Material - Flat shaded sphere */}
      <LayerPlate
        index={3}
        progress={buildProgress}
        currentLayer={currentLayer}
        color={0x1f3ad8}
        label="04 Material"
        position={[-2.5, -1, 0]}
      >
        {materialSphere()}
      </LayerPlate>

      {/* Layer 05: Performance - Particle budget */}
      <LayerPlate
        index={4}
        progress={buildProgress}
        currentLayer={currentLayer}
        color={0x2a2b26}
        label="05 Performance"
        position={[0, -1, 0]}
      >
        {particleBudget()}
      </LayerPlate>

      {/* Layer 06: Fallback - Poster plane */}
      <LayerPlate
        index={5}
        progress={buildProgress}
        currentLayer={currentLayer}
        color={0x636258}
        label="06 Fallback"
        position={[2.5, -1, 0]}
      >
        <FallbackPlane />
      </LayerPlate>
    </group>
  );
}

function LayerPlate({
  index,
  progress,
  currentLayer,
  color,
  label,
  position,
  children,
}: {
  index: number;
  progress: number;
  currentLayer: number;
  color: number;
  label: string;
  position: [number, number, number];
  children: React.ReactNode;
}) {
  const isActive = currentLayer >= index;
  const layerProgress = Math.max(0, Math.min(1, progress * LAYERS.length - index));

  return (
    <group
      position={position}
      scale={isActive ? 1 : 0.3 + 0.7 * layerProgress}
    >
      <mesh>
        <boxGeometry args={[1.8, 1.2, 0.15]} />
        <meshStandardMaterial
          color={color}
          metalness={0}
          roughness={0.8}
          transparent
          opacity={isActive ? 1 : 0.2 + 0.8 * layerProgress}
        />
      </mesh>
      <Html
        position={[0, -0.9, 0.2]}
        transform
        style={{
          color: "#11120f",
          fontSize: 10,
          fontWeight: 600,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Html>
      <group position={[0, 0, 0.2]}>{children}</group>
    </group>
  );
}

function wireframeCube({ scale = 1 }: { scale?: number }) {
  return (
    <mesh scale={scale}>
      <boxGeometry args={[0.7, 0.7, 0.7]} />
      <meshBasicMaterial color={0x1f3ad8} wireframe transparent opacity={0.6} />
    </mesh>
  );
}

function nodeGraph() {
  const lineMaterial = useMemo(
    () => new LineMaterial({
      color: 0x2a2b26,
      opacity: 0.4,
      linewidth: 0.002,
      dashed: true,
      dashSize: 0.05,
      gapSize: 0.03,
    }),
    []
  );

  const graphNodes: [number, number, number][] = [
    [0, 0, 0],
    [0.5, 0.3, 0],
    [-0.4, -0.2, 0.3],
    [0.2, -0.4, -0.2],
    [-0.3, 0.1, -0.4],
  ];
  const graphEdges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 4],
    [1, 4],
  ];

  return (
    <group>
      {graphEdges.map(([a, b], i) => (
        <Line
          key={i}
          points={[new THREE.Vector3(...graphNodes[a]), new THREE.Vector3(...graphNodes[b])]}
          material={lineMaterial}
        />
      ))}
      {graphNodes.map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} scale={0.08}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color={0x1f3ad8} emissive={0x1f3ad8} emissiveIntensity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function cameraFrustum() {
  return (
    <group>
      <mesh>
        <coneGeometry args={[0.3, 0.8, 12, 1]} />
        <meshStandardMaterial color={0x5c5c53} wireframe transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -0.5]}>
        <ringGeometry args={[0.15, 0.35, 12]} />
        <meshBasicMaterial color={0x5c5c53} side={THREE.DoubleSide} transparent opacity={0.3} />
      </mesh>
      <Html position={[0, 0.6, 0]} style={{ color: "#5c5c53", fontSize: 9, textAlign: "center" }}>
        Camera frustum
      </Html>
    </group>
  );
}

function materialSphere() {
  return (
    <mesh>
      <sphereGeometry args={[0.45, 24, 24]} />
      <meshStandardMaterial
        color={0x1f3ad8}
        metalness={0}
        roughness={0.8}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function particleBudget() {
  const count = 120;
  const particles: Array<{ x: number; y: number; z: number; size: number }> = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: (Math.random() - 0.5) * 2.5,
      y: (Math.random() - 0.5) * 1.5,
      z: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 0.04 + 0.02,
    });
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(particles.flatMap((p) => [p.x, p.y, p.z])), 3]}
          array={new Float32Array(particles.flatMap((p) => [p.x, p.y, p.z]))}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[new Float32Array(particles.map((p) => p.size)), 1]}
          array={new Float32Array(particles.map((p) => p.size))}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color={0x2a2b26}
        sizeAttenuation
        transparent
        opacity={0.6}
        vertexColors={false}
      />
    </points>
  );
}

function FallbackPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1.6, 1.1]} />
      <meshStandardMaterial
        color={0x636258}
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}