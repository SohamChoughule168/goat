"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Volume2, VolumeX, Play, RotateCcw } from "lucide-react";
import type { CraftStation } from "@/content/craft";

export default function StationFernhollow({ station }: { station: CraftStation }) {
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    const container = containerRef.current;
    if (!container) return;

    let animId: number;
    const width = container.clientWidth;
    const height = container.clientHeight || 420;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020704, 0.015);

    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x010503, 1);
    container.appendChild(renderer.domElement);

    // Moonlight
    const ambient = new THREE.AmbientLight(0x0a1a12, 1.4);
    scene.add(ambient);
    const moon = new THREE.DirectionalLight(0xa5d8c8, 1.8);
    moon.position.set(30, 80, -60);
    scene.add(moon);

    // Terrain
    const terrainGeo = new THREE.PlaneGeometry(280, 560, 70, 140);
    terrainGeo.rotateX(-Math.PI / 2);
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const valley = Math.pow(Math.abs(x) / 32, 1.8) * 4;
      const hills = Math.sin(x * 0.05) * Math.cos(z * 0.04) * 5;
      pos.setY(i, valley + hills - 5);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x05130b,
      roughness: 0.88,
      metalness: 0.12,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.set(0, 0, -220);
    scene.add(terrain);

    // Procedural Glowing Flower Canvas Texture
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, "rgba(255, 255, 245, 1)");
    grad.addColorStop(0.35, "rgba(165, 235, 195, 0.85)");
    grad.addColorStop(0.7, "rgba(75, 175, 140, 0.3)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();
    const flowerTexture = new THREE.CanvasTexture(canvas);

    // Flora Point Cloud
    const count = 2200;
    const floraGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color(0xf5efe2),
      new THREE.Color(0xc6f3be),
      new THREE.Color(0xa2ecd8),
      new THREE.Color(0xe8d5f5),
      new THREE.Color(0xfff8d6),
    ];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 180;
      const z = -Math.random() * 480;
      const valley = Math.pow(Math.abs(x) / 32, 1.8) * 4;
      const hills = Math.sin(x * 0.05) * Math.cos(z * 0.04) * 5;
      const y = valley + hills - 3.8 + Math.random() * 1.8;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    floraGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    floraGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const floraMat = new THREE.PointsMaterial({
      size: 6.5,
      map: flowerTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const flora = new THREE.Points(floraGeo, floraMat);
    scene.add(flora);

    // Spline Curve Camera Path
    const points = [
      new THREE.Vector3(0, 12, 0),
      new THREE.Vector3(10, 8, -60),
      new THREE.Vector3(-14, 7, -140),
      new THREE.Vector3(12, 6, -240),
      new THREE.Vector3(-8, 9, -340),
      new THREE.Vector3(0, 12, -440),
    ];
    const curve = new THREE.CatmullRomCurve3(points, true);

    let progress = 0;
    let mouse = { x: 0, y: 0 };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    container.addEventListener("pointermove", handlePointerMove);

    const render = () => {
      progress = (progress + 0.00035) % 1;
      const camPos = curve.getPointAt(progress);
      const lookTarget = curve.getPointAt((progress + 0.04) % 1);

      camera.position.copy(camPos);
      camera.position.x += mouse.x * 2;
      camera.position.y += mouse.y * 1.5;
      camera.lookAt(lookTarget.x + mouse.x * 3, lookTarget.y + mouse.y * 2, lookTarget.z);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      floraGeo.dispose();
      floraMat.dispose();
      flowerTexture.dispose();
    };
  }, [isRunning]);

  // Audio Synthesizer Toggle
  const toggleAudio = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Soft ambient chords
      [220, 261.63, 329.63, 440].forEach((freq) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        g.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.connect(g);
        g.connect(masterGain);
        osc.start();
      });
    }

    const ctx = audioContextRef.current;
    if (ctx && ctx.state === "suspended") ctx.resume();

    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (masterGainRef.current && ctx) {
      masterGainRef.current.gain.linearRampToValueAtTime(nextMuted ? 0.0001 : 0.25, ctx.currentTime + 0.8);
    }
  };

  return (
    <div className="craft-bench">
      <div className="craft-bench-header">
        <div>
          <span className="inst-num">{station.index}</span>
          <h3>{station.title}</h3>
          <p className="mt-1 text-xs text-[var(--ink-3)]">{station.summary}</p>
        </div>
        <div className="flex items-center gap-2">
          {isRunning && (
            <button
              type="button"
              onClick={toggleAudio}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-[var(--ink)] transition hover:bg-white/15"
              aria-label={isMuted ? "Unmute ambient audio" : "Mute ambient audio"}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-[#5ee6a8]" />}
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-strong)] bg-[var(--surface-elevated)] px-3 py-1.5 font-mono text-xs text-[var(--ink)] transition hover:bg-[var(--border-strong)]"
          >
            {isRunning ? (
              <>
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" /> Run Station
              </>
            )}
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative mt-4 h-80 w-full overflow-hidden rounded-xl border border-[var(--line)] bg-[#010503]"
      >
        {!isRunning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="h-3 w-3 rounded-full bg-[#a2ecd8] shadow-[0_0_12px_#a2ecd8]" />
            <h4 className="mt-4 font-serif text-2xl text-[#f5efe2]">Grown, not built.</h4>
            <p className="mt-1 max-w-sm text-xs text-[#a2ecd8]/80">
              Interactive 3D night flower valley with 2,200 glowing point-sprites, Catmull-Rom camera flight, and harmonic synthesizer.
            </p>
            <button
              type="button"
              onClick={() => setIsRunning(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-mono text-xs text-[#f5efe2] transition hover:bg-white/20"
            >
              <Play className="h-3 w-3" /> Mount 3D Valley
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[0.625rem] text-[var(--ink-4)]">
        <span>Runtime: Three.js r160 Point-Sprite Cloud</span>
        <span>Payload: 0 KB until Run</span>
      </div>
    </div>
  );
}
