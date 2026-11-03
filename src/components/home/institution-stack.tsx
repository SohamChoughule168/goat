"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { stackLayers } from "@/content/institutional";

export default function InstitutionStack() {
  const [activeIndex, setActiveIndex] = useState(2);
  const active = stackLayers[activeIndex];
  const baseId = useId();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const next =
      event.key === "ArrowDown"
        ? (activeIndex + 1) % stackLayers.length
        : (activeIndex - 1 + stackLayers.length) % stackLayers.length;
    setActiveIndex(next);
    const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>(
      "button[data-stack-button]",
    );
    buttons[next]?.focus();
  };

  return (
    <div className="stack-layout">
      <div className="stack-figure">
        <div className="stack-diagram" aria-hidden="true">
          <svg viewBox="0 0 420 464" role="presentation" focusable="false">
            {stackLayers.map((layer, index) => {
              const y = 8 + index * 56;
              const isActive = index === activeIndex;
              return (
                <g key={layer.id}>
                  <rect
                    x="1"
                    y={y}
                    width="418"
                    height="44"
                    className="stack-cell"
                    data-active={isActive}
                  />
                  <text x="16" y={y + 27} className="stack-cell-index" data-active={isActive}>
                    {layer.index}
                  </text>
                  <text x="52" y={y + 27} className="stack-cell-title" data-active={isActive}>
                    {layer.title}
                  </text>
                  <circle
                    cx="394"
                    cy={y + 22}
                    r="3"
                    className="stack-cell-dot"
                    data-active={isActive}
                  />
                </g>
              );
            })}
          </svg>
        </div>
        <div className="stack-figure-detail" aria-live="polite">
          <p className="inst-label">{active.index} / {active.title}</p>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-[var(--ink-2)]">
            {active.build}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {active.capabilities.map((capability) =>
              capability.href ? (
                <Link key={capability.label} href={capability.href} className="inst-tag">
                  {capability.label}
                </Link>
              ) : (
                <span key={capability.label} className="inst-tag">
                  {capability.label}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="stack-rows" onKeyDown={handleKeyDown}>
        {stackLayers.map((layer, index) => {
          const isActive = index === activeIndex;
          return (
            <div key={layer.id} className="stack-row" data-active={isActive}>
              <button
                type="button"
                data-stack-button
                className="stack-row-button"
                data-active={isActive}
                aria-expanded={isActive}
                aria-controls={`${baseId}-${layer.id}`}
                onClick={() => setActiveIndex(index)}
              >
                <span className="inst-num">{layer.index}</span>
                <span className="stack-row-title">{layer.title}</span>
                <span className="stack-row-short">{layer.short}</span>
                <span className="stack-row-arrow" aria-hidden="true">
                  <ArrowUpRight size={16} strokeWidth={1.5} />
                </span>
              </button>
              <div
                id={`${baseId}-${layer.id}`}
                className="stack-row-detail"
                data-active={isActive}
              >
                <div className="stack-row-detail-grid">
                  <div>
                    <p className="stack-detail-label">The problem</p>
                    <p className="stack-detail-copy">{layer.problem}</p>
                  </div>
                  <div>
                    <p className="stack-detail-label">What we build</p>
                    <p className="stack-detail-copy">{layer.build}</p>
                  </div>
                </div>
                <div className="stack-signals">
                  {layer.signals.map((signal) => (
                    <span key={signal}>{signal}</span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <Link href={layer.audience.href} className="inst-link">
                    {layer.audience.label}
                    <ArrowUpRight size={13} strokeWidth={1.5} className="inst-link-arrow" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
