"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CraftStation as CraftStationData } from "@/content/craft";
import CraftStation from "@/components/craft/craft-station";
import { PosterStateBridge } from "@/components/craft/station-posters";
import {
  readInstrumentPalette,
  type InstrumentPalette,
} from "@/lib/instrument/palette";

interface BridgeState {
  yaw: number;
  lift: number;
  spread: number;
}

const DEFAULTS: BridgeState = { yaw: 32, lift: 18, spread: 34 };
const HALF_WIDTH = 62;
const HALF_DEPTH = 38;

/**
 * Face tones come from the same CSS variables the rest of the page uses, so a
 * canvas plate can never drift from its DOM twin. Sides are a shade of the
 * top, not a second palette.
 */
const PLATE_TONES: { top: keyof InstrumentPalette; side: keyof InstrumentPalette }[] = [
  { top: "bone3", side: "bone3" },
  { top: "bone2", side: "bone3" },
  { top: "cobalt", side: "cobaltDeep" },
];

function project(
  x: number,
  y: number,
  z: number,
  state: BridgeState,
  cx: number,
  cy: number,
  scale: number,
) {
  const yaw = (state.yaw * Math.PI) / 180;
  const rx = x * Math.cos(yaw) - z * Math.sin(yaw);
  const rz = x * Math.sin(yaw) + z * Math.cos(yaw);
  return {
    x: cx + rx * scale,
    y: cy + (rz * 0.5 - y) * scale - state.lift * 0.5,
  };
}

