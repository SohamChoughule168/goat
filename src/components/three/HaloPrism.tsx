"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Check, Copy } from "lucide-react";

interface HaloPrismProps {
  className?: string;
}

const TABS = [
  { id: "tokens", label: "01 Architecture", cmd: "imaginars platform --layers=8 --seams=strict --governance=full" },
  { id: "seams", label: "02 Seam Protocol", cmd: "npx @imaginars/seam-verify --enquiries --admissions --records" },
  { id: "flow", label: "03 Data Schema", cmd: "GET https://api.imaginars.com/v1/institutes/telemetry?branch=all" },
  { id: "api", label: "04 Webhook Pipe", cmd: "POST /v1/webhooks/enquiry-intake --auth=bearer_jwt --format=open_edu" },
];

export default function HaloPrism({ className = "" }: HaloPrismProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const fxCanvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  useEffect(() => {
    const glCanvas = glCanvasRef.current;
    const fxCanvas = fxCanvasRef.current;
    const container = containerRef.current;
    if (!glCanvas || !fxCanvas || !container) return;

    let animId: number;
    let width = container.clientWidth;
    let height = container.clientHeight || 540;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    glCanvas.width = width * dpr;
    glCanvas.height = height * dpr;
    fxCanvas.width = width * dpr;
    fxCanvas.height = height * dpr;

    const fxCtx = fxCanvas.getContext("2d");
    if (!fxCtx) return;

    // Three.js Scene for Glass Prism
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      canvas: glCanvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(dpr);

    // Prism Geometry (Equilateral Triangular Prism)
    const shape = new THREE.Shape();
    const side = 2.4;
    const h = (side * Math.sqrt(3)) / 2;
    shape.moveTo(-side / 2, -h / 3);
    shape.lineTo(side / 2, -h / 3);
    shape.lineTo(0, (2 * h) / 3);
    shape.closePath();

    const extrudeSettings = {
      depth: 2.2,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    // Physical Glass Material on Bone-white Paper
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      opacity: 1,
      transparent: true,
      roughness: 0.06,
      metalness: 0.05,
      ior: 1.62,
      thickness: 2.2,
      specularIntensity: 1.3,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      attenuationColor: new THREE.Color(0x1f3ad8),
      attenuationDistance: 2.4,
    });

    const prism = new THREE.Mesh(geometry, glassMaterial);
    scene.add(prism);

    // Fine wireframe facet accents
    const wireGeo = new THREE.EdgesGeometry(geometry, 28);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x1f3ad8,
      transparent: true,
      opacity: 0.35,
    });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    prism.add(wireframe);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xf5efe2, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff6ea, 2.6);
    keyLight.position.set(6, 8, 8);
    scene.add(keyLight);

    const cobaltRim = new THREE.DirectionalLight(0x1f3ad8, 2.8);
    cobaltRim.position.set(-8, -2, -6);
    scene.add(cobaltRim);

    // Mouse pointer state
    const targetMouse = { x: 0.5, y: 0.25 };
    const mouse = { x: 0.5, y: 0.25 };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = (e.clientY - rect.top) / rect.height;
    };

    container.addEventListener("pointermove", handlePointerMove);

    // 50 Microscopic paper / dust motes drifting along incoming beam
    const motes = Array.from({ length: 50 }, () => ({
      x: Math.random(),
      y: (Math.random() - 0.5) * 0.16,
      size: Math.random() * 1.6 + 0.6,
      alpha: Math.random() * 0.6 + 0.25,
      speed: Math.random() * 0.0025 + 0.001,
    }));

    // Spectral dispersion colors (Refined architectural palette: Cobalt, Teal, Sky, Gold, Warm Amber)
    const spectrumColors = [
      "#1f3ad8", "#2747e8", "#3355f0", "#4068f8", // Cobalt
      "#0ea5e9", "#06b6d4", "#14b8a6",             // Cyan / Teal
      "#10b981", "#84cc16", "#eab308",             // Sage / Gold
      "#f97316", "#ef4444", "#c026d3"              // Coral / Ochre
    ];

    let t = 0;

    const render = () => {
      t += 0.016;

      mouse.x += (targetMouse.x - mouse.x) * 0.08;
      mouse.y += (targetMouse.y - mouse.y) * 0.08;

      // 3D Prism subtle orbit
      prism.rotation.y = (mouse.x - 0.5) * 0.5 + Math.sin(t * 0.4) * 0.06;
      prism.rotation.x = (mouse.y - 0.5) * 0.35 + Math.cos(t * 0.3) * 0.04;
      prism.rotation.z = Math.sin(t * 0.2) * 0.02;

      renderer.render(scene, camera);

      // 2D Light Ray Optics on #fx
      fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
      const cw = fxCanvas.width;
      const ch = fxCanvas.height;

      // Prism center on 2D screen
      const cx = cw * 0.62;
      const cy = ch * 0.52;

      // Incoming white beam entry point on right face
      const entryX = cx + cw * 0.08 * (mouse.x * 0.5 + 0.5);
      const entryY = cy + (mouse.y - 0.5) * ch * 0.28;

      const sourceX = cw + 80;
      const sourceY = entryY - (entryX - sourceX) * 0.3;

      fxCtx.save();
      fxCtx.lineCap = "round";

      // Outer beam glow
      fxCtx.beginPath();
      fxCtx.moveTo(sourceX, sourceY);
      fxCtx.lineTo(entryX, entryY);
      fxCtx.strokeStyle = "rgba(31, 58, 218, 0.16)";
      fxCtx.lineWidth = 14 * dpr;
      fxCtx.stroke();

      // Core intense beam
      fxCtx.beginPath();
      fxCtx.moveTo(sourceX, sourceY);
      fxCtx.lineTo(entryX, entryY);
      fxCtx.strokeStyle = "rgba(17, 18, 15, 0.75)";
      fxCtx.lineWidth = 3.5 * dpr;
      fxCtx.stroke();

      // Drifting dust motes
      motes.forEach((mote) => {
        mote.x -= mote.speed;
        if (mote.x < 0) mote.x = 1;
        const px = entryX + (sourceX - entryX) * mote.x;
        const py = entryY + (sourceY - entryY) * mote.x + mote.y * ch;

        fxCtx.beginPath();
        fxCtx.arc(px, py, mote.size * dpr, 0, Math.PI * 2);
        fxCtx.fillStyle = `rgba(31, 58, 218, ${mote.alpha * (0.6 + Math.sin(t * 3 + px) * 0.4)})`;
        fxCtx.fill();
      });

      // Entry Face Glint
      const glintGrad = fxCtx.createRadialGradient(entryX, entryY, 2, entryX, entryY, 22 * dpr);
      glintGrad.addColorStop(0, "rgba(31, 58, 218, 0.9)");
      glintGrad.addColorStop(0.4, "rgba(147, 165, 255, 0.5)");
      glintGrad.addColorStop(1, "rgba(31, 58, 218, 0)");
      fxCtx.fillStyle = glintGrad;
      fxCtx.beginPath();
      fxCtx.arc(entryX, entryY, 22 * dpr, 0, Math.PI * 2);
      fxCtx.fill();

      // Refracted Spectral Fan leaving the left side
      const fanOriginX = cx - cw * 0.08;
      const fanOriginY = cy + (mouse.y - 0.5) * ch * 0.14;
      const numRays = spectrumColors.length;

      for (let i = 0; i < numRays; i++) {
        const factor = i / (numRays - 1);
        const spreadAngle = -0.42 + factor * 0.9;
        const endX = -40;
        const endY = fanOriginY + Math.tan(spreadAngle) * fanOriginX * 1.1;

        if (i < numRays - 1) {
          const nextFactor = (i + 1) / (numRays - 1);
          const nextAngle = -0.42 + nextFactor * 0.9;
          const nextEndY = fanOriginY + Math.tan(nextAngle) * fanOriginX * 1.1;

          const quadGrad = fxCtx.createLinearGradient(fanOriginX, fanOriginY, endX, endY);
          quadGrad.addColorStop(0, spectrumColors[i]);
          quadGrad.addColorStop(0.35, spectrumColors[i]);
          quadGrad.addColorStop(1, "rgba(242, 238, 229, 0)");

          fxCtx.beginPath();
          fxCtx.moveTo(fanOriginX, fanOriginY);
          fxCtx.lineTo(endX, endY);
          fxCtx.lineTo(endX, nextEndY);
          fxCtx.closePath();
          fxCtx.fillStyle = quadGrad;
          fxCtx.globalAlpha = 0.28;
          fxCtx.fill();
          fxCtx.globalAlpha = 1.0;
        }

        fxCtx.beginPath();
        fxCtx.moveTo(fanOriginX, fanOriginY);
        fxCtx.lineTo(endX, endY);
        fxCtx.strokeStyle = spectrumColors[i];
        fxCtx.lineWidth = 2 * dpr;
        fxCtx.stroke();
      }

      fxCtx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight || 540;
      glCanvas.width = width * dpr;
      glCanvas.height = height * dpr;
      fxCanvas.width = width * dpr;
      fxCanvas.height = height * dpr;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      glassMaterial.dispose();
      wireGeo.dispose();
      wireMat.dispose();
    };
  }, []);

  const handleTabClick = (idx: number) => {
    if (idx === activeTab) return;
    setIsSwapping(true);
    setTimeout(() => {
      setActiveTab(idx);
      setIsSwapping(false);
    }, 150);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(TABS[activeTab].cmd).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-2xl border border-[var(--rule)] bg-[#f7f4ed] p-6 text-[var(--ink)] shadow-[0_16px_48px_rgba(17,18,15,0.06)] lg:p-10 ${className}`}
      style={{ minHeight: "560px" }}
    >
      {/* 3D Canvas Stage */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <canvas ref={glCanvasRef} className="absolute inset-0 h-full w-full" />
        <canvas ref={fxCanvasRef} className="absolute inset-0 h-full w-full" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col justify-between pointer-events-none">
        {/* Top badge & kicker */}
        <div className="flex flex-wrap items-center justify-between gap-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-6 items-center gap-2 rounded-full border border-[var(--cobalt)]/25 bg-[var(--cobalt)]/8 px-3 font-mono text-[0.6875rem] uppercase tracking-wider text-[var(--cobalt)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--cobalt)] shadow-[0_0_8px_var(--cobalt)]" />
              The Clarity Prism
            </span>
            <span className="font-mono text-[0.6875rem] uppercase tracking-widest text-[var(--ink-3)]">
              Optical System Engine
            </span>
          </div>
          <span className="font-mono text-[0.6875rem] text-[var(--ink-4)]">
            Hover to steer refractive ray path
          </span>
        </div>

        {/* Center Copy */}
        <div className="my-10 max-w-xl pointer-events-auto">
          <h3 className="text-3xl font-medium tracking-tight text-[var(--ink)] lg:text-4xl">
            Refracting chaos into <span className="font-serif italic text-[var(--cobalt)]">eight clean streams.</span>
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-[var(--ink-2)] lg:text-base">
            Raw enquiries arrive unformatted via WhatsApp, direct search, and meta campaigns.
            The Imaginars architecture acts as a precision optical prism — purifying the intake,
            binding student records, and fanning out into distinct, governed operating layers.
          </p>

          {/* Interactive Protocol Tabs */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2 border-b border-[var(--rule)] pb-3 font-mono text-xs">
              {TABS.map((tab, idx) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(idx)}
                  className={`rounded-md px-3 py-1.5 transition-colors ${
                    activeTab === idx
                      ? "bg-[var(--ink)] text-[#f2eee5] font-medium shadow-sm"
                      : "text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-black/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Command / Spec Bar */}
            <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-[var(--rule)] bg-[#ede7d8]/90 px-4 py-3 backdrop-blur-md">
              <span
                className={`font-mono text-xs text-[var(--cobalt)] font-medium transition-all duration-150 ${
                  isSwapping ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
                }`}
              >
                {TABS[activeTab].cmd}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy specification"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--rule)] bg-white/60 text-[var(--ink-2)] transition hover:bg-white hover:text-[var(--ink)]"
              >
                {copied ? <Check className="h-4 w-4 text-[var(--cobalt)]" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-4 font-mono text-[0.6875rem] text-[var(--ink-3)] pointer-events-auto">
          <span>Input: Dispersed Lead Stream (Raw)</span>
          <span>Cauchy Dispersion: 72 Spectral Bands</span>
          <span className="text-[var(--cobalt)] font-medium">Status: 0 Loss In Transit</span>
        </div>
      </div>
    </div>
  );
}
