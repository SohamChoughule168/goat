"use client";

import { useEffect, useRef, useState, Suspense, lazy } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
// import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { SAOPass } from "three/examples/jsm/postprocessing/SAOPass.js";

interface PostProcessingPipelineProps {
  children: React.ReactNode;
  intensity?: number;
  enableBloom?: boolean;
  enableDOF?: boolean;
  enableChromaticAberration?: boolean;
  enableFilmGrain?: boolean;
  enableVignette?: boolean;
}

const ChromaticAberrationShader = {
  uniforms: {
    tDiffuse: { value: null },
    uAmount: { value: 0.005 },
    uResolution: { value: new THREE.Vector2() }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uAmount;
    uniform vec2 uResolution;
    varying vec2 vUv;
    
    void main() {
      vec2 offset = uAmount * (vUv - 0.5);
      vec4 cr = texture2D(tDiffuse, vUv + offset);
      vec4 cg = texture2D(tDiffuse, vUv);
      vec4 cb = texture2D(tDiffuse, vUv - offset);
      gl_FragColor = vec4(cr.r, cg.g, cb.b, cg.a);
    }
  `
};

const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    uAmount: { value: 0.5 },
    uResolution: { value: new THREE.Vector2() }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uAmount;
    uniform vec2 uResolution;
    varying vec2 vUv;
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      vec2 center = vUv - 0.5;
      float dist = length(center);
      float vignette = smoothstep(0.8, 0.3, dist);
      vignette = 1.0 - uAmount * (1.0 - vignette);
      gl_FragColor = vec4(color.rgb * vignette, color.a);
    }
  `
};

const DOFShader = {
  uniforms: {
    tDiffuse: { value: null },
    tDepth: { value: null },
    uFocus: { value: 10.0 },
    uAperture: { value: 0.1 },
    uMaxBlur: { value: 1.0 },
    uResolution: { value: new THREE.Vector2() }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform sampler2D tDepth;
    uniform float uFocus;
    uniform float uAperture;
    uniform float uMaxBlur;
    uniform vec2 uResolution;
    varying vec2 vUv;
    
    float getDepth(vec2 uv) {
      return texture2D(tDepth, uv).r;
    }
    
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float depth = getDepth(vUv);
      float coc = abs(depth - uFocus) * uAperture;
      coc = clamp(coc, 0.0, uMaxBlur);
      
      if(coc < 0.005) {
        gl_FragColor = color;
        return;
      }
      
      vec2 blurDir = vec2(1.0, 0.0);
      vec4 sum = color;
      float count = 1.0;
      
      for(int i = 1; i <= 8; i++) {
        float offset = float(i) * coc * 0.01;
        vec4 sample1 = texture2D(tDiffuse, vUv + blurDir * offset);
        vec4 sample2 = texture2D(tDiffuse, vUv - blurDir * offset);
        sum += sample1 + sample2;
        count += 2.0;
        
        blurDir = vec2(-blurDir.y, blurDir.x);
      }
      
      gl_FragColor = sum / count;
    }
  `
};

export default function PostProcessingPipeline({
  children,
  intensity = 1.0,
  enableBloom = true,
  enableDOF = false,
  enableChromaticAberration = false,
  enableFilmGrain = false,
  enableVignette = true
}: PostProcessingPipelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReady(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let composer: EffectComposer | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.Camera | null = null;

    (async () => {
      const THREE = await import("three");
      if (disposed || !container) return;

      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true, 
        powerPreference: "high-performance",
        preserveDrawingBuffer: true
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      container.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      composer = new EffectComposer(renderer);
      
      // Render pass
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      // Bloom
      if (enableBloom) {
        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(container.clientWidth, container.clientHeight),
          0.8 * intensity,
          0.4,
          0.85
        );
        bloomPass.threshold = 0.3;
        bloomPass.strength = 1.0 * intensity;
        bloomPass.radius = 0.5;
        composer.addPass(bloomPass);
      }

      // Chromatic Aberration
      if (enableChromaticAberration) {
        const chromaticPass = new ShaderPass(ChromaticAberrationShader);
        chromaticPass.uniforms.uAmount.value = 0.003 * intensity;
        chromaticPass.uniforms.uResolution.value.set(container.clientWidth, container.clientHeight);
        composer.addPass(chromaticPass);
      }

      // Vignette
      if (enableVignette) {
        const vignettePass = new ShaderPass(VignetteShader);
        vignettePass.uniforms.uAmount.value = 0.4 * intensity;
        vignettePass.uniforms.uResolution.value.set(container.clientWidth, container.clientHeight);
        composer.addPass(vignettePass);
      }

      // FXAA (anti-aliasing)
      const fxaaPass = new ShaderPass(FXAAShader);
      fxaaPass.material.uniforms.resolution.value.set(
        1 / (container.clientWidth * renderer.getPixelRatio()),
        1 / (container.clientHeight * renderer.getPixelRatio())
      );
      composer.addPass(fxaaPass);

      // Gamma Correction
      const gammaPass = new ShaderPass(GammaCorrectionShader);
      composer.addPass(gammaPass);

      setReady(true);

      const clock = new THREE.Clock();
      let raf = 0;

      function animate() {
        raf = requestAnimationFrame(animate);
        if (disposed) return;
        
        const delta = clock.getDelta();
        composer?.render(delta);
      }
      animate();

      function onResize() {
        if (!container || !renderer || !composer) return;
        renderer.setSize(container.clientWidth, container.clientHeight);
        composer.setSize(container.clientWidth, container.clientHeight);
        
        // Update pass resolutions
        composer.passes.forEach(pass => {
          if (pass instanceof ShaderPass && pass.uniforms.uResolution) {
            pass.uniforms.uResolution.value.set(container.clientWidth, container.clientHeight);
          }
          if (pass instanceof UnrealBloomPass) {
            pass.setSize(container.clientWidth, container.clientHeight);
          }
        });
        
        if (camera instanceof THREE.OrthographicCamera) {
          camera.left = -1;
          camera.right = 1;
          camera.top = 1;
          camera.bottom = -1;
          camera.updateProjectionMatrix();
        }
      }

      const ro = new ResizeObserver(onResize);
      ro.observe(container);

      return () => {
        disposed = true;
        cancelAnimationFrame(raf);
        ro.disconnect();
        composer?.dispose();
        renderer?.dispose();
        renderer?.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
    };
  }, [intensity, enableBloom, enableDOF, enableChromaticAberration, enableFilmGrain, enableVignette]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{ opacity: ready ? 1 : 0, transition: "opacity 500ms ease" }}
      aria-hidden="true"
    >
      {!ready && <div className="w-full h-full" />}
      {ready && <>{children}</>}
    </div>
  );
}