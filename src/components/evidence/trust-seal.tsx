"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { AnimationItem } from "lottie-web";

type Phase = "poster" | "loading" | "playing" | "paused" | "done" | "error";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function readReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

function readReducedMotionOnServer() {
  return false;
}

function SealPoster() {
  return (
    <svg
      className="ev-seal-poster"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby="trust-seal-title trust-seal-desc"
      focusable="false"
    >
      <title id="trust-seal-title">Delivery seal</title>
      <desc id="trust-seal-desc">
        A circular seal drawn in bone and cobalt on a dark plate: an outer ring, a dashed
        orbit, an inner disc and a check mark.
      </desc>

      <circle cx="200" cy="200" r="160" className="ev-seal-ring" />
      <circle cx="200" cy="200" r="150" className="ev-seal-orbit" />

      {[0, 90, 180, 270].map((angle) => {
        const radians = (angle * Math.PI) / 180;
        return (
          <circle
            key={angle}
            cx={200 + Math.cos(radians) * 160}
            cy={200 + Math.sin(radians) * 160}
            r="4"
            className="ev-seal-node"
          />
        );
      })}

      <circle cx="200" cy="200" r="126" className="ev-seal-rule" />
      <circle cx="200" cy="200" r="112" className="ev-seal-disc" />
      <path d="M 144 204 L 182 242 L 262 154" className="ev-seal-check" />
    </svg>
  );
}

/**
 * The trust seal.
 *
 * The poster is the default and the only thing loaded on first paint. The
 * Lottie runtime and the 120-frame seal arrive only when a reader asks for
 * them, and every failure leaves the static plate in place.
 */
export default function TrustSeal() {
  const hostRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const aliveRef = useRef(true);
  const [phase, setPhase] = useState<Phase>("poster");
  const reduced = useSyncExternalStore(
    subscribeToReducedMotion,
    readReducedMotion,
    readReducedMotionOnServer,
  );

  useEffect(
    () => () => {
      aliveRef.current = false;
      animationRef.current?.destroy();
      animationRef.current = null;
    },
    [],
  );

  const live = phase === "playing" || phase === "paused" || phase === "done";

  async function run() {
    if (phase === "loading" || phase === "playing") return;

    const host = hostRef.current;
    if (!host) return;

    setPhase("loading");

    try {
      const lottie = (await import("lottie-web")).default;
      host.replaceChildren();

      const animation = lottie.loadAnimation({
        container: host,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "/animations/trust-seal.json",
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet",
          progressiveLoad: true,
        },
      });

      animationRef.current = animation;

      if (!aliveRef.current) {
        animation.destroy();
        animationRef.current = null;
        return;
      }

      animation.addEventListener("DOMLoaded", () => setPhase("playing"));

      animation.addEventListener("data_failed", () => {
        animation.destroy();
        animationRef.current = null;
        host.replaceChildren();
        setPhase("error");
      });

      animation.addEventListener("complete", () => {
        if (window.matchMedia(REDUCED_MOTION).matches) {
          animation.destroy();
          animationRef.current = null;
          host.replaceChildren();
          setPhase("poster");
          return;
        }
        setPhase("done");
      });
    } catch {
      animationRef.current = null;
      host.replaceChildren();
      setPhase("error");
    }
  }

  function pause() {
    animationRef.current?.pause();
    setPhase("paused");
  }

  function resume() {
    animationRef.current?.play();
    setPhase("playing");
  }

  function replay() {
    const animation = animationRef.current;
    if (!animation) {
      void run();
      return;
    }
    animation.goToAndPlay(0, true);
    setPhase("playing");
  }

  const status =
    phase === "loading"
      ? "Loading the seal animation"
      : phase === "playing"
        ? "Seal animation playing"
        : phase === "paused"
          ? "Seal animation paused"
          : phase === "done"
            ? "Seal animation complete"
            : phase === "error"
              ? "Animation unavailable; showing the static seal"
              : reduced
                ? "Static seal. Play once is available."
                : "Static seal. The animation is optional.";

  return (
    <div className="ev-seal-plate">
      <div className="ev-seal-stage" data-live={live}>
        <SealPoster />
        <div ref={hostRef} className="ev-seal-lottie" aria-hidden="true" />
      </div>

      <div className="ev-seal-controls">
        {phase === "poster" || phase === "error" ? (
          <button type="button" className="inst-btn ev-seal-btn" onClick={() => void run()}>
            {reduced ? "Play once" : "Run the seal"}
          </button>
        ) : null}

        {phase === "loading" ? (
          <button type="button" className="inst-btn ev-seal-btn" disabled>
            Loading
          </button>
        ) : null}

        {phase === "playing" ? (
          <>
            <button type="button" className="inst-btn ev-seal-btn" onClick={pause}>
              Pause
            </button>
            <button
              type="button"
              className="inst-btn inst-btn-ghost ev-seal-btn"
              onClick={replay}
            >
              Replay
            </button>
          </>
        ) : null}

        {phase === "paused" ? (
          <>
            <button type="button" className="inst-btn ev-seal-btn" onClick={resume}>
              Resume
            </button>
            <button
              type="button"
              className="inst-btn inst-btn-ghost ev-seal-btn"
              onClick={replay}
            >
              Replay
            </button>
          </>
        ) : null}

        {phase === "done" ? (
          <button type="button" className="inst-btn ev-seal-btn" onClick={replay}>
            Replay
          </button>
        ) : null}
      </div>

      <p className="ev-seal-status" aria-live="polite">
        {status}
      </p>

      <p className="ev-seal-caption">
        <span>Seal / 01</span>
        <span>Static plate by default · animation on request</span>
      </p>
    </div>
  );
}
