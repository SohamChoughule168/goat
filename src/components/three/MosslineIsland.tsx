"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

export interface HotspotItem {
  id: string;
  label: string;
  value: string;
  metric: string;
  pos: [number, number, number];
}

interface MosslineIslandProps {
  hotspots: HotspotItem[];
  activeHotspot: string | null;
  onSelectHotspot: (id: string) => void;
}

export default function MosslineIsland({
  hotspots,
  activeHotspot,
  onSelectHotspot,
}: MosslineIslandProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [screenCoords, setScreenCoords] = useState<Record<string, { x: number; y: number; visible: boolean }>>({});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mq.addEventListener("change", listener);
      return () => mq.removeEventListener("change", listener);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId: number;
    let width = container.clientWidth;
    let height = container.clientHeight || 340;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf4f1e8, 0.018);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    camera.position.set(0, 18, 38);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    sunLight.position.set(25, 40, 20);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x8faee0, 0.8);
    fillLight.position.set(-20, 10, -20);
    scene.add(fillLight);

    // Island Root Group
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);

    // 1. Procedural Moss Terrain Top Surface
    const terrainSize = 34;
    const segments = 48;
    const terrainGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, segments, segments);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    const mossPalette = [
      new THREE.Color(0x2e5c3e), // Deep rich moss
      new THREE.Color(0x4a875a), // Vibrant field moss
      new THREE.Color(0x6ba879), // Light fern tip
      new THREE.Color(0x386147), // Shadowed moss
      new THREE.Color(0x768772), // Lichen stone
    ];

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const dist = Math.sqrt(x * x + z * z);
      const falloff = Math.max(0, 1 - Math.pow(dist / (terrainSize * 0.48), 2.2));

      // Natural contoured elevation
      const elevation =
        (Math.sin(x * 0.22) * Math.cos(z * 0.22) * 2.8 +
          Math.sin(x * 0.45 + 1.2) * 1.4 +
          Math.cos(z * 0.5 - 0.8) * 1.2) *
        falloff;

      pos.setY(i, elevation);

      // Vertex color distribution
      const colorIndex = Math.min(
        mossPalette.length - 1,
        Math.floor((elevation / 4 + 0.5) * mossPalette.length)
      );
      const col = mossPalette[Math.max(0, colorIndex)] || mossPalette[0];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    terrainGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.85,
      metalness: 0.1,
      flatShading: false,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    islandGroup.add(terrainMesh);

    // 2. Floating Island Rock Underbelly (Tapered Strata)
    const rockGeo = new THREE.ConeGeometry(terrainSize * 0.46, 12, 16, 4, true);
    rockGeo.rotateX(Math.PI);
    rockGeo.translate(0, -6, 0);

    const rockPos = rockGeo.attributes.position;
    for (let i = 0; i < rockPos.count; i++) {
      const rx = rockPos.getX(i);
      const ry = rockPos.getY(i);
      const rz = rockPos.getZ(i);
      const noise = (Math.sin(rx * 0.8) + Math.cos(rz * 0.8)) * 0.8;
      rockPos.setX(i, rx + noise * 0.4);
      rockPos.setZ(i, rz + noise * 0.4);
    }
    rockGeo.computeVertexNormals();

    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x6e685f,
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true,
    });
    const rockMesh = new THREE.Mesh(rockGeo, rockMat);
    islandGroup.add(rockMesh);

    // 3. Central Telemetry Sensor Mast
    const mastGroup = new THREE.Group();
    mastGroup.position.set(0, 2.5, 0);
    islandGroup.add(mastGroup);

    // Thin vertical mast
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.14, 6.5, 8);
    poleGeo.translate(0, 3.25, 0);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x11120f, roughness: 0.3, metalness: 0.8 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    mastGroup.add(pole);

    // Sensor louver housing
    const louverGeo = new THREE.CylinderGeometry(0.45, 0.45, 1.2, 12);
    louverGeo.translate(0, 5.0, 0);
    const louverMat = new THREE.MeshStandardMaterial({ color: 0xf5f3ec, roughness: 0.5 });
    const louver = new THREE.Mesh(louverGeo, louverMat);
    mastGroup.add(louver);

    // Solar panel wing
    const panelGeo = new THREE.BoxGeometry(1.6, 0.05, 0.8);
    panelGeo.translate(0, 4.2, 0);
    panelGeo.rotateZ(0.25);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x1f3ad8, roughness: 0.2, metalness: 0.6 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    mastGroup.add(panel);

    // Cobalt status beacon on tip
    const beaconGeo = new THREE.SphereGeometry(0.2, 12, 12);
    beaconGeo.translate(0, 6.6, 0);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x1f3ad8 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    mastGroup.add(beacon);

    // 4. Floating Satellite Rock Fragments
    const satelliteRocks: THREE.Mesh[] = [];
    const satCount = 4;
    for (let i = 0; i < satCount; i++) {
      const sGeo = new THREE.DodecahedronGeometry(0.8 + Math.random() * 0.7, 0);
      const sMat = new THREE.MeshStandardMaterial({ color: 0x5a6358, roughness: 0.9, flatShading: true });
      const sMesh = new THREE.Mesh(sGeo, sMat);
      const angle = (i / satCount) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 18 + Math.random() * 6;
      sMesh.position.set(Math.cos(angle) * radius, -2 + Math.sin(i * 2) * 3, Math.sin(angle) * radius);
      scene.add(sMesh);
      satelliteRocks.push(sMesh);
    }

    // 5. Atmospheric Mist Particles
    const mistCount = 65;
    const mistGeo = new THREE.BufferGeometry();
    const mistPositions = new Float32Array(mistCount * 3);

    for (let i = 0; i < mistCount; i++) {
      mistPositions[i * 3] = (Math.random() - 0.5) * 44;
      mistPositions[i * 3 + 1] = Math.random() * 8 - 1;
      mistPositions[i * 3 + 2] = (Math.random() - 0.5) * 44;
    }
    mistGeo.setAttribute("position", new THREE.BufferAttribute(mistPositions, 3));

    // Circular gradient particle texture
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext("2d")!;
    const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
    pGrad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
    pGrad.addColorStop(0.4, "rgba(235, 245, 238, 0.45)");
    pGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);
    const mistTex = new THREE.CanvasTexture(pCanvas);

    const mistMat = new THREE.PointsMaterial({
      size: 2.2,
      map: mistTex,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
      depthWrite: false,
    });
    const mistPoints = new THREE.Points(mistGeo, mistMat);
    scene.add(mistPoints);

    // Mouse and Scroll tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollProgress = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowH = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH + rect.height)));
      scrollProgress = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("pointermove", handlePointerMove, { passive: true });
    handleScroll();

    // Resize handling
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight || 340;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Vector helper for 3D -> 2D projection
    const tempVec = new THREE.Vector3();

    // Render loop
    const render = () => {
      const t = performance.now() * 0.001;

      // Mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Island bobbing & gentle tilt
      if (!prefersReducedMotion) {
        islandGroup.position.y = Math.sin(t * 0.8) * 0.4;
        islandGroup.rotation.y = Math.sin(t * 0.2) * 0.08 + mouse.x * 0.15;
        islandGroup.rotation.x = mouse.y * 0.1;
      }

      // Camera push-in scroll scrub
      const targetCamZ = 38 - scrollProgress * 12;
      const targetCamY = 18 - scrollProgress * 6;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, 2.5, 0);

      // Rotate satellites
      satelliteRocks.forEach((rock, idx) => {
        rock.rotation.x += 0.005 * (idx + 1);
        rock.rotation.y += 0.008;
        rock.position.y += Math.sin(t * 1.2 + idx) * 0.01;
      });

      // Beacon blink
      beaconMat.color.setHex((Math.floor(t * 2) % 2 === 0) ? 0x1f3ad8 : 0x5be69c);

      renderer.render(scene, camera);

      // Project 3D Hotspot positions to screen space
      const newCoords: Record<string, { x: number; y: number; visible: boolean }> = {};
      hotspots.forEach((hs) => {
        tempVec.set(hs.pos[0], hs.pos[1], hs.pos[2]);
        tempVec.applyMatrix4(islandGroup.matrixWorld);
        tempVec.project(camera);

        const isVisible = tempVec.z < 1;
        const x = ((tempVec.x + 1) * width) / 2;
        const y = ((-tempVec.y + 1) * height) / 2;

        newCoords[hs.id] = { x, y, visible: isVisible };
      });
      setScreenCoords(newCoords);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
      container.removeEventListener("pointermove", handlePointerMove);

      terrainGeo.dispose();
      terrainMat.dispose();
      rockGeo.dispose();
      rockMat.dispose();
      poleGeo.dispose();
      poleMat.dispose();
      louverGeo.dispose();
      louverMat.dispose();
      panelGeo.dispose();
      panelMat.dispose();
      beaconGeo.dispose();
      beaconMat.dispose();
      satelliteRocks.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      mistGeo.dispose();
      mistMat.dispose();
      mistTex.dispose();
      renderer.dispose();
    };
  }, [hotspots, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative h-[380px] w-full overflow-hidden rounded-xl border border-[var(--rule)] bg-gradient-to-b from-[#e8ebe6] to-[#f4f2ea] shadow-inner lg:h-[440px]"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Atmospheric Mist Drift Gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background: "radial-gradient(ellipse at 50% 85%, rgba(255,255,255,0.8) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* 3D Hotspot Overlays */}
      {hotspots.map((hs) => {
        const coords = screenCoords[hs.id];
        if (!coords || !coords.visible) return null;
        const isActive = activeHotspot === hs.id;

        return (
          <div
            key={hs.id}
            onClick={() => onSelectHotspot(isActive ? "" : hs.id)}
            style={{
              left: `${coords.x}px`,
              top: `${coords.y}px`,
              transform: "translate(-50%, -50%)",
            }}
            className="absolute z-20 cursor-pointer transition-transform duration-200 hover:scale-110"
          >
            {/* Pulsing Pin */}
            <div className="relative flex items-center justify-center">
              <span className="absolute h-7 w-7 animate-ping rounded-full bg-[var(--cobalt)]/25" />
              <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[var(--cobalt)] text-[11px] font-bold text-white shadow-lg ring-2 ring-white">
                +
              </span>
            </div>

            {/* Floating Tag Card */}
            <div
              className={`mt-2 whitespace-nowrap rounded-md border border-[var(--rule)] bg-white/95 px-3 py-1.5 shadow-xl backdrop-blur-md transition-all duration-300 ${
                isActive
                  ? "scale-100 opacity-100 ring-2 ring-[var(--cobalt)]/40"
                  : "scale-90 opacity-85 hover:opacity-100"
              }`}
            >
              <div className="font-mono text-[0.625rem] uppercase tracking-wider text-[var(--ink-4)]">
                {hs.label}
              </div>
              <div className="font-mono text-xs font-semibold text-[var(--cobalt)]">
                {hs.value}
              </div>
              {isActive && (
                <div className="mt-1 border-t border-[var(--rule)] pt-1 font-mono text-[0.5625rem] text-[var(--ink-3)]">
                  {hs.metric}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Control Banner */}
      <div className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-center justify-between font-mono text-[0.625rem] uppercase tracking-wider text-[var(--ink-4)]">
        <span>3D Moss Island Telemetry · Sensor Mast Active</span>
        <span>Scroll to push in · Pointer steers</span>
      </div>
    </div>
  );
}
