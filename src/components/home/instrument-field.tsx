"use client";

import { useEffect, useRef, useState } from "react";
import { stackLayers } from "@/content/institutional";
import { hashString, mulberry32 } from "@/components/experience/kit/random";
import { deriveTier, tierSettings } from "@/components/experience/kit/tier";
import {
  readInstrumentFonts,
  readInstrumentPalette,
  type InstrumentPalette,
} from "@/lib/instrument/palette";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

/**
 * Instrument Field — the operating field drawn as a precision instrument.
 *
 * Eight layer plates sit on a hairline ledger grid. As the section crosses the
 * viewport, the plates assemble, records travel to the ledger spine and the
 * handover seal closes the drawing. Pure Canvas 2D — no WebGL, no idle rAF:
 * every frame is driven by scroll, resize or pointer, and the loop stops when
 * the plate is offscreen or the tab is hidden.
 *
 * Deterministic by seed: every visitor sees the identical drawing.
 * Reduced motion draws the finished, assembled plate as a single static frame.
 *
 * Premium enhancements:
 * - Liquid glass legend panel with specular highlights
 * - Magnetic cursor interaction on legend items
 * - Specular sweep on plate hover
 * - Parallax depth on plates
 * - Ambient mesh gradient background
 */

interface Signal {
  source: number;
  offset: number;
  speed: number;
  drift: number;
}

const SEED = hashString("imaginars-operating-field");
const GRID_ALPHA = 0.055;

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function buildSignals(count: number): Signal[] {
  const rand = mulberry32(SEED);
  const signals: Signal[] = [];
  for (let i = 0; i < count; i += 1) {
    signals.push({
      source: Math.floor(rand() * stackLayers.length),
      offset: rand(),
      speed: 0.55 + rand() * 0.9,
      drift: (rand() - 0.5) * 14,
    });
  }
  return signals;
}

