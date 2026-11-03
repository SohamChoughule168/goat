import type { Metadata } from "next";
import Link from "next/link";
import EvidenceHeader from "@/components/evidence/evidence-header";
import CraftLab from "@/components/craft/craft-lab";
import { CRAFT_STATS } from "@/content/craft";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Craft — the workshop",
  description:
    "Eleven stations documenting how this site is built: route gates, scene architecture, motion grammar, React Three Fiber, GSAP, Lottie and two labelled gaps.",
  path: "/craft",
});

const READ_KEYS = [
  {
    index: "01",
    title: "Poster first",
    copy: "Every bench opens as a static technical plate. Nothing downloads, mounts or plays until you ask it to.",
    note: "0 KB until run",
  },
  {
    index: "02",
    title: "One control",
    copy: "Run mounts the station. Reset returns the poster and tears the runtime down. The two actions are always adjacent.",
    note: "No hidden state",
  },
  {
    index: "03",
    title: "Honest gaps",
    copy: "Two stations have no authored asset. Their run controls stay disabled and the missing file is named on the bench.",
    note: "2 pending",
  },
];

export default function CraftPage() {
  return (
    <>
      <EvidenceHeader
        index="CRAFT"
        label={`${CRAFT_STATS.stations} stations`}
        kicker="Workshop"
        title={
          <>
            The workshop, <span className="inst-serif">not the showroom.</span>
          </>
        }
        lede="This site is the argument. These eleven benches are the working method behind it: what runs, what it costs, and what we have not built yet."
        meta={[
          { label: "Stations", value: String(CRAFT_STATS.stations).padStart(2, "0") },
          { label: "Runnable", value: String(CRAFT_STATS.live).padStart(2, "0") },
          { label: "Asset pending", value: String(CRAFT_STATS.pending).padStart(2, "0") },
          { label: "Client data", value: "00" },
        ]}
        status="Open workshop"
        actions={
          <>
            <Link href="/work" className="inst-btn">
              See client proof
            </Link>
            <Link href="/pricing" className="inst-btn inst-btn-ghost">
              Read the scope matrix
            </Link>
          </>
        }
        note={["Craft proof, not client proof", "Runtimes load on activation", "No autoplay"]}
      />

      <section className="inst-section craft-intro" aria-labelledby="craft-read">
        <div className="inst-shell">
          <div className="ev-section-head">
            <div>
              <p className="inst-label">How to read a bench</p>
              <h2 id="craft-read" className="inst-h2 mt-4">
                A poster, a reason, <span className="inst-serif">a run control.</span>
              </h2>
            </div>
            <p>
              The poster is the fallback and the default. Running a station is a deliberate act, and
              every runtime is unmounted when you reset it. None of this is client work — the
              verified case study lives on the proof page.
            </p>
          </div>

          <div className="craft-keys">
            {READ_KEYS.map((key) => (
              <article key={key.index} className="craft-key">
                <span className="inst-num">{key.index}</span>
                <div>
                  <h3>{key.title}</h3>
                  <p>{key.copy}</p>
                </div>
                <span className="craft-key-note">{key.note}</span>
              </article>
            ))}
          </div>

          <div className="craft-legend" aria-label="Station states">
            <span className="craft-legend-item">
              <span className="craft-station-badge" data-state="live">
                Live
              </span>
              Runtime available on this device.
            </span>
            <span className="craft-legend-item">
              <span className="craft-station-badge" data-state="pending">
                Asset pending
              </span>
              Poster and explanation only; the control is disabled.
            </span>
          </div>
        </div>
      </section>

      <section className="inst-section craft-bench-section" aria-labelledby="craft-bench">
        <div className="inst-shell">
          <div className="craft-bench-head">
            <p className="inst-label">The bench</p>
            <h2 id="craft-bench" className="inst-h2">
              Eleven stations, <span className="inst-serif">one standard.</span>
            </h2>
            <p className="craft-bench-lede">
              Each station names its runtime, its payload and its fallback before you press
              anything. Stations are isolated: one failure cannot take the bench down.
            </p>
          </div>

          <CraftLab />
        </div>
      </section>

      <section className="inst-section" aria-labelledby="craft-next">
        <div className="inst-shell">
          <div className="ev-cta">
            <div>
              <p className="inst-label">What this page is not</p>
              <h2 id="craft-next" className="inst-h2 mt-4">
                Craft proof is not <span className="inst-serif">client proof.</span>
              </h2>
              <p className="mt-5">
                Demonstrating a runtime says nothing about business outcomes. The only client case
                study on this site is PRV Financial Services, live since April 2025, and it is
                documented with dates and scope on the proof page.
              </p>
              <div className="ev-actions">
                <Link href="/work" className="inst-btn">
                  Read the case file
                </Link>
                <Link href="/about" className="inst-btn inst-btn-ghost">
                  About the studio
                </Link>
                <Link href="/contact" className="inst-btn inst-btn-ghost">
                  Talk to us
                </Link>
              </div>
            </div>

            <ul className="ev-nda-list">
              <li>Nine runnable stations on this route</li>
              <li>Two labelled asset gaps, no fake demos</li>
              <li>Runtimes unmounted on reset</li>
              <li>Reduced motion respected by every station</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
