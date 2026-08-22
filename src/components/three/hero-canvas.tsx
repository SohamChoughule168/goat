"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { detectTier } from "@/lib/three/support";

const VERTEX = `
attribute vec3 aHelix;
attribute vec3 aMark;
attribute float aRand;
uniform float uTime;
uniform float uMorph;
uniform float uSize;
uniform float uPr;
uniform vec2 uMouse;
uniform float uAspect;
uniform float uBurst;
varying float vMix;
varying float vCrystal;
varying float vPhase;
varying float vRing;

void main() {
  float m1 = smoothstep(0.0, 0.72, uMorph);
  float m2 = smoothstep(1.0, 1.78, uMorph);
  vec3 pos = mix(mix(position, aHelix, m1), aMark, m2);
  pos.x += sin(uTime * (0.5 + aRand) + aRand * 40.0) * 0.02 * (1.0 - m2);
  pos.y += cos(uTime * 0.6 + aRand * 30.0) * 0.03 * (1.0 - m2);
  pos.z += sin(uTime * 0.45 + aRand * 20.0) * 0.02 * (1.0 - m2);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vec4 clip = projectionMatrix * mv;

  vec2 ndc = clip.xy / clip.w;
  vec2 dMouse = ndc - uMouse * vec2(uAspect, 1.0);
  float fall = exp(-dot(dMouse, dMouse) * 16.0);
  clip.xy -= dMouse * fall * 0.16 * clip.w;

  float dCenter = length(ndc);
  float ring = uBurst > 0.001 ? exp(-pow((dCenter - uBurst * 1.45) / 0.16, 2.0)) : 0.0;
  vec2 dirC = dCenter > 0.0001 ? ndc / dCenter : vec2(0.0);
  clip.xy += dirC * ring * 0.09 * clip.w;

  gl_Position = clip;
  gl_PointSize = uSize * (0.55 + aRand) * uPr * (30.0 / -mv.z)
    * (1.0 + fall * 1.2 + ring * 1.4)
    * (0.88 + 0.24 * sin(uTime * (2.0 + aRand * 3.0) + aRand * 80.0));
  vMix = aRand;
  vPhase = m1 + m2;
  vRing = ring;
  vCrystal = m2 * step(0.35, aRand);
}
`;

const FRAGMENT = `
precision mediump float;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uHeat;
uniform vec3 uCurrent;
uniform vec3 uGold;
uniform float uOpacity;
varying float vMix;
varying float vCrystal;
varying float vPhase;
varying float vRing;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float a = smoothstep(0.5, 0.12, d) * uOpacity;

  float p = clamp(vPhase + (vMix - 0.5) * 0.22, 0.0, 2.0);
  vec3 imagination = mix(uColorA, uHeat, smoothstep(0.25, 0.8, vMix));
  vec3 engineering = uCurrent;
  vec3 product = mix(uGold, uColorB, step(0.85, vMix));
  vec3 col = mix(imagination, engineering, smoothstep(0.55, 1.05, p));
  col = mix(col, product, smoothstep(1.45, 1.95, p));
  col = mix(col, uColorC, vCrystal * 0.45);
  col += uHeat * vRing * 0.9;

  a += smoothstep(0.5, 0.18, d) * vCrystal * 0.35;
  a += vRing * 0.28;
  gl_FragColor = vec4(col, a);
}
`;

function helixRadius(t: number): number {
  return 0.55 + 0.75 * Math.sin(Math.pow(t, 0.8) * Math.PI) + 0.12;
}

