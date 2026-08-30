"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface TeamWebGLProps {
  team: Array<{
    name: string;
    role: string;
    color: string;
    initials: string;
  }>;
}

export default function TeamWebGL({ team }: TeamWebGLProps) {
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
      const NODE_COUNT = team.length;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setClearColor(0x000000, 0);
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(host.clientWidth, host.clientHeight);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(
        host.clientWidth / -2, host.clientWidth / 2,
        host.clientHeight / 2, host.clientHeight / -2,
        0.1, 1000
      );
      camera.position.z = 100;

      // Team member nodes
      const nodeGeo = new THREE.BufferGeometry();
      const nodePositions = new Float32Array(NODE_COUNT * 3);
      const nodeColors = new Float32Array(NODE_COUNT * 3);
      const nodeSizes = new Float32Array(NODE_COUNT);

      // Position nodes in a circle
      for (let i = 0; i < NODE_COUNT; i++) {
        const angle = (i / NODE_COUNT) * Math.PI * 2;
        const radius = Math.min(host.clientWidth, host.clientHeight) * 0.3;
        nodePositions[i * 3] = Math.cos(angle) * radius;
        nodePositions[i * 3 + 1] = Math.sin(angle) * radius;
        nodePositions[i * 3 + 2] = 0;
        
        const color = new THREE.Color(team[i].color);
        nodeColors[i * 3] = color.r;
        nodeColors[i * 3 + 1] = color.g;
        nodeColors[i * 3 + 2] = color.b;
        nodeSizes[i] = 30;
      }

      nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
      nodeGeo.setAttribute("aColor", new THREE.BufferAttribute(nodeColors, 3));
      nodeGeo.setAttribute("aSize", new THREE.BufferAttribute(nodeSizes, 1));

      const nodeMat = new THREE.PointsMaterial({
        size: 30,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: false,
        blending: THREE.AdditiveBlending,
      });

      const nodes = new THREE.Points(nodeGeo, nodeMat);
      scene.add(nodes);

      // Connection lines between all nodes (fully connected graph)
      const lineGeo = new THREE.BufferGeometry();
      const linePositions: number[] = [];
      
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          // Start point
          linePositions.push(nodePositions[i * 3], nodePositions[i * 3 + 1], nodePositions[i * 3 + 2]);
          // End point
          linePositions.push(nodePositions[j * 3], nodePositions[j * 3 + 1], nodePositions[j * 3 + 2]);
        }
      }

      lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePositions), 3));

      const lineMat = new THREE.LineBasicMaterial({
        color: 0x6366F1,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
      });

      const lines = new THREE.LineSegments(lineGeo, lineMat);
      scene.add(lines);

      // Pulsing rings around each node
      const ringGeos: THREE.RingGeometry[] = [];
      const ringMeshes: THREE.Mesh[] = [];
      
      for (let i = 0; i < NODE_COUNT; i++) {
        const ringGeo = new THREE.RingGeometry(35, 40, 64);
        ringGeos.push(ringGeo);
        
        const color = new THREE.Color(team[i].color);
        const ringMat = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.3,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        });
        
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.set(nodePositions[i * 3], nodePositions[i * 3 + 1], -1);
        ring.rotation.x = -Math.PI / 2;
        scene.add(ring);
        ringMeshes.push(ring);
      }

      // Label sprites (using canvas texture)
      const labelSprites: THREE.Sprite[] = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 128;
        const ctx = canvas.getContext("2d")!;
        
        ctx.fillStyle = team[i].color;
        ctx.font = "bold 48px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(team[i].initials, 128, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        const spriteMat = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: 0.9,
          depthWrite: false,
        });
        
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.set(nodePositions[i * 3], nodePositions[i * 3 + 1], 1);
        sprite.scale.set(120, 60, 1);
        scene.add(sprite);
        labelSprites.push(sprite);
      }

      const targetMouse = { x: 0, y: 0 };
      function onPointerMove(e: PointerEvent) {
        const rect = host!.getBoundingClientRect();
        targetMouse.x = (e.clientX - rect.left - rect.width / 2);
        targetMouse.y = -(e.clientY - rect.top - rect.height / 2);
      }
      function onPointerLeave() { targetMouse.x = 0; targetMouse.y = 0; }
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      host.addEventListener("pointerleave", onPointerLeave);

      let inView = true;
      const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: 0 });
      io.observe(host);

      function onResize() {
        if (!host) return;
        const width = host.clientWidth;
        const height = host.clientHeight;
        
        camera.left = width / -2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = height / -2;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
        
        // Reposition nodes
        for (let i = 0; i < NODE_COUNT; i++) {
          const angle = (i / NODE_COUNT) * Math.PI * 2;
          const radius = Math.min(width, height) * 0.3;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          nodePositions[i * 3] = x;
          nodePositions[i * 3 + 1] = y;
          
          // Update lines
          let lineIdx = 0;
          for (let a = 0; a < NODE_COUNT; a++) {
            for (let b = a + 1; b < NODE_COUNT; b++) {
              const ax = nodePositions[a * 3];
              const ay = nodePositions[a * 3 + 1];
              const bx = nodePositions[b * 3];
              const by = nodePositions[b * 3 + 1];
              
              linePositions[lineIdx++] = ax;
              linePositions[lineIdx++] = ay;
              linePositions[lineIdx++] = 0;
              linePositions[lineIdx++] = bx;
              linePositions[lineIdx++] = by;
              linePositions[lineIdx++] = 0;
            }
          }
          
          // Update rings and sprites
          ringMeshes[i].position.set(x, y, -1);
          labelSprites[i].position.set(x, y, 1);
        }
        
        nodeGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.position.needsUpdate = true;
      }
      const ro = new ResizeObserver(onResize);
      ro.observe(host);

      const clock = new THREE.Clock();
      let raf = 0;
      const mouseSmooth = { x: 0, y: 0 };
      
      function loop() {
        raf = requestAnimationFrame(loop);
        if (!inView || document.hidden) return;
        
        const t = clock.getElapsedTime();
        
        // Smooth mouse follow
        mouseSmooth.x += (targetMouse.x - mouseSmooth.x) * 0.03;
        mouseSmooth.y += (targetMouse.y - mouseSmooth.y) * 0.03;
        
        // Subtle camera follow
        camera.position.x = mouseSmooth.x * 0.1;
        camera.position.y = mouseSmooth.y * 0.1;
        camera.lookAt(0, 0, 0);
        
        // Animate nodes
        for (let i = 0; i < NODE_COUNT; i++) {
          const baseAngle = (i / NODE_COUNT) * Math.PI * 2;
if (!host) return;
          const radius = Math.min(host.clientWidth, host.clientHeight) * 0.3;
          
          // Breathing animation
          const breathe = Math.sin(t * 1.5 + i) * 5;
          const x = Math.cos(baseAngle) * (radius + breathe);
          const y = Math.sin(baseAngle) * (radius + breathe);
          
          nodePositions[i * 3] = x;
          nodePositions[i * 3 + 1] = y;
          
          // Ring pulse
          const pulse = 1 + Math.sin(t * 2 + i * 2) * 0.15;
          ringMeshes[i].scale.setScalar(pulse);
          (ringMeshes[i].material as THREE.MeshBasicMaterial).opacity = 0.2 + 0.2 * Math.sin(t * 3 + i);
          
          // Sprite pulse
          labelSprites[i].scale.setScalar(1 + Math.sin(t * 2.5 + i) * 0.05);
        }
        
        // Update lines
        let lineIdx = 0;
        for (let a = 0; a < NODE_COUNT; a++) {
          for (let b = a + 1; b < NODE_COUNT; b++) {
            const ax = nodePositions[a * 3];
            const ay = nodePositions[a * 3 + 1];
            const bx = nodePositions[b * 3];
            const by = nodePositions[b * 3 + 1];
            
            linePositions[lineIdx++] = ax;
            linePositions[lineIdx++] = ay;
            linePositions[lineIdx++] = 0;
            linePositions[lineIdx++] = bx;
            linePositions[lineIdx++] = by;
            linePositions[lineIdx++] = 0;
          }
        }
        
        nodeGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.position.needsUpdate = true;
        
        // Rotate lines slightly
        lines.rotation.z = t * 0.005;
        
        renderer.render(scene, camera);
      }
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        host?.removeEventListener("pointerleave", onPointerLeave);
        
        nodeGeo.dispose();
        nodeMat.dispose();
        lineGeo.dispose();
        lineMat.dispose();
        
        ringGeos.forEach(g => g.dispose());
        ringMeshes.forEach(m => (m.material as THREE.Material).dispose());
        
        labelSprites.forEach(s => {
          (s.material as THREE.SpriteMaterial).map?.dispose();
          (s.material as THREE.SpriteMaterial).dispose();
        });
        
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [team]);

  return (
    <div ref={hostRef} className="w-full h-[320px]" aria-hidden="true" />
  );
}