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
    let height = container.clientHeight || 520;

    // DPR
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    glCanvas.width = width * dpr;
    glCanvas.height = height * dpr;
    fxCanvas.width = width * dpr;
    fxCanvas.height = height * dpr;

    const fxCtx = fxCanvas.getContext("2d");
    if (!fxCtx) return;

    // Three.js Scene Setup for Glass Prism
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
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

    // Physical Glass Material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 1,
      transparent: true,
      roughness: 0.06,
      metalness: 0.05,
      ior: 1.645,
      thickness: 2.2,
      specularIntensity: 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      attenuationColor: new THREE.Color(0xdffff4),
      attenuationDistance: 1.5,
    });

    const prism = new THREE.Mesh(geometry, glassMaterial);
    scene.add(prism);

    // Subtle edge highlight wireframe
    const wireGeo = new THREE.EdgesGeometry(geometry, 28);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x9be8d8,
      transparent: true,
      opacity: 0.35,
    });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    prism.add(wireframe);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0e1b15, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff0dd, 2.5);
    keyLight.position.set(5, 6, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x6fe2c2, 3.2);
    rimLight.position.set(-6, -2, -6);
    scene.add(rimLight);

    // Mouse pointer state
    let targetMouse = { x: 0.45, y: 0.2 };
    let mouse = { x: 0.45, y: 0.2 };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / rect.width;
      targetMouse.y = (e.clientY - rect.top) / rect.height;
    };

    container.addEventListener("pointermove", handlePointerMove);

    // 70 Dust Motes drifting along incoming beam
    const motes = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: (Math.random() - 0.5) * 0.18,
      size: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.003 + 0.001,
    }));

    // Spectral dispersion colors (72 wavelengths)
    const spectrumColors = [
      "#4a00e0", "#5c00e6", "#7300e6", "#8e00e6", "#aa00e6", // Violet
      "#0055ff", "#0088ff", "#00b4d8", "#00f0ff",             // Blue/Cyan
      "#00e676", "#38ef7d", "#76ff03", "#b2ff59",             // Green
      "#ffd600", "#ffab00", "#ff9100",                         // Yellow/Orange
      "#ff3d00", "#ff1744", "#d50000"                          // Red
    ];

    let t = 0;

    const render = () => {
      t += 0.016;

      // Smooth mouse easing
      mouse.x += (targetMouse.x - mouse.x) * 0.08;
      mouse.y += (targetMouse.y - mouse.y) * 0.08;

      // 3D Prism subtle orbit
      prism.rotation.y = (mouse.x - 0.5) * 0.6 + Math.sin(t * 0.4) * 0.08;
      prism.rotation.x = (mouse.y - 0.5) * 0.4 + Math.cos(t * 0.3) * 0.05;
      prism.rotation.z = Math.sin(t * 0.2) * 0.03;

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
      const entryY = cy + (mouse.y - 0.5) * ch * 0.3;

      const sourceX = cw + 80;
      const sourceY = entryY - (entryX - sourceX) * 0.32;

      // Draw Incoming White Beam (with soft outer glow + bright core)
      fxCtx.save();
      fxCtx.lineCap = "round";

      // Outer beam glow
      fxCtx.beginPath();
      fxCtx.moveTo(sourceX, sourceY);
      fxCtx.lineTo(entryX, entryY);
      fxCtx.strokeStyle = "rgba(255, 255, 255, 0.22)";
      fxCtx.lineWidth = 14 * dpr;
      fxCtx.stroke();

      // Core intense beam
      fxCtx.beginPath();
      fxCtx.moveTo(sourceX, sourceY);
      fxCtx.lineTo(entryX, entryY);
      fxCtx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      fxCtx.lineWidth = 4 * dpr;
      fxCtx.stroke();

      // Drifting dust motes along the incoming beam
      motes.forEach((mote) => {
        mote.x -= mote.speed;
        if (mote.x < 0) mote.x = 1;
        const px = entryX + (sourceX - entryX) * mote.x;
        const py = entryY + (sourceY - entryY) * mote.x + mote.y * ch;

        fxCtx.beginPath();
        fxCtx.arc(px, py, mote.size * dpr, 0, Math.PI * 2);
        fxCtx.fillStyle = `rgba(255, 255, 255, ${mote.alpha * (0.6 + Math.sin(t * 3 + px) * 0.4)})`;
        fxCtx.fill();
      });

      // Entry Face Glint
      const glintGrad = fxCtx.createRadialGradient(entryX, entryY, 2, entryX, entryY, 24 * dpr);
      glintGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
      glintGrad.addColorStop(0.3, "rgba(180, 245, 220, 0.8)");
      glintGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      fxCtx.fillStyle = glintGrad;
      fxCtx.beginPath();
      fxCtx.arc(entryX, entryY, 24 * dpr, 0, Math.PI * 2);
      fxCtx.fill();

      // Refracted Rainbow Spectral Fan leaving the left side
      const fanOriginX = cx - cw * 0.08;
      const fanOriginY = cy + (mouse.y - 0.5) * ch * 0.15;
      const numRays = spectrumColors.length;

      // Group quads between adjacent rays
      for (let i = 0; i < numRays; i++) {
        const factor = i / (numRays - 1);
        const spreadAngle = -0.45 + factor * 0.95; // Fanning angle
        const endX = -40;
        const endY = fanOriginY + Math.tan(spreadAngle) * fanOriginX * 1.1;

        // Volumetric quad fill
        if (i < numRays - 1) {
          const nextFactor = (i + 1) / (numRays - 1);
          const nextAngle = -0.45 + nextFactor * 0.95;
          const nextEndY = fanOriginY + Math.tan(nextAngle) * fanOriginX * 1.1;

          const quadGrad = fxCtx.createLinearGradient(fanOriginX, fanOriginY, endX, endY);
          quadGrad.addColorStop(0, spectrumColors[i]);
          quadGrad.addColorStop(0.4, spectrumColors[i]);
          quadGrad.addColorStop(1, "rgba(0,0,0,0)");

          fxCtx.beginPath();
          fxCtx.moveTo(fanOriginX, fanOriginY);
          fxCtx.lineTo(endX, endY);
          fxCtx.lineTo(endX, nextEndY);
          fxCtx.closePath();
          fxCtx.fillStyle = quadGrad;
          fxCtx.globalAlpha = 0.42;
          fxCtx.fill();
          fxCtx.globalAlpha = 1.0;
        }

        // Sharp spectral core line
        fxCtx.beginPath();
        fxCtx.moveTo(fanOriginX, fanOriginY);
        fxCtx.lineTo(endX, endY);
        fxCtx.strokeStyle = spectrumColors[i];
        fxCtx.lineWidth = 2.4 * dpr;
        fxCtx.stroke();
      }

      fxCtx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight || 520;
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
      className={`relative w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[#0d1410] p-6 text-[var(--ink)] shadow-2xl lg:p-10 ${className}`}
      style={{ minHeight: "560px" }}
    >
      {/* 3D Canvas Stage */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <canvas ref={glCanvasRef} className="absolute inset-0 h-full w-full" />
        <canvas ref={fxCanvasRef} className="absolute inset-0 h-full w-full mix-blend-screen" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col justify-between pointer-events-none">
        {/* Top badge & kicker */}
        <div className="flex flex-wrap items-center justify-between gap-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-6 items-center gap-2 rounded-full border border-[#a2ecd8]/30 bg-[#a2ecd8]/10 px-3 font-mono text-[0.6875rem] uppercase tracking-wider text-[#a2ecd8]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5ee6a8] shadow-[0_0_8px_#5ee6a8]" />
              The Clarity Prism
            </span>
            <span className="font-mono text-[0.6875rem] uppercase tracking-widest text-[var(--ink-4)]">
              Optical System Engine
            </span>
          </div>
          <span className="font-mono text-[0.6875rem] text-[var(--ink-3)]">
            Hover to steer refractive ray path
          </span>
        </div>

        {/* Center Copy */}
        <div className="my-10 max-w-xl pointer-events-auto">
          <h3 className="text-3xl font-medium tracking-tight text-white lg:text-4xl">
            Refracting chaos into <span className="font-serif italic text-[#c6f35c]">eight clean streams.</span>
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-[var(--ink-2)] lg:text-base">
            Raw enquiries arrive unformatted via WhatsApp, direct search, and meta campaigns.
            The Imaginars architecture acts as a precision optical prism — purifying the intake,
            binding student records, and fanning out into distinct, governed operating layers.
          </p>

          {/* Interactive Protocol Tabs */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3 font-mono text-xs">
              {TABS.map((tab, idx) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(idx)}
                  className={`rounded-md px-3 py-1.5 transition-colors ${
                    activeTab === idx
                      ? "bg-white/15 text-white font-medium shadow-sm"
                      : "text-[var(--ink-3)] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Command / Spec Bar */}
            <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md">
              <span
                className={`font-mono text-xs text-[#a2ecd8] transition-all duration-150 ${
                  isSwapping ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
                }`}
              >
                {TABS[activeTab].cmd}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy specification"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-[var(--ink-2)] transition hover:bg-white/15 hover:text-white"
              >
                {copied ? <Check className="h-4 w-4 text-[#5ee6a8]" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 font-mono text-[0.6875rem] text-[var(--ink-3)] pointer-events-auto">
          <span>Input: Dispersed Lead Stream (Raw)</span>
          <span>Cauchy Dispersion: 72 Spectral Bands</span>
          <span className="text-[#c6f35c]">Status: 0 Loss In Transit</span>
        </div>
      </div>
    </div>
  );
}
