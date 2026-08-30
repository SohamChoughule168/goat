"use client";

import { useEffect, useRef, useState, Suspense, lazy } from "react";
import * as THREE from "three";

interface GPUParticleSystemProps {
  count?: number;
  type?: 'fireflies' | 'nebula' | 'morphing' | 'data-flow' | 'constellation';
  color?: string;
  interactive?: boolean;
  className?: string;
}

const PARTICLE_SHADERS = {
  fireflies: {
    vertex: `
      attribute float aLifetime;
      attribute float aDelay;
      attribute vec3 aStartPos;
      attribute vec3 aEndPos;
      attribute vec3 aColor;
      uniform float uTime;
      uniform float uProgress;
      varying float vAlpha;
      varying vec3 vColor;
      
      void main() {
        float t = uTime + aDelay;
        float life = mod(t * 0.5, aLifetime) / aLifetime;
        float progress = smoothstep(0.0, 1.0, life);
        
        vec3 pos = mix(aStartPos, aEndPos, progress);
        pos.y += sin(t * 2.0 + aStartPos.x * 10.0) * 0.3;
        pos.x += cos(t * 1.5 + aStartPos.z * 10.0) * 0.3;
        pos.z += sin(t * 1.8 + aStartPos.y * 10.0) * 0.3;
        
        // Wander
        pos += vec3(
          sin(t + aStartPos.y * 5.0) * 0.5,
          cos(t + aStartPos.x * 5.0) * 0.5,
          sin(t + aStartPos.z * 5.0) * 0.5
        ) * (1.0 - progress);
        
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (3.0 + progress * 5.0) * (1.0 / -mv.z);
        
        vAlpha = (1.0 - progress) * progress * 4.0 * uProgress;
        vColor = aColor;
      }
    `,
    fragment: `
      varying float vAlpha;
      varying vec3 vColor;
      
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float core = smoothstep(0.5, 0.1, d);
        float glow = smoothstep(0.5, 0.3, d) * 0.5;
        
        gl_FragColor = vec4(vColor, (core + glow) * vAlpha);
        if(gl_FragColor.a < 0.001) discard;
      }
    `
  },
  
  nebula: {
    vertex: `
      attribute float aSeed;
      attribute float aLayer;
      attribute vec3 aBasePos;
      uniform float uTime;
      uniform float uProgress;
      varying float vAlpha;
      varying vec3 vColor;
      varying float vLayer;
      
      vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      float snoise(vec3 v) {
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
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      
      void main() {
        vec3 pos = aBasePos;
        float t = uTime * 0.1 + aSeed * 10.0;
        float layer = aLayer * 0.5;
        
        pos.x += snoise(pos * 0.5 + vec3(t, 0.0, t)) * 2.0 * layer;
        pos.y += snoise(pos * 0.5 + vec3(0.0, t, t)) * 2.0 * layer;
        pos.z += snoise(pos * 0.5 + vec3(t, t, 0.0)) * 2.0 * layer;
        
        pos.x += sin(t + pos.z * 0.5) * layer;
        pos.y += cos(t + pos.x * 0.5) * layer;
        pos.z += sin(t + pos.y * 0.5) * layer;
        
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (1.0 + aLayer * 2.0) * (1.0 / -mv.z) * uProgress * 50.0;
        
        vAlpha = uProgress * (0.1 + 0.9 * aLayer);
        vColor = vec3(0.2, 0.4, 1.0) * (0.5 + 0.5 * aLayer);
        vLayer = aLayer;
      }
    `,
    fragment: `
      varying float vAlpha;
      varying vec3 vColor;
      varying float vLayer;
      
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float a = smoothstep(0.5, 0.05, d) * (0.5 + vLayer * 0.5);
        
        vec3 color = mix(
          vec3(0.1, 0.2, 0.5),
          vec3(0.8, 0.4, 1.0),
          vLayer
        );
        
        // Soft additive glow
        float glow = smoothstep(0.4, 0.2, d) * 0.3 * vLayer;
        
        gl_FragColor = vec4(color, (a + glow) * vAlpha);
        if(gl_FragColor.a < 0.001) discard;
      }
    `
  },
  
  morphing: {
    vertex: `
      attribute float aSeed;
      attribute vec3 aFormA;
      attribute vec3 aFormB;
      attribute vec3 aColorA;
      attribute vec3 aColorB;
      uniform float uTime;
      uniform float uProgress;
      varying float vAlpha;
      varying vec3 vColor;
      varying float vMorph;
      
      vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      float snoise(vec3 v) {
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
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      
      void main() {
        float morph = (sin(uTime * 0.3 + aSeed * 10.0) * 0.5 + 0.5) * uProgress;
        vMorph = morph;
        
        vec3 pos = mix(aFormA, aFormB, morph);
        pos += vec3(
          snoise(pos * 0.5 + uTime * 0.2) * 0.3,
          snoise(pos * 0.5 + uTime * 0.3 + 100.0) * 0.3,
          snoise(pos * 0.5 + uTime * 0.25 + 200.0) * 0.3
        ) * (1.0 - abs(morph - 0.5) * 2.0);
        
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = 4.0 * (1.0 / -mv.z) * uProgress;
        
        vAlpha = uProgress;
        vColor = mix(aColorA, aColorB, morph);
      }
    `,
    fragment: `
      varying float vAlpha;
      varying vec3 vColor;
      varying float vMorph;
      
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float a = smoothstep(0.5, 0.1, d);
        
        // Pulsing ring at morph transition
        float ring = smoothstep(0.35, 0.3, d) * 0.5 * (1.0 - abs(vMorph - 0.5) * 2.0);
        
        gl_FragColor = vec4(vColor, (a + ring) * vAlpha);
        if(gl_FragColor.a < 0.001) discard;
      }
    `
  },
  
  dataFlow: {
    vertex: `
      attribute float aIndex;
      attribute float aSpeed;
      attribute vec3 aPathStart;
      attribute vec3 aPathEnd;
      attribute vec3 aColor;
      uniform float uTime;
      uniform float uProgress;
      varying float vAlpha;
      varying vec3 vColor;
      varying float vProgress;
      
      void main() {
        float pathProgress = mod(uTime * aSpeed * 0.01 + aIndex * 0.01, 1.0);
        vProgress = pathProgress;
        
        vec3 pos = mix(aPathStart, aPathEnd, pathProgress);
        
        // Add noise for organic flow
        float t = uTime + aIndex * 10.0;
        pos.x += sin(t + aIndex) * 0.2;
        pos.y += cos(t * 1.3 + aIndex) * 0.2;
        pos.z += sin(t * 0.7 + aIndex) * 0.2;
        
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = 2.0 * (1.0 / -mv.z) * uProgress;
        
        vAlpha = uProgress * (0.5 + 0.5 * sin(pathProgress * 3.14159));
        vColor = aColor;
      }
    `,
    fragment: `
      varying float vAlpha;
      varying vec3 vColor;
      varying float vProgress;
      
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float a = smoothstep(0.5, 0.0, d);
        
        // Trail effect
        float trail = smoothstep(0.8, 0.2, vProgress);
        
        gl_FragColor = vec4(vColor * (0.5 + 0.5 * trail), a * vAlpha * (0.5 + trail));
        if(gl_FragColor.a < 0.001) discard;
      }
    `
  },
  
  constellation: {
    vertex: `
      attribute float aNodeId;
      attribute float aConnectionCount;
      attribute vec3 aBasePos;
      uniform float uTime;
      uniform float uProgress;
      varying float vAlpha;
      varying float vNodeId;
      varying float vConnections;
      
      void main() {
        vec3 pos = aBasePos;
        float t = uTime + aNodeId * 100.0;
        
        // Subtle breathing
        pos += normalize(pos) * sin(t * 0.5) * 0.05;
        
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (4.0 + aConnectionCount * 0.5) * (1.0 / -mv.z) * uProgress;
        
        vAlpha = uProgress;
        vNodeId = aNodeId;
        vConnections = aConnectionCount;
      }
    `,
    fragment: `
      varying float vAlpha;
      varying float vNodeId;
      varying float vConnections;
      
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float core = smoothstep(0.5, 0.1, d);
        float glow = smoothstep(0.5, 0.3, d) * 0.5;
        
        // Color based on connection count
        vec3 color = mix(
          vec3(0.3, 0.5, 1.0),
          vec3(1.0, 0.4, 0.8),
          min(vConnections / 10.0, 1.0)
        );
        
        float a = (core + glow) * vAlpha;
        
        gl_FragColor = vec4(color, a);
        if(gl_FragColor.a < 0.001) discard;
      }
    `
  }
};

