"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useStageProgress } from "@/lib/motion/stage-progress";
import * as THREE from "three";
import { useThreeCanvas, getParticleCount } from "@/components/premium/ThreeProvider";

export interface SequenceFrame {
  src: string;
  srcSet?: string;
  alt: string;
  stage: string;
  caption: string;
  width: number;
  height: number;
}

interface ScrollSequenceProps {
  label: string;
  title: ReactNode;
  lede: string;
  frames: readonly SequenceFrame[];
  note?: string;
  action?: ReactNode;
  sectionId?: string;
}

export default function ScrollSequence({
  label,
  title,
  lede,
  frames,
  note,
  action,
  sectionId,
}: ScrollSequenceProps): ReactNode {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const headingId = `sequence-${uid}`;

  useStageProgress(sectionRef, { count: frames.length, onIndex: setActive });

  const { canvasRef, context, performanceLevel } = useThreeCanvas(`sequence-${uid}`, { cameraZ: 60 });
  const particlesRef = useRef<THREE.Points | null>(null);
  const frameMeshesRef = useRef<THREE.Mesh[]>([]);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    if (!context) return;

    const { scene, camera, animate, stop } = context;
    const particleCount = getParticleCount("sequence", performanceLevel);

    // Ambient particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 30 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      velocities[i3] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.005;

      sizes[i] = Math.random() * 0.6 + 0.2;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometryRef.current = geometry;

    const material = new THREE.PointsMaterial({
      color: 0x14d896,
      size: 1,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    particlesRef.current = particles;
    scene.add(particles);

    // Create frame meshes for 3D parallax
    const frameMeshes: THREE.Mesh[] = [];
    frames.forEach((frame, index) => {
      const frameGeometry = new THREE.PlaneGeometry(12, 9);
      const frameMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(frameGeometry, frameMaterial);
      mesh.position.z = -index * 8;
      mesh.position.y = (index - (frames.length - 1) / 2) * 2;
      scene.add(mesh);
      frameMeshes.push(mesh);
    });
    frameMeshesRef.current = frameMeshes;

    const animateFn = () => {
      if (!particlesRef.current || !geometryRef.current) return;

      // Particles
      const positions = geometryRef.current.attributes.position.array as Float32Array;
      const velocities = geometryRef.current.attributes.velocity.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        velocities[i3] *= 0.99;
        velocities[i3 + 1] *= 0.99;
        velocities[i3 + 2] *= 0.99;

        if (positions[i3 + 1] > 50) positions[i3 + 1] = -50;
        if (positions[i3 + 1] < -50) positions[i3 + 1] = 50;
      }
      geometryRef.current.attributes.position.needsUpdate = true;

      // Frame meshes parallax
      frameMeshesRef.current.forEach((mesh, index) => {
        mesh.position.z = -index * 8 + Math.sin(performance.now() * 0.001 + index) * 0.5;
      });

      particlesRef.current!.rotation.y += 0.00002;
    };

    animate(animateFn);

    return () => {
      stop();
      geometry.dispose();
      material.dispose();
    };
  }, [context, performanceLevel]);

  return (
    <section
      className="inst-sequence sequence-premium"
      id={sectionId}
      ref={sectionRef}
      aria-labelledby={headingId}
      data-active={active}
    >
      <div className="sequence-bg">
        <canvas ref={canvasRef} className="sequence-canvas" aria-hidden="true" />
      </div>

      <div className="sequence-sticky">
        <div className="inst-shell sequence-intro">
          <p className="inst-label sequence-label-reveal">{label}</p>
          <h2 id={headingId} className="inst-display-l sequence-title sequence-title-reveal">
            {title}
          </h2>
          <p className="inst-lede sequence-lede sequence-lede-reveal">{lede}</p>
        </div>

        <div className="inst-shell sequence-body">
          <div className="sequence-stage sequence-stage-premium">
            {frames.map((frame, index) => (
              <figure
                key={frame.src}
                className="sequence-frame sequence-frame-premium"
                data-active={index === active}
                style={{
                  transform: index === active
                    ? 'translateZ(40px) scale(1.02)'
                    : `translateZ(${-index * 40}px) scale(${0.85 + index * 0.02})`,
                  opacity: index === active ? 1 : 0.4,
                  transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease-out',
                  zIndex: frames.length - index,
                }}
              >
                <div className="sequence-frame-inner">
                  <img
                    src={frame.src}
                    srcSet={frame.srcSet}
                    sizes="(max-width: 767px) 100vw, 90vw"
                    alt={frame.alt}
                    width={frame.width}
                    height={frame.height}
                    decoding="async"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "low" : undefined}
                    className="sequence-frame-img sequence-frame-img-premium specular"
                  />
                  <div className="sequence-frame-glare specular" aria-hidden="true" />
                </div>
                <figcaption className="sequence-caption sequence-caption-premium glass-liquid specular">
                  <span className="sequence-caption-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="sequence-caption-stage">{frame.stage}</span>
                  <span className="sequence-caption-body">{frame.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="sequence-rail sequence-rail-premium" aria-hidden="true">
            <span className="sequence-rail-fill sequence-rail-fill-premium" style={{
              transform: `translateY(${active * (100 / (frames.length - 1))}%)`,
              transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
            <ol>
              {frames.map((frame, index) => (
                <li
                  key={frame.src}
                  data-active={index === active}
                  className="sequence-rail-item magnetic specular"
                  style={{
                    transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms',
                    opacity: index === active ? 1 : 0.5,
                    transform: index === active ? 'scale(1.15)' : 'scale(1)'
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {(note || action) && (
          <div className="inst-shell sequence-foot sequence-foot-premium">
            {note && <p className="sequence-note sequence-note-reveal">{note}</p>}
            {action && <div className="sequence-action sequence-action-reveal">{action}</div>}
          </div>
        )}
      </div>
    </section>
  );
}