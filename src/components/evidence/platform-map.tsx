"use client";

import Link from "next/link";
import { Fragment, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { stackLayers } from "@/content/institutional";
import { STACK_SEAMS } from "@/content/evidence";

const seamByAfter = new Map(STACK_SEAMS.map((seam) => [seam.after, seam]));

function nextIndex(index: string) {
  const position = stackLayers.findIndex((layer) => layer.index === index);
  return stackLayers[position + 1]?.index ?? "";
}

/**
 * The Institution Stack as a register rather than a card grid.
 *
 * Every layer expands in place. The five seams are rendered as their own rows:
 * they are the part of an institute system that usually goes unowned, so they
 * should not be hidden inside a layer's detail.
 */
export default function PlatformMap() {
  const [openId, setOpenId] = useState<string | null>("website");
  const openLayer = stackLayers.find((layer) => layer.id === openId) ?? null;

  return (
    <div
      className="ev-map"
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpenId(null);
      }}
    >
      <aside className="ev-map-key" aria-label="Stack key">
        <p className="inst-label">Stack key</p>

        <div className="ev-map-diagram" aria-hidden="true">
          {stackLayers.map((layer) => {
            const seam = seamByAfter.get(layer.index);
            return (
              <Fragment key={layer.id}>
                <div className="ev-map-bar" data-active={layer.id === openId}>
                  <span className="ev-map-bar-index">{layer.index}</span>
                  <span className="ev-map-bar-line" />
                  <span className="ev-map-bar-title">{layer.title}</span>
                </div>
                {seam ? (
                  <div className="ev-map-seam">
                    <span className="ev-map-seam-dot" />
                    <span>{seam.label}</span>
                  </div>
                ) : null}
              </Fragment>
            );
          })}
        </div>

        <p className="ev-map-key-note">
          Eight layers. Five seams. The seams are where most institute systems fail.
        </p>

        <dl className="ev-map-key-stats">
          <div>
            <dt>Inspecting</dt>
            <dd>{openLayer ? `${openLayer.index} / ${openLayer.title}` : "None"}</dd>
          </div>
          <div>
            <dt>Named seams</dt>
            <dd>05</dd>
          </div>
        </dl>
      </aside>

      <div className="ev-map-rows">
        <p className="ev-micro ev-map-instruction">Select a layer to inspect it</p>

        {stackLayers.map((layer) => {
          const open = layer.id === openId;
          const seam = seamByAfter.get(layer.index);

          return (
            <Fragment key={layer.id}>
              <article className="ev-map-row" data-open={open}>
                <h3 className="ev-map-head">
                  <button
                    type="button"
                    id={`stack-${layer.id}-button`}
                    className="ev-map-button"
                    aria-expanded={open}
                    aria-controls={`stack-${layer.id}-panel`}
                    onClick={() => setOpenId(open ? null : layer.id)}
                  >
                    <span className="ev-map-index">{layer.index}</span>
                    <span className="ev-map-heading">
                      <span className="ev-map-title">{layer.title}</span>
                      <span className="ev-map-short">{layer.short}</span>
                    </span>
                    <span className="ev-map-toggle" aria-hidden="true">
                      {open ? "−" : "+"}
                    </span>
                  </button>
                </h3>

                <div
                  id={`stack-${layer.id}-panel`}
                  className="ev-map-panel"
                  role="region"
                  aria-labelledby={`stack-${layer.id}-button`}
                  hidden={!open}
                >
                  <div className="ev-map-panel-grid">
                    <div>
                      <p className="ev-micro">The problem</p>
                      <p>{layer.problem}</p>
                    </div>
                    <div>
                      <p className="ev-micro">What we build</p>
                      <p>{layer.build}</p>
                    </div>
                    <div>
                      <p className="ev-micro">Signals it is missing</p>
                      <ul>
                        {layer.signals.map((signal) => (
                          <li key={signal}>
                            <span>{signal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="ev-map-panel-foot">
                    <div>
                      <span className="ev-micro">Capabilities</span>
                      {layer.capabilities.map((capability) =>
                        capability.href ? (
                          <Link
                            key={capability.label}
                            href={capability.href}
                            className="inst-link"
                          >
                            {capability.label}
                            <ArrowUpRight
                              aria-hidden
                              className="inst-link-arrow h-3 w-3"
                            />
                          </Link>
                        ) : (
                          <span key={capability.label} className="ev-map-capability">
                            {capability.label}
                          </span>
                        ),
                      )}
                    </div>
                    <div>
                      <span className="ev-micro">Built for</span>
                      <Link href={layer.audience.href} className="inst-link">
                        {layer.audience.label}
                        <ArrowUpRight aria-hidden className="inst-link-arrow h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>

              {seam ? (
                <div className="ev-seam">
                  <span className="ev-seam-label">
                    Seam {seam.after} → {nextIndex(seam.after)}
                  </span>
                  <p>
                    <strong>{seam.label}</strong> — {seam.detail}
                  </p>
                </div>
              ) : null}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
