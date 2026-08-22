"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section data-chapter="hero" className="field relative overflow-hidden" data-field="paper">
      <div className="container relative pt-[var(--field-y)]">
        <p className="micro reveal">
          ImaginarsClub Services — Mumbai
        </p>

        <h1 className="mega mt-10" data-lines aria-label="Imagination, engineered.">
          <span className="line-mask" aria-hidden="true">
            <span style={{ "--i": 0 } as React.CSSProperties}>Imagination,</span>
          </span>
          <span className="line-mask" aria-hidden="true">
            <span style={{ "--i": 1 } as React.CSSProperties}>engineered.</span>
          </span>
        </h1>

        <p className="lede muted mt-10 reveal" style={{ "--i": 2 } as React.CSSProperties}>
          Websites, mobile apps and AI products built by a senior-led studio in
          Mumbai — grown with search, ads and content that performs.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 reveal" style={{ "--i": 3 } as React.CSSProperties}>
          <Link href="/contact" className="btn btn-primary">
            Start a project
          </Link>
          <Link href="/work" className="btn btn-secondary">
            See the work
          </Link>
        </div>
      </div>

      <div className="type-graphic-wrap" aria-hidden="true">
        <span className="type-graphic">IMAGINARS</span>
      </div>
    </section>
  );
}

