"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface CraftWebGLProps {
  type: 'grid' | 'flow' | 'neural' | 'reconstruct';
  color: string;
}

const SHADERS = {
  grid: {
    vert: `
      attribute float aDelay;
      uniform float uTime;
      uniform float uProgress;
      varying float vOpacity;
      void main() {
        vec3 pos = position;
        float wave = sin(pos.x * 2.0 + uTime * 0.5) * cos(pos.z * 2.0 + uTime * 0.3) * 0.15;
        pos.y += wave * uProgress;
        pos.y += sin(uTime + aDelay * 6.28) * 0.3 * (1.0 - uProgress);
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = 3.0 * (1.0 / -mv.z) * uProgress;
        vOpacity = uProgress * (0.5 + 0.5 * sin(uTime * 2.0 + aDelay * 10.0));
      }
    `,
    frag: `
      varying float vOpacity;
      uniform vec3 uColor;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float a = smoothstep(0.5, 0.1, d);
        gl_FragColor = vec4(uColor, a * vOpacity);
        if (gl_FragColor.a < 0.01) discard;
      }
    `
  },
  flow: {
    vert: `
      attribute float aSeed;
      attribute float aSpeed;
      uniform float uTime;
      uniform float uProgress;
      varying float vAlpha;
      varying float vTrail;
      vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
      vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
      float snoise(vec3 v){
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
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
        float n = snoise(pos * 0.5 + vec3(t * 0.2, t * 0.3, t * 0.1));
        pos.y += n * 2.0 * uProgress;
        pos.x += sin(t + pos.z) * 0.5 * uProgress;
        pos.z += cos(t + pos.x) * 0.5 * uProgress;
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = 4.0 * (1.0 / -mv.z) * uProgress;
        vAlpha = uProgress * (0.3 + 0.7 * fract(aSeed * 7.31));
        vTrail = fract(t * 0.1);
      }
    `,
    frag: `
      varying float vAlpha;
      varying float vTrail;
      uniform vec3 uColor;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float a = smoothstep(0.5, 0.15, d);
        float trail = smoothstep(0.5, 0.0, vTrail);
        gl_FragColor = vec4(uColor * (0.5 + 0.5 * trail), a * vAlpha * (0.5 + trail));
        if (gl_FragColor.a < 0.01) discard;
      }
    `
  },
  neural: {
    vert: `
      attribute float aSeed;
      attribute vec3 aTarget;
      uniform float uTime;
      uniform float uProgress;
      varying float vAlpha;
      varying float vPulse;
      void main() {
        vec3 pos = mix(position, aTarget, uProgress * 0.5);
        float pulse = sin(uTime * 3.0 + aSeed * 20.0) * 0.1;
        pos += normalize(pos) * pulse;
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = 5.0 * (1.0 / -mv.z) * uProgress;
        vAlpha = uProgress * (0.4 + 0.6 * fract(aSeed * 3.11));
        vPulse = sin(uTime * 4.0 + aSeed * 15.0) * 0.5 + 0.5;
      }
    `,
    frag: `
      varying float vAlpha;
      varying float vPulse;
      uniform vec3 uColor;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float a = smoothstep(0.5, 0.05, d) * vPulse;
        gl_FragColor = vec4(uColor, a * vAlpha);
        if (gl_FragColor.a < 0.01) discard;
      }
    `
  },
  reconstruct: {
    vert: `
      attribute float aDelay;
      attribute vec3 aOriginal;
      attribute vec3 aTarget;
      uniform float uTime;
      uniform float uProgress;
      varying float vAlpha;
      varying float vPhase;
      void main() {
        float t = smoothstep(aDelay, aDelay + 0.5, uProgress);
        vec3 pos = mix(aOriginal, aTarget, t);
        float noise = sin(pos.x * 10.0 + uTime) * cos(pos.z * 10.0 + uTime) * 0.05 * (1.0 - t);
        pos.y += noise;
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = 3.5 * (1.0 / -mv.z);
        vAlpha = 0.6 + 0.4 * t;
        vPhase = t;
      }
    `,
    frag: `
      varying float vAlpha;
      varying float vPhase;
      uniform vec3 uColor;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        float a = smoothstep(0.5, 0.1, d);
        vec3 color = mix(uColor, vec3(1.0, 1.0, 1.0), vPhase * 0.3);
        gl_FragColor = vec4(color, a * vAlpha);
        if (gl_FragColor.a < 0.01) discard;
      }
    `
  }
};

