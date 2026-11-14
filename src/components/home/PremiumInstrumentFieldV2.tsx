"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { stackLayers } from "@/content/institutional";
import { hashString, mulberry32 } from "@/components/experience/kit/random";
import { deriveTier, tierSettings } from "@/components/experience/kit/tier";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { readInstrumentFonts, readInstrumentPalette } from "@/lib/instrument/palette";
import { useThreeCanvas, getParticleCount, getGeometryDetail } from "@/components/premium";
import { DESIGN_COLORS, SPRINGS, MOTION_VARIANTS } from "@/components/premium";
import * as THREE from "three";

interface Signal {
  source: number;
  offset: number;
  speed: number;
  drift: number;
}

const SEED = hashString("imaginars-operating-field");
const GRID_ALPHA = 0.045;

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function buildSignals(count: number): Signal[] {
  const rand = mulberry32(SEED);
  const signals: Signal[] = [];
  for (let i = 0; i < count; i += 1) {
    signals.push({
      source: Math.floor(rand() * stackLayers.length),
      offset: rand(),
      speed: 0.55 + rand() * 0.9,
      drift: (rand() - 0.5) * 14,
    });
  }
  return signals;
}

export default function PremiumInstrumentFieldV2() {
  const figureRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef(-1);
  const legendHoverRef = useRef(-1);
  const requestDrawRef = useRef<(() => void) | null>(null);
  const paletteRef = useRef<{
    ink: string;
    ink2: string;
    ink3: string;
    cobalt: string;
    bone: string;
    bone2: string;
  } | null>(null);
  const signalsRef = useRef<Signal[] | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const frameRef = useRef(0);
  const reduced = useReducedMotion();
  const [legendActive, setLegendActive] = useState(-1);

  // Three.js background layer
  const { canvasRef: webglCanvasRef, context, performanceLevel } = useThreeCanvas("instrument-field-v2", { cameraZ: 85 });
  const webglParticlesRef = useRef<THREE.Points | null>(null);
  const webglSphereRef = useRef<THREE.Mesh | null>(null);
  const webglRingsRef = useRef<THREE.Mesh[]>([]);
  const webglLinesRef = useRef<THREE.Line[]>([]);

  useEffect(() => {
    if (reduced || !context) return;

    const { scene, camera, animate, stop } = context;
    const particleCount = getParticleCount("instrument", performanceLevel);
    const sphereDetail = getGeometryDetail("sphere", performanceLevel);

    // Ambient particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);
    const hues = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 20 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      velocities[i3] = (Math.random() - 0.5) * 0.008;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.008;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.008;

      sizes[i] = Math.random() * 0.6 + 0.2;
      alphas[i] = Math.random() * 0.25 + 0.05;
      hues[i] = Math.random();
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute("hue", new THREE.BufferAttribute(hues, 1));

    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: new THREE.Color(DESIGN_COLORS.primary.main),
    });

    const particles = new THREE.Points(geometry, material);
    webglParticlesRef.current = particles;
    scene.add(particles);

    // Central sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(3, sphereDetail);
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: DESIGN_COLORS.primary.main,
      metalness: 0,
      roughness: 0.2,
      transmission: 0.4,
      thickness: 0.5,
      transparent: true,
      opacity: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      ior: 1.5,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    webglSphereRef.current = sphere;
    scene.add(sphere);

    // Rings with shaders
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const ringGeometry = new THREE.RingGeometry(6 + i * 2.5, 8.5 + i * 2.5, 128);
      const ringMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color([DESIGN_COLORS.primary.main, DESIGN_COLORS.secondary.main, DESIGN_COLORS.accent.purple, DESIGN_COLORS.primary.main][i]) },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColor;
          void main() {
            float dist = length(vUv - vec2(0.5));
            float ring = smoothstep(0.47, 0.5, dist) - smoothstep(0.5, 0.53, dist);
            float pulse = sin(uTime * 0.5 + vUv.x * 20.0) * 0.3 + 0.7;
            gl_FragColor = vec4(uColor, ring * pulse * 0.25);
          }
        `,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = i % 2 === 0 ? -Math.PI / 2 : Math.PI / 2;
      ring.rotation.z = i * 0.4;
      scene.add(ring);
      rings.push(ring);
    }
    webglRingsRef.current = rings;

    // Flow lines connecting layers
    const lines: THREE.Line[] = [];
    for (let i = 0; i < 8; i++) {
      const lineGeometry = new THREE.BufferGeometry();
      const linePositions = new Float32Array(20 * 3);
      for (let j = 0; j < 20; j++) {
        const t = j / 19;
        const x = (Math.random() - 0.5) * 40;
        const y = -30 + t * 60;
        const z = (Math.random() - 0.5) * 30;
        linePositions[j * 3] = x;
        linePositions[j * 3 + 1] = y;
        linePositions[j * 3 + 2] = z;
      }
      lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
      const lineMaterial = new THREE.LineBasicMaterial({
        color: DESIGN_COLORS.secondary.main,
        transparent: true,
        opacity: 0.06,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
      lines.push(line);
    }
    webglLinesRef.current = lines;

    const animateFn = () => {
      const time = performance.now() * 0.001;

      // Particles
      const positions = geometry.attributes.position.array as Float32Array;
      const velocities = geometry.attributes.velocity.array as Float32Array;
      const hues = geometry.attributes.hue?.array as Float32Array || new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        velocities[i3] *= 0.995;
        velocities[i3 + 1] *= 0.995;
        velocities[i3 + 2] *= 0.995;

        const radius = Math.sqrt(positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2);
        if (radius > 70) {
          positions[i3] *= 0.97;
          positions[i3 + 1] *= 0.97;
          positions[i3 + 2] *= 0.97;
        }

        positions[i3 + 1] += Math.sin(time * 0.3 + i * 0.01) * 0.008;
      }
      geometry.attributes.position.needsUpdate = true;

      // Sphere
      if (webglSphereRef.current) {
        webglSphereRef.current.rotation.y += 0.0002;
        webglSphereRef.current.rotation.x += 0.0001;
      }

      // Rings
      webglRingsRef.current.forEach((ring, i) => {
        ring.rotation.y += 0.00015 * (i + 1);
        ring.rotation.z += 0.00008 * (i + 1);
        if (ring.material instanceof THREE.ShaderMaterial) {
          ring.material.uniforms.uTime.value = time;
        }
      });

      // Lines flow
      webglLinesRef.current.forEach((line) => {
        const linePos = line.geometry.attributes.position.array as Float32Array;
        for (let j = 0; j < 20; j++) {
          const j3 = j * 3;
          linePos[j3 + 1] += 0.02;
          if (linePos[j3 + 1] > 35) {
            linePos[j3] = (Math.random() - 0.5) * 40;
            linePos[j3 + 1] = -35;
            linePos[j3 + 2] = (Math.random() - 0.5) * 30;
          }
        }
        line.geometry.attributes.position.needsUpdate = true;
      });

      particles.rotation.y += 0.00003;
    };

    animate(animateFn);

    return () => {
      stop();
      geometry.dispose();
      (particles.material as THREE.Material).dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      rings.forEach(r => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      lines.forEach(l => {
        l.geometry.dispose();
        (l.material as THREE.Material).dispose();
      });
    };
  }, [reduced, context, performanceLevel]);

  // Canvas 2D logic (existing refined version)
  useEffect(() => {
    if (reduced) return;

    const figure = figureRef.current;
    const canvas = canvasRef.current;
    if (!figure || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fonts = readInstrumentFonts();

    const coarse =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;
    const cores =
      typeof navigator !== "undefined" && navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency
        : 4;
    const settings = tierSettings(deriveTier({ reduced, coarse, cores }));
    const signalBudget =
      settings.tier === "high" ? 110 : settings.tier === "balanced" ? 64 : 26;

    if (!signalsRef.current) {
      signalsRef.current = buildSignals(signalBudget);
    }
    paletteRef.current = readInstrumentPalette();

    const resize = () => {
      const rect = figure.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const dpr = Math.min(window.devicePixelRatio || 1, settings.dprMax);
      sizeRef.current = { width: rect.width, height: rect.height };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const draw = () => {
      const palette = paletteRef.current;
      const signals = signalsRef.current;
      if (!palette || !signals) return;
      const { width: w, height: h } = sizeRef.current;
      if (w < 1 || h < 1) return;

      const p = reduced ? 1 : easeOutCubic(progressRef.current);
      const pad = Math.max(18, Math.min(38, w * 0.04));
      const count = stackLayers.length;

      ctx.clearRect(0, 0, w, h);

      // Background gradient
      const meshGrad = ctx.createRadialGradient(
        w * 0.15, h * 0.85, 0,
        w * 0.15, h * 0.85, Math.max(w, h) * 0.8
      );
      meshGrad.addColorStop(0, "rgba(20, 216, 150, 0.04)");
      meshGrad.addColorStop(0.5, "rgba(59, 130, 246, 0.025)");
      meshGrad.addColorStop(1, "transparent");
      ctx.fillStyle = meshGrad;
      ctx.fillRect(0, 0, w, h);

      // Grid
      const grid = Math.max(26, Math.min(42, w / 24));
      ctx.save();
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 1;
      ctx.globalAlpha = GRID_ALPHA;
      ctx.beginPath();
      for (let x = pad; x <= w - pad + 0.5; x += grid) {
        ctx.moveTo(Math.round(x) + 0.5, pad);
        ctx.lineTo(Math.round(x) + 0.5, h - pad);
      }
      for (let y = pad; y <= h - pad + 0.5; y += grid) {
        ctx.moveTo(pad, Math.round(y) + 0.5);
        ctx.lineTo(w - pad, Math.round(y) + 0.5);
      }
      ctx.stroke();
      ctx.restore();

      // Frame corners
      ctx.save();
      ctx.strokeStyle = palette.ink;
      ctx.globalAlpha = 0.2;
      ctx.lineWidth = 1;
      const tick = 14;
      const corners: Array<[number, number, number, number]> = [
        [pad, pad, 1, 1],
        [w - pad, pad, -1, 1],
        [pad, h - pad, 1, -1],
        [w - pad, h - pad, -1, -1],
      ];
      for (const [cx, cy, dx, dy] of corners) {
        ctx.beginPath();
        ctx.moveTo(cx + dx * tick, cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy + dy * tick);
        ctx.stroke();
      }
      ctx.restore();

      // Geometry
      const top = pad + 12;
      const bottom = h - pad - 28;
      const areaH = Math.max(40, bottom - top);
      const gap = lerp(24, 10, p);
      const plateH = Math.max(14, (areaH - gap * (count - 1)) / count);
      const plateW = (w - pad * 2) * 0.52;
      const spineX = pad + plateW + Math.max(48, (w - pad * 2 - plateW) * 0.4);

      const plateCenterY = (index: number) =>
        top + index * (plateH + gap) + plateH / 2;

      // Plates with premium styling
      stackLayers.forEach((layer, i) => {
        const wobble = (i % 2 === 0 ? -1 : 1) * (16 + ((i * 7) % 24));
        const x = pad + (1 - p) * wobble;
        const y = top + i * (plateH + gap);
        const skew = (1 - p) * 0.04 * (i % 2 === 0 ? 1 : -1);
        const highlight = pointerRef.current === i || legendHoverRef.current === i;
        const isSpine = i === count - 1;

        ctx.save();
        ctx.translate(x, y);
        ctx.transform(1, 0, skew, 1, 0, 0);

        // Depth shadow
        ctx.save();
        ctx.globalAlpha = 0.12 * p;
        ctx.fillStyle = "#000";
        ctx.fillRect(5, 5, plateW, plateH);
        ctx.restore();

        // Plate background with gradient
        const plateGrad = ctx.createLinearGradient(0, 0, plateW, plateH);
        if (isSpine) {
          plateGrad.addColorStop(0, palette.bone2);
          plateGrad.addColorStop(1, palette.bone);
        } else {
          plateGrad.addColorStop(0, palette.bone);
          plateGrad.addColorStop(1, palette.bone2);
        }
        ctx.globalAlpha = (isSpine ? 0.75 : 0.55) + 0.3 * p;
        ctx.fillStyle = plateGrad;
        ctx.fillRect(0, 0, plateW, plateH);

        // Specular sweep on hover
        if (highlight) {
          const specGrad = ctx.createLinearGradient(0, 0, plateW, 0);
          specGrad.addColorStop(0, "transparent");
          specGrad.addColorStop(0.4, "rgba(255,255,255,0.1)");
          specGrad.addColorStop(0.6, "rgba(255,255,255,0.05)");
          specGrad.addColorStop(1, "transparent");
          ctx.globalAlpha = 0.7;
          ctx.fillStyle = specGrad;
          ctx.fillRect(0, 0, plateW, plateH);
        }

        // Border
        ctx.globalAlpha = (highlight ? 0.6 : 0.25) + 0.2 * p;
        ctx.strokeStyle = highlight ? palette.cobalt : palette.ink;
        ctx.lineWidth = highlight ? 1.5 : 1;
        ctx.strokeRect(0.5, 0.5, plateW - 1, plateH - 1);

        if (highlight) {
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = palette.cobalt;
          ctx.fillRect(0, 0, 3, plateH);
        }

        // Spine indicator
        if (isSpine) {
          ctx.globalAlpha = 0.5 + 0.25 * p;
          ctx.strokeStyle = palette.cobalt;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(plateW - 5, 0);
          ctx.lineTo(plateW - 5, plateH);
          ctx.stroke();
        }

        const indexSize = Math.max(8.5, Math.min(10.5, plateH * 0.44));
        const titleSize = Math.max(10, Math.min(12.5, plateH * 0.52));

        // Index
        ctx.globalAlpha = 0.5 + 0.3 * p;
        ctx.fillStyle = isSpine ? palette.cobalt : palette.ink3;
        ctx.font = `600 ${indexSize}px ${fonts.mono}`;
        ctx.textBaseline = "middle";
        ctx.fillText(layer.index, 14, plateH / 2 + 0.5);

        // Title
        ctx.globalAlpha = 0.75 + 0.2 * p;
        ctx.fillStyle = palette.ink2;
        ctx.font = `500 ${titleSize}px ${fonts.sans}`;
        ctx.fillText(layer.title, 44, plateH / 2 + 0.5);

        if (plateH > 22) {
          ctx.globalAlpha = 0.3 + 0.25 * p;
          ctx.fillStyle = isSpine ? palette.cobalt : palette.ink3;
          ctx.fillRect(plateW - 18, plateH / 2 - 3, 8, 6);
        }
        ctx.restore();
      });

      // Spine line
      ctx.save();
      ctx.strokeStyle = palette.ink;
      ctx.globalAlpha = 0.15 + 0.1 * p;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(spineX + 0.5, top);
      ctx.lineTo(spineX + 0.5, bottom);
      ctx.stroke();
      ctx.restore();

      // Records flowing
      ctx.save();
      for (const signal of signals) {
        const u = (signal.offset + p * signal.speed * 2) % 1;
        if (u <= 0.001 || u >= 0.999) continue;
        const sourceY = plateCenterY(signal.source);
        const startX = pad - 10;
        const x = lerp(startX, spineX, easeOutCubic(u));
        const y = sourceY + Math.sin(u * Math.PI) * signal.drift;
        const alpha = Math.sin(u * Math.PI) * (0.25 + 0.4 * p);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = signal.source === count - 1 ? palette.cobalt : palette.ink2;
        const size = 1.8 + 0.6 * p;
        ctx.fillRect(x, y - size / 2, size, size);
      }
      ctx.restore();

      // Verified ticks
      const tickCount = Math.floor(p * 22);
      ctx.save();
      ctx.strokeStyle = palette.cobalt;
      ctx.lineWidth = 1.2;
      for (let k = 0; k < tickCount; k += 1) {
        const ty = lerp(bottom - 8, top + 8, k / 21);
        ctx.globalAlpha = 0.3 + 0.4 * (k / 22);
        ctx.beginPath();
        ctx.moveTo(spineX + 2, ty + 0.5);
        ctx.lineTo(spineX + 11, ty + 0.5);
        ctx.stroke();
      }
      ctx.restore();

      // Handover seal
      if (p > 0.985) {
        const sealX = spineX + 6;
        const sealY = top - 5;
        ctx.save();
        ctx.globalAlpha = 0.95;
        ctx.strokeStyle = palette.cobalt;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(sealX, sealY, 9.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(sealX - 4, sealY + 0.5);
        ctx.lineTo(sealX - 1, sealY + 3.8);
        ctx.lineTo(sealX + 4.5, sealY - 3.8);
        ctx.stroke();
        ctx.restore();
      }

      // Readout
      const readIndex = pointerRef.current;
      const readLayer = readIndex >= 0 ? stackLayers[readIndex] : undefined;
      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = readLayer ? palette.cobalt : palette.ink3;
      ctx.font = `500 10px ${fonts.mono}`;
      ctx.textBaseline = "alphabetic";
      const readText = readLayer
        ? `${readLayer.index} · ${readLayer.title.toUpperCase()}`
        : "OPERATING FIELD · LAYERS 01 — 08";
      ctx.fillText(readText, pad, h - pad);
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = palette.ink3;
      ctx.font = `500 10px ${fonts.mono}`;
      const legend = p >= 0.985 ? "HANDOVER COMPLETE" : "ASSEMBLING";
      const legendWidth = ctx.measureText(legend).width;
      ctx.fillText(legend, w - pad - legendWidth, h - pad);
      ctx.restore();
    };

    const scheduleDraw = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = 0;
        draw();
      });
    };

    requestDrawRef.current = scheduleDraw;

    const visibleRef = { current: false };

    const readProgress = () => {
      if (reduced) { progressRef.current = 1; return; }
      const rect = figure.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const raw = clamp01((vh - rect.top) / (vh * 0.8 + rect.height * 0.4));
      progressRef.current = raw;
    };

    const onScroll = () => { if (visibleRef.current) { readProgress(); scheduleDraw(); } };
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.height < 1) return;
      const pad = Math.max(18, Math.min(38, rect.width * 0.04));
      const top = pad + 12;
      const bottom = rect.height - pad - 28;
      const gap = lerp(24, 10, easeOutCubic(progressRef.current));
      const plateH = Math.max(14, (bottom - top - gap * (stackLayers.length - 1)) / stackLayers.length);
      const y = event.clientY - rect.top;
      const index = Math.floor((y - top) / (plateH + gap));
      const next = index >= 0 && index < stackLayers.length ? index : -1;
      if (next !== pointerRef.current) { pointerRef.current = next; scheduleDraw(); }
    };
    const onPointerLeave = () => { if (pointerRef.current !== -1) { pointerRef.current = -1; scheduleDraw(); } };
    const onVisibility = () => { if (!document.hidden && visibleRef.current) { readProgress(); scheduleDraw(); } };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(figure);

    const themeObserver = new MutationObserver(() => {
      paletteRef.current = readInstrumentPalette();
      scheduleDraw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "style"] });

    const intersectionObserver = new IntersectionObserver(
      (entries) => { const entry = entries[0]; visibleRef.current = Boolean(entry?.isIntersecting); if (visibleRef.current) { readProgress(); scheduleDraw(); } },
      { rootMargin: "160px 0px", threshold: 0 },
    );
    intersectionObserver.observe(figure);

    readProgress(); resize();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleDraw, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleDraw);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      resizeObserver.disconnect(); intersectionObserver.disconnect(); themeObserver.disconnect();
      requestDrawRef.current = null;
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [reduced]);

  return (
    <section className="inst-section instrument-field-v2" aria-labelledby="home-field">
      <div className="inst-shell">
        <motion.div 
          className="instrument-head" 
          variants={MOTION_VARIANTS.section}
        >
          <div>
            <p className="inst-label">The operating field</p>
            <h2 id="home-field" className="inst-h2 mt-5 max-w-[24ch]">
              Eight layers, assembled into <span className="inst-serif">one ledger.</span>
            </h2>
          </div>
          <p className="instrument-lede">
            The stack is not a menu. Brand, site, admissions, portal and the record behind them share one set of definitions. Scroll the drawing and the layers close ranks — the same way the engagement does.
          </p>
        </motion.div>

        <motion.div 
          className="instrument-body" 
          variants={MOTION_VARIANTS.section}
        >
          <figure className="instrument-plate" ref={figureRef}>
            <canvas ref={canvasRef} className="instrument-canvas-2d" aria-hidden="true" />
            <canvas ref={webglCanvasRef} className="instrument-canvas-3d" aria-hidden="true" />
            <figcaption className="instrument-caption">Schematic drawing. Not client data.</figcaption>
          </figure>

          <motion.div className="instrument-legend-panel glass-morph" variants={MOTION_VARIANTS.staggerContainer}>
            <ol className="instrument-legend" aria-label="The eight operating layers">
              {stackLayers.map((layer, index) => (
                <motion.li
                  key={layer.id}
                  className="instrument-legend-item"
                  variants={MOTION_VARIANTS.staggerItem}
                  onPointerEnter={() => { legendHoverRef.current = index; requestDrawRef.current?.(); }}
                  onPointerLeave={() => { if (legendHoverRef.current === index) { legendHoverRef.current = -1; requestDrawRef.current?.(); } }}
                >
                  <span className="legend-index">{layer.index}</span>
                  <span className="legend-content">
                    <span className="legend-title">{layer.title}</span>
                    <span className="legend-short">{layer.short}</span>
                  </span>
                  <motion.span 
                    className="legend-indicator" 
                    aria-hidden="true"
                    animate={{ scaleX: legendHoverRef.current === index ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}