function parseHex(value: string) {
  const hex = value.trim().replace(/^#/, "");
  if (hex.length !== 6) return [17, 18, 15];
  return [0, 2, 4].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
}

function mix(from: string, towards: string, ratio: number) {
  const a = parseHex(from);
  const b = parseHex(towards);
  const channel = (index: number) =>
    Math.round(a[index] + (b[index] - a[index]) * ratio)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(0)}${channel(1)}${channel(2)}`;
}

function drawDot(ctx: CanvasRenderingContext2D, point: { x: number; y: number }) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawScene(
  canvas: HTMLCanvasElement,
  state: BridgeState,
  palette: InstrumentPalette,
) {
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.round(rect.width * dpr);
  const height = Math.round(rect.height * dpr);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);

  const cx = rect.width / 2;
  const cy = rect.height / 2 + 14;
  const scale = Math.max(0.72, Math.min(rect.width / 280, rect.height / 210) * 1.05);

  ctx.save();
  ctx.setLineDash([3, 4]);
  ctx.strokeStyle = palette.ink;
  ctx.globalAlpha = 0.32;
  ctx.lineWidth = 1;
  const axisTop = project(0, 66, 0, state, cx, cy, scale);
  const axisBottom = project(0, -30, 0, state, cx, cy, scale);
  ctx.beginPath();
  ctx.moveTo(axisTop.x, axisTop.y);
  ctx.lineTo(axisBottom.x, axisBottom.y);
  ctx.stroke();
  ctx.restore();

  const levels = [-1, 0, 1].map((step) => step * state.spread * 0.45);

  levels.forEach((level, index) => {
    const tone = PLATE_TONES[index];
    const topY = level + 0.35;
    const bottomY = level - 0.25;
    const corners = [
      { x: -HALF_WIDTH, z: -HALF_DEPTH },
      { x: HALF_WIDTH, z: -HALF_DEPTH },
      { x: HALF_WIDTH, z: HALF_DEPTH },
      { x: -HALF_WIDTH, z: HALF_DEPTH },
    ];
    const top = corners.map((corner) => project(corner.x, topY, corner.z, state, cx, cy, scale));
    const bottom = corners.map((corner) => project(corner.x, bottomY, corner.z, state, cx, cy, scale));

    // Paint the four side faces first, then the top face, so the box reads
    // correctly at every yaw angle.
    ctx.globalAlpha = 1;
    for (let edge = 0; edge < 4; edge += 1) {
      const next = (edge + 1) % 4;
      ctx.beginPath();
      ctx.moveTo(top[edge].x, top[edge].y);
      ctx.lineTo(top[next].x, top[next].y);
      ctx.lineTo(bottom[next].x, bottom[next].y);
      ctx.lineTo(bottom[edge].x, bottom[edge].y);
      ctx.closePath();
      ctx.fillStyle = mix(palette[tone.side], palette.ink, 0.12);
      ctx.fill();
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(top[0].x, top[0].y);
    for (let edge = 1; edge < 4; edge += 1) ctx.lineTo(top[edge].x, top[edge].y);
    ctx.closePath();
    ctx.fillStyle = palette[tone.top];
    ctx.fill();
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = palette.ink;
    ctx.globalAlpha = 0.72;
    const marker = project(-HALF_WIDTH - 10, topY, HALF_DEPTH, state, cx, cy, scale);
    drawDot(ctx, marker);
    ctx.globalAlpha = 0.72;
    ctx.font = "9px ui-monospace, SFMono-Regular, monospace";
    ctx.fillText(`0${index + 1}`, marker.x - 16, marker.y + 3);
  });

  ctx.globalAlpha = 0.55;
  ctx.fillStyle = palette.ink;
  ctx.font = "9px ui-monospace, SFMono-Regular, monospace";
  ctx.fillText("SHARED STATE / ONE SOURCE", 14, rect.height - 12);
  ctx.globalAlpha = 1;
}

export default function StationStateBridge({
  station,
}: {
  station: CraftStationData;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const palette = useMemo(() => readInstrumentPalette(), []);
  const [live, setLive] = useState(false);
  const [runId, setRunId] = useState(0);
  const [state, setState] = useState<BridgeState>(DEFAULTS);
  const [status, setStatus] = useState("Static assembly. Three plates, one state.");

  useEffect(() => {
    if (!live) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => drawScene(canvas, state, palette);
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [live, state, palette]);

  function run() {
    setLive(true);
    setRunId((value) => value + 1);
    setStatus("DOM and canvas share one state object.");
  }

  function reset() {
    setState(DEFAULTS);
    setLive(false);
    setStatus("Static assembly restored.");
  }

  function update<K extends keyof BridgeState>(key: K, value: number) {
    setState((current) => ({ ...current, [key]: value }));
    setStatus("State changed; the canvas redrew from the same values.");
  }

  return (
    <CraftStation
      station={station}
      poster={<PosterStateBridge />}
      live={live}
      status={status}
      controls={
        <>
          <button type="button" className="inst-btn" onClick={run}>
            {live ? "Run again" : "Run station"}
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
      <div className="craft-bridge" key={runId}>
        <div className="craft-bridge-canvas" aria-hidden="true">
          <canvas ref={canvasRef} />
        </div>

        <div className="craft-bridge-controls">
          {(
            [
              { key: "yaw", label: "Yaw", min: 0, max: 90, suffix: "°" },
              { key: "lift", label: "Lift", min: 0, max: 60, suffix: "" },
              { key: "spread", label: "Spread", min: 0, max: 80, suffix: "" },
            ] as const
          ).map((control) => (
            <div className="craft-slider" key={control.key}>
              <label htmlFor={`craft-${control.key}`}>
                <span>{control.label}</span>
                <output htmlFor={`craft-${control.key}`}>
                  {state[control.key]}
                  {control.suffix}
                </output>
              </label>
              <input
                id={`craft-${control.key}`}
                type="range"
                min={control.min}
                max={control.max}
                value={state[control.key]}
                onChange={(event) => update(control.key, Number(event.currentTarget.value))}
              />
            </div>
          ))}
          <p className="craft-bridge-readout">
            Yaw {state.yaw}° · Lift {state.lift} · Spread {state.spread}
          </p>
        </div>
      </div>
    </CraftStation>
  );
}