export default function GPUParticleSystem({
  count = 10000,
  type = 'fireflies',
  color = '#6366F1',
  interactive = true,
  className = ''
}: GPUParticleSystemProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

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
      const PARTICLE_COUNT = isMobile ? Math.floor(count * 0.3) : count;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setClearColor(0x000000, 0);
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(host.clientWidth, host.clientHeight);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, host.clientWidth / host.clientHeight, 0.1, 100);
      camera.position.z = 10;

      const shader = PARTICLE_SHADERS[type as keyof typeof PARTICLE_SHADERS];
      const colorObj = new THREE.Color(color);

      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(PARTICLE_COUNT * 3);
      const lifetimes = new Float32Array(PARTICLE_COUNT);
      const delays = new Float32Array(PARTICLE_COUNT);
      const startPositions = new Float32Array(PARTICLE_COUNT * 3);
      const endPositions = new Float32Array(PARTICLE_COUNT * 3);
      const colors = new Float32Array(PARTICLE_COUNT * 3);
      const seeds = new Float32Array(PARTICLE_COUNT);
      const layers = new Float32Array(PARTICLE_COUNT);
      const speeds = new Float32Array(PARTICLE_COUNT);
      const pathStarts = new Float32Array(PARTICLE_COUNT * 3);
      const pathEnds = new Float32Array(PARTICLE_COUNT * 3);
      const nodeIds = new Float32Array(PARTICLE_COUNT);
      const connectionCounts = new Float32Array(PARTICLE_COUNT);

      const baseColor = new THREE.Color(color);
      const colorVariations = [
        new THREE.Color(color),
        new THREE.Color("#06B6D4"),
        new THREE.Color("#10B981"),
        new THREE.Color("#F59E0B"),
        new THREE.Color("#A855F7"),
        new THREE.Color("#EC4899")
      ];

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const seed = Math.random();
        seeds[i] = seed;
        delays[i] = seed * 10.0;
        lifetimes[i] = 2.0 + seed * 4.0;
        speeds[i] = 0.5 + seed * 2.0;
        layers[i] = seed;
        nodeIds[i] = i % 100;
        connectionCounts[i] = Math.floor(seed * 8) + 1;
        
        const c = colorVariations[Math.floor(seed * colorVariations.length)];
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;

        if (type === 'fireflies') {
          const r = 3.0 + Math.pow(seed, 0.5) * 5.0;
          const th = seed * Math.PI * 2;
          const ph = Math.acos(2 * seed - 1);
          positions[i * 3] = r * Math.sin(ph) * Math.cos(th);
          positions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.5;
          positions[i * 3 + 2] = r * Math.cos(ph) * 0.5;
          
          startPositions[i * 3] = positions[i * 3];
          startPositions[i * 3 + 1] = positions[i * 3 + 1];
          startPositions[i * 3 + 2] = positions[i * 3 + 2];
          
          const r2 = 3.0 + Math.pow(Math.random(), 0.5) * 5.0;
          const th2 = Math.random() * Math.PI * 2;
          const ph2 = Math.acos(2 * Math.random() - 1);
          endPositions[i * 3] = r2 * Math.sin(ph2) * Math.cos(th2);
          endPositions[i * 3 + 1] = r2 * Math.sin(ph2) * Math.sin(th2) * 0.5;
          endPositions[i * 3 + 2] = r2 * Math.cos(ph2) * 0.5;
        } else if (type === 'nebula') {
          const r = 1.0 + seed * 4.0;
          const th = seed * Math.PI * 2 * 5;
          const ph = Math.acos(2 * seed - 1);
          positions[i * 3] = r * Math.sin(ph) * Math.cos(th);
          positions[i * 3 + 1] = (seed - 0.5) * 6.0;
          positions[i * 3 + 2] = r * Math.cos(ph) * 0.5;
        } else if (type === 'morphing') {
          // Form A: Sphere
          const r1 = 2.0;
          const th1 = seed * Math.PI * 2 * 3;
          const ph1 = Math.acos(2 * seed - 1);
          startPositions[i * 3] = r1 * Math.sin(ph1) * Math.cos(th1);
          startPositions[i * 3 + 1] = r1 * Math.sin(ph1) * Math.sin(th1);
          startPositions[i * 3 + 2] = r1 * Math.cos(ph1);
          
          // Form B: Torus
          const r2 = 2.5;
          const th2 = seed * Math.PI * 2 * 5;
          endPositions[i * 3] = (r2 + 0.5) * Math.cos(th2);
          endPositions[i * 3 + 1] = (seed - 0.5) * 4.0;
          endPositions[i * 3 + 2] = (r2 + 0.5) * Math.sin(th2);
          
          positions[i * 3] = startPositions[i * 3];
          positions[i * 3 + 1] = startPositions[i * 3 + 1];
          positions[i * 3 + 2] = startPositions[i * 3 + 2];
          
          colors[i * 3] = baseColor.r;
          colors[i * 3 + 1] = baseColor.g;
          colors[i * 3 + 2] = baseColor.b;
          
          const c2 = new THREE.Color("#06B6D4");
          // Store second color in end positions w component hack - use pathEnds for second color
          pathEnds[i * 3] = c2.r;
          pathEnds[i * 3 + 1] = c2.g;
          pathEnds[i * 3 + 2] = c2.b;
        } else if (type === 'data-flow') {
          const paths = 10;
          const path = Math.floor(seed * paths);
          const pathSeed = seed * paths - path;
          
          const startX = (path - paths/2) * 1.5;
          const endX = -startX;
          const startY = (pathSeed - 0.5) * 4.0;
          const endY = -startY;
          
          pathStarts[i * 3] = startX;
          pathStarts[i * 3 + 1] = startY;
          pathStarts[i * 3 + 2] = (seed - 0.5) * 6.0;
          
          pathEnds[i * 3] = endX;
          pathEnds[i * 3 + 1] = endY;
          pathEnds[i * 3 + 2] = (seed - 0.5) * 6.0;
          
          positions[i * 3] = pathStarts[i * 3];
          positions[i * 3 + 1] = pathStarts[i * 3 + 1];
          positions[i * 3 + 2] = pathStarts[i * 3 + 2];
        } else if (type === 'constellation') {
          const r = 4.0 + seed * 3.0;
          const th = seed * Math.PI * 2 * 3;
          const ph = Math.acos(2 * seed - 1);
          positions[i * 3] = r * Math.sin(ph) * Math.cos(th);
          positions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.3;
          positions[i * 3 + 2] = r * Math.cos(ph) * 0.3;
          
          const aBasePos = positions.slice(i * 3, i * 3 + 3);
        }
      }

      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("aLifetime", new THREE.BufferAttribute(lifetimes, 1));
      geo.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));
      geo.setAttribute("aStartPos", new THREE.BufferAttribute(startPositions, 3));
      geo.setAttribute("aEndPos", new THREE.BufferAttribute(endPositions, 3));
      geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
      geo.setAttribute("aLayer", new THREE.BufferAttribute(layers, 1));
      geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
      geo.setAttribute("aPathStart", new THREE.BufferAttribute(pathStarts, 3));
      geo.setAttribute("aPathEnd", new THREE.BufferAttribute(pathEnds, 3));
      geo.setAttribute("aNodeId", new THREE.BufferAttribute(nodeIds, 1));
      geo.setAttribute("aConnectionCount", new THREE.BufferAttribute(connectionCounts, 1));

      const uniforms = {
        uTime: { value: 0 },
        uProgress: { value: 0 },
      };

      const mat = new THREE.ShaderMaterial({
        vertexShader: shader.vertex,
        fragmentShader: shader.fragment,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geo, mat);
      scene.add(points);

      // Connections for constellation
      let connections: THREE.LineSegments | null = null;
      if (type === 'constellation') {
        const connGeo = new THREE.BufferGeometry();
        const connPos: number[] = [];
        const maxDist = 2.5;
        
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          for (let j = i + 1; j < PARTICLE_COUNT; j++) {
            const dx = positions[i * 3] - positions[j * 3];
            const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
            const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (dist < maxDist && Math.random() < 0.3) {
              connPos.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
              connPos.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
            }
          }
        }
        
        connGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(connPos), 3));
        const connMat = new THREE.LineBasicMaterial({ 
          color: colorObj, 
          transparent: true, 
          opacity: 0.1,
          blending: THREE.AdditiveBlending
        });
        connections = new THREE.LineSegments(connGeo, connMat);
        scene.add(connections);
      }

      const targetMouse = new THREE.Vector2(0, 0);
      function onPointerMove(e: PointerEvent) {
        if (!interactive) return;
        const rect = host!.getBoundingClientRect();
        targetMouse.set(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -(((e.clientY - rect.top) / rect.height) * 2 - 1)
        );
      }
      function onPointerLeave() { targetMouse.set(0, 0); }
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
      const mouseSmooth = new THREE.Vector2(0, 0);
      
      function loop() {
        raf = requestAnimationFrame(loop);
        if (!inView || document.hidden) return;
        
        const t = clock.getElapsedTime();
        uniforms.uTime.value = t;
        uniforms.uProgress.value += (1 - uniforms.uProgress.value) * 0.01;
        
        mouseSmooth.lerp(targetMouse, 0.02);
        camera.position.x = mouseSmooth.x * 2;
        camera.position.y = -mouseSmooth.y * 2;
        camera.lookAt(0, 0, 0);
        
        points.rotation.y = t * 0.01;
        if (connections) connections.rotation.y = t * 0.01;
        
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
        if (connections) {
          connections.geometry.dispose();
          (connections.material as THREE.Material).dispose();
        }
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [count, type, color, interactive]);

  return (
    <div ref={hostRef} className={`w-full h-full ${className}`} aria-hidden="true" 
      style={{ opacity: ready ? 1 : 0, transition: "opacity 800ms ease" }} />
  );
}