"use client";

import { useEffect, useRef } from "react";

const VERT = /* glsl */ `
uniform float uTime;
uniform float uScatter;
uniform vec2 uMouse;
uniform float uPixelRatio;
uniform float uIntensity;
attribute float aScale;
attribute float aSeed;
attribute vec3 aColor;
varying float vAlpha;
varying vec3 vColor;

vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
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
  vec3 p = position;
  float t = uTime * 0.12 + aSeed * 10.0;
  float n1 = snoise(p * 0.14 + vec3(t * 0.35, t * 0.28, t * 0.22));
  float n2 = snoise(p * 0.32 - vec3(t * 0.18, 0.0, t * 0.3));
  p.x += n1 * 0.9 * uIntensity;
  p.y += n2 * 0.7 * uIntensity;
  p.z += n1 * n2 * 1.1 * uIntensity;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vec4 clip = projectionMatrix * mv;
  vec2 ndc = clip.xy / clip.w;
  vec2 d = ndc - uMouse;
  float dist = length(d);
  float force = smoothstep(0.42, 0.0, dist);
  vec2 repel = normalize(d + 0.0001) * force * 0.16;
  clip.xy += repel * clip.w;

  float ang = aSeed * 6.2831;
  vec2 dir = vec2(cos(ang), sin(ang));
  clip.xy += dir * uScatter * (1.5 + aSeed * 2.5) * uIntensity * clip.w;
  clip.z += uScatter * aSeed * 4.0 * uIntensity;

  gl_Position = clip;
  gl_PointSize = aScale * uPixelRatio * (92.0 / -mv.z) * (1.0 - uScatter * 0.5);
  vAlpha = (0.16 + 0.5 * fract(aSeed * 7.31)) * (1.0 - uScatter * 0.85) * uIntensity;
  vColor = aColor;
}
`;

const FRAG = /* glsl */ `
varying float vAlpha;
varying vec3 vColor;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float a = smoothstep(0.5, 0.08, d);
  gl_FragColor = vec4(vColor, a * vAlpha);
  if (gl_FragColor.a < 0.003) discard;
}
`;

export default function ParticleField({ 
  className = "", 
  intensity = 1.0 
}: { 
  className?: string;
  intensity?: number;
}) {
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
      const COUNT = isMobile ? Math.floor(2000 * intensity) : Math.floor(6000 * intensity);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
      renderer.setClearColor(0x000000, 0);
      const dpr = Math.min(window.devicePixelRatio, 1.75);
      renderer.setPixelRatio(dpr);
      renderer.setSize(host.clientWidth, host.clientHeight);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, host.clientWidth / host.clientHeight, 0.1, 60);
      camera.position.z = 7.5;

      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(COUNT * 3);
      const scl = new Float32Array(COUNT);
      const seed = new Float32Array(COUNT);
      const col = new Float32Array(COUNT * 3);
      const cBrand = new THREE.Color("#14b8a6");
      const cBrandLight = new THREE.Color("#5eead4");
      const cAccent = new THREE.Color("#a855f7");

      for (let i = 0; i < COUNT; i++) {
        const r = 3.2 + Math.pow(Math.random(), 0.65) * 6.2;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(ph) * Math.cos(th) * 1.25;
        pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.72;
        pos[i * 3 + 2] = r * Math.cos(ph) * 0.55;
        scl[i] = 0.4 + Math.random() * 1.25;
        seed[i] = Math.random();
        const rand = Math.random();
        const c = rand < 0.02 ? cAccent : rand < 0.35 ? cBrandLight : cBrand;
        col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("aScale", new THREE.BufferAttribute(scl, 1));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
      geo.setAttribute("aColor", new THREE.BufferAttribute(col, 3));

      const uniforms = {
        uTime: { value: 0 },
        uScatter: { value: 0 },
        uMouse: { value: new THREE.Vector2(10, 10) },
        uPixelRatio: { value: dpr },
        uIntensity: { value: intensity },
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

      let scrollScatter = 0;
      function onScroll() {
        const vh = window.innerHeight;
        scrollScatter = Math.min(1, Math.max(0, window.scrollY / (vh * 0.9)));
      }
      window.addEventListener("scroll", onScroll, { passive: true });

      let inView = true;
      const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: 0 });
      io.observe(host);
      const vis = () => { if (document.hidden) inView = false; };
      document.addEventListener("visibilitychange", vis);

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
        mouseSmooth.lerp(targetMouse, 0.06);
        uniforms.uMouse.value.copy(mouseSmooth);
        uniforms.uScatter.value += (scrollScatter - uniforms.uScatter.value) * 0.07;
        points.rotation.y = t * 0.03 + mouseSmooth.x * 0.08;
        points.rotation.x = mouseSmooth.y * 0.05;
        renderer.render(scene, camera);
      }
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        host?.removeEventListener("pointerleave", onPointerLeave);
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", vis);
        geo.dispose();
        mat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [intensity]);

  return (
    <div ref={hostRef} className={`particle-field ${className}`} aria-hidden="true" />
  );
}