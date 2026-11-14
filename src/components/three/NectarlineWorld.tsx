"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Terminal, Shield, ArrowUpRight, Activity } from "lucide-react";

interface LayerDetail {
  id: string;
  name: string;
  phase: string;
  status: string;
  endpoint: string;
  metrics: { label: string; value: string }[];
}

const LAYERS: LayerDetail[] = [
  {
    id: "foundation",
    name: "01 Foundation",
    phase: "Weeks 1–2",
    status: "Active // Governed",
    endpoint: "GET /v1/core/curriculum-schema",
    metrics: [
      { label: "Course Architecture", value: "Verified" },
      { label: "Fee Structure", value: "Transparent" },
      { label: "Local SEO Schema", value: "100% Score" },
    ],
  },
  {
    id: "public",
    name: "02 Public Surface",
    phase: "Weeks 2–4",
    status: "Synchronized",
    endpoint: "POST /v1/surface/deploy-branch",
    metrics: [
      { label: "LCP Performance", value: "0.8s" },
      { label: "CLS Stability", value: "0.00" },
      { label: "Google Business Sync", value: "Live" },
    ],
  },
  {
    id: "conversion",
    name: "03 Conversion",
    phase: "Weeks 3–5",
    status: "Monitoring Intake",
    endpoint: "STREAM /v1/telemetry/intake-feed",
    metrics: [
      { label: "WhatsApp Routing", value: "<14s SLA" },
      { label: "Form Capture Rate", value: "+38.4%" },
      { label: "Orphan Drop Rate", value: "0.0%" },
    ],
  },
  {
    id: "operations",
    name: "04 Operations",
    phase: "Ongoing",
    status: "Autonomous Engine",
    endpoint: "RPC /v1/ledger/reconciliation",
    metrics: [
      { label: "Parent Portal Ping", value: "96.2%" },
      { label: "Fee Gateway Seam", value: "Zero Delay" },
      { label: "Single Audit Trail", value: "Enforced" },
    ],
  },
];