function buildHelix(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    let x: number;
    let y: number;
    let z: number;
    if (t > 0.94) {
      const haloT = (t - 0.94) / 0.06;
      const angle = haloT * Math.PI * 6;
      x = Math.cos(angle) * 1.7;
      z = Math.sin(angle) * 1.7;
      y = 1.95 - haloT * 0.35;
    } else if (i % 9 === 0) {
      const tt = t / 0.94;
      const strand = i % 18 === 0 ? 0 : Math.PI;
      const angle = tt * Math.PI * 7 + strand;
      const r = helixRadius(tt);
      const bx = Math.cos(angle - strand * 0) * r;
      const bz = Math.sin(angle - strand * 0) * r;
      const otherAngle = angle + Math.PI - strand * 2;
      const ox = Math.cos(otherAngle) * r;
      const oz = Math.sin(otherAngle) * r;
      const s = ((i * 2654435761) % 1000) / 1000;
      x = bx + (ox - bx) * s;
      z = bz + (oz - bz) * s;
      y = (tt - 0.5) * 3.4;
    } else {
      const strand = i % 2 === 0 ? 0 : Math.PI;
      const angle = t * Math.PI * 7 + strand;
      const r = helixRadius(t);
      x = Math.cos(angle) * r;
      z = Math.sin(angle) * r;
      y = (t - 0.5) * 3.4;
    }
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

const MARK_R = 1.5;

function markPoint(kind: number, s: number): [number, number] {
  if (kind < 0.62) {
    const edge = Math.min(3, Math.floor(s * 4));
    const t = s * 4 - edge;
    const corners: Array<[number, number]> = [
      [0, MARK_R],
      [MARK_R, 0],
      [0, -MARK_R],
      [-MARK_R, 0],
    ];
    const a = corners[edge];
    const b = corners[(edge + 1) % 4];
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  }
  if (kind < 0.84) {
    const t = (s * 100) % 1;
    const side = kind < 0.73 ? -1 : 1;
    return [side * 0.62 * (1 - t), -0.42 + (0.52 - -0.42) * t];
  }
  if (kind < 0.94) {
    const angle = s * Math.PI * 2;
    const rr = 0.07 + s * 0.05;
    return [Math.cos(angle) * rr, -0.32 + Math.sin(angle) * rr * 0.7];
  }
  const angle = s * Math.PI * 2;
  return [Math.cos(angle) * MARK_R * 1.24, Math.sin(angle) * MARK_R * 1.24];
}

function buildMark(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const jitter = 0.02;
    const [x, y] = markPoint(((i * 7919) % 10000) / 10000, ((i * 104729) % 9973) / 9973);
    out[i * 3] = x + (((i * 31) % 100) / 100 - 0.5) * jitter;
    out[i * 3 + 1] = y + (((i * 57) % 100) / 100 - 0.5) * jitter;
    out[i * 3 + 2] = (((i * 13) % 100) / 100 - 0.5) * jitter * 3;
  }
  return out;
}

function buildMarkEdges(): Float32Array {
  const pts: number[] = [];
  const push = (x: number, y: number, z = 0) => pts.push(x, y, z);
  const c: Array<[number, number]> = [
    [0, MARK_R],
    [MARK_R, 0],
    [0, -MARK_R],
    [-MARK_R, 0],
  ];
  for (let e = 0; e < 4; e++) {
    const a = c[e];
    const b = c[(e + 1) % 4];
    push(a[0], a[1]);
    push(b[0], b[1]);
  }
  push(-0.62, -0.42); push(0, 0.52);
  push(0, 0.52); push(0.62, -0.42);
  for (let s = 0; s < 8; s++) {
    const a1 = (s / 8) * Math.PI * 2;
    const a2 = ((s + 1) / 8) * Math.PI * 2;
    push(Math.cos(a1) * 0.09, -0.32 + Math.sin(a1) * 0.07);
    push(Math.cos(a2) * 0.09, -0.32 + Math.sin(a2) * 0.07);
  }
  return new Float32Array(pts);
}

export type HeroPhase = 1 | 2 | 3;

