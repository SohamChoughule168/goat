"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface Video3DParallaxProps {
  src: string;
  poster: string;
  alt: string;
  label: string;
  title: string;
  lede: string;
}

/**
 * 3D Video Parallax — video in 3D space synced to scroll.
 *
 * The video rotates on X/Y axis as the user scrolls, creating a
 * cinematic parallax effect. No WebGL, no 3D objects — just video
 * elements transformed in 3D CSS space. Respects reduced motion.
 */
export default function Video3DParallax({
  src,
  poster,
  alt,
  label,
  title,
  lede,
}: Video3DParallaxProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduced = useReducedMotion();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  useEffect(() => {
    if (reduced || !sectionRef.current || !videoRef.current) return;

    const section = sectionRef.current;
    const video = videoRef.current;
    let frame = 0;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const travel = Math.max(1, rect.height - viewport);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));

      // 3D rotation: video tilts back and rotates as it scrolls through view
      const rx = progress * -15; // tilt back up to 15deg
      const ry = (progress - 0.5) * 10; // rotate slightly left/right
      const scale = 1 + progress * 0.05;

      setRotateX(rx);
      setRotateY(ry);

      video.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
      video.style.transformOrigin = "center";

      frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          frame = requestAnimationFrame(update);
        } else {
          cancelAnimationFrame(frame);
        }
      },
      { threshold: 0, rootMargin: "0px 0px" },
    );

    observer.observe(section);

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reduced, src]);

  return (
    <section className="inst-section video-3d-section" aria-labelledby="home-video-3d">
      <div className="inst-shell">
        <div className="video-3d-copy">
          <p className="inst-label video-3d-label-reveal">{label}</p>
          <h2 className="inst-h2 mt-5 video-3d-title-reveal">{title}</h2>
          <p className="inst-body mt-5 text-[0.9375rem] video-3d-lede-reveal">{lede}</p>
        </div>

        <div className="video-3d-wrap">
          <figure className="video-3d-frame" style={{ "--rotate-x": rotateX, "--rotate-y": rotateY } as React.CSSProperties}>
            <video
              ref={videoRef}
              className="video-3d-element"
              src={src}
              poster={poster}
              width={1200}
              height={675}
            />
            <figcaption className="sr-only">{alt}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
