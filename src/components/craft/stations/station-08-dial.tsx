"use client";

import { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";
import type { CraftStation as CraftStationData } from "@/content/craft";
import CraftStation from "@/components/craft/craft-station";
import { PosterDial } from "@/components/craft/station-posters";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type Phase = "poster" | "loading" | "playing" | "paused" | "done" | "error";

export default function StationDial({ station }: { station: CraftStationData }) {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);
  const [live, setLive] = useState(false);
  const [request, setRequest] = useState(0);
  const [phase, setPhase] = useState<Phase>("poster");

  useEffect(() => {
    if (!live) return;
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let instance: AnimationItem | null = null;
    setPhase("loading");

    void (async () => {
      try {
        const lottie = (await import("lottie-web")).default;
        if (cancelled) return;

        host.replaceChildren();
        instance = lottie.loadAnimation({
          container: host,
          renderer: "svg",
          loop: false,
          autoplay: true,
          path: "/craft/station-08.json",
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
            progressiveLoad: true,
          },
        });
        animationRef.current = instance;

        instance.addEventListener("DOMLoaded", () => {
          if (!cancelled) setPhase("playing");
        });

        instance.addEventListener("data_failed", () => {
          if (cancelled) return;
          instance?.destroy();
          animationRef.current = null;
          host.replaceChildren();
          setPhase("error");
        });

        instance.addEventListener("complete", () => {
          if (cancelled) return;
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            instance?.destroy();
            animationRef.current = null;
            host.replaceChildren();
            setLive(false);
            setPhase("poster");
            return;
          }
          setPhase("done");
        });
      } catch {
        if (cancelled) return;
        animationRef.current = null;
        host.replaceChildren();
        setPhase("error");
      }
    })();

    return () => {
      cancelled = true;
      instance?.destroy();
      animationRef.current = null;
      host.replaceChildren();
    };
  }, [live, request]);

  function run() {
    setLive(true);
    setRequest((value) => value + 1);
  }

  function reset() {
    animationRef.current?.destroy();
    animationRef.current = null;
    hostRef.current?.replaceChildren();
    setLive(false);
    setPhase("poster");
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
      run();
      return;
    }
    animation.goToAndPlay(0, true);
    setPhase("playing");
  }

  const status =
    phase === "loading"
      ? "Loading the dial runtime and its JSON."
      : phase === "playing"
        ? "Dial playing. Ninety frames, no loop."
        : phase === "paused"
          ? "Dial paused. Resume or replay."
          : phase === "done"
            ? "Dial complete. Replay or reset."
            : phase === "error"
              ? "Runtime unavailable; the static dial is the fallback."
              : reduced
                ? "Static dial. Play once is available."
                : "Static dial. The animation is optional.";

  return (
    <CraftStation
      station={station}
      poster={<PosterDial />}
      live={live}
      status={status}
      controls={
        <>
          {phase === "poster" || phase === "error" ? (
            <button type="button" className="inst-btn" onClick={run}>
              {reduced ? "Play once" : live ? "Reload the dial" : "Run station"}
            </button>
          ) : null}

          {phase === "loading" ? (
            <button type="button" className="inst-btn" disabled>
              Loading
            </button>
          ) : null}

          {phase === "playing" ? (
            <button type="button" className="inst-btn" onClick={pause}>
              Pause
            </button>
          ) : null}

          {phase === "paused" ? (
            <button type="button" className="inst-btn" onClick={resume}>
              Resume
            </button>
          ) : null}

          {phase === "playing" || phase === "paused" || phase === "done" ? (
            <button
              type="button"
              className="inst-btn inst-btn-ghost"
              onClick={replay}
            >
              Replay
            </button>
          ) : null}

          <button
            type="button"
            className="inst-btn inst-btn-ghost"
            onClick={reset}
            disabled={!live}
          >
            Reset
          </button>
        </>
      }
    >
      <div className="craft-dial">
        <div className="craft-dial-stage" ref={hostRef} aria-hidden="true" />
        {phase === "loading" ? (
          <p className="craft-dial-loading">Loading 90-frame dial…</p>
        ) : null}
        {phase === "error" ? (
          <div className="craft-dial-error">
            <span className="cp-mono">RUNTIME UNAVAILABLE</span>
            <p>The static dial above is the fallback. No animation is running.</p>
          </div>
        ) : null}
        <p className="craft-dial-caption">
          <span>90 frames / 30 fps</span>
          <span>No loop · no autoplay on load</span>
        </p>
      </div>
    </CraftStation>
  );
}
