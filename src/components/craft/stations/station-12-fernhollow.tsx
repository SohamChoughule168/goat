"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Volume2, VolumeX } from "lucide-react";
import type { CraftStation as CraftStationData } from "@/content/craft";
import CraftStation from "@/components/craft/craft-station";
import { PosterFernhollow } from "@/components/craft/station-posters";

export default function StationFernhollow({ station }: { station: CraftStationData }) {
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [status, setStatus] = useState("Static night valley poster. 2,200 flora sprites.");
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  function run() {
    setIsRunning(true);
    setStatus("Bioluminescent flora and spline flight running.");
  }

  function reset() {
    setIsRunning(false);
    setIsMuted(true);
    setStatus("Static night valley poster restored.");
  }

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
    <CraftStation
      station={station}
      poster={<PosterFernhollow />}
      live={isRunning}
      status={status}
      controls={
        <>
          <button
            type="button"
            className="inst-btn"
            onClick={run}
            disabled={isRunning}
          >
            {isRunning ? "Running" : "Run station"}
          </button>
          <button
            type="button"
            className="inst-btn inst-btn-ghost"
            onClick={reset}
            disabled={!isRunning}
          >
            Reset
          </button>
          {isRunning && (
            <button
              type="button"
              onClick={toggleAudio}
              className="inst-btn inst-btn-ghost"
              aria-label={isMuted ? "Unmute ambient audio" : "Mute ambient audio"}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-[#5ee6a8]" />}
              {isMuted ? "Sound off" : "Sound on"}
            </button>
          )}
        </>
      }
    >
      <div
        ref={containerRef}
        className="relative h-full w-full overflow-hidden bg-[#010503]"
      />
    </CraftStation>
  );
}