export default function HeroCanvas({
  onPhase,
}: {
  onPhase?: (phase: HeroPhase) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tier = detectTier();
    const container = containerRef.current;
    if (tier === "none" || !container || !container.isConnected) return;

    const fallback = container.querySelector<HTMLElement>("[data-hero-fallback]");
    if (fallback) fallback.style.display = "none";

    let running = true;
    let inView = true;
    let rafId = 0;
    let cleanup: (() => void) | null = null;
    let lastPhase: HeroPhase = 1;

    (async () => {
      const THREE = await import("three");
      if (!running || !container || !container.isConnected) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === "full" ? 1.75 : 1.25));
      renderer.setSize(width, height);
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.inset = "0";
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 40);
      camera.position.z = 5.4;

      const count = tier === "full" ? 9000 : 3200;
      const chaos = new Float32Array(count * 3);
      const rand = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 1.7 + Math.random() * 1.3;
        chaos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        chaos[i * 3 + 1] = r * Math.cos(phi) * 0.72;
        chaos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        rand[i] = Math.random();
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(chaos, 3));
      geometry.setAttribute("aHelix", new THREE.BufferAttribute(buildHelix(count), 3));
      geometry.setAttribute("aMark", new THREE.BufferAttribute(buildMark(count), 3));
      geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));

      const uniforms = {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uSize: { value: tier === "full" ? 2.5 : 3.1 },
        uPr: { value: renderer.getPixelRatio() },
        uOpacity: { value: 0 },
        uAspect: { value: width / height },
        uMouse: { value: new THREE.Vector2(10, 10) },
        uBurst: { value: 0 },
        uColorA: { value: new THREE.Color("#6a5cff") },
        uColorB: { value: new THREE.Color("#cfc9ff") },
        uColorC: { value: new THREE.Color("#f4f1ea") },
        uHeat: { value: new THREE.Color("#ff6a5c") },
        uCurrent: { value: new THREE.Color("#4fc3ff") },
        uGold: { value: new THREE.Color("#e0b64f") },
      };

      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geometry, material);
      const group = new THREE.Group();
      group.add(points);

      const edgeGeo = new THREE.BufferGeometry();
      edgeGeo.setAttribute("position", new THREE.BufferAttribute(buildMarkEdges(), 3));
      const edgeMat = new THREE.LineBasicMaterial({
        color: new THREE.Color("#e0b64f"),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const edges = new THREE.LineSegments(edgeGeo, edgeMat);
      group.add(edges);
      scene.add(group);

      const pointer = { x: 0, y: 0 };
      const fine = window.matchMedia("(pointer: fine)").matches;
      const onMouse = (e: MouseEvent) => {
        pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = -(e.clientY / window.innerHeight - 0.5) * 2;
        if (inView) {
          uniforms.uMouse.value.set(
            (e.clientX / window.innerWidth) * 2 - 1,
            -((e.clientY / window.innerHeight) * 2 - 1)
          );
          uniforms.uAspect.value = window.innerWidth / window.innerHeight;
        }
      };
      if (fine) {
        window.addEventListener("mousemove", onMouse, { passive: true });
      } else {
        window.addEventListener("touchmove", (e) => {
          if (!e.touches[0]) return;
          uniforms.uMouse.value.set(
            (e.touches[0].clientX / window.innerWidth) * 2 - 1,
            -((e.touches[0].clientY / window.innerHeight) * 2 - 1)
          );
        }, { passive: true });
      }

      const morphState = { value: 0 };
      const introTween = gsap.to(morphState, {
        value: 0.42,
        duration: 1.7,
        ease: "power2.out",
        delay: 0.2,
      });
      gsap.to(uniforms.uOpacity, { value: 0.9, duration: 1.4, ease: "power1.out" });

      const fireBurst = () => {
        if (inView && !document.hidden) {
          gsap.fromTo(
            uniforms.uBurst,
            { value: 0 },
            { value: 1, duration: 1.15, ease: "power2.out", overwrite: true }
          );
        }
      };
      container.addEventListener("pointerdown", fireBurst);
      if (!fine) window.addEventListener("touchstart", fireBurst, { passive: true });

      const reportPhase = (p: HeroPhase) => {
        if (p !== lastPhase) {
          lastPhase = p;
          onPhase?.(p);
        }
      };

      const onScroll = () => {
        const rect = container.getBoundingClientRect();
        const progress = Math.min(Math.max(-rect.top / (rect.height * 0.92), 0), 1);
        const m = Math.min(2, morphState.value + progress * 2.1);
        uniforms.uMorph.value = m;
        reportPhase(m < 0.85 ? 1 : m < 1.7 ? 2 : 3);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        uniforms.uAspect.value = w / h;
      };
      const ro = new ResizeObserver(resize);
      ro.observe(container);

      const io = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
      }, { threshold: 0 });
      io.observe(container);

      const clock = new THREE.Clock();
      let spin = 0;
      const tick = () => {
        rafId = requestAnimationFrame(tick);
        if (!inView || document.hidden) return;
        const t = clock.getElapsedTime();
        uniforms.uTime.value = t;
        const m = uniforms.uMorph.value;
        const st = Math.min(Math.max((m - 1.35) / 0.65, 0), 1);
        const settle = st * st * (3 - 2 * st);
        spin += 0.0016 * (1 - settle);
        group.rotation.y =
          spin * (1 - settle) +
          pointer.x * 0.24 * (1 - settle * 0.7) +
          Math.sin(t * 0.32) * 0.05 * settle;
        group.rotation.x += (-pointer.y * 0.14 - group.rotation.x) * 0.04 * (1 - settle);
        const breathe = Math.sin(t * 1.5) * 0.5 + 0.5;
        group.scale.setScalar(1 + breathe * 0.02 * settle);
        edgeMat.opacity = gsap.utils.clamp(0, 0.85, (m - 1.55) * 1.6) * (0.75 + breathe * 0.25);
        renderer.render(scene, camera);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(rafId);
        introTween.kill();
        ro.disconnect();
        io.disconnect();
        container.removeEventListener("pointerdown", fireBurst);
        window.removeEventListener("touchstart", fireBurst);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("mousemove", onMouse);
        geometry.dispose();
        material.dispose();
        edgeGeo.dispose();
        edgeMat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      running = false;
      cleanup?.();
    };
  }, [onPhase]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
    >
      <div data-hero-fallback className="absolute inset-0">
        <div className="hairline-grid absolute inset-0 opacity-60" />
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 opacity-20"
        >
          <rect x="5" y="5" width="22" height="22" rx="2.5" transform="rotate(45 16 16)" stroke="#cfc9ff" strokeWidth="0.5" />
          <path d="M10.6 19.8 16 10l5.4 9.8" stroke="#cfc9ff" strokeWidth="0.5" strokeLinecap="round" />
          <circle cx="16" cy="23" r="0.8" fill="#6a5cff" />
        </svg>
        <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
      </div>
    </div>
  );
}