export default function NectarlineWorld() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeLayer, setActiveLayer] = useState(0);
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
    let height = container.clientHeight || 460;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 24);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(15, 20, 15);
    scene.add(keyLight);

    const cobaltFill = new THREE.PointLight(0x1f3ad8, 4.0, 50);
    cobaltFill.position.set(-15, -10, 10);
    scene.add(cobaltFill);

    const rimLight = new THREE.DirectionalLight(0x8faee0, 1.5);
    rimLight.position.set(0, -15, -10);
    scene.add(rimLight);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Central Crystalline Architectural Organism
    const coreGeo = new THREE.IcosahedronGeometry(4.2, 3);
    const origPos = coreGeo.attributes.position.clone();

    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      metalness: 0.05,
      ior: 1.58,
      thickness: 3.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      attenuationColor: new THREE.Color(0x1f3ad8),
      attenuationDistance: 4.0,
      specularIntensity: 1.5,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Fine wireframe facet cage
    const wireGeo = new THREE.WireframeGeometry(coreGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x1f3ad8,
      transparent: true,
      opacity: 0.28,
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    rootGroup.add(wireMesh);

    // 2. Concentric Orbital Trajectory Rings
    const ringGroup = new THREE.Group();
    rootGroup.add(ringGroup);

    const rings: THREE.Mesh[] = [];
    const ringConfigs = [
      { radius: 6.2, tube: 0.04, tiltX: 0.6, tiltZ: 0.4, speed: 0.008 },
      { radius: 7.8, tube: 0.035, tiltX: -0.5, tiltZ: -0.6, speed: -0.006 },
      { radius: 9.4, tube: 0.03, tiltX: 0.3, tiltZ: -0.3, speed: 0.004 },
    ];

    ringConfigs.forEach((cfg) => {
      const rGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 100);
      const rMat = new THREE.MeshStandardMaterial({
        color: 0x1f3ad8,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.55,
      });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.rotation.x = cfg.tiltX;
      rMesh.rotation.z = cfg.tiltZ;
      ringGroup.add(rMesh);
      rings.push(rMesh);
    });

    // 3. Floating Telemetry Particles
    const pCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    const pPhases = new Float32Array(pCount);

    for (let i = 0; i < pCount; i++) {
      const radius = 5.5 + Math.random() * 5.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      pPositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      pPositions[i * 3 + 1] = radius * Math.sin(phi);
      pPositions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
      pPhases[i] = Math.random() * Math.PI * 2;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));

    // Particle sprite texture
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext("2d")!;
    const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 30);
    pGrad.addColorStop(0, "rgba(31, 58, 218, 1)");
    pGrad.addColorStop(0.35, "rgba(31, 58, 218, 0.65)");
    pGrad.addColorStop(1, "rgba(31, 58, 218, 0)");
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const pMat = new THREE.PointsMaterial({
      size: 0.65,
      map: pTexture,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    rootGroup.add(particles);

    // Mouse & Scroll Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let scrollNorm = 0;

    const handlePointer = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const winH = window.innerHeight;
      scrollNorm = Math.max(0, Math.min(1, (winH - rect.top) / (winH + rect.height)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("pointermove", handlePointer, { passive: true });
    handleScroll();

    // Resize Observer
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight || 460;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    // Render loop
    const render = () => {
      const t = performance.now() * 0.001;

      // Mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Swimming wave deformation on crystal core
      if (!prefersReducedMotion) {
        const positions = coreGeo.attributes.position;
        const orig = origPos.array;
        const current = positions.array as Float32Array;

        for (let i = 0; i < positions.count; i++) {
          const i3 = i * 3;
          const ox = orig[i3];
          const oy = orig[i3 + 1];
          const oz = orig[i3 + 2];

          // Swimming wave equation along spine
          const wave = Math.sin(t * 2.2 + ox * 0.6 + oz * 0.4) * 0.18;
          const ripple = Math.sin(t * 3.5 + oy * 0.8) * mouse.x * 0.12;

          current[i3] = ox * (1 + wave * 0.1);
          current[i3 + 1] = oy + wave + ripple;
          current[i3 + 2] = oz * (1 + wave * 0.1);
        }
        positions.needsUpdate = true;
        coreGeo.computeVertexNormals();
      }

      // Root group rotation & scroll response
      rootGroup.rotation.y = t * 0.15 + mouse.x * 0.3;
      rootGroup.rotation.x = Math.sin(t * 0.2) * 0.1 + mouse.y * 0.2;

      // Scroll-driven position journey
      const targetX = (scrollNorm - 0.5) * 6.0;
      const targetY = Math.sin(scrollNorm * Math.PI) * 2.0;
      rootGroup.position.x += (targetX - rootGroup.position.x) * 0.05;
      rootGroup.position.y += (targetY - rootGroup.position.y) * 0.05;

      // Orbital rings rotation
      rings.forEach((r, idx) => {
        r.rotation.y += ringConfigs[idx].speed;
        r.rotation.x += ringConfigs[idx].speed * 0.5;
      });

      // Telemetry particles drift
      particles.rotation.y = -t * 0.08;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      window.removeEventListener("scroll", handleScroll);
      container.removeEventListener("pointermove", handlePointer);

      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      rings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      pGeo.dispose();
      pMat.dispose();
      pTexture.dispose();
      renderer.dispose();
    };
  }, [prefersReducedMotion]);

  const current = LAYERS[activeLayer];

  return (
    <section className="relative my-16 overflow-hidden rounded-2xl border border-[var(--rule)] bg-[#f8f5ee] shadow-[0_16px_48px_rgba(17,18,15,0.06)]">
      {/* Background blueprint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(17, 18, 15, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(17, 18, 15, 0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* Top Bar Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule)] px-6 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 rounded-full bg-[var(--cobalt)] shadow-[0_0_8px_#1f3ad8]" />
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-4)]">
            Nectarline Kinetic Engine // Persistent Architectural World
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[0.625rem] text-[var(--cobalt)]">
          <Activity className="h-3.5 w-3.5" />
          <span>Real-time Crystalline Organism</span>
        </div>
      </div>

      {/* Main Grid: 3D Kinetic World + Interactive Layer Terminal */}
      <div className="relative z-10 grid lg:grid-cols-[1.2fr_1fr]">
        {/* 3D Kinetic World Canvas */}
        <div
          ref={containerRef}
          className="relative min-h-[380px] w-full cursor-grab active:cursor-grabbing lg:min-h-[460px]"
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          <div className="pointer-events-none absolute bottom-4 left-6 font-mono text-[0.625rem] uppercase tracking-wider text-[var(--ink-4)]">
            Hover to ripple · Scroll translates core
          </div>
        </div>

        {/* Interactive Layer Terminal Console */}
        <div className="border-t border-[var(--rule)] bg-white/70 p-6 backdrop-blur-md lg:border-l lg:border-t-0 lg:p-8">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded bg-[var(--cobalt)]/10 px-2.5 py-1 font-mono text-[0.625rem] font-semibold uppercase tracking-wider text-[var(--cobalt)]">
              <Shield className="h-3 w-3" />
              {current.phase}
            </span>
            <span className="font-mono text-xs text-[var(--ink-4)]">
              {current.status}
            </span>
          </div>

          {/* Layer Selector Tabs */}
          <div className="mt-5 grid grid-cols-2 gap-2">
            {LAYERS.map((layer, idx) => (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveLayer(idx)}
                className={`rounded-lg border px-3 py-2 text-left font-mono text-xs transition-all ${
                  activeLayer === idx
                    ? "border-[var(--cobalt)] bg-[var(--cobalt)] text-white shadow-sm"
                    : "border-[var(--rule)] bg-white/90 text-[var(--ink-3)] hover:border-[var(--cobalt)]/40 hover:text-[var(--ink)]"
                }`}
              >
                {layer.name}
              </button>
            ))}
          </div>

          {/* CLI Telemetry Pipe */}
          <div className="mt-6 rounded-lg border border-[var(--rule)] bg-[#0d120f] p-3 text-xs text-[#a2ecd8]">
            <div className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-widest text-[#a2ecd8]/60">
              <Terminal className="h-3 w-3" />
              <span>Pipeline Hook</span>
            </div>
            <div className="mt-1 font-mono text-xs font-semibold text-white">
              {current.endpoint}
            </div>
          </div>

          {/* Verification Metrics List */}
          <dl className="mt-6 divide-y divide-[var(--rule)] border-t border-[var(--rule)]">
            {current.metrics.map((m) => (
              <div key={m.label} className="flex items-center justify-between py-2.5 text-xs">
                <dt className="text-[var(--ink-3)]">{m.label}</dt>
                <dd className="font-mono font-medium text-[var(--cobalt)]">{m.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6">
            <a
              href="#contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--cobalt)] bg-transparent py-2.5 font-mono text-xs font-medium text-[var(--cobalt)] transition hover:bg-[var(--cobalt)] hover:text-white"
            >
              Inspect Layer Specifications
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
