"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface AiLabWebGLProps {
  intensity?: number;
}

const VERT = `
uniform float uTime;
uniform float uIntensity;
uniform vec2 uMouse;
uniform float uProgress;
attribute float aSeed;
attribute float aLayer;
attribute float aSpeed;
attribute vec3 aTarget;
varying float vAlpha;
varying float vPulse;
varying vec3 vPos;

vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
  vec3 pos = position;
  float t = uTime * aSpeed + aSeed * 10.0;
  
  // Mouse interaction
  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  vec2 ndc = mvPos.xy / mvPos.w;
  vec2 d = ndc - uMouse;
  float dist = length(d);
  float force = smoothstep(0.5, 0.0, dist);
  pos.xy += d * force * 0.3 * uIntensity;
  
  // Noise flow
  float n = snoise(pos * 0.3 + vec3(t * 0.15, t * 0.2, t * 0.1));
  pos.y += n * 0.5 * uIntensity;
  pos.x += sin(t + pos.z * 0.5) * 0.3 * uIntensity;
  pos.z += cos(t + pos.x * 0.5) * 0.3 * uIntensity;
  
  // Layer separation
  pos.y += aLayer * 0.8;
  
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (2.0 + aLayer * 1.5) * (1.0 / -mv.z) * (30.0 + uIntensity * 50.0) * uProgress;
  vAlpha = uProgress * (0.3 + 0.7 * fract(aSeed * 7.31)) * (0.5 + 0.5 * aLayer);
  vPulse = sin(uTime * 3.0 + aSeed * 20.0) * 0.5 + 0.5;
  vPos = pos;
}
`;

const FRAG = `
varying float vAlpha;
varying float vPulse;
varying vec3 vPos;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float a = smoothstep(0.5, 0.1, d) * vPulse;
  
  // Color based on layer (y position)
  vec3 color;
  if (vPos.y > 0.5) {
    color = mix(uColor1, uColor2, fract(vPos.x * 0.1));
  } else if (vPos.y > -0.5) {
    color = mix(uColor2, uColor3, fract(vPos.z * 0.1));
  } else {
    color = mix(uColor3, uColor1, fract(vPos.y * 0.1));
  }
  
  // Add glow ring
  float ring = smoothstep(0.3, 0.25, d) * 0.3;
  
  gl_FragColor = vec4(color, a * vAlpha + ring);
  if (gl_FragColor.a < 0.01) discard;
}
`;

const LINE_VERT = `
uniform float uTime;
uniform float uProgress;
attribute vec3 aStart;
attribute vec3 aEnd;
attribute float aDelay;
varying float vAlpha;

void main() {
  float t = smoothstep(aDelay, aDelay + 0.5, uProgress);
  vec3 pos = mix(aStart, aEnd, t);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  vAlpha = t * uProgress;
}
`;

const LINE_FRAG = `
varying float vAlpha;
uniform vec3 uLineColor;
void main() {
  gl_FragColor = vec4(uLineColor, vAlpha * 0.15);
}
`;

