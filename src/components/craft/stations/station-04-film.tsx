"use client";

import { useState } from "react";
import type { CraftStation as CraftStationData } from "@/content/craft";
import CraftStation from "@/components/craft/craft-station";
import { PosterFilm } from "@/components/craft/station-posters";
import FilmScrub, { type FilmTone } from "@/components/media/film-scrub";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

type FilmMode = "film" | "sheet";

const FILM_SRC = "/media/craft/material-film.mp4";
const POSTER_SRC = "/media/craft/material-poster-1200.webp";

const TONES: { id: FilmTone; label: string }[] = [
  { id: "bone", label: "Bone" },
  { id: "ink", label: "Ink" },
  { id: "cobalt", label: "Cobalt" },
];

const MODES: { id: FilmMode; label: string }[] = [
  { id: "film", label: "Film" },
  { id: "sheet", label: "Contact sheet" },
];

const SHEET = [
  {
    src: "/media/craft/material-still-01-800.webp",
    alt: "Layered sheets of blank paper in cool light.",
  },
  {
    src: "/media/craft/material-still-02-800.webp",
    alt: "A plume of cobalt ink dispersing in water.",
  },
  {
    src: "/media/craft/material-still-03-800.webp",
    alt: "A glass surface in cool blue light.",
  },
  {
    src: "/media/craft/material-still-04-800.webp",
    alt: "Brushed brass under a hard specular sweep.",
  },
  {
    src: "/media/craft/material-still-05-800.webp",
    alt: "A plaster surface in raking light.",
  },
  {
    src: "/media/craft/material-still-06-800.webp",
    alt: "A folded card standing in warm light.",
  },
];

export default function StationFilm({ station }: { station: CraftStationData }) {
  const [live, setLive] = useState(false);
  const [tone, setTone] = useState<FilmTone>("bone");
  const [mode, setMode] = useState<FilmMode>("film");
  const [failed, setFailed] = useState(false);
  const [status, setStatus] = useState("Poster. The film is not loaded.");
  const reduced = useReducedMotion();

  function run() {
    setFailed(false);
    setLive(true);
    setStatus(
      reduced
        ? "Reduced motion: poster with a normal video player."
        : "Film mounted. Scroll to scrub; no autoplay.",
    );
  }

  function reset() {
    setLive(false);
    setTone("bone");
    setMode("film");
    setFailed(false);
    setStatus("Video unmounted. Poster restored.");
  }

  function chooseTone(next: FilmTone) {
    setTone(next);
    setStatus(`Tone ${next}. The grade applies to film and stills.`);
  }

  function chooseMode(next: FilmMode) {
    setMode(next);
    if (next === "sheet") {
      setStatus("Contact sheet. Six stills at their native positions.");
      return;
    }
    setStatus(
      reduced
        ? "Reduced motion: poster with a normal video player."
        : "Film mounted. Scroll to scrub; no autoplay.",
    );
  }

  return (
    <CraftStation
      station={station}
      poster={<PosterFilm />}
      live={live}
      status={status}
      controls={
        <>
          <button type="button" className="inst-btn" onClick={run}>
            {live ? "Remount" : "Run station"}
          </button>
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
      <div className="craft-film">
        <div className="craft-film-stage">
          {mode === "sheet" ? (
            <div className="craft-film-frame" data-tone={tone}>
              <div className="craft-film-sheet">
                {SHEET.map((still) => (
                  <img
                    key={still.src}
                    src={still.src}
                    alt={still.alt}
                    width={800}
                    height={450}
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            </div>
          ) : failed ? (
            <div className="craft-film-fallback">
              <img
                src={POSTER_SRC}
                alt="Six material studies: paper, ink, glass, brass, plaster and folded card."
                width={1200}
                height={675}
                decoding="async"
              />
              <p>Film unavailable. The poster and contact sheet remain.</p>
            </div>
          ) : reduced ? (
            <figure className="craft-film-frame" data-tone={tone}>
              <video
                className="craft-film-video"
                src={FILM_SRC}
                poster={POSTER_SRC}
                controls
                playsInline
                preload="metadata"
              />
              <figcaption className="visually-hidden">
                Six material studies: paper, ink, glass, brass, plaster and folded card.
              </figcaption>
            </figure>
          ) : (
            <FilmScrub
              src={FILM_SRC}
              poster={POSTER_SRC}
              alt="Six material studies: paper, ink, glass, brass, plaster and folded card."
              tone={tone}
              reducedMotion={false}
              onError={() => setFailed(true)}
            />
          )}
        </div>

        <div className="craft-film-controls">
          <div className="craft-film-group" role="group" aria-label="Film tone">
            <span className="craft-film-label">Tone</span>
            {TONES.map((item) => (
              <button
                key={item.id}
                type="button"
                className="craft-chip"
                aria-pressed={tone === item.id}
                onClick={() => chooseTone(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="craft-film-group" role="group" aria-label="Display mode">
            <span className="craft-film-label">Mode</span>
            {MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                className="craft-chip"
                aria-pressed={mode === item.id}
                onClick={() => chooseMode(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <p className="craft-film-readout">{`${tone} · ${mode} · 08:00`}</p>
        </div>
      </div>
    </CraftStation>
  );
}