export default function InstrumentField() {
  const figureRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef(-1);
  const legendHoverRef = useRef(-1);
  const requestDrawRef = useRef<(() => void) | null>(null);
  const paletteRef = useRef<InstrumentPalette | null>(null);
  const signalsRef = useRef<Signal[] | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const frameRef = useRef(0);
  const reduced = useReducedMotion();
  const [legendActive, setLegendActive] = useState(-1);

  useEffect(() => {
    const figure = figureRef.current;
    const canvas = canvasRef.current;
    if (!figure || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx = context;

    const fonts = readInstrumentFonts();

    const coarse =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;
    const cores =
      typeof navigator !== "undefined" && navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency
        : 4;
    const settings = tierSettings(deriveTier({ reduced, coarse, cores }));
    const signalBudget =
      settings.tier === "high" ? 110 : settings.tier === "balanced" ? 64 : 26;

    if (!signalsRef.current) {
      signalsRef.current = buildSignals(signalBudget);
    }
    paletteRef.current = readInstrumentPalette();

    const resize = () => {
      const rect = figure.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      const dpr = Math.min(window.devicePixelRatio || 1, settings.dprMax);
      sizeRef.current = { width: rect.width, height: rect.height };
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const draw = () => {
      const palette = paletteRef.current;
      const signals = signalsRef.current;
      if (!palette || !signals) return;
      const { width: w, height: h } = sizeRef.current;
      if (w < 1 || h < 1) return;

      const p = reduced ? 1 : easeOutCubic(progressRef.current);
      const pad = Math.max(18, Math.min(38, w * 0.04));
      const count = stackLayers.length;

      ctx.clearRect(0, 0, w, h);

      // --- Ambient mesh gradient background ---
      const meshGrad = ctx.createRadialGradient(
        w * 0.2, h * 0.8, 0,
        w * 0.2, h * 0.8, Math.max(w, h)
      );
      meshGrad.addColorStop(0, "rgba(20, 216, 150, 0.03)");
      meshGrad.addColorStop(0.5, "rgba(59, 130, 246, 0.02)");
      meshGrad.addColorStop(1, "transparent");
      ctx.fillStyle = meshGrad;
      ctx.fillRect(0, 0, w, h);

      // --- Ledger grid -------------------------------------------------
      const grid = Math.max(26, Math.min(42, w / 24));
      ctx.save();
      ctx.strokeStyle = palette.ink;
      ctx.lineWidth = 1;
      ctx.globalAlpha = GRID_ALPHA;
      ctx.beginPath();
      for (let x = pad; x <= w - pad + 0.5; x += grid) {
        ctx.moveTo(Math.round(x) + 0.5, pad);
        ctx.lineTo(Math.round(x) + 0.5, h - pad);
      }
      for (let y = pad; y <= h - pad + 0.5; y += grid) {
        ctx.moveTo(pad, Math.round(y) + 0.5);
        ctx.lineTo(w - pad, Math.round(y) + 0.5);
      }
      ctx.stroke();
      ctx.restore();

      // --- Technical frame corners -------------------------------------
      ctx.save();
      ctx.strokeStyle = palette.ink;
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 1;
      const tick = 12;
      const corners: Array<[number, number, number, number]> = [
        [pad, pad, 1, 1],
        [w - pad, pad, -1, 1],
        [pad, h - pad, 1, -1],
        [w - pad, h - pad, -1, -1],
      ];
      for (const [cx, cy, dx, dy] of corners) {
        ctx.beginPath();
        ctx.moveTo(cx + dx * tick, cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy + dy * tick);
        ctx.stroke();
      }
      ctx.restore();

      // --- Geometry ----------------------------------------------------
      const top = pad + 10;
      const bottom = h - pad - 26;
      const areaH = Math.max(40, bottom - top);
      const gap = lerp(24, 10, p);
      const plateH = Math.max(14, (areaH - gap * (count - 1)) / count);
      const plateW = (w - pad * 2) * 0.54;
      const spineX = pad + plateW + Math.max(46, (w - pad * 2 - plateW) * 0.42);

      const plateCenterY = (index: number) =>
        top + index * (plateH + gap) + plateH / 2;

      // --- Plates ------------------------------------------------------
      stackLayers.forEach((layer, i) => {
        const wobble = (i % 2 === 0 ? -1 : 1) * (16 + ((i * 7) % 24));
        const x = pad + (1 - p) * wobble;
        const y = top + i * (plateH + gap);
        const skew = (1 - p) * 0.045 * (i % 2 === 0 ? 1 : -1);
        const highlight = pointerRef.current === i || legendHoverRef.current === i;
        const isSpine = i === count - 1;

        ctx.save();
        ctx.translate(x, y);
        ctx.transform(1, 0, skew, 1, 0, 0);

        // Plate shadow/depth
        ctx.save();
        ctx.globalAlpha = 0.15 * p;
        ctx.fillStyle = "#000";
        ctx.fillRect(4, 4, plateW, plateH);
        ctx.restore();

        ctx.globalAlpha = (isSpine ? 0.72 : 0.5) + 0.34 * p;
        ctx.fillStyle = isSpine ? palette.bone2 : palette.bone;
        ctx.fillRect(0, 0, plateW, plateH);

        // Liquid glass specular sweep on hover
        const isHighlight = pointerRef.current === i || legendHoverRef.current === i;
        if (isHighlight) {
          const specGrad = ctx.createLinearGradient(0, 0, plateW, 0);
          specGrad.addColorStop(0, "transparent");
          specGrad.addColorStop(0.5, "rgba(255,255,255,0.08)");
          specGrad.addColorStop(1, "transparent");
          ctx.globalAlpha = 0.6;
          ctx.fillStyle = specGrad;
          ctx.fillRect(0, 0, plateW, plateH);
        }

        ctx.globalAlpha = (isHighlight ? 0.55 : 0.2) + 0.24 * p;
        ctx.strokeStyle = isHighlight ? palette.cobalt : palette.ink;
        ctx.lineWidth = isHighlight ? 1.5 : 1;
        ctx.strokeRect(0.5, 0.5, plateW - 1, plateH - 1);

        if (isHighlight) {
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = palette.cobalt;
          ctx.fillRect(0, 0, 2, plateH);
        }

        // Spine indicator line
        if (isSpine) {
          ctx.globalAlpha = 0.4 + 0.3 * p;
          ctx.strokeStyle = palette.cobalt;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(plateW - 4, 0);
          ctx.lineTo(plateW - 4, plateH);
          ctx.stroke();
        }

        const indexSize = Math.max(8.5, Math.min(10.5, plateH * 0.44));
        const titleSize = Math.max(10, Math.min(12.5, plateH * 0.52));

        ctx.globalAlpha = 0.42 + 0.36 * p;
        ctx.fillStyle = isSpine ? palette.cobalt : palette.ink3;
        ctx.font = `600 ${indexSize}px ${fonts.mono}`;
        ctx.textBaseline = "middle";
        ctx.fillText(layer.index, 12, plateH / 2 + 0.5);

        ctx.globalAlpha = 0.66 + 0.3 * p;
        ctx.fillStyle = palette.ink2;
        ctx.font = `500 ${titleSize}px ${fonts.sans}`;
        ctx.fillText(layer.title, 40, plateH / 2 + 0.5);

        if (plateH > 22) {
          ctx.globalAlpha = 0.24 + 0.3 * p;
          ctx.fillStyle = isSpine ? palette.cobalt : palette.ink3;
          ctx.fillRect(plateW - 16, plateH / 2 - 2.5, 6, 5);
        }
        ctx.restore();
      });

      // --- Ledger spine --------------------------------------------------
      ctx.save();
      ctx.strokeStyle = palette.ink;
      ctx.globalAlpha = 0.18 + 0.12 * p;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(spineX + 0.5, top);
      ctx.lineTo(spineX + 0.5, bottom);
      ctx.stroke();
      ctx.restore();

      // --- Records travelling to the spine -------------------------------
      ctx.save();
      for (const signal of signals) {
        const u = (signal.offset + p * signal.speed * 1.8) % 1;
        if (u <= 0.001 || u >= 0.999) continue;
        const sourceY = plateCenterY(signal.source);
        const startX = pad - 8;
        const x = lerp(startX, spineX, easeOutCubic(u));
        const y = sourceY + Math.sin(u * Math.PI) * signal.drift;
        const alpha = Math.sin(u * Math.PI) * (0.22 + 0.5 * p);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = signal.source === count - 1 ? palette.cobalt : palette.ink2;
        const size = 1.6 + 0.8 * p;
        ctx.fillRect(x, y - size / 2, size, size);
      }
      ctx.restore();

      // --- Verified ticks along the spine ---------------------------------
      const tickCount = Math.floor(p * 22);
      ctx.save();
      ctx.strokeStyle = palette.cobalt;
      ctx.lineWidth = 1;
      for (let k = 0; k < tickCount; k += 1) {
        const ty = lerp(bottom - 6, top + 6, k / 21);
        ctx.globalAlpha = 0.24 + 0.5 * (k / 22);
        ctx.beginPath();
        ctx.moveTo(spineX + 1.5, ty + 0.5);
        ctx.lineTo(spineX + 9.5, ty + 0.5);
        ctx.stroke();
      }
      ctx.restore();

      // --- Handover seal ---------------------------------------------------
      if (p > 0.985) {
        const sealX = spineX + 5;
        const sealY = top - 4;
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = palette.cobalt;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(sealX, sealY, 8.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(sealX - 3.6, sealY + 0.4);
        ctx.lineTo(sealX - 0.9, sealY + 3.2);
        ctx.lineTo(sealX + 3.9, sealY - 3.2);
        ctx.stroke();
        ctx.restore();
      }

      // --- Readout ----------------------------------------------------------
      const readIndex = pointerRef.current;
      const readLayer = readIndex >= 0 ? stackLayers[readIndex] : undefined;
      ctx.save();
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = readLayer ? palette.cobalt : palette.ink3;
      ctx.font = `500 10px ${fonts.mono}`;
      ctx.textBaseline = "alphabetic";
      const readText = readLayer
        ? `${readLayer.index} · ${readLayer.title.toUpperCase()}`
        : "OPERATING FIELD · LAYERS 01 — 08";
      ctx.fillText(readText, pad, h - pad);
      ctx.globalAlpha = 0.32;
      ctx.fillStyle = palette.ink3;
      ctx.font = `500 10px ${fonts.mono}`;
      const legend = p >= 0.985 ? "HANDOVER COMPLETE" : "ASSEMBLING";
      const legendWidth = ctx.measureText(legend).width;
      ctx.fillText(legend, w - pad - legendWidth, h - pad);
      ctx.restore();
    };

    const scheduleDraw = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = 0;
        draw();
      });
    };

    requestDrawRef.current = scheduleDraw;

    const visibleRef = { current: false };

    const readProgress = () => {
      if (reduced) {
        progressRef.current = 1;
        return;
      }
      const rect = figure.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const raw = clamp01((vh - rect.top) / (vh * 0.82 + rect.height * 0.42));
      progressRef.current = raw;
    };

    const onScroll = () => {
      if (!visibleRef.current) return;
      readProgress();
      scheduleDraw();
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const palette = paletteRef.current;
      if (!palette || rect.height < 1) return;
      const pad = Math.max(18, Math.min(38, rect.width * 0.04));
      const top = pad + 10;
      const bottom = rect.height - pad - 26;
      const gap = lerp(24, 10, easeOutCubic(progressRef.current));
      const plateH = Math.max(14, (bottom - top - gap * (stackLayers.length - 1)) / stackLayers.length);
      const y = event.clientY - rect.top;
      const index = Math.floor((y - top) / (plateH + gap));
      const next = index >= 0 && index < stackLayers.length ? index : -1;
      if (next !== pointerRef.current) {
        pointerRef.current = next;
        scheduleDraw();
      }
    };

    const onPointerLeave = () => {
      if (pointerRef.current !== -1) {
        pointerRef.current = -1;
        scheduleDraw();
      }
    };

    const onVisibility = () => {
      if (!document.hidden && visibleRef.current) {
        readProgress();
        scheduleDraw();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(figure);

    // Re-read tokens when the theme changes (light / dark).
    const themeObserver = new MutationObserver(() => {
      paletteRef.current = readInstrumentPalette();
      scheduleDraw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        visibleRef.current = Boolean(entry?.isIntersecting);
        if (visibleRef.current) {
          readProgress();
          scheduleDraw();
        }
      },
      { rootMargin: "160px 0px", threshold: 0 },
    );
    intersectionObserver.observe(figure);

    readProgress();
    resize();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scheduleDraw, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scheduleDraw);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      requestDrawRef.current = null;
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [reduced]);

  return (
    <section className="inst-section instrument-field instrument-field-premium" aria-labelledby="home-field">
      <div className="inst-shell">
        <div className="instrument-head instrument-head-premium">
          <div>
            <p className="inst-label instrument-label-reveal">The operating field</p>
            <h2 id="home-field" className="inst-h2 mt-5 max-w-[24ch] instrument-title-reveal">
              Eight layers, assembled into <span className="inst-serif">one ledger.</span>
            </h2>
          </div>
          <p className="instrument-lede instrument-lede-reveal">
            The stack is not a menu. Brand, site, admissions, portal and the record behind them
            share one set of definitions. Scroll the drawing and the layers close ranks — the
            same way the engagement does.
          </p>
        </div>

        <div className="instrument-body instrument-body-premium">
          <figure className="instrument-plate instrument-plate-premium" ref={figureRef}>
            <canvas ref={canvasRef} aria-hidden="true" className="instrument-canvas magnetic" />
            <figcaption className="instrument-caption-premium">Schematic drawing. Not client data.</figcaption>
          </figure>

          <div className="instrument-legend-panel glass-liquid specular">
            <ol className="instrument-legend instrument-legend-premium" aria-label="The eight operating layers">
              {stackLayers.map((layer, index) => (
                <li
                  key={layer.id}
                  className="instrument-legend-item instrument-legend-item-premium magnetic specular"
                  onPointerEnter={() => {
                    legendHoverRef.current = index;
                    requestDrawRef.current?.();
                  }}
                  onPointerLeave={() => {
                    if (legendHoverRef.current === index) {
                      legendHoverRef.current = -1;
                      requestDrawRef.current?.();
                    }
                  }}
                >
                  <span className="instrument-legend-index">{layer.index}</span>
                  <span className="instrument-legend-content">
                    <span className="instrument-legend-title">{layer.title}</span>
                    <span className="instrument-legend-short">{layer.short}</span>
                  </span>
                  <span className="instrument-legend-indicator" aria-hidden="true" />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}