export default function AiLabWebGL({ intensity = 1.0 }: AiLabWebGLProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed || !host) return;

      const isMobile = window.matchMedia("(pointer: coarse)").matches;
      const NODE_COUNT = isMobile ? 800 : 2000;
      const LINE_COUNT = isMobile ? 200 : 500;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setClearColor(0x000000, 0);
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(host.clientWidth, host.clientHeight);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 100);
      camera.position.z = 12;

      // Node geometry
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(NODE_COUNT * 3);
      const seeds = new Float32Array(NODE_COUNT);
      const layers = new Float32Array(NODE_COUNT);
      const speeds = new Float32Array(NODE_COUNT);
      const targets = new Float32Array(NODE_COUNT * 3);

      for (let i = 0; i < NODE_COUNT; i++) {
        // 3D spherical distribution with layers
        const layer = Math.floor(i / (NODE_COUNT / 5));
        const angle = (i % (NODE_COUNT / 5)) / (NODE_COUNT / 5) * Math.PI * 2;
        const r = 2 + layer * 0.6 + Math.random() * 0.3;
        
        positions[i * 3] = r * Math.cos(angle) + (Math.random() - 0.5) * 0.4;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
        positions[i * 3 + 2] = r * Math.sin(angle) + (Math.random() - 0.5) * 0.4;
        
        seeds[i] = Math.random();
        layers[i] = layer / 4;
        speeds[i] = 0.5 + Math.random() * 1.0;
        
        // Target positions for animation
        const tLayer = Math.floor(Math.random() * 5);
        const tAngle = Math.random() * Math.PI * 2;
        const tR = 2 + tLayer * 0.6;
        targets[i * 3] = tR * Math.cos(tAngle);
        targets[i * 3 + 1] = (Math.random() - 0.5) * 4;
        targets[i * 3 + 2] = tR * Math.sin(tAngle);
      }

      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
      geo.setAttribute("aLayer", new THREE.BufferAttribute(layers, 1));
      geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
      geo.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));

      // Colors for layers
      const c1 = new THREE.Color("#6366F1"); // Indigo
      const c2 = new THREE.Color("#06B6D4"); // Cyan
      const c3 = new THREE.Color("#10B981"); // Emerald

      const uniforms = {
        uTime: { value: 0 },
        uIntensity: { value: intensity },
        uMouse: { value: new THREE.Vector2(10, 10) },
        uProgress: { value: 0 },
        uColor1: { value: c1 },
        uColor2: { value: c2 },
        uColor3: { value: c3 },
      };

      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geo, mat);
      scene.add(points);

      // Connection lines
      const lineGeo = new THREE.BufferGeometry();
      const linePositions = new Float32Array(LINE_COUNT * 2 * 3);
      const lineDelays = new Float32Array(LINE_COUNT * 2);
      
      let lineIdx = 0;
      for (let i = 0; i < LINE_COUNT; i++) {
        const a = Math.floor(Math.random() * NODE_COUNT);
        const b = Math.floor(Math.random() * NODE_COUNT);
        if (a === b) continue;
        
        // Only connect nearby nodes
        const dx = positions[a * 3] - positions[b * 3];
        const dy = positions[a * 3 + 1] - positions[b * 3 + 1];
        const dz = positions[a * 3 + 2] - positions[b * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < 2.5) {
          linePositions[lineIdx++] = positions[a * 3];
          linePositions[lineIdx++] = positions[a * 3 + 1];
          linePositions[lineIdx++] = positions[a * 3 + 2];
          linePositions[lineIdx++] = positions[b * 3];
          linePositions[lineIdx++] = positions[b * 3 + 1];
          linePositions[lineIdx++] = positions[b * 3 + 2];
          
          const delay = Math.random();
          lineDelays[lineIdx - 6] = delay;
          lineDelays[lineIdx - 5] = delay;
        }
      }

      const finalLinePositions = linePositions.slice(0, lineIdx);
      const finalLineDelays = lineDelays.slice(0, lineIdx);
      
      lineGeo.setAttribute("position", new THREE.BufferAttribute(finalLinePositions, 3));
      lineGeo.setAttribute("aStart", new THREE.BufferAttribute(finalLinePositions, 3));
      lineGeo.setAttribute("aEnd", new THREE.BufferAttribute(finalLinePositions, 3));
      lineGeo.setAttribute("aDelay", new THREE.BufferAttribute(finalLineDelays, 1));

      const lineUniforms = {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uLineColor: { value: new THREE.Color("#6366F1") },
      };

      const lineMat = new THREE.ShaderMaterial({
        vertexShader: LINE_VERT,
        fragmentShader: LINE_FRAG,
        uniforms: lineUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const lines = new THREE.LineSegments(lineGeo, lineMat);
      scene.add(lines);

      // Pulse particles
      const pulseGeo = new THREE.BufferGeometry();
      const pulseCount = 30;
      const pulsePos = new Float32Array(pulseCount * 3);
      const pulseData = new Float32Array(pulseCount * 4); // startIdx, endIdx, progress, speed
      
      for (let i = 0; i < pulseCount; i++) {
        pulseData[i * 4] = Math.floor(Math.random() * (lineIdx / 6));
        pulseData[i * 4 + 1] = Math.floor(Math.random() * (lineIdx / 6));
        pulseData[i * 4 + 2] = 0;
        pulseData[i * 4 + 3] = 0.005 + Math.random() * 0.01;
      }
      pulseGeo.setAttribute("aPulseData", new THREE.BufferAttribute(pulseData, 4));
      
      const pulseMat = new THREE.PointsMaterial({
        size: 8,
        color: 0x06B6D4,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });
      // We'll skip pulse particles for simplicity

      const targetMouse = new THREE.Vector2(10, 10);
      function onPointerMove(e: PointerEvent) {
        const rect = host!.getBoundingClientRect();
        targetMouse.set(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -(((e.clientY - rect.top) / rect.height) * 2 - 1)
        );
      }
      function onPointerLeave() { targetMouse.set(10, 10); }
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      host.addEventListener("pointerleave", onPointerLeave);

      let inView = true;
      const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: 0 });
      io.observe(host);

      function onResize() {
        if (!host) return;
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(host.clientWidth, host.clientHeight);
      }
      const ro = new ResizeObserver(onResize);
      ro.observe(host);

      const clock = new THREE.Clock();
      let raf = 0;
      const mouseSmooth = new THREE.Vector2(10, 10);
      
      function loop() {
        raf = requestAnimationFrame(loop);
        if (!inView || document.hidden) return;
        
        const t = clock.getElapsedTime();
        uniforms.uTime.value = t;
        lineUniforms.uTime.value = t;
        
        // Progress animation
        const targetProgress = inView ? 1 : 0;
        uniforms.uProgress.value += (targetProgress - uniforms.uProgress.value) * 0.02;
        lineUniforms.uProgress.value = uniforms.uProgress.value;
        
        // Smooth mouse
        mouseSmooth.lerp(targetMouse, 0.05);
        uniforms.uMouse.value.copy(mouseSmooth);
        
        // Camera subtle movement
        camera.position.x = mouseSmooth.x * 0.5;
        camera.position.y = -mouseSmooth.y * 0.5;
        camera.lookAt(0, 0, 0);
        
        points.rotation.y = t * 0.015;
        points.rotation.x = Math.sin(t * 0.08) * 0.1;
        lines.rotation.y = t * 0.015;
        lines.rotation.x = Math.sin(t * 0.08) * 0.1;
        
        renderer.render(scene, camera);
      }
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        host?.removeEventListener("pointerleave", onPointerLeave);
        geo.dispose();
        mat.dispose();
        lineGeo.dispose();
        lineMat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [intensity]);

  // Animate progress
  useEffect(() => {
    const timer = setTimeout(() => setProgress(1), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={hostRef} className="w-full h-full" aria-hidden="true" />
  );
}