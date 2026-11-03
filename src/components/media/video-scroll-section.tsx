"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface VideoScrollProps {
  src: string;
  poster: string;
  alt: string;
  label: string;
  title: string;
  lede: string;
}

/**
 * Scroll-synced video section.
 *
 * As the user scrolls through this section, the video scrubs from start to end.
 * No autoplay, no loop — the video is paused and its currentTime is mapped to
 * scroll progress. Falls back to a poster image under reduced motion.
 */
export default function VideoScrollSection({
  src,
  poster,
  alt,
  label,
  title,
  lede,
}: VideoScrollProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduced = useReducedMotion();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (reduced || !sectionRef.current || !videoRef.current) {
      setLoaded(true);
      return;
    }

    const video = videoRef.current;
    const section = sectionRef.current;

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");

    let frame = 0;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;
      const travel = Math.max(1, rect.height - viewport);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      const target = progress * video.duration;
      if (video.readyState >= 1 && Number.isFinite(duration())) {
        if (Math.abs(video.currentTime - target) > 0.02) {
          video.currentTime = target;
        }
      }
      frame = requestAnimationFrame(update);
    };

    const duration = () => (video.duration || 0);

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
    video.addEventListener("loadedmetadata", () => setLoaded(true));

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      video.removeEventListener("loadedmetadata", () => setLoaded(true));
    };
  }, [reduced, src]);

  return (
    <section
      ref={sectionRef}
      className={`inst-section video-scroll-section ${reduced ? "video-reduced" : ""}`}
      aria-labelledby="home-video"
    >
      <div className="inst-shell">
        <div className="video-copy">
          <p className="inst-label video-label-reveal">{label}</p>
          <h2 className="inst-h2 mt-5 video-title-reveal">{title}</h2>
          <p className="inst-body mt-5 text-[0.9375rem] video-lede-reveal">{lede}</p>
        </div>

        <div className="video-frame">
          {reduced ? (
            <figure className="video-poster">
              <img src={poster} alt={alt} width={1200} height={675} loading="lazy" decoding="async" />
              <figcaption className="sr-only">{alt}</figcaption>
            </figure>
          ) : (
            <figure className="video-frame-wrap">
              <video
                ref={videoRef}
                className="video-element"
                src={src}
                poster={poster}
                width={1200}
                height={675}
              />
              <figcaption className="sr-only">{alt}</figcaption>
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}
