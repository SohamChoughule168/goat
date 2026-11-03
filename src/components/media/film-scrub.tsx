"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export type FilmTone = "bone" | "ink" | "cobalt";

export interface FilmScrubProps {
  src: string;
  poster: string;
  alt: string;
  tone: FilmTone;
  reducedMotion?: boolean;
  onError?: () => void;
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

/**
 * A station-owned film scrub.
 *
 * Scroll position inside this frame maps to `currentTime`. There is no
 * page-level pin and no autoplay: the only `play()` call is the muted unlock
 * immediately after the reader presses Run, which is paused again at once.
 */
export default function FilmScrub({
  src,
  poster,
  alt,
  tone,
  reducedMotion = false,
  onError,
}: FilmScrubProps): ReactNode {
  const frameRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [nativeControls, setNativeControls] = useState(false);

  // iOS seek unlock. One muted play/pause pair, never a loop.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;

    let cancelled = false;

    try {
      const attempt = video.play();
      if (attempt && typeof attempt.then === "function") {
        attempt
          .then(() => {
            if (!cancelled) video.pause();
          })
          .catch(() => {
            if (!cancelled) queueMicrotask(() => setBlocked(true));
          });
      } else {
        video.pause();
      }
    } catch {
      queueMicrotask(() => setBlocked(true));
    }

    return () => {
      cancelled = true;
    };
  }, [reducedMotion, src]);

  // Scroll mapping: one rAF per event, no state update per scroll.
  useEffect(() => {
    const video = videoRef.current;
    const frame = frameRef.current;
    if (!video || !frame || reducedMotion) return;

    let request = 0;

    const measure = () => {
      request = 0;
      const rect = frame.getBoundingClientRect();
      const progress = clamp(
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height),
      );
      const duration = video.duration;
      if (video.readyState < 1 || !Number.isFinite(duration) || duration <= 0) return;

      const target = progress * duration;
      if (Math.abs(video.currentTime - target) < 0.02) return;

      const seekable = video as HTMLVideoElement & { fastSeek?: (time: number) => void };
      if (typeof seekable.fastSeek === "function") seekable.fastSeek(target);
      else video.currentTime = target;
    };

    const schedule = () => {
      if (request !== 0) return;
      request = window.requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    video.addEventListener("loadedmetadata", schedule);
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      video.removeEventListener("loadedmetadata", schedule);
      if (request !== 0) window.cancelAnimationFrame(request);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [reducedMotion, src]);

  return (
    <figure className="craft-film-frame" data-tone={tone} ref={frameRef}>
      <video
        ref={videoRef}
        className="craft-film-video"
        src={src}
        poster={poster}
        muted
        playsInline
        preload="metadata"
        controls={nativeControls}
        aria-hidden="true"
        onError={onError}
      />
      <figcaption className="visually-hidden">{alt}</figcaption>
      {blocked ? (
        <button
          type="button"
          className="inst-btn inst-btn-ghost craft-film-play"
          onClick={() => {
            setNativeControls(true);
            void videoRef.current?.play();
          }}
        >
          Play film
        </button>
      ) : null}
    </figure>
  );
}