export default function CraftWebGL({ type, color }: CraftWebGLProps) {
  const hostRef = useRef<HTMLDivElement>(null);

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
      const COUNT = isMobile ? 1500 : 4000;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setClearColor(0x000000, 0);
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(host.clientWidth, host.clientHeight);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 100);
      camera.position.z = 8;

      const shader = SHADERS[type as keyof typeof SHADERS];
      const colorObj = new THREE.Color(color);

      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(COUNT * 3);
      const seeds = new Float32Array(COUNT);
      const speeds = new Float32Array(COUNT);
      const delays = new Float32Array(COUNT);
      const originals = new Float32Array(COUNT * 3);
      const targets = new Float32Array(COUNT * 3);

      for (let i = 0; i < COUNT; i++) {
        // Different distributions per type
        if (type === 'grid') {
          const gx = (i % 40) / 40;
          const gz = Math.floor(i / 40) / 40;
          positions[i * 3] = (gx - 0.5) * 8;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
          positions[i * 3 + 2] = (gz - 0.5) * 8;
          delays[i] = Math.random();
        } else if (type === 'flow') {
          const r = 1 + Math.random() * 3;
          const th = Math.random() * Math.PI * 2;
          const ph = Math.acos(2 * Math.random() - 1);
          positions[i * 3] = r * Math.sin(ph) * Math.cos(th);
          positions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.5;
          positions[i * 3 + 2] = r * Math.cos(ph) * 0.5;
          seeds[i] = Math.random();
          speeds[i] = 0.5 + Math.random() * 1.5;
        } else if (type === 'neural') {
          const layer = Math.floor(i / (COUNT / 5));
          const angle = (i % (COUNT / 5)) / (COUNT / 5) * Math.PI * 2;
          const r = 1.5 + layer * 0.8;
          positions[i * 3] = r * Math.cos(angle) + (Math.random() - 0.5) * 0.5;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
          positions[i * 3 + 2] = r * Math.sin(angle) + (Math.random() - 0.5) * 0.5;
          
          // Target positions - neural network nodes
          const tLayer = Math.floor(Math.random() * 5);
          const tAngle = Math.random() * Math.PI * 2;
          const tR = 1.5 + tLayer * 0.8;
          targets[i * 3] = tR * Math.cos(tAngle);
          targets[i * 3 + 1] = (Math.random() - 0.5) * 3;
          targets[i * 3 + 2] = tR * Math.sin(tAngle);
          seeds[i] = Math.random();
        } else { // reconstruct
          // Original: scattered
          positions[i * 3] = (Math.random() - 0.5) * 10;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
          
          // Target: structured grid
          const gx = (i % 30) / 30;
          const gz = Math.floor(i / 30) / 30;
          targets[i * 3] = (gx - 0.5) * 6;
          targets[i * 3 + 1] = 0;
          targets[i * 3 + 2] = (gz - 0.5) * 6;
          
          originals[i * 3] = positions[i * 3];
          originals[i * 3 + 1] = positions[i * 3 + 1];
          originals[i * 3 + 2] = positions[i * 3 + 2];
          delays[i] = Math.random();
        }
      }

      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      if (type !== 'grid') geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
      if (type === 'flow') geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
      if (type === 'grid') geo.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));
      if (type === 'reconstruct') {
        geo.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));
        geo.setAttribute("aOriginal", new THREE.BufferAttribute(originals, 3));
        geo.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
      }
      if (type === 'neural') {
        geo.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
      }

      const uniforms = {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uColor: { value: colorObj },
      };

      const mat = new THREE.ShaderMaterial({
        vertexShader: shader.vert,
        fragmentShader: shader.frag,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geo, mat);
      scene.add(points);

      // Add connecting lines for neural type
      let lines: THREE.LineSegments | null = null;
      if (type === 'neural') {
        const lineGeo = new THREE.BufferGeometry();
        const linePos = new Float32Array(COUNT * 6 * 0.1); // Sparse connections
        let lineIdx = 0;
        for (let i = 0; i < COUNT * 0.1; i++) {
          const a = Math.floor(Math.random() * COUNT);
          const b = Math.floor(Math.random() * COUNT);
          linePos[lineIdx++] = positions[a * 3];
          linePos[lineIdx++] = positions[a * 3 + 1];
          linePos[lineIdx++] = positions[a * 3 + 2];
          linePos[lineIdx++] = positions[b * 3];
          linePos[lineIdx++] = positions[b * 3 + 1];
          linePos[lineIdx++] = positions[b * 3 + 2];
        }
        lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
        const lineMat = new THREE.LineBasicMaterial({ 
          color: colorObj, 
          transparent: true, 
          opacity: 0.15,
          blending: THREE.AdditiveBlending
        });
        lines = new THREE.LineSegments(lineGeo, lineMat);
        scene.add(lines);
      }

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
      let progress = 0;
      
      function loop() {
        raf = requestAnimationFrame(loop);
        if (!inView || document.hidden) return;
        
        const t = clock.getElapsedTime();
        uniforms.uTime.value = t;
        
        // Smooth progress animation
        progress += (1 - progress) * 0.015;
        uniforms.uProgress.value = Math.min(1, progress);
        
        points.rotation.y = t * 0.02;
        points.rotation.x = Math.sin(t * 0.1) * 0.1;
        if (lines) {
          lines.rotation.y = t * 0.02;
          lines.rotation.x = Math.sin(t * 0.1) * 0.1;
        }
        
        renderer.render(scene, camera);
      }
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        geo.dispose();
        mat.dispose();
        if (lines) {
          lines.geometry.dispose();
          (lines.material as THREE.Material).dispose();
        }
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [type, color]);

  return (
    <div ref={hostRef} className="w-full h-full" aria-hidden="true" />
  );
}