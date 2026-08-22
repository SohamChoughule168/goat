"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { detectTier } from "@/lib/three/support";

const VERTEX = `
attribute vec3 aLattice;
attribute float aRand;
uniform float uTime;
uniform float uMorph;
uniform float uSize;
uniform float uPr;
varying float vMix;
void main() {
  float m = smoothstep(aRand * 0.55, aRand * 0.55 + 0.45, uMorph);
  vec3 pos = mix(position, aLattice, m);
  pos.x += sin(uTime * (0.6 + aRand) + aRand * 40.0) * 0.02;
  pos.y += cos(uTime * 0.7 + aRand * 30.0) * 0.03;
  pos.z += sin(uTime * 0.5 + aRand * 20.0) * 0.02;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.6 + aRand) * uPr * (30.0 / -mv.z);
  vMix = aRand;
}
`;

const FRAGMENT = `
precision mediump float;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
varying float vMix;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float a = smoothstep(0.5, 0.12, d) * uOpacity;
  vec3 col = mix(uColorA, uColorB, vMix * vMix);
  gl_FragColor = vec4(col, a);
}
`;

function buildLattice(count: number): Float32Array {
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

function helixRadius(t: number): number {
  return 0.55 + 0.75 * Math.sin(Math.pow(t, 0.8) * Math.PI) + 0.12;
}

export default function HeroCanvas() {
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
      camera.position.z = 6;

      const count = tier === "full" ? 7000 : 2400;
      const chaos = new Float32Array(count * 3);
      const rand = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 1.7 + Math.random() * 1.3;
        chaos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        chaos[i * 3 + 1] = (r * Math.cos(phi)) * 0.72;
        chaos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        rand[i] = Math.random();
      }
      const lattice = buildLattice(count);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(chaos, 3));
      geometry.setAttribute("aLattice", new THREE.BufferAttribute(lattice, 3));
      geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));

      const uniforms = {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uSize: { value: tier === "full" ? 2.6 : 3.2 },
        uPr: { value: renderer.getPixelRatio() },
        uOpacity: { value: 0 },
        uColorA: { value: new THREE.Color("#5b52d9") },
        uColorB: { value: new THREE.Color("#cfc9ff") },
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
      scene.add(group);

      const pointer = { x: 0, y: 0 };
      const onPointer = (e: MouseEvent) => {
        pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("mousemove", onPointer, { passive: true });
      }

      const morphState = { value: 0 };
      const introTween = gsap.to(morphState, {
        value: 0.32,
        duration: 2.2,
        ease: "power2.out",
        delay: 0.25,
      });
      gsap.to(uniforms.uOpacity, { value: 0.85, duration: 1.4, ease: "power1.out" });

      const onScroll = () => {
        const rect = container.getBoundingClientRect();
        const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
        uniforms.uMorph.value = Math.min(1.15, morphState.value + progress * 1.05);
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
        spin += 0.0016;
        group.rotation.y = spin + pointer.x * 0.22;
        group.rotation.x += (-pointer.y * 0.12 - group.rotation.x) * 0.04;
        renderer.render(scene, camera);
      };
      tick();

      cleanup = () => {
        cancelAnimationFrame(rafId);
        introTween.kill();
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("mousemove", onPointer);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      running = false;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
    >
      <div data-hero-fallback className="absolute inset-0">
        <div className="hairline-grid absolute inset-0 opacity-60" />
        <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute right-[12%] top-[18%] h-64 w-64 rounded-full bg-chart-2/10 blur-[90px]" />
      </div>
    </div>
  );
